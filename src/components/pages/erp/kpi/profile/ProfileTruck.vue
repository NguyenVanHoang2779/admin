<template>
  <body style="background-color: #EEEEEE; font-family:Roboto; font-size: 16px">
    <div class="container-profile" id="container-profile">
      <b-row style="background-color: #00904A; margin-right: 0px; margin-left: 0px;">
        <b-col style="margin-top: 20px; margin-bottom: 20px;">
          <p class="header-text">
          </p>
        </b-col>
        <b-col style="display: flex; align-items: center; text-align: center; margin-top: 20px; margin-bottom: 20px;" cols="11">
          <p class="header-text">
            THÔNG TIN XE TẢI
          </p>
        </b-col>
        <b-col style="margin-top: 20px; margin-bottom: 20px; text-align: right">
          <p class="header-text btn" @click="reload()">
            <i class="ion ion-md-sync"></i>
          </p>
        </b-col>
      </b-row>
      <b-row style=" margin-right: 0px; margin-left: 0px; width: 100%;" >
        <div style="width: 100%; display: flex;">
        <div style="margin-left: 15px;">
          <b-row>
            <div style="display: flex; align-items: center"> <img :src="infoProfileTruck.avatar" alt="Avatar" class="avatar">
              <div style="margin: 15px;">
                <b-row style="display: flex; align-items: center">
                  <p style="margin-top: 0.25rem;margin-bottom: 0.25rem;color:black; font-size: 20px;" ><b> {{ infoProfileTruck.code}} | {{ infoProfileTruck.truck_type }}</b> </p>
                  <span v-if="dataHeaderTruck.is_delete == '1'" class="dot" :style="styleDot"></span>
                  <span v-if="dataHeaderTruck.is_delete == '0'" class="dot" :style="styleDotActive"></span>
                </b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.25rem;margin-bottom: 0.25rem" ><span class="dotList"></span><span>Hãng xe: </span>{{ infoProfileTruck.automaker }}</p></b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.25rem;margin-bottom: 0.25rem" ><span class="dotList"></span><span>Tải trọng: </span>{{ infoProfileTruck.weight }} |<span> Thể tích: </span> {{ infoProfileTruck.trunk_volume }}</p></b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.25rem;margin-bottom: 0.25rem" ><span class="dotList"></span><span>Tài sản xe: </span>{{ infoProfileTruck.truck_asset }} </p></b-row>
              </div>
            </div>
          </b-row>
        </div>
        </div>
      </b-row>
      <b-row style="margin-right: 0px; margin-left: 0px; margin-top: 25px;">
        <table class="table1" width="100%">
          <tbody>
          <tr>
            <td style="width: 14%">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.seniority }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Thâm niên
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 16%">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.total_km }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng km
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 17%">
              <div class="cell-table1_cennter">
                <div><b> {{dataHeaderTruck.total_points}} </b>
                </div>
                <div style="color: rgb(130, 130, 130);">Điểm dừng
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 18%">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderTruck.total_ss}}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Phiên xe tải
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 20%">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.total_pkg }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng đơn
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 15%">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.total_kien }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng kiện
                </div>
              </div>
            </td>
          </tr>
          <tr style="height: 15px;"></tr>
          <tr style="margin-top: 10px;">
            <td>
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.percent_run }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tần suất chạy
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderTruck.avg_time | formatNumber}} h</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Thời gian chạy TB
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div ><b>{{ FormatNumber(dataHeaderTruck.avg_repair) }} đ </b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Chi phí sửa chữa TB
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.oil_cost }} lít </b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Mức tiêu thụ dầu/km
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ FormatNumber(dataHeaderTruck.avg_pkg_cost) }} đ </b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Chi phí vc TB/đơn
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderTruck.num_accident }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Số lần tai nạn
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </b-row>
      <hr/>
      <b-row style="margin: 0px;">
        <b-col class="p-0">
          <OverviewProfileTruck style="padding-left: 25px; padding-right: 25px" :position="type"/>
        </b-col>
      </b-row>
    </div>

  </body>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-cod-profile.scss" lang="scss" scoped></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
.container-profile{
  width: 1445px;
  margin-right: auto;
  margin-left: auto;
  background-color: #FFFFFF;
}
@media screen and (max-width: 1445px) {
  .container-profile {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    background-color: #FFFFFF;
  }
}
.button-back {
  position: absolute;
  left: 2%;
  top: 1.5%;
  text-align: left;
}
.button-reload{
  position: absolute;
  right: 2%;
  top: 1.5%;
  text-align: right;
}
.header-text {
  font-style: normal;
  font-size: 18px;
  text-align: center;
  margin: auto;
  color: #FFFFFF;
}

.avatar {
  vertical-align: middle;
  width: 125px;
  height: 125px;
  border-radius: 50%;
  margin: 10px;
  object-fit: cover;
}

.dot {
  margin-left: 10px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}
.dotList {
  margin-bottom: 2px;
  margin-right: 7px;
  height: 7px;
  width: 7px;
  background-color: #00904A;
  border-radius: 50%;
  display: inline-block;
}
.rowInfoTruck {
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 18px;
  color: #000000;
}
ul {
  list-style: none;
}

