<template>
  <b-card no-body>
    <b-card-body>
      <div class="header">
          <h3 class="mt-2">Mức lương tối thiểu COD:</h3>
          <b-button variant="outline-primary" @click="openModal"><i class="ion ion-md-add"></i> Gán lương tối thiểu</b-button>
      </div>
      <hr>
      <!-- Tìm kiếm -->
      <b-row>
        <b-col>
          <vue-monthly-picker
            class="monthly-picker"
            v-model="filter.salaryMonth"
            placeHolder="Chọn kỳ lương"
            :alignment="`center`"
            :dateFormat="`MM-YYYY`"
            :clearOption="false"
          ></vue-monthly-picker>
        </b-col>
        <b-col>
          <single-select-profile-region :region="filter.region ? filter.region.id : ''" @handleSelectedRegion="handleSelectedFilterRegion"></single-select-profile-region>
        </b-col>
        <b-col>
          <multiselect class="multiselect-primary"
            v-model="filter.formula"
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
          <b-button class="pt-1 pb-1 mt-1" variant="primary" @click="searchConfig"><i class="ion ion-ios-search"></i> Tìm kiếm</b-button>
          <b-button class="pt-1 pb-1 mt-1" variant="danger" @click="clearSearch"><i class="ion ion-ios-close-circle-outline"></i> Xóa lọc</b-button>
        </b-col>
      </b-row>
      <hr>
      <b-table
        responsive
        class="card-table"
        id="data-minimum"
        ref="dataTable"
        :items="dataSearch"
        :fields="fields"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :hover="true"
        :per-page="paginConfig.per_page"
        :current-page="paginConfig.current_page"
        style="text-align:center;"
      >
        <template v-slot:cell(formula)="row">
          <div class="non-blur">
            <multiselect class="multiselect-primary"
              v-model="row.item.formula"
              :options="formulas"
              placeholder="Chọn công thức lương"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              track-by="name"
              label="name"
              :disabled="true"
              :searchable="true"
              :multiple="true"
              :hide-selected="true"
              :allow-empty="true"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </div>
        </template>
        <template v-slot:cell(province_id)="row">
          <multi-select-province :class='`non-blur`' :isDisabled="true" :display-all="true" :province-ids="row.item.province_id" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province>
        </template>
        <template v-slot:cell(district_id)="row">
          <div class="non-blur">
            <multiselect class="multiselect-primary"
              v-model="row.item.district_id"
              :options="districtIds"
              placeholder="Chọn quận/huyện"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              track-by="name"
              label="name"
              :disabled="true"
              :searchable="true"
              :multiple="true"
              :hide-selected="true"
              :allow-empty="true"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </div>
        </template>
        <template v-slot:cell(station_id)="row">
          <multi-select-stations :all-station="stationDefault" :class="`non-blur`" :isDisabled="true" :station-ids="row.item.station_id" :auto-close="false" :hide-selected="true" :limit-prop="500"></multi-select-stations>
        </template>
        <template v-slot:cell(ward_id)="row">
          <div class="non-blur">
            <multiselect class="multiselect-primary"
              v-model="row.item.ward_id"
              :options="wardIds"
              placeholder="Chọn phường/xã"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              track-by="name"
              label="name"
              :disabled="true"
              :searchable="true"
              :multiple="true"
              :hide-selected="true"
              :allow-empty="true"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </div>
        </template>
        <template v-slot:cell(is_fulltime)="row">
          <div class="content-center">
            <b-form-checkbox
              id="cb"
              :disabled="true"
              v-model="row.item.is_fulltime"
            ></b-form-checkbox>
          </div>
        </template>
        <template v-slot:cell(minimum_salary)="row">
          <div class="f-left">
            <b-row>
              <b-col>
                <p>+ Chính thức I: &nbsp; <span class="t-bold" v-numeral v-text="JSON.parse(row.item.minimum_salary).area1_emp"></span></p>
              </b-col>
              <b-col>
                <p>+ Thử việc I: &nbsp; <span class="t-bold" v-numeral v-text="JSON.parse(row.item.minimum_salary).area1_prob"></span></p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <p>+ Chính thức II: &nbsp; <span class="t-bold" v-numeral v-text="JSON.parse(row.item.minimum_salary).area2_emp"></span></p>
              </b-col>
              <b-col>
                <p>+ Thử việc II: &nbsp; <span class="t-bold" v-numeral v-text="JSON.parse(row.item.minimum_salary).area2_prob"></span></p>
              </b-col>
            </b-row>
          </div>
        </template>
        <template v-slot:cell(actions)="row">
          <div>
            <b-button class="pt-1 pb-1 mt-1 w-button" variant="outline-primary" @click="updateConfig(row.item)"><i class="ion ion-md-create"></i> Sửa</b-button>
            <b-button class="pt-1 pb-1 mt-1 w-button" variant="outline-danger" @click="deleteConfig(row.item.id)"><i class="ion ion-md-trash"></i> Xóa</b-button>
            <b-button class="pt-1 pb-1 mt-1 w-button" variant="outline-info" @click="cloneConfig(row.item)"><i class="ion ion-md-copy"></i> Clone</b-button>
          </div>
        </template>
      </b-table>
      <b-pagination v-if="paginConfig.total_row > 0"
        class="mt-2"
        v-model="paginConfig.current_page"
        :total-rows="paginConfig.total_row"
        :per-page="paginConfig.per_page"
        align="center"
        size="sm"
      ></b-pagination>
      <!-- Gán mức lương tối thiểu cho COD -->
      <b-modal ref="modal-config" no-close-on-backdrop size="lg" title="Gán lương tối thiểu"
        cancel-title="Hủy bỏ" static @ok="createConfig" @cancel="cancel" @close="close">
        <b-row>
          <b-col>
            <vue-monthly-picker
              class="monthly-picker"
              v-model="salaryMonth"
              placeHolder="Chọn kỳ lương"
              :alignment="`center`"
              :dateFormat="`MM-YYYY`"
              :clearOption="false"
            ></vue-monthly-picker>
          </b-col>
        </b-row>
        <br>
        <b-row>
          <b-col>
            <single-select-profile-region :region="region ? region.id : ''" @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
          </b-col>
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
            <multi-select-province @handleProvinceSelected="handleProvinceSelected" :display-all="true" :province-ids="provinceIds" :limit-prop=99999 :auto-close="false" :hide-selected="true"></multi-select-province>
          </b-col>
        </b-row>
        <br>
        <b-row>
          <b-col>
            <multiselect class="multiselect-primary"
              v-model="districtId"
              :options="districtIds"
              placeholder="Chọn huyện"
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
            <multi-select-stations :limit-prop=200 :all-station="allStations" @stationIds="handleStation" :auto-close="false" :hide-selected="true"></multi-select-stations>
          </b-col>
        </b-row>
         <br>
        <b-row>
          <b-col>
            <multiselect class="multiselect-primary"
              v-model="wardId"
              :options="wardIds"
              placeholder="Chọn phường/xã"
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
        <hr>
        <b-row>
          <b-col>
            <b-form-checkbox
              id="checkbox-1"
              v-model="isConfigArea"
              name="checkbox-1"
              value="accepted"
              unchecked-value="not_accepted"
            >
              Gán mức lương tối thiểu theo vùng
            </b-form-checkbox>
          </b-col>
          <b-col>
            <b-form-checkbox
              id="checkbox-2"
              v-model="isFullWorkShift"
              name="checkbox-2"
              value="accepted"
              unchecked-value="not_accepted"
            >
              Yêu cầu đi làm đủ công
            </b-form-checkbox>
          </b-col>
        </b-row>
        <hr>
        <b-row>
          <b-col>
            <p><b>Mức lương tối thiểu:</b></p>
          </b-col>
        </b-row>
        <b-row class="ml-3 mr-3" v-show="isConfigArea === 'not_accepted'">
          <b-col>
            <b-row>
              <b-col class="mr-1">
                <b-row>
                  Thử việc:
                  <b-form-input v-model="minimumSalary.prob" type="number" placeholder="Nhập mức lương tối thiểu"></b-form-input>
                </b-row>
              </b-col>
              <b-col class="ml-1">
                <b-row>
                  Chính thức:
                  <b-form-input v-model="minimumSalary.emp" type="number" placeholder="Nhập mức lương tối thiểu"></b-form-input>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="ml-3 mr-3" v-show="isConfigArea !== 'not_accepted'">
          <b-col>
            <b-row>
              <p><b>Vùng 1, 2, 3:</b></p>
            </b-row>
            <b-row>
              <b-col class="mr-1">
                <b-row>
                  Thử việc:
                  <b-form-input v-model="minimumSalary.area1_prob" type="number" placeholder="Nhập mức lương tối thiểu"></b-form-input>
                </b-row>
              </b-col>
              <b-col class="ml-1">
                <b-row>
                  Chính thức:
                  <b-form-input v-model="minimumSalary.area1_emp" type="number" placeholder="Nhập mức lương tối thiểu"></b-form-input>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <br>
        <b-row class="ml-3 mr-3" v-show="isConfigArea !== 'not_accepted'">
         <b-col>
            <b-row>
              <p><b>Vùng 4, 5, 6, 7, 8:</b></p>
            </b-row>
            <b-row>
              <b-col class="mr-1">
                <b-row>
                  Thử việc:
                  <b-form-input v-model="minimumSalary.area2_prob" type="number" placeholder="Nhập mức lương tối thiểu"></b-form-input>
                </b-row>
              </b-col>
              <b-col class="ml-1">
                <b-row>
                  Chính thức:
                  <b-form-input v-model="minimumSalary.area2_emp" type="number" placeholder="Nhập mức lương tối thiểu"></b-form-input>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
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

  .content-center {
    display: flex;
    justify-content: center;
  }

  .f-left {
    text-align: left;
  }

  .t-bold {
    font-weight: bold;
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

  .w-button {
    width: 88px;
  }
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStations from 'components/elements/common/MultiSelectStations'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectDistricts from 'components/elements/common/MultiSelectDistricts'
import AddressService from 'domain/services/address-service'
import StationService from 'domain/services/station-service'
import SalaryService from 'domain/services/salary-service'

export default {
  name: 'config-minimum-cod-salary',

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
    StationService
  },

  data: () => ({
    triggerShow: false,
    // data save
    salaryMonth: new Moment().format('YYYY-MM'),
    region: {
      id: ''
    },
    config_id: null,
    formula: null,
    formulas: [],
    provinceIds: null,
    districtId: [],
    districtIds: [],
    stationId: [],
    allStations: [],
    stationDefault: [],
    wardId: [],
    wardIds: [],
    minimumSalary: {
      area1_prob: null,
      area1_emp: null,
      area2_prob: null,
      area2_emp: null,
      prob: null,
      emp: null
    },
    isConfigArea: 'not_accepted',
    isFullWorkShift: 'not_accepted',
    // data search
    filter: {
      salaryMonth: '',
      formula: '',
      region: '',
      province_id: '',
      district_id: '',
      station_id: ''
    },
    paginConfig: {
      per_page: 10,
      current_page: 1,
      total_row: 0
    },
    dataSearch: [],
    fields: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'month', label: 'Tháng' },
      { key: 'year', label: 'Năm', sortable: true },
      { key: 'region', label: 'Miền', sortable: true },
      { key: 'formula', label: 'Công thức', sortable: true },
      { key: 'province_id', label: 'Tỉnh', sortable: true },
      { key: 'district_id', label: 'Quận/Huyện', sortable: true },
      { key: 'station_id', label: 'Kho', sortable: true },
      { key: 'ward_id', label: 'Phường/Xã', sortable: true },
      { key: 'is_fulltime', label: 'Yêu cầu đủ công', sortable: true, thStyle: 'width: 5%' },
      { key: 'minimum_salary', label: 'Lương tối thiểu', sortable: true, thStyle: 'width: 25%' },
      { key: 'actions', label: 'Chỉnh sửa', sortable: true, thStyle: 'width: 5%' }
    ]
  }),

  watch: {
    triggerShow: function (newVal, oldVal) {
      this.$refs['modal-config'].show()
    },

    provinceIds: function (newVal, oldVal) {
      this.districtIds = []
      if (newVal) {
        this.getDistrictByProvince(newVal)
      }
    },

    districtId: function (newVal, oldVal) {
      this.allStations = []
      if (newVal && newVal.length > 0) {
        this.getStationByDistrict()
        this.getWardByDistrictID()
      }
    },

    'minimumSalary.prob': function (newVal, oldVal) {
      this.minimumSalary.area1_prob = newVal
      this.minimumSalary.area2_prob = newVal
    },

    'minimumSalary.emp': function (newVal, oldVal) {
      this.minimumSalary.area1_emp = newVal
      this.minimumSalary.area2_emp = newVal
    }
  },

  created () {
    this.getAllFormular()
    this.getAllStation()
    this.getConfig()
  },

  methods: {
    openModal: function () {
      this.triggerShow = !this.triggerShow
    },

    getAllFormular: function () {
      SalaryService.getAllFormulaCod()
        .then((response) => {
          this.formulas = response.data
        })
        .catch((e) => {
          console.log(e)
        })
    },

    createConfig: function () {
      if (!this.region.id) {
        commonHelper.showMessage('Vui lòng chọn miền!', 'warning')
        return
      }
      if (!(this.formula && this.formula.length > 0)) {
        commonHelper.showMessage('Vui lòng chọn công thức lương!', 'warning')
        return
      }
      if (!this.minimumSalary.area1_prob || !this.minimumSalary.area1_emp || !this.minimumSalary.area2_prob || !this.minimumSalary.area2_emp) {
        commonHelper.showMessage('Vui lòng nhập mức lương tối thiểu!', 'warning')
        return
      }
      let time
      try {
        time = this.salaryMonth.split('-')
      } catch (e) {
        time = this.salaryMonth.format('YYYY-MM').split('-')
      }
      let dataSend = {
        id: this.config_id,
        month: time[1],
        year: time[0],
        region: this.region.id,
        formulas: this.formula,
        fulltime: this.isFullWorkShift === 'not_accepted' ? 0 : 1,
        province_id: this.provinceIds,
        district_id: this.districtId ? this.districtId.map(item => item.id) : [],
        station_id: this.stationId,
        ward_id: this.wardId ? this.wardId.map(item => item.id) : [],
        salary: {
          area1_prob: this.minimumSalary.area1_prob,
          area1_emp: this.minimumSalary.area1_emp,
          area2_prob: this.minimumSalary.area2_prob,
          area2_emp: this.minimumSalary.area2_emp
        }
      }
      SalaryService.createConfigSalary(dataSend)
        .then((response) => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.clearModal()
            this.getConfig()
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    updateConfig: function (config) {
      this.openModal()
      this.config_id = config.id
      this.salaryMonth = new Moment(config.year + '-' + config.month).format('YYYY-MM')
      this.region = {
        id: config.region
      }
      this.formula = config.formula
      this.provinceIds = config.province_id
      this.districtId = config.district_id
      this.stationId = config.station_id
      this.wardId = config.ward_id
      let salary = JSON.parse(config.minimum_salary)
      this.minimumSalary = {
        area1_prob: salary.area1_prob,
        area1_emp: salary.area1_emp,
        area2_prob: salary.area2_prob,
        area2_emp: salary.area2_emp,
        prob: null,
        emp: null
      }
      this.isConfigArea = 'accepted'
      this.isFullWorkShift = (config.is_fulltime === true ? 'accepted' : 'not_accepted')
    },

    cloneConfig: function (config) {
      this.openModal()
      this.salaryMonth = new Moment(config.year + '-' + config.month).format('YYYY-MM')
      this.region = {
        id: config.region
      }
      this.formula = config.formula
      this.provinceIds = config.province_id
      this.districtId = config.district_id
      this.stationId = config.station_id
      this.wardId = config.ward_id
      let salary = JSON.parse(config.minimum_salary)
      this.minimumSalary = {
        area1_prob: salary.area1_prob,
        area1_emp: salary.area1_emp,
        area2_prob: salary.area2_prob,
        area2_emp: salary.area2_emp,
        prob: null,
        emp: null
      }
      this.isConfigArea = 'accepted'
      this.isFullWorkShift = (config.is_fulltime === true ? 'accepted' : 'not_accepted')
    },

    getConfig: function (dataSend) {
      SalaryService.getConfigMinimumSalaryCod(dataSend)
        .then((response) => {
          if (response.data.success) {
            this.dataSearch = []
            this.dataSearch = response.data.data
            this.dataSearch.forEach(element => {
              element.formula = this.convertFormula(element.formula.split(','))
            })
            this.paginConfig.total_row = response.data.count
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    deleteConfig: function (id) {
      if (!id) {
        commonHelper.showMessage('Chưa truyền id', 'warning')
        return
      }
      SalaryService.deleteConfigMinimumSalaryCod(id)
        .then((response) => {
          if (response.data.success) {
            this.getConfig()
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    convertFormula: function (formulas) {
      return this.formulas.filter(item => {
        return formulas.includes(item.code.toString())
      })
    },

    handleStation: function (options) {
      this.stationId = options
    },

    handleProvinceSelected: function (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleDistrictSelected: function (option) {
      this.districtIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleStationSelected: function (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedRegion (option) {
      this.region = option
    },

    handleSelectedFilterRegion (option) {
      this.filter.region = option
    },

    getDistrictByProvince: function (provinceIds) {
      let dataSend = {
        provinceId: provinceIds ? provinceIds.split(',') : []
      }
      AddressService.getDistrictByProvinceIdV2(dataSend)
        .then((response) => {
          if (response.data.success) {
            this.districtIds = response.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getStationByDistrict: function () {
      let dataSend = {
        districtIds: this.districtId ? this.districtId.map((item) => item.id).toString() : []
      }
      StationService.getAllStationByDistrictIds(dataSend)
        .then((response) => {
          if (response.data.success) {
            this.allStations = response.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getAllStation: function () {
      StationService.getAllStationByProvinceIds()
        .then((res) => {
          if (res.data.success) {
            this.stationDefault = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getWardByDistrictID: function () {
      let dataSend = {
        districtIds: this.districtId ? this.districtId.map((item) => item.id).toString() : []
      }
      AddressService.getWardByDistrictByID(dataSend)
        .then((response) => {
          if (response.data.success) {
            this.wardIds = response.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    close: function () {
      this.clearModal()
    },

    cancel: function () {
      this.clearModal()
    },

    clearModal: function () {
      this.config_id = null
      this.region = {
        id: ''
      }
      this.formula = []
      this.provinceIds = null
      this.districtId = []
      this.stationId = []
      this.wardId = []
      this.minimumSalary = {
        area1_prob: null,
        area1_emp: null,
        area2_prob: null,
        area2_emp: null,
        prob: null,
        emp: null
      }
      this.isConfigArea = 'not_accepted'
      this.isFullWorkShift = 'not_accepted'
    },

    clearSearch: function () {
      this.filter = {
        salaryMonth: '',
        formula: '',
        region: '',
        province_id: '',
        district_id: '',
        station_id: ''
      }
    },

    searchConfig: function () {
      let dataSend = {}
      if (this.filter.salaryMonth) {
        let times = this.filter.salaryMonth.format('YYYY-MM').split('-')
        dataSend.year = times[0]
        dataSend.month = times[1]
      }
      if (this.filter.formula !== '') {
        dataSend.formula = this.filter.formula.map(value => value.code)
      }
      if (this.filter.region) {
        dataSend.region = this.filter.region.id
      }
      this.getConfig(dataSend)
    }
  }
}
</script>
