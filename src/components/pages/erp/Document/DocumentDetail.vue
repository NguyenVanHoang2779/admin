<template>
    <div class="update-master">
        <div class="top-title">
            <h2>Chi tiết văn bản</h2>
            <div class="top-title__right-button">
              <router-link :to="{name: 'manage-document'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
            </div>
        </div>
        <div>
            <div class="row">
                <div class="col-md-12">
                    <div class="card mb-4">
                        <div class="row no-gutters">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                              <h6 class="card-header ttvn-header">
                                  <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttvb><i class="ion  ion-ios-add-circle"></i> Thông tin văn bản</a>
                              </h6>
                              <b-collapse id="accordion-ttvb" visible>
                                <div class="card-body">
                                  <b-form-row>
                                    <div class="col-md-12 col-lg-12 col-xl-12">
                                      <b-row>
                                        <b-col sm="2">
                                          <label><b>Mã số</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{detailDoument.code}}</span>
                                        </b-col>
                                        <b-col sm="2">
                                          <label><b>Mức độ bảo mật</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{getSecurityLevel(detailDoument.security_level)}}</span>
                                        </b-col>
                                      </b-row >
                                      <b-row>
                                        <b-col sm="2">
                                          <label><b>Tên văn bản</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{detailDoument.name}}</span>
                                        </b-col>
                                        <b-col sm="2">
                                          <label><b>Loại văn bản</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span v-if="detailDoument.typeName">{{detailDoument.typeName}}</span>
                                          <span v-else>-</span>
                                        </b-col>
                                      </b-row >
                                      <b-row>
                                        <b-col sm="2">
                                          <label><b>Phiên bản</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{detailDoument.version}}</span>
                                        </b-col>
                                        <b-col sm="2">
                                          <label><b>Nguồn văn bản</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{getSourceName(detailDoument.source)}}</span>
                                        </b-col>
                                      </b-row >
                                      <b-row>
                                        <b-col sm="2">
                                          <label><b>Tình trạng hiệu lực</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{getStatusEffectName(detailDoument.status_effect)}}</span>
                                        </b-col>
                                        <b-col sm="2">
                                          <label><b>Người phê duyệt</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{detailDoument.approverName}}</span>
                                        </b-col>
                                      </b-row >
                                      <b-row>
                                        <b-col sm="2">
                                          <label><b>Phạm vi áp dụng</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{detailDoument.scopeInfo}}</span>
                                        </b-col>
                                        <b-col sm="2">
                                          <label><b>Ngày bắt đầu hiệu lực</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span v-if="detailDoument.date_start_effect && detailDoument.date_start_effect !== '0000-00-00 00:00:00'">
                                            {{moment(detailDoument.date_start_effect).format('DD/MM/YYYY')}}
                                          </span>
                                          <span v-else>-</span>
                                        </b-col>
                                      </b-row >
                                      <b-row>
                                        <b-col sm="2">
                                          <label><b>Bộ phận phụ trách</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span>{{detailDoument.departmentName}}</span>
                                        </b-col>
                                        <b-col sm="2">
                                          <label><b>Ngày hết hạn hiệu lực</b></label>
                                        </b-col>
                                        <b-col sm="4">
                                          <span v-if="detailDoument.date_end_effect && detailDoument.date_end_effect !== '0000-00-00 00:00:00'">
                                            {{moment(detailDoument.date_end_effect).format('DD/MM/YYYY')}}
                                          </span>
                                          <span v-else>-</span>
                                        </b-col>
                                      </b-row >
                                    </div>
                                  </b-form-row>
                                </div>
                              </b-collapse>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4">
                  <div class="row no-gutters">
                    <div class="col-md-12 col-lg-12 col-xl-12">
                      <h6 class="card-header ndvb-header">
                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ndvb><i class="ion  ion-ios-add-circle"></i> Nội dung văn bản</a>
                      </h6>
                      <b-collapse id="accordion-ndvb" visible>
                        <div class="card-body">
                          <b-form-row>
                            <div class="col-md-12 col-lg-12 col-xl-12">
                              <b-form-row>
                                <iframe width="100%" height="800" :src=urlView v-show="iframeLoaded"></iframe>
                              </b-form-row>
                            </div>
                          </b-form-row>
                        </div>
                      </b-collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4">
                  <div class="row no-gutters">
                    <div class="col-md-12 col-lg-12 col-xl-12">
                      <h6 class="card-header vblq-header">
                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-vblq><i class="ion  ion-ios-add-circle"></i> Văn bản liên quan</a>
                      </h6>
                      <b-collapse id="accordion-vblq" visible>
                        <div class="card-body table-responsive">
                          <table class="table mb-0 table-hover table-bordered">
                            <thead>
                            <tr>
                              <th>Mã văn bản</th>
                              <th>Tên văn bản</th>
                              <th>Tình trạng hiệu lực</th>
                              <th>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(documentRelated, index) in detailDoument.listDocumentRelated" :key="index">
                              <td>
                                {{documentRelated.ErpSgwDocument.code}}
                              </td>
                              <td>
                                {{documentRelated.ErpSgwDocument.name}}
                              </td>
                              <td>
                                {{getStatusEffectName(documentRelated.ErpSgwDocument.status_effect)}}
                              </td>
                              <td style="max-width: 80px">
                                <div class="text-center w-100 document-detail-action">
                                  <span @click="detailDocument(documentRelated.ErpSgwDocument.id)"><i class="ion ion-ios-eye"></i></span>
                                  <span @click="downloadDocument(documentRelated.ErpSgwDocument.id)"><i class="ion ion-md-cloud-download"></i></span>
                                </div>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      </b-collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4">
                  <div class="row no-gutters">
                    <div class="col-md-12 col-lg-12 col-xl-12">
                      <h6 class="card-header vbtd-header">
                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-vbtd><i class="ion  ion-ios-add-circle"></i> Văn bản trước đây (Đã hết hiệu lực)</a>
                      </h6>
                      <b-collapse id="accordion-vbtd" visible>
                        <div class="card-body table-responsive">
                          <table class="table mb-0 table-hover table-bordered">
                            <thead>
                            <tr>
                              <th>Mã văn bản</th>
                              <th>Tên văn bản</th>
                              <th>Phiên bản</th>
                              <th>Hiệu lực từ</th>
                              <th>Hiệu lực đến</th>
                              <th>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(documentReplace, index) in detailDoument.listDocumentReplace" :key="index">
                              <td>
                                {{documentReplace.ErpSgwDocument.code}}
                              </td>
                              <td>
                                {{documentReplace.ErpSgwDocument.name}}
                              </td>
                              <td>
                                {{documentReplace.ErpSgwDocument.version}}
                              </td>
                              <td v-if="documentReplace.ErpSgwDocument.date_start_effect && documentReplace.ErpSgwDocument.date_start_effect !== '0000-00-00 00:00:00'">
                                {{moment(documentReplace.ErpSgwDocument.date_start_effect).format('DD/MM/YYYY')}}
                              </td>
                              <td v-else>
                                -
                              </td>
                              <td v-if="documentReplace.ErpSgwDocument.date_end_effect && documentReplace.ErpSgwDocument.date_end_effect !== '0000-00-00 00:00:00'">
                                {{moment(documentReplace.ErpSgwDocument.date_end_effect).format('DD/MM/YYYY')}}
                              </td>
                              <td v-else>
                                -
                              </td>
                              <td style="max-width: 100px">
                                <div class="text-center w-100 document-detail-action">
                                  <span @click="detailDocument(documentReplace.ErpSgwDocument.id)"><i class="ion ion-ios-eye"></i></span>
                                </div>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      </b-collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <notifications group='add-emp'></notifications>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style lang="scss" scoped>
    @import "src/assets/sass/components/master-profile";
