<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
      <div>Quản lý phạt tài xế xe thuê</div>
    </h4>
    <b-card class="mb-1">
      <div class="row mb-2">
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Nhà cung cấp:</label>
              </b-col>
              <b-col sm="9">
                <select-manage-driver-rent-truck @model="searchData.selectServiceProvider = $event"></select-manage-driver-rent-truck>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Tuyến xe:</label>
              </b-col>
              <b-col sm="9">
                <select-route-driver @model="searchData.selectRouteDriver = $event"></select-route-driver>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Kho quản lý tuyến:</label>
              </b-col>
              <b-col sm="9">
                <selected-station @model="searchData.selectStationRoute = $event" :station-id="createdStation"
                                  @dataReady="dataReady"></selected-station>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Loại phạt:</label>
              </b-col>
              <b-col sm="9">
                <select-type-penalty @model="searchData.selectTypePenalty = $event"></select-type-penalty>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Trạng thái:</label>
              </b-col>
              <b-col sm="9">
                <select-status-penalty @model="searchData.selectStatusPenalty = $event"></select-status-penalty>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Loại thẻ phạt:</label>
              </b-col>
              <b-col sm="9">
                <select-card-penalty @model="searchData.selectCardPenalty = $event"></select-card-penalty>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Từ ngày:</label>
              </b-col>
              <b-col sm="9">
                <datepicker
                  v-model="searchData.from"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder=""
                />
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Đến ngày:</label>
              </b-col>
              <b-col sm="9">
                <datepicker
                  v-model="searchData.to"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder=""
                />
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic"></label>
              </b-col>
              <b-col sm="9" class="row p-0 m-0">
                <b-col sm="6" md="12" lg="12" xl="6" class="mb-1 d-flex justify-content-end col-6">
                  <ladda-btn :loading="loading.search" @click.native="handleSearch" data-style="zoom-out"
                             class="btn btn-success w-200px">
                    <i class="ion ion-md-search"></i> Tìm kiếm
                  </ladda-btn>
                </b-col>
                <b-col sm="6" md="12" lg="12" xl="6" class="d-flex justify-content-end col-6">
                  <b-button v-if="page.totalItems > 10000" @click="showAlert" class="mb-1 btn btn-info w-200px">
                    <i class="fas fa-download"></i> Xuất dữ liệu
                  </b-button>
                  <b-button v-else :href="linkApiExport" class="mb-1 btn btn-info w-200px">
                    <i class="fas fa-download"></i> Xuất dữ liệu
                  </b-button>
                </b-col>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </b-card>

    <!--    Kết quả-->
    <b-card v-loading="loading.search" class="mb-4">
      <b-row class="mb-2">
        <b-col>
          Mỗi trang:
          <b-select size="sm" @input="getDataPenalties" v-model="page.perPage" :options="[20, 50, 100]" class="d-inline-block w-auto" />
        </b-col>
        <b-col class="col-sm text-sm-left text-center">
          <div class="row float-right">
            <div class="d-flex">
              <button class="btn-next" @click="handlePrevPage" :disabled="page.currentPage === 1">
                <i class="fas fa-angle-left"></i>
              </button>
              <button class="btn-primary btn-current-page" disabled>
                {{ page.currentPage }}
              </button>
              <button class="btn-next" @click="handleNextPage" :disabled="disabledNextPage">
                <i class="fas fa-angle-right"></i>
              </button>
            </div>
          </div>
        </b-col>
      </b-row>
      <table v-if="dataPenalties.length !== 0" v class="penalty-table table mb-0 table-sm">
        <tbody>
        <div v-for="(data, index) in dataPenalties" class="penalty-row">
          <tr class="d-inline-table w-100">
            <!--            Title phạt và lý do phạt-->
            <td style="width: 50%">
              <div class="row">
                <div class="col">
                  <h5><i class="ion ion-md-share-alt font-size-130-percent"></i><b>&nbsp;{{ data.id }}/{{ data.type_name }} ({{data.date}})</b></h5>
                </div>
                <div class="col justify-content-end mt-1" style="max-width: max-content">
                  <b-badge variant="outline-danger" v-if="data.status === '0'">Đã chốt phạt</b-badge>
                  <b-badge variant="outline-success" v-if="data.status === '1'">Đã chốt bỏ phạt</b-badge>
                  <b-badge variant="outline-info" v-if="data.status === '2'">Đề xuất bỏ phạt</b-badge>
                </div>
              </div>
              <div>
                <div v-if="data.info_packages">
                  <div v-for="pkg in data.info_packages">
                    <i class="fas fa-box-open"></i> <a :href="`https://admin.giaohangtietkiem.vn/admin?alias=` + pkg.pkg_order" target="_blank">{{ pkg.pkg_alias }}</a>
                  </div>
                </div>
                <div v-if="data.info_bags">
                  <div>
                    <i class="fas fa-box-open"></i> <a :href="`https://admin.giaohangtietkiem.vn/adm/manage-list-bag-box`" target="_blank">{{ data.info_bags.bag_order }}</a>
                  </div>
                </div>
                <!--              <div>{{data.pkg_info.shop_code}} - {{data.pkg_info.shop_name}}</div>-->
                <div class="mb-2">
                  <div v-for="line in data.reason.split('\n')">{{ line }}</div>
                </div>
                <div v-if="data.suggestion_logs">
                  <div v-for="log in data.suggestion_logs">
                    <div><span class="font-weight-bold font-italic">- {{log.created}} {{log.created_by}} đã gửi đề xuất bỏ phạt:</span> <span class="font-italic">{{log.content}}</span></div>
                    <!--                    <div v-for="line in log.content.split('\n')">{{ line }}</div>-->
                  </div>
                </div>
              </div>
            </td>
            <!--            Thông tin phạt-->
            <td style="width: 40%">
              <div class="row mb-1 pt-1">
                <!--                Thông tin người bị phạt-->
                <div class="col-md">
                  <i class="ion ion-ios-contact font-size-130-percent"></i>
                  <span>
                    {{ data.user_info.username }}/
                    {{ data.user_info.fullname }}/
                    <!--                  {{ data.user_info.tel }}/-->
                    {{ data.user_info.province_name }}/
                    {{ data.user_info.station_name }}/
                    {{ data.user_info.position_name }}
                  </span>
                </div>
                <div class="col-md">
                  <i class="ion ion-md-time font-size-130-percent"></i>
                  <span>
                    {{ data.created }} ({{ data.created_by }})
                  </span>
                </div>
              </div>
              <div v-if="data.is_editing">
                <div>
                  <div class="penalty-money d-inline-flex">
                    <span class="mt-1">Phạt thẻ:&nbsp;</span>
                    <b-form-group class="mb-0 mt-1">
                      <b-form-radio-group v-model="data.card" name="radio-sub-component">
                        <b-form-radio plain value="red"><div class="penalty-card-red"></div></b-form-radio>
                        <b-form-radio plain value="yellow"><div class="penalty-card-yellow"></div></b-form-radio>
                        <b-form-radio plain value="white"><div class="penalty-card-white"></div></b-form-radio>
                        <b-form-radio plain value="grey"><div class="penalty-card-grey"></div></b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <div>
                      <b-btn variant="outline-danger borderless icon-btn" class="btn-sm" @click="data.card = null"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                  </div>
                </div>
