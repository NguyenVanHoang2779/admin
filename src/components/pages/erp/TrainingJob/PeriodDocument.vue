<template>
    <div>
        <b-row>
            <template v-for="(file, idx) in files">
                <div class="col-4 mb-3" :key="file.name + 'file-add' + idx">
                    <div class="d-flex justify-content-center mb-2">
                        <img
                                v-if="helper.getFileType(file) === 'image'"
                                :src="getUrl(file)" :alt="file.name" class="mw-100" :style="{ height: '250px', width: '100%' }"
                        />
                        <video
                                v-else-if="helper.getFileType(file) === 'video'"
                                class="mw-100" :style="{ height: '250px', width: '100%'}"
                                controls>
                            <source :src="getUrl(file)" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <iframe
                                v-else-if="helper.getFileType(file) === 'pdf'"
                                :src="getUrl(file)" frameborder="0" class="mw-100"
                                :style="{ height: '250px', width: '100%' }"
                        ></iframe>
                        <img
                                v-else-if="helper.getFileType(file) === 'doc'"
                                src="https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250"
                                class="mw-100"
                                :style="{ height: '250px', width: '100%' }"
                        />
                    </div>
                    <div class="d-flex flex-column">
          <span class="text-black"><b>Người tạo:</b> {{
              helper.isEmpty(file_creators[idx]) ? '' : (file_creators[idx].fullName + ' (' + file_creators[idx].username + ')')
            }}</span>
                        <span class="text-black"><b>Vị trí:</b> {{ helper.isEmpty(file_creators[idx]) ? '' : file_creators[idx].positionName }}</span>
                        <span class="text-black"><b>Thời gian tạo:</b> {{ helper.isEmpty(file_creators[idx]) ? '' : file_creators[idx].created }}</span>
                    </div>
                    <div class="d-flex mt-2" :class="(type === 'edit' || type === 'add') ? ((canDeleteOrigin || idx >= originCount) ? 'justify-content-between' : 'justify-content-center') : 'justify-content-center'">
                        <button
                                class="btn btn-md btn-outline-ghtk rounded"
                                @click="openLink(getUrl(file))"
                                style="width: 48%"
                        >Xem
                        </button>
                        <button
                                class="btn btn-md btn-outline-danger rounded"
                                @click="$emit('action', {action: 'delete-file', data: {idx: idx}})"
                                style="width: 48%"
                                v-if="(type === 'edit' || type === 'add')  ? (canDeleteOrigin ? true : idx >= originCount) : false"
                        >Xóa
                        </button>
                    </div>
                </div>
            </template>
        </b-row>
    </div>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'
import Viewer from 'v-viewer'
import pdf from 'vue-pdf'
export default {
  name: 'period-document',
  components: {
    Viewer,
    pdf
  },
  data: _ => ({
    tmpFile: null
  }),
  props: {
    accept: {
      type: String,
      default: 'image/*, .pdf, .doc, .docx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, video/*'
    },
    files: {
      default: []
    },
    file_creators: {
      default: []
    },
    type: {
      type: String,
      default: 'edit'
    },
    canDeleteOrigin: {
      type: Boolean,
      default: true
    },
    originCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    helper () {
      return helper
    }
  },
  watch: {
  },
  methods: {
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
    .custom-label {
        margin-bottom: 0 !important;
        margin-top: 0.5rem;
    }
</style>
