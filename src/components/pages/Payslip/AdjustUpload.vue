<template>
    <div class="payslip-manager-page">
        <div class="ui-block">
            <h4 class="text-center">
                <div class="text-center">Upload thưởng phạt cho: <b style="color: green;">{{typeOfEmployee[indexTypeEmp]}}</b>
                  <b-btn size="sm" variant="outline-danger btn-round icon-btn borderless" @click="changTypeEmpUpload"><i class="ion ion-md-refresh"></i></b-btn>
                </div>
            </h4>
            <div>
                <b-btn variant="success">
                    <i class="ion ion-md-arrow-down" aria-hidden="true"></i> <a :href="'/admin/files/deductions/Template_deduction.xlsx'" target="_blank"> File mẫu</a>
                </b-btn>
                <b-btn v-b-toggle.collapse1 variant="danger">Quy ước File upload</b-btn>
                <b-collapse id="collapse1" class="mt-2">
                    <b-card>
                        <p class="card-text">
                            - Cho phép upload file excel <br />
                            - Bắt buộc có thông tin tên đăng nhập phải chính xác <br />
                            - Khoản trừ ghi rõ dấu - phía trước <br />
                            - Số tiền theo định dạng: 1000000 (không có . hoặc , hoặc khoảng trắng) <br />
                            - Nhân viên có thể có nhiều khoản thưởng phạt. mỗi khoản sẽ tương ứng với một dòng dữ liệu <br />
                            - Mỗi lần xử lý dữ liệu các khoản thưởng ,phạt... sẽ được thêm vào => tránh upload một file nhiều lần sẽ dẫn đến trùng lặp <br />
                            - Các trường hợp lỗi nên chỉnh sửa và upload bằng file excel khác<br />
                        </p>
                    </b-card>
                </b-collapse>
            </div>
            <div id="upload-deductions">
                <form method="post">
                    <b-form-row>
                        <file-upload class="sr-only"
                                     :name="name"
                                     :post-action="postAction[indexTypeEmp]"
                                     :extensions="extensions"
                                     :accept="accept"
                                     :multiple="multiple"
                                     :directory="directory"
                                     :size="size || 0"
                                     :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
                                     :drop="drop"
                                     :add-index="addIndex"
                                     v-model="files"
                                     :data="{time_update: timeUpdate}"
                                     @input-filter="inputFilter"
                                     @input-file="inputFile"
                                     ref="upload"/>

                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>File name</th>
                                    <th>Size</th>
                                    <th>Speed</th>
                                    <th>Upload file</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-if="!files.length">
                                    <td colspan="7">
                                        <div class="text-center p-5">
                                            <h4>Kéo thả file để upload
                                                <div class="text-muted small my-3">hoặc</div>
                                            </h4>
                                            <label :for="name" class="btn btn-primary btn-lg">Chọn file</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="(file, index) in files" :key="file.id">
                                    <td>{{index}}</td>
                                    <td>
                                        <div class="filename">
                                            {{file.name}}
                                        </div>
                                        <b-progress :value="Number(file.progress)" :variant="file.error ? 'danger' : ''"
                                                    :animated="file.active"
                                                    v-if="file.active || file.progress !== '0.00'" height="6px"
                                                    style="margin: 4px 0 0 0"/>
                                    </td>
                                    <td>{{ file.size/1024/1024 | fileSize }} MB</td>
                                    <td>{{file.speed}}</td>

                                    <td v-if="file.error">{{file.error}}</td>
                                    <td v-else-if="file.success">success</td>
                                    <td v-else-if="file.active">active</td>
                                    <td v-else></td>
                                    <td>
                                        <b-dd text="Action" size="sm" :right="!isRTL">
                                            <b-dd-item :disabled="!file.active"
                                                       @click="file.active ? $refs.upload.update(file, {error: 'cancel'}) : false">
                                                Cancel
                                            </b-dd-item>

                                            <b-dd-item v-if="file.active"
                                                       @click="$refs.upload.update(file, {active: false})">Abort
                                            </b-dd-item>
                                            <b-dd-item v-else-if="file.error && $refs.upload.features.html5"
                                                       @click="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">
                                                Retry upload
                                            </b-dd-item>
                                            <b-dd-item v-else :disabled="file.success"
                                                       @click="file.success ? false : $refs.upload.update(file, {active: true})">
                                                Upload
                                            </b-dd-item>

                                            <b-dd-divider/>

                                            <b-dd-item @click="$refs.upload.remove(file)">Remove</b-dd-item>
                                        </b-dd>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <b-dd split :right="isRTL" @click="$refs.upload.$el.querySelector('input').click()">
                            <template slot="button-content">
                                <i class="ion ion-md-add"></i> Chọn file khác
                            </template>
                        </b-dd>
                        <vue-monthly-picker placeHolder="Thời gian áp dụng" @selected="selectMonthUpdate"
                                            v-model="timeUpdate">
                        </vue-monthly-picker>
                        <b-btn v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true"
                               variant="success">
                            <i class="ion ion-md-arrow-up" aria-hidden="true"></i> Xử lý file
                        </b-btn>
                        <b-btn v-else @click="$refs.upload.active = false" variant="danger">
                            <i class="ion ion-md-close" aria-hidden="true"></i> Hủy
                        </b-btn>
                    </b-form-row>
                </form>
            </div>
            <h3 class="text-center" >Kết quả xử lý file upload</h3>
            <div class="result-upload">
            <table class="table table-result">
                <thead class="header-result">
                <tr>
                    <th> STT</th>
                    <th> Tên đăng nhập</th>
                    <th> Họ tên</th>
                    <th> Cập nhật Thưởng/ phạt</th>
                    <th> Thông tin chi tiết</th>
                </tr>
                </thead>
                <tr v-for="(resultUpload , index) in resultUploads">
                    <td>{{index + 1}}</td>
                    <td>{{resultUpload.username}}</td>
                    <td>{{resultUpload.fullname}}</td>
                    <td v-if="resultUpload.status=='success'" class="text-success">{{resultUpload.status}}</td>
                    <td v-else class="text-danger">flase</td>
                    <td>
                        <span v-if="resultUpload.message"> {{resultUpload.message}} </span>
                        <a v-else-if="resultUpload.id" :href="detailRoot[indexTypeEmp]+resultUpload.id" target="_blank">Chi tiết</a>
                        <span v-else class="text-danger"> Không tìm thấy NV </span>
                    </td>
                </tr>
            </table>
        </div>
        </div>
    </div>
