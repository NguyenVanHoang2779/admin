<template>
  <div v-loading="loading">
    <div>
      <b-row class="top">
        <h3 class="mt-2">Thêm mới công việc</h3>
        <div>
          <router-link :to="{name: 'driverx-jobs'}">
            <b-button class="ml-1" variant="outline-secondary"><i class="fas fa-arrow-left"></i> Quay lại</b-button>
          </router-link>
        </div>
      </b-row>
    </div>
    <hr>
    <b-row class="form-wrapper">
      <div id="create-job-form">
        <b-form-row>
          <b-form-group class="col-md-4 is-required" label="Tiêu đề">
            <b-form-input
              v-model="name"
              type="text"
              placeholder="Nhập tiêu đề"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Ngày gian bắt đầu">
            <datepicker
              v-model="startDate"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="Chọn ngày bắt đầu"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
            />
          </b-form-group>
          <b-form-group class="col-md-4" label="Ngày kết thúc">
            <datepicker
              v-model="endDate"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="Chọn ngày kết thúc"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
            />
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Số lương vị trí cần tuyển">
            <b-form-input
              v-model="amount"
              type="text"
              placeholder="5"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Kho">
            <SingleSelectStation
              @handleSelectedStation="opt => stationId = opt ? opt.id : null"
              :stationId="stationId"/>
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Loại công việc">
            <b-form-select
              v-model="jobType"
              :options="options"
            >
            </b-form-select>
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Thù lao">
            <b-form-input
              v-model="money"
              type="text"
              placeholder="300000"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Giờ bắt đầu làm việc">
            <b-form-input
              v-model="startHour"
              type="text"
              placeholder="8"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-4 is-required" label="Giờ kết thúc làm việc">
            <b-form-input
              v-model="endHour"
              type="text"
              placeholder="18"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-4" label="File">
            <b-form-file v-for="(file, index) in files" :key="`file${index}`"
              :multiple="true"
              accept=".jpg, .png, .gif, .jpeg, video/*"
              class="custom-file"
              v-model="files[index]"
              placeholder="Chọn file upload..."
            >
              <template slot="file-name" slot-scope="{ names }">
                <b-badge variant="light">{{ names[0] }}</b-badge>
                <b-badge v-if="names.length > 1" variant="light" class="ml-1">
                  + {{ names.length - 1 }} More files
                </b-badge>
              </template>
            </b-form-file>
            <b-button variant="outline-secondary" size="sm" @click="files.push({})">Thêm file khác</b-button>
            <div class="img-boxes" v-if="avatarUrls">
              <div class="show-image" v-for="(url, index) in avatarUrls.split(',')" :key="`img${index}`">
                <img :src="url" class="uploaded-img" v-if="isImage(url)"/>
                <video width="100" height="100" controls v-else>
                  <source :src="url" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <b-button class="ml-1 delete" size="sm" variant="danger" @click="removeAvatar(index)">
                  Xóa <i class="fa fa-trash"></i>
                </b-button>
              </div>
            </div>
          </b-form-group>
          <b-form-group class="col-md-4" label="Chọn giấy tờ cần thiết">
            <MultiSelectDocumentType
              @handleSelected="selectDocument"
              :reset="resetSelectDocument"
              :documentTypes="documentIds"
            />
          </b-form-group>
        </b-form-row>
        <b-form-row>
          <b-form-group class="col-md-12" label="Mô tả công việc">
            <quill-editor
              ref="myQuillEditor"
              :options="optionEdittor"
              v-model="description"
            />
          </b-form-group>
        </b-form-row>
        <b-form-row>
          <b-button class="mr-1" variant="success" @click="updateJob"> Xong</b-button>
        </b-form-row>
      </div>
    </b-row>
  </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import config from './config'
import moment from 'moment'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import MultiSelectDocumentType from 'components/elements/common/MultiSelectDocumentType'
import driverxService from 'domain/services/driverx-service'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'

function initialState () {
  return {
    loading: false,
    optionEdittor: config.optionEdittor,
    pagination: {
      currentPage: 1,
      total: 0,
      perPage: 10
    },
    options: config.jobTypes,
    name: '',
    startDate: null,
    endDate: null,
    amount: '',
    stationId: '',
    jobType: '',
    money: '',
    startHour: '',
    endHour: '',
    description: '',
    files: [],
    documents: [],
    documentIds: '',
    resetSelectDocument: false,
    avatarUrls: ''
  }
}

