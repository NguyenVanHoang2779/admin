<template>
  <b-modal hide-footer id="modal-update-security-info" ref="securityInfoUpdate" modal-class="modal-xl" @show="fillData" @hidden="reset" header-bg-variant="success text-white" :title="myTitle" ok-only centered>
    <!-- popup camera -->
    <b-row class="mb-3" v-if="type_info === 1 && (type_detail === 1 || type_detail === 2)">
      <b-col md="6">
        <b-form-group>
          <label class="form-label">Số lượng</label>
          <b-form-input placeholder="" v-model="quantity" type="number" min="1"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-row>
          <b-col md="6">
            <label class="form-label font-weight-bold" v-if="type_detail === 1">Camera cabin</label>
            <label class="form-label font-weight-bold" v-else>Camera thùng xe</label>
          </b-col>
        </b-row>
        <b-row>
          <file-view-upload
            :file-add="fileAdded"
            :file-delete="fileDeleted"
            :file-delete-id="fileDeleteId"
            :files="fileDocuments"
            :edit="true"
            :inputPlaceholder="'+'"
            :hideUploadButton="true"
            accept='image/*'
            :inputId="'input-door-camera'"
          ></file-view-upload>
        </b-row>
      </b-col>
    </b-row>
    <!-- popup gia cố xe: Cập nhật thùng xe -->
    <b-row class="mb-3" v-if="type_info === 2 && type_detail === 3">
      <b-col md="4">
        <b-form-group>
          <template slot='label'>
            Loại thùng
          </template>
          <b-form-select v-model="barrel_type" :options="optionTruckBarrelType" @change="changeBarrelStatus" name="truck_barrel_type" >
            <template v-slot:first>
              <option :value="null" disabled>-- Chọn loại thùng--</option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="8">
        <b-row>
          <b-col md="6">
            <label class="form-label font-weight-bold" >Thùng xe</label>
            <file-view-upload
              :file-add="fileAdded"
              :file-delete="fileDeleted"
              :file-delete-id="fileDeleteId"
              :files="fileDocuments"
              :edit="canEdit"
              :is-show-file-exist="canEdit"
              :inputPlaceholder="'+'"
              :hideUploadButton="true"
              accept='image/*'
              :inputId="'input-barrel'"
            ></file-view-upload>
          </b-col>
          <b-col md="6">
            <label class="form-label font-weight-bold" >Móc cài seal</label>
            <file-view-upload
              :file-add="fileAddedTwo"
              :file-delete="fileDeletedTwo"
              :file-delete-id="fileDeleteIdTwo"
              :files="fileDocumentsTwo"
              :edit="canEditTwo"
              :is-show-file-exist="canEditTwo"
              :inputPlaceholder="'+'"
              :hideUploadButton="true"
              accept='image/*'
              :inputId="'input-seal'"
            ></file-view-upload>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- popup gia cố xe: Cập nhật cửa xe -->
    <b-row class="mb-3" v-if="type_info === 2 && type_detail === 4">
      <b-col md="12">
        <b-row>
          <b-col md="6">
            <label class="form-label font-weight-bold" >Cửa thùng sau</label>
            <file-view-upload
              :file-add="fileAdded"
              :file-delete="fileDeleted"
              :file-delete-id="fileDeleteId"
              :files="fileDocuments"
              :edit="true"
              :inputPlaceholder="'+'"
              :hideUploadButton="true"
              accept='image/*'
              :inputId="'input-door-rear'"
            ></file-view-upload>
          </b-col>
          <b-col md="6">
            <label class="form-label font-weight-bold" >Cửa bên hông</label>
            <file-view-upload
              :file-add="fileAddedTwo"
              :file-delete="fileDeletedTwo"
              :file-delete-id="fileDeleteIdTwo"
              :files="fileDocumentsTwo"
              :edit="true"
              :inputPlaceholder="'+'"
              :hideUploadButton="true"
              accept='image/*'
              :inputId="'input-door-side'"
            ></file-view-upload>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- popup gia cố xe: Cập nhật sàn xe -->
    <b-row class="mb-3" v-if="type_info === 2 && type_detail === 5">
      <b-col md="6">
        <b-form-group class="col-md-8">
          <template slot='label'>
            Loại sàn
          </template>
          <b-form-select v-model="floor_type" :options="optionTruckFloorType" name="truck_floor_type" >
            <template v-slot:first>
              <option :value="null" disabled>-- Chọn loại sàn--</option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-row>
          <b-col md="6">
            <label class="form-label font-weight-bold" >Sàn xe</label>
          </b-col>
        </b-row>
        <b-row>
          <file-view-upload
            :file-add="fileAdded"
            :file-delete="fileDeleted"
            :file-delete-id="fileDeleteId"
            :files="fileDocuments"
            :edit="true"
            :inputPlaceholder="'+'"
            :hideUploadButton="true"
            accept='image/*'
            :inputId="'input-floor'"
          ></file-view-upload>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mb-2" align-h="center">
      <b-button variant="success"  @click="submitSecurityInfoUpdate" :disabled="false">Cập nhật</b-button>
    </b-row>
  </b-modal>
