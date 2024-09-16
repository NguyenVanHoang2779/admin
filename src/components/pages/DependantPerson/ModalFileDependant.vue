<template>
  <b-modal :id="id" modal-class="modal-xl" static center hide-footer @shown="getFileDependant">
    <div v-loading="loading" class="position-relative">
      <div class="text-right">
        <b-link @click="setEdit" v-show="!edit">Chỉnh sửa</b-link>
        <b-link @click="setEdit" v-show="edit">Hủy</b-link>
      </div>
      <div class="mh-75 overflow-auto">
          <!-- Alert -->
        <div id="topFile" class="text-danger mb-2 text-left">
          <span v-if="notEnoughFile">
            <i class="fas fa-info-circle"></i> Thiếu file:
          </span>
          <i v-for="(value, name) in fileDependant" :key="name + '0'">
            {{(value.required && (!value.files || !value.files.length)) ? (notEnoughFile = true, value.desc + ', ') : ''}}
          </i>
        </div>
        <div v-viewer="options">
          <template v-for="(value, name) in fileDependant">
            <div v-if="showFileType(value, name)" :key="name" class="text-left">
              <!-- File type -->
              <div class="div-file-type">
                <span class="span-file-type">{{ value.desc }}</span>
              </div>
              <!-- List file -->
              <div v-for="(file, index) in value.files" class="img-bounder" :key="file.id">
                <span v-if="edit" @click="deleteFile($event, name, index, true)" class="icon ion-md-close-circle btn-disable-file z-3" title="Xóa"></span>
                <img v-if="file.type.indexOf('image') === 0" :src="file.link_file" :alt="file.name" :data-src="file.source_file || file.link_file" class="mt-2 mr-3" />
                <div v-else class="mt-2 mr-3">
                  <b-link @click="openLink(file.source_file || file.link_file)">
                    <b-badge variant="primary" class="font-large">{{ file.name }}</b-badge>
                  </b-link>
                </div>
              </div>
              <div v-for="(file, index) in fileAdded[name]" class="img-bounder" :key="index">
                <span v-if="edit" @click="deleteFile($event, name, index, false)" class="icon ion-md-close-circle btn-disable-file z-3" title="Xóa"></span>
                <img v-if="file.type.indexOf('image') === 0" :src="getUrl(file)" :alt="file.name" class="mt-2 mr-3" />
                <b-link v-else class="mr-3">
                  <b-badge variant="primary" class="font-large">{{ file.name }}</b-badge>
                </b-link>
              </div>
              <!-- Input file -->
              <div class="img-bounder" v-show="edit">
                <b-form-group class="dragdrop">
                  <b-form-file
                    multiple
                    accept="image/*, .pdf"
                    v-model="fileAdded[name]"
                    placeholder="Thêm file"
                    :file-name-formatter="formatNames"
                  >
                  </b-form-file>
                </b-form-group>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="text-center mt-3">
        <b-btn variant="success" @click="updateFile" v-show="edit">Cập nhật</b-btn>
      </div>
    </div>
  </b-modal>
</template>

<style scoped>
.div-file-type {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
}

.span-file-type {
  font-size: 15px;
  font-weight: 500;
  color: #8c8c8c;
  line-height: 2;
}

.img-bounder {
  position: relative;
  display: inline-flex;
}
.img-bounder:hover > .btn-disable-file {
  display: inline;
}
.file-deleted {
  opacity: 0.1;
}
.btn-disable-file {
  font-size: 20px;
  display: none;
  position: absolute;
  top: -8px;
  right: 8px;
}
.dragdrop {
  height: 8rem;
  position: relative;
  width: 6rem;
  margin: 0;
}
.dragdrop >>> .custom-file-label {
  border: 2px dotted skyblue;
  border-radius: 0;
  height: 8rem;
  line-height: 8rem;
  text-align: center;
  color: skyblue;
  padding: 0;
  margin: 0;
}

.dragdrop .custom-file:hover >>> .custom-file-label {
  background: rgb(75, 181, 225);
  color: #fff;
}

.dragdrop >>> .custom-file-label::after {
  display: none;
}

img {
  height: 8rem;
  vertical-align: unset;
  border: 1px solid #ddd;
}
</style>

