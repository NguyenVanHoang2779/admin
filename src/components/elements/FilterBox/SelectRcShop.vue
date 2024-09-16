<template>
    <div>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Gói cam kết hoàn</label>
            <multiselect
                    v-model="valueRcType"
                    :options="rcType"
                    :multiple="false"
                    :placeholder="placeholder"
                    :close-on-select="true"
                    track-by="name"
                    label="name"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel="x"
                    @select="onSelect"
                    @remove="onRemove"
                    :taggable="true"
                    v-bind:class="{ errorClass: errRcType }"
                    @open="errRcType = false"
            />
        </b-form-group>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Số lượng đơn hàng yêu cầu</label>
            <b-input v-bind:class="{ errorClass: errNumberPkg }" @keyup.native="errNumberPkg = false" placeholder="Nhập số lượng đơn hàng >= 500"
                     type="text" v-model="numberPkg" :disabled="disableNumberPkg" v-on:keyup="emitNumberPkg"/>
        </b-form-group>
        <b-form-group class="col-sm-12">
            <label v-if="!hasMaxRate.includes(newSelectedrcType)" class="font-weight-bold">Tỉ lệ cam kết</label>
            <label v-if="hasMaxRate.includes(newSelectedrcType)" class="font-weight-bold">Tỉ lệ GHTK free tối đa (%)</label>
            <b-input v-bind:class="{ errorClass: errReValue }" @keyup.native="errReValue = false" placeholder="Nhập tỉ lệ > 0 và <= 100"
                     type="text" v-model="reValue" :disabled="disableReValue" v-on:keyup="emitReValue"/>
        </b-form-group>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Số tháng áp dụng</label>
            <b-input v-bind:class="{ errorClass: errMonthExpire }" @keyup.native="errMonthExpire = false" placeholder="Nhập số tháng áp dụng gói cam kết"
                     type="text" v-model="monthExpire" :disabled="disableMonthExpire" v-on:keyup="emitMonthExpire"/>
        </b-form-group>
    </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import shopService from 'domain/services/shop-service'
