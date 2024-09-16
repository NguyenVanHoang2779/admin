<template>
  <div>
    <b-row>
      <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
        <div class="d-inline" v-if="dataRoute && dataRoute.id">Sửa Config tỉnh cho cước liên miền</div>
        <div class="d-inline" v-else>Thêm config tỉnh cho cước liên miền</div><br />
        <b-btn variant="success" @click="toggleEdit" class="float-right" style="margin-left: 10px">
          Danh sách
        </b-btn>
        <b-select class="d-inline-block w-auto float-right" size="md" v-model="typeSelectCal" :options="typeCalOptions" style="font-size: 14px"></b-select>
      </h4>

      <!------------------------------------------------Thêm Config tỉnh của cước liên miền-------------------------------------------------------------->
      <b-card no-body class="mb-1 w-100 " style="border: 2px #b2b2b2 solid; borderRadius: 10px">
      <b-card-header>
        <form action="" autocomplete="off">
          <b-row>
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-name">Tên tuyến<i style="color:red">(*)</i></label>
                  </b-col>
                  <b-col md="11">
                   <b-form-input  class="float-fight"  id="input-name" placeholder="Nhập tên tuyến" v-model="dataRoute.name" ></b-form-input>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-from">
                      Ngày bắt đầu
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                    <datepicker
                      id="input-from"
                      v-model="dataRoute.dateFrom"
                      format="dd-MM-yyyy"
                      :bootstrapStyling="true"
                      :monday-first="true"
                      :full-month-name="true"
                      :calendar-button="true"
                      calendar-button-icon="ion ion-md-calendar"
                      :clear-button="true"
                    />
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-to">
                      Ngày kết thúc
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                    <datepicker
                      id="input-to"
                      v-model="dataRoute.dateTo"
                      format="dd-MM-yyyy"
                      :bootstrapStyling="true"
                      :monday-first="true"
                      :full-month-name="true"
                      :calendar-button="true"
                      calendar-button-icon="ion ion-md-calendar"
                      :clear-button="true"
                    />
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
                <b-form-group>
                  <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-company">
                      Công ty
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                    <multiselect class="multiselect-success"
                                 v-model="dataRoute.companies"
                                 :options="companies"
                                 placeholder="Chọn Công ty"
                                 selectedLabel="Đã chọn"
                                 deselectLabel="Bỏ chọn"
                                 selectLabel="Chọn"
                                 track-by="value"
                                 label="text"
                                 :searchable="true"
                                 :multiple="false"
                                 :hide-selected="true"
                                 :allow-empty="false"
                                 :clearOption="true"
                    >
                    </multiselect>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-rent-truck">
                      Cước chưa VAT
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                    <b-form-input
                      id="input-rent-truck"
                      type="number"
                      placeholder="0"
                      v-model="dataRoute.price_without_vat"
                    ></b-form-input>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="typeSelectCal === 1">
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-weight" style="font-size: 13px;">
                      Trọng tải tính cước
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                      <multiselect
                        id="input-weight"
                        :options="weights"
                        v-model="dataRoute.weight"
                        label="text"
                        track-by="text"
                        :allow-empty="false"
                      ></multiselect>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="typeSelectCal === 2">
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-from-trunk-volume" style="font-size: 13px;">
                      Từ thể tích(m3)
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                    <b-form-input
                      id="input-from-trunk-volume"
                      type="number"
                      placeholder="0"
                      v-model="dataRoute.from_trunk_volume"
                    ></b-form-input>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="typeSelectCal === 2">
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold" for="input-to-trunk-volume" style="font-size: 13px;">
                      Tới thể tích(m3)
                      <i style="color:red">(*)</i>
                    </label>
                  </b-col>
                  <b-col md="11">
                    <b-form-input
                      id="input-to-trunk-volume"
                      type="number"
                      placeholder="0"
                      v-model="dataRoute.to_trunk_volume"
                    ></b-form-input>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
          <b-col>
            <b-form-group>
              <b-row>
                <b-col md="1" class="pl-0">
                  <label class="font-weight-bold" for="input-tax-rate">
                    Thuế VAT(%)
                    <i style="color:red">(*)</i>
                  </label>
                </b-col>
                <b-col md="11">
                  <b-form-input
                    id="input-tax-rate"
                    type="number"
                    placeholder="0"
                    v-model="dataRoute.tax_rate"
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
        </form>
      </b-card-header>
      <b-card-body style="minHeight: 500px">
        <div>
          <b-row v-for="(item, index) in dataRoute.listProvince" :key="index">
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold">Tỉnh<i style="color:red">(*)</i></label>
                  </b-col>
                  <b-col md="11">
                    <b-row>
                      <b-col md="11">
                        <multiselect
                          :options="provinces"
                          v-model="item.prov"
                          label="text"
                          track-by="text"
                        ></multiselect>
                      </b-col>
                      <b-col md="1">
                        <ladda-btn class="btn btn-secondary float-right" @click.native="removeProvince(index)">Xóa</ladda-btn>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <ladda-btn class="btn btn-secondary float-left" @click.native="addProvince">
            <i class="fa fa-plus"></i> Thêm tỉnh
          </ladda-btn>
        </div>
      </b-card-body>
      <b-card-footer style="borderTop: none">
        <ladda-btn class="btn btn-secondary float-right" @click.native="handlerConfProvinceRenTruck" :loading="loadingCreateBtn">
          {{this.dataRoute.id ? 'Sửa' : 'Thêm mới'}}
        </ladda-btn>
      </b-card-footer>
    </b-card>
    </b-row>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Multiselect from 'vue-multiselect'
