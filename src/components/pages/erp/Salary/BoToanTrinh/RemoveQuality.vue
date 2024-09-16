<template>
  <div>
    <create-config
      :region-options="regionOptions"
      :edit-config="editConfig"
      @resetForm="resetForm()"
      @afterCreatedConfig="afterCreatedConfig()"
      :is-created-config="isCreateConfig"
    />
    <b-card no-body>
      <b-card-body>
        <div class="ui-block mb-4">
          <h1
            style="display: inline-flex"
            class="ui-block-heading"
          >Quản lý toàn trình</h1>
          <b-btn variant="success" @click="createConfig()" style="float: right;">
            <i class="fa fa-plus-circle"></i>
            Tạo mới
          </b-btn>
          <b-btn
            v-b-toggle.collapseUpload
            variant="success"
            style="float: right; margin-right: 10px"
          >
            <i class="ion ion-md-cash"></i>
            Upload file
          </b-btn>
          <b-collapse id="collapseUpload" accordion="my-accordion">
            <b-btn variant="success">
              <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
              <a
                :href="'/admin/files/templates/template_bo_toan_trinh.xlsx'"
                class="text-white"
                target="_blank"
              >File mẫu</a
              >
            </b-btn>
            <b-btn v-b-toggle.collapse2 variant="danger"
            >Quy ước File upload</b-btn
            >
            <b-collapse id="collapse2" class="mt-2">
              <b-card>
                <p class="card-text">
                  - Chỉ cho phép upload file excel.
                  <br />- Ngày phải đúng định dạng yyyy-mm-dd. ví dụ:
                  2020/10/09 hoặc 2020-10-09 <br />- type chỉ được chọn 1 loại cho 1 hàng. Ví dụ: all
                  <br />- Các loại type :
                  <br />- All (Bỏ phạt tất cả các type) - 1
                  <br /> Po - Trung Chuyển Lấy - 2, Po - Trung Chuyển Trả - 3, Po - Xuất Trả -4, Po - Xuất Giao -5,Po - Chat - tiếp nhận -6,Chat - Phản hồi -7,Po - Giao Thành công -8,
                  <br /> XLH - P2B - 9, XLH - SORTING - 10, XLH - EXPORT - 11, XLH - PALLET - 12, XLH - IMPORT - 13,
                  <br />- Không chọn type thì mặc định là tất cả
                </p>
              </b-card>
            </b-collapse>
            <div class="upload-train-price">
              <file-upload
                class="sr-only"
                :name="nameFilePrice"
                :post-action="postActionAddPrice"
                :extensions="extensions"
                :accept="accept"
                :multiple="multiple"
                :directory="directory"
                :size="size || 0"
                :thread="thread < 1 ? 1 : thread > 5 ? 5 : thread"
                :drop="drop"
                :add-index="addIndex"
                v-model="filePrices"
                @input-filter="inputFilter"
                @input-file="inputFilePrice"
                ref="uploadPrice"
              />
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>File name</th>
                  <th>Size</th>
                  <th>Speed</th>
                  <th>Các bản ghi lỗi</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="!filePrices.length">
                  <td colspan="12">
                    <div class="text-center p-5">
                      <h4>
                        Kéo thả file để upload
                        <div class="text-muted small my-3">hoặc</div>
                      </h4>
                      <label :for="nameFilePrice" class="btn btn-primary btn-lg"
                      >Chọn file</label
                      >
                    </div>
                  </td>
                </tr>
                <tr v-for="(file, index) in filePrices" :key="file.id">
                  <td>{{ index }}</td>
                  <td>
                    <div class="filename">{{ file.name }}</div>
                    <b-progress
                      :value="Number(file.progress)"
                      :variant="file.error ? 'danger' : ''"
                      :animated="file.active"
                      v-if="file.active || file.progress !== '0.00'"
                      height="6px"
                      style="margin: 4px 0 0 0"
                    />
                  </td>
                  <td>{{ (file.size / 1024 / 1024) | fileSize }} MB</td>
                  <td v-if="file.error">{{ file.error }}</td>
                  <td v-else-if="file.success">success</td>
                  <td v-else-if="file.active">active</td>
                  <td v-else></td>
                  <td>
                    <a v-if="notifyInsert" :href="notifyInsert">Download</a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <b-dd
              split
              :right="isRTL"
              @click="$refs.uploadPrice.$el.querySelector('input').click()"
            >
              <template slot="button-content">
                <i class="ion ion-md-add"></i> Chọn file upload
              </template>
            </b-dd>
            <b-btn
              v-if="!$refs.uploadPrice || !$refs.uploadPrice.active"
              @click="$refs.uploadPrice.active = true"
              variant="success"
            >
              <i class="ion ion-md-arrow-up" aria-hidden="true"></i> Xử lý file
            </b-btn>
            <b-btn
              v-else
              @click="$refs.uploadPrice.active = false"
              variant="danger"
            >
              <i class="ion ion-md-close" aria-hidden="true"></i> Hủy
            </b-btn>
          </b-collapse>
          <hr />
        </div>
        <b-row class="justify-content-md-center mb-2">
          <b-col md="3">
            <b-form-group label="Chọn ngày:">
              <v-date-picker color="green"
                             mode="range" v-model="range_time" locale="vi"/>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Chọn tỉnh:">
              <multi-select-province
                @handleProvinceSelected="handleProvinceSearch($event)"
                :display-all="false"
                :province-ids="provinceSearch"
                :limit-prop=99999
                :auto-close="false"
                :hide-selected="true"
              >
              </multi-select-province>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Chọn kho:">
              <multi-select-stations
                @handleStationSelected="handleStationSearch($event)"
                :display-all="true"
                :provinceIds="provinceSearch"
                :stationIds="stationSearch"
                :auto-close="false"
                :hide-selected="true">
              </multi-select-stations>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Chọn loại toàn trình:">
              <b-form-select v-model="type" :options="qualityType"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-4 mb-5 d-flex justify-content-center">
          <b-col md="1">
            <b-button variant="outline-info" @click="getConfigByConditions(false)">
              <i class="sidenav-icon ion ion-md-search"></i>
              Tìm kiếm
            </b-button>
          </b-col>
          <b-col md="1">
            <b-button variant="outline-danger" @click="resetFilter">
              <i class="sidenav-icon ion ion-ios-remove-circle"></i>
              Reset filter
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-button v-if="!pageAppLoading" variant="outline-danger" size="sm" class="mb-1" @click="deleteGroupConfig">
              <i class="fa fa-minus-circle"/> Xóa các ngày được chọn
            </b-button>
          </b-col>
        </b-row>
        <!-- Bang hien thi cac config bo toan trinh -->
        <div v-if="pageAppLoading" class="sk-circle sk-primary">
          <div class="sk-circle1 sk-child"></div>
          <div class="sk-circle2 sk-child"></div>
          <div class="sk-circle3 sk-child"></div>
          <div class="sk-circle4 sk-child"></div>
          <div class="sk-circle5 sk-child"></div>
          <div class="sk-circle6 sk-child"></div>
          <div class="sk-circle7 sk-child"></div>
          <div class="sk-circle8 sk-child"></div>
          <div class="sk-circle9 sk-child"></div>
          <div class="sk-circle10 sk-child"></div>
          <div class="sk-circle11 sk-child"></div>
          <div class="sk-circle12 sk-child"></div>
        </div>
        <table v-else id="my-table" class="table b-table table-bordered table-striped">
          <thead>
          <tr class="text-primary">
            <th class="d-flex justify-content-center align-items-center">
              <b-form-checkbox @input="toggleAllGroup"></b-form-checkbox>
            </th>
            <th class="text-center">Ngày</th>
            <th class="text-center">Tỉnh</th>
            <th class="text-center">Kho</th>
            <th class="text-center">Tháng</th>
            <th class="text-center">Năm</th>
