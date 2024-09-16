<template>
    <div>
        <b-modal :no-enforce-focus='true' modal-class="modal-xxl" id="modal-list-refund" :hide-footer="true" :hide-header="true" @show="getListRefunds(pageData.currentPage, pageData.perPage, true)" static>
            <div class="deposit-history">
                <h4>Danh sách yêu cầu hoàn cọc:</h4>
                <div class="search-form-refund">
                    <div class="row">
                        <div class="col-md-2">
                            <b-input type="text" placeholder="Nhập tên, username hoặc mã nhân viên" v-model="searchText" @keyup.enter="getListRefunds(pageData.currentPage, pageData.perPage, true)"/>
                        </div>
                        <div class="col-md-2">
                            <v-date-picker mode="range" v-model="range_time" locale="vi"
                                           color="green"
                                           :input-props="{placeholder: 'Chọn thời gian dự kiến hoàn cọc', style: 'font-size:14px; line-height: unset' }"
                                           @keyup.enter="getListRefunds(pageData.currentPage, pageData.perPage, true)"/>
                        </div>
                        <div class="col-md-2">
                            <single-select-profile-region :region="region"
                                    @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
                        </div>
                        <div class="col-md-2">
                            <single-select-province :custom-class="''" :region-name="region" :province-id="provinceId"
                                    @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                        </div>
                        <div class="col-md-2">
                            <single-select-station :custom-class="''" :province-id="provinceId"
                                                   @handleSelectedStation="handleSelectedStation"></single-select-station>
                        </div>
                        <div class="col-md-2">
                            <b-form-select v-model="status" :options="statusOptions" class="only-bottom-border">
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn trạng thái --</option>
                                </template>
                            </b-form-select>
                        </div>
                        <div class="col-md-12 text-right mt-2">
                            <div>
                                <b-btn v-if="exporting" variant="outline-success" class="exporting-btn">
                              <span>
                                <div class="sk-folding-cube sk-primary">
                                  <div class="sk-cube1 sk-cube"></div>
                                  <div class="sk-cube2 sk-cube"></div>
                                  <div class="sk-cube4 sk-cube"></div>
                                  <div class="sk-cube3 sk-cube"></div>
                                </div>
                                Đang xuất...</span>
                                </b-btn>
                                <div class="d-inline-block float-right" v-else-if="exported" @click="setDownloaded">
                                    <b-btn variant="success" :href="URLExportedFile" target="blank">
                                        <i class="ion ion-md-download"></i> Tải xuống
                                    </b-btn>
                                </div>
                                <b-btn v-else variant="outline-success" @click="exportDepositRefund" class="float-right">
                                    <i class="ion ion-md-print"></i> Xuất danh sách hoàn cọc
                                </b-btn>
                            </div>
                            <b-button class="btn btn-primary" v-on:click="getListRefunds(pageData.currentPage, pageData.perPage, true)"><i class="sidenav-icon ion ion-md-search"></i>Tìm kiếm</b-button>
                            <b-button class="btn btn-secondary" @click="resetSearch()"><i class="sidenav-icon fas fa-eraser mr-1"></i> Xóa lọc</b-button>
                        </div>
                    </div>
                </div>

                <table  class="table mb-0 table-bordered table-vertical">
                    <thead class="thead-light">
                    <tr>
                        <th>STT</th>
                        <th>Mã nhân viên</th>
                        <th>Tên nhân viên</th>
                        <th>Tỉnh</th>
                        <th>Kho</th>
                        <th>Tổng tiền đã đóng</th>
                        <th>Số tiền yêu cầu</th>
                        <th>Ngày yêu cầu</th>
                        <th>Ngày nghỉ việc</th>
                        <th>Ngày dự kiến hoàn cọc</th>
                        <th>Người tạo yêu cầu</th>
                        <th>Lý do hủy duyệt</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody v-for="(refund,index) in listRefunds">
                    <tr>
                        <td>{{(pageData.currentPage - 1) * pageData.perPage + index + 1}}</td>
                        <td>{{refund.staff_code}}</td>
                        <td>{{refund.staff_name}}</td>
                        <td>{{refund.province}}</td>
                        <td>{{refund.station}}</td>
                        <td v-numeral v-text="refund.total_deposited_money"></td>
                        <td v-numeral v-text="refund.request_money"></td>
                        <td>{{moment(refund.created)}}</td>
                        <td>{{moment(refund.resign_date)}}</td>
                        <td>{{moment(refund.date_expect_refund)}}</td>
                        <td>{{refund.created_by_fullname}}</td>
                        <td>{{refund.reason}}</td>
                        <td v-if="groupId == 8">
                            <div>
                                <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                                    <template slot="button-content" v-if="refund.status == 1">
                                        <i class="ion ion-ios-checkmark-circle-outline red-icon"  title="Chưa duyệt"></i>
                                    </template>
                                    <template slot="button-content" v-else-if="refund.status == 2">
                                        <i class="ion ion-ios-checkmark-circle green-icon" title="Đã duyệt"></i>
                                    </template>
                                    <template slot="button-content" v-else-if="refund.status == 3">
                                        <i class="ion ion-ios-remove-circle red-icon" title="Hủy duyệt"></i>
                                    </template>
                                    <b-dropdown-item href="#" @click="approvedRefund(refund.refund_id, 2)">Duyệt</b-dropdown-item>
