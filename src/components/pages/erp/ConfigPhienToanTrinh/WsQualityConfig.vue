<template>
  <div>
    <b-modal id="ws-config-detail" modal-class="modal-md" hide-footer>
      <ws-config-detail
        :list-config-detail="currentWsConfigDetail"
      ></ws-config-detail>
    </b-modal>
    <b-card no-body>
      <b-card-body>
        <div class="ui-block mb-4">
          <h1
            style="display: inline-flex"
            class="ui-block-heading text-success"
          >Quản lý phiên toàn trình</h1>
          <b-btn variant="success" @click="createConfig()" style="float: right;">
            <i class="fa fa-plus-circle"></i>
            Tạo mới
          </b-btn>
          <hr />
        </div>
        <b-row class="justify-content-md-center mb-2">
          <b-col md="3">
            <b-form-group label="Loại config:">
              <b-form-select v-model="filter.config_type" :options="options.config_type"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Phương thức vận chuyển:">
              <b-form-select v-model="filter.transport" :options="options.transport"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Loại hàng:">
              <b-form-select v-model="filter.type" :options="options.type"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
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

        <b-row class="justify-content-md-center mb-2">
          <b-col md="4">
            <b-form-group label="Chọn kho :">
              <multiselect
                class="multiselect-secondary"
                v-model="filter.station_ids"
                :options="listStationsLV"
                placeholder="Chọn kho"
                selectLabel="Chọn"
                track-by="name"
                label="name"
                :searchable="true"
                :multiple="true"
                :hide-selected="true"
                :close-on-select="true"
              ></multiselect>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Chọn kho đích:">
              <multiselect
                class="multiselect-secondary"
                v-model="filter.list_station"
                :options="listStations"
                placeholder="Chọn kho đích"
                selectLabel="Chọn"
                track-by="name"
                label="name"
                :searchable="true"
                :multiple="true"
                :hide-selected="true"
                :close-on-select="true"
              ></multiselect>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Chọn tỉnh đích:">
              <multiselect
                class="multiselect-secondary"
                v-model="filter.list_province"
                :options="listProvinces"
                placeholder="Chọn tỉnh đích"
                selectLabel="Chọn"
                track-by="name"
                label="name"
                :searchable="true"
                :multiple="true"
                :hide-selected="true"
                :close-on-select="true"
              ></multiselect>
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
          <thead class="thead-light">
          <tr class="text-primary">
            <th class="text-center">#</th>
            <th class="text-center">Kho</th>
            <th class="text-center">Loại config</th>
            <th class="text-center">PTVC</th>
            <th class="text-center">Loại hàng</th>
            <th class="text-center">DS Kho/Tỉnh đích</th>
            <th class="text-center">Danh sách các ca</th>
            <th class="text-center">Thời gian hiệu lực</th>
            <th class="text-center">Tạo bởi</th>
            <th class="text-center"><i class="fa fa-cogs"/></th>
          </tr>
          </thead>
          <tbody v-for="(data, index) in dataGroupConfig" :key="index">
          <tr class="">
            <td class="text-center">{{index + (currentPage-1)*perPage}}</td>
            <td class="text-center">{{data.station_name}}</td>
            <td class="text-center">{{data.config_type | filterConfigType}}</td>
            <td class="text-center">{{data.transport | filterTransportType}}</td>
            <td class="text-center">{{data.type}}</td>
            <td class="text-center">
              <ListView
                v-if="data.config_type === 'station'"
                :options="data.list_station.map(e => e.name)"
              />
              <ListView
                v-else
                :options="data.list_province.map(e => e.name)"
              />
            </td>
            <td class="text-center">
              <b-button size="sm" variant="outline-info" @click="viewWsConfigDetail(data.list_config_detail)">
                Bấm vào đây để xem  <i class="fa fa-eye"/>
              </b-button>
            </td>
            <td class="text-center">
              <b-button-group size="sm" class="mb-2">
                <b-button variant="outline-success">Bắt đầu : {{data.from_date}}</b-button>
                <b-button variant="outline-danger">Kết thúc : {{data.to_date || '~'}}</b-button>
              </b-button-group>
            </td>
            <td class="text-center">{{"Tạo lúc " + data.created + " bởi "}} <span class="text-primary">{{data.created_by}}</span></td>
            <td class="text-center">
              <b-button size="sm" variant="outline-success" @click="updateConfig(data.id)">
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
import VueMonthlyPicker from 'vue-monthly-picker'
import ListView from './Component/ListView'
import VCalendar from 'v-calendar'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CompanyProfileService from 'domain/services/company-profile-service'
import Moment from 'moment'
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import WsConfigDetail from './Component/WsConfigDetail'
import SalaryService from 'domain/services/salary-service'