</template>
<script>
import VueImg from 'v-img'
import Viewer from 'v-viewer'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CompanyProfileService from 'domain/services/company-profile-service'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import moment from 'moment'
export default {
  props: ['trigger', 'title', 'truckSecurityInfo', 'truckData'],
  name: 'modal-security-info',

  components: {
    FileViewUpload,
    VueImg,
    Viewer
  },
  data: () => ({
    myTitle: '',
    securityInfo: this.truckSecurityInfo,
    type_info: 1,
    type_detail: 1,
    type_id: 26,
    quantity: 1,
    barrel_type: null,
    floor_type: null,
    type_image: 1,
    fileCabin: '',
    cameras: [],
    reinforcements: [],
    fileLinks: [],
    fileDocuments: [],
    fileAdded: [],
    fileDeleted: [],
    fileDeleteId: [],
    optionTruckBarrelType: [
      { value: 1, text: 'thùng bạt' },
      { value: 2, text: 'thùng kín' }
    ],
    optionTruckFloorType: [
      { value: 1, text: '1 sàn' },
      { value: 2, text: '2 sàn' }
    ],
    fileDocumentsTwo: [],
    fileAddedTwo: [],
    fileDeletedTwo: [],
    fileDeleteIdTwo: [],
    fileLinksTwo: [],
    canEdit: true,
    canEditTwo: true
  }),
  watch: {
    trigger: function (newVal, oldVal) {
      this.$refs['securityInfoUpdate'].show()
    },
    title: function (newVal, oldVal) {
      this.myTitle = newVal
    },
    truckSecurityInfo: function (newValue, oldValue) {
      this.securityInfo = newValue
    }
  },

  computed: {},

  created () {
  },

  methods: {
    moment (data) {
      return moment(data)
    },
    fillData () {
      this.id = this.truckSecurityInfo.id
      this.truck_data = this.truckData
      this.securityInfo = this.truckSecurityInfo
      this.type_info = this.securityInfo ? parseInt(this.securityInfo.typeSecurityInfo) : ''
      // thông tin camera
      if (this.type_info === 1) {
        this.cameras = this.securityInfo.listCameras
        this.type_detail = this.cameras ? parseInt(this.cameras.type_detail) : ''
        this.type_id = this.cameras ? parseInt(this.cameras.type_id) : ''
        this.quantity = this.cameras ? parseInt(this.cameras.quantity) : ''
        this.barrel_type = this.cameras ? parseInt(this.cameras.barrel_type) : ''
        this.floor_type = this.cameras ? parseInt(this.cameras.floor_type) : ''
        this.fileDocuments = this.cameras ? this.cameras.files : []
        // this.fileLinks = this.cameras ? this.cameras.linkExist : []
        // file thứ 2
        this.fileDocumentsTwo = this.cameras ? this.cameras.fileTwos : []
        // this.fileLinksTwo = this.cameras ? this.cameras.linkExistTwo : []
      } else {
        // thông tin gia cố xe
        this.reinforcements = this.securityInfo.listReinforcements
        this.type_detail = this.reinforcements ? parseInt(this.reinforcements.type_detail) : ''
        this.type_id = this.reinforcements ? parseInt(this.reinforcements.type_id) : ''
        this.quantity = this.reinforcements ? parseInt(this.reinforcements.quantity) : ''
        this.barrel_type = this.reinforcements ? parseInt(this.reinforcements.barrel_type) : ''
        this.floor_type = this.reinforcements ? parseInt(this.reinforcements.floor_type) : ''
        this.fileDocuments = this.reinforcements ? this.reinforcements.files : []
        // this.fileLinks = this.reinforcements ? this.reinforcements.linkExist : []
        // file thứ 2
        this.fileDocumentsTwo = this.reinforcements ? this.reinforcements.fileTwos : []
        // this.fileLinksTwo = this.reinforcements ? this.reinforcements.linkExistTwo : []
      }
      this.changeBarrelStatus()
    },
    openLink (link) {
      window.open(link)
    },
    hideModal () {
      this.$refs.myModalRef.hide()
      this.reset()
    },
    reset () {
      this.type_detail = ''
      this.type_id = ''
      this.quantity = ''
      this.barrel_type = ''
      this.floor_type = ''
      this.fileAdded = []
      this.fileDeleted = []
      this.fileDeleteId = []
      this.fileDocuments = []
      this.fileLinks = []
      this.fileAddedTwo = []
      this.fileDeletedTwo = []
      this.fileDeleteIdTwo = []
      this.fileDocumentsTwo = []
      this.fileLinksTwo = []
    },
    changeBarrelStatus () {
      if (this.type_detail === 3 && this.barrel_type === 1) {
        this.canEdit = this.canEditTwo = true
      }
      if (this.type_detail === 3 && this.barrel_type === 2) {
        this.canEdit = true
        this.canEditTwo = false
      }
    },
    submitSecurityInfoUpdate () {
      // Validate
      let requiredFail = this.validateSecurityInfo()
      if (requiredFail) {
        commonHelper.showMessage(requiredFail, 'warn')
        this.$stopLoading()
        return
      }
      // set data update
      let data = new FormData()
      let dataSend = this.addFile(data)
      CompanyProfileService.updateTruckSecurityInfo(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.fileAdded = []
          this.fileAddedTwo = []
          this.$emit('updateSecurityInfoOk')
          this.$refs['securityInfoUpdate'].hide()
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warn')
        console.error(e)
      }).then(() => {
      })
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
    },
    validateSecurityInfo () {
      // thùng xe
      let requiredFail = null
      if ((this.type_detail === 1 || this.type_detail === 2) && !this.quantity) {
        requiredFail = 'Vui lòng nhập số lượng dạng số lơn hơn 0!'
        return requiredFail
      }
      if ((this.type_detail === 3) && this.barrel_type === null) {
        requiredFail = 'Vui lòng chọn loại thùng!'
        return requiredFail
      }
      if ((this.type_detail === 5) && this.floor_type === null) {
        requiredFail = 'Vui lòng chọn loại sàn!'
        return requiredFail
      }

      // validate ảnh 1
      let docsLength = 0
      if (this.fileDocuments) docsLength = this.fileDocuments.length
      let maxImage = this.fileAdded.length + docsLength - this.fileDeleted.length
      if (!this.fileAdded && maxImage === 0) {
        if (this.type_detail === 1 || this.type_detail === 2 || this.type_detail === 5) {
          requiredFail = 'Vui lòng chọn file để upload!'
          return requiredFail
        }
        if (this.type_detail === 3 && (this.barrel_type === 1 || this.barrel_type === 2)) {
          requiredFail = 'Vui lòng chọn file để upload thùng xe!'
          return requiredFail
        }
        if (this.type_detail === 4) {
          requiredFail = 'Vui lòng chọn file để upload cửa thùng sau!'
          return requiredFail
        }
      }
      if (this.type_info === 1) {
        if (maxImage !== parseInt(this.quantity)) {
          requiredFail = 'Xin vui lòng tải ảnh lên tương ứng với số lượng camera!'
          return requiredFail
        }
      } else {
        // ảnh thứ 2
        let docsLengthTwo = 0
        if (this.fileDocumentsTwo) docsLengthTwo = this.fileDocumentsTwo.length
        let maxImageTwo = this.fileAddedTwo.length + docsLengthTwo - this.fileDeletedTwo.length
        if (!this.fileAddedTwo && maxImageTwo === 0) {
          let title = ''
          if (this.type_detail === 3 && this.barrel_type === 1) title = 'móc cài seal'
          if (this.type_detail === 4) title = 'cửa bên hông'
          if (title !== '') {
            requiredFail = 'Vui lòng chọn file để upload ' + title + '!'
            return requiredFail
          }
        }
        // loại gia cố xe: cập thùng xe type_detail =3 và nếu chọn loại thùng kín -> check ảnh thùng xe theo fileAdded
        // loại gia cố xe: cập nhật cửa xe type_detail =4 hoặc cập nhật sàn xe type_detail =5 -> check ảnh theo fileAdded
        if (this.type_detail === 3 && (this.barrel_type === 1 || this.barrel_type === 2) && maxImage > 5) {
          requiredFail = 'Không được up quá 5 ảnh thùng xe!'
          return requiredFail
        } else if (this.type_detail === 4 && maxImage > 2) {
          requiredFail = 'Không được up quá 2 ảnh cửa thùng sau'
          return requiredFail
        } else if (this.type_detail === 5 && maxImage > 2) {
          requiredFail = 'Không được up quá 2 ảnh sàn xe!'
          return requiredFail
        }
        // loại gia cố xe: cập thùng xe type_detail =3 và nếu chọn loại thùng bạt -> check ảnh móc cài seal theo fileAddedTwo
        // hoặc cập nhật cửa xe type_detail =4 là cửa bên hông thì check theo fileAddedTwo
        if ((this.type_detail === 3 && this.barrel_type === 1) || this.type_detail === 4) {
          if (this.type_detail === 3 && this.barrel_type === 1 && maxImageTwo > 5) {
            requiredFail = 'Không được up quá 5 ảnh móc cài seal!'
          } else if (this.type_detail === 4 && maxImageTwo > 2) {
            requiredFail = 'Không được up quá 2 ảnh cửa bên hông!'
          }
          return requiredFail
        }
      }
    },
    addFile (dataSend) {
      var afterDeleteds = []
      var afterDeletedsTwo = []
      let docsLength = 0
      let docsLengthTwo = 0

      // file add thứ 1
      if (this.fileAdded.length) {
        for (let i = 0; i < this.fileAdded.length; i++) {
          dataSend.append('file[' + i + ']', this.fileAdded[i])
          dataSend.append('type_image', 1)
        }
      }
      if (this.fileDeleted.length) {
        var arrLinks = this.fileDocuments
        var linkDels = this.fileDeleted
        for (let i = 0; i < this.fileDocuments.length; i++) {
          var urlLink = arrLinks.indexOf(linkDels[i])
          if (urlLink > -1) arrLinks.splice(urlLink, 1)
          if (arrLinks[i]) afterDeleteds[i] = JSON.stringify(this.fileDocuments[i])
        }
      } else if (this.fileDocuments) {
        for (let i = 0; i < this.fileDocuments.length; i++) {
          afterDeleteds[i] = JSON.stringify(this.fileDocuments[i])
        }
      }
      dataSend.append('link', JSON.stringify(afterDeleteds))
      if (this.fileDeleted.length) dataSend.append('deleteDocs', JSON.stringify(this.fileDeleteId))

      // file add thứ 2 (nếu trong 1 popup có 2 loại ảnh)
      if (this.fileAddedTwo.length) {
        for (let i = 0; i < this.fileAddedTwo.length; i++) {
          dataSend.append('fileTwo[' + i + ']', this.fileAddedTwo[i])
          dataSend.append('typeImageTwo[' + i + ']', 1)
        }
      }
      if (this.fileDeletedTwo.length) {
        var arrLinksTwo = this.fileDocuments
        var linkDelsTwo = this.fileDeletedTwo
        for (let i = 0; i < this.fileDocumentsTwo.length; i++) {
          var urlLinkTwo = arrLinksTwo.indexOf(linkDelsTwo[i])
          if (urlLink > -1) arrLinksTwo.splice(urlLinkTwo, 1)
          if (arrLinksTwo[i]) afterDeletedsTwo[i] = JSON.stringify(this.fileDocumentsTwo[i])
        }
      } else if (this.fileDocumentsTwo) {
        for (let i = 0; i < this.fileDocumentsTwo.length; i++) {
          afterDeletedsTwo[i] = JSON.stringify(this.fileDocumentsTwo[i])
        }
      }
      if (this.fileDeletedTwo.length) dataSend.append('deleteDocsTwo', JSON.stringify(this.fileDeleteIdTwo))
      if (this.fileDocuments) docsLength = this.fileDocuments.length
      if (this.fileDocumentsTwo) docsLengthTwo = this.fileDocumentsTwo.length
      dataSend.append('maxImage', this.fileAdded.length + docsLength - this.fileDeleted.length)
      dataSend.append('maxImageTwo', this.fileAddedTwo.length + docsLengthTwo - this.fileDeletedTwo.length)
      dataSend.append('linkTwo', JSON.stringify(afterDeletedsTwo))
      dataSend.append('truckId', this.truck_data.id)
      dataSend.append('type_info', this.type_info)
      dataSend.append('type_detail', this.type_detail)
      dataSend.append('type_id', this.type_id)
      dataSend.append('type_image', this.type_image)
      dataSend.append('quantity', this.quantity || '')
      dataSend.append('barrel_type', this.barrel_type || '')
      dataSend.append('floor_type', this.floor_type || '')
      return dataSend
    }
  }
}
</script>
<style>
.document-images {
  cursor: pointer;
  height: 150px !important;
  width: auto !important;
}
#modal-update-security-info .custom-file {
  height: 135px;
  line-height: 128px;
  width: 128px;
  text-align: center;
}
#modal-update-security-info .scrollbar-file .bounder img {
  width: 128px;
  height: 150px;
}
</style>
