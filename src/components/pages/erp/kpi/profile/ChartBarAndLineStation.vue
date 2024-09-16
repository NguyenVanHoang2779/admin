<template>
  <div>
    <b-row>
      <b-col>
        <div class="w-100 d-flex justify-content-between align-content-center mt-2 my-auto">
          <div class="mt-3">
            <h5 style="font-weight: bold">Sản lượng - Chất lượng (theo khâu)</h5>
          </div>
          <div v-if="typeStation ==='kho_trung_chuyen'" class="mt-3" style="cursor: pointer; font-weight: 500">
            <span
              class="active"
              id="nhap"
              @click="changeTypeChar('nhap')"
            >Nhập</span> |
            <span
              id="sorting"
              @click="changeTypeChar('sorting')"
            >Sorting</span> |
            <span
              id="lam_hang"
              @click="changeTypeChar('lam_hang')"
            >Làm hàng</span> |
            <span
              id="nhap_chuong"
              @click="changeTypeChar('nhap_chuong')"
            >Nhập chuồng</span> |
            <span
              id="xuat"
              @click="changeTypeChar('xuat')"
            >Xuất</span>
          </div>
          <div v-if="typeStation ==='buu_cuc'" class="mt-3" style="cursor: pointer; font-weight: 500">
            <span
              class="active"
              id="lay"
              @click="changeTypeChar('lay')"
            >Lấy</span> |
            <span
              id="giao"
              @click="changeTypeChar('giao')"
            >Giao</span> |
            <span
              id="tra"
              @click="changeTypeChar('tra')"
            >Trả</span>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="p-3 mb-3 d-flex justify-content-center">
        <div>
          <div class="demo-vertical-spacing delivery-pick-container" style="overflow: auto">
            <vue-c3 :handler="barHandler" style="min-height: 400px" :style="customWidth" class="delivery-pick-chart" id="delivery-pick"></vue-c3>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import stationProfileService from 'domain/services/station-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ChartBarAndLineStation',
  components: {
    VueC3
  },
  props: {
    dataSend: {
      type: Object,
      required: true
    },
    typeStation: ''
  },
  data: () => ({
    barHandler: new Vue(),
    xAxis: ['x', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    san_luong_nhap: ['Sản lượng nhập', 0, 0, 0, 0, 0, 0],
    san_luong_nhap_dung: ['Sản lượng nhập đúng', 0, 0, 0, 0, 0, 0],
    ti_le_nhap_dung: ['Tỉ lệ nhập đúng', 0, 0, 0, 0, 0, 0],
    san_luong_sorting: ['Sản lượng sorting', 0, 0, 0, 0, 0, 0],
    san_luong_sorting_dung: ['Sản lượng sorting đúng', 0, 0, 0, 0, 0, 0],
    ti_le_sorting_dung: ['Tỉ lệ sorting đúng', 0, 0, 0, 0, 0, 0],
    san_luong_lam_hang: ['Sản lượng làm hàng', 0, 0, 0, 0, 0, 0],
    san_luong_lam_hang_dung: ['Sản lượng làm hàng đúng', 0, 0, 0, 0, 0, 0],
    ti_le_lam_hang_dung: ['Tỉ lệ làm hàng đúng', 0, 0, 0, 0, 0, 0],
    san_luong_nhap_chuong: ['Sản lượng nhập chuồng', 0, 0, 0, 0, 0, 0],
    san_luong_nhap_chuong_dung: ['Sản lượng nhập chuồng đúng', 0, 0, 0, 0, 0, 0],
    ti_le_nhap_chuong_dung: ['Tỉ lệ nhập chuồng đúng', 0, 0, 0, 0, 0, 0],
    san_luong_xuat: ['Sản lượng xuất', 0, 0, 0, 0, 0, 0],
    san_luong_xuat_dung: ['Sản lượng xuất đúng', 0, 0, 0, 0, 0, 0],
    ti_le_xuat_dung: ['Tỉ lệ xuất đúng', 0, 0, 0, 0, 0, 0],
    san_luong_lay: ['Sản lượng lấy', 0, 0, 0, 0, 0, 0],
    san_luong_lay_thanh_cong: ['Sản lượng lấy thành công', 0, 0, 0, 0, 0, 0],
    ti_le_lay_thanh_cong: ['Tỉ lệ lấy thành công', 0, 0, 0, 0, 0, 0],
    san_luong_giao: ['Sản lượng giao', 0, 0, 0, 0, 0, 0],
    san_luong_giao_thanh_cong: ['Sản lượng giao thành công', 0, 0, 0, 0, 0, 0],
    ti_le_giao_thanh_cong: ['Tỉ lệ giao thành công', 0, 0, 0, 0, 0, 0],
    san_luong_tra: ['Sản lượng trả', 0, 0, 0, 0, 0, 0],
    san_luong_tra_thanh_cong: ['Sản lượng trả thành công', 0, 0, 0, 0, 0, 0],
    ti_le_tra_thanh_cong: ['Tỉ lệ trả thành công', 0, 0, 0, 0, 0, 0],
    state: true,
    typeChart: 'nhap',
    ids: ['Sản lượng nhập', 'Sản lượng nhập đúng', 'Tỉ lệ nhập đúng']
  }),
  computed: {
    barOptions: function () {
      return {
        color: {pattern: ['#00904A', '#EEBF5C', '#E9693D']},
        data: {
          x: 'x',
          columns: this.columns,
          axes: this.axes,
          types: this.types
        },
        tooltip: {
          grouped: false
        },
        bar: {
          width: 15
        },
        axis: {
          x: {
            type: 'category',
            label: {
              text: 'Tháng',
              position: 'outer-right'
            },
            count: 11
          },
          y: {
            type: 'linear',
            label: {
              text: 'y label',
              position: 'outer-top'
            }
          },
          y2: {
            show: true,
            type: 'linear',
            label: {
              text: 'y2 label',
              position: 'outer-top'
            },
            tick: {
              format: function (d) {
                return d >= 0 ? d + '%' : '-'
              }
            },
            min: 0,
            max: 100,
            padding: {top: 0, bottom: 0}
          }
        },
        grid: {
          y: {
            show: true
          }
        }
      }
    },
    customWidth () {
      return {
        width: this.columns[0].length * (this.dataSend.viewType === 'date' ? 85 : 64) + 'px'
      }
    },
    axes () {
      return {
        'Sản lượng nhập': 'y',
        'Sản lượng nhập đúng': 'y',
        'Tỉ lệ nhập đúng': 'y2',
        'Sản lượng sorting': 'y',
        'Sản lượng sorting đúng': 'y',
        'Tỉ lệ sorting đúng': 'y2',
        'Sản lượng làm hàng': 'y',
        'Sản lượng làm hàng đúng': 'y',
        'Tỉ lệ làm hàng đúng': 'y2',
        'Sản lượng nhập chuồng': 'y',
        'Sản lượng nhập chuồng đúng': 'y',
        'Tỉ lệ nhập chuồng đúng': 'y2',
        'Sản lượng xuất': 'y',
        'Sản lượng xuất đúng': 'y',
        'Tỉ lệ xuất đúng': 'y2',
        'Sản lượng lấy': 'y',
        'Sản lượng lấy thành công': 'y',
        'Tỉ lệ lấy thành công': 'y2',
        'Sản lượng giao': 'y',
        'Sản lượng giao thành công': 'y',
        'Tỉ lệ giao thành công': 'y2',
        'Sản lượng trả': 'y',
        'Sản lượng trả thành công': 'y',
        'Tỉ lệ trả thành công': 'y2'
      }
    },
    types () {
      return {
        'Sản lượng nhập': 'bar',
        'Sản lượng nhập đúng': 'bar',
        'Tỉ lệ nhập đúng': 'line',
        'Sản lượng sorting': 'bar',
        'Sản lượng sorting đúng': 'bar',
        'Tỉ lệ sorting đúng': 'line',
        'Sản lượng làm hàng': 'bar',
        'Sản lượng làm hàng đúng': 'bar',
        'Tỉ lệ làm hàng đúng': 'line',
        'Sản lượng nhập chuồng': 'bar',
        'Sản lượng nhập chuồng đúng': 'bar',
        'Tỉ lệ nhập chuồng đúng': 'line',
        'Sản lượng xuất': 'bar',
        'Sản lượng xuất đúng': 'bar',
        'Tỉ lệ xuất đúng': 'line',
        'Sản lượng lấy': 'bar',
        'Sản lượng lấy thành công': 'bar',
        'Tỉ lệ lấy thành công': 'line',
        'Sản lượng giao': 'bar',
        'Sản lượng giao thành công': 'bar',
        'Tỉ lệ giao thành công': 'line',
        'Sản lượng trả': 'bar',
        'Sản lượng trả thành công': 'bar',
        'Tỉ lệ trả thành công': 'line'
      }
    },
    yLabel () {
      if (this.typeStation === 'kho_trung_chuyen') {
        return 'Kiện'
      } else {
        return 'Đơn'
      }
    },
    y2Label () {
      return 'Tỷ lệ (%)'
    },
    yFormat () {
      return {
        show: true,
        type: 'linear',
        label: {
          text: 'y2 label',
          position: 'outer-top'
        },
        tick: {
          format: function (d) {
            return d >= 0 ? d + '%' : '-'
          }
        }
      }
    },
    columns () {
      let data = []
      if (this.typeChart === 'nhap') {
        data = [
          this.xAxis,
          this.san_luong_nhap,
          this.san_luong_nhap_dung,
          this.ti_le_nhap_dung
        ]
      }
      if (this.typeChart === 'sorting') {
        data = [
          this.xAxis,
          this.san_luong_sorting,
          this.san_luong_sorting_dung,
          this.ti_le_sorting_dung
        ]
      }
      if (this.typeChart === 'lam_hang') {
        data = [
          this.xAxis,
          this.san_luong_lam_hang,
          this.san_luong_lam_hang_dung,
          this.ti_le_lam_hang_dung
        ]
      }
      if (this.typeChart === 'nhap_chuong') {
        data = [
          this.xAxis,
          this.san_luong_nhap_chuong,
          this.san_luong_nhap_chuong_dung,
          this.ti_le_nhap_chuong_dung
        ]
      }
      if (this.typeChart === 'xuat') {
        data = [
          this.xAxis,
          this.san_luong_xuat,
          this.san_luong_xuat_dung,
          this.ti_le_xuat_dung
        ]
      }
      if (this.typeChart === 'lay') {
        data = [
          this.xAxis,
          this.san_luong_lay,
          this.san_luong_lay_thanh_cong,
          this.ti_le_lay_thanh_cong
        ]
      }
      if (this.typeChart === 'giao') {
        data = [
          this.xAxis,
          this.san_luong_giao,
          this.san_luong_giao_thanh_cong,
          this.ti_le_giao_thanh_cong
        ]
      }
      if (this.typeChart === 'tra') {
        data = [
          this.xAxis,
          this.san_luong_tra,
          this.san_luong_tra_thanh_cong,
          this.ti_le_tra_thanh_cong
        ]
      }
      return data
    }
  },
  watch: {
    barOptions () {
      this.barHandler.$emit('dispatch', chart => {
        const options = {
          columns: this.columns
        }
        chart.unload({
          ids: this.ids,
          done: function () {
            chart.load(options)
          }
        })
        chart.axis.labels({
          x: this.dataSend.viewType === 'date' ? 'Ngày' : 'Tháng',
          y: this.yLabel,
          y2: this.y2Label
        })
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataCharBarLine()
      }
    },
    typeStation () {
      let idUnload = []
      if (this.typeStation === 'kho_trung_chuyen') {
        this.typeChart = 'nhap'
        idUnload = ['x', 'Sản lượng lấy', 'Sản lượng lấy thành công', 'Tỉ lệ lấy thành công']
      } else {
        this.typeChart = 'lay'
        idUnload = ['x', 'Sản lượng nhập', 'Sản lượng nhập đúng', 'Tỉ lệ nhập đúng']
      }
      this.barHandler.$emit('dispatch', chart => {
        chart.unload({
          ids: idUnload
        })
      })
    }
  },
  updated () {},
  mounted () {
    this.barHandler.$emit('init', this.barOptions)
    this.barHandler.$emit('dispatch', (chart) => chart.resize())
  },
  methods: {
    changeTypeChar (type) {
      this.ids = [this.columns[0][0], this.columns[1][0], this.columns[2][0], this.columns[3][0]]
      this.typeChart = type
      if (!document.getElementById(type).classList.contains('active')) {
        document.getElementById(type).classList.add('active')
      }
      if (this.typeStation === 'kho_trung_chuyen') {
        if (type !== 'nhap' && document.getElementById('nhap').classList.contains('active')) {
          document.getElementById('nhap').classList.remove('active')
        }
        if (type !== 'sorting' && document.getElementById('sorting').classList.contains('active')) {
          document.getElementById('sorting').classList.remove('active')
        }
        if (type !== 'lam_hang' && document.getElementById('lam_hang').classList.contains('active')) {
          document.getElementById('lam_hang').classList.remove('active')
        }
        if (type !== 'nhap_chuong' && document.getElementById('nhap_chuong').classList.contains('active')) {
          document.getElementById('nhap_chuong').classList.remove('active')
        }
        if (type !== 'xuat' && document.getElementById('xuat').classList.contains('active')) {
          document.getElementById('xuat').classList.remove('active')
        }
      }
      if (this.typeStation === 'buu_cuc') {
        if (type !== 'lay' && document.getElementById('lay').classList.contains('active')) {
          document.getElementById('lay').classList.remove('active')
        }
        if (type !== 'giao' && document.getElementById('giao').classList.contains('active')) {
          document.getElementById('giao').classList.remove('active')
        }
        if (type !== 'tra' && document.getElementById('tra').classList.contains('active')) {
          document.getElementById('tra').classList.remove('active')
        }
      }
    },
    getDataCharBarLine () {
      let dataSend = {
        nStationID: this.$route.params.nStationID,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      stationProfileService.getDataChartBarAndLineStation(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            // Biểu đồ sản lượng và chất lượng của kho trung chuyển
            if (response.data.data.type === 'trung_chuyen') {
              // Biểu đồ nhập
              this.xAxis = response.data.data.import.x_axis
              this.san_luong_nhap = response.data.data.import.input_quantity
              this.san_luong_nhap_dung = response.data.data.import.input_exactly_quantity
              this.ti_le_nhap_dung = response.data.data.import.input_ratio_quantity

              // Biểu đồ sorting
              this.san_luong_sorting = response.data.data.sorting.input_quantity_sorting
              this.san_luong_sorting_dung = response.data.data.sorting.input_exactly_quantity_sorting
              this.ti_le_sorting_dung = response.data.data.sorting.input_ratio_quantity_sorting

              // Biểu đồ làm hàng
              this.san_luong_lam_hang = response.data.data.p2b.input_quantity_p2b
              this.san_luong_lam_hang_dung = response.data.data.p2b.input_exactly_quantity_p2b
              this.ti_le_lam_hang_dung = response.data.data.p2b.input_ratio_quantity_p2b

              // Biểu đồ nhập chuồng
              this.san_luong_nhap_chuong = response.data.data.pallet.input_quantity_pallet
              this.san_luong_nhap_chuong_dung = response.data.data.pallet.input_exactly_quantity_pallet
              this.ti_le_nhap_chuong_dung = response.data.data.pallet.input_ratio_quantity_pallet

              // Biểu đồ xuất
              this.san_luong_xuat = response.data.data.export.input_quantity_export
              this.san_luong_xuat_dung = response.data.data.export.input_exactly_quantity_export
              this.ti_le_xuat_dung = response.data.data.export.input_ratio_quantity_export
            }

            // Biểu đồ sản lượng và chất lượng của kho bưu cục
            if (response.data.data.type === 'buu_cuc') {
              // Biểu đồ lấy
              this.san_luong_lay = response.data.data.p.input_quantity_p
              this.san_luong_lay_thanh_cong = response.data.data.p.input_exactly_quantity_p
              this.ti_le_lay_thanh_cong = response.data.data.p.input_ratio_quantity_p

              // Biểu đồ giao
              this.xAxis = response.data.data.d.x_axis
              this.san_luong_giao = response.data.data.d.input_quantity_d
              this.san_luong_giao_thanh_cong = response.data.data.d.input_exactly_quantity_d
              this.ti_le_giao_thanh_cong = response.data.data.d.input_ratio_quantity_d

              // Biểu đồ trả
              this.san_luong_tra = response.data.data.tr.input_quantity_tr
              this.san_luong_tra_thanh_cong = response.data.data.tr.input_exactly_quantity_tr
              this.ti_le_tra_thanh_cong = response.data.data.tr.input_ratio_quantity_tr
              this.changeTypeChar('lay')
              if (response.data.message !== 'success') {
                commonHelper.showMessage(response.data.message, 'warning')
              }
            }
          } else {
            commonHelper.showMessage('Bạn không có quyền truy cập', 'error')
          }
        }
      }).catch((e) => {
        commonHelper.showMessage('Bạn không có quyền lấy dữ liệu', 'warning')
      }).then(() => {
      })
    }
  },
  created () {
    this.getDataCharBarLine()
  }
}
</script>

<style src="@/vendor/libs/c3/c3.scss" lang="scss"></style>
<!--<style src="@/asset/libs/c3/c3.scss" lang="scss"></style>-->
<style src="@/assets/sass/components/OverviewProfile.scss" lang="scss"></style>

<style scoped>
.tab-choose {
  color: #00904A;
}
@media only screen and (min-width: 992px) {
  .delivery-pick-chart {
    min-width: 950px;
  }
  .delivery-pick-container {
    width: 950px;
  }
}
@media only screen and (min-width: 1200px) {
  .delivery-pick-chart {
    min-width: 1100px;
  }
  .delivery-pick-container {
    width: 1100px;
  }
}
@media only screen and (min-width: 1400px) {
  .delivery-pick-chart {
    min-width: 1300px;
  }
  .delivery-pick-container {
    width: 1300px;
  }
}

@media only screen and (min-width: 1600px) {
  .delivery-pick-chart {
    min-width: 1350px;
  }
  .delivery-pick-container {
    width: 1350px;
  }
}
.active {
  color: #00904A;
}
</style>
