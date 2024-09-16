<template>
  <h3>
    Màn này hiện đã đóng, vui lòng vào màn Cần xử lý ở menu Quản lý công việc để tiếp tục thao tác
    hoặc liên hệ HR kho để được hỗ trợ!
  </h3>
<!--  <div class="d-none d-md-block main-content">-->
<!--    <b-row class="mx-0 header my-2 align-items-center">-->
<!--      <b-col md="4" >-->
<!--        <h4 class="m-0">Danh sách đề xuất</h4>-->
<!--      </b-col>-->
<!--      <b-col md="8" class="text-right">-->
<!--        <b-btn variant="ghtk" @click="listOrder()"><i class="fas fa-search"></i> Tìm kiếm</b-btn>-->
<!--        <b-btn variant="ghtk" @click="resetFilter"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>-->
<!--        <b-dd right variant="ghtk" :disabled="exporting" v-show="!fileExport" class="d-inline-flex">-->
<!--          <span slot="button-content"><i class="fas" :class="!exporting ? 'fa-file-excel' : 'fa-spinner fa-pulse'"></i> {{ exporting ? 'Đang xuất...' : 'Xuất data' }}</span>-->
<!--          <b-dd-item-btn @click="exportOrderHr('insurance_list')">Danh sách BHXH</b-dd-item-btn>-->
<!--          <b-dd-item-btn @click="exportOrderHr('contract')" disabled>Danh sách hợp đồng</b-dd-item-btn>-->
<!--          <b-dd-item-btn @click="exportOrderHr('insurance_viettel')">File mã hóa BHXH Viettel</b-dd-item-btn>-->
<!--          <b-dd-item-btn @click="exportOrderHr('insurance_efy')">File mã hóa BHXH EFY</b-dd-item-btn>-->
<!--        </b-dd>-->
<!--        <b-btn v-show="!!fileExport" variant="success" @click="downloadFile">-->
<!--          <i class="fas fa-download"></i> Tải file-->
<!--        </b-btn>-->
<!--        <b-dd right variant="ghtk" class="justify-content-end">-->
<!--          <span slot="button-content">-->
<!--            <i class="fas fa-plus"></i> Thêm đề xuất-->
<!--          </span>-->
<!--          <b-dd-item-btn @click="detailOrder(null)">BHXH</b-dd-item-btn>-->
<!--          <b-dd-item-btn @click="detailOrder(null, 'new_contract')">Hợp đồng</b-dd-item-btn>-->
<!--          <b-dd-item-btn @click="detailOrder(null, 'resign')">Nghỉ việc</b-dd-item-btn>-->
<!--        </b-dd>-->
<!--      </b-col>-->
<!--    </b-row>-->

