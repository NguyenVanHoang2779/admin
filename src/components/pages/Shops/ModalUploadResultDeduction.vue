<template>
  <b-modal ref="uploadResultDeductionModal" id="modal-upload-result-deduction" title="Upload file Kết quả chiết khấu" static>
    <div class="d-block text-center">
      <b-alert variant="success" show v-if="isUploadSuccess == 1">{{ uploadMsg ? uploadMsg : 'Upload file thành công' }}</b-alert>
      <b-alert variant="danger" show v-if="isUploadSuccess == -1">{{ uploadMsg ? uploadMsg : 'Upload file không thành công' }}</b-alert>
      <b-form-file v-model="importFile" variant="outline-default" :state="Boolean(importFile)" placeholder="Chọn file..."
           accept=".xls*" ref="importFile"
      >
      </b-form-file>
      <div class="mt-3 mb-3">File đã chọn: {{importFile && importFile.name}}</div>
      <ladda-btn
        :loading="loading"
        @click.native="uploadFile()"
        data-style="zoom-out"
        class="btn btn-primary"
        v-if="importFile"
      >
        <i class="sidenav-icon ion ion-md-filing"></i>
        Upload
      </ladda-btn>
    </div>
    <div slot="modal-footer" class="w-100">
      <b-btn class="float-right" variant="default" @click="hideImportModal">
        Đóng
      </b-btn>
    </div>
  </b-modal>
</template>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import deductionService from 'domain/services/deduction-service'
export default {
  name: 'modal-upload-result-deduction',

  components: {
    LaddaBtn
  },

  props: [],

  data () {
    return {
      isUploadSuccess: 0,
      uploadMsg: '',
      importFile: null,
      loading: false
    }
  },

  created () {
  },

  watch: {
  },

  methods: {
    uploadFile: function () {
      let self = this
      self.isUploadSuccess = 0
      if (!self.importFile) {
        alert('Bạn chưa chọn file upload!')
        return
      }

      let fileExtension = this.importFile.name.split('.').pop()
      if (['xlsx', 'xls'].indexOf(fileExtension) < 0) {
        alert('Bạn phải upload file định dạng Excel .xlsx hoặc .xls !')
        return
      }

      let dataSend = new FormData()
      dataSend.append('file_upload', self.importFile)
      self.uploadMsg = ''
      self.loading = true
      deductionService.uploadFileResultDeduction(dataSend).then(response => {
        if (response.data.success) {
          self.isUploadSuccess = 1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.loading = false
        } else {
          self.isUploadSuccess = -1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.loading = false
        }
      }).catch(error => {
        if (error) {
          self.isUploadSuccess = -1
          self.loading = false
        }
      }).then(function () {
        self.loading = false
        self.appLoading = false
      })
    },

    hideImportModal: function () {
      this.$bvModal.hide('modal-upload-result-deduction')
      this.uploadMsg = ''
      this.importFile = null
      this.isUploadSuccess = 0
    }
  }
}
</script>
