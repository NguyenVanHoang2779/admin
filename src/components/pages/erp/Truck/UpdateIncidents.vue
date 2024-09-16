<template>
  <div class="update-user">
    <div class="row header">
      <div class="col-md-8">
        <h2 v-if="isAdd">Thêm sự vụ xe tải</h2>
        <h2 v-else>Sửa sự vụ xe tải</h2>
      </div>
      <div class="col-md-4">
        <b-row>
          <b-col md="12" class="text-right">
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 create-user">
        <div class="card mb-3">
          <div class="row no-gutters row-bordered">
            <div class="input-user-info col-md-12">
              <div class="row no-gutters">
                <div class="col-md-12 col-lg-12 col-xl-12">
                  <h6 class="card-header"><i class="ion  ion-ios-add-circle"></i> Thông tin sự vụ xe tải</h6>
                  <div class="card-body">
                    <b-form-row>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Ngày tai nạn
                        </template>
                        <v-date-picker color="green" placeholder="Chon thoi gian" :popover="{visibility: 'focus'}"
                                       :max-date="new Date()" v-model="incidentData.accident_day" locale="vi"/>
                      </b-form-group>
                      <b-form-group class="col-md-4" label="Username tài xế">
                        <b-input-group>
                          <multi-select-driver-truck-order
                            @input="handleSelectedDriverOption"
                            company-type="1"
                            :maxSelectedMessage="'Bạn chỉ được gán tối đa 1 tài xế!'"
                            :truckDrivers="truckDriverIds"
                            :truckOrder="truckOrder"
                            :truckId="truckId"
                            :multiple="true"
                            :maxSelected="1"
                          >
                          </multi-select-driver-truck-order>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Mức độ hư hỏng xe
                        </template>
                        <b-form-select
                          v-model="incidentData.level_damage"
                          :options="optionLevelDamages"
                          @change="onChangeLevelDamage"
                        >
                        </b-form-select>
                        <span v-show="errors.firstRule('level_damage') == 'required'" class="help is-danger">Không để trống trường này </span>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Địa điểm tai nạn
                        </template>
                        <b-form-input v-model="incidentData.accident_site" placeholder="Nhập địa điểm xảy ra tai nạn"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Số điện thoại tài xế
                        </template>
                        <b-form-input v-model="incidentData.tel" :type="'tel'" placeholder="Nhập số điện thoại"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Tình trạng sửa chữa xe
                        </template>
                        <b-form-select name="status_repair"
                          v-model="incidentData.status_repair"
                          :options="optionStatusRepairs"
                          @change="onChangeStatusRepair"
                        >
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-md-4">
                        <template slot='label'>
                          Chi phí sửa chữa
                        </template>
                        <b-form-input
                          v-model="incidentData.fee"
                          id="form_fee"
                          name="form_fee"
                          placeholder="Nhập chi phí sửa chữa"
                          v-validate="'required'"
                          @update="convertMoney"
                          :formatter="convertMoney"
                          :class="{'is-danger': errors.has('form_fee')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('form_fee') == 'required'" class="help is-danger">Không để trống trường này </span>
                        <span v-show="errors.firstRule('form_fee') == 'numeric'" class="help is-danger">Vui lòng điền số </span>
                      </b-form-group>
                      <b-form-group class="col-md-8">
                        <div class="template-label cursor-pointer tm-img">
                          <div class="col-form-label">Phiếu báo giá sửa chữa</div>
                          <template>
                            <div class="text-left img-incident">
                              <div v-for="(file, index) in fileDocuments" :key="index + 'files'" class="dv-img-incident">
                                <div v-if="file.link" class="img-bounder mt-1 mb-4" :key="index + 'files'">
                                  <span @click="deleteFile($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                                  <b-img
                                    :src="file.link" :alt="''" class="rounded mt-2 mr-3" style="height: 135px; width: 128px;"
                                  ></b-img>
                                </div>
                              </div>
                              <div v-for="(file, index) in fileAdded" class="img-bounder mt-1 mb-4 aa" :key="index">
                                <span @click="deleteFile($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                                <a href="javascript:void(0)">
                                  <b-img
                                    :src="getUrl(file)" :alt="''" class="rounded mt-2 mr-3" style="height: 135px; width: 128px;"
                                  >
                                  </b-img>
                                </a>
                              </div>
                              <div class="img-bounder mt-1 mb-4" v-if="!fileDocuments || (fileAdded.length < fileAddedRoot) || (fileDeleted.length && fileAdded.length < 1) || (!fileDeleted.length && fileDocuments.length < 1 && fileAdded.length < 1)">
                                <b-form-group class="dragdrop font-size">
                                  <b-form-file
                                    accept="image/*"
                                    v-model="fileAdded"
                                    multiple
                                    placeholder="+"
                                    drop-placeholder="Drop file"
                                    :file-name-formatter="formatNames"
                                  >
                                  </b-form-file>
                                  <div class="fs-avatar-txt">Tải ảnh lên</div>
                                </b-form-group>
                              </div>
                            </div>
                          </template>
                        </div>
                      </b-form-group>
                    </b-form-row>
                  </div>
                  <div class="card-footer border-0 text-right py-3">
                    <ladda-btn v-if="isAdd" :loading="isProcessingUpdate" @click.native="updateIncident()" data-style="expand-right" class="btn btn-success">
                      Cập nhật
                    </ladda-btn>
                    <ladda-btn v-else :loading="isProcessingUpdate" @click.native="updateIncident()" data-style="expand-right" class="btn btn-success">
                      Cập nhật
                    </ladda-btn>
                  </div>
                </div>
              </div>
            </div>
            <notifications group='add-truck-incident'></notifications>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import CompanyProfileService from 'domain/services/company-profile-service'
