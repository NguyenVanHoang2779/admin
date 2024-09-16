<template>
  <div class="small-scrollbar">
    <b-row>
      <b-col md=6>
        <h5 class="mb-1">CONFIG TÍNH KPI</h5>
        <span class="text-danger">Lưu ý: Hợp đồng học việc (TTS) không tính KPI</span>
      </b-col>
      <b-col md=6 class="text-right">
        <b-btn variant="outline-success" @click="updateConfig()" v-if="edit"><i class="fas fa-plus"></i> Thêm config</b-btn>
      </b-col>
    </b-row>

    <b-row class="my-2">
      <b-col md="4" sm="6" lg="3" class="mb-1">
        <SelectRegion
          :auto-close="true"
          :hide-selected="true"
          :regions="filter.regions"
          customClass=""
          @input="selectFilter(filter, 'regions', ...arguments)"
        />
      </b-col>
      <b-col md="4" sm="6" lg="3" class="mb-1">
        <SelectProvince
          :auto-close="true"
          :hide-select="true"
          :limit="100"
          :province-ids="filter.provinces"
          customClass=""
          @input="selectFilter(filter, 'provinces', ...arguments)"
        />
      </b-col>
      <b-col md="4" sm="6" lg="3" class="mb-1">
        <SelectStation
          :auto-close="true"
          :hide-selected="true"
          :station-ids="filter.stations"
          :limit-prop="100"
          customClass=""
          @handleStationSelected="selectFilter(filter, 'stations', ...arguments)"
        />
      </b-col>
      <b-col md="4" sm="6" lg="3" class="mb-1">
        <SelectDepartment
          :auto-closed="true"
          :hide-selected="true"
          :department-ids="filter.departments"
          customClass=""
          @handleDepartmentSelected="selectFilter(filter, 'departments', ...arguments)"
        />
      </b-col>
      <b-col md="4" sm="6" lg="3" class="mb-1">
        <SelectPosition
          :auto-close="true"
          :hide-selected="true"
          :position-ids="filter.positions"
          customClass=""
          @handlePositionSelected="selectFilter(filter, 'positions', ...arguments)"
        />
      </b-col>
      <b-col md="4" sm="6" lg="3" class="mb-1">
        <b-select
          :options="salaryDateOps"
          v-model="filter.salary_date"
        ></b-select>
      </b-col>
      <b-col md="12" sm="6" lg="6" class="text-right">
        <b-btn variant="primary" @click="getKpiConfig()"><i class="fas fa-filter"></i> Tìm kiếm</b-btn>
        <b-btn variant="secondary" @click="resetFilter()"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col v-for="(value, area) in areaDesc" :key="area">
        <b-badge :variant="value.variant">&nbsp;&nbsp;</b-badge> {{ value.text }}
      </b-col>
    </b-row>
    <table class="table table-hover table-bordered table-sm">
      <thead class="bg-light">
        <tr>
          <th class="text-center w-5">STT</th>
          <th class="w-20">Khu vực áp dụng</th>
          <!-- <th class="text-center w-20">Bộ phận</th> -->
          <th class="">Vị trí</th>
          <th class="w-10">Ngày lương chuẩn</th>
          <th class="text-center w-5" v-if="edit"></th>
        </tr>
      </thead>
      <tbody class="position-relative" v-loading="loading">
        <tr v-for="(config, idx) in kpiConfig" :key="config.id">
          <td class="text-center">{{ 1+ idx + page.perPage * (filter.page -1) }}</td>
          <td>
            <div v-if="config.regions_name && config.regions_name.length" :class="'text-' + (areaDesc.regions && areaDesc.regions.variant || 'secondary')">
              {{ config.regions_name.join(', ') }}
            </div>
            <div v-if="config.provinces_name && config.provinces_name.length" :class="'text-' + (areaDesc.provinces && areaDesc.provinces.variant || 'secondary')">
              {{ config.provinces_name.join(', ') }}
            </div>
            <div v-if="config.stations_name && config.stations_name.length" :class="'text-' + (areaDesc.stations && areaDesc.stations.variant || 'secondary')">
              {{ config.stations_name.join(', ') }}
            </div>
          </td>
          <!-- <td>
            <div v-if="config.departments && config.departments_name.length">
              {{ config.departments_name.join(', ') }}
            </div>
          </td> -->
          <td>
            <div v-if="config.positions_name && config.positions_name.length">
              {{ config.positions_name.join(', ') }}
            </div>
          </td>
          <td>
            {{ salaryDateDesc[config.salary_date] || '' }}
          </td>
          <td class="text-center">
            <b-btn size="sm" variant="outline-success" title="Chỉnh sửa config" @click="updateConfig(config.id)"><i class="fas fa-pencil-alt"></i></b-btn>
            <b-btn size="sm" variant="outline-danger" title="Xóa config" @click="deleteKpiConfig(config.id)"><i class="fas fa-trash-alt"></i></b-btn>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center">
      <h6 class="text-center">{{`Trang ${filter.page} trên ` + Math.ceil(page.total/page.perPage)}}</h6>
      <b-pagination v-model="filter.page" :total-rows="page.total" :per-page="page.perPage" align="center" @input="getKpiConfig"></b-pagination>
    </div>

    <b-modal id="update-kpi-config" center static hide-footer :title="curConfig ? 'Cập nhật config KPI' : 'Thêm config KPI'" modal-class="modal-xl">
      <UpdateKpiConfig :config-id="curConfig" @updateok="$bvModal.hide('update-kpi-config'), getKpiConfig()" />
    </b-modal>
  </div>
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
import UpdateKpiConfig from './UpdateKpiConfig'

