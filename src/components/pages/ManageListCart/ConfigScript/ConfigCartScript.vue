<template>
  <div>
    <div class="d-flex justify-content-between my-2">
      <h5>Kịch bản Giao hàng, check khách</h5>
      <div v-if="dataLoading"><i class="fa fa-spin fa-spinner"/></div>
      <b-button variant="success" size="sm" @click.prevent="addScript()">
        <i class="fa fa-plus" aria-hidden="true"/>
        Thêm phiên
      </b-button>
    </div>

    <div class="overflow-x-scroll table-responsive" style="max-height: 1000px">
      <table class="table w-xl-100 table-bordered" style="min-width: 800px">
        <tr class="text-center">
          <th style="width: 10%">Phiên</th>
          <th style="width: 42%">Giao hàng</th>
          <th style="width: 22%">CS check</th>
          <th style="width: 22%">Điều phối check</th>
          <th style="width: 4%"></th>
        </tr>
        <tr v-for="(script, index) in DeliveryCartScript" :key="index">
          <td>
            <script-session-for-cart :script="script" :session-index="index"/>
          </td>
          <td>
            <script-detail-item
              :script-categories="script.categories[0].tasks"
              :task-options="MasterOptions.masterTaskOptions[1]"
              :tag-options="MasterOptions.masterTagOptions[1]"
              :action-options="MasterOptions.masterActionOptions[1]"
              @showOptionPopup="doShowPopupConfigPackage($event, index)"
            />
          </td>

          <td></td>
          <td></td>
          <td>
            <b-button class="btn btn-light mt-2" size="sm" block @click.prevent="saveScript(index)">Lưu</b-button>
            <b-button class="btn btn-light mt-2" size="sm" block @click.prevent="deleteScript(index)">Xóa</b-button>
          </td>
        </tr>
      </table>
    </div>
    <popup-coming-package-options
      v-if="isShowPopupConfigPackage"
      @closed="onHidePopupConfigPackage"
      :provinceOptions="provinceOptions"
      :taskElementOrder="taskElementOrderToShowOnPopup"
      :sessionElementOrder="sessionElementOrderToShowOnPopup"
      :coming-package-options="dataToShowOnPopup"
    />
  </div>
</template>

<script>
import ScriptSessionForCart from './ScriptSessionForCart.vue'
import ScriptDetailItem from './ScriptDetailItem.vue'
import PopupComingPackageOptions from './PopupComingPackageOptions.vue'
import ManageLineService from 'domain/services/manage-line-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'
import * as _ from 'lodash'

