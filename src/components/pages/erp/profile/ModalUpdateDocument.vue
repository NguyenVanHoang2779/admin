<template>
  <div>
    <b-modal modal-class="modal-update-document" id="modal-update-document" size="lg" title="Thông tin hồ sơ">
      <div>
        <div class="group-name">Hồ sơ</div>
        <div class="row">
          <template  v-for="(document, idx) in documents">
            <div class="col-4 row-item document-row" v-if="+document.type === 1" :key="idx" :title="!document.hasFile ? 'Chưa có file' : ''">
              <b-form-checkbox
                :disabled="!document.hasFile"
                v-model="document.value"
                value="1"
                unchecked-value="0"
              >
                {{ document.name }}
              </b-form-checkbox>
            </div>
          </template>
        </div>

        <div class="group-name">Văn bản công ty</div>
        <div class="row">
          <template  v-for="(document, idx) in documents">
            <div class="col-4 row-item  document-row" v-if="+document.type === 2" :key="idx" :title="!document.hasFile ? 'Chưa có file nào' : ''">
              <b-form-checkbox
                :disabled="!document.hasFile"
                v-model="document.value"
                value="1"
                unchecked-value="0"
              >
                {{ document.name }}
              </b-form-checkbox>
            </div>
          </template>
        </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$bvModal.hide('modal-update-document')">Đóng</button>
      </template>
    </b-modal>
    <b-modal centered id="upload-image" :title="currEditingDocument.name" @hide="currEditingDocument = {files: []}">
      <div v-viewer v-loading="isLoadingFile">
        <template v-for="(file, idx) in currEditingDocument.files">
          <div class="img-bounder" :key="idx">
            <span @click.stop="deleteFile($event, file, idx)" title="Xóa" v-if="!file.deleted" class="btn-disable-file"><i class="icon ion-md-close-circle"></i></span>
            <span @click.stop="deleteFile($event, file, idx)" title="Lấy lại" v-else class="btn-disable-file"><i class="icon ion-md-refresh-circle"></i></span>
            <b-img
              v-if="file.path && isImage(file.name)"
              :src="file.path"
              height="100"
              rounded
              class="border border-secondary mr-1 mb-1"
            ></b-img>
            <b-link :href="file.path" target="_blank" v-else-if="file.path && !isImage(file.name)">
              <h5 class="d-inline-block mr-1 mb-1"><b-badge variant="primary">{{file.name}}</b-badge></h5>
            </b-link>
            <b-img
              v-else-if="file.type && file.type.indexOf('image') === 0"
              :src="getUrl(file)"
              :alt="file.name"
              rounded
              height="100"
              class="border border-secondary mr-1 mb-1"
            ></b-img>
            <h5 v-else class="d-inline-block mr-1 mb-1"><b-badge variant="primary">{{file.name}}</b-badge></h5>
            </div>
        </template>
        <div class="dragdrop d-inline-block">
          <b-form-file
            @input="addFile"
            multiple
            accept="image/*, .pdf"
            placeholder="+"
            :file-name-formatter="() => ('+')"
          >
          </b-form-file>
        </div>
      </div>
      <template slot="modal-footer">
        <b-btn variant="secondary" @click="$bvModal.hide('upload-image')">Đóng</b-btn>
        <b-btn variant="primary" @click="updateImages()" :disabled="isLoadingFile">Cập nhật</b-btn>
      </template>
    </b-modal>
  </div>
</template>

