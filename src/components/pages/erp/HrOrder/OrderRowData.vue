<template>
  <tr>
    <!-- Loại đề xuất -->
    <td>
      <b>{{ type.group_name }} - {{ type.name }}</b>
    </td>

    <!-- Người lao động -->
    <td>
      <!-- Mã -->
      <div class="font-weight-500">
        <b-link @click="$emit('detailOrder')" class="text-ghtk-action">
          {{ genCodeOrder(order.id, categoryAlias[type.category]) }} <i class="fas fa-pencil-alt"></i>
        </b-link>
      </div>
      <!-- NLĐ -->
      <div v-if="order.profile_info" class="font-weight-500">
        <p  :class="codGroupIds.includes(parseInt(order.profile_info.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
              class="member-info-item"
              @click="gotoCodProfile(order.profile_info.group_id, order.profile_info.user_id)">
          NLĐ:
          {{ order.profile_info.fullname }} ({{ order.profile_info.username }} - {{ order.profile_info.position_name }} - {{  order.profile_info.station }} - {{ order.profile_info.province }})
        </p>
      </div>
      <!-- Đề xuất liên quan -->
      <div v-if="order.relate_order && order.relate_order.hrOrder && order.relate_order.type">
        Đề xuất liên quan:
        <i>
          <b-link @click="$emit('detailRelate', order.relate_order.hrOrder.id)">
            {{ genCodeOrder(order.relate_order.hrOrder.id, order.relate_order.type.category === 'contract' ? 'HĐ' : 'BH') }}
          </b-link>
          - {{ `${order.relate_order.type.name} (${order.relate_order.type.category_name})`}}
          - <span
              v-if="statusDesc[order.relate_order.hrOrder.status]"
              :class="'text-' + (statusDesc[order.relate_order.hrOrder.status] && statusDesc[order.relate_order.hrOrder.status].variant)"
            >
              {{ statusDesc[order.relate_order.hrOrder.status].desc }}
            </span>
        </i>
      </div>
      <!-- action -->
      <div class="action my-1">
        <span class="text-ghtk-action text-underline-hover" v-b-toggle="'comment-' + order.id" @click="addComment(order.id)">Comment</span> |
        <span class="text-ghtk-action text-underline-hover" v-b-toggle="'file-license-' + order.id">{{ order.files && order.files.length }} File hồ sơ</span>
        <!-- files -->
        <b-collapse :id="'file-license-' + order.id">
          <div class="show-file ml-2 mt-1" v-viewer>
            <div v-if="Array.isArray(order.files) && order.files.length">
              <div v-for="(fileType, idxFileType) in order.files" :key="idxFileType" class="d-inline-block">
                <div v-if="Array.isArray(fileType.file_exist) && fileType.file_exist.length" class="d-inline-block">
                  <img v-for="(file, idxFile) in fileType.file_exist" :key="idxFile" :src="file.link || '#'" :alt="file.name || 'File'" class="file-order"/>
                </div>
                <div class="seperate"></div>
              </div>
            </div>
            <div v-else>Không có file nào !</div>
          </div>
        </b-collapse>
        <!-- logs -->
        <b-collapse :id="'comment-' + order.id">
          <div class="ml-2 mt-1">
            <perfect-scrollbar :options="scrollbarOption" class="logs-list" :class="smallView ? 'font-12' : 'font-13'">
              <div v-for="(log, idxLog) in order.logs || []" :key="idxLog">
                <i>{{ formatDate(log.created, 'DD-MM-YYYY HH:mm:ss') }}</i>
                <b-link :to="'/profile/master/edit/' + log.created_by.master_profile_id" v-if="log.created_by">{{ log.created_by.fullname }}</b-link>
                <span v-if="typeof log.message === 'string'" v-html="log.message"></span>
                <span v-else @click="$emit('action', { action: 'view-log-update', data: log.id })">Cập nhật lại thông tin (<span class="text-ghtk-action text-underline-hover">Xem chi tiết</span>)</span>
              </div>
            </perfect-scrollbar>
            <div class="input-group">
              <input
                type="text"
                class="form-control rounded-0 comment-input"
                @keypress.enter="sendComment()"
                v-model="comment"
                :id="'input-comment-' + order.id"
              >
              <div class="input-group-append">
                <button class="btn rounded-0" type="button" title="Gửi" @click="sendComment()"><i class="fas fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </b-collapse>
      </div>
      <!-- Người tạo -->
      <div :class="smallView ? 'font-11' : 'font-12'">
        <span class="text-muted">Người tạo:</span>
        <span>
          <span class="text-muted" v-if="order.created_by && +order.created_by.id > 1">{{ order.created_by.fullname }} - {{  order.created_by.username }} - {{ order.created_by.position_name }}</span>
          <span v-else class="text-muted">Hệ thống đề xuất tự động</span>
        </span>
      </div>
    </td>

    <!-- Nội dung quan trọng -->
    <td>
      <div><span class="font-weight-500">Ghi chú/lý do: </span><i>{{ order.note }}</i></div>
      <div :class="moment() > moment(order.deadline) && 'text-danger'" v-if="order.deadline && !['da_duyet', 'tu_choi'].includes(order.status)">
        <span class="font-weight-500">Hạn duyệt: </span>{{ formatDate(order.deadline, 'DD/MM/YYYY') }}
      </div>
      <div v-if="order.contract_info && order.contract_info.type_contract">
        <div v-show="type.alias === 'new_contract'">
          <span class="font-weight-500">Tính KPI: </span>{{ +order.contract_info.has_kpi ? 'Có' : 'Không' }}
        </div>
        <b-link :class="smallView ? 'font-12' : 'font-13'" v-b-toggle="'contract-' + order.id" class="text-ghtk-action text-underline-hover">Chi tiết</b-link>
        <b-collapse :id="'contract-' + order.id" class="bg-light">
          <b-row :class="smallView ? 'font-12' : 'font-13'" class="font-weight-500">
            <b-col md="6">Loại hợp đồng:</b-col><b-col md="6">{{ contractType[order.contract_info.type_contract] }}</b-col>
            <b-col md="6">Ngày bắt đầu:</b-col><b-col md="6">
              {{ formatDate(order.contract_info.start_date) }}
            </b-col>
            <b-col md="6">Ngày kết thúc:</b-col><b-col md="6">
              {{ formatDate(order.contract_info.end_date) }}
            </b-col>
            <b-col md="6">Lương thử việc:</b-col><b-col md="6">{{ order.contract_info.trial_salary }}</b-col>
            <b-col md="6">Lương chính thức:</b-col><b-col md="6">{{ order.contract_info.salary }}</b-col>
            <b-col md="6">Tổng phụ cấp:</b-col><b-col md="6">{{ calAllowance(order.contract_info) }}
            </b-col>
            <b-col md="6">Tính KPI:</b-col><b-col md="6">{{ +order.contract_info.has_kpi ? 'Có' : 'Không' }}</b-col>
          </b-row>
        </b-collapse>
      </div>
    </td>

    <!-- Trạng thái -->
    <td class="text-center">
      <b :class="'text-' + getStatusVariant()">{{ getStatusDesc() }}</b>
    </td>

    <!-- Người xử lý -->
    <td>
      <Censor
        :order="order"
        :smallView="smallView"
      />
    </td>

    <!-- Action -->
    <td class="text-center">
      <div v-if="showAction(order) && flowAction[duty[type.category]]">
        <div v-for="(btnAction, key) in flowAction[duty[type.category]][order.status] || []" :key="key + '_btn'">
          <b-btn
            variant="outline-ghtk"
            @click="updateStatus(btnAction.action)"
            size="sm"
            class="my-1 w-75"
            v-if="(!btnAction.order_group || btnAction.order_group.includes(order.order_group))"
          >
            {{ btnAction.text || (statusDesc[btnAction.action] && statusDesc[btnAction.action].desc) }}
          </b-btn>
        </div>
      </div>
      <div v-if="order.status === 'co_ket_qua' && curUser && curUser.User && curUser.User.id && order.created_by && +order.created_by.id === +curUser.User.id">
        <b-btn
          variant="outline-ghtk"
          @click="updateStatus('nhan_ban_giao')"
          size="sm"
          class="my-1 w-75"
        >
          Đã nhận bàn giao/ thanh toán
        </b-btn>
      </div>
      <div v-if="order.status === 'da_duyet' && type.alias === 'new_contract' && !order.signed">
        <b-btn
          variant="outline-ghtk"
          @click="updateStatus('edit_contract')"
          size="sm"
          class="my-1 w-75"
        >
          Sửa HĐ
        </b-btn>
        <b-btn
          v-show="!canSignEContract"
          variant="outline-ghtk"
          @click="updateStatus('export_contract')"
          size="sm"
          class="my-1 w-75"
        >
          In HĐ
        </b-btn>
      </div>
    </td>
  </tr>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style lang="css" scoped>
  .font-weight-500 {
    font-weight: 500 !important;
  }
  .file-order {
    height: 4rem;
    margin-right: 2px;
    margin-top: 2px;
  }
  .logs-list {
    min-height: 1rem;
    max-height: 5rem;
    border: 1px dashed #ccc;
    padding-left: 0.5rem;
    padding-top: 0.25rem;
  }
  .show-file {
    border: 1px dashed #ccc;
  }
  .font-11 {
    font-size: 11px;
  }
  .font-12 {
    font-size: 12px;
  }
  .font-13 {
    font-size: 13px;
  }
  .font-11 >>> .multiselect__single {
    font-size: 11px;
  }
  .font-11 >>> .multiselect {
    font-size: 11px;
  }
  .font-11 >>> .multiselect__tags {
    font-size: 11px;
  }
  .font-12 >>> .multiselect__single {
    font-size: 12px;
  }
  .font-12 >>> .multiselect {
    font-size: 12px;
  }
  .font-12 >>> .multiselect__tags {
    font-size: 12px;
  }
  .font-13 >>> .multiselect__single {
    font-size: 13px;
  }
  .font-13 >>> .multiselect {
    font-size: 13px;
  }
  .font-13 >>> .multiselect__tags {
    font-size: 13px;
  }
  td {
    border-bottom: 1px solid #ddd;
  }
  .seperate {
    display: inline-block;
    height: 4rem;
    vertical-align: middle;
  }
