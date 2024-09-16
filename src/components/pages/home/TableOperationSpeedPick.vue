<template>
  <div>
    <b-card no-body>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
      <table v-else class="table mb-0 table-bordered">
        <thead>
          <th>Lấy hàng</th>
          <th>Thời gian TB của đơn đúng</th>
          <th>Thời gian TB của đơn sai</th>
        </thead>
        <tbody>
          <tr>
            <td>Chờ lấy hàng</td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.cho_lay_tg_tb_don_dung)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.cho_lay_tang_truong_tg_tb_don_dung)}">{{formatTimeDhm(formatSignNumber(data.cho_lay_tang_truong_tg_tb_don_dung))}}</span></b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.cho_lay_tg_tb_don_sai)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.cho_lay_tang_truong_tg_tb_don_sai)}">{{formatTimeDhm(formatSignNumber(data.cho_lay_tang_truong_tg_tb_don_sai))}}</span></b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td>Lấy hàng</td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.lay_tg_tb_don_dung)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.lay_tang_truong_tg_tb_don_dung)}">{{formatTimeDhm(formatSignNumber(data.lay_tang_truong_tg_tb_don_dung))}}</span></b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.lay_tg_tb_don_sai)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.lay_tang_truong_tg_tb_don_sai)}">{{formatTimeDhm(formatSignNumber(data.lay_tang_truong_tg_tb_don_sai))}}</span></b-col>
              </b-row>
            </td>
          </tr>
        </tbody>
      </table>
    </b-card>
  </div>
</template>
<script>
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'
import formatLib from 'infrastructures/helpers/format.js'

export default {
  name: 'table-operation-speed-pick',

  components: {
    SkRotatingPlane
  },

  props: [
    'dateRange',
    'provinceIds',
    'dateRangeCompare',
    'stationIds',
    'isReload'
  ],

  data: () => ({
    data: [],
    firstTime: true,
    appLoading: true
  }),

  created () {
    if (this.isReload) {
      this.callAPI()
    }
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
        compareFrom: this.dateRangeCompare.fromCompareDate,
        compareTo: this.dateRangeCompare.toCompareDate
      }

      dashboardV4.getOperationSpeedPickData(params)
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
