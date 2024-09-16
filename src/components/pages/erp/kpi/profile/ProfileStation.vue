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
            THÔNG TIN KHO
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
            <div style="display: flex; align-items: center"> <img :src="infoProfileStation.avatar" alt="Avatar" class="avatar">
              <div style="margin: 15px;">
                <b-row style="display: flex; align-items: center">
                  <p style="margin-top: 0.25rem;margin-bottom: 0.25rem;color:black; font-size: 20px;" ><b> {{ infoProfileStation.code}} | {{ infoProfileStation.sname }} </b> </p>
                  <span v-if="infoProfileStation.status == 'inactive'" class="dot" :style="styleDot"></span>
                  <span v-if="infoProfileStation.status == 'active'" class="dot" :style="styleDotActive"></span>
                </b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-pin iconCus"/>{{ infoProfileStation.address }}</p></b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-home iconCus"/>Loại hình: <span v-if="typeStation  === 'kho_trung_chuyen'">Kho trung chuyển</span> <span v-if="typeStation  === 'buu_cuc'">Bưu cực</span> | Diện tích: {{ FormatNumber(infoProfileStation.acreage) }} m2</p></b-row>
                <b-row v-if="typeStation === 'buu_cuc'" class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-time iconCus"/><span v-if="infoProfileStation.open" style="color:#00904A">Đang mở cửa </span><span v-if="!infoProfileStation.open" style="color:red">Đã đóng cửa</span><span v-if="infoProfileStation.open">| Đóng cửa lúc: {{ infoProfileStation.timeClose }}</span></p></b-row>
                <b-row v-if="typeStation === 'kho_trung_chuyen'" class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-person iconCus"/>{{ infoProfileStation.count_xlhh }} XLHH | {{ infoProfileStation.count_tx }} TX | {{ infoProfileStation.count_gskv }} GSKV | {{ infoProfileStation.count_qlmd }} QLMD </p></b-row>
                <b-row v-if="typeStation === 'buu_cuc'" class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-person iconCus"/>{{ infoProfileStation.count_xlhh }} XLHH | {{ infoProfileStation.count_cod }} COD | {{ infoProfileStation.count_nvbc }} NVBC </p></b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-call iconCus"/>{{ infoProfileStation.phone_qlmd }} ({{infoProfileStation.position_name_qlmd}} {{infoProfileStation.name_qlmd}}) | {{infoProfileStation.phone_owner}} (Chủ mặt bằng {{infoProfileStation.name_owner}})</p></b-row>
                <b-row class ="rowInfoTruck"><p style="margin-top: 0.3rem;margin-bottom: 0.3rem" ><i class="sidenav-icon ion ion-ios-create iconCus"/>Ngày bắt đầu hoạt động: {{ formatDate(infoProfileStation.active_date) }} | Thanh toán: {{ infoProfileStation.payment_date }} tháng/lần | Thời hạn thuê: {{ infoProfileStation.rental_term }}</p></b-row>
              </div>
            </div>
          </b-row>
        </div>
        </div>
      </b-row>
      <b-row style="margin-right: 0px; margin-left: 0px; margin-top: 25px;">
        <table v-if="typeStation  === 'kho_trung_chuyen'" class="table1" width="100%">
          <tbody>
          <tr>
            <td style="width: 14%">
              <div class="cell-table1_cennter">
                <div><b>{{ FormatNumber(dataHeaderStation.total_cost) }} đ </b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng chi phí
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 16%">
              <div class="cell-table1_cennter">
                <div><b>{{ FormatNumber(dataHeaderStation.total_reimbursement) }} đ </b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng bồi hoàn
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 16%">
              <div class="cell-table1_cennter">
                <div><b> {{ FormatNumber(dataHeaderStation.total_order) }} </b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng đơn
                </div>
              </div>
            </td>
            <td class="cell-table1" style="width: 18%">
              <div class="cell-table1_cennter">
                <div><b>{{ FormatNumber(dataHeaderStation.total_bags) }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Tổng bao
                </div>
              </div>
            </td>
            <td  class="cell-table1" style="width: 20%">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderStation.bonus }} & {{ dataHeaderStation.punish }}</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Thưởng & Phạt
                </div>
              </div>
            </td>
          </tr>
          <tr style="height: 15px;"></tr>
          <tr style="margin-top: 10px;">
            <td>
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderStation.input_quality }} % </b>
                </div>
                <div style="color: rgb(130, 130, 130);">Chất lượng nhập
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{dataHeaderStation.sorting_quality}} %</b>
                </div>
                <div style="color: rgb(130, 130, 130);">Chất lượng sorting
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div ><b>{{ dataHeaderStation.make_goods_quality}} % </b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Chất lượng làm hàng
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderStation.goods_quality }} % </b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Chất lượng nhập chuồng
                </div>
              </div>
            </td>
            <td class="cell-table1">
              <div class="cell-table1_cennter">
                <div><b>{{ dataHeaderStation.output_quality }} % </b>
                </div>
                <div style="color: rgb(130, 130, 130);"> Chất lượng xuất
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <table v-if="typeStation  === 'buu_cuc'" class="table1" width="100%">
          <tbody>
            <tr>
              <td style="width: 10%">
                <div class="cell-table1_cennter">
                  <div><b>{{ FormatNumber(dataHeaderStation.total_cost) }} đ </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Tổng chi phí
                  </div>
                </div>
              </td>
              <td  class="cell-table1" style="width: 10%">
                <div class="cell-table1_cennter">
                  <div><b>{{ FormatNumber(dataHeaderStation.total_reimbursement) }} đ </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Tổng bồi hoàn
                  </div>
                </div>
              </td>
              <td class="cell-table1" style="width: 10%">
                <div class="cell-table1_cennter">
                  <div><b> {{dataHeaderStation.total_order}} </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Tổng đơn
                  </div>
                </div>
              </td>
              <td class="cell-table1" style="width: 10%">
                <div class="cell-table1_cennter">
                  <div><b>{{dataHeaderStation.taken_quantity}}</b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Sản lượng lấy
                  </div>
                </div>
              </td>
              <td  class="cell-table1" style="width: 10%">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.delivery_quantity }}</b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Sản lượng giao
                  </div>
                </div>
              </td>
              <td  class="cell-table1" style="width: 10%">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.give_back_quantity }}</b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Sản lượng trả
                  </div>
                </div>
              </td>
            </tr>
            <tr style="height: 15px;"></tr>
            <tr style="margin-top: 10px;">
              <td>
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.bonus }} & {{ dataHeaderStation.punish }}</b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Thưởng & Phạt
                  </div>
                </div>
              </td>
              <td class="cell-table1">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.delivery }} % </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Giao thành công
                  </div>
                </div>
              </td>
              <td class="cell-table1">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.d_radio }} % </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Xuất giao đúng
                  </div>
                </div>
              </td>
              <td class="cell-table1">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.r_radio }} % </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">Xuất trả đúng
                  </div>
                </div>
              </td>
              <td class="cell-table1">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.p_radio }} % </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">TC lấy đúng
                  </div>
                </div>
              </td>
              <td class="cell-table1">
                <div class="cell-table1_cennter">
                  <div><b>{{ dataHeaderStation.tr_radio }} % </b>
                  </div>
                  <div style="color: rgb(130, 130, 130);">TC trả đúng
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
          <OverviewProfileStation style="padding-left: 25px; padding-right: 25px" :position="typeStation"/>
        </b-col>
      </b-row>
    </div>

  </body>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-cod-profile.scss" lang="scss" scoped></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.css" />