<script>
// service
import dependantService from 'domain/services/dependant-person-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'modal-file-dependant',

  props: {
    dependant: {
      type: Object,
      default: _ => ({})
    },

    id: {
      default: 'modal-file-dependant'
    }
  },

  components: {
  },

  data: _ => ({
    fileDependant: [],
    fileAdded: {
      fileCmndDependant: [],
      fileBirthCertificate: [],
      fileInabilityToWork: [],
      fileHousehold: [],
      fileXNNPTTNCN: [],
      fileDKNPT: [],
      fileOther: [],
      fileAuthority: [],
      fileDetailIncome: [],
      fileTemporaryResidence: [],
      fileConfirmOfCommittee: []
    },
    fileDeleted: {
      fileCmndDependant: [],
      fileBirthCertificate: [],
      fileInabilityToWork: [],
      fileHousehold: [],
      fileXNNPTTNCN: [],
      fileDKNPT: [],
      fileOther: [],
      fileAuthority: [],
      fileDetailIncome: [],
      fileTemporaryResidence: [],
      fileConfirmOfCommittee: []
    },

    edit: false,
    notEnoughFile: false,
    loading: false,

    options: {
      url: 'data-src'
    }
  }),

  watch: {
    edit (newValue, oldValue) {
      if (!newValue) {
        this.fileAdded.fileCmndDependant = []
        this.fileAdded.fileBirthCertificate = []
        this.fileAdded.fileInabilityToWork = []
        this.fileAdded.fileHousehold = []
        this.fileAdded.fileXNNPTTNCN = []
        this.fileAdded.fileDKNPT = []
        this.fileAdded.fileOther = []
        this.fileAdded.fileAuthority = []
        //
        this.fileDeleted.fileCmndDependant = []
        this.fileDeleted.fileBirthCertificate = []
        this.fileDeleted.fileInabilityToWork = []
        this.fileDeleted.fileHousehold = []
        this.fileDeleted.fileXNNPTTNCN = []
        this.fileDeleted.fileDKNPT = []
        this.fileDeleted.fileOther = []
        this.fileDeleted.fileAuthority = []

        let fileDeletedEl = this.$el.querySelectorAll('.file-deleted')
        for (var i = 0, len = fileDeletedEl.length | 0; i < len; i = i + 1 | 0) {
          fileDeletedEl[i].classList.remove('file-deleted')
        }
        let top = this.$el.querySelector('#topFile')
        if (top) top.scrollTo({top: 0, behavior: 'smooth'})
      }
    }
  },

  methods: {
    setEdit () {
      this.edit = !this.edit
    },

    deleteFile (event, typeName, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.fileDeleted[typeName].push(this.fileDependant[typeName]['files'][indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
        } else {
          let index = this.fileDeleted[typeName].indexOf(this.fileDependant[typeName]['files'][indexFile].id)
          if (index >= 0) {
            this.fileDeleted[typeName].splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.fileAdded[typeName].splice(indexFile, 1)
      }
    },

    formatNames (files) {
      if (files) return `${files.length} files`
      return ''
    },

    getUrl (file) {
      return URL.createObjectURL(file)
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    showFileType (files, name) {
      if (!this.edit) {
        if (files.files.length > 0) return true
        return false
      } else {
        if (files.required === true || name === 'fileOther' || files.files.length) return true
        return false
      }
    },

    getFileDependant () {
      if (!this.dependant || !this.dependant.id) return
      this.loading = true

      dependantService.getFileByDependantId({ dependantId: this.dependant.id })
        .then(res => {
          if (res.data.success) {
            this.fileDependant = res.data.data.fileData || []
          } else {
            helper.showMessage(res.data.message || 'Không lấy được file hồ sơ NPT !', 'warning')
          }
        }).catch(e => {
          helper.showMessage('Không lấy được dữ liệu !', 'warning')
        }).then(_ => {
          this.loading = false
        })
    },

    updateFile () {
      if (!this.dependant || !this.dependant.id) return

      this.loading = true
      let fileUpdate = new FormData()

      fileUpdate.append('dependantId', this.dependant.id)

      Object.keys(this.fileAdded).forEach(key => {
        let length = this.fileAdded[key].length
        for (let i = 0; i < length; i++) {
          fileUpdate.append(key + '[' + i + ']', this.fileAdded[key][i])
        }
      })
      Object.keys(this.fileDeleted).forEach(key => {
        let length = this.fileDeleted[key].length
        for (let i = 0; i < length; i++) {
          fileUpdate.append(key + '[' + i + ']', this.fileDeleted[key][i])
        }
      })

      dependantService.updateFileDependant(fileUpdate)
        .then(res => {
          if (res.data.success) {
            this.getFileDependant()
            this.$emit('dataChange')
            this.edit = false
            helper.showMessage(res.data.message || 'Cập nhật file hồ sơ NPT thành công', 'success')
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        }).catch(e => {
          helper.showMessage('Đã có lỗi xảy ra', 'warning')
        }).then(_ => {
          this.loading = false
        })
    }
  }
}
</script>
