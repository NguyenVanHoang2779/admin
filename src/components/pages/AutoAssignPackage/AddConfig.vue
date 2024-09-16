<template>
    <div>
        <div class="ui-block">
          <div class="list-order-header col-md-6">
              <b-row style="margin-top: -1em">
                <b-col style="padding-top: 0.5em">
                  <h4 class="ui-block-heading" style="margin: 0px; display: inline-block">{{ title }}</h4>
                </b-col>
                <b-col class="text-right">
                  <b-btn variant="success" :to="'/auto-assign/list'">Danh sách khu vực</b-btn>
                </b-col>
              </b-row>
            </div>
            <div class="search-form-staff">
                <form>
                    <b-form-row>
                        <b-form-group label="Tên khu vực" class="col-md-6">
                            <b-input type="text" placeholder="Tên khu vực" v-model="name" required/>
                        </b-form-group>
                    </b-form-row>

                    <b-form-row>
                        <select-province-and-district-and-station
                          @getProvince="selected.province = $event"
                          @getDistrict="selected.district = $event"
                          @getStation="selected.station = $event"
                          @getCart="selected.cart = $event"
                          :selectedProvince="listdata.province"
                          :selectedDistrict="listdata.district"
                          :selectedStation="listdata.station"
                          :selectedCart="listdata.list_carts"
                          :type="type"
                          :area_id="$route.params.id"
                          ref="select_province_district"></select-province-and-district-and-station>
                    </b-form-row>

                    <b-form-row>
                        <div class="col-md-3">
                            <b-form-group>
                                <span slot="label">&nbsp;</span>
                                <div class="text-right center">
                                    <b-btn @click="subForm" variant="primary">Lưu khu vực</b-btn>
                                    <!-- <b-btn type="reset" @click="resetForm">Nhập lại</b-btn> -->
                                </div>
                            </b-form-group>
                        </div>
                    </b-form-row>
                </form>
            </div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import AutoAssignService from 'domain/services/auto-assign-service'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import SelectUserGroup from 'components/elements/FilterBox/SelectUserGroup'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import draggable from 'vuedraggable'
import SelectProvinceAndDistrictAndStation from 'components/elements/FilterBox/SelectProvinceAndDistrictAndStation'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'auto-assign',
  components: {
    SelectStations,
    SelectDepartmentAndPositionJob,
    SelectUserGroup,
    LoadingMiniBottom,
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    InputTag,
    draggable,
    SelectProvinceAndDistrictAndStation
  },

  props: {
    type: {
      default: null
    },
    Hrview: {
      default: null
    }
  },

  data: () => ({
    success: true,
    appLoading: false,
    selectedMonth: '',
    name: '',
    title: '',
    listdata: {
      province: {},
      district: {},
      station: {},
      list_carts: []
    },
    selected: {
      null_default: null,
      province: '',
      district: '',
      station: '',
      cart: []
    },
    value: null,
    options: ['list', 'of', 'options']

  }),
  methods: {
    subForm () {
      let dataForm = {}
      if (this.type === 'edit') {
        dataForm = {
          'id': this.$route.params.id,
          'name': this.name,
          'province_id': this.listdata.province.code,
          'district_id': this.listdata.district.code,
          'station_id': this.listdata.station.code,
          'cart_id': this.selected.cart
        }

        this.$startLoading()
        AutoAssignService.editArea(dataForm).then(response => {
          if (response.data.success) {
            console.log('thanh cong')
            window.location.replace('/adm/auto-assign/config-cart/' + response.data.data.id)
          } else {
            console.log('loi')
            commonHelper.showMessage(response.data.message, 'error')
            this.success = false
          }
        }).then(() => {
          this.$stopLoading()
        })
      } else {
        dataForm = {
          'name': this.name,
          'province_id': this.selected.province.code,
          'district_id': this.selected.district.code,
          'station_id': this.selected.station.code,
          'cart_id': this.selected.cart
        }

        this.$startLoading()
        AutoAssignService.addArea(dataForm).then(response => {
          if (response.data.success) {
            console.log('thanh cong')
            // window.location.replace('/adm/auto-assign/config-cart?id=' + response.data.data.id)
            window.location.replace('/adm/auto-assign/config-cart/' + response.data.data.id)
          } else {
            console.log('loi')
            commonHelper.showMessage(response.data.message, 'error')
            console.log(response.data.message)
            this.success = false
          }
        }).then(() => {
          this.$stopLoading()
        })
      }
    },

    getArea (id) {
      this.$startLoading()
      AutoAssignService.getArea(id).then(response => {
        if (response.data.success) {
          let rp = response.data.data
          this.name = rp.name
          this.listdata.province = rp.province
          this.listdata.district = rp.district
          this.listdata.station = rp.station
          this.listdata.list_carts = rp.cart
        } else {
          this.success = false
        }
      }).then(() => {
        this.$stopLoading()
      })
    }
  },

  created () {
    if (this.type === 'edit') {
      this.title = 'Sửa khu vực'
      if (this.$route.params.id) {
        this.getArea(this.$route.params.id)
      }
    } else {
      this.title = 'Thêm khu vực mới'
    }
  },

  computed: {

  },
  metaInfo: {
  }
}
</script>
<style scoped>
    .center {
        margin: 0 auto;
    }

    .align-content-center {
        text-align: center;
    }
</style>
