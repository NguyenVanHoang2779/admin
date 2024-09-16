<template>
  <div>
    <div class="upload-train-price">
      <file-upload
        class="sr-only"
        :name="nameFileConfig"
        :post-action="postActionAddConfigBag"
        :extensions="extensions"
        :accept="accept"
        :multiple="multiple"
        :directory="directory"
        :size="size || 0"
        :thread="thread < 1 ? 1 : thread > 5 ? 5 : thread"
        :drop="drop"
        :add-index="addIndex"
        v-model="fileConfigBag"
        @input-filter="inputFilter"
        @input-file="inputFilePrice"
        ref="uploadConfigBag"
      />
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
        <tr>
          <th>#</th>
          <th>Tên file</th>
          <th>Kích thước</th>
          <th>Tốc độ</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="!fileConfigBag.length">
          <td colspan="12">
            <div class="text-center p-5">
              <h4>
                Kéo thả file để upload
                <div class="text-muted small my-3">hoặc</div>
              </h4>
              <label :for="nameFileConfig" class="btn btn-primary btn-lg"
              >Chọn file</label
              >
            </div>
          </td>
        </tr>
        <tr v-for="(file, index) in fileConfigBag" :key="file.id">
          <td>{{ index }}</td>
          <td>
            <div class="filename">{{ file.name }}</div>
            <b-progress
              :value="Number(file.progress)"
              :variant="file.error ? 'danger' : ''"
              :animated="file.active"
              v-if="file.active || file.progress !== '0.00'"
              height="6px"
              style="margin: 4px 0 0 0"
            />
          </td>
          <td>{{ (file.size / 1024 / 1024) | fileSize }} MB</td>
          <td v-if="file.error">{{ file.error }}</td>
          <td v-else-if="file.success">success</td>
          <td v-else-if="file.active">active</td>
          <td v-else></td>
        </tr>
        </tbody>
      </table>
    </div>
    <b-dd
      split
      :right="isRTL"
      @click="$refs.uploadConfigBag.$el.querySelector('input').click()"
      class="d-inline-flex"
    >
      <template slot="button-content">
        <i class="ion ion-md-add"></i> Chọn file upload
      </template>
    </b-dd>
    <b-btn
      v-if="!$refs.uploadConfigBag || !$refs.uploadConfigBag.active"
      @click="$refs.uploadConfigBag.active = true"
      variant="success"
    >
      <i class="ion ion-md-arrow-up" aria-hidden="true"></i> Xử lý file
    </b-btn>
    <b-btn
      v-else
      @click="$refs.uploadConfigBag.active = false"
      variant="danger"
    >
      <i class="ion ion-md-close" aria-hidden="true"></i> Hủy
    </b-btn>
    <ul v-if="error" class="mt-4">
      <li v-for="er in error" class="text-left" style="color: red">{{er}}</li>
    </ul>
    <ul v-if="success" class="mt-4">
      <li class="text-left" style="color: green">{{success}}</li>
    </ul>
  </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import 'vueperslides/dist/vueperslides.css'
import config from 'config/app.base'
import VueUploadComponent from 'vue-upload-component'
import Vue from 'vue'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})

export default {
  name: 'UploadConfigTemplate',
  components: {
    FileUpload: VueUploadComponent
  },
  data: () => ({
    files: [],
    fileConfigBag: [],
    name: 'file',
    nameFileConfig: 'upload_file',
    accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: 'xls,xlsx',
    minSize: 1024,
    size: 1024 * 1024 * 10,
    multiple: false,
    directory: false,
    drop: true,
    addIndex: false,
    thread: 3,
    indexTypeEmp: 0,
    postActionAddConfigBag:
      config.baseApiUrl + 'AdBags/uploadConfigBagTemplate',
    notifyInsert: '',
    error: [],
    success: ''
  }),
  methods: {
    showUploadConfigBag () {
      this.fileConfigBag = []
      this.error = []
      this.success = ''
      this.$refs.modalShowUploadConfig.open()
    },
    inputFilter (newFile, oldFile, prevent) {
      this.isPrepareUpload = true
      this.packagesInProgress = this.countPackages = 0
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },

    inputFilePrice (newFile, oldFile) {
      this.success = ''
      this.error = []
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.uploadConfigBag.update(newFile, { error: 'size' })
          }
        }
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          // Get response data
          let response = newFile.response
          if (JSON.parse(response).success === true) {
            this.success = JSON.parse(response).message
          } else {
            if (JSON.parse(response).data && JSON.parse(response).data.length > 0) {
              this.error = JSON.parse(response).data
            }
            if (JSON.parse(response).message && JSON.parse(response).message !== '') {
              this.error.push(JSON.parse(response).message)
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
