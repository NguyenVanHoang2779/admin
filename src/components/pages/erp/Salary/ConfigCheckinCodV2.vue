<template>
    <b-card no-body>
        <b-card-body>
            <div class="header">
                <b-col><h3 class="mt-2">Config checkin COD:</h3></b-col>
                <b-col md="3">
                    <b-button variant="primary" @click="openModal"><i class="ion ion-md-add"></i> Config ca checkin</b-button>
                    <b-button class="ml-3" variant="success" to="/salary/export-data-checkin-pk"><i class="fa fa-book"></i> Quản lý dữ liệu checkin</b-button>
                </b-col>
            </div>
            <hr>
            <!-- Search -->
            <b-row>
                <b-col>
                    <vue-monthly-picker
                            v-model="salaryMonth"
                            placeHolder="Chọn kỳ lương"
                            :alignment="`center`"
                            :dateFormat="`MM-YYYY`"
                            :clearOption="false"
                    ></vue-monthly-picker>
                </b-col>
                <b-col>
                    <multiselect class="multiselect-primary"
                                 v-model="formulaSeach"
                                 :options="formulas"
                                 placeholder="Chọn công thức lương"
                                 selectedLabel="Đã chọn"
                                 deselectLabel="Bỏ chọn"
                                 selectLabel="Chọn"
                                 track-by="name"
                                 label="name"
                                 :disabled="false"
                                 :searchable="true"
                                 :multiple="true"
                                 :hide-selected="true"
                                 :allow-empty="true"
                                 :close-on-select="false"
                    >
                        <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                    </multiselect>
                </b-col>
                <b-col>
                    <multi-select-province
                            @handleProvinceSelected="handleProvinceSearch($event)"
                            :display-all="false"
                            :province-ids="provinceSearch"
                            :limit-prop=99999
                            :auto-close="false"
                            :hide-selected="true"
                    >
                    </multi-select-province>
                </b-col>
                <b-col>
                    <multi-select-stations
                            @handleStationSelected="handleStationSearch($event)"
                            :display-all="true"
                            :provinceIds="provinceSearch"
                            :stationIds="stationSearch"
                            :limit-prop=99999
                            :auto-close="false"
                            :hide-selected="true">
                    </multi-select-stations>
                </b-col>
                <b-col>
                    <multi-select-stop-point
                            @handleStopPointSelected="handlePointSearch($event)"
                            :display-all="true"
                            :province-ids="provinceSearch"
                            :point-ids="pointSearch"
                            :place-hoder="`Chọn địa điểm làm hàng`"
                            :limit-prop=99999
                            :auto-close="false"
                            :hide-selected="true"
                    >
                    </multi-select-stop-point>
                </b-col>
                <b-col>
                    <b-button class="pt-1 pb-1 mt-1" variant="primary" @click="searchConfig"><i class="fa fa-search"></i> Tìm kiếm</b-button>
                    <b-button class="pt-1 pb-1 mt-1 ml-3" variant="success" @click="clearSearch"><i class="fa fa-sync-alt"></i> Xóa lọc</b-button>
                </b-col>
            </b-row>
            <br>
            <b-row>
                <b-col>
                    <h6 class="mt-3"><b-badge variant="primary">{{countSearchConfig}}</b-badge> Bản ghi được tìm thấy <span class="require" v-if="countSearchConfig == 500">(Hệ thống giới hạn tìm tối đa 500 bản ghi)</span></h6>
                </b-col>
                <b-col>
                    <b-input class="mb-3" v-model="filterConfig" :placeholder="`Nhập nội dung để lọc config. Vd: Tên kho, tên điểm làm hàng, tên công thức lương, thời gian,...`"></b-input>
                </b-col>
            </b-row>
            <!-- Content -->
            <b-table
                    striped hover responsive
                    :fields="fieldsDataConfigCheckin"
                    :items="dataConfigCheckin"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :filter="filterConfig"
            >
                <template v-slot:cell(times)="row">
                    <div style="max-width: 400px">
                        <b-button-group size="sm" class="mb-1" v-for="(time, index) in row.item.times" :key="index">
                            <b-button variant="warning">{{index+1}}</b-button>
                            <b-button variant="success">Bắt đầu : {{time.start}}</b-button>
                            <b-button variant="info">Muộn : {{time.late}}</b-button>
                            <b-button variant="danger">Kết thúc : {{time.end}}</b-button>
                        </b-button-group>
                    </div>
                </template>
                <template v-slot:cell(created)="row">
                    {{`${row.item.created} bởi `}} <b>{{row.item.created_by}}</b>
                </template>
                <template v-slot:cell(modified)="row">
                    {{`${row.item.modified} bởi `}} <b>{{row.item.modified_by}}</b>
                </template>
                <template v-slot:cell(action)="row">
                    <b-button variant="outline-success" size="sm" @click="updateConfig(row.item)"><i class="fa fa-pencil-alt"/></b-button>
                    <b-button class="mt-1" variant="outline-success" size="sm" @click="cloneConfig(row.item)"><i class="fa fa-copy "/></b-button>
                </template>
                <template v-slot:cell(option)="row">
                    <b-form-checkbox :value=row.item.id v-model="optionSelect"></b-form-checkbox>
                </template>
            </b-table>
            <hr>
            <b-row class="d-flex justify-content-center">
                <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        aria-controls="my-table"
                ></b-pagination>
            </b-row>
            <!-- Config ca -->
            <b-modal ref="modal-config" no-close-on-backdrop size="lg" title="Config ca checkin COD"
                     cancel-title="Hủy bỏ" static
                     :hide-footer="true" @close="close"
            >
                <b-row>
                    <b-col>
                        <multiselect class="multiselect-primary"
                                     v-model="formula"
                                     :options="formulas"
                                     placeholder="Chọn công thức lương"
                                     selectedLabel="Đã chọn"
                                     deselectLabel="Bỏ chọn"
                                     selectLabel="Chọn"
                                     track-by="name"
                                     label="name"
                                     :disabled="false"
                                     :searchable="true"
                                     :multiple="true"
                                     :hide-selected="true"
                                     :allow-empty="true"
                                     :close-on-select="false"
                        >
                            <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                        </multiselect>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col>
                        <multi-select-province
                                @handleProvinceSelected="handleProvinceSelected"
                                :display-all="true"
                                :province-ids="provinceIds"
                                :limit-prop=99999 :auto-close="false"
                                :hide-selected="true"
                        >
                        </multi-select-province>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col>
                        <multi-select-stations
                                :display-all="true"
                                @handleStationSelected="handleStationSelected"
                                :is-select-all="isSelectAll"
                                :station-ids="stationIds"
                                :province-ids="provinceIds"
                                :limit-prop=99999
                                :auto-close="false"
                                :hide-selected="true"
                        >
                        </multi-select-stations>
                    </b-col>
                    <b-col>
                        <b-button variant="primary" @click="setOptionSelectStation(2)">Chọn Tất Cả Kho</b-button>
                        <b-button variant="success" @click="setOptionSelectStation(3)">Xóa Tất Cả Kho</b-button>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col>
                        <multi-select-stop-point
                                :display-all="true"
                                @handleStopPointSelected="handleStopPointSelected"
                                :place-hoder="`Chọn địa điểm làm hàng`"
                                :is-select-all="isSelectStopPointAll"
                                :point-ids="pointIds"
                                :province-ids="provinceIds"
                                :limit-prop=99999
                                :auto-close="false"
                                :hide-selected="true"
                        >
                        </multi-select-stop-point>
                    </b-col>
                    <b-col>
                        <b-button variant="primary" @click="setOptionSelectStopPoint(2)">Chọn Tất Cả Điểm</b-button>
                        <b-button variant="success" @click="setOptionSelectStopPoint(3)">Xóa Tất Cả Điểm</b-button>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col>
                        <p>Kỳ lương:</p>
                        <vue-monthly-picker
                                class="monthly-picker"
                                v-model="salaryMonth"
                                placeHolder="Chọn kỳ lương"
                                :alignment="`center`"
                                :dateFormat="`MM-YYYY`"
                                :clearOption="false"
                        ></vue-monthly-picker>
                    </b-col>
                    <b-col>
                        <p>Số ca:</p>
                        <multiselect
                                v-model="count_ws"
                                :options="optionConfig"
                                selectedLabel="Đã chọn"
                                deselectLabel="Bỏ chọn"
                                selectLabel="Chọn"
                        >
                        </multiselect>
                        <!--            <b-form-input type="number" v-model="count_ws" placeholder="Nhập số ca checkin"></b-form-input>-->
                    </b-col>
                </b-row>
                <div v-for="(time, index) in times" :key="index">
                    <br>
                    <p><b>- Ca {{ index + 1 }}: <b-button variant="warning" size="sm" @click="times.splice(index, 1); count_ws--">Xóa Ca</b-button></b></p>
                    <b-card>
                        <b-row>
                            <b-col>
                                <p>Bắt đầu:</p>
                                <b-form-input v-model="time.start" type="time"></b-form-input>
                            </b-col>
                            <b-col>
                                <p>Kết thúc:</p>
                                <b-form-input v-model="time.end" type="time"></b-form-input>
                            </b-col>
                            <b-col>
                                <p>Checkin muộn:</p>
                                <b-form-input v-model="time.late" type="time"></b-form-input>
                            </b-col>
                        </b-row>
                    </b-card>
                </div>
                <br>
                <b-row class="float-right">
                    <b-button class="mr-3" v-if="config_id === null" variant="primary" @click="createConfig">Tạo Config Ca</b-button>
                    <b-button class="mr-3" v-if="config_id !== null" variant="primary" @click="deleteConfig">Xóa Config Ca</b-button>
                    <b-button class="mr-3" v-if="config_id !== null" variant="primary" @click="createConfig">Cập Nhật Config</b-button>
                    <b-button variant="success" @click="cancel">Hủy Bỏ</b-button>
                </b-row>
            </b-modal>
        </b-card-body>
    </b-card >
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
    }
    .require {
        color: red;
    }
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStations from './ConfigCheckinComponent/MultiSelectStation'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectDistricts from 'components/elements/common/MultiSelectDistricts'
import AddressService from 'domain/services/address-service'
import StationService from 'domain/services/station-service'
import SalaryService from 'domain/services/salary-service'
import MultiSelectStopPoint from './ConfigCheckinComponent/MultiSelectStopPoint'

