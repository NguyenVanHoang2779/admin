<template>
    <div>
        <div class="d-flex">
            <b class="text-title">Tài liệu buổi</b>
            <b-form-select v-model="orderPeriod" :options="options" size="sm" class="btn-select-period"></b-form-select>
        </div>
        <div class="profile-document">
            <template v-for="(link, idx) in fileClass">
                <div :key="link + idx + 'fileClass'" class="profile-document__element">
                    <i class="icon ion-md-close-circle cursor-pointer delete-icon-document"
                       @click="$emit('action', {action: 'delete-file', data: {idx: idx}}, orderPeriod)"
                    ></i>
                    <template>
                        <span>
                            <img
                                v-if="['pdf', 'video', 'image', 'doc'].includes(helper.getFileType(link))"
                                :class="idx"
                                class="image-document"
                                :src="previewImageRender(link)"
                                :alt="'Tài liệu buổi '+ idx"
                            />
                        </span>
                    </template>
                </div>
            </template>
        </div>
        <input
            type="file"
            class="custom-file-input d-none"
            :multiple="false"
            :accept="accept"
            @change="$emit('action', {action: 'new-file', data: {file: tmpFile}}, orderPeriod)"
            @input="addFile"
            :id="idInput"
            :name="'input_'"
        />
        <div class="m-0 d-flex justify-content-center mt-3">
            <label class="custom-label" :for="idInput">
                <slot name="label">
                    <div class="rounded cursor-pointer btn-ghtk px-4 py-1">+ Thêm tài liệu</div>
                </slot>
            </label>
            <label class="custom-label">
                <slot name="label">
                    <div class="rounded cursor-pointer btn-ghtk px-4 py-1 ml-3" @click="$emit('action', {action: 'close'})">Hoàn thành</div>
                </slot>
            </label>
        </div>
    </div>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'
import Viewer from 'v-viewer'
import pdf from 'vue-pdf'
export default {
  name: 'edit-document',

  components: {
    Viewer,
    pdf
  },

  data: _ => ({
    tmpFile: null,
    orderPeriod: 1,
    options: []
  }),

  props: {
    accept: {
      type: String,
      default: 'image/*, .pdf, .doc, .docx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, video/*'
    },
    fileClass: {
      default () {
        return []
      }
    },
    numPeriod: {
      default: null
    },

    periods: {
      default () {
        return []
      }
    }
  },

  computed: {
    helper () {
      return helper
    },

    idInput () {
      return 'input-file-' + Math.random()
    }
  },

  watch: {
    orderPeriod: {
      immediate: true,
      handler: function (newValue, oldValue) {
        if (this.numPeriod < parseInt(newValue)) {
          helper.showMessage('Buổi học vượt quá cho phép!', 'warning')
          return
        }
        this.$emit('changeFile', newValue)
      }
    },

    periods: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.options = newValue.map(function (element) {
          return {value: element.order_number, text: `Tài liệu buổi ${element.order_number}`}
        })
      }
    }
  },
  methods: {
    previewImageRender (file) {
      if (helper.isEmpty(file)) return ''
      let fileType = helper.getFileType(file)
      if (fileType === 'doc') return 'https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250'
      if (typeof file === 'object') {
        if (fileType === 'pdf') return 'https://gs.giaohangtietkiem.vn/d/d7d5ef9e764e4227b7aef2c11dfd1371.pngheight=250'
        if (fileType === 'video') return 'https://ghtk.me/images/icon-file-video.png?height=250'
        if (fileType === 'image') return URL.createObjectURL(file)
      } else {
        // là file đã được uplaod lên server
        if (['pdf', 'video'].includes(fileType)) return file + '?extract=thumb'
      }

      return file
    },
    showPreview (idx) {
      if (this.type === 'edit') {
        if (helper.isEmpty(this.file_creators[idx])) return false
      }
      return true
    },
    getUrl (file) {
      if (helper.isEmpty(file)) return null
      if (typeof file === 'string') return file
      return URL.createObjectURL(file)
    },
    openLink (link) {
      window.open(link, '_blank')
    },
    addFile (e) {
      if (!this.tmpFile) this.tmpFile = {}
      let file = e.target.files || e.dataTransfer.files
      if (file.size) file = [file]
      let listExtAllow = this.accept.split(', ')
      for (const f of file) {
        let typeFile = f.type.split('/')
        let ext = f.name.split('.').pop()
        if (!typeFile || typeFile.leght < 1) return
        if (listExtAllow.includes(f.type) || listExtAllow.includes(typeFile[0] + '/*') || listExtAllow.includes('.' + ext)) {
          this.tmpFile = f
        } else {
          helper.showMessage(`Định dạng file ${f.name}  không được hỗ trợ !`, 'warning')
        }
      }
      e.target.value = null
    }
  }
}
</script>
<style scoped>
    .delete-icon-document {
        position: absolute;
        right: -2px;
        top: -10px;
        z-index: 99999;
        font-size: 14px;
        color: rgba(130, 130, 130, 1);
    }
    .custom-label {
        margin-bottom: 0 !important;
        margin-top: 0.5rem;
    }
    .text-title {
        width: 25%;
        display: flex;
        align-items: center;
        padding-left: 5px;
    }
    .btn-select-period {
        border-radius: 20px;
        height: 2rem;
        line-height: 1.25;
        font-size: 14px;
    }
    .profile-document {
        /*height: 100%;*/
        white-space: normal;
        padding: 20px 10px 0 0;
    }
    .profile-document__element {
        width: 33%;
        position: relative;
        height: 235px;
        display: inline-block;
        margin-top: 10px;
    }
    .profile-document .profile-document__element {
        padding: 0 5px;
    }
    .image-document {
        width: 100%;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }
</style>
