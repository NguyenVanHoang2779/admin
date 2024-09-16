<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading">Quản lý thẻ tự động</h4>
            <div class="text-note">
                Lưu ý: <br>
                <div class="pl-3">
                - Vận hành có quyền xác nhận kết quả phạt đối với các report phát sinh trong kỳ lương chậm nhất vào ngày 23 hàng tháng. <br>
                - Đối với các thẻ do CS gán phạt, CS có quyền thay đổi kết quả sau khi Trưởng kho/ Trưởng module/ Key person xác nhận. <br>
                - Chỉ duyệt với TH COD report ngược lại. <br>
                - Gồm các shop đánh giá COD, CS đánh giá COD và COD xin nghỉ không hợp lệ. <br>
                </div>
            </div>
            <hr>
        </div>
        <div class="mb-2">
            <b-row>
                <b-col md="2" class="mb-2">
                    <single-select-province :custom-class="''" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                </b-col>
                <b-col md="2">
                    <single-select-station :custom-class="''" :province-id="provinceId" @handleSelectedStation="handleSelectedStation"></single-select-station>
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Mã đơn hàng" v-model="pkg_order" @keyup.enter="search" class="form-control" />
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Mã shop" v-model="shop_code" @keyup.enter="search" class="form-control" />
                </b-col>
                <b-col md="2">
                    <b-form-select v-model="type" :options="typePenaltyOrigin" @keyup.enter="search"></b-form-select>
                </b-col>
                <b-col md="2">
                    <single-select-reason-shop-vote :reason="reason" @handleSelectedCauseShop="handleSelectedCauseShop" @keyup.enter="search"></single-select-reason-shop-vote>
                </b-col>
                <b-col md="2">
                    <b-form-select v-model="penalty_card" :options="typePenaltyCard" @keyup.enter="search"></b-form-select>
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Mã alias cod" v-model="cod_alias" class="form-control" @keyup.enter="search"/>
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Username" v-model="username" class="form-control" @keyup.enter="search"/>
                </b-col>
<!--                <b-col md="2">-->
<!--                    <b-form-select v-model="state" :options="stateOption" @keyup.enter="search"></b-form-select>-->
<!--                </b-col>-->
                <b-col md="2">
                    <v-date-picker mode="range" v-model="range_time_shop_created" locale="vi"
                        color="green"
                        :input-props="{ placeholder: 'Chọn khoảng thời gian tạo review', style: 'font-size:14px; line-height: unset' }"
                        @keyup.enter="search"/>
                </b-col>
<!--                <b-col md="2">-->
<!--                    <v-date-picker mode="range" v-model="range_time_cod_report" locale="vi"-->
<!--                        color="green"-->
<!--                        :input-props="{ placeholder: 'Chọn khoảng thời gian cod report', style: 'font-size:14px; line-height: unset' }"-->
<!--                        @keyup.enter="search"/>-->
<!--                </b-col>-->
                <b-col class="text-right">
                    <b-btn type="button" variant="primary" @click="search()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                    <div v-if="exportRight" class="d-inline-block ml-1">
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
                        <div class="d-inline-block" v-else-if="exported" @click="setDownloaded">
                            <b-btn variant="success" :href="URLExportedFile" target="blank">
                                <i class="ion ion-md-download"></i> Tải xuống
                            </b-btn>
                        </div>
                        <b-btn v-else variant="outline-success" @click="exportData">
                            <i class="ion ion-md-print"></i> Xuất phạt
                        </b-btn>
                    </div>
                    <b-btn type="button" variant="primary"  v-b-modal.modal-channel v-if="userInfo && userInfo.hasOwnProperty('User') && ['congam', 'trangdth11'].includes(userInfo.User.username)"><i class="sidenav-icon ion ion-md-search"></i> Xóa channel chat</b-btn>
                    <b-modal id="modal-channel" title="Chức năng dành cho superman" hide-footer>
                        <single-select-cod @onChange="selectUserChannel($event)"></single-select-cod>
                        <div class="text-center">
                            <b-btn type="button" variant="success" @click="deleteChannelId">Xóa channel</b-btn>
                            <b-btn type="button" variant="secondary" @click="$bvModal.hide('modal-channel')">Hủy</b-btn>
                        </div>
                    </b-modal>
                </b-col>
            </b-row>
        </div>
        <div class="mb-3 font-size-custom">
            <div class="wrapper-list-shop-vote" v-loading="appLoading">
                <b-card no-body v-if="listShopVotes.length > 0">
                    <table class="table b-table table-striped table-hover table-bordered table-vertical">
                        <thead>
                        <tr>
                            <th>Tỉnh - Kho</th>
                            <th>Ngày đánh giá</th>
                            <th>Loại phạt</th>
                            <th>Cod - Thẻ phạt</th>
                            <th>Shop report</th>
                            <th>Mã đơn</th>
                            <th>Lỗi</th>
