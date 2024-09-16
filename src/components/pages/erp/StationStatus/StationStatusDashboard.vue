<template>
  <div class="small-scrollbar">
    <!-- Header  -->
    <b-row class="align-items-center">
      <b-col cols="4">
        <h4 class="my-0">Tình hình nhân sự kho</h4>
      </b-col>
      <b-col cols="8" class="text-right">
        <b-btn variant="ghtk" @click="getStationStatus"><i class="fas fa-search" ></i> Tìm kiếm</b-btn>
        <b-btn variant="ghtk" @click="resetFilter"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>
        <!-- <b-btn variant="ghtk" @click="exportStationStatus"><span class="fas fa-file-excel"></span> Xuất dữ liệu</b-btn> -->
      </b-col>
    </b-row>
    <!-- Filter  -->
    <b-row class="mt-2">
      <b-col md="2" class="z-3">
        <SelectRegion
          :regions="filter.region"
          @input="selectFilter('region', ...arguments)"
          custom-class=""
        />
      </b-col>
      <b-col md="2" class="z-3">
        <SelectProvince
          :provinceIds="filter.province"
          @handleProvinceSelected="selectFilter('province', ...arguments)"
          custom-class=""
        />
      </b-col>
      <b-col md="2" class="z-3">
        <SelectStation
          :stationIds="filter.station"
          @handleStationSelected="selectFilter('station', ...arguments)"
          custom-class=""
        />
      </b-col>
      <b-col md="2">
        <b-select class="d-inline choose-display" placeholder="Chọn kiểu lọc" v-model="chooseDisplay" @change="chooseDisplayInput(chooseDisplay)">
          <option value="0" disabled><span>Chọn kiểu lọc</span></option>
          <option value="month"><span>Lọc theo tháng</span></option>
          <option value="quarter"><span>Lọc theo quý</span></option>
        </b-select>
      </b-col>
      <b-col md="2" class="input-quarter" v-if="displayQuarter">
        <VueDatePicker
          class="rounded vdp-datepicker"
          v-model="filter.quarter"
          :max-date="maxDate"
          type="quarter"
          :locale="locale"
          placeholder="Quý thống kê"
        />
      </b-col>
      <b-col md="2" class="z-3" v-if="displayMonth">
        <Datepicker
          :language="language.vi"
          class="rounded"
          v-model="filter.month"
          format="MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="true"
          placeholder="Tháng thống kê"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="true"
          minimum-view="month"
          :disabled-dates="{from: new Date()}"
        />
      </b-col>
    </b-row>
    <!-- Paging -->
    <div class="paging mt-3 mb-1">
      <div class="z-0 d-inline-block">
        <b-pagination
          class="mb-1"
          size="sm"
          align="left"
          v-model="page.current"
          :total-rows="+page.total"
          :per-page="page.perPage"
          @input="getStationStatus"
        >
        </b-pagination>
      </div>
      <b class="float-right">Trang {{ page.current }}/{{ Math.ceil(page.total/page.perPage) }}</b>
    </div>
    <!-- Data -->
    <table class="table table-sm table-hover m-0 border-x-sm">
      <thead>
        <tr>
          <th>
            <b>Kho</b>
          </th>
          <th id="col-adhesion">
            <span @click="updateOrder('adhesion')">
              <b>Tỉ lệ gắn bó</b>
              <OrderBtn :order="order.adhesion" /><br />
              <span class="text-muted font-smaller">Tỉ lệ | SL nghỉ</span>
            </span>
            <b-popover target="col-adhesion" triggers="hover" placement="bottom" custom-class="bg-hover">
              <i>Tỉ lệ gắn bó = 1 - (Số lượng nhân sự nghỉ việc/</i><br />
              <i>Số lượng nhân sự trung bình)</i>
            </b-popover>
          </th>
          <th id="col-staff">
            <span @click="updateOrder('staff')">
              <b>SL Nhân sự</b>
              <OrderBtn :order="order.staff" /><br />
              <span class="text-muted font-smaller">Thực tế | Định biên</span>
            </span>
            <b-popover target="col-staff" triggers="hover" placement="bottom" custom-class="bg-hover">
              <i>Thực tế: Số lượng nhân sự Đang làm việc</i><br />
              <i>Định biên: Số lượng nhân sự cần dựa trên sản lượng thực tế</i>
            </b-popover>
          </th>
          <th id="col-income">
            <span @click="updateOrder('income')">
              <b>Thu nhập</b>
              <OrderBtn :order="order.income" /><br />
              <span class="text-muted font-smaller">TB | Chênh lệch (nghìn vnđ)</span>
            </span>
            <b-popover target="col-income" triggers="hover" placement="bottom" custom-class="bg-hover">
              <i>Thu nhập trung bình của cả kho/ theo từng vị trí</i>
            </b-popover>
          </th>
          <th id="col-refund">
            <span @click="updateOrder('refund')">
              <b>Bồi hoàn</b>
              <OrderBtn :order="order.refund" /><br />
              <span class="text-muted font-smaller">SL đơn | Giá trị (nghìn vnđ)</span>
            </span>
            <b-popover target="col-refund" triggers="hover" placement="bottom" custom-class="bg-hover">
              <i>Số lượng và giá trị các đơn hàng đã chốt bồi hoàn</i>
            </b-popover>
          </th>
          <th id="col-checkin">
            <span @click="updateOrder('checkin')">
              <b>Công tăng ca</b>
              <OrderBtn :order="order.checkin" /><br />
              <span class="text-muted font-smaller">Tỉ lệ | Số lượng</span>
            </span>
            <b-popover target="col-checkin" triggers="hover" placement="bottom" custom-class="bg-hover">
              <i>Số lượng công tăng ca</i><br />
              <i>Tỉ lệ: công tăng ca/ tổng công</i>
            </b-popover>
          </th>
          <th id="col-penalty">
            <span @click="updateOrder('penalty')">
              <b>NV bị phạt thẻ</b>
              <OrderBtn :order="order.penalty" /><br />
              <span class="text-muted font-smaller">Tỉ lệ | Số lượng</span>
            </span>
            <b-popover target="col-penalty" triggers="hover" placement="bottom" custom-class="bg-hover">
              <i>Số lượng nhân viên bị phạt thẻ</i><br />
              <i>Tỉ lệ: Nhân viên bị phạt thẻ/ tổng số nhân viên</i>
            </b-popover>
          </th>
        </tr>
      </thead>
      <tbody v-loading="loading" class="position-relative">
        <!-- overview  -->
        <tr v-if="stations && stations.length && overview" class="h-2rem bg-hover">
          <td></td>
          <td>
            <span v-if="overview.adhesion">
              <span class="cursor-pointer" id="data-adhesion-overview">
                <b>{{ (+overview.adhesion.ratio_adhesion * 100).toFixed() }} %</b> | <b>{{ (+overview.adhesion.num_resign).toFixed() }}</b>
              </span>
              <b-popover target="data-adhesion-overview" triggers="hover" placement="right" custom-class="bg-hover">
                <b>Tỉ lệ</b> | <b>SL Nghỉ</b> <br>
                <span>COD: {{ (+overview.adhesion.ratio_adhesion_cod * 100).toFixed() }} % | {{ (+overview.adhesion.num_resign_cod).toFixed() }}</span><br>
                <span>XLHH: {{ (+overview.adhesion.ratio_adhesion_xlhh * 100).toFixed() }} % | {{ (+overview.adhesion.num_resign_xlhh).toFixed() }}</span><br>
                <span>Tài xế: {{ (+overview.adhesion.ratio_adhesion_driver * 100).toFixed() }} % | {{ (+overview.adhesion.num_resign_driver).toFixed() }}</span><br>
                <span>Bưu cục/GSKV: {{ (+overview.adhesion.ratio_adhesion_bc * 100).toFixed() }} % | {{ (+overview.adhesion.num_resign_bc).toFixed() }}</span>
              </b-popover>
            </span>
          </td>
          <td>
            <span v-if="overview.staff">
              <span class="cursor-pointer" id="data-staff-overview">
                <b>{{ (+overview.staff.num_reality).toFixed() }}</b> | <b>{{ (+overview.staff.num_edge).toFixed() }}</b>
              </span>
              <b-popover target="data-staff-overview" triggers="hover" placement="right" custom-class="bg-hover">
                <b>Thực tế</b> | <b>Định biên</b> <br>
                <span>COD: {{ (+overview.staff.num_reality_cod).toFixed() }} | {{ (+overview.staff.num_edge_cod).toFixed() }}</span><br>
                <span>XLHH: {{ (+overview.staff.num_reality_xlhh).toFixed() }} | {{ (+overview.staff.num_edge_xlhh).toFixed() }}</span><br>
                <span>Tài xế: {{ (+overview.staff.num_reality_driver).toFixed() }} | {{ (+overview.staff.num_edge_driver).toFixed() }}</span><br>
                <span>Bưu cục/GSKV: {{ (+overview.staff.num_reality_bc).toFixed() }} | {{ (+overview.staff.num_edge_bc).toFixed() }}</span>
              </b-popover>
            </span>
          </td>
          <td>
            <span v-if="overview.income">
              <span class="cursor-pointer" id="data-income-overview">
                <b>{{ formatMoney((+overview.income.average_income).toFixed()) }}</b> &#177; <b>{{ formatMoney((+overview.income.stand_deviation).toFixed()) }}</b>
              </span>
              <b-popover target="data-income-overview" triggers="hover" placement="right" custom-class="bg-hover">
                <b>Lương thấp nhất</b> | <b>Lương cao nhất</b> <br>
                <span>
                  COD: {{ formatMoney((+overview.income.min_income_cod).toFixed()) }} | {{ formatMoney((+overview.income.max_income_cod).toFixed()) }}
                </span><br>
                <span>
                  XLHH: {{ formatMoney((+overview.income.min_income_xlhh).toFixed()) }} | {{ formatMoney((+overview.income.max_income_xlhh).toFixed()) }}
                </span><br>
                <span>
                  Tài xế: {{ formatMoney((+overview.income.min_income_driver).toFixed()) }} | {{ formatMoney((+overview.income.max_income_driver).toFixed()) }}
                </span><br>
                <span>
                  Bưu cục/GSKV: {{ formatMoney((+overview.income.min_income_bc).toFixed()) }} | {{ formatMoney((+overview.income.max_income_bc).toFixed()) }}
                </span>
              </b-popover>
            </span>
          </td>
          <td>
            <span v-if="overview.refund">
              <b>{{ (+overview.refund.num_refund).toFixed() }}</b> | <b>{{ formatMoney((+overview.refund.sum_refund_value).toFixed()) }}</b>
            </span>
          </td>
          <td>
            <span v-if="overview.checkin">
              <b>{{ (+overview.checkin.ratio_overtime * 100).toFixed() }} %</b> | <b>{{ (+overview.checkin.num_overtime).toFixed() }}</b>
            </span>
          </td>
          <td>
            <span v-if="overview.penalty">
              <b>{{ (+overview.penalty.ratio_penalty * 100).toFixed() }} %</b> | {{ (+overview.penalty.num_penalty).toFixed() }}
            </span>
          </td>
        </tr>

        <!-- detail station  -->
        <tr v-for="station in stations" :key="station.id">
          <td class="w-20">
            <span class="text-ghtk cursor-pointer text-underline-hover" @click="stationManager(station)">{{ station.name }}</span>
          </td>
          <td>
            <div v-if="station.adhesion && isNumber(station.adhesion.ratio_adhesion)">
              <span class="cursor-pointer" :id="'data-adhesion-' + station.id">
                {{ (+station.adhesion.ratio_adhesion * 100).toFixed() }} % | {{ (+station.adhesion.num_resign).toFixed() }}
              </span>
              <b-popover :target="'data-adhesion-' + station.id" triggers="hover" placement="right" custom-class="bg-hover">
                <b>Tỉ lệ</b> | <b>SL Nghỉ</b> <br>
                <span>COD: {{ (+station.adhesion.ratio_adhesion_cod * 100).toFixed() }} % | {{ (+station.adhesion.num_resign_cod).toFixed() }}</span><br>
                <span>XLHH: {{ (+station.adhesion.ratio_adhesion_xlhh * 100).toFixed() }} % | {{ (+station.adhesion.num_resign_xlhh).toFixed() }}</span><br>
                <span>Tài xế: {{ (+station.adhesion.ratio_adhesion_driver * 100).toFixed() }} % | {{ (+station.adhesion.num_resign_driver).toFixed() }}</span><br>
                <span>Bưu cục/GSKV: {{ (+station.adhesion.ratio_adhesion_bc * 100).toFixed() }} % | {{ (+station.adhesion.num_resign_bc).toFixed() }}</span>
              </b-popover>
            </div>
            <div v-else>
              <span> - | - </span>
            </div>
          </td>
          <td>
            <div v-if="station.staff && isNumber(station.staff.num_reality)">
              <span class="cursor-pointer" :id="'data-staff-' + station.id">
                {{ (+station.staff.num_reality).toFixed() }} | {{ (+station.staff.num_edge).toFixed() }}
              </span>
              <b-popover :target="'data-staff-' + station.id" triggers="hover" placement="right" custom-class="bg-hover">
                <b>Thực tế</b> | <b>Định biên</b> <br>
                <span>COD: {{ (+station.staff.num_reality_cod).toFixed() }} | {{ (+station.staff.num_edge_cod).toFixed() }}</span><br>
                <span>XLHH: {{ (+station.staff.num_reality_xlhh).toFixed() }} | {{ (+station.staff.num_edge_xlhh).toFixed() }}</span><br>
                <span>Tài xế: {{ (+station.staff.num_reality_driver).toFixed() }} | {{ (+station.staff.num_edge_driver).toFixed() }}</span><br>
                <span>Bưu cục/GSKV: {{ (+station.staff.num_reality_bc).toFixed() }} | {{ (+station.staff.num_edge_bc).toFixed() }}</span>
              </b-popover>
            </div>
            <div v-else>
              <span> - | - </span>
            </div>
          </td>
          <td>
            <div v-if="station.income && isNumber(station.income.average_income)">
              <span class="cursor-pointer" :id="'data-income-' + station.id">
                {{ formatMoney((+station.income.average_income).toFixed()) }} &#177; {{ formatMoney((+station.income.stand_deviation).toFixed()) }}
              </span>
              <b-popover :target="'data-income-' + station.id" triggers="hover" placement="right" custom-class="bg-hover">
                <b>Lương thấp nhất</b> | <b>Lương cao nhất</b> <br>
                <span>
                  COD: {{ formatMoney((+station.income.min_income_cod).toFixed()) }} | {{ formatMoney((+station.income.max_income_cod).toFixed()) }}
                </span><br>
                <span>
                  XLHH: {{ formatMoney((+station.income.min_income_xlhh).toFixed()) }} | {{ formatMoney((+station.income.max_income_xlhh).toFixed()) }}
                </span><br>
                <span>
                  Tài xế: {{ formatMoney((+station.income.min_income_driver).toFixed()) }} | {{ formatMoney((+station.income.max_income_driver).toFixed()) }}
                </span><br>
                <span>
                  Bưu cục/GSKV: {{ formatMoney((+station.income.min_income_bc).toFixed()) }} | {{ formatMoney((+station.income.max_income_bc).toFixed()) }}
                </span>
              </b-popover>
            </div>
            <div v-else>
              <span> - | - </span>
            </div>
          </td>
          <td>
            <div v-if="station.refund && isNumber(station.refund.num_refund)">
              <span>
                {{ (+station.refund.num_refund).toFixed() }} | {{ formatMoney((+station.refund.sum_refund_value).toFixed()) }}
              </span>
            </div>
            <div v-else>
              <span> - | - </span>
            </div>
          </td>
          <td>
            <div v-if="station.checkin && isNumber(station.checkin.ratio_overtime)">
              <span>
                {{ (+station.checkin.ratio_overtime * 100).toFixed() }} % | {{ (+station.checkin.num_overtime).toFixed() }}
              </span>
            </div>
            <div v-else>
              <span> - | - </span>
            </div>
          </td>
          <td>
            <div v-if="station.penalty && isNumber(station.penalty.num_penalty)">
              <span>
                {{ (+station.penalty.ratio_penalty * 100).toFixed() }} % | {{ (+station.penalty.num_penalty).toFixed() }}
              </span>
            </div>
            <div v-else>
              <span> - | - </span>
            </div>
          </td>
        </tr>
        <tr v-show="!stations || !stations.length">
          <td colspan="8" class="text-center h-25vh align-middle"><b>Không có kho nào !</b></td>
        </tr>
      </tbody>
    </table>
    <!-- Modal -->
    <StationManager :station="curStation" id="modal-station-manager"/>
  </div>
