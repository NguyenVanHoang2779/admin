<template>
  <div>
      <b-modal
        title="Config điểm danh từ xa"
        :header-class="'text-center justify-content-center d-flex'"
        size="sm"
        centered
        static
        hide-footer
        id="config-set-remote-checkin"
        v-loading="loading"
      >

      <div v-if="user">
          <div>Bạn có muốn nhân sự {{ user.fullname }} - {{ user.username }} - {{ user.position.position_name }} {{ user.can_remote_attendance ? 'hủy' : 'được' }} điểm danh từ xa ?</div>
      </div>

      <div class="text-center mt-3">
        <b-btn variant="ghtk" class="button-close-modal-contact close-btn mr-1" @click="$bvModal.hide('config-set-remote-checkin')">Hủy</b-btn>
        <b-btn variant="ghtk" class="button-close-modal-contact" @click="setRemoteCheckin">Xác nhận</b-btn>
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
  width: 120px;
}

.close-btn {
  background-color: #e0d8d8;
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

import staffManagementService from 'domain/services/staff-management-service'

export default {
  name: 'ModalSetRemoteCheckIn',
  props: {
    user: {
      type: Object | null,
      default: null
    }
  },

  data () {
    return {
      loading: false
    }
  },

  methods: {
    async setRemoteCheckin () {
      try {
        this.loading = true
        let res = null
        if (this.user.can_remote_attendance) {
          res = await staffManagementService.removeRemoteCheckin({user_id: this.user.id})
        } else {
          res = await staffManagementService.setRemoteCheckin({user_id: this.user.id})
        }
        const {success, message, data} = res.data
        if (success) {
          this.$bvModal.hide('config-set-remote-checkin')
          this.$emit('changeDataRemoteCheckin', data.can_remote_attendance)
        } else {
          commonHelper.showMessage(message, 'warning')
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