<!--                <div>-->
<!--                  <div class="penalty-money d-inline-flex">-->
<!--                    <span class="mt-1">Phạt tiền:&nbsp;</span>-->
<!--                    <vue-numeric v-model="data.money" v-bind:minus="true" class="input-money" currency="VNĐ" currency-symbol-position="suffix" v-bind:max="0"></vue-numeric>-->
<!--                  </div>-->
<!--                </div>-->
              </div>
              <div v-else>
                <div class="d-inline-flex">
                  <div>
                    <div v-if="data.card" class="d-inline-flex mt-1 mb-1"><div class="font-weight-bold">Phạt thẻ: &nbsp;</div><div :class="`penalty-card-` + data.card"></div></div>
<!--                    <div v-if="data.money" class="penalty-money">Phạt tiền: <span :class="'text-' + (data.money < 0 ? 'danger' : 'success')"><span v-numeral v-text="data.money"></span> VNĐ</span></div>-->
                  </div>
                  <div class="d-flex ml-2">
                    <b-btn variant="outline-secondary borderless icon-btn" class="btn-sm" @click="editInfo(index)"><i class="ion ion-md-create"></i></b-btn>
                  </div>
                </div>
              </div>
              <div class="penalty-money mt-lg-2">
                <div>
                  <span class="pt-1 pr-5 border-top border-dark">TỔNG: <span :class="'text-' + (data.money + (cardMoney[data.card] ? cardMoney[data.card] : 0)  < 0 ? 'danger' : 'success')"><span v-numeral v-text="data.money + (cardMoney[data.card] ? cardMoney[data.card] : 0)"></span> VNĐ</span></span>
                </div>
              </div>
            </td>
            <!--            Action-->
            <td>
              <div v-if="data.is_editing">
                <div class="mb-1"><ladda-btn @click.native="savePenaltyData(index)" :disabled="data.loading_edit" data-style="zoom-out" class="btn btn-success w-100">Lưu chỉnh sửa</ladda-btn></div>
                <!--              <div class="mb-1"><custom-button :classBT="`button-custom-success`" @click.native="savePenaltyData(index)" :loading="data.loading_edit">Lưu chỉnh sửa</custom-button></div>-->
                <b-btn :disabled="data.loading_edit" @click="cancelEdit(index)" variant="outline-danger" class="mb-1 w-100">Hủy bỏ</b-btn>
              </div>
              <div v-else>
                <div v-if="data.status !== statusPenalty.approved.code" class="row m-1"><ladda-btn @click.native="showModalConfirm(index, statusPenalty.approved.code)" :disabled="data.loading_status" data-style="zoom-out" class="btn btn-danger w-100">{{statusPenalty.approved.name}}</ladda-btn></div>
                <div v-if="data.status !== statusPenalty.reject.code" class="row m-1"><ladda-btn @click.native="showModalConfirm(index, statusPenalty.reject.code)" :disabled="data.loading_status" data-style="zoom-out" class="btn btn-success w-100">{{statusPenalty.reject.name}}</ladda-btn></div>
                <div v-if="data.status !== statusPenalty.reject.code && data.status !== statusPenalty.suggest.code" class="row m-1"><ladda-btn @click.native="showModalConfirm(index, statusPenalty.suggest.code)" :disabled="data.loading_status" data-style="zoom-out" class="btn btn-secondary w-100">{{statusPenalty.suggest.name}}</ladda-btn></div>
              </div>
              <div class="row m-1"><b-btn @click="showLog(index)" variant="btn btn-outline-info" class="w-100">{{data.show_log ? 'Ẩn log' : 'Hiển thị log'}}</b-btn></div>
            </td>
          </tr>
          <penalty-log-tab v-if="data.show_log" :penalty_id="data.id"></penalty-log-tab>
        </div>
        </tbody>
      </table>
      <div v-else>Không có dữ liệu</div>
    </b-card>
    <b-modal ref="myModalRef" hide-footer static>
      <div class="d-block text-center">
        <h4>{{modalInfo.textNotify}}</h4>
      </div>
      <div role="group">
        <b-form-input
          ref="inputModal"
          id="input-live"
          v-model="modalInfo.note"
          placeholder="Nhập lý do"
          @keyup.enter="$refs.sendReply.click()"
          trim
        ></b-form-input>
      </div>
      <b-btn :disabled="loading.confirm" ref="sendReply" class="mt-3" variant="outline-primary" block @keyup.enter="changeStatus" @click="changeStatus">Xác nhận</b-btn>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import CustomButton from 'components/elements/common/CustomButton'
