<template>
  <b-card-body>
    <b-row>
      <h3 class="ml-3">Config Vùng Của Coupon</h3>
    </b-row>
    <br>
    <b-row>
      <b-col>
        <multi-select-province
          @handleProvinceSelected="handleProvinceSelected"
          :display-all="true"
          :limit-prop=99999 :auto-close="false"
          :hide-selected="true"
        >
        </multi-select-province>
      </b-col>
      <b-col>
        <multi-select-station
          @handleStationSelected="handleStationSelected"
          :province-ids="provinceIds"
          :display-all="true"
          :limit-prop=99999 :auto-close="false"
          :hide-selected="true"
        >
        </multi-select-station>
      </b-col>
      <b-col>
        <b-input v-model="cartAlias" :placeholder="`Mã cart alias (Tìm nhiều cách nhau dấu phẩy)`"></b-input>
      </b-col>
      <b-col>
        <datepicker
          v-model="date"
          :format="customFormatter"
          class="from-date"
          :bootstrapStyling="true"
          placeholder="Ngày áp dụng"
        ></datepicker>
      </b-col>
      <b-col>
        <multiselect
          class="multiselect-primary"
          v-model="indexIntegration"
          :options="indexCouponRegion"
          :multiple="true"
          placeholder="Chọn vùng của coupon"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="x"
          selectLabel=""
          :close-on-select="true"
          :hide-selected="true"
        >
        </multiselect>
      </b-col>
      <b-col md="1">
        <b-btn variant="outline-info" @click="getConfig(1)" :disabled="isBusy">Tìm kiếm <i v-if="isBusy" class="fa fa-spin fa-spinner"></i></b-btn>
      </b-col>
      <b-col md="1">
        <b-btn variant="outline-info" :disabled="isBusy" @click="createConfig">Tạo config</b-btn>
      </b-col>
      <CreateConfigCartByInput :model-pop-up-name="`Tạo config Vùng Của Coupon`" :type-index="typeIndex" :is-use-input-form="1" :title-create="`Nhập vùng`" @getConfig="getConfig"/>
      <UpdateCartByInput :model-pop-up-name="`Update Config vùng Của Coupon`" :type-index="typeIndex" :title-create="`Nhập vùng`" @getConfig="getConfig" :data-update="dataUpdate"/>
    </b-row>
    <b-row class="mt-3 ml-1">
      <b-table
        sort-icon-left
        responsive
        selectable
        :select-mode="`single`"
        sticky-header
        class="card-table"
        ref="dataTable"
        :items="dataConfig"
        :fields="fieldsDataConfig"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :hover="true"
        style="text-align: center;"
        :busy="isBusy"
      >
        <template v-slot:cell(provinces)="data">
          <div class="non-blur custom-multiselect">
            <multiselect
              class="multiselect-info"
              v-model="data.item.provinces"
              :options="data.item.provinces"
              :multiple="true"
              placeholder="Chọn tỉnh"
              label="name"
              track-by="name"
              selectedLabel="Đã chọn"
              deselectLabel="Nhấn để bỏ chọn"
              selectLabel="Nhấn enter để chọn"
              :close-on-select="false"
              :hide-selected="true"
              :disabled="true"
            >
            </multiselect>
          </div>
        </template>
        <template v-slot:cell(stations)="data">
          <div class="non-blur custom-multiselect">
            <multiselect
              class="multiselect-success"
              v-model="data.item.stations"
              :options="data.item.stations"
              :multiple="true"
              placeholder="Chọn kho"
              label="name"
              track-by="name"
              selectedLabel="Đã chọn"
              deselectLabel="Nhấn để bỏ chọn"
              selectLabel="Nhấn enter để chọn"
              :close-on-select="false"
              :hide-selected="true"
              :disabled="true"
            >
            </multiselect>
          </div>
        </template>
        <template v-slot:cell(carts)="data">
          <div class="non-blur custom-multiselect">
            <multiselect
              class="multiselect-danger"
              v-model="data.item.carts"
              :options="data.item.carts"
              :multiple="true"
              placeholder="Chọn cart"
              label="name"
              track-by="name"
              selectedLabel="Đã chọn"
              deselectLabel="Nhấn để bỏ chọn"
              selectLabel="Nhấn enter để chọn"
              :close-on-select="false"
              :hide-selected="true"
              :disabled="true"
            >
            </multiselect>
          </div>
        </template>
        <template v-slot:cell(manage)="data">
          <b-button class="ml-1 mt-1 mb-1 mr-1 custom-btn" size="sm" variant="outline-success" @click="updateConfig(data.item)"><i class="fa fa-pencil-alt"></i></b-button>
          <b-button class="ml-1 mt-1 mb-1 mr-1 custom-btn" size="sm" variant="outline-danger" @click="deleteConfig(data.item)"><i class="fa fa-trash"></i></b-button>
        </template>
      </b-table>
    </b-row>
    <b-row class="d-flex justify-content-center">
      <b-pagination
        v-if="dataConfig.length > 0"
        v-model="currentPage"
        :total-rows="totalRecord"
        :per-page="perPage"
        class="mt-4"
      >
        <template v-slot:prev-text><span class="text-info">Trang trước</span></template>
        <template v-slot:next-text><span class="text-info">Trang sau</span></template>
        <template v-slot:page="{ page, active }">
          <b v-if="active">{{ page }}</b>
          <i v-else>{{ page }}</i>
        </template>
      </b-pagination>
    </b-row>
  </b-card-body>
