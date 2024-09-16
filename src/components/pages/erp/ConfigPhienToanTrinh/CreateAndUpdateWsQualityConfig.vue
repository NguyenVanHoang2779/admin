<template>
  <div>
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
    <b-card v-else id="ws-config" class="mb-3" no-body>
      <b-card-body>
        <h3 class="text-success"><i class="fa fa-cog"></i> Tạo mới - Cập nhật phiên toàn trình</h3>
        <b-row>
          <b-col md="3">
            <b-form-group label="Chọn kho : (*)">
              <multiselect
                class="multiselect-secondary"
                v-model="dataSend.station"
                :options="listStationsLV"
                placeholder="Chọn kho"
                selectLabel="Chọn"
                track-by="name"
                label="name"
                :searchable="true"
                :multiple="false"
                :hide-selected="true"
                :close-on-select="true"
              ></multiselect>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Loại config (*):">
              <b-form-select v-model="dataSend.config_type" :options="options.config_type" :required="true"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Phương thức vận chuyển (*):">
              <b-form-select v-model="dataSend.transport" :options="options.transport" :required="true"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Loại hàng (*):">
              <b-form-select v-model="dataSend.type" :options="options.type" :required="true"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
<!--          Chọn tỉnh đích/Kho đích-->
        <b-row>
          <b-col md="4">
            <b-form-group label="Kho/Tỉnh đích (*):">
              <multiselect
                v-if="dataSend.config_type === 'station'"
                class="multiselect-secondary"
                v-model="dataSend.list_station"
                :options="listStations"
                placeholder="Chọn kho đích"
                selectLabel="Chọn"
                track-by="name"
                label="name"
                :searchable="true"
                :multiple="true"
                :hide-selected="true"
                :close-on-select="false"
              ></multiselect>

              <multiselect
                v-else
                class="multiselect-secondary"
                v-model="dataSend.list_province"
                :options="listProvinces"
                placeholder="Chọn tỉnh đích"
                selectLabel="Chọn"
                track-by="name"
                label="name"
                :searchable="true"
                :multiple="true"
                :hide-selected="true"
                :close-on-select="false"
              ></multiselect>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Chọn ngày có hiệu lực (*):">
              <datepicker
                placeholder="Chọn ngày có hiệu lực"
                v-model="dataSend.from_date"
                class="from-date"
                :format="customFormatter"
                :bootstrapStyling="true"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Chọn ngày hết hiệu lực:">
              <datepicker
                placeholder="Chọn ngày hết hiệu lực"
                v-model="dataSend.to_date"
                class="to-date"
                :format="customFormatter"
                :bootstrapStyling="true"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <div class="text-right w-100">
            <b-button class="mb-2 mt-5 mr-3" variant="secondary" @click="redirectToView">
              Xem các config đã tạo <i class="fa fa-eye"/>
            </b-button>
            <b-button class="mb-2 mt-5 mr-3" variant="success" @click="addNewWsConfigDetail">
              Thêm phiên xuất nhập  <i class="fa fa-plus-circle"/>
            </b-button>
            <hr>
          </div>
        </b-row>
        <div v-for="(data, index) in dataSend.list_config_detail">
          <create-ws-config-detail
            :data-config-detail="data"
            :index="index"
            @onChangeConfigDetail="onChangeConfigDetail($event)"
            @deleteConfigDetail="deleteConfigDetail($event)"
          ></create-ws-config-detail>
          <hr>
        </div>
        <div class="text-center mt-5">
          <b-button class="mb-5" variant="success" @click="createOrUpdateConfig">
            Lưu và xem kết quả <i class="fa fa-save"/>
          </b-button>
        </div>
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CompanyProfileService from 'domain/services/company-profile-service'
import CreateWsConfigDetail from './Component/CreateWsConfigDetail'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'

