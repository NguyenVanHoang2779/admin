<template>
    <div>
        <b-row v-if="!isTemplate && isConfigUser">
            <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
                <div class="d-inline">Quản lý Upload config tỉnh cho cước đường dài</div> <br />
                <b-btn variant="success" @click="toggleUpload" class="float-right" style="margin-left: 10px">
                Danh sách
                </b-btn>
                <b-btn variant="success" @click="toggleTemplate" class="float-right" style="margin-left: 10px">
                Quản lý file mẫu
                </b-btn>
                <b-btn variant="success" class="float-right" style="margin-left: 10px" @click="downloadFileTemplate">
                    <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
                    File mẫu
                </b-btn>
            </h4>
            <div class="justify-content-center align-items-center w-100">
                <div class="form-row">
                    <div class="col col-4 mb-3"></div>
                    <div class="col col-4 mb-3">
                        <label class="form-label">Chọn file</label>
                        <b-form-file
                        v-model="formInput.inputFile"
                        :state="Boolean(formInput.inputFile)"
                        placeholder="Choose file or drop it here..."
                        drop-placeholder="Drop file here..."
                        accept=".xls, .xlsx"
                        ></b-form-file>
                    </div>
                    <div class="col col-4 mb-3">
                      <label class="form-label d-none d-md-block">&nbsp;</label>
                      <ladda-btn :loading="formInput.loadingButton" @click.native="uploadConfigFile" class="btn btn-success float-left">
                        Upload
                      </ladda-btn>
                    </div>
                </div>
            </div>
            <!------------------------------------------------Quản lý Config tỉnh của cước liên miền-------------------------------------------------------------->
            <h1 class="d-flex justify-content-center aligin-items-center w-100 font-weight-bold">
                Lịch sử Upload
            </h1>
            <b-card no-body class="mb-1 w-100 " style="border: 2px #b2b2b2 solid; borderRadius: 10px">
                <b-card-body style="minHeight: 1000px">
                    <div class="md-12 mt-3">
                      Trang <b> {{currentTablePage}} / {{totalPage}} </b>, <b> {{fromRecord}}-{{toRecord}} </b> trên <b> {{countLog}} </b> bản ghi
                    </div>
                    <div>
                        <b-table
                        id="my-table"
                        striped hover
                        :fields="fieldLog"
                        :items="tableLogData.listLog"
                        :current-page="tableLogData.currentPage"
                        responsive
                        >
                            <template v-slot:cell(upload_file_path)="data">
                                <div>
                                    <a class="btn btn-sm btn-outline-info" :href="data.item.upload_file_path">
                                        <i class="ion ion-md-cloud-download"></i>
                                    </a>
                                </div>
                            </template>
                            <template v-slot:cell(error_file_path)="data">
                                <div v-if="data.item.error_file_path">
                                    <a class="btn btn-sm btn-outline-info" :href="data.item.error_file_path">
                                        <i class="ion ion-md-cloud-download"></i>
                                    </a>
                                </div>
                            </template>
                            <template v-slot:cell(action)="data">
                              <div class="btn btn-sm btn-outline-danger" @click="removeFileAndDataUpload(data.item.id)">
                                <i class="fa fa-times"></i>
                              </div>
                            </template>
                        </b-table>
                        <b-pagination
                        v-model="tableLogData.currentPage"
                        :total-rows="countLog"
                        :per-page="tableLogData.perPage"
                        aria-controls="my-table"
                        align="left"
                        ></b-pagination>
                    </div>
                </b-card-body>
            </b-card>
        </b-row>
        <ManageTemplateRentTruckConfig
        v-if="isTemplate"
        :toggleTemplate="toggleTemplate"
        ></ManageTemplateRentTruckConfig>
    </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import routeService from 'domain/services/route-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import ManageTemplateRentTruckConfig from './ManageTemplateRentTruckConfig.vue'
import {eventBus} from '../../../../main'