import PenaltyLogTab from './PenaltyLogTab'
import SelectManageDriverRentTruck from './SelectManageDriverRentTruck.vue'
import SelectStatusPenalty from './SelectStatusPenalty'
import SelectedStation from './SelectedStation.vue'
import SelectTypePenalty from './SelectTypePenalty'
import SelectCardPenalty from './SelectCardPenalty'
import cycleTime from 'infrastructures/helpers/date.js'
import { mapGetters } from 'vuex'
import SelectRouteDriver from './SelectRouteDriver.vue'

const cardMoney = {
  red: -500000,
  yellow: -200000,
  grey: 0,
  white: -50000
}

const statusPenalty = {
  approved: {code: '0', name: 'Xác nhận phạt'},
  reject: {code: '1', name: 'Xác nhận bỏ phạt'},
  suggest: {code: '2', name: 'Đề xuất bỏ phạt'}
}

export default {
  name: 'kpi-penalties',
  metaInfo: {
    title: 'Phạt thẻ'
  },

  components: {
    SelectRouteDriver,
    kpiPenaltyService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    moment,
    SingleSelectStation,
    CustomButton,
    PenaltyLogTab,
    SelectManageDriverRentTruck,
    SelectStatusPenalty,
    SelectTypePenalty,
    SelectedStation,
    cycleTime,
    SelectCardPenalty
  },
  data: () => ({
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      totalItems: 0
    },
    createdStation: null,
    searchData: {
      from: null,
      to: null,
      selectServiceProvider: [],
      selectStationRoute: [],
      selectStatusPenalty: [],
      selectCardPenalty: [],
      selectTypePenalty: [],
      selectRouteDriver: null
    },
    cardMoney: cardMoney,
    statusPenalty: statusPenalty,
    dataPenalties: [],
    backupData: [],
    modalInfo: {
      textNotify: '',
      note: ''
    },
    temp: {
      index: null,
      newVal: null
    },
    loading: {
      search: false,
      confirm: false
    },
    disabledNextPage: false
  }),

  watch: {
    userInfo: function (val, oldVal) {
      if (this.userInfo.hasOwnProperty('Station')) {
        this.createdStation = this.userInfo.Station.id
      }
    }
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    totalPages () {
      return Math.ceil(this.page.totalItems / this.page.perPage)
    },
    linkApiExport () {
      const url = `${location.protocol}//${location.host}/erp/penalties/apiExportDataPenaltiesToCsv`
      let dataSend = {
        from: this.searchData.from ? moment(new Date(this.searchData.from)).format('YYYY-MM-DD') : null,
        to: this.searchData.to ? moment(new Date(this.searchData.to)).format('YYYY-MM-DD') : null,
        types: this.searchData.selectTypePenalty,
        status: this.searchData.selectStatusPenalty,
        service_provider: this.searchData.selectServiceProvider,
        station_route: this.searchData.selectStationRoute,
        route_driver: this.searchData.selectRouteDriver,
        positions: 99,
        card: this.searchData.selectCardPenalty,
        limit: 10000
      }
      let paramsToString = ''
      for (let key in dataSend) {
        paramsToString = paramsToString + this.formatterParams(key, dataSend[key])
      }
      return url + '?' + paramsToString
    }
  },

  methods: {
    handleNextPage () {
      this.page.currentPage++
      this.getDataPenalties()
    },
    handlePrevPage () {
      if (this.page.currentPage === 1) return
      this.page.currentPage--
      this.getDataPenalties()
    },
    handleSearch () {
      this.page.currentPage = 1
      this.getDataPenalties()
    },
    showAlert () {
      commonHelper.showMessage('Dữ liệu thẻ xuất > 10000. Vui lòng liên hệ IT để được hỗ trợ.', 'error')
    },
    // show modal
    showModalConfirm (index, newVal) {
      this.modalInfo.note = ''
      if (newVal === statusPenalty.approved.code) this.modalInfo.textNotify = 'Bạn có chắc chắn muốn xác nhận phạt'
      if (newVal === statusPenalty.reject.code) this.modalInfo.textNotify = 'Bạn có chắc chắn muốn xác nhận bỏ phạt'
      if (newVal === statusPenalty.suggest.code) this.modalInfo.textNotify = 'Bạn có chắc chắn muốn tạo đề xuất bỏ phạt'
      this.temp.index = index
      this.temp.newVal = newVal
      this.$refs.myModalRef.show()
      setTimeout(() => { this.$refs.inputModal.focus() }, 0.01)
    },
    // Lấy thông tin phạt
    getDataPenalties () {
      let dataSend = {
        from: this.searchData.from ? moment(new Date(this.searchData.from)).format('YYYY-MM-DD') : null,
        to: this.searchData.to ? moment(new Date(this.searchData.to)).format('YYYY-MM-DD') : null,
        types: this.searchData.selectTypePenalty,
        status: this.searchData.selectStatusPenalty,
        service_provider: this.searchData.selectServiceProvider,
        station_route: this.searchData.selectStationRoute,
        route_driver: this.searchData.selectRouteDriver,
        positions: 99,
        card: this.searchData.selectCardPenalty,
        page: this.page.currentPage,
        limit: this.page.perPage
      }

      if (dataSend.from == null || dataSend.to == null) return commonHelper.showMessage('Không được để trống Ngày bắt đầu và Ngày kết thúc')
      if (moment(this.searchData.from).format('YYYY-MM-DD') > moment(this.searchData.to).format('YYYY-MM-DD')) return commonHelper.showMessage('Khoảng thời gian không hợp lệ')
      // Giới hạn thời gian from, to là 1 tháng
      if (moment(this.searchData.from).add(1, 'month').format('YYYY-MM-DD') < moment(this.searchData.to).format('YYYY-MM-DD')) return commonHelper.showMessage('Khoảng thời gian tìm kiếm không thể quá 1 tháng. Vui lòng liên hệ IT.')

      this.loading.search = true
      this.dataPenalties = []
      this.disabledNextPage = false
      kpiPenaltyService.apiGetDataPenalties(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            if (data.length === 0 || data.length < this.page.perPage) {
              this.disabledNextPage = true
            }
            for (const index in data) {
              data[index].loading_edit = data[index].loading_status = data[index].show_log = false
            }
            this.dataPenalties = data
            this.backupData = JSON.parse(JSON.stringify(data))
            this.$forceUpdate()
          } else {
            this.dataPenalties = []
            commonHelper.showMessage(response.data.message, 'error')
          }
        }
        if (response.data.general) {
          this.page.totalItems = response.data.general.total
        } else {
          this.page.totalItems = 0
        }
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi khi lấy dữ liệu phạt', 'error')
      }).then(() => {
        this.loading.search = false
      })
    },

    // Chỉnh sửa thông tin
    editInfo (index) {
      this.dataPenalties[index].is_editing = true
      this.$forceUpdate()
    },

    // Lưu thông tin chỉnh sủa
    savePenaltyData (index) {
      if (!confirm('Bạn có chắc muốn chỉnh sửa thông tin phạt')) return
      this.dataPenalties[index].loading_edit = true
      this.$forceUpdate()
      let dataSend = {
        id: this.dataPenalties[index].id,
        card: this.dataPenalties[index].card,
        money: this.dataPenalties[index].money
      }
      kpiPenaltyService.apiSavePenaltyData(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.dataPenalties[index].loading_edit = false
            this.dataPenalties[index].is_editing = false
            this.backupData = JSON.parse(JSON.stringify(this.dataPenalties))
            this.$forceUpdate()
          } else {
            commonHelper.showMessage(response.data.message, 'error')
            this.getDataPenalties()
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi thay đổi thông tin phạt', 'error')
        this.getDataPenalties()
      }).then(() => {
        this.dataPenalties[index].show_log = false
      })
    },

    // cancel chỉnh sửa
    cancelEdit (index) {
      this.dataPenalties[index] = this.backupData[index]
      this.dataPenalties[index].is_editing = false
      this.backupData = JSON.parse(JSON.stringify(this.dataPenalties))
      this.$forceUpdate()
    },

    // api đổi trạng thái
    changeStatus () {
      if (this.modalInfo.note === '' && this.temp.newVal === statusPenalty.suggest.code) {
        commonHelper.showMessage('Nhập lý do', 'error')
        return
      }
      let index = this.temp.index
      let newVal = this.temp.newVal
      this.dataPenalties[index].loading_status = true
      this.loading.confirm = true
      this.$forceUpdate()
      let dataSend = {
        id: this.dataPenalties[index].id,
        status: newVal,
        note: this.modalInfo.note
      }
      kpiPenaltyService.apiSavePenaltyData(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataPenalties[index].loading_status = false
            commonHelper.showMessage(response.data.message, 'success')
            this.dataPenalties[index].status = String(newVal)
            this.backupData = JSON.parse(JSON.stringify(this.dataPenalties))
          } else {
            commonHelper.showMessage(response.data.message, 'error')
            this.getDataPenalties()
          }
        }
      }).catch((e) => {
        commonHelper.showMessage(e)
        this.getDataPenalties()
      }).then(() => {
        this.loading.confirm = false
        this.$refs.myModalRef.hide()
        this.dataPenalties[index].show_log = false
        this.$forceUpdate()
      })
    },

    // show log
    showLog (index) {
      this.dataPenalties[index].show_log = !this.dataPenalties[index].show_log
      this.$forceUpdate()
    },
    formatterParams (key, params) {
      if (!params) return ''
      else if (typeof params === 'object') {
        if (params.length === 0) return ''
        else return key + '[]=' + params.join('&' + key + '[]=') + '&'
      } else return key + '=' + params + '&'
    },
    asignStation () {
      if (this.userInfo.hasOwnProperty('Station')) {
        this.createdStation = this.userInfo.Station.id
        this.searchData.selectStationPenalty = this.createdStation
      }
    },

    dataReady (data) {
      this.searchData.selectStationPenalty = [data]
      this.getDataPenalties()
    }
  },

  created () {
    let timeOption = cycleTime.getMonthSalaryByDate(moment().format('YYYY-MM-DD'))
    this.searchData.from = new Date(timeOption.from)
    this.searchData.to = new Date()
    this.asignStation()
  }
}
</script>
<style scoped lang="scss">
.btn-next {
  margin-right: 5px;
  border-radius: 5px;
  width: 25px;
  height: 25px;
  outline: none;
  background-color: transparent;
  color: #bbb;
  border: 1px solid #bbb;
  cursor: pointer;
}
.btn-current-page {
  margin-right: 5px;
  width: 25px;
  height: 25px;
  outline: none;
  border: 1px solid transparent;
  border-radius: 5px;
}
.btn-next:hover {
  background-color: #26B4FF;
  color: white;
  border: 1px solid transparent;
}
.btn-next:disabled {
  cursor: not-allowed;
  background-color: transparent;
  color: #bbb;
  border: 1px solid #bbb;
}
</style>
