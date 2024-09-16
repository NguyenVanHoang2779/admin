<template>
  <div>
    <div class="ui-block">
      <b-row>
        <b-col md="6">
          <h4 class="ui-block-heading">Quản lý Template</h4>
        </b-col>
        <b-col class="text-right" md="6" v-if="isSuperUser">
          <div class="d-inline-block">
            <b-btn variant="outline-primary" target="blank" v-b-modal.modal-list-variable>
              <i class="ion ion-md-document"></i> Danh sách biến
            </b-btn>
          </div>
        </b-col>
      </b-row>
      <hr>
    </div>
    <b-row>
      <div class="col-md-12">
        <b-col sm="4" lg="2">
          <b-input v-model="search.templateName" placeholder="Tên template"/>
        </b-col>
        <b-col sm="8" md="12" lg="12" class="text-right">
          <b-btn variant="primary" @click="currentPage = 1; getListTemplates();"><i
            class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
          </b-btn>
        </b-col>
      </div>
    </b-row>
    <hr data-v-c89b2776="">
    <div class="row">
      <div class="col-md-12">
        <div class="card md-4">
          <div class="row no-gutters">
            <div class="cod-md-12 col-lg-12 col-xl-12">

              <div class="card-header ttcn-header">
                <b-btn v-if="isSuperUser" variant="success" v-b-toggle.add-template>Tạo mới template</b-btn>
                <b-btn variant="secondary" v-b-toggle.export-template>Xuất template</b-btn>

                <!--  collapse cho chức năng tạo mới template -->
                <b-collapse id="add-template" class="mt-3 template-action" accordion="template-action">
                  <b-row class="position-relative">
                    <b-col class="col-md-4">
                      <b-row>
                        <b-form-group class="col-md-12">
                          <template slot='label'>
                            Loại template: <span class='red-text'>(*)</span>
                          </template>
                          <b-form-select v-model="template.type" :options="selectType" name="template_type"
                                         v-validate="'required'">
                            <template v-slot:first>
                              <option :value="null" disabled>-- Chọn loại template --</option>
                            </template>
                          </b-form-select>
                          <span v-show="errors.firstRule('template_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                        <b-form-group class="col-md-12">
                          <template slot='label'>
                            Tên template: <span class='red-text'>(*)</span>
                          </template>
                          <b-form-input
                            v-model="template.name"
                            id="template_name"
                            name="template_name"
                            v-validate="'required'"
                            placeholder="Nhập tên template"
                            :class="{'is-danger': errors.has('template_name')}"
                          >
                          </b-form-input>
                          <span v-show="errors.firstRule('template_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                      </b-row>
                    </b-col>
                    <b-form-group class="col-md-4">
                      <template slot='label'>
                        Mô tả:
                      </template>
                      <b-form-textarea
                        id="template_descrip"
                        name="template_descrip"
                        v-model="template.descrip"
                        placeholder="Nhập mô tả..."
                        rows="3"
                        max-rows="6"
                      ></b-form-textarea>
                    </b-form-group>
                    <b-col class="col-md-4">
                      <b-row>
                        <b-col class="col-md-12">
                          <div class="template-label">
                            File mẫu:
                            <span v-if="template.fileTemplate" class="text-primary">
                              {{ this.template.fileTemplate.name }}
                              <i class="ion ion-md-document text-success cursor-pointer"
                                 @click="triggerInputUploadFile"></i>
                            </span>
                            <i v-else class="ion ion-md-cloud-upload text-success cursor-pointer"
                               @click="triggerInputUploadFile"></i>
                            <b-form-file
                              v-model="template.fileTemplate"
                              style="display: none"
                              ref="fileTemplate"
                            ></b-form-file>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <div class="text-center">
                    <b-btn variant="success" @click="addTemplate">Lưu lại</b-btn>
                  </div>
                </b-collapse>

                <!--collapse cho chức năng xuất template-->
                <b-collapse id="export-template" class="mt-3 template-action" accordion="template-action">
                  <b-row>
                    <b-col class="col-md-4">
                      <b-row>
                        <b-form-group class="col-md-12">
                          <template slot='label'>
                            Loại template: <span class='red-text'>(*)</span>
                          </template>
                          <b-form-select v-model="template.type" :options="selectType" name="template_type"
                                         v-validate="'required'">
                            <template v-slot:first>
                              <option :value="null" disabled>-- Chọn loại template --</option>
                            </template>
                          </b-form-select>
                          <span v-show="errors.firstRule('template_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                        <b-form-group class="col-md-12">
                          <template slot='label'>
                            Tên template: <span class='red-text'>(*)</span>
                          </template>
                          <single-select-template :templates="listTemplateExport" :template-type="template.type"
                                                  @handleSelectedTemplate="handleSelectedTemplate"></single-select-template>
                          <span v-show="errors.firstRule('template_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                      </b-row>
                    </b-col>
                    <b-col class="col-md-8" style="padding-left: 50px">
                      <b-form-group id="input-group-candidate" v-if="template.type == 'candidate'">
                        <template slot='label'>
                          Chọn ứng viên: <span class='red-text'>(*)</span>
                        </template>
                        <multi-select-candidate @onChange="selectedMultiCandidate"
                                                :multi="true"></multi-select-candidate>
                      </b-form-group>
                      <b-form-group id="input-group-user" v-else>
                        <template slot='label'>
                          Chọn user: <span class='red-text'>(*)</span>
                        </template>
                        <multi-select-user @onChange="selectedMultiUser"></multi-select-user>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <div class="text-center">
                    <b-btn variant="success" @click="downloadFile()"><i class="ion ion-md-cloud-download"></i>Xuất
                      template
                    </b-btn>
                  </div>
                </b-collapse>
                <b-modal id="bv-modal-export-list" hide-footer>
                  <template v-slot:modal-title>
                    Danh sách link tải template
                  </template>
                  <div class="d-block text-left" v-if="this.listExport.length > 0">
                    <div v-for="(item, index) in listExport">
                      <a :href="item.url">{{ index + 1 + '. ' + item.name }}</a>
                    </div>
                  </div>
                  <div v-else>
                    Không tìm thấy file template nào!
                  </div>
                </b-modal>
              </div>

              <div class="list-content">
                <h4 class="ui-block-heading">Danh sách Template</h4>
                <div class="wrapper-element mt-2" v-for="item in listTemplates">
                  <div style="width: 5%" class="content-center">
                    <i v-if="item.status === 'active'" class="ion ion-md-checkmark-circle text-success"
                       style="font-size: 36px"></i>
                    <i v-if="item.status === 'disable'" class="ion ion-md-remove-circle-outline text-danger"
                       style="font-size: 36px"></i>
                  </div>
                  <div style="width: 25%" class="content-center-left">
                    <div style="padding: 10px 0;">
                      <div><span>Tên: <strong>{{ item.name }}</strong></span></div>
                      <div><span>Loại: <strong>{{ genTypeTemplate(item.type) }}</strong></span></div>
                      <div><span>Người tạo: {{ item.fullname_created }} / {{ moment(item.created) }}</span></div>
                    </div>
                  </div>
                  <div style="width: 45%" class="content-center-left">
                    <div class="element-descrip">
                      <p>Mô tả:</p>
                      <p>{{ item.descrip }}</p>
                    </div>
                  </div>
                  <div style="width: 15%; display: flex; align-items: center; padding-top: 1rem">
                    <b-form-select v-model="item.status" :options="selectStatus" class="mb-3 cursor-pointer"
                                   name="template_type" :disabled="!isSuperUser"
                                   @change="changeStatusTemplate(item.id, item.status)">
                      <template v-slot:first>
                        <option :value="null" disabled>-- Chọn trạng thái --</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div style="width: 10%; padding: 15px" class="element-action">
                    <i class="ion ion-md-trash cursor-pointer" title="Xóa" @click="deleteTemplate(item.id)"
                       v-if="isSuperUser"></i>
                    <i v-if="item.status == 'active'" class="ion ion-md-cloud-download cursor-pointer"
                       @click="showPreview(item)" title="Tải xuống"></i>
                    <i v-else class="ion ion-md-eye cursor-pointer text-primary" @click="showPreview(item)"
                       title="Xem trước"></i>
                  </div>
                </div>
                <div class="mt-3" v-if="totalPages > 1">
                  <b-row>
                    <b-col>
                      <b-pagination
                        :total-rows="totalItems"
                        v-model="currentPage"
                        :per-page="perPage"
                        v-on:input="getListTemplates"
                        align="center"
                      />
                    </b-col>
                  </b-row>
                </div>
                <modal-list-variable></modal-list-variable>
                <modal-preview-template :template="templatePreview"></modal-preview-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.is-danger {
  border-color: #E0B4B4;
  color: #9F3A38;
  box-shadow: none;
}

