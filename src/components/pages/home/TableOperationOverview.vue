<template>
  <div>
    <b-card no-body>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
      <div v-else>
        <b-row v-if="myToggle">
          <b-col md="8">
            <table class="table mb-0 table-bordered" >
              <thead>
                <th></th>
                <th>Lấy</th>
                <th>Giao</th>
                <th>Trả</th>
              </thead>
              <tbody>
                <tr>
                  <td>Tổng phát sinh</td>
                  <td v-if="data.tang_truong_tong_phat_sinh_lay !== 'absolute'">
                    <b-row>
                      <b-col><span v-numeral>{{data.tong_phat_sinh_lay}}</span> đơn</b-col>
                      <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tong_phat_sinh_lay)}">{{formatSignNumber(data.tang_truong_tong_phat_sinh_lay)}}</span> %</b-col>
                    </b-row>
                  </td>
                  <td v-else>
                    <b-row>
                      <b-col><span v-numeral>{{data.tong_phat_sinh_lay}}</span> đơn</b-col>
                      <b-col><span style="color:#2A9C30;" v-numeral>{{data.tong_phat_sinh_lay}}</span> đơn</b-col>
                    </b-row>
                  </td>
                  <td v-if="data.tang_truong_tong_phat_sinh_giao !== 'absolute'">
                    <b-row>
                      <b-col><span v-numeral>{{data.tong_phat_sinh_giao}}</span> đơn</b-col>
                      <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tong_phat_sinh_giao)}">{{formatSignNumber(data.tang_truong_tong_phat_sinh_giao)}}</span> %</b-col>
                    </b-row>
                  </td>
                  <td v-else>
                    <b-row>
                      <b-col><span v-numeral>{{data.tong_phat_sinh_giao}}</span> đơn</b-col>
                      <b-col><span style="color:#2A9C30;" v-numeral>{{data.tong_phat_sinh_giao}}</span> đơn</b-col>
                    </b-row>
                  </td>
                  <td v-if="data.tang_truong_tong_phat_sinh_tra !== 'absolute'">
                    <b-row>
                      <b-col><span v-numeral>{{data.tong_phat_sinh_tra}}</span> đơn</b-col>
                      <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tong_phat_sinh_tra)}">{{formatSignNumber(data.tang_truong_tong_phat_sinh_tra)}}</span> %</b-col>
                    </b-row>
                  </td>
                  <td v-else>
                    <b-row>
                      <b-col><span v-numeral>{{data.tong_phat_sinh_tra}}</span> đơn</b-col>
                      <b-col><span style="color:#2A9C30;" v-numeral>{{data.tong_phat_sinh_tra}}</span> đơn</b-col>
                    </b-row>
                  </td>
                </tr>
                <tr>
                  <td>% hoàn thành</td>
                  <td>{{data.phan_tram_hoan_thanh_lay}} %</td>
                  <td>{{data.phan_tram_hoan_thanh_giao}} %</td>
                  <td>{{data.phan_tram_hoan_thanh_tra}} %</td>
                </tr>
                <tr>
                  <td>% đúng toàn trình</td>
                  <td>{{data.phan_tram_dung_toan_trinh_lay}} %</td>
                  <td>{{data.phan_tram_dung_toan_trinh_giao}} %</td>
                  <td>{{data.phan_tram_dung_toan_trinh_tra}} %</td>
                </tr>
                <tr>
                  <td>Thời gian hoàn thành trung bình</td>
                  <td>
                    <b-row>
                      <b-col>{{formatTimeDhm(data.thoi_gian_hoan_thanh_tb_lay)}}</b-col>
                      <b-col><span :style="{ color: fillColorNumber(data.tang_truong_thoi_gian_hoan_thanh_tb_lay)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_thoi_gian_hoan_thanh_tb_lay))}}</span></b-col>
                    </b-row>
                  </td>
                  <td>
                    <b-row>
                      <b-col>{{formatTimeDhm(data.thoi_gian_hoan_thanh_tb_giao)}}</b-col>
                      <b-col><span :style="{ color: fillColorNumber(data.tang_truong_thoi_gian_hoan_thanh_tb_giao)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_thoi_gian_hoan_thanh_tb_giao))}}</span></b-col>
                    </b-row>
                  </td>
                  <td>
                    <b-row>
                      <b-col>{{formatTimeDhm(data.thoi_gian_hoan_thanh_tb_tra)}}</b-col>
                      <b-col><span :style="{ color: fillColorNumber(data.tang_truong_thoi_gian_hoan_thanh_tb_tra)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_thoi_gian_hoan_thanh_tb_tra))}}</span></b-col>
                    </b-row>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col md="6">
            <table class="table mb-0 table-bordered">
              <thead>
                <th></th>
                <th>Lấy</th>
                <th>Giao</th>
                <th>Trả</th>
              </thead>
              <tbody>
                <tr>
                  <td>Tổng phát sinh</td>
                  <td><span v-numeral>{{data.tong_phat_sinh_lay}}</span> đơn</td>
                  <td><span v-numeral>{{data.tong_phat_sinh_giao}}</span> đơn</td>
                  <td><span v-numeral>{{data.tong_phat_sinh_tra}}</span> đơn</td>
                </tr>
                <tr>
                  <td>% hoàn thành</td>
                  <td>{{data.phan_tram_hoan_thanh_lay}} %</td>
                  <td>{{data.phan_tram_hoan_thanh_giao}} %</td>
                  <td>{{data.phan_tram_hoan_thanh_tra}} %</td>
                </tr>
                <tr>
                  <td>% đúng toàn trình</td>
                  <td>{{data.phan_tram_dung_toan_trinh_lay}} %</td>
                  <td>{{data.phan_tram_dung_toan_trinh_giao}} %</td>
                  <td>{{data.phan_tram_dung_toan_trinh_tra}} %</td>
                </tr>
                <tr>
                  <td>Thời gian hoàn thành trung bình</td>
                  <td>{{formatTimeDhm(data.thoi_gian_hoan_thanh_tb_lay)}}</td>
                  <td>{{formatTimeDhm(data.thoi_gian_hoan_thanh_tb_giao)}}</td>
                  <td>{{formatTimeDhm(data.thoi_gian_hoan_thanh_tb_tra)}}</td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
      </div>
    </b-card>
    <div class="mt-2" v-if="dateRange && dateRange.fromDate !== today">
      <b-row >
        <b-col md="2" offset-md="10">
          <b-btn :pressed.sync="myToggle" :variant="variant" class="btn btn-sm">{{myToggle === false ? ' Bấm' : 'Bỏ'}} xem so sánh</b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'