<!--                                    <b-dropdown-item href="#" @click="approvedRefund(refund.refund_id, 1)">Hủy duyệt</b-dropdown-item>-->
                                    <b-dropdown-item href="#" @click="approvedRefund(refund.refund_id, 3)">Hủy duyệt</b-dropdown-item>
                                </b-dropdown>
                            </div>
                        </td>

                        <td v-if="groupId != 8">
                            <span v-if="refund.status == 1">Chưa duyệt</span>
                            <span v-if="refund.status == 2">Đã duyệt</span>
                            <span v-if="refund.status == 3">Yêu cầu bị hủy</span>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <b-card-body class="pt-0 pb-3">
                    <div class="row">
                        <div class="col-sm pt-3">
                            <b-pagination :total-rows="pageData.totalItems"
                                          v-model="pageData.currentPage"
                                          :per-page="pageData.perPage"
                                          v-on:change="pageChanged"
                            />
                        </div>
                        <div class="col-sm text-sm-left text-center pt-3">
                            <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ totalPages }}</span>
                        </div>
                    </div>
                </b-card-body>
                <!-- / Pagination -->
            </div>
            <b-modal v-model="showModalReason" title="Nhập lý do"  :hide-footer="true" @hide="cancelApprove()">
                <b-form-input
                    v-model="reason"
                    placeholder="Nhập lý do không duyệt"
                    v-validate="'required'"
                    name="reason-not-approved"
                   ></b-form-input>
                <span v-show="errors.firstRule('reason-not-approved') == 'required'" class="help is-danger">Không để trống trường này </span>
                <div class="text-center mt-3">
                    <b-btn variant="secondary"  @click="cancelApprove()">Hủy</b-btn>
                    <b-btn variant="primary" @click="approvedRefund()">Xác nhận</b-btn>
                </div>
            </b-modal>
        </b-modal>
    </div>
</template>

<style scoped lang="scss">
    table {
        text-align: center;
    }
    .table-vertical td {
        vertical-align: middle;
    }
    .gray-icon {
        color: gray;
    }
    .search-form-refund {
        margin-bottom: 20px;
    }
    .pt-8 {
        padding-top: 8px;
    }
    .fz-16 {
        font-size: 16px;
    }
    .exporting-btn {
        span {
            position: relative; padding-left: 20px
        }
        .sk-folding-cube.sk-primary{
            position: absolute; height: 12px; width: 12px; top: -37px; left: 0
        }
    }
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>

