<template>
  <div :class="getClassPackageBorder(indexPackage)">
    <div class="col-md-12">
      <b-row>
        <b-col md="5">
          <b-form-group label-cols-sm="3" :label="'Chọn gói bảo dưỡng ' + (parseInt(indexPackage) + 1)">
            <span slot="label">{{ 'Chọn gói bảo dưỡng ' + (parseInt(indexPackage) + 1) }} <span class="text-danger">*</span></span>
            <b-form-select v-model="infoPackage.type" :options="options" @change="changeMaintenance">
              <template v-slot:first>
                <option :value="null" disabled>-- Chọn gói bảo dưỡng --</option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="1" offset="md-6">
          <b-button variant="danger" size="sm" @click="closeMaintenance(indexPackage)" class="delete-btn"><i class="fa fa-times"/></b-button>
        </b-col>
      </b-row>
    </div>
    <div v-if="maintenanceType === 'tire'">
      <div class="pr-3 col-md-12">
        <b-row>
          <b-col sm="12" md="5">
            <b-form-group label-cols-sm="3" label-cols-md="3">
              <span slot="label">Series vật tư mới <span class="text-danger">*</span></span>
              <b-form-input
                v-model="infoPackage.tire.new_series"
                id="newSeries"
                name="newSeries"
                v-validate="{required: true, max: 20}"
                :class="{'is-danger': errors.has('newSeries')}"
              >
              </b-form-input>
<!--              <b-form-invalid-feedback :state="validField(infoPackage.tire.new_series)">Không để trống trường này </b-form-invalid-feedback>-->
              <span v-show="errors.firstRule('newSeries') == 'required'" class="help is-danger">Không để trống trường này </span>
              <span v-show="errors.firstRule('newSeries') == 'max'" class="help is-danger">Nhập tối đa 20 ký tự </span>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="7">
            <b-row>
              <b-col sm="12" md="4">
                <b-form-group label-cols-sm="3" label-cols-md="4">
                  <span slot="label">Cỡ lốp <span class="text-danger">*</span></span>
                  <b-form-input
                    v-model="infoPackage.tire.tyre_front_size"
                    v-validate="{required: true, max: 20}"
                    id="frontSize"
                    name="frontSize"
                  >
                  </b-form-input>
                  <span v-show="errors.firstRule('frontSize') == 'required'" class="help is-danger">Không để trống trường này </span>
                  <span v-show="errors.firstRule('frontSize') == 'max'" class="help is-danger">Nhập tối đa 20 ký tự </span>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="4">
                <b-form-group label-cols-sm="3" label-cols-md="4">
                  <span slot="label">Hãng <span class="text-danger">*</span></span>
                  <b-form-select
                    v-model="infoTireSelect"
                    :options="tireOptions"
                    @change="onChangeTire"
                  >
                  </b-form-select>
                  <b-form-input v-show="!infoTireSelect"
                                v-model="infoPackage.tire.autotire"
                                id="autotire"
                                name="autotire"
                                v-validate="'required'"
                                placeholder="Nhập tên hãng"
                                :class="{'is-danger': errors.has('autotire')}"
                  >
                  </b-form-input>
                  <!--              <b-form-invalid-feedback :state="validField(infoPackage.tire.autotire)">Không để trống trường này </b-form-invalid-feedback>-->
                  <span v-show="errors.firstRule('autotire') == 'required'" class="help is-danger">Không để trống trường này </span>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
      <div class="pr-3 col-md-12">
        <b-row>
          <b-col sm="12" md="5">
            <b-form-group label-cols-sm="3" label-cols-md="3">
              <span slot="label">Series vật tư cũ <span class="text-danger">*</span></span>
              <b-form-input
                v-model="infoPackage.tire.old_series"
                v-validate="{required: true, max: 20}"
                id="oldSeries"
                name="oldSeries"
              >
              </b-form-input>
              <span v-show="errors.firstRule('oldSeries') == 'required'" class="help is-danger">Không để trống trường này </span>
              <span v-show="errors.firstRule('oldSeries') == 'max'" class="help is-danger">Nhập tối đa 20 ký tự </span>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>
    <div v-if="maintenanceType === 'battery'">
      <div class="pr-3 col-md-12">
        <b-row>
          <b-col sm="12" md="5">
            <b-form-group  label-cols-sm="3" label-cols-md="3">
              <span slot="label">Dung lượng <span class="text-danger">*</span></span>
              <b-form-input
                v-model="infoPackage.battery.capacity"
                id="capacity"
                name="capacity"
                v-validate="{required:true, regex: /^\d+(A-)\d+(V)$/}"
                :class="{'is-danger': errors.has('capacity')}"
              >
              </b-form-input>