import formatLib from 'infrastructures/helpers/format.js'

export default {
  name: 'table-operation-overview',

  components: {
    SkRotatingPlane
  },

  props: [
    'dateRange',
    'dateRangeCompare',
    'provinceIds',
    'stationIds',
    'packageAreaTypeId',
    'packageStatusTypeId'
  ],

  data: () => ({
    data: [],
    firstTime: true,
    appLoading: true,
    myToggle: false,
    variant: 'outline-secondary',
    today: moment().format('YYYY-MM-DD')
  }),

  created () {
  },

  computed: {

  },

  watch: {
    provinceIds: function (newValue, oldValue) {
      this.callAPI()
    },

    dateRangeCompare: function (newValue, oldValue) {
      this.callAPI()
    },

    stationIds: function (newValue, oldValue) {
      this.callAPI()
    },

    packageAreaTypeId: function (newValue, oldValue) {
      this.callAPI()
    },

    packageStatusTypeId: function (newValue, oldValue) {
      this.callAPI()
    }
  },

  methods: {
    getData: function () {
      this.setDefault()
      let params = {
        from: this.dateRange.fromDate,
        to: this.dateRange.toDate,
        province: this.provinceIds,
        station: this.stationIds,
        packageAreaTypeId: this.packageAreaTypeId,
        packageStatusTypeId: this.packageStatusTypeId,
        compareFrom: this.dateRangeCompare.fromCompareDate,
        compareTo: this.dateRangeCompare.toCompareDate
      }

      dashboardV4.getOperationOverviewData(params)
        .then((res) => {
          if (res.data.success) {
            this.data = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    setDefault: function () {
      this.appLoading = true
      this.data = []
    },

    formatSignNumber: function (number) {
      return Math.abs(number)
    },

    fillColorNumber: function (number) {
      if (number >= 0) {
        return '#2A9C30'
      } else {
        return '#FF0000'
      }
    },

    formatTimeDhm: function (number) {
      return formatLib.formatTimeDhm(number)
    },

    callAPI: function () {
      if (this.firstTime === true) {
        if (this.dateRange && this.provinceIds && this.dateRangeCompare) {
          this.getData()
          this.firstTime = false
        }
      } else {
        this.getData()
      }
    }
  }
}
</script>
