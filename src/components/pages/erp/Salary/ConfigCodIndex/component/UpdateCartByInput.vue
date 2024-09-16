<template>
  <b-modal id="update-config-cart" modal-class="modal-md" hide-footer @close="close()">
    <template v-slot:modal-title>
      <h3 class="text-success"><i class="fa fa-motorcycle"></i> {{modelPopUpName}}</h3>
    </template>
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <multi-select-province
              @handleProvinceSelected="handleProvinceSelected"
              :display-all="true"
              :limit-prop=99999 :auto-close="false"
              :province-ids="provinceUpdate"
              :hideSelected="true"
              :multiSelect="false"
              :autoClose="true"
            >
            </multi-select-province>
          </b-col>
          <b-col>
            <multi-select-station
              class="multiselect-success"
              @handleStationSelected="handleStationSelected"
              :display-all="true"
              :province-ids="provinceId"
              :station-ids="stationDisplay"
              :limit-prop=99999 :auto-close="false"
              :hideSelected="true"
              :autoClose="true"
            >
            </multi-select-station>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <multiselect
          class="multiselect-success"
          v-model="listCart"
          :options="listCartOptions"
          :multiple="true"
          placeholder="Chọn cart"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="Nhấn để bỏ chọn"
          selectLabel="Nhấn enter để chọn"
          :close-on-select="false"
          :hide-selected="true"
        >
        </multiselect>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-input :placeholder="titleCreate" v-model="salary" type="number"></b-input>
      </b-col>
      <b-col>
        <b-row>
          <b-col>
            <datepicker
              v-model="fromDate"
              :format="customFormatter"
              class="from-date"
              :bootstrapStyling="true"
              placeholder="Từ ngày"
            ></datepicker>
          </b-col>
          <b-col>
            <datepicker
              v-model="toDate"
              :format="customFormatter"
              class="from-date"
              :bootstrapStyling="true"
              placeholder="Đến ngày"
            ></datepicker>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col class="d-flex justify-content-end">
        <b-btn variant="outline-secondary" @click="close()">Hủy bỏ</b-btn>
        <b-btn class="ml-3" variant="outline-success" :disabled="isProcessing" @click="createConfig()">Cập nhật <i v-if="isProcessing" class="fa fa-spinner fa-spin"></i></b-btn>
      </b-col>
    </b-row>
  </b-modal>
</template>
<style scoped>
</style>
<script>
import MultiSelectProvince from 'components/pages/erp/Salary/TransitComponent/MultiSelectProvince'
import MultiSelectStation from '../../ConfigCheckinComponent/MultiSelectStation'
import IndexCod from 'domain/services/index-cod'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'update-config-cart',
  components: {
    MultiSelectProvince,
    MultiSelectStation,
    Multiselect,
    Datepicker
  },
  props: {
    dataUpdate: {},
    typeIndex: {},
    titleCreate: {},
    modelPopUpName: {}
  },
  data: () => ({
    stopFindByStation: true,
    provinceUpdate: null,
    provinceId: null,
    stationIds: '',
    stationDisplay: '',
    listCartOptions: [],
    listCart: [],
    salary: '',
    fromDate: null,
    toDate: null,
    isProcessing: false
  }),
  watch: {
    provinceId (newVal, oldVal) {
      this.getListCartByProvinceStation(newVal)
    },
    dataUpdate (newVal, oldVal) {
      this.stopFindByStation = true
      this.provinceUpdate = newVal.provinces[0].id
      this.getListCartByProvinceStation(this.provinceUpdate)
      this.listCart = newVal.carts
      this.salary = newVal.index_number
      this.fromDate = newVal.from_date
      this.toDate = newVal.to_date
      this.stationDisplay = newVal.stations.map(e => e.id).toString()
    },
    stationIds (newVal, oldVal) {
      if (this.stopFindByStation === true) {
        this.stopFindByStation = false
        return
      }
      this.getListCartByProvinceStation(this.provinceId)
    }
  },
  methods: {
    handleStationSelected (option) {
      this.stationIds = option ? option.map(e => e.id).toString() : null
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    close () {
      this.$bvModal.hide('update-config-cart')
    },
    handleProvinceSelected (option) {
      this.provinceId = option.id || null
    },
    getListCartByProvinceStation (provinceId) {
      this.listCart = []
      IndexCod.getListCartByProvince({province_id: provinceId, station_id: this.stationIds}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.listCartOptions = res.data.data
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra'))
    },
    resetForm () {
      this.listCartOptions = []
      this.listCart = []
      this.fromDate = null
      this.toDate = null
      this.salary = ''
    },
    createConfig () {
      this.isProcessing = true
      let dataSend = {
        province_id: this.provinceId ? this.provinceId : this.provinceUpdate,
        list_cart: this.listCart,
        index_number: this.salary,
        from_date: this.customFormatter(this.fromDate),
        to_date: this.customFormatter(this.toDate),
        type_index: this.typeIndex,
        is_update: 1,
        group_id: this.dataUpdate.group_id
      }
      IndexCod.createConfig(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.$emit('getConfig')
          return this.close()
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại')).finally(() => {
        this.isProcessing = false
      })
    }
  }
}
</script>
