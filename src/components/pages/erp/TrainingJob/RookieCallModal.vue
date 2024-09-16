<template>
  <div>
      <b-modal
        v-model="openModal"
        :title="getTitle()"
        :header-class="'text-center justify-content-center d-flex'"
        size="sm"
        centered
        static
        hide-footer
        @hidden="close()"
        @show="onShow()">

      <div v-if="user" v-loading="loading">
        <div>
          <b>Họ tên: </b><span style="text-transform: capitalize">{{user.fullname.toLowerCase()}}</span>
        </div>
        <div>
          <b>Vị trí: </b><span>{{user.position_name}}</span>
        </div>
        <div>
          <b>Số điện thoại: </b><span>{{user.tel}}</span>
        </div>
      </div>

      <div class="text-center mt-3">
        <b-btn variant="ghtk" class="button-close-modal-contact" @click="close()">Đóng</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
/deep/ .modal-header {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

/deep/ .modal-body {
  padding: 20px !important;
}

</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import newStaffService from 'domain/services/new-staff.service'

export default {
  name: 'ModalContact',
  props: {
    open: {
      default: false
    },
    options: {
      default: null
    },
    user: {
      default: null
    }
  },

  data () {
    return {
      openModal: false,
      loading: false
    }
  },

  watch: {
    open (v) {
      this.openModal = v
    }
  },

  methods: {
    close () {
      this.openModal = false
      this.$emit('onCloseModal', 'callModal')
    },

    onShow () {
      this.getUserPhoneNumber()
    },

    getTitle () {
      if (this.options && Object.hasOwn(this.options, 'title')) {
        return this.options.title
      } else {
        return 'Gọi điện'
      }
    },

    async getUserPhoneNumber () {
      try {
        this.loading = true
        const res = await newStaffService.getUserPhoneNumber({user_id: this.user.id})
        const {success, message, data} = res.data
        if (success) {
          this.user.tel = data['tel']
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    closeModalContact () {
      this.currentUser = null
      this.$bvModal.hide('modal-contact')
    },

    resetModal () {
      this.currentUser = null
    }
  }
}
</script>

<style scoped>

</style>
