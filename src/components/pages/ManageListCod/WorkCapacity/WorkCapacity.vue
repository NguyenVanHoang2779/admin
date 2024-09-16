<template>
  <div class="delivery-setting">
    <b-card>
      <template #header>
        <h4 class="mb-0">Năng lực COD giao</h4>
      </template>
      <b-row>
        <b-col xl="8">
          <work-capacity-form
            :user-id="userId"
            :master="capacity.master"
            :loading="capacity.loading"
            :allow-over-target="capacity.allowOverTarget"
            :configs="capacity.configs"
            :settings="capacity.settings"
            :validation-message="capacity.validationMessage"
            :error-message="capacity.errorMessage"
            :is-cod-bad-debt="isCodBadDebt"
          />
        </b-col>
      </b-row>
      <div class="d-flex justify-content-end align-items-center">
        <b-button class="input-size" type="button" variant="success" :disabled="saveLoading"
                  @click="onSubmit">
          <i v-if="!saveLoading" class="fa fa-save"/>
          <i v-else class="fa fa-spin fa-spinner"/>
          Lưu
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import WorkCapacityForm from './WorkCapacityForm'
import manageListCodService from '../../../../domain/services/manage-list-cod-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import * as _ from 'lodash'
import CacheEngine from '../../../../infrastructures/cache-engine'
export default {
  name: 'WorkCapacity',
  components: {WorkCapacityForm},
  props: {
    userId: {
      type: Number,
      required: true
    },
    isCodBadDebt: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      capacity: {
        settings: {
          currentTotalWorkShift: 0,
          currentCapacityConfig: 1,
          defaultWorkShiftAmount: 3,
          workShiftIdLog: '',
          capacityConfigsMaxLength: 10 // Không thể nhấn nút thêm khi config ca vượt 10
        },
        loading: true,
        errorMessage: '',
        validationMessage: '',
        allowOverTarget: {
          title: 'Cho phép COD vượt ngưỡng chỉ tiêu',
          checked: true
        },
        tmpAllowOverTarget: {
          title: 'Cho phép COD vượt ngưỡng chỉ tiêu',
          checked: true
        },
        master: {},
        configs: [],
        cachePrefix: 'init:capacity'
      },
      saveLoading: true
    }
  },
  created () {
    this.getConfigs()
  },
  methods: {
    /** Format data cho config: tạo phần tử rỗng nếu chưa đc cấu hình từ server */
    formatCapacityConfigs (datas) {
      return datas.map((data) => {
        Object.keys(this.capacity.master).forEach(key => {
          if (!data[key]) {
            data[key] = ''
          }
        })
        return data
      })
    },
    getCurrentCapacity () {
      return JSON.stringify(this.capacity.configs) + JSON.stringify(this.capacity.allowOverTarget)
    },
    async getConfigs () {
      if (!this.userId) {
        this.capacity.errorMessage = 'UserId không hợp lệ.'
        return
      }

      try {
        // get capacity config
        this.capacity.errorMessage = ''
        this.capacity.loading = true
        this.saveLoading = true
        const data = await manageListCodService.getCodCapacities(this.userId)
        this.capacity.master = data['master']
        this.capacity.configs = this.formatCapacityConfigs(data['capacity_config'])
        this.capacity.settings.currentTotalWorkShift = this.capacity.configs.length
        this.capacity.settings.currentCapacityConfig = data['current_config']
        this.capacity.allowOverTarget.checked = data['allow_overtarget']
        this.capacity.tmpAllowOverTarget.checked = data['allow_overtarget']
        if (this.isCodBadDebt) {
          this.capacity.allowOverTarget.checked = false
        }
        while (this.capacity.configs.length < this.capacity.settings.defaultWorkShiftAmount) {
          this.addNewConfigRow()
        }
        const currentCapacity = this.getCurrentCapacity()
        const cache = new CacheEngine('session')
        cache.set(this.capacity.cachePrefix, currentCapacity, 300)

        // get operation Time Config
        data['time_config'] = !_.isEmpty(data['time_config']) ? data['time_config'] : {}
      } catch (reason) {
        this.capacity.errorMessage = reason.toString()
      } finally {
        this.capacity.loading = false
        this.saveLoading = false
      }
    },
    async onSubmit () {
      let capacityChange = false
      const dataSend = {}
      const cache = new CacheEngine('session')

      this.capacity.validationMessage = ''

      // nếu có sự thay đổi capacity
      if (cache.get(this.capacity.cachePrefix) !== this.getCurrentCapacity()) {
        capacityChange = true

        // validate capacity nếu có thay đổi
        this.capacity.configs.forEach((config) => {
          Object.values(config).forEach(value => {
            if (value <= 0 || !Number.isInteger(value)) {
              this.capacity.validationMessage = 'Trường số lượng phải là một số tự nhiên lớn hơn 0.'
            }
          })
        })

        dataSend['capacity_config'] = [...this.capacity.configs]
        dataSend['allow_overtarget'] = this.capacity.allowOverTarget.checked
        dataSend['is_save_capacity'] = true
      }

      if (!capacityChange) {
        commonHelper.showMessage('Không có dữ liệu nào thay đổi', 'warning')
        return
      }

      if (_.isEmpty(this.capacity.validationMessage)) {
        try {
          this.saveLoading = true
          const response = await manageListCodService.saveCodCapacities(this.userId, dataSend)
          commonHelper.showMessage(response, 'success')
          await this.getConfigs()
        } catch (reason) {
          commonHelper.showMessage('Có lỗi xảy ra: ' + reason, 'warning')
        } finally {
          this.saveLoading = false
        }
      }
    },
    addNewConfigRow () {
      const newRow = {}
      Object.keys(this.capacity.master).forEach(key => {
        newRow[key] = ''
      })
      this.capacity.configs.push(newRow)
    }
  },
  watch: {
    isCodBadDebt: function (newVal, oldVal) {
      if (newVal === true) {
        this.capacity.allowOverTarget.checked = false
      } else {
        this.getConfigs()
        this.capacity.allowOverTarget.checked = this.capacity.tmpAllowOverTarget.checked
      }
    }
  }
}
</script>

<style scoped>

</style>
