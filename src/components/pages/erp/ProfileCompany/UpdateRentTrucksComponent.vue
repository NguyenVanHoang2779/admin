<template>
  <div>
    <div class="card mb-4 col-md-12">
      <div class="row no-gutters row-bordered">
          <div class="col-md-12 find-master-profile">
              <div class="col-lg-12 col-xl-12">
                  <div class="row card-header col-md-12">
                    <div class="col-md-9">
                      <h6><i class="ion ion-ios-add-circle"></i> Thông tin giấy tờ xe</h6>
                    </div>
                    <div class="col-md-3 text-right">
                      <b-button variant="outline-secondary" @click="handleHistoryDocument(1)" size="sm"><i class="ion ion-md-document"></i> Xem lịch sử giấy tờ</b-button>
                    </div>
                  </div>
                  <div :class="(index === 1) ? '': 'card-header info-paper'" class="row col-md-12" v-for="(item ,index) in truckData.documents" v-bind:key="`${index}-${item.id}`"  v-if="item.type == type.TYPE_VEHICLE_REG || item.type == type.TYPE_REGISTRY">
                      <div class="row col-md-12">
                        <label class="col-md-3 font-weight-bold">{{item.header}}</label>
                      </div>
                      <div class="row col-md-12">
                        <div class="col-md-3">
                          <label >{{item.numberTitle}}:</label> {{item.numberValue}}
                        </div>
                        <div  class="col-md-3">
                          <label >{{item.startDateTitle}}:</label> {{item.startDateValue}}
                        </div>
                        <div  class="col-md-3">
                          <label >{{item.endDateTitle}}:</label> {{item.endDateValue}}
                        </div>
                        <div class="col-md-2">
                          <label slot='label'>Ảnh: </label> <b-link @click="viewDocument(item.files)">Link</b-link>
                        </div>
                        <div  class="col-md-1 text-right" v-if="isBKS || (isPermissionWhenNotApproved && !censorRentTruck.status_paper)">
                          <b-button variant="outline-success" @click="showDocumentUpdate(item.type)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center mb-3 mt-3">
                    <ladda-btn v-if="!censorRentTruck.status_paper && isBKS" @click.native="saveCensor(2)" class="btn btn-outline-success mr-4">Duyệt</ladda-btn>
                    <ladda-btn v-else-if="parseInt(censorRentTruck.status_paper) === 2" class="btn btn-success mr-4">Đã duyệt</ladda-btn>
                  </div>
          </div>
      </div>
      <b-modal hide-footer id="modal-change-truck-log" ref="changeLog" size="lg" header-bg-variant="success" :title="truckLog.title" ok-only centered>
        <div v-if="truckLog.logs && truckLog.logs.length">
          <b-row v-for="(log) in truckLog.logs" :key="log.id" class="card-header">
            <b-col md="2">{{convertLogType(log.type_document, log.type)}}</b-col>
            <b-col md="2">{{log.created}}</b-col>
            <b-col md="3">{{log.username}}-{{log.fullname}}-{{log.position_name}}</b-col>
            <b-col md="5">
              <div class="truck-log-details" v-if="log.type_id == 1">
                <b-row v-for="(logData, index) in log.data" :key="index">
                  {{log.type_update == 1 ? 'Cập nhật' : 'Xác nhận'}} {{logData.title}} mới {{logData.number ? (logData.old ? `từ ${logData.old}` : ``)+` thành ${logData.number}` : ``}}
                </b-row>
              </div>
              <div class="truck-log-details" v-if="log.type_id == 2">
                <b-row v-for="(logData, index) in log.data" :key="index">
                  {{log.type_update == 1 ? 'Cập nhật' : 'Xác nhận'}} {{logData.title}} mới {{logData.type}} {{logData.number ? (logData.old ? `từ ${logData.old}` : ``)+` thành ${logData.number}` : ``}}
                </b-row>
              </div>
            </b-col>
          </b-row>
          <div class="mt-3" v-if="truckLog.pagination.totalPages > 1">
            <b-row>
              <b-col md="12">
                <b-pagination
                v-model="truckLog.pagination.current"
                :total-rows="truckLog.pagination.totalItems"
                :per-page="truckLog.pagination.perPage"
                v-on:change="pageLogChanged"
                aria-controls="log-table"
                align="center"
                ></b-pagination>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-modal>
      <b-modal hide-footer id="modal-update-truck-document" ref="documentUpdate" size="lg" header-bg-variant="success text-white" :title="updateTitle" ok-only centered>
        <b-row>
            <b-col md="6">
              <b-form-group v-if="updateModal.numberTitle">
                <label class="form-label">{{updateModal.numberTitle}}</label>
                <b-form-input v-model="updateModal.numberValue" ></b-form-input>
              </b-form-group>
              <b-form-group >
                <label class="form-label">{{updateModal.startDateTitle}}</label>
                <v-date-picker :max-date="new Date()" :popover="{visibility: 'focus'}" color="green" v-model="updateModal.startDateValue" locale="vi"/>
              </b-form-group>
              <b-form-group >
                <label class="form-label">{{updateModal.endDateTitle}}</label>
                <v-date-picker :min-date="updateModal.startDateValue" :popover="{visibility: 'focus'}" color="green" v-model="updateModal.endDateValue" locale="vi"/>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-row>
                <b-col md="6">
                  <label class="form-label font-weight-bold" >{{updateDocumentTitle}}</label>
                </b-col>
                <label class="form-label font-weight-bold" v-if="updateModal.type==2">{{requiredDocument}}</label>
              </b-row>
              <b-row>
                <template>
                  <div class="text-left">
                    <div v-for="(file, index) in updateModal.fileDocuments" class="img-bounder mt-1 mb-4" :key="file.id">
                      <span @click="deleteFile($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                      <b-img
                        v-if="file.type.indexOf('image') === 0"
                        v-img="{group: `files`}" :src="file.link_file" :alt="file.name" class="rounded mt-2 mr-3" style="height: 150px;"
                      ></b-img>
                      <div v-else class="mt-2 mr-3">
                        <b-link @click="openLink(file.link_file)" class="mr-3">
                          <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                        </b-link>
                      </div>
                    </div>
                    <div v-for="(file, index) in updateModal.fileAdded" class="img-bounder mt-1 mb-4" :key="index">
                      <span @click="deleteFile($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                      <a href="javascript:void(0)">
                        <b-img
                          v-if="file.type.indexOf('image') === 0"
                          :src="getUrl(file)" :alt="file.name" class="rounded mt-2 mr-3" style="height: 150px;"
                        >
                        </b-img>
                        <b-link v-else class="mr-3">
                          <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
                        </b-link>
                      </a>
                    </div>
                    <div class="img-bounder mt-1 mb-4" v-if="(updateModal.fileDeleted.length && updateModal.fileAdded.length < updateModal.numberDocRequired) || (!updateModal.fileDeleted.length && updateModal.fileDocuments.length < updateModal.numberDocRequired && updateModal.fileAdded.length < updateModal.numberDocRequired)">
                      <b-form-group class="dragdrop font-size">
                        <b-form-file
                          multiple
                          accept="image/*, .pdf"
                          v-model="updateModal.fileAdded"
                          placeholder="+"
                          :file-name-formatter="formatNames"
                        >
                        </b-form-file>
                      </b-form-group>
                    </div>
                  </div>
                </template>
              </b-row>
            </b-col>
        </b-row>
        <b-row align-h="center">
          <b-button variant="success" @click="updateDocumentUpdate" :disabled="addBtnDisabled"> Cập nhật</b-button>
        </b-row>
      </b-modal>
    </div>
    <div class="card mb-4 col-md-12">
      <b-row class="card-header col-md-12">
        <b-col md="9">
          <h6><i class="ion ion-ios-add-circle"></i> Thông tin an ninh xe</h6>
        </b-col>
      </b-row>
      <b-row class="card-header col-md-12">
        <b-row class="col-md-12 font-weight-bold"><b-col md="3">Camera</b-col></b-row>
        <b-row class="col-md-12" style="padding-top: 20px;" v-for="(item, index) in truckData.cameras" :key="index">
          <b-col md="3" v-if="parseInt(item.type_detail) === 1"><span>Camera cabin</span></b-col>
          <b-col md="3" v-else><span>Camera thùng xe</span></b-col>
          <b-col md="3"><span>Số lượng: </span> {{item.quantity}}</b-col>
          <b-col md="2"><label slot='label'>Ảnh: </label> <b-link @click="viewDocument(item.files)">Link</b-link></b-col>
          <div class="col-md-3"></div>
          <b-col md="1" class="text-right" v-if="isBKS || (isPermissionWhenNotApproved && !censorRentTruck.status_security)">
            <b-button v-if="parseInt(item.type_detail) === 1" variant="outline-success" @click="showSecurityInfoUpdate(typeSecurityInfo.CAMERA, typeSecurityDetail.TYPE_CABIN)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
            <b-button v-else variant="outline-success" @click="showSecurityInfoUpdate(typeSecurityInfo.CAMERA, typeSecurityDetail.TYPE_TRUNK)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
          </b-col>
        </b-row>
      </b-row>
      <b-row class="card-header col-md-12">
        <b-row class="col-md-12 font-weight-bold"><b-col md="3">Gia cố xe tải</b-col></b-row>
        <b-row class="col-md-12" style="padding-top: 20px;" v-for="(item, index) in truckData.reinforcements" :key="index">
          <b-col md="3" v-if="parseInt(item.type_detail) === 3"><span>Loại thùng: </span>{{getTruckBarrelName(item.barrel_type)}}</b-col>
          <b-col md="3" v-if="parseInt(item.type_detail) === 4"><span>Cửa xe: </span></b-col>
          <b-col md="3" v-if="parseInt(item.type_detail) === 5"><span>Loại sàn: </span>{{getTruckFloorName(item.floor_type)}}</b-col>
          <b-col md="3" v-if="parseInt(item.type_detail) === 3"><label slot='label'>Ảnh: </label> <b-link @click="viewDocument(item.files)">Link</b-link></b-col>
          <b-col md="3" v-if="parseInt(item.type_detail) === 4"><label slot='label'>Ảnh cửa thùng sau: </label> <b-link @click="viewDocument(item.files)">Link</b-link></b-col>
          <b-col md="3" v-if="parseInt(item.type_detail) === 5"></b-col>
          <b-col md="2" v-if="parseInt(item.type_detail) === 3"><label slot='label'>Ảnh móc cài seal: </label> <b-link @click="viewDocument(item.fileTwos)">Link</b-link></b-col>
          <b-col md="2" v-if="parseInt(item.type_detail) === 4"><label slot='label'>Ảnh cửa bên hông: </label> <b-link @click="viewDocument(item.fileTwos)">Link</b-link></b-col>
          <b-col md="2" v-if="parseInt(item.type_detail) === 5"><label slot='label'>Ảnh: </label> <b-link @click="viewDocument(item.files)">Link</b-link></b-col>
          <div class="col-md-3"></div>
          <b-col md="1" class="text-right" v-if="isBKS || (isPermissionWhenNotApproved && !censorRentTruck.status_security)">
            <b-button v-if="parseInt(item.type_detail) === 3" variant="outline-success" @click="showSecurityInfoUpdate(typeSecurityInfo.REINFORCEMENT, typeSecurityDetail.TYPE_BARREL)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
            <b-button v-if="parseInt(item.type_detail) === 4" variant="outline-success" @click="showSecurityInfoUpdate(typeSecurityInfo.REINFORCEMENT, typeSecurityDetail.TYPE_DOOR)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
            <b-button v-if="parseInt(item.type_detail) === 5" variant="outline-success" @click="showSecurityInfoUpdate(typeSecurityInfo.REINFORCEMENT, typeSecurityDetail.TYPE_FLOOR)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
          </b-col>
        </b-row>
      </b-row>
      <div class="text-center mb-3 mt-3">
        <ladda-btn v-if="!censorRentTruck.status_security && isBKS" @click.native="saveCensor(3)" class="btn btn-outline-success mr-4">Duyệt</ladda-btn>
        <ladda-btn v-else-if="parseInt(censorRentTruck.status_security) === 2" class="btn btn-success mr-4">Đã duyệt</ladda-btn>
      </div>
    </div>
    <modal-security-info :trigger="modalSecurityInfo.trigger" :truckData="truckData" :truck-security-info="truckSecurityInfo" :title="truckSecurityInfo.updateTitle" @updateSecurityInfoOk="updateSecurityInfoOk()"></modal-security-info>
    <modal-view-documents :trigger="viewDoc.trigger" :files="viewDoc.files" :title="viewDoc.title"></modal-view-documents>
  </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import Vue from 'vue'
