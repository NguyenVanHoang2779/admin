<template>
    <div>
      <b-card no-body class="campaign-detail">
        <div v-loading="loading">
          <b-card-body>
            <div v-if="data.length !== 0">
              <table class="table table-striped table-bordered text-center">
                <tr v-for="(groupInfo) in data">
<!--                  scope-->
                  <td class="w-50">
                    <div class="row mb-2" v-for="(scope) in groupInfo.scope">
                      <div class="col-sm-2">
                        <div class="form-label">
                          {{scope.work_type_name}} {{ scope.scope_type_name }}:
                        </div>
                      </div>
                      <div class="col-sm">
                        <multiselect
                          v-model="scope.list_scopes"
                          label="scope_name"
                          track-by="scope_id"
                          placeholder=""
                          :options="scope.list_scopes"
                          :multiple="true"
                          :searchable="true"
                          selectedLabel="Đã chọn"
                          deselectLabel="Bỏ chọn"
                          selectLabel=""
                          :allow-empty="true"
                          :internal-search="true"
                          :clear-on-select="true"
                          :close-on-select="true"
                          :hide-selected="true">
                          <span slot="noResult">Không có kết quả phù hợp</span>
                          <span slot="noOptions">Không có dữ liệu</span>
                        </multiselect>
                      </div>
                    </div>
                  </td>
<!--                  object-->
                  <td>
                    <div v-for="(object) in groupInfo.object">
                      <div v-if="object.object_id !== 0">
                        <div class="text-left"><strong>- {{object.type_name}}</strong>
                          <!--Add button-->
                          <button :id="'deleteConfigPopover-'+ object.id" type="button" @click="deleteConfig(object.id)" class="text-danger btn btn-default btn-circle borderless"><i class="ion ion-md-close"></i></button>
                          <b-popover :target="'deleteConfigPopover-'+ object.id" class="popover-primary d-inline-block" placement="top" triggers="hover" content="Xóa config" />
                        </div>
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
                              <th scope="row">Giá (VNĐ)</th>
                              <td v-for="cost in object.object_detail.data">
                                <strong v-numeral> {{ cost }}</strong>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                          <p style="text-align: left; padding-left: 5px"
                             v-if="typeof object.object_detail.route_bonus !== 'undefined'">+ Bonus tuyến khó:
                            <strong v-numeral> {{ object.object_detail.route_bonus }}</strong> trên 1 đơn/điểm</p>
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
                          <p style="text-align: left; padding-left: 5px">+ Đơn giá: <strong v-numeral>
                            {{ object.object_detail.cost }}</strong> VNĐ
                            trên 1 đơn/điểm</p>
                          <p style="text-align: left; padding-left: 5px"
                             v-if="typeof object.object_detail.seniority !== 'undefined'">+ Thâm niên:
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
                          <p style="text-align: left; padding-left: 5px"
                             v-if="typeof object.object_detail.seniority != 'undefined'">+ Thâm niên:
                            <strong v-numeral> {{ object.object_detail.seniority }}</strong> Ngày</p>
                        </div>

                        <!--Phụ cấp đơn giao theo cân nặng-->
                        <div v-if="object.type_id === 5">
                          <table class="table table-bordered table-sm text-center">
                            <tbody>
                            <tr v-for="record in object.object_detail.data">
                              <td>
                                <strong> Từ <span v-numeral>{{ record.from_weight }}</span>g</strong>
                              </td>
                              <td>
                                <strong>+ <span v-numeral>{{ record.cost }}</span>đ / <span
                                  v-numeral>{{ record.per_weight }}</span>g</strong>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
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
