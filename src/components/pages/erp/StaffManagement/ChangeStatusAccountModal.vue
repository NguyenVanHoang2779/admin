<template>
  <!-- Modal thay đổi trạng thái tài khoản -->
  <b-modal
    class="modal-cus"
    v-model="openModal"
    :title="statusChange === 'lock' ? 'Khoá tài khoản' : 'Mở khoá tài khoản'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-change-acc"
    hide-footer
    @hide="onClose()"
    >
    <div class="modal-title">
      <div v-if="listAccount.length > 1" class="title-cus">
        <p class="title-cus-p1">Vui lòng chọn 01 tài khoản bạn muốn</p>
        <p class="title-cus-p2">{{ statusChange === 'lock' ? 'Khoá!' : 'Mở khoá!'}}</p>
      </div>
      <div v-if="listAccount.length === 0" class="title-cus">
        <p class="title-cus-p1">Không có tài khoản {{ statusChange === 'lock' ? 'nào đang mở khoá!' : 'bị khoá!'}}</p>
      </div>
      <div v-if="listAccount.length === 1" class="title-cus" v-loading="loading">
        <p class="title-cus-p1">Bạn có chắc chắn muốn chuyển trạng</p>
        <p class="title-cus-p2">thái của tài khoản {{listAccount[0].username}} sang</p>
        <p class="title-cus-p3" v-if="statusChange !== 'lock'">đang hoạt động không?</p>
        <p class="title-cus-p3" v-if="statusChange === 'lock'">tạm khoá không?</p>
      </div>
    </div>
    <div class="modal-change-acc" v-loading="loading" v-if="listAccount.length > 1">
      <div>
        <Multiselect
          v-model="employee"
          :options="listAccount"
          label="username"
          track-by="id"
          placeholder="Chọn tài khoản"
          :multiple="false"
          :allow-empty="false"
          :close-on-select="true"
          deselect-label=""
          select-label=""
        />
      </div>
    </div>
    <div class="text-center mb-2">
      <b-btn v-if="listAccount.length > 1" variant="ghtk" id='btn-save-change' name='btn-save-change' class="button-deny-modal" @click="onSaveChange()">Xác nhận</b-btn>
      <b-btn v-if="listAccount.length === 1" variant="ghtk" id='btn-save-change-new' name='btn-save-change-new' class="button-deny-modal" @click="onSaveChange(listAccount[0])">Xác nhận</b-btn>
      <b-btn v-if="listAccount.length === 0" variant="ghtk" id='btn-save' name='btn-save' class="button-deny-modal" @click="onClose()">Đóng</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
  margin-bottom: 0.5rem;
}

/deep/ .modal-header {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.modal-change-acc {
  padding: 20px;
  font-size: 16px;
  color: #000;
}

.modal-change-acc {
  margin-top: -1rem;
  padding-right: 24%;
  padding-left: 24%;
}

.title-cus {
  font-size: 16px;
  text-align: center;
  font-weight: 400;
  .title-cus-p1{
    margin-top: 1rem;
  }
  .title-cus-p2 {
    margin-top: -1rem;
  }
  .title-cus-p3 {
    margin-top: -1rem;
  }
}

</style>
<style lang="css" scoped>
  .modal-cus >>> .modal-content {
    width: 70% !important;
  }
</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// service
import userService from '../../../../domain/services/user-service'

import Multiselect from 'vue-multiselect'

export default {
  name: 'ChangeStatusAccountModal',
  components: {
    Multiselect
  },

  props: {
    title: {
      type: String,
      default: 'Mở khoá tài khoản'
    },
    open: {
      default: false
    },
    options: {
      default: {}
    },
    user: {
      default: {}
    },
    listAccount: {
      type: Array,
      default: () => []
    },
    statusChange: {
      type: String,
      default: 'lock'
    }
  },

  data () {
    return {
      loading: false,
      openModal: false,
      employee: null
    }
  },

  watch: {
    open (v) {
      this.openModal = v
      this.employee = null
    }
  },

  methods: {
    onClose () {
      this.employee = null
      this.$emit('onCloseModal', 'changeSttModal')
    },
    async onSaveChange (account = null) {
      if (!this.employee && account === null) {
        return commonHelper.showMessage('Vui lòng chọn tài khoản')
      }
      try {
        this.loading = true
        let statusId = this.statusChange === 'lock' ? 2 : 3
        let userId = (account === null) ? this.employee.id : account.id
        const res = await userService.updateStatus(userId, statusId)
        if (res.data.success) {
          if (this.options.callback) {
            this.options.callback({userIdAcc: userId, statusIdAfter: statusId})
          }
          commonHelper.showMessage('Đã thay đổi trạng thái tài khoản', 'success')
          this.onClose()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>

</style>
