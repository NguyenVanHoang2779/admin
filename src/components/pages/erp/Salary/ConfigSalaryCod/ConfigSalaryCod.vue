<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row><h4 class="ml-3">Quản Lý Config Bỏ Phạt & Coupon</h4></b-row>
        <hr>
        <b-row>
          <b-col>
            <vue-monthly-picker
              class="monthly-picker"
              v-model="salaryMonth"
              :alignment="`center`"
              :dateFormat="`MM-YYYY`"
              :clearOption="true"
            ></vue-monthly-picker>
          </b-col>
          <b-col md="1">
            <multiselect
              class="multiselect-info"
              :options="regionOptions"
              v-model="regionOption"
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
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
              selectLabel="Chọn"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              label="name"
              track-by="id"
              :multiple="true"
              :preserve-search="true"
              :hide-selected="false"
            />
          </b-col>
          <b-col class="ml-32">
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
            <b-input placeholder="Mã cod" v-model="codAlias"></b-input>
          </b-col>
          <b-col md="1">
            <b-btn variant="outline-info" @click="getConfig()" :disabled="isSearching">
              Tìm kiếm <i class="fa fa-search" v-if="!isSearching"></i>
              <i class="fa fa-spinner fa-spin" v-if="isSearching"></i>
            </b-btn>
          </b-col>
          <b-col md="1">
            <b-btn variant="outline-primary" @click="clearSearch()">
              Xóa lọc <i class="fa fa-broom"></i>
            </b-btn>
          </b-col>
          <b-col md="1">
            <b-btn variant="outline-success" @click="createConfig()">
              Tạo mới <i class="fa fa-plus-circle"></i>
            </b-btn>
          </b-col>
        </b-row>
        <br>
        <b-row>
          <b-col>
            <b-input placeholder="Từ ngày" v-model="exportDateFrom" type="date"></b-input>
          </b-col>
          <b-col>
            <b-input type="date" placeholder="Đến ngày" v-model="exportDateTo"></b-input>
          </b-col>
          <b-col md="1">
            <b-btn variant="outline-success" @click="exportConfig()">
              Xuất file <i class="fa fa-file-excel"></i>
            </b-btn>
          </b-col>
        </b-row>
        <br>
        <create-config
          :region-options="regionOptions"
          :option-fine="optionFine"
          :edit-config="editConfig"
          :work-type-options="workTypeOptions"
          @resetForm="resetForm()"
          :is-created-config="isCreateConfig"
        />
      </b-card-body>
    </b-card>
    <br>
    <b-card no-body>
      <b-card-body>
        <br>
        <b-table
          sort-icon-left
          responsive
          selectable
          :select-mode="`single`"
          sticky-header
          class="card-table"
          ref="dataTable"
          :items="dataConfig"
          :fields="fieldDataConfig"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          style="text-align: center;"
          :busy="isBusy"
        >
          <template v-slot:cell(region)="data">
            <div class="non-blur custom-multiselect">
              <multiselect
                class="multiselect-info"
                :options="[data.item.region || []]"
                v-model="data.item.region"
                placeholder="Chọn công thức lương"
                label="name"
                track-by="id"
                :disabled="true"
                :preserve-search="true"
                :multiple="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(province)="data">
            <div class="non-blur custom-multiselect">
              <multiselect
                class="multiselect-info"
                :options="[data.item.province || []]"
                v-model="data.item.province"
                placeholder="Không có tỉnh được áp dụng"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(station)="data">
            <div class="non-blur custom-multiselect">
              <multiselect
                class="multiselect-info"
                :options="[data.item.station || []]"
                v-model="data.item.station"
                placeholder="Không có kho được áp dụng"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(fine)="data">
            <div class="non-blur custom-multiselect">
              <multiselect
                class="multiselect-info"
                :options="optionFine"
                v-model="data.item.fine"
                placeholder="Không được bỏ phạt"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(detail)="data">
            <div class="non-blur custom-multiselect">
              <multiselect
                class="multiselect-info"
                :options="data.item.detail"
                v-model="data.item.detail"
                placeholder="Chi tiết"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(work_type)="data">
            <div class="non-blur custom-multiselect">
              <multiselect
                class="multiselect-info"
                :options="workTypeOptions"
                v-model="data.item.work_type"
                placeholder="Loại hình áp dụng"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(alias_apply)="data">
            <div class="non-blur custom-multiselect alias-column">
              <multiselect
                class="multiselect-info"
                :options="[data.item.alias_apply || []]"
                v-model="data.item.alias_apply"
                placeholder="Danh sách trống"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(alias_not_apply)="data">
            <div class="non-blur custom-multiselect alias-column">
              <multiselect
                class="multiselect-info"
                :options="[data.item.alias_not_apply || []]"
                v-model="data.item.alias_not_apply"
                placeholder="Danh sách trống"
                label="name"
                track-by="id"
                :disabled="true"
                :multiple="true"
                :preserve-search="true"
                :hide-selected="false"
              />
            </div>
          </template>
          <template v-slot:cell(description)="data">
            <div class="custom-multiselect desc-column">
              {{data.item.description}}
            </div>
          </template>
          <template v-slot:cell(manage)="data">
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-success" @click="updateConfigFine(data.item)"><i class="fa fa-pencil-alt"></i></b-button>
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-danger" @click="deleteConfigFine(data.item.group_id)"><i class="fa fa-trash"></i></b-button>
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-warning" @click="calSalaryCodFine(data.item)">Chạy lại lương</b-button>
          </template>
        </b-table>
        <br>
        <div class="d-flex justify-content-center">
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
  .alias-column {
    width: 500px;
  }

  .desc-column {
    width: 500px;
  }

  .fa {
    transition: all .5s;
  }

  button:hover .fa {
    transform: scale(1.2) rotate(30deg);
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
import addressService from 'domain/services/address-service'
import StationService from 'domain/services/station-service'
import salaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import CreateConfig from './component/createConfig'

export default {
  name: 'config-fine-cod',

  components: {
    'multiselect': Multiselect,
    VueMonthlyPicker,
    Moment,
    CreateConfig
  },

  data: () => ({
    regionOption: [
      {id: 10, name: 'Miền Bắc'}
    ],
    regionOptions: [
      {id: 10, name: 'Miền Bắc'},
      {id: 20, name: 'Miền Trung'},
      {id: 30, name: 'Miền Nam'}
    ],
    optionFine: [
      {id: 'clean', name: 'Bỏ phạt sạch tuyến', work_shift: ''},
      {id: 'speed', name: 'Bỏ phạt tốc độ', work_shift: ''},
      {id: 'quality_pick', name: 'Bỏ phạt chất lượng lấy', work_shift: ''},
      {id: 'quality_deliver', name: 'Bỏ phạt chất lượng giao', work_shift: ''},
      {id: 'quality_return', name: 'Bỏ phạt chất lượng trả', work_shift: ''},
      {id: 'session_2_2', name: 'Thực phiên tăng tối đa 2 phiên và phiên thiếu giảm tối đa 2 phiên / 1 ngày'},
      {id: 'session_0_2', name: 'Thực phiên không tăng, phiên thiếu giảm tối đa 2 phiên / 1 ngày'},
      {id: 'session_1_1', name: 'Thực phiên tăng tối đa 1 phiên và phiên thiếu giảm tối đa 1 phiên / 1 ngày'},
      {id: 'session_0_1', name: 'Thực phiên không tăng, phiên thiếu giảm tối đa 1 phiên / ngày'}
    ],
    workTypeOptions: [
      {id: 'fulltime', name: 'Full Time'},
      {id: 'partime', name: 'Part Time'}
    ],
    codAlias: '',
    allProvinces: [],
    provinceOption: [],
    provinceOptions: [],
    stationOption: [],
    stationOptions: [],
    formulaOption: [],
    formulaOptions: [],
    isSearching: false,
    minMonth: new Moment('2020-04'),
    maxMonth: new Moment().format('YYYY-MM'),
    salaryMonth: new Moment(),
    dataConfig: [],
    fieldDataConfig: [
      {key: 'id_config', label: 'Id config', sortable: true},
      {key: 'from_date', label: 'Ngày bắt đầu', sortable: true},
      {key: 'to_date', label: 'Ngày kết thúc', sortable: true},
      {key: 'formula', label: 'Công thức lương', sortable: true},
      {key: 'region', label: 'Tên miền', sortable: true},
      {key: 'province', label: 'Tên tỉnh', sortable: true},
      {key: 'station', label: 'Tên kho', sortable: true},
      {key: 'fine', label: 'Loại bỏ phạt', sortable: true},
      {key: 'detail', label: 'Chi tiết', sortable: true},
      {key: 'work_type', label: 'Loại hình công việc', sortable: true},
      {key: 'alias_apply', label: 'Cod áp dụng', sortable: true},
      {key: 'alias_not_apply', label: 'Cod không áp dụng', sortable: true},
      {key: 'description', label: 'Mô tả', sortable: true},
      {key: 'manage', label: 'Quản lý'}
    ],
    editConfig: null,
    dataDraw: [],
    rows: 1000,
    perPage: 10,
    currentPage: 1,
    isBusy: false,
    provinceCreate: [],
    stationCreate: [],
    formulaCreate: [],
    isCreateConfig: false,
    exportDateTo: null,
    exportDateFrom: null
  }),

  created () {
    this.getAllProvince(1)
    this.getAllFormula()
    this.getConfig()
  },

  watch: {
    regionOption: function (newValue, oldValue) {
      this.getAllProvince(newValue.id)
    },
    provinceOption: function (newValue, oldValue) {
      this.getAllStation()
    },
    currentPage: function (newValue, oldValue) {
      this.getConfig()
    }
  },

  methods: {
    exportConfig () {
      let dataExport = {
        from_date: this.exportDateFrom,
        to_date: this.exportDateTo,
        region_id: this.regionOption[0].id
      }

      this.isBusy = true

      if (this.regionOption.length > 0) dataExport.region_id = this.regionOption[0].id
      if (this.provinceOption.length > 0) dataExport.province_id = this.provinceOption.map(e => e.id)
      if (this.stationOption.length > 0) dataExport.station_id = this.stationOption.map(e => e.id)
      if (this.formulaOption.length > 0) dataExport.formula = this.formulaOption
      salaryService.exportConfigFine(dataExport).then(res => {
        if (res.data.success) {
          window.location.href = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi lấy các config bỏ phạt'))
        .finally(() => {
          this.isBusy = false
        })
    },

    createConfig () {
      this.isCreateConfig = true
      this.$bvModal.show('create-config-salary')
    },

    resetForm: function () {
      this.editConfig = null
    },

    calSalaryCodFine: function (data) {
      salaryService.calSalaryCodFine(data).then(res => {
        if (res.data.success) return commonHelper.showMessage(res.data.message, 'success')
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra'))
    },

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

    clearSearch () {
      this.provinceOption = []
      this.stationOption = []
      this.formulaOption = []
      this.numPerPage = 20
    },

    getConfig () {
      let dataSeach = {
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY'),
        page: this.currentPage,
        region: this.regionOption
      }

      this.isBusy = true
      this.isSearching = true

      if (this.regionOption.length > 0) dataSeach.region = this.regionOption
      if (this.provinceOption.length > 0) dataSeach.province = this.provinceOption
      if (this.stationOption.length > 0) dataSeach.station = this.stationOption
      if (this.formulaOption.length > 0) dataSeach.formula = this.formulaOption
      if (this.codAlias !== '') dataSeach.cod_alias = this.codAlias

      salaryService.getConfigFine(dataSeach).then(res => {
        if (res.data.success) {
          this.dataConfig = Object.values(res.data.data)
          return commonHelper.showMessage(res.data.message, 'success')
        }
        this.dataConfig = []
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi lấy các config bỏ phạt'))
        .finally(() => {
          this.isBusy = false
          this.isSearching = false
        })
    },

    updateConfigFine (data) {
      this.editConfig = data
      this.isCreateConfig = false
      this.$bvModal.show('create-config-salary')
    },

    deleteConfigFine (idConfig) {
      if (!confirm('Bạn có chắc chắn muốn xóa config bỏ phạt này')) return 1
      salaryService.deleteGroupConfigFine({group_id: idConfig}).then(res => {
        if (res.data.success) {
          this.getConfig()
          return commonHelper.showMessage(res.data.message, 'success')
        }
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi xóa config bỏ phạt'))
    }
  }
}
</script>
