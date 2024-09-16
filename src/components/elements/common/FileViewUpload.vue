<template>
  <div v-viewer v-loading="loading">
    <perfect-scrollbar :options="scrollbarOption" class="scrollbar-file">
      <!-- File uploaded -->
      <template v-if="isShowFileExist">
      <div v-for="(file, idx) in fileFormatted" class="bounder" :key="idx + 'files'">

        <span
          v-if="(edit && allowDelete) || onlyDelete"
          @click="deleteFileUploaded(file)"
          class="icon btn-disable-file"
          :class="file.deleted ? 'ion-md-refresh-circle' : 'ion-md-close-circle'"
          :title="file.deleted ? 'Lấy lại' : 'Xóa'"
        ></span>
        <!-- File ảnh  -->
        <div
          v-if="file.media_type === 'image'"
          class="d-table"
          :class="file.deleted && 'file-deleted'"
        >
          <img
            :style="{ height: height,  filter: (blurImage && (file.link)) ? 'blur(15px)' : null}"
            @click="isThumbnail && getOriginImage(file)"
            :src="file.link" :alt="file.name"
            :class="imagePreviewClass"
          />
        </div>
        <div v-else class="d-table mr-3 a2">
          <b-badge variant="ghtk" @click="openLink(file.link)">
            <span class="font-weight-bold h4">{{ file.name }}</span>
          </b-badge>
        </div>
      </div>
      </template>
      <!-- File added  -->
      <div v-if="edit && !inputCombine" class="d-inline-block">
        <div v-for="(file, idx) in fileAdd || []" class="bounder" :key="file.name + 'file-add' + idx">
          <span @click="deleteFileAdded(idx)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
          <div v-if="file.media_type === 'image'" class="d-table">
            <img
              :src="file.link" :alt="file.name" :class="imagePreviewClass" :style="{ height: height }"
            />
          </div>
          <div v-else class="d-table mr-3">
            <b-badge variant="ghtk"><span class="font-weight-bold h4">{{ file.name }}</span></b-badge>
          </div>
        </div>
      </div>
      <!-- Input File  -->
      <div class="bounder" v-if="edit">
          <div class="d-table dragdrop" :style="{ height: height }">
            <div class="custom-file">
              <div class="invisible">
              <input
                type="file"
                class="custom-file-input"
                :multiple="multiple"
                :accept="accept"
                :placeholder="inputPlaceholder"
                @input="addFile"
                :id="inputId"
                :style="inputStyle"
                :name="'input_' + inputId"
              />
              </div>
                <label class="custom-file-label m-0" :for="inputId" id="custom-file-label"  :style="{ 'height': height, 'z-index': labelIndex }">
                  <slot name="label">
                    <div class="file-label-inner" :style="{'line-height': height}">
                      <div :class="{ 'label-content': fileAdd && fileAdd[0] && inputCombine }"> <div style="position: absolute;left: 45%;top: -0.7rem;"><i class="ion ion-ios-add"></i></div>{{ inputPlaceholder }}</div>
                    </div>
                  </slot>
                </label>
            </div>
          </div>
      </div>
    </perfect-scrollbar>
    <!-- Action upload file  -->
    <div class="w-100 text-center" v-if="edit && !hideUploadButton">
      <hr>
      <slot name="update-btn-content">
        <b-btn variant="ghtk" @click="uploadFile">
          <i class="fas fa-upload"> </i> Cập nhật file
        </b-btn>
      </slot>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .bounder {
    position: relative;
    display: inline-block;
  }
  .bounder:hover > .btn-disable-file {
    display: inline;
    z-index: 10000;
  }
  .file-deleted {
    opacity: 0.1;
  }
  .btn-disable-file {
    font-size: 15px;
    display: none;
    position: absolute;
    top: -5px;
    right: 9px;
  }
  .image-preview {
    border: 1px solid #ccc;
    margin-right: 0.5rem;
  }
  .dragdrop {
    position: relative;
    margin-bottom: 0 !important;
  }
  .custom-file-label {
    z-index: 0;
    padding: 0;
    border: none;
    height: fit-content;
  }
  .custom-file-label > :first-child {
    height: 100%;
  }
  .file-label-inner {
    border: 2px dashed #069255;
    text-align: center;
    color: #069255;
    padding: 0;
    border-radius: 0;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    width: 100%;
  }

  .dragdrop .custom-file:hover >>> .file-label-inner {
    background: #069255;
    color: #fff;
  }

  .custom-file-label::after {
    display: none;
  }

  .scrollbar-file {
    max-height: 75vh;
  }
  .h4 {
    font-size: 1rem;
  }
  .label-content {
    opacity: 0;
    transition: .3s all;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(25px);
    border-radius: 0.5rem;
  }

  .file-label-inner:hover > .label-content {
    opacity: 1;
  }
