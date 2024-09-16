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
                  <div class="row card-header col-md-12" v-for="(item ,index) in truckData.documents" v-bind:key="`${index}-${item.id}`">
                      <div class="row col-md-12">
                        <label class="col-md-3 font-weight-bold">{{item.header}}</label>
                      </div>
                      <div class="row col-md-12">
                        <div class="col-md-3" v-if="item.type == type.TYPE_VEHICLE_REG || item.type == type.TYPE_REGISTRY">
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
                        <div class="col-md-3" v-if="item.type != type.TYPE_VEHICLE_REG && item.type != type.TYPE_REGISTRY"></div>
                        <div  class="col-md-1 text-right" v-if="!isViewManagerTruck">
                          <b-button variant="outline-success" @click="showDocumentUpdate(item.type)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row card-header col-md-12">
                    <div class="row col-md-12">
                      <label class="col-md-3 font-weight-bold" style="margin-left: 0.7rem;">Giấy thế chấp ngân hàng</label>
                    </div>
                    <div class="row col-md-12">
                      <div class="col-md-3">
                        <label style="margin-left: 0.7rem;">Ngày cấp:</label>&nbsp; {{ truckBankMortgage.startDate }}
                      </div>
                      <div class="col-md-3">
                        <label style="margin-left: 0.3rem;">Ngày hết hạn:</label>&nbsp; {{ truckBankMortgage.endDate }}
                      </div>
                      <div class="col-md-2">
                        <label slot='label'>Ảnh: </label> <b-link v-b-modal.mortgage-bank>Link</b-link>
                      </div>
                      <div class="col-md-3"></div>
                      <div class="col-md-1 text-right" v-if="!isViewManagerTruck">
                        <b-button style="margin-right: 0.8rem;" variant="outline-success" v-b-modal.modal-update-mortgage size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
                      </div>
                    </div>
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
                <span v-if="updateModal.type === type.TYPE_BADGE" class="text-danger">(*)</span>
                <v-date-picker :max-date="new Date()" :popover="{visibility: 'focus'}" color="green" v-model="updateModal.startDateValue" locale="vi"/>
              </b-form-group>
              <b-form-group >
                <label class="form-label">{{updateModal.endDateTitle}}</label>
                <span v-if="updateModal.type === type.TYPE_BADGE" class="text-danger">(*)</span>
                <v-date-picker :min-date="updateModal.startDateValue" :popover="{visibility: 'focus'}" color="green" v-model="updateModal.endDateValue" locale="vi"/>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-row>
                <b-col md="6">
                  <label class="form-label font-weight-bold" >{{updateDocumentTitle}}</label>
                  <span v-if="updateModal.type === type.TYPE_BADGE" class="text-danger">(*)</span>
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
          <h6><i class="ion ion-ios-add-circle"></i> Thông tin phụ tùng xe</h6>
        </b-col>
        <b-col md="3" class="text-right">
          <b-button variant="outline-secondary" @click="handleHistoryDocument(2)" size="sm"><i class="ion ion-md-document"></i> Xem lịch sử thay thế</b-button>
        </b-col>
      </b-row>
      <b-row class="card-header col-md-12">
        <b-row class="col-md-12 font-weight-bold"><b-col md="3">Lốp</b-col></b-row>
        <b-row class="col-md-12">
          <b-col md="3"><span class="font-weight-bold">Số lượng:</span> {{truckData.tires ? truckData.tires.length : 0}}</b-col>
          <b-col md="6"><span class="font-weight-bold">Số seri:</span> <span v-for="(truckComponent, index) in truckData.tires" :key="truckComponent.id">{{truckComponent.seri_number}}<span v-if="truckData.tires && index!=(truckData.tires.length -1)">, </span> </span></b-col>
          <b-col md="3" class="text-right" v-if="!isViewManagerTruck">
            <b-button variant="outline-success" @click="showComponentUpdate(typeComponent.TIRE)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
          </b-col>
        </b-row>
      </b-row>
      <b-row class="card-header col-md-12">
        <b-row class="col-md-12 font-weight-bold"><b-col md="3">Ắc quy</b-col></b-row>
        <b-row class="col-md-12">
          <b-col md="3"><span class="font-weight-bold">Số lượng:</span> {{truckData.batteries ? truckData.batteries.length : 0}}</b-col>
          <b-col md="6"><span class="font-weight-bold">Số seri:</span> <span v-for="(truckComponent, index) in truckData.batteries" :key="truckComponent.id">{{truckComponent.seri_number}}<span v-if="truckData.batteries && index!=(truckData.batteries.length -1)">, </span> </span></b-col>
          <b-col md="3" class="text-right" v-if="!isViewManagerTruck">
            <b-button variant="outline-success" @click="showComponentUpdate(typeComponent.BATTERY)" size="sm"><i class="ion ion-md-create"></i> Cập nhật</b-button>
          </b-col>
        </b-row>
      </b-row>
    </div>
    <b-modal hide-footer id="modal-update-truck-component" ref="componentUpdate" modal-class="modal-xl" header-bg-variant="success text-white" :title="truckComponentInfo.updateTitle" ok-only centered>
      <b-row class="mb-2">
        <b-col md="3">Số lượng: {{truckComponentInfo.numberComponent}}</b-col>
      </b-row>
      <b-row class="mb-3" align-v="center" v-for="(component, index) in truckComponentInfo.listComponents" :key="index">
        <b-col md="3">
          <b-form-input v-model="component.text" :disabled="true"></b-form-input>
        </b-col>
        <b-col md="3">
          <b-form-input placeholder="Nhập số seri" v-model.lazy="component.numberValue" @change="addComponent(index, {numberValue: component.numberValue})">{{component.text}}</b-form-input>
        </b-col>
        <b-col md="3">
           <b-form-group label-cols-sm="3" label="Ngày lắp" class="mb-0">
             <v-date-picker :max-date="new Date()" :popover="{visibility: 'focus'}" class="font-size-14px" color="green" v-model="component.startValue" locale="vi" @input="onChangeStartDateUpload(index)" />
           </b-form-group>
        </b-col>
        <b-col md="2">
          Ảnh
          <b-link class="ml-2" @click="component.file && openLink(component.file.link_file)">Link</b-link>
          <b-link class="ml-2" @click="onClickUpload(index)">Tải mới</b-link>
          <b-form-file :ref="`fileInput-${index}`" accept="image/*, .pdf" class="d-none" @change="onChangeFileUpload($event, index)"></b-form-file>
        </b-col>
      </b-row>
      <b-row class="mb-2" align-h="center">
        <b-button variant="success"  @click="submitComponentUpdate" :disabled="truckComponentInfo.addBtnDisabled">Cập nhật</b-button>
      </b-row>
    </b-modal>
    <modal-view-documents :trigger="viewDoc.trigger" :files="viewDoc.files" :title="viewDoc.title"></modal-view-documents>
    <modal-mortgage-image :mortgageImage="truckBankMortgage.mortgageImage"></modal-mortgage-image>
    <modal-update-mortgage :item="itemMortgage" :truckOrder="truckData.order" @reloadUpdateMortgage="reloadUpdateMortgage"></modal-update-mortgage>
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

