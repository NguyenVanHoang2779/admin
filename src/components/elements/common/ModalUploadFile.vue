<template>
  <div class="modal-upload-file" id="modal-upload-file">
    <b-modal :id="id" hide-footer hide-header-close header-class="justify-content-center" size="sm" @shown="initModal"
             modal-class="align-items-center" centered static class="d-flex align-items-center">
      <template slot="modal-title">
        <div class="text-title pl-3"><span>{{ title }}</span></div>
        <div class="btn-close btn" @click="closeModal"><i class="fa fa-times"></i></div>
      </template>
      <div v-if="!fileAdd">
        <div class="justify-content-center text-center txt-body">Thêm file để tải lên file excel {{ nameFile }}!</div>
        <div class="justify-content-center mt-2 text-center txt-body"><h5><b>KÉO THẢ FILE ĐỂ UPLOAD</b></h5></div>
        <div class="btn-action d-flex mt-2 justify-content-center align-items-center">
          <b-button class="mr-1 btn-outline-ghtk btn__file-default py-1 px-2" @click="downloadFile"> Tải file mẫu </b-button>
          <b-button class="btn-outline-ghtk btn__choose-file py-1 px-2" @click="chooseFile()"> Chọn file </b-button>
        </div>
      </div>
      <div v-else>
        <div class="justify-content-center text-center txt-body">Click xác nhận để tải file excel {{ nameFile }}!</div>
        <div class="modal-show-file justify-content-center d-flex mt-4">
          <div v-if="getFileType(fileAdd) === 'excel'" class="d-table">
            <img src="../../../assets/images/ghtk_excel.png" :alt="'file-' . nameFile" :style="{ height: height }"/>
            <div class="text-file-name my-1 text-center">{{ fileName }}</div>
          </div>
          <span @click="deleteFile" class="icon ion-md-close-circle btn-disable-file a2" title="Xóa"></span>
        </div>
        <div class="btn-action mt-3 justify-content-center align-items-center d-flex">
          <b-button class="btn-ghtk text-center btn__confirm" @click="uploadFile">Xác nhận</b-button>
        </div>
      </div>
      <div class="custom-choose-file">
        <input
          type="file"
          class="custom-file-input hide"
          :multiple="false"
          :accept="accept"
          :placeholder="inputPlaceholder"
          @input="addFile"
          :id="'input-' . id"
          :name="'input_' + id"
          ref="inputChooseFile"
        />
      </div>
    </b-modal>
  </div>
</template>

<style scoped lang="scss">
.btn-action {
  .btn__file-default, .btn__choose-file {
    border-radius: 10px;
    width: 38%;
  }

  .btn__confirm {
    width: 44%;
    border-radius: 10px;
    font-size: 16px;
  }
}

.custom-choose-file {
  display: none;
}

.ion-md-close-circle {
  cursor: pointer;
  position: absolute;
  margin-left: 120px;
  color: red;
  font-size: 16px;
  top: 66px;
}

.text-title {
  font-size: 20px;
}
.txt-body {
  font-size: 16px;
  color: #000000;
}

.text-file-name {
  font-size: 12px;
  color: #000000;
}

.btn-close {
  position: relative;
  bottom: 2rem;
  left: 13.8rem;
}
</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalUploadFile',
  props: {

    title: {
      default: 'Thêm câu hỏi',
      type: String
    },

    id: {
      type: String,
      default: 'modal-upload-file'
    },

    nameFile: {
      type: String,
      default: 'câu hỏi'
    },

    height: {
      default: '150px',
      type: String
    },

    accept: {
      type: String,
      default: '.pdf, .xlsx'
    },

    inputPlaceholder: {
      type: String,
      default: 'Chọn file upload'
    },

    urlDefault: {
      type: String,
      default: null
    },

    typeQuestion: {
      type: Number,
      defautl: 1
    }
  },
  data: _ => ({
    fileAdd: null,
    fileDefault: '../../../assets/images/ghtk_excel.png',
    fileName: null
  }),
  methods: {
    initModal () {
      this.fileAdd = null
    },
    downloadFile () {
      if (helper.isEmpty(this.urlDefault)) {
        helper.showMessage('Không có link file mẫu cần tải!', 'warning')
        return
      }
      window.open(this.urlDefault, '_blank')
    },

    chooseFile () {
      let fileInput = this.$refs.inputChooseFile
      fileInput.click()
    },

    getFileType (file) {
      if (!file) return helper.showMessage('Không có file!', 'warning')
      let ext = ''
      if (typeof file === 'string') { // là link
        ext = file.split('?').shift().split('.').pop().toLowerCase()
      } else ext = file.name.split('.').pop().toLowerCase() // là File
      this.fileName = file.name.split('.').shift()
      if (['xls', 'xlsx', 'xlsb'].includes(ext)) return 'excel' // là excel

      return helper.showMessage('File không hợp lệ!', 'warning')
    },

    deleteFile () {
      this.fileAdd = null
    },

    addFile (e) {
      if (!this.fileAdd) this.fileAdd = null
      let file = e.target.files || e.dataTransfer.files
      if (file.length > 0) file = file[0]
      let listExtAllow = this.accept.split(', ')
      let ext = file.name.split('.').pop()
      if (!ext) return helper.showMessage('File không hợp lệ!', 'warning')

      if (listExtAllow.includes(file.type) || listExtAllow.includes('.' + ext)) {
        this.fileAdd = file
      } else {
        helper.showMessage(`Định dạng file ${file.name}  không được hỗ trợ !`, 'warning')
      }
      e.target.value = null
    },

    uploadFile () {
      let els = this.$el.querySelectorAll('.bounder .btn-disable-file')
      for (let el of els) {
        el.nextElementSibling.classList.remove('file-deleted')
        el.classList.remove('ion-md-refresh-circle')
        el.classList.add('ion-md-close-circle')
      }
      this.$emit('uploadFile', this.fileAdd)
    },

    closeModal () {
      this.$bvModal.hide(this.id)
      this.fileAdd = null
    }
  }
}
</script>

<style scoped>

</style>
