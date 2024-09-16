<template>
  <b-modal id="create-config-salary" modal-class="modal-md" hide-footer @close="resetForm()">
    <template v-slot:modal-title>
      <h3 class="text-muted"><i class="fa fa-cog"></i> Bỏ Phạt - Coupon</h3>
    </template>
    <b-row class="mb-3">
      <b-col>
        <multiselect
          class="multiselect-info"
          :options="formulaOptions"
          v-model="formulaOption"
          placeholder="Chọn công thức lương"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <datepicker v-model="from" placeholder="Từ Ngày" :bootstrapStyling="true" :format="customFormatter"/>
      </b-col>
      <b-col>
        <datepicker v-model="to"  placeholder="Đến Ngày" :bootstrapStyling="true" :format="customFormatter" />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <multiselect
          class="multiselect-info"
          :options="regionOptions"
          v-model="regionOption"
          selectLabel="Chọn"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          placeholder="Chọn Miền"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
      <b-col>
        <multiselect
          class="multiselect-info"
          :options="provinceOptions"
          v-model="provinceOption"
          placeholder="Chọn Tỉnh"
          selectLabel="Chọn"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          :multiple="true"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <multiselect
          class="multiselect-info"
          :options="stationOptions"
          :multiple="true"
          v-model="stationOption"
          selectLabel="Chọn"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          placeholder="Chọn Kho"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
    </b-row>
    <div v-if="custom1000">
      <b-row class="mb-3">
        <b-col>
          <multiselect
            class="multiselect-info"
            :options="optionFine"
            :multiple="true"
            v-model="excludeOption1000"
            placeholder="Loại bỏ phạt"
            selectLabel="Chọn"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            label="name"
            track-by="id"
            :preserve-search="true"
            :hide-selected="true"
          />
        </b-col>
        <b-col v-if="excludeOption1000">
          <b-form-group>
            <select
              v-model="optionFine.work_shift"
              class="mb-3 custom-select-work-shift"
              v-if="checkFineWorkShift(optionFine.id)"
              v-for="(optionFine, index) in excludeOption1000"
              :key="index"
            >
              <option disabled value=""> Chọn ca cho {{optionFine.name}} (nếu cần)</option>
              <option v-for="i in 5" :value="i">
                ca {{ i }}
              </option>
            </select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col>
          <multiselect
            class="multiselect-info"
            :options="workTypeOptions"
            :multiple="true"
            v-model="workTypeOption"
            placeholder="Áp dụng loại hình công việc"
            label="name"
            track-by="id"
            :preserve-search="true"
            :hide-selected="true"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-input :disabled="listCodApply != ''" v-model="listCodNotApply" placeholder="Những mã cod này không được hưởng (vd: T1, T2, T3, T4)"></b-input>
        </b-col>
        <b-col>
          <b-input :disabled="listCodNotApply != ''" v-model="listCodApply" placeholder="Chỉ những mã cod này được hưởng (vd: T1, T2, T3, T4)"></b-input>
        </b-col>
      </b-row>
    </div>
    <b-row>
      <b-col>
        <b-button class="mt-3" variant="outline-dark" block @click="resetForm()">Reset Nhập <i class="fa fa-undo"></i></b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-success" v-if="idGroup === null" block @click="createConfig()">Tạo Mới <i class="fa fa-plus"></i></b-button>
        <b-button class="mt-3" variant="outline-info" v-if="idGroup !== null" block @click="createConfig()">Cập Nhật <i class="fa fa-edit"></i></b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-warning" block @click="cancel()">Hủy Bỏ <i class="fa fa-times"></i></b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<style scoped>
 .custom-select-work-shift {
   width: 100%;
 }
</style>

