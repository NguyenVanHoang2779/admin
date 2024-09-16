<template>
    <div>
        <b-modal size="lg" id="modal-add-deposit" ref="myModalRef" :hide-footer="true" title="Thêm thông tin đặt cọc đầu vào" @hide="reset">
            <div>
                <b-form>
<!--                    <b-form-group id="input-group-2" label="Hình thức cọc:">-->
<!--                        <b-form-select v-model="form.type" v-validate="'required'" name="form-type">-->
<!--                            <option :value="null" disabled>Chọn hình thức cọc</option>-->
<!--                            <option value="1">Đóng cọc</option>-->
<!--                        </b-form-select>-->
<!--                        <span v-show="errors.firstRule('form-type') == 'required'" class="help is-danger">Không để trống trường này </span>-->
<!--                    </b-form-group>-->

                    <b-form-group id="input-group-1" label="Nhập số tiền đóng cọc:">
                        <input
                                class="form-control"
                                v-model="form.deposited_money"
                                name="form-deposited-money"
                                placeholder="Nhập số tiền"
                                v-validate="{required:true, numeric: true, max_value: deposit.payment_money}"
                        />
                        <span v-show="errors.firstRule('form-deposited-money') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('form-deposited-money') == 'max_value'" class="help is-danger">Số tiền nhập vào lớn hơn số tiền cần đóng </span>
                        <span v-show="errors.firstRule('form-deposited-money') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Nhập thời gian đóng cọc:" label-for="input-2">
                        <datepicker
                                v-model="form.date_time"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                                name="form-date"
                                v-validate="'required'"
                        />
                        <span v-show="errors.firstRule('form-date') == 'required'" class="help is-danger">Không để trống trường này </span>
                    </b-form-group>

                    <b-form-group label="Tải biên nhận:">
                        <b-form-file
                                v-model="form.file"
                                name="form-file"
                                v-validate="'required'"
                                placeholder="Choose a file..."
                                drop-placeholder="Drop file here..."
                        ></b-form-file>
                        <span v-show="errors.firstRule('form-file') == 'required'" class="help is-danger">Không để trống trường này </span>
                    </b-form-group>

                    <b-button @click="addDeposit()" variant="primary">Submit</b-button>
                    <b-button @click="reset()" variant="danger">Reset</b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import depositService from 'domain/services/deposit-service'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)
export default {
  name: 'modal-add-deposit',

  components: {
    Datepicker,
    moment
  },

  props: [
    'deposit'
  ],

  data: () => ({
    form: {
      deposited_money: null,
      date_time: '',
      file: null
      // type: 1
    },
    show: true
  }),

  created () {
  },

  watch: {},

  methods: {
    inputMoney (ref, field) {
      return commonHelper.inputMoney(ref, field)
    },
    addDeposit: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let formData = new FormData()
          formData.append('sgw_deposit_id', this.deposit.deposit_id)
          formData.append('deposited_money', commonHelper.reformatMoney(this.form.deposited_money))
          formData.append('date_time', moment(this.form.date_time).format('YYYY-MM-DD'))
          formData.append('file', this.form.file)
          formData.append('type', '1')

          depositService.add(formData)
            .then((res) => {
              if (res.data.success) {
                this.hideModal()
                this.updateData()
                commonHelper.showMessage(res.data.message, 'success')
              } else {
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
        }
      }).catch((e) => {
        console.log(e)
      })
        .finally(() => {
          this.$stopLoading()
        })
    },
    hideModal: function () {
      this.$refs.myModalRef.hide()
    },
    updateData: function () {
      this.$emit('updateData')
    },
    reset: function () {
      this.form.deposited_money = ''
      this.form.date_time = ''
      this.form.file = null
      // this.form.type = null
      this.errors.clear()
    }
  }
}
</script>

<style scoped>
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>