export default {
  name: 'WsQualityConfig',
  components: {
    VueMonthlyPicker,
    ListView,
    VCalendar,
    Multiselect,
    Datepicker,
    WsConfigDetail
  },
  mounted () {
    this.getListStationsLV()
    this.getConfigByConditions()
    this.getListStations()
    this.getListProvinces()
  },
  filters: {
    filterConfigType: (value) => {
      if (!value) return ''
      switch (value) {
        case 'province': return 'Theo tỉnh'
        case 'station': return 'Theo kho'
        default: return 'Không xác định'
      }
    },
    filterTransportType: (value) => {
      if (!value) return ''
      switch (value) {
        case 'fly': return 'Đường không'
        case 'road': return 'Đường bộ'
        default: return 'Không xác định'
      }
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  data: () => ({
    filter: {
      station_ids: null,
      config_type: null,
      transport: null,
      list_station: null,
      list_province: null,
      type: null,
      date: null
    },
    options: {
      config_type: [
        {
          value: null,
          text: 'Tất cả'
        },
        {
          value: 'station',
          text: 'Theo kho'
        },
        {
          value: 'province',
          text: 'Theo tỉnh'
        }
      ],
      transport: [
        {
          value: null,
          text: 'Tất cả'
        },
        {
          value: 'fly',
          text: 'Đường không'
        },
        {
          value: 'road',
          text: 'Đường bộ'
        }
      ],
      type: [
        {
          value: null,
          text: 'Tất cả'
        },
        {
          value: 'sorting',
          text: 'sorting'
        },
        {
          value: 'transit',
          text: 'transit'
        }
      ]
    },
    currentWsConfigDetail: null,
    idDelete: null,
    range_time: null,
    time_format: null,
    deleting: false,
    lastRequest: {},
    pageAppLoading: false,
    listCollapse: [],
    // danh sach cac o duoc tich
    station: null,
    listStations: [],
    listProvinces: [],
    isLoading: false,
    totalItems: 0,
    perPage: 5,
    currentPage: 1,
    dataGroupConfig: [],
    listStationsLV: []
  }),
  watch: {
    range_time: function () {
      this.getStartEndFromTimeRange()
    }
  },
  methods: {
    async getListStationsLV () {
      try {
        let res = await SalaryService.getListLvAndNvStation()
        this.listStationsLV = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },
    customFormatter (date) {
      return Moment(date).format('DD-MM-YYYY')
    },
    handleUserSelected (event) {
      this.filter.user_id = event ? event.map((item) => item.id) : null
    },

    viewWsConfigDetail (data) {
      this.currentWsConfigDetail = data
      this.$bvModal.show('ws-config-detail')
    },

    createConfig () {
      this.$router.push({
        name: 'create-ws-quality-config'
      })
    },

    resetForm: function () {
      this.editConfig = null
    },

    afterCreatedConfig: function () {
      this.reUpdateConfig()
    },

    async getListStations () {
      try {
        let res = await CompanyProfileService.getListStations()
        this.listStations = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    async getListProvinces () {
      CompanyProfileService.getListProvinceBagConfig().then(res => {
        if (!res.data.success) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách tỉnh!')
        else this.listProvinces = res.data.data
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh'))
    },

    async deleteConfig (id) {
      if (!confirm('Bạn có chắc chắn xoá không?')) return
      try {
        let res = await CompanyProfileService.deleteWsQualityConfig({id: id})
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
        let dataSend = {
          per_page: this.perPage
        }

        if (this.filter.station_ids !== null) {
          dataSend.station_ids = this.filter.station_ids.map(e => e.id)
        }
        if (this.filter.config_type !== null) {
          dataSend.config_type = this.filter.config_type
        }
        if (this.filter.type !== null) {
          dataSend.type = this.filter.type
        }
        if (this.filter.transport !== null) {
          dataSend.transport = this.filter.transport
        }

        if (this.filter.list_station && this.filter.list_station.length > 0) {
          dataSend.list_station = this.filter.list_station.map(e => e.id)
        }

        if (this.filter.list_province && this.filter.list_province.length > 0) {
          dataSend.list_province = this.filter.list_province.map(e => e.id)
        }

        if (useLastRequest) {
          dataSend = this.lastRequest
          dataSend.page = this.currentPage
        } else {
          this.currentPage = 1
        }
        this.lastRequest = dataSend
        let result = await CompanyProfileService.getListWsQualityConfig(dataSend)

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
        station_ids: null,
        config_type: null,
        transport: null,
        type: null,
        list_province: null,
        list_station: null,
        date: null
      }
    },

    resetDataGroupConfig () {
      this.dataGroupConfig = []
      this.totalItems = 0
    },

    updateConfig (data) {
      this.editConfig = data
      this.isCreateConfig = false
      this.$router.push({
        name: 'create-ws-quality-config',
        params: {
          id: data
        }
      })
    },

    saveToDataGroupConfig (result) {
      this.dataGroupConfig = []

      this.totalItems = result.data.total
      this.dataGroupConfig = result.data.data
    }

  }
}
</script>
