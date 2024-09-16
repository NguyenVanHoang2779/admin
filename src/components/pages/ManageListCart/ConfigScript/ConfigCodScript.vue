<template>
  <div>
    <div class="d-flex justify-content-between my-2">
      <h5>Cấu hình năng suất CoD theo phiên</h5>
      <div v-if="dataLoading"><i class="fa fa-spin fa-spinner"/></div>
      <b-button variant="success" size="sm" @click.prevent="addScript()">
        <i class="fa fa-plus" aria-hidden="true"/>
        Thêm phiên
      </b-button>
    </div>

    <div class="overflow-x-scroll table-responsive" style="max-height: 1000px">
      <table class="table w-xl-100 table-bordered" style="min-width: 800px">
        <tr class="text-center">
          <th style="width: 16%">Phiên</th>
          <th style="width: 70%">Năng suất CoD</th>
          <th style="width: 14%">Thao tác</th>
        </tr>
        <tr v-for="(scriptData, index) in DeliveryCodScript" :key="index">
          <td>
            <script-session
              :session-script="scriptData.cod_screenplay_sessions"
              :session-index="index"
              @changeWorkShift="changeWorkShift"
            />
          </td>

          <td>
            <b-form-row class="mt-2 config-cod-support-row">
              <b-col sm="9">
                <multiselect
                  class="multiselect"
                  v-model="scriptData.cod"
                  label="fullname"
                  track-by="id"
                  placeholder="Chọn CoD"
                  :options="CodOptions"
                  :multiple="false"
                  deselect-label="✗"
                  selected-label="✓"
                  select-label="✓"
                  @input="changeCod($event, index)"
                />
              </b-col>

              <b-col sm="3">
                <multiselect
                  class="multiselect"
                  v-model="scriptData.capacity"
                  placeholder="Chọn Capacity"
                  :options="capacityOptions(index)"
                  :multiple="false"
                  :custom-label="customLabel"
                  deselect-label="✗"
                  selected-label="✓"
                  select-label="✓"
                />
              </b-col>
            </b-form-row>
            <b-form-row class="mt-2 config-cod-support-row">
              <b-col class="config-max-weight-title d-flex align-items-center">
                <span>Khối lượng tối đa</span>
              </b-col>

              <b-col class="config-max-weight-select">
                <multiselect
                  class="multiselect"
                  v-model="scriptData.weight"
                  placeholder="Chọn khối lượng tối đa"
                  :options="maxWeightOptions()"
                  :multiple="false"
                  :custom-label="customLabelWeight"
                  :allow-empty="false"
                  deselect-label="Đang chọn"
                  selected-label="✓"
                  select-label="✓"
                />
              </b-col>
            </b-form-row>
            <hr>

            <p>Đơn đặc biệt</p>
              <capacity-detail-item
                :package-configs="scriptData.configs"
                :cod-capacity="scriptData.capacity"
                :max-weight="scriptData.weight"
              />
          </td>

          <td>
            <b-button
              class="btn btn-light mt-2"
              size="sm"
              block @click.prevent="saveCodCapacityScript(index)"
            >Lưu</b-button>

            <b-button
              class="btn btn-light mt-2"
              size="sm"
              block @click.prevent="deleteScript(index)"
            >Xóa</b-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import multiselect from 'vue-multiselect'
import ScriptSession from './ScriptSession.vue'
import ManageLineService from 'domain/services/manage-line-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'
import CapacityDetailItem from './CapacityDetailItem'

