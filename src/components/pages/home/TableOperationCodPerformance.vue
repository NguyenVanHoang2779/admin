<template>
  <div>
    <b-card no-body>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
      <table v-else class="table mb-0 table-bordered">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Cod lấy</th>
            <th>Cod giao</th>
            <th>Cod trả</th>
          </tr>
        </thead>
        <tbody v-if="date !== today">
          <tr>
            <td rowspan="3">Perfomance</td>
            <td>Số lượng active</td>
            <td v-if="data.performance_active_cod_lay !== 'absolute'">
              <b-row>
                <b-col><span v-numeral>{{data.performance_active_cod_lay}}</span> cod</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_active_cod_lay)}">{{formatSignNumber(data.tang_truong_performance_active_cod_lay)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col v-numeral>{{data.performance_active_cod_lay}} cod</b-col>
                <b-col><span style="color:#2A9C30;" v-numeral>{{data.performance_active_cod_lay}}</span> cod</b-col>
              </b-row>
            </td>
            <td v-if="data.tang_truong_performance_active_cod_giao !== 'absolute'">
              <b-row>
                <b-col><span v-numeral>{{data.performance_active_cod_giao}}</span> cod</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_active_cod_giao)}">{{formatSignNumber(data.tang_truong_performance_active_cod_giao)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col><span v-numeral>{{data.performance_active_cod_giao}}</span> cod</b-col>
                <b-col><span style="color:#2A9C30;" v-numeral>{{data.performance_active_cod_giao}}</span> cod</b-col>
              </b-row>
            </td>
            <td v-if="data.tang_truong_performance_active_cod_tra !== 'absolute'">
              <b-row>
                <b-col><span v-numeral>{{data.performance_active_cod_tra}}</span> cod</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_active_cod_tra)}">{{formatSignNumber(data.tang_truong_performance_active_cod_tra)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col><span v-numeral>{{data.performance_active_cod_tra}}</span> cod</b-col>
                <b-col><span style="color:#2A9C30;" v-numeral>{{data.performance_active_cod_tra}}</span> cod</b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td>Perfomance hiện tại</td>
            <td v-if="data.tang_truong_performance_hien_tai_cod_lay !== 'absolute'">
              <b-row>
                <b-col>{{data.performance_hien_tai_cod_lay}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_hien_tai_cod_lay)}">{{formatSignNumber(data.tang_truong_performance_hien_tai_cod_lay)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col>{{data.performance_hien_tai_cod_lay}}</b-col>
                <b-col><span style="color:#2A9C30;">{{data.performance_hien_tai_cod_lay}}</span></b-col>
              </b-row>
            </td>
            <td v-if="data.tang_truong_performance_hien_tai_cod_giao !== 'absolute'">
              <b-row>
                <b-col>{{data.performance_hien_tai_cod_giao}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_hien_tai_cod_giao)}">{{formatSignNumber(data.tang_truong_performance_hien_tai_cod_giao)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col>{{data.performance_hien_tai_cod_giao}}</b-col>
                <b-col><span style="color:#2A9C30;">{{data.performance_hien_tai_cod_giao}}</span></b-col>
              </b-row>
            </td>
            <td v-if="data.tang_truong_performance_hien_tai_cod_tra !== 'absolute'">
              <b-row>
                <b-col>{{data.performance_hien_tai_cod_tra}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_hien_tai_cod_tra)}">{{formatSignNumber(data.tang_truong_performance_hien_tai_cod_tra)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col>{{data.performance_hien_tai_cod_tra}}</b-col>
                <b-col><span style="color:#2A9C30;">{{data.performance_hien_tai_cod_tra}}</span></b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td>Năng suất hệ thống</td>
            <td v-if="data.tang_truong_performance_nsht_cod_lay !== 'absolute'">
              <b-row>
                <b-col>{{data.performance_nsht_cod_lay}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_nsht_cod_lay)}">{{formatSignNumber(data.tang_truong_performance_nsht_cod_lay)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col>{{data.performance_nsht_cod_lay}}</b-col>
                <b-col><span style="color:#2A9C30;">{{data.performance_nsht_cod_lay}}</span></b-col>
              </b-row>
            </td>
            <td v-if="data.tang_truong_performance_nsht_cod_giao !== 'absolute'">
              <b-row>
                <b-col>{{data.performance_nsht_cod_giao}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_nsht_cod_giao)}">{{formatSignNumber(data.tang_truong_performance_nsht_cod_giao)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col>{{data.performance_nsht_cod_giao}}</b-col>
                <b-col><span style="color:#2A9C30;">{{data.performance_nsht_cod_giao}}</span></b-col>
              </b-row>
            </td>
            <td v-if="data.tang_truong_performance_nsht_cod_tra !== 'absolute'">
              <b-row>
                <b-col>{{data.performance_nsht_cod_tra}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_performance_nsht_cod_tra)}">{{formatSignNumber(data.tang_truong_performance_nsht_cod_tra)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col>{{data.performance_nsht_cod_tra}}</b-col>
                <b-col><span style="color:#2A9C30;">{{data.performance_nsht_cod_tra}}</span></b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td rowspan="3">Chất lượng phục vụ</td>
            <td>Vote sao</td>
            <td>
              <b-row>
                <b-col>{{data.clpv_tb_vote_sao_lay}} sao</b-col>
                <b-col>{{data.clpv_tong_vote_sao_lay}} vote</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_tb_vote_sao_giao}} sao</b-col>
                <b-col>{{data.clpv_tong_vote_sao_giao}} vote</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_tb_vote_sao_tra}} sao</b-col>
                <b-col>{{data.clpv_tong_vote_sao_tra}} vote</b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td>% delay không có log cuộc gọi</td>
            <td>{{data.clpv_phan_tram_delay_lay}} %</td>
            <td>{{data.clpv_phan_tram_delay_giao}} %</td>
            <td>{{data.clpv_phan_tram_delay_tra}} %</td>
          </tr>
          <tr>
            <td>% số đơn bồi hoàn/tổng bồi hoàn</td>
            <td>
              <b-row>
                <b-col>{{data.clpv_phan_tram_don_boi_hoan_lay}} %</b-col>
                <b-col><span v-numeral>{{data.clpv_tong_don_boi_hoan_lay}}</span> đơn</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_phan_tram_don_boi_hoan_giao}} %</b-col>
                <b-col><span v-numeral>{{data.clpv_tong_don_boi_hoan_giao}}</span> đơn</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_phan_tram_don_boi_hoan_tra}} %</b-col>
                <b-col><span v-numeral>{{data.clpv_tong_don_boi_hoan_tra}}</span> đơn</b-col>
              </b-row>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td rowspan="3">Perfomance</td>
            <td>Số lượng active</td>
            <td>
              <span v-numeral>{{data.performance_active_cod_lay}}</span> cod
            </td>
            <td>
              <span v-numeral>{{data.performance_active_cod_giao}}</span> cod
            </td>
            <td>
              <span v-numeral>{{data.performance_active_cod_tra}}</span> cod
            </td>
          </tr>
          <tr>
            <td>Perfomance hiện tại</td>
            <td>
              {{data.performance_hien_tai_cod_lay}}
            </td>
            <td>
              {{data.performance_hien_tai_cod_giao}}
            </td>
            <td>
              {{data.performance_hien_tai_cod_tra}}
            </td>
          </tr>
          <tr>
            <td>Năng suất hệ thống</td>
            <td>
              {{data.performance_nsht_cod_lay}}
            </td>
            <td>
              {{data.performance_nsht_cod_giao}}
            </td>
            <td>
              {{data.performance_nsht_cod_tra}}
            </td>
          </tr>
          <tr>
            <td rowspan="3">Chất lượng phục vụ</td>
            <td>Vote sao</td>
            <td>
              <b-row>
                <b-col>{{data.clpv_tb_vote_sao_lay}} sao</b-col>
                <b-col>{{data.clpv_tong_vote_sao_lay}} vote</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_tb_vote_sao_giao}} sao</b-col>
                <b-col>{{data.clpv_tong_vote_sao_giao}} vote</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_tb_vote_sao_tra}} sao</b-col>
                <b-col>{{data.clpv_tong_vote_sao_tra}} vote</b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td>% delay không có log cuộc gọi</td>
            <td>{{data.clpv_phan_tram_delay_lay}} %</td>
            <td>{{data.clpv_phan_tram_delay_giao}} %</td>
            <td>{{data.clpv_phan_tram_delay_tra}} %</td>
          </tr>
          <tr>
            <td>% số đơn bồi hoàn/tổng bồi hoàn</td>
            <td>
              <b-row>
                <b-col>{{data.clpv_phan_tram_don_boi_hoan_lay}} %</b-col>
                <b-col><span v-numeral>{{data.clpv_tong_don_boi_hoan_lay}}</span> đơn</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_phan_tram_don_boi_hoan_giao}} %</b-col>
                <b-col><span v-numeral>{{data.clpv_tong_don_boi_hoan_giao}}</span> đơn</b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{data.clpv_phan_tram_don_boi_hoan_tra}} %</b-col>
                <b-col><span v-numeral>{{data.clpv_tong_don_boi_hoan_tra}}</span> đơn</b-col>
              </b-row>
            </td>
          </tr>
        </tbody>
      </table>
    </b-card>
  </div>
