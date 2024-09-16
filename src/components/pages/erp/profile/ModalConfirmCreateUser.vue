<template>
    <div>
        <b-modal modal-class="modal-custom" id="modal-confirm-create-user" centered :hide-header="true" :hide-footer="true" static>
            <div class="text-center badge-success header-class">
                Thông báo
            </div>
            <div class="content-class">
                <span v-if="!updateWithoutCreate">
                  Hệ thống sẽ tạo tài khoản chính mới do thay đổi cơ chế lương.
                  Tài khoản hiện tại sẽ khóa tạm thời vào ngày bắt đầu công việc mới. <br>
                </span>
                <span v-else>
                  Cơ chế lương của nhân viên đã bị thay đổi ! <br>
                  Vui lòng chọn phương án: <br>
                  <b>1. Tạo user mới:</b> Hệ thống sẽ tạo tài khoản chính mới do thay đổi cơ chế lương.
                  Tài khoản hiện tại sẽ khóa tạm thời vào ngày bắt đầu công việc mới. <br>
                  <b>2. Chỉ cập nhật:</b> Không tạo user mới mà chỉ cập nhật thông tin tài khoản, quá trình công tác cũ sẽ được update lại
                </span>
                <div class="mt-2 d-flex align-items-center">
                    <div class="text-date">
                        Ngày bắt đầu công việc mới <span class="text-danger">*</span>:
                    </div>
                    <div class="form-select-class"><b-form-select v-model="date" :options="options"></b-form-select></div>
                </div>
            </div>
            <div class="footer-class text-center mb-3 d-flex">
                <div class="wrap-button">
                <b-btn variant="outline-danger" class="button-custom" @click="$bvModal.hide('modal-confirm-create-user')">Hủy</b-btn>
                </div>
                <div class="wrap-button">
                <b-btn v-if="!isCreating" variant="outline-success" class="button-custom" @click="createNewUser">Tạo user</b-btn>
                <b-btn v-if="isCreating" variant="outline-success" class="button-custom" >Đang tạo user<i class="fa fa-spin fa-spinner ml-3"></i></b-btn>
                </div>
                <div class="wrap-button" v-if="updateWithoutCreate">
                  <b-btn variant="outline-success" class="button-custom" @click="editUser">Chỉ cập nhật</b-btn>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import staffService from 'domain/services/staff-service'

export default {
  name: 'modal-confirm-create-user',

  components: {
  },

  props: [
    'userData',
    'userDataOld',
    'userId',
    'masterProfileId',
    'updateWithoutCreate'
  ],

  data: () => ({
    isCreating: false,
    date: new Date().toLocaleDateString('en-US'),
    options: [
      { value: new Date().toLocaleDateString('en-US'), text: new Date().toLocaleDateString('vi-VN') + '(Ngay lập tức)' },
      { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US'), text: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN') },
      { value: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toLocaleDateString('en-US'), text: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toLocaleDateString('vi-VN') }
    ],
    newUserId: null
  }),

  created () {
  },

  watch: {},

  methods: {
    editUser () {
      this.$emit('editUser', 'update_last')
      this.$bvModal.hide('modal-confirm-create-user')
    },

    createNewUser () {
      this.isCreating = true
      let dataSend = Object.assign({}, this.userData)
      delete dataSend.username
      dataSend.user_id = this.userId
      dataSend.master_id = this.masterProfileId
      dataSend.date_create = this.date
      this.isProcessingUpdate = true
      staffService.createNewUser({
        'oldData': this.userDataOld,
        'newData': dataSend
      })
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Tạo tài khoản mới thành công.', 'success')
            let userId = res.data.data.id
            this.newUserId = res.data.data.id
            this.$router.push({ name: 'edit-user', params: { id: userId } })
            this.$bvModal.hide('modal-confirm-create-user')
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi tạo tài khoản mới !', 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.isCreating = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
    .header-modal {
        /*background-color: ;*/
    }
    .header-class {
        color: white;
        height: 36px;
        justify-content: center;
        display: flex;
        align-items: center;
        font-size: 18px;
    }
    .content-class {
        padding: 15px 15px;
        font-size: 16px;
        letter-spacing: 0.5px;
        word-wrap: break-word;
    }
    .button-custom {
        width: 85%;
        padding: 2px;
        border: 1px solid;
        border-radius: 7px;
        font-size: 18px;
    }
    .text-date {
        width: 50%;
    }
    .form-select-class {
        width: 47%;
    }
    .wrap-button {
        width: 50%;
    }
</style>
