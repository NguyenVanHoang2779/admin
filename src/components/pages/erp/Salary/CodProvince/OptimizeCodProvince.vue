<template>
    <div>
        <b-card no-body>
            <b-card-body>
                <b-row><h4 class="ml-3">Màn Tối Ưu Thu Nhập Cod Tỉnh</h4></b-row>
                <hr>
                <b-row>
                    <b-col>
                        <vue-monthly-picker
                            class="monthly-picker"
                            v-model="salaryMonth"
                            :alignment="`center`"
                            :dateFormat="`MM-YYYY`"
                            :min="minMonth"
                            :max="maxMonth"
                            :clearOption="true"
                        ></vue-monthly-picker>
                    </b-col>
                    <b-col>
                        <multiselect
                            class="multiselect-info"
                            :options="regionOptions"
                            v-model="regionOption"
                            placeholder="Chọn Miền"
                            label="name"
                            track-by="id"
                            :preserve-search="true"
                            :hide-selected="false"
                        />
                    </b-col>
                    <b-col>
                        <multiselect
                            class="multiselect-info"
                            :options="provinceOptions"
                            v-model="provinceOption"
                            placeholder="Chọn tỉnh"
                            label="name"
                            track-by="id"
                            :multiple="true"
                            :preserve-search="true"
                            :hide-selected="false"
                        />
                    </b-col>
                    <b-col>
                        <multiselect
                            class="multiselect-info"
                            :options="stationOptions"
                            v-model="stationOption"
                            placeholder="Chọn kho"
                            label="name"
                            track-by="id"
                            :multiple="true"
                            :preserve-search="true"
                            :hide-selected="false"
                        />
                    </b-col>
                    <b-col>
                        <multiselect
                            class="multiselect-info"
                            :options="formulaOptions"
                            v-model="formulaOption"
                            placeholder="Chọn công thức lương"
                            label="name"
                            track-by="id"
                            :multiple="true"
                            :preserve-search="true"
                            :hide-selected="false"
                        />
                    </b-col>
                    <b-col md="1">
                        <b-btn variant="outline-info" @click="getSalaryOptimize()" :disabled="isSearching">
                            Tìm kiếm <i class="fa fa-search" v-if="!isSearching"></i>
                            <i class="fa fa-spinner fa-spin" v-if="isSearching"></i>
                        </b-btn>
                    </b-col>
                    <b-col md="1">
                        <b-btn variant="outline-info" @click="clearSearch()">
                            Xóa lọc <i class="fa fa-broom"></i>
                        </b-btn>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col md="2">
                        <b-form-select v-model="numPerPage" :options="numPerPageOption"></b-form-select>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card>
        <br>
        <b-card no-body>
            <b-card-body>
                <ShowOptimizeSalary
                        :data-draw="dataDraw"
                        v-if="dataDraw.length > 0"
                />
                <br>
                <b-table
                        sort-icon-left
                        responsive
                        selectable
                        :select-mode="`single`"
                        sticky-header
                        class="card-table"
                        ref="dataTable"
                        :items="dataOptimize"
                        :fields="fieldDataOptimize"
                        :striped="false"
                        :bordered="true"
                        :outlined="true"
                        :hover="true"
                        style="text-align: center;"
                        :busy="isBusy"
                >
                    <template v-slot:cell(manage)="row">
                        <b-button size="sm" variant="outline-info" @click="drawChart(row.item.optimize)"><i class="fa fa-chart-line"></i></b-button>
                    </template>
                    <template v-slot:cell(date)="row">
                        {{row.item.optimize[0].date}}
                    </template>
                    <template v-slot:cell(avg_real_salary)="row">
                        {{convertToCurrency(row.item.avg_real_salary)}}
                        <i
                                v-if="row.item.optimize[0].avg_real_percent < 0"
                                class="text-danger fa fa-arrow-down"
                        > {{row.item.optimize[0].avg_real_percent}} %</i>
                        <i
                                v-if="row.item.optimize[0].avg_real_percent > 0"
                                class="text-success fa fa-arrow-up"
                        > {{row.item.optimize[0].avg_real_percent}} %</i>
                    </template>
                    <template v-slot:cell(avg_gena_salary)="row">
                        {{convertToCurrency(row.item.avg_gena_salary)}}
                        <i
                                v-if="row.item.optimize[0].avg_gena_percent < 0"
                                class="text-danger fa fa-arrow-down"
                        > {{row.item.optimize[0].avg_gena_percent}} %</i>
                        <i
                                v-if="row.item.optimize[0].avg_gena_percent > 0"
                                class="text-success fa fa-arrow-up"
                        > {{row.item.optimize[0].avg_gena_percent}} %</i>
                    </template>
                    <template v-slot:table-busy>
                        <div class="text-center text-info my-2">
                            <strong>Đang lấy dữ liệu, vui lòng chờ <i class="fa fa-spin fa-spinner"></i></strong>
                        </div>
                    </template>
                    <template v-slot:head(avg_real_salary)="row">
                        Tb lương thực (VND) <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                    <template v-slot:head(avg_gena_salary)="row">
                        Tb lương chuẩn (VND) <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                    <template v-slot:head(username)="row">
                        Username <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                    <template v-slot:head(fullname)="row">
                        Họ tên <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                    <template v-slot:head(alias)="row">
                        Mã cod <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                    <template v-slot:head(st_name)="row">
                        Tên kho <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                    <template v-slot:head(pv_name)="row">
                        Tên tỉnh <i style="color: #26B4FF;" class="fa fa-sort"></i>
                    </template>
                </b-table>
                <br>
                <div class="d-flex justify-content-center" v-if="dataOptimize.length > 0">
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="rows"
                            :per-page="perPage"
                            class="mt-4"
                    >
                        <template v-slot:prev-text><span class="text-info">Trang trước</span></template>
                        <template v-slot:next-text><span class="text-info">Trang sau</span></template>
                        <template v-slot:page="{ page, active }">
                            <b v-if="active">{{ page }}</b>
                            <i v-else>{{ page }}</i>
                        </template>
                    </b-pagination>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<style scoped>
    .monthly-picker >>> .input {
        /*max-width: 85px !important;*/
        font-weight: bold;
        color: #28c3d7 ;
    }

    .fa {
        transition: all .5s;
    }

    button:hover .fa {
        transform: scale(1.2) rotate(30deg);
    }