<style scoped>
  .modal-update-document .group-name {
    font-weight: bold;
    padding: 10px 0;
  }
  .modal-update-document .row-item {
    font-weight: normal;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .document-row {
    position: relative
  }

  .photo-icon {
    font-size: 1.5em;
    position: absolute;
    right: 0;
    top: 0;
  }
  .photo-btn {
    color: #cccccc;
  }
  .photo-btn:hover{
    color: #aaaaaa;
  }

  .img-bounder {
    position: relative;
    display: inline-block;
  }
  .img-bounder:hover > .btn-disable-file {
    z-index: 10000;
    display: inline;
  }
  .btn-disable-file {
    font-size: 20px;
    display: none;
    position: absolute;
    top: -6px;
    right: 6px;
  }
  .dragdrop {
    width: 2rem;
  }
  .dragdrop >>> .custom-file-input {
    position: absolute;
  }
  .dragdrop >>> .custom-file-label {
    border: 1px solid #28a745;
    text-align: center;
    color: #28a745;
    font-size: 12px;
    position: inherit;
    line-height: inherit;
    height: auto;
  }
  .dragdrop >>> .custom-file-label::after {
    display: none;
  }

  .dragdrop .custom-file:hover >>> .custom-file-label {
    background: #28a745;
    color: #fff;
  }
  .file-deleted {
    opacity: 0.2;
  }
</style>

<script>
// service
import profileService from 'domain/services/profile-service'

// utilities
import commonHelper from 'infrastructures/helpers/common-helpers'
// library
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'modal-update-document',

  components: {
  },

  props: ['documents', 'masterId'],

  data: () => ({
    files: [],
    currEditingDocument: {
      files: []
    },
    currEditingDocumentIndex: null,
    isLoadingFile: false
  }),

  methods: {
    isImage (path) {
      if (!path) return null
      let imageReg = /[/.](gif|jpg|jpeg|tiff|png)$/i
      return imageReg.test(path)
    },

    deleteFile (event, file, index) {
      if (file.path) {
        if (!file.deleted) this.$set(file, 'deleted', 1)
        else file.deleted = 0

        event.currentTarget.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.currEditingDocument.files.splice(index, 1)
      }
    },

    addFile (files) {
      let fileAllowRegex = /[/.](gif|jpg|jpeg|tiff|png|pdf)$/i
      if (typeof files === 'object' && files.length > 0) {
        files.forEach(file => {
          if (fileAllowRegex.test(file.name)) this.currEditingDocument.files.push(file)
          else commonHelper.showMessage(`Định dạng file ${file.name} không được hỗ trợ`, 'warning')
        })
      }
    },

    getUrl (file) {
      let url = URL.createObjectURL(file)
      URL.revokeObjectURL(file)
      return url
    },

    openPhotoModal (document, index) {
      this.currEditingDocumentIndex = index
      this.$bvModal.show('upload-image')
      let dataSend = {
        'master_id': this.masterId,
        'document_id': document.id
      }
      this.isLoadingFile = true
      profileService.getDocumentFile(dataSend).then(response => {
        if (response.data.success) {
          this.currEditingDocument = {
            'name': document.name,
            'id': document.id,
            'files': response.data.data
          }
        } else commonHelper.showMessage(response.data.message, 'warning')
      }).catch((err) => {
        console.log(err)
      }).then(() => {
        this.isLoadingFile = false
      })
    },

    updateImages () {
      this.$startLoading()
      let dataSend = new FormData()
      dataSend.append('master_id', this.masterId)
      dataSend.append('document_id', this.currEditingDocument.id)
      for (let [idx, file] of this.currEditingDocument.files.entries()) {
        if (!file.path) {
          dataSend.append('fileAdded[' + idx + ']', file)
        }
      }
      dataSend.append('files', JSON.stringify(this.currEditingDocument.files))

      profileService.updateDocumentFiles(dataSend).then(response => {
        if (response.data.success) {
          if (response.data.data) this.documents[this.currEditingDocumentIndex] && (this.documents[this.currEditingDocumentIndex].hasFile = true)
          else this.documents[this.currEditingDocumentIndex] && (this.documents[this.currEditingDocumentIndex].hasFile = false)
          this.currEditingDocumentIndex = null
          commonHelper.showMessage(response.data.message, 'success')
          this.$bvModal.hide('upload-image')
        } else commonHelper.showMessage(response.data.message, 'warning')
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    leanData (documents) {
      documents.forEach(document => {
        if (document.files) {
          document.files.forEach(file => {
            delete file.default
            delete file.highlight
            delete file.name
          })
        }
      })
      return documents
    },

    updateDocument () {
      this.$startLoading()

      let dataSend = {
        master_id: this.masterId,
        documents: this.leanData(this.documents)
      }
      profileService.updateDocuments(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    }
  }
}
</script>
