<template>
  <div class="upload-file row justify-content-center mt-3">
    <div class="col-md-10 col-12 alert-message justify-content-center mb-3">
      <b-alert variant="success" show v-if="isUploadSuccess == 1">{{ uploadSuccessMsg ? uploadSuccessMsg : 'Upload thông tin Không thành công' }}</b-alert>
      <b-alert variant="danger" show v-if="isUploadSuccess == -1">{{ uploadErrorMsg ? uploadErrorMsg : 'Upload thông tin Không thành công' }}</b-alert>
      <b-alert variant="danger" show v-if="!isUploadFails">{{ uploadFailsMsg }}</b-alert>
      <b-alert variant="danger" show v-if="!isUploadData">{{ uploadDataNullMsg }}</b-alert>
      <b-alert variant="danger" show v-if="!isUploadStt">{{ uploadSttMsg }}</b-alert>
    </div>
    <div class="upload-file-account-number col-md-5 col-12 mb-4">
      <div class="d-flex">
        <h2 class="mr-3">Upload file số tài khoản</h2>
        <h4>(<i class="ion ion-md-arrow-down" aria-hidden="true"></i><a :href="'/admin/files/templates/Template_uploadAccountNumber.xlsx'" target="_blank"> File mẫu</a>)</h4>
      </div>
      <b-form-file v-model="importFileAccountNumber" variant="outline-default" placeholder="Chọn file excel..."
                   accept=".xlsx" ref="importFile">
      </b-form-file>
      <div class="mt-3 mb-3">File đã chọn: {{importFileAccountNumber && importFileAccountNumber.name}}</div>
      <ladda-btn
        :loading="loadingAccountNumber"
        @click.native="uploadFileAccountNumber()"
        data-style="zoom-out"
        class="btn btn-primary"
        v-if="importFileAccountNumber">
        <i class="sidenav-icon ion ion-md-cloud-upload"></i>
        Cập nhật file số tài khoản.
      </ladda-btn>
    </div>
    <div class="upload-tax-code col-md-5 col-12 mb-4">
      <div class="d-flex">
        <h2 class="mr-3">Upload file mã số thuế</h2>
        <h4>(<i class="ion ion-md-arrow-down" aria-hidden="true"></i><a :href="'/admin/files/templates/Template_uploadTaxCode.xlsx'" target="_blank"> File mẫu</a>)</h4>
      </div>
      <b-form-file v-model="importFileTaxCode" variant="outline-default" placeholder="Chọn file excel..."
                   accept=".xlsx" ref="importFile">
      </b-form-file>
      <div class="mt-3 mb-3">File đã chọn: {{importFileTaxCode && importFileTaxCode.name}}</div>
      <ladda-btn
        :loading="loadingTaxCode"
        @click.native="uploadFileTaxCode()"
        data-style="zoom-out"
        class="btn btn-primary"
        v-if="importFileTaxCode">
        <i class="sidenav-icon ion ion-md-cloud-upload"></i>
        Cập nhật file mã số thuế.
      </ladda-btn>
    </div>
  </div>