</template>

<style scoped lang="scss">
  th {
    vertical-align: top !important;
    span {
      cursor: pointer;
    }
  }

  .bg-hover {
    background: #f1f1f2;
  }

  .h-2rem {
    height: 2rem;
  }

  .border-x-sm {
    border-top: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
  }

  .input-quarter{
    border: 1px solid rgba(24, 28, 33, 0.1);
    color: #4E5155;
    line-height: 1.54;
    border-radius: 0.25rem;
    ::placeholder {
      min-height: calc(2.25rem + 2px);
      font-size: 0.894rem;
      padding: 0.438rem 0.875rem;
    }
    span.vd-picker-header{
      font-size: 21px;

    }
    .vd-picker-header--quarter{
      background-color: #069255 !important;
      border-color: transparent !important;
    }
    .vd-picker__quarters-button{
      background-color: #069255 !important;
      border-color: transparent !important;
    }
  }
</style>

<script>
// custom component
import SelectProvince from 'components/elements/common/MultiSelectProvince'
import SelectStation from 'components/elements/common/MultiSelectStation'
import SelectRegion from 'components/elements/common/MultiSelectRegion'
import StationManager from './ModalStationManager'
import OrderBtn from 'components/elements/common/OrderBtn'
// built-in component
import Datepicker from 'vuejs-datepicker'
import { vi } from 'vuejs-datepicker/dist/locale'
import { VueDatePicker } from '@mathieustan/vue-datepicker'
import '@mathieustan/vue-datepicker/dist/vue-datepicker.min.css'
// service
import stationStatusService from 'domain/services/station-status-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities

export default {
  name: 'station-status-dashboard',
  props: {
    scrollMode: {
      default: false
    },
    blankMode: {
      default: true
    }
  },

  components: {
    StationManager,
    SelectRegion,
    SelectProvince,
    SelectStation,
    OrderBtn,
    Datepicker,
    VueDatePicker
  },

  data: _ => ({
    loading: false,
    language: {
      vi: vi
    },
    page: {
      current: 1,
      total: 0,
      perPage: 20
    },
    filter: {
      region: null,
      province: null,
      station: null,
      month: null,
      page: null,
      quarter: null
    },
    order: {
      adhesion: null,
      staff: null,
      income: null,
      refund: null,
      checkin: null,
      penalty: null
    },
    overview: {
      adhesion: null,
      staff: null,
      income: null,
      refund: null,
      checkin: null,
      penalty: null
    },
    stations: [],
    curStation: null,
    maxDate: `${new Date().getFullYear()}`,
    locale: {
      lang: {
        name: 'vi',
        weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
        months: 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
        weekStart: 1,
        weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
        monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
        weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
        ordinal: n => n,
        formats: {
          LT: 'HH:mm',
          LTS: 'HH:mm:ss',
          L: 'DD/MM/YYYY',
          LL: 'D MMMM [năm] YYYY',
          LLL: 'D MMMM [năm] YYYY HH:mm',
          LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
          l: 'DD/M/YYYY',
          ll: 'D MMM YYYY',
          lll: 'D MMM YYYY HH:mm',
          llll: 'ddd, D MMM YYYY HH:mm'
        }
      }
    },
    displayQuarter: false,
    displayMonth: false,
    chooseDisplay: 0
  }),

  created () {
    this.getStationStatus()
  },

  methods: {
    getStationStatus () {
      let params = {...this.filter, ...this.order}
      params.page = this.page.current
      this.loading = true
      stationStatusService.getStationStatus(params)
        .then(res => {
          if (res.data.success) {
            this.stations = res.data.data || []
            this.overview = res.data.overview || {}
            this.page.total = res.data.total || 0
          } else {
            this.stations = []
            this.overview = res.data.overview || {}
            this.page.total = 0
            helper.showMessage(res.data.message || 'Có lỗi khi lấy tình hình kho !', 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy tình hình kho !', 'warning', 'Lỗi')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    resetFilter () {
      this.displayMonth = false
      this.displayQuarter = false
      this.chooseDisplay = 0
      for (const field in this.filter) this.filter[field] = null
      this.getStationStatus()
    },

    selectFilter (field, ops) {
      this.filter[field] = ops ? ops.map(op => op.id).toString() : null
    },

    stationManager (station) {
      this.curStation = station
      this.$bvModal.show('modal-station-manager')
    },

    updateOrder (field) {
      if (!field) return
      helper.resetData(this.order, field)
      if (!this.order[field]) this.order[field] = 'asc'
      else if (this.order[field] === 'asc') this.order[field] = 'desc'
      else if (this.order[field] === 'desc') this.order[field] = null

      this.getStationStatus()
    },

    isNumber (val) {
      return +val || val === 0 || val === '0'
    },

    formatMoney (value) {
      return helper.formatMoney(value)
    },

    chooseDisplayInput (choose = null) {
      this.filter.quarter = null
      this.filter.month = null
      if (choose === 'month') {
        this.displayMonth = true
        this.displayQuarter = false
      } else if (choose === 'quarter') {
        this.displayQuarter = true
        this.displayMonth = false
      } else {
        this.displayMonth = false
        this.displayQuarter = false
        this.chooseDisplay = 0
      }
    }
  }
}
</script>