<!--                            <th class="cod-report-cause">Cod report nguyên nhân</th>-->
<!--                            <th>Trạng thái</th>-->
                            <th>Người duyệt</th>
                            <th class="shop-report">Xác nhận</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr  v-for="(vote,index) in listShopVotes" :key="`vote-${index}`">
                            <td>{{vote.province_name}} - {{vote.station_name}}</td>
                            <td>{{formatDate(vote.created)}}</td>
                            <td>{{convertType(vote.type)}}</td>
                            <td>
                                <single-select-cod :is-disable="disableAction(vote)" :user="vote.cod" @onChange="selectedUser($event, index)"></single-select-cod>
                                <b-form-select  :disabled="disableAction(vote) || vote.type == 'awol'" v-model="vote.penalty_card" :options="typePenaltyCard" @change="updatePenaltyCard($event, vote.cod_penalty_id, index)"></b-form-select>
                            </td>
                            <td>
                                <div class="mb-2">{{vote.shop_name}}</div>
                                <div>{{vote.shop_code}}</div>
                            </td>
                            <td class="pkg-order">
                                <span v-for="(pkg, index) in vote.pkg_order" :key="`vote-${index}`">
                                    <a :href="`/admin?alias=` + pkg"  target="_blank">{{pkg}}<span v-if="index !== (vote.pkg_order.length - 1)">, </span>  </a>
                                </span>
                            </td>
                            <td>{{vote.reason}}</td>
<!--                            <td>{{vote.cod_reason}}</td>-->
<!--                            <td>-->
<!--                                {{convertState(vote.state)}}-->
<!--                            </td>-->
                            <td>{{vote.user_reviewed}}</td>
                            <td v-if="vote.type == 'bad_image'">
                                <div class="badge badge-secondary bad-image">
                                    Gán thẻ đúng
                                </div>
                            </td>
                            <td v-else>
                              <b-form-select :disabled="disableAction(vote)" v-model="vote.status"
                              :title="showTitle(vote.status)"
                              :options="vote.type == 'awol' ? statusAWOLOption :statusReportOption"
                              @change="showModalUpdate($event, vote.cod_penalty_id, vote.type, index)">
                              </b-form-select>