ul li::before {
  content: "\2022";
  color: #14a05b;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}
.table1 {
  text-align: left;
  margin: 0px 25px 25px;
}

.box-chat {
  width: 100px;
  height: 80px;
  background-color: #00904A;
  color: #FFFFFF;
  display: block;
  align-items: center;
  text-align: center;
  margin: 10px;
  padding: 10px;
}

.display-center {
  display: flex;
  align-items: center;
  text-align: center;
}

.cell-table1 {
  border-left: 1px solid #DBDBDB;
}

.cell-table1_cennter {
  margin: auto;
  width: 65%;
  padding-left: 2px;
  padding-right: 2px;
}
@media screen and (max-width: 1400px) {
  .cell-table1_cennter {
    margin: auto;
    width: 70%;
    padding-left: 2px;
    padding-right: 2px;
  }
}
@media screen and (max-width: 1300px) {
  .cell-table1_cennter {
    margin: auto;
    width: 75%;
    padding-left: 2px;
    padding-right: 2px;
  }
}
@media screen and (max-width: 1200px) {
  .cell-table1_cennter {
    margin: auto;
    width: 80%;
    padding-left: 2px;
    padding-right: 2px;
  }
}
@media screen and (max-width: 1100px) {
  .cell-table1_cennter {
    margin: auto;
    width: 85%;
    padding-left: 2px;
    padding-right: 2px;
  }
}
@media screen and (max-width: 1030px) {
  .cell-table1_cennter {
    margin: auto;
    width: 90%;
    padding-left: 2px;
    padding-right: 2px;
  }
}

</style>

<script>
import truckProfilesService from 'domain/services/truck-profiles-service'
import Multiselect from 'vue-multiselect'
import OverviewProfileTruck from './OverviewProfileTruck'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import CustomButton from 'components/elements/common/CustomButton'
import cycleTime from 'infrastructures/helpers/date.js'
import Vue from 'vue'
import numeral from 'numeral'
Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
})
export default {
  name: 'profile-truck',
  metaInfo: {
    title: 'Truck Profile'
  },
  components: {
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    Datepicker,
    Moment,
    CustomButton,
    cycleTime,
    truckProfilesService,
    OverviewProfileTruck
  },
  data: () => ({
    truck_order: null,
    type: '',
    group_id: '',
    infoProfileTruck: {
      avatar: '',
      code: '',
      truck_type: '',
      automaker: '',
      weight: '',
      trunk_volume: '',
      truck_asset: ''
    },
    dataHeaderTruck: {
      seniority: 0,
      total_km: 0,
      total_points: 0,
      total_ss: 0,
      total_pkg: 0,
      total_kien: 0,
      percent_run: 0,
      avg_time: null,
      avg_repair: null,
      oil_cost: null,
      avg_pkg_cost: null,
      num_accident: 0,
      is_delete: 0
    },
    styleDot: {
      backgroundColor: '#838383'
    },
    styleDotActive: {
      backgroundColor: 'rgb(0, 144, 74)'
    }
  }),
  created () {
    this.truck_order = this.$route.params.truck_order
    this.getInfoTruck()
  },
  watch: {
  },
  computed: {
  },
  methods: {
    FormatNumber (num) {
      if (num !== null) {
        return (num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      } else return num
    },
    reload () {
      this.getInfoTruck()
    },
    getInfoTruck () {
      let parmas = {
        truck_order: this.truck_order
      }
      truckProfilesService.getProfileTruck(parmas)
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data
            this.infoProfileTruck.avatar = data.truck_detail.avatar ? data.truck_detail.avatar : 'https://giaohangtietkiem.vn/wp-content/uploads/2021/01/DSC09528.jpg'
            this.infoProfileTruck.code = data.truck_detail.code
            this.infoProfileTruck.truck_type = data.truck_detail.truck_type
            this.infoProfileTruck.automaker = data.truck_detail.automaker
            this.infoProfileTruck.weight = data.truck_detail.weight
            this.infoProfileTruck.trunk_volume = data.truck_detail.trunk_volume
            this.infoProfileTruck.truck_asset = data.truck_detail.truck_asset
            this.dataHeaderTruck.seniority = data.data_truck.tham_nien
            this.dataHeaderTruck.total_km = data.data_truck.total_km
            this.dataHeaderTruck.total_points = data.data_truck.total_points
            this.dataHeaderTruck.total_ss = data.data_truck.total_ss
            this.dataHeaderTruck.total_pkg = data.data_truck.total_pkg
            this.dataHeaderTruck.total_kien = data.data_truck.total_kien
            this.dataHeaderTruck.percent_run = data.data_truck.percent_run
            this.dataHeaderTruck.avg_time = data.data_truck.avg_time
            this.dataHeaderTruck.avg_repair = data.data_truck.avg_repair
            this.dataHeaderTruck.oil_cost = data.data_truck.oil_cost
            this.dataHeaderTruck.avg_pkg_cost = data.data_truck.avg_pkg_cost
            this.dataHeaderTruck.num_accident = data.data_truck.num_accident
            this.dataHeaderTruck.is_delete = data.truck_detail.is_delete
            this.type = data.truck_detail.truck_type
            if (res.data.message !== 'success') {
              commonHelper.showMessage(res.data.message, 'warning')
            }
          } else {
            commonHelper.showMessage('Bạn không có quyền truy cập', 'error')
          }
        })
        .catch((e) => {
          commonHelper.showMessage('Bạn không có quyền lấy dữ liệu', 'warning')
        })
    }
  }
}
</script>