</template>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import profileService from 'domain/services/profile-mamanger-service'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
export default {
  name: 'UploadTaxCodeAndAccountNumber',
  components: {LaddaBtn, LoadingMiniBottom},
  data: () => ({
    importFileTaxCode: null,
    importFileAccountNumber: null,
    loadingAccountNumber: false,
    loadingTaxCode: false,
    isUploadSuccess: 0,
    uploadErrorMsg: '',
    uploadSuccessMsg: '',
    uploadFailsMsg: '',
    uploadDataNullMsg: '',
    uploadSttMsg: '',
    isUploadFails: true,
    isUploadData: true,
    isUploadStt: true,
    IdJobAccountNumber: null,
    IdJobTaxCode: null
  }),
  methods: {
    uploadFileTaxCode () {
      if (!this.importFileTaxCode) {
        alert('Bạn chưa chọn file upload!')
        return
      }

      let fileExtension = this.importFileTaxCode.name.split('.').pop()
      if (fileExtension !== 'xlsx') {
        alert('Bạn phải upload file định dạng .xlsx!')
        return
      }

      this.isUploadSuccess = 0
      this.loadingTaxCode = true
      this.isUploadFails = true
      this.isUploadData = true
      this.isUploadStt = true
      let dataSend = new FormData()
      dataSend.append('file_upload', this.importFileTaxCode)
      profileService.uploadFileTaxCode(dataSend).then(response => {
        if (response.data.success) {
          this.isUploadSuccess = 1
          this.uploadSuccessMsg = response.data.message
          this.IdJobTaxCode = response.data.data.id_job
          this.checkStatusJobTaxCode(this.IdJobTaxCode)
        } else {
          this.isUploadSuccess = -1
          this.importFileTaxCode = null
          this.loadingTaxCode = false
          if (response.data.message) {
            this.uploadErrorMsg = response.data.message
          }
        }
      }).catch(error => {
        if (error) {
          this.isUploadSuccess = -1
          this.uploadSuccessMsg = 'Upload thông tin mã số thuế không thành công'
          this.loadingTaxCode = false
          this.importFileTaxCode = null
        }
      })
    },
    uploadFileAccountNumber () {
      if (!this.importFileAccountNumber) {
        alert('Bạn chưa chọn file upload!')
        return
      }
      let fileExtension = this.importFileAccountNumber.name.split('.').pop()
      if (fileExtension !== 'xlsx') {
        alert('Bạn phải upload file định dạng .xlsx!')
        return
      }

      this.isUploadSuccess = 0
      this.loadingAccountNumber = true
      this.isUploadFails = true
      this.isUploadData = true
      this.isUploadStt = true
      let dataSend = new FormData()
      dataSend.append('file_upload', this.importFileAccountNumber)
      profileService.uploadFileAccountNumber(dataSend).then(response => {
        if (response.data.success) {
          this.isUploadSuccess = 1
          this.uploadSuccessMsg = response.data.message
          this.IdJobAccountNumber = response.data.data.id_job
          this.checkStatusJobAccountNumber(this.IdJobAccountNumber)
        } else {
          this.importFileAccountNumber = null
          this.loadingAccountNumber = false
          this.isUploadSuccess = -1
          if (response.data.message) {
            this.uploadErrorMsg = response.data.message
          }
        }
      }).catch(error => {
        if (error) {
          this.importFileAccountNumber = null
          this.isUploadSuccess = -1
          this.uploadSuccessMsg = 'Upload thông tin số không tài khoản thành công'
          this.loadingAccountNumber = false
        }
      })
    },
    checkStatusJobAccountNumber (job_id = null) {
      // eslint-disable-next-line camelcase
      if (job_id === null || job_id === undefined) {
        this.uploadErrorMsg = 'Đã có lỗi xảy ra.'
        this.isUploadSuccess = -1
        this.importFileAccountNumber = null
        this.loadingAccountNumber = false
      } else {
        let getJobAccountNumber = setInterval(() => {
          profileService.checkStatusJob({
            job_id: job_id
          }).then(response => {
            if (response.data.success) {
              if (!response.data.data.job && response.data.data.job !== undefined) {
                this.uploadErrorMsg = response.data.message
                this.isUploadSuccess = -1
                this.importFileAccountNumber = null
                this.loadingAccountNumber = false
                clearInterval(getJobAccountNumber)
              } else if (!response.data.data.job_id && response.data.data.job_id !== undefined) {
                this.uploadErrorMsg = 'Đã có lỗi xảy ra.'
                this.isUploadSuccess = -1
                this.importFileAccountNumber = null
                this.loadingAccountNumber = false
                clearInterval(getJobAccountNumber)
              } else {
                this.isUploadSuccess = 1
                this.uploadSuccessMsg = response.data.message
                if (response.data.data.dataFails.length > 0) {
                  this.isUploadFails = false
                  this.uploadFailsMsg = 'Danh sách các mã nhân viên upload fail do không tồn tại trong hệ thống là: ' + response.data.data.dataFails
                }
                if (response.data.data.totalDataNull.length > 0) {
                  this.isUploadData = false
                  this.uploadDataNullMsg = 'Danh sách các upload fail do dữ liệu truyền vào thiếu, số thứ tự là: ' + response.data.data.totalDataNull
                }

                if (response.data.data.sttDataNull.length > 0) {
                  this.isUploadStt = false
                  this.uploadSttMsg = 'Danh sách các upload fail do không có mã nhân viên, số thứ tự là: ' + response.data.data.sttDataNull
                }

                this.importFileAccountNumber = null
                this.loadingAccountNumber = false
                clearInterval(getJobAccountNumber)
              }
            }
          }).catch(e => {
            this.uploadErrorMsg = 'Upload file số tài khoản thất bại.'
            this.isUploadSuccess = -1
            this.IdJobAccountNumber = null
            this.importFileAccountNumber = null
            this.loadingAccountNumber = false
            clearInterval(getJobAccountNumber)
            console.log(e)
          })
        }, 2000)
      }
    },
    checkStatusJobTaxCode (job_id = null) {
      // eslint-disable-next-line camelcase
      if (job_id === null || job_id === undefined) {
        this.uploadErrorMsg = 'Đã có lỗi xảy ra.'
        this.isUploadSuccess = -1
        this.importFileTaxCode = null
        this.loadingTaxCode = false
      } else {
        let getJobTaxCode = setInterval(() => {
          profileService.checkStatusJob({
            job_id: job_id
          }).then(response => {
            if (response.data.success) {
              if (!response.data.data.job && response.data.data.job !== undefined) {
                this.uploadErrorMsg = response.data.message
                this.isUploadSuccess = -1
                this.importFileTaxCode = null
                this.loadingTaxCode = false
                clearInterval(getJobTaxCode)
              } else if (!response.data.data.job_id && response.data.data.job_id !== undefined) {
                this.uploadErrorMsg = 'Đã có lỗi xảy ra.'
                this.isUploadSuccess = -1
                this.importFileTaxCode = null
                this.loadingTaxCode = false
                clearInterval(getJobTaxCode)
              } else {
                this.isUploadSuccess = 1
                this.uploadSuccessMsg = response.data.message
                if (response.data.data.dataFails.length > 0) {
                  this.isUploadFails = false
                  this.uploadFailsMsg = 'Danh sách các username upload fail do không tồn tại trong hệ thống là: ' + response.data.data.dataFails
                }
                if (response.data.data.totalDataNull.length > 0) {
                  this.isUploadData = false
                  this.uploadDataNullMsg = 'Danh sách các upload fail do thiếu mã số thuế, số thứ tự là: ' + response.data.data.totalDataNull
                }

                if (response.data.data.sttDataNull.length > 0) {
                  this.isUploadStt = false
                  this.uploadSttMsg = 'Danh sách các upload fail do thiếu username, số thứ tự là: ' + response.data.data.sttDataNull
                }

                this.importFileTaxCode = null
                this.loadingTaxCode = false
                clearInterval(getJobTaxCode)
              }
            }
          }).catch(e => {
            this.uploadErrorMsg = 'Upload file mã số thuế thất bại.'
            this.isUploadSuccess = -1
            this.IdJobTaxCode = null
            this.importFileTaxCode = null
            this.loadingTaxCode = false
            clearInterval(getJobTaxCode)
            console.log(e)
          })
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.custom-file-label::after {
  background-color: unset;
}

.alert-message .alert-danger {
  overflow: auto;
}

@media (min-width: 768px) {
  .upload-tax-code{
    border-left: 3px solid #C9C0C0DF;
  }
}
</style>