<!--    <b-row class="mx-0 filter pb-1 border-bottom">-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <multi-select-region-->
<!--          custom-class="z-5"-->
<!--          :regions="filter.region"-->
<!--          :auto-close="true"-->
<!--          :hide-selected="true"-->
<!--          @handleSelectedRegion="handleSelectedRegion"-->
<!--        ></multi-select-region>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <multi-select-province-->
<!--          :custom-class="'z-5'"-->
<!--          :province-ids="filter.province"-->
<!--          :auto-close="true"-->
<!--          :hide-select="true"-->
<!--          @handleProvinceSelected="handleProvinceSelected"-->
<!--        ></multi-select-province>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <multi-select-station-->
<!--          :custom-class="'z-5'"-->
<!--          :station-ids="filter.station"-->
<!--          :auto-close="true"-->
<!--          :hide-select="true"-->
<!--          @handleStationSelected="handleStationSelected"-->
<!--        ></multi-select-station>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1 z-5">-->
<!--        <select-order-type-->
<!--          :type="filter.type"-->
<!--          :has-group="true"-->
<!--          :multiple="true"-->
<!--          :group-select="true"-->
<!--          :auto-close="true"-->
<!--          @input="selectOrderType"-->
<!--          :append-category="true"-->
<!--        ></select-order-type>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <select-order-status-->
<!--          class="z-3"-->
<!--          :multiple="true"-->
<!--          :status="filter.status"-->
<!--          @input="selectOrderStatus"-->
<!--        ></select-order-status>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <single-select-user-->
<!--          class="small-scrollbar z-3"-->
<!--          @select="op => {filter.censor = op ? op.id : null}"-->
<!--          placeholder="Nhập người xử lý"-->
<!--          :reset="resetEmployee"-->
<!--        ></single-select-user>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <single-select-user-->
<!--          class="small-scrollbar z-3"-->
<!--          @select="op => {filter.employee = op ? op.id : null}"-->
<!--          placeholder="Nhập người lao động"-->
<!--          :reset="resetEmployee"-->
<!--        ></single-select-user>-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <v-date-picker-->
<!--          mode="range"-->
<!--          v-model="range_time"-->
<!--          locale="vi"-->
<!--          color="green"-->
<!--          :input-props="{ placeholder: 'Chọn khoảng thời gian tạo', style: 'font-size:14px; line-height: unset; border-radius: 0; border-color: #e8e8e8' }"-->
<!--          :popover="{visibility: 'focus'}"-->
<!--        />-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        <input-->
<!--          placeholder="Mã/ nội dung đề xuất"-->
<!--          v-model="filter.content"-->
<!--          class="form-control"-->
<!--          @keyup.enter="listOrder()"-->
<!--        />-->
<!--      </b-col>-->
<!--      <b-col md="4" lg="3" class="mb-1">-->
<!--        &lt;!&ndash; <input type="datetime-local" name="deadline" v-model="deadline" class="form-control" placeholder="Hạn xử lý trước"/> &ndash;&gt;-->
<!--        <v-date-picker-->
<!--          v-model="filter.deadline"-->
<!--          locale="vi"-->
<!--          color="green"-->
<!--          :input-props="{ placeholder: 'Hạn xử lý ', style: 'font-size:14px; line-height: unset; border-radius: 0; border-color: #e8e8e8' }"-->
<!--          :popover="{visibility: 'focus'}"-->
<!--        />-->
<!--      </b-col>-->
<!--      <b-col md="8" lg="9" class="text-center">-->
<!--      </b-col>-->
<!--    </b-row>-->

<!--    <div class="paging mt-3 mx-3">-->
<!--      <div class="z-0 d-inline-block">-->
<!--        <b-pagination-->
<!--          class="mb-1 paginator-ghtk"-->
<!--          size="sm"-->
<!--          align="left"-->
<!--          v-model="page.current"-->
<!--          :total-rows="page.total"-->
<!--          :per-page="page.per_page"-->
<!--          @input="listOrder()"-->
<!--        >-->
<!--        </b-pagination>-->
<!--      </div>-->
<!--      <div class="d-inline-block ml-3" v-if="orderMissDeadline">-->
<!--        <span>{{ orderMissDeadline.length }} đề xuất gán bạn xử lý đã quá hạn, trong đó {{ orderMissDeadlineSolved }} đã được xử lý</span>-->
<!--        <span class="text-danger">{{ orderMissDeadline.length - orderMissDeadlineSolved }} chưa được xử lý</span>-->
<!--        (<a href="#" v-b-modal.modal-order-miss-deadline class="text-ghtk"><i>Chi tiết</i></a>)-->
<!--        <modal-order-miss-deadline-->
<!--          id="modal-order-miss-deadline"-->
<!--          :missDeadlineFilter="missDeadlineFilter"-->
<!--          :orderMissDeadline="orderMissDeadline"-->
<!--          :orderMissDeadlineSolved="orderMissDeadlineSolved"-->
<!--          :loading="loadingMissDeadlineOrder"-->
<!--          @getOrderMissDeadline="getOrderMissDeadline"-->
<!--        ></modal-order-miss-deadline>-->
<!--      </div>-->
<!--      <b class="float-right">Trang {{ page.current }}/{{ Math.ceil(page.total/page.per_page) }}</b>-->
<!--    </div>-->