export default {
  name: 'config-checkin-cod-v2',
  components: {
    commonHelper,
    VueMonthlyPicker,
    Moment,
    Multiselect,
    MultiSelectProvince,
    MultiSelectStations,
    SingleSelectProfileRegion,
    MultiSelectDistricts,
    AddressService,
    StationService,
    MultiSelectStopPoint
  },
  data: () => ({
    triggerShow: false,
    formula: [],
    formulas: [],
    formulaSeach: null,
    provinceId: null,
    provinceIds: null,
    provinceSearch: null,
    stationIds: null,
    stationSearch: null,
    pointIds: null,
    pointSearch: null,
    isSelectAll: 1,
    count_ws: 0,
    times: [],
    salaryMonth: new Moment(),
    dataSearch: [],
    config_id: [],
    optionConfig: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    perPage: 5,
    currentPage: 1,
    isSelectStopPointAll: 1,
    dataConfigCheckin: [],
    fieldsDataConfigCheckin: [
      {key: 'option', label: 'Chọn', sortable: true},
      {key: 'id', label: 'Id config', sortable: true},
      {key: 'group', label: 'Group config', sortable: true},
      {key: 'data_date_key', label: 'Ngày bắt đầu'},
      {key: 'formula', label: 'Công thức lương', sortable: true},
      {key: 'formula_name', label: 'Tên công thức lương', sortable: true},
      {key: 'province_name', label: 'Tên tỉnh', sortable: true},
      {key: 'station_name', label: 'Tên kho', sortable: true},
      {key: 'point_name', label: 'Tên điểm làm hàng', sortable: true},
      {key: 'times', label: 'Thời gian', sortable: true},
      {key: 'created', label: 'Tạo lúc', sortable: true},
      {key: 'modified', label: 'Sửa lúc', sortable: true},
      {key: 'action', label: ''}
    ],
    countSearchConfig: 0,
    filterConfig: '',
    optionSelect: []
  }),
  watch: {
    triggerShow: function (newVal, oldVal) {
      if (this.triggerShow) this.$refs['modal-config'].show()
    },
    count_ws: function (newVal, oldVal) {
      this.generateDataTimesCheckin()
    }
  },
  created () {
    this.getAllFormular()
  },
  computed: {
    rows () {
      return this.dataConfigCheckin.length
    }
  },
  methods: {
    openModal: function () {
      this.clearModal()
      this.triggerShow = true
    },
    setOptionSelectStation: function (val) {
      // 1 không tác động, 2 chọn tất cả, 3 xóa tất cả
      this.isSelectAll = val
    },
    setOptionSelectStopPoint (val) {
      this.isSelectStopPointAll = val
    },
    getAllFormular () {
      SalaryService.getAllFormulaCod()
        .then((res) => {
          this.formulas = res.data
          this.getConfig()
        })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy công thức lương. Vui lòng thử lại sau', 'warning')
        })
    },
    createConfig: function (modal) {
      let containFormula = false
      Object.values(this.formula).forEach(f => {
        containFormula = true
      })
      if (!containFormula) {
        commonHelper.showMessage('Vui lòng chọn công thức lương!', 'warning')
        modal.preventDefault()
        return
      }
      if (!(this.provinceIds && this.provinceIds.length)) {
        commonHelper.showMessage('Vui lòng chọn tỉnh!', 'warning')
        modal.preventDefault()
        return
      }
      if (!(this.stationIds && this.provinceIds.length) && this.pointIds === null) {
        commonHelper.showMessage('Vui lòng chọn kho hoặc điểm làm hàng', 'warning')
        modal.preventDefault()
        return
      }
      let dataSend = {
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        formulas: this.formula,
        province_id: this.provinceIds,
        station_id: this.stationIds,
        point_ids: this.pointIds,
        times: this.times,
        count_ws: this.count_ws
      }
      if (this.config_id.length > 0) {
        dataSend.id = this.config_id
        SalaryService.updateConfigCheckinV2(dataSend)
          .then(response => {
            let data = response.data
            if (response.data.success) {
              this.clearModal()
              this.searchConfig()
              this.config_id = []
              this.triggerShow = false
              this.$refs['modal-config'].hide()
              return commonHelper.showMessage(data.message, 'success')
            }
            commonHelper.showMessage(data.message, 'danger')
          })
          .catch(() => {
            commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau', 'warning')
          })
        return
      }
      SalaryService.createConfigCheckinV2(dataSend)
        .then((response) => {
          if (response.data.success) {
            this.clearModal()
            this.$refs['modal-config'].hide()
            this.triggerShow = false
            this.searchConfig()
            return commonHelper.showMessage(response.data.message, 'success')
          }
          commonHelper.showMessage(response.data.message, 'warning')
        })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
        })
    },
    getConfig (dataSend) {
      SalaryService.getConfigCheckinCodV2(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.countSearchConfig = res.data.data.length
            this.dataConfigCheckin = res.data.data
            this.dataSearch = []
            this.dataSearch = res.data.data
            this.dataSearch.forEach(element => {
              element.times = JSON.parse(element.times)
            })
            return commonHelper.showMessage(res.data.message, 'success')
          }
          commonHelper.showMessage(res.data.message, 'warning')
        })
        .catch((e) => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy các config ca. Vui lòng thử lại sau', 'warning')
        })
    },
    updateConfig (data) {
      this.isSelectAll = 1
      this.provinceIds = data.province_id
      this.count_ws = data.count_ws
      let formulaFind = this.formulas.find((f) => f.code === parseInt(data.formula))
      this.formula.push(formulaFind)
      this.config_id.push(data.id)
      this.triggerShow = true
      this.stationIds = data.station_id
      this.pointIds = data.point_id
      data.times.forEach(element => {
        this.times.push(element)
      })

      if (this.optionSelect.length > 0) {
        Object.values(this.dataConfigCheckin).forEach(configCheckin => {
          this.optionSelect.forEach(configId => {
            if (configId === configCheckin.id && configId !== data.id) {
              this.config_id.push(configId)
              if (configCheckin.station_id !== null && this.stationIds.indexOf(configCheckin.station_id) < 0) this.stationIds += `,${configCheckin.station_id}`
              if (configCheckin.point_id !== null && this.pointIds.indexOf(configCheckin.point_id) < 0) this.pointIds += `,${configCheckin.point_id}`
              if (configCheckin.province_id !== null && this.provinceIds.indexOf(configCheckin.province_id) < 0) this.provinceIds += `,${configCheckin.province_id}`
              let formulaFind = this.formulas.find((f) => f.code === parseInt(configCheckin.formula))
              let isExistFormula = this.formula.find((f) => f.code === parseInt(configCheckin.formula))
              if (typeof isExistFormula === 'undefined') this.formula.push(formulaFind)
            }
          })
        })
      }
    },
    cloneConfig (data) {
      this.isSelectAll = 1
      this.provinceIds = data.province_id
      this.count_ws = data.count_ws
      this.formula = this.formulas.find((f) => f.code === parseInt(data.formula))
      this.triggerShow = true
      this.stationIds = data.station_id
      this.pointIds = data.point_id
      data.times.forEach(element => {
        this.times.push(element)
      })
    },
    deleteConfig () {
      if (isNaN(this.config_id)) {
        commonHelper.showMessage('Chưa truyền id', 'warning')
        return
      }
      SalaryService.deleteConfigCheckinV2(this.config_id)
        .then((response) => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.getConfig()
            this.$refs['modal-config'].hide()
            this.clearModal()
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    convertFormula: function (formulas) {
      this.formulas.filter(item => {
        return formulas.includes(item.code.toString())
      })
    },
    handleProvinceSelected (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : null
    },
    handleStationSelected (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : null
    },
    handleStopPointSelected (option) {
      this.pointIds = option ? option.map((item) => item.id).toString() : null
    },
    handlePointSearch (option) {
      this.pointSearch = option ? option.map((item) => item.id).toString() : null
    },
    handleProvinceSearch (option) {
      this.provinceSearch = option ? option.map((item) => item.id).toString() : null
    },
    handleStationSearch (option) {
      this.stationSearch = option ? option.map((item) => item.id).toString() : null
    },
    close: function () {
      this.clearModal()
      this.triggerShow = false
      this.isSelectAll = 1
    },
    cancel: function () {
      this.$refs['modal-config'].hide()
      this.clearModal()
    },
    clearModal: function () {
      this.config_id = []
      this.formula = []
      this.provinceIds = null
      this.stationIds = null
      this.pointIds = null
      this.times = []
      this.count_ws = 0
      // this.salaryMonth = new Moment()
    },
    clearSearch: function () {
      this.provinceSearch = this.stationSearch = this.pointSearch = this.formulaSeach = null
    },
    searchConfig () {
      let dataSend = {}
      dataSend.year = this.salaryMonth.format('YYYY')
      dataSend.month = this.salaryMonth.format('MM')
      dataSend.province = (this.provinceSearch) ? this.provinceSearch.split(',') : null
      dataSend.station = (this.stationSearch) ? this.stationSearch.split(',') : null
      dataSend.point = (this.pointSearch) ? this.pointSearch.split(',') : null
      dataSend.formula = (this.formulaSeach) ? this.formulaSeach.map((e) => e.code) : null
      this.getConfig(dataSend)
    },
    generateDataTimesCheckin () {
      let ws = Number(this.count_ws)
      let numConfigWs = this.times.length
      if (ws < numConfigWs) {
        this.times.splice(ws, numConfigWs - ws)
      } else if (ws !== numConfigWs) {
        for (let i = numConfigWs; i < this.count_ws; i++) {
          this.times.push({
            start: null,
            end: null,
            late: null})
        }
      }
    }
  }
}
</script>
