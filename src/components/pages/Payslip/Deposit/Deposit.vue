<template>
    <div>
        <div class="ui-block">
            <div class="header-container">
                <div class="row align-items-center">
                    <div class="col-md-4">
                        <h4 class="ui-block-heading m-0">Quản lý cọc</h4>
                    </div>
                    <div class="col-md-8 text-right">
                      <b-btn type="button" variant="ghtk" @click="searchDeposit()"><i
                            class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                      </b-btn>
                      <div v-if="permission.export && checkPermissionExportAllPage()" class="d-inline-block ml-1">
                        <b-btn v-if="exporting" variant="ghtk" class="exporting-btn">
                              <span>
                                <div class="sk-folding-cube sk-primary">
                                  <div class="sk-cube1 sk-cube"></div>
                                  <div class="sk-cube2 sk-cube"></div>
                                  <div class="sk-cube4 sk-cube"></div>
                                  <div class="sk-cube3 sk-cube"></div>
                                </div>
                                Đang xuất...</span>
                        </b-btn>
                        <div class="d-inline-block" v-else-if="exported" @click="setDownloaded">
                            <b-btn variant="ghtk" :href="URLExportedFile" target="blank">
                                <i class="ion ion-md-download"></i> Tải xuống
                            </b-btn>
                        </div>
                        <b-btn v-else variant="ghtk" @click="exportDeposit">
                            <i class="ion ion-md-print"></i> Xuất cọc
                        </b-btn>
                      </div>
                      <span v-if="groupId == 8">
                        <b-btn variant="ghtk" @click="showModalInitial(true)">
                            <span class="ladda-label"><i class="sidenav-icon ion ion-md-add"></i>Thêm thông tin cọc</span>
                        </b-btn>
                        <b-button class="btn-ghtk mr-3" v-b-toggle.collapseUpload
                            @click="showInputDataUserDisabled">
                            <span class="ladda-label"><i class="sidenav-icon ion ion-md-cloud-upload"></i>Upload cọc nhân viên đã nghỉ việc</span>
                        </b-button>
        <!--                <b-button class="btn btn-outline-success ml-3" v-if="groupId == 8" v-b-toggle.collapseUpload-->
        <!--                          @click="showInputOldData">-->
        <!--                    <span class="ladda-label"><i class="sidenav-icon ion ion-md-cloud-upload"></i>Upload cọc cũ</span>-->
        <!--                </b-button>-->
                        <b-button class="btn-ghtk mr-3" v-b-toggle.collapseUpload
                                  @click="showInputDeposit">
                            <span class="ladda-label"><i class="sidenav-icon ion ion-md-cloud-upload"></i>Upload cọc trừ hàng tháng</span>
                        </b-button>
                        <b-button class="btn-ghtk mr-3" v-b-toggle.collapseUpload
                                  @click="showInputRefund">
                            <span class="ladda-label"><i class="sidenav-icon ion ion-md-cloud-upload"></i>Upload cọc hoàn</span>
                        </b-button>
                      </span>
                      <b-button class="btn-ghtk mr-3" v-b-modal.modal-list-refund>
                          <span class="ladda-label"><i class="sidenav-icon ion ion-md-document"></i>Danh sách yêu cầu tiền hoàn cọc</span>
                      </b-button>
                      <modal-list-refund v-bind:groupId="groupId"></modal-list-refund>
                      <b-button class="btn-ghtk" v-b-modal.modal-users-not-have-deposit v-if="userInfo && userInfo.hasOwnProperty('User') && userInfo.User.username === 'congam'">
                          <span class="ladda-label"><i class="sidenav-icon ion ion-md-document"></i>Danh sách nhân viên chưa config cọc</span>
                      </b-button>
                      <modal-users-not-have-deposit></modal-users-not-have-deposit>
                    </div>
                </div>
                <b-form-file
                        v-model="fileExcelDataUserDisabled"
                        style="display: none"
                        ref="fileInputDataUserDisabled"
                ></b-form-file>
                <b-form-file
                        v-model="fileExcelOldData"
                        style="display: none"
                        ref="fileInputOldData"
                ></b-form-file>
                <b-form-file
                        v-model="fileExcelDeposit"
                        style="display: none"
                        ref="fileInputDeposit"
                ></b-form-file>
                <b-form-file
                        v-model="fileExcelRefund"
                        style="display: none"
                        ref="fileInputRefund"
                ></b-form-file>
            </div>
        </div>
        <div>
            <div class="mb-2 mt-2">
                <b-row class="h-col-50">
                    <b-col md="2">
                        <input placeholder="Mã Profile" v-model="staff_code" type="number" min="9" max="12"
                               @keyup.enter="searchDeposit" class="form-control"/>
                    </b-col>
                    <b-col md="2">
                        <input type="text" placeholder="username, Họ tên" v-model="keyword" @keyup.enter="searchDeposit"
                               class="form-control"/>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-profile-region
                                @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-province
                                @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-station :province-id="provinceId"
                                               @handleSelectedStation="handleSelectedStation"></single-select-station>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-department
                                @handleSelectedDepartment="handleSelectedDepartment"></single-select-department>
                    </b-col>
                    <b-col md="2" class="mb-2 z-3">
                        <single-select-position @handleSelectedPosition="handleSelectedPosition"
                                                :department-id="departmentId"
                                                :position-job="positionId"
                                                ></single-select-position>
                    </b-col>
                    <b-col md="2" class="mb-2 z-3">
                        <single-select-work-type @handleSelectedWorkType="handleSelectedWorkType"
                                                 :position-job="positionId"
                                                 :work-type-id="work_type_id"
                                                 ></single-select-work-type>
                    </b-col>
                    <b-col md="2" class="md-2">
                        <b-form-select v-model="status" :options="optionStatus" name="status" class="mb-3">
                            <template v-slot:first>
                                <option :value="null">-- Trạng thái cọc --</option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col md="2" class="md-2">
                        <datepicker
                                v-model="join_date"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                placeholder="Ngày vào làm"
                                :required="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </b-col>
                    <b-col md="2" class="md-2">
                        <b-form-select v-model="approved" :options="optionApproved" name="approved" class="mb-3">
                            <template v-slot:first>
                                <option :value="null">-- Trạng thái duyệt --</option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col md="2" class="mb-2">