<!--    <div class="order-table row mx-0">-->
<!--      <div class="col col-12 table-content">-->
<!--        <table class="table table-hover table-sm bg-white table-order-list w-100 d-block table-responsive-sm">-->
<!--          <thead>-->
<!--            <tr class="header-sticky">-->
<!--              <th class="text-center type-col">Loại đề xuất</th>-->
<!--              <th class="text-center employee-col">Người lao động</th>-->
<!--              <th class="text-center content-col">Nội dung quan trọng</th>-->
<!--              <th class="text-center status-col">Trạng thái</th>-->
<!--              <th class="text-center censors-col">Người xử lý</th>-->
<!--              <th class="text-center action-col">Thao tác</th>-->
<!--            </tr>-->
<!--          </thead>-->
<!--          <tbody class="position-relative" v-loading="loading">-->
<!--            <order-row-data-->
<!--              v-for="(order, idx) in orders"-->
<!--              :key="order.order.id"-->
<!--              :order="order.order"-->
<!--              :type="order.type"-->
<!--              :duty="duty"-->
<!--              :small-view="true"-->
<!--              @detailOrder="detailOrder(idx)"-->
<!--              @detailRelate="id => detailOrder(null, null, id)"-->
<!--              @updateStatus="checkStatusUpdate(idx, ...arguments)"-->
<!--              @action="rowDataAction(order, ...arguments)"-->
<!--            ></order-row-data>-->
<!--            <tr v-show="!orders || !orders.length">-->
<!--              <td class="text-center align-middle no-result" colspan="6">-->
<!--                <div class="w-100">Không có đề xuất nào !</div>-->
<!--                </td>-->
<!--            </tr>-->
<!--          </tbody>-->
<!--        </table>-->
<!--      </div>-->
<!--      <modal-detail-file-->
<!--        id="detail-file-contract"-->
<!--        title="File hợp đồng"-->
<!--        :contract-id="contractId"-->
<!--      ></modal-detail-file>-->
<!--      <b-modal id="modal-order" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT" hide-footer @hide="resetCurOrder">-->
<!--      <update-order-->
<!--        :id-order="curOrder.id || null"-->
<!--        :modal-style="true"-->
<!--        :order-type="createOrderType"-->
<!--        @addOrderOk="listOrder()"-->
<!--        @changeStatusOk="updateRelateOrderStatus"-->
<!--      ></update-order>-->
<!--    </b-modal>-->
<!--    <b-modal static title="Nhập lý do từ chối" id="reject-reason-modal" @hide="resetUpdateStatusData">-->
<!--        <textarea-->
<!--          name="reject-reason-input"-->
<!--          rows="4"-->
<!--          class="form-control"-->
<!--          v-model="rejectReason"-->
<!--        ></textarea>-->
<!--        <div slot="modal-footer" class="w-100 text-center">-->
<!--          <b-btn variant="success" @click="updateStatus(idxCurrentOrderUpdateStatus, 'tu_choi', rejectReason)">OK</b-btn>-->
<!--          <b-btn variant="danger" @click="$bvModal.hide('reject-reason-modal')">Hủy</b-btn>-->
<!--        </div>-->
<!--    </b-modal>-->
<!--    <b-modal title="Thông tin thay đổi" id="view-log-update" static hide-footer size="lg">-->
<!--      <LogChange :logs="logUpdate" />-->
<!--    </b-modal>-->
<!--    </div>-->
<!--  </div>-->
</template>

