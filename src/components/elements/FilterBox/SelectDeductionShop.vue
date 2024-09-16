<template>
    <div>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Gói chiết khấu mới</label>
            <multiselect
                    v-model="valueDdType"
                    :options="ddType"
                    :multiple="false"
                    :placeholder="placeholder"
                    track-by="name"
                    label="name"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel="x"
                    @select="onSelect"
                    @remove="onRemove"
                    :taggable="true"
                    v-bind:class="{ errorClass: errDdType }"
                    @open="errDdType = false"
            />
        </b-form-group>
        <b-form-group class="col-sm-12">
            <label class="font-weight-bold">Số tháng áp dụng</label>
            <b-input v-bind:class="{ errorClass: errMonthExpire }" @keyup.native="errMonthExpire = false" placeholder="Nhập số tháng áp dụng gói chiết khấu"
                     type="text" v-model="monthExpire" :disabled="disableMonthExpire || disableForever" v-on:keyup="emitMonthExpire"/>
        </b-form-group>
        <b-form-group class="col-sm-12">
            <input
                    type="checkbox"
                    v-model="isForever"
                    name="is_forever"
                    @click="checkForever($event)"
            >
            Luôn được áp dụng khi gán gói
        </b-form-group>
    </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import deductionService from 'domain/services/deduction-service'
export default {
  name: 'select-dd-shop',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn gói chiết khấu'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    valueDdType: '',
    monthExpire: '',
    isForever: false,
    ddType: [],
    newSelectedDdType: '',
    errDdType: false,
    errMonthExpire: false,
    disableMonthExpire: true,
    disableForever: true
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'new-deduction/getDeductionType').then(response => {
        if (response.data.success) {
          this.ddType = response.data.data.options.ddTypes
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      this.newSelectedDdType = selectedOptions.code
      this.$emit('selectedDdShop', this.newSelectedDdType)
      this.disableMonthExpire = false
      this.disableForever = false
      this.monthExpire = 1
      this.$emit('selectedMonthExpire', this.monthExpire)
      this.isForever = false
      this.$emit('checked4ever', this.isForever)
    },
    onRemove: function () {
      this.newSelectedDdType = ''
      this.monthExpire = ''
      this.isForever = false
      this.disableMonthExpire = true
      this.disableForever = true
      this.$emit('selectedDdShop', '')
      this.$emit('selectedMonthExpire', '')
      this.$emit('checked4ever', false)
    },
    reset: function () {
      this.newSelectedDdType = ''
    },
    fillOption: function (shopOrder) {
      let self = this
      deductionService.fillDataDdShop(shopOrder).then(result => {
        if (result.data.success) {
          if (result.data.dd_shop.ddTypes.code) {
            self.ddType = result.data.ddTypes
            self.monthExpire = result.data.dd_shop.monthExpire
            self.isForever = result.data.dd_shop.isForever
            self.valueDdType = result.data.dd_shop.ddTypes
            self.newSelectedDdType = result.data.dd_shop.ddTypes.code
            self.$emit('selectedDdShop', self.newSelectedDdType)
            self.$emit('selectedMonthExpire', self.monthExpire)
            self.$emit('checked4ever', self.isForever)
            if (result.data.dd_shop.isForever) {
              self.monthExpire = ''
              self.$emit('selectedMonthExpire', self.monthExpire)
              self.disableMonthExpire = false
              self.disableForever = true
            } else {
              self.disableMonthExpire = false
              self.disableForever = false
            }
          } else {
            self.disableMonthExpire = true
            self.disableForever = true
            self.ddType = result.data.ddTypes
            self.valueDdType = ''
            self.monthExpire = ''
            self.isForever = false
            self.newSelectedDdType = ''
            self.$emit('selectedDdShop', self.newSelectedDdType)
            self.$emit('selectedMonthExpire', self.monthExpire)
            self.$emit('checked4ever', self.isForever)
          }
        } else {
          alert('Có lỗi xảy ra')
        }
      })
    },
    submit: function (errDdType, errMonthExpire) {
      this.errDdType = errDdType
      this.errMonthExpire = errMonthExpire
    },
    emitMonthExpire (event) {
      this.$emit('selectedMonthExpire', this.monthExpire)
    },
    checkForever: function (e) {
      if (e.target.checked) {
        this.isForever = e.target.checked
        this.disableForever = true
        this.$emit('checked4ever', this.isForever)
        this.monthExpire = ''
        this.$emit('selectedMonthExpire', self.monthExpire)
      } else {
        this.isForever = false
        this.disableForever = false
        this.$emit('checked4ever', this.isForever)
      }
    }
  }
}
</script>

<style scoped>
    .errorClass {
        border: 1px solid red;
    }
</style>
