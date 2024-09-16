<template>
  <div>
    <create-config
      :edit-config="editConfig"
      @resetForm="resetForm()"
      @afterCreatedConfig="afterCreatedConfig()"
      :is-created-config="isCreateConfig"
    />
    <b-card no-body>
      <b-card-body>
        <div class="ui-block mb-4">
          <h1
            style="display: inline-flex"
            class="ui-block-heading"
          >Thông tin quản lý chia bao</h1>
          <b-btn variant="success" @click="createConfig()" style="float: right;">
            <i class="fa fa-plus-circle"></i>
            Tạo mới
          </b-btn>
          <hr />
        </div>
        <b-row class="justify-content-md-center mb-2">
          <b-col md="4">
            <b-form-group label="Chọn kho:">
              <multiselect
                class="multiselect-info"
                :options="listStations"
                :multiple="true"
                v-model="filter.src_st_id"
                placeholder="Chọn Kho"
                label="name"
                track-by="id"
                :close-on-select="false"
                :preserve-search="true"
                :hide-selected="true"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Chọn username:">
              <select-user @model="handleUserSelected($event)" :resetUserSelected="resetUserSelected" :station-ids="stationIds"></select-user>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Chọn ngày có hiệu lực:">
              <datepicker
                placeholder="Chọn ngày có hiệu lực"
                v-model="filter.date"
                class="from-date"
                :format="customFormatter"
                :bootstrapStyling="true"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-4 mb-5 d-flex justify-content-center">
          <b-col md="1">
            <b-button variant="outline-info" @click="getConfigByConditions(false)">
              <i class="sidenav-icon ion ion-md-search"></i>
              Tìm kiếm
            </b-button>
          </b-col>
          <b-col md="1">
            <b-button variant="outline-danger" @click="resetFilter">
              <i class="sidenav-icon ion ion-ios-remove-circle"></i>
              Reset filter
            </b-button>
          </b-col>
        </b-row>
        <!-- Bang hien thi cac config -->
        <div v-if="pageAppLoading" class="sk-circle sk-primary">
          <div class="sk-circle1 sk-child"></div>
          <div class="sk-circle2 sk-child"></div>
          <div class="sk-circle3 sk-child"></div>
          <div class="sk-circle4 sk-child"></div>
          <div class="sk-circle5 sk-child"></div>
          <div class="sk-circle6 sk-child"></div>
          <div class="sk-circle7 sk-child"></div>
          <div class="sk-circle8 sk-child"></div>
          <div class="sk-circle9 sk-child"></div>
          <div class="sk-circle10 sk-child"></div>
          <div class="sk-circle11 sk-child"></div>
          <div class="sk-circle12 sk-child"></div>
        </div>
        <table v-else id="my-table" class="table b-table table-bordered table-striped">
          <thead>
          <tr class="text-primary">
            <th class="text-center">#</th>
            <th class="text-center">Username</th>
            <th class="text-center">Fullname</th>
            <th class="text-center">Kho nguồn</th>
            <th class="text-center">Ca làm</th>
            <th class="text-center">Thời gian hiệu lực</th>
            <th class="text-center">Tỉnh đích</th>
            <th class="text-center"><i class="fa fa-cogs"/></th>
          </tr>
          </thead>
          <tbody v-for="(data, index) in dataGroupConfig" :key="index">
          <tr class="table-light">
            <td class="text-center">{{index + (currentPage-1)*perPage}}</td>
            <td class="text-center">{{data.username}}</td>
            <td class="text-center">{{data.fullname}}</td>
            <td class="text-center">{{data.station_name}}</td>
            <td class="text-center">
              <b-button-group size="sm" class="mb-2">
                <b-button variant="outline-success">Bắt đầu : {{data.ws_begin_datetime}}</b-button>
                <b-button variant="outline-danger">Kết thúc : {{data.ws_end_datetime}}</b-button>
              </b-button-group>
            </td>
            <td class="text-center">
              <b-button-group size="sm" class="mb-2">
                <b-button variant="outline-success">Bắt đầu : {{data.from_date}}</b-button>
                <b-button variant="outline-danger">Kết thúc : {{data.to_date || '~'}}</b-button>
              </b-button-group>
            </td>
            <td class="text-center">
              <ListView
                :options="data.list_province.map(e => e.province_name)"
              />
            </td>
            <td class="text-center">
              <b-button size="sm" variant="outline-success" @click="updateConfig(data)">
                <i class="fa fa-pencil-alt"/>
              </b-button>
              <b-button size="sm" variant="outline-danger" @click="deleteConfig(data.id)">
                <i class="fa fa-window-close"/>
              </b-button>
            </td>
          </tr>
          </tbody>
        </table>
        <!--        phan trang-->
        <b-row class="d-flex justify-content-center">
          <b-pagination
            :total-rows="totalItems"
            v-model="currentPage"
            :per-page="perPage"
            v-on:input="getConfigByConditions(true)"
          />
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import CreateConfig from './Component/createConfig'
import SelectUser from './Component/SelectUser'
import VueMonthlyPicker from 'vue-monthly-picker'
import ListView from './Component/ListView'
import VCalendar from 'v-calendar'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CompanyProfileService from 'domain/services/company-profile-service'
import Moment from 'moment'
import cycleTime from 'infrastructures/helpers/date.js'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'BagConfig',
  components: {
    CreateConfig,
    VueMonthlyPicker,
    ListView,
    VCalendar,
    Multiselect,
    SelectUser,
    Datepicker
  },
  mounted () {
    this.getListStations()
    this.getStartEndFromTimeRange()
    this.getConfigByConditions()
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    stationIds () {
      if (this.filter.src_st_id !== null && this.filter.src_st_id.length !== 0) {
        return this.filter.src_st_id.map(e => e.id)
      } else {
        return this.listStations.map(e => e.id)
      }
    }
  },
  data: () => ({
    filter: {
      username: null,
      user_id: null,
      src_st_id: null,
      date: null
    },
    idDelete: null,
    range_time: null,
    time_format: null,
    deleting: false,
    lastRequest: {},
    pageAppLoading: false,
    listCollapse: [],
    // danh sach cac o duoc tich
    editConfig: null,
    isCreateConfig: false,
    visible: false,
    station: null,
    listStations: [],
    stationSearch: null,
    provinceSearch: null,
    filterConfig: '',
    isLoading: false,
    totalItems: 0,
    perPage: 5,
    currentPage: 1,
    dataGroupConfig: [],
    resetUserSelected: false
  }),
  watch: {
    range_time: function () {
      this.getStartEndFromTimeRange()
    }
  },
  methods: {
    customFormatter (date) {
      return Moment(date).format('DD-MM-YYYY')
    },
    handleUserSelected (event) {
      this.filter.user_id = event ? event.map((item) => item.id) : null
    },
    getStartEndFromTimeRange () {
      if (!this.range_time) {
        let startYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('YYYY'))
        let startMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('MM')) - 1
        let startDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('DD'))

        let endYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('YYYY'))
        let endMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('MM')) - 1
        let endDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('DD'))

        this.range_time = {
          start: new Date(startYear, startMonth, startDay),
          end: new Date(endYear, endMonth, endDay)
        }

        this.time_format = {
          from: cycleTime.daysInThisMonth(21, 20).from,
          to: cycleTime.daysInThisMonth(21, 20).to
        }
        return true
      }
      this.time_format = {
        from: Moment(this.range_time.start, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        to: Moment(this.range_time.end, 'DD-MM-YYYY').format('YYYY-MM-DD')
      }
    },

    createConfig () {
      this.isCreateConfig = true
      this.$bvModal.show('create-config')
    },

    resetForm: function () {
      this.editConfig = null
    },

    afterCreatedConfig: function () {
      this.reUpdateConfig()
    },

    async getListStations () {
      try {
        let res = await CompanyProfileService.getListStationBagConfig()
        this.listStations = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    async deleteConfig (id) {
      try {
        let res = await CompanyProfileService.deleteBagConfigById(id)
        if (res.data.success) {
          // update config
          await this.reUpdateConfig()
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    async getConfigByConditions (useLastRequest = false) {
      this.pageAppLoading = true

      try {
        // tach ra ngay bat dau va ngay ket thuc
        // let from = this.time_format['from']
        // let to = this.time_format['to']

        let station = null
        if (this.filter.src_st_id !== null) {
          station = this.filter.src_st_id.map(e => e.id)
        }

        let dataSend = {
          // from_date: from,
          // to_date: to,
          src_st_id: station,
          date: this.filter.date || null,
          user_id: this.filter.user_id || null,
          username: this.filter.username || null,
          per_page: this.perPage
        }

        if (useLastRequest) {
          dataSend = this.lastRequest
          dataSend.page = this.currentPage
        } else {
          this.currentPage = 1
        }
        this.lastRequest = dataSend
        let result = await CompanyProfileService.getListBagConfig(dataSend)

        if (result.data.success === false) {
          this.resetDataGroupConfig()
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          this.saveToDataGroupConfig(result)
          // commonHelper.showMessage(result.data.message, 'success')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
      this.pageAppLoading = false
    },

    reUpdateConfig () {
      this.getConfigByConditions(true)
    },

    resetFilter () {
      this.filter = {
        src_st_id: null,
        user_id: null,
        username: null,
        date: null
      }
      this.resetUserSelected = !this.resetUserSelected
    },

    resetDataGroupConfig () {
      this.dataGroupConfig = []
      this.totalItems = 0
    },

    updateConfig (data) {
      this.editConfig = data
      this.isCreateConfig = false
      this.$bvModal.show('create-config')
    },

    saveToDataGroupConfig (result) {
      this.dataGroupConfig = []

      this.totalItems = result.data.total
      this.dataGroupConfig = result.data.data
    }

  }
}
</script>
