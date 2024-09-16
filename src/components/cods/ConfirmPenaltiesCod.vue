<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row>
          <h4 class="ml-2 mt-1">Quản lý phạt hàng hỏng vỡ</h4><br>
        </b-row>
        <b-row>
          <div class="text-note text-danger">
            Lưu ý: <br>
            <div class="pl-3">
              - CSKH có quyền xác nhận kết quả phạt đối với các report phát sinh trong kỳ lương chậm nhất vào ngày
              25 hàng tháng. <br>
            </div>
          </div>
        </b-row>
        <hr>
        <div class="row">
          <b-col cols="3">
            <b-form-group label="Chọn tỉnh/ thành phố">
              <multiselect
                v-model="province"
                label="name"
                track-by="code"
                placeholder="Mặc định là tất cả"
                :options="provinces"
                :searchable="true"
                :multiple="true"
                :close-on-select="false"
                :hide-selected="true"
                :allow-empty="true"
                :clearOption="true"
                @tag="addTag">
                >
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Chọn kho">
              <multiselect
                v-model="station"
                label="name"
                track-by="id"
                placeholder="Mặc định là tất cả"
                :options="stations"
                :searchable="true"
                :multiple="true"
                :close-on-select="false"
                :hide-selected="true"
                :allow-empty="true"
                :clearOption="true"
                >
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Mã shop">
              <b-form-input v-model="shopCode" placeholder="Shop code"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Mã đơn hàng">
              <b-form-input v-model="pkgOrder" placeholder="package order"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Chọn phân loại hàng">
              <multiselect
                v-model="valueIsFragile"
                label="name"
                track-by="code"
                placeholder="Mặc định là tất cả"
                :options="optionsIsFragile"
                :searchable="true"
                :multiple="true"
                :close-on-select="false"
                :hide-selected="true"
                :allow-empty="true"
                :clearOption="true"
                >
              </multiselect>
            </b-form-group>
          </b-col>
        </div>
        <div class="row">
          <b-col cols="3">
            <b-form-group label="Chọn COD">
              <multiselect
                v-model="user"
                label="name"
                track-by="id"
                placeholder="Chọn COD"
                :options="users"
                :multiple="false"
                :searchable="true"
                :loading="asyncLoading"
                :internal-search="false"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true"
                @search-change="asyncFind">
                <span slot="noResult">{{ message }}</span>
                <span slot="noOptions">{{ message }}</span>
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Chọn trạng thái">
              <multiselect
                v-model="valueStatus"
                label="name"
                track-by="code"
                placeholder="Mặc định là tất cả"
                :options="optionsStatus"
                :searchable="true"
                :multiple="true"
                :close-on-select="false"
                :hide-selected="true"
                :allow-empty="true"
                :clearOption="true"
                >
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Ngày bắt đầu">
              <datepicker
                v-model="startDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder="Ngày đào tạo"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Ngày kết thúc">
              <datepicker
                v-model="endDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder="Ngày đào tạo"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-col class="text-right d-flex p-0">
              <div style="margin-top:22px;" class="mr-4">
                <b-btn type="button" variant="outline-primary" @click="searchPenaltiesCod"><i
                  class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                </b-btn>
              </div>
              <div class="d-inline-block"  style="margin-top:22px;">
                <b-btn variant="outline-success" v-if="exportExcel === 0" @click="exportExcelReport">
                  <i class="ion ion-md-print"></i> Xuất phạt
                </b-btn>
                <b-btn v-else-if="exportExcel === 1" variant="outline-success" class="exporting-btn">
                  <span><i class="fa fa-spin fa-spinner mr-1"></i>Đang xuất...</span>
                </b-btn>
                <div class="d-inline-block" v-else @click="exportExcel = 0">
                  <b-btn variant="success" :href="urlFile" target="blank">
                    <i class="ion ion-md-download"></i> Tải xuống
                  </b-btn>
                </div>
              </div>
            </b-col>
          </b-col>
        </div>
        <hr>
        <b-table
          id="my-table"
          ref="dataTable"
          :items="dataTable"
          :fields="fields"
          :bordered="true"
          :outlined="true"
          head-variant="light"
          striped
          hover
          style="text-align: center;"
          class="card-table"
          :per-page="perPage"
          :current-page="currentPage"
          responsive>
          <template #table-colgroup="scope">
            <col
              v-for="field in scope.fields"
              :key="field.key"
              :style="{ width: (field.key === 'confirm' || field.key === 'image' || field.key === 'images') ? ((field.key === 'confirm') ? '12%' : '12%') : 'auto' }"
            >
          </template>
          <template v-slot:cell(province_station)="data">
            <p class="text-left">{{ data.item.province }} </p>
            <p class="text-left"> - {{ data.item.station }} </p>
          </template>
          <template v-slot:cell(date_confirm)="data">
            <p class="text-left">{{ data.item.date }}</p>
          </template>
          <template v-slot:cell(is_fragile)="data">
            <p class="text-left" v-if="data.item.is_fragile === true"> Hàng dễ vỡ</p>
            <p class="text-left" v-if="data.item.is_fragile === false"> Không tích chọn hàng dễ vỡ</p>
          </template>
          <template v-slot:cell(cod_info)="data" >
            <p class="text-left"> {{ data.item.userName }}</p>
            <p class="text-left"> -{{ data.item.alias }}</p>
          </template>
          <template v-slot:cell(pkg_order)="data" >
            <a :href="`/admin?alias=` + data.item.pkg_alias"  target="_blank">{{data.item.pkg_order}} </a>
          </template>
           <template v-slot:cell(shop_info)="data" >
            <p class="text-left" >{{ data.item.shop_name }}</p>
            <p class="text-left" >{{ data.item.shop_code }}</p>
          </template>
          <template v-slot:cell(image)="data">
            <div class="scrollbar scrollbar-primary">
              <div class="force-overflow">
                <img class="text-left m-2" v-for="(image, index) in data.item.image"
                     :src="image" alt="" width="50" height="50"
                     @click="showImage=true, slide = index, imageLinks = data.item.image">
              </div>
            </div>
          </template>
          <template v-slot:cell(report)="data" >
            <p class="text-left" >{{ data.item.report }}</p>
          </template>
          <template v-slot:cell(images)="data" >
            <div class="scrollbar scrollbar-primary">
              <div class="force-overflow">
                <img class="text-left m-2" v-for="(image, index) in data.item.images_report"
                     :src="image" alt="" width="50" height="50"
                     @click="showImage=true, slide = index, imageLinks = data.item.images_report">
              </div>
            </div>
          </template>
          <template v-slot:cell(status)="data" >
            <p class="text-left" v-if="data.item.status == 0"> Chờ report</p>
            <p class="text-left" v-if="data.item.status == 1"> Chờ review</p>
            <p class="text-left" v-if="data.item.status == 2 || data.item.status == 3"> Đã review</p>
          </template>
          <template v-slot:cell(user_confirm_info)="data">
            <p class="text-left" v-if="data.item.fullname_confirm !== null" >{{ data.item.fullname_confirm }} - {{ data.item.username_confirm }}</p>
          </template>
          <template v-slot:cell(confirm)="data">
            <b-form-select v-model="data.item.statusConfirm" :options="optionsConfirm" @change="showConfirm(data.item)" :disabled="(data.item.status > 1)"></b-form-select>
            <p class="text-left mt-md-2" v-if="data.item.note !== null" >{{ data.item.note }}</p>
          </template>
        </b-table>
        <hr>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalTable"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-card-body>
    </b-card>
    <div>
      <b-modal v-model ="showImage" id="myModal" class="modal" centered hide-footer cancel-disabled cancel-title>
        <template>
          <div>
            <b-carousel
              id="carousel-1"
              v-model="slide"
              :interval="4000"
              controls
              indicators
              background="#ababab"
              img-width="500"
              img-height="500"
              style="text-shadow: 1px 1px 2px #333;"
              @sliding-start="onSlideStart"
              @sliding-end="onSlideEnd"
            >
              <div v-for="image in imageLinks">
                <b-carousel-slide>
                  <template #img>
                    <img
                      class="d-block w-100"
                      width="500"
                      height="500"
                      :src="image"
                      alt="image slot"
                    >
                  </template>
                </b-carousel-slide>
              </div>
            </b-carousel>
          </div>
        </template>
      </b-modal>
    </div>
    <div>
      <b-modal v-model ="showConfirmModal" id="confirm" class="modal" centered :title="titleModal" @ok="requestConfirm" @show="noteConfirm=''"
               @hidden="noteConfirm=''">
        <b-form-group label="Lý do:">
        <b-form-textarea
          id="textarea"
          v-model="noteConfirm"
          placeholder="Comment"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        </b-form-group>
      </b-modal>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