<script>
import addressService from 'domain/services/address-service'
import StationService from 'domain/services/station-service'
import salaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'create-config',

  components: {
    'multiselect': Multiselect,
    VueMonthlyPicker,
    Moment,
    Datepicker
  },

  props: {
    regionOptions: {},
    optionFine: {},
    editConfig: {},
    isCreatedConfig: {},
    workTypeOptions: {}
  },

  data: () => ({
    regionOption: [],
    provinceOptions: [],
    stationOptions: [],
    provinceOption: [],
    stationOption: [],
    formulaOptions: [],
    formulaOption: [],
    workTypeOption: [
      {id: 'fulltime', name: 'Full Time'},
      {id: 'partime', name: 'Part Time'}
    ],
    from: null,
    to: null,
    isReady: false,
    idGroup: null,
    // custom theo tung loai cod
    custom1000: false,
    excludeOption1000: [],
    listCodApply: '',
    listCodNotApply: ''
  }),

  watch: {
    regionOption: function (newValue, oldValue) {
      this.getAllProvince(newValue.id)
    },
    provinceOption: function (newValue, oldValue) {
      this.getAllStation()
    },
    stationOption: function (newValue, oldValue) {
    },
    excludeOption1000: function (newValue, oldValue) {
    },
    formulaOption: function (newValue, oldValue) {
      this.resetCustomSalary()
      this.checkOption(newValue)
    },
    editConfig: function (newValue, oldValue) {
      this.editConfigFine()
    },
    isCreatedConfig: function (newValue, oldValue) {
      if (newValue) this.resetForm()
    }
  },

  created () {
    this.getAllProvince(1)
    this.getAllFormula()
  },

  methods: {
    checkFineWorkShift (idOptionFine) {
      let sessionFine = ['session_1_1', 'session_0_1', 'session_0_2', 'session_2_2']
      if (sessionFine.includes(idOptionFine)) return false
      return true
    },
    resetForm () {
      this.regionOption = []
      this.provinceOptions = []
      this.stationOptions = []
      this.provinceOption = []
      this.stationOption = []
      this.formulaOption = []
      this.from = null
      this.to = null
      this.custom1000 = false
      this.excludeOption1000 = []
      this.listCodApply = ''
      this.listCodNotApply = ''
      this.isReady = false
      this.idGroup = null
      this.$emit('resetForm')
    },
    cancel () {
      this.resetForm()
      this.$bvModal.hide('create-config-salary')
    },
    resetCustomSalary () {
      if (this.editConfig !== null && !this.isReady) return 1
      this.custom1000 = false
    },
    checkOption (formula) {
      if (formula.id === 1000) this.custom1000 = true
    },
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    getAllProvince: function (regionId) {
      if (this.editConfig !== null && !this.isReady) return 1
      this.provinceOption = []
      this.provinceOptions = []
      let data = {}
      if (regionId !== 1) data = {'region': regionId}
      addressService.getProvincesByRegion(data).then(res => {
        if (res.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách tỉnh!')
        for (let provinceId in res.data) {
          this.provinceOptions.push({id: provinceId, name: res.data[provinceId]})
        }
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh'))
    },

    getAllStation: function (stationOption = null) {
      if (this.editConfig !== null && !this.isReady) return 1
      this.stationOption = []
      this.stationOptions = []
      let data = {}
      if (this.provinceOption.length > 0) {
        data.province_ids = this.provinceOption.map(province => province.id)
      }
      StationService.getListStationByProvinceIds(data).then(res => {
        if (res.data.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
        this.stationOptions = res.data.data
        if (stationOption !== null) {
          if (typeof stationOption !== 'undefined') this.stationOption = Object.values(stationOption)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách kho'))
    },

    getAllFormula () {
      salaryService.getAllFormulaCod().then(res => {
        res.data.forEach(formula => {
          this.formulaOptions.push({id: formula.code, name: formula.name})
        })
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách công thức lương'))
    },

    createConfig () {
      if (this.formulaOption.length === 0) return commonHelper.showMessage('Vui lòng chọn công thức lương được áp dụng')
      if (this.regionOption.length === 0) return commonHelper.showMessage('Vui lòng chọn miền')
      if (this.workTypeOption.length === 0) return commonHelper.showMessage('Vui lòng chọn loại hình công việc được áp dụng')
      if (this.stationOption.length > 0 && this.provinceOption.length === 0) return commonHelper.showMessage('Vui lòng chọn tỉnh')
      if (this.from === null || this.to === null) return commonHelper.showMessage('Khoảng thời gian áp dụng không hợp lệ')
      let dataSend = {
        formula: this.formulaOption,
        region: this.regionOption,
        province: this.provinceOption,
        station: this.stationOption,
        from: Moment(this.from).format('YYYY-MM-DD'),
        to: Moment(this.to).format('YYYY-MM-DD'),
        fine: this.excludeOption1000,
        work_type: this.workTypeOption,
        alias_apply: this.listCodApply,
        alias_not_apply: this.listCodNotApply
      }
      if (this.idGroup !== null) dataSend.group_id = this.idGroup
      salaryService.createConfigFine(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.resetForm()
          this.$bvModal.hide('create-config-salary')
        } else {
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi tạo config bỏ phạt'))
    },

    editConfigFine () {
      if (this.editConfig === null) return 1
      this.regionOption = this.editConfig.region
      if (typeof this.editConfig.alias_not_apply !== 'undefined') this.listCodNotApply = Object.values(this.editConfig.alias_not_apply).map(e => e.name).toString()
      if (typeof this.editConfig.alias_apply !== 'undefined') this.listCodApply = Object.values(this.editConfig.alias_apply).map(e => e.name).toString()
      if (typeof this.editConfig.province !== 'undefined') this.provinceOption = this.editConfig.province
      if (this.editConfig.formula === '1000') {
        this.excludeOption1000 = this.editConfig.fine
        this.formulaOptions.forEach(formula => {
          if (formula.id === 1000) {
            this.custom1000 = true
            this.formulaOption.push(formula)
          }
        })
      }
      this.idGroup = this.editConfig.group_id
      this.from = this.editConfig.from_date
      this.to = this.editConfig.to_date
      setTimeout(() => {
        this.isReady = true
        this.getAllStation(this.editConfig.station)
      }, 500)
    }
  }
}
</script>
