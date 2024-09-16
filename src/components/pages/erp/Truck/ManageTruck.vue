<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Quản lý xe tải
            </h4>
            <hr>
            <div class="mb-2">
                <b-row class="h-col-50">
                    <b-col md="2">
                        <multiselect
                          v-model="truckCodeIds"
                          :options="truckCodeOptions"
                          placeholder="Biển số xe"
                          label="text"
                          track-by="text"
                          selectedLabel="Đã chọn"
                          deselectLabel="Bỏ chọn"
                          selectLabel="Chọn"
                          :searchable="true"
                          :clear-on-select="false"
                          :multiple="true"
                        >
                          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                        </multiselect>
                    </b-col>
                    <b-col md="3">
                        <b-form-group class="w-100">
                            <b-input-group>
                                <single-select-company-profile
                                        v-model="companyId"
                                        :show-info="true"
                                        @handleChooseProfileCompany="handleChooseProfileCompany"
                                        company-type="1"
                                        :master-id="companyId"
                                >
                                </single-select-company-profile>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col md="2">
                        <b-form-select v-model="isDeleted" :options="statusOptions" class="only-bottom-border">
                            <template v-slot:first>
                                <option :value="null" disabled>-- Chọn trạng thái xe --</option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col md="2">
                        <b-form-select v-model="truckType" :options="truckTypeOptions" class="only-bottom-border">
                            <template v-slot:first>
                                <option :value="null" disabled>-- Chọn loại xe --</option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col md="2">
                      <multi-select-many-station
                        :station-ids="truckStation"
                        @handleSelectedManyStation="handleSelectedManyStation"
                      >
                      </multi-select-many-station>
                    </b-col>
                    <b-col md="2" v-if="truckType == 1">
                      <b-form-select
                              v-model="truckLeaseType"
                              :options="optionLeaseTypes"
                      >
                      </b-form-select>
                    </b-col>
                    <b-col md="2">
                      <v-date-picker
                        color="green"
                        :input-props="{ placeholder: 'Thời gian bắt đầu', readonly: true, fontsize: 'inherit'}"
                        :popover="{visibility: 'focus'}"
                        :max-date="new Date()"
                        v-model="startDateExport" locale="vi"/>
                    </b-col>
                    <b-col md="2">
                      <v-date-picker color="green"
                        :input-props="{ placeholder: 'Thời gian kết thúc', readonly: true, fontsize: 'inherit'}"
                        :popover="{visibility: 'focus'}"
                        :max-date="new Date()" v-model="stopDateExport" locale="vi"/>
                    </b-col>
                    <b-col md="2">
                      <input placeholder="Mã xe RC" v-model="truck_rc_code" type="text" @keyup.enter="searchTruck" class="form-control"/>
                    </b-col>
                    <b-col md="3">
                      <b-form-group class="w-100">
                        <b-input-group>
                          <multi-select-truck-driver
                            @input="handleSelectedDriverOption"
                            :maxSelected="1"
                            :truck-driver="truckDriver"
                          >
                          </multi-select-truck-driver>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="!isViewManagerTruck">
                    <b-col md="12" class="text-right">
                        <b-btn type="button" variant="primary" @click="searchTruck()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                        <b-btn type="button" variant="info" @click="reset()"><i class="ion ion-md-refresh" ></i> Reset</b-btn>
                        <router-link :to="{name: 'add-vehicle-company'}" class="btn btn-success"><i class="ion ion-ios-add"></i> Tạo xe</router-link>
                        <b-btn type="button" :disabled="disableExport" variant="secondary" @click="exportTruckInfo()"><i class="ion ion-md-download"></i> Tải dữ liệu xe</b-btn>
                        <b-btn type="button" :disabled="disableExportMaintain" variant="secondary" @click="exportTruckMaintain()" title="Tải dữ liệu bảo dưỡng xe tải"><i class="ion ion-md-download"></i> Tải bảo dưỡng</b-btn>
                    </b-col>
                    <b-col md="12" class="mt-2 text-right">
                      <b-btn type="button" variant="outline-primary" @click="showMaintainAgent = !showMaintainAgent" size="sm">Quản lý gara bảo dưỡng</b-btn>
                      <b-btn type="button" variant="outline-success" v-b-modal="'uploadFileTruck'" size="sm">Upload thông tin xe</b-btn>
                    </b-col>
                </b-row>
              <b-row v-else>
                <b-col md="12" class="text-right">
                  <b-btn type="button" variant="primary" @click="searchTruck()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                  <b-btn type="button" variant="info" @click="reset()"><i class="ion ion-md-refresh" ></i> Reset</b-btn>
                </b-col>
              </b-row>
            </div>
        </div>
        <div class="mb-3">
            <div class="wrapper-list-master" v-loading="appLoading">
                <b-card no-body v-if="listTrucks.length > 0">
                    <table class="table mb-0 table-hover">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Biển số xe</th>
