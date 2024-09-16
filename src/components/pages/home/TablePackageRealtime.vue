<template>
  <div>
    <b-card no-body>
      <table class="table mb-0" v-if="Object.keys(dataList).length > 0">
        <thead>
          <th>Loại đơn</th>
          <th>Tổng đơn</th>
          <th>Tỷ trọng / tổng</th>
          <th colspan="2">Chi tiết</th>
          <th>Tỷ trọng/từng loại</th>
          <th>Số đơn</th>
        </thead>
        <tbody v-if="dateRange.fromDate !== today">
          <template>
            <tr>
              <td rowspan="5" class="background-F7F7F7">Nội tỉnh</td>
              <template v-if="dataList.noi_tinh_tong_don_tang_truong !== 'absolute'">
                <td rowspan="5" class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_tong_don}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_tong_don_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_tong_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td rowspan="5" class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_tong_don}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.noi_tinh_tong_don}}</sub>
                </td>
              </template>
              <template>
                <td rowspan="5" class="background-F7F7F7 sub">
                  {{dataList.noi_tinh_ty_trong}}%
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_ty_trong_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_ty_trong_tang_truong)}}%</sub>
                </td>
              </template>
              <td colspan="2" class="background-EDEDED">Ngày</td>
              <td class="background-EDEDED">{{dataList.noi_tinh_ngay_ty_trong}}%</td>
              <template v-if="dataList.noi_tinh_ngay_so_don_tang_truong !== 'absolute'">
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_ngay}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_ngay_so_don_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_ngay_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_ngay}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.noi_tinh_ngay}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-EDEDED">Tối</td>
              <td class="background-EDEDED">{{dataList.noi_tinh_toi_ty_trong}}%</td>
              <template v-if="dataList.noi_tinh_toi_so_don_tang_truong !== 'absolute'">
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_toi}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_toi_so_don_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_toi_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_toi}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.noi_tinh_toi}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-EDEDED">CN</td>
              <td class="background-EDEDED">{{dataList.noi_tinh_cn_ty_trong}}%</td>
              <template v-if="dataList.noi_tinh_cn_so_don_tang_truong !== 'absolute'">
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_cn}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_cn_so_don_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_cn_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_cn}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.noi_tinh_cn}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-F7F7F7">Giao nội thành</td>
              <td class="background-F7F7F7">{{dataList.noi_tinh_noi_thanh_ty_trong}}%</td>
              <template v-if="dataList.noi_tinh_noi_thanh_so_don_tang_truong !== 'absolute'">
                <td class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_noi_thanh}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_noi_thanh_so_don_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_noi_thanh_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_noi_thanh}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.noi_tinh_noi_thanh}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-F7F7F7">Giao huyện</td>
              <td class="background-F7F7F7">{{dataList.noi_tinh_huyen_ty_trong}}%</td>
              <template v-if="dataList.noi_tinh_huyen_so_don_tang_truong !== 'absolute'">
                <td class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_huyen}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.noi_tinh_huyen_so_don_tang_truong)}">{{formatSignNumber(dataList.noi_tinh_huyen_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_huyen}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.noi_tinh_huyen}}</sub>
                </td>
              </template>
            </tr>
          </template>
          <template>
            <tr>
              <td rowspan="5">Liên tỉnh</td>
              <template v-if="dataList.lien_tinh_tong_don_tang_truong !== 'absolute'">
                <td rowspan="5" class="sub">
                  <span v-numeral>{{dataList.lien_tinh_tong_don}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_tong_don_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_tong_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td rowspan="5" class="sub">
                  <span v-numeral>{{dataList.lien_tinh_tong_don}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.lien_tinh_tong_don}}</sub>
                </td>
              </template>
              <template>
                <td rowspan="5" class="sub">
                  {{dataList.lien_tinh_ty_trong}}%
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_ty_trong_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_ty_trong_tang_truong)}}%</sub>
                </td>
              </template>
              <td colspan="2">Nội miền</td>
              <td>{{dataList.lien_tinh_noi_mien_ty_trong}}%</td>
              <template v-if="dataList.lien_tinh_noi_mien_so_don_tang_truong !== 'absolute'">
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_noi_mien}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_noi_mien_so_don_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_noi_mien_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_noi_mien}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.lien_tinh_noi_mien}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td rowspan="2">Đặc biệt</td>
              <td>bay</td>
              <td>{{dataList.lien_tinh_dac_biet_bay_ty_trong}}%</td>
              <template v-if="dataList.lien_tinh_dac_biet_bay_so_don_tang_truong !== 'absolute'">
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_dac_biet_bay}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_dac_biet_bay_so_don_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_dac_biet_bay_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub">
                  <span numeral>{{dataList.lien_tinh_dac_biet_bay}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.lien_tinh_dac_biet_bay}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td>bộ</td>
              <td>{{dataList.lien_tinh_dac_biet_bo_ty_trong}}%</td>
              <template v-if="dataList.lien_tinh_dac_biet_bo_so_don_tang_truong !== 'absolute'">
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_dac_biet_bo}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_dac_biet_bo_so_don_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_dac_biet_bo_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_dac_biet_bo}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.lien_tinh_dac_biet_bo}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td rowspan="2">Liên miền</td>
              <td>bay</td>
              <td>{{dataList.lien_tinh_lien_mien_bay_ty_trong}}%</td>
              <template v-if="dataList.lien_tinh_lien_mien_bay_so_don_tang_truong !== 'absolute'">
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_lien_mien_bay}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_lien_mien_bay_so_don_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_lien_mien_bay_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_lien_mien_bay}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.lien_tinh_lien_mien_bay}}</sub>
                </td>
              </template>
            </tr>
            <tr>
              <td>bộ</td>
              <td>{{dataList.lien_tinh_lien_mien_bo_ty_trong}}%</td>
              <template v-if="dataList.lien_tinh_lien_mien_bo_so_don_tang_truong !== 'absolute'">
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_lien_mien_bo}}</span>
                  <sub :style="{ color: fillColorNumber(dataList.lien_tinh_lien_mien_bo_so_don_tang_truong)}">{{formatSignNumber(dataList.lien_tinh_lien_mien_bo_so_don_tang_truong)}}%</sub>
                </td>
              </template>
              <template v-else>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_lien_mien_bo}}</span>
                  <sub style="color:#2A9C30;" v-numeral>{{dataList.lien_tinh_lien_mien_bo}}</sub>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <template>
            <tr>
              <td rowspan="5" class="background-F7F7F7">Nội tỉnh</td>
              <template>
                <td rowspan="5" class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_tong_don}}</span>
                </td>
              </template>
              <template>
                <td rowspan="5" class="background-F7F7F7 sub">
                  {{dataList.noi_tinh_ty_trong}}%
                </td>
              </template>
              <td colspan="2" class="background-EDEDED">Ngày</td>
              <td class="background-EDEDED">{{dataList.noi_tinh_ngay_ty_trong}}%</td>
              <template>
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_ngay}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-EDEDED">Tối</td>
              <td class="background-EDEDED">{{dataList.noi_tinh_toi_ty_trong}}%</td>
              <template>
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_toi}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-EDEDED">CN</td>
              <td class="background-EDEDED">{{dataList.noi_tinh_cn_ty_trong}}%</td>
              <template>
                <td class="sub background-EDEDED">
                  <span v-numeral>{{dataList.noi_tinh_cn}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-F7F7F7">Giao nội thành</td>
              <td class="background-F7F7F7">{{dataList.noi_tinh_noi_thanh_ty_trong}}%</td>
              <template>
                <td class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_noi_thanh}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="2" class="background-F7F7F7">Giao huyện</td>
              <td class="background-F7F7F7">{{dataList.noi_tinh_huyen_ty_trong}}%</td>
              <template>
                <td class="background-F7F7F7 sub">
                  <span v-numeral>{{dataList.noi_tinh_huyen}}</span>
                </td>
              </template>
            </tr>
          </template>
          <template>
            <tr>
              <td rowspan="5">Liên tỉnh</td>
              <template>
                <td rowspan="5" class="sub">
                  <span v-numeral>{{dataList.lien_tinh_tong_don}}</span>
                </td>
              </template>
              <template>
                <td rowspan="5" class="sub">
                  {{dataList.lien_tinh_ty_trong}}%
                </td>
              </template>
              <td colspan="2">Nội miền</td>
              <td>{{dataList.lien_tinh_noi_mien_ty_trong}}%</td>
              <template>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_noi_mien}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td rowspan="2">Đặc biệt</td>
              <td>bay</td>
              <td>{{dataList.lien_tinh_dac_biet_bay_ty_trong}}%</td>
              <template>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_dac_biet_bay}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td>bộ</td>
              <td>{{dataList.lien_tinh_dac_biet_bo_ty_trong}}%</td>
              <template>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_dac_biet_bo}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td rowspan="2">Liên miền</td>
              <td>bay</td>
              <td>{{dataList.lien_tinh_lien_mien_bay_ty_trong}}%</td>
              <template>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_lien_mien_bay}}</span>
                </td>
              </template>
            </tr>
            <tr>
              <td>bộ</td>
              <td>{{dataList.lien_tinh_lien_mien_bo_ty_trong}}%</td>
              <template>
                <td class="sub">
                  <span v-numeral>{{dataList.lien_tinh_lien_mien_bo}}</span>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
    </b-card>
  </div>