<!--                               <Confirm v-else :is-cs="vote.is_cs"-->
<!--                               :is-disable="disableState(vote)"-->
<!--                               :index="index"-->
<!--                               :vote="vote"-->
<!--                               @change="changeReview"/>-->
                               <span v-if="vote.reason_approved">Lý do duyệt: {{vote.reason_approved}}</span>
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
                                        v-on:input="getListShopVote"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
                <div v-if="appLoading === false && listShopVotes.length === 0">
                    <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy bản ghi phù hợp.</span>
                </div>
            </div>
            <b-modal v-model="showModalReason" title="Nhập lý do"  :hide-footer="true" @hide="cancelApprove()">
                <b-form-input
                        v-model="reasonPenalty"
                        placeholder="Nhập lý do phạt"
                        v-validate="'required'"
                        name="reason-approved"
                ></b-form-input>
                <span v-show="errors.firstRule('reason-approved') == 'required'" class="help is-danger">Không để trống trường này </span>
                <div class="text-center mt-3">
                    <b-btn variant="secondary"  @click="cancelApprove()">Hủy</b-btn>
                    <b-btn :disabled="isDisable" variant="primary" @click="updateStatusCodPenalty()">Xác nhận</b-btn>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .text-note {
        color: red;
        font-size: 13px;
        margin-top: -12px;
        padding-left: 10px;
    }
    .wrapper-list-shop-vote {
        position: relative;
        min-height: 120px;
    }
    .cod-report-cause {
        width: 13% !important;
    }
    .shop-report {
        width: 12% !important;
    }
    .table-vertical td {
        vertical-align: middle;
    }

    .pkg-order {
        max-width: 210px;
    }

    .bad-image {
        font-size: 14px;
        padding: 5px 20px;
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

    @media only screen and (max-width: 1400px) {
        .shop-report {
            width: 16% !important;
        }
        .font-size-custom {
            font-size: 12px !important;
        }
    }
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectReasonShopVote from 'components/elements/common/SingleSelectReasonShopVote'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectCod from 'components/elements/common/SingleSelectCod'
import evaluationService from 'domain/services/evaluation-service'
import Confirm from './Confirm'
import moment from 'moment'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { mapGetters } from 'vuex'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'shop-vote-manage',
  components: {
    SingleSelectReasonShopVote,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectCod,
    Confirm
  },

  data: () => ({
    appLoading: false,
    showModalReason: false,
    listShopVotes: [],
    pkg_order: null,
    shop_code: null,
    penalty_card: null,
    cod_alias: null,
    username: null,
    reason: null,
    // reasonCancel: null,
    reasonPenalty: null,
    state: null,
    userChannelId: null,
    provinceId: null,
    stationId: null,
    time_option: null,
    status: null,
    type: null,
    isDisable: false,
    statusRequest: null,
    codPenaltyId: null,
    index: null,
    permissionApproveAwol: false,
    permissionApproveGeneral: false,
    typePenaltyOrigin: [
      { value: null, text: 'Chọn loại phạt' },
      { value: 'review', text: 'Shop review' },
      { value: 'issue', text: 'Shop gán ticket' },
      { value: 'cs', text: 'Cs phạt' },
      { value: 'post_office', text: 'Bưu cục' },
      { value: 'awol', text: 'Nghỉ không hợp lệ' },
      { value: 'bad_image', text: 'Phạt ảnh sản phẩm' },
      { value: 'refund', text: 'Phạt do bồi hoàn' },
      { value: 'cs_total', text: 'QC tool phạt thẻ' }
    ],
    typePenaltyCard: [
      { value: null, text: 'Chọn loại thẻ' },
      { value: 'yellow', text: 'Vàng' },
      { value: 'red', text: 'Đỏ' }
    ],
    stateOption: [
      { value: null, text: 'Chọn trạng thái' },
      { value: 'new', text: 'Cod chưa report' },
      { value: 'reported', text: 'Cod đã report' },
      { value: 'reviewed', text: 'Điều phối đã review' }
    ],
    statusReportOption: [
      { value: null, text: 'Xác nhận đánh giá' },
      { value: 0, text: 'Shop report đúng' },
      { value: 1, text: 'Shop report sai' }
    ],
    statusAWOLOption: [
      { value: null, text: 'Xác nhận COD nghỉ' },
      { value: 1, text: 'Nghỉ hợp lệ' },
      { value: 0, text: 'Nghỉ không hợp lệ' }
    ],
    range_time_shop_created: null,
    range_time_cod_report: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    URLExportedFile: '#',
    exportRight: true,
    exporting: false,
    exported: false,
    downloaded: false,
    currentPage: 1,
    totalItems: 0,
    perPage: 10
  }),

  created () {
    // chuyển màn duyệt phạt mới
    window.location.replace('/adm/kpi/penalties')
    this.getListShopVote()
    this.getPermission()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  watch: {
    showModalReason (oldVal, newVal) {
      this.reasonPenalty = null
    }
  },

  methods: {
    disableAction (vote) {
      if (vote.type === 'awol') {
        if (parseInt(vote.status) === 0) {
          return !this.permissionApproveAwol.cancel
        }
        if (parseInt(vote.status) === 1) {
          return !this.permissionApproveAwol.approved
        }
      }
      if (vote.type !== 'awol') {
        if (parseInt(vote.status) === 0) {
          return !this.permissionApproveGeneral.cancel
        }
        if (parseInt(vote.status) === 1) {
          return !this.permissionApproveGeneral.approved
        }
      }
      return true
    },
    cancelApprove () {
      this.showModalReason = false
      this.reasonPenalty = ''
      this.index = null
      this.codPenaltyId = null
      this.statusRequest = null
    },
    setDownloaded () {
      this.downloaded = true
      this.exported = false
    },
    exportData () {
      let timeRangeShopCreated = this.range_time_shop_created != null ? this.getStartEndFromTimeRange(this.range_time_shop_created) : {}
      let timeRangeCodReport = this.range_time_cod_report != null ? this.getStartEndFromTimeRange(this.range_time_cod_report) : {}
      let params = {
        province_id: this.provinceId,
        station_id: this.stationId,
        pkg_order: this.pkg_order,
        shop_code: this.shop_code,
        cod_alias: this.cod_alias,
        reason: this.reason,
        penalty_card: this.penalty_card,
        state: this.state,
        type: this.type,
        from_shop_created: timeRangeShopCreated.from || null,
        to_shop_created: timeRangeShopCreated.to || null,
        from_cod_report: timeRangeCodReport.from || null,
        to_cod_report: timeRangeCodReport.to || null,
        page: this.currentPage,
        limit: this.perPage
      }
      this.exporting = true
      evaluationService.exportData(params)
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
    checkJobStatus (jobId) {
      let getJobStat = setInterval(() => {
        evaluationService.checkJobStatus({job_id: jobId})
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
    showTitle (status) {
      if (parseInt(status) === 0) return 'Shop report đúng'
      if (parseInt(status) === 1) return 'Shop report sai'
      return 'Xác nhận đánh giá'
    },
    disableState (vote) {
      // if (vote.is_cs) {
      //   if (vote.state === 'cs_reviewed' || typeof vote.can_review === 'string') return true
      //   if (vote.type !== 'cs') return true
      // } else {
      //   if (vote.state === 'reviewed' || vote.state === 'cs_reviewed' || typeof vote.can_review === 'string') return true
      // }
      return vote.is_cs
    },
    search () {
      this.currentPage = 1
      this.perPage = 10
      this.getListShopVote()
    },

    getPermission () {
      evaluationService.getPermissionShopVote()
        .then(res => {
          if (res.data.success) {
            this.permissionApproveAwol = res.data.data['awol']
            this.permissionApproveGeneral = res.data.data['type_diff']
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    getListShopVote () {
      this.appLoading = true
      let timeRangeShopCreated = this.range_time_shop_created != null ? this.getStartEndFromTimeRange(this.range_time_shop_created) : {}
      let timeRangeCodReport = this.range_time_cod_report != null ? this.getStartEndFromTimeRange(this.range_time_cod_report) : {}
      let params = {
        province_id: this.provinceId,
        station_id: this.stationId,
        pkg_order: this.pkg_order,
        shop_code: this.shop_code,
        cod_alias: this.cod_alias,
        username: this.username,
        reason: this.reason,
        penalty_card: this.penalty_card,
        state: this.state,
        type: this.type,
        from_shop_created: timeRangeShopCreated.from || null,
        to_shop_created: timeRangeShopCreated.to || null,
        from_cod_report: timeRangeCodReport.from || null,
        to_cod_report: timeRangeCodReport.to || null,
        page: this.currentPage,
        limit: this.perPage
      }
      evaluationService.getListShopVote(params)
        .then(res => {
          if (res.data.success) {
            this.listShopVotes = res.data.data.data
            this.totalItems = res.data.data.total
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    showModalUpdate (option, codPenaltyId, type, index) {
      this.statusRequest = option
      this.codPenaltyId = codPenaltyId
      this.index = index
      this.showModalReason = true
    },

    updateStatusCodPenalty () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let data = {
            cod_penalty_id: this.codPenaltyId,
            status: this.statusRequest,
            reason_penalty: this.reasonPenalty
          }
          evaluationService.updateStatusCodPenalty(data)
            .then(res => {
              if (res.data.success) {
                commonHelper.showMessage(res.data.message, 'success')
                this.showModalReason = false
                this.getListShopVote()
              } else {
                this.getListShopVote()
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
            .catch(e => {
              console.log(e)
            })
            .then(() => {
              this.appLoading = false
            })
        } else {
          this.listShopVotes[this.index].status = 1
        }
      })
    },

    // updateStatus (option, codPenaltyId) {
    //   let data = {
    //     cod_penalty_id: codPenaltyId,
    //     status: option,
    //     reason_penalty: this.reasonPenalty
    //   }
    //   evaluationService.updateStatusCodPenalty(data)
    //     .then(res => {
    //       if (res.data.success) {
    //         commonHelper.showMessage(res.data.message, 'success')
    //         this.showModalReason = false
    //         this.getListShopVote()
    //       } else {
    //         this.getListShopVote()
    //         commonHelper.showMessage(res.data.message, 'warning')
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })
    //     .then(() => {
    //       this.appLoading = false
    //     })
    // },

    // changeReview ({option, codPenaltyId, index}) {
    //   this.updateStatusCodPenalty(option, codPenaltyId, index)
    // },

    updatePenaltyCard (option, codPenaltyId, index) {
      if (!confirm(`Bạn có chắc chắn muốn thay đổi loại thẻ không?`)) {
        if (option === 'red') this.listShopVotes[index].penalty_card = 'yellow'
        if (option === 'yellow') this.listShopVotes[index].status = 'red'
        return
      }
      let data = {
        cod_penalty_id: codPenaltyId,
        penalty_card: option
      }
      evaluationService.updatePenaltyCard(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.getListShopVote()
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    getStartEndFromTimeRange (rangeTime) {
      return {
        from: moment(rangeTime.start).format('YYYY-MM-DD'),
        to: moment(rangeTime.end).format('YYYY-MM-DD')
      }
    },

    convertState (state) {
      let name = ''
      switch (state) {
        case 'new':
          name = 'Cod chưa report'
          break
        case 'reported':
          name = 'Cod đã report'
          break
        case 'reviewed':
          name = 'ĐP đã reviewed'
          break
        case 'cs_reviewed':
          name = 'CS đã reviewed'
          break
      }
      return name
    },

    convertType (type) {
      let name = ''
      switch (type) {
        case 'cs':
          name = 'Cs phạt'
          break
        case 'issue':
          name = 'Shop gán ticket'
          break
        case 'post_office':
          name = 'Bưu cục'
          break
        case 'review':
          name = 'Shop review'
          break
        case 'awol':
          name = 'Nghỉ không hợp lệ'
          break
        case 'bad_image':
          name = 'Gán thẻ ảnh sản phẩm'
          break
        case 'refund':
          name = 'Phạt do bồi hoàn'
          break
        case 'cs_total':
          name = 'QC tool phạt thẻ'
          break
      }
      return name
    },

    updateUserPenalty (codPenaltyId, userId) {
      if (!confirm(`Bạn có chắc chắn muốn thay đổi nhân viên bị phạt không?`)) {
        return
      }
      let data = {
        cod_penalty_id: codPenaltyId,
        user_id: userId
      }
      evaluationService.updateUserPenalty(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.getListShopVote()
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    selectedUser (option, index) {
      this.listShopVotes[index].cod = option || null
      if (+option.id !== +this.listShopVotes[index].user_id) this.updateUserPenalty(this.listShopVotes[index].cod_penalty_id, option.id)
    },

    deleteChannelId () {
      let data = {
        user_id: this.userChannelId
      }
      evaluationService.deleteChannelId(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.$bvModal.hide('modal-channel')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.getListShopVote()
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    selectUserChannel (option, index) {
      this.userChannelId = option ? option.id : ''
    },

    formatDate (date, format) {
      return commonHelper.formatDate(date, format)
    },

    handleSelectedCauseShop (option) {
      this.reason = option || null
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
