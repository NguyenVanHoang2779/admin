<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Upload vùng tính lương cho đơn hàng
    </h4>
    <b-card>
      <a :href="urlTemplate"><strong>&emsp;<u>Download template</u></strong></a>
      <file-upload class="sr-only"
                   :name="name"
                   :post-action="postAction"
                   :extensions="extensions"
                   :accept="accept"
                   :multiple="multiple"
                   :directory="directory"
                   :size="size || 0"
                   :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
                   :drop="drop"
                   :add-index="addIndex"
                   v-model="files"
                   @input-filter="inputFilter"
                   @input-file="inputFile"
                   ref="upload" />
      <img v-if="packagesInProgress !== 0 && packagesInProgress === countPackages" style="position: absolute; margin-left: 30%" src="https://data.whicdn.com/images/187132170/original.gif" alt="Italian Trulli">
      <div class="table-responsive">
        <table class="table">
          <thead>
          <tr>
            <th>Tên</th>
            <th>Kích thước</th>
            <th>Tốc độ</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!files.length">
            <td colspan="7">
              <div class="text-center p-5">
                <h4>Drop files anywhere to upload <div class="text-muted small my-3">or</div></h4>
                <label :for="name" class="btn btn-primary btn-lg">Select Files</label>
              </div>
            </td>
          </tr>
          <tr v-for="(file) in files" :key="file.id">
            <td>
              <div class="filename">
                {{file.name}}
              </div>
              <b-progress :value="Number(file.progress)" :variant="file.error ? 'danger' : ''" :animated="file.active" v-if="file.active || file.progress !== '0.00'" height="6px" style="margin: 4px 0 0 0" />
            </td>
            <td>{{ file.size/1024/1024 | fileSize }} MB</td>
            <td>{{file.speed}}</td>

            <td v-if="file.error">{{file.error}}</td>
            <td v-else-if="file.success">success</td>
            <td v-else-if="file.active">active</td>
            <td v-else></td>
            <td>
              <b-dd text="Action" size="sm" :right="!isRTL">
                <b-dd-item @click="$refs.upload.remove(file)">Remove</b-dd-item>
              </b-dd>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="form-row">
        <div>
          <b-btn class v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true" variant="success">
            <i class="ion ion-md-arrow-up" aria-hidden="true"></i> Start Upload
          </b-btn>
          <b-btn v-else @click="$refs.upload.active = false" variant="danger">
            <i class="ion ion-md-close" aria-hidden="true"></i> Stop Upload
          </b-btn>
        </div>
        <div class="col-md-8" v-if="packagesInProgress !== 0">
          <div>
            <b-progress variant="success" style="margin: 1.5% 0 0 2%" :value="packagesInProgress" :max="countPackages" :label="100000" height="0.5rem" animated></b-progress>
          </div>
          <div style="text-align: center; font-size: 12px">
            <p><span style="color: blue">{{packagesInProgress}}</span>/<b>{{countPackages}} packages</b></p>
          </div>
        </div>
      </div>
    </b-card>
    <b-card v-if="listErrorOrders.length !== 0">
      <strong>Danh sách đơn hàng <span style="color: red"><u>không tồn tại</u></span> hoặc <span style="color: red"><u>không lưu được</u></span>:</strong>
      <div  style="font-family: Verdana; margin-left: 2%">
        <div v-for="(item, index) in listErrorOrders">
          <b>{{index+1}}.</b> <i>{{item}}</i>
        </div>
      </div>
    </b-card>
    <notifications group="notifications-default" />
  </div>
</template>

<style src="@/vendor/libs/vue-dropzone/vue-dropzone.scss" lang="scss"></style>

<script>
import config from 'config/app.base'
import vue2Dropzone from 'vue2-dropzone'
import Vue from 'vue'
import VueUploadComponent from 'vue-upload-component'
import salaryService from 'domain/services/salary-service'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})

export default {
  name: 'upload-area-excel',
  metaInfo: {
    title: 'Update Area'
  },
  components: {
    salaryService,
    vueDropzone: vue2Dropzone,
    FileUpload: VueUploadComponent
  },
  data: () => ({
    //
    // Dropzone
    //

    dropzoneOptions: {
      url: '/upload',
      parallelUploads: 2,
      maxFilesize: 50000,
      filesizeBase: 1000,
      addRemoveLinks: true,
      dictDefaultMessage: `
Drop files here or click to upload<br>
    `
    },

    //
    // Vue Upload Component
    //
    urlTemplate: config.baseApiUrl + 'files/templates/template_upload_excel_update_area_pkgs.xlsx',
    packagesInProgress: 0,
    countPackages: 0,
    isPrepareUpload: true,
    listErrorOrders: [],
    continueUpdate: true,
    resultUploads: {},
    files: [],
    name: 'file',
    accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: 'xls,xlsx',
    minSize: 1024,
    size: 1024 * 1024 * 10,
    multiple: false,
    directory: false,
    drop: true,
    addIndex: false,
    thread: 3,
    postAction: config.baseApiErpUrl + 'salaryCods/uploadExcelUpdateArea',
    success: false
  }),

  // ***************************************************************************
  // Dropzone:: Mock the file upload progress (only for the demo)
  //
  methods: {
    updateDataAreaPackages () {
      this.isPrepareUpload = true
      salaryService.updateDataAreaPackages().then((response) => {
        if (response.data.success) {
          this.packagesInProgress += response.data.count
          this.listErrorOrders = this.listErrorOrders.concat(response.data.error_data)
          if (this.packagesInProgress === this.countPackages) {
            this.continueUpdate = false
          }
          this.$notify({
            group: 'notifications-default',
            type: 'bg-success text-white',
            title: 'Thành công',
            text: `Đã update vùng thành công cho ${this.packagesInProgress} đơn hàng!`
          })
        } else {
          this.continueUpdate = false
          this.listErrorOrders = this.listErrorOrders.concat(response.data.error_data)
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: response.data.message
          })
        }
      }).catch((error) => {
        this.appLoading = false
        if (error) {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra. Vui lòng kiểm tra lại'
          })
        }
      }).then(() => {
        if (!this.continueUpdate) return 0
        this.updateDataAreaPackages()
      })
    },
    //
    // Vue Upload Component
    //

    inputFilter (newFile, oldFile, prevent) {
      this.isPrepareUpload = true
      this.packagesInProgress = this.countPackages = 0
      this.listErrorOrders = []
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
    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          // Get response data
          let response = JSON.parse(newFile.response)
          this.$notify({
            group: 'notifications-default',
            type: response.success ? '' : 'bg-danger text-white',
            title: response.success ? 'Thành công' : 'Lỗi',
            text: response.message
          })
          if (response.success === true) {
            this.isPrepareUpload = false
            this.countPackages = response.count
          }
        }
      }
    }
  }
}
</script>
