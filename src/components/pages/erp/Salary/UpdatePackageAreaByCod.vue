<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Upload vùng tính lương cho F-Team
    </h4>
    <b-card>
        <label class="form-label">Chọn tháng lương</label>
        <vue-monthly-picker @selected="selectMonthUpdate" class="col col-md-3" v-model="monthSalary"></vue-monthly-picker>
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
                <b-dd-item @click="$refs.upload.remove(file); resultUploads = []">Remove</b-dd-item>
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
          <b-btn variant="outline-primary" :disabled="isPrepareUpload" @click="startUpdateData">
            <i class="ion ion-md-sync" aria-hidden="true"></i> Update Data
          </b-btn>
        </div>
      </div>
    </b-card>
    <br>
    <b-card v-if="this.resultUploads.length !== 0" border-variant="primary">
      <h4 style="color: blue"><u>Kết quả xử lý</u></h4>
            <div id="result-upload">
            <table class="table table-striped table-result" style="text-align: center">
                <thead class="header-result">
                <tr>
                    <th> STT</th>
                    <th> COD Alias</th>
                    <th> Vùng</th>
                    <th> Số lượng đơn hàng</th>
                    <th> Trạng thái</th>
                </tr>
                </thead>
                <tr v-for="(resultUpload , index) in resultUploads">
                    <td>{{index + 1}}</td>
                    <td>{{resultUpload.cod_alias}}</td>
                    <td>{{resultUpload.area}}</td>
                    <td v-if="typeof resultUpload.count === 'undefined'" style="color: blue">Chờ cập nhật</td>
                    <td v-else-if="resultUpload.count === 'loading'" ><img :src="baseUrl + '/static/img/loading_ball.gif'" width="45.7" height="20"></td>
                    <td :class="resultUpload.status === 'Not found' ? 'text-danger' : 'text-info' " v-else >{{resultUpload.count}}</td>
                    <td v-if="typeof resultUpload.status === 'undefined'" style="color: blue">Chờ cập nhật</td>
                    <td v-else-if="resultUpload.status === 'loading'" ><img :src="baseUrl + '/static/img/loading_ball.gif'"  width="45.7" height="20"></td>
                    <td :class="resultUpload.status === 'Thành công' ? 'text-success' : 'text-danger' " v-else>{{resultUpload.status}}</td>
                </tr>
            </table>
        </div>
    </b-card>
    <notifications group="notifications-default" />
  </div>
</template>

<style src="@/vendor/libs/vue-dropzone/vue-dropzone.scss" lang="scss"></style>
<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>

<script>
import config from 'config/app.base'
import vue2Dropzone from 'vue2-dropzone'
import Vue from 'vue'
import VueUploadComponent from 'vue-upload-component'
import salaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})

export default {
  name: 'upload-area-fteam',
  metaInfo: {
    title: 'Update Area Fteam'
  },
  components: {
    VueMonthlyPicker,
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
    monthSalary: '',
    packagesInProgress: 0,
    countPackages: 0,
    isPrepareUpload: true,
    resultUploads: [],
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
    postAction: config.baseApiUrl + 'AdPackageSalary/uploadExcelUpdateAreaByCod',
    success: false
  }),

  // ***************************************************************************
  // Dropzone:: Mock the file upload progress (only for the demo)
  //
  methods: {
    startUpdateData () {
      console.log(new Date())
      this.isPrepareUpload = true
      if (this.resultUploads === '' || this.monthSalary === '') return
      let monthAndYear = this.monthSalary._i.toString().split('/')
      let dataArr = this.resultUploads
      this.updateDataAreaByCod(dataArr, monthAndYear[1], monthAndYear[0], 0)
    },
    selectMonthUpdate () {
      if (this.resultUploads.length !== 0) {
        this.isPrepareUpload = false
      }
    },
    updateDataAreaByCod (dataArr, month, year, index) {
      let divResult = document.getElementById('result-upload')
      divResult.scrollTop = 42 * index
      this.$set(this.resultUploads[index], 'count', 'loading')
      this.$set(this.resultUploads[index], 'status', 'loading')
      salaryService.updateDataAreaByCod(
        {
          cod_alias: dataArr[index].cod_alias,
          area: dataArr[index].area,
          month: month,
          year: year
        }
      ).then((response) => {
        console.log(this.resultUploads)
        if (response.data.success) {
          this.$set(this.resultUploads[index], 'count', response.data.count)
          this.$set(this.resultUploads[index], 'status', 'Thành công')
          this.$notify({
            group: 'notifications-default',
            type: 'bg-success text-white',
            title: 'Thành công',
            text: `Đã update vùng thành công cho COD ${dataArr[0].cod_alias}!`
          })
        } else {
          this.resultUploads[index].count = 'Not found'
          this.resultUploads[index].status = response.data.message
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
        if ((index + 1) >= (this.resultUploads.length)) return
        this.updateDataAreaByCod(dataArr, month, year, index + 1)
      })
    },
    //
    // Vue Upload Component
    //

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
            this.resultUploads = response.data
            if (this.monthSalary !== '') {
              this.isPrepareUpload = false
            }
          }
        }
      }
    }
  }
}
</script>
<style>
    #result-upload{
        max-height: 300px;
        overflow: auto;
        /*background: rgba(159, 126, 188, 0.12);*/
    }
</style>