<!--                            <th>Mã alias</th>-->
                            <th>Loại xe</th>
                            <th>Kho quản lý</th>
                            <th>Trọng tải</th>
                            <th>Thể tích thùng xe</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>User được gán</th>
                            <th @click="sortByCompany"  style="cursor: pointer;">
                              <span class="text-nowrap">Công ty &nbsp;
                              <i v-if="!companySortOrder" class="icon ion-md-arrow-dropdown"></i>
                              <i v-else class="icon ion-md-arrow-dropup"></i></span>
                            </th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in listTrucks">
                            <td>{{index + currentPage * 10 - 9}}</td>
                            <td>{{item.code}}</td>
<!--                            <td>{{item.alias}}</td>-->
                            <td>{{checkTypeTruck(item.truck_type)}}</td>
                            <td>{{item.station_name}}</td>
                            <td>{{item.weight || 0}} tấn</td>
                            <td>{{item.trunk_volume || 0}} khối</td>
                            <!--<td><button class="btn btn-outline-success" @click="showDetailAsset(item)">Chi tiết</button></td>-->
                            <td>{{item.created}}</td>
                            <td>
                                <span v-if="checkDeleted(item.is_deleted)">Đã dừng hoạt động</span>
                                <span v-else>Đang hoạt động</span>
                            </td>
                            <td>{{item.user_assign}}</td>
                            <td>{{item.company_name}}</td>
                            <td v-if="!isViewManagerTruck">
                                <button class="btn btn-outline-success" @click="showLog(item)">Lịch sử hoạt động</button>
                                <ladda-btn v-if="checkDeleted(item.is_deleted)" @click.native="revertTruck(item)" data-style="zoom-out" class="btn btn-outline-danger">
                                    Hủy dừng
                                </ladda-btn>
                                <ladda-btn v-else @click.native="showDelete(item)" data-style="zoom-out" class="btn btn-outline-primary">
                                    Dừng hoạt động
                                </ladda-btn>
                                <router-link :to="{name: 'edit-vehicle-company', params: { id: item.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
                            </td>
                          <td v-else>
                            <button class="btn btn-outline-success" @click="showLog(item)">Lịch sử hoạt động</button>
                            <ladda-btn v-if="checkDeleted(item.is_deleted)" data-style="zoom-out" class="btn btn-outline-danger">
                              Hủy dừng
                            </ladda-btn>
                            <ladda-btn v-else data-style="zoom-out" class="btn btn-outline-primary">
                              Dừng hoạt động
                            </ladda-btn>
                            <router-link :to="{name: 'edit-vehicle-company', params: { id: item.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
                          </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="mt-3" v-if="totalPages > 1">
                        <b-row>
                            <b-col md="6">
                                <b-pagination
                                        :total-rows="totalItems"
                                        v-model="currentPage"
                                        :per-page="perPage"
                                        v-on:input="getAllTruck()"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
                <div v-if="appLoading === false && listTrucks.length === 0">
                    <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy xe nào!</span>
                </div>
            </div>
        </div>
      <manage-truck-maintain-agent :trigger="showMaintainAgent"></manage-truck-maintain-agent>
      <b-modal hide-footer id="uploadFileTruck" header-bg-variant="success text-white" title="Upload thông tin xe" ok-only centered>
        <p class="card-text">
          - Chỉ cho phép upload file excel.
          <br />- Biển số xe phải đúng định dạng
          <br />- Thông tin ngày phải đúng định dạng yyyy-mm-dd. ví dụ: 2020-10-09 hoặc 2020/10/09
          <br />- Tham khảo file mẫu tại <a href="https://cache.giaohangtietkiem.vn/file/download/ab42dc81-b936-4d19-8598-e4d49b010595/Thong_tin_xe_tai.xlsx">đây</a>
        </p>
        <div>
          <file-upload
              class="upload-file"
              @input-file="changeExcel"
              :extensions="uploadFile.extensions"
              :accept="uploadFile.accept"
              :multiple="false"
              :directory="false"
              :size="uploadFile.size || 0"
              :drop="true"
              :add-index="false"
              v-model="uploadFile.files"
              ref="uploadFileTrucks"
          >{{uploadFile.text}}
        </file-upload>
        </div>
        <b-row align-h="center">
          <b-btn @click="uploadExcelFile()" variant="success" :disabled="disableUploadFile" size="md" title="Bỏ qua">Upload file</b-btn>
        </b-row>
      </b-modal>
      <b-modal ref="truckLog" size="lg" :hide-footer="true">
        <div slot="modal-title">
          Lịch sử ghi log
        </div>
        <div class="row mb-4" style="margin-left: -24px;">
          <b-col md="4">
            <v-date-picker color="green"
                           :input-props="{ placeholder: 'Chọn thời gian', readonly: true, fontsize: 'inherit'}"
                           :popover="{visibility: 'focus'}"
                           :max-date="new Date()" v-model="timeSearch" locale="vi"/>
          </b-col>
          <b-col md="2" offset-md="4">
            <b-btn type="button" variant="primary" @click="searchLog()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
          </b-col>
          <b-col md="2">
            <b-btn type="button" variant="info" @click="resetTime()"><i class="ion ion-md-refresh" ></i> Reset</b-btn>
          </b-col>
        </div>
        <div class="row">
          <table v-if="listTruckLog && listTruckLog.length > 0" class="table mb-0 table-hover table-bordered table-striped is_align_middle">
            <thead>
            <tr>
              <th>Người thao tác</th>
              <th>Thời gian</th>
              <th>Nội dung</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(log, index) in listTruckLog" :key="index">
              <td>{{ log.username }}</td>
              <td>{{ moment(log.created).format('DD/MM - HH:mm') }}</td>
              <td class="d-flex flex-column">
                <span v-for="(des, index) in log.message.split(',')" :key="index">{{ des }}</span>
              </td>
            </tr>
            </tbody>
          </table>
          <div v-else>
            Không có lịch sử ghi log
          </div>
        </div>
        <div class="mt-3">
          <b-row>
            <b-col md="6">
              <b-pagination
                :total-rows="totalItemsLog"
                v-model="currentPageLog"
                :per-page="perPageLog"
                v-on:input="buildTruckLog()"
              />
            </b-col>
            <b-col md="6" class="pt-2">
              <span class="text-muted">Trang {{ currentPageLog }} trên {{ totalPageLog }}</span>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal centered header-class="justify-content-center" title="Chi tiết tài sản" ref="detailAsset" size="sm" :hide-footer="true">
        <div class="d-flex flex-column justify-content-start">
          <div class="d-flex" v-if="truckAssetDetail && truckAssetDetail.rcCode">
            <span style="width:135px" class="font-weight-bold">Xe RC:</span><span class="ml-1">{{truckAssetDetail.rcCode[0]}}</span>
          </div>
          <div class="d-flex" v-if="truckAssetDetail && truckAssetDetail.weightCode">
            <span style="width:135px" class="font-weight-bold">Cân:</span>
            <div class="d-flex flex-column ml-1">
              <span v-for="(weight, index) in truckAssetDetail.weightCode" :key="`weight-${index}`">{{weight}}</span>
            </div>
          </div>
          <div class="d-flex" v-if="truckAssetDetail && truckAssetDetail.palletCode">
            <span style="width:135px" class="font-weight-bold">Pallet:</span>
            <div class="d-flex flex-column ml-1">
              <span v-for="(pallet, index) in truckAssetDetail.palletCode" :key="`pallet-${index}`">{{pallet}}</span>
            </div>
          </div>
          <div class="d-flex" v-if="truckAssetDetail && truckAssetDetail.strapCode">
            <span style="width:135px" class="font-weight-bold">Dây chằng số lượng:</span><span class="ml-1">{{truckAssetDetail.strapCode[0]}}</span>
          </div>
        </div>
      </b-modal>
      <b-modal centered header-class="justify-content-center" title="Dừng hoạt động" ref="showDelete" size="lg" :hide-footer="true" @hidden="hideDeleteReason">
        <div class="d-flex flex-column justify-content-start">
          <div class="d-flex align-items-center" style="margin-bottom: 43px !important;">
            <span style="font-weight:bold; font-size: 20px; margin-right: 33px !important;" class="mr-sm-1">Lý do </span>
            <div class="d-flex p-0 justify-content-between ">
              <div class="d-flex" v-for="(reason, index) in reasons" :key="index">
                <span :class="`item-reason ${typeReason === reason.value ? 'pick-up' : ''}`" :type="reason.value" @click="pickUpReason($event)">{{ reason.text }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <b-button class="delete-truck" size="sm" @click="deleteTruck(vehicleDelete)">Xác nhận</b-button>
          </div>
        </div>
      </b-modal>
    </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
// import config from 'config/app.base'
import CompanyProfileService from 'domain/services/company-profile-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectCompanyProfile from 'components/elements/common/SingleSelectCompanyProfile'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import ManageTruckMaintainAgent from './ManageTruckMaintainAgent'
import MultiSelectTruckDriver from 'components/elements/common/MultiSelectTruckDriver'
import MultiSelectManyStation from 'components/elements/common/MultiSelectManyStation'
// import flatPickr from 'vue-flatpickr-component'
// import cycleTime from 'infrastructures/helpers/date.js'
import moment from 'moment'
import VueUploadComponent from 'vue-upload-component'
import Vue from 'vue'
import Multiselect from 'vue-multiselect'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'ManageTruck',
  components: {
    FileUpload: VueUploadComponent,
    LaddaBtn,
    SingleSelectCompanyProfile,
    SingleSelectStation,
    MultiSelectTruckDriver,
    ManageTruckMaintainAgent,
    Multiselect,
    MultiSelectManyStation
    // flatPickr
  },
  data: () => ({
    uploadFile: {
      files: [],
      text: 'Chọn file',
      example: 'https://docs.google.com/spreadsheets/d/1oXo92Ozd9Kapt1GVaDpmuCTCN0ALVI0bi1Z_VPKEVeY/edit?usp=sharing',
      accept:
        'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extensions: 'xls,xlsx',
      minSize: 1024,
      size: 1024 * 1024 * 10,
      thread: 3
    },
    disableUploadFile: false,
    showMaintainAgent: false,
    showUploadFile: false,
    startDateExport: '',
    stopDateExport: '',
    disableExport: false,
    disableExportMaintain: false,
    listTrucks: [],
    truck_code: '',
    truck_rc_code: '',
    companyId: '',
    truckDriver: {
      id: '',
      username: ''
    },
    truckType: null,
    truckStation: null,
    isDeleted: null,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    statusOptions: [
      {value: 0, text: 'Đang hoạt động'},
      {value: 1, text: 'Dừng hoạt động'}
    ],
    truckTypeOptions: [
      {value: 0, text: 'Xe nhà'},
      {value: 1, text: 'Xe thuê'},
      {value: 2, text: 'Xe chành'},
      {value: 3, text: 'Xe đại lý'}
    ],
    truckLeaseType: null,
    optionLeaseTypes: [
      {value: null, text: '-- Chọn loại xe thuê --'},
      {value: 'dry', text: 'Xe khô'},
      {value: 'wet', text: 'Xe ướt'}
    ],
    companySortOrder: false,
    filter: {},
    appLoading: false,
    moment: moment,
    totalItemsLog: 0,
    currentPageLog: 1,
    perPageLog: 10,
    timeSearch: '',
    truckOrder: '',
    listTruckLog: [],
    truckAssetDetail: [],
    vehicleDelete: {},
    reasonDelete: '',
    isPermission: false,
    isViewManagerTruck: false,
    reasons: [
      {value: 1, text: 'Đã thanh lý'},
      {value: 2, text: 'Sửa chữa/Tai nạn giao thông'},
      {value: 3, text: 'Chưa có kế hoạch sử dụng'}
    ],
    typeReason: 0,
    truckCodeIds: [],
    truckCodeOptions: []
  }),

  created () {
    commonHelper.validateStatusEcomTruckFlow()
    if (this.$route.params.code) {
      this.truckCodeIds = [{'text': this.$route.params.code, 'value': ''}]
    }
    this.getCodeTruck()
    this.getAllTruck()
    this.checkPermissionManagerTruck()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    totalPageLog () {
      return Math.ceil(this.totalItemsLog / this.perPageLog)
    }
  },

  watch: {
  },

  methods: {
    showLog (item) {
      this.$refs.truckLog.show()
      this.truckOrder = item.order
      this.buildTruckLog()
    },

    showDetailAsset (item) {
      this.$refs.detailAsset.show()
      this.getDetailAssetByTruck(item.id)
    },

    getDetailAssetByTruck (truckId) {
      let dataRequest = {
        truck_id: truckId
      }
      this.$startLoading()
      CompanyProfileService.getTruckDetail(dataRequest)
        .then(res => {
          if (res.data.success) {
            this.truckAssetDetail = res.data.assets
            console.log(this.truckAssetDetail)
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    buildTruckLog: function () {
      let params = {
        order: this.truckOrder,
        page: this.currentPageLog,
        limit: this.perPageLog,
        timeSearch: this.timeSearch ? moment(this.timeSearch).format('YYYY-MM-DD') : ''
      }
      this.$startLoading()
      CompanyProfileService.buildTruckLog(params)
        .then(res => {
          if (res.data.success) {
            this.listTruckLog = res.data.data.list
            this.totalItemsLog = res.data.data.total
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    searchLog () {
      this.currentPageLog = 1
      this.buildTruckLog()
    },

    resetTime () {
      this.timeSearch = ''
    },

    handleSelectedStation (option) {
      this.truckStation = option ? option.id : null
    },
    searchTruck () {
      this.currentPage = 1
      this.getAllTruck()
    },
    changeExcel (newFile, oldFile) {
      this.uploadFile.text = newFile && newFile.name ? (newFile.name.length > 64 ? (newFile.name.slice(0, 60) + '...') : newFile.name) : 'Chọn file'
    },
    uploadExcelFile () {
      if (!this.uploadFile.files.length) return commonHelper.showMessage('Chưa chọn file', 'warn')
      let dataSend = new FormData()
      dataSend.append('files', this.uploadFile.files[0].file)
      this.disableUploadFile = true
      this.$startLoading()
      return CompanyProfileService.uploadTruckData(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warn')
        }
      }).catch(e => console.error('uploadExcelFile', e)).then(() => {
        this.disableUploadFile = false
        this.$stopLoading()
      })
    },
    exportTruckMaintain () {
      if (!this.startDateExport || !this.stopDateExport) {
        return commonHelper.showMessage('Chọn thời gian xuất dữ liệu bảo dưỡng xe', 'warn')
      }
      if (this.startDateExport && this.stopDateExport && this.startDateExport.getTime() > this.stopDateExport.getTime()) {
        return commonHelper.showMessage('Thời gian bắt đầu không được lớn hơn thời gian kết thúc', 'warn')
      }
      let params = {
        startDate: this.startDateExport ? moment(this.startDateExport).format('YYYY-MM-DD') : '',
        stopDate: this.stopDateExport ? moment(this.stopDateExport).format('YYYY-MM-DD') : ''
      }
      if (this.truckStation) params.stationIds = this.truckStation
      this.$startLoading()
      this.disableExportMaintain = true
      CompanyProfileService.exportTruckMaintain(params)
        .then(res => {
          if (res.data.success) {
            window.location.href = res.data.data
          } else {
            commonHelper.showMessage(res.data.message, 'warn')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc không có quyền thao tác', 'warn')
        })
        .then(() => {
          this.disableExportMaintain = false
          this.$stopLoading()
        })
    },
    exportTruckInfo () {
      let params = {
        companyId: this.companyId,
        code: this.truckCodeIds ? this.truckCodeIds.map((item) => item.text) : [],
        isDeleted: this.isDeleted,
        truckType: this.truckType
      }
      if (this.truckStation) params.stationIds = this.truckStation
      if (this.truckType === 1 && this.truckLeaseType) params.leaseType = this.truckLeaseType
      this.$startLoading()
      this.disableExport = true
      CompanyProfileService.exportTruckInfo(params)
        .then(res => {
          if (res.data.success) {
            window.location.href = res.data.data
          } else {
            commonHelper.showMessage(res.data.message, 'warn')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra', 'warn')
          console.log('error exportTruckInfo', e)
        })
        .then(() => {
          this.disableExport = false
          this.$stopLoading()
        })
    },
    getAllTruck: function () {
      let params = {
        companyId: this.companyId,
        code: this.truckCodeIds ? this.truckCodeIds.map((item) => item.text) : [],
        rcCode: this.truck_rc_code,
        isDeleted: this.isDeleted,
        truckType: this.truckType,
        assignee: this.truckDriver.id,
        page: this.currentPage,
        limit: this.perPage,
        query_code: this.$route.params.code
      }
      this.$startLoading()
      if (this.truckStation) params.stationIds = this.truckStation
      if (this.truckType === 1 && this.truckLeaseType) params.leaseType = this.truckLeaseType
      CompanyProfileService.getAllTruck(params)
        .then(res => {
          if (res.data.success) {
            this.listTrucks = res.data.data
            this.totalItems = res.data.count
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    checkTypeTruck: function (val) {
      if (val === '0') {
        return 'Xe nhà'
      }
      if (val === '1') {
        return 'Xe thuê'
      }
      if (val === '2') {
        return 'Xe chành'
      }
      if (val === '3') {
        return 'Xe đại lý'
      }
    },

    showDelete (vehicle) {
      this.$refs.showDelete.show()
      this.vehicleDelete = vehicle
    },

    hideDeleteReason () {
      this.vehicleDelete = null
      this.reasonDelete = ''
      this.typeReason = 0
    },

    deleteTruck (vehicle) {
      /*      if (!confirm(`Bạn có chắc chắn muốn dừng hoạt động xe tải biển số ${vehicle.code} - đăng ký xe: ${vehicle.vehicle_reg_number} ?`)) {
        return
      } */
      let dataSend = {
        'truckId': vehicle.id,
        'order': vehicle.order,
        'reason_delete': this.reasonDelete || '',
        'type_reason': this.typeReason || ''
      }
      CompanyProfileService.deleteTruck(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getAllTruck()
            this.hideDeleteReason()
            this.$refs.showDelete.hide()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.hideDeleteReason()
            this.$refs.showDelete.hide()
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình dừng hoạt động của xe.'
          })
        })
        .finally(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    revertTruck: function (vehicle) {
      if (!confirm(`Bạn có chắc chắn muốn khôi phục trạng thái hoạt động của xe tải biển số ${vehicle.code} - đăng ký xe: ${vehicle.vehicle_reg_number} ?`)) {
        return
      }
      this.$startLoading()
      let dataSend = {
        'truckId': vehicle.id,
        'order': vehicle.order
      }
      CompanyProfileService.revertTruck(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getAllTruck()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình khôi phục trạng thái hoạt động của xe.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    checkDeleted: function (val) {
      if (val === '0') {
        return false
      }
      return true
    },

    reset: function () {
      this.truck_code = ''
      this.truck_rc_code = ''
      this.companyId = ''
      this.truckType = null
      this.truckStation = null
      this.isDeleted = null
      this.startDateExport = ''
      this.stopDateExport = ''
      this.truckCodeIds = ''
      this.getAllTruck()
    },

    sortByCompany: function () {
      this.companySortOrder = !this.companySortOrder
      if (this.companySortOrder) {
        this.filter['company_order'] = 'asc'
      } else {
        this.filter['company_order'] = 'desc'
      }
      this.currentPage = 1
      this.getAllTruck()
    },

    handleChooseProfileCompany (option) {
      this.companyId = option ? option.id : ''
    },

    handleSelectedDriverOption (option) {
      this.truckDriver = option[0] || ''
    },

    checkPermissionManagerTruck () {
      let params = {companyId: this.companyId}
      CompanyProfileService.checkPermissionManagerTruck(params)
        .then(res => {
          if (res.data.success) {
            this.isPermission = res.data.success
          }
          if (res.data.isViewManagerTruck) {
            this.isViewManagerTruck = true
          }
        })
        .catch(err => {
          console.log('Has error in check User Exception ', err)
        })
    },

    getCodeTruck: function () {
      let dataSend = {
        company_id: ''
      }
      CompanyProfileService.getCodeTruck(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.truckCodeOptions = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    pickUpReason: function (event) {
      let element = event.currentTarget
      this.typeReason = parseInt(element.getAttribute('type'))
    },

    handleSelectedManyStation (option) {
      this.truckStation = option ? option.map(e => e.id).toString() : null
    }
  }
}
</script>

<style scoped>
  .upload-file {
    text-align: center;
    padding-top: 1.3rem;
    width: 100%;
    height: 4rem;
    border: 1px #c5c5c5;
    border-style: dashed;
  }
  .upload-file:hover {
    background-color: #b6e6b6;
    border: 1px #c5c5c5;
    border-style: dashed;
  }
  .table td {
      vertical-align: middle;
  }
  .only-bottom-border{
      border-top: none;
      border-left: none;
      border-right: none;
  }
  .delete-truck {
    background-color: #069255;
    padding: 5px 0;
    width: 173px;
    height: 40px;
    font-size: 16px;
  }
  .pick-up {
    color: #ffffff !important;
    background-color: #219653 !important;
  }
  .item-reason {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 8px;
    gap: 10px;
    height: 29px;
    border: 1px solid #219653;
    border-radius: 100px;
    flex: none;
    order: 0;
    flex-grow: 0;
    color: #219653;
    margin-right: 10px;
  }
</style>

<style>
.vc-text-base {
  font-size: inherit;
}
</style>
