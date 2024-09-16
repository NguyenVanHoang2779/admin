<template>
  <b-modal :id="id" static center modal-class="modal-xl" title="Upload thông tin BHXH từ file Excel">
    <div class="position-relative" v-loading="importing">
    <b-file
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      browse-text="Chọn file"
      placeholder="Chọn file"
      v-model="fileInsuranceInfo"
      @change="loadPreview"
      class="mb-1"
    >
    </b-file>
    <span class="text-danger">
      Các cột trong Sheet phải theo thứ tự sau để upload data lên hệ thống chính xác
    </span>
    <table class="table table-sm table-bordered">
      <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
      </tr>
      <tr>
        <td>Mã nhân viên</td>
        <td>Mã số BHXH</td>
        <td>Mã số BHYT</td>
      </tr>
      <tr>
        <td>00123456</td>
        <td>0116193874</td>
        <td>DN4790116193874</td>
      </tr>
    </table>

    <b-alert :show="!!fileLog" variant="success">
      Update dữ liệu thành công <br />
      <b-btn variant="info" @click="openLink(fileLog)">Tải file log</b-btn>
    </b-alert>
    </div>

    <div class="w-100 text-center" slot="modal-footer">
      <b-btn variant="success" @click="importDataInsurance" v-if="!fileLog && !importing">Import dữ liệu</b-btn>
    </div>
    <!-- <canvas-datagrid :data.prop='d'></canvas-datagrid> -->
  </b-modal>
</template>

<style scoped>

</style>

<script>

// service
import insuranceService from 'domain/services/insurance-service'
import profileService from 'domain/services/profile-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'upload-insurance-info',

  props: {
    id: {
      default: 'upload-insurance-info'
    }
  },
  components: {
  },

  data: _ => ({
    fileInsuranceInfo: null,
    dataPreview: {},
    fileLog: null,
    importing: false
  }),

  methods: {
    loadPreview (e) {
      e.stopPropagation()
      e.preventDefault()
      let file = e.target.files[0] || null
      if (!file) return
      this.fileLog = null
      // let dataPreview = this.dataPreview
      // let reader = new FileReader()
      // reader.onload = function (e) {
      //   let data = new Uint8Array(e.target.result)
      //   let wb = XLSX.read(data, { type: 'array' })
      //   wb.SheetNames.forEach(name => {
      //     dataPreview[name] = XLSX.utils.sheet_to_json(wb.Sheets[name], {header: 1})
      //   })
      // }
      // reader.readAsArrayBuffer(file)
    },

    importDataInsurance () {
      if (!this.fileInsuranceInfo) return
      let data = new FormData()
      data.append('file', this.fileInsuranceInfo)
      this.importing = true
      insuranceService.importDataInsurance(data)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.id) this.checkStatusJob(res.data.data.id)
            else {
              this.importing = false
              helper.showMessage('Không nhận được Job ID !', 'warning')
            }
          } else {
            this.importing = false
            helper.showMessage(res.data.message || 'Có lỗi khi import file !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.importing = false
          helper.showMessage('Có lỗi khi import file !', 'warning')
        })
    },

    checkStatusJob (jobId) {
      if (!jobId) return
      let getJobStat = setInterval(_ => {
        profileService.checkJobStatus({job_id: jobId})
          .then(res => {
            if (res.data.success) {
              let data = res.data.data
              if (data.job_status === 'closed') {
                clearInterval(getJobStat)
                if (data.message) {
                  helper.showMessage(data.message || 'Có lỗi khi kiểm tra Job import dữ liệu.', 'warning', 'Lỗi')
                } else {
                  this.fileLog = data.path
                  helper.showMessage('Đã import xong file dữ liệu', 'success')
                }
                this.importing = false
              }
            } else {
              helper.showMessage(res.data.mesage || 'Có lỗi khi kiểm tra Job import dữ liệu.', 'warning', 'Xảy ra lỗi')
              clearInterval(getJobStat)
              this.importing = false
            }
          })
      }, 2000)
    },

    openLink (link) {
      window.open(link, '_blank')
    }
  }
}
</script>