</template>
<style scoped>
.non-blur >>> .multiselect--disabled {
  opacity: 1!important;
  pointer-events: auto;
}
.custom-btn:hover {
  transform: scale(4) rotate(720deg);
}
</style>
<script>
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from 'components/pages/erp/Salary/TransitComponent/MultiSelectProvince'
import MultiSelectStation from '../ConfigCheckinComponent/MultiSelectStation'
import IndexCod from 'domain/services/index-cod'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import CreateConfigCartByInput from './component/CreateConfigCartByInput'
import UpdateCartByInput from './component/UpdateCartByInput'

export default {
  name: 'config-coupon-region',
  components: {
    MultiSelectProvince,
    MultiSelectStation,
    Multiselect,
    Datepicker,
    CreateConfigCartByInput,
    UpdateCartByInput
  },
  data: () => ({
    typeIndex: 'coupon_region',
    optionCouponRegion: [
      {id: 1, name: 'Vùng 1'},
      {id: 2, name: 'Vùng 2'},
      {id: 3, name: 'Vùng 3'},
      {id: 4, name: 'Vùng 4'},
      {id: 5, name: 'Vùng 5'}
    ],
    dataUpdate: null,
    provinceIds: null,
    stationIds: null,
    cartAlias: '',
    date: null,
    indexCouponRegion: [
      {id: 1, name: 'Vùng 1'},
      {id: 2, name: 'Vùng 2'},
      {id: 3, name: 'Vùng 3'}
    ],
    indexIntegration: [],
    dataConfig: [],
    fieldsDataConfig: [
      {key: 'group_id', label: 'Id group', sortable: true},
      {key: 'provinces', label: 'Tỉnh', sortable: true},
      {key: 'stations', label: 'Kho', sortable: true},
      {key: 'carts', label: 'Tuyến', sortable: true},
      {key: 'index_number', label: 'Vùng của coupon', sortable: true},
      {key: 'from_date', label: 'Từ ngày', sortable: true},
      {key: 'to_date', label: 'Đến ngày', sortable: true},
      {key: 'created', label: 'Tạo lúc', sortable: true},
      {key: 'modified', label: 'Sửa lúc', sortable: true},
      {key: 'manage', label: 'Quản lý'}
    ],
    isBusy: false,
    currentPage: 1,
    totalRecord: 0,
    perPage: 5
  }),
  watch: {
    provinceIds (newVal, oldVal) {
    },
    currentPage (newVal, oldVal) {
      this.getConfig()
    }
  },
  created () {
    this.getConfig()
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    handleProvinceSelected (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : null
    },
    handleStationSelected (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : null
    },
    createConfig () {
      this.$bvModal.show('create-config-cart')
    },
    updateConfig (data) {
      this.dataUpdate = data
      this.$bvModal.show('update-config-cart')
    },
    getConfig (option) {
      if (option === 1) this.currentPage = 1
      this.dataConfig = []
      this.totalRecord = 0
      this.isBusy = true
      let dataSend = {
        'province_id': this.provinceIds,
        'station_id': this.stationIds,
        'cart_alias': this.cartAlias,
        'date': this.customFormatter(this.date),
        'type_index': this.typeIndex,
        'num_index': this.indexIntegration ? this.indexIntegration.map((item) => item.id).toString() : null,
        'per_page': this.perPage,
        'page': this.currentPage
      }
      IndexCod.getConfig(dataSend).then(res => {
        if (res.data.success) {
          this.dataConfig = res.data.data
          this.totalRecord = res.data.option
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau')
      }).finally(() => {
        this.isBusy = false
      })
    },
    deleteConfig (data) {
      if (!confirm(`Bạn có chắc chắn muốn xóa?`)) {
        return
      }
      let dataSend = {
        id: data.carts ? data.carts.map((item) => item.id_record).toString() : null
      }
      IndexCod.deleteConfig(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getConfig()
        } else {
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau')
      })
    }
  }
}
</script>
