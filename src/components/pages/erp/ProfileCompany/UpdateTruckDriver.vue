<template>
  <b-row class="dv-truck-driver">
    <b-row class="col-md-12">
      <b-col md="12" class="d-flex justify-content-between">
        <h3 v-if="isAdd">Thêm mới tài xế</h3>
        <h3 v-else>Sửa đổi tài xế</h3>
        <router-link :to="{name: 'edit-master-profile-company', params: { id: this.profileId }}" class="btn btn-default btn-md" title="Về màn sửa hồ sơ công ty"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
      </b-col>
    </b-row>
    <b-card class="mt-3 col-md-12">
      <b-card-body class="col-md-12">
        <b-row class="mt-3">
          <b-col md="4">
            <b-form-group label-cols-sm="4">
              <span slot="label">Họ và tên <span class="text-danger">*</span></span>
              <b-form-input placeholder="Nhập họ và tên" v-model="driver.fullname"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="4">
            <b-form-group label-cols-sm="4">
              <span slot="label">Số CCCD/CMT <span class="text-danger">*</span></span>
              <b-form-input placeholder="Nhập số CCCD/CMT" v-model="driver.personal_id_number" :disabled="isAdd ? false :true"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="4">
            <b-form-group label-cols-sm="4">
              <span slot="label">Số điện thoại <span class="text-danger">*</span></span>
              <b-form-input placeholder="Nhập số điện thoại" v-model="driver.tel"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="4">
            <b-form-group label-cols-sm="4">
              <span slot="label">Ảnh chân dung <span class="text-danger">*</span></span>
              <b-card-body style="padding-top: 0px !important; padding-left: 0px !important;">
                <template>
                  <div class="text-left rent-truck-driver">
                    <div v-for="(file, index) in Documents.avatar" :key="index + 'files'" class="dv-img-incident">
                      <div v-if="file.avatar_personal" class="img-bounder mt-1 mb-4" :key="index + 'files'">
                        <span @click="deleteFileAvatar($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                        <b-img
                          :src="file.avatar_personal" :alt="''" class="rounded mt-2 mr-3" style="height: 100px; width: 100px;"
                        ></b-img>
                      </div>
                    </div>
                    <div v-for="(file, index) in Added.avatar" class="img-bounder mt-1 mb-4 aa" :key="index">
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
              </b-card-body>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label-cols-sm="4">
              <span slot="label">Ảnh CCCD/CMT mặt trước <span class="text-danger">*</span></span>
              <b-card-body style="padding-top: 0px !important; padding-left: 0px !important;">
                <template>
                  <div class="text-left rent-truck-driver">
                    <div v-for="(file, index) in Documents.before" :key="index + 'files'" class="dv-img-incident">
                      <div v-if="file.before_avatar_personal" class="img-bounder mt-1 mb-4" :key="index + 'files'">
                        <span @click="deleteFileBefore($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                        <b-img
                          :src="file.before_avatar_personal" :alt="''" class="rounded mt-2 mr-3" style="height: 100px; width: 100px;"
                        ></b-img>
                      </div>
                    </div>
                    <div v-for="(file, index) in Added.before" class="img-bounder mt-1 mb-4 aa" :key="index">
                      <span @click="deleteFileBefore($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                      <a href="javascript:void(0)">
                        <b-img
                          :src="getUrl(file)" :alt="''" class="rounded mt-2 mr-3" style="height: 100px; width: 100px;"
                        >
                        </b-img>
                      </a>
                    </div>
                    <div class="img-bounder mt-1 mb-4" v-if="(Deleted.before.length && Added.before.length < 1) || (!Deleted.before.length && Documents.before.length < 1 && Added.before.length < 1)">
                      <b-form-group class="dragdrop font-size">
                        <b-form-file
                          accept="image/*"
                          v-model="Added.before"
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
              </b-card-body>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label-cols-sm="4">
              <span slot="label">Ảnh CCCD/CMT mặt sau <span class="text-danger">*</span></span>
              <b-card-body style="padding-top: 0px !important; padding-left: 0px !important;">
                <template>
                  <div class="text-left rent-truck-driver">
                    <div v-for="(file, index) in Documents.after" :key="index + 'files'" class="dv-img-incident">
                      <div v-if="file.after_avatar_personal" class="img-bounder mt-1 mb-4" :key="index + 'files'">
                        <span @click="deleteFileAfter($event, index, true)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                        <b-img
                          :src="file.after_avatar_personal" :alt="''" class="rounded mt-2 mr-3" style="height: 100px; width: 100px;"
                        ></b-img>
                      </div>
                    </div>
                    <div v-for="(file, index) in Added.after" class="img-bounder mt-1 mb-4 aa" :key="index">
                      <span @click="deleteFileAfter($event, index, false)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                      <a href="javascript:void(0)">
                        <b-img
                          :src="getUrl(file)" :alt="''" class="rounded mt-2 mr-3" style="height: 100px; width: 100px;"
                        >
                        </b-img>
                      </a>
                    </div>
                    <div class="img-bounder mt-1 mb-4" v-if="(Deleted.after.length && Added.after.length < 1) || (!Deleted.after.length && Documents.after.length < 1 && Added.after.length < 1)">
                      <b-form-group class="dragdrop font-size">
                        <b-form-file
                          accept="image/*"
                          v-model="Added.after"
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
              </b-card-body>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-center" style="margin-top: 5rem">
          <b-btn class="btn btn-submit-ghtk btn-md text-center" @click="updateRentTruckDriver"> Lưu thông tin </b-btn>
        </b-row>
      </b-card-body>
    </b-card>
  </b-row>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import moment from 'moment'

