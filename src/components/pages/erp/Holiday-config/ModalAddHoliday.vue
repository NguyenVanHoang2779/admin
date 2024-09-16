<template>
  <b-modal
    :title=title
    id="id_modalAdd" >
    <b-form v-loading="loading">
      <b-row class="mb-3">
        <b-col>
          <b-form-group
            label="Chọn ngày lễ"
          >
            <datepicker
              :disabled="false"
              v-model="dateHoliday"
              format="yyyy-MM-dd"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :clear-button="true"
              placeholder="Chọn ngày lễ"
            />
          </b-form-group>
        </b-col>
        <b-col>
        <b-form-group label="Tên ngày lễ">
          <b-form-input
            :disabled="false"
            v-model="dateName"
            placeholder="Nhập tên ngày lễ"
            required
          ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <div class="lb_holiday">Nhân viên không tính KPI</div>
      <div class="css_holiday_custom">
        <b-row class="mb-3">
          <b-col>
            <b-form-group
              label="OT"
            >
              <b-form-input
                :disabled="false"
                v-model="overtime_1"
                placeholder="Nhập..."
                type="number"
                min="0"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="KPI">
              <b-form-input
                :disabled="false"
                v-model="kpi_1"
                placeholder="Nhập..."
                type="number"
                min="0"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <div class="lb_holiday lb_holiday_2">Nhân viên tính KPI</div>
      <div class="css_holiday_custom">
        <b-row class="mb-3">
          <b-col>
            <b-form-group
              label="OT"
            >
              <b-form-input
                :disabled="false"
                v-model="overtime_2"
                placeholder="Nhập..."
                type="number"
                min="0"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="KPI">
              <b-form-input
                :disabled="false"
                v-model="kpi_2"
                placeholder="Nhập..."
                type="number"
                min="0"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <b-row class="mb-3">
        <b-col>
          <b-form-group
            label="Lương overtime HĐDV"
          >
            <b-form-input
              :disabled="false"
              v-model="service_ot"
              placeholder="VNĐ..."
              required
              v-on:input="convertVND"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <div class="style_VND">VNĐ</div>
      </b-row>
    </b-form>
    <template slot="modal-footer">
      <button v-if="idEdit === null" type="button" class="btn btn-success" @click="create()" style="margin-right: 41%">Thêm mới</button>
      <button v-if="idEdit !== null && this.title === 'Chỉnh sửa ngày lễ' " type="button" class="btn btn-success" @click="create()" style="margin-right: 41%; background-color: coral">Cập nhật</button>
    </template>
  </b-modal>
</template>

<script>
import holidayConfigService from 'domain/services/holiday-config-service'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalAddHoliday',
  components: {Datepicker, Moment},
  props: {
    holidayModal: {},
    isDelete: false,
    isAdd: true
  },
  data () {
    return {
      loading: false,
      modified_by: null,
      dateHoliday: '',
      dateName: '',
      overtime_1: '',
      kpi_1: '',
      overtime_2: '',
      kpi_2: '',
      service_ot: '',
      title: 'Thêm ngày lễ',
      idEdit: null
    }
  },
  watch: {
    holidayModal: function (newValue, oldValue) {
      if (newValue) {
        this.holidayModalConvert()
      } else {
        this.reset()
      }
    }
  },
  methods: {
    async create () {
      let formData = new FormData()
      let data
      let type
      if (this.dateHoliday === null || this.dateName === null || this.overtime_1 === null || this.kpi_1 === null || this.overtime_2 === null || this.kpi_2 === null || this.service_ot === null) {
        return commonHelper.showMessage('Nhập đầy đủ thông tin', 'warning')
      } else {
        if (this.overtime_1 < 0 || this.overtime_2 < 0 || this.kpi_1 < 0 || this.kpi_2 < 0) {
          return commonHelper.showMessage('OT và KPI phải lớn hơn bằng 0', 'warning')
        }
        let serviceOt = this.service_ot
        if (serviceOt.indexOf('.') !== 0) {
          serviceOt = serviceOt.replaceAll('.', '')
        }
        if (isNaN(Number(serviceOt))) {
          return commonHelper.showMessage('Cần nhập vào số', 'warning')
        }
        formData.append('date', Moment(this.dateHoliday).format('YYYY-MM-DD'))
        formData.append('name', this.dateName)
        formData.append('ot_1', this.overtime_1)
        formData.append('ot_2', this.overtime_2)
        formData.append('kpi_1', this.kpi_1)
        formData.append('kpi_2', this.kpi_2)
        formData.append('service_ot', serviceOt)
        if (this.idEdit !== null && this.title === 'Chỉnh sửa ngày lễ') {
          formData.append('id', this.idEdit)
          type = 'update'
          data = await holidayConfigService.updateHoliday(formData)
        } else {
          data = await holidayConfigService.createHoliday(formData)
        }
      }
      if (data.data.success) {
        await this.onClose()
        commonHelper.showMessage(data.data.message, 'success')
        this.$emit('loading', type)
      } else {
        commonHelper.showMessage(data.data.message, 'warning')
      }
    },
    async onClose () {
      await this.reset()
      this.$emit('close', false)
    },
    reset (close = true) {
      if (close) this.open = false
      this.modified_by = ''
      this.dateHoliday = ''
      this.dateName = ''
      this.overtime_1 = ''
      this.overtime_2 = ''
      this.kpi_1 = ''
      this.kpi_2 = ''
      this.service_ot = ''
      this.title = 'Thêm ngày lễ'
      this.idEdit = null
    },
    holidayModalConvert () {
      if (this.holidayModal === null) return
      this.dateName = this.holidayModal.name
      this.dateHoliday = this.holidayModal.date
      if (this.holidayModal.service_ot !== null) {
        this.service_ot = this.holidayModal.service_ot
        this.convertVND()
      }
      if (this.holidayModal.overtime_workshift !== null && this.holidayModal.kpi_workshift !== null) {
        let otWorkshift = this.holidayModal.overtime_workshift
        let kpiWorkshift = this.holidayModal.kpi_workshift
        this.overtime_1 = Number(otWorkshift[0])
        this.overtime_2 = Number(otWorkshift[1])
        this.kpi_1 = Number(kpiWorkshift[0])
        this.kpi_2 = Number(kpiWorkshift[1])
      }
      this.idEdit = this.holidayModal.id
      this.title = 'Chỉnh sửa ngày lễ'
    },
    convertVND () {
      let x = this.service_ot
      let locationVND = x.indexOf('VND')
      if (locationVND !== -1) {
        x = x.slice(0, locationVND - 1)
      }
      let locationDot = x.indexOf('.')
      if (locationDot !== 0) {
        x = x.replaceAll('.', '')
      }
      x = Number(x)
      x = x.toLocaleString('it-IT', {style: 'currency', currency: 'VND'})

      locationVND = x.indexOf('VND')
      if (locationVND !== -1) {
        x = x.slice(0, locationVND - 1)
      }
      this.service_ot = x
    }
  }
}
</script>

<style scoped>
.custom-file{
  margin-bottom: 10px;
}

.css_holiday_custom{
  border: 1px solid #e7e8e8;
  padding: 5px 22px;
  margin-bottom: 9px;
}
.lb_holiday{
  margin: -19px 5px 5px -5px;
  padding: 5px 5px 5px 5px;
  font-weight: 500;
  font-size: 13px;
}
.lb_holiday_2{
  margin-top: 10px;
}
.style_VND{
  margin: 30px 0px;
  margin-right: 2%;
  padding: 5px;
}
</style>
