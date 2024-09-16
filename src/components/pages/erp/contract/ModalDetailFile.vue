<template>
  <b-modal hide-footer modal-class="modal-lg-custom" :title="title" :id="id" centered static @show="getFileContract">
    <div v-show="edit">
      <b>Vui lòng nhập file HĐ đã ký <span class="text-danger">*</span></b>
      <div class="seperate-sm mb-2"></div>
    </div>
    <!-- <div v-if="edit"> -->
      <!-- <b-file
        multiple
        v-model="fileAdd"
        accept='image/*, .pdf, .doc, .docx'
        id="file-contract"
      ></b-file> -->
    <file-view-upload
      :file-add="fileAdd"
      :file-delete="fileDelete"
      :files="files"
      :edit="edit"
      accept='image/*, .pdf, .doc, .docx'
      :loading="loading"
      :input-id="id + '-file-contract'"
    >
      <b-btn slot="update-btn-content" variant="ghtk" @click="uploadFile">Xác nhận đã ký</b-btn>
    </file-view-upload>
      <!-- <div class="text-center mt-3">
        <b-btn variant="ghtk" @click="uploadFile">Xác nhận đã ký</b-btn>
      </div> -->
    <!-- </div> -->
  </b-modal>
</template>

<script>
// Api service
import staffService from 'domain/services/staff-service'
// custom components
import FileViewUpload from 'components/elements/common/FileViewUpload'

// helper
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-detail-file',

  props: {
    title: {
      type: String,
      default: 'Thông tin file'
    },
    id: {
      type: String,
      default: 'detail-file'
    },
    contractId: {
      default: null
    },
    edit: {
      default: true
    },
    signed: {
      default: true
    }
  },

  components: {
    FileViewUpload
  },

  data: () => ({
    files: [],
    fileAdd: [],
    fileDelete: [],
    loading: false
  }),

  watch: {},

  methods: {
    uploadFile () {
      let contractId = this.contractId
      let signed = this.signed
      if (!contractId) return

      let data = new FormData()
      data.append('contract_id', contractId)
      data.append('signed', signed ? 1 : 0)

      for (const idx in this.fileDelete) {
        data.append('fileDelete[' + idx + ']', this.fileDelete[idx])
      }

      for (const idx in this.fileAdd) {
        data.append('fileAdd[' + idx + ']', this.fileAdd[idx])
      }

      if (this.fileAdd.length < 1 && this.files.length === this.fileDelete.length) {
        helper.showMessage('Vui lòng chọn file hợp đồng để upload !', 'warning')
        return
      }

      this.$startLoading()
      staffService.uploadFileContract(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('updateOk', res.data.data)
            this.files = res.data.data
            this.fileAdd = []
            this.fileDelete = []
            this.$bvModal.hide(this.id)
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message || 'Không xác nhận ký hợp đồng được, vui lòng liên hệ IT để được hỗ trợ !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Không xác nhận ký hợp đồng được, vui lòng liên hệ IT để được hỗ trợ !', 'warning')
          console.log(e)
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    getFileContractSigned () {
      if (!this.contractId) {
        this.files = []
        this.fileAdd = []
        this.fileDelete = []
        return
      }
      this.getFileContract()
    },

    getFileContract () {
      let contractId = this.contractId
      if (!contractId) return
      this.loading = true

      let params = {
        contract_id: contractId
      }
      staffService.getFileContract(params)
        .then(res => {
          if (res.data.success) {
            this.files = res.data.data
            this.fileAdd = []
            this.fileDelete = []
          } else {
            helper.showMessage(res.data.message || 'Không thể lấy danh sách file file !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Không thể lấy danh sách file !', 'warning')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
        })
    }
  }
}
</script>
