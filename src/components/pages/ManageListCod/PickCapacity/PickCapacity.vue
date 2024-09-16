<template>
  <div class="delivery-setting">
    <b-card>
      <template #header>
        <h4 class="mb-0">Năng lực COD lấy</h4>
      </template>
      <b-row>
        <b-col xl="8">
          <pick-capacity-form
            :user-id="userId"
            :master="capacity.master"
            :loading="capacity.loading"
            :allow-over-target="capacity.allowOverTarget"
            :configs="capacity.configs"
            :settings="capacity.settings"
            :validation-message="capacity.validationMessage"
            :error-message="capacity.errorMessage"
          />
        </b-col>
        <b-col xl="4">
          <operation-time-settings
            :configs="operationTime.configs"
            :master="operationTime.master"
            :settings="operationTime.settings"
            :loading="operationTime.loading"
            :validation-message="operationTime.validationMessage"
            :error-message="operationTime.errorMessage"
            :allow-explosion="operationTime.allowExplosion"

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
import PickCapacityForm from '../PickCapacity/PickCapacityForm'
import OperationTimeSettings from '../PickCapacity/OperationTimeSettings'
import manageListCodService from '../../../../domain/services/manage-list-cod-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import * as _ from 'lodash'
import CacheEngine from '../../../../infrastructures/cache-engine'
export default {
  name: 'PickCapacity',
  components: {PickCapacityForm, OperationTimeSettings},
  props: {
    userId: {
      type: Number,
      required: true
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
        master: {},
        configs: [],
        cachePrefix: 'init:capacity'
      },
      operationTime: {
        configs: {},
        master: {
          'time_with_package': {
            title: 'Thao tác từng đơn',
            unit: 'phút'
          },
          'time_in_point': {
            title: 'Thời gian tối đa tại điểm',
            unit: 'phút'
          }
        },
        settings: {
          allowConfig: false
        },
        allowExplosion: {
          title: 'Nổ điểm cho PK',
          checked: true
        },
        loading: false,
        errorMessage: '',
        validationMessage: '',
        cachePrefix: 'init:operation_time'
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
    formatOperationTimeConfigs (data) {
      Object.keys(this.operationTime.master).forEach(key => {
        if (!data[key]) {
          data[key] = ''
        } else {
          data[key] = isNaN(data[key]) ? null : Number(data[key])
        }
      })
      return data
    },
    getCurrentOperationTime () {
      return JSON.stringify(this.operationTime.configs) + JSON.stringify(this.operationTime.allowExplosion)
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
        this.operationTime.loading = true
        this.saveLoading = true
        const data = await manageListCodService.getCodPickCapacities(this.userId)
        this.capacity.master = data['master']
        this.capacity.configs = this.formatCapacityConfigs(data['capacity_config'])
        // fake giá trị hiển thị
        this.capacity.settings.currentTotalWorkShift = this.capacity.configs.length
        this.capacity.settings.currentCapacityConfig = data['current_seniority']
        this.capacity.allowOverTarget.checked = data['allow_over_target']
        while (this.capacity.configs.length < this.capacity.settings.defaultWorkShiftAmount) {
          this.addNewConfigRow()
        }
        const currentCapacity = this.getCurrentCapacity()
        const cache = new CacheEngine('session')
        cache.set(this.capacity.cachePrefix, currentCapacity, 300)

        // get operation Time Config
        data['time_config'] = !_.isEmpty(data['time_config']) ? data['time_config'] : {}
        this.operationTime.configs = this.formatOperationTimeConfigs(data['time_config'])
        this.operationTime.allowExplosion.checked = data['time_config']['allow_explosion'] !== undefined ? data['time_config']['allow_explosion'] : false
        this.operationTime.settings.allowConfig = data['allow_config_explosion']

        const currentOperationTime = this.getCurrentOperationTime()
        cache.set(this.operationTime.cachePrefix, currentOperationTime, 300)
      } catch (reason) {
        this.capacity.errorMessage = reason.toString()
      } finally {
        this.capacity.loading = false
        this.operationTime.loading = false
        this.saveLoading = false
      }
    },
    async onSubmit () {
      let capacityChange = false
      let operationTimeChange = false
      const dataSend = {}
      const cache = new CacheEngine('session')

      this.capacity.validationMessage = ''
      this.operationTime.validationMessage = ''

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
        dataSend['allow_over_target'] = this.capacity.allowOverTarget.checked
        dataSend['is_save_capacity'] = true
      }

      // nếu có sự thay đổi operation time
      if (cache.get(this.operationTime.cachePrefix) !== this.getCurrentOperationTime()) {
        operationTimeChange = true

        // Validate operation time nếu có thay đổi
        Object.keys(this.operationTime.master).forEach(key => {
          if (this.operationTime.configs[key] <= 0 || !Number.isInteger(this.operationTime.configs[key])) {
            this.operationTime.validationMessage = 'Trường số lượng phải là một số tự nhiên lớn hơn 0.'
          }
        })

        dataSend['time_config'] = {...this.operationTime.configs}
        if (!this.operationTime.settings.allowConfig) {
          delete dataSend['time_config']['allow_explosion']
        } else {
          dataSend['time_config']['allow_explosion'] = this.operationTime.allowExplosion.checked
        }
        dataSend['is_save_pk_config'] = true
      }

      if (!capacityChange && !operationTimeChange) {
        commonHelper.showMessage('Không có dữ liệu nào thay đổi', 'warning')
        return
      }

      if (_.isEmpty(this.capacity.validationMessage) && _.isEmpty(this.operationTime.validationMessage)) {
        try {
          this.saveLoading = true
          const response = await manageListCodService.saveCodPickCapacities(this.userId, dataSend)
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
  }
}
</script>

<style scoped>

</style>
