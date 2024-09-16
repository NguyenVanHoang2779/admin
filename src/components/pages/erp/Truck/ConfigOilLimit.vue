<template>
  <div>
    <b-card class="mb-3" no-body>
      <b-card-body>
        <div class="ui-block">
          <h1
            style="display: inline-flex"
            class="ui-block-heading"
          >Upload định mức dầu</h1>
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
                :href="'/admin/files/templates/template_config_oil_limit.xlsx'"
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
        </div>
      </b-card-body>
    </b-card>
    <b-card class="mb-3" no-body>
      <!--        filter range     -->
      <b-card-body>
        <b-row>
          <b-col>
            <b-form-group label="Biển kiểm soát">
              <multiselect class="multiselect-primary"
                           v-model="filter.truck_order"
                           :options="listTruckOrder"
                           placeholder="Chọn biển kiểm soát"
                           selectedLabel="Đã chọn"
                           deselectLabel="Bỏ chọn"
                           selectLabel="Chọn"
                           track-by="order"
                           label="code"
                           :disabled="false"
                           :searchable="true"
                           :multiple="true"
                           :hide-selected="true"
                           :allow-empty="true"
                           :close-on-select="false"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Trọng tải">
              <b-form-select v-model="filter.weight_selected" :options="filter.weight_options"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-1 justify-content-md-center">
          <b-button variant="outline-info" @click="getConfig('search')">
            <i class="sidenav-icon ion ion-md-search"></i>
            Tìm kiếm
          </b-button>
        </b-row>
      </b-card-body>
    </b-card>
    <b-card class="mb-3" no-body>
      <!--        list config      -->
      <b-card-body>
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
            <th class="text-center">#</th>
            <th class="text-center">Biển kiểm soát</th>
            <th class="text-center">Trọng tải</th>
            <th class="text-center">Đồng bằng</th>
            <th class="text-center">Trung du</th>
            <th class="text-center">Đồi núi</th>
          </tr>
          </thead>
          <tbody v-for="(data, index) in dataGroupConfig" :key="index">
          <tr class="table-light">
            <td class="text-center">{{ index + perPage*(currentPage-1) }}</td>
            <td class="text-center">{{data.truck_code}}</td>
            <td class="text-center">
              {{ data.weight }} tấn
            </td>
            <td class="text-center">
              {{ data.cf_oil_lv0 }}
            </td>
            <td class="text-center">
              {{ data.cf_oil_lv1 }}
            </td>
            <td class="text-center">
              {{ data.cf_oil_lv2 }}
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
            v-on:input="getConfig('page')"
          />
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Multiselect from 'vue-multiselect'
import VCalendar from 'v-calendar'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import VueUploadComponent from 'vue-upload-component'
import Vue from 'vue'
import config from 'config/app.base'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})

const DEFAULT = 'default'
const SEARCH = 'search'
const PAGE = 'page'

export default {
  name: 'ConfigOilLimit',
  components: {
    VueMonthlyPicker,
    Multiselect,
    flatPickr,
    VCalendar,
    FileUpload: VueUploadComponent
  },
  filters: {
    array_to_string: function (value) {
      let res = ''

      value.forEach(data => {
        res += data + ', '
      })

      return res.slice(0, -2)
    }
  },
  mounted () {
    this.getConfig()
    this.getListTruckOrder()
  },
  data: () => ({
    filter: {
      truck_order: null,
      truck_code: null,
      weight_selected: 'all',
      weight_options: [
        { value: 'all', text: 'Tất cả' },
        { value: 0.5, text: '0.5 tấn' },
        { value: 1.25, text: '1.25 tấn' },
        { value: 1.9, text: '1.9 tấn' },
        { value: 2.5, text: '2.5 tấn' },
        { value: 3.5, text: '3.5 tấn' },
        { value: 5, text: '5 tấn' },
        { value: 8, text: '8 tấn' },
        { value: 15, text: '15 tấn' }
      ]
    },
    oldRequest: {
      truck_order: null,
      truck_code: null,
      weight_selected: null
    },
    listTruckOrder: [],
    type: DEFAULT,
    pageAppLoading: false,
    appLoading: false,
    visible: false,
    filterConfig: '',
    isLoading: false,
    totalItems: 0,
    perPage: 5,
    currentPage: 1,
    dataConfig: [],
    dataGroupConfig: [],
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
      config.baseApiErpUrl + 'ErpConfigOilLimit/insertConfig ',
    notifyInsert: ''
  }),
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

    async getConfig (type = DEFAULT) {
      this.type = type
      this.pageAppLoading = true
      let dataSend = {
        'limit': this.perPage
      }
      if (type === SEARCH) {
        dataSend.page = 1
        dataSend.weight = this.filter.weight_selected
        this.oldRequest.weight_selected = this.filter.weight_selected

        if (this.filter.truck_order) {
          dataSend.truck_order = this.filter.truck_order.map(e => e.order)
          this.oldRequest.truck_order = dataSend.truck_order
        }
      } else if (type === PAGE) {
        dataSend.page = this.currentPage
        dataSend.truck_order = this.oldRequest.truck_order
        dataSend.weight = this.oldRequest.weight
      } else {
        dataSend.page = this.currentPage
      }

      let result = await CompanyProfileService.getConfigOilLimit(dataSend)
      if (result.data.success === false) {
        this.resetDataGroupConfig()
        commonHelper.showMessage(result.data.message, 'failed')
      } else {
        this.saveToDataGroupConfig(result)
        // commonHelper.showMessage(result.data.message, 'success')
      }
      this.pageAppLoading = false
    },

    saveToDataGroupConfig (result) {
      this.dataGroupConfig = []

      this.totalItems = result.data.total
      if (result.data.hasOwnProperty('data') && result.data.data !== null) {
        this.dataGroupConfig = Object.values(result.data.data || [])
      } else {
        commonHelper.showMessage('Không có bản ghi nào được tìm thấy', 'failed')
      }
    },

    async getListTruckOrder () {
      this.listTruckOrder = []
      let res = await CompanyProfileService.getListTruckOrder()
      if (res.data.success === false || res.data.data.length === 0) {
        commonHelper.showMessage('Không tìm thấy bản ghi nào', 'failed')
      } else {
        this.listTruckOrder = res.data.data
      }
    }

  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
