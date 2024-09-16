<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Thêm tuyến</h4>
            <router-link :to="{name: 'manage-truck-routes'}" class="btn btn-outline-secondary" style="float: right">Quay lại</router-link>
            <hr>
        </div>
        <div class="card">
            <div class="card-body">
                <b-form-row class="my-1">
                    <b-col md="2">
                        <label>Tên tuyến <span class='red-text'>(*)</span>:</label>
                    </b-col>
                    <b-col md="8">
                        <b-form-input
                                v-model="route.name"
                                placeholder="Tên tuyến"
                                id="route_name"
                                name="route_name"
                                v-validate="'required'"
                                :class="{'is-danger': errors.has('route_name')}"
                        >
                        </b-form-input>
                        <span v-show="errors.firstRule('route_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                    </b-col>
                </b-form-row>
                <b-form-row class="my-1">
                    <b-col md="2">
                        <label>Loại tuyến <span class='red-text'>(*)</span>:</label>
                    </b-col>
                    <b-col md="8">
                        <b-form-select v-model="route.type" :options="optionRouteType" name="route_type" class="mb-3" v-validate="'required'" :class="{'is-danger': errors.has('route_type')}">
                            <template v-slot:first>
                                <option :value="null" disabled>-- Chọn loại tuyến --</option>
                            </template>
                        </b-form-select>
                        <span v-show="errors.firstRule('route_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                    </b-col>
                </b-form-row>
                <b-form-row class="my-1" v-if="route.type == 'lien-tinh'">
                    <b-col md="2">
                        <label>Miền <span class='red-text'>(*)</span>:</label>
                    </b-col>
                    <b-col md="8">
                        <b-form-group>
                            <b-form-radio-group
                                    id="checkbox-region"
                                    v-model="region"
                                    :options="optionRegions"
                                    name="region"
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row class="my-1" v-if="route.type == 'noi-thanh'">
                    <b-col md="2">
                        <label>Thành phố <span class='red-text'>(*)</span>:</label>
                    </b-col>
                    <b-col md="8">
                        <b-form-group>
                            <b-form-radio-group
                                    id="checkbox-city"
                                    v-model="provinceId"
                                    :options="optionCities"
                                    name="city"
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row class="my-1" v-if="route.type == 'noi-tinh'">
                    <b-col md="2">
                        <label>Tỉnh <span class='red-text'>(*)</span>:</label>
                    </b-col>
                    <b-col md="8">
                        <single-select-province @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                    </b-col>
                </b-form-row>
            </div>
            <div class="card-body border-top">
                <div>
                    <div class="my-10">
                        <h4>Danh sách điểm dừng</h4>
                    </div>
                    <stop-route v-for="(point, index) in routePoints" :point="point" :key="index" :index="index"
                                :region="region"
                                :provinceId="provinceId"
                                @updateRoute="updateRoute($event, index)"
                                @deletePointRow="deletePointRow($event)"
                    ></stop-route>
                    <button type="button" class="btn btn-success add-appendix" @click="addPointRow">
                        +
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="text-center">
                    <button type="button" class="btn btn-success save-route" @click="updateTruckRoute">
                        <span> <i class="ion ion-ios-save" ></i> Lưu lại </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectRoute from 'components/elements/common/SingleSelectRoutePoint'
import StopRoute from './StopRoute'
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(VeeValidate)
export default {
  name: 'TruckRoute',
  components: {
    SingleSelectRoute,
    SingleSelectProfileRegion,
    SingleSelectProvince,
    StopRoute
  },
  data: () => ({
    region: '',
    provinceId: '',
    routePoints: [],
    route: {
      name: '',
      type: null
    },
    optionRegions: [
      { value: '10', text: 'Miền Bắc' },
      { value: '20', text: 'Miền Trung' },
      { value: '30', text: 'Miền Nam' }
    ],
    optionCities: [
      { value: '1', text: 'Hà nội' },
      { value: '126', text: 'Hồ Chí Minh' },
      { value: '129', text: 'Đà Nẵng' }
    ],
    optionRouteType: [
      { value: 'lien-tinh', text: 'Liên tỉnh' },
      { value: 'lien-mien', text: 'Liên miền' },
      { value: 'noi-thanh', text: 'Nội thành' },
      { value: 'noi-tinh', text: 'Nội tỉnh' }
    ],
    searchRoute: null
  }),

  created () {
    this.getDetailTruckRoute()
  },

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-truck-route'
    },

    isEdit: function () {
      return this.$route.name === 'edit-truck-route'
    }
  },

  watch: {
    route: {
      handler: function (newValue) {
        this.provinceId = ''
        this.region = ''
      },
      deep: true
    }
  },

  methods: {
    getDetailTruckRoute () {
      let params = {
        id: this.$route.params.id
      }
      CompanyProfileService.getDetailTruckRoute(params)
        .then(res => {
          if (res.data.success) {
            this.routePoints = res.data.data.points
            this.route = res.data.data.route || {
              name: '',
              type: null
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    updateTruckRoute () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let data = {
            route_name: this.route.name,
            route_type: this.route.type,
            routePoints: this.routePoints
          }
          if (this.isEdit) {
            data.route_id = this.$route.params.id
          }
          CompanyProfileService.updateTruckRoute(data)
            .then(res => {
              if (res.data.success) {
                commonHelper.showMessage(res.data.message, 'success')
                if (this.isAdd) {
                  let id = res.data.data.ErpRentTruckRoute.id
                  this.$router.push({ name: 'edit-truck-route', params: { id: id } })
                }
              } else {
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
            .catch(e => {
              console.log(e)
            })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        console.log(e)
      })
    },

    updateRoute (dataPoint, index) {
      this.routePoints[index] = dataPoint
    },

    selectedRoute (option) {
      this.searchRoute = option
    },

    addPointRow: function () {
      this.routePoints.push({
        id: null,
        name: null
      })
    },

    deletePointRow: function (index) {
      this.routePoints.splice(index, 1)
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    }
  }
}
</script>
<style lang="scss">
    .sperator-right {
        border-right: 1px solid rgba(0, 0, 0, 0.2)
    }
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
    .save-route {
        width: 500px;
        margin: 0 auto;
    }
</style>
