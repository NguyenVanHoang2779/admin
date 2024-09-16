<template>
  <div>
    <b-row>
      <b-col md="6">
        <h4 class="ui-block-heading">Quản lý gửi xe tại kho</h4>
      </b-col>
    </b-row>
    <hr>
    <b-row class="pb-2">
      <b-col md="2" class="mb-1">
        <label class="form-label">Gửi từ:</label>
        <datepicker
          v-model="filter.park_from"
          format="dd-MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :value="new Date(filter.park_from)"
          :full-month-name="true"
          placeholder="Chọn thời gian"
          :required="true" editTransactionId
          calendar-button-icon="ion ion-md-calendar"
        />
      </b-col>
      <b-col md="2" class="mb-1">
        <label class="form-label">Đến ngày:</label>
        <datepicker
          v-model="filter.park_to"
          format="dd-MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :value="new Date(filter.park_to)"
          :full-month-name="true"
          placeholder="Chọn thời gian"
          :required="true" editTransactionId
          calendar-button-icon="ion ion-md-calendar"
        />
      </b-col>
<!--      <b-col md="2">-->
<!--        <label class="form-label">Chọn tỉnh</label>-->
<!--        <multi-select-province :province-id="filter.province_id" :limit-prop=9999-->
<!--                               @handleProvinceSelected="setProvince"></multi-select-province>-->
<!--      </b-col>-->
      <b-col md="2">
        <label class="form-label">Chọn kho:</label>
        <single-select-station :stationId="filter.station_id" @handleSelectedStation="handleSelectedStation"></single-select-station>
      </b-col>
      <b-col md="4" offset-md="2" class="text-right">
        <b-btn variant="primary" @click="getParkingOrder()"><i class="fas fa-search"></i> Tìm kiếm</b-btn>
        <b-btn variant="primary" @click="downloadData"><i class="fa fa-file-excel mr-2"/> Xuất dữ liệu</b-btn>
        <b-btn variant="secondary" @click="resetSearch()"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>
        <!--      <b-btn v-if="exporting" variant="success" class="exporting-btn">-->
        <!--        <span>-->
        <!--          <div class="sk-folding-cube sk-primary">-->
        <!--            <div class="sk-cube1 sk-cube"></div>-->
        <!--            <div class="sk-cube2 sk-cube"></div>-->
        <!--            <div class="sk-cube4 sk-cube"></div>-->
        <!--            <div class="sk-cube3 sk-cube"></div>-->
        <!--          </div>-->
        <!--          Đang xuất...</span>-->
        <!--      </b-btn>-->
      </b-col>
    </b-row>
    <!-- table -->
    <b-card no-body v-loading="loading">
      <div class="paging">
        <b-row v-if="page.total" class="mt-1">
          <b-col md="6" class="page-input">
            <b-pagination
              v-model="page.current"
              :total-rows="page.total"
              :per-page="page.per"
              @input="getParkingOrder()"
              class="mb-1"
              size="sm"
              align="left"
            />
            <b-col md="6" class="text-right page-status align-middle text-muted">
              <b>Trang {{ page.current }}/{{ Math.ceil(page.total / page.per) }}</b>
            </b-col>
          </b-col>
        </b-row>
      </div>

      <section class="border">
        <div class="text-size fixed-thead" v-loading="loading">
          <table class="table table-bordered table-hover m-0">
            <thead>
            <tr>
              <th class="text-center">STT</th>
              <th class="text-center">Họ tên</th>
              <th class="text-center">Vị trí</th>
              <th class="text-center">Kho</th>
              <th class="text-center">Biển số xe</th>
              <th class="text-center">Loại xe</th>
              <th class="text-center">Màu xe</th>
              <th class="text-center">Lý do</th>
              <th class="text-center">Thời gian</th>
            </tr>
            </thead>
            <template v-for="(order, idx) in parkingOrder">

              <tr :key="idx" class="pay-label">
                <td class="text-center">{{ (page.current - 1) * page.per + idx + 1 }}</td>
                <td class="text-center">{{ order.fullname }}</td>
                <td class="text-center">{{ order.position_name }}</td>
                <td class="text-center">{{ order.station_name }}</td>
                <td class="text-center">{{ order.vehicle_code }}</td>
                <td class="text-center">{{ order.vehicle_type }}</td>
                <td class="text-center">{{ order.vehicle_color }}</td>
                <td class="text-center">{{ order.note }}</td>
                <td class="text-center">{{ order.park_from | dateFormater }} - {{ order.park_to | dateFormater }}</td>
              </tr>
              <tr v-show="!parkingOrder || parkingOrder.length === 0">
                <td class="text-center align-middle no-result" colspan="100"><b>Rất tiếc, Không có bản ghi nào !</b>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </section>
    </b-card>
  </div>