export default {
  name: 'manage-upload-prov-rent-truck',
  metaInfo: {
    title: 'Upload config tỉnh cho cước đường dài'
  },
  components: {
    LaddaBtn,
    routeService,
    commonHelper,
    ManageTemplateRentTruckConfig
  },
  props: {
    clearFormSearch: Function,
    toggleUpload: Function
  },
  data: () => ({
    // default data
    tableLogData: {
      listLog: null,
      count: 0,
      perPage: 10,
      currentPage: 1
    },
    fieldLog: [
      { key: 'id', label: 'ID' },
      { key: 'total_records', label: 'Tổng số bản ghi' },
      { key: 'total_success_records', label: 'Số bản ghi thành công' },
      { key: 'upload_file_path', label: 'File đã upload' },
      { key: 'error_file_path', label: 'File data lỗi' },
      { key: 'from_config_id', label: 'ID bản ghi bắt đầu' },
      { key: 'to_config_id', label: 'ID bản ghi kết thúc' },
      { key: 'upload_by', label: 'Người thao tác' },
      { key: 'created', label: 'Thời gian upload' },
      { key: 'action', label: 'Thao tác' }
    ],
    formInput: {
      inputFile: null,
      loadingButton: false
    },
    isTemplate: false,
    isConfigUser: true
  }),
  computed: {
    countLog () {
      return this.tableLogData.count
    },
    totalPage () {
      if (this.tableLogData.count === 0) return 1
      if (this.tableLogData.count % this.tableLogData.perPage === 0) {
        return parseInt(this.tableLogData.count / this.tableLogData.perPage)
      }
      return parseInt(this.tableLogData.count / this.tableLogData.perPage) + 1
    },
    fromRecord () {
      if (this.countLog === 0) {
        return 0
      }
      let from = (this.tableLogData.currentPage - 1) * this.tableLogData.perPage + 1
      if (from > this.countLog) from = from - this.tableLogData.perPage
      return from
    },
    toRecord () {
      let to = this.tableLogData.currentPage * this.tableLogData.perPage
      return to > this.countLog ? this.countLog : to
    },
    currentTablePage () {
      return this.tableLogData.currentPage
    }
  },
  created () {
    this.getLogUploadFileConfig()
  },
  watch: {
    currentTablePage () {
      this.getLogUploadFileConfig()
    }
  },
  methods: {
    getLogUploadFileConfig: function () {
      let dataSend = {
        page: this.currentTablePage,
        limit: this.tableLogData.perPage
      }
      return routeService.apiGetLogUploadFileConfig(dataSend).then(res => {
        if (res.data.success) {
          let arrData = []
          res.data.data.forEach(item => {
            arrData.push(item)
          })
          this.tableLogData.listLog = arrData
          this.tableLogData.count = res.data.count
        } else {
          this.tableLogData.listLog = []
          this.tableLogData.count = 0
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Đã có lỗi xảy ra!', 'warning')
      })
    },
    uploadConfigFile: function () {
      if (this.formInput.inputFile == null) {
        return commonHelper.showMessage('Vui lòng chọn file upload', 'warning')
      }
      this.formInput.loadingButton = true
      let formData = new FormData()
      formData.append('config_file', this.formInput.inputFile)
      routeService.apiUploadConfig(formData).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getLogUploadFileConfig()
          this.formInput.inputFile = null
          eventBus.$emit('uploadConfigSuccess')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.formInput.loadingButton = false
      })
    },
    downloadFileTemplate: function () {
      commonHelper.showMessage('Vui lòng chờ !!!', 'success')
      routeService.downloadFileTemplate().then(res => {
        if (res.data.success) {
          if (res.data.path_file) {
            commonHelper.showMessage(res.data.message, 'success')
            window.open(res.data.path_file, '_blank')
          }
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
        console.log(err)
      })
    },
    toggleTemplate: function () {
      this.isTemplate = !this.isTemplate
    },
    removeFileAndDataUpload: function (idUpload) {
      if (!confirm('Bạn có chắc muốn xoá file và dữ liệu đã upload này? \n (Hành động này sẽ xoá các bản ghi đã upload thành công trong lần upload đó!)')) return

      if (!idUpload) return

      let dataSend = {
        id: idUpload
      }
      commonHelper.showMessage('Đang thực hiện ...', 'success')
      routeService.removeFileAndDataUpload(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getLogUploadFileConfig()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Có lỗi xảy ra', 'warning')
        console.log(err)
      })
    }
  }
}
</script>
