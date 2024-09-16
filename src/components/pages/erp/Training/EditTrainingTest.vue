<template>
  <div v-loading="loading">
    <div>
      <b-row class="top">
        <h3 class="mt-2">Sửa bài đào tạo</h3>
        <div>
          <router-link :to="{ name: 'training-list' }">
            <b-button class="ml-1" variant="outline-secondary"
              ><i class="fas fa-arrow-left"></i> Quay lại</b-button
            >
          </router-link>
        </div>
      </b-row>
    </div>
    <hr />
    <b-row class="form-wrapper">
      <div id="create-job-form">
        <b-form-row>
          <b-form-group class="col-md-12 is-required" label="Tên bài học">
            <b-form-input
              v-model="name"
              type="text"
              placeholder="Nhập tên bài học"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            class="col-md-12 is-required"
            label="Thời gian hiển thị sau ngày vào"
          >
            <b-form-input
              v-model="dayOfDisplay"
              type="text"
              placeholder="5"
              required
            ></b-form-input>
          </b-form-group>

          <div class="video-box" v-if="typeof file === 'string'">
            <img :src="file" class="uploaded-img" v-if="isImage(file)"/>
            <video width="200" height="200" controls v-else>
              <source :src="file" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <b-button class="ml-1 delete" size="sm" variant="danger" @click="file = null">
              Xóa <i class="fa fa-trash"></i>
            </b-button>
          </div>
          <b-form-group class="col-md-12 is-required" label="Upload video hoặc ảnh" v-else>
            <b-form-file
              :multiple="false"
              accept=".mp4, image/*"
              class="custom-file"
              v-model="file"
              placeholder="Vui lòng chọn file upload..."
            ></b-form-file>
          </b-form-group>

          <b-form-group class="col-md-12" label="Mô tả/ nội dung chi tiết">
            <quill-editor ref="myQuillEditor" v-model="description" />
          </b-form-group>
          <b-form-group class="col-md-4" label="Loại bài học">
            <multiselect
              v-model="category"
              :options="categories"
              :placeholder="'Chọn thể loại'"
              label="name"
              track-by="value"
              selectedLabel=""
              deselectLabel="X"
              selectLabel=""
              :auto-close="true"
              :hide-selected="true"
            >
              <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
            </multiselect>
          </b-form-group>
          <b-form-group class="col-md-4" label="Bộ phận">
            <MultiSelectDepartment
            @handleDepartmentSelected="(options) => options ? (departmentIds = options.map(department => department.id)) : []"
            :auto-close="false"
            :hide-selected="true"
            :departmentIds="department"
            />
          </b-form-group>
          <b-form-group class="col-md-4" label="Vị trí">
            <MultiSelectPosition
              :is-disabled="false"
              @handlePositionSelected="onSelectedPosition"
              :positionIds="position"
              :departmentId="department"
            >
            </MultiSelectPosition>
          </b-form-group>
          <b-form-group class="col-md-4" label="Hình thức làm việc">
            <MultiSelectWorkType
              @handleSelectedWorkType="onSelectedWorkTypes"
              :positionCustom="position"
              :multiple="true"
              :workTypeId="workType"
            >
            </MultiSelectWorkType>
          </b-form-group>

          <b-form-group class="col-md-4" label="Miền">
            <MultiSelectRegion
              :multiple="true"
              :regions="region"
              @handleSelectedRegion="(options) => options ? (regions = options.map(option => option.id)) : []"
            />
          </b-form-group>
          <b-form-group class="col-md-4" label="Tỉnh">
             <MultiSelectProvince
              @handleProvinceSelected="(options) => options ? (provinceIds = options.map(province => province.id)) : []"
              :display-all="false"
              :limit-prop=99999
              :auto-close="false"
              :hide-selected="true"
              :reset="resetInput"
              :region="region"
              :withRegions="false"
              :provinceIds="province"
             />
          </b-form-group>
          <b-form-group class="col-md-4" label="Kho">
            <MultiSelectStation
            :hide-selected="true"
            :auto-close="true"
            :stationIds="station"
            :provinceIds="province"
            placeholder="Chọn kho hẹn nhận việc"
            @handleStationSelected="(options) => options ? (stationIds = options.map(station => station.id)) : []"
            />
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-button class="mr-1" variant="success" @click="updateTest">
            Xong</b-button
          >
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
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import trainingService from 'domain/services/training-service'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'
import Multiselect from 'vue-multiselect'

function initialState () {
  return {
    loading: false,
    options: config.jobTypes,
    name: '',
    dayOfDisplay: 1,
    description: '',
    departmentIds: [],
    positionIds: [],
    workTypes: [],
    regions: [],
    provinceIds: [],
    stationIds: [],
    resetInput: false,
    department: '',
    position: '',
    region: '',
    province: '',
    station: '',
    workType: '',
    file: null,
    categories: [],
    category: null,
    thumbnail: ''
  }
}