</template>

<script>
import parkingManegeService from 'domain/services/parking-manage-service'

import commonHelper from 'infrastructures/helpers/common-helpers'

import Datepicker from 'vuejs-datepicker'
// import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import moment from 'moment'
export default {
  name: 'parking-management',

  components: {
    // MultiSelectProvince,
    SingleSelectStation,
    Datepicker
  },

  data: () => ({
    filter: {
      station_id: null,
      // province_id: null,
      park_from: null,
      park_to: null,
      get_excel: 0
    },
    loading: true,
    page: {
      current: 1,
      per: 10,
      total: 0
    },
    parkingOrder: null
  }),

  filters: {
    dateFormater: function (value) {
      if (!value) return ''
      return moment(value).format('DD/MM/YYYY')
    }
  },

  created () {
    this.filter.park_from = new Date()
    this.filter.park_to = new Date()
    // this.filter.park_to = moment().format('DD-MM-YYYY')
    this.getParkingOrder()
  },

  computed: {
    // provinceIds: function () {
    //   return this.filter.province_id ? this.filter.province_id.join(',') : ''
    // }
  },

  methods: {
    downloadData () {
      this.filter.get_excel = 1
      this.getParkingOrder()
    },

    resetSearch () {
      this.page.current = 1
      for (const field in this.filter) {
        this.filter[field] = null
      }
      this.filter.station_id = null
      this.getParkingOrder()
    },

    // setProvince (provinces) {
    //   if (!provinces) this.filter.province_id = null
    //   else this.filter.province_id = provinces.map(item => item.id)
    // },
    handleSelectedStation: function (option) {
      this.filter.station_id = option ? option.id : ''
    },
    openLink (link) {
      window.open(link, '_blank')
    },

    getParkingOrder () {
      this.loading = true
      let params = {
        ...this.filter,
        page: this.page.current,
        limit: this.page.per
      }
      if (params.park_from) params.park_from = moment(new Date(params.park_from)).format('YYYY-MM-DD')
      if (params.park_to) params.park_to = moment(new Date(params.park_to)).format('YYYY-MM-DD')
      parkingManegeService.getParkingOrderList(params)
        .then(res => {
          if (res.data.success) {
            if (this.filter.get_excel) {
              if (!res.data.excel_file) return commonHelper.showMessage('Không xuất được dữ liệu, vui lòng thử lại sau!', 'warning')
              this.openLink(res.data.excel_file)
              this.filter.get_excel = 0
              return commonHelper.showMessage('Xuất dữ liệu gửi xe qua đêm thành công', 'success')
            }

            this.parkingOrder = res.data.data
            this.page.total = parseInt(res.data.total)
            commonHelper.showMessage(res.data.message || 'Lấy dữ liệu đăng ký gửi xe thành công', 'success')
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu đăng ký gửi xe!', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.exporting-btn {
  span {
    position: relative;
    padding-left: 20px
  }

  .sk-folding-cube.sk-primary {
    position: absolute;
    height: 12px;
    width: 12px;
    top: -37px;
    left: 0
  }
}
</style>
