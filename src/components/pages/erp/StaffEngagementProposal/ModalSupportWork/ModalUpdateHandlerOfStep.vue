<template>
  <b-modal
    @hide="resetForm"
    title="Cập nhật người xử lý" centered id="modal-censor-order-v2" static
    header-class="justify-content-center" modal-class="modal-xs align-items-center" hide-footer>
    <div class="modal-body list-user-censor" v-if="handlers">
      <div v-for="(handler, key) in handlers" :key="key">
        <div class="d-flex justify-content-between align-self-center content-censor mb-2">
          <div class="info-censor align-items-center d-flex" v-if="handlers">
            <div class="avt-censor mr-2" v-if="handler.master_profile.image_profile">
              <img
                  :src="handler.master_profile.image_profile"
                   alt="avt-user-censor" width="30" height="30">
            </div>
            <div class="name-censer mr-2 font-14">
              {{ ConvertName(handler.fullname) }} - {{ handler.username || '' }} - {{ handler.position.position_name }}
            </div>
            <div class="btn-chat mr-2">
              <b-btn class="btn__chat border-0 btn btn-default p-0" @click="gotoGroupChat(handler)">
                <img src="../../../../../assets/images/ic-chat.png" alt="icon chat" width="24" height="24">
              </b-btn>
            </div>
          </div>
          <div class="btn-delete-user">
            <b-btn
              class="btn text-danger border-danger btn-outline-default btn-sm"
              @click="removeHandlerStepOfOrder(handler.id)" >
              Xóa
            </b-btn>
          </div>
        </div>
        <hr class="mt-2 mb-2">
      </div>
    </div>
    <div class="d-flex justify-content-between border-0">
      <div class="input-user-censor">
        <single-select-user
          :user="userHandler"
          @select="selectHandler"
          @remove="removeHandler"
          placeholder="Nhập người xử lý">
        </single-select-user>
      </div>
      <div class="footer-btn">
        <b-btn
            class="btn btn__add" @click="addHandlerStepOfOrder()"
        >
          Thêm
        </b-btn>
      </div>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
  .input-user-censor {
      width: 88%;
  }
  .btn__add {
    background: #00904A;
    height: 22px;
    width: 45px;
    border-radius: 6px;
    padding: 0;
    font-size: 13px;
    align-self: end;
  }
  .name-censer {
    font-weight: 500;
  }

</style>

<script>
import hrOrderService from 'domain/services/hr-order-service'
import helper from 'infrastructures/helpers/common-helpers'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'

export default {
  name: 'ModalUpdateHandlerOfStep',
  components: {
    SingleSelectUser
  },
  props: {
    stepId: null,
    handlers: []
  },
  data: () => ({
    userHandler: null
  }),
  methods: {
    selectHandler (option = null) {
      this.userHandler = option
    },

    removeHandler () {
      this.userHandler = null
    },

    removeHandlerStepOfOrder (userId) {
      if (!confirm('Bạn có chắc chắn muốn xóa người này khỏi xử lý đề xuất !')) {
        return
      }
      if (!this.stepId || !userId) {
        alert('Thiếu thông tin truyền vào !')
        return
      }
      let data = {
        step_id: this.stepId,
        user_id: userId
      }
      this.loading = true
      this.$startLoading()
      hrOrderService.removeHandlerStepOfOrder(data)
        .then(res => {
          if (res.data.success) {
            this.$bvModal.hide('modal-censor-order-v2')
            this.$emit('reset')
            helper.showMessage(res.data.message || 'Cập nhật thành công người xử lý đề xuất !', 'success')
          } else {
            this.loading = false
            helper.showMessage(res.data.message || 'Cập nhật Không thành công người xử lý đề xuất !')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
          this.$stopLoading()
        })
    },

    addHandlerStepOfOrder () {
      if (!this.stepId || !this.userHandler) {
        alert('Thiếu thông tin truyền vào !')
        return
      }
      let data = {
        step_id: this.stepId,
        user_id: this.userHandler.id
      }
      this.loading = true
      this.$startLoading()
      hrOrderService.addHandlerToStepOfOrder(data)
        .then(res => {
          if (res.data.success) {
            this.$bvModal.hide('modal-censor-order-v2')
            this.$emit('reset')
            helper.showMessage(res.data.message || 'Cập nhật thành công người xử lý đề xuất !', 'success')
          } else {
            this.loading = false
            helper.showMessage(res.data.message || 'Cập nhật Không thành công người xử lý đề xuất !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
          this.$stopLoading()
        })
    },
    gotoGroupChat (censor) {
      if (!censor || !censor.id) return
      if (censor.channel_id) {
        window.open('https://i.ghtklab.com/channel/internal/' + censor.channel_id, '_blank')
      } else { // Tạo group chat nếu chưa có
        hrOrderService.createDirectChat({user_id: censor.id})
          .then(res => {
            if (res.data.success) {
              let channelId = res.data.data.channel_id
              window.open('https://i.ghtklab.com/channel/internal/' + channelId, '_blank')
            } else {
              helper.showMessage(res.data.message || 'Tạo direct chat thất bại !')
            }
          })
          .catch(e => {
            helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau!')
            console.log(e)
          })
          .finally(_ => {
            this.loading = false
          })
      }
    },
    resetForm: function () {
      this.userHandler = null
    },
    ConvertName (str) {
      return str.length > 0 ? str.split(' ').map(w => w.toLowerCase().charAt(0).toUpperCase() + w.toLowerCase().slice(1)).join(' ') : ''
    }
  }
}

</script>

<style scoped>

</style>