.preview-template {
  position: absolute;
  padding: 1px 10px;
  right: 15px;
}

.element-descrip {
  padding: 0 20px 0 0;

  p {
    margin-bottom: 2px !important;
  }
}

.element-action {
  position: relative;
  font-size: 20px;

  i:first-child {
    position: absolute;
    color: #ACA9BB;
    top: 12px;
    right: 18px;
  }

  i:nth-child(2) {
    position: absolute;
    bottom: 12px;
    right: 15px;
    color: #00AF7C;
  }
}

.element-action .ion-md-trash:hover {
  color: red;
}

.element-action .ion-md-cloud-download:hover {
  color: #00B177;
}

.content-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-center-left {
  display: flex;
  align-items: center;
}

.content-center-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.wrapper-element {
  display: flex;
  border: solid 1px #dfe1e3;
}

.wrapper-element:hover {
  background: #dfe1e3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.list-content {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 0.5rem 1.5rem;
}

.template-action {
  border: 1px solid #E2E5EE;
  padding: 10px;
}

.template-label {
  margin-bottom: calc(0.438rem - 2px);
  font-weight: 500;
  font-size: 0.83125rem;
  padding-bottom: 0;
  line-height: 1.54;
}
</style>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ModalListVariable from './ModalListVariable'
import ModalPreviewTemplate from './ModalPreviewTemplate'
import SingleSelectTemplate from 'components/elements/common/SingleSelectTemplate'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import MultiSelectCandidate from 'components/elements/common/MultiSelectCandidate'
import ProfileService from 'domain/services/profile-service'
import TemplateService from 'domain/services/template-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'template-manage',
  components: {
    MultiSelectUser,
    SingleSelectTemplate,
    ModalListVariable,
    ModalPreviewTemplate,
    MultiSelectCandidate
  },

  data: () => ({
    listExport: [],
    listTemplates: [],
    userPreview: null,
    selectUser: null,
    selectCandidate: null,
    selectTemplate: null,
    templatePreview: null,
    template: {
      name: null,
      fileTemplate: null,
      path: null,
      descrip: null,
      type: null
    },
    selectType: [
      {value: 'candidate', text: 'Ứng viên'},
      {value: 'contract', text: 'Hợp đồng'},
      {value: 'check-in', text: 'Thủ tục check in'},
      {value: 'check-out', text: 'Thủ tục check out'},
      {value: 'upgrade', text: 'Tăng lương, nâng chức, bổ nhiệm'},
      {value: 'regulation', text: 'Cam kết, quy chế'},
      {value: 'atm', text: 'Tài khoản ngân hàng'}
    ],
    selectStatus: [
      {value: 'active', text: 'Có hiệu lực'},
      {value: 'disable', text: 'Không có hiệu lực'}
    ],
    isToggleCollapse: false,
    isSuperUser: false,
    loading: null,
    search: {
      templateName: ''
    },
    currentPage: 1,
    totalItems: 0,
    perPage: 5
  }),

  created () {
    this.getListTemplates()
    this.checkPermissionManage()
  },

  mounted () {
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      this.isToggleCollapse = isJustShown
    })
  },

  computed: {
    listTemplateExport () {
      return this.listTemplates.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: item.status
      }))
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    isToggleCollapse () {
      this.template = {
        name: null,
        fileTemplate: null,
        path: null,
        descrip: null,
        type: null
      }
      this.errors.clear()
    }
  },

  methods: {
    checkPermissionManage: function () {
      ProfileService.checkPermissionManage()
        .then((res) => {
          if (res.data.success) {
            this.isSuperUser = true
          }
        })
    },
    genTypeTemplate: function (type) {
      let name = ''
      switch (type) {
        case 'candidate':
          name = 'Ứng viên'
          break
        case 'contract':
          name = 'Hợp đồng'
          break
        case 'check-in':
          name = 'Thủ tục check in'
          break
        case 'check-out':
          name = 'Thủ tục check out'
          break
        case 'upgrade':
          name = 'Tăng lương, nâng chức, bổ nhiệm'
          break
        case 'regulation':
          name = 'Cam kết, quy chế'
          break
        case 'atm':
          name = 'Tài khoản ngân hàng'
          break
      }
      return name
    },

    changeStatusTemplate: function (templateId, status) {
      let dataSend = {
        templateId: templateId,
        status: status
      }
      ProfileService.changeStatusTemplate(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getListTemplates()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },
    moment: function (data) {
      return moment(data).format('DD-MM-YYYY')
    },

    getListTemplates () {
      this.$startLoading()
      let dataSend = {
        page: this.currentPage,
        limit: this.perPage,
        template_name: this.search.templateName
      }
      TemplateService.getListTemplates(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.listTemplates = res.data.data
            this.totalItems = res.data.total
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    downloadFile () {
      let dataSend = {
        user_id: this.selectUser || '',
        template_id: this.selectTemplate || '',
        candidate_id: this.selectCandidate || ''
      }

      ProfileService.downloadFile(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.listExport = res.data.data
            if (this.listExport.length > 0) this.$bvModal.show('bv-modal-export-list')
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    addTemplate () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let dataSend = new FormData()
          dataSend.append('file', this.template.fileTemplate)
          dataSend.append('type', this.template.type || '')
          dataSend.append('name', this.template.name || '')
          dataSend.append('descrip', this.template.descrip || '')

          ProfileService.addTemplate(dataSend)
            .then((res) => {
              if (res.data.success) {
                this.$root.$emit('bv::toggle::collapse', 'add-template')
                this.getListTemplates()
                commonHelper.showMessage(res.data.message, 'success')
              } else {
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
            .catch((e) => {
              console.log(e)
            })
            .then(() => {
              this.$stopLoading()
            })
        }
      })
    },

    deleteTemplate (templateId) {
      if (!confirm(`Bạn có chắc chắn muốn xóa template này không?`)) {
        return
      }
      let dataSend = {
        templateId: templateId
      }

      ProfileService.deleteTemplate(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.getListTemplates()
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    showPreview (template) {
      this.templatePreview = template
      this.$bvModal.show('preview-template')
    },
    triggerInputUploadFile () {
      this.$refs.fileTemplate.$el.childNodes[0].click()
    },
    selectedUser (option) {
      this.userPreview = option
    },
    selectedMultiUser (option) {
      this.selectUser = option ? option.map((item) => item.id).toString() : ''
    },
    selectedMultiCandidate (option) {
      this.selectCandidate = option ? option.map((item) => item.id).toString() : ''
    },
    handleSelectedTemplate (option) {
      this.selectTemplate = option.id || null
    }
  }
}
</script>
