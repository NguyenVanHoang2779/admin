<template>
  <b-modal id="create-config-cart" modal-class="modal-md" hide-footer @close="resetForm()">
    <template v-slot:modal-title>
      <h3 class="text-success"><i class="fa fa-motorcycle"></i> {{ modelPopUpName }}</h3>
    </template>
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <multi-select-province
              @handleProvinceSelected="handleProvinceSelected"
              :display-all="true"
              :limit-prop=99999 :auto-close="false"
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
        <multiselect
          class="multiselect-primary"
          v-model="select"
          :options="options"
          :multiple="false"
          :placeholder="titleCreate"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="Nhấn để bỏ chọn"
          selectLabel="Nhấn enter để chọn"
          :close-on-select="true"
          :hide-selected="true"
        >
        </multiselect>
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
        <b-btn class="ml-3" variant="outline-success" :disabled="isProcessing" @click="createConfig()">Tạo mới <i v-if="isProcessing" class="fa fa-spinner fa-spin"></i></b-btn>
      </b-col>
    </b-row>
  </b-modal>
</template>
<style scoped>
</style>
<script>
import MultiSelectProvince from 'components/pages/erp/Salary/TransitComponent/MultiSelectProvince'
import IndexCod from 'domain/services/index-cod'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import MultiSelectStation from '../../ConfigCheckinComponent/MultiSelectStation'

export default {
  name: 'create-config-cart',
  components: {
    MultiSelectProvince,
    MultiSelectStation,
    Multiselect,
    Datepicker
  },
  props: {
    typeIndex: {},
    options: {},
    titleCreate: {},
    modelPopUpName: {}
  },
  data: () => ({
    provinceId: null,
    stationIds: '',
    listCartOptions: [],
    listCart: [],
    select: [],
    fromDate: null,
    toDate: null,
    isProcessing: false
  }),
  watch: {
    provinceId (newVal, oldVal) {
      this.getListCartByProvinceStation()
    },
    stationIds (newVal, oldVal) {
      this.getListCartByProvinceStation()
    }
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    close () {
      this.resetForm()
      this.$bvModal.hide('create-config-cart')
    },
    handleProvinceSelected (option) {
      this.provinceId = option.id || null
    },
    handleStationSelected (option) {
      this.stationIds = option ? option.map(e => e.id).toString() : null
    },
    getListCartByProvinceStation () {
      this.resetForm()
      IndexCod.getListCartByProvince({province_id: this.provinceId, station_id: this.stationIds}).then(res => {
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
      this.select = []
    },
    createConfig () {
      this.isProcessing = true
      let dataSend = {
        province_id: this.provinceId,
        list_cart: this.listCart,
        index_number: this.select.id,
        type_index: this.typeIndex,
        from_date: this.customFormatter(this.fromDate),
        to_date: this.customFormatter(this.toDate)
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
