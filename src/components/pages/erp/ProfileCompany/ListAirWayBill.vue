<template>
    <div>
        <div class="notification-user">
            <b-alert
                    :variant="notify_add_awb.type"
                    dismissible
                    fade
                    :show="notify_add_awb.showDismissibleAlert"
                    @dismissed="notify_add_awb.showDismissibleAlert = false"
            >
                {{notify_add_awb.message}}
            </b-alert>
        </div>
        <div class="row">
            <div class="col-md-12 contract-list">
                <table class="table card-table"  v-if="listAwbs && listAwbs.length > 0">
                    <thead class="thead-light">
                    <tr>
                        <th>Chặng bay</th>
                        <th>Ngày bay</th>
                        <th>Giờ bay</th>
                        <th>Số hiệu</th>
                        <th>Mã AWB</th>
                        <th>Khối lượng tối đa</th>
                        <th>Khối lượng thực tế</th>
                        <th>Số kiện</th>
                        <th>Loại hàng hóa</th>
                        <th>Đơn giá</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in listAwbs">
                        <td>
                            <b-form-input v-model="item.flight" type="text" placeholder="Chặng bay" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.date_take_off" type="text" placeholder="Ngày bay" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.time_take_off" type="text" placeholder="Giờ bay" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.flight_number" type="text" placeholder="Số hiệu" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.awb_code" type="text" placeholder="Mã AWB" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.weight_max" type="text" placeholder="Khối lượng tối đa (kg)" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.weight_actual" type="text" placeholder="Khối lượng thực tế (kg)" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-input v-model="item.package_amount" type="text" placeholder="Số kiện hàng" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <b-form-select v-model="item.type" :options="typeCommodity" class="mb-3" :disabled="item.isEdit">
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn loại hàng hóa --</option>
                                </template>
                            </b-form-select>
                        </td>
                        <td>
                            <b-form-input v-model="item.price" type="text" placeholder="Nhập đơn giá" :disabled="item.isEdit"></b-form-input>
                        </td>
                        <td>
                            <ladda-btn v-if="item.isEdit" @click.native="edit(index)" data-style="zoom-out" class="btn btn-outline-primary">
                                Chỉnh sửa
                            </ladda-btn>
                            <ladda-btn v-if="!item.isEdit" @click.native="updateAwb(item)" data-style="zoom-out" class="btn btn-outline-primary">
                                Cập nhật
                            </ladda-btn>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <span v-else>Không có bản ghi AWB nào</span>
            </div>
            <div class="mt-3 col-md-12">
                <b-row>
                    <b-col md="6">
                        <b-pagination
                                :total-rows="totalItems"
                                v-model="currentPage"
                                :per-page="perPage"
                                v-on:input="getAwbList()"
                        />
                    </b-col>
                    <b-col md="6">
                        <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                    </b-col>
                </b-row>
            </div>
        </div>
        <button class="btn btn-outline-success btn-sm"  @click="modalShow = !modalShow"><i class="ion ion-ios-add"></i> Thêm AWB</button>
        <b-modal ref="modal-add-profile" id="addAwb" size="lg" title="Thêm AWB" ok-only static v-model="modalShow">
            <b-row>
                <b-col  md="12" class="text-left sperator-right">
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Mã AWB: <span class='red-text'>(*)</span>
                            </template>
                            <b-form-input v-model="awb.awb_code"
                                          type="text"
                                          placeholder="Mã awb"
                                          id="input-awb-code"
                                          v-validate="{required: true, alpha_dash:true }"
                                          name="input-awb-code"
                                          :class="{'is-danger': errors.has('input-awb-code')}">
                            </b-form-input>
                            <span v-show="errors.firstRule('input-awb-code') == 'required'" class="help is-danger">Không để trống trường này </span>
                            <span v-show="errors.firstRule('input-awb-code') == 'alpha_dash'" class="help is-danger">Không nhập kí tự đặc biệt </span>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Chặng bay: <span class='red-text'>(*)</span>
                            </template>
                            <b-form-input v-model="awb.flight"
                                          type="text"
                                          placeholder="Chặng bay"
                                          id="input-flight"
                                          v-validate="{required: true}"
                                          name="input-flight"
                                          :class="{'is-danger': errors.has('input-flight')}">
                            </b-form-input>
                            <span v-show="errors.firstRule('input-flight') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Ngày bay:  <span class='red-text'>(*)</span>
                            </template>
                            <b-form-input v-model="awb.date_take_off"
                                          type="date"
                                          placeholder="Ngày bay"
                                          id="input-date_take_off"
                                          v-validate="{required: true}"
                                          name="input-date_take_off"
                                          :class="{'is-danger': errors.has('input-date_take_off')}">
                            </b-form-input>
                            <span v-show="errors.firstRule('input-date_take_off') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Giờ bay:
                            </template>
                            <b-form-input v-model="awb.time_take_off" type="time" placeholder="Giờ bay"></b-form-input>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Số hiệu:
                            </template>
                            <b-form-input v-model="awb.flight_number" type="text" placeholder="Số hiệu chuyến bay"></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Khối lượng tối đa:
                            </template>
                            <b-form-input
                                    v-model="awb.weight_max"
                                    type="text"
                                    placeholder="Khối lượng tối đa (kg)"
                                    id="input-weight-max"
                                    v-validate="{numeric: true }"
                                    name="input-weight-max"
                                    :class="{'is-danger': errors.has('input-weight-max')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('input-weight-max') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Khối lượng thực tế:
                            </template>
                            <b-form-input
                                    v-model="awb.weight_actual"
                                    type="text"
                                    placeholder="Khối lượng thực tế (kg)"
                                    id="input-weight-actual"
                                    v-validate="{numeric: true}"
                                    name="input-weight-actual"
                                    :class="{'is-danger': errors.has('input-weight-actual')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('input-weight-actual') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Số kiện hàng:
                            </template>
                            <b-form-input
                                    v-model="awb.package_amount"
                                    type="text"
                                    placeholder="Số kiện hàng"
                                    id="input-package-amount"
                                    v-validate="{numeric: true }"
                                    name="input-package-amount"
                                    :class="{'is-danger': errors.has('input-package-amount')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('input-package-amount') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Tổng dim:
                            </template>
                            <b-form-input
                                    v-model="awb.dim"
                                    type="text"
                                    placeholder="Tổng dim"
                                    id="input-dim"
                                    v-validate="{numeric: true }"
                                    name="input-dim"
                                    :class="{'is-danger': errors.has('input-dim')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('input-dim') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Kho đích
                            </template>
                            <single-select-station @handleSelectedStation="handleSelectedStation"></single-select-station>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Loại hàng hóa:
                            </template>
                            <b-form-select v-model="awb.type" :options="typeCommodity" class="mb-3">
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn loại hàng hóa --</option>
                                </template>
                            </b-form-select>
                        </b-form-group>
                    </b-form-row>
                </b-col>
            </b-row>
            <template slot="modal-footer">
                <b-button variant="primary" @click="addAwb()">
                    Thêm mới AWB
                </b-button>
            </template>
        </b-modal>
        <notifications group='add-awb'></notifications>
    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import VeeValidate from 'vee-validate'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import CompanyProfileService from 'domain/services/company-profile-service'
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(Notifications)
Vue.use(VeeValidate)
export default {
  name: 'ListAirWayBill',
  components: {
    Notification,
    flatPickr,
    SingleSelectStation,
    LaddaBtn
  },
  props: [
    'companyId'
  ],
  data: () => ({
    modalShow: false,
    listAwbs: [],
    tmp: [],
    awb: {
      company_id: '',
      flight: '',
      date_take_off: '',
      time_take_off: '',
      flight_number: '',
      awb_code: '',
      weight_max: '',
      weight_actual: '',
      package_amount: '',
      dim: '',
      station_id: '',
      type: null,
      price: ''
    },
    typeCommodity: [
      { value: 0, text: 'Loại hàng thường' }
    ],
    notify: {
      message: '',
      class: '',
      title: '',
      duration: ''
    },
    notify_add_awb: {
      showDismissibleAlert: false,
      message: '',
      type: ''
    },
    perPage: 10,
    currentPage: 1,
    totalItems: 0
  }),

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    data_appendix: {
      handler: function (newValue) {
        this.initDataAppendix()
      },
      deep: true
    },
    modalShow: function (newValue, oldValue) {
      if (newValue === false) {
        this.awb = {
          company_id: '',
          flight: '',
          date_take_off: '',
          time_take_off: '',
          flight_number: '',
          awb_code: '',
          weight_max: '',
          weight_actual: '',
          package_amount: '',
          dim: '',
          station_id: '',
          type: null,
          price: ''
        }
      }
    }
  },

  created () {
    this.getAwbList()
  },

  methods: {
    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-awb',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify,
        duration: this.notify.duration
      })
    },

    edit: function (index) {
      this.listAwbs[index].isEdit = !this.listAwbs[index].isEdit
    },

    getAwbList: function () {
      this.appLoading = true
      let params = {
        companyId: this.companyId,
        page: this.currentPage,
        limit: this.perPage
      }
      CompanyProfileService.getAwbList(params)
        .then(res => {
          if (res.data.success) {
            this.listAwbs = res.data.data
            this.totalItems = res.data.count
            this.listAwbs.forEach((item, index) => {
              this.$set(this.listAwbs[index], 'isEdit', true)
            })
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    updateAwb: function (data) {
      let dataSend = {
        'id': data.id,
        'flight': data.flight,
        'date_take_off': data.date_take_off,
        'time_take_off': data.time_take_off,
        'flight_number': data.flight_number,
        'awb_code': data.awb_code,
        'weight_max': data.weight_max,
        'weight_actual': data.weight_actual,
        'package_amount': data.package_amount,
        'dim': data.dim,
        'station_id': data.station_id,
        'type': data.type,
        'price': data.price
      }
      CompanyProfileService.updateAwb(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getAwbList()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.edit()
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    addAwb: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let dataSend = {
            'company_id': this.companyId,
            'flight': this.awb.flight,
            'date_take_off': this.awb.date_take_off,
            'time_take_off': this.awb.time_take_off,
            'flight_number': this.awb.flight_number,
            'awb_code': this.awb.awb_code,
            'weight_max': this.awb.weight_max,
            'weight_actual': this.awb.weight_actual,
            'package_amount': this.awb.package_amount,
            'dim': this.awb.dim,
            'station_id': this.awb.station_id,
            'type': this.awb.type,
            'price': this.awb.price
          }
          CompanyProfileService.addAwb(dataSend)
            .then(res => {
              if (res.data.success) {
                commonHelper.showMessage(res.data.message, 'success')
                this.getAwbList()
                // this.isEdit = true
                this.modalShow = false
              } else {
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
            .catch(e => {
              console.log(e)
            })
            .then(() => {
              this.appLoading = false
            })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    handleSelectedStation: function (option) {
      this.awb.station_id = option ? option.id : ''
    }
  }
}
</script>

<style>
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>