<style lang="scss" scoped>
  .table-order-list {
    max-height: 70vh;
    overflow: auto;
  }
  .header-sticky th {
    background: white;
    position: sticky;
    top: -1px;
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
  .order-table table {
    min-height: 25vh;
  }
  .status-col, .deadline-col, .action-col {
    width: 10%;
  }
  .type-col {
    width: 10%;
  }
  .content-col {
    width: 25%;
  }
  .censors-col {
    // width: 20%;
    max-width: 30%;
  }
  .employee-col {
    width: 25%
  }
  .page-input {
    z-index: 0;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-13 {
    font-size: 13px;
  }
  td {
    border-bottom: 1px solid #ddd;
  }
  .no-result {
    font-size: 14px;
    width: calc(100vw - 52px);
  }
</style>

<script>
// custom component
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SelectOrderType from './SelectOrderType'
import UpdateOrder from './UpdateOrder'
import SelectOrderStatus from './SelectOrderStatus'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import ModalDetailFile from 'components/pages/erp/contract/ModalDetailFile'
import OrderRowData from './OrderRowData'
import ModalOrderMissDeadline from './ModalOrderMissDeadline'
import LogChange from './LogChange'

// service
import hrOrderService from 'domain/services/hr-order-service'
import profileService from 'domain/services/profile-service'
import contractService from 'domain/services/contract-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'order-dashboard-work',
  props: {
    orderCode: {
      default: null
    },

    categoryAlias: {
      default: null
    },

    groupAlias: {
      default: null
    }
  },

  components: {
    MultiSelectProvince,
    MultiSelectStation,
    SelectOrderType,
    SelectOrderStatus,
    UpdateOrder,
    SingleSelectUser,
    ModalDetailFile,
    MultiSelectRegion,
    OrderRowData,
    LogChange,
    ModalOrderMissDeadline
  },

  data: _ => ({
    loading: false,
    loadingMissDeadlineOrder: false,
    exporting: false,
    fileExport: null,
    page: {
      current: 1,
      total: 0,
      per_page: 10
    },
    missDeadlineFilter: {
      from: null,
      to: null
    },
    filter: {
      region: null,
      province: null,
      station: null,
      type: null,
      status: null,
      content: null,
      censor: null,
      employee: null,
      category: null,
      group: null,
      deadline: null
    },
    range_time: null,
    orders: [],
    duty: {
      contract: 'NV',
      insurance: 'NV'
    },
    rejectReason: null,
    curOrder: {
      idx: null,
      id: null
    },
    idxCurrentOrderUpdateStatus: null,
    createOrderType: null,
    resetEmployee: false,
    contractId: null,
    // orderType: null,
    // statisticData: {},
    orderMissDeadline: [],
    logUpdate: {
      new: {
        update: {
          update_user: {
            wert: 'ertye',
            fghnj: 2
          }
        },
        asas: 'asfasf',
        mob: {
          config_visual: {
            format: 'money',
            reduce: true
          },
          value: 1242353456,
          desc: 'tiền'
        },
        logs: [
          {
            wert: 'dfhfh',
            fghnj: 645
          },
          {
            config_visual: {
              format: 'date',
              reduce: true
            },
            value: '2020-01-12',
            desc: 'Ngày'
          }
        ]
      },
      old: {}
    }
  }),

  created () {
    // if (this.orderCode) this.filter.content = this.orderCode
    // // this.getOrderType()
    // if (this.categoryAlias) this.filter.category = this.categoryAlias
    // if (this.groupAlias) this.filter.group = this.groupAlias
    // this.listOrder(!!(this.categoryAlias || this.groupAlias))
    // this.getOrderMissDeadline()
  },

  computed: {
    orderMissDeadlineSolved () {
      if (!this.orderMissDeadline) return null
      let num = 0
      for (const o of this.orderMissDeadline) {
        if (o && !o.still_assigned) num++
      }

      return num
    }
  },

  watch: {
    categoryAlias (newVal) {
      if (newVal) {
        this.filter.category = newVal
        this.filter.group = null
        this.listOrder(true)
      } else this.filter.category = null
    },

    groupAlias (newVal) {
      if (newVal) {
        this.filter.category = null
        this.filter.group = newVal
        this.listOrder(true)
      }
    }
  },

  methods: {
    resetUpdateStatusData () {
      this.idxCurrentOrderUpdateStatus = null
      this.rejectReason = null
    },

    resetCurOrder () {
      this.curOrder.id = null
      this.curOrder.idx = null
      this.createOrderType = null
    },

    detailOrder (orderIdx, orderType, orderId) {
      if (!isNaN(orderIdx) && this.orders[orderIdx]) {
        this.curOrder.idx = orderIdx
        this.curOrder.id = this.orders[orderIdx].order.id
      } else if (orderId) {
        this.curOrder.id = orderId
        // lấy index của order nếu truyền vào ID order
        let idx = this.orders.findIndex(order => (+order.order.id === +orderId))
        if (idx > -1) this.curOrder.idx = idx
      } else {
        this.curOrder.id = null
        this.curOrder.idx = null
        this.createOrderType = orderType || null
      }

      this.$bvModal.show('modal-order')
    },

    rowDataAction (order, data) {
      if (!data || !data.action) return
      if (data.action === 'view-log-update') {
        this.getLogUpdate(data.data)
        this.$bvModal.show('view-log-update')
      }
    },

    getLogUpdate (logId) {
      if (!logId) return

      this.$startLoading()
      hrOrderService.getLogUpdate({log_id: logId})
        .then(res => {
          if (res.data.success) {
            this.logUpdate = res.data.data || []
          } else {
            helper.showMessage(res.data.message || 'Không lấy được thông tin thay đổi !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy thông tin thag dổi !')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    getOrderMissDeadline () {
      this.loadingMissDeadlineOrder = true
      hrOrderService.getOrderMissDeadline(this.missDeadlineFilter)
        .then(res => {
          if (res.data.success) {
            this.orderMissDeadline = res.data.data || []
          } else {
            helper.showMessage(res.data.message || 'Không lấy được danh sách đề xuất trễ hạn xử lý!')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loadingMissDeadlineOrder = false
        })
    },

    showCategory (groupAlias) {
      return ['up', 'down', 'modify'].includes(groupAlias)
    },

    listOrder (censorLogin = null) {
      let data = {...this.filter}
      data.perPage = this.page.per_page
      data.page = this.page.current
      data.censorLogin = censorLogin
      if (this.range_time) {
        data.start_date = this.range_time.start || null
        data.end_date = this.range_time.end || null
      }

      this.loading = true
      hrOrderService.listOrder(data)
        .then(res => {
          if (res.data.success) {
            this.orders = res.data.data
            this.page.total = +res.data.total
            this.duty = res.data.duty
          } else {
            helper.showMessage(res.data.message || 'Không lấy được danh sách đề xuất !')
          }
        })
        .catch(e => {
          // helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },

    exportOrderHr (exportType = null) {
      this.exporting = true
      let filter = {...this.filter}
      filter.exportType = exportType
      filter.group = null
      filter.type = null
      if (this.range_time) {
        filter.start_date = this.range_time.start || null
        filter.end_date = this.range_time.end || null
      }
      hrOrderService.exportOrderHr(filter)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.job_id) {
              this.checkJobExport(res.data.data.job_id)
            } else helper.showMessage('Không tạo được Job xuất dữ liệu !', 'warning')
          } else {
            this.exporting = false
            helper.showMessage(res.data.message || 'Có lỗi xảy ra không thể xuất dữ liệu !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra không thể xuất dữ liệu !', 'warning')
        })
    },

    checkJobExport (jobId) {
      if (!jobId) helper.showMessage('Không có Job id !', 'warning')
      let getJobStatus = setInterval(_ => {
        profileService.checkJobStatus({job_id: jobId})
          .then(res => {
            if (res.data.success) {
              if (res.data.data.job_status === 'closed') {
                clearInterval(getJobStatus)
                this.exporting = false
                this.fileExport = res.data.data.path || res.data.data.url
                helper.showMessage('Đã xuất xong dữ liệu đề xuất bảo hiểm', 'success')
              }
            } else {
              helper.showMessage(res.data.message, 'warning')
              clearInterval(getJobStatus)
              this.exporting = false
            }
          })
          .catch(e => {
            console.log(e)
            clearInterval(getJobStatus)
            helper.showMessage('Có lỗi xảy ra khi kiểm tra Job xuất dữ liệu !', 'warning')
          })
      }, 2000)
    },

    checkStatusUpdate (idx, action) {
      if (action === 'export_contract') {
        if (!this.orders[idx] || !this.orders[idx].order.relate_record_id) {
          alert('Không tìm thấy ID Hợp đồng cho đề xuất này !')
          return
        }
        this.exportContract(this.orders[idx].order.relate_record_id)
        return
      }
      if (action === 'upload_contract') {
        this.contractId = this.orders[idx] && this.orders[idx].order.relate_record_id
        if (!this.contractId) {
          alert('Không tìm thấy ID Hợp đồng cho đề xuất này !')
          return
        }
        this.$bvModal.show('detail-file-contract')
        return
      }
      if (action === 'edit_contract') {
        this.detailOrder(idx)
        return
      }
      this.idxCurrentOrderUpdateStatus = idx
      if (action === 'tu_choi') {
        this.$bvModal.show('reject-reason-modal')
        return
      }

      this.updateStatus(this.idxCurrentOrderUpdateStatus, action, this.rejectReason)
    },

    exportContract (contractId) {
      let params = {
        contract_id: contractId,
        type: 0
      }
      contractService.exportContract(params)
        .then(res => {
          if (res.data.success) window.open(res.data.data)
          else helper.showMessage(res.data.message || 'Đã có lỗi xảy ra vui lòng thử lại sau !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không xuất được hợp đồng !', 'warning')
        })
    },

    updateRelateOrderStatus (resData) {
      if (!resData || !resData.id || !this.orders || !this.orders.length) return
      let newStatus = resData.update_status || resData.status
      for (let idx in this.orders) {
        if (+this.orders[idx].order.id === +resData.id && this.orders[idx].order.status !== newStatus) {
          this.orders[idx].order.status = newStatus
          // cập nhật lại người duyệt
          if (resData.censors) {
            this.orders[idx].order.censors = resData.censors
          } else {
            this.orders[idx].order.censors = null
          }
          // Cập nhật thêm log
          if (this.orders[idx].order.logs && Array.isArray(this.orders[idx].order.logs) && resData.data) {
            this.orders[idx].order.logs.unshift(...resData.data)
          } else {
            this.orders[idx].order.logs = resData.data
          }
        }
        if (this.orders[idx].order.relate_order && this.orders[idx].order.relate_order.hrOrder && +this.orders[idx].order.relate_order.hrOrder.id === +resData.id) {
          if (this.orders[idx].order.relate_order.hrOrder.status !== newStatus) this.orders[idx].order.relate_order.hrOrder.status = newStatus
        }
      }
    },

    updateStatus (idx, action, rejectReason) {
      if (!action || !this.orders[idx] || !this.orders[idx].order || !this.orders[idx].order.id) return
      if (action === 'tu_choi' && !rejectReason) {
        alert('Vui lòng nhập lý do từ chối !')
        return
      }
      let data = {
        id: this.orders[idx].order.id,
        action: action,
        reason: rejectReason
      }
      hrOrderService.updateStatus(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật trạng thái thành công !', 'success')
            if (action === 'tu_choi') {
              this.$bvModal.hide('reject-reason-modal')
            }
            res.data.id = data.id
            this.updateRelateOrderStatus(res.data)
          } else {
            helper.showMessage(res.data.message || 'Không thể chuyển trạng thái của đề xuất !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra, không thay đổi được trạng thái đề xuất !', 'warning')
        })
        .finally(_ => {
          this.resetUpdateStatusData()
        })
    },

    getOrderType () {
      if (sessionStorage.getItem('hrOrderType')) {
        this.orderType = JSON.parse(sessionStorage.getItem('hrOrderType'))
        return
      }
      hrOrderService.getType()
        .then(res => {
          if (res.data.success) {
            this.orderType = res.data.data
            sessionStorage.setItem('hrOrderType', JSON.stringify(res.data.data))
          }
        })
        .catch(e => {
          console.log(e)
          console.log('Có lỗi xảy ra, không lấy được danh sách loại khai báo !')
        })
    },

    resetFilter () {
      for (const field in this.filter) {
        this.filter[field] = null
      }
      this.range_time = null
      this.resetEmployee = !this.resetEmployee
      this.listOrder()
    },

    downloadFile () {
      if (this.fileExport) window.open(this.fileExport, '_blank')
      this.fileExport = null
    },

    openLink (link) {
      if (link) window.open(link, '_blank')
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleSelectedRegion (ops) {
      this.filter.region = ops ? ops.map(op => op.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    selectOrderType (ops) {
      this.filter.type = ops ? ops.map(item => item.id).toString() : ''
    },

    selectOrderStatus (ops) {
      this.filter.status = ops ? ops.map(item => item.value).toString() : ''
    },

    selectCensorFilter (ops) {
      this.filter.censor = ops ? ops.map(item => item.id).toString() : ''
    }
  }
}
</script>