export default {
  components: {
    quillEditor,
    Datepicker,
    commonHelper,
    MultiSelectPosition,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectDepartment,
    MultiSelectStation,
    MultiSelectWorkType,
    Multiselect
  },
  created () {
    this.getCategories()
    this.getTest()
  },
  data: () => initialState(),
  methods: {
    onSelectedWorkTypes (options) {
      this.workTypes = options ? options.map(option => option.id) : []
    },

    async getCategories () {
      try {
        this.loading = true
        const { data } = await trainingService.getCategories()

        if (data.success) {
          this.categories = Object.keys(data.data).map((key) => (
            {
              name: data.data[key],
              value: key
            }
          ))
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },

    async getTest () {
      try {
        this.loading = true
        const {data} = await trainingService.getTrainingTestInfo({id: this.$route.params.id})
        const {test} = data

        this.name = test.name
        this.dayOfDisplay = test.start_days
        this.description = test.description ? test.description : ''
        this.departmentIds = test.department_ids ? test.department_ids.split(',') : null
        this.positionIds = test.position_ids ? test.position_ids.split(',') : null
        this.regions = test.regions ? test.regions.split(',') : null
        this.stationIds = test.station_ids ? test.station_ids.split(',') : null
        this.provinceIds = test.province_ids ? test.province_ids.split(',') : null
        this.workTypes = test.work_types ? test.work_types.split(',') : null
        this.file = test.file

        if (test.category) {
          this.category = this.categories.find((category) => {
            return category.value === test.category
          })
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    onSelectedPosition (positions) {
      this.positionIds = positions && positions.constructor === Array ? positions.map(item => item.id) : []
    },
    async updateTest () {
      try {
        this.loading = true

        let formData = new FormData()

        if (this.file) {
          formData.append('file', this.file)
        }

        formData.append('id', this.$route.params.id)
        formData.append('name', this.name)
        formData.append('start_days', this.dayOfDisplay)
        formData.append('description', this.description ? this.description : '')
        formData.append('department_ids', this.departmentIds ? this.departmentIds.join() : '')
        formData.append('position_ids', this.positionIds ? this.positionIds.join() : '')
        formData.append('regions', this.regions ? this.regions.join() : '')
        formData.append('province_ids', this.provinceIds ? this.provinceIds.join() : '')
        formData.append('station_ids', this.stationIds ? this.stationIds.join() : '')
        formData.append('work_types', this.workTypes ? this.workTypes.join() : '')
        formData.append('category', this.category ? this.category.value : '')
        formData.append('thumbnail', this.thumbnail)

        const { data } = await trainingService.updateTrainingTest(formData)

        if (data.success) {
          commonHelper.showMessage('Update thành công', 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    isImage (path) {
      if (!path) return null
      let imageReg = /[/.](gif|jpg|jpeg|tiff|png)$/i
      return imageReg.test(path)
    }
  },
  watch: {
    departmentIds (values) {
      this.department = values ? values.join() : null
    },
    positionIds (values) {
      this.position = values ? values.join() : null
    },
    regions (values) {
      this.region = values ? values.join() : null
    },
    stationIds (values) {
      this.station = values ? values.join() : null
    },
    provinceIds (values) {
      this.province = values ? values.join() : null
    },
    workTypes (values) {
      this.workType = values ? values.join() : null
    },
    file (value) {
      if (value && value instanceof File) {
        let videoMetaData = (file) => {
          return new Promise(function (resolve, reject) {
            let video = document.createElement('video')
            video.src = URL.createObjectURL(file)
            video.currentTime = 1
            video.addEventListener('canplay', function () {
              resolve({
                video: video,
                duration: Math.round(video.duration * 1000),
                height: video.videoHeight,
                width: video.videoWidth
              })
            })
          })
        }

        videoMetaData(value).then(function (data) {
          let videoCanvas = document.createElement('canvas')

          videoCanvas.height = data.height
          videoCanvas.width = data.width
          videoCanvas.getContext('2d').drawImage(data.video, 0, 0)
          return videoCanvas.toDataURL('image/png')
        }).then((value) => {
          this.thumbnail = value
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.uploaded-img{
  margin-right: 5px;
  width: 200px;
  height: 200px;
  vertical-align: baseline;
}
.video-box{
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-direction: column;
}
.delete{
  margin-top: 10px;
  margin-bottom: 10px;
}
.search-bar-wrapper {
  align-items: flex-end;
}
.loading-wrapper {
  margin-top: 10%;
}
.btn-center {
  margin-left: 5px;
}
.btn-group-search {
  display: flex;
  justify-content: flex-end;
  padding-right: unset;
}
#create-job-form {
  width: 100%;
}
.form-wrapper {
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 40px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-file {
  margin-bottom: 10px;
}
</style>

<style>
#create-job-form .ql-container {
  height: 250px;
}

#create-job-form .ql-toolbar.ql-snow {
  border: 1px solid rgba(24, 28, 33, 0.1);
}

#create-job-form .ql-container.ql-snow {
  border: 1px solid rgba(24, 28, 33, 0.1);
}
.is-required .col-form-label:after {
  content: "*";
  color: red;
}
</style>
