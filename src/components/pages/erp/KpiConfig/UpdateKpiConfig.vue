<template>
  <b-row v-loading="loading">
      <b-col md="6" lg="4">
        <b-form-group label="Miền">
          <SelectRegion
            :auto-close="true"
            :hide-selected="true"
            :regions="config.regions"
            customClass=""
            @input="selectConfig(config, 'regions', ...arguments)"
          />
        </b-form-group>
      </b-col>
      <b-col md="6" lg="4">
        <b-form-group label="Tỉnh">
          <SelectProvince
            :auto-close="true"
            :hide-select="true"
            :limit="100"
            :province-ids="config.provinces"
            customClass=""
            @input="selectConfig(config, 'provinces', ...arguments)"
          />
        </b-form-group>
      </b-col>
      <b-col md="6" lg="4">
        <b-form-group label="Kho">
          <SelectStation
            :auto-close="true"
            :hide-selected="true"
            :station-ids="config.stations"
            :limit-prop="100"
            customClass=""
            @handleStationSelected="selectConfig(config, 'stations', ...arguments)"
          />
        </b-form-group>
      </b-col>
      <!-- <b-col md="6" lg="4">
        <b-form-group label="Bộ phận">
          <SelectDepartment
            :auto-closed="true"
            :hide-selected="true"
            :department-ids="config.departments"
            customClass=""
            @handleDepartmentSelected="selectConfig(config, 'departments', ...arguments)"
          />
        </b-form-group>
      </b-col> -->
      <b-col md="6" lg="4">
        <b-form-group label="Vị trí">
          <SelectPosition
            :auto-close="true"
            :hide-selected="true"
            :position-ids="config.positions"
            customClass=""
            @handlePositionSelected="selectConfig(config, 'positions', ...arguments)"
          />
        </b-form-group>
      </b-col>
      <b-col md="6" lg="4">
        <b-form-group>
          <span slot="label">Ngày lương chuẩn <span class="text-danger">(*)</span></span>
          <b-select
            :options="salaryDateOps"
            v-model="config.salary_date"
          ></b-select>
        </b-form-group>
      </b-col>
      <b-col md="12" class="text-center mt-3">
        <b-btn variant="success" @click="updateKpiConfig">{{ configId ? 'Cập nhật' : 'Thêm' }}</b-btn>
      </b-col>
  </b-row>
</template>

<style lang="css" scoped>

</style>

<script>

// custom component
import SelectDepartment from 'components/elements/common/MultiSelectDepartment'
import SelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectRegion from 'components/elements/common/MultiSelectRegion'
import SelectProvince from 'components/elements/common/MultiSelectProvince'
import SelectStation from 'components/elements/common/MultiSelectStation'

// service
import kpiConfigService from 'domain/services/kpi-config-service'

// entities
import Contract from 'domain/entities/Contract'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'update-kpi-config',

  components: {
    SelectDepartment,
    SelectPosition,
    SelectRegion,
    SelectProvince,
    SelectStation
  },

  props: {
    configId: {}
  },

  data: _ => ({
    loading: false,
    config: {
      id: null,
      department: null,
      positions: null,
      provinces: null,
      regions: null,
      stations: null,
      work_types: null,
      salary_date: null
    },
    salaryDateOps: Contract.salaryDateOps
  }),

  watch: {
    configId (newVal, oldVal) {
      if (newVal) this.getKpiConfig()
      else {
        for (const key in this.config) {
          this.config[key] = null
        }
      }
    }
  },

  methods: {
    getKpiConfig () {
      if (!this.configId) return
      this.loading = true
      kpiConfigService.getKpiConfig({ config_id: this.configId, just_raw: true })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.config = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Đã có lỗi xảy ra không lấy được config !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra không lấy được config !', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    updateKpiConfig () {
      if (!this.config.salary_date) {
        alert('Vui lòng chọn ngày lương chuẩn !')
        return
      }
      this.loading = true
      kpiConfigService.updateKpiConfig(this.config)
        .then(res => {
          if (res.data.success) {
            this.getKpiConfig()
            this.$emit('updateok', res.data.data)
            helper.showMessage(res.data.message || 'Cập nhật config Kpi thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Đã có lỗi xảy ra. Không cập nhật được config Kpi !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra. Không cập nhật được config Kpi !', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    selectConfig (ref, field, ops) {
      if (!ref) return
      ref[field] = ops ? ops.map(op => op.id).toString() : null
    }
  }
}
</script>
