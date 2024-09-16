<template>
  <div v-loading="loading">
    <div>
      <b-row class="top">
        <h3 class="mt-2">Thêm mới bài đào tạo</h3>
        <div>
          <router-link :to="{ name: 'training-list' }">
            <b-button class="ml-1" variant="outline-secondary"
              ><i class="fas fa-arrow-left"></i> Quay lại</b-button
            >
          </router-link>
          <b-button class="mr-1 btn-center" variant="light" @click="reset">
            <i class="fas fa-undo"></i> Hủy
          </b-button>
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

          <b-form-group class="col-md-12 is-required" label="Upload video hoặc ảnh">
            <b-form-file
              :multiple="false"
              accept=".mp4, image/*"
              class="custom-file"
              v-model="file"
              placeholder="Vui lòng chọn file video hoặc ảnh upload..."
            ></b-form-file>
            <input id="thumbnail" type="text" v-model="thumbnail" hidden>
          </b-form-group>

          <b-form-group class="col-md-12" label="Upload ảnh thumbnail">
            <b-form-file
              :multiple="false"
              accept="image/*"
              class="custom-file"
              v-model="fileThumbnail"
              placeholder="Vui lòng chọn file ảnh upload..."
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
              <span class="placeholder" slot="placeholder">Chọn thể loại</span>
            </multiselect>
          </b-form-group>
          <b-form-group class="col-md-4" label="Bộ phận">
            <MultiSelectDepartment
            @handleDepartmentSelected="(options) => options ? (departmentIds = options.map(department => department.id)) : []"
            :auto-close="false"
            :hide-selected="true"
            :reset="resetInput"
            />
          </b-form-group>
          <b-form-group class="col-md-4" label="Vị trí">
            <MultiSelectPosition
              :is-disabled="false"
              @handlePositionSelected="onSelectedPosition"
              :positionIds="positions"
              :multiple="true"
              :reset="resetInput"
              :departmentIds="department"
            >
            </MultiSelectPosition>
          </b-form-group>
          <b-form-group class="col-md-4" label="Hình thức làm việc">
            <MultiSelectWorkType
              @handleSelectedWorkType="(options) => options ? (workTypes = options.map(option => option.id)) : []"
              :positionCustom="positions"
              :multiple="true"
            >
            </MultiSelectWorkType>
          </b-form-group>

          <b-form-group class="col-md-4" label="Miền">
            <SingleSelectRegion
              :multiple="true"
              :reset="resetInput"
              @handleSelectedRegion="(options) => options ? (regions = options.map(option => option.id)) : []"
            />
          </b-form-group>
          <b-form-group class="col-md-4" label="Tỉnh">
             <MultiSelectProvince
              @handleProvinceSelected="(options) => options ? (provinceIds = options.map(option => option.id)) : []"
              :display-all="false"
              :limit-prop=99999
              :auto-close="false"
              :hide-selected="true"
              :reset="resetInput"
              :region="selectedRegion"
              :withRegions="false"
             />
          </b-form-group>
          <b-form-group class="col-md-4" label="Kho">
            <MultiSelectStation
            :hide-selected="true"
            :auto-close="true"
            :reset="resetInput"
            :provinceIds="provinces"
            :stationIds="stations"
            @handleStationSelected="(options) => options ? (stationIds = options.map(station => station.id)) : []"
            />
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-button :disabled="loading" class="mr-1" variant="success" @click="createTest">
            Xong
          </b-button>
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
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectDocumentType from 'components/elements/common/MultiSelectDocumentType'
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
    regions: [],
    provinceIds: [],
    stationIds: [],
    workTypes: [],
    resetInput: false,
    positions: '',
    stations: '',
    provinces: '',
    selectedRegion: '',
    department: '',
    category: null,
    categories: [],
    file: null,
    thumbnail: '',
    fileThumbnail: null
  }
}

export default {
  components: {
    quillEditor,
    MultiSelectStation,
    Datepicker,
    commonHelper,
    MultiSelectDocumentType,
    MultiSelectPosition,
    SingleSelectRegion,
    MultiSelectProvince,
    MultiSelectDepartment,
    MultiSelectWorkType,
    Multiselect
  },
  data: () => initialState(),
  created () {
    this.getCategories()
  },
  methods: {
    onSelectedPosition (value) {
      if (value) this.positionIds = value.constructor === Array ? value.map(item => item.id) : [value.id]
      else this.positionIds = []
    },
    async createTest () {
      try {
        this.loading = true

        let formData = new FormData()

        if (this.file) {
          formData.append('file', this.file)
        }

        formData.append('name', this.name)
        formData.append('start_days', this.dayOfDisplay)
        formData.append('description', this.description)
        formData.append('department_ids', this.departmentIds ? this.departmentIds.join() : '')
        formData.append('position_ids', this.positionIds ? this.positionIds.join() : '')
        formData.append('regions', this.regions ? this.regions.join() : '')
        formData.append('province_ids', this.provinceIds ? this.provinceIds.join() : '')
        formData.append('station_ids', this.stationIds ? this.stationIds.join() : '')
        formData.append('work_types', this.workTypes ? this.workTypes.join() : '')
        formData.append('category', this.category ? this.category.value : '')
        formData.append('thumbnail', this.thumbnail)
        formData.append('file_thumbnail', this.fileThumbnail)

        const { data } = await trainingService.createTrainingTest(formData)

        if (data.success) {
          commonHelper.showMessage('Tạo bài học thành công', 'success')
          this.reset()
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    reset () {
      Object.assign(this.$data, initialState(), {categories: this.categories})
      this.resetInput = !this.resetInput
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
    }
  },
  watch: {
    regions (newValue, oldValue) {
      if (newValue && (newValue.length > oldValue.length)) this.selectedRegion = newValue.join()
    },
    positionIds (value) {
      if (value) this.positions = value.join()
      else {
        this.positions = ''
        this.workTypes = []
      }
    },
    provinceIds (newValue, oldValue) {
      if (newValue && (newValue.length > oldValue.length)) this.provinces = newValue.join()
    },
    stationIds (value) {
      if (value) this.stations = value.join()
      else this.stations = ''
    },
    departmentIds (value) {
      if (value) this.department = value.join()
      else this.department = null
    },
    file (value) {
      if (value) {
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