export default {
  name: 'update-truck-plan',

  components: {
    Datepicker,
    Multiselect
  },

  props: [],

  data: () => ({
    driver: {
      fullname: '',
      personal_id_number: '',
      tel: '',
      before_avatar_personal: '',
      after_avatar_personal: '',
      avatar_personal: ''
    },
    profileId: '',
    fileDocuments: [],
    fileAdded: [],
    fileDeleted: [],
    Documents: {
      avatar: [],
      before: [],
      after: []
    },
    Added: {
      avatar: [],
      before: [],
      after: []
    },
    Deleted: {
      avatar: [],
      before: [],
      after: []
    }
  }),

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-truck-driver'
    },

    isEdit: function () {
      return this.$route.name === 'edit-truck-driver'
    }
  },

  watch: {
    '$route.params.id': function () {
    }
  },

  async created () {
    if (this.isAdd) {
      if (!this.profileId) {
        if (this.$route.params.id) {
          this.profileId = this.$route.params.id
        }
      } else {
        this.profileId = this.truckId
      }
    } else {
      if (this.$route.params.id) {
        this.DriverId = this.$route.params.id
        this.profileId = this.$route.query.profile_id
        this.getDetailRentTruckDriver(this.DriverId)
      }
    }
  },

  methods: {
    moment (data) {
      return moment(data)
    },
    updateRentTruckDriver () {
      let dataSend = new FormData()
      if (!this.Added.avatar.length && !this.Documents.avatar.length) {
        commonHelper.showMessage('Bạn chưa tải ảnh chân dung')
        this.$stopLoading()
        return
      }
      if (!this.Added.before.length && !this.Documents.before.length) {
        commonHelper.showMessage('Bạn chưa tải ảnh CMT/CCCD mặt trước')
        this.$stopLoading()
        return
      }
      if (!this.Added.after.length && !this.Documents.after.length) {
        commonHelper.showMessage('Bạn chưa tải ảnh CMT/CCCD mặt sau')
        this.$stopLoading()
        return
      }
      if ((this.Added.avatar.length + this.Documents.avatar.length - this.Deleted.avatar.length) > 1) return commonHelper.showMessage('Không được up quá 1 ảnh chân dung', 'warn')
      if ((this.Added.before.length + this.Documents.before.length - this.Deleted.before.length) > 1) return commonHelper.showMessage('Không được up quá 1 ảnh CMT/CCCD mặt trước', 'warn')
      if ((this.Added.after.length + this.Documents.after.length - this.Deleted.after.length) > 1) return commonHelper.showMessage('Không được up quá 1 ảnh CMT/CCCD mặt sau', 'warn')
      if (this.isEdit) {
        dataSend.append('id', this.$route.params.id || '')
      }
      dataSend.append('profile_id', this.profileId || '')
      dataSend.append('fullname', this.driver.fullname || '')
      dataSend.append('personal_id_number', this.driver.personal_id_number || '')
      dataSend.append('tel', this.driver.tel || '')
      if (this.Added.avatar.length) {
        for (let i = 0; i < this.Added.avatar.length; i++) {
          dataSend.append('fileAvatar[' + i + ']', this.Added.avatar[i])
        }
      }
      if (this.Added.before.length) {
        for (let i = 0; i < this.Added.before.length; i++) {
          dataSend.append('fileBefore[' + i + ']', this.Added.before[i])
        }
      }
      if (this.Added.after.length) {
        for (let i = 0; i < this.Added.after.length; i++) {
          dataSend.append('fileAfter[' + i + ']', this.Added.after[i])
        }
      }
      if (this.Deleted.avatar.length) dataSend.append('deleteAvatarDocs', JSON.stringify(this.Deleted.avatar))
      if (this.Deleted.before.length) dataSend.append('deleteBeforeDocs', JSON.stringify(this.Deleted.before))
      if (this.Deleted.after.length) dataSend.append('deleteAfterDocs', JSON.stringify(this.Deleted.after))

      CompanyProfileService.updateRentTruckDriver(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.fileAdded = []
            this.Added.avatar = []
            commonHelper.showMessage(res.data.message, 'success')
            this.$router.push({ name: 'edit-master-profile-company', params: { id: this.profileId } })
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
    deleteFileBefore (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.Deleted.before.push(this.Documents.before[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
          this.Documents.before = []
        } else {
          let index = this.Deleted.before.indexOf(this.Documents.before[indexFile].id)
          if (index >= 0) {
            this.Deleted.before.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
            this.Documents.before = []
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.Added.before.splice(indexFile, 1)
      }
    },
    deleteFileAfter (event, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.Deleted.after.push(this.Documents.after[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
          this.Documents.after = []
        } else {
          let index = this.Deleted.after.indexOf(this.Documents.after[indexFile].id)
          if (index >= 0) {
            this.Deleted.after.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
            this.Documents.after = []
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.Added.after.splice(indexFile, 1)
      }
    },
    formatNames (files) {
      if (files) return '+'
      return ''
    },
    getDetailRentTruckDriver (id) {
      this.$startLoading()
      let dataRequest = {
        id: id,
        profile_id: this.profileId
      }
      CompanyProfileService.getDetailRentTruckDriver(dataRequest)
        .then((res) => {
          if (res.data.success) {
            let info = res.data.data
            this.driver.fullname = info.fullname
            this.driver.personal_id_number = info.personal_id_number
            this.driver.tel = info.tel
            this.driver.before_avatar_personal = info.before_avatar_personal
            this.driver.after_avatar_personal = info.after_avatar_personal
            if (info.avatar_personal) {
              var links = []
              this.driver.avatar_personal = info.avatar_personal
              links.push({avatar_personal: info.avatar_personal})
              this.Documents.avatar = links
            }
            if (info.before_avatar_personal) {
              var beforeLinks = []
              this.driver.before_avatar_personal = info.before_avatar_personal
              beforeLinks.push({before_avatar_personal: info.before_avatar_personal})
              this.Documents.before = beforeLinks
            }
            if (info.after_avatar_personal) {
              var afterLinks = []
              this.driver.after_avatar_personal = info.after_avatar_personal
              afterLinks.push({after_avatar_personal: info.after_avatar_personal})
              this.Documents.after = afterLinks
            }
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    }
  }
}
</script>

<style scoped>
.btn-submit-ghtk {
  background-color: #00904A;
  border-radius: 3px;
}
</style>
<style>
  .rent-truck-driver .img-bounder {
    position: relative;
    display: inline-block;
  }
  .rent-truck-driver .img-bounder:hover > .btn-disable-file {
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
  .rent-truck-driver .btn-disable-file {
    font-size: 20px;
    display: none;
    position: absolute;
    top: -10px;
    right: 6px;
  }
  .rent-truck-driver .dragdrop {
    font-size: 70px;
    position: relative;
    width: 8rem;
  }
  .rent-truck-driver .file-label-inner {
    border: 2px dashed #b8b9bb !important;
  }
  .rent-truck-driver .dragdrop .custom-file-label {
    border: 2px dashed #b8b9bb !important;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: green;
    padding: 0;
    margin-top: 0.5rem;
  }
  .rent-truck-driver .dragdrop .custom-file-label::after {
    display: none;
  }

  .rent-truck-driver .dragdrop .custom-file:hover >>> .custom-file-label {
    background: rgb(15, 182, 79);
    color: #fff;
  }

  .rent-truck-driver .dragdrop >>> .custom-file-label::after, .custom-file-label::after {
    display: none;
  }
  .tm-img .d-inline-block {
    display: block !important;
  }
  .rent-truck-driver .dv-img-incident {
    display: inline-block;
  }
  .rent-truck-driver .fs-avatar-txt {
    position: absolute;
    z-index: 999;
    top: 101px;
    font-size: 14px;
    text-align: center;
    left: 0;
    right: 0;
  }
  .rent-truck-driver .img-bounder .rounded {
    margin-top: 0px !important;
  }
</style>
