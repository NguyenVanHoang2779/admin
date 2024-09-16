<template>
  <b-card no-body>
    <b-card-body>
      <div class="header">
          <h3 class="mt-2">Config checkin COD: <span style="color: red">Từ kỳ lương tháng 8 mọi người chuyển sang màn config mới để thao tác tại
             <router-link :to="`config-checkin-cod-v2`" style="color: #1c99e6"> đây </router-link>
          </span></h3>
        <b-button-group>
          <b-button variant="success" to="/salary/export-data-checkin-pkV2"><i class="fa fa-book"></i> Quản lý dữ liệu checkin</b-button>
        </b-button-group>
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
          <b-button class="pt-1 pb-1 mt-1 ml-3" variant="warning" @click="clearSearch"><i class="fa fa-sync-alt"></i> Xóa lọc</b-button>
        </b-col>
      </b-row>
      <br>
      <h6><b-badge variant="primary">{{countSearchConfig}}</b-badge> bản ghi được tìm thấy</h6>
      <!-- Content -->
      <b-table
        striped hover responsive
        :fields="fieldsDataConfigCheckin"
        :items="dataConfigCheckin"
        :per-page="perPage"
        :current-page="currentPage"
      >
        <template v-slot:cell(month)="row">
          {{`${row.item.month}/${row.item.year}`}}
        </template>
        <template v-slot:cell(formula)="row">
          <div class="non-blur custom-multiselect">
            <multiselect class="multiselect-primary"
             v-model="row.item.formula"
             :options="formulas"
             track-by="name"
             label="name"
             :disabled="true"
             :multiple="true"
             :allow-empty="true"
             :close-on-select="false"
            />
          </div>
        </template>
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
        <template v-slot:cell(station_id)="row">
          <div class="non-blur custom-multiselect">
            <multi-select-stations
              class="multiselect-primary"
              :display-all="true"
              :station-ids="row.item.station_id"
              :isDisabled="true"
              :limit-prop=99999>
            </multi-select-stations>
          </div>
        </template>
        <template v-slot:cell(province_id)="row">
          <div class="non-blur custom-multiselect">
            <multi-select-province
              class="multiselect-primary"
              :display-all="false"
              :province-ids="row.item.province_id"
              :isDisabled="true"
              :limit-prop=99999>
            </multi-select-province>
          </div>
        </template>
        <template v-slot:cell(point_id)="row">
          <div class="non-blur custom-multiselect">
            <multi-select-stop-point
              class="multiselect-primary"
              :display-all="true"
              :point-ids="row.item.point_id"
              :place-hoder="`Chưa có địa điểm được chọn`"
              :isDisabled="true"
              :limit-prop=99999>
            </multi-select-stop-point>
          </div>
        </template>
        <template v-slot:cell(created)="row">
          {{`${row.item.created} bởi `}} <b>{{row.item.created_by}}</b>
        </template>
        <template v-slot:cell(modified)="row">
          {{`${row.item.modified} bởi `}} <b>{{row.item.modified_by}}</b>
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
            <b-btn-group class="w-100">
              <b-button class="w-50" variant="success" @click="setOptionSelectStation(2)">Chọn Tất Cả Kho</b-button>
              <b-button class="w-50" variant="warning" @click="setOptionSelectStation(3)">Xóa Tất Cả Kho</b-button>
            </b-btn-group>
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
            <b-btn-group class="w-100">
              <b-button class="w-50" variant="success" @click="setOptionSelectStopPoint(2)">Chọn Tất Cả Điểm</b-button>
              <b-button class="w-50" variant="warning" @click="setOptionSelectStopPoint(3)">Xóa Tất Cả Điểm</b-button>
            </b-btn-group>
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

  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
    pointer-events: auto;
  }

  .non-blur >>> .multiselect__tags {
    background: white;
  }

  .non-blur >>> .multiselect__tag-icon {
    display: none
  }

  .monthly-picker {
    border: 1px solid rgba(24, 28, 33, 0.1);
  }

  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
  .custom-multiselect::-webkit-scrollbar {
    width: 6px;
    border-radius: 5px;
    background-color:#F5F5F5;
  }
  .custom-multiselect::-webkit-scrollbar-thumb {
    background-color: rgb(194, 194, 194);
    border-radius: 5px;
  }
  .custom-multiselect::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
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
  name: 'config-checkin-cod',

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
    formula: null,
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
    config_id: null,
    optionConfig: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    perPage: 5,
    currentPage: 1,
    isSelectStopPointAll: 1,
    dataConfigCheckin: [],
    fieldsDataConfigCheckin: [
      {key: 'id', label: 'Id config'},
      {key: 'month', label: 'Thời gian'},
      {key: 'formula', label: 'Công thức', sortable: true},
      {key: 'province_id', label: 'Tỉnh', sortable: true},
      {key: 'station_id', label: 'Kho', sortable: true},
      {key: 'point_id', label: 'Điểm làm hàng', sortable: true},
      {key: 'times', label: 'Thời gian', sortable: true},
      {key: 'created', label: 'Tạo lúc', sortable: true},
      {key: 'modified', label: 'Sửa lúc', sortable: true},
      {key: 'action', label: ''}
    ],
    countSearchConfig: 0
  }),

  watch: {
    triggerShow: function (newVal, oldVal) {
      this.$refs['modal-config'].show()
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
      this.triggerShow = !this.triggerShow
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

    getConfig (dataSend) {
      SalaryService.getConfigCheckinCod(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.countSearchConfig = res.data.data.length
            this.dataConfigCheckin = res.data.data
            this.dataSearch = []
            this.dataSearch = res.data.data
            let tmpFormular = []
            this.dataSearch.forEach(element => {
              element.formula = element.formula.split(',')
              element.formula.forEach(e => {
                this.formulas.forEach(formula => {
                  if (parseInt(e) === formula.code) {
                    tmpFormular.push(formula)
                  }
                })
              })
              element.formula = tmpFormular
              element.times = JSON.parse(element.times)
              tmpFormular = []
            })
            return commonHelper.showMessage(res.data.message, 'success')
          }
          commonHelper.showMessage(res.data.message, 'warning')
        })
        .catch((e) => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy các config ca. Vui lòng thử lại sau', 'warning')
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
      this.$refs['modal-config'].hide()
      this.isSelectAll = 1
    },

    cancel: function () {
      this.$refs['modal-config'].hide()
      this.clearModal()
    },

    clearModal: function () {
      this.provinceIds = this.formula = this.config_id = this.stationIds = this.pointIds = null
      this.times = []
      this.count_ws = 0
      this.salaryMonth = new Moment()
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
