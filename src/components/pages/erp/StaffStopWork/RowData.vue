<template>
  <tr>
      <td class="pt-3">
        <InfoUserOrderStopWork :order="data.order" :duty="checkDuty" @action="action(data, ...arguments)" @clickAction="actionUpdateRecord"/>
      </td>
      <td class="pt-0">
        <div>
          <DetailStatusOrderStopWork
            :dataOrder="data.order"
            :type="data.type"
            :showStatus="showAction"
            :editableTag="editableTag"
            :tableName="'stop_working'"
            @toggleModalHrTag="handleToggleModalHrTag"
            @showCensorOrder="showListCensorOrder"
            @showCensorAccount="showListCensorAccount"/>
        </div>
        <div>
          <DetailLogOrderStopWork :detailLog="data.order"/>
        </div>
      </td>
      <td class="text-center box-btn-action" v-if="!data.order.hideAction">
        <div class="mt-2 mb-2" v-if="showAction">
          <b-btn class="btn-sm" variant="outline-ghtk" @click="checkShowModal(index, 'ghi_chu')">
            Ghi chú
          </b-btn>
        </div>
        <div class="mb-2 mt-2" v-if="data.order.checkActionConfirm">
          <b-btn variant="outline-ghtk" v-if="!allowConfirm(data.order.status)" class="btn-sm"
                 @click="updateStatus(index, 'duyet', data.order.note)">Duyệt
          </b-btn>
        </div>
        <div v-if="data.order.checkActionConfirm" class="mt-2 mb-2">
          <b-btn variant="outline-danger" class="btn__refuse btn-sm"
                 v-if="!allowConfirm(data.order.status)" @click="checkShowModal(index, 'tu_choi')">Từ chối</b-btn>
        </div>
        <div class="mb-2 mt-2" v-if="!data.order.checkChotSo && data.order.showActionBHXH && data.order.status == 'hoan_thanh'">
          <b-btn variant="outline-ghtk" class="btn-sm"
                 @click="checkShowModal(index, 'chot_so')">Chốt sổ BHXH
          </b-btn>
        </div>
        <div v-if="data.order.checkActionHD && !data.order.statusContract && data.order.status == 'hoan_thanh'" class="mt-2 mb-2">
          <b-btn variant="outline-ghtk" class="outline-ghtk btn-sm"
                 @click="showModalContract(data.order.contract)">Thanh lý HĐ</b-btn>
        </div>
        <div v-if="data.order.can_action_explain" class="mt-2 mb-2">
          <b-btn variant="outline-danger" class="btn__refuse btn-sm"
                 @click="showModalExplain(data.order)">Giải trình</b-btn>
        </div>
      </td>
      <td class="text-center box-btn-action" v-else></td>
  </tr>
</template>

<style scoped lang="scss">
  img {
    object-fit: cover;
  }

  .header-row {
    border: 1px solid #E5E5E5;
    th {
      vertical-align: middle;
      border: 1px solid #E5E5E5;
      background: #FAFAFA;
      position: sticky;
      top: -1px;
      box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.4);
      z-index: 1;
      height: 50px;
      font-weight: 500;
      color: #000000;
    }
    .profile-col {
      width: 30%;
    }
    .log-col {
      width: 56%;
    }
    .action-col{
      width: 8%;
    }
  }

  td {
    border: 1px solid #E5E5E5;
  }

  .box-btn-action {
    .btn {
      border-radius: 20px;
      width: 52%;
    }

    .btn__refuse {
      border: 1px solid #D40000;
      color: #D40000;
    }
    .btn__refuse:hover {
      color: #FFFFFF;
    }
  }

  .btn-ghtk-disable {
    color: #069255;
  }
</style>

<script>
// custom component

// helper
// import helper from 'infrastructures/helpers/common-helpers'
import InfoUserOrderStopWork from 'components/pages/erp/StaffStopWork/InfoUserOrderStopWork'
import DetailStatusOrderStopWork from 'components/pages/erp/StaffStopWork/DetailStatusOrderStopWork'
import DetailLogOrderStopWork from 'components/pages/erp/StaffStopWork/DetailLogOrderStopWork'

export default {
  name: 'row-data',

  components: {
    InfoUserOrderStopWork, DetailStatusOrderStopWork, DetailLogOrderStopWork
  },

  props: {
    data: {
      default: null,
      type: Object
    },
    index: {
      default: null
    },
    checkDuty: {
      default: false
    },
    editableTag: {
      default: true
    },
    searchOrder: {
      default: false
    },
    showAction: {
      type: Boolean,
      default: true
    }
  },

  data: _ => ({
  }),

  computed: {
  },

  created () {
    this.allowConfirm()
  },

  methods: {
    checkShowData (idx) {
      var data = this.orders[idx].order
      if (data.check_deposit && data.statusContract && data.check_transfer && data.status === 'hoan_thanh' && !this.searchOrder) {
        if (data.relate_order) {
          if (data.checkStatusBHXH) {
            return false
          }
        } else if (data.checkChotSo) {
          return false
        }
      }

      return true
    },
    // hiện nút duyệt, từ chối, ghi chú
    allowConfirm (status) {
      return ['da_duyet', 'da_duyet_leader', 'da_duyet_supervisor', 'tu_choi', 'hoan_thanh'].includes(status)
    },

    checkShowModal (idx, status) {
      let data = {
        index: idx,
        status: status,
        action: 'checkShowModal'
      }
      this.$emit('changeAction', data)
    },
    showModalContract (contract) {
      let data = {
        contract: contract,
        action: 'showModalContract'
      }
      this.$emit('changeAction', data)
    },
    updateStatus (idx, status, note) {
      let data = {
        index: idx,
        status: status,
        note: note,
        action: 'updateStatus'
      }
      this.$emit('changeAction', data)
    },
    actionUpdateRecord (action) {
      let data = {
        data: action,
        action: 'actionUpdateRecord'
      }
      this.$emit('changeAction', data)
    },
    handleToggleModalHrTag (action = null) {
      let data = {
        data: action,
        action: 'handleToggleModalHrTag'
      }
      this.$emit('changeAction', data)
    },
    showListCensorOrder (orderId) {
      let data = {
        orderId: orderId,
        action: 'showListCensorOrder'
      }
      this.$emit('changeAction', data)
    },
    showListCensorAccount (action) {
      let data = {
        data: action,
        action: 'showListCensorAccount'
      }
      this.$emit('changeAction', data)
    },
    action (value, action) {
      let data = {
        data: value,
        arguments: action,
        action: 'action'
      }
      this.$emit('changeAction', data)
    },
    showModalExplain (order) {
      let data = {
        order: order,
        action: 'showModalExplainResign'
      }
      this.$emit('changeAction', data)
    }
  }
}
</script>
