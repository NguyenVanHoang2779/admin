<template>
  <div>
    <b-modal id="modal-add-exist-user" ref="addExistUserModalRef" @hidden="resetDefault" static>
      <div slot="modal-title">
        Thêm tài khoản vào master profile
      </div>
      <div>
          <div class="col-form-label pt-0">Chọn tài khoản</div>
          <b-form-input
                  v-model="username"
                  placeholder="Nhập username"
          ></b-form-input>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="hideModal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="addExistUser">Đồng ý</button>
      </template>
    </b-modal>
    <b-modal id="modal-alert-message" ref="alertMessageModalRef" static>
      <div slot="modal-title">
        Cảnh báo
      </div>
      <div v-html="alertMessage">
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="hideAlertModal">Đóng</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import profileService from 'domain/services/profile-service'
export default {
  name: 'modal-add-exist-user',

  components: {
  },

  props: {
    masterId: {
      type: String,
      required: true
    }
  },

  data: () => ({
    username: '',
    alertMessage: ''
  }),

  created () {
  },

  watch: {
  },

  methods: {
    hideModal () {
      this.$refs.addExistUserModalRef.hide()
    },

    hideAlertModal () {
      this.$refs.alertMessageModalRef.hide()
    },

    showAlertModal () {
      this.$refs.alertMessageModalRef.show()
    },

    addExistUser () {
      this.$startLoading()
      let dataSend = {
        username: this.username,
        master_id: this.masterId
      }

      profileService.addExistUserIntoMasterProfile(dataSend)
        .then(response => {
          if (response.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Bạn đã thêm tài khoản thành công!'
            })
            this.hideModal()
            this.$emit('handleAddedUser', true)
          } else {
            this.alertMessage = response.data.message
            this.showAlertModal()
          }
        }).catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra'
          })
        }).then(() => {
          this.$stopLoading()
        })
    },

    resetDefault () {
      this.username = ''
    }
  }
}
</script>