<!--                        <flat-pickr v-model="range_time" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/>-->
                    </b-col>
                </b-row>
            </div>
            <div class="list-request-refund d-flex ">
            </div>
            <div class="mt-2">
                <b-collapse id="collapseUpload">
                    <b-btn variant="ghtk">
                        <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
                        <a :href="'/admin/files/templates/template_user_nghi_viec.xlsx'" v-if="isUploadDataUserDisabled"
                           class="text-white" target="_blank">File mẫu danh sách nhân viên chưa có bản ghi cọc</a>
                        <a :href="'/admin/files/templates/template_coc_cu.xlsx'" v-if="isUploadOldData"
                           class="text-white" target="_blank">File mẫu cọc cũ</a>
                        <a :href="'/admin/files/templates/template_coc_tru_hang_thang.xlsx'" v-if="isUploadDeposited"
                           class="text-white" target="_blank">File mẫu cọc trừ</a>
                        <a :href="'/admin/files/templates/template_coc_hoan.xlsx'" v-if="isUploadRefund"
                           class="text-white" target="_blank">File mẫu cọc hoàn</a>
                    </b-btn>
                    <b-btn v-b-toggle.collapse-deposit variant="danger">Quy ước File upload</b-btn>
                    <b-collapse id="collapse-deposit" class="mt-2">
                        <b-card>
                            <p class="card-text">
                                - Chỉ cho phép upload file excel, tên file không nên để tiếng viêt có dấu. <br/>
                                - Thời gian để ở định dạng YYYY-MM-DD, ví dụ: 2020-04-20 <br/>
                                - Số tiền theo định dạng: 1000000 (không có . hoặc , hoặc khoảng trắng).<br/>
                            </p>
                        </b-card>
                    </b-collapse>
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                            <tr>
                                <td colspan="12">
                                    <div class="text-center p-3">
                                        <h4>Kéo thả file để upload
                                            <div class="text-muted small my-3">hoặc</div>
                                        </h4>
                                        <b-btn v-if="isUploading" variant="outline-ghtk" class="exporting-btn">
                                          <span>
                                            <div class="sk-folding-cube sk-primary">
                                              <div class="sk-cube1 sk-cube"></div>
                                              <div class="sk-cube2 sk-cube"></div>
                                              <div class="sk-cube4 sk-cube"></div>
                                              <div class="sk-cube3 sk-cube"></div>
                                            </div>
                                            Đang xử lý...</span>
                                        </b-btn>
                                        <b-button class="btn btn-outline-ghtk" @click="triggerInputDataUserDisabled"
                                                  v-if="!isUploading && isUploadDataUserDisabled">
                                            <span class="ladda-label"><i
                                                    class="sidenav-icon ion ion-md-cloud-upload"></i>Chọn file</span>
                                        </b-button>
                                        <b-button class="btn btn-outline-ghtk" @click="triggerInputOldData"
                                                  v-if="!isUploading && isUploadOldData">
                                            <span class="ladda-label"><i
                                                    class="sidenav-icon ion ion-md-cloud-upload"></i>Chọn file</span>
                                        </b-button>
                                        <b-button class="btn btn-outline-ghtk" @click="triggerInputDeposit"
                                                  v-if="!isUploading && isUploadDeposited">
                                            <span class="ladda-label"><i
                                                    class="sidenav-icon ion ion-md-cloud-upload"></i>Chọn file</span>
                                        </b-button>
                                        <b-button class="btn btn-outline-ghtk" @click="triggerInputRefund"
                                                  v-if="!isUploading && isUploadRefund">
                                            <span class="ladda-label"><i
                                                    class="sidenav-icon ion ion-md-cloud-upload"></i>Chọn file</span>
                                        </b-button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </b-collapse>
            </div>
            <div class="emp-deposit position-relative">
                <!--                <div class="emp-deposit__sumary">-->
                <!--                    <div class="row">-->
                <!--                        <div class="col-md-3">-->
                <!--                            <span>Tổng cọc cần thu:</span><span><strong>120.000.000</strong> vnd</span>-->
                <!--                        </div>-->
                <!--                        <div class="col-md-3">-->
                <!--                            <span>Tổng cọc đã nhận:</span><span><strong>100.000.000</strong> vnd</span>-->
                <!--                        </div>-->
                <!--                        <div class="col-md-3">-->
                <!--                            <span>Số người cọc thiếu:</span><span><strong>12</strong> người</span>-->
                <!--                        </div>-->
                <!--                    </div>-->
                <!--                </div>-->
                    <div class="border">
                        <!-- paging -->
                        <div class="paging my-1">
                              <div class="z-0 d-inline-block">
                                <b-pagination
                                  class="mb-1"
                                  size="sm"
                                  align="left"
                                  v-model="pageData.currentPage"
                                  :total-rows="pageData.totalItems"
                                  :per-page="pageData.perPage"
                                  @input="search"
                                >
                                </b-pagination>
                              </div>
                              <b class="float-right">Trang {{ pageData.currentPage }}/{{ totalPages }}</b>
                        </div>
                        <div class="table-result" :class="scrollMode && 'table-sticky'">
                            <table class="table mb-0 table-bordered" :class="scrollMode && 'table-sm'">
                                <thead>
                                <tr>
                                    <th>Mã NV</th>
                                    <th>Kho</th>
                                    <th>Họ tên</th>
                                    <th>Vị trí</th>
                                    <th>Loại hình làm việc</th>
                                    <th>Ngày vào làm</th>
                                    <th>Tổng tiền cần cọc</th>
                                    <th>Tổng tiền đã cọc</th>
                                    <th>Tổng tiền hoàn trả</th>
                                    <th>Số lần nộp</th>
                                    <th v-if="groupId == 8">Chưa duyệt</th>
                                    <th>Trạng thái</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody v-loading="appLoading" class="position-relative mih-5re">
                                <tr v-for="(item, idx) in listData" :key="idx">
                                    <td>{{item.staff_code}}</td>
                                    <td>{{item.station.toString()}}</td>
                                    <td>
                                      <p
                                        :class="codGroupIds.includes(parseInt(item.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                                        class="member-info-item"
                                        @click="gotoCodProfile(item.group_id, item.user_id)">
                                        {{item.fullname}} </p>
                                      </td>
                                    <td>{{item.position.toString()}}</td>
                                    <td>{{item.work_types.toString()}}</td>
                                    <td>{{item.join_date}}</td>
                                    <td v-numeral v-text="item.payment_money"></td>
                                    <td v-numeral v-text="item.total_deposited_money"></td>
                                    <td v-numeral v-text="item.refund_money"></td>
                                    <td>{{item.count}}</td>
                                    <td v-if="groupId == 8">{{item.count_not_approved}}</td>
                                    <td v-if="parseInt(item.status) == 1">
                                        <i class="ion ion-ios-star-half red-icon"></i> Thiếu cọc
                                    </td>
                                    <td v-else-if="parseInt(item.status) == 2">
                                        <i class="ion ion-ios-star green-icon"></i> Đã nộp đủ
                                    </td>
                                    <td v-else-if="parseInt(item.status) == 3">
                                        <i class="ion ion-ios-star-outline green-icon"></i> Hoàn trả thiếu
                                    </td>
                                    <td v-else-if="parseInt(item.status) == 4">
                                        <i class="ion ion-ios-star-outline red-icon"></i> Hoàn trả đủ
                                    </td>
                                    <td v-else>
                                        Không có dữ liệu
                                    </td>
                                    <td>
                                        <b-btn class="btn btn-sm btn-outline-ghtk" title="Xem chi tiết"
                                               @click="selectDeposit(item, modal.detail)">
                                            <i class="ion ion-md-eye cursor-pointer"></i>
                                        </b-btn>

                                        <b-btn class="btn btn-sm btn-outline-ghtk" title="Chỉnh sửa cọc" v-if="permission.edit_deposit"
                                               @click="selectDeposit(item, modal.edit)">
                                            <i class="ion ion-md-create cursor-pointer"></i>
                                        </b-btn>

                                        <b-btn class="btn btn-sm btn-outline-danger" title="Xóa cọc" v-if="permission.delete_deposit"
                                               @click="deleteDeposit(item)">
                                            <i class="ion ion-md-trash cursor-pointer"></i>
                                        </b-btn>

                                        <span @click="selectDepositId(item)" v-if="parseInt(item.status) !== 2">
                                                <b-btn class="btn btn-sm btn-outline-ghtk" title="Thêm thông tin cọc"
                                                       v-b-modal.modal-add-deposit v-if="permission.add_deposit">
                                            <i class="ion ion-md-add-circle cursor-pointer"></i>
                                        </b-btn>
                                        </span>

                                        <b-btn class="btn btn-sm btn-outline-warning" title="Yêu cầu tiền hoàn cọc" v-if="permission.require_refund && addRequestRefundPermission(item)"
                                               @click="selectDeposit(item, modal.refund)">
                                            <i class="ion ion-logo-usd cursor-pointer"
                                               title="Yêu cầu tiền hoàn cọc"></i>
                                        </b-btn>
                                    </td>
                                </tr>
                                <tr v-show="!listData || !listData.length">
                                  <td class="text-center" colspan="20">
                                    <div class="mih-5re align-center"><b>Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.</b></div>
                                  </td>
                                </tr>
                                </tbody>
                            </table>

                            <modal-detail-deposit :item="depositModal"
                                                  :groupId="groupId"
                                                  @onUpdateSuccess="search()"></modal-detail-deposit>
