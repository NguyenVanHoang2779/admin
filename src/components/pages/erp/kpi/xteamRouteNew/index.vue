<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
      <div>Lộ trình Xteam</div>
    </h4>
    <b-card class="mb-2">
      <div class="row mb-2">
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="" sm="2">
                <label class="font-italic label-search">
                  <b>Username:</b>
                </label>
              </b-col>
              <b-col sm="6">
                <select-user
                  @model="user = $event" :user="user"
                >
                </select-user>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="" sm="1">
                <label class="font-italic label-search">
                  <b>Ngày:</b>
                </label>
              </b-col>
              <b-col sm="6">
                <datepicker
                  v-model="date"
                  format="yyyy-MM-dd"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder=" Ngày bắt đầu"
                />
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <b-row class="action mb-2">
        <ladda-btn :loading="loading.search" @click.native="getData" data-style="zoom-out" class="btn btn-success w-200px mr-3">
          <i class="ion ion-md-search"></i> Tìm kiếm
        </ladda-btn>
        <b-button variant="primary" class="w-200px" @click="clear()"><i class="ion ion-ios-nuclear"></i>Làm mới</b-button>
      </b-row>
    </b-card>
      <b-card class="mb-1" v-if="showResult">
        <b-row class="summary">
          <b-col sm="2">
              <h5><b>Tổng kết</b></h5>
            </b-col>
            <b-col sm="2">
              <div>Tổng điểm xử lý</div>
              <div><b>{{ result.points }}</b></div>
            </b-col>
            <b-col sm="2">
              <div>Đơn giao thành công</div>
              <div><b>{{ result.d_ss }} </b></div>
            </b-col>
            <b-col sm="2">
              <div>Tổng km tính lương</div>
              <div><b>{{  Math.round(result.distance / 1000 * 100) / 100 }} Km</b></div>
            </b-col>
            <b-col sm="2">
              <div>Tỉ lệ giao thành công</div>
              <div><b>{{ result.percent_success }} %</b></div>
            </b-col>
            <b-col sm="2">
              <div>Tổng lương tạm tính</div>
              <div><b>{{ result.salary }}</b></div>
            </b-col>
        </b-row>
        <hr>
        <b-row class="center">
          <b-col sm="12" class="routing-reality">
            <b-row v-for="(item,index) in route" :key="index" class="w-100 route">
              <b-col sm="1"></b-col>
              <b-col sm="1">
                <i class="fas fa-map-marker-alt icon icon-map"></i>
                <span v-if="index !== 0">{{  Math.round(item.distance / 1000 * 100) / 100 }} Km</span>
                <div v-if="index !== route.length - 1" class="line-height"></div>
              </b-col>
              <b-col sm="10" class="route-info">
                <b-row class="mb-2 mt-2"> <i class="ion ion-ios-home icon-home mr-1"></i> <b>{{ item.point_name }}</b></b-row>
                <b-row class="row-action" v-for="(action,i) in item.detail" :key="i">
                  <b-col sm="2">{{ action.action_name }}</b-col>
                  <b-col sm="7">
                <span class="count-package" v-b-modal="'modal'" @click="detailPackages(action.pkg_orders, $event.target)">
                  {{ action.count }} ĐH
                </span>
                  </b-col>
                </b-row>
                <b-row class="row-time-start">
                  <b-col sm="2">Thời gian bắt đầu:</b-col>
                  <b-col sm="7">{{ formatDate(item.time_start) }}</b-col>
                </b-row>
                <b-row class="row-time-end">
                  <b-col sm="2">Thời gian kết thúc:</b-col>
                  <b-col sm="7">{{ formatDate(item.time_end) }}</b-col>
                </b-row>
                <b-row class="row-report" v-if="item.is_valid != ''">
                  <b-col sm="2">Trạng thái:</b-col>
                  <b-col sm="7">
                    <span v-if="item.is_valid == 0">Không thành công</span>
                    <span v-if="item.is_valid == 1">Thành công</span>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    <b-modal :id="infoModal.id" :title="infoModal.title" centered ok-only @hide="resetInfoModal" >
      <div class="pkgs-detail">
        <b-row v-for="(pkg,index) in packages" :key="index" class="pkg">
          <b-row class="code w-100">
            <b-col sm="4"> Mã:</b-col>
            <b-col sm="8"><b>{{ pkg.Package.alias }}</b></b-col>
          </b-row>
          <b-row class="address-customer w-100">
            <b-col sm="4"> Địa chỉ giao:</b-col>
            <b-col sm="8">{{ pkg.Package.customer_last_address }}</b-col>
          </b-row>
          <b-row class="weight w-100">
            <b-col sm="4"> Cân nặng:</b-col>
            <b-col sm="8">{{ pkg.Package.weight }} Kg</b-col>
          </b-row>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import XteamRoute from 'domain/services/xteam-route-service'
