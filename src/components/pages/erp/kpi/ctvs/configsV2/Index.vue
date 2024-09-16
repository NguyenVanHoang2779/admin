<template>
  <div>

    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-2">
      <div>Gán thù lao cho cộng tác viên</div>
      <div class="float-right">
        <button type="button" class="btn btn-primary mr-3" ><a data-v-0320ebbf="" href="https://gdrives.ghtk.co/s/rWTg7F38fT7q5ow" target="_blank" style="color: #FFFFFF;"><i class="ion ion-md-attach mr-1"> </i>Hướng dẫn</a></button>
        <b-btn variant="primary" @click="$bvModal.show('modal-add-ctv-object')"><i class="ion ion-ios-add"></i>&nbsp;Tạo gói thù lao</b-btn> &nbsp;
      </div>
    </h4>
    <!--    Bộ lọc-->
    <b-card class="mb-3">
      <b-row class="mb-2">
        <b-col class="my-1" sm="3">
          <b-form-group label="Công thức lương:">
            <multiselect
              class="multiselect-station multiselect-info"
              :options="dataOptions.formulaOptions"
              v-model="searchData.selectFormula"
              placeholder="Công thức lương"
              :multiple="true"
              label="name"
              track-by="id"
              :preserve-search="true"
              :hide-selected="true"
            />
          </b-form-group>
        </b-col>
        <b-col class="my-1" sm="3">
            <b-form-group label="User:">
              <multiselect
                class="multiselect-station multiselect-info"
                :options="dataOptions.UserOptions"
                v-model="searchData.selectUser"
                placeholder="Chọn user"
                :multiple="true"
                label="name"
                track-by="id"
                :preserve-search="true"
                :hide-selected="true"
                @search-change="searchUser"
              />
            </b-form-group>
        </b-col>
        <b-col class="my-1" sm="3">
          <b-row>
            <b-form-group label="Bắt đầu:" style="padding-right: 12px;padding-left: 12px; width: 100%">
              <datepicker style="border: 1px solid #ccc; border-radius: 5px;"
                          v-model="searchData.from"
                          :bootstrapStyling="true"
                          :monday-first="true"
                          :full-month-name="true"
                          :calendar-button="true"
                          calendar-button-icon="ion ion-md-calendar"
                          :clear-button="true"
                          placeholder="Thời gian bắt đầu"
                          :format="customFormatter"/>
            </b-form-group>
          </b-row>
        </b-col>
        <b-col class="my-1" sm="3">
          <b-row>
            <b-form-group label="Kết thúc:" style="padding-right: 12px;padding-left: 12px; width: 100%">
              <datepicker style="border: 1px solid #ccc; border-radius: 5px;"
                          v-model="searchData.to"
                          :bootstrapStyling="true"
                          :monday-first="true"
                          :full-month-name="true"
                          :calendar-button="true"
                          calendar-button-icon="ion ion-md-calendar"
                          :clear-button="true"
                          placeholder="Thời gian kết thúc"
                          :format="customFormatter"/>
            </b-form-group>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col class="my-1" sm="3">
            <b-form-group label="Kho:">
              <multiselect
                class="multiselect-station multiselect-warning"
                :options="dataOptions.stationOptions"
                v-model="searchData.selectStation"
                placeholder="Chọn kho"
                :multiple="true"
                label="name"
                track-by="id"
                :preserve-search="true"
                :hide-selected="true"
              />
            </b-form-group>
        </b-col>
        <b-col class="my-1" sm="3">
            <b-form-group label="Huyện:">
              <multiselect
                class="multiselect-station multiselect-warning"
                :options="dataOptions.districtOptions"
                v-model="searchData.selectDistrict"
                placeholder="Chọn huyện"
                :multiple="true"
                label="name"
                track-by="id"
                :preserve-search="true"
                :hide-selected="true"
              />
            </b-form-group>
        </b-col>
        <b-col class="my-1" sm="3">
            <b-form-group label="Tỉnh:">
              <multiselect
                class="multiselect-station multiselect-warning"
                :options="dataOptions.provinceOptions"
                v-model="searchData.selectProvince"
                placeholder="Chọn tỉnh"
                :multiple="true"
                label="name"
                track-by="id"
                :preserve-search="true"
                :hide-selected="true"
              />
            </b-form-group>
        </b-col>
        <b-col class="my-1" sm="3">
          <b-form-group label="Miền:">
            <multiselect
              class="multiselect-station multiselect-warning"
              :options="dataOptions.regionOptions"
              v-model="searchData.selectRegion"
              placeholder="Chọn Miền"
              :multiple="true"
              label="name"
              track-by="id"
              :preserve-search="true"
              :hide-selected="true"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col class="my-1" sm="3">
          <b-input v-model="searchData.nameConfig" :placeholder="`Tên Campaign`"></b-input>
        </b-col>
        <b-col class="my-1" sm="3">
          <span></span>
        </b-col>
        <b-col class="my-1" sm="2">
          <b-form-group label="">
            <b-button class="pt-2" variant="success" block @click="getCampaigns(1)" style="border: 1px solid #ccc; border-radius: 5px;"><i class="ion ion-md-search"></i> Tìm kiếm</b-button>
          </b-form-group>
        </b-col>
        <b-col class="my-1" sm="2">
          <b-form-group label="">
            <b-button class="pt-2" variant="danger" block @click="resetSearch" style="border: 1px solid #ccc; border-radius: 5px;"><i class="sidenav-icon ion ion-md-remove-circle"></i> Reset tìm kiếm</b-button>
          </b-form-group>
        </b-col>
        <b-col class="my-1" sm="2">
          <b-form-group label="">
            <b-button class="pt-2" variant="primary" block @click="$bvModal.show('modal-add-ctv-campaign')" style="border: 1px solid #ccc; border-radius: 5px;"><i class="fa fa-plus-circle"></i> Thêm Campaign</b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    <b-card no-body>
      <b-card-body>
        <br>
        <b-table
          striped
          hover
          responsive
          :fields="fieldsDataConfig"
          :items="campaignData"
          :per-page="search.perPage"
          head-variant="info"
          :current-page="0"
        >
          <template #head(id)="data">
            <span ><i class="fas fa-sort"></i>{{ data.label }}</span>
          </template>
          <template #head(title)="data">
            <span ><i class="fas fa-sort"></i>{{ data.label }}</span>
          </template>
          <template #head(from)="data">
            <span ><i class="fas fa-sort"></i>{{ data.label }}</span>
          </template>
          <template #head(to)="data">
            <span ><i class="fas fa-sort"></i>{{ data.label }}</span>
          </template>
          <template #head(time_status)="data">
            <span ><i class="fas fa-sort"></i>{{ data.label }}</span>
          </template>
          <template v-slot:cell(time_status)="data">
            <span v-if="data.item.time_status === 'expired'" class="text-danger">Hết hạn</span>
            <span v-else-if="data.item.time_status === 'not_start'" class="text-warning">Chưa bắt đầu</span>
            <span v-else class="text-success">Hoạt động</span>
          </template>
          <template v-slot:cell(action)="row">
            <b-btn variant="outline-primary borderless icon-btn" class="btn-sm"
                   @click="getDetailCampaign(row)" ><i data-v-e8f008ae="" class="ion ion-md-eye" ></i></b-btn>
            <b-btn variant="outline-warning borderless icon-btn" class="btn-sm"
                   @click="editCampaign(row.index)"><i class="ion ion-md-create"></i></b-btn>
            <b-btn variant="outline-success borderless icon-btn" class="btn-sm"
                   :id="'addConfig-' + row.index.id"
                    @click="addConfigCampaign(row)">
              <i class="ion ion-md-add"></i></b-btn>
            <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                   @click="changeStatusCampaign(row.item.id, 0)"><i
              class="ion ion-md-close"></i>
            </b-btn>
          </template>
          <template #row-details="row">
            <b-card>
              <b-table-simple
                striped
                hover
                responsive
              >
                <b-thead>
                  <b-tr>
                    <b-th class="w-40">Phạm vi áp dụng</b-th>
                    <b-th class="w-60">Chi tiết</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr v-for="(item ,index) in detailCampaign[row.item.id]" v-bind:key="`${index}-${item.id}`" style="border-bottom: 2px solid red;">
                    <b-td class="w-40">
                      <div class="mb-2" style="font-weight: bold;">Loại hình làm việc: <span class="text-danger">{{item.work_type_name}}</span></div>
                      <div v-if="item.scope_data.region" class="mb-2">
                        <b-form-group label="Theo miền:">
                          <multiselect
                            class="multiselect-station multiselect-primary"
                            :options="item.scope_data.region"
                            v-model="item.scope_data.region"
                            placeholder="Miền áp dụng"
                            :multiple="true"
                            label="region_name"
                            track-by="region_id"
                            :preserve-search="true"
                            :hide-selected="true"
                            @remove="confirmRemove(row,...arguments)"
                          />
                        </b-form-group>
                      </div>
                      <div v-if="item.scope_data.province" class="mb-2">
                        <b-form-group label="Theo tỉnh:">
                          <multiselect
                            class="multiselect-station multiselect-primary"
                            :options="item.scope_data.province"
                            v-model="item.scope_data.province"
                            placeholder="Tỉnh áp dụng"
                            :multiple="true"
                            label="province_name"
                            track-by="province_id"
                            :preserve-search="true"
                            :hide-selected="true"
                            @remove="confirmRemove(row,...arguments)"
                          />
                        </b-form-group>
                      </div>
                      <div v-if="item.scope_data.district" class="mb-2">
                        <b-form-group label="Theo huyện:">
                          <multiselect
                            class="multiselect-station multiselect-primary"
                            :options="item.scope_data.district"
                            v-model="item.scope_data.district"
                            placeholder="Huyện áp dụng"
                            :multiple="true"
                            label="district_name"
                            track-by="district_id"
                            :preserve-search="true"
                            :hide-selected="true"
                            @remove="confirmRemove(row,...arguments)"
                          />
                        </b-form-group>
                      </div>
                      <div v-if="item.scope_data.station" class="mb-2">
                        <b-form-group label="Theo kho:">
                          <multiselect
                            class="multiselect-station multiselect-primary"
                            :options="item.scope_data.station"
                            v-model="item.scope_data.station"
                            placeholder="Kho áp dụng"
                            :multiple="true"
                            label="station_name"
                            track-by="station_id"
                            :preserve-search="true"
                            :hide-selected="true"
                            @remove="confirmRemove(row,...arguments)"
                          />
                        </b-form-group>
                      </div>
                      <div v-if="item.scope_data.user" class="mb-2">
                        <b-form-group label="Theo user:">
                          <multiselect
                            class="multiselect-station multiselect-primary"
                            :options="item.scope_data.user"
                            v-model="item.scope_data.user"
                            placeholder="User áp dụng"
                            :multiple="true"
                            label="username"
                            track-by="user_id"
                            :preserve-search="true"
                            :hide-selected="true"
                            @remove="confirmRemove(row,...arguments)"
                          />
                        </b-form-group>
                      </div>
                    </b-td>
                    <b-td class="w-60" >
                      <div v-if="item.detail[1]" class="mb-2">
                        <div>
                          <span class="font-weight-bold text-success">
                            {{item.detail[1].type_name}}({{item.detail[1].object_id}})
                          </span>
                          <div v-if="item.detail[1].object_detail.data
                                      ||  item.detail[1].object_detail.point_p_r
                                      || item.detail[1].object_detail.package_p
                                      || item.detail[1].object_detail.package_r">
                          <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
                          <table class="table">
                            <thead>
                            <tr>
                              <th>Vùng</th>
                              <th v-for="(cost, index) in objectDetail[1].data">Vùng {{ index }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="item.detail[1].object_detail.data">
                              <th scope="row">Đơn giao</th>
                              <td v-for="(cost, index) in objectDetail[1].data">
                                <vue-numeric v-model="item.detail[1].object_detail.data[index]" class="input-money" currency="đ"
                                             v-bind:min="0" v-bind:max="100000"
                                             currency-symbol-position="suffix"></vue-numeric>
                              </td>
                            </tr>

                            <tr v-if="item.detail[1].object_detail.point_p_r">
                              <th scope="row">Điểm lấy/trả</th>
                              <td v-for="(cost, index) in objectDetail[1].point_p_r">
                                <vue-numeric v-model="item.detail[1].object_detail.point_p_r[index]" class="input-money" currency="đ"
                                             v-bind:min="0" v-bind:max="100000"
                                             currency-symbol-position="suffix"></vue-numeric>
                              </td>
                            </tr>
                            <tr v-if="item.detail[1].object_detail.package_p">
                              <th scope="row">Đơn lấy</th>
                              <td v-for="(cost, index) in objectDetail[1].package_p">
                                <vue-numeric v-model="item.detail[1].object_detail.package_p[index]" class="input-money" currency="đ"
                                             v-bind:min="0" v-bind:max="100000"
                                             currency-symbol-position="suffix"></vue-numeric>
                              </td>
                            </tr>
                            <tr v-if="item.detail[1].object_detail.package_r">
                              <th scope="row">Đơn trả</th>
                              <td v-for="(cost, index) in objectDetail[1].package_r">
                                <vue-numeric v-model="item.detail[1].object_detail.package_r[index]" class="input-money" currency="đ"
                                             v-bind:min="0" v-bind:max="100000"
                                             currency-symbol-position="suffix"></vue-numeric>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                          </div>
                          <div class="title_object mb-4" v-if="item.detail[1].object_detail.route_bonus"><span class="font-weight-bold">Bonus tuyến khó: </span>
                            <vue-numeric v-model="item.detail[1].object_detail.route_bonus" class="input-money" currency="đ"
                                         v-bind:min="0" v-bind:max="100000"
                                         currency-symbol-position="suffix"></vue-numeric>
                            trên 1 đơn giao - điểm lấy/trả
                          </div>
                        </div>
                      </div>
                      <div v-if="item.detail[3]" class="mb-2">
                        <div>
                          <span class="font-weight-bold text-success">
                            {{item.detail[3].type_name}}({{item.detail[3].object_id}})
                          </span>
                          <table class="table table-bordered table-sm text-center">
                            <thead>
                            <tr>
                              <th>Tổng đơn/điểm</th>
                              <th v-for="(cost, index) in item.detail[3].object_detail.data">{{ index }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                              <th scope="row">Thù lao (VNĐ)</th>
                              <td v-for="cost in item.detail[3].object_detail.data">
                                <strong v-numeral> {{ cost }}</strong>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                          <p style="text-align: left" v-if="typeof item.detail[3].object_detail.seniority != 'undefined'">- Thâm niên: <strong
                            v-numeral> {{ item.detail[3].object_detail.seniority }}</strong> Ngày</p>
                        </div>
                      </div>
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-card>
          </template>
        </b-table>
        <br>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-model="search.currentPage"
            :total-rows="search.totalItems"
            :per-page="search.perPage"
            v-on:input="getCampaigns"
            class="mt-4"
          >
            <template v-slot:prev-text><span class="text-info">Trang trước</span></template>
            <template v-slot:next-text><span class="text-info">Trang sau</span></template>
            <template v-slot:page="{ page, active }">
              <b v-if="active">{{ page }}</b>
              <i v-else>{{ page }}</i>
            </template>
          </b-pagination>
        </div>
      </b-card-body></b-card>
    <modal-add-ctv-object></modal-add-ctv-object>
    <modal-add-ctv-campaign></modal-add-ctv-campaign>
    <modal-edit-ctv-campaign :campaign="editingCampaign"></modal-edit-ctv-campaign>
    <modal-add-config-campaign ref="modalConfigCampaign" :campaign="editingCampaign"></modal-add-config-campaign>
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
import ModalAddCtvCampaign from '../configs/ModalAddCtvCampaign'
import ModalAddCtvObject from '../configs/ModalAddCtvObject'
import ModalEditCtvCampaign from '../configs/ModalEditCtvCampaign'
import ModalAddConfigCampaign from '../configs/ModalAddConfigCampaign'
import CampaignDetail from '../configs/CampaignDetail'

export default {
  name: 'ctv-campaign',
  metaInfo: {
    title: 'CTV Campaign'
  },
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
    moment,
    ModalAddCtvCampaign,
    ModalEditCtvCampaign,
    ModalAddCtvObject,
    ModalAddConfigCampaign,
    CampaignDetail
  },
  data: () => ({
    dataOptions: {
      formulaOptions: [
        {id: 2221, name: 'Cod thời vụ (2221)'},
        {id: 2222, name: 'Cod hỗ trợ  (2222)'}
      ],
      provinceOptions: [],
      stationOptions: [],
      districtOptions: [],
      regionOptions: [],
      UserOptions: []
    },
    searchData: {
      selectFormula: [
        {id: 2221, name: 'Cod thời vụ (2221)'},
        {id: 2222, name: 'Cod hỗ trợ  (2222)'}
      ],
      selectProvince: null,
      selectDistrict: null,
      selectStation: null,
      selectUser: null,
      selectRegion: null,
      from: null,
      to: null,
      nameConfig: null
    },
    fieldsDataConfig: [
      { key: 'id', label: 'id', sortable: true },
      { key: 'title', label: 'Tên Campaign', sortable: true },
      { key: 'desc', label: 'Chú thích' },
      { key: 'from', label: 'Ngày bắt đầu', sortable: true },
      { key: 'to', label: 'Ngày kết thúc', sortable: true },
      { key: 'time_status', label: 'Trạng thái', sortable: true },
      { key: 'action', label: 'Quản lý' }
    ],
    tab: 'all',
    campaignData: [],
    search: {
      totalItems: 0,
      currentPage: 1,
      perPage: 20,
      text: ''
    },
    checkBox: {
      viewDisable: false,
      viewExpired: false,
      listChecked: [],
      checkAll: false
    },
    selectedCampaign: null,
    editingCampaign: null,
    loading: {
      getCampaign: false
    },
    detailCampaign: [],
    objectDetail: {
      1: {
        data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
        point_p_r: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
        package_p: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
        package_r: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
        route_bonus: 0},
      2: {data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0}, cost: 0, seniority: 0},
      3: {data: [{point: 0, cost: 0}], seniority: 0},
      4: {cost: 0, seniority: 0},
      5: {data: [{from_weight: 0, cost: 0, per_weight: 0}]}
    }
  }),
  watch: {
    'selectedCampaign': function (newVal) {
    },
    'tab': function (newVal) {
      this.getCampaigns()
    },
    'searchData.selectRegion': function (newVal) {
      this.getListProvince()
      this.getListDistrict()
      this.getListStation()
    },
    'searchData.selectProvince': function (newVal) {
      this.getListDistrict()
      this.getListStation()
    },
    'searchData.selectDistrict': function (newVal) {
      this.getListStation()
    }
  },
  methods: {
    customFormatter (date) {
      return date ? moment(date).format('YYYY-MM-DD') : null
    },
    customIds (data) {
      let response = ''
      data.map(function (item) {
        response += item.id + ','
      })
      if (response.length > 0) {
        response = response.slice(0, -1)
      }
      return response
    },

    getRegions () {
      kpiCodService.apiCtvGetRegions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataOptions.regionOptions = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách miền', 'error')
      }).then(() => {
      })
    },
    getListProvince () {
      let dataSend = {}
      if (this.searchData.selectRegion != null) {
        dataSend.region_ids = this.customIds(this.searchData.selectRegion)
      }
      kpiCodService.apiCtvGetProvinces(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.dataOptions.provinceOptions = response.data.data
        }
      }).catch(() => {
      }).then(() => {
      })
    },
    getListDistrict () {
      let dataSend = {}
      if (this.searchData.selectRegion != null) {
        dataSend.region_ids = this.customIds(this.searchData.selectRegion)
      }
      if (this.searchData.selectProvince != null) {
        dataSend.province_ids = this.customIds(this.searchData.selectProvince)
      }
      kpiCodService.apiCtvGetDistricts(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataOptions.districtOptions = response.data.data
          }
        }
      }).catch(() => {
      }).then(() => {
      })
    },
    getListStation () {
      let dataSend = {
      }
      if (this.searchData.selectRegion != null) {
        dataSend.region_ids = this.customIds(this.searchData.selectRegion)
      }
      if (this.searchData.selectProvince != null) {
        dataSend.province_ids = this.customIds(this.searchData.selectProvince)
      }
      if (this.searchData.selectDistrict != null) {
        dataSend.district_ids = this.customIds(this.searchData.selectDistrict)
      }
      kpiCodService.apiCtvGetStations(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataOptions.stationOptions = response.data.data
          }
        }
      }).catch(() => {
      }).then(() => {
      })
    },
    searchUser (query) {
      this.loading.search = true
      let param = {
        term: query
      }
      kpiCodService.apiSearchUserCtv(param).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataOptions.UserOptions = response.data.data
          }
        }
      }).catch(() => {
      }).then(() => {
        this.loading.search = false
      })
    },
    mouseDivCampaign (index, value) {
      this.campaignData[index].mouseover = value
      this.$forceUpdate()
    },
    clickDivCampaign (index) {
      this.selectedCampaign = (this.selectedCampaign === index) ? null : index
      this.campaignData[index].mouseover = !this.campaignData[index].mouseover
    },
    clickCheckAllCampaign () {
      for (const index in this.campaignData) {
        this.campaignData[index].checkbox = this.checkBox.checkAll
      }
    },
    changeStatusCampaign (id, status) {
      if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái campaign này không?')) return
      this.loading.getCampaign = true
      kpiCodService.apiChangeStatusCampaign({id: id, status: status}).then(response => {
        commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi thay đổi trạng thái campaign', 'error')
      }).then(() => {
        this.getCampaigns()
      })
    },
    editCampaign (index) {
      this.editingCampaign = this.campaignData[index]
      this.$bvModal.show('modal-edit-ctv-campaign')
    },
    addConfigCampaign (row) {
      this.editingCampaign = this.campaignData[row.index]
      this.$bvModal.show('modal-add-config-campaign')
      this.$refs.modalConfigCampaign.resetValue()
    },
    resetSearch () {
      this.searchData = {
        selectFormula: [
          {id: 2221, name: 'Cod thời vụ (2221)'},
          {id: 2222, name: 'Cod hỗ trợ  (2222)'}
        ],
        selectProvince: null,
        selectDistrict: null,
        selectStation: null,
        selectUser: null,
        selectRegion: null,
        from: null,
        to: null,
        nameConfig: null
      }
    },
    getCampaigns (bol = 1) {
      this.search.currentPage = bol
      console.log(bol + '123')
      let dataSend = {
        currentPage: this.search.currentPage,
        perPage: this.search.perPage
      }
      if (this.searchData.from != null) {
        dataSend.from = this.customFormatter(this.searchData.from)
      }
      if (this.searchData.to != null) {
        dataSend.to = this.customFormatter(this.searchData.to)
      }
      if (this.searchData.selectRegion != null) {
        dataSend.region_ids = this.customIds(this.searchData.selectRegion)
      }
      if (this.searchData.selectProvince != null) {
        dataSend.province_ids = this.customIds(this.searchData.selectProvince)
      }
      if (this.searchData.selectDistrict != null) {
        dataSend.district_ids = this.customIds(this.searchData.selectDistrict)
      }
      if (this.searchData.selectStation != null) {
        dataSend.station_ids = this.customIds(this.searchData.selectStation)
      }
      if (this.searchData.selectUser != null) {
        dataSend.user_ids = this.customIds(this.searchData.selectUser)
      }
      if (this.searchData.selectFormula != null) {
        dataSend.formula_ids = this.customIds(this.searchData.selectFormula)
      }
      if (this.searchData.nameConfig != null) {
        dataSend.name_campaign = this.searchData.nameConfig
      }
      kpiCodService.apiGetCampaignDataV2(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.campaignData = response.data.data.data
            this.search.totalItems = response.data.data.count
          } else {
            this.campaignData = []
            this.search.totalItems = 0
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy data campaign', 'error')
      }).then(() => {
      })
    },
    getDetailCampaign (row) {
      if (row.detailsShowing) {
        row.toggleDetails()
        return true
      }
      let dataSend = {
        campaign_id: row.item.id
      }
      kpiCodService.apiGetCtvConfigsV2(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success && !row.detailsShowing) {
            this.detailCampaign[row.item.id] = response.data.data
            row.toggleDetails()
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy data campaign', 'error')
      }).then(() => {
      })
    },
    confirmRemove (row, op) {
      if (confirm('Bạn có chắc chắn muốn xóa config?')) {
        let dataSend = {
          id: op.config_ids
        }
        kpiCodService.apiChangeStatusConfig(dataSend).then(response => {
          if (response.data.hasOwnProperty('success')) {
            if (response.data.success) {
              commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            } else {
              commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            }
          }
        }).catch(() => {
          commonHelper.showMessage('Có lỗi khi xóa config', 'error')
        }).then(() => {
          this.reloadDetailCampaign(row)
        })
      } else {
        this.reloadDetailCampaign(row)
      }
    },
    reloadDetailCampaign (row) {
      let dataSend = {
        campaign_id: row.item.id
      }
      kpiCodService.apiGetCtvConfigsV2(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.detailCampaign[row.item.id] = response.data.data
            row.toggleDetails()
            row.toggleDetails()
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy data campaign', 'error')
      }).then(() => {
      })
    }
  },
  created () {
    this.getCampaigns()
    this.getRegions()
    this.getListProvince()
    this.getListDistrict()
    this.getListStation()
  }
}
</script>
