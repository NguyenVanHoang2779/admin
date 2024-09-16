<template>
  <b-modal static v-model="isShowModal" hide-footer :id="idModal" @hide="hideCheckConditionApproveModal">
    <div slot="modal-header" class="w-100 text-center font-18">
      Thông báo
    </div>
    <div>
      <div class="font-weight-bold">Nhân viên chưa đủ điều kiện để duyệt hợp đồng lao động:</div>
      <div v-for="(message,index) in dataCheckBeforeApprove" :key="index">{{index + 1}} . {{message}}</div>
      <div v-if="!canApproveNotQualifyContract" class="mt-2">
        <i>Vui lòng liên hệ Quản lý khu vực để duyệt hợp đồng.</i>
      </div>
      <div class="w-100 text-center mt-3">
        <b-btn v-if="canApproveNotQualifyContract" class="btn-ghtk mr-2" @click="continueApprove()">Tiếp tục duyệt</b-btn>
        <b-btn class="btn-outline-ghtk" @click="hideCheckConditionApproveModal()">Đóng</b-btn>
      </div>
    </div>
  </b-modal>
</template>

<script>
// build-component
import {mapGetters} from 'vuex'

export default {
  name: 'modal-check-before-approve-contract',

  props: {
    idModal: {
      type: String,
      default: 'check-before-approve-modal-new'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    dataCheck: {}
  },

  data: () => ({
    dataCheckBeforeApprove: [],
    isShowModal: this.isShow
  }),

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    canApproveNotQualifyContract: function () {
      if (!this.userInfo || !this.userInfo.ErpPosition) {
        return false
      }
      return [110, 271, 270, 272, 269, 286, 154].includes(parseInt(this.userInfo.ErpPosition.id))
    }
  },

  watch: {
    isShow: function (newValue, oldValue) {
      this.isShowModal = newValue
      this.$emit('toggleModal', newValue)
    },
    dataCheck: {
      deep: true,
      handler (newValue) {
        this.setDataCheckBeforeApprove(newValue)
      }
    }
  },

  methods: {
    setDataCheckBeforeApprove (dataCheck) {
      this.dataCheckBeforeApprove = []
      Object.keys(dataCheck).forEach(key => {
        if (!dataCheck[key].success) {
          this.dataCheckBeforeApprove.push(dataCheck[key].message)
        }
      })
    },

    hideCheckConditionApproveModal () {
      this.isShowModal = false
      this.$emit('toggleModal', false)
    },

    continueApprove () {
      this.$emit('continueApprove')
    }
  }
}
</script>