</template>
<script>
import moment from 'moment'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'

export default {
  name: 'table-operation-cod-performance',

  components: {
    SkRotatingPlane
  },

  props: [
    'date',
    'dateCompare',
    'provinceIds',
    'stationIds',
    'donDiemId',
    'caIds'
  ],

  data: () => ({
    data: [],
    firstTime: true,
    appLoading: true,
    today: moment().format('YYYY-MM-DD')
  }),

  created () {
  },

  watch: {
    provinceIds: function (newValue, oldValue) {
      this.callAPI()
    },

    dateCompare: function (newValue, oldValue) {
      this.callAPI()
    },

    stationIds: function (newValue, oldValue) {
      this.callAPI()
    },

    donDiemId: function (newValue, oldValue) {
      this.callAPI()
    },

    caIds: function (newValue, oldValue) {
      this.callAPI()
    }
  },

  methods: {
    getData: function () {
      this.setDefault()
      let params = {
        date: this.date,
        dateCompare: this.dateCompare,
        province: this.provinceIds,
        station: this.stationIds,
        donDiemId: this.donDiemId,
        caIds: this.caIds
      }

      dashboardV4.getOperationCodPerformanceData(params)
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

    callAPI: function () {
      if (this.firstTime === true) {
        if (this.date && this.provinceIds && this.dateCompare && this.donDiemId) {
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