.scrollbar {
  float: left;
  height: 150px;
  width: 100%;
  overflow-y: scroll;
}
.force-overflow {
  min-height: 150px;
}

.scrollbar-primary::-webkit-scrollbar {
  width: 7px;
}

.scrollbar-primary::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #A4A4A4; }

.scrollbar-primary {
  scrollbar-color: #A4A4A4 #F5F5F5;
}
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import SalaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import debounce from 'debounce'
import stationService from 'domain/services/station-service'
import ConfirmPenaltiesCod from 'domain/services/ConfirmPenaltiesCod'

export default {
  name: 'cod-training',
  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker,
    debounce,
    stationService,
    ConfirmPenaltiesCod
  },

  data: () => ({
    users: [],
    user: '',
    dataTable: [],
    fields: [
      {key: 'province_station', label: 'Tỉnh - kho', sortable: true},
      {key: 'date_confirm', label: 'Ngày đánh giá', sortable: true},
      {key: 'is_fragile', label: 'Phân loại hàng', sortable: true},
      {key: 'cod_info', label: 'COD', sortable: true},
      {key: 'shop_info', label: 'Shop report', sortable: true},
      {key: 'pkg_order', label: 'Mã đơn', sortable: true},
      {key: 'pkg_value', label: 'Giá trị đơn hàng', sortable: true},
      {key: 'image', label: 'Ảnh', sortable: true},
      {key: 'report', label: 'COD report nguyên nhân', sortable: true},
      {key: 'images', label: 'Ảnh COD gửi', sortable: true},
      {key: 'status', label: 'Trạng thái', sortable: true},
      {key: 'user_confirm_info', label: 'Người duyệt', sortable: true},
      {key: 'confirm', label: 'Xác nhận', sortable: true}
    ],
    startDate: new Date(),
    data_date_key: '',
    endDate: new Date(),
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự',
    search: [],
    searchUser: [],
    provinces: [],
    province: [],
    stations: [],
    station: [],
    optionsCod: [],
    valueCod: [],
    totalItems: 0,
    currentPage: 1,
    perPage: 20,
    imageLinks: [],
    valueIsFragile: [],
    optionsIsFragile: [
      { name: 'Không dễ vỡ', code: 0 },
      { name: 'Dễ vỡ', code: 1 }
    ],
    pkgOrder: '',
    shopCode: '',
    valueStatus: [],
    optionsStatus: [
      { name: 'Chờ report', code: 0 },
      { name: 'Chờ review', code: 1 },
      { name: 'Cod report sai', code: 2 },
      { name: 'Cod report đúng', code: 3 }
    ],
    isSearch: false,
    startDateSearch: '',
    endDateSearch: '',
    currentPageSearch: '',
    codUserIdSearch: '',
    stationsIdSearch: [],
    pkgOrderSearch: '',
    shopCodeSearch: '',
    valueIsFragileSearch: [],
    valueStatusSearch: [],
    provinceId: [],
    showImage: false,
    optionsConfirm: [
      {text: 'Xác nhận lại', value: 1},
      {text: 'Cod report sai', value: 2},
      {text: 'Cod report đúng', value: 3}
    ],
    noteConfirm: '',
    statusConfirm: 1,
    pkgOrderConfirm: '',
    codIdConfirm: '',
    titleModal: 'Xác nhận đánh giá',
    showConfirmModal: false,
    exportExcel: 0,
    fileId: null,
    urlFile: '',
    checkRun: '',
    slide: 0,
    sliding: null
  }),

  created () {
    this.setDate()
    this.getAllProvince()
    this.getAllStation()
    this.searchPenaltiesCod()
  },
  computed: {
    totalTable () {
      return this.totalItems
    }
  },
  watch: {
    currentPage () {
      this.loadPage()
    },
    province () {
      this.getAllStation()
    }
  },
  methods: {
    onSlideStart () {
      this.sliding = true
    },
    onSlideEnd () {
      this.sliding = false
    },
    setDate () {
      this.data_date_key = Moment(this.startDate).format('YYYY-MM-21')
      this.startDate = (this.startDate > this.data_date_key) ? this.data_date_key : Moment(this.startDate).subtract(1, 'M').format('YYYY-MM-21')
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.users = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.users = []
      SalaryService.searchCodV2({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.users = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500),
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    addTag (newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.province.push(tag)
      this.provinces.push(tag)
    },
    getAllProvince: function () {
      ConfirmPenaltiesCod.getAllProvince()
        .then((res) => {
          if (res.data.success) {
            this.provinces = res.data.data.provinces
          } else {
            commonHelper.showMessage(res.data.message, 'false')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    searchPenaltiesCod () {
      this.startDateSearch = Moment(this.startDate).format('YYYY-MM-DD')
      this.endDateSearch = Moment(this.endDate).format('YYYY-MM-DD')
      this.provinceId = []
      this.province.forEach(element => {
        this.provinceId.push(element.code)
      })
      this.stationsIdSearch = []
      this.station.forEach(element => {
        this.stationsIdSearch.push(element.id)
      })
      this.shopCodeSearch = this.shopCode
      this.pkgOrderSearch = this.pkgOrder
      this.valueIsFragileSearch = []
      this.valueIsFragile.forEach(element => {
        this.valueIsFragileSearch.push(element.code)
      })
      this.valueStatusSearch = []
      this.valueStatus.forEach(element => {
        this.valueStatusSearch.push(element.code)
      })
      this.currentPageSearch = this.currentPage
      this.codUserIdSearch = this.user ? this.user.id : null
      this.currentPage = 1
      this.dataTable = []
      this.loadPage()
    },
    loadPage () {
      if (this.startDateSearch > this.endDateSearch) {
        return commonHelper.showMessage('Thời gian bắt đầu phải nhỏ hơn kết thúc', 'false')
      }
      let parmas = {
        startDate: this.startDateSearch,
        endDate: this.endDateSearch,
        provinces: this.provinceId,
        stations: this.stationsIdSearch,
        shopCode: this.shopCodeSearch,
        pkgOrder: this.pkgOrderSearch,
        isFragile: this.valueIsFragileSearch,
        codUserId: this.codUserIdSearch,
        status: this.valueStatusSearch,
        limit: this.perPage,
        currentPage: this.currentPage
      }
      ConfirmPenaltiesCod.getListPenalties(parmas)
        .then((res) => {
          if (res.data.success) {
            this.totalItems = res.data.data.countItem
            let tmp = this.perPage * (this.currentPage - 1)
            res.data.data.data.forEach(element => {
              this.dataTable[tmp] = []
              this.dataTable.splice(tmp, 1,
                {
                  id: element.id,
                  alias: element.alias,
                  cod_id: element.cod_id,
                  date_confirm: element.date_confirm,
                  date_report: element.date_report,
                  image: element.image,
                  images_report: element.images_report,
                  is_fragile: element.is_fragile,
                  note: element.note,
                  pkg_alias: element.pkg_alias,
                  pkg_order: element.pkg_order,
                  pkg_value: element.pkg_value,
                  province: element.province,
                  report: element.report,
                  shop_name: element.shop_name,
                  shop_code: element.shop_code,
                  status: element.status,
                  statusConfirm: (element.status > 1) ? element.status : 1,
                  userName: element.userName,
                  user_confirm: element.user_confirm,
                  date: element.date,
                  station: element.station,
                  fullname_confirm: element.fullname_confirm,
                  username_confirm: element.username_confirm
                })
              tmp++
            })
            if (res.data.data.countItem > 0) {
              commonHelper.showMessage(res.data.message, 'success')
            } else {
              commonHelper.showMessage('Không tìm thấy bản đơn phạt nào', 'false')
            }
          } else {
            commonHelper.showMessage(res.data.message, 'false')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    requestConfirm () {
      let parmas = {
        codId: this.codIdConfirm,
        pkgOrder: this.pkgOrderConfirm,
        note: this.noteConfirm,
        status: this.statusConfirm
      }
      ConfirmPenaltiesCod.requestConfirm(parmas)
        .then((res) => {
          if (res.data.success) {
            this.loadPage()
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'false')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getAllStation () {
      this.provinceId = []
      this.province.forEach(element => {
        this.provinceId.push(element.code)
      })
      let params = {
        'provinceIds': this.provinceId
      }
      stationService.getAllStationByProvinceIds(params)
        .then((res) => {
          if (res.data.success) {
            this.stations = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    showConfirm (item) {
      if (item.statusConfirm === 2) {
        this.titleModal = 'Xác nhận phạt'
      } else if (item.statusConfirm === 3) {
        this.titleModal = 'Xác nhận hủy phạt'
      }
      this.showConfirmModal = true
      this.statusConfirm = item.statusConfirm
      this.codIdConfirm = item.cod_id
      this.pkgOrderConfirm = item.pkg_order
    },
    exportExcelReport () {
      this.exportExcel = 1
      if (this.startDateSearch > this.endDateSearch) {
        return commonHelper.showMessage('Thời gian bắt đầu phải nhỏ hơn kết thúc', 'false')
      }
      let parmas = {
        startDate: this.startDateSearch,
        endDate: this.endDateSearch,
        provinces: this.provinceId,
        stations: this.stationsIdSearch,
        shopCode: this.shopCodeSearch,
        pkgOrder: this.pkgOrderSearch,
        isFragile: this.valueIsFragileSearch,
        codUserId: this.codUserIdSearch,
        status: this.valueStatusSearch,
        limit: this.perPage,
        currentPage: this.currentPage
      }
      ConfirmPenaltiesCod.exportExcelReportPenalties(parmas)
        .then((res) => {
          if (res.data.success) {
            this.exportExcel = 1
            this.fileId = res.data.data.fileId
            this.checkRun = setInterval(() => {
              this.checkExcelReport()
            }, 10000)
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'false')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    checkExcelReport () {
      if (this.exportExcel !== 1 || this.fileId === null) {
        this.exportExcel = 0
        this.urlFile = ''
        clearInterval(this.checkRun)
        return null
      }
      let parmas = {
        idExcel: this.fileId
      }
      ConfirmPenaltiesCod.checkProcessExcel(parmas)
        .then((res) => {
          if (res.data.success) {
            if (res.data.data.is_success) {
              this.urlFile = res.data.data.url
              this.exportExcel = 2
              commonHelper.showMessage(res.data.message, 'success')
              clearInterval(this.checkRun)
            }
          } else {
            this.exportExcel = 0
            this.urlFile = ''
            clearInterval(this.checkRun)
            commonHelper.showMessage('Xuất file thất bại', 'false')
          }
        })
        .catch((e) => {
          this.exportExcel = 0
          this.urlFile = ''
          clearInterval(this.checkRun)
          commonHelper.showMessage('Xuất file thất bại', 'false')
          console.log(e)
        })
    }
  }
}
</script>
