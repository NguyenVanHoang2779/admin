<template>
    <div>
      <b-card no-body class="campaign-detail">
        <div v-loading="loading">
            <b-card-body>
              <div v-if="data.length !== 0">
                <table class="table table-sm table-striped  text-center">
                  <thead>
                    <tr>
                      <th scope="col">Loại hình làm việc
<!--                        <span class="th-filter"><i class="ion ion-md-arrow-dropdown"></i></span>-->
                      </th>
                      <th scope="col">Phạm vi áp dụng</th>
                      <th scope="col">Chi tiết</th>
<!--                      <th scope="col">&nbsp;</th>-->
                    </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(record, record_index) in data">
                    <td>{{record.work_type_name}}</td>
                    <td>
                      <p class="mb-0"><i>Theo {{record.scope_type_name}}</i></p>
                      <a href="javascript:void(0)" :id="'scopeDetail-'+record_index"><strong>{{ record.scope_info.scope_name }}</strong></a>
                      <b-popover :target="'scopeDetail-'+record_index" triggers="hover focus">
                        <template #title>Chi tiết</template>
                        <p v-if="record.scope_info.region_name"><strong>Miền:</strong> {{record.scope_info.region_name}}({{record.scope_info.region_id}})</p>
                        <p v-if="record.scope_info.province_name"><strong>Tỉnh/Thành phố:</strong> {{ record.scope_info.province_name }}({{record.scope_info.province_id}})</p>
                        <p v-if="record.scope_info.station_name"><strong>Kho:</strong> {{ record.scope_info.station_name }}({{record.scope_info.station_id}})</p>
                      </b-popover>
                    </td>
                    <td>
                      <div v-for="(object, object_index) in record.detail">
                        <div class="row">
                          <div class="col-md text-left"><strong>- {{object.type_name}}({{object.object_id}})</strong>
                            <!--Add button-->
                            <button :id="'deleteConfigPopover-' + record_index + '-' + object_index" type="button" @click="deleteConfig(object.config_id)" class="text-danger btn btn-default btn-circle borderless"><i class="ion ion-md-close"></i></button>
                            <b-popover :target="'deleteConfigPopover-' + record_index + '-' + object_index" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Xóa config" />
                          </div>
                        <div class="col-md text-right text-muted mb-1 ml-2 font-italic">({{object.modified_by}} {{object.modified}})</div>
                        </div>
                        <div v-if="object.object_id === -1">
                          Bị chặn
                        </div>
                        <div v-else>
                          <!--Thù lao đơn điểm theo vùng-->
                          <div v-if="object.type_id === 1">
                            <table class="table bg-white table-bordered table-sm text-center">
                              <thead>
                              <tr>
                                <th>Vùng</th>
                                <th v-for="(cost, index) in object.object_detail.data">V{{ index }}</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr>
                                <th scope="row">Đơn giao (VNĐ)</th>
                                <td v-for="cost in object.object_detail.data">
                                  <strong v-numeral> {{ cost }}</strong>
                                </td>
                              </tr>

                              <tr v-if="object.object_detail.point_p_r">
                                <th scope="row">Điểm lấy/trả (VNĐ)</th>
                                <td v-for="cost in object.object_detail.point_p_r">
                                  <strong v-numeral> {{ cost }}</strong>
                                </td>
                              </tr>
                              <tr v-if="object.object_detail.package_p">
                                <th scope="row">Đơn lấy (VNĐ)</th>
                                <td v-for="cost in object.object_detail.package_p">
                                  <strong v-numeral> {{ cost }}</strong>
                                </td>
                              </tr>
                              <tr v-if="object.object_detail.package_r">
                                <th scope="row">Đơn trả (VNĐ)</th>
                                <td v-for="cost in object.object_detail.package_r">
                                  <strong v-numeral> {{ cost }}</strong>
                                </td>
                              </tr>
                              </tbody>
                            </table><p style="text-align: left; padding-left: 5px" v-if="typeof object.object_detail.route_bonus !== 'undefined'">+ Bonus tuyến khó:
                            <strong v-numeral> {{ object.object_detail.route_bonus }}</strong>đ trên 1 đơn/điểm</p>
                          </div>

                          <!--Thù lao vượt ngưỡng theo vùng-->
                          <div v-if="object.type_id === 2">
                            <table class="table table-bordered table-sm text-center">
                              <thead>
                              <tr>
                                <th>Vùng</th>
                                <th v-for="(cost, index) in object.object_detail.data">V{{ index }}</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr>
                                <th scope="row">Đơn/điểm</th>
                                <td v-for="cost in object.object_detail.data">
                                  <strong v-numeral> {{ cost }}</strong>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                            <p style="text-align: left; padding-left: 5px">+ Đơn giá: <strong v-numeral> {{ object.object_detail.cost }}</strong> VNĐ
                              trên 1 đơn/điểm</p>
                            <p style="text-align: left; padding-left: 5px" v-if="typeof object.object_detail.seniority !== 'undefined'">+ Thâm niên:
                              <strong v-numeral> {{ object.object_detail.seniority }}</strong> ngày</p>
                          </div>

                          <!--Thù lao vượt ngưỡng trên tổng đơn điểm-->
                          <div v-if="object.type_id === 3">
                            <table class="table table-bordered table-sm text-center">
                              <thead>
                              <tr>
                                <th>Đơn/điểm</th>
                                <th v-for="(cost, index) in object.object_detail.data">{{ index }}</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr>
                                <th scope="row">Thù lao (VNĐ)</th>
                                <td v-for="cost in object.object_detail.data">
                                  <strong v-numeral> {{ cost }}</strong>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                            <p style="text-align: left; padding-left: 5px" v-if="typeof object.object_detail.seniority != 'undefined'">+ Thâm niên:
                              <strong v-numeral> {{ object.object_detail.seniority }}</strong> Ngày</p>
                          </div>

                          <!--Thù lao theo ngày công -->
                          <div v-if="object.type_id === 4">
                            <p style="text-align: left; padding-left: 5px">+ Thù lao: <strong v-numeral> {{ object.object_detail.cost }}</strong>
                              VNĐ/ngày</p>
                            <p style="text-align: left; padding-left: 5px" v-if="typeof object.object_detail.seniority != 'undefined'">+ Thâm niên:
                              <strong v-numeral> {{ object.object_detail.seniority }}</strong> ngày</p>
                          </div>

                          <!--Phụ cấp đơn giao theo cân nặng-->
                          <div v-if="object.type_id === 5">
                            <table class="table table-bordered table-sm text-center">
                              <tbody>
                              <tr v-for="record in object.object_detail.data">
                                <td>
                                  <strong> Từ <span v-numeral>{{record.from_weight}}</span>g</strong>
                                </td>
                                <td>
                                  <strong>+ <span v-numeral>{{record.cost}}</span>đ / <span v-numeral>{{record.per_weight}}</span>g</strong>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <hr v-if="String(Math.max.apply(null, Object.keys(record.detail))) !== String(object_index)" class="border-light m-1">
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                Chưa có config trong cụm này!
              </div>
            </b-card-body>
        </div>
      </b-card>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'campaign-detail',
  props: ['campaign_id'],

  components: {
    kpiCodService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    moment
  },
  watch: {
    'options.date_from': function (newVal) {
      this.options.to_config.disabledDates.to = newVal
    },
    'options.date_to': function (newVal) {
      this.options.from_config.disabledDates.from = newVal
    },
    'options.campaign_types.selected': function (newVal) {
      if (newVal.id === 'default') {
        this.options.date_to = null
        this.options.to_config.disabled = true
      } else {
        this.options.to_config.disabled = false
      }
    }
  },
  data: () => (
    {
      data: [],
      loading: false,
      search: {
        totalItems: 100,
        currentPage: 1,
        perPage: 20,
        text: ''
      }
    }
  ),
  computed: {
  },
  methods: {
    getDataConfig () {
      this.loading = true
      let dataSend = {
        campaign_id: this.campaign_id
      }
      kpiCodService.apiGetCtvConfigs(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            this.data = response.data.data
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.loading = false
      })
    },
    deleteConfig (id) {
      if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái config này không?')) return
      this.loading = true
      kpiCodService.apiChangeStatusConfig({id: id}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            this.data = response.data.data
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.getDataConfig()
        this.loading = false
      })
    },
    hideModal () {
    }
  },
  created () {
    this.getDataConfig()
  }
}
</script>

<style scoped lang="scss">
</style>
