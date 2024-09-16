<template>
  <div>
    <div class="ui-block">
      <h4
        class="ui-block-heading"
        style="display: inline-flex"
      >Quản lý AWB của công ty vận tải hàng không</h4>
      <ladda-btn
        :loading="buttonExport.loading"
        data-style="expand-right"
        :disabled="buttonExport.disabled"
        @click.native="exportAwb"
        class="btn btn-success"
        style="float: right; margin-left: 10px"
      >
        <i class="ion ion-md-cloud-download" /> Xuất Awb ra excel
      </ladda-btn>
      <b-btn v-b-toggle.collapseUpload variant="success" style="float: right">
        <i class="ion ion-md-airplane"></i>
        Upload Awb
      </b-btn>
      <b-btn v-b-toggle.collapsePrice variant="success" style="float: right; margin-right: 10px">
        <i class="ion ion-md-cash"></i>
        Upload đơn giá
      </b-btn>

      <b-collapse id="collapsePrice" accordion="my-accordion">
        <b-btn variant="success">
          <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
          <a
            :href="'/admin/files/templates/awb_price_template_v2.xlsx'"
            class="text-white"
            target="_blank"
          >File mẫu</a>
        </b-btn>
        <b-btn v-b-toggle.collapse2 variant="danger">Quy ước File upload</b-btn>
        <b-collapse id="collapse2" class="mt-2">
          <b-card>
            <p class="card-text">
              - Chỉ cho phép upload file excel.
              <br />- Id công ty tồn tại thì bản ghi đó mới được insert.
              <br />- Ngày giờ bay phải đúng định dạng yyyy-mm-dd. ví dụ: 2020/02/18
              <br />- Số tiền theo định dạng: 1000000 (không có . hoặc , hoặc khoảng trắng).
              <br />
            </p>
          </b-card>
        </b-collapse>
        <div class="upload-awb">
          <file-upload
            class="sr-only"
            :name="nameFilePrice"
            :post-action="postActionAddPrice"
            :extensions="extensions"
            :accept="accept"
            :multiple="multiple"
            :directory="directory"
            :size="size || 0"
            :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
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
                <th>Upload file</th>
                <th>Tổng số bản ghi</th>
                <th>Cập nhật thành công</th>
                <th>Fail</th>
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
                    <label :for="nameFilePrice" class="btn btn-primary btn-lg">Chọn file</label>
                  </div>
                </td>
              </tr>
              <tr v-for="(file, index) in filePrices" :key="file.id">
                <td>{{index}}</td>
                <td>
                  <div class="filename">{{file.name}}</div>
                  <b-progress
                    :value="Number(file.progress)"
                    :variant="file.error ? 'danger' : ''"
                    :animated="file.active"
                    v-if="file.active || file.progress !== '0.00'"
                    height="6px"
                    style="margin: 4px 0 0 0"
                  />
                </td>
                <td>{{ file.size/1024/1024 | fileSize }} MB</td>
                <td>{{file.speed}}</td>
                <td v-if="file.error">{{file.error}}</td>
                <td v-else-if="file.success">success</td>
                <td v-else-if="file.active">active</td>
                <td v-else></td>
                <td>{{notifyInsert.total}}</td>
                <td>{{notifyInsert.success}}</td>
                <td>{{notifyInsert.fail}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-dd split :right="isRTL" @click="$refs.uploadPrice.$el.querySelector('input').click()">
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
        <b-btn v-else @click="$refs.uploadPrice.active = false" variant="danger">
          <i class="ion ion-md-close" aria-hidden="true"></i> Hủy
        </b-btn>
      </b-collapse>

      <b-collapse id="collapseUpload" accordion="my-accordion">
        <b-btn variant="success">
          <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
          <a
            :href="'/admin/files/templates/Booking_form.xlsx'"
            class="text-white"
            target="_blank"
          >File mẫu</a>
        </b-btn>
        <b-btn v-b-toggle.collapse1 variant="danger">Quy ước File upload</b-btn>
        <b-collapse id="collapse1" class="mt-2">
          <b-card>
            <p class="card-text">
              - Chỉ cho phép upload file excel.
              <br />- Mã công ty phải tồn tại thì mới bản ghi đó mới được upload, mã công ty gồm 6 chữ số, ví dụ: 000012.
              <br />- Ngày giờ bay phải đúng định dạng yyyy-mm-dd. ví dụ: 2020/02/18
              <br />- Những awb đã tồn tại chỉ update chứ không tạo bản ghi khác.
              <br />- Số tiền theo định dạng: 1000000 (không có . hoặc , hoặc khoảng trắng).
              <br />- Loại hàng hóa:
              <br />+ default: Loại thường.
              <br />+ bpbk: Bưu phẩm bưu cục.
              <br />+ breakable: Hàng dễ vỡ.
              <br />- Loại tải:
              <br />+ default: Loại tải thường.
              <br />+ hard: Loại tải cứng.
              <br />- Phương thức vận chuyển:
              <br />+ default: Thương mại.
              <br />+ cargo: Cargo.
              <br />- Các trường hợp lỗi nên chỉnh sửa và upload bằng file excel khác.
              <br />
            </p>
          </b-card>
        </b-collapse>
        <div class="upload-awb">
          <file-upload
            class="sr-only"
            :name="name"
            :post-action="postAction"
            :extensions="extensions"
            :accept="accept"
            :multiple="multiple"
            :directory="directory"
            :size="size || 0"
            :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
            :drop="drop"
            :add-index="addIndex"
            v-model="files"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="upload"
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
                <th>Upload file</th>
                <th>Tổng số bản ghi</th>
                <th>Cập nhật thành công</th>
                <th>Fail do sai mã công ty</th>
                <th>Fail do thiếu mã awb</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!files.length">
                <td colspan="12">
                  <div class="text-center p-5">
                    <h4>
                      Kéo thả file để upload
                      <div class="text-muted small my-3">hoặc</div>
                    </h4>
                    <label :for="name" class="btn btn-primary btn-lg">Chọn file</label>
                  </div>
                </td>
              </tr>
              <tr v-for="(file, index) in files" :key="file.id">
                <td>{{index}}</td>
                <td>
                  <div class="filename">{{file.name}}</div>
                  <b-progress
                    :value="Number(file.progress)"
                    :variant="file.error ? 'danger' : ''"
                    :animated="file.active"
                    v-if="file.active || file.progress !== '0.00'"
                    height="6px"
                    style="margin: 4px 0 0 0"
                  />
                </td>
                <td>{{ file.size/1024/1024 | fileSize }} MB</td>
                <td>{{file.speed}}</td>
                <td v-if="file.error">{{file.error}}</td>
                <td v-else-if="file.success">success</td>
                <td v-else-if="file.active">active</td>
                <td v-else></td>
                <td>{{notifyInsert.total}}</td>
                <td>{{notifyInsert.success}}</td>
                <td>{{notifyInsert.failByNotFindCompany}}</td>
                <td>{{notifyInsert.failByNotHaveAwbCode}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-dd split :right="isRTL" @click="$refs.upload.$el.querySelector('input').click()">
          <template slot="button-content">
            <i class="ion ion-md-add"></i> Chọn file upload
          </template>
        </b-dd>
        <b-btn
          v-if="!$refs.upload || !$refs.upload.active"
          @click="$refs.upload.active = true"
          variant="success"
        >
          <i class="ion ion-md-arrow-up" aria-hidden="true"></i> Xử lý file
        </b-btn>
        <b-btn v-else @click="$refs.upload.active = false" variant="danger">
          <i class="ion ion-md-close" aria-hidden="true"></i> Hủy
        </b-btn>
      </b-collapse>
      <hr />

      <div class="mb-2">
        <b-row class="h-col-50">
          <b-col md="2">
            <input
              placeholder="Mã AWB"
              v-model="awb_code"
              type="text"
              @keyup.enter="search"
              class="form-control"
            />
          </b-col>
          <b-col md="2">
            <b-form-group class="w-100">
              <b-input-group>
                <single-select-company-profile
                  v-model="companyId"
                  :show-info="true"
                  @handleChooseProfileCompany="handleChooseProfileCompany"
                  :master-id="companyId"
                  company-type="3"
                ></single-select-company-profile>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <input
              placeholder="Tìm theo chặng bay"
              v-model="flight"
              type="text"
              min="9"
              max="12"
              class="form-control"
            />
          </b-col>
          <b-col md="2" class="mb-2">
<!--            <flat-pickr-->
<!--              v-model="range_time"-->
<!--              :config="rangeConfig"-->
<!--              :placeholder="time_format.from + ' to ' + time_format.to"-->
<!--            />-->
            <v-date-picker color="green" placeholder="Chon thoi gian"
                           mode="range" v-model="range_time" locale="vi"/>
          </b-col>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="status" :options="statusOptions"></b-form-select>
          </b-col>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="typePackage" :options="typePackageOptions"></b-form-select>
          </b-col>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="transport_pkg_type" :options="transportPkgTypeOptions"></b-form-select>
          </b-col>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="transport_plane_type" :options="transportPlaneTypeOptions"></b-form-select>
          </b-col>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="transit" :options="transitOptions"></b-form-select>
          </b-col>
          <b-col md="2" class="text-right">
            <b-btn type="button" variant="primary" @click="search()">
              <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
            </b-btn>
            <b-btn type="button" variant="success" @click="reset()">Reset</b-btn>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <div class="wrapper-list-master" v-loading="appLoading">
          <b-card no-body v-if="listAwbs.length > 0">
            <table class="table mb-0 table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên đại lý</th>
                  <th>Chặng bay</th>
                  <th>Ngày bay</th>
                  <th>Giờ bay</th>
                  <th>Số hiệu</th>
                  <th>Mã AWB</th>
                  <th>Khối lượng tối đa</th>
                  <th>Khối lượng thực tế</th>
                  <th>Loại tải</th>
                  <th>Kho nguồn</th>
                  <th>Đơn giá (Đã bao gồm VAT)</th>
                  <th>Trạng thái</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listAwbs">
                  <td>{{index + currentPage * 10 - 9}}</td>
                  <td><router-link :to='{name: "awb-price", params: { companyId: item.company_id}}'>{{item.short_organization_name}}</router-link></td>
                  <td>{{item.flight}}</td>
                  <td>{{item.date_take_off}}</td>
                  <td>{{item.time_take_off}}</td>
                  <td>{{item.flight_number}}</td>
                  <td>{{item.awb_code}}</td>
                  <td>{{item.weight_max}}</td>
                  <td>{{item.weight_actual}}</td>
                  <td>
                    <span v-if="item.transport_pkg_type === 'default'">Tải thường</span>
                    <span v-if="item.transport_pkg_type === 'hard'">Tải cứng</span>
                  </td>
                  <td>{{item.station_origin_name}}</td>
                  <td>{{formatMoney(item.price)}}</td>
                  <td>
                    <span v-if="item.status == 1">Đã xác nhận</span>
                    <span v-else>Chưa xác nhận</span>
                  </td>
                  <td>
                    <ladda-btn
                      @click.native="showDetailAwb(item)"
                      data-style="zoom-out"
                      class="btn btn-outline-primary"
                    >
                      <i class="ion ion-md-eye"></i>
                    </ladda-btn>
                    <ladda-btn
                      @click.native="deleteAwb(item)"
                      data-style="zoom-out"
                      class="btn btn-outline-danger"
                    >
                      <i class="ion ion-md-trash"></i>
                    </ladda-btn>
                  </td>
                </tr>
              </tbody>
            </table>
            <modal-detail-awb :temp-awb="tempAwb"></modal-detail-awb>
            <div class="mt-3">
              <b-row>
                <b-col md="6">
                  <b-pagination
                    :total-rows="totalItems"
                    v-model="currentPage"
                    :per-page="perPage"
                    v-on:input="search"
                  />
                </b-col>
                <b-col md="6">
                  <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                </b-col>
              </b-row>
            </div>
          </b-card>
          <div v-if="appLoading === false && listAwbs.length === 0">
            <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy awb.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import config from 'config/app.base'
import CompanyProfileService from 'domain/services/company-profile-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectCompanyProfile from 'components/elements/common/SingleSelectCompanyProfile'
import ModalDetailAwb from './ModalDetailAwb'
import flatPickr from 'vue-flatpickr-component'
import cycleTime from 'infrastructures/helpers/date.js'
import moment from 'moment'
import VueUploadComponent from 'vue-upload-component'
import VCalendar from 'v-calendar'
import Vue from 'vue'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'ManageAwb',
  components: {
    FileUpload: VueUploadComponent,
    LaddaBtn,
    ModalDetailAwb,
    SingleSelectCompanyProfile,
    flatPickr,
    VCalendar
  },
  data: () => ({
    listAwbs: [],
    awb: {
      company_id: '',
      flight: '',
      date_take_off: '',
      time_take_off: '',
      flight_number: '',
      awb_code: '',
      weight_max: '',
      weight_actual: '',
      package_amount: '',
      type: null,
      status: null,
      price: '',
      box_amount: '',
      order_amount: ''
    },
    buttonExport: {
      loading: false,
      disabled: false
    },
    statusOptions: [
      { value: null, text: 'Chọn trạng thái' },
      { value: 1, text: 'Đã xác nhận' },
      { value: 2, text: 'Chưa xác nhận' }
    ],

    typePackageOptions: [
      { value: null, text: 'Chọn loại hàng' },
      { value: 'default', text: 'Loại thường' },
      { value: 'bpbk', text: 'Bưu phẩm, bưu cục' },
      { value: 'breakable', text: 'Hàng dễ vỡ' }
    ],
    transportPkgTypeOptions: [
      { value: null, text: 'Chọn loại tải' },
      { value: 'default', text: 'Loại tải thường' },
      { value: 'hard', text: 'Loại tải cứng' }
    ],
    transportPlaneTypeOptions: [
      { value: null, text: 'Loại tàu bay' },
      { value: 'default', text: 'Thương mại' },
      { value: 'cargo', text: 'Cargo' }
    ],
    transitOptions: [
      { value: null, text: 'Loại bill Transit' },
      { value: 1, text: 'Không transit' },
      { value: 2, text: 'Có transit' }
    ],
    awb_code: '',
    tempAwb: {},
    companyId: '',
    date: '',
    time: '',
    flight: '',
    status: null,
    typePackage: null,
    transport_pkg_type: null,
    transport_plane_type: null,
    transit: null,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    range_time: null,
    time_format: null,
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
    postAction: config.baseApiErpUrl + 'ErpCompanyProfile/insertAwbInfo',
    postActionAddPrice:
      config.baseApiErpUrl + 'ErpCompanyProfile/insertAwbPrice ',
    notifyInsert: {
      failByNotFindCompany: '',
      failByNotHaveAwbCode: '',
      success: '',
      total: ''
    }
  }),

  created () {
    this.getStartEndFromTimeRange()
    this.search()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    range_time: function (newVal, oldVal) {
      this.getStartEndFromTimeRange()
    }
  },

  methods: {
    formatMoney (amount) {
      return commonHelper.formatMoney(amount)
    },
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
    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      this.notifyInsert = {
        failByNotFindCompany: '',
        failByNotHaveAwbCode: '',
        success: '',
        total: ''
      }
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
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          // Get response data
          let response = JSON.parse(newFile.response)
          this.$notify({
            group: 'notifications-default',
            type: response.success ? '' : 'bg-danger text-white',
            title: response.success ? 'Thành công' : 'Lỗi',
            text: response.message
          })
          if (response.success === true) {
            this.notifyInsert = response.data
          }
        }
      }
    },

    // add, update, remove File Event
    inputFilePrice (newFile, oldFile) {
      this.notifyInsert = {
        fail: '',
        success: '',
        total: ''
      }
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
          let response = JSON.parse(newFile.response)
          this.$notify({
            group: 'notifications-default',
            type: response.success ? '' : 'bg-danger text-white',
            title: response.success ? 'Thành công' : 'Lỗi',
            text: response.message
          })
          if (response.success === true) {
            this.notifyInsert = response.data
          }
        }
      }
    },

    showDetailAwb (awb) {
      this.tempAwb = awb
      this.$bvModal.show('modal-detail-awb')
    },
    edit: function (index) {
      this.listAwbs[index].isEdit = !this.listAwbs[index].isEdit
    },

    getStartEndFromTimeRange () {
      if (!this.range_time) {
        let startYear = parseInt(moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('YYYY'))
        let startMonth = parseInt(moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('MM')) - 1
        let startDay = parseInt(moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('DD'))

        let endYear = parseInt(moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('YYYY'))
        let endMonth = parseInt(moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('MM')) - 1
        let endDay = parseInt(moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('DD'))

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
        from: moment(this.range_time.start, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        to: moment(this.range_time.end, 'DD-MM-YYYY').format('YYYY-MM-DD')
      }
    },

    search: function () {
      this.appLoading = true
      let params = {
        awb_code: this.awb_code,
        companyId: this.companyId,
        from: this.time_format.from,
        to: this.time_format.to,
        time: this.time,
        flight: this.flight,
        status: this.status,
        typePackage: this.typePackage,
        transport_pkg_type: this.transport_pkg_type,
        transport_plane_type: this.transport_plane_type,
        transit: this.transit,
        page: this.currentPage,
        limit: this.perPage
      }
      CompanyProfileService.getAwbs(params)
        .then((res) => {
          if (res.data.success) {
            this.listAwbs = res.data.data
            this.totalItems = res.data.count
            this.listAwbs.forEach((item, index) => {
              this.$set(this.listAwbs[index], 'isEdit', true)
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    exportAwb: function () {
      this.buttonExport.loading = true
      this.appLoading = true
      let params = {
        awb_code: this.awb_code,
        companyId: this.companyId,
        from: this.time_format.from,
        to: this.time_format.to,
        time: this.time,
        flight: this.flight,
        status: this.status,
        typePackage: this.typePackage,
        transport_pkg_type: this.transport_pkg_type,
        transport_plane_type: this.transport_plane_type,
        transit: this.transit
      }
      CompanyProfileService.exportAwb(params)
        .then((res) => {
          if (res.data.success) {
            window.location.href = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
          this.buttonExport.loading = false
        })
    },

    deleteAwb: function (data) {
      if (
        !confirm(
          `Bạn có chắc chắn muốn xóa awb có mã ${data.awb_code}, ngày ${data.date_take_off}?`
        )
      ) {
        return
      }
      let dataSend = {
        id: data.id
      }
      CompanyProfileService.deleteAwb(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.search()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    reset: function () {
      this.awb_code = ''
      this.companyId = ''
      this.date = ''
      this.time = ''
      this.flight = ''
      this.range_time = null
      this.status = null
      this.typePackage = null
      this.transport_pkg_type = null
      this.transport_plane_type = null
      this.transit = null
      this.time_format = {
        from: null,
        to: null
      }
      this.getStartEndFromTimeRange()
      this.search()
    },

    handleChooseProfileCompany (option) {
      this.companyId = option ? option.id : ''
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
.table td {
  vertical-align: middle;
}
.only-bottom-border {
  border-top: none;
  border-left: none;
  border-right: none;
}
.wrapper-list-master {
  position: relative;
  min-height: 120px;
}
</style>
