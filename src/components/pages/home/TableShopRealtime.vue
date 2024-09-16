<template>
  <div>
    <b-card no-body>
      <table class="table mb-0 table-bordered" v-if="dataList.length > 0">
        <thead>
          <th></th>
          <th>Tổng shop active</th>
          <th>Số shop mới</th>
          <th>Tổng đơn hàng</th>
          <th>TB đơn/shop</th>
          <th>Số shop rời bỏ</th>
          <th>Số Shop quay lại</th>
        </thead>
        <tbody v-if="dateRange.fromDate !== today">
          <tr v-for="item in dataList">
            <td>{{item.shopType}}</td>
            <template v-if="item.percentActiveShopTotal != 'absolute'">
              <td class="sub">
                <span v-numeral>{{item.activeShopTotal}}</span>
                <sub :style="{ color: fillColorNumber(item.percentActiveShopTotal)}">{{formatSignNumber(item.percentActiveShopTotal)}}%</sub>
              </td>
            </template>
            <template v-else>
              <td class="sub">
                <span v-numeral>{{item.activeShopTotal}}</span>
                <sub style="color:#2A9C30;" v-numeral>{{item.activeShopTotal}}</sub>
              </td>
            </template>
            <template v-if="item.percentNewShopTotal !== 'absolute'">
              <td class="sub">
                <span v-numeral>{{item.newShopTotal}}</span>
                <sub :style="{ color: fillColorNumber(item.percentNewShopTotal)}">{{formatSignNumber(item.percentNewShopTotal)}}%</sub>
              </td>
            </template>
            <template v-else>
              <td class="sub">
                <span v-numeral>{{item.newShopTotal}}</span>
                <sub style="color:#2A9C30;" v-numeral>{{item.newShopTotal}}</sub>
              </td>
            </template>
            <template v-if="item.percentPackageTotal !== 'absolute'">
              <td class="sub">
                <span v-numeral>{{item.packageTotal}}</span>
                <sub :style="{ color: fillColorNumber(item.percentPackageTotal)}">{{formatSignNumber(item.percentPackageTotal)}}%</sub>
              </td>
            </template>
            <template v-else>
              <td class="sub">
                <span v-numeral>{{item.packageTotal}}</span>
                <sub style="color:#2A9C30;" v-numeral>{{item.packageTotal}}</sub>
              </td>
            </template>
            <template v-if="item.percentAveragePackagePerShop !== 'absolute'">
              <td class="sub">
                {{item.averagePackagePerShop}}
                <sub :style="{ color: fillColorNumber(item.percentAveragePackagePerShop)}">{{formatSignNumber(item.percentAveragePackagePerShop)}}%</sub>
              </td>
            </template>
            <template v-else>
              <td class="sub">
                {{item.averagePackagePerShop}}
                <sub style="color:#2A9C30;">{{item.averagePackagePerShop}}</sub>
              </td>
            </template>
            <td>{{item.leftShopTotal}}</td>
            <td>{{item.backShopTotal}}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="item in dataList">
            <td>{{item.shopType}}</td>
            <template>
              <td class="sub">
                <span v-numeral>{{item.activeShopTotal}}</span>
              </td>
            </template>
            <template>
              <td class="sub">
                <span v-numeral>{{item.newShopTotal}}</span>
              </td>
            </template>
            <template>
              <td class="sub">
                <span v-numeral>{{item.packageTotal}}</span>
              </td>
            </template>
            <template>
              <td class="sub">
                {{item.averagePackagePerShop}}
              </td>
            </template>
            <td>{{item.leftShopTotal}}</td>
            <td>{{item.backShopTotal}}</td>
          </tr>
        </tbody>
      </table>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
    </b-card>
  </div>
</template>
<style>
td.sub sub {
  font-size: 85%;
  line-height: 0;
  vertical-align: 'baseline';
  bottom: '-0.5em'
}
</style>
<script>
import moment from 'moment'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'

export default {
  name: 'table-shop-realtime',

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
    getShopRealtimeDataList: function () {
      this.setDefault()
      let params = {
        from: this.dateRange.fromDate,
        to: this.dateRange.toDate,
        province: this.provinceIds,
        compareFrom: this.dateRangeCompare.fromCompareDate,
        compareTo: this.dateRangeCompare.toCompareDate
      }

      dashboardV4.getShopRealtimeDataList(params)
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
          this.getShopRealtimeDataList()
          this.firstTime = false
        }
      } else {
        this.getShopRealtimeDataList()
      }
    }
  }
}
</script>
