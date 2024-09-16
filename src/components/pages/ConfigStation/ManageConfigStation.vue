<template>
  <div>
    <div class="ui-block">
      <b-form-row class="mb-1">
        <div class="col-md-6">
          <h4 class="ui-block-heading align-items-start">Config Kho</h4>
        </div>
        <div class="col-md-6">
          <b-btn class="float-right" type="button" variant="success" @click="addModal">
            <i class="sidenav-icon ion ion-md-add"></i> Thêm kho
          </b-btn>
        </div>
      </b-form-row>
      <div class="search-form">
        <form>
          <b-form-row>
            <div class="col-md-1">
              <label class="form-label">Tỉnh</label>
            </div>
            <div class="col-md-11">
              <b-form-group>
                <multiselect
                  v-model="selected.provinces"
                  :options="provinces"
                  :multiple="false"
                  placeholder="Chọn tỉnh"
                  track-by="name"
                  selectLabel=""
                  selectedLabel=""
                  deselectLabel="x"
                  label="name" @select="onSelectProvince" @remove="onRemoveProvince"/>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-1">
              <label class="form-label">Kho</label>
            </div>
            <div class="col-md-11">
              <b-form-group>
                <multiselect
                  v-model="selected.stations"
                  :options="stations"
                  :multiple="true"
                  placeholder="Chọn kho"
                  track-by="name"
                  selectLabel=""
                  selectedLabel=""
                  deselectLabel="x"
                  label="name" @select="onSelectStation" @remove="onRemoveStation"/>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-1">
              <label class="form-label">Loại kho</label>
            </div>
            <div class="col-md-11">
              <b-form-group>
                <b-form-select v-model="selected.typeStation" :options="optionTypeStation"></b-form-select>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-1">
              <label class="form-label">Thời gian</label>
            </div>
            <div class="col-md-4">
              <b-form-group class="box-close-from">
                <datepicker :calendar-button=true calendar-button-icon="fa fa-calendar" :clear-button="true" v-model="close_from" placeholder="Từ ngày" :bootstrapStyling="true" :format="customFormatter"/>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group class="box-close-from">
                <datepicker :calendar-button=true calendar-button-icon="fa fa-calendar" :clear-button="true" v-model="close_to" placeholder="Đến ngày" :bootstrapStyling="true" :format="customFormatter"/>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-12">
              <b-form-group>
                <div style="text-align: center">
                  <b-btn type="reset" @click="resetForm" variant="default">Làm lại</b-btn>
                  <b-btn type="button" class="ml-1" variant="primary" @click="searchListConfigStation(pageData.currentPage, true, false)">
                    <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                  </b-btn>
                </div>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results">
        <div class="col-sm text-sm-left text-center pt-3">
          <span class="text-muted" v-if="pageData.totalItems">Tìm thấy {{ pageData.totalItems }} bản ghi</span>
        </div>
        <br/>
        <b-card no-body v-if="listStations">
          <!-- / Table controls -->
          <div class="table-result" >
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered">
                <thead style="width: 100%">
                <tr>
                  <th width="250px">Kho</th>
                  <th width="100px">Loại kho</th>
                  <th width="180px">Từ</th>
                  <th width="180px">Đến</th>
                  <th width="100px">Người tạo</th>
                  <th width="100px">Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dataStation in listStations">
                  <th>{{ dataStation.name }}</th>
                  <td>
                    {{ typeTextStation[dataStation.current.stability_level] }} <br/> <br/>
                      <p style="display: none;" :class="'text_log_' + dataStation.station_id" v-for="log in dataStation.log">{{ typeTextStation[log.stability_level] }}</p>
                  </td>
                  <td>
                    {{ dataStation.current.from != null ? moment(dataStation.current.from).format('HH:mm DD/MM/YYYY') : '-'}} <br/> <br/>
                    <p style="display: none;" :class="'text_log_' + dataStation.station_id" v-for="log in dataStation.log">{{ log.from != null ? moment(log.from).format('HH:mm DD/MM/YYYY') : '-' }}</p>
                  </td>
                  <td>
                    {{ dataStation.current.to != null ? moment(dataStation.current.to).format('HH:mm DD/MM/YYYY') : '-' }} <br/> <br/>
                    <p style="display: none;" :class="'text_log_' + dataStation.station_id" v-for="log in dataStation.log">{{ log.to != null ? moment(log.to).format('HH:mm DD/MM/YYYY') : '-' }}</p>
                  </td>
                  <td>
                    {{ dataStation.current.creator_name }} <br/> <br/>
                    <p style="display: none;" :class="'text_log_' + dataStation.station_id" v-for="log in dataStation.log">{{ log.creator_name }}</p>
                  </td>
                  <td>
                    <button :id="'btnViewLogStations_' + dataStation.station_id"
                            :station_id="dataStation.station_id"
                            class="btnShowLog btn btn-primary mb-1"
                            data-style="expand-left"
                            style="width: 100%"
                            @click="showLogStations(dataStation.station_id)">
                      Xem
                    </button>
                    <button :id="'btnHideLogStations_' + dataStation.station_id" class="btnHideLog btn btn-danger mb-1" data-style="expand-left" style="display: none; width: 100%" @click="hideLogStations(dataStation.station_id)">
                      Ẩn
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination
                    :total-rows="pageData.totalItems"
                    v-model="pageData.currentPage"
                    :per-page="pageData.perPage"
                    v-on:change="pageChanged"
                  />
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
          </div>
        </b-card>
        <div class="no-data" v-if="!listStations">
          Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
        </div>
      </div>
    </div>
    <b-modal size="lg" id="modal-add-cause" title="Thêm config mới" hide-footer v-model="showModal" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="search-form">
        <form>
          <b-form-row>
            <div class="col-md-2">
              <label class="form-label">Tên kho</label>
            </div>
            <div class="col-md-10">
              <b-form-group>
                <multiselect
                  v-model="addConfig.bindStation"
                  :options="addConfig.optionAddStation"
                  :multiple="true"
                  placeholder="Tên kho"
                  track-by="name"
                  selectLabel=""
                  selectedLabel=""
                  deselectLabel="x"
                  label="name" @select="onSelectAddConfig" @remove="onRemoveAddConfig"/>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-2">
              <label class="form-label">Loại kho</label>
            </div>
            <div class="col-md-10">
              <b-form-group>
                <input type="radio" id="stability" value="1" v-model="selected.typeOfStation">
                <label for="stability" class="mr-3">Ổn định</label>
                <input type="radio" id="medium" value="2" v-model="selected.typeOfStation">
                <label for="medium" class="mr-3">Trung bình</label>
                <input type="radio" id="instability" value="3" v-model="selected.typeOfStation">
                <label for="instability" class="mr-3">Bất ổn</label>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-2">
              <label class="form-label">Thời gian</label>
            </div>
            <div class="col-md-5">
              <b-form-group class="box-close-from">
                <datepicker :calendar-button=true calendar-button-icon="fa fa-calendar" :clear-button="true" v-model="add_from" placeholder="Từ ngày" :bootstrapStyling="true" :format="customFormatter"/>
              </b-form-group>
            </div>
            <div class="col-md-5">
              <b-form-group class="box-close-from">
                <datepicker :calendar-button=true calendar-button-icon="fa fa-calendar" :clear-button="true" v-model="add_to" placeholder="Đến ngày" :bootstrapStyling="true" :format="customFormatter"/>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="button-add-config-station mt-3 text-center">
        <b-button variant="default" class="mr-1" @click="closeModal">Đóng</b-button>
        <b-button variant="success" @click="addConfigStation" v-if="loadingButton == false">Lưu</b-button>
        <b-button variant="success" disabled v-if="loadingButton">
          Đang lưu...
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import ConfigStationService from 'domain/services/config-station-service'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ManageConfigStation',
  components: {
    Datepicker,
    Multiselect
  },
  data: () => ({
    success: true,
    statusAdd: true,
    seenLog: false,
    listStations: [],
    provinces: [],
    stations: [],
    selectedProvince: [],
    selectedStation: [],
    dataSendProvinceId: [],
    dataSendStationId: [],
    selected: {
      provinces: [],
      stations: [],
      typeStation: null,
      typeOfStation: 1
    },
    optionTypeStation: [
      {value: null, text: 'Tất cả'},
      {value: 1, text: 'Ổn định'},
      {value: 2, text: 'Trung bình'},
      {value: 3, text: 'Bất ổn'}
    ],
    typeTextStation: {
      '1': 'Ổn định',
      '2': 'Trung bình',
      '3': 'Bất ổn'
    },
    close_from: null,
    close_to: null,
    add_from: null,
    add_to: null,
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    addConfig: {
      optionAddStation: [],
      bindStation: []
    },
    dataAddConfig: {
      listStation: []
    },
    showModal: false,
    showButtonHideLog: false,
    showButtonViewLog: true,
    checkShowLog: false,
    loadingButton: false
  }),
  methods: {
    pageChanged: function (page) {
      this.searchListConfigStation(page)
      this.pageData.currentPage = page
      var showLogClass = document.getElementsByClassName('btnShowLog')
      var hideLogClass = document.getElementsByClassName('btnHideLog')
      for (let i = 0; i < showLogClass.length; i++) {
        showLogClass[i].style.display = 'block'
      }
      for (let i = 0; i < hideLogClass.length; i++) {
        hideLogClass[i].style.display = 'none'
      }
    },
    searchListConfigStation: function (page, newSearchConditions) {
      let dataSend = {
        'province_ids': this.dataSendProvinceId,
        'station_ids': this.dataSendStationId,
        'stability_level': this.selected.typeStation,
        'from': null,
        'to': null,
        'page': page
      }
      if (this.close_from !== null) {
        dataSend.from = moment(this.close_from).format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (this.close_to !== null) {
        dataSend.to = moment(this.close_to).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (newSearchConditions) {
        this.pageData.currentPage = 1
        dataSend.page = 1
      }
      this.$startLoading()
      ConfigStationService.getListConfigStations(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listStations = response.data.data
        } else {
          this.success = false
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    addConfigStation: function () {
      this.loadingButton = true
      let dataAdd = {
        'station_id': this.dataSendStationId,
        'stability_level': this.selected.typeOfStation,
        'from': null,
        'to': null
      }
      if (this.add_from !== null) {
        // var currentTime = new Date()
        // var h = currentTime.getHours()
        // var m = currentTime.getMinutes()
        // var s = currentTime.getSeconds()
        dataAdd.from = moment(this.add_from).format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (this.add_to !== null) {
        dataAdd.to = moment(this.add_to).format('YYYY-MM-DD') + ' 23:59:59'
      }
      ConfigStationService.addConfigStation(dataAdd).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              this.$notify({
                group: 'default',
                type: 'text-white bg-success',
                title: 'Thông báo',
                text: response.data.message
              })
            }
          }
        }
      }).catch(error => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
        this.closeModal()
      }).then(() => {
        this.loadingButton = false
        this.closeModal()
        this.searchListConfigStation(this.pageData.currentPage)
      }, 50)
    },
    addModal: function () {
      this.statusAdd = true
      this.showModal = true
      this.getOptionsAddConfig()
      // this.selected.stations = []
    },
    closeModal: function () {
      this.statusAdd = true
      this.showModal = false
      this.addConfig.bindStation = []
      this.selected.typeOfStation = 1
      this.close_from = null
      this.close_to = null
      this.add_from = null
      this.add_to = null
      this.dataSendProvinceId = []
      this.dataSendStationId = []
      this.selected.typeStation = null
    },
    moment (data) {
      return moment(data)
    },
    customFormatter (date) {
      return moment(date).format('DD-MM-YYYY')
    },
    showLogStations: function (stationId) {
      // this.showButtonViewLog = false
      // this.showButtonHideLog = true
      document.getElementById('btnViewLogStations_' + stationId).style.display = 'none'
      document.getElementById('btnHideLogStations_' + stationId).style.display = 'block'
      var elementStation = document.getElementsByClassName('text_log_' + stationId)
      for (let i = 0; i < elementStation.length; i++) {
        elementStation[i].style.display = 'block'
      }
    },
    hideLogStations: function (stationId) {
      // this.showButtonViewLog = true
      // this.showButtonHideLog = false
      document.getElementById('btnViewLogStations_' + stationId).style.display = 'block'
      document.getElementById('btnHideLogStations_' + stationId).style.display = 'none'
      var elementStationHide = document.getElementsByClassName('text_log_' + stationId)
      for (let i = 0; i < elementStationHide.length; i++) {
        elementStationHide[i].style.display = 'none'
      }
    },
    onSelectProvince: function (selectedOptions) {
      let dataS = []
      let multiple = false
      if (multiple) {
        if (this.selected.provinces.length > 0) {
          for (let i = 0; i < this.selected.provinces.length; i++) {
            dataS.push(this.selected.provinces[i].code)
          }
        }
        dataS.push(selectedOptions.code)
        this.dataSendProvinceId = dataS
      } else {
        if (selectedOptions.code !== null) {
          dataS.push(selectedOptions.code)
        }
        this.dataSendProvinceId = dataS
      }
      let dataSend = {
        'province_id': dataS
      }
      // get station
      this.stations = []
      this.selected.stations = []
      this.dataSendStationId = []
      axios.get(config.baseApiUrl + 'AdConfigStation/listStation', {'params': dataSend}).then(response => {
        if (response.data.success) {
          this.stations = response.data.data
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },
    onRemoveProvince: function (removeOptions) {
      let dataS = []
      let multiple = false
      if (multiple) {
        for (let i = 0; i < this.selected.provinces.length; i++) {
          if (this.selected.provinces[i].code !== removeOptions.code) {
            dataS.push(this.selected.provinces[i].code)
          }
        }
        this.dataSendProvinceId = dataS
      } else {
        this.dataSendProvinceId = []
      }
      let dataSend = {
        'province_id': this.dataSendProvinceId
      }
      // Update station
      this.stations = []
      this.selected.stations = []
      this.dataSendStationId = []
      axios.get(config.baseApiUrl + 'AdConfigStation/listStation', {'params': dataSend}).then(response => {
        if (response.data.success) {
          this.stations = response.data.data
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },
    onSelectStation: function (selectedOptions) {
      let data = []
      let multiple = true
      if (multiple) {
        if (this.selected.stations.length > 0) {
          for (let i = 0; i < this.selected.stations.length; i++) {
            data.push(this.selected.stations[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.dataSendStationId = data
      } else {
        data.push(selectedOptions.code)
        this.dataSendStationId = data
      }
    },
    onRemoveStation: function (removeOptions) {
      let data = []
      let multiple = true
      if (multiple) {
        for (let i = 0; i < this.selected.stations.length; i++) {
          if (this.selected.stations[i].code !== removeOptions.code) {
            data.push(this.selected.stations[i].code)
          }
        }
        this.dataSendStationId = data
      }
    },
    onSelectAddConfig: function (selectedOptions) {
      let data = []
      if (this.addConfig.bindStation.length > 0) {
        for (let i = 0; i < this.addConfig.bindStation.length; i++) {
          data.push(this.addConfig.bindStation[i].code)
        }
      }
      data.push(selectedOptions.code)
      this.dataSendStationId = data
    },
    onRemoveAddConfig: function (removeOptions) {
      let data = []
      for (let i = 0; i < this.addConfig.bindStation.length; i++) {
        if (this.addConfig.bindStation[i].code !== removeOptions.code) {
          data.push(this.addConfig.bindStation[i].code)
        }
      }
      this.dataSendStationId = data
    },
    getOptionsProvince: function () {
      axios.get(config.baseApiUrl + 'AdConfigStation/listProvince').then(response => {
        if (response.data.success) {
          this.provinces = response.data.data
          this.provinces.unshift({
            code: null,
            name: 'Tất cả'
          })
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    getOptionsStation: function () {
      let dataSend = {
        'province_id': []
      }
      axios.get(config.baseApiUrl + 'AdConfigStation/listStation', {'params': dataSend}).then(response => {
        if (response.data.success) {
          this.stations = response.data.data
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    getOptionsAddConfig: function () {
      let dataSend = {
        'province_id': []
      }
      axios.get(config.baseApiUrl + 'AdConfigStation/listStation', {'params': dataSend}).then(response => {
        if (response.data.success) {
          this.addConfig.optionAddStation = response.data.data
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    resetForm () {
      this.selected.provinces = []
      this.selected.stations = []
      this.selected.typeStation = null
      this.close_from = null
      this.close_to = null
      this.dataSendStationId = []
      this.dataSendProvinceId = []
    }
  },
  created: function () {
    this.searchListConfigStation(this.pageData.currentPage)
    this.getOptionsProvince() // get option province
    this.getOptionsStation() // get option station
  },
  computed: {
    totalItems () {
      return this.listStations.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  metaInfo: {
    title: 'Quản lý Config kho'
  }
}
</script>

<style scoped>

</style>