</template>
<style>
td.background-F7F7F7 {
  background-color: #F7F7F7;
}

td.background-EDEDED {
  background-color: #EDEDED;
}

td.sub sub {
  font-size: 85%;
  line-height: 0;
  vertical-align: 'baseline';
  bottom: '-0.4em'
}
</style>
<script>
import moment from 'moment'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'

export default {
  name: 'table-package-realtime',

  components: {
    SkRotatingPlane
  },

  props: [
    'dateRange',
    'provinceIds',
    'dateRangeCompare'
  ],

  data: () => ({
    dataList: [],
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

    dateRangeCompare: function (newValue, oldValue) {
      this.callAPI()
    }
  },

  methods: {
    getPackageRealtimeDataList: function () {
      this.setDefault()
      let params = {
        provinceIds: this.provinceIds,
        from: this.dateRange.fromDate,
        to: this.dateRange.toDate,
        compareFrom: this.dateRangeCompare.fromCompareDate,
        compareTo: this.dateRangeCompare.toCompareDate
      }

      dashboardV4.getInfoByPackageType(params)
        .then((res) => {
          if (res.data.success) {
            this.dataList = res.data.data
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
      this.dataList = []
    },

    fillColorNumber: function (number) {
      if (number >= 0) {
        return '#2A9C30'
      } else {
        return '#FF0000'
      }
    },

    formatSignNumber: function (number) {
      return Math.abs(number)
    },

    callAPI: function () {
      if (this.firstTime === true) {
        if (this.dateRange && this.provinceIds && this.dateRangeCompare) {
          this.getPackageRealtimeDataList()
          this.firstTime = false
        }
      } else {
        this.getPackageRealtimeDataList()
      }
    }
  }
}
</script>
