<template>
    <div>
        <b-row>
            <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
                <div class="d-inline">Quản lý file Template</div> <br />
                <b-btn variant="success" @click="toggleTemplate" class="float-right" style="margin-left: 10px">
                Upload file
                </b-btn>
            </h4>
            <div class="justify-content-center align-items-center w-100">
                <div class="form-row">
                    <div class="col col-4 mb-3"></div>
                    <div class="col col-4 mb-3">
                        <label class="form-label">Chọn file</label>
                        <b-form-file
                        v-model="formTemplate.inputFile"
                        :state="Boolean(formTemplate.inputFile)"
                        placeholder="Choose file or drop it here..."
                        drop-placeholder="Drop file here..."
                        accept=".xls, .xlsx"
                        ></b-form-file>
                    </div>
                    <div class="col col-4 mb-3">
                      <label class="form-label d-none d-md-block">&nbsp;</label>
                      <ladda-btn :loading="formTemplate.loadingButton" @click.native="uploadTemplateFile" class="btn btn-success float-left">
                        Upload
                      </ladda-btn>
                    </div>
                </div>
            </div>
            <h1 class="d-flex justify-content-center aligin-items-center w-100 font-weight-bold">
            </h1>
            <b-card no-body class="mb-1 w-100 " style="border: 2px #b2b2b2 solid; borderRadius: 10px">
                <b-card-body style="minHeight: 1000px">
                    <div>
                        <b-table
                        id="my-table"
                        striped hover
                        :fields="fieldTemplates"
                        :items="tableTemplate.listTemplate"
                        :current-page="tableTemplate.currentPage"
                        responsive
                        >
                            <template v-slot:cell(id)="data" v-if="countTemplate == 1">
                              {{countTemplate}}
                            </template>
                            <template v-slot:cell(file_type)="data">
                              Config tỉnh cho cước đường dài
                            </template>
                            <template v-slot:cell(path_file)="data">
                                <div>
                                    <a class="btn btn-sm btn-outline-info" :href="data.item.path_file">
                                        <i class="ion ion-md-cloud-download"></i>
                                    </a>
                                </div>
                            </template>
                        </b-table>
                        <b-pagination
                        v-model="tableTemplate.currentPage"
                        :total-rows="countTemplate"
                        :per-page="tableTemplate.perPage"
                        aria-controls="my-table"
                        align="left"
                        ></b-pagination>
                    </div>
                </b-card-body>
            </b-card>
        </b-row>
    </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import routeService from 'domain/services/route-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'manage-upload-template-file',
  metaInfo: {
    title: 'Upload file template config tỉnh cho cước đường dài'
  },
  props: {
    toggleTemplate: Function
  },
  components: {
    LaddaBtn,
    routeService,
    commonHelper
  },
  created () {
    this.getListFileTemplate()
  },
  computed: {
    currentTablePage () {
      return this.tableTemplate.currentPage
    },
    countTemplate () {
      return this.tableTemplate.count
    }
  },
  data: () => ({
    tableTemplate: {
      listTemplate: null,
      count: 0,
      perPage: 10,
      currentPage: 1
    },
    fieldTemplates: [
      {key: 'id', label: 'STT'},
      {key: 'file_type', label: 'Loại file upload'},
      {key: 'modified', label: 'Ngày upload file'},
      {key: 'path_file', label: 'File template'}
    ],
    formTemplate: {
      inputFile: null,
      loadingButton: false
    }
  }),
  methods: {
    getListFileTemplate () {
      let dataSend = {
        page: this.currentTablePage,
        limit: this.tableTemplate.perPage
      }
      routeService.getFileTemplate(dataSend).then(res => {
        if (res.data.success) {
          let arrData = []
          res.data.data.forEach(item => {
            arrData.push(item)
          })
          this.tableTemplate.listTemplate = arrData
          this.tableTemplate.count = res.data.count
        } else {
          this.tableTemplate.listTemplate = []
          this.tableTemplate.count = 0
          commonHelper.showMessage('Có lỗi xảy ra', 'warning')
        }
      })
    },
    uploadTemplateFile () {
      if (this.formTemplate.inputFile == null) {
        return commonHelper.showMessage('Vui lòng chọn file upload', 'warning')
      }
      this.formTemplate.isLoading = true
      let formData = new FormData()
      formData.append('template_file', this.formTemplate.inputFile)
      routeService.apiUploadFileTemplate(formData).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getListFileTemplate()
          this.formTemplate.inputFile = null
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.formTemplate.isLoading = false
      })
    }
  }
}
</script>