<!--            <th class="text-center">Loại</th>-->
            <th class="text-center"><i class="fa fa-cogs"/></th>
          </tr>
          </thead>
          <tbody v-for="(data, index) in dataGroupConfig" :key="index">
          <tr class="table-light">
            <td class="d-flex justify-content-center align-items-center">
              <b-form-checkbox :value=data.id v-model="groupSelected" ></b-form-checkbox>
            </td>
            <td class="text-center">{{data.date}}</td>
            <td class="text-center">
              <ListView
                :options="data.province_name"
              />
            </td>
            <td class="text-center">
              <ListView
                :options="data.station_name"
              />
            </td>
            <td class="text-center">
              {{data.month}}
            </td>
            <td class="text-right">
              {{data.year}}
            </td>
<!--            <td class="text-right">-->
<!--              {{data.type | array_to_string}}-->
<!--            </td>-->
            <td class="text-center">
              <b-button v-if="!listCollapse[data.id]" size="sm" variant="outline-success" @click="getDataCollapse(data)">
                <i class="fa fa-pencil-alt"/>
              </b-button>
              <b-button v-else size="sm" variant="outline-warning" @click="unCollapse(data)">
                <i class="fa fa-window-close"/>
              </b-button>
            </td>
          </tr>
          <tr>
            <td colspan="100%" style="padding: 0; border: 0">
              <b-collapse :id="data.id + ''" v-model="listCollapse[data.id + '']">
                <div>
                  <b-card>
                    <div v-if="appLoading" class="sk-folding-cube sk-primary">
                      <div class="sk-cube1 sk-cube"></div>
                      <div class="sk-cube2 sk-cube"></div>
                      <div class="sk-cube4 sk-cube"></div>
                      <div class="sk-cube3 sk-cube"></div>
                    </div>
                    <div v-else>
                      <p class="text-center text-info" style="font-size: 20px" >Ngày {{ data.date }}</p>
                      <div class="text-center">
                        <b-button size="sm" variant="outline-danger" class="mb-5" @click="deleteConfig">
                          <i class="fa fa-minus-circle"/> Xóa các bản ghi đã chọn
                        </b-button>
                        <b-modal id="delete-modal" hide-footer title="Warning">
                          <p class="my-4">Bạn chưa chọn bản ghi nào cả!</p>
                        </b-modal>
                        <div v-if="deleting" class="sk-rotating-plane sk-primary"></div>
                      </div>
                      <table class="table table-bordered">
                        <thead>
                        <tr class="table-info">
                          <th class="d-flex justify-content-center align-items-center">
                            <b-form-checkbox @input="collapseAll" ></b-form-checkbox>
                          </th>
                          <th class="text-center">#</th>
                          <th class="text-center">Tỉnh</th>
                          <th class="text-center">Kho</th>
                          <th class="text-center">Tháng</th>
                          <th class="text-center">Năm</th>
                          <th class="text-center">Loại</th>
                          <th class="text-center">Tạo lúc</th>
                          <th class="text-center"><i class="fa fa-cogs"/></th>
                        </tr>
                        </thead>
                        <tbody v-for="(data, index) in dataConfig" :key="index" class="table-danger">
                        <tr>
                          <td class="d-flex justify-content-center align-items-center">
                            <b-form-checkbox :value=data.id v-model="optionSelect" ></b-form-checkbox>
                          </td>
                          <td class="text-center">{{index}}</td>
                          <td class="text-center">{{data.province_name[0]}}</td>
                          <td class="text-center">{{data.name}}</td>
                          <td class="text-center">
                            {{data.month}}
                          </td>
                          <td class="text-right">
                            {{data.year}}
                          </td>
                          <td class="text-right">
                            {{data.type | quality_type}}
                          </td>
                          <td class="text-center">{{data.created}}</td>
                          <td class="text-center">
                            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-success" @click="updateConfig(data)"><i class="fa fa-pencil-alt"></i></b-button>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </b-card>
                </div>
              </b-collapse>
            </td>
          </tr>
          </tbody>
        </table>