</style>
<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

import 'viewerjs/dist/viewer.css'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import profileService from 'domain/services/profile-service'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'file-view-upload',

  props: {
    files: {
      type: Array,
      default: () => ([])
    },
    fileAdd: {
      type: Array,
      default: () => ([])
    },
    fileDelete: {
      type: Array,
      default: () => ([])
    },
    edit: {
      type: Boolean,
      default: false
    },
    imagePreviewClass: {
      default: 'image-preview'
    },
    loading: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*, .pdf'
    },
    hideUploadButton: {
      type: Boolean,
      default: false
    },
    inputPlaceholder: {
      type: String,
      default: 'Thêm file'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    camera: {
      type: String,
      default: null
    },
    labelClass: {
      default: 'custom-file-label'
    },
    height: {
      default: '150px',
      type: String
    },
    inputCombine: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: 'add-file-box'
    },
    scrollbarOption: {
      type: Object,
      default: () => ({
        wheelSpeed: 0.2,
        wheelPropagation: true,
        suppressScrollX: true
      })
    },
    blurImage: {
      default: null
    },
    inputStyle: {
      default: null
    },
    allowDelete: {
      default: true
    },
    labelIndex: {
      default: 0
    },
    isThumbnail: {
      default: false
    },
    onlyDelete: {
      type: Boolean,
      default: false
    },
    fileDeleteId: {
      type: Array,
      default: () => ([])
    },
    isShowFileExist: {
      default: true
    }
  },

  components: {
    PerfectScrollbar
  },

  data: () => ({
    fileData: []
  }),

  computed: {
    isBlur () {
      return this.blurImage && this.fileAdd[0] && this.fileAdd[0].link
    },

    fileFormatted () {
      let fileFormatted = []
      for (const [idx, file] of this.files.entries()) {
        if (typeof file === 'string') {
          fileFormatted.push({
            name: 'File ' + (idx + 1),
            link: file,
            media_type: this.getMediaType(file),
            deleted: false
          })
        } else if (file && typeof file === 'object') {
          if (!file.name) file.name = 'File ' + (idx + 1)
          if (!file.link) file.link = '#'
          if (!file.media_type) file.media_type = this.getMediaType(file.link)
          file.deleted = false
          fileFormatted.push(file)
        } else {
          fileFormatted.push({
            name: 'File ' + (idx + 1),
            link: '#',
            media_type: 'other',
            deleted: false
          })
        }
      }

      return fileFormatted
    }
  },

  watch: {
    isBlur (newVal, oldVal) {
      let el = this.$el.querySelector('#custom-file-label > :first-child')
      if (el) {
        if (newVal) el.classList.add('is-blur-image')
        else el.classList.remove('is-blur-image')
      }
    },

    'fileAdd.0' (newVal, oldVal) {
      let el = this.$el.querySelector('#custom-file-label > :first-child')
      if (!el) return
      let styleLabel = null
      if (this.edit && this.inputCombine && newVal) {
        styleLabel = 'height: 100%; background-repeat: no-repeat; background-position: center; background-size: contain; background-color: transparent; background-image: url(' +
                  this.fileAdd[0].link +
                  ');'
      } else {
        styleLabel = 'height: 100%; line-height: ' + this.height
      }
      el.style = styleLabel
    }
  },

  methods: {
    addFile (e) {
      if (!this.fileAdd) this.fileAdd = []
      let files = e.target.files
      // chế dộ single file thì khi cancle sẽ xóa sạch file đã chọn
      if ((!files || files.length === 0) && !this.multiple) {
        this.revorkePreview(this.fileAdd)
        this.fileAdd.shift()
      }

      if (files.size) files = [files]
      let listExtAllow = this.accept.split(', ')
      for (const file of files) {
        let typeFile = file.type.split('/')
        let ext = file.name.split('.').pop()
        if (!typeFile || typeFile.lenght < 1) return
        // nếu thỏa mãn định dạng thì mới add
        if (listExtAllow.includes(file.type) || listExtAllow.includes(typeFile[0] + '/*') || listExtAllow.includes('.' + ext)) {
          if (!this.multiple) {
            // remove bỏ file cũ
            this.revorkePreview(this.fileAdd)
            this.fileAdd.length = 0
          }
          // lấy thông tin , link preview
          file.media_type = this.getMediaType(file.name)
          file.link = URL.createObjectURL(file)
          this.fileAdd.push(file)
        } else {
          helper.showMessage(`Định dạng file ${file.name}  không được hỗ trợ !`, 'warning')
        }
      }

      this.$emit('onChange', this.fileAdd)
      e.target.value = null
    },

    deleteFileUploaded (file) {
      file.deleted = !file.deleted
      if (file.deleted) {
        if (this.fileDelete) this.fileDelete.push(file.link)
        if (this.fileDeleteId) this.fileDeleteId.push(file.id)
      } else {
        if (!this.fileDelete && !this.fileDeleteId) return
        let index = this.fileDelete.indexOf(file.link)
        if (index >= 0) {
          this.fileDelete.splice(index, 1)
          this.fileDeleteId.splice(index, 1)
        }
      }
    },

    revorkePreview (files) {
      for (const file of files) {
        URL.revokeObjectURL(file.link)
      }
    },

    deleteFileAdded (idx) {
      this.revorkePreview([this.fileAdd[idx]])
      this.fileAdd.splice(idx, 1)
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    getMediaType (name) {
      let ext = ''
      ext = name.split('?').shift().split('.').pop().toLowerCase()

      if (['jpeg', 'png', 'gif', 'tiff', 'psd', 'jpg', 'eps', 'ai', 'indd', 'raw', 'bmp', 'svg'].includes(ext)) return 'image'// là ảnh
      if (['pdf'].includes(ext)) return 'pdf' // là pdf
      if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc' // là doc
      if (['xls', 'xlsx', 'xlsb'].includes(ext)) return 'excel' // là excel
      if (['txt', 'csv'].includes(ext)) return 'text' // là text
      if (['mpeg', 'mp4', 'avi', 'ts', 'webm', '3gp', '3g2'].includes(ext)) return 'video' // là video
      if (['mp3', 'aac', 'ogg', 'opus', 'wav'].includes(ext)) return 'audio' // là audio
      if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'zip' // là file nén
      return 'other'
    },

    uploadFile () {
      this.$emit('update-file')
    },

    getOriginImage (file) {
      let data = {
        urls: [file.link]
      }
      profileService.getOriginImage(data)
        .then(res => {
          if (res.data.success) {
            if (res.data.urls) file.link = res.data.urls[0] && res.data.urls[0].path
            else helper.showMessage('Không lấy được ảnh nét !', 'warning')
          } else helper.showMessage('Không lấy được ảnh nét !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Không lấy được ảnh nét !', 'warning')
        })
    }

  }
}
</script>
