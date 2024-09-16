<template>
    <div>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Gói cam kết hoàn</label>
            <multiselect
                    v-model="listValueRcType"
                    :options="rcType"
                    :multiple="multiple"
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
            />
        </b-form-group>
        <b-form-group class="col-sm-12">
            <div v-for="(rc, index) in listValueRcType">
                <div class="form-filter">
                    <b-form-group>
                        <span class="font-weight-bold">{{ rc.name }}</span>
                    </b-form-group>
                    <label class="font-weight-bold">Số lượng đơn hàng yêu cầu</label>
                    <b-form-group>
                        <b-input v-bind:class="{ errorClass: errNumberPkg[index] }"
                                 @mouseup.native="errNumberPkg[index] = false"
                                 placeholder="Nhập số lượng đơn hàng >= 500"
                                 type="text"
                                 v-model="rc.numberPkg"
                                 :disabled="disableNumberPkg[index]"
                                 v-on:keyup="emitNumberPkg(index)">
                        </b-input>
                    </b-form-group>
                    <label v-if="!hasMaxRate.includes(rc.code)" class="font-weight-bold">Tỉ lệ cam kết</label>
                    <label v-if="hasMaxRate.includes(rc.code)" class="font-weight-bold">Tỉ lệ GHTK free tối đa (%)</label>
                    <b-form-group>
                        <b-input v-bind:class="{ errorClass: errReValue[index] }"
                                 @mouseup.native="errReValue[index] = false"
                                 placeholder="Nhập tỉ lệ > 0 và <= 100"
                                 type="text"
                                 v-model="rc.reValue"
                                 :disabled="disableReValue[index]"
                                 v-on:keyup="emitReValue(index)">
                        </b-input>
                    </b-form-group>
                    <label class="font-weight-bold">Số tháng áp dụng</label>
                    <b-form-group>
                        <b-input v-bind:class="{ errorClass: errMonthExpire[index] }"
                                 @mouseup.native="errMonthExpire[index] = false"
                                 placeholder="Nhập số tháng áp dụng gói cam kết"
                                 type="text"
                                 v-model="rc.monthExpire"
                                 :disabled="disableMonthExpire[index]"
                                 v-on:keyup="emitMonthExpire(index)">
                        </b-input>
                    </b-form-group>
                </div>
            </div>
        </b-form-group>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import shopService from 'domain/services/shop-service'
export default {
  name: 'select-rc-shop',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn gói cam kết hoàn'
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    listValueRcType: [],
    rcType: [],
    newSelectedrcType: [],
    errRcType: [],
    errNumberPkg: [],
    errReValue: [],
    errMonthExpire: [],
    disableNumberPkg: [],
    disableReValue: [],
    disableMonthExpire: [],
    canEditAll: false,
    canEditPkg: false,
    hasMaxRate: [1, 8, 9, 10, 11, 13]
  }),
  methods: {
    // Khóa, mở chức năng sửa các giá trị cam kết
    disableOptions: function (rcType, index) {
      // Mặc định
      this.disableNumberPkg[index] = true // Khóa
      this.disableReValue[index] = false // Mở
      this.disableMonthExpire[index] = false // Mở

      // Các TH mở sửa sản lượng cam kết
      if (this.canEditAll || this.canEditPkg) {
        if (rcType !== 6) {
          this.disableNumberPkg[index] = false
        }
      }

      // Các TH khóa sửa tỷ lệ cam kết
      if ([6, 7].includes(rcType)) {
        this.disableReValue[index] = true
      } else if ([3, 4, 5, 10].includes(rcType) && !this.canEditAll) {
        this.disableReValue[index] = true
      }

      // Các TH khóa sửa số tháng áp dụng
      if ([3, 6, 8, 9, 10, 11].includes(rcType) && !this.canEditAll) {
        this.disableMonthExpire[index] = true
      }
    },
    onSelect: function (selectedOptions) {
      let data = []
      if (this.listValueRcType.length > 0) {
        for (let i = 0; i < this.listValueRcType.length; i++) {
          this.disableOptions(parseInt(this.listValueRcType[i].code), i)
          data.push(this.listValueRcType[i])
        }
      }
      this.$emit('selectedRcShop', data)
    },
    onRemove: function (removeOptions) {
      let data = []
      for (let i = 0; i < this.listValueRcType.length; i++) {
        if (this.listValueRcType[i] !== removeOptions) {
          this.disableOptions(parseInt(this.listValueRcType[i].code), i)
          data.push(this.listValueRcType[i])
        }
      }
      this.$emit('selectedRcShop', data)
    },
    reset: function () {
      this.newSelectedrcType = []
    },
    fillOption: function (shopOrder) {
      shopService.fillDataRcShop(shopOrder).then(result => {
        if (result.data.success) {
          this.canEditPkg = result.data.options.canEditPkg
          this.canEditAll = result.data.options.canEditAll
          this.rcType = result.data.rcTypes
          if (!result.data.emptyData) {
            this.listValueRcType = result.data.rc_shop
            for (let i = 0; i < this.listValueRcType.length; i++) {
              this.disableOptions(parseInt(this.listValueRcType[i].code), i)
              if (parseInt(this.listValueRcType[i].code) === 7) {
                this.listValueRcType[i].reValue = ''
              }
            }
            this.$emit('selectedRcShop', this.listValueRcType)
          } else {
            this.disableNumberPkg = []
            this.disableReValue = []
            this.disableMonthExpire = []
            this.newSelectedrcType = []
            this.listValueRcType = []
            this.$emit('selectedRcShop', this.listValueRcType)
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
    emitNumberPkg (index) {
      this.errNumberPkg[index] = false
      this.$emit('selectedRcShop', this.listValueRcType)
    },
    emitReValue (index) {
      this.errReValue[index] = false
      this.$emit('selectedRcShop', this.listValueRcType)
    },
    emitMonthExpire (index) {
      this.errMonthExpire[index] = false
      this.$emit('selectedRcShop', this.listValueRcType)
    }
  }
}
</script>

<style scoped>
    .errorClass {
        border: 1px solid red;
    }
    .form-filter {
        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        padding: 20px;
    }
</style>
