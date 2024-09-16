<template>
  <b-modal v-model="isShowModal" :id="id" static center modal-class="modal-xl" title="UPLOAD KẾ HOẠCH XE THUÊ" @hide="onHideModal" :hide-footer="isHideFooter">
    <div class="position-relative dv-rent-plan" v-loading="importing">
      <p>
        <a :href="'/admin/files/templates/Truck/template_rent_plan.xlsx'" id='rent-plan-btn-export-data' name='rent-plan-btn-export-data' target="_blank" style="color: #219653 !important;">Tải file mẫu</a> |
        <a @click="exportFileInformationStation" class="cursor-pointer" id='info-btn-export-data' name='info-btn-export-data' target="_blank" style="color: #219653 !important;">Tải file thông tin GHTK</a>
        <a v-if="isLoadingExport" class="loader-export-excel-insurance"></a>
      </p>
      <b-file
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        browse-text="Chọn file"
        placeholder="Chọn file"
        :disabled="isDisable"
        v-model="fileInsuranceInfo"
        @change="loadPreview"
        class="mb-1"
      >
      </b-file>
      <span style="color:#828282;font-style: italic;">
        <i class="fa fa-info-circle" style="color: #4E5155;"></i> Chú ý sử dụng file mẫu để upload thông tin vào cơ sở dữ liệu thành công và chính xác!
      </span>
      <div v-if="dataUploadError.length > 0" :class="dataUploadError.length >3 ? 'trans-error' : ''">
        <ul style="margin-top: 20px">
          <li v-for="(errors) in dataUploadError" style="color: red; padding-bottom: 10px;">{{errors}}</li>
        </ul>
      </div>
      <div v-else>
        <b-alert :show="!!fileLog" style="color: #00904A;">
          Đã tải file thành công <br />
        </b-alert>
      </div>
    </div>
    <div v-if="dataUploadError.length === 0">
      <div class="w-100 text-center" slot="modal-footer">
        <b-btn variant="success" @click="importRentCarPlan" v-if="!fileLog && !importing">Tải lên</b-btn>
      </div>
    </div>
    <!-- <canvas-datagrid :data.prop='d'></canvas-datagrid> -->
  </b-modal>
</template>

<script>

// service
import CompanyProfileService from 'domain/services/company-profile-service'
import profileService from 'domain/services/profile-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'upload-rent-plan',

  props: {
    id: {
      default: 'upload-rent-plan'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    isHideFooter: {
      type: Boolean,
      default: false
    },
    profileId: null
  },
  components: {
  },

  data: _ => ({
    fileInsuranceInfo: null,
    dataPreview: {},
    fileLog: null,
    importing: false,
    dataUploadError: [],
    isShowModal: this.isShow,
    isDisable: false,
    isLoadingExport: false
  }),

  watch: {
    isShow: function (newValue, oldValue) {
      this.isShowModal = newValue
      this.$emit('toggleModal', newValue)
    }

  },

  methods: {
    onHideModal () {
      this.fileLog = null
      this.fileInsuranceInfo = null
      this.dataUploadError = []
      this.isShowModal = false
      this.isDisable = false
      this.$emit('toggleModal', false)
    },
    loadPreview (e) {
      e.stopPropagation()
      e.preventDefault()
      let file = e.target.files[0] || null
      if (!file) return
      this.fileLog = null
      // let dataPreview = this.dataPreview
      // let reader = new FileReader()
      // reader.onload = function (e) {
      //   let data = new Uint8Array(e.target.result)
      //   let wb = XLSX.read(data, { type: 'array' })
      //   wb.SheetNames.forEach(name => {
      //     dataPreview[name] = XLSX.utils.sheet_to_json(wb.Sheets[name], {header: 1})
      //   })
      // }
      // reader.readAsArrayBuffer(file)
    },

    exportFileInformationStation () {
      const data = {
        'profile_id': this.profileId
      }
      this.isLoadingExport = true
      CompanyProfileService.exportFileInformationStation(data)
        .then(res => {
          if (res.data.success) {
            window.location.href = res.data.data
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
          this.isLoadingExport = false
        })
        .catch(e => {
          this.isLoadingExport = false
          helper.showMessage('Có lỗi khi export file !', 'warning')
        })
    },

    importRentCarPlan () {
      if (!this.fileInsuranceInfo) {
        helper.showMessage('File là bắt buộc', 'warning')
        return
      }
      const fileSize = this.fileInsuranceInfo.size / 2048 / 1024
      if (fileSize > 20) {
        helper.showMessage('Kích thước file không thể lớn hơn 20MB', 'warning')
        return
      }

      const ext = this.fileInsuranceInfo.name.split('.').pop()
      if (!['xls', 'xlsx', 'xlsb'].includes(ext)) {
        helper.showMessage('File không phải là excel', 'warning')
        return
      }
      let data = new FormData()
      data.append('file', this.fileInsuranceInfo)
      data.append('profile_id', this.profileId)
      this.importing = true
      CompanyProfileService.importRentCarPlan(data)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.id) this.checkStatusJob(res.data.data.id)
            else {
              this.importing = false
              this.isDisable = true
              helper.showMessage('Không nhận được Job ID !', 'warning')
            }
          } else {
            this.dataUploadError = res.data.data || []
            this.importing = false
            this.isDisable = true
            helper.showMessage(res.data.message || 'Có lỗi khi import file !', 'warning')
          }
        })
        .catch(e => {
          this.importing = false
          this.isDisable = true
          helper.showMessage('Có lỗi khi import file !', 'warning')
        })
    },

    checkStatusJob (jobId) {
      if (!jobId) return
      let getJobStat = setInterval(_ => {
        profileService.checkJobStatus({job_id: jobId})
          .then(res => {
            if (res.data.success) {
              let data = res.data.data
              if (data.job_status === 'closed') {
                clearInterval(getJobStat)
                if (data.message) {
                  this.isDisable = true
                  helper.showMessage(data.message || 'Có lỗi khi kiểm tra Job import dữ liệu.', 'warning', 'Lỗi')
                } else {
                  this.fileLog = data.path
                  helper.showMessage('Đã import xong file dữ liệu', 'success')
                }
                this.importing = false
              }
            } else {
              helper.showMessage(res.data.mesage || 'Có lỗi khi kiểm tra Job import dữ liệu.', 'warning', 'Xảy ra lỗi')
              clearInterval(getJobStat)
              this.importing = false
              this.isDisable = true
            }
          })
      }, 2000)
    },

    openLink (link) {
      window.open(link, '_blank')
    }
  }
}
</script>

<style scoped>
  .trans-error {
    overflow-y: scroll;
    height: 150px;
  }
  .dv-rent-plan .custom-file {
    margin-bottom: 30px !important;
  }
  .modal-body button {
    margin-top: 40px;
  }
  .modal-header {
    display: flex;
    justify-content: center;
  }
  .dv-rent-plan .alert-info {
    border-color: #fff;
    background-color: #fff;
  }
</style>
<style>
  #upload-rent-plan .modal-body button {
    margin-top: 40px;
    width: 180px;
    background-color: #00904A;
  }
  #upload-rent-plan .modal-header {
    display: flex;
    justify-content: center;
  }
</style>
