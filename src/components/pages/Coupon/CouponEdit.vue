<template>
    <div class="update-master">
        <div class="top-title">
            <h2 v-if="!isEdit">Thêm coupon</h2>
            <h2 v-else>Cập nhật coupon</h2>
            <div class="top-title__right-button">
                <!-- <b-btn v-if="this.$route.params.id" variant="btn btn-default" @click="toggleLogButtonAction"><i class="icon ion-md-list"></i> Xem lịch sử thay đổi</b-btn> -->
                <b-btn v-if="!this.$route.params.id" type="button" variant="btn btn-primary" @click="addCoupon">
                    <i class="ion ion-ios-add"></i> Thêm coupon
                </b-btn>
                <b-btn v-else type="button" variant="btn btn-info" @click="updateCoupon">
                    <i class="icon ion-md-archive"></i> Cập nhật
                </b-btn>
                <router-link :to="{name: 'coupon-manage'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
            </div>
        </div>
        <div>
            <div class="row">
                <div class="col-md-12">
                    <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                                <h6 class="card-header ttcn-header">
                                    <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttcn> Thông tin coupon</a>
                                </h6>
                                <b-collapse id="accordion-ttcn" visible>
                                  <div class="card-body">
                                      <b-form-row>
                                          <div class="col-md-10 col-lg-10 col-xl-10">
                                              <b-form-row>
                                                  <b-form-group label="Tên coupon" id="group-fullname" class="col-xl-4 col-md-6">
                                                    <b-form-input
                                                              v-model="couponName"
                                                              name="name"
                                                              v-validate="'required'"
                                                              placeholder="Tên coupon"
                                                              :class="{'is-danger': errors.has('fullname')}"
                                                      >
                                                      </b-form-input>
                                                  </b-form-group >
                                                  <b-form-group label="Thời gian áp dụng" class="col-xl-4 col-md-6">
                                                     <flat-pickr v-model="rawTime" :config="rangeConfig" placeholder="Chọn khoảng thời gian" class="mb-4"/>
                                                  </b-form-group>
                                                  <b-form-group label="Tỉ lệ thưởng (%)" class="col-xl-4 col-md-6">
                                                    <b-input type="number" v-model="bonus"></b-input>
                                                  </b-form-group>
                                              </b-form-row>
                                              <b-form-row>
                                                  <b-form-group label="Tỉnh áp dụng" id="input-group-tel" class="col-md-12">
                                                    <multi-select-province @handleProvinceSelected="handleProvinceSelected" :display-all="true" :province-ids="provinceIds" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province>
                                                  </b-form-group>
                                              </b-form-row>
                                               <b-form-row>
                                                  <b-form-group label="Kho áp dụng" id="input-group-tel" class="col-md-12">
                                                    <multi-select-station :provinceIds="provinceIds" :station-ids="stationIds" @handleStationSelected="handleStationSelected" :auto-close="false" :hide-selected="true"></multi-select-station>
                                                  </b-form-group>
                                              </b-form-row>
                                              <b-form-row class="mb-4">
                                                  <b-form-group label="Module áp dụng" id="input-group-tel" class="col-md-12">
                                                     <multi-select-module :stationIds="stationIds" @handleModuleSelected="handleModuleSelected" :module-ids="moduleIds" :auto-close="false" :hide-selected="true"></multi-select-module>
                                                  </b-form-group>
                                              </b-form-row>
                                              <b-form-row>
                                                  <b-form-group label="Bộ phận áp dụng" id="input-group-tel" class="col-md-12">
                                                     <multi-select-department @handleDepartmentSelected="handleDepartmentSelected" :department-ids="departmentIds" :auto-close="false" :hide-selected="true"></multi-select-department>
                                                  </b-form-group>
                                              </b-form-row>
                                              <b-form-row>
                                                  <b-form-group label="Vị trí áp dụng" id="input-group-tel" class="col-md-12">
                                                     <multi-select-position :department-ids="departmentIds" @handlePositionSelected="handlePositionSelected" :position-ids="positionIds" :auto-close="false" :hide-selected="true"></multi-select-position>
                                                  </b-form-group>
                                              </b-form-row>
                                          </div>
                                      </b-form-row>
                                  </div>
                                </b-collapse>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer border-0 text-center py-3">
                <b-btn v-if="this.$route.params.id == null" type="button" variant="btn btn-primary" @click="addCoupon">
                    <i class="ion ion-ios-add"></i> Thêm coupon
                </b-btn>
                <div v-else>
                    <b-btn type="button" variant="btn btn-info" @click="updateCoupon">
                        <i class="icon ion-md-archive"></i> Cập nhật
                    </b-btn>
                    <router-link :to="{name: 'coupon-manage'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
                </div>
            </div>
            <notifications group='add-emp'></notifications>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style lang="scss" scoped>
    @import "src/assets/sass/components/master-profile";