export default {
  name: 'select-rc-shop',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn gói cam kết hoàn'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    valueRcType: '',
    numberPkg: '',
    reValue: '',
    monthExpire: '',
    rcType: [],
    newSelectedrcType: '',
    errRcType: false,
    errNumberPkg: false,
    errReValue: false,
    errMonthExpire: false,
    disableNumberPkg: true,
    disableReValue: true,
    disableMonthExpire: true,
    canEditAll: false,
    canEditPkg: false,
    hasMaxRate: [1, 8, 9, 10, 11]
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'shops/getReturnCouponType').then(response => {
        if (response.data.success) {
          this.rcType = response.data.data.options.rcTypes
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    // Tỷ lệ cam kết mặc định của các gói
    defaultReValue: function (rcType) {
      if (rcType === 3) {
        this.reValue = 1
      } else if ([4, 6].includes(rcType)) {
        this.reValue = 5
      } else if (rcType === 5) {
        this.reValue = 8
      } else if ([1, 8, 9, 11].includes(rcType)) {
        this.reValue = 15
      } else if (rcType === 10) {
        this.reValue = 100
      } else {
        this.reValue = ''
      }
    },
    // Khóa, mở chức năng sửa các giá trị cam kết
    disableOptions: function (rcType) {
      // Mặc định
      this.disableNumberPkg = true // Khóa
      this.disableReValue = false // Mở
      this.disableMonthExpire = false // Mở

      // Các TH mở sửa sản lượng cam kết
      if (this.canEditAll || this.canEditPkg) {
        if (rcType !== 6) {
          this.disableNumberPkg = false
        }
      }

      // Các TH khóa sửa tỷ lệ cam kết
      if ([6, 7].includes(rcType)) {
        this.disableReValue = true
      } else if ([3, 4, 5, 10].includes(rcType) && !this.canEditAll) {
        this.disableReValue = true
      }

      // Các TH khóa sửa số tháng áp dụng
      if ([3, 6, 8, 9, 10, 11].includes(rcType) && !this.canEditAll) {
        this.disableMonthExpire = true
      }
    },
    onSelect: function (selectedOptions) {
      this.newSelectedrcType = selectedOptions.code
      this.$emit('selectedRcShop', this.newSelectedrcType)
      this.disableNumberPkg = true
      if (this.newSelectedrcType === 6) {
        this.numberPkg = 0
      } else if (this.newSelectedrcType === 10) {
        this.numberPkg = 100
      } else {
        this.numberPkg = 500
      }
      this.$emit('selectedNumberPkg', this.numberPkg)
      this.disableMonthExpire = false
      this.monthExpire = 1
      this.$emit('selectedMonthExpire', this.monthExpire)
      this.defaultReValue(this.newSelectedrcType)
      this.$emit('selectedReValue', this.reValue)
      this.disableOptions(this.newSelectedrcType)
    },
    onRemove: function () {
      this.newSelectedrcType = ''
      this.numberPkg = ''
      this.reValue = ''
      this.monthExpire = ''
      this.disableReValue = true
      this.disableNumberPkg = true
      this.disableMonthExpire = true
      this.$emit('selectedRcShop', '')
      this.$emit('selectedNumberPkg', '')
      this.$emit('selectedReValue', '')
      this.$emit('selectedMonthExpire', '')
    },
    reset: function () {
      this.newSelectedrcType = ''
    },
    fillOption: function (shopOrder) {
      let self = this
      shopService.fillDataRcShop(shopOrder).then(result => {
        if (result.data.success) {
          self.canEditPkg = result.data.options.canEditPkg
          self.canEditAll = result.data.options.canEditAll
          if (result.data.rc_shop.rcTypes.code) {
            self.rcType = result.data.rcTypes
            self.numberPkg = result.data.rc_shop.numberPkg
            self.reValue = result.data.rc_shop.reValue
            self.monthExpire = result.data.rc_shop.monthExpire
            self.valueRcType = result.data.rc_shop.rcTypes
            self.newSelectedrcType = parseInt(result.data.rc_shop.rcTypes.code)
            self.$emit('selectedRcShop', self.newSelectedrcType)
            self.$emit('selectedNumberPkg', self.numberPkg)
            self.$emit('selectedReValue', self.reValue)
            self.$emit('selectedMonthExpire', self.monthExpire)
            self.disableOptions(parseInt(self.newSelectedrcType))
            if (parseInt(self.newSelectedrcType) === 7) {
              self.reValue = ''
              self.$emit('selectedReValue', '')
            }
          } else {
            self.disableNumberPkg = true
            self.disableReValue = true
            self.disableMonthExpire = true
            self.rcType = result.data.rcTypes
            self.valueRcType = ''
            self.numberPkg = ''
            self.reValue = ''
            self.monthExpire = ''
            self.newSelectedrcType = ''
            self.$emit('selectedRcShop', self.newSelectedrcType)
            self.$emit('selectedNumberPkg', self.numberPkg)
            self.$emit('selectedReValue', self.reValue)
            self.$emit('selectedMonthExpire', self.monthExpire)
          }
        } else {
          alert('Có lỗi xảy ra')
        }
      })
    },
    submit: function (errRcType, errNumberPkg, errReValue, errMonthExpire) {
      this.errRcType = errRcType
      this.errNumberPkg = errNumberPkg
      this.errReValue = errReValue
      this.errMonthExpire = errMonthExpire
    },
    emitNumberPkg (event) {
      this.$emit('selectedNumberPkg', this.numberPkg)
    },
    emitReValue (event) {
      this.$emit('selectedReValue', this.reValue)
    },
    emitMonthExpire (event) {
      this.$emit('selectedMonthExpire', this.monthExpire)
    }
  }
}
</script>

<style scoped>
    .errorClass {
        border: 1px solid red;
    }
</style>
