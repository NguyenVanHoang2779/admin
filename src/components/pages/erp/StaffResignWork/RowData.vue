<template>
  <tr>
      <td class="pt-3">
        <InfoUserOrderResignWork :permission="permission" :order="data" @action="action(data, ...arguments)" @clickAction="actionUpdateRecord"/>
      </td>
      <td class="pt-0">
        <div>
          <DetailStatusOrderResignWork
            :data="data"
            :permission="permission"
            :editableTag="editableTag"
            :tableName="'stop_working'"
            @toggleModalHrTag="handleToggleModalHrTag"
            @showCensors="showListCensors"/>
        </div>
        <div>
          <DetailLogOrderResignWork
            :permission="permission" :detailLog="data.logs"/>
        </div>
      </td>
      <td class="text-center box-btn-action">
        <div class="mt-2 mb-2">
          <b-btn class="btn-sm" variant="outline-ghtk" @click="checkShowModal(index, 'ghi_chu')">Ghi chú</b-btn>
        </div>
        <div class="mb-2 mt-2" v-if="showAction(type.order, data.showAction) && permission.edit_action">
          <b-btn variant="outline-ghtk" class="btn-sm" @click="updateStatus(index, 'duyet', data.note)">Duyệt
          </b-btn>
        </div>
        <div class="mt-2 mb-2" v-if="showAction(type.order, data.showAction) && permission.edit_action">
          <b-btn variant="outline-danger" class="btn__refuse btn-sm" @click="checkShowModal(index, 'tu_choi')">Từ chối</b-btn>
        </div>
        <div class="mb-2 mt-2" v-if="showAction(type.insurance, data.showAction) && permission.edit_action">
          <b-btn variant="outline-ghtk" class="btn-sm" @click="checkShowModal(index, 'chot_so')">Chốt sổ BHXH
          </b-btn>
        </div>
        <div class="mt-2 mb-2" v-if="showAction(type.contract, data.showAction) && permission.edit_action">
          <b-btn variant="outline-ghtk" class="outline-ghtk btn-sm" @click="showModalContract(data.contract)">Thanh lý HĐ</b-btn>
        </div>
      </td>
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
import InfoUserOrderResignWork from 'components/pages/erp/StaffResignWork/InfoUserOrderResignWork'
import DetailStatusOrderResignWork from 'components/pages/erp/StaffResignWork/DetailStatusOrderResignWork'
import DetailLogOrderResignWork from 'components/pages/erp/StaffResignWork/DetailLogOrderResignWork'

export default {
  name: 'row-data',

  components: {
    InfoUserOrderResignWork, DetailStatusOrderResignWork, DetailLogOrderResignWork
  },

  props: {
    data: {
      default: null,
      type: Object
    },
    index: {
      default: null
    },
    editableTag: {
      default: true
    },
    search: {
      default: false
    },
    permission: {}
  },

  data: _ => ({
    type: {
      order: 'order',
      insurance: 'insurance',
      contract: 'contract'
    }
  }),

  computed: {
  },

  created () {
  },

  methods: {
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
    showListCensors (value) {
      let data = {
        censors: value.censors,
        type: value.action,
        orderId: value.orderId,
        masterId: value.masterId,
        action: 'showListCensors'
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
        action: 'handleToggleModalHrTag'
      }
      this.$emit('changeAction', data)
    },
    showModalExplain (order) {
      let data = {
        order: order,
        action: 'showModalExplainResign'
      }
      this.$emit('changeAction', data)
    },
    showAction (type, showAction) {
      if (!showAction) {
        return false
      }

      if (type === this.type.order && !showAction.order) {
        return false
      }

      if (type === this.type.contract && !showAction.contract) {
        return false
      }

      if (type === this.type.insurance && !showAction.insurance) {
        return false
      }

      return true
    }
  }
}
</script>