<!--                            <modal-detail-deposit v-if="viewDepositDetail"-->
<!--                                                  v-bind:item="depositModal"></modal-detail-deposit>-->
                            <modal-add-deposit v-if="permission.add_deposit" :deposit="tmpDeposit"
                                               @updateData="search()"></modal-add-deposit>
                            <modal-request-refund :item="depositModal"></modal-request-refund>
                            <modal-initial-deposit @updatedate="search()"
                                                   :deposit="depositModal"></modal-initial-deposit>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker'
import ManageListCod from 'domain/entities/ManageListCod'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import depositService from 'domain/services/deposit-service'
import ModalAddDeposit from './ModalAddDeposit'
import ModalDetailDeposit from './ModalDetailDeposit'
import ModalRequestRefund from './ModalRequestRefund'
import ModalUsersNotHaveDeposit from './ModalUsersNotHaveDeposit'
import ModalListRefund from './ModalListRefund'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import ModalInitialDeposit from './ModalInitialDeposit'
import { mapGetters } from 'vuex'

// mixins
import ExportMixin from 'mixins/ExportMixin'

export default {
  name: 'DepositManager',

  mixins: [ExportMixin],

  props: {
    scrollMode: {
      defautl: false,
      type: Boolean
    }
  },

  components: {
    ModalInitialDeposit,
    SingleSelectModule,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectProfileRegion,
    SingleSelectPosition,
    SingleSelectDepartment,
    SingleSelectWorkType,
    ModalDetailDeposit,
    ModalAddDeposit,
    ModalRequestRefund,
    ModalUsersNotHaveDeposit,
    ModalListRefund,
    Datepicker
  },

  data: () => ({
    groupIdHr: ['3'],
    groupIdCash: ['7', '24'],
    appLoading: false,
    searchText: '',
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10
    },
    staff_code: '',
    keyword: '',
    region: '',
    provinceId: '',
    stationId: '',
    departmentId: '',
    departmentName: '',
    positionId: '',
    work_type_id: '',
    status: null,
    join_date: null,
    approved: null,
    listData: [],
    depositModal: {},
    tmpDeposit: '',
    fileExcelDataUserDisabled: [],
    fileExcelOldData: [],
    fileExcelDeposit: [],
    fileExcelRefund: [],
    isEnough: true,
    isNotEnough: true,
    isRefund: true,
    groupId: '',
    codGroupIds: ManageListCod.codGroupIds,
    optionStatus: [
      {value: 1, text: 'Thiếu cọc'},
      {value: 5, text: 'Cần trích cọc'},
      {value: 2, text: 'Đã nộp đủ'},
      {value: 3, text: 'Hoàn trả thiếu'},
      {value: 4, text: 'Hoàn trả đủ'}
    ],
    optionApproved: [
      {value: 1, text: 'Có bản ghi chưa duyệt'},
      {value: 2, text: 'Có bản ghi đã duyệt'},
      {value: 3, text: 'Không có bản ghi nào'}
    ],
    range_time: null,
    time_format: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    URLExportedFile: '#',
    exporting: false,
    exported: false,
    downloaded: false,
    isAdd: true,
    isEdit: true,
    isUploading: false,
    isUploadDataUserDisabled: false,
    isUploadOldData: false,
    isUploadDeposited: false,
    isUploadRefund: false,
    modal: {
      detail: 1,
      edit: 2,
      refund: 3
    },
    permission: {}
  }),

  created () {
    if (this.$route.query.status) this.status = this.$route.query.status
    this.getGroupIdOfUser()
    this.getPermissionDeposit()
    this.search()
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),

    totalPages () {
      return Math.ceil(this.pageData.totalItems / this.pageData.perPage)
    },
    addDepositPermission () {
      return this.groupIdHr.includes(this.groupId)
    }
    //
    // viewDepositDetail () {
    //   return this.groupIdHr.includes(this.groupId) || this.groupIdCash.includes(this.groupId)
    // }
  },

  watch: {
    fileExcelDataUserDisabled: function (newVal, oldVal) {
      this.uploadDataUserDisabled(newVal)
    },
    fileExcelOldData: function (newVal, oldVal) {
      this.uploadOldData(newVal)
    },
    fileExcelDeposit: function (newVal, oldVal) {
      this.uploadDeposit(newVal)
    },
    fileExcelRefund: function (newVal, oldVal) {
      this.uploadRefund(newVal)
    },
    range_time: function (newVal, oldVal) {
      this.getStartEndFromTimeRange()
    }
  },

  methods: {
    addRequestRefundPermission (item) {
      return parseInt(item.status) !== 4
    },
    getPermissionDeposit () {
      depositService.getPermissionDeposit()
        .then(response => {
          if (response.data.success) {
            this.permission = response.data.data
          }
        })
    },

    setDownloaded () {
      this.downloaded = true
      this.exported = false
    },

    checkJobStatus (jobId) {
      let getJobStat = setInterval(() => {
        depositService.checkJobStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              if (response.data.job_status === 'closed') {
                clearInterval(getJobStat)
                if (response.data.message) {
                  this.$notify({
                    group: 'default',
                    type: 'text-dark bg-warning',
                    title: 'Xảy ra lỗi',
                    text: response.data.message
                  })
                } else {
                  this.exported = true
                  this.URLExportedFile = response.data.file_path
                  this.$notify({
                    group: 'default',
                    type: 'text-white bg-primary',
                    title: 'Xuất file thành công',
                    text: 'Đã xuất xong file cọc'
                  })
                  this.downloaded = false
                }
                this.exporting = false
              }
            } else {
              this.$notify({
                group: 'default',
                type: 'text-dark bg-warning',
                title: 'Xảy ra lỗi',
                text: response.data.message
              })
              clearInterval(getJobStat)
              this.exporting = false
            }
          })
      }, 2000)
    },

    exportDeposit () {
      let timeRange = this.getStartEndFromTimeRange()
      let params = {
        staff_code: this.staff_code,
        keyword: this.keyword,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        join_date: this.join_date,
        departmentId: this.departmentId,
        positionId: this.positionId,
        workTypeId: this.work_type_id,
        status: this.status,
        approved: this.approved,
        from: timeRange.from,
        to: timeRange.to
      }
      this.exporting = true
      depositService.exportDeposit(params)
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            this.$notify({
              group: 'default',
              type: 'text-dark bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
            this.exporting = false
          }
        })
    },

    getStartEndFromTimeRange () {
      if (!this.range_time) return {}
      let range = this.range_time.split('to').map(item => item.trim())
      if (range.length === 2) {
        return ({
          from: moment(range[0], 'DD-MM-YYYY').format('YYYY-MM-DD'),
          to: moment(range[1], 'DD-MM-YYYY').format('YYYY-MM-DD')
        })
      }
    },

    searchDeposit () {
      this.pageData.currentPage = 1
      this.search()
    },

    gotoCodProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    },

    search () {
      this.appLoading = true
      let timeRange = this.getStartEndFromTimeRange()
      let params = {
        staff_code: this.staff_code,
        keyword: this.keyword,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        join_date: this.join_date,
        departmentId: this.departmentId,
        positionId: this.positionId,
        workTypeId: this.work_type_id,
        status: this.status,
        approved: this.approved,
        from: timeRange.from,
        to: timeRange.to,
        page: this.pageData.currentPage,
        limit: this.pageData.perPage
      }
      depositService.getAll(params)
        .then(res => {
          if (res.data.success) {
            this.listData = res.data.data
            this.pageData.totalItems = res.data.total_item
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    deleteDeposit: function (deposit) {
      if (!confirm('Bạn chắc chắn muốn xóa thông tin đặt cọc của ' + deposit.fullname + ' ?')) {
        return
      }
      let dataSend = {
        id: deposit.deposit_id
      }
      depositService.deleteDeposit(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.search()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getGroupIdOfUser: function () {
      depositService.getGroupIdOfUser()
        .then((res) => {
          if (res.data.success) {
            this.groupId = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    selectDeposit (item, isModal) {
      this.depositModal = item
      if (isModal === 1) {
        this.$bvModal.show('modal-detail-deposit')
      }
      if (isModal === 2) {
        this.$bvModal.show('modal-initial-deposit')
      }
      if (isModal === 3) {
        this.$bvModal.show('modal-request-refund')
      }
    },

    selectDepositId (deposit) {
      this.tmpDeposit = deposit
    },

    triggerInputDataUserDisabled () {
      this.$refs.fileInputDataUserDisabled.$el.childNodes[0].click()
    },

    triggerInputOldData () {
      this.$refs.fileInputOldData.$el.childNodes[0].click()
    },

    triggerInputDeposit () {
      this.$refs.fileInputDeposit.$el.childNodes[0].click()
    },

    triggerInputRefund () {
      this.$refs.fileInputRefund.$el.childNodes[0].click()
    },

    uploadDataUserDisabled (file) {
      this.isUploading = true
      let formData = new FormData()
      formData.append('file', file)

      depositService.insertDataUserDisabled(formData)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.isUploading = false
            this.search()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    uploadOldData (file) {
      this.isUploading = true
      let formData = new FormData()
      formData.append('file', file)

      depositService.insertOldDeposit(formData)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.isUploading = false
            this.search()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    uploadDeposit (file) {
      this.isUploading = true
      let formData = new FormData()
      formData.append('file', file)

      depositService.insertDepositsByExcel(formData)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.isUploading = false
            this.search()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    uploadRefund (file) {
      this.isUploading = true
      let formData = new FormData()
      formData.append('file', file)

      depositService.insertRefundsByExcel(formData)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.isUploading = false
            this.search()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    showModalInitial (isAdd) {
      if (isAdd) {
        this.depositModal = {}
      }
      this.$bvModal.show('modal-initial-deposit')
    },

    showInputDataUserDisabled () {
      this.isUploadDataUserDisabled = true
      this.isUploadOldData = false
      this.isUploadDeposited = false
      this.isUploadRefund = false
    },

    showInputOldData () {
      this.isUploadDataUserDisabled = false
      this.isUploadOldData = true
      this.isUploadDeposited = false
      this.isUploadRefund = false
    },

    showInputDeposit () {
      this.isUploadDataUserDisabled = false
      this.isUploadOldData = false
      this.isUploadDeposited = true
      this.isUploadRefund = false
    },

    showInputRefund () {
      this.isUploadDataUserDisabled = false
      this.isUploadOldData = false
      this.isUploadDeposited = false
      this.isUploadRefund = true
    },
    // handleSelectedModule (option) {
    //   this.moduleId = option ? option.id : ''
    // },

    handleSelectedRegion (option) {
      this.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : ''
    },

    handleSelectedDepartment: function (option) {
      this.departmentName = option ? option.name : ''
      this.departmentId = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    },
    handleSelectedWorkType (option) {
      this.work_type_id = option ? option.id : ''
    }
  }
}
</script>
<style static src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped lang="scss">

    th {
      background: #eee;
    }
    .table-result {
      max-height: 70vh;
    }
    .header-container .button {
        float: right;
    }

    .h-col-50 .col-md-2 {
        max-height: 50px;
    }

    .content-header {
        border-bottom: 1px solid #dfe1e3;
        height: 48px;
    }

    .content-header button {
        float: right;
        margin-left: 20px;
    }

    .content-title {
        font-size: 20px;
        font-weight: 700;
        line-height: 36px;
    }

    .filter-advance {
        margin-left: auto;
    }

    .emp-deposit {
        padding: 10px 0;
        min-height: 120px;
    }

    .emp-deposit__sumary {
        padding: 5px;
    }

    .table i:hover {
        cursor: pointer;
    }

    table {
        text-align: center;
    }

    .align-items {
        display: flex;
        align-items: center;
    }

    .exporting-btn {
        span {
            position: relative;
            padding-left: 20px
        }

        .sk-folding-cube.sk-primary {
            position: absolute;
            height: 12px;
            width: 12px;
            top: -37px;
            left: 0
        }
    }
</style>