// service
import kpiConfigService from 'domain/services/kpi-config-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
// import Formula from 'domain/entities/Formula'

export default {
  name: 'list-kpi-config',

  components: {
    SelectDepartment,
    SelectPosition,
    SelectRegion,
    SelectProvince,
    SelectStation,
    UpdateKpiConfig
  },

  created () {
    this.getKpiConfig()
  },

  data: () => ({
    page: {
      perPage: 10,
      total: 0
    },
    loading: false,
    filter: {
      page: 1,
      positions: null,
      regions: null,
      provinces: null,
      stations: null,
      departments: null,
      salary_date: null
    },
    edit: true,
    salaryDateOps: [
      { text: '-- Chọn ngày lương chuẩn --', value: null },
      { text: 'Ngày vào', value: 'join_date' },
      { text: 'Sau 2 tháng từ ngày vào', value: 'after_2_month' },
      { text: 'Sau 1 tháng từ ngày vào', value: 'after_1_month' }
    ],
    salaryDateDesc: {
      join_date: 'Ngày vào',
      after_2_month: 'Sau 2 tháng từ ngày vào',
      after_1_month: 'Sau 1 tháng từ ngày vào'
    },
    areaDesc: {
      regions: { text: 'Miền', variant: 'success' },
      provinces: { text: 'Tỉnh', variant: 'info' },
      stations: { text: 'Kho', variant: 'primary' }
    },
    kpiConfig: [],
    curConfig: null
  }),

  methods: {
    getKpiConfig () {
      this.loading = true
      kpiConfigService.getKpiConfig(this.filter)
        .then(res => {
          if (res.data.success) {
            this.page.total = res.data.total || 0
            this.kpiConfig = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Đã có lỗi xảy ra không lấy được config công thức lương !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra không lấy được config công thức lương !', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    deleteKpiConfig (configId) {
      if (!configId) return
      if (!confirm('Bạn chắc chắn muốn xóa config chứ!')) return
      this.$startLoading()
      kpiConfigService.deleteKpiConfig({ configId: configId })
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Xóa được config KPI thành công', 'success')
            this.getKpiConfig()
          } else helper.showMessage(res.data.message || 'Không xóa được config KPI !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không xóa được config KPI !', 'warning')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    resetFilter () {
      this.filter.page = 1
      this.filter.salary_date = null
      this.filter.departments = null
      this.filter.positions = null
      this.filter.regions = null
      this.filter.provinces = null
      this.filter.stations = null
      this.getKpiConfig()
    },

    updateConfig (curConfig = null) {
      this.curConfig = curConfig
      this.$bvModal.show('update-kpi-config')
    },

    selectFilter (ref, field, ops) {
      if (!ref) return
      ref[field] = ops ? ops.map(op => op.id).toString() : null
    }
  }
}
</script>
