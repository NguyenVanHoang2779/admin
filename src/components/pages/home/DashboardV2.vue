<template>
  <div class="dashboard-v2">
    <h4 class="ui-block-heading">
      Dashboard <span class="updated-time">(Cập nhật lúc {{updatedTime}})</span>
    </h4>
    <div class="ui-block ecom-dashboard-home">
      <b-row>
        <b-button-group @click="changeDatePicker" class="btn-small">
          <b-button :variant="yesterday" value="yesterday">Hôm qua</b-button>
          <b-button :variant="today" value="today">Hôm nay</b-button>
          <b-button :variant="last_week" value="last-week">Tuần trước</b-button>
          <b-button :variant="this_week" value="this-week">Tuần này</b-button>
          <b-button :variant="last_month" value="last-month">Tháng trước</b-button>
          <b-button :variant="this_month" value="this-month">Tháng này</b-button>
          <b-button :variant="last_year" value="last-year">Năm trước</b-button>
          <b-button :variant="this_year" value="this-year">Năm nay</b-button>
        </b-button-group>
        <ecom-ranger-datepicker :fromDate="fromDate" :toDate="toDate" :isChange="isChange" :ischoosed="ischoosed"
                      @handleDataChoosed="handleAfterRangerdateBack" class="ecom-datepicker"></ecom-ranger-datepicker>
        <b-button variant="success" value="range-date" @click="changeDatePicker" class="ecom-watching">Xem</b-button>
        <b-button variant="warning" href="/admin/dashboard" class="ecom-watch-old-page">Xem lại trang cũ</b-button>
      </b-row>
    </div>
    <br>
    <div class="ui-block ecom-dashboard-home">
      <h4 class="ui-block-heading">
        Quản lý vận hành theo thời gian thực
      </h4>
      <hr>
      <graph-realtime-operation-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></graph-realtime-operation-report>
    </div>
    <div class="ui-block ecom-dashboard-home">
      <h4 class="ui-block-heading">
        Quản lý hiệu quả vận hành
      </h4>
      <hr>
      <graph-performance-operator-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></graph-performance-operator-report>
    </div>
    <div class="ui-block ecom-dashboard-home">
      <h4 class="ui-block-heading">
        Quản lý hiệu quả dòng tiền
      </h4>
      <hr>
      <graph-performance-accountant-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></graph-performance-accountant-report>
    </div>
    <div class="ui-block ecom-dashboard-home">
      <h4 class="ui-block-heading">
        Tổng quan lấy hàng
      </h4>
      <hr>
      <b-row>
        <b-col cols="12" md="6">
          <pie-shop-picking-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></pie-shop-picking-report>
        </b-col>
        <b-col cols="12" md="6">
          <pie-province-picking-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></pie-province-picking-report>
        </b-col>
      </b-row>
    </div>
    <div class="ui-block ecom-dashboard-home">
      <h4 class="ui-block-heading">
        Tổng quan giao hàng
      </h4>
      <hr>
      <b-row>
        <b-col cols="12" md="6">
          <pie-district-delivering-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></pie-district-delivering-report>
        </b-col>
        <b-col cols="12" md="6">
          <pie-province-delivering-report :fromDate="fromDate" :toDate="toDate" :isChange="isChange"></pie-province-delivering-report>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<style>
  .ecom-dashboard-home {
    margin-top: 30px;
  }
  .btn-small * {
    margin-right: 10px;
    padding: 6px;
  }
  .ecom-datepicker {
    margin-left: 10px;
  }
  .ecom-watching {
    margin-left: 20px;
    margin-right: 10px;
    padding: 6px;
  }
  .ecom-watch-old-page {
    padding: 6px;
  }
  .dashboard-v2 .updated-time {
    font-size: 14px;
    font-weight: normal;
    font-style: italic;
  }
</style>
<script>
import dashboardService from 'domain/services/dashboard-service'
import EcomRangerDatepicker from 'components/elements/date/EcomRangerDatepicker'
import GraphRealtimeOperationReport from 'components/charts/GraphRealtimeOperationReport'
import GraphPerformanceOperatorReport from 'components/charts/GraphPerformanceOperatorReport'
import GraphPerformanceAccountantReport from 'components/charts/GraphPerformanceAccountantReport'
import PieProvincePickingReport from 'components/charts/PieProvincePickingReport'
import PieShopPickingReport from 'components/charts/PieShopPickingReport'
import PieDistrictDeliveringReport from 'components/charts/PieDistrictDeliveringReport'
import PieProvinceDeliveringReport from 'components/charts/PieProvinceDeliveringReport'
import moment from 'moment'

export default {
  name: 'dash-board',

  components: {
    EcomRangerDatepicker,
    GraphRealtimeOperationReport,
    GraphPerformanceOperatorReport,
    GraphPerformanceAccountantReport,
    PieProvincePickingReport,
    PieShopPickingReport,
    PieDistrictDeliveringReport,
    PieProvinceDeliveringReport
  },

  data: () => {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      isChange: moment().format(),
      ischoosed: '',
      yesterday: 'primary',
      today: 'primary',
      last_week: 'primary',
      this_week: 'primary',
      last_month: 'primary',
      this_month: 'success',
      last_year: 'primary',
      this_year: 'primary',
      updatedTime: ''
    }
  },

  created () {
    dashboardService.getMaxTimeOfData().then((response) => {
      if (response.data.success) {
        this.updatedTime = moment(response.data.max_time).format('DD-MM-YYYY  HH:mm:ss')
      }
    })
  },

  methods: {
    changeDatePicker: function (event) {
      switch (event.target.value) {
        case 'range-date':
          this.ischoosed = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'today':
          this.fromDate = moment().format('YYYY-MM-DD')
          this.toDate = moment().format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'success'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'yesterday':
          this.fromDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
          this.toDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'success'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'last-week':
          this.fromDate = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD')
          this.toDate = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'success'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'this-week':
          this.fromDate = moment().startOf('isoWeek').format('YYYY-MM-DD')
          this.toDate = moment().endOf('isoWeek').format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'success'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'last-month':
          this.fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD')
          this.toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'success'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'this-month':
          this.fromDate = moment().startOf('month').format('YYYY-MM-DD')
          this.toDate = moment().format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'success'
          this.last_year = 'primary'
          this.this_year = 'primary'
          break
        case 'last-year':
          this.fromDate = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD')
          this.toDate = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'success'
          this.this_year = 'primary'
          break
        case 'this-year':
          this.fromDate = moment().startOf('year').format('YYYY-MM-DD')
          this.toDate = moment().format('YYYY-MM-DD')
          this.isChange = moment().format()
          this.yesterday = 'primary'
          this.today = 'primary'
          this.last_week = 'primary'
          this.this_week = 'primary'
          this.last_month = 'primary'
          this.this_month = 'primary'
          this.last_year = 'primary'
          this.this_year = 'success'
          break
        default:
          break
      }
    },

    handleAfterRangerdateBack (req) {
      this.fromDate = req.fromDate
      this.toDate = req.toDate
      this.isChange = req.isChange
    }
  }
}
</script>