<!-- Load Vue followed by BootstrapVueIcons -->
<script src="//unpkg.com/vue@latest/dist/vue.min.js"></script>
<script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js"></script>
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
  width: 186px;
  height: 186px;
  margin: 10px;
  object-fit: cover;
}

.dot {
  margin-left: 10px;
  height: 12px;
  width: 12px;
  background-color: #eb5757;
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
.iconCus {
  color: #00904A;
  margin-right: 9px;
}

</style>

<script>
import moment from 'moment'
import stationProfilesService from 'domain/services/station-profiles-service'
import Multiselect from 'vue-multiselect'
import OverviewProfileStation from './OverviewProfileStation'
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
import BIcon from 'bootstrap-vue'
Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
})
export default {
  name: 'profile-station',
  metaInfo: {
    title: 'Station Profile'
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
    stationProfilesService,
    OverviewProfileStation,
    BIcon
  },
  data: () => ({
    nStationID: null,
    typeStation: 'kho_trung_chuyen',
    group_id: '',
    infoProfileStation: {
      avatar: '',
      code: null,
      sname: null,
      status: '',
      address: null,
      acreage: 0,
      count_xlhh: 0,
      count_tx: 0,
      count_gskv: 0,
      count_qlmd: 0,
      count_cod: 0,
      count_nvbc: 0,
      phone_qlmd: null,
      name_qlmd: null,
      phone_owner: null,
      name_owner: null,
      active_date: null,
      payment_date: 0,
      rental_term: null,
      position_name_qlmd: null,
      timeClose: '',
      open: false
    },
    dataHeaderStation: {
      total_cost: 0,
      total_reimbursement: 0
    },
    dotStyle: {
      backgroundColor: '#eb5757'
    },
    styleDot: {
      backgroundColor: '#838383'
    },
    styleDotActive: {
      backgroundColor: 'rgb(0, 144, 74)'
    }
  }),
  created () {
    this.nStationID = this.$route.params.nStationID
    this.getInfoStation()
  },
  watch: {
  },
  computed: {
  },
  methods: {
    FormatNumber (num) {
      num = Number(num)
      num = num.toLocaleString('it-IT', {style: 'currency', currency: 'VND'})
      let locationVND = num.indexOf('VND')
      if (locationVND !== -1) {
        num = num.slice(0, locationVND - 1)
      }
      num = num.replaceAll('.', ',')
      return num
    },
    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },
    reload () {
      this.getInfoStation()
    },
    getInfoStation () {
      let parmas = {
        nStationID: this.nStationID
      }
      stationProfilesService.getProfileStation(parmas)
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data
            // basicwarehouse
            this.infoProfileStation.avatar = data.basicWarehouse.logo ? data.basicWarehouse.logo : 'https://giaohangtietkiem.vn/wp-content/uploads/2021/01/%C3%A1dcsfs.jpg'
            this.infoProfileStation.code = data.basicWarehouse.code
            this.infoProfileStation.sname = data.basicWarehouse.sname
            this.infoProfileStation.status = data.basicWarehouse.status
            this.infoProfileStation.address = data.basicWarehouse.address
            this.infoProfileStation.acreage = data.basicWarehouse.acreage
            this.infoProfileStation.count_xlhh = data.basicWarehouse.count_xlhh
            this.infoProfileStation.phone_qlmd = data.basicWarehouse.phone_qlmd
            this.infoProfileStation.name_qlmd = data.basicWarehouse.name_qlmd
            this.infoProfileStation.phone_owner = data.basicWarehouse.phone_owner
            this.infoProfileStation.name_owner = data.basicWarehouse.name_owner
            this.infoProfileStation.active_date = data.basicWarehouse.active_date
            this.infoProfileStation.payment_date = data.basicWarehouse.payment_date
            this.infoProfileStation.rental_term = ( data.basicWarehouse.rental_term.value !== null ) ? ( data.basicWarehouse.rental_term.value  + ' ' + data.basicWarehouse.rental_term.type ) : null
            // basic number
            this.dataHeaderStation.total_cost = data.basicNumber.total_cost
            this.dataHeaderStation.total_reimbursement = data.basicNumber.total_reimbursement
            this.dataHeaderStation.total_order = data.basicNumber.total_order
            this.dataHeaderStation.bonus = data.basicNumber.bonus
            this.dataHeaderStation.punish = data.basicNumber.punish
            // type station
            if (data.type === 'trung_chuyen') {
              this.typeStation = 'kho_trung_chuyen'
              this.dataHeaderStation.total_bags = data.basicNumber.total_bags
              this.dataHeaderStation.input_quality = data.basicNumber.input_quality
              this.dataHeaderStation.sorting_quality = data.basicNumber.sorting_quality
              this.dataHeaderStation.make_goods_quality = data.basicNumber.make_goods_quality
              this.dataHeaderStation.goods_quality = data.basicNumber.goods_quality
              this.dataHeaderStation.output_quality = data.basicNumber.output_quality
              this.infoProfileStation.position_name_qlmd = 'QLMD'
              this.infoProfileStation.count_tx = data.basicWarehouse.count_tx
              this.infoProfileStation.count_gskv = data.basicWarehouse.count_gskv
              this.infoProfileStation.count_qlmd = data.basicWarehouse.count_qlmd
            } else {
              this.typeStation = 'buu_cuc'
              this.infoProfileStation.open = data.basicWarehouse.work
              this.infoProfileStation.timeClose = data.basicWarehouse.close_work
              this.infoProfileStation.position_name_qlmd = data.basicWarehouse.position_name_qlmd
              this.infoProfileStation.count_cod = data.basicWarehouse.count_cod
              this.infoProfileStation.count_nvbc = data.basicWarehouse.count_nvbc
              this.dataHeaderStation.taken_quantity = data.basicNumber.taken_quantity
              this.dataHeaderStation.delivery_quantity = data.basicNumber.delivery_quantity
              this.dataHeaderStation.give_back_quantity = data.basicNumber.give_back_quantity
              this.dataHeaderStation.delivery = data.basicNumber.delivery
              this.dataHeaderStation.d_radio = data.basicNumber.d_radio
              this.dataHeaderStation.tr_radio = data.basicNumber.tr_radio
              this.dataHeaderStation.p_radio = data.basicNumber.p_radio
              this.dataHeaderStation.r_radio = data.basicNumber.r_radio
            }
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
