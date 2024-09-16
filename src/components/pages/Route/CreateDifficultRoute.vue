<template>
  <div>
    <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
      <div class="d-inline" v-if="this.dataRoute.id">Sửa lộ trình khó</div>
      <div class="d-inline" v-else>Thêm lộ trình khó</div>
      <b-btn variant="success" @click="toggleEdit" class="float-right" style="marginTop: -10px">
        Quản lý lộ trình khó
      </b-btn>
    </h4>

    <!------------------------------------------------Thêm lộ trình khó-------------------------------------------------------------->
    <b-card no-body class="mb-1" style="border: 2px #b2b2b2 solid; borderRadius: 10px">
      <b-card-header>
        <b-row>
          <b-col>
            <b-form-group>
              <b-row>
                <b-col md="1" class="pl-0">
                  <label class="font-weight-bold" for="input-name">Tên lộ trình<i style="color:red">(*)</i></label>
                </b-col>
                <b-col md="11">
                 <b-form-input  class="float-fight"  id="input-name" placeholder="Nhập tên lộ trình" v-model="dataRoute.name" ></b-form-input>
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
                  <label class="font-weight-bold" for="input-level">Level<i style="color:red">(*)</i></label>
                </b-col>
                <b-col md="11">
                  <b-form-select id="input-level" :options="levels" v-model="dataRoute.level">
                  </b-form-select>
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
                  <label class="font-weight-bold" for="input-type">Loại tuyến<i style="color:red">(*)</i></label>
                </b-col>
                <b-col md="11">
                  <b-form-select id="input-type" :options="types" v-model="dataRoute.type">
                  </b-form-select>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body style="minHeight: 500px">
        <div>
          <b-row v-for="(item, index) in dataRoute.listDistrict" :key="index">
            <b-col>
              <b-form-group>
                <b-row>
                  <b-col md="1" class="pl-0">
                    <label class="font-weight-bold">Quận/Huyện<i style="color:red">(*)</i></label>
                  </b-col>
                  <b-col md="11">
                    <b-row>
                      <b-col md="4">
                        <multiselect
                          :options="provinces ? provinces : []"
                          v-model="item.prov"
                          @input="getDistrictFromProvince(item.prov ? item.prov.value : null, item)"
                          label="text"
                          track-by="text"
                        ></multiselect>
                      </b-col>
                      <b-col md="4">
                        <multiselect
                          :options="item.prov && districts[item.prov.value] ? districts[item.prov.value] : []"
                          v-model="item.dist"
                          @input="getStreetFromDistrict(item.dist ? item.dist.value : null, item)"
                          label="text"
                          track-by="text"
                        ></multiselect>
                      </b-col>
                      <b-col md="3">
                        <multiselect
                          :options="item.dist && streets[item.dist.value] ? streets[item.dist.value] : []"
                          v-model="item.street"
                          label="text"
                          track-by="text"
                        ></multiselect>
                      </b-col>
                      <b-col md="1">
                        <ladda-btn class="btn btn-secondary float-right" @click.native="removeDistrict(index)">Xóa</ladda-btn>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
          </b-row>
          <ladda-btn class="btn btn-secondary float-left" @click.native="addDistrict">
            <i class="fa fa-plus"></i> Thêm quận/huyện/đường
          </ladda-btn><br/><br/><br/>
          <i class="row w-100" style="color:red">(Config lộ trình khó với đường thì chỉ chọn 1 đường)</i>
        </div>
      </b-card-body>
      <b-card-footer style="borderTop: none">
        <ladda-btn class="btn btn-secondary float-right" @click.native="handlerLoTrinhKho" :loading="loadingCreateBtn">
          {{this.dataRoute.id ? 'Sửa' : 'Thêm mới'}}
        </ladda-btn>
      </b-card-footer>
    </b-card>
  </div>