export default {
  name: 'ConfigCartScript.vue',
  components: {
    ScriptDetailItem,
    ScriptSessionForCart,
    ManageLineService,
    PopupComingPackageOptions
  },
  props: {
    provinceOptions: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getCartSessionScript()
  },
  data () {
    return {
      message: '',
      dataLoading: false,
      DeliveryCartScript: [],
      MasterOptions: DeliveryScript.getMasterOptions(),
      MasterComingPackagePropsList: DeliveryScript.checkComingPackagePropsCheckboxList,
      WorkShiftOptions: DeliveryScript.workShiftOptions,
      DayOfWeekOptions: DeliveryScript.dayOfWeekOptions,
      isShowPopupConfigPackage: false,
      dataToShowOnPopup: {},
      taskElementOrderToShowOnPopup: null,
      sessionElementOrderToShowOnPopup: null
    }
  },
  methods: {
    /**
     * Lấy cấu hình kịch bản
     * @returns {Promise<void>}
     */
    async getCartSessionScript () {
      try {
        this.dataLoading = true
        const data = await ManageLineService.getCartSessionScript({cart_id: this.$route.params.id})
        this.DeliveryCartScript = this.formatDeliveryCartScript(data)
        this.dataLoading = false
      } catch (reason) {
        commonHelper.showMessage(reason, 'error')
        this.message = reason.toString()
      } finally {
        this.dataLoading = false
      }
    },
    /**
     *
     * @param data
     * @returns {Promise<*>}
     */
    formatDeliveryCartScript (data) {
      return data.map((dataItem) => {
        return {
          id: dataItem.id,
          work_shift: this.WorkShiftOptions.filter(
            (item) => item.value === dataItem.work_shift
          ).shift() || {},
          days_of_week: dataItem.day_of_weeks.map((item) => {
            for (let dayOfWeek of this.DayOfWeekOptions) {
              if (dayOfWeek.value === Number(item)) {
                return dayOfWeek
              }
            }
          }),
          categories: dataItem.categories.map((category) => ({
            category_id: category.category_id,
            tasks: category.tasks.map((item) => ({
              task: (this.MasterOptions.masterTaskOptions[category.category_id] || []).find((masterTaskOption) => (masterTaskOption.id === item.task_id)),
              actions: item.actions.map(actionId => (((this.MasterOptions.masterActionOptions[category.category_id] || {})[item.task_id] || []).find(masterActionOption => masterActionOption.id === actionId))).filter(x => !!x),
              types: (() => {
                if (category.category_id === DeliveryScript.categoryDeliver && item.task_id === DeliveryScript.checkComingPackageTask) {
                  return this.formatCheckComingPackagePropsData(item)
                }
                return {}
              })()
            }))
          }))
        }
      })
    },
    formatCheckComingPackagePropsData (item) {
      for (let t of this.MasterComingPackagePropsList) {
        if (!_.isEmpty(item.types[t.id])) {
          const masterData = this.MasterComingPackagePropsList.find(masterTag => masterTag.id === t.id) || {options: []}
          item.types[t.id] = item.types[t.id]
            .map(tId => masterData.options.find(masterTagOption => masterTagOption.id === tId))
            .filter(x => !!x)
        }
      }
      for (let t of DeliveryScript.checkComingPackagePropsSelectList) {
        if (item.types[t.id] === undefined) {
          item.types[t.id] = []
        }
        if (t.id === DeliveryScript.averageOfDeliveryTimeProps.id) {
          item.types[t.id] = item.types[t.id]
            .map(tId => DeliveryScript.averageOfDeliveryTimeProps.options.find(masterTagOption => masterTagOption.id === tId))
            .filter(x => !!x)
        }
        if (t.id === DeliveryScript.pickProvinceProps.id) {
          item.types[t.id] = item.types[t.id]
            .map(tId => this.provinceOptions.find(masterTagOption => masterTagOption.id === tId))
            .filter(x => !!x)
        }
        if (t.id === DeliveryScript.shopProps.id) {
          item.types[t.id] = item.types[t.id]
            .map(shopItem => {
              shopItem.name = `${shopItem.code} - ${shopItem.name}`
              return shopItem
            })
            .filter(x => !!x)
        }
      }
      return item.types
    },
    /**
     * Show modal confirm xóa điểm dừng
     */
    async deleteScript (index) {
      this.$bvModal.msgBoxConfirm('Xác nhận xóa phiên kịch bản', {
        title: 'Xác nhận xóa phiên kịch bản',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Xác nhận',
        cancelTitle: 'Không',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(async value => {
          if (value) {
            const configScript = this.DeliveryCartScript.at(index)
            if (Number.isInteger(Number(configScript.id))) {
              await this.deleteScriptBySessionId(configScript.id)
            }
            this.DeliveryCartScript.splice(index, 1)
            commonHelper.showMessage('Xóa cấu hình thành công', 'success')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     *
     * @param sessionId
     * @returns {Promise<void>}
     */
    async deleteScriptBySessionId (sessionId) {
      try {
        this.dataLoading = true
        const data = {
          cart_script_id: sessionId
        }
        await ManageLineService.deleteCartSessionScript(data)
        this.dataLoading = false
      } catch (reason) {
        this.message = reason.toString()
        commonHelper.showMessage(reason, 'error')
      } finally {
        this.dataLoading = false
      }
    },

    /**
     * Thêm phiên kịch bản
     */
    addScript () {
      const newId = this.DeliveryCartScript.length + 1
      this.DeliveryCartScript.push({
        id: 'new_session_' + newId,
        work_shift: {},
        days_of_week: [],
        categories: [
          {
            category_id: 1,
            tasks: [
              {
                task: {
                  value: null,
                  text: null
                },
                types: {},
                actions: []
              }
            ]
          }
        ]
      })
    },

    /**
     * Validate giá trị cấu hình capacity của Cod theo phiên
     */
    validateSubmit (configScript) {
      const workShifts = this.WorkShiftOptions.map(item => item.value)

      if (!workShifts.includes(configScript.work_shift)) {
        throw new Error('Vui lòng chọn ca của phiên.')
      }

      if (_.isEmpty(configScript.days)) {
        throw new Error('Vui lòng chọn ngày của phiên.')
      }

      if (_.isEmpty(configScript.categories)) {
        throw new Error('Vui lòng cấu hình kịch bản.')
      }

      configScript.categories.forEach(category => {
        this.validateScript(category.tasks)
      })
    },

    /**
     * Validate kịch bản giỏ
     */
    validateScript (scripts) {
      if (_.isEmpty(scripts)) {
        throw new Error('Vui lòng cấu hình kịch bản.')
      }
      scripts.forEach((item) => {
        if (item.tasks < 1) {
          throw new Error('Vui lòng cấu hình loại kịch bản.')
        }

        if (_.isEmpty(item.types)) {
          throw new Error('Vui lòng cấu hình chi tiết kịch bản.')
        }
      })
    },

    /**
     * set data để lưu cấu hình
     * @param index
     */
    setConfigData (index) {
      const configScript = this.DeliveryCartScript.at(index)
      const workShift = configScript.work_shift || {}
      const daysOfWeek = configScript.days_of_week || []
      return {
        cart_id: this.$route.params.id,
        id: Number(configScript.id),
        work_shift: workShift.value || 0,
        days: !_.isEmpty(daysOfWeek) ? daysOfWeek.map(item => Number(item.value)) : [],
        categories: configScript.categories.map((category) => (
          {
            category_id: category.category_id,
            tasks: category.tasks.map((item) => {
              return {
                task_id: item.task.id,
                actions: item.actions.map(action => action.id),
                types: (() => {
                  const tmpTypes = {}
                  for (let t of Object.keys(item.types)) {
                    if (_.isEmpty(item.types[t])) {
                      continue
                    }
                    if (t === DeliveryScript.shopProps.id) {
                      tmpTypes[t] = item.types[t].map(s => s.code).filter(s => !!s)
                      continue
                    }
                    tmpTypes[t] = item.types[t].map(t => t.id).filter(t => !!t)
                  }
                  return tmpTypes
                })()
              }
            })
          }
        ))
      }
    },

    /**
     * Lưu cấu hình kịch bản
     */
    async saveScript (index) {
      this.dataLoading = true
      try {
        const data = this.setConfigData(index)
        this.validateSubmit(data)
        await ManageLineService.saveCartSessionScript(data)
        commonHelper.showMessage('Lưu cấu hình thành công', 'success')
        this.$nextTick(() => this.getCartSessionScript())
        this.dataLoading = false
      } catch (reason) {
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString(), 'error')
      } finally {
        this.dataLoading = false
      }
    },
    onHidePopupConfigPackage () {
      this.isShowPopupConfigPackage = false
    },
    doShowPopupConfigPackage (taskElementOrder, sessionElementOrder) {
      this.taskElementOrderToShowOnPopup = taskElementOrder
      this.sessionElementOrderToShowOnPopup = sessionElementOrder
      this.dataToShowOnPopup = this.DeliveryCartScript[sessionElementOrder].categories[0].tasks[taskElementOrder].types
      this.isShowPopupConfigPackage = true
    }
  }
}
</script>

<style scoped>
</style>
