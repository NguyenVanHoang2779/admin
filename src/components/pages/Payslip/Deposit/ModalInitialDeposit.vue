<template>
    <div>
        <b-modal size="lg" id="modal-initial-deposit" ref="modalInitialDeposit" :hide-footer="true" @hide="resetData()">
            <template v-slot:modal-title>
                Cập nhật thông tin cọc đầu vào
            </template>
            <div class="general-infor" v-if="!isAdd && isEdit">
                <div class="row">
                    <div class="col-md-3">
                        <div class="image-user">
                            <img v-bind:src="deposit.image_profile" alt="">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <p>Nhân viên: {{deposit.fullname}} ({{deposit.staff_code}})</p>
                        <p v-if="typeof deposit.groups !== 'undefined'">Vị trí: {{deposit.groups.toString()}}</p>
                        <p>Điện thoại: {{deposit.tel}}</p>
                        <p>Trạng thái:
                            <span v-if="deposit.status == 1"> Thiếu cọc</span>
                            <span v-else-if="deposit.status == 2">Đủ cọc</span>
                            <span v-else-if="deposit.status == 3">Hoàn trả thiếu</span>
                            <span v-else-if="deposit.status == 4">Hoàn trả đủ</span>
                            <span v-else>Không có dữ liệu</span>
                        </p>
                        <p>Tổng tiền cần cọc: <strong v-numeral v-text="deposit.payment_money"></strong>.
                          Số tiền cần cọc đầu vào: <strong v-numeral v-text="deposit.receivables_at_work"></strong>.
                          Đã đóng: <strong v-numeral v-text="deposit.total_deposited_money"></strong></p>
                    </div>
                </div>

                <button class="btn btn-outline-info mb-3" @click="changeUser()">
                    Thay đổi người cần cọc
                </button>
            </div>

            <div>
                <b-form-row>
                    <b-form-group label="Chọn nhân viên:" id="input-group-user" class="col-md-12" v-if="isAdd || !isEdit">
                        <single-select-user @onChange="selectedUser" :is-select-main-user="'yes'"></single-select-user>
                    </b-form-group>
                    <b-form-group label="Tiền cọc phải đóng:" id="input-deposit" class="col-md-6 input-group-initial-deposit">
                        <b-form-input class="only-bottom-border"
                                      v-model="payment_money"
                                      name="payment_money"
                                      placeholder="Nhập số tiền cọc phải đóng"
                                      v-validate="{required:true, numeric: true}"
                        >
                        </b-form-input>
                        <span class="position-absolute" style="right: 60px; bottom: 0">VNĐ</span>
                        <span v-show="errors.firstRule('payment_money') == 'required'" class="help is-danger">Không để trống trường này</span>
                        <span v-show="errors.firstRule('payment_money') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                    </b-form-group>
                    <b-form-group label="Tiền cọc cần đóng lúc nhận việc:" id="input-deposit-start" class="col-md-6 input-group-initial-deposit">
                        <b-form-input class="only-bottom-border"
                                      v-model="receivables_at_work"
                                      placeholder="Nhập số tiền cọc cần đóng lúc nhận việc"
                                      name="receivables_at_work"
                                      v-validate="{required:true, numeric: true}"
                        >
                        </b-form-input>
                        <span class="position-absolute" style="right: 60px; bottom: 0">VNĐ</span>
                        <span v-show="errors.firstRule('receivables_at_work') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('receivables_at_work') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                    </b-form-group>
                    <b-input-group>
                        <b-form-input class="only-bottom-border" style="max-width: 700px; padding-right: 35px; " v-model="note" placeholder="Viết ghi chú"></b-form-input>
                    </b-input-group>
                </b-form-row>
                <b-button class="mt-3" block @click="updateInitialDeposit()">Xác nhận</b-button>
                <notifications group='update-initial-deposit'></notifications>
            </div>
        </b-modal>
    </div>
</template>

<script>
import depositService from 'domain/services/deposit-service'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(VeeValidate)
export default {
  name: 'modal-initial-deposit',

  components: {
    SingleSelectUser
  },

  props: {
    deposit: {
      default: Object
    }
  },

  data: () => ({
    user: '',
    payment_money: null,
    receivables_at_work: null,
    note: null,
    notify: {
      message: '',
      class: '',
      title: '',
      duration: ''
    },
    isEdit: true
  }),

  created () {
  },

  computed: {
    isAdd: function () {
      return Object.keys(this.deposit).length === 0 && this.deposit.constructor === Object
    }
  },

  watch: {
    deposit: function (val) {
      this.payment_money = this.deposit.payment_money
      this.receivables_at_work = this.deposit.receivables_at_work
      this.note = this.deposit.note
    }
  },

  methods: {
    selectedUser (option) {
      this.user = option
    },

    changeUser () {
      this.isEdit = !this.isEdit
    },

    resetData () {
      this.isEdit = true
      this.errors.clear()
    },

    updateInitialDeposit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let dataSend = {
            payment_money: this.payment_money,
            receivables_at_work: this.receivables_at_work,
            note: this.note
          }
          if (this.isAdd) {
            this.$set(dataSend, 'user_id', this.user.id)
          } else {
            if (!this.isEdit) {
              this.$set(dataSend, 'user_id', this.user.id)
            } else {
              this.$set(dataSend, 'master_profile_id', this.deposit.master_profile_id)
            }
            this.$set(dataSend, 'deposit_id', this.deposit.deposit_id)
          }
          depositService.updateInitialDeposit(dataSend).then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                commonHelper.showMessage(response.data.message, 'success')
                this.$refs.modalInitialDeposit.hide()
                this.$emit('updateData')
              } else {
                commonHelper.showMessage(response.data.message, 'warning')
              }
            } else {
              this.notify.success = false
            }
          }).catch(e => {
            this.notify.success = false
            this.notify.message = 'Có lỗi xảy ra, liên hệ IT để được hỗ trợ'
            this.showNotification(false)
          })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        console.log(e)
      })
    },

    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'update-initial-deposit',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify,
        duration: this.notify.duration
      })
    }
  }
}
</script>

<style scoped>
    .only-bottom-border {
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
    .input-group-initial-deposit {
        padding-right: 60px;
    }
    .image-user {
        padding: 5px 5px 5px 5px;
        width: 140px;
        height: 140px;
    }
    .image-user img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
</style>
