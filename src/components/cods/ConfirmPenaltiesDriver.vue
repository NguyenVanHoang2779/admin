<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row>
          <h4 class="ml-2 mt-1">Quản lý thẻ tự động</h4><br>
        </b-row>
        <b-row v-if="userRole == 3">
          <b-form-group
            class="m-2"
            label="Phiên Làm việc"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
              id="btn-radios-2"
              v-model="role"
              :options="roleOption"
              :aria-describedby="ariaDescribedby"
              button-variant="outline-primary"
              size="sm"
              name="radio-btn-outline"
              buttons
            ></b-form-radio-group>
          </b-form-group>
        </b-row>
        <b-row>
          <div class="text-note text-danger mt-2">
            Lưu ý: <br>
            <div class="pl-3">
              - Thẻ phạt tự động được gán cho tài xế có các thao tác không hợp lệ với đơn hàng BBS đẩy tự động<br>
              - Chỉ ban điều hành có quyền duyệt bỏ phạt cho tài xế<br>
              - Ban điều hành cần duyệt bỏ phạt đối với các thẻ phát sinh trong kỳ lương muộn nhất ngày 23 hàng tháng<br>
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
            <b-form-group label="Chọn tài xế">
              <multiselect
                v-model="user"
                label="name"
                track-by="id"
                placeholder="Chọn tài xế"
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
          <b-col cols="2">
            <b-form-group label="Mã đơn hàng">
              <b-form-input v-model="pkgOrder" placeholder="package order"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Trạng thái">
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
            <b-form-group label="Người đề xuất">
              <b-form-input v-model="userDP" placeholder="username đề xuất"></b-form-input>
            </b-form-group>
          </b-col>
        </div>
        <div class="row">
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
          <b-col cols="3">
            <b-form-group label="Loại thẻ">
              <multiselect
                v-model="valueTag"
                label="name"
                track-by="code"
                placeholder="Mặc định là tất cả"
                :options="optionsTag"
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
                <b-btn type="button" variant="outline-primary" @click="searchPenaltiesDriver"><i
                  class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                </b-btn>
              </div>
              <div style="margin-top:22px;" class="mr-4">
                <b-btn type="button" variant="outline-danger" @click="formatRequest"><i
                  class="fas fa-eraser"></i> Xóa lọc
                </b-btn>
              </div>
            </b-col>
          </b-col>
        </div>
        <hr>
        <b-row>
          <h5 class="ml-2 mt-1">Tổng số thẻ phạt: {{ totalItems }}</h5><br>
          <b-btn type="button" variant="success" class="ml-5 mb-2" @click="exportFile">
            <i class="ion ion-md-download"></i>
            Xuất file
          </b-btn>
        </b-row>
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
          <template v-slot:cell(driver_info)="data">
            <p class="text-left">{{ data.item.driver_name }} </p>
            <p class="text-left"> -{{ data.item.driver_username }} </p>
            <p class="text-left"> -{{ data.item.driver_alias }} </p>
            <p class="text-left text-warning" v-if="data.item.penalty_card === 'Thẻ vàng'"> <b>{{ data.item.penalty_card }}</b></p>
          </template>
          <template v-slot:cell(shop_info)="data">
            <p class="text-left">{{ data.item.shop_name }} </p>
            <p class="text-left"> - {{ data.item.shop_address }} </p>
            <p v-if="data.item.shop_report_type == 1" class="text-left text-success"> - Shop đã report hủy thẻ phạt</p>
          </template>
          <!--          <template v-slot:cell(extra_data)="data">
                      <p class="text-left">{{ data.item.reason }} </p>
                      <p class="text-left" v-if="data.item.extra_data !== null"> - {{ data.item.extra_data }} </p>
                    </template>-->
          <template v-slot:cell(pkg_order)="data">
            <div class="scrollbar scrollbar-primary">
              <div class="force-overflow">
                <a v-for="(alias, pkgOrder) in data.item.pkg_orders" :key="pkgOrder" :href="`/admin?alias=` + alias" class="link-row"
                   target="_blank">{{ pkgOrder }} </a>
              </div>
            </div>
          </template>
          <template v-slot:cell(user_dp)="data">
            <p class="text-left" v-if="data.item.note_dp !== null">{{ data.item.user_dp }}</p>
            <div class="mr-4" v-else>
              <b-btn type="button" variant="outline-success" :disabled="disabledDP" @click="showConfirm(data.item, data.index, 0)"><i
                class="sidenav-icon ion ion-md-add"></i> Tạo đề xuất
              </b-btn>
            </div>
          </template>
          <template v-slot:cell(note_dp)="data">
            <p class="text-left">{{ data.item.note_dp }}</p>
          </template>
          <template v-slot:cell(status)="data">
            <div class="mr-4">
              <b-btn type="button" variant="outline-secondary"
                     v-if="data.item.status === null" disabled> Chờ đề xuất
              </b-btn>
              <div v-else-if="data.item.status == 0 ">
                <b-btn class="m-2"  type="button" variant="outline-secondary" :disabled="disabledBDH" @click="showConfirm(data.item, data.index, 1)">
                  Chờ duyệt
                </b-btn>
              </div>
              <b-btn  type="button" variant="success" :disabled="disabledBDH" v-else-if="data.item.status == 1" @click="showConfirm(data.item, data.index, 1)">
                <i class="ion ion-ios-checkmark-circle-outline"></i>
                Đã duyệt
              </b-btn>
              <b-btn type="button" variant="danger" :disabled="disabledBDH" v-else-if="data.item.status == 2" @click="showConfirm(data.item, data.index, 1)">
                <i class="ion ion-ios-close-circle-outline"></i>
                Đã từ chối
              </b-btn>
            </div>
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
      <b-modal v-model ="showConfirmModal" id="confirm" class="modal" centered :title="titleModal" @ok="requestConfirm" @show="noteConfirm=''"
               @hidden="noteConfirm=''">
        <b-form-group label="Lý do:" v-if="statusConfirm===0">
          <b-form-textarea
            id="textarea"
            v-model="noteConfirm"
            placeholder="Comment"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
      </b-modal>
      <b-modal v-model="showConfirmModal1" id="confirm" class="modal" centered :title="titleModal" @ok="requestConfirm" hide-footer cancel-disabled
               @show="noteConfirm=''"
               @hidden="noteConfirm=''">
        <div class="text-center">
          <b-btn class="m-2" type="button" variant="success" :disabled="disabledBDH"
                 @click="statusConfirm=1, requestConfirm(),  showConfirmModal1=false">
            <i class="ion ion-ios-checkmark-circle-outline"></i>
            Duyệt
          </b-btn>
          <b-btn class="m-2" type="button" variant="danger" :disabled="disabledBDH"
                 @click="statusConfirm=2, requestConfirm(),  showConfirmModal1=false">
            <i class="ion ion-ios-close-circle-outline"></i>
            Từ chối
          </b-btn>
        </div>
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
.link-row {
  display: block;
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
    role: 0,
    roleOption: [
      { value: 1, text: 'Điều phối', disabled: false },
      { value: 2, text: 'BĐH', disabled: false }
    ],
    userRole: 0,
    dataTable: [],
    fields: [
      {key: 'driver_province', label: 'Tỉnh/Thành phố', sortable: true},
      {key: 'driver_station', label: 'Kho', sortable: true},
      {key: 'driver_info', label: 'Tài xế - Loại thẻ', sortable: true},
      {key: 'router_name', label: 'Mã tuyến', sortable: true},
      {key: 'shop_info', label: 'Shop', sortable: true},
      {key: 'pkg_order', label: 'Mã đơn hàng', sortable: true},
      {key: 'reason_text', label: 'Lý do phạt', sortable: true},
      {key: 'user_dp', label: 'Người tạo đề xuất', sortable: true},
      {key: 'note_dp', label: 'Nội dung đề xuất', sortable: true},
      {key: 'created', label: 'Ngày phát sinh thẻ', sortable: true},
      {key: 'status', label: 'Trạng thái', sortable: true},
      {key: 'user_bdh', label: 'Người duyệt', sortable: true}
    ],
    startDate: new Date(),
    endDate: new Date(),
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự',
    provinces: [],
    province: [],
    users: [],
    user: '',
    pkgOrder: '',
    valueStatus: [],
    optionsStatus: [
      {name: 'Chưa đề xuất', code: -1},
      {name: 'Chờ duyệt', code: 0},
      {name: 'Đã duyệt', code: 1},
      {name: 'Từ chối', code: 2},
      {name: 'Shop report', code: 3}
    ],
    userDP: '',
    station: [],
    stations: [],
    valueTag: [],
    optionsTag: [
      { code: 0, name: 'Thẻ vàng' }
      // { name: 'Dễ vỡ', code: 1 }
    ],
    totalItems: 0,
    currentPage: 1,
    perPage: 15,
    optionsConfirm: [
      {text: 'Duyệt', value: 1},
      {text: 'Từ chối', value: 2}
    ],
    search: {
      provinceIds: [],
      stationId: [],
      status: [],
      tags: []
    },
    slide: 0,
    sliding: null,
    showConfirmModal: false,
    showConfirmModal1: false,
    titleModal: 'Tạo đề xuất',
    noteConfirm: '',
    statusConfirm: null,
    changeItem: null,
    indexConfirm: null,
    disabledDP: true,
    disabledBDH: true,
    arrHeader: [
      {
        c1: 'Tỉnh/Thành phố',
        c2: 'Kho',
        c3: 'Username',
        c4: 'Tên tài xế',
        c5: 'alias',
        c6: 'Mã tuyến',
        c7: 'Tên shop',
        c8: 'Địa chỉ',
        c9: 'Lý do phạt',
        c10: 'Người tạo đề xuất',
        c11: 'Nội dung đề xuất',
        c12: 'Ngày phát sinh thẻ',
        c13: 'Người duyệt',
        c14: 'Trạng thái',
        c15: 'Shop report',
        c16: 'Mã đơn hàng'
      }
    ]
  }),

  created () {
    this.setDate()
    this.getAllProvince()
    this.getAllStation()
    this.searchPenaltiesDriver()
    this.loadRole()
  },
  computed: {
    totalTable () {
      return this.totalItems
    }
  },
  watch: {
    province () {
      this.getAllStation()
    },
    userRole () {
      if (this.userRole === 3) {
        this.role = 1
        this.roleOption.forEach(element => {
          element.disabled = false
        })
      } else {
        this.role = this.userRole
        this.roleOption.forEach(element => {
          if (element.value === this.role) {
            element.disabled = false
          } else {
            element.disabled = true
          }
        })
      }
    },
    role () {
      if (this.role === 1) {
        this.disabledDP = false
        this.disabledBDH = true
      }
      if (this.role === 2) {
        this.disabledDP = true
        this.disabledBDH = false
      }
    }
  },
  methods: {
    formatRequest () {
      this.province = []
      this.station = []
      this.valueStatus = []
      this.valueTag = []
      this.pkgOrder = ''
      this.user = ''
      this.userDP = ''
      this.startDate = new Date()
      this.endDate = new Date()
      this.setDate()
      this.searchPenaltiesDriver()
    },
    loadRole () {
      ConfirmPenaltiesCod.checkRolePenaltiesDriver()
        .then((res) => {
          if (res.data.success) {
            this.userRole = res.data.data
          } else {
            this.userRole = 0
            commonHelper.showMessage('Bạn không có quyền truy cập', 'false')
          }
        })
        .catch((e) => {
          this.userRole = 0
          commonHelper.showMessage('Bạn không có quyền truy cập', 'false')
          console.log(e)
        })
    },
    onSlideStart () {
      this.sliding = true
    },
    onSlideEnd () {
      this.sliding = false
    },
    setDate () {
      this.startDate = Moment(this.startDate).subtract(7, 'd').format('YYYY-MM-DD')
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
    searchPenaltiesDriver () {
      this.search.provinceIds = []
      this.province.forEach(element => {
        this.search.provinceIds.push(element.code)
      })

      this.search.stationId = []
      this.station.forEach(element => {
        this.search.stationId.push(element.id)
      })

      this.search.status = []
      this.valueStatus.forEach(element => {
        this.search.status.push(element.code)
      })

      this.search.tags = []
      this.valueTag.forEach(element => {
        this.search.tags.push(element.code)
      })

      if (this.startDateSearch > this.endDateSearch) {
        return commonHelper.showMessage('Thời gian bắt đầu phải nhỏ hơn kết thúc', 'false')
      }

      let parmas = {
        provinces: this.search.provinceIds,
        stations: this.search.stationId,
        driverUserId: this.user ? this.user.id : null,
        tags: this.search.tags,
        pkgOrder: this.pkgOrder,
        status: this.search.status,
        usernameDP: this.userDP,
        startDate: Moment(this.startDate).format('YYYY-MM-DD'),
        endDate: Moment(this.endDate).format('YYYY-MM-DD')
      }
      ConfirmPenaltiesCod.getListPenaltiesDriver(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataTable = []
            this.currentPage = 1
            this.totalItems = res.data.data.length
            this.dataTable = res.data.data
            if (res.data.data.length > 0) {
              commonHelper.showMessage(res.data.message, 'success')
            } else {
              commonHelper.showMessage('Không tìm thấy đơn phạt nào', 'false')
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
        data: this.changeItem,
        status: this.statusConfirm,
        note_dp: this.noteConfirm,
        note_bhd: null
      }
      ConfirmPenaltiesCod.requestConfirmDriver(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataTable[this.indexConfirm].id = res.data.data.id
            this.dataTable[this.indexConfirm].status = res.data.data.status
            this.dataTable[this.indexConfirm].user_dp = res.data.data.user_dp
            this.dataTable[this.indexConfirm].note_dp = res.data.data.note_dp
            this.dataTable[this.indexConfirm].date_confirm_dp = res.data.data.date_confirm_dp
            this.dataTable[this.indexConfirm].user_bdh = res.data.data.user_bdh
            this.dataTable[this.indexConfirm].note_bdh = res.data.data.note_bdh
            this.dataTable[this.indexConfirm].date_confirm_bdh = res.data.data.date_confirm_bdh
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'false')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    showConfirm (item, index, status) {
      this.indexConfirm = index + this.perPage * (this.currentPage - 1)
      if (status === 0) {
        this.showConfirmModal = true
        this.titleModal = 'Tạo đề xuất'
      }
      if (status === 1) {
        this.showConfirmModal1 = true
        this.titleModal = 'Xác nhận duyệt gỡ thẻ'
      }
      this.changeItem = item
      this.statusConfirm = status
    },
    exportFile () {
      let data = []
      this.dataTable.forEach(element => {
        data.push({
          c1: '"' + element.driver_province + '"',
          c2: '"' + element.driver_station + '"',
          c3: '"' + element.driver_username + '"',
          c4: '"' + element.driver_name + '"',
          c5: '"' + element.driver_alias + '"',
          c6: '"' + element.router_name + '"',
          c7: '"' + element.shop_name + '"',
          c8: '"' + element.shop_address + '"',
          c9: '"' + element.reason_text + '"',
          c10: '"' + element.user_dp + '"',
          c11: '"' + element.note_dp + '"',
          c12: '"' + element.created + '"',
          c13: '"' + element.user_bdh + '"',
          c14: '"' + element.status + '"',
          c15: '"' + element.shop_report_type + '"',
          c16: '"' + element.pkg_order + '"'
        })
      })
      this.csvExport(data, this.arrHeader, 'the_phat_diem_no.csv')
    },
    csvExport (arrData, arrHeader, fileName) {
      fileName = (fileName !== null) ? fileName : 'export'
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      csvContent += [
        ...arrHeader.map(item => Object.values(item).join(','))
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')
      csvContent += '\n'
      csvContent += [
        ...arrData.map(item => Object.values(item).join(','))
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')
      const data = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', fileName + '.csv')
      link.click()
    }
  }
}
</script>
