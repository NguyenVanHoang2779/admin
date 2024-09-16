<template>
    <div class="payslip-manager-page">
        <!--popup chi tiet cong thuc luong-->
        <b-modal id="modal-1" modal-class="modal-xl" v-if="showModal" @close="showModal = true" :hide-footer="true"
                 :hide-header="true">
            <label class="form-label d-none d-md-block">Ngày: {{loadDataDetail.date}}</label>
            <label class="form-label d-none d-md-block">Username: {{loadDataDetail.username}}</label>
            <label class="form-label d-none d-md-block">Lương tạm tính: <strong v-numeral>{{loadDataDetail.totalSalary}}</strong> VNĐ</label>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <span>
                    <label class="form-label d-none d-md-block">Thông tin đơn giao</label>
                    <table class="table mb-0 table-bordered table-striped text-center">
                        <thead>
                        <tr>
                            <th>Vùng</th>
                            <th v-for="(value,are) in loadDataDetail.data_area">{{are}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Số đơn</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.d_pkg) !== 'undefined'">{{value.d_pkg}}</span>
                                <span v-if="typeof(value.d_pkg) === 'undefined'">0</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Số đơn thành công</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.d_pkg_ss) !== 'undefined'">{{value.d_pkg_ss}}</span>
                                <span v-if="typeof(value.d_pkg_ss) === 'undefined'">0</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                        </span>
                    <span>
                    <hr>
                    <label class="form-label d-none d-md-block">Thông tin điểm lấy</label>
                    <table class="table mb-0 table-bordered table-striped text-center">
                        <thead>
                        <tr>
                            <th>Vùng</th>
                            <th v-for="(value,are) in loadDataDetail.data_area">{{are}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Số đơn</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.p_pkg) !== 'undefined'">{{value.p_pkg}}</span>
                                <span v-if="typeof(value.p_pkg) === 'undefined'">0</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Số đơn thành công</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.p_pkg_ss) !== 'undefined'">{{value.p_pkg_ss}}</span>
                                <span v-if="typeof(value.p_pkg_ss) === 'undefined'">0</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Tổng điểm</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.p_pl_ss) !== 'undefined'">{{value.p_pl_ss}}</span>
                                <span v-if="typeof(value.p_pl_ss) === 'undefined'">0</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                        </span>
                    <span>
                    <hr>
                    <label class="form-label d-none d-md-block">Thông tin điểm trả</label>
                    <table class="table mb-0 table-bordered table-striped text-center">
                        <thead>
                        <tr>
                            <th>Vùng</th>
                            <th v-for="(value,are) in loadDataDetail.data_area">{{are}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Số đơn</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.r_pkg) !== 'undefined'">{{value.r_pkg}}</span>
                                <span v-if="typeof(value.r_pkg) === 'undefined'">0</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Số đơn thành công</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.r_pkg_ss) !== 'undefined'">{{value.r_pkg_ss}}</span>
                                <span v-if="typeof(value.r_pkg_ss) === 'undefined'">0</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Tổng điểm</td>
                            <td v-for="(value) in loadDataDetail.data_area">
                                <span v-if="typeof(value.r_pl_ss) !== 'undefined'">{{value.r_pl_ss}}</span>
                                <span v-if="typeof(value.r_pl_ss) === 'undefined'">0</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                        </span>
                    <hr>
                    <label class="form-label d-none d-md-block">Thông tin thù lao</label>
                    <table class="table mb-0 table-bordered table-striped text-center">
                        <thead>
                        <tr>
                            <th>Thù lao điểm theo vùng</th>
                            <th>Thù lao theo ngày công</th>
                            <th>Thù lao theo vùng</th>
                            <th>Thù lao vượt ngưỡng theo điểm</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><strong v-numeral>{{loadDataDetail.ctvAreaPointSalary}}</strong> VNĐ</td>
                            <td><strong v-numeral>{{loadDataDetail.ctvMilestoneDateSalary}}</strong> VNĐ</td>
                            <td><strong v-numeral>{{loadDataDetail.ctvMilestoneAreaSalary}}</strong> VNĐ</td>
                            <td><strong v-numeral>{{loadDataDetail.ctvMilestonePointSalary}}</strong> VNĐ</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <label class="form-label d-none d-md-block">Công thức lương</label>
                    <div class="table-config" v-for="item in loadDataDetail.configObject">
                        <!--Thù lao theo đơn điểm/vùng-->
                      <span v-if="item.type==1">
                          <div v-if="item.detail.data">
                            <hr>
                            <label class="form-label d-none d-md-block">Thù lao theo đơn đơn giao :</label>
                            <table class="table mb-0 table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Vùng</th>
                                    <th v-for="(config,index) in item.detail.data">{{ index }}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Giá 1 đơn giao (VNĐ)</td>
                                    <td v-for="(config) in item.detail.data"><strong
                                      v-numeral>{{ config }}</strong></td>
                                </tr>
                                </tbody>
                            </table>
                          </div>
                          <div v-if="item.detail.point_p_r">
                            <hr>
                            <label class="form-label d-none d-md-block">Thù lao theo điểm lấy/trả :</label>
                            <table class="table mb-0 table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Vùng</th>
                                    <th v-for="(config,index) in item.detail.point_p_r">{{ index }}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Giá 1 điểm lấy/trả (VNĐ)</td>
                                    <td v-for="(config) in item.detail.point_p_r"><strong
                                      v-numeral>{{ config }}</strong></td>
                                </tr>
                                </tbody>
                            </table>
                          </div>
                          <div v-if="item.detail.package_p">
                            <hr>
                            <label class="form-label d-none d-md-block">Thù lao theo đơn lấy :</label>
                            <table class="table mb-0 table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Vùng</th>
                                    <th v-for="(config,index) in item.detail.package_p">{{ index }}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Giá 1 đơn lấy (VNĐ)</td>
                                    <td v-for="(config) in item.detail.package_p"><strong
                                      v-numeral>{{ config }}</strong></td>
                                </tr>
                                </tbody>
                            </table>
                          </div>
                          <div v-if="item.detail.package_r">
                            <hr>
                            <label class="form-label d-none d-md-block">Thù lao theo đơn trả :</label>
                            <table class="table mb-0 table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Vùng</th>
                                    <th v-for="(config,index) in item.detail.package_r">{{ index }}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Giá 1 đơn trả (VNĐ)</td>
                                    <td v-for="(config) in item.detail.package_r"><strong
                                      v-numeral>{{ config }}</strong></td>
                                </tr>
                                </tbody>
                            </table>
                          </div>
                          <div v-if="item.detail.route_bonus">
                            <hr>
                            <label class="form-label d-none d-md-block">Bonus tuyến khó : {{ item.detail.route_bonus }} trên 1 đơn/điểm</label>
                          </div>
                                </span>
                        <!--Thù lao vượt ngưỡng-->
                        <span v-if="item.type==2">
                          <div v-if="item.detail.data">
                            <hr>
                            <label class="form-label d-none d-md-block">Thù lao vượt ngưỡng :</label>
                            <table class="table mb-0 table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Vùng</th>
                                    <th v-for="(config,index) in item.detail.data">{{index}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Tổng đơn/ điểm</td>
                                    <td v-for="(config) in item.detail.data">{{config}}</td>
                                </tr>
                                </tbody>
                                <span>Đơn giá: <strong v-numeral>{{item.detail.cost}}</strong> VNĐ trên 1 đơn/điểm</span><br>
                                <span v-if="item.detail.seniority">Thâm niên: {{item.detail.seniority}} ngày</span>
                            </table>
                          </div>
                           <div v-if="item.detail.cost">
                             <hr>
                            <label class="form-label d-none d-md-block"> Đơn giá: {{item.detail.cost}} VNĐ trên 1 đơn/điểm</label>
                          </div>
                          <div v-if="item.detail.seniority">
                            <hr>
                            <label class="form-label d-none d-md-block"> Thâm niên: {{item.detail.seniority}} Ngày</label>
                          </div>
                            </span>
                        <!--Thù lao Vượt ngưỡng tổng đơn/điểm-->
<!--                        <span v-if="item.type==3">-->
<!--                          <div v-if="item.detail.data">-->
<!--                            <hr>-->
<!--                            <label class="form-label d-none d-md-block">Thù lao vượt ngưỡng tổng đơn/điểm :</label>-->
<!--                            <table class="table mb-0 table-bordered table-striped">-->
<!--                                <thead>-->
<!--                                <tr>-->
<!--                                    <th>Tổng đơn/điểm</th>-->
<!--                                    <th v-for="(config,index) in item.detail.data">{{index}}</th>-->
<!--                                </tr>-->
<!--                                </thead>-->
<!--                                <tbody>-->
<!--                                <tr>-->
<!--                                    <td>Thù lao (VNĐ)</td>-->
<!--                                    <td v-for="(config) in item.detail.data"><strong v-numeral>{{config}}</strong></td>-->
<!--                                </tr>-->
<!--                                </tbody>-->
<!--                            </table>-->
<!--                          </div>-->
<!--                          <div v-if="item.detail.seniority">-->
<!--                            <hr>-->
<!--                            <label class="form-label d-none d-md-block"> Thâm niên: {{item.detail.seniority}} Ngày</label>-->
<!--                          </div>-->
<!--                        </span>-->
<!--                        &lt;!&ndash;Thù lao theo cân nặng&ndash;&gt;-->
<!--                        <span v-if="item.type==5">-->
<!--                          <div v-if="item.detail.data">-->
<!--                            <hr>-->
<!--                            <label class="form-label d-none d-md-block">Thù lao theo ngày công :</label>-->
<!--                                <span>Thù lao: <strong v-numeral>{{item.detail.cost}}</strong>VNĐ</span><br>-->
<!--                                <span v-if="item.detail.seniority">Thâm niên: {{item.detail.seniority}} ngày</span>-->
<!--                            </span>-->
                    </div>
                </div>
            </div>
            <br>
            <div class="mb-4 text-center">
                <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
            </div>
        </b-modal>
        <div class="ui-block">
            <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
                <div>Check lương COD CTV</div>
            </h4>
            <form id="app" method="post">
                <div class="row">
                    <b-form-group label="Chọn Username" class="col-sm-4">
                        <multiselect
                                v-model="asyncSelected"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="asyncFound"
                                :multiple="false"
                                :searchable="true"
                                :loading="asyncLoading"
                                :internal-search="false"
                                :clear-on-select="true"
                                :close-on-select="true"
                                :hide-selected="true"
                                @search-change="asyncFind">
                            <span slot="noResult">{{message}}</span>
                            <span slot="noOptions">{{message}}</span>
                        </multiselect>
                    </b-form-group>
                    <!--Box chọn ngày bắt đầu -->
                    <b-form-group class="col-sm-4" label="Ngày bắt đầu">
                        <datepicker
                                v-model="from"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </b-form-group>
                    <!--Box chọn ngày kết thúc -->
                    <b-form-group class="col-sm-4" label="Ngày kết thúc">
                        <datepicker
                                v-model="to"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </b-form-group>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <b-form-group class="col-sm-6 text-right"></b-form-group>
                        <b-form-group class="col-sm-6 text-right">
                            <ladda-btn :loading="loadingButton" type="button" class="btn btn-primary"
                                       @click.native="checkConfig"><i
                                    class="sidenav-icon ion ion-md-search"></i>
                                Tra cứu
                            </ladda-btn>
                        </b-form-group>
                    </div>
                </div>
            </form>
        </div>
        <hr/>
        <span class="form-label d-none d-md-block">Tổng lương tạm tính : {{sumSalary}} VNĐ</span>
        <div class="table-responsive mb-4 text-center" style="overflow-y: scroll; overflow-x: hidden;">
            <table class="table mb-0 table-bordered table-striped">
                <thead>
                <tr>
                    <th width="10%">Ngày</th>
                    <th>Mã cơ chế</th>
                    <th>Username</th>
                    <th>Tổng đơn giao TC</th>
                    <th>Điểm lấy TC (đơn/ điểm)</th>
                    <th>Điểm trả TC (đơn/ điểm)</th>
                    <th>Lương tạm tính</th>
                    <th>Chi tiết</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in loadTable">
                    <td>{{item.date}}</td>
                    <td>{{item.formula}}</td>
                    <td><b-badge variant="outline-success">{{item.username}}</b-badge></td>
                    <td>{{item.totalRefund}}</td>
                    <td>
                        {{item.totalOrderPick}}/ {{item.totalPick}}
                    </td>
                    <td>
                        {{item.totalOrderReturn}}/ {{item.totalReturn}}
                    </td>
                    <td><strong v-numeral>{{item.totalSalary}}</strong> VNĐ</td>
                    <td>
                        <b-btn variant="outline-primary borderless icon-btn" class="btn-xs" @click="detailSalary(index)">
                            <i class="d-block fas fa-tasks"></i>
                        </b-btn>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import debounce from 'debounce'
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'
import BlockUI from 'vue-blockui'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
Vue.use(BlockUI)
export default {
  name: 'ctv-checkSalary',
  metaInfo: {
    title: 'Check lương CTV'
  },
  data () {
    return {
      showModal: true,
      asyncFound: [],
      asyncLoading: false,
      asyncTimeout: null,
      asyncSelected: [],
      message: 'Nhập ít nhất 2 ký tự',
      from: new Date(),
      to: new Date(),
      dataTable: [],
      dataDetail: [],
      configDetail: [],
      loadingButton: false,
      sumTotal: 0
    }
  },
  components: {
    Multiselect,
    debounce,
    SalaryService,
    Datepicker,
    flatPickr,
    moment,
    commonHelper,
    LaddaBtn
  },
  computed: {
    loadTable () {
      return this.dataTable
    },
    loadDataDetail () {
      return this.dataDetail
    },
    sumSalary () {
      return this.sumTotal
    }
  },
  created () {
    // this.checkConfig()
  },
  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      SalaryService.searchCtvCod({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500),
    checkConfig () {
      if (this.from > this.to) {
        return commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'warning')
      }
      if (this.asyncSelected.length === 0) {
        return commonHelper.showMessage('Username không được bỏ trống', 'warning')
      }
      let parmas = {
        userId: this.asyncSelected.id,
        from: moment(this.from).format('YYYY-MM-DD'),
        to: moment(this.to).format('YYYY-MM-DD')
      }
      this.loadingButton = true
      SalaryService.checkConfigByUserCtv(parmas).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataTable = response.data.data
            this.totalSalary()
            return commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
          } else {
            return commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
      }).then(() => {
        this.loadingButton = false
      })
    },
    totalSalary () {
      var total = 0
      this.dataTable.forEach(element => (total = total + element.totalSalary))
      this.sumTotal = total
    },
    detailSalary (index) {
      this.dataDetail = []
      this.dataDetail = this.dataTable[index]
      this.$bvModal.show('modal-1')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
