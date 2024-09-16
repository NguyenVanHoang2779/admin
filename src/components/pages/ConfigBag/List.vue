<template>
  <div>
    <div class="ui-block">
      <div>
        <div class="position-relative">
          <h3 class="ui-block-heading">Config Bao Tổng</h3>
          <b-btn variant="success" @click="showUploadConfigBag" class="position-absolute" style="right: 0;bottom: 0">Thêm Config</b-btn>
          <b-btn variant="success" v-if="getUserName" @click="$refs.modalShowUploadTemplate.open()" class="position-absolute" style="right: 130px;bottom: 0">Upload file mẫu</b-btn>
        </div>
        <sweet-modal ref="modalShowUploadTemplate">
          <UploadConfigTemplate></UploadConfigTemplate>
        </sweet-modal>
        <sweet-modal ref="modalShowUploadConfig">
          <div class="float-left mb-4">
            <b-btn variant="success">
              <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
              <a
                :href="linkFileConfig"
                class="text-white"
                target="_blank"
              >File mẫu</a
              >
            </b-btn>
            <b-btn v-b-toggle.collapse2 variant="danger"
            >Quy ước File upload</b-btn
            >
            <b-collapse id="collapse2" class="mt-2 text-left border-left-0">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">- Chỉ cho phép upload file excel.</li>
                <li class="list-group-item">- Yêu cầu điền đúng thông tin theo mẫu</li>
              </ul>
            </b-collapse>
          </div>
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
        </sweet-modal>
      </div>
      <div>
        <SearchBags></SearchBags>
      </div>
    </div>
  </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import 'vueperslides/dist/vueperslides.css'
import UploadConfigTemplate from 'components/pages/ConfigBag/UploadConfigTemplate'
import SearchBags from 'components/pages/ConfigBag/Search'
import config from 'config/app.base'
import VueUploadComponent from 'vue-upload-component'
import { SweetModal } from 'sweet-modal-vue'
import Vue from 'vue'
import configUploadFileExcel from './../../../domain/services/config-upload-file-excel'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})

export default {
  name: 'configBag',
  components: {
    FileUpload: VueUploadComponent,
    SweetModal,
    UploadConfigTemplate,
    SearchBags,
    configUploadFileExcel
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
      config.baseApiUrl + 'AdBags/uploadBagConfig',
    notifyInsert: '',
    error: [],
    success: '',
    linkFileConfig: '/admin/files/templates/config_bag_template.xlsx'
  }),
  computed: {
    getUserName () {
      let username = ''
      const allowUpload = ['quynhbn2', 'hienvtt', 'phuongbh8']
      username = this.$store.state.userInfo.User ? this.$store.state.userInfo.User.username : ''
      if (allowUpload.includes(username)) {
        return true
      }

      return false
    }
  },
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
    },
    getFileConfigExcel () {
      configUploadFileExcel.getFileConfigExcel().then(res => {
        if (res.data.success && res.data.data && res.data.data.file_path) {
          this.linkFileConfig = res.data.data.file_path
        }
      }).catch(() => {
        this.$notify({
          group: 'default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra'
        })
      })
    }
  },
  created () {
    this.getFileConfigExcel()
  }
}
</script>

<style scoped>
</style>