</style>

<script>
import couponService from 'domain/services/coupon-service'

import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectModule from 'components/elements/common/MultiSelectModule'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'

Vue.use(VeeValidate)

export default {
  name: 'coupon-edit',

  components: {
    Notification,
    Multiselect,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectModule,
    MultiSelectDepartment,
    MultiSelectPosition,
    flatPickr
  },

  data: () => ({
    rangeConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },
    toggleLog: false,
    isLoading: false,
    notify: {
      message: '',
      class: '',
      title: ''
    },
    rawTime: null,
    couponName: '',
    provinceIds: null,
    stationIds: null,
    moduleIds: null,
    departmentIds: null,
    positionIds: null,
    startData: null,
    endDate: null,
    bonus: null
  }),

  computed: {
    isEdit: function () {
      return this.$route.params.id > 0
    }
  },

  created () {
    if (!this.$route.params.id) {
      return
    }
    this.getCoupon()
  },

  watch: {
    rawTime: function (newVal, oldVal) {
      if (newVal !== null) {
        let range = newVal.split('to').map(item => item.trim())
        if (range.length === 2) {
          this.startDate = moment(range[0], 'DD-MM-YYYY').format('YYYY-MM-DD')
          this.endDate = moment(range[1], 'DD-MM-YYYY').format('YYYY-MM-DD')
          return
        }
      }
      this.startDate = null
      this.endDate = null
    }
  },

  methods: {

    handlePositionSelected: function (option) {
      this.positionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleDepartmentSelected: function (option) {
      this.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleProvinceSelected: function (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleStationSelected: function (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleModuleSelected: function (option) {
      this.moduleIds = option ? option.map((item) => item.id).toString() : ''
    },

    getCoupon () {
      this.$startLoading()
      let dataRequest = {
        id: this.$route.params.id
      }
      couponService.get(dataRequest)
        .then(res => {
          if (res.data.success) {
            this.setData(res.data.data)
          }
        }).then(() => {
          this.$stopLoading()
        })
    },

    setData (data) {
      this.couponId = data.id
      this.couponName = data.name
      this.provinceIds = data.province_id
      this.stationIds = data.station_id
      this.moduleIds = data.module_id
      this.departmentIds = data.department_ids
      this.positionIds = data.position_id
      this.bonus = data.bonus
      this.rawTime = moment(data.start_date).format('DD-MM-YYYY') + ' to ' + moment(data.end_date).format('DD-MM-YYYY')
    },

    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-emp',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify
      })
    },

    addCoupon () {
      let dataSend = {
        name: this.couponName,
        province_id: this.provinceIds,
        station_id: this.stationIds,
        module_id: this.moduleIds,
        department_ids: this.departmentIds,
        position_id: this.positionIds,
        bonus: this.bonus,
        start_date: this.startDate,
        end_date: this.endDate
      }
      couponService.add(dataSend)
        .then(response => {
          if (!response.data.success) {
            this.notify = {
              title: 'Tạo coupon thất bại',
              message: response.data.message ? response.data.message : 'Tạo coupon thất bại'
            }
            this.showNotification(false)
          } else {
            this.notify = {
              title: 'Thành công',
              message: 'Tạo coupon thành công'
            }
            this.showNotification(true)
          }
        })
    },

    updateCoupon () {
      let dataSend = {
        id: this.couponId,
        name: this.couponName,
        province_id: this.provinceIds,
        station_id: this.stationIds,
        module_id: this.moduleIds,
        department_ids: this.departmentIds,
        position_id: this.positionIds,
        bonus: this.bonus,
        start_date: this.startDate,
        end_date: this.endDate
      }
      couponService.update(dataSend)
        .then(response => {
          console.log(response)
          if (!response.data.success) {
            this.notify = {
              title: 'Lỗi',
              message: response.data.message ? response.data.message : 'Cập nhật coupon thất bại'
            }
            this.showNotification(false)
          } else {
            this.notify = {
              title: 'Thành công',
              message: 'Cập nhật coupon thành công'
            }
            this.showNotification(true)
          }
        })
    }
  }
}
</script>