import Viewer from 'v-viewer'
import VueImg from 'v-img'
import 'viewerjs/dist/viewer.css'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import ModalViewDocuments from 'components/elements/common/ModalViewDocuments'
import ModalMortgageImage from 'components/elements/common/ModalMortgageImage'
import ModalUpdateMortgage from 'components/elements/common/ModalUpdateMortgage'
import ModalSecurityInfo from 'components/elements/common/ModalSecurityInfo'
import Truck from 'domain/entities/Truck'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

Vue.use(Viewer)
Vue.use(VueImg, {
  altAsTitle: true
})

export default {
  name: 'update-rent-trucks-component',
  components: {
    ModalViewDocuments,
    ModalMortgageImage,
    ModalUpdateMortgage,
    ModalSecurityInfo,
    Truck,
    LaddaBtn
  },

  props: [
    'truckData', 'isMoreInfo', 'isRentInfo', 'censorRentTruck', 'isViewManagerTruck', 'isBKS', 'isPermissionWhenNotApproved'
  ],

  data: () => ({
    viewDoc: {
      trigger: false,
      files: [],
      title: 'Chi tiết tài liệu'
    },
    modalSecurityInfo: {
      trigger: false
    },
    type: {
      TYPE_VEHICLE_REG: 20,
      TYPE_REGISTRY: 21,
      TYPE_LIABILITY_INSURANCE: 22,
      TYPE_BODY_INSURANCE: 23
    },
    typeSecurityInfo: {
      CAMERA: 1, // camera
      REINFORCEMENT: 2 // gia cố xe
    },
    typeCamera: {
      TYPE_CABIN: 1, // loại camera cabin
      TYPE_TRUNK: 2 // loại camera thùng xe
    },
    typeReinforcement: {
      TYPE_BARREL: 1, // loại thùng xe
      TYPE_DOOR: 2, // loại cửa xe
      TYPE_FLOOR: 3 // loại sàn
    },
    typeSecurityDetail: {
      TYPE_CABIN: 1, // loại camera cabin
      TYPE_TRUNK: 2, // loại camera thùng xe
      TYPE_BARREL: 3, // loại thùng xe
      TYPE_DOOR: 4, // loại cửa xe
      TYPE_FLOOR: 5 // loại sàn
    },
    typeTireId: {
      TYPE_TIRES_UP_LEFT: 1,
      TYPE_TIRES_UP_RIGHT: 2,
      TYPE_TIRES_DOWN_LEFT_OUTSIDE: 3,
      TYPE_TIRES_DOWN_LEFT_INSIDE: 4,
      TYPE_TIRES_DOWN_RIGHT_OUTSIDE: 5,
      TYPE_TIRES_DOWN_RIGHT_INSIDE: 6,
      TYPE_TIRES_SPARE_1: 7,
      TYPE_TIRES_SPARE_2: 8
    },
    truckSecurityInfo: {
      addBtnDisabled: false,
      updateTitle: '',
      typeSecurityInfo: 1,
      typeDetail: 1,
      cameras: [],
      reinforcements: [],
      listSecurityInfos: [],
      addSecurityInfos: [],
      listCameras: [],
      listReinforcements: []
    },
    addBtnDisabled: false,
    updateTitle: '',
    updateDocumentTitle: '',
    requiredDocument: '',
    updateModal: {
      numberTitle: 'Số đăng kiểm',
      numberValue: '',
      startDateTitle: 'Ngày cấp',
      startDateValue: '',
      endDateTitle: 'Ngày hết hạn',
      endDateValue: '',
      isChange: false,
      fileDocuments: [],
      fileAdded: [],
      fileDeleted: [],
      type: 0,
      numberDocRequired: 1
    },
    optionViewers: {
      url: 'data-src'
    },
    truckLog: {
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 10,
        totalRow: 0
      },
      type: 1,
      title: '',
      page: 0,
      nextBtnDisabled: false,
      preBtnDisabled: false,
      logs: [],
      total: 0
    }
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    convertLogType (typeDocument, typeText) {
      if (Object.values(this.type).includes(+typeDocument)) return typeText
      if (Object.values(this.typeTireId).includes(+typeDocument)) return 'Lốp'
      if (Object.values(this.typeBatteryId).includes(+typeDocument)) return 'Ắc Quy'
      return typeText
    },
    showMaintenanceDoc (documents) {
      this.viewDoc.files = documents || []
      this.viewDoc.trigger = !this.viewDoc.trigger
    },
    openLink (linkFile) {
      if (linkFile) {
        window.open(linkFile, '_blank')
      } else {
        commonHelper.showMessage('Chưa có tài liệu', 'warn')
      }
    },
    viewDocument (documents) {
      this.viewDoc.files = documents || []
      this.viewDoc.trigger = !this.viewDoc.trigger
    },
    deleteFile (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.updateModal.fileDeleted.push(this.updateModal.fileDocuments[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
        } else {
          let index = this.updateModal.fileDeleted.indexOf(this.updateModal.fileDocuments[indexFile].id)
          if (index >= 0) {
            this.updateModal.fileDeleted.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.updateModal.fileAdded.splice(indexFile, 1)
      }
    },
    pageLogChanged (page) { // Event check pagination change
      this.getTruckChangeLog(page)
      this.truckLog.pagination.current = +page
    },
    getTruckChangeLog (page = 1) {
      this.truckLog.page = page
      this.$startLoading()
      CompanyProfileService.getTruckChangeLog({type: this.truckLog.type, page, truck: this.truckData.id}).then(response => {
        if (response.data.success) {
          if (response.data.data.data && response.data.data.data.length) {
            // let data = []
            // response.data.data.data.forEach(element => {
            //   data.push({...element})
            // })
            this.truckLog.logs = response.data.data.data
            this.truckLog.pagination = response.data.data.pagination
          } else {
            this.truckLog.logs = []
          }
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warn')
        console.error(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    handleHistoryDocument (type) {
      if (type === 1) this.truckLog.title = 'Lịch sử thay đổi giấy tờ xe'
      // get history
      this.truckLog.type = type
      this.truckLog.logs = []
      this.$refs['changeLog'].show()
      this.getTruckChangeLog()
    },
    showSecurityInfoUpdate (typeSecurityInfo, typeDetail) {
      this.truckSecurityInfo.typeSecurityInfo = typeSecurityInfo
      this.truckSecurityInfo.typeDetail = typeDetail
      this.truckSecurityInfo.addSecurityInfos = []
      this.truckSecurityInfo.listCameras = []
      this.truckSecurityInfo.listSecurityInfos = []
      if (typeSecurityInfo === this.typeSecurityInfo.CAMERA && typeDetail === this.typeSecurityDetail.TYPE_CABIN) {
        this.truckSecurityInfo.updateTitle = 'Cập nhật camera cabin'
      }
      if (typeSecurityInfo === this.typeSecurityInfo.CAMERA && typeDetail === this.typeSecurityDetail.TYPE_TRUNK) {
        this.truckSecurityInfo.updateTitle = 'Cập nhật camera thùng xe'
      }
      if (typeSecurityInfo === this.typeSecurityInfo.REINFORCEMENT && typeDetail === this.typeSecurityDetail.TYPE_BARREL) {
        this.truckSecurityInfo.updateTitle = 'Cập nhật thùng xe'
      }
      if (typeSecurityInfo === this.typeSecurityInfo.REINFORCEMENT && typeDetail === this.typeSecurityDetail.TYPE_DOOR) {
        this.truckSecurityInfo.updateTitle = 'Cập nhật cửa xe'
      }
      if (typeSecurityInfo === this.typeSecurityInfo.REINFORCEMENT && typeDetail === this.typeSecurityDetail.TYPE_FLOOR) {
        this.truckSecurityInfo.updateTitle = 'Cập nhật sàn xe'
      }
      this.truckSecurityInfo.listCameras = this.truckData.cameras ? this.truckData.cameras[typeDetail] : []
      this.truckSecurityInfo.listReinforcements = this.truckData.reinforcements ? this.truckData.reinforcements[typeDetail] : []

      this.modalSecurityInfo.trigger = !this.modalSecurityInfo.trigger
    },
    showDocumentUpdate (type) {
      this.updateModal.type = type
      let title = 'Cập nhật thông tin '
      this.updateModal.isChange = false
      this.updateModal.fileAdded = []
      this.updateModal.fileDeleted = []
      this.truckData.documents.forEach(document => {
        if (type === document.type) {
          this.updateModal.numberTitle = document.numberTitle
          this.updateModal.numberValue = document.numberValue
          this.updateModal.startDateValue = document.startDateValue ? new Date(document.startDateValue) : null
          this.updateModal.endDateValue = document.endDateValue ? new Date(document.endDateValue) : null
          this.updateModal.fileDocuments = document.files
          if (type === this.type.TYPE_VEHICLE_REG) {
            this.updateDocumentTitle = 'Giấy đăng kí xe'
            this.requiredDocument = '(*) 2 mặt, rõ nét, còn hiệu lực'
            this.updateModal.numberDocRequired = 2
          } else if (type === this.type.TYPE_REGISTRY) {
            this.updateDocumentTitle = 'Giấy đăng kiểm'
            this.requiredDocument = '(*) 2 mặt, rõ nét, còn hiệu lực'
            this.updateModal.numberDocRequired = 2
          }
          return false
        }
      })
      this.updateTitle = title + this.updateDocumentTitle
      this.$refs['documentUpdate'].show()
    },
    updateDocumentUpdate (type) {
      let dataSend = new FormData()
      if (this.updateModal.numberValue) this.updateModal.numberValue = this.updateModal.numberValue.trim()
      // check
      if (!this.updateModal.numberValue) {
        return commonHelper.showMessage('Cần cập nhật số đăng ký, đăn kiểm', 'warn')
      }
      if (!this.updateModal.startDateValue) {
        return commonHelper.showMessage('Cần cập nhật thông số mới khi có tài liệu mới', 'warn')
      } else {
        // check end value
        if (this.updateModal.endDateValue && this.updateModal.endDateValue < this.updateModal.startDateValue) {
          return commonHelper.showMessage(`${this.updateModal.endDateTitle} phải lớn hơn ${this.updateModal.startDateTitle}`, 'warn')
        }
      }
      if (this.updateModal.fileAdded.length) {
        for (let i = 0; i < this.updateModal.fileAdded.length; i++) {
          dataSend.append('files[' + i + ']', this.updateModal.fileAdded[i])
        }
      }
      if ((!this.updateModal.fileAdded || this.updateModal.fileAdded.length === 0) && this.updateModal.fileDocuments.length === 0) {
        commonHelper.showMessage('Vui lòng chọn file để upload!', 'warn')
        this.$stopLoading()
        return
      }
      let docsLength = 0
      if (this.updateModal.fileDocuments) docsLength = this.updateModal.fileDocuments.length
      let maxImage = this.updateModal.fileAdded.length + docsLength - this.updateModal.fileDeleted.length
      if (maxImage > this.updateModal.numberDocRequired) {
        commonHelper.showMessage('Không được up quá ' + this.updateModal.numberDocRequired + ' ảnh!', 'warn')
        this.$stopLoading()
        return
      }
      this.addBtnDisabled = true
      if (this.updateModal.fileDeleted.length) dataSend.append('deleteDocs', JSON.stringify(this.updateModal.fileDeleted))
      dataSend.append('id', this.truckData.id)
      dataSend.append('type', this.updateModal.type)
      dataSend.append('numberValue', this.updateModal.numberValue)
      if (this.updateModal.startDateValue) dataSend.append('startDateValue', moment(new Date(this.updateModal.startDateValue)).format('YYYY-MM-DD'))
      if (this.updateModal.endDateValue) dataSend.append('endDateValue', moment(new Date(this.updateModal.endDateValue)).format('YYYY-MM-DD'))

      // dataSend.append('endDateValue', this.updateModal.endDateValue)
      CompanyProfileService.updateTruckDocument(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.$emit('updateOk')
          this.$refs['documentUpdate'].hide()
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warn')
        console.error(e)
      }).then(() => {
        this.addBtnDisabled = false
      })
    },
    formatNames (files) {
      if (files) return `${files.length} files selected`
      return ''
    },
    getUrl (file) {
      return URL.createObjectURL(file)
    },
    getTruckBarrelName (barrel) {
      return Truck.getTruckBarrelName(barrel)
    },
    getTruckFloorName (floor) {
      return Truck.getTruckFloorName(floor)
    },
    updateSecurityInfoOk () {
      this.$emit('updateOk')
    },
    saveCensor (target) {
      this.$startLoading()
      let dataSend = []
      dataSend.push(
        {
          truck_id: this.$route.params.id,
          target: target
        }
      )
      CompanyProfileService.saveCensorTruck(dataSend)
        .then((response) => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.getRecordCensor()
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra trong quá trình lưu thông tin kiểm duyệt!', 'warning')
        })
        .then(() => {
          this.$stopLoading()
        })
    },
    getRecordCensor () {
      this.$startLoading()
      CompanyProfileService.getRecordCensor({truck_id: this.truckData.id})
        .then((response) => {
          if (response.data.success) {
            let censorData = response.data.data
            this.censorRentTruck.status_profile = censorData.status_profile ? censorData.status_profile : ''
            this.censorRentTruck.status_paper = censorData.status_paper ? censorData.status_paper : ''
            this.censorRentTruck.status_security = censorData.status_security ? censorData.status_security : ''
            this.censorRentTruck.status_success = censorData.status_success ? censorData.status_success : ''
            commonHelper.showMessage(response.data.message, 'success')
          }
        })
        .catch(e => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra trong quá trình lưu thông tin kiểm duyệt!', 'warning')
        })
        .then(() => {
          this.$stopLoading()
        })
    }
  }
}
</script>

<style scoped>
.div-file-type {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
  /* max-width: 200px; */
}
.doc-img {
  height: 0px;
  visibility: hidden;
}
.span-file-type {
  font-size: 15px;
  font-weight: 500;
  color: #8c8c8c;
  line-height: 2;
}
.img-bounder {
  position: relative;
}
.img-bounder:hover > .btn-disable-file {
  display: inline;
}
.file-deleted {
  opacity: 0.1;
}
.btn-disable-file {
  font-size: 20px;
  display: none;
  position: absolute;
  top: -10px;
  right: 6px;
}
.dragdrop {
  font-size: '70px';
  height: 150px;
  position: relative;
  width: 8rem;
}
.dragdrop >>> .custom-file-label {
  border: 4px dotted green;
  height: 135px;
  line-height: 128px;
  text-align: center;
  color: green;
  padding: 0;
  margin-top: 0.5rem;
}

.dragdrop .custom-file:hover >>> .custom-file-label {
  background: rgb(15, 182, 79);
  color: #fff;
}

.dragdrop >>> .custom-file-label::after {
  display: none;
}
#modal-update-truck-document .img-bounder img {
  width: 128px;
  height: 150px;
}
</style>
<style>
.vc-text-base {
  font-size: 14px;
}
.truck-log-details {
  overflow-wrap: anywhere;
}
.document-images {
  cursor: pointer;
  height: 150px;
}
button.ladda-button {
  min-width: 112px;
}
.card-header.info-paper {
  padding: 0.875rem 0.75rem !important;
}
</style>