</template>
<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Multiselect from 'vue-multiselect'
import routeService from 'domain/services/route-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'create-difficult-route',

  metaInfo: {
    title: 'Thêm lộ trình khó'
  },

  props: {
    searchLoTrinhKho: Function,
    clearFormSearch: Function,
    toggleEdit: Function,
    tmpRouteData: Object
  },

  components: {
    LaddaBtn,
    routeService,
    commonHelper,
    Multiselect
  },

  data: () => ({
    loadingCreateBtn: false,
    defaultRoute: {
      name: '',
      type: null,
      level: null,
      listDistrict: [
        {
          prov: { value: null, text: 'Chọn tỉnh' },
          dist: { value: null, text: 'Chọn quận/huyện' },
          street: { value: null, text: 'Chọn đường' }
        }
      ]
    },
    provinces: [
      { value: null, text: 'Chọn tỉnh' }
    ],
    districts: {
      null: [{ value: null, text: 'Chọn quận/huyện' }]
    },
    streets: {
      null: [{ value: null, text: 'Chọn đường' }]
    },
    levels: [
      { value: null, text: 'Chọn Level 1/Level 2' },
      { value: 1, text: 'Level 1' },
      { value: 2, text: 'Level 2' }
    ],
    types: [
      { value: null, text: 'Chọn loại tuyến' },
      { value: 1, text: 'KPI tài xế' },
      { value: 2, text: 'Định mức dầu' },
      { value: 3, text: 'Cả hai loại' }
    ],
    dataRoute: null
  }),

  created () {
    this.getAllProvinces()
    if (this.tmpRouteData) {
      let tmpArrProvince = []
      let tmpArrDistrict = []
      let listDist = []
      this.tmpRouteData.list_dist.forEach(element => {
        listDist.push({
          id_dist: element.id_dist,
          prov: {value: element.province, text: element.province_name},
          dist: {value: element.district, text: element.district_name},
          street: {value: element.street ? element.street : null, text: element.street_name ? element.street_name : 'Chọn đường'}
        })
        if (!tmpArrProvince.includes(element.province)) {
          tmpArrProvince.push(element.province)
          this.getDistrictFromProvince(element.province)
        }
        if (!tmpArrDistrict.includes(element.district)) {
          tmpArrDistrict.push(element.district)
          this.getStreetFromDistrict(element.district)
        }
      })
      this.dataRoute = {
        id: this.tmpRouteData.id,
        name: this.tmpRouteData.name,
        type: this.tmpRouteData.type,
        listDistrict: listDist,
        level: this.tmpRouteData.level
      }
    } else {
      this.dataRoute = JSON.parse(JSON.stringify(this.defaultRoute))
    }
  },

  methods: {
    getAllProvinces: function () {
      let provinceDefault = [
        { value: null, text: 'Chọn tỉnh' }
      ]
      let dataSend = {
        region: 'all'
      }
      routeService.getProvinceFromRegion(dataSend).then(res => {
        if (res.data.success) {
          let listProvince = []
          for (let key in res.data.data) {
            let dataProvince = {
              value: key,
              text: res.data.data[key]
            }
            listProvince.push(dataProvince)
          }
          this.provinces = provinceDefault.concat(listProvince)
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách tỉnh!', 'warning')
        console.log(err)
      })
    },
    getDistrictFromProvince: function (id, item = null) {
      if (item && item.dist) {
        item.dist.value = null
        item.dist.text = 'Chọn quận/huyện'
      }
      if (this.districts[id]) return
      let districtDefault = [
        { value: null, text: 'Chọn quận/huyện' }
      ]
      let dataSend = {
        province_id: id
      }
      routeService.getDistrictFromProvince(dataSend).then(res => {
        if (res.data.success) {
          let listDistrict = []
          for (let key in res.data.data) {
            let dataProvince = {
              value: key,
              text: res.data.data[key]
            }
            listDistrict.push(dataProvince)
          }
          let tmp = JSON.parse(JSON.stringify(this.districts))
          tmp[id] = districtDefault.concat(listDistrict)
          this.districts = tmp
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách quận/huyện!', 'warning')
        console.log(err)
      })
    },
    getStreetFromDistrict: function (id, item = null) {
      if (item && item.street) {
        item.street.value = null
        item.street.text = 'Chọn đường'
      }
      if (this.streets[id]) return
      let streetDefault = [
        { value: null, text: 'Chọn đường' }
      ]
      let dataSend = {
        district_id: id
      }
      routeService.getStreetFromDistrict(dataSend).then(res => {
        if (res.data.success) {
          let listStreet = []
          for (let key in res.data.data) {
            let dataStreet = {
              value: key,
              text: res.data.data[key]
            }
            listStreet.push(dataStreet)
          }
          let tmp = JSON.parse(JSON.stringify(this.streets))
          tmp[id] = streetDefault.concat(listStreet)
          this.streets = tmp
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách quận/huyện!', 'warning')
        console.log(err)
      })
    },
    handlerLoTrinhKho: function () {
      if (this.dataRoute.id) {
        this.apiUpdateLotrinhKho()
      } else {
        this.apiCreateLotrinhKho()
      }
    },
    apiCreateLotrinhKho: function () {
      let countSuccess = 0
      this.dataRoute.listDistrict.forEach(element => {
        if (element.prov && element.prov.value && element.dist && element.dist.value) {
          countSuccess++
        }
      })
      if (this.dataRoute.name === '' || this.dataRoute.type === null || this.dataRoute.level === null || countSuccess < 1) {
        return commonHelper.showMessage('Vui lòng điền đủ thông tin cần thiết!', 'warning')
      }

      let letDist = []
      let data = this.dataRoute.listDistrict
      for (let i = data.length - 1; i >= 0; i--) {
        if (!data[i].prov.value || !data[i].dist.value) {
          data.splice(i, 1)
        } else {
          letDist.push({
            province: data[i].prov.value,
            district: data[i].dist.value,
            street: data[i].street.value
          })
        }
      }

      this.loadingCreateBtn = true
      let dataSend = {
        nameRoute: this.dataRoute.name,
        type: this.dataRoute.type,
        listDistrict: letDist.reverse(),
        level: this.dataRoute.level
      }
      routeService.apiCreateLotrinhKho(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.toggleEdit()
          this.clearFormSearch()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình tạo lộ trình!', 'warning')
        console.log(err)
      }).then(() => {
        this.loadingCreateBtn = false
      })
    },
    apiUpdateLotrinhKho: function () {
      let countSuccess = 0
      this.dataRoute.listDistrict.forEach(element => {
        if (element.prov && element.prov.value && element.dist && element.dist.value) {
          countSuccess++
        }
      })
      if (this.dataRoute.name === '' || this.dataRoute.type === null || this.dataRoute.level === null || countSuccess < 1) {
        return commonHelper.showMessage('Vui lòng điền đủ thông tin cần thiết!', 'warning')
      }

      let letDist = []
      let data = this.dataRoute.listDistrict
      for (let i = data.length - 1; i >= 0; i--) {
        if (!data[i].prov.value || !data[i].dist.value) {
          data.splice(i, 1)
        } else {
          letDist.push({
            id_dist: data[i].id_dist ? data[i].id_dist : null,
            province: data[i].prov.value,
            district: data[i].dist.value,
            street: data[i].street.value
          })
        }
      }
      this.loadingCreateBtn = true
      let dataSend = {
        id: this.dataRoute.id,
        nameRoute: this.dataRoute.name,
        type: this.dataRoute.type,
        listDistrict: letDist.reverse(),
        level: this.dataRoute.level
      }
      routeService.apiUpdateLotrinhKho(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.toggleEdit()
          this.clearFormSearch()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình update lộ trình!', 'warning')
        console.log(err)
      }).then(() => {
        this.loadingCreateBtn = false
      })
    },
    addDistrict: function () {
      this.dataRoute.listDistrict.push(
        {
          prov: { value: null, text: 'Chọn tỉnh' },
          dist: { value: null, text: 'Chọn quận/huyện' },
          street: { value: null, text: 'Chọn đường' }
        }
      )
    },
    removeDistrict: function (index) {
      if (this.dataRoute.listDistrict.length < 2) {
        return commonHelper.showMessage('Số lượng huyện trong lộ trình ít nhất là 1', 'warning')
      }
      this.dataRoute.listDistrict.splice(index, 1)
    }
  }
}
</script>
<style scoped>
  .ladda-button >>> .ladda-label {
    z-index: 0 !important;
  }
</style>