<!--        phan trang-->
        <b-row class="d-flex justify-content-center">
          <b-pagination
            :total-rows="totalItems"
            v-model="currentPage"
            :per-page="perPage"
            v-on:input="getConfigByConditions(false)"
          />
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import CreateConfig from './Component/createConfig'
import VueMonthlyPicker from 'vue-monthly-picker'
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from './Component/MultiSelectProvince'
import MultiSelectStations from '../ConfigCheckinComponent/MultiSelectStation'
import ListView from './Component/ListView'
import VCalendar from 'v-calendar'
import flatPickr from 'vue-flatpickr-component'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SalaryService from 'domain/services/salary-service'
import 'flatpickr/dist/flatpickr.css'
import Moment from 'moment'
import cycleTime from 'infrastructures/helpers/date.js'
import VueUploadComponent from 'vue-upload-component'
import Vue from 'vue'
import config from 'config/app.base'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'RemoveQuality',
  components: {
    CreateConfig,
    VueMonthlyPicker,
    Multiselect,
    flatPickr,
    ListView,
    MultiSelectProvince,
    MultiSelectStations,
    VCalendar,
    FileUpload: VueUploadComponent
  },
  filters: {
    quality_type: function (value) {
      if (!value) return ''
      value = value.toString()
      let res = ''
      switch (value) {
        case '1': {
          res = 'All'
          break
        }
        case '2': {
          res = 'Po - Trung Chuyển Lấy'
          break
        }
        case '3': {
          res = 'Po - Trung Chuyển Trả'
          break
        }
        case '4': {
          res = 'Po - Xuất Trả'
          break
        }
        case '5': {
          res = 'Po - Xuất Giao'
          break
        }
        case '6': {
          res = 'Po - Chat - tiếp nhận'
          break
        }
        case '7': {
          res = 'Po - Chat - Phản hồi'
          break
        }
        case '8': {
          res = 'Po - Giao Thành công'
          break
        }
        case '9': {
          res = 'XLH - P2B'
          break
        }
        case '10': {
          res = 'XLH - SORTING'
          break
        }
        case '11': {
          res = 'XLH - EXPORT'
          break
        }
        case '12': {
          res = 'XLH - PALLET'
          break
        }
        case '13': {
          res = 'XLH - IMPORT'
          break
        }
        default: {
          return 'All'
        }
      }
      return res
    },

    array_to_string: function (value) {
      let res = ''

      value.forEach(data => {
        res += data + ', '
      })

      return res.slice(0, -2)
    }
  },
  mounted () {
    // this.getListStations()
    // this.getGroupConfig()
    this.getStartEndFromTimeRange()
    this.getConfigByConditions()
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  data: () => ({
    range_time: null,
    time_format: null,
    deleting: false,
    lastRequest: {},
    groupIdSelected: false,
    pageAppLoading: false,
    appLoading: false,
    listCollapse: [],
    // danh sach cac o duoc tich
    optionSelect: [],
    groupSelected: [],
    isAllGroupSelected: false,
    editConfig: null,
    regionOption: [
      {id: 10, name: 'Miền Bắc'}
    ],
    regionOptions: [
      {id: 10, name: 'Miền Bắc'},
      {id: 20, name: 'Miền Trung'},
      {id: 30, name: 'Miền Nam'}
    ],
    workTypeOptions: [
      {id: 'fulltime', name: 'Full Time'},
      {id: 'partime', name: 'Part Time'}
    ],
    isCreateConfig: false,
    visible: false,
    station: null,
    listStations: [],
    stationSearch: null,
    provinceSearch: null,
    type: '1',
    filterConfig: '',
    isLoading: false,
    totalItems: 0,
    perPage: 5,
    currentPage: 1,
    dataConfig: [],
    dataGroupConfig: [],
    fieldsDataConfigCheckin: [
      { key: 'name', label: 'Tên kho', sortable: true },
      { key: 'date', label: 'Ngày', sortable: true },
      { key: 'month', label: 'Tháng', sortable: true },
      { key: 'year', label: 'Năm', sortable: true },
      { key: 'type', label: 'Loại', sortable: true },
      { key: 'created', label: 'Tạo lúc', sortable: true }
    ],
    qualityType: [
      {
        text: 'All',
        value: '1'
      },
      {
        text: 'Po - Trung Chuyển Lấy',
        value: '2'
      },
      {
        text: 'Po - Trung Chuyển Trả',
        value: '3'
      },
      {
        text: 'Po - Xuất Trả',
        value: '4'
      },
      {
        text: 'Po - Xuất Giao',
        value: '5'
      },
      {
        text: 'Po - Chat - tiếp nhận',
        value: '6'
      },
      {
        text: 'Po - Chat - Phản hồi',
        value: '7'
      },
      {
        text: 'Po - Giao Thành công',
        value: '8'
      },
      {
        text: 'XLH - P2B',
        value: '9'
      },
      {
        text: 'XLH - SORTING',
        value: '10'
      },
      {
        text: 'XLH -  EXPORT',
        value: '11'
      },
      {
        text: 'XLH -  PALLET',
        value: '12'
      },
      {
        text: 'XLH -  IMPORT',
        value: '13'
      }
    ],
    // upload file
    files: [],
    filePrices: [],
    name: 'file',
    nameFilePrice: 'filePrice',
    accept:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: 'xls,xlsx',
    minSize: 1024,
    size: 1024 * 1024 * 10,
    multiple: false,
    directory: false,
    drop: true,
    addIndex: false,
    thread: 3,
    indexTypeEmp: 0,
    postActionAddPrice:
      config.baseApiErpUrl + 'ErpTimeRemoveQuality/insertConfig ',
    notifyInsert: ''
  }),
  watch: {
    range_time: function () {
      this.getStartEndFromTimeRange()
    }
  },
  methods: {
    inputFilter (newFile, oldFile, prevent) {
      this.isPrepareUpload = true
      this.packagesInProgress = this.countPackages = 0
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },

    inputFilePrice (newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.uploadPrice.update(newFile, { error: 'size' })
          }
        }
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          // Get response data
          let response = newFile.response
          this.$notify({
            group: 'notifications-default',
            type: response.success ? '' : 'bg-danger text-white',
            title: response.success ? 'Thành công' : 'Lỗi',
            text: response.message
          })
          if (response.success === true) {
            this.notifyInsert = response.data.path
          }
        }
      }
    },

    getStartEndFromTimeRange () {
      if (!this.range_time) {
        let startYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('YYYY'))
        let startMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('MM')) - 1
        let startDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('DD'))

        let endYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('YYYY'))
        let endMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('MM')) - 1
        let endDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('DD'))

        this.range_time = {
          start: new Date(startYear, startMonth, startDay),
          end: new Date(endYear, endMonth, endDay)
        }

        this.time_format = {
          from: cycleTime.daysInThisMonth(21, 20).from,
          to: cycleTime.daysInThisMonth(21, 20).to
        }
        return true
      }
      this.time_format = {
        from: Moment(this.range_time.start, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        to: Moment(this.range_time.end, 'DD-MM-YYYY').format('YYYY-MM-DD')
      }
    },

    async getDataCollapse (data) {
      this.appLoading = true
      this.collapseSelected(data.id)
      await this.getConfig(data)
      this.appLoading = false
    },

    unCollapse () {
      this.listCollapse = this.listCollapse.map(() => false)
      this.optionSelect = []
    },

    collapseSelected (id) {
      this.groupIdSelected = false
      this.listCollapse = this.listCollapse.map(() => false)
      this.listCollapse[id] = true
    },

    collapseAll () {
      if (this.groupIdSelected === true) {
        this.optionSelect = []
      } else {
        this.optionSelect = this.dataConfig.map(e => e.id)
      }
      this.groupIdSelected = !this.groupIdSelected
    },

    toggleAllGroup () {
      if (this.isAllGroupSelected === true) {
        this.groupSelected = []
      } else {
        this.groupSelected = this.dataGroupConfig.map(e => e.id)
      }
      this.isAllGroupSelected = !this.isAllGroupSelected
    },

    createConfig () {
      this.isCreateConfig = true
      this.$bvModal.show('create-config-quality')
    },

    resetForm: function () {
      this.editConfig = null
    },

    afterCreatedConfig: function () {
      this.reUpdateConfig()
    },

    async removeQuality () {
      try {
        if (!(this.station instanceof Object)) {
          commonHelper.showMessage('Chưa chọn kho')
          return
        }

        let dataSend = {
          start_date: this.time_format['from'],
          end_date: this.time_format['to'],
          station_id: this.station.id,
          type: this.type
        }
        // gui request len server
        let result = await SalaryService.removeQuality(dataSend)
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    async getListStations () {
      try {
        let res = await SalaryService.getListStationsToanTrinh()
        this.listStations = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    async getConfig (data) {
      this.optionSelect = []
      try {
        let dataSend = {
          'station_id': data.station_id,
          'date': data.date,
          'type': data.type_id
        }
        let result = await SalaryService.getConfigBoToanTrinh(dataSend)

        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          this.dataConfig = result.data.data
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    saveToDataGroupConfig (result) {
      this.dataGroupConfig = []

      this.totalItems = result.data.total
      let res = Object.values(result.data.data)

      let index = 0
      this.dataGroupConfig = res.map((value) => {
        this.listCollapse.push(false)

        value['id'] = index++
        return value
      })
    },

    async getGroupConfig () {
      try {
        this.pageAppLoading = true
        let result = await SalaryService.getGroupTimeRemoveQuality()

        if (result.data.success === false) {
          this.resetDataGroupConfig()
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          this.saveToDataGroupConfig(result)
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
      this.pageAppLoading = false
    },

    async getConfigByConditions (useLastRequest = false) {
      this.unCollapse()
      this.pageAppLoading = true

      try {
        // tach ra ngay bat dau va ngay ket thuc
        let from = this.time_format['from']
        let to = this.time_format['to']

        let station = null
        if (this.stationSearch !== null) {
          station = this.stationSearch.split(',')
        }

        let province = null
        if (this.provinceSearch !== null) {
          province = this.provinceSearch.split(',')
        }

        let dataSend = {
          from: from,
          to: to,
          station_id: station,
          province_id: province,
          type: this.type,
          per_page: this.perPage,
          page: this.currentPage - 1
        }

        if (useLastRequest) {
          dataSend = this.lastRequest
        }
        this.lastRequest = dataSend
        let result = await SalaryService.getGroupTimeRemoveQuality(dataSend)

        if (result.data.success === false) {
          this.resetDataGroupConfig()
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          this.saveToDataGroupConfig(result)
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
      this.pageAppLoading = false
    },

    async deleteConfig () {
      if (this.optionSelect.length === 0) {
        setTimeout(() => { this.$bvModal.show('delete-modal') }, 0)
        setTimeout(() => { this.$bvModal.hide('delete-modal') }, 1700)
        return
      }

      this.deleting = true
      try {
        let dataSend = {
          id: this.optionSelect
        }
        let result = await SalaryService.deleteConfigTRQ(dataSend)

        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          this.reUpdateConfig()
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
      this.deleting = false
    },

    reUpdateConfig () {
      this.getConfigByConditions(true)
    },

    handleStationSearch (option) {
      this.stationSearch = option ? option.map((item) => item.id).toString() : null
    },

    handleProvinceSearch (option) {
      this.provinceSearch = option ? option.map((item) => item.id).toString() : null
    },

    resetFilter () {
      this.station = null
      this.stationSearch = null
      this.provinceSearch = null
      this.type = 1
    },

    resetDataGroupConfig () {
      this.dataGroupConfig = []
      this.dataConfig = []
      this.totalItems = 0
    },

    async deleteGroupConfig () {
      let listGroupId = this.groupSelected
      let listConfigWillRemove = this.getConfigIdByGroupId(listGroupId)

      if (listConfigWillRemove.length === 0) {
        setTimeout(() => { this.$bvModal.show('delete-modal') }, 0)
        setTimeout(() => { this.$bvModal.hide('delete-modal') }, 1700)
        return
      }

      this.pageAppLoading = true
      try {
        let dataSend = {
          id: listConfigWillRemove
        }
        let result = await SalaryService.deleteConfigTRQ(dataSend)

        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          this.groupSelected = []
          this.reUpdateConfig()
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
      this.pageAppLoading = false
    },

    getConfigIdByGroupId (listGroupId) {
      let res = []
      let listGroupConfig = this.dataGroupConfig.filter(e => listGroupId.indexOf(e.id) !== -1)
      listGroupConfig.forEach(e => { res = [...res, ...e['list_config_id']] })

      return res
    },

    updateConfig (data) {
      this.editConfig = data
      this.isCreateConfig = false
      this.$bvModal.show('create-config-quality')
    }

  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