</style>
<style lang="scss" scoped>
  .document-detail-action {
    span {
      cursor: pointer;
    }
    .ion-ios-eye {
      color: #02bc77;
    }
  }
</style>
<script>
import documentService from 'domain/services/document-service'
import Document from 'domain/entities/Document'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import axios from 'axios'

export default {
  name: 'document-detail',

  components: {
    Notification,
    commonHelper
  },

  data: () => ({
    toggleLog: false,
    isLoading: false,
    notify: {
      message: '',
      class: '',
      title: ''
    },
    detailDoument: [],
    urlView: '',
    iframeLoaded: false,
    type: {
      loading: false,
      options: [],
      selected: []
    },
    optionStatus: Document.statusOptions,
    optionSecurityLevels: Document.securityLevelOptions,
    optionSources: Document.sourceOptions,
    optionStatusEffects: Document.statusEffectOptions,
    permissionDocument: false
  }),

  computed: {
  },

  async created () {
    await this.checkPermissionFull()
    await this.getDocument()
  },

  watch: {},

  methods: {
    moment (data) {
      return moment(data)
    },
    checkPermissionFull: function () {
      documentService.checkPermissionFull()
        .then(res => {
          if (res.data.success) {
            this.permissionDocument = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    downloadDocument (documentId) {
      documentService.download({id: documentId})
        .then(res => {
          if (res.data.success) {
            axios({
              url: res.data.data,
              method: 'GET',
              responseType: 'blob'
            }).then((response) => {
              let fileName = response.config.url.split('\\').pop().split('/').pop()
              let fileURL = window.URL.createObjectURL(new Blob([response.data]))
              let fileLink = document.createElement('a')

              fileLink.href = fileURL
              fileLink.setAttribute('download', fileName)
              document.body.appendChild(fileLink)
              fileLink.click()
            })
            // window.location = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình download.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },
    detailDocument (documentId) {
      if (this.permissionDocument) {
        let routeData = this.$router.resolve({name: 'document-detail', params: {id: documentId}})
        window.location = routeData.href
      } else {
        documentService.checkPermissionView({documentId: documentId})
          .then(res => {
            if (res.data.success) {
              if (res.data.data) {
                let routeData = this.$router.resolve({name: 'document-detail', params: {id: documentId}})
                window.location = routeData.href
              } else {
                this.notifyPermission()
              }
            } else {
              this.$notify({
                group: 'default',
                type: 'bg-warning text-dark',
                title: 'Thông báo',
                text: res.data.message
              })
            }
          })
          .catch(e => {
            console.log(e)
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: 'Có lỗi xảy ra.'
            })
          })
          .then(() => {
            this.appLoading = false
            this.$stopLoading()
          })
      }
    },
    async getDocument () {
      this.$startLoading()
      let dataRequest = {
        id: this.$route.params.id,
        is_tracking: this.$route.params.is_tracking
      }
      await documentService.get(dataRequest)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.url) {
              this.urlView = 'https://docs.google.com/gview?url=' + res.data.data.url + '&embedded=true'
              this.iframeLoaded = true
            }
            this.detailDoument = res.data.data
          } else {
            alert('Bạn không có quyền thực hiện thao tác này!', 'error')
            this.$router.push({ name: 'manage-document' })
          }
        }).then(() => {
          this.$stopLoading()
        })
    },

    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-emp',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify
      })
    },

    getStatusEffectName (statusEffectId) {
      return Document.getStatusEffectName(statusEffectId)
    },

    getSourceName (sourceId) {
      return Document.getSourceName(sourceId)
    },

    getSecurityLevel (securityLevelId) {
      return Document.getSecurityLevel(securityLevelId)
    }
  }
}
</script>