Vue.use(Viewer)
Vue.use(VueImg, {
  altAsTitle: true
})

export default {
  name: 'update-trucks-component',
  components: {
    ModalViewDocuments,
    ModalMortgageImage,
    ModalUpdateMortgage
  },

  props: [
    'truckData', 'isMoreInfo', 'isViewManagerTruck'
  ],

  data: () => ({
    viewDoc: {
      trigger: false,
      files: [],
      title: 'Chi tiết tài liệu'
    },
    type: {
      TYPE_VEHICLE_REG: 20,
      TYPE_REGISTRY: 21,
      TYPE_LIABILITY_INSURANCE: 22,
      TYPE_BODY_INSURANCE: 23,
      TYPE_BADGE: 33 // Phù hiệu
    },
    typeComponent: {
      TIRE: 1, // lốp xe
      BATTERY: 2 // ắc quy
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
    typeBatteryId: {
      TYPE_1: 9,
      TYPE_2: 10
    },
    truckComponentInfo: {
      addBtnDisabled: false,
      updateTitle: '',
      numberComponent: 0,
      typeComponent: 0,
      tires: [],
      batteries: [],
      listComponents: [],
      addComponents: [],
      typeTireOptions: [
        {text: 'Lốp trên trái', value: '1'},
        {text: 'Lốp trên phải', value: '2'},
        {text: 'Lốp dưới trái ngoài', value: '3'},
        {text: 'Lốp dưới trái trong', value: '4'},
        {text: 'Lốp dưới phải ngoài', value: '5'},
        {text: 'Lốp dưới phải trong', value: '6'},
        {text: 'Lốp dự phòng 1', value: '7'},
        {text: 'Lốp dự phòng 2', value: '8'}
      ],
      typeBatteryOptions: [
        {text: 'Ắc quy 1', value: '9'},
        {text: 'Ắc quy 2', value: '10'}
      ]
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
    },
    truckBankMortgage: {
      startDate: '',
      endDate: '',
      mortgageImage: null
    },
    itemMortgage: {},
    mortgageBankImage: null
  }),

  created () {
    this.getTruckBankMortgage()
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
    submitComponentUpdate () {
      // submit update component
      // valid addComponent

      let dataSend = new FormData()
      let submitComponent = []
      let deletedFiles = []
      let requiredFail = null
      this.truckComponentInfo.addComponents.forEach((addComponent, index) => {
        // check change
        let newComponent = {typeId: addComponent.type, typeComponent: this.truckComponentInfo.typeComponent}
        let isChange = false
        let sourceComponent = this.truckComponentInfo.listComponents[index]
        if (addComponent.numberValue !== sourceComponent.seri_number) {
          isChange = true
          newComponent.numberValue = addComponent.numberValue
        }
        // check !()
        if (!addComponent.numberValue) {
          requiredFail = 'Không được bỏ trống số seri ' + addComponent.text
          return false
        }
        if (!addComponent.startValue) {
          requiredFail = 'Không được bỏ trống ngày lắp ' + addComponent.text
          return false
        }
        let startValue = moment(addComponent.startValue).format('YYYY-MM-DD')
        if (startValue !== sourceComponent.start_date) {
          isChange = true
          newComponent.startDateValue = startValue
        }
        if (addComponent.file) {
          isChange = true
          addComponent.file.typeId = addComponent.type
          dataSend.append('files[' + index + ']', addComponent.file)
          newComponent.uploadFile = 1
          if (addComponent.delFile) deletedFiles.push(addComponent.delFile)
        }
        if (sourceComponent.id) newComponent.id = sourceComponent.id
        if (isChange) {
          submitComponent.push(newComponent)
        }
      })
      if (requiredFail) return commonHelper.showMessage(requiredFail, 'warn')
      if (submitComponent.length) {
        this.truckComponentInfo.addBtnDisabled = true
        // submit update
        dataSend.append('components', JSON.stringify(submitComponent))
        if (deletedFiles.length) dataSend.append('deletedFiles', JSON.stringify(deletedFiles))
        dataSend.append('truckId', this.truckData.id)
        CompanyProfileService.updateTruckComponent(dataSend).then(response => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.$emit('updateOk')
            this.$refs['componentUpdate'].hide()
          } else {
            commonHelper.showMessage(response.data.message, 'warn')
          }
        }).catch((e) => {
          commonHelper.showMessage('Đã có lỗi xảy ra', 'warn')
          console.error(e)
        }).then(() => {
          this.truckComponentInfo.addBtnDisabled = false
        })
      } else {
        this.$refs['componentUpdate'].hide()
      }
    },
    addComponent (index, data) {
      let sourceCom = this.truckComponentInfo.listComponents[index]
      if (!this.truckComponentInfo.addComponents[index]) {
        this.truckComponentInfo.addComponents[index] = {numberValue: '', startValue: '', type: sourceCom.value}
      }
      if (data.files && data.files[0]) {
        // change file upload
        this.truckComponentInfo.addComponents[index].file = data.files[0]

        // if exist file -> add to delete
        if (sourceCom && sourceCom.file) this.truckComponentInfo.addComponents[index].delFile = sourceCom.file.id
      }
      this.truckComponentInfo.addComponents[index].text = sourceCom.text
      this.truckComponentInfo.addComponents[index].numberValue = sourceCom.numberValue
      this.truckComponentInfo.addComponents[index].startValue = sourceCom.startValue
      this.truckComponentInfo.numberComponent = this.countComponent()
    },
    onChangeFileUpload (event, index) {
      // add to upload files
      this.addComponent(index, event.target)
    },
    onChangeStartDateUpload (index) {
      // add to upload files
      let {startValue} = this.truckComponentInfo.listComponents[index]
      if (startValue && moment(startValue).format('YYYY-MM-DD') !== this.truckComponentInfo.listComponents[index].start_date) this.addComponent(index, {startValue})
    },
    onClickUpload (index) {
      this.$refs[`fileInput-${index}`][0].$el.childNodes[0].click()
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
      if (type === 2) this.truckLog.title = 'Lịch sử thay thế phụ tùng'
      // get history
      this.truckLog.type = type
      this.truckLog.logs = []
      this.$refs['changeLog'].show()
      this.getTruckChangeLog()
    },
    showComponentUpdate (type) {
      this.truckComponentInfo.numberComponent = 0
      this.truckComponentInfo.typeComponent = type
      this.truckComponentInfo.addComponents = []
      this.truckComponentInfo.listComponents = []
      if (type === this.typeComponent.TIRE) {
        this.truckComponentInfo.listComponents = [...this.truckComponentInfo.typeTireOptions]
        this.truckComponentInfo.updateTitle = 'Cập nhật thông tin lốp xe'
      }
      if (type === this.typeComponent.BATTERY) {
        this.truckComponentInfo.listComponents = [...this.truckComponentInfo.typeBatteryOptions]
        this.truckComponentInfo.updateTitle = 'Cập nhật thông tin ắc quy'
      }
      this.truckComponentInfo.listComponents.forEach((element, index) => {
        // find in component
        let components = type === this.typeComponent.TIRE ? this.truckData.tires : this.truckData.batteries
        components.forEach((component) => {
          if (component.type_id === element.value) {
            this.truckComponentInfo.listComponents[index] = {...element, ...component, startValue: component.start_date ? new Date(component.start_date) : null, numberValue: component.seri_number}
            this.truckComponentInfo.numberComponent++
            return false
          }
        })
      })
      this.$refs['componentUpdate'].show()
    },
    countComponent () {
      let count = 0
      this.truckComponentInfo.listComponents.forEach((component, index) => {
        if (component.numberValue || (this.truckComponentInfo.addComponents[index] && this.truckComponentInfo.addComponents[index].numberValue)) count++
      })
      return count
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
          } else if (type === this.type.TYPE_LIABILITY_INSURANCE) {
            this.updateDocumentTitle = 'Bảo hiểm TNDS'
            this.requiredDocument = 'Giấy chứng nhận bảo hiểm'
            this.updateModal.numberDocRequired = 1
          } else if (type === this.type.TYPE_BODY_INSURANCE) {
            this.updateDocumentTitle = 'Bảo hiểm thân vỏ'
            this.requiredDocument = 'Giấy chứng nhận bảo hiểm'
          } else if (type === this.type.TYPE_BADGE) {
            this.updateDocumentTitle = 'Phù hiệu'
            this.requiredDocument = 'Phù hiệu xe tải'
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
      if (this.updateModal.type === this.type.TYPE_BADGE) {
        if (!this.updateModal.startDateValue) {
          return commonHelper.showMessage('Vui lòng điền đầy đủ thông tin', 'warn')
        }
        if (!this.updateModal.endDateValue) {
          return commonHelper.showMessage('Vui lòng điền đầy đủ thông tin', 'warn')
        }
      }
      if (!this.updateModal.startDateValue) {
        return commonHelper.showMessage('Cần cập nhật thông số mới khi có tài liệu mới', 'warn')
      } else {
        // check end value
        if (this.updateModal.endDateValue && this.updateModal.endDateValue < this.updateModal.startDateValue) {
          if (type === this.type.TYPE_BADGE) {
            return commonHelper.showMessage('Vui lòng nhập ngày hết hạn lớn hơn ngày cấp', 'warn')
          }
          return commonHelper.showMessage(`${this.updateModal.endDateTitle} phải lớn hơn ${this.updateModal.startDateTitle}`, 'warn')
        }
      }
      if (this.updateModal.fileAdded.length) {
        for (let i = 0; i < this.updateModal.fileAdded.length; i++) {
          dataSend.append('files[' + i + ']', this.updateModal.fileAdded[i])
        }
      }
      if (this.updateModal.type === this.type.TYPE_BADGE) {
        if ((!this.updateModal.fileAdded || this.updateModal.fileAdded.length === 0) && (this.updateModal.fileDocuments.length === 0 || this.updateModal.fileDeleted.length > 0)) {
          return commonHelper.showMessage('Vui lòng điền đầy đủ thông tin', 'warn')
        }
        if (this.updateModal.fileAdded && this.updateModal.fileAdded.length > 2) {
          return commonHelper.showMessage('Chỉ có thể upload tối đa 2 ảnh', 'warn')
        }
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
    getTruckBankMortgage () {
      this.$startLoading()
      let params = {
        truck_order: this.truckData.order
      }
      CompanyProfileService.getTruckBankMortgage(params)
        .then((res) => {
          if (res.data.success) {
            this.itemMortgage = res.data.data
            this.truckBankMortgage.startDate = res.data.data.start_date
            this.truckBankMortgage.endDate = res.data.data.end_date
            this.truckBankMortgage.mortgageImage = res.data.data.mortgage_image
          } else {
            this.truckBankMortgage = {}
            this.itemMortgage = {}
            this.truckBankMortgage.startDate = ''
            this.truckBankMortgage.endDate = ''
            this.truckBankMortgage.mortgageImage = null
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    reloadUpdateMortgage () {
      this.getTruckBankMortgage()
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
</style>
