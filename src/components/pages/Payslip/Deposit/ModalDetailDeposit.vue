<template>
    <div>
        <b-modal modal-class="modal-lg-custom" id="modal-detail-deposit" :hide-footer="true" :hide-header="true" static>
            <div class="general-infor">
                <div class="row">
                    <div class="col-md-3">
                        <div class="image-user">
                            <img v-bind:src="item.image_profile" alt="">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <p>Nhân viên: {{item.fullname}} ({{item.staff_code}})</p>
                        <p v-if="typeof item.groups !== 'undefined'">Vị trí: {{item.groups.toString()}} - Điện thoại: {{item.tel}}</p>
                        <p>Trạng thái:
                            <span v-if="item.status == 1"> Thiếu cọc</span>
                            <span v-else-if="item.status == 2">Đủ cọc</span>
                            <span v-else-if="item.status == 3">Hoàn trả thiếu</span>
                            <span v-else-if="item.status == 4">Hoàn trả đủ</span>
                            <span v-else>Không có dữ liệu</span>
                        </p>
                        <p>Tổng tiền cần cọc: <strong v-numeral v-text="item.payment_money"></strong>.
                          Số tiền cần cọc đầu vào: <strong v-numeral v-text="item.receivables_at_work"></strong>.
                          Đã đóng: <strong v-numeral v-text="item.total_deposited_money"></strong></p>
                        <p  v-if="!isShowInputNote">Ghi chú: {{item.note}}
                        <i class="ion-icon ion-md-create cursor-pointer" style="margin-right: 5px;" v-if="!isShowInputNote" @click="isShowInputNote = !isShowInputNote"></i>
                        </p>
                        <div v-else>
                            <b-row class="deposit-note">
                                <b-col md="2">
                                    Ghi chú:
                                </b-col>
                                <b-col md="9" class="ml-note">
                                    <b-input v-model="item.note" placeholder="Nhập ghi chú" class="border-only-bottom"></b-input>
                                </b-col>
                                <b-col md="9" v-if="!isShowInputNote">
                                    <span>{{item.note}}</span>
                                </b-col>
                                <b-col md="1">
                                    <i class="ion-icon ion-md-save cursor-pointer" style="margin-right: 5px;" @click="saveDepositNote"></i>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </div>
            <div class="deposit-history">
                <p>Lịch sử tiền cọc:</p>
                <table  class="table mb-0 table-bordered">
                    <thead class="thead-light">
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Kho</th>
                        <th>Ngày đóng</th>
                        <th>Số tiền cọc</th>
                        <th>Hình thức nộp tiền</th>
                        <th>Loại cọc</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody v-for="(deposit,index) in item.deposit_histories">
                    <tr v-if="deposit.type == 1 && deposit.status != 3">
                        <td>{{index + 1}}</td>
                        <td>{{item.fullname}}</td>
                        <td>{{item.station.toString()}}</td>
                        <td>{{deposit.date_time}}</td>
                        <td v-numeral v-text="deposit.deposited_money"></td>
                        <td v-if="deposit.payment_method == 1">Nộp tiền mặt<img v-bind:src="deposit.file" alt="" v-if="deposit.file"></td>
                        <td v-if="deposit.payment_method == 2">Nộp chuyển khoản</td>
                        <td v-if="deposit.payment_method == 6">Thanh toán qua QR code</td>
                      <td>
                            <b-form-select v-model="deposit.deposit_state" :options="optionStates" @change="updateDepositState(deposit)"></b-form-select>