export default {
  name: 'CreateAndUpdateWsQualityConfig',
  components: {
    Multiselect,
    CreateWsConfigDetail,
    Datepicker
  },
  async mounted () {
    await this.getListStationsLV()
    await this.getListStations()
    await this.getListProvinces()
    if (this.$route.params.hasOwnProperty('id')) {
      let config = await this.getConfigById(this.$route.params.id)

      this.isUpdateConfig = true

      this.dataSend.list_config_detail = config.list_config_detail
      this.dataSend.id = config.id
      this.dataSend.config_type = config.config_type
      this.dataSend.transport = config.transport
      this.dataSend.type = config.type

      this.dataSend.station = this.listStationsLV.filter(e => +e.id === +config.station_id)[0]
      if (config.config_type === 'station') {
        this.dataSend.list_station = config.list_station
      } else {
        this.dataSend.list_province = config.list_province
      }

      this.dataSend.from_date = config.from_date
      this.dataSend.to_date = config.to_date
    }
    this.pageAppLoading = false
  },
  data: () => {
    return {
      pageAppLoading: true,
      isUpdateConfig: false,
      listStationsLV: [],
      listStations: [],
      listProvinces: [],
      options: {
        config_type: [
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
            value: 'sorting',
            text: 'sorting'
          },
          {
            value: 'transit',
            text: 'transit'
          }
        ]
      },
      dataSend: {
        station: null,
        config_type: 'station',
        transport: 'fly',
        type: 'sorting',
        list_province: [],
        list_station: [],
        list_config_detail: [],
        from_date: null,
        to_date: null
      }
    }
  },
  methods: {
    customFormatter (date) {
      return Moment(date).format('DD-MM-YYYY')
    },
    async getListStationsLV () {
      try {
        let res = await SalaryService.getListLvAndNvStation()
        this.listStationsLV = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
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

    addNewWsConfigDetail () {
      let newConfig = {
        'ws_type_id': 0,
        'ws_config_type': 1,
        'ws_start_import': '00:00:00',
        'ws_finish_import': '00:00:00',
        'ws_export': '00:00:00'
      }
      this.dataSend.list_config_detail.push(newConfig)
    },

    onChangeConfigDetail (data) {
      let indexConfig = data.index
      if (this.dataSend.hasOwnProperty('id')) {
        data.data.id = this.dataSend.list_config_detail[data.index].id
      }
      this.dataSend.list_config_detail[indexConfig] = data.data
    },

    deleteConfigDetail (data) {
      this.dataSend.list_config_detail.splice(data, 1)
    },

    formatDataSend () {
      this.dataSend.list_station_id = this.dataSend.list_station.map(e => {
        return {station_id: e.id}
      })

      this.dataSend.from_date = Moment(this.dataSend.from_date).format('YYYY-MM-DD')
      if (this.dataSend.to_date) {
        this.dataSend.to_date = Moment(this.dataSend.to_date).format('YYYY-MM-DD')
      }

      this.dataSend.list_province_id = this.dataSend.list_province.map(e => {
        return {province_id: e.id}
      })
      this.dataSend.station_id = this.dataSend.station.id

      this.dataSend.list_config_detail.forEach(e => {
        if (e.ws_start_import.length === 5) {
          e.ws_start_import += ':00'
        }

        if (e.ws_finish_import.length === 5) {
          e.ws_finish_import += ':00'
        }

        if (e.ws_export.length === 5) {
          e.ws_export += ':00'
        }
      })
    },

    validateDataSend () {
      if (this.dataSend.station === null) {
        commonHelper.showMessage('Chưa chọn kho liên vùng')
        return false
      }
      if (this.dataSend.from_date === null) {
        commonHelper.showMessage('Chưa chọn ngày có hiệu lực')
        return false
      }
      if (this.dataSend.config_type === 'station' && this.dataSend.list_station.length === 0) {
        commonHelper.showMessage('Chưa chọn kho đích')
        return false
      }
      if (this.dataSend.config_type === 'province' && this.dataSend.list_province.length === 0) {
        commonHelper.showMessage('Chưa chọn tỉnh đích')
        return false
      }

      let isTimeValid1 = true
      let isTimeValid2 = true
      // check time export voi time finish
      this.dataSend.list_config_detail.forEach(e => {
        if (+e.ws_config_type === 0) {
          if (e.ws_finish_import > e.ws_export) {
            isTimeValid1 = false
          }
        }
        if (e.ws_start_import > e.ws_finish_import && e.ws_finish_import !== '00:00' && e.ws_finish_import !== '00:00:00') isTimeValid2 = false
      })
      if (!isTimeValid1) commonHelper.showMessage('Với config ca trong ngày thì thời gian xuất phải lớn hơn thời gian nhập ')
      if (!isTimeValid2) commonHelper.showMessage('Thời gian bắt đầu nhập phải bé hơn thời gian kết thúc nhập')
      return (isTimeValid1 && isTimeValid2)
    },

    async createOrUpdateConfig () {
      if (this.validateDataSend()) {
        this.formatDataSend()
        try {
          let res = null
          if (!this.isUpdateConfig) {
            res = await CompanyProfileService.createWsQualityConfig(this.dataSend)
          } else {
            res = await CompanyProfileService.updateWsQualityConfig(this.dataSend)
          }
          // this.resetDataSend()
          if (!res.data.success) {
            commonHelper.showMessage(res.data.message)
          } else {
            commonHelper.showMessage('Lưu config thành công', 'success')
            this.redirectToView()
          }
        } catch (e) {
          commonHelper.showMessage('Không tạo/lưu được config')
        }
      }
    },

    resetDataSend () {
      this.dataSend = {
        station: null,
        config_type: 'station',
        transport: 'fly',
        type: 'sorting',
        list_province: [],
        list_station: [],
        list_config_detail: [],
        from_date: null,
        to_date: null
      }
    },

    async getConfigById (id) {
      let res = await CompanyProfileService.getWsQualityConfigById({id: id})
      return res.data.data
    },

    redirectToView () {
      this.$router.push({
        name: 'ws-quality-config'
      })
    }

  }
}
</script>

<style scoped>

</style>