</template>
<script>
import config from 'config/app.base'
import vue2Dropzone from 'vue2-dropzone'
import VueMonthlyPicker from 'vue-monthly-picker'
import Vue from 'vue'
import VueUploadComponent from 'vue-upload-component'
Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'ecom-deduction-upload',
  metaInfo: {
    title: 'Deductions upload - Forms'
  },
  components: {
    vueDropzone: vue2Dropzone,
    FileUpload: VueUploadComponent,
    VueMonthlyPicker: VueMonthlyPicker
  },

  data: () => ({
    dropzoneOptions: {
      url: '/upload',
      maxFilesize: 50000,
      filesizeBase: 1000,
      addRemoveLinks: true
    },
    timeUpdate: '',
    //
    // Vue Upload Component
    //
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
    detailRoot: [
      'detail/',
      '../partnership-payslip/detail/'
    ],
    postAction: [
      config.baseApiUrl + 'AdPayslip/uploadExcelPayslip',
      config.baseApiUrl + 'AdPartnershipPayslip/uploadExcelPayslip'
    ],
    success: false,
    indexTypeEmp: 0,
    typeOfEmployee: [
      'Bảng lương nhân viên',
      'Bảng lương hợp tác kinh doanh'
    ]
  }),
  methods: {
    //
    // Vue Upload Component
    //

    inputFilter (newFile, oldFile, prevent) {
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
          this.resultUploads = JSON.parse(newFile.response)
        }
      }
    },

    changTypeEmpUpload () {
      this.indexTypeEmp === 0 ? this.indexTypeEmp = 1 : this.indexTypeEmp = 0
      this.files = []
      this.resultUploads = {}
    },

    selectMonthUpdate () {
      this.files = []
      this.resultUploads = {}
    }
  }
}
</script>
<style scoped>
    .table-responsive{
        min-height: 200px;
    }
    .result-upload{
        max-height: 300px;
        overflow: auto;
        background: rgba(159, 126, 188, 0.12);
    }
    .header-result {
        background: rgba(7, 14, 43, 0.42);
    }
    #__BVID__20__BV_toggle_{
        display: none;
    }
</style>