</style>
<script>

// custom component
import Censor from './Censor'

// built-in component
import Datepicker from 'vuejs-datepicker'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

// entities
import Order from 'domain/entities/Order'
import Contract from 'domain/entities/Contract'
import ManageListCod from 'domain/entities/ManageListCod'

// service
import hrOrderService from 'domain/services/hr-order-service'

// library
import { mapGetters } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'order-row-data',

  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Object,
      default: () => ({})
    },
    duty: {
      type: Object,
      default: () => ({})
    },
    smallView: {
      type: Boolean,
      default: false
    }
  },

  components: {
    PerfectScrollbar,
    Censor,
    Datepicker
  },

  data: () => ({
    scrollbarOption: {
      wheelSpeed: 0.2,
      wheelPropagation: false,
      suppressScrollX: false
    },
    categoryAlias: Order.categoryAlias,
    statusDesc: Order.statusDesc,
    flowAction: Order.flowAction,
    contractType: Contract.typeOptions,
    codGroupIds: ManageListCod.codGroupIds,
    comment: null
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    moment () {
      return moment
    },

    canSignEContract () {
      return this.order.contract_info && +this.order.contract_info.has_kpi &&
      ['service_contract', 'indefinite', 'definite', 'definite_24'].includes(this.order.contract_info.type_contract)
    }
  },

  methods: {
    genCodeOrder (id, prefix = 'BH', postfix = '', codeLength = 6) {
      return helper.genCode(id, prefix, postfix, codeLength)
    },

    addComment (orderId) {
      this.$nextTick(() => {
        let input = this.$el.querySelector('#input-comment-' + orderId)
        if (input) input.focus()
      })
    },

    sendComment () {
      if (!this.comment) return
      this.comment = this.comment.trim()
      if (!this.comment) {
        alert('Vui lòng nhập comment !')
        return
      }
      hrOrderService.sendComment({ message: this.comment, order_id: this.order.id })
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              if (this.order.logs && Array.isArray(this.order.logs)) {
                this.order.logs.unshift(res.data.data)
              } else {
                this.order.logs = [res.data.data]
              }
              this.comment = null
            }
          } else {
            helper.showMessage(res.data.message || 'không thêm được comment !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không thêm được comment !', 'warning')
        })
    },

    formatDate (date, format) {
      return helper.formatDate(date, format)
    },

    formatMoney (value) {
      return helper.formatMoney(value)
    },

    calAllowance (dataContract) {
      if (!dataContract) return 0
      let sum = 0
      if (dataContract.meal_allowance) sum += +((dataContract.meal_allowance + '').match(/\d/g).join(''))
      if (dataContract.trans_allowance) sum += +((dataContract.trans_allowance + '').match(/\d/g).join(''))
      if (dataContract.mobile_allowance) sum += +((dataContract.mobile_allowance + '').match(/\d/g).join(''))
      if (dataContract.resp_allowance) sum += +((dataContract.resp_allowance + '').match(/\d/g).join(''))
      if (dataContract.biztrip_allowance) sum += +((dataContract.biztrip_allowance + '').match(/\d/g).join(''))

      return this.formatMoney(sum)
    },

    showAction (order) {
      if (!order || !this.type || !this.duty[this.type.category] || ['hoan_thanh', 'da_huy'].includes(order.status)) return false
      if (this.duty[this.type.category] === 'CnB') return true

      // Điều kiện theo người duyệt
      if (!order.censors || !Array.isArray(order.censors)) return false
      return this.curUser && this.curUser.User && order.censors.find(op => (+this.curUser.User.id === +op.id))
    },

    updateStatus (action) {
      this.$emit('updateStatus', action)
    },

    getStatusVariant () {
      if (this.type.alias !== 'new_contract' || this.order.status !== 'da_duyet') return this.statusDesc[this.order.status] && this.statusDesc[this.order.status].variant
      else if (!this.order.signed) return 'warning'
      else return this.statusDesc['da_duyet'].variant
    },

    getStatusDesc () {
      if (!this.order.delete) {
        if (this.type.alias !== 'new_contract' || this.order.status !== 'da_duyet') return this.statusDesc[this.order.status] && this.statusDesc[this.order.status].desc
        else if (!this.order.signed) return 'Chưa ký HĐ'
        else return this.statusDesc['da_duyet'].desc
      } else return 'Đã hủy'
    },

    gotoCodProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    }
  }
}
</script>
