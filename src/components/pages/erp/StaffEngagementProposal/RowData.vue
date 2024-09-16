<template>
  <tr>
<!--    Nhân viên-->
      <td class="pt-3">
        <InfoUserOrderSupportWork
          :permission="permission"
          :order="data" @action="action(data, ...arguments)"
          :index-row="index" @showModal="showModal"
          @clickAction="actionUpdateRecord"/>
      </td>
<!--        Trạng thái-->
      <td class="p-0">
        <b-btn
          @click="showStatusOrderSupportWork = !showStatusOrderSupportWork"
          class="font-weight-bold text-dark w-100 mt-3 text-left my-3 d-flex justify-content-between text-black pl-2" v-b-toggle = "'statusOrderResignWork' + index"
          style="background-color: rgba(176, 176, 176, 0.25); font-size: 1rem; border-radius: 0;">
          Trạng thái xử lý
          <i class="fa mt-1" style="color: #a3a4a6; margin-right: 0.7rem" :class="showStatusOrderSupportWork ? 'fa-caret-right' : 'fa-caret-down'"></i>
        </b-btn>
        <b-collapse visible class="mr-2" :id="'statusOrderResignWork' + index">
          <div>
            <DetailStatusOrderSupportWork
              :data-support="data"
              :permission="permission"
              :editableTag="editableTag"
              :index="index"
              :list-solutions="listSolutions"
              :tableName="'stop_working'"
              @toggleModalHrTag="handleToggleModalHrTag"
              @showCensors="showListCensors"
              @showModalResignV2="showModal"
            />
          </div>
        </b-collapse>
        <b-btn
          @click="logOrderSupportWork = !logOrderSupportWork"
          class="font-weight-bold text-dark w-100 mt-3 text-left my-3 d-flex justify-content-between text-black pl-2" v-b-toggle = "'idLogOrderSupportWork' + index"
          style="background-color: rgba(176, 176, 176, 0.25); font-size: 1rem; border-radius: 0;">
          Chi tiết log
          <i class="fa mt-1" style="color: #a3a4a6; margin-right: 0.7rem" :class="logOrderSupportWork ? 'fa-caret-right' :'fa-caret-down'"></i>
        </b-btn>
        <b-collapse class="mr-2" :id="'idLogOrderSupportWork' + index">
          <div>
            <DetailLogOrderSupportWork
              :permission="permission" :detailLog="data.logs" :idOrder="data.order_catalog_id" :user-id="data.user_id"/>
          </div>
        </b-collapse>
      </td>
<!--      <td class="text-center box-btn-action">-->
<!--        <div class="mt-2 mb-2">-->
<!--          <b-btn class="btn-sm" variant="outline-ghtk" @click="checkShowModal(index, 'ghi_chu')">Ghi chú</b-btn>-->
<!--        </div>-->
<!--        <div class="mb-2 mt-2" v-if="showAction(type.order, data.showAction) && permission.edit_action">-->
<!--          <b-btn variant="outline-ghtk" class="btn-sm" @click="updateStatus(index, 'duyet', data.note)">Duyệt-->
<!--          </b-btn>-->
<!--        </div>-->
<!--        <div class="mt-2 mb-2" v-if="showAction(type.order, data.showAction) && permission.edit_action">-->
<!--          <b-btn variant="outline-danger" class="btn__refuse btn-sm" @click="checkShowModal(index, 'tu_choi')">Từ chối</b-btn>-->
<!--        </div>-->
<!--        <div class="mb-2 mt-2" v-if="showAction(type.insurance, data.showAction) && permission.edit_action">-->
<!--          <b-btn variant="outline-ghtk" class="btn-sm" @click="checkShowModal(index, 'chot_so')">Chốt sổ BHXH-->
<!--          </b-btn>-->
<!--        </div>-->
<!--        <div class="mt-2 mb-2" v-if="showAction(type.contract, data.showAction) && permission.edit_action">-->
<!--          <b-btn variant="outline-ghtk" class="outline-ghtk btn-sm" @click="showModalContract(data.contract)">Thanh lý HĐ</b-btn>-->
<!--        </div>-->
<!--      </td>-->
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
import InfoUserOrderSupportWork from 'components/pages/erp/StaffEngagementProposal/InfoUserOrderSupportWork'
import DetailStatusOrderSupportWork from 'components/pages/erp/StaffEngagementProposal/DetailStatusOrderSupportWork'
import DetailLogOrderSupportWork from 'components/pages/erp/StaffEngagementProposal/DetailLogOrderSupportWork'

export default {
  name: 'row-data',

  components: {
    InfoUserOrderSupportWork,
    DetailStatusOrderSupportWork,
    DetailLogOrderSupportWork
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
    permission: {},
    listSolutions: []
  },

  data: _ => ({
    type: {
      order: 'order',
      insurance: 'insurance',
      contract: 'contract'
    },
    showStatusOrderSupportWork: false,
    logOrderSupportWork: true
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
        action: 'showListCensors',
        stepId: value.stepId || null
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
    },
    showModal ({type, data}) {
      if (type === 'note') {
        this.checkShowModal(data, 'ghi_chu')
      }
      // show popup thông báo nghỉ
      if (type === 'notice') {
        this.checkShowModal(data, 'thong_bao_nghi')
      } else {
        this.$emit('showModalV2', {type: type, indexOrder: data})
      }
    // @click="$emit('clickAction', {action: 'view_order', order_id: order.order_catalog_id})
    }
  }
}
</script>
