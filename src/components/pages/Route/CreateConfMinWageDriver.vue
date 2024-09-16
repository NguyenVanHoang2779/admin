<template>
  <div>
    <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
      <div class="d-inline" v-if="dataRoute && dataRoute.id">Sửa Config lương tối thiểu cho tài xế đường dài</div>
      <div class="d-inline" v-else>Thêm Config lương tối thiểu cho tài xế đường dài</div>
      <b-btn variant="success" @click="toggleEdit" class="float-right" style="marginTop: -10px">
        Danh sách
      </b-btn>
    </h4>

    <!------------------------------------------------Thêm Config lương tối thiểu cho tài xế đường dài-------------------------------------------------------------->
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
                  <label class="font-weight-bold" for="input-salary">
                    Lương
                    <i style="color:red">(*)</i>
                  </label>
                </b-col>
                <b-col md="11">
                  <b-form-input
                    type="number"
                    placeholder="0"
                    id="input-salary"
                    v-model="dataRoute.salary"
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
                  <label class="font-weight-bold" for="input-num_ss">
                    Số chuyến yêu cầu
                    <i style="color:red">(*)</i>
                  </label>
                </b-col>
                <b-col md="11">
                  <b-form-input
                    type="number"
                    placeholder="0"
                    id="input-num_ss"
                    v-model="dataRoute.num_ss"
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
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
        <ladda-btn class="btn btn-secondary float-right" @click.native="handlerConfMinWageDriver" :loading="loadingCreateBtn">
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
  name: 'create-conf-min-wage-driver',

  metaInfo: {
    title: 'Thêm lộ trình xe đường dài'
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
    Multiselect
  },

  data: () => ({
    loadingCreateBtn: false,
    dataRoute: null,
    defaultRoute: {
      name: '',
      salary: null,
      num_ss: null,
      listProvince: [
        { prov: { value: null, text: 'Chọn tỉnh' } },
        { prov: { value: null, text: 'Chọn tỉnh' } }
      ]
    },
    provinces: [
      { value: null, text: 'Chọn tỉnh' }
    ]
  }),

  created () {
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
        salary: this.tmpRouteData.salary,
        num_ss: this.tmpRouteData.num_ss,
        listProvince: arrProvince
      }
    } else {
      this.dataRoute = JSON.parse(JSON.stringify(this.defaultRoute))
    }
  },

  methods: {
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
    handlerConfMinWageDriver: function () {
      if (this.dataRoute.id) {
        this.apiUpdateConfMinWageDriver()
      } else {
        this.apiCreateConfMinWageDriver()
      }
    },
    apiUpdateConfMinWageDriver: function () {
      if (!this.checkListProvince()) {
        return
      }
      this.loadingCreateBtn = true

      let listProv = this.formatListProvince('update')
      let dataSend = {
        id: this.dataRoute.id,
        nameRoute: this.dataRoute.name,
        listProvince: listProv,
        salary: this.dataRoute.salary,
        num_ss: this.dataRoute.num_ss
      }
      routeService.apiUpdateConfMinWageDriver(dataSend).then(res => {
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
    apiCreateConfMinWageDriver: function () {
      if (!this.checkListProvince()) {
        return
      }
      this.loadingCreateBtn = true

      let listProv = this.formatListProvince()
      let dataSend = {
        id: this.dataRoute.id,
        nameRoute: this.dataRoute.name,
        listProvince: listProv,
        salary: this.dataRoute.salary,
        num_ss: this.dataRoute.num_ss
      }
      routeService.apiCreateConfMinWageDriver(dataSend).then(res => {
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
      if (this.dataRoute.name === '' || this.dataRoute.salary === '' || this.dataRoute.salary === null || this.dataRoute.salary < 0 || countProvince < 2) {
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
          if (mode === 'update') {
            formatProv.push({
              id_prov: listProv[i].id_prov ? listProv[i].id_prov : null,
              province: listProv[i].prov.value
            })
          } else {
            formatProv.push(listProv[i].prov.value)
          }
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