<!--              <b-form-invalid-feedback :state="validField(infoPackage.battery.capacity)">Không để trống trường này </b-form-invalid-feedback>-->
              <span v-show="errors.firstRule('capacity') == 'required'" class="help is-danger">Không để trống trường này </span>
              <span v-show="errors.firstRule('capacity') == 'regex'" class="help is-danger">Vui lòng điền đúng định dạng (VD: 5A-12V) </span>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="7">
            <b-row>
              <b-col sm="12" md="4">
                <b-form-group label-cols-sm="3" label-cols-md="4">
                  <span slot="label">Series <span class="text-danger">*</span></span>
                  <b-form-input
                    v-model="infoPackage.battery.series"
                    id="batterySeries"
                    name="batterySeries"
                    v-validate="{required:true, max: 20}"
                    :class="{'is-danger': errors.has('batterySeries')}"
                  >
                  </b-form-input>
                  <!--              <b-form-invalid-feedback :state="validField(infoPackage.battery.series)">Không để trống trường này </b-form-invalid-feedback>-->
                  <span v-show="errors.firstRule('batterySeries') == 'required'" class="help is-danger">Không để trống trường này </span>
                  <span v-show="errors.firstRule('batterySeries') == 'max'" class="help is-danger">Nhập tối đa 20 ký tự </span>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="4">
                <b-form-group label-cols-sm="3" label-cols-md="4">
                  <span slot="label">Hãng <span class="text-danger">*</span></span>
                  <b-form-select
                    v-model="infoBatterySelect"
                    :options="batteryOptions"
                    @change="onChangeBattery"
                  >
                  </b-form-select>
                  <b-form-input v-show="!infoBatterySelect"
                                v-model="infoPackage.battery.autobattery"
                                id="autobattery"
                                name="autobattery"
                                placeholder="Nhập tên hãng"
                                v-validate="'required'"
                                :class="{'is-danger': errors.has('autobattery')}"
                  >
                  </b-form-input>
                  <!--              <b-form-invalid-feedback :state="validField(infoPackage.battery.autobattery)">Không để trống trường này </b-form-invalid-feedback>-->
                  <span v-show="errors.firstRule('autobattery') == 'required'" class="help is-danger">Không để trống trường này </span>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="4">
                <b-form-group  label-cols-sm="3" label-cols-md="4">
                  <span slot="label">Số lượng <span class="text-danger">*</span></span>
                  <b-form-input
                    v-model="infoPackage.battery.battery_amount"
                    id="amount"
                    name="amount"
                    v-validate="{required:true, numeric: true, between:[1,19]}"
                    :class="{'is-danger': errors.has('amount')}"
                  >
                  </b-form-input>
                  <!--              <b-form-invalid-feedback :state="validField(infoPackage.battery.capacity)">Không để trống trường này </b-form-invalid-feedback>-->
                  <span v-show="errors.firstRule('amount') == 'required'" class="help is-danger">Không để trống trường này </span>
                  <span v-show="errors.firstRule('amount') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                  <span v-show="errors.firstRule('amount') == 'between'" class="help is-danger">Vui lòng điền số lượng ắc quy nhỏ hơn 20 </span>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>
