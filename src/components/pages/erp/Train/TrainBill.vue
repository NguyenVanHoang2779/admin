<template>
  <div>
    <b-card no-body>
      <b-card-body>
         <h4
          class="ui-block-heading"
          style="display: inline-flex"
        >Quản lí Train Bill</h4>
        <ladda-btn
          :loading="buttonExport.loading"
          data-style="expand-right"
          :disabled="buttonExport.disabled"
          @click.native="exportTrainBill"
          class="btn btn-success"
          style="float: right; margin-left: 10px"
        >
          <i class="ion ion-md-cloud-download" /> Xuất TrainBill
        </ladda-btn>
        <b-btn
          v-b-toggle.collapsePrice
          variant="success"
          style="float: right; margin-right: 10px"
        >
          <i class="ion ion-md-cash"></i>
          Upload đơn giá
        </b-btn>
        <b-collapse id="collapsePrice" accordion="my-accordion">
          <b-btn variant="success">
            <i class="ion ion-md-arrow-down" aria-hidden="true"></i>
            <a
              :href="'/admin/files/templates/train-price.xlsx'"
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
                <br />- Ngày giờ bay phải đúng định dạng yyyy-mm-dd. ví dụ:
                2020/10/09 hoặc 2020-10-09 <br />- Số tiền theo định dạng:
                1000000 (không có . hoặc , hoặc khoảng trắng). <br />- Mã tàu
                phải là SE1, SE2,...
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
                  <th>Upload file</th>
                  <th>Tổng số bản ghi</th>
                  <th>Thành công</th>
                  <th>Thất bại</th>
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
                  <td>{{ file.speed }}</td>
                  <td v-if="file.error">{{ file.error }}</td>
                  <td v-else-if="file.success">success</td>
                  <td v-else-if="file.active">active</td>
                  <td v-else></td>
                  <td>{{ notifyInsert.total }}</td>
                  <td>{{ notifyInsert.success }}</td>
                  <td>{{ notifyInsert.fail }}</td>
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
        <div class="filter">
          <b-row class="mb-2 justify-content-center">
            <b-col md="2" class="mb-2">
<!--              <flat-pickr-->
<!--                v-model="rangeTime"-->
<!--                :config="rangeConfig"-->
<!--                :placeholder="timeFormat.from + ' to ' + timeFormat.to"-->
<!--              />-->
              <v-date-picker color="green" placeholder="Chon thoi gian"
                             mode="range" v-model="rangeTime" locale="vi"/>
            </b-col>
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multiselect
                    v-model="trainOrder"
                    :options="trainOrders"
                    placeholder="Tìm kiếm theo mã tàu"
                    track-by="order"
                    label="code"
                    selectedLabel="Đã chọn"
                    deselectLabel="Bỏ chọn"
                    selectLabel="Chọn"
                    :allow-empty="true"
                    :searchable="true"
                    :internal-search="false"
                    :show-no-results="false"
                    :multiple="true"
                    :close-on-select="false"
                  >
                    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  </multiselect>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multiselect
                    v-model="pointCodeStart"
                    :options="pointCodes"
                    placeholder="Tỉnh nguồn"
                    track-by="id"
                    label="name"
                    selectedLabel="Đã chọn"
                    deselectLabel="Bỏ chọn"
                    selectLabel="Chọn"
                    :allow-empty="true"
                    :searchable="true"
                    :internal-search="false"
                    :show-no-results="false"
                  >
                    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  </multiselect>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group class="w-100">
                <b-input-group>
                  <multiselect
                    v-model="pointCodeEnd"
                    :options="pointCodes"
                    placeholder="Tỉnh đích"
                    track-by="id"
                    label="name"
                    selectedLabel="Đã chọn"
                    deselectLabel="Bỏ chọn"
                    selectLabel="Chọn"
                    :allow-empty="true"
                    :searchable="true"
                    :internal-search="false"
                    :show-no-results="false"
                  >
                    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  </multiselect>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mb-5 justify-content-center">
            <b-col md="1">
              <b-button variant="outline-success" @click="getTrainBills">
                <i class="sidenav-icon ion ion-md-search"></i>Tìm Kiếm
              </b-button>
            </b-col>
            <b-col md="1">
              <b-button variant="outline-danger" @click="reset">
                <i class="sidenav-icon ion ion-md-remove-circle"></i>Reset
              </b-button>
            </b-col>
          </b-row>
        </div>
        <!-- table -->
        <b-table
          striped
          hover
          responsive
          :fields="fieldsDataConfigCheckin"
          :items="dataConfig"
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template v-slot:cell(total_bag)="row">{{
            row.item.total_bag + " bao"
          }}</template>
        </b-table>
        <hr />
        <b-row class="d-flex justify-content-center">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import CompanyProfileService from 'domain/services/company-profile-service'
import Moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import config from 'config/app.base'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import VueUploadComponent from 'vue-upload-component'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import cycleTime from 'infrastructures/helpers/date.js'
import VCalendar from 'v-calendar'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'TrainBill',
  components: {
    Multiselect,
    Datepicker,
    FileUpload: VueUploadComponent,
    flatPickr,
    LaddaBtn,
    VCalendar
  },
  data () {
    return {
      buttonExport: {
        loading: false,
        disabled: false
      },
      rangeConfig: {
        mode: 'range',
        altInput: true,
        dateFormat: 'd-m-Y',
        altFormat: 'd-m-Y'
      },
      rangeTime: null,
      timeFormat: null,
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
        config.baseApiErpUrl + 'ErpCompanyProfile/insertTrainPrice ',
      notifyInsert: {
        failByNotFindCompany: '',
        failByNotHaveAwbCode: '',
        success: '',
        total: ''
      },
      perPage: 5,
      currentPage: 1,
      dataConfig: [],
      fieldsDataConfigCheckin: [
        { key: 'code', label: 'Mã bill', sortable: true },
        { key: 'train_name', label: 'Tên tàu', sortable: true },
        { key: 'date', label: 'Ngày xuất hành', sortable: true },
        {
          key: 'amount_actual',
          label: 'Khối lượng hàng thực tế',
          sortable: true
        },
        {
          key: 'amount_sys',
          label: 'Khối lượng hàng hệ thống ghi nhận',
          sortable: true
        },
        { key: 'total_bag', label: 'Tổng số bao', sortable: true },
        { key: 'total_pkg', label: 'Số lượng đơn hàng hệ thống ghi nhận', sortable: true },
        { key: 'src', label: 'Tỉnh nguồn', sortable: true },
        { key: 'dst', label: 'Tỉnh đích', sortable: true },
        { key: 'price', label: 'Chi phí chuyến', sortable: true }
      ],
      trainOrders: [],
      trainOrder: null,
      pointCodes: [],
      pointCodeStart: '',
      pointCodeEnd: '',
      listProvinces: {},
      listTrain: {}
    }
  },
  created () {
    this.getStartEndFromTimeRange()
  },
  async mounted () {
    await this.getListTrain()
    await this.getListTrainProvince()
    // lay danh sach tinh va tau theo dang id => name
    this.trainOrders.forEach((e) => {
      this.listTrain[e.order] = e.code
    })
    this.pointCodes.forEach((e) => {
      this.listProvinces[e.id] = e.name
    })
    await this.getAllTrainBills()
  },
  computed: {
    rows () {
      if (this.dataConfig instanceof Object) {
        return this.dataConfig.length
      } else return 0
    }
  },
  watch: {
    rangeTime: function (newVal, oldVal) {
      this.getStartEndFromTimeRange()
    }
  },
  methods: {
    async getAllTrainBills () {
      let dataSend = {
        start_date: this.timeFormat.from,
        end_date: this.timeFormat.to
      }
      let res = await CompanyProfileService.getTrainBills(dataSend)
      if (typeof res.data.data !== 'undefined') {
        commonHelper.showMessage(res.data.message, 'success')
        this.dataConfig = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy dữ liệu bill tàu')
    },
    async getTrainBills () {
      let trainOrderSend = null
      if (this.trainOrder instanceof Array) {
        trainOrderSend = this.trainOrder.map((e) => e.order)
      }
      let dataSend = {
        src:
          this.pointCodeStart instanceof Object ? this.pointCodeStart.id : null,
        des: this.pointCodeEnd instanceof Object ? this.pointCodeEnd.id : null,
        start_date: this.timeFormat.from,
        end_date: this.timeFormat.to,
        train_order: trainOrderSend
      }
      let res = await CompanyProfileService.getTrainBills(dataSend)
      if (typeof res.data.data !== 'undefined') {
        commonHelper.showMessage(res.data.message, 'success')
        this.dataConfig = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy dữ liệu')
    },
    async exportTrainBill () {
      let trainOrderSend = null
      if (this.trainOrder instanceof Array) {
        trainOrderSend = this.trainOrder.map((e) => e.order)
      }
      let dataSend = {
        src:
          this.pointCodeStart instanceof Object ? this.pointCodeStart.id : null,
        des: this.pointCodeEnd instanceof Object ? this.pointCodeEnd.id : null,
        start_date: this.timeFormat.from,
        end_date: this.timeFormat.to,
        train_order: trainOrderSend
      }
      let res = await CompanyProfileService.exportTrainBill(dataSend)
      this.buttonExport.loading = false
      if (typeof res.data.data !== 'undefined') {
        if (res.data.success) {
          window.location.href = res.data.data
        }
      } else commonHelper.showMessage('Có lỗi khi lấy dữ liệu')
    },
    async getListTrain () {
      let res = await CompanyProfileService.getListTrain()

      this.trainOrders = []
      if (typeof res.data.data !== 'undefined') {
        let trainOrders = res.data.data

        for (const [key, code] of Object.entries(trainOrders)) {
          this.trainOrders.push({
            order: key,
            code: code
          })
        }
      } else commonHelper.showMessage('Có lỗi khi lấy danh sách tàu')
    },
    async getListTrainProvince () {
      let res = await CompanyProfileService.getListTrainProvince()
      if (typeof res.data.data !== 'undefined') {
        this.pointCodes = res.data.data
      } else commonHelper.showMessage('Có lỗi khi lấy danh sách tàu')
    },
    reset () {
      this.pointCodeStart = ''
      this.pointCodeEnd = ''
      this.date = new Moment().format('YYYY-MM-DD')
      this.trainOrder = null
      this.rangeTime = null
      this.timeFormat = {
        from: null,
        to: null
      }
      this.getStartEndFromTimeRange()
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
    getStartEndFromTimeRange () {
      if (!this.rangeTime) {
        let startYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('YYYY'))
        let startMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('MM')) - 1
        let startDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('DD'))

        let endYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('YYYY'))
        let endMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('MM')) - 1
        let endDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('DD'))

        this.rangeTime = {
          start: new Date(startYear, startMonth, startDay),
          end: new Date(endYear, endMonth, endDay)
        }

        this.timeFormat = {
          from: cycleTime.daysInThisMonth(21, 20).from,
          to: cycleTime.daysInThisMonth(21, 20).to
        }
        return true
      }
      this.timeFormat = {
        from: Moment(this.rangeTime.start, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        to: Moment(this.rangeTime.end, 'DD-MM-YYYY').format('YYYY-MM-DD')
      }
    }
  }
}
</script>

<style scoped>
</style>
