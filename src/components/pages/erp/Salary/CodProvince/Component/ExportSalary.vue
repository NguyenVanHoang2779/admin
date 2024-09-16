<template>
  <div>
    <br>
    <b-row>
      <b-col>
        <h4>Nhập mã cod alias</h4>
        <b-form-input v-model="listsCodAlias" :disabled="this.listsUsername != '' || this.provinceIds != null" placeholder="Nhiều mã cod cách nhau bởi một dấu phẩy"></b-form-input>
      </b-col>
      <b-col>
        <h4>Nhập username</h4>
        <b-form-input v-model="listsUsername" :disabled="this.listsCodAlias != '' || this.provinceIds != null" placeholder="Nhiều username cod cách nhau bởi một dấu phẩy"></b-form-input>
      </b-col>
      <b-col>
        <h4 class="mt-1 mr-3">Chọn kỳ lương</h4>
        <vue-monthly-picker
          class="monthly-picker"
          v-model="salaryMonth"
          placeHolder="Chọn kỳ lương"
          :alignment="`center`"
          :dateFormat="`MM-YYYY`"
          :clearOption="false"
        ></vue-monthly-picker>
      </b-col>
      <b-col>
        <h4>Chọn tỉnh cần xuất</h4>
        <multi-select-province
          @handleProvinceSelected="handleProvinceSelected"
          :display-all="true"
          :limit-prop=99999
          :auto-close="false"
          :hide-selected="true"
          :isDisabled="this.listsCodAlias != '' || this.listsUsername != ''"
        />
      </b-col>
      <b-col>
        <h4>Đặt tên file</h4>
        <b-input v-model="fileName"></b-input>
      </b-col>
      <b-col>
        <h4>Loại ngày</h4>
        <b-input v-model="dateNotCal" :placeholder="`YYYY-MM-DD, YYYY-MM-DD, YYY-MM-DD`"></b-input>
      </b-col>
      <b-col md="2">
        <h4><br></h4>
        <b-button-group>
          <b-button variant="primary" :disabled="isProcessing" @click="exportSalary">Xuất bảng lương <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-button>
          <b-button variant="danger" v-if="isProcessing">Hủy bỏ</b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <hr class="mt-3 mb-3">
    <b-row>
      <b-col v-if="this.totalFile !== null && this.fileName !== null">
        <b-progress :value="this.totalFileExported / this.totalFile * 100" show-progress animated></b-progress>
      </b-col>
      <b-col md="1" v-if="isSave">
        <b-button variant="primary" @click="exportSalary">Tiếp tục</b-button>
      </b-col>
      <b-col md="1" v-if="this.totalFile !== null && this.fileName !== null">
        <b-button variant="danger" @click="cancelExportProcess">Hủy bỏ</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
  .btn-header {
    width: 250px;
  }
</style>

<script>
import VueMonthlyPicker from 'vue-monthly-picker'
import MultiSelectProvince from 'components/pages/erp/Salary/TransitComponent/MultiSelectProvince'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SalaryService from 'domain/services/salary-service'
export default {
  name: 'export-salary',
  components: {
    VueMonthlyPicker,
    Moment,
    MultiSelectProvince
  },
  watch: {
    listsCodAlias (newVal, oldVal) {
      if (newVal !== '') this.listsUsername = ''
    },
    listsUsername (newVal, oldVal) {
      if (newVal !== '') this.listsCodAlias = ''
    }
  },
  data: () => ({
    salaryMonth: new Moment(),
    listsCodAlias: '',
    listsUsername: '',
    isProcessing: false,
    provinceIds: null,
    fileName: '',
    totalFile: null,
    totalFileExported: null,
    isSave: null,
    isCancel: null,
    dateNotCal: ''
  }),
  methods: {
    handleProvinceSelected (option) {
      if (typeof option[0] !== 'undefined') {
        this.provinceIds = option.map(option => option.id).toString()
      } else {
        this.provinceIds = null
      }
    },
    exportSalary () {
      if (this.totalFile === null) {
        if (this.listsCodAlias === '' && this.listsUsername === '' && this.provinceIds === null) {
          if (!confirm('Bạn có chắc muốn xuất bảng lương cả nước!')) return true
        }
        if (this.fileName === '') return commonHelper.showMessage('Vui lòng điền tên file', 'warning')
        if (this.fileName.length > 100) return commonHelper.showMessage('Tên file không được quá 100 ký tự', 'warning')
        this.fileName = this.changeAlias(this.fileName)
      }
      let dataSend = {
        list_cods_alias: this.listsCodAlias,
        list_username: this.listsUsername,
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        file_name: this.fileName,
        total_file: this.totalFile,
        province_ids: this.provinceIds,
        is_cancel: this.isCancel
      }
      if (this.dateNotCal !== '') dataSend.date_not_cal = this.dateNotCal
      this.isSave = false
      SalaryService.exportSalaryCodProvinceV2(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          if (res.data.isContinueRequest) {
            if (typeof (res.data.data) !== 'undefined') {
              this.totalFile = res.data.data.total_file
              localStorage.setItem('totalFile', this.totalFile)
              localStorage.setItem('fileName', this.fileName)
            }
            setTimeout(() => {
              this.exportSalary()
            }, 15000)
          } else {
            this.doneProcess()
            window.location.href = res.data.data.file_path
          }
        } else {
          if (res.data.isContinueRequest) {
            if (typeof (res.data.data) !== 'undefined') {
              this.totalFile = res.data.data.total_file
              if (typeof res.data.data.total_file_exported !== 'undefined') {
                this.totalFileExported = res.data.data.total_file_exported
                localStorage.setItem('totalFileExported', res.data.data.total_file_exported)
                localStorage.setItem('totalFile', res.data.data.total_file)
              }
            }
            commonHelper.showMessage(res.data.message, 'warning')
            setTimeout(() => {
              this.exportSalary()
            }, 15000)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      })
    },
    changeAlias (alias) {
      let str = alias
      str = str.toLowerCase()
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      str = str.replace(/đ/g, 'd')
      str = str.replace(/\s/g, '')
      str = str.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
      str = str.replace(/ + /g, ' ')
      str = str.trim()
      return str
    },
    isContinueProcess () {
      let totalFileSaved = localStorage.getItem('totalFile')
      let fileNameSave = localStorage.getItem('fileName')
      let totalFileExportedSave = localStorage.getItem('totalFileExported')
      if (totalFileSaved !== null && fileNameSave !== null) {
        this.totalFile = totalFileSaved
        this.fileName = fileNameSave
        this.totalFileExported = totalFileExportedSave
        this.isSave = true
      }
    },
    cancelExportProcess () {
      this.isCancel = true
      this.exportSalary()
      this.doneProcess()
    },
    doneProcess () {
      localStorage.clear()
      this.totalFile = null
      this.fileName = null
      this.totalFileExported = null
      this.provinceIds = null
      this.listsCodAlias = ''
      this.listsUsername = ''
      this.isSave = null
      this.dateNotCal = ''
    }
  },
  created () {
    this.isContinueProcess()
  }
}
</script>