export default {
  components: {quillEditor, SingleSelectStation, Datepicker, commonHelper, MultiSelectDocumentType},
  data: () => initialState(),
  mounted () {
    this.getJob()
  },
  methods: {
    isImage (path) {
      if (!path) return null
      let imageReg = /[/.](gif|jpg|jpeg|tiff|png)$/i
      return imageReg.test(path)
    },
    async getJob () {
      try {
        this.loading = true
        const {data} = await driverxService.getJob({id: this.$route.params.id})
        this.name = data.job.name
        this.startDate = data.job.start_date
        this.endDate = data.job.end_date
        this.amount = data.job.amount
        this.stationId = data.job.station_id
        this.jobType = data.job.job_type
        this.money = data.job.money
        this.startHour = data.job.start_hour
        this.endHour = data.job.end_hour
        this.description = data.job.description
        this.documentIds = data.job.document_ids
        this.documents = data.job.document_ids.split(',')
        this.avatarUrls = data.job.avatar
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async updateJob () {
      let formData = new FormData()
      formData.append('id', this.$route.params.id)
      formData.append('name', this.name)
      if (this.startDate) formData.append('startDate', moment(this.startDate).format('YYYY-MM-DD'))
      if (this.endDate) formData.append('endDate', moment(this.endDate).format('YYYY-MM-DD'))
      if (this.amount) formData.append('amount', this.amount)
      formData.append('stationId', this.stationId)
      formData.append('jobType', this.jobType)
      formData.append('money', this.money)
      formData.append('startHour', this.startHour)
      formData.append('endHour', this.endHour)
      formData.append('description', this.description)
      formData.append('documents', this.documents.join())
      formData.append('curentAvatars', this.avatarUrls)
      this.files.map((fs, i) => {
        fs.map((f, j) => {
          if (f.name) formData.append('files[' + i + j + ']', f)
        })
      })
      try {
        this.loading = true
        const {data} = await driverxService.updateJob(formData)
        if (data.success) {
          this.name = data.job.name
          this.startDate = data.job.start_date
          this.endDate = data.job.end_date
          this.amount = data.job.amount
          this.stationId = data.job.station_id
          this.jobType = data.job.job_type
          this.money = data.job.money
          this.startHour = data.job.start_hour
          this.endHour = data.job.end_hour
          this.description = data.job.description
          this.documentIds = data.job.document_ids
          this.documents = data.job.document_ids.split(',')
          this.avatarUrls = data.job.avatar
          commonHelper.showMessage('Cập nhật công việc thành công', 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    selectDocument (values) {
      let tmp = []
      values.map(item => tmp.push(item.id))
      this.documents = tmp
    },
    removeAvatar (index) {
      let urls = this.avatarUrls.split(',')
      urls.splice(index, 1)
      this.avatarUrls = urls.join()
    }
  }
}
</script>

<style scoped lang="scss">
div.show-image {
  position: relative;
  float:left;
  margin:5px;
}
div.show-image:hover img{
  opacity:0.5;
}
div.show-image:hover .delete {
  display: block;
}
div.show-image .delete {
  position:absolute;
  display:none;
}
div.show-image .delete {
  top: 30%;
  left: 20%;
}
.img-boxes{
  margin-top: 20px;
}
.uploaded-img{
  margin-right: 5px;
  width: 100px;
  height: 100px;
  vertical-align: baseline;
}
.search-bar-wrapper{
  align-items: flex-end;
}
.loading-wrapper{
  margin-top: 10%;
}
.btn-center{
  margin-left: 5px;
}
.btn-group-search{
  display: flex;
  justify-content: flex-end;
  padding-right: unset;
}
#create-job-form{
  width: 100%;
}
.form-wrapper{
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 40px;
}
.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-file{
  margin-bottom: 10px;
}
</style>

<style>
#create-job-form .ql-container{
  height: 250px;
}

#create-job-form .ql-toolbar.ql-snow{
  border: 1px solid rgba(24, 28, 33, 0.1);
}

#create-job-form .ql-container.ql-snow{
  border: 1px solid rgba(24, 28, 33, 0.1);
}
.is-required .col-form-label:after {
  content:"*";
  color:red;
}
</style>