import SingleSelectDriver from 'components/elements/common/SingleSelectDriver'
import MultiSelectDriverTruckOrder from 'components/elements/common/MultiSelectDriverTruckOrder'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  name: 'update-incidents',
  components: {
    LaddaBtn,
    Notification,
    Multiselect,
    MultiSelectUser,
    FileViewUpload,
    CompanyProfileService,
    SingleSelectDriver,
    MultiSelectDriverTruckOrder,
    commonHelper
  },
  data: () => ({
    notify: {
      message: '',
      class: '',
      title: '',
      duration: ''
    },
    incidentData: {
      accident_day: '',
      driver: {},
      level_damage: '',
      accident_site: '',
      tel: '',
      fee: '',
      truckDriver: ''
    },
    optionLevelDamages: [
      { value: 'light', text: 'Nhẹ' },
      { value: 'relatively', text: 'Tương đối' },
      { value: 'heavy', text: 'Nặng' },
      { value: null, text: 'Khác' }
    ],
    optionStatusRepairs: [
      { value: 'fixed', text: 'Đã sửa xong' },
      { value: 'repairing', text: 'Đang sửa chữa' },
      { value: null, text: 'Khác' }
    ],
    files: [],
    fileAdd: [],
    fileDelete: [],
    image: [],
    truckId: null,
    truckDriverIds: '',
    truckOrder: 0,
    isProcessingUpdate: false,
    fileDocuments: [],
    fileAdded: [],
    fileAddedRoot: 0,
    fileDeleted: []
  }),

  created () {
    commonHelper.validateStatusEcomTruckFlow()
    if (this.isAdd) {
      if (!this.truckId) {
        if (this.$route.params.id) {
          this.truckId = this.$route.params.id
        }
      } else {
        this.truckId = this.truckId
      }
    } else {
      // Load chi tiết 1 sự vụ xe tải và username đã từng đi xe này
      if (this.$route.params.id) {
        this.getTruckIncident()
      }
    }
  },

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-incident'
    },

    isEdit: function () {
      return this.$route.name === 'edit-incident'
    },
    getStartDate () {
      var endDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1)
      return endDate.toISOString().slice(0)
    }
  },

  watch: {

  },

  methods: {
    onChangeLevelDamage (val) {
      this.incidentData.level_damage = val
    },
    onChangeStatusRepair (val) {
      this.incidentData.status_repair = val
    },
    selectedDriver (option) {
      this.incidentData.driver = option
    },
    covertNumberInput (number) {
      return +(number + '').replace(/\D/g, '')
    },
    convertMoney (money) {
      let result = (money + '').replace(/\D/g, '')
      return commonHelper.formatMoney(+result)
    },
    handleSelectedDriverOption (option) {
      this.incidentData.truckDriver = option
    },
    updateTruckDriverValue () {
      this.truckDriverIds = ''
      if (this.incidentData.truckDriver) {
        this.incidentData.truckDriver.forEach((element) => {
          this.truckDriverIds += `${element.id},`
        })
      }
    },
    getTruckIncident () {
      this.$startLoading()
      CompanyProfileService.getTruckIncident({id: this.$route.params.id}).then(response => {
        if (response.data.success) {
          let info = response.data.data
          if (info.accident_day) this.incidentData.accident_day = new Date(info.accident_day)
          this.incidentData.accident_site = info.accident_site || null
          this.truckDriverIds = info.truckDriver ? info.truckDriver : 0
          this.incidentData.level_damage = info.level_damage || null
          this.incidentData.status_repair = info.status_repair || null
          this.incidentData.tel = info.tel || null
          this.incidentData.fee = this.convertMoney(info.fee)
          this.incidentData.image = info.image
          this.incidentData.driver_id = info.driver_id
          this.incidentData.id = info.id
          this.truckId = info.truck_id
          this.truckOrder = parseInt(info.truck_order)

          this.fileDocuments = info.image
          if (info.image != null) {
            this.editFile = false
            this.onlyDelete = true
            this.image = info.image.split(',').map(s => s.trim())
            var links = []
            this.image.map(function (item, i) {
              links.push({link: item})
            })
            this.files = links
            this.fileDocuments = links
          }
        } else {
          let info = response.data.data
          this.truckOrder = parseInt(info.truck_order)
          this.truckId = info.truck_id
          if (!this.isAdd) {
            commonHelper.showMessage(response.data.message, 'warn')
          }
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    updateIncident () {
      let validate = null
      let dataSend = new FormData()
      if (!this.fileAdded) {
        commonHelper.showMessage('Vui lòng chọn file để upload !')
        this.$stopLoading()
        return
      }
      let docsLength = 0
      if (this.fileDocuments) docsLength = this.fileDocuments.length
      if ((this.fileAdded.length + docsLength - this.fileDeleted.length) > 5) return commonHelper.showMessage('Không được up quá 5 ảnh', 'warn')
      validate = ['accident_day', 'level_damage', 'accident_site', 'tel', 'fee']
      this.$validator.validateAll(validate).then((result) => {
        if (result) {
          if (this.isEdit) {
            dataSend.append('id', this.$route.params.id || '')
          }
          if (this.fileAdded.length) {
            for (let i = 0; i < this.fileAdded.length; i++) {
              dataSend.append('file[' + i + ']', this.fileAdded[i])
            }
          }
          if (this.fileDocuments) {
            for (let i = 0; i < this.fileDocuments.length; i++) {
              if (this.fileDocuments[i].length > 0) {
                dataSend.append('fileDocs[]', this.fileDocuments[i])
              }
            }
          }
          if (this.fileDeleted.length) {
            var arrLinks = this.fileDocuments
            var linkDels = this.fileDeleted
            for (let i = 0; i < this.fileDocuments.length; i++) {
              var urlLink = arrLinks.indexOf(linkDels[i])
              if (urlLink > -1) arrLinks.splice(urlLink, 1)
              if (arrLinks[i].link) arrLinks[i] = this.fileDocuments[i].link
            }
            dataSend.append('link', arrLinks)
          }

          if (this.fileDeleted.length) dataSend.append('deleteDocs', JSON.stringify(this.fileDeleted))
          dataSend.append('truck_id', this.truckId || '')
          dataSend.append('accident_day', this.incidentData.accident_day ? moment(new Date(this.incidentData.accident_day)).format('YYYY-MM-DD HH:mm:ss') : '')
          dataSend.append('userid_driver', JSON.stringify(this.incidentData.truckDriver) || '')
          dataSend.append('username_driver', this.incidentData.username_driver || '')
          dataSend.append('level_damage', this.incidentData.level_damage || '')
          dataSend.append('accident_site', this.incidentData.accident_site || '')
          dataSend.append('status_repair', this.incidentData.status_repair || '')
          dataSend.append('tel', this.incidentData.tel || '')
          dataSend.append('fee', this.covertNumberInput(this.incidentData.fee) || '')
          this.isProcessingUpdate = true
          CompanyProfileService.updateIncident(dataSend).then(response => {
            this.fileDelete = []
            this.fileDeleted = []
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                this.fileAdd = []
                this.fileAdded = []
                this.incidentData = response.data.data.ErpTruckIncident
                if (this.incidentData.accident_day) this.incidentData.accident_day = new Date(this.incidentData.accident_day)
                commonHelper.showMessage(response.data.message, 'success')
                this.$router.push({ name: 'edit-vehicle-company', params: { id: this.truckId } })
                if (this.incidentData.image != null) {
                  this.editFile = false
                  this.onlyDelete = true
                  this.image = this.incidentData.image.split(',').map(s => s.trim())
                  var links = []
                  this.image.map(function (item, i) {
                    links.push({link: item})
                  })
                  this.files = links
                  this.fileDocuments = links
                }
                this.$stopLoading()
              } else {
                commonHelper.showMessage(response.data.message, 'warn')
              }
            } else {
              this.notify.success = false
            }
          }).catch(e => {
            this.notify.success = false
            this.notify.message = 'Có lỗi xảy ra, liên hệ IT để được hỗ trợ'
            this.showNotification(false)
          }).then(() => {
            this.isProcessingUpdate = false
          })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng kiểm tra thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        commonHelper.showMessage('Có lỗi xảy ra', 'warn')
        console.log(e)
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
        group: 'add-truck-incident',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify,
        duration: this.notify.duration
      })
    },
    openLink (linkFile) {
      if (linkFile) {
        window.open(linkFile, '_blank')
      } else {
        commonHelper.showMessage('Chưa có tài liệu', 'warn')
      }
    },
    getFileType (file) {
      if (!file) return null
      let ext = ''
      if (typeof file === 'string') { // là link
        ext = file.split('?').shift().split('.').pop().toLowerCase()
      } else ext = file.name.split('.').pop().toLowerCase() // là File

      if (file.indexOf('image') === 0) {
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/svg'].includes(ext)) return 'image'// là ảnh
      }

      if (['jpeg', 'png', 'gif', 'tiff', 'psd', 'jpg', 'eps', 'ai', 'indd', 'raw', 'bmp', 'svg'].includes(ext)) return 'image'// là ảnh
      if (['pdf'].includes(ext)) return 'pdf' // là pdf
      if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc' // là doc
      if (['xls', 'xlsx', 'xlsb'].includes(ext)) return 'excel' // là excel
      if (['txt', 'csv'].includes(ext)) return 'text' // là text
      if (['mpeg', 'mp4', 'avi', 'ts', 'webm', '3gp', '3g2'].includes(ext)) return 'video' // là video
      if (['mp3', 'aac', 'ogg', 'opus', 'wav'].includes(ext)) return 'audio' // là audio
      if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'zip' // là file nén
      return 'other'
    },
    deleteFile (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.fileDeleted.push(this.fileDocuments[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
          this.fileDocuments[indexFile] = []
        } else {
          let index = this.fileDeleted.indexOf(this.fileDocuments[indexFile].id)
          if (index >= 0) {
            this.fileDeleted.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
            this.fileDocuments[index] = []
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.fileAddedRoot = this.fileAdded.length
        this.fileAdded.splice(indexFile, 1)
      }
    },
    formatNames (files) {
      if (files) return '+'
      return ''
    },
    getUrl (file) {
      return URL.createObjectURL(file)
    }
  }

}
</script>

<style>
  .img-incident .img-bounder {
    position: relative;
    display: inline-block;
  }
  .img-incident .img-bounder:hover > .btn-disable-file {
    display: inline;
  }
  .scrollbar-file .bounder {
    position: relative;
    display: inline-block;
  }
  .bounder:hover > .btn-disable-file {
    display: inline;
  }
  .file-deleted {
    opacity: 0.1;
  }
  .img-incident .btn-disable-file {
    font-size: 20px;
    display: none;
    position: absolute;
    top: -10px;
    right: 6px;
  }
  .img-incident .dragdrop {
    font-size: 70px;
    position: relative;
    width: 8rem;
  }
  .img-incident .file-label-inner {
    border: 2px dashed #b8b9bb !important;
  }
  .img-incident .dragdrop .custom-file-label {
    border: 2px dashed #b8b9bb !important;
    height: 135px;
    line-height: 128px;
    text-align: center;
    color: green;
    padding: 0;
    margin-top: 0.5rem;
  }
  .img-incident .dragdrop .custom-file-label::after {
    display: none;
  }

  .img-incident .dragdrop .custom-file:hover >>> .custom-file-label {
    background: rgb(15, 182, 79);
    color: #fff;
  }

  .img-incident .dragdrop >>> .custom-file-label::after, .custom-file-label::after {
    display: none;
  }
  .tm-img .d-inline-block {
    display: block !important;
  }
  .img-incident .dv-img-incident {
    display: inline-block;
  }
  .img-incident .fs-avatar-txt {
    position: absolute;
    z-index: 999;
    top: 101px;
    font-size: 14px;
    text-align: center;
    left: 0;
    right: 0;
  }
</style>

<style scoped>
</style>
