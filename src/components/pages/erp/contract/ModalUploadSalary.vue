<template>
  <div>
    <b-modal hide-footer modal-class="modal-lg-custom" :title="title" :id="id" centered>
      <div class="text-danger mb-2">
        <i class="fas fa-exclamation-circle"></i>
        <b> Lưu ý các trường trong file excel phải theo thứ tự
        dưới đây để upload thông tin lương vào cơ sở dữ liệu chính xác và không nhầm trường !
        </b>
      </div>
      <div class="mb-2"><span class="link" @click="dowloadTemplateSalary"><i class="fas fa-download"></i><b> Dowload file template</b></span></div>
      <table class="table table-hover table-bordered font-weight-bold table-sm">
        <tr>
          <th>A</th>
          <th>B</th>
          <th>C</th>
          <th>D</th>
          <th>E</th>
          <th>F</th>
          <th>G</th>
          <th>H</th>
          <th>I</th>
          <th>J</th>
        </tr>
        <tr>
          <td>Số hợp đồng</td>
          <td>Lương thử việc</td>
          <td>Lương OT thử việc</td>
          <td>Lương cơ bản</td>
          <td>Lương OT cơ bản</td>
          <td>Phụ cấp trách nhiệm</td>
          <td>Phụ cấp di chuyển</td>
          <td>Phụ cấp ăn trưa</td>
          <td>Phụ cấp điện thoại</td>
          <td>Phụ cấp công tác</td>
        </tr>
      </table>
      <file-view-upload
        :multiple="false"
        :files="files"
        :file-add="fileAdd"
        :edit="!salaryFile"
        accept=".xlsx, .xls, .xml"
        @update-file="uploadFileSalary"
        upload-button-title="Upload file lương nhân viên"
      ></file-view-upload>
      <div class="text-center" v-show="salaryFile && salaryFile.status === 'open'">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
      </div>
      <div v-show="salaryFile && salaryFile.status === 'closed'" class="text-center">
        <b-alert show variant="success"><b>Đã upload file lương thành công, vui lòng kiểm tra file log để xem chi tiết</b></b-alert>
        <b-btn variant="primary" @click="openLink(salaryFile.file_log)"><i class="fas fa-download"></i> Tải file log</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
  .link {
    cursor: pointer;
    color: #1e70cd;
    &:hover {
      text-decoration: underline;
    }
  }
  tr th {
    text-align: center;
  }
</style>

<script>
// Api service
import staffService from 'domain/services/staff-service'
// custom components
import FileViewUpload from 'components/elements/common/FileViewUpload'

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-upload-salary',

  props: {
    title: {
      type: String,
      default: 'Upload file lương nhân viên'
    },
    id: {
      type: String,
      default: 'upload-salary-file'
    },
    uploadSalaryStatus: {
      type: String,
      default: null
    }
  },

  components: {
    FileViewUpload
  },

  data: () => ({
    fileAdd: [],
    files: [],
    salaryFile: null
  }),

  watch: {
  },

  methods: {
    dowloadTemplateSalary () {
      window.open(window.location.origin + '/Admin/files/templates/template_upload_salary.xlsx')
    },

    uploadFileSalary () {
      this.$startLoading()
      if (!this.fileAdd || this.fileAdd.length !== 1) {
        commonHelper.showMessage('Vui lòng chỉ chọn 1 file để upload !')
        return
      }

      let data = new FormData()
      data.append('salary_file', this.fileAdd[0])

      staffService.uploadFileSalary(data)
        .then(res => {
          if (res.data.success) {
            this.salaryFile = res.data.data
            this.files.push({name: this.salaryFile.name, link: this.salaryFile.file_upload})
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message || 'Không thể cập nhật file lương, vui lòng liên hệ với IT để được hộ trợ !', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Không thể cập nhật file, vui lòng liên hệ với IT để được hộ trợ !', 'warning')
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
          this.checkStatusUploadSalary()
          this.$emit('uploadSalaryStatus', 'open')
        })
    },

    checkStatusUploadSalary () {
      if (!this.salaryFile || !this.salaryFile.id) return
      var checkInterval = setInterval(
        staffService.checkStatusUploadSalary({salaryFileId: this.salaryFile.id})
          .then(res => {
            if (res.data.success && res.data.data.status === 'closed') {
              clearInterval(checkInterval)
              this.salaryFile = res.data.data
              this.$emit('uploadSalaryStatus', 'closed')
              commonHelper.showMessage('Đã upload file lương thành công, vui lòng check lại file log để xem chi tiết', 'success')
            }
          })
          .catch(e => {
            console.log(e)
          }),
        2000
      )
    },

    openLink (link) {
      window.open(link, '_blank')
    }
  }
}
</script>