<script>
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(VeeValidate)

export default {
  name: 'package-maintenance',
  components: {

  },

  props: [
    'packageChoose', 'indexPackage', 'packages'
  ],

  mounted () {
    this.options = this.packageChoose
  },

  watch: {
    packageChoose (v) {
      this.options = v
    },
    infoPackage: {
      deep: true,
      handler (v) {
        this.$emit('onUpdatePackage', {id: this.indexPackage, data: v})
      }
    },
    packages (v) {
      if (v[this.indexPackage].type) {
        this.infoPackage.type = v[this.indexPackage].type
        this.changeMaintenance()
      } else this.infoPackage.type = null
    }
  },

  data: () => ({
    infoBatterySelect: null,
    options: [],
    infoTireSelect: null,
    infoPackage: {
      type: null,
      tire: {
        new_series: '',
        old_series: '',
        tyre_front_size: '',
        tyre_end_size: '',
        autotire: ''
      },
      battery: {
        capacity: '',
        series: '',
        autobattery: '',
        battery_amount: ''
      }
    },
    tireOptions: [
      {value: 'Casumina', text: 'Casumina'},
      {value: 'Yokohama', text: 'Yokohama'},
      {value: 'Bridgestone', text: 'Bridgestone'},
      {value: 'Maxxis', text: 'Maxxis'},
      {value: 'Hankook', text: 'Hankook'},
      {value: 'DRC', text: 'DRC'},
      {value: null, text: 'Khác'}
    ],
    batteryOptions: [
      {value: 'GS', text: 'GS'},
      {value: 'Đồng Nai', text: 'Đồng Nai'},
      {value: 'Enimac', text: 'Enimac'},
      {value: 'Panasonic', text: 'Panasonic'},
      {value: null, text: 'Khác'}
    ],
    maintenanceType: ''
  }),

  created () {
    if (this.packages.length > 0) {
      this.fillData()
    }
  },

  methods: {
    addOptionTire () {
      let existed = this.tireOptions.find(e => e.value === this.infoPackage.tire.autotire)
      if (!existed && this.infoPackage.tire.autotire) this.tireOptions.unshift({text: this.infoPackage.tire.autotire, value: this.infoPackage.tire.autotire})
      this.infoTireSelect = this.infoPackage.tire.autotire || null
    },
    addOptionBattery () {
      let existed = this.batteryOptions.find(e => e.value === this.infoPackage.battery.autobattery)
      if (!existed && this.infoPackage.battery.autobattery) this.batteryOptions.unshift({text: this.infoPackage.battery.autobattery, value: this.infoPackage.battery.autobattery})
      this.infoBatterySelect = this.infoPackage.battery.autobattery || null
    },
    onChangeTire (val) {
      this.infoPackage.tire.autotire = val
    },
    onChangeBattery (val) {
      this.infoPackage.battery.autobattery = val
    },
    changeMaintenance () {
      if (this.infoPackage.type === 7) {
        this.maintenanceType = 'tire'
      } else if (this.infoPackage.type === 8) {
        this.maintenanceType = 'battery'
      } else {
        this.maintenanceType = ''
      }
    },
    closeMaintenance (indexPackage) {
      this.$emit('removePackage', indexPackage)
    },
    fillData () {
      if (this.packages[this.indexPackage].tire) {
        this.infoPackage = this.packages[this.indexPackage]
        this.infoPackage.price_package = this.convertMoney(this.infoPackage.price_package)
        this.changeMaintenance()
        this.addOptionTire()
        this.addOptionBattery()
      }
    },
    getClassPackageBorder (index) {
      return (index > 0) ? 'package-border' : ''
    },
    convertMoney (money) {
      let result = (money + '').replace(/\D/g, '')
      return commonHelper.formatMoney(+result)
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
.package-border {
  border-top: 1px solid #e2e2e2;
  padding-top: 25px;
}
</style>