import routeService from 'domain/services/route-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

const TYPE_CAL_OPTIONS = [
  { value: 1, text: 'Trọng tải' },
  { value: 2, text: 'Thể tích thùng xe' }
]

export default {
  name: 'create-prov-rent-truck',

  metaInfo: {
    title: 'Thêm config tỉnh cước liên miền'
  },

  props: {
    clearFormSearch: Function,
    toggleEdit: Function,
    tmpRouteData: Object
  },

  components: {
    LaddaBtn,
    routeService,
    commonHelper,
    Multiselect,
    Datepicker
  },

  data: () => ({
    loadingCreateBtn: false,
    dataRoute: null,
    defaultRoute: {
      name: '',
      price_without_vat: null,
      weight: {
        text: null,
        value: 0
      },
      listProvince: [
        { prov: { value: null, text: 'Chọn tỉnh' } },
        { prov: { value: null, text: 'Chọn tỉnh' } }
      ],
      companies: {
        text: null,
        value: 0
      },
      tax_rate: 10,
      from_trunk_volume: 0,
      to_trunk_volume: 0,
      dateFrom: null,
      dateTo: null
    },
    provinces: [
      { value: null, text: 'Chọn tỉnh' }
    ],
    weights: [
      { value: 1.25, text: 1.25 },
      { value: 1.9, text: 1.9 },
      { value: 3.5, text: 3.5 },
      { value: 5, text: 5 },
      { value: 8, text: 8 },
      { value: 10, text: 10 },
      { value: 15, text: 15 },
      { value: 20, text: 20 }
    ],
    companies: [],
    typeSelectCal: 1
  }),

  created () {
    this.getListCompanies()
    this.getAllProvince()
    if (this.tmpRouteData) {
      let arrProvince = []
      if (!this.tmpRouteData.list_prov) {
        arrProvince = [
          { prov: { value: null, text: 'Chọn tỉnh' } },
          { prov: { value: null, text: 'Chọn tỉnh' } }
        ]
      } else {
        this.tmpRouteData.list_prov.forEach(element => {
          arrProvince.push({
            id_prov: element.id_prov,
            prov: {
              value: element.province,
              text: element.province_name
            }
          })
        })
      }
      this.dataRoute = {
        id: this.tmpRouteData.id,
        name: this.tmpRouteData.name,
        price_without_vat: this.tmpRouteData.price_rent_truck,
        weight: {
          text: this.tmpRouteData.weight,
          value: this.tmpRouteData.weight
        },
        company_id: this.tmpRouteData.company_id,
        companies: {
          text: this.tmpRouteData.company,
          value: this.tmpRouteData.company_id
        },
        listProvince: arrProvince,
        dateFrom: this.tmpRouteData.dateFrom,
        dateTo: this.tmpRouteData.dateTo,
        tax_rate: this.tmpRouteData.tax_rate,
        from_trunk_volume: this.tmpRouteData.from_trunk_volume,
        to_trunk_volume: this.tmpRouteData.to_trunk_volume,
        vehicle_type: this.tmpRouteData.vehicle_type
      }
      this.typeSelectCal = this.tmpRouteData.vehicle_type
      console.log(this.tmpRouteData)
    } else {
      this.dataRoute = JSON.parse(JSON.stringify(this.defaultRoute))
    }
    this.typeCalOptions = TYPE_CAL_OPTIONS
  },

  methods: {
    getListCompanies: function () {
      routeService.getListCompanies().then(res => {
        if (res.data.success) {
          this.companies = res.data.data
          // commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getAllProvince: function () {
      let provinceOptionDefault = [
        { value: null, text: 'Chọn tỉnh' }
      ]

      let dataSend = {
        region: 'all'
      }
      routeService.getProvinceFromRegion(dataSend).then(res => {
        if (res.data.success) {
          let listProvince = []
          for (let key in res.data.data) {
            let option = {
              value: key,
              text: res.data.data[key] ? res.data.data[key] : ''
            }
            listProvince.push(option)
          }
          this.provinces = provinceOptionDefault.concat(listProvince)
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách tỉnh')
      })
    },
    handlerConfProvinceRenTruck: function () {
      if (this.dataRoute.id) {
        this.apiUpdateProvRentTruck()
      } else {
        this.apiCreateProvRentTruck()
      }
    },
    apiUpdateProvRentTruck: function () {
      if (!this.checkListProvince()) {
        return
      }
      if (this.dataRoute.dateFrom === null) {
        commonHelper.showMessage('Ngày bắt đầu không được để trống!', 'warning')
        return
      }
      if (this.dataRoute.dateTo === null) {
        commonHelper.showMessage('Ngày kết thúc không được để trống!', 'warning')
        return
      }

      this.loadingCreateBtn = true

      let dateFrom = moment(this.dataRoute.dateFrom).format('YYYY-MM-DD')
      let dateTo = moment(this.dataRoute.dateTo).format('YYYY-MM-DD')

      let listProv = this.formatListProvince('update')
      let dataSend = {
        id: this.dataRoute.id,
        nameRoute: this.dataRoute.name,
        listProvince: listProv,
        price_without_vat: this.dataRoute.price_without_vat,
        weight: this.dataRoute.weight.value,
        company_id: this.dataRoute.company_id,
        from: dateFrom,
        to: dateTo,
        tax_rate: this.dataRoute.tax_rate,
        vehicle_type: this.typeSelectCal,
        from_trunk_volume: this.dataRoute.from_trunk_volume,
        to_trunk_volume: this.dataRoute.to_trunk_volume
      }
      routeService.apiUpdateProvRentTruck(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.toggleEdit()
          this.clearFormSearch()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Đã xảy ra lỗi!', 'warning')
      }).then(() => {
        this.loadingCreateBtn = false
      })
    },
    apiCreateProvRentTruck: function () {
      if (!this.checkListProvince()) {
        return
      }
      if (this.dataRoute.dateFrom === null) {
        commonHelper.showMessage('Ngày bắt đầu không được để trống!', 'warning')
        return
      }
      if (this.dataRoute.dateTo === null) {
        commonHelper.showMessage('Ngày kết thúc không được để trống!', 'warning')
        return
      }

      this.loadingCreateBtn = true

      let dateFrom = moment(this.dataRoute.dateFrom).format('YYYY-MM-DD')
      let dateTo = moment(this.dataRoute.dateTo).format('YYYY-MM-DD')

      let listProv = this.formatListProvince()
      let dataSend = {
        id: this.dataRoute.id,
        nameRoute: this.dataRoute.name,
        listProvince: listProv,
        price_without_vat: this.dataRoute.price_without_vat,
        weight: this.dataRoute.weight.value,
        company_id: this.dataRoute.companies.value,
        from: dateFrom,
        to: dateTo,
        tax_rate: this.dataRoute.tax_rate,
        vehicle_type: this.typeSelectCal,
        from_trunk_volume: this.dataRoute.from_trunk_volume,
        to_trunk_volume: this.dataRoute.to_trunk_volume
      }
      routeService.apiCreateProvRentTruck(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.toggleEdit()
          this.clearFormSearch()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Đã xảy ra lỗi!', 'warning')
      }).then(() => {
        this.loadingCreateBtn = false
      })
    },
    addProvince: function () {
      this.dataRoute.listProvince.push({
        prov: { value: null, text: 'Chọn tỉnh' }
      })
    },
    checkListProvince: function () {
      let countProvince = 0
      this.dataRoute.listProvince.forEach(element => {
        if (element.prov && element.prov.value) {
          countProvince++
        }
      })
      if (this.dataRoute.name === '' || this.dataRoute.price_without_vat === '' || this.dataRoute.price_without_vat === null || this.dataRoute.price_without_vat < 0 || countProvince < 2) {
        commonHelper.showMessage('Vui lòng điền đẩy đủ thông tin', 'warning')
        return false
      }
      return true
    },
    formatListProvince: function (mode = 'create') {
      let listProv = this.dataRoute.listProvince
      let formatProv = []
      for (let i = this.dataRoute.listProvince.length - 1; i >= 0; i--) {
        if (!listProv[i] || !listProv[i].prov.value) {
          listProv.splice(i, 1)
        } else {
          formatProv.push(listProv[i].prov.value)
        }
      }
      return formatProv.reverse()
    },
    removeProvince: function (index) {
      if (this.dataRoute.listProvince.length <= 2) {
        return commonHelper.showMessage('Số lượng tỉnh trong lộ trình không được nhỏ hơn 2!', 'warning')
      }
      this.dataRoute.listProvince.splice(index, 1)
    }
  }
}
</script>
<style scoped>
  .ladda-button >>> .ladda-label {
    z-index: 0 !important;
  }
</style>