<script>
import depositService from 'domain/services/deposit-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)
export default {
  name: 'modal-list-refund',

  components: {
    SingleSelectProfileRegion,
    SingleSelectStation,
    SingleSelectProvince
  },

  props: [
    'groupId'
  ],

  data: () => ({
    statusOptions: [
      {value: 1, text: 'Chưa duyệt'},
      {value: 2, text: 'Đã duyệt'},
      {value: 3, text: 'Yêu cầu bị bủy'}
    ],
    listRefunds: [],
    searchText: '',
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 6
    },
    isApproved: true,
    isNotApproved: true,
    isCanceled: true,
    downloaded: false,
    URLExportedFile: '#',
    range_time: null,
    time_format: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    exportList: true,
    exporting: false,
    exported: false,
    showModalReason: false,
    reason: '',
    status: null,
    refundId: null,
    refundStatus: null,
    region: '',
    provinceId: '',
    stationId: ''
  }),

  created () {
  },

  computed: {
    totalPages () {
      return Math.ceil(this.pageData.totalItems / this.pageData.perPage)
    }
  },

  watch: {
  },

  methods: {
    cancelApprove: function () {
      this.showModalReason = false
      this.reason = ''
    },
    moment: function (data) {
      if (!data) return ''
      return moment(data).format('DD-MM-YYYY')
    },
    setDownloaded () {
      this.downloaded = true
      this.exported = false
    },
    exportDepositRefund () {
      this.exporting = true
      let timeFormat = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let dataSend = {
        'search': this.searchText,
        'region': this.region,
        'provinceId': this.provinceId,
        'stationId': this.stationId,
        'status': this.status,
        'from': timeFormat.from,
        'to': timeFormat.to
      }
      depositService.exportDepositRefund(dataSend)
        .then(res => {
          if (res.data.success) {
            this.exported = true
            this.URLExportedFile = res.data.data['url']
            this.exporting = false
            this.downloaded = false
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'success')
            this.exporting = false
          }
        })
    },

    pageChanged (page) { // Event check pagination change
      this.getListRefunds(page, this.pageData.perPage)
      this.pageData.currentPage = page
    },

    approvedRefund (refundId, status) {
      if (parseInt(status) === 3 && this.showModalReason === false) {
        this.refundId = refundId
        this.refundStatus = status
        this.showModalReason = true
        return
      }
      if (this.showModalReason) {
        this.$validator.validateAll().then((result) => {
          if (!result) { return false }
        })
      }
      let dataSend = {
        'id': refundId || this.refundId,
        'status': status || this.refundStatus,
        'reason': this.reason
      }
      depositService.changeStatusRequestRefund(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.getListRefunds(this.pageData.currentPage, this.pageData.perPage, false)
            commonHelper.showMessage(res.data.message, 'success')
            this.showModalReason = false
          } else {
            this.getListRefunds(this.pageData.currentPage, this.pageData.perPage, false)
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getListRefunds: function (page, limit, newSearchConditions) {
      let timeFormat = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let dataSend = {
        'page': page,
        'limit': limit,
        'search': this.searchText,
        'region': this.region,
        'provinceId': this.provinceId,
        'stationId': this.stationId,
        'status': this.status,
        'from': timeFormat.from,
        'to': timeFormat.to
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      depositService.getListRefunds(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.listRefunds = res.data.data
            this.pageData.totalItems = res.data.total_item
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },
    resetSearch () {
      this.range_time = null
      this.searchText = null
      this.region = ''
      this.provinceId = null
      this.stationId = null
      this.listStatus = [0, 1, 2, 3]
      this.getListRefunds(this.pageData.currentPage, this.pageData.perPage, true)
    },
    getStartEndFromTimeRange () {
      return {
        from: moment(this.range_time.start).format('YYYY-MM-DD'),
        to: moment(this.range_time.end).format('YYYY-MM-DD')
      }
    },

    handleSelectedRegion (option) {
      this.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : ''
    }
  }
}
</script>
