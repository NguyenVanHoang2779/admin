<template>
    <div>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Gói chiết khấu mới</label>
            <multiselect
                    v-model="listDeductionShops"
                    :options="ddType"
                    :multiple="multiple"
                    :placeholder="placeholder"
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
            <div v-for="(deduction, index) in listDeductionShops">
                <div class="form-filter">
                    <b-form-group>
                        <span class="font-weight-bold">{{ deduction.name }}</span>
                    </b-form-group>
                    <label class="font-weight-bold">Số tháng áp dụng</label>
                    <b-form-group>
                        <b-input v-bind:class="{ errorClass: errMonthExpire[index] }"
                                 @mouseup.native="errMonthExpire[index] = false"
                                 placeholder="Nhập số tháng áp dụng"
                                 type="text"
                                 v-model="deduction.monthExpire"
                                 :disabled="disableForever[index] || (!anyoneCanEditMonthEx.includes(parseInt(deduction.code)) && !canEditAll)"
                                 v-on:keyup="emitMonthExpire(index)">
                        </b-input>
                    </b-form-group>
                    <b-form-group class="col-sm-12" v-if="hasForever.includes(parseInt(deduction.code))">
                        <input
                                type="checkbox"
                                v-model="deduction.isForever"
                                name="is_forever"
                                @click="checkForever($event, index)"
                        >
                        Luôn được áp dụng
                    </b-form-group>
                    <label class="font-weight-bold" v-if="!notNumberPkg.includes(parseInt(deduction.code))">Sản lượng đơn yêu cầu</label>
                    <b-form-group v-if="!notNumberPkg.includes(parseInt(deduction.code))">
                        <b-input v-bind:class="{ errorClass: errNumberPkg[index] }"
                                 @mouseup.native="errNumberPkg[index] = false"
                                 placeholder="Nhập sản lượng đơn yêu cầu"
                                 type="text"
                                 v-model="deduction.numberPkg"
                                 :disabled="!canEditAll"
                                 v-on:keyup="emitNumberPkg(index)">
                        </b-input>
                    </b-form-group>
                    <label class="font-weight-bold" v-if="hasPercent.includes(parseInt(deduction.code))">Tỷ lệ % số đơn nội tỉnh được chiết khấu</label>
                    <b-form-group v-if="hasPercent.includes(parseInt(deduction.code))">
                        <b-input v-bind:class="{ errorClass: errPercentPkg[index] }"
                                 @mouseup.native="errPercentPkg[index] = false"
                                 placeholder="Nhập tỷ lệ % > 0 và <= 100"
                                 type="text"
                                 v-model="deduction.percentPkg"
                                 v-on:keyup="emitPercentPkg(index)">
                        </b-input>
                    </b-form-group>
                </div>
                <br/>
            </div>
        </b-form-group>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import deductionService from 'domain/services/deduction-service'
export default {
  name: 'select-dd-shop',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn gói chiết khấu'
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
    listDeductionShops: [],
    ddType: [],
    newSelectedDdType: [],
    errMonthExpire: [],
    errNumberPkg: [],
    errPercentPkg: [],
    disableForever: [],
    canEditAll: false,
    anyoneCanEditMonthEx: [1, 4, 6, 16, 18],
    hasForever: [1, 4, 6, 8, 10, 16],
    hasPercent: [22],
    notNumberPkg: [1, 4, 6, 8, 10, 16, 18, 215, 235, 292]
  }),
  methods: {
    onSelect: function (selectedOptions) {
      let data = []
      if (this.listDeductionShops.length > 0) {
        for (let i = 0; i < this.listDeductionShops.length; i++) {
          data.push(this.listDeductionShops[i])
        }
      }
      data.push(selectedOptions)
      this.$emit('selectedDdShop', data)
    },
    onRemove: function (removeOptions) {
      let data = []
      for (let i = 0; i < this.listDeductionShops.length; i++) {
        if (this.listDeductionShops[i] !== removeOptions) {
          data.push(this.listDeductionShops[i])
        } else {
          this.disableForever[i] = false
        }
      }
      this.$emit('selectedDdShop', data)
    },
    reset: function () {
      this.listDeductionShops = this.multiple ? [] : ''
      this.$emit('selectedDdShop', this.listDeductionShops)
    },
    fillOption: function (shopOrder) {
      let self = this
      deductionService.fillDataDdShop(shopOrder).then(result => {
        if (result.data.success) {
          self.canEditAll = result.data.options.canEditAll
          if (!result.data.emptyDd) {
            self.ddType = result.data.ddTypes
            self.listDeductionShops = result.data.dd_shop
            for (let i = 0; i < self.listDeductionShops.length; i++) {
              if (self.listDeductionShops[i].isForever) {
                self.disableForever[i] = true
                self.listDeductionShops[i].monthExpire = ''
              } else {
                self.disableForever[i] = false
              }
            }
            self.$emit('selectedDdShop', self.listDeductionShops)
          } else {
            self.ddType = result.data.ddTypes
            self.listDeductionShops = []
            self.disableForever = []
            self.$emit('selectedDdShop', self.listDeductionShops)
          }
        } else {
          alert('Có lỗi xảy ra')
        }
      })
    },
    submit: function (errMonthExpire, errNumberPkg, errPercentPkg) {
      this.errMonthExpire = errMonthExpire
      this.errNumberPkg = errNumberPkg
      this.errPercentPkg = errPercentPkg
    },
    emitMonthExpire (index) {
      this.errMonthExpire[index] = false
      this.$emit('selectedDdShop', this.listDeductionShops)
    },
    emitNumberPkg (index) {
      this.errNumberPkg[index] = false
      this.$emit('selectedDdShop', this.listDeductionShops)
    },
    emitPercentPkg (index) {
      this.errPercentPkg[index] = false
      this.$emit('selectedDdShop', this.listDeductionShops)
    },
    checkForever: function (e, index) {
      if (e.target.checked) {
        this.listDeductionShops[index].isForever = e.target.checked
        this.listDeductionShops[index].monthExpire = ''
        this.disableForever[index] = true
        this.$emit('selectedDdShop', this.listDeductionShops)
      } else {
        this.listDeductionShops[index].isForever = false
        this.disableForever[index] = false
        this.$emit('selectedDdShop', this.listDeductionShops)
      }
    }
  },
  watch: {
    listDeductionShops: function (newVal, oldVal) {
      for (let i = 0; i < newVal.length; i++) {
        if (newVal[i].isForever) {
          this.disableForever[i] = true
          newVal[i].monthExpire = ''
        } else {
          this.disableForever[i] = false
        }
      }
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
