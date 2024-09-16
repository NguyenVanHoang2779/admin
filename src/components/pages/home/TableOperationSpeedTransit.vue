<template>
  <div>
    <b-card no-body>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
      <table v-else class="table mb-0 table-bordered">
        <thead>
          <tr>
            <th colspan="5">Trung chuyển</th>
          </tr>
          <tr>
            <th>Loại đơn</th>
            <th></th>
            <th>Thời gian TB chờ chuyển đi</th>
            <th>Thời gian TB di chuyển</th>
            <th>Số kho TB phải đi qua</th>
            <th>Tổng số đơn được tính</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Đơn nội tỉnh</td>
            <td>Giữa các kho nội vùng</td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.tg_cho_chuyen_noi_tinh_noi_vung)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tg_cho_chuyen_noi_tinh_noi_vung)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_tg_cho_chuyen_noi_tinh_noi_vung))}}</span></b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.tg_di_chuyen_tb_noi_tinh_noi_vung)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tg_di_chuyen_tb_noi_tinh_noi_vung)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_tg_di_chuyen_tb_noi_tinh_noi_vung))}}</span></b-col>
              </b-row>
            </td>
            <td>{{data.so_kho_tb_di_qua_noi_tinh_noi_vung}}</td>
            <td v-if="data.tang_truong_tong_don_duoc_tinh_noi_tinh_noi_vung !== 'absolute'">
              <b-row>
                <b-col v-numeral>{{data.tong_don_duoc_tinh_noi_tinh_noi_vung}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tong_don_duoc_tinh_noi_tinh_noi_vung)}">{{formatSignNumber(data.tang_truong_tong_don_duoc_tinh_noi_tinh_noi_vung)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col v-numeral>{{data.tong_don_duoc_tinh_noi_tinh_noi_vung}}</b-col>
                <b-col><span style="color:#2A9C30;" v-numeral>{{data.tong_don_duoc_tinh_noi_tinh_noi_vung}}</span></b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td rowspan="2">Đơn liên tỉnh</td>
            <td>Từ nội vùng sang liên vùng đầu tiên</td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.tg_cho_chuyen_lien_tinh_noi_sang_lien)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tg_cho_chuyen_lien_tinh_noi_sang_lien)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_tg_cho_chuyen_lien_tinh_noi_sang_lien))}}</span></b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.tg_di_chuyen_tb_lien_tinh_noi_sang_lien)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tg_di_chuyen_tb_lien_tinh_noi_sang_lien)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_tg_di_chuyen_tb_lien_tinh_noi_sang_lien))}}</span></b-col>
              </b-row>
            </td>
            <td>{{data.so_kho_tb_di_qua_lien_tinh_noi_sang_lien}}</td>
            <td v-if="data.tang_truong_tong_don_duoc_tinh_lien_tinh_noi_sang_lien !== 'absolute'">
              <b-row>
                <b-col v-numeral>{{data.tong_don_duoc_tinh_lien_tinh_noi_sang_lien}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tong_don_duoc_tinh_lien_tinh_noi_sang_lien)}">{{formatSignNumber(data.tang_truong_tong_don_duoc_tinh_lien_tinh_noi_sang_lien)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col v-numeral>{{data.tong_don_duoc_tinh_lien_tinh_noi_sang_lien}}</b-col>
                <b-col><span style="color:#2A9C30;" v-numeral>{{data.tong_don_duoc_tinh_lien_tinh_noi_sang_lien}}</span></b-col>
              </b-row>
            </td>
          </tr>
          <tr>
            <td>Từ các kho trung chuyển đến kho giao</td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.tg_cho_chuyen_lien_tinh_tc_den_giao)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tg_cho_chuyen_lien_tinh_tc_den_giao)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_tg_cho_chuyen_lien_tinh_tc_den_giao))}}</span></b-col>
              </b-row>
            </td>
            <td>
              <b-row>
                <b-col>{{formatTimeDhm(data.tg_di_chuyen_tb_lien_tinh_tc_den_giao)}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tg_di_chuyen_tb_lien_tinh_tc_den_giao)}">{{formatTimeDhm(formatSignNumber(data.tang_truong_tg_di_chuyen_tb_lien_tinh_tc_den_giao))}}</span></b-col>
              </b-row>
            </td>
            <td>{{data.so_kho_tb_di_qua_lien_tinh_tc_den_giao}}</td>
            <td v-if="data.tang_truong_tong_don_duoc_tinh_lien_tinh_tc_den_giao !== 'absolute'">
              <b-row>
                <b-col v-numeral>{{data.tong_don_duoc_tinh_lien_tinh_tc_den_giao}}</b-col>
                <b-col><span :style="{ color: fillColorNumber(data.tang_truong_tong_don_duoc_tinh_lien_tinh_tc_den_giao)}">{{formatSignNumber(data.tang_truong_tong_don_duoc_tinh_lien_tinh_tc_den_giao)}}</span> %</b-col>
              </b-row>
            </td>
            <td v-else>
              <b-row>
                <b-col v-numeral>{{data.tong_don_duoc_tinh_lien_tinh_tc_den_giao}}</b-col>
                <b-col><span style="color:#2A9C30;" v-numeral>{{data.tong_don_duoc_tinh_lien_tinh_tc_den_giao}}</span></b-col>
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
  name: 'table-operation-speed-transit',

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

      dashboardV4.getOperationSpeedTransitData(params)
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
