<template>
    <b-modal hide-footer id="modal-update-mortgage" ref="myModalRef" @show="fillData" @hidden="reset" size="lg" header-bg-variant="success text-white" title="Cập nhật thông tin giấy thế chấp ngân hàng" ok-only centered>
        <b-row>
            <b-col md="6">
              <b-form-group >
                <label class="form-label">Ngày cấp</label>
                    <datepicker
                    placeholder=""
                    v-model="start_date"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
              </b-form-group>
              <b-form-group >
                <label class="form-label">Ngày hết hạn</label>
                <datepicker
                    placeholder=""
                    v-model="end_date"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-row>
                <b-col md="6">
                  <label class="form-label font-weight-bold" >Giấy thế chấp ngân hàng</label>
                </b-col>
              </b-row>
              <b-row>
                <template>
                  <div class="text-left">
                    <div v-for="(file, index) in Documents.avatar" :key="index + 'files'" class="img-bounder mt-1 mb-4">
                      <div v-if="file.mortgage_image" class="img-bounder mt-1 mb-4" :key="index + 'files'">
                        <span @click="deleteFileAvatar($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                        <b-img
                          :src="file.mortgage_image" :alt="''" class="rounded mt-2 mr-3" style="height: 150px;"
                        ></b-img>
                      </div>
                    </div>
                    <div v-for="(file, index) in Added.avatar" class="img-bounder mt-1 mb-4" :key="index">
                      <span @click="deleteFileAvatar($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                      <a href="javascript:void(0)">
                        <b-img
                          :src="getUrl(file)" :alt="''" class="rounded mt-2 mr-3" style="height: 100px; width: 100px;"
                        >
                        </b-img>
                      </a>
                    </div>
                    <div class="img-bounder mt-1 mb-4" v-if="(Deleted.avatar.length && Added.avatar.length < 1) || (!Deleted.avatar.length && Documents.avatar.length < 1 && Added.avatar.length < 1)">
                      <b-form-group class="dragdrop font-size">
                        <b-form-file
                          accept="image/*"
                          v-model="Added.avatar"
                          multiple
                          placeholder="+"
                          drop-placeholder="Drop file"
                          :file-name-formatter="formatNames"
                        >
                        </b-form-file>
                        <div class="fs-avatar-txt"></div>
                      </b-form-group>
                    </div>
                  </div>
                </template>
              </b-row>
            </b-col>
        </b-row>
        <b-row align-h="center">
          <b-button variant="success" @click="updateMortgage"> Cập nhật</b-button>
        </b-row>
      </b-modal>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import moment from 'moment'

export default {
  name: 'modal-update-mortgage',

  components: {
    Datepicker,
    Multiselect
  },

  props: ['item', 'truckOrder'],

  data: () => ({
    start_date: '',
    end_date: '',
    mortgage_image: '',
    truck_order: '',
    fileDocuments: [],
    fileAdded: [],
    fileDeleted: [],
    Documents: {
      avatar: []
    },
    Added: {
      avatar: []
    },
    Deleted: {
      avatar: []
    }
  }),

  computed: {
  },

  watch: {
  },

  created () {

  },

  methods: {
    moment (data) {
      return moment(data)
    },
    fillData () {
      this.id = this.item.id
      this.start_date = this.item.start_date ? this.item.start_date.split('-').reverse().join('-') : ''
      this.end_date = this.item.end_date ? this.item.end_date.split('-').reverse().join('-') : ''
      if (this.item.mortgage_image) {
        const links = []
        this.mortgage_image = this.item.mortgage_image
        links.push({mortgage_image: this.item.mortgage_image})
        this.Documents.avatar = links
      }
      this.truck_order = this.truckOrder
    },
    hideModal () {
      this.$refs.myModalRef.hide()
      this.reset()
    },
    reset () {
      this.start_date = ''
      this.end_date = ''
      this.mortgage_image = ''
      this.fileDocuments = []
      this.fileAdded = []
      this.fileDeleted = []
      this.Documents.avatar = []
      this.Added.avatar = []
      this.Deleted.avatar = []
    },
    updateMortgage () {
      let dataSend = new FormData()
      if (!this.Added.avatar.length && !this.Documents.avatar.length) {
        commonHelper.showMessage('Ảnh giấy thế chấp ngân hàng không được để trống')
        this.$stopLoading()
        return
      }
      if ((this.Added.avatar.length + this.Documents.avatar.length - this.Deleted.avatar.length) > 1) return commonHelper.showMessage('Không được up quá 1 ảnh', 'warn')
      dataSend.append('id', this.id || '')
      dataSend.append('truck_order', this.truck_order)
      dataSend.append('start_date', moment(this.start_date).format('YYYY-MM-DD') !== 'Invalid date' ? moment(this.start_date).format('YYYY-MM-DD') : '' || '')
      dataSend.append('end_date', moment(this.end_date).format('YYYY-MM-DD') !== 'Invalid date' ? moment(this.end_date).format('YYYY-MM-DD') : '' || '')
      if (this.Added.avatar.length) {
        for (let i = 0; i < this.Added.avatar.length; i++) {
          dataSend.append('fileAvatar[' + i + ']', this.Added.avatar[i])
        }
      }
      if (this.Deleted.avatar.length) dataSend.append('deleteAvatarDocs', JSON.stringify(this.Deleted.avatar))

      CompanyProfileService.updateMortgage(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.fileAdded = []
            this.Added.avatar = []
            commonHelper.showMessage(res.data.message, 'success')
            this.hideModal()
            this.$emit('reloadUpdateMortgage')
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
    getUrl (file) {
      return URL.createObjectURL(file)
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
    deleteFileAvatar (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.Deleted.avatar.push(this.Documents.avatar[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
          this.Documents.avatar = []
        } else {
          let index = this.Deleted.avatar.indexOf(this.Documents.avatar[indexFile].id)
          if (index >= 0) {
            this.Deleted.avatar.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
            this.Documents.avatar = []
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.Added.avatar.splice(indexFile, 1)
      }
    },
    formatNames (files) {
      if (files) return '+'
      return ''
    }
  }
}
</script>

<style scoped>
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
</style>