export default {
  name: 'ConfigCodScript.vue',
  components: {
    ScriptSession,
    ManageLineService,
    multiselect,
    CapacityDetailItem
  },
  props: {
    CodOptions: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getDeliveryCodScripts()
  },
  data () {
    return {
      message: '',
      dataLoading: false,
      CodScript: [],
      DeliveryCodScript: [],
      WorkShiftOptions: DeliveryScript.workShiftOptionOfCapacity,
      DayOfWeekOptions: DeliveryScript.dayOfWeekOptions,
      optionMaxWeight: 200,
      packageSpecialOptions: DeliveryScript.packageSpecialCapacity
    }
  },
  methods: {
    /**
     *
     * @param obj
     * @returns {string}
     */
    customLabel (obj) {
      return `Capacity ${obj}`
    },
    /**
     *
     * @param obj
     * @returns {string}
     */
    customLabelWeight (obj) {
      return `${obj} kg`
    },

    /**
     * Format dữ liệu cấu hình kịch bản
     * @param data
     */
    formatDeliveryCodScripts (data) {
      return data.map((dataItem) => {
        return {
          cod_screenplay_sessions: {
            id: dataItem.cod_screenplay_sessions.id,
            work_shift: this.WorkShiftOptions.filter(
              (item) => item.value === Number(dataItem.cod_screenplay_sessions.work_shift)
            ).shift() || {},
            start_time: dataItem.cod_screenplay_sessions.start_time,
            end_time: dataItem.cod_screenplay_sessions.end_time,
            day_of_weeks: dataItem.cod_screenplay_sessions.day_of_weeks.map((item) => {
              for (let dayOfWeek of this.DayOfWeekOptions) {
                if (dayOfWeek.value === Number(item)) {
                  return dayOfWeek
                }
              }
            })
          },
          cod: this.CodOptions.filter((item) => item.id === dataItem.cod_id).at(0) || {},
          capacity: dataItem.capacity,
          weight: dataItem.weight,
          configs: dataItem.configs.map((item) => {
            return {
              capacity: item.capacity,
              weight: item.weight,
              package_type: this.packageSpecialOptions.filter(
                (myItem) => myItem.value === Number(item.package_type)
              ).shift() || {}
            }
          }),
          max_capacity: 0
        }
      })
    },

    /**
     * Lấy cấu hình kịch bản
     * @returns {Promise<void>}
     */
    async getDeliveryCodScripts () {
      try {
        this.dataLoading = true
        const data = await ManageLineService.getCodCapacityScript({cod_id: this.codOfCarts})
        this.DeliveryCodScript = this.formatDeliveryCodScripts(data)
        await this.getMaxCapacityOfCods()
      } catch (reason) {
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString(), 'error')
        this.message = reason.toString()
      } finally {
        this.dataLoading = false
      }
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
            const configScript = this.DeliveryCodScript.at(index)
            if (Number.isInteger(Number(configScript.cod_screenplay_sessions.id))) {
              await this.deleteScriptBySessionId(configScript.cod_screenplay_sessions.id)
            }
            this.DeliveryCodScript.splice(index, 1)
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
          cod_script_id: sessionId
        }
        await ManageLineService.deleteCodCapacityScript(data)
        this.dataLoading = false
      } catch (reason) {
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString(), 'error')
      } finally {
        this.dataLoading = false
      }
    },

    /**
     * Xóa phiên kịch bản
     */
    addScript () {
      const newId = this.DeliveryCodScript.length + 1
      this.DeliveryCodScript.push({
        cod_screenplay_sessions: {
          id: 'new_session_' + newId,
          work_shift: {},
          start_time: '',
          end_time: '',
          days_of_week: []
        },
        cod: {},
        capacity: 0,
        max_capacity: 0,
        weight: 0,
        configs: []
      })
    },

    /**
     * set data để lưu cấu hình
     * @param index
     */
    setCartCapacityScriptData (index) {
      const configScript = this.DeliveryCodScript.at(index)
      const workShift = configScript.cod_screenplay_sessions.work_shift || {}
      const days = configScript.cod_screenplay_sessions.day_of_weeks || []
      return {
        id: Number(configScript.cod_screenplay_sessions.id),
        work_shift: workShift.value || 0,
        start_time: this.removeSecondInTime(configScript.cod_screenplay_sessions.start_time || ''),
        end_time: this.removeSecondInTime(configScript.cod_screenplay_sessions.end_time || ''),
        days: !_.isEmpty(days) ? days.map(item => Number(item.value)) : [],
        cod_id: configScript.cod.id || '',
        capacity: configScript.capacity || 0,
        max_capacity: 0,
        weight: configScript.weight,
        configs: configScript.configs.map((item) => {
          return {
            capacity: item.capacity,
            weight: item.weight,
            package_type: item.package_type === undefined ? 0 : item.package_type.value
          }
        })
      }
    },

    /**
     * validate giá trị khung time
     * @param newStartTime
     * @param newEndTime
     * @param newSessionId
     * @param newDays
     * @param newWorkShift
     * @param newCodId
     */
    validateFrameTime (newStartTime, newEndTime, newSessionId, newDays, newWorkShift, newCodId) {
      for (let scripts of this.DeliveryCodScript) {
        if (
          !Number.isInteger(scripts.cod_screenplay_sessions.id) ||
          Number(newSessionId) === Number(scripts.cod_screenplay_sessions.id) ||
          newCodId !== scripts.cod.id
        ) {
          continue
        }

        const scriptSession = scripts.cod_screenplay_sessions
        const dayOfWeeks = scriptSession.day_of_weeks.map((day) => Number(day.value)) || []
        const workShift = scriptSession.work_shift.value || 0
        const startTime = this.removeSecondInTime(scriptSession.start_time || '')
        const endTime = this.removeSecondInTime(scriptSession.end_time || '')

        if (Number(workShift) !== Number(newWorkShift)) {
          continue
        }

        const duplicateDays = newDays.filter((day) => dayOfWeeks.includes(day)) || []
        if (_.isEmpty(duplicateDays)) {
          continue
        }

        if (!(newEndTime <= startTime || newStartTime >= endTime)) {
          throw new Error('Khung giờ không thỏa mãn. Vui lòng chọn lại khung giờ.')
        }
      }
    },

    /**
     * Validate giá trị cấu hình capacity của Cod theo phiên
     */
    validateSubmit (configScript) {
      const workShifts = this.WorkShiftOptions.map(item => item.value)

      if (!workShifts.includes(configScript.work_shift)) {
        throw new Error('Vui lòng chọn ca của phiên.')
      }

      if (_.isEmpty(configScript.cod_id)) {
        throw new Error('Vui lòng chọn CoD của phiên.')
      }

      if (_.isEmpty(configScript.days)) {
        throw new Error('Vui lòng chọn ngày của phiên.')
      }

      const configs = configScript.configs
      configs.forEach(function (item) {
        if (item.package_type === 0) {
          throw new Error('Loại đơn đặc biệt không thể để trống.')
        }
      })

      this.validateInputTime(configScript.start_time, configScript.end_time, configScript.work_shift)

      this.validateFrameTime(
        configScript.start_time,
        configScript.end_time,
        configScript.id,
        configScript.days,
        configScript.work_shift,
        configScript.cod_id
      )
    },

    /**
     * Validqte thời gian bắt đầu phiên và kết thúc phiên
     * @param startTime
     * @param endTime
     * @param workShift
     */
    validateInputTime (startTime, endTime, workShift) {
      const frameTime = this.WorkShiftOptions.filter((item) => item.value === workShift).shift().frame_time

      if (!startTime || startTime < frameTime.start_time || startTime > frameTime.end_time) {
        throw new Error('Thời gian bắt đầu phiên không hợp lệ.')
      }

      if (!endTime || endTime < frameTime.start_time || endTime > frameTime.end_time) {
        throw new Error('Thời gian kết thúc phiên không hợp lệ.')
      }

      if (startTime >= endTime) {
        throw new Error('Thời gian kết thúc cần lớn hơn thời gian bắt đầu.')
      }
    },

    /**
     * Lưu cấu hình kịch bản
     */
    async saveCodCapacityScript (index) {
      this.dataLoading = true

      try {
        const data = this.setCartCapacityScriptData(index)
        this.validateSubmit(data)
        await ManageLineService.saveCodCapacityScript(data)
        commonHelper.showMessage('Lưu cấu hình thành công', 'success')
        this.$nextTick(() => this.getDeliveryCodScripts())
        this.dataLoading = false
      } catch (reason) {
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString(), 'error')
      } finally {
        this.dataLoading = false
      }
    },

    /**
     *
     * @param index
     * @returns {number}
     */
    getWorkShift (index) {
      const codScriptSession = this.DeliveryCodScript[index].cod_screenplay_sessions || {}
      const workShift = codScriptSession.work_shift || {}

      return workShift.value || 0
    },

    /**
     *
     * @param option
     * @param index
     */
    async changeCod (option, index) {
      if (!_.isEmpty(option)) {
        this.DeliveryCodScript[index].cod.id = option.id
        this.DeliveryCodScript[index].cod.fullname = option.fullname
        this.DeliveryCodScript[index].capacity = 0
        this.DeliveryCodScript[index].max_capacity = await this.getCodCapacityByCodId(
          this.DeliveryCodScript[index].cod.id,
          this.getWorkShift(index)
        )
      } else {
        this.DeliveryCodScript[index].cod = {}
        this.DeliveryCodScript[index].capacity = 0
        this.DeliveryCodScript[index].max_capacity = 0
      }
    },

    /**
     * Đổi format từ H:i:s -> H:i (loại bỏ giây)
     */
    removeSecondInTime (time) {
      if (!time) {
        return ''
      }
      const timeParts = time.split(':')
      return [timeParts[0] || '', timeParts[1] || ''].join(':')
    },

    /**
     * Lấy capacity của cod
     * @returns {unknown[]|*[]}
     */
    capacityOptions (index) {
      if (this.DeliveryCodScript[index].max_capacity === 0) {
        return []
      }

      return Array.from({length: this.DeliveryCodScript[index].max_capacity}, (_, i) => i + 1)
    },

    /**
     * Lấy cân nặng tối đa có thể chọn
     * @returns {unknown[]|*[]}
     */
    maxWeightOptions () {
      return Array.from({length: this.optionMaxWeight + 1}, (_, i) => i)
    },

    /**
     * Cập nhật capacity khi change workshift
     * @param index
     * @returns {Promise<void>}
     */
    async changeWorkShift (index) {
      this.DeliveryCodScript[index].max_capacity = await this.getCodCapacityByCodId(
        this.DeliveryCodScript[index].cod.id,
        this.getWorkShift(index)
      )
      this.DeliveryCodScript[index].capacity = 0
    },

    /**
     * Lấy capacity cấu hình của cod
     * @param codId
     * @param workShift
     * @returns {Promise<int>}
     */
    async getCodCapacityByCodId (codId, workShift) {
      if (!codId || !workShift) {
        return 0
      }

      let params = {
        cod_id: codId,
        work_shift: workShift
      }

      try {
        const maxCapacity = await ManageLineService.getCodCapacityByCodId(params)
        return maxCapacity > 0 ? maxCapacity - 1 : 0
      } catch (reason) {
        commonHelper.showMessage(reason, 'error')
      }
    },

    /**
     * Lấy max capacity của cod
     * @returns {Promise<void>}
     */
    async getMaxCapacityOfCods () {
      for (let index = 0; index < this.DeliveryCodScript.length; index++) {
        this.DeliveryCodScript[index].max_capacity = await this.getCodCapacityByCodId(
          this.DeliveryCodScript[index].cod.id,
          this.getWorkShift(index)
        )
      }
    }
  },

  computed: {
    /**
     * Lấy danh sách cod của giỏ
     * @returns {(string|*)[]}
     */
    codOfCarts () {
      return this.CodOptions.map((item) => item.id.toString())
    }
  }
}
</script>

<style scoped>
.config-max-weight-title {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 10%;
  flex: 0 0 10%;
  max-width: 10%;
}

.config-max-weight-select {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 90%;
  flex: 0 0 90%;
  max-width: 90%;
}
</style>