<!--                            <span v-if="deposit.deposit_state == 'new'">Cọc hiện tại</span>-->
<!--                            <span v-if="deposit.deposit_state == 'old'">Cọc cũ</span>-->
                        </td>
                        <td v-if="parseInt(groupId) === 8">
                            <b-form-select v-model="deposit.status" :options="accountantStatus" @change="approvedDeposit(deposit)"></b-form-select>
                        </td>
                        <td v-else>
                            <span v-if="deposit.status === 'accountant_confirm'">KT đã xác nhận</span>
                            <span v-else-if="deposit.status === 'accountant_refuse'">KT đã từ chối</span>
                            <b-form-select v-else v-model="deposit.status" :options="coordinatorStatus" @change="approvedDeposit(deposit)"></b-form-select>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="refund-history">
                <p>Lịch sử trả cọc:</p>
                <table  class="table mb-0 table-bordered">
                    <thead class="thead-light">
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Kho</th>
                        <th>Ngày trả</th>
                        <th>Số tiền trả</th>
                        <th>Hình thức thanh toán</th>
                        <th>Loại cọc</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody v-for="(deposit,index) in item.deposit_histories">
                    <tr v-if="deposit.type == 2 && deposit.status != 3">
                        <td>{{index + 1}}</td>
                        <td>{{item.fullname}}</td>
                        <td>{{item.station.toString()}}</td>
                        <td>{{deposit.date_time}}</td>
                        <td v-numeral v-text="deposit.deposited_money"></td>
                        <td v-if="deposit.payment_method == 1">Trả tiền mặt<img v-bind:src="deposit.file" alt=""></td>
                        <td v-if="deposit.payment_method == 2">Trả chuyển khoản</td>
                        <td v-if="deposit.payment_method == 3">Cấn trừ bồi hoàn</td>
                        <td v-if="deposit.payment_method == 4">Phạt tài sản</td>
                        <td v-if="deposit.payment_method == 5">Trừ tạm ứng</td>
                        <td>
                            <b-form-select v-model="deposit.deposit_state" :options="optionStates" @change="updateDepositState(deposit)"></b-form-select>
<!--                            <span v-if="deposit.deposit_state == 'new'">Cọc hiện tại</span>-->
<!--                            <span v-if="deposit.deposit_state == 'old'">Cọc cũ</span>-->
                        </td>
                        <td v-if="parseInt(groupId) === 8">
                            <b-form-select v-model="deposit.status" :options="accountantStatus" @change="approvedDeposit(deposit)"></b-form-select>
                        </td>
                        <td v-else>
                            <span v-if="deposit.status === 'accountant_confirm'">Đã hoàn cọc</span>
                            <span v-else>KT chưa hoàn cọc</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </b-modal>
    </div>
</template>

<script>
import depositService from 'domain/services/deposit-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-detail-deposit',

  components: {
  },

  props: [
    'item',
    'groupId'
  ],

  data: () => ({
    isShowInputNote: false,
    accountantStatus: [
      { value: 'coordinator_confirm', text: 'Chọn trạng thái', disabled: true },
      { value: 'accountant_confirm', text: 'Xác nhận' },
      { value: 'accountant_refuse', text: 'Từ chối' },
      { value: 'deleted', text: 'Xóa' }
    ],
    coordinatorStatus: [
      { value: 'unapproved', text: 'Chưa duyệt' },
      { value: 'coordinator_confirm', text: 'Xác nhận thu tiền' },
      { value: 'coordinator_refuse', text: 'Từ chối' }
      // { value: 'accountant_confirm', text: 'KT đã xác nhận', disabled: true },
      // { value: 'accountant_refuse', text: 'KT đã từ chối', disabled: true },
      // { value: 'deleted', text: 'Đã Xóa', disabled: true }
    ],
    optionStates: [
      { value: 'old', text: 'Cọc cũ' },
      { value: 'new', text: 'Cọc hiện tại' }
    ]
  }),

  created () {
  },

  watch: {
    item: {
      handler () {
        this.$forceUpdate()
      },
      deep: true
    }
  },

  methods: {
    saveDepositNote () {
      let dataSend = {
        'id': this.item.deposit_id,
        'note': this.item.note
      }
      depositService.saveDepositNote(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.isShowInputNote = !this.isShowInputNote
            this.$emit('onUpdateSuccess')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    approvedDeposit (option) {
      let dataSend = {
        'id': option.id,
        'status': option.status
      }
      depositService.changeStatusDeposit(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.$emit('onUpdateSuccess')
            let deposit = this.item.deposit_histories.find(element => element.id === option.id)
            deposit.status = option.status
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    updateDepositState (deposit) {
      let dataSend = {
        deposit: deposit
      }
      depositService.updateDepositState(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
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
    table img {
        width: 25px;
        height: 25px;
    }
    table {
        text-align: center;
    }
    .deposit-note {
        display: flex;
        /*justify-content: center;*/
        align-items: center;
    }
    .ml-note {
        margin-left: -65px;
    }
    @media only screen and (max-width: 1400px) {
        .ml-note {
            margin-left: -30px;
        }
    }
</style>