import Moment from 'moment'
import SelectUser from '../xteamRoute/SelectUser'
export default {
  name: 'xteam-route',
  components: {
    LoadingMiniBottom,
    LaddaBtn,
    Datepicker,
    SelectUser
  },
  data: () => ({
    user: {},
    date: '',
    route: [],
    distanceReality: 0,
    distanceSystem: 0,
    distanceSalary: '',
    loading: {
      search: false
    },
    infoModal: {
      id: 'info-modal',
      title: 'Chi tiết các đơn hàng'
    },
    packages: [],
    result: {
      points: '',
      salary: '',
      distance: '',
      d_ss: '',
      percent_success: ''
    },
    showResult: false
  }),
  watch: {},
  created () {
    window.location.href = process.env.VUE_APP_DOMAIN_KPI + '/adm/xteam-route-new'
  },
  computed: {
  },
  methods: {
    clear () {
      this.user = {}
      this.date = ''
      this.route = []
      this.distanceSystem = 0
      this.distanceReality = 0
      this.result.points = ''
      this.result.salary = ''
      this.result.distance = ''
      this.result.percent_success = ''
      this.result.d_ss = ''
      this.showResult = false
    },
    formatDate (date) {
      return Moment(date).format('hh:mm DD/MM/YYYY')
    },
    detailPackages (pkgOrders, button) {
      let dataSend = {
        pkg_orders: pkgOrders
      }
      XteamRoute.apiGetInfoListPackages(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.packages = response.data.data
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau', 'warning')
      })
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.packages = []
    },
    getData () {
      this.showResult = false
      this.distanceSystem = 0
      let dataSend = {
        user_id: this.user.id,
        date: Moment(this.date).format('YYYY-MM-DD')
      }
      if (dataSend.user_id == null || dataSend.date == null || dataSend.date === 'Invalid date') {
        return commonHelper.showMessage('Trường Username và Ngày không được để trống', 'warning')
      }
      XteamRoute.apiGetDetailRouteXteamNew(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.route = response.data.data
            let totalDistanceReality = 0
            for (let i = 0; i < this.route.length; i++) {
              totalDistanceReality += parseFloat(this.route[i].distance)
            }
            this.distanceReality = totalDistanceReality
            return commonHelper.showMessage(response.data.message, 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau', 'warning')
      })

      XteamRoute.getSalaryCodWorkshift(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let res = response.data.data.ws_1.component.xteam_salary_new
            this.result.salary = res.salary_kpi
            this.result.d_ss = res.d_pkg_ss
            this.result.distance = res.route.distance
            this.result.points = res.route.points
            this.result.percent_success = Math.round(res.route.d_ss / res.route.d_export * 10000) / 100
            this.showResult = true
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau', 'warning')
      })
    }
  }
}
</script>
<style scoped lang="scss">
.pkgs-detail {
  .pkg:last-child {
    border-bottom: none !important;
  }
}
.route-info {
  border-bottom: 1px solid #C4C4C4;
}
.route {
  height: 150px;
}
.pkg {
  width: 80%;
  margin: auto;
  border-bottom: 1px solid black;
}
.summary {
  text-align: center;
}
.weight {
  color: #02BC77;
}
.routing-system-left {
  padding-left: 30px;
}
.left {
  /*border-right: 1px solid black;*/
}
.label-search {
  transform: translateY(25%)
}
.action {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon {
  color: #02BC77;
}
.icon-home {
  color: #02BC77;
  font-size: 18px;
}
.center {
  margin: auto;
  width: 100%;
}
.icon-map {
  font-size: 20px;
}
.line-height {
  border: 2px dotted #CCCCCC;
  height: 70%;
  width: fit-content;
  margin-left: 5px;
}
hr {
  border-color: #C4C4C4;
}
/*.row-time-start, .points, .true_percent {*/
/*  color: #28C3D7;*/
/*}*/
/*.row-time-end, .salary {*/
/*  color: #D9534F;*/
/*}*/
.row-action, .cost_per_km {
  color: #0fb64f;
}
.count-package {
  text-decoration: underline;
}
</style>