</style>

<script>
import addressService from 'domain/services/address-service'
import StationService from 'domain/services/station-service'
import salaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import ShowOptimizeSalary from './Component/ShowOptimizeSalary'

export default {
  name: 'optimize-salary-cod-province',

  components: {
    'multiselect': Multiselect,
    VueMonthlyPicker,
    Moment,
    ShowOptimizeSalary
  },

  data: () => ({
    regionOption: [
      {id: 1, name: 'Cả nước'}
    ],
    regionOptions: [
      {id: 1, name: 'Cả nước'},
      {id: 10, name: 'Miền Bắc'},
      {id: 20, name: 'Miền Trung'},
      {id: 30, name: 'Miền Nam'}
    ],
    provinceOption: [],
    provinceOptions: [],
    stationOption: [],
    stationOptions: [],
    formulaOption: [],
    formulaOptions: [],
    isSearching: false,
    minMonth: new Moment('2020-06'),
    maxMonth: new Moment().format('YYYY-MM'),
    salaryMonth: new Moment(),
    dataOptimize: [],
    fieldDataOptimize: [
      {key: 'username', label: 'Username', sortable: true},
      {key: 'fullname', label: 'Họ tên', sortable: true},
      {key: 'alias', label: 'Mã cod', sortable: true},
      {key: 'st_name', label: 'Tên kho', sortable: true},
      {key: 'pv_name', label: 'Tên tỉnh', sortable: true},
      {key: 'r_name', label: 'Tên miền', sortable: true},
      {key: 'formula', label: 'CT lương', sortable: true},
      {key: 'date', label: 'Ngày', sortable: true},
      {key: 'avg_real_salary', label: 'Tb lương thực', sortable: true},
      {key: 'avg_gena_salary', label: 'Tb lương chuẩn', sortable: true},
      {key: 'manage', label: 'Biểu đồ'}
    ],
    dataDraw: [],
    rows: 1000,
    perPage: 10,
    currentPage: 1,
    isBusy: false,
    numPerPageOption: [
      { value: 5, text: 'Lấy và hiển thị 5 cod' },
      { value: 10, text: 'Lấy và hiển thị 10 cod' },
      { value: 20, text: 'Lấy và hiển thị 20 cod' },
      { value: 50, text: 'Lấy và hiển thị 50 cod' },
      { value: 100, text: 'Lấy và hiển thị 100 cod' }
    ],
    numPerPage: 20
  }),

  created () {
    this.getAllProvince(1)
    this.getAllFormula()
  },

  watch: {
    regionOption: function (newValue, oldValue) {
      this.getAllProvince(newValue.id)
    },
    provinceOption: function (newValue, oldValue) {
      this.getAllStation()
    },
    currentPage: function (newValue, oldValue) {
      this.getSalaryOptimize(1)
    }
  },

  methods: {
    getAllProvince: function (regionId) {
      this.provinceOption = []
      this.provinceOptions = []
      let data = {}
      if (regionId !== 1) data = {'region': regionId}
      addressService.getProvincesByRegion(data).then(res => {
        if (res.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách tỉnh!')
        for (let provinceId in res.data) {
          this.provinceOptions.push({id: provinceId, name: res.data[provinceId]})
        }
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh'))
    },

    getAllStation: function () {
      this.stationOption = []
      this.stationOptions = []
      let data = {}
      if (this.provinceOption.length > 0) {
        data.province_ids = this.provinceOption.map(province => province.id)
      }
      StationService.getListStationByProvinceIds(data).then(res => {
        if (res.data.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
        this.stationOptions = res.data.data
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách kho'))
    },

    getAllFormula () {
      salaryService.getAllFormulaCod().then(res => {
        res.data.forEach(formula => {
          this.formulaOptions.push({id: formula.code, name: formula.name})
        })
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách công thức lương'))
    },

    getSalaryOptimize (optionPage) {
      if (optionPage !== 1) this.currentPage = 1
      this.isBusy = true
      this.isSearching = true
      this.dataOptimize = []
      this.dataDraw = []
      let dataSend = {
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        page: this.currentPage,
        limit: this.numPerPage
      }
      if (this.regionOption !== []) dataSend.region = this.regionOption.id
      if (this.provinceOption !== []) dataSend.province = Object.values(this.provinceOption).map(element => element.id).toString()
      if (this.stationOption !== []) dataSend.station = Object.values(this.stationOption).map(element => element.id).toString()
      if (this.formulaOption !== []) dataSend.formula = Object.values(this.formulaOption).map(element => element.id).toString()
      salaryService.getSalaryOptimize(dataSend).then(res => {
        this.isSearching = false
        this.isBusy = false
        if (res.data.success) {
          this.dataOptimize = Object.values(res.data.data)
        } else commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi xử lý danh sách thu nhập'))
    },

    drawChart (data) {
      this.dataDraw = data
    },

    clearSearch () {
      this.provinceOption = []
      this.stationOption = []
      this.formulaOption = []
      this.numPerPage = 20
    },

    convertToCurrency (data) {
      const formatter = new Intl.NumberFormat('en-US', {})
      return formatter.format(data)
    }
  }
}
</script>
