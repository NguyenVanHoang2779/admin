<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
      <div>Quản lý bỏ phạt</div>
    </h4>
    <!--    Bộ lọc-->
    <b-card class="mb-3">
      <div class="row mb-2">
        <div class="col-md">

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Công thức lương:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.formulaOptions" @model="searchData.selectFormula = $event" :value="searchData.selectFormula" class-name="multiselect-success"></select-options>
              </b-col>
            </b-row>
          </div>

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Loại phạt:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.penaltyOptions" @model="searchData.selectTypePenalty = $event" :value="searchData.selectTypePenalty" class-name="multiselect-warning"></select-options>
              </b-col>
            </b-row>
          </div>

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Mã cod:</label>
              </b-col>
              <b-col sm="9">
                <select-user-penalty @model="searchData.selectCodeCod = $event" :value="searchData.selectCodeCod"></select-user-penalty>
              </b-col>
            </b-row>
          </div>

        </div>
        <div class="col-md">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Vùng:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.regionOptions" @model="searchData.selectRegion = $event"  :value="searchData.selectRegion" class-name="multiselect-dark"></select-options>
              </b-col>
            </b-row>
          </div>

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Tỉnh:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.provinceOptions" @model="searchData.selectProvince = $event"  :value="searchData.selectProvince" class-name="multiselect-info"></select-options>
              </b-col>
            </b-row>
          </div>

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Kho:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.stationOptions" @model="searchData.selectStation = $event" :value="searchData.selectStation" class-name="multiselect-primary"></select-options>
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
                  <ladda-btn :loading="loading.search" @click.native="getDataConfigs" data-style="zoom-out"
                             class="btn btn-success w-200px">
                    <i class="ion ion-md-search"></i> Tìm kiếm
                  </ladda-btn>
                </b-col>
                <b-col sm="6" md="12" lg="12" xl="6" class="d-flex justify-content-end col-6 mb-1">
                  <b-button @click="openCreateModel" class="btn btn-info w-200px">
                    <i class="fa fa-plus-circle"></i> Tạo mới
                  </b-button>
                </b-col>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </b-card>

    <!--    Kết quả-->
    <b-card no-body>
      <b-card-body>
        <br>
        <b-table
          sort-icon-left
          responsive
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items="dataConfigs"
          :fields="fieldDataConfig"
          head-variant="dark"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          style="text-align: center;"
          :busy="isBusy"
        >
          <template #head(id)="data">
            <span><i class="fas fa-sort"></i> {{ data.label.toUpperCase() }}</span>
          </template>
          <template #head(from)="data">
            <span><i class="fas fa-sort"></i> {{ data.label }}</span>
          </template>
          <template #head(to)="data">
            <span><i class="fas fa-sort"></i> {{ data.label }}</span>
          </template>
          <template #head(type_area)="data">
            <span><i class="fas fa-sort"></i> {{ data.label }}</span>
          </template>
          <template #table-colgroup="scope">
            <col
              v-for="field in scope.fields"
              :key="field.key"
              :style="{ width: (field.key === 'formula_detail' || field.key === 'penalties' || field.key === 'note') ? '15%' : 'auto' }"
            >
          </template>
          <template v-slot:cell(from)="data">
            <div class="custom-column">
              <div class="mx-1 p-1">
                {{data.item.from}}
              </div>
            </div>
          </template>
          <template v-slot:cell(to)="data">
            <div class="custom-column">
              <div class="mx-1 p-1">
                {{data.item.to}}
              </div>
            </div>
          </template>
          <template v-slot:cell(formula_detail)="data">
            <div class="custom-column p-1" style="text-align: left">
            <b-list-group v-if="data.item.formula_detail">
              <b-list-group-item class="mx-2 mb-1 pl-2" v-for="item in data.item.formula_detail" :key="item.id" variant="success">
                {{item.name}}
              </b-list-group-item>
            </b-list-group>
              <b-list-group v-else>
                <b-list-group-item class="mx-2 mb-1 pl-2" variant="success">Áp dụng tất cả</b-list-group-item>
              </b-list-group>
            </div>
          </template>
          <template v-slot:cell(type_area)="data">
            <div class="custom-column">
              <div class="mx-1 p-1">
                {{data.item.type_area ? data.item.type_area : 'Áp dụng tất cả'}}
              </div>
            </div>
          </template>
          <template v-slot:cell(area_detail)="data">
            <div class="custom-column p-1" style="text-align: left">
              <b-list-group v-if="data.item.area_detail">
                <b-list-group-item class="mx-2 mb-1 pl-2" v-for="item in data.item.area_detail" :key="item.id" variant="primary">
                  {{item.name}}
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-else>
                <b-list-group-item class="mx-2 mb-1 pl-2" variant="warning">Áp dụng tất cả</b-list-group-item>
              </b-list-group>
            </div>
          </template>
          <template v-slot:cell(penalties)="data">
            <div class="custom-column p-1" style="text-align: left">
              <b-list-group>
                <b-list-group-item class="mx-2 mb-1 pl-2" v-for="item in data.item.penalties" :key="item.id" variant="danger">
                  {{item.name}}
                </b-list-group-item>
              </b-list-group>
            </div>
          </template>
          <template v-slot:cell(note)="data">
            <div class="custom-column p-1" style="text-align: left">
              <div class="mx-2 p-2 rounded">
                <p>{{data.item.note}}</p>
              </div>
            </div>
          </template>
          <template v-slot:cell(modified)="data">
            <div class="custom-column p-1" style="text-align: left">
              <div class="mx-2 p-2 rounded">
                <p>{{data.item.modified}} / {{data.item.modified_detail.username}}</p>
              </div>
            </div>
          </template>
          <template v-slot:cell(manage)="data">
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-success" @click="openModelUpdate(data.item)"><i class="fa fa-pencil-alt"></i></b-button>
            <b-button class="ml-1 mt-1 mb-1 mr-1" size="sm" variant="outline-danger" @click="deleteConfig(data.item.id)"><i class="fa fa-trash"></i></b-button>
          </template>
        </b-table>
        <br>
        <div class="d-flex justify-content-center">
          <b-pagination
            v-model="page.currentPage"
            :total-rows="page.totalItems"
            :per-page="page.perPage"
            v-on:input="getDataConfigs"
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
    <b-modal id="create-config-salary" modal-class="modal-xl" size="xl" hide-footer @close="cancel()">
      <template v-slot:modal-title>
        <h3 class="text-muted"><i class="fa fa-cog"></i> Bỏ Phạt</h3>
      </template>
      <b-row>
        <b-col sm="6">
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Từ ngày:</label>
            </b-col>
            <b-col>
              <datepicker v-model="saveData.from" placeholder="Từ Ngày" :bootstrapStyling="true" :format="customFormatter"/>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Công thức lương:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.formulaOptions" @model="saveData.selectFormula = $event" :holder="'Chọn công thức lương'" :value="saveData.selectFormula" class-name="multiselect-success"></select-options>
            </b-col>
          </b-row>
          <b-row v-if="!isUpdate" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Miền:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.regionOptions" @model="saveData.selectRegion = $event" :holder="'Chọn miền'" :value="saveData.selectRegion" class-name="multiselect-dark"></select-options>
            </b-col>
          </b-row>
          <b-row v-if="!isUpdate" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Kho:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.stationOptions" @model="saveData.selectStation = $event" :holder="'Chọn kho'" :value="saveData.selectStation" class-name="multiselect-primary"></select-options>
            </b-col>
          </b-row>
          <b-row v-else class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Loại vùng phạt:</label>
            </b-col>
            <b-col>
              <select-type @model="typeValue = $event" :holder="'Chọn vùng phạt'" :value="typeValue"></select-type>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="label-penalty-note" sm="3">
              <label class="font-italic">Ghi chú:</label>
            </b-col>
            <b-col>
              <b-form-textarea
                id="textarea"
                v-model="saveData.note"
                placeholder="Nội dung ghi chú"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="6">
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Đến ngày:</label>
            </b-col>
            <b-col>
              <datepicker v-model="saveData.to"  placeholder="Đến Ngày" :bootstrapStyling="true" :format="customFormatter" />
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Loại phạt:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.penaltyOptions" @model="saveData.selectTypePenalty = $event" :holder="'Chọn bỏ loại phạt'" :value="saveData.selectTypePenalty" class-name="multiselect-warning"></select-options>
            </b-col>
          </b-row>
          <b-row v-show="typeValue === 'region'" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Miền:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.regionOptions" @model="saveData.selectRegion = $event" :holder="'Chọn miền'" :value="saveData.selectRegion" class-name="multiselect-dark"></select-options>
            </b-col>
          </b-row>
          <b-row v-show="(!isUpdate || typeValue === 'province')" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Tỉnh:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.provinceOptions" @model="saveData.selectProvince = $event" :holder="'Chọn tỉnh'" :value="saveData.selectProvince" class-name="multiselect-info"></select-options>
            </b-col>
          </b-row>
          <b-row v-show="typeValue === 'station'" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Kho:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.stationOptions" @model="saveData.selectStation = $event" :holder="'Chọn kho'" :value="saveData.selectStation" class-name="multiselect-primary"></select-options>
            </b-col>
          </b-row>
          <b-row v-show="(!isUpdate || typeValue === 'user')" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Mã Cod:</label>
            </b-col>
            <b-col>
              <select-user-penalty @model="saveData.selectCodeCod = $event" :holder="'Chọn Cod'" :value="saveData.selectCodeCod"></select-user-penalty>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="label-penalty-list-cod" sm="3">
              <label class="font-italic">Danh sách Cod:</label>
            </b-col>
            <b-col>
              <b-form-textarea
                id="textarea"
                v-model="stringCodeCods"
                placeholder="Nhập mã alias Cod cách nhau bởi dấu ' , '"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <b-button class="mt-3" variant="success" v-if="!isUpdate" block @click="createConfig()">Tạo Mới <i class="fa fa-plus"></i></b-button>
          <b-button class="mt-3" variant="info" v-else block @click="updateConfig()">Cập Nhật <i class="fa fa-edit"></i></b-button>
        </b-col>
        <b-col sm="4" md="12" lg="12" xl="4">
          <b-button v-b-modal.modal-import-excel block class="btn btn-outline-ghtk mt-3">
            Import Excel
          </b-button>
          <b-modal id="modal-import-excel" hide-footer centered @close="closeImportExcel()">
            <template  v-slot:modal-title>
              <h3 class="text-muted">Tạo mới bằng file Excel</h3>
            </template>
            <div>
              <div class="mb-3">
                <h4>Download: <a :href="urlTemplate">template mẫu</a></h4>
              </div>
              <div class="mb-3">
                <h4>Các loại bỏ phạt hợp lệ</h4>
                <b-table striped hover head-variant="dark" :items="typePenalty"></b-table>
              </div>
              <div class="mb-4">
                <b-form-file
                  v-model="file2"
                  :state="Boolean(file2)"
                  placeholder="Chọn file excel và kéo thả vào đây..."
                  drop-placeholder="Drop file here..."
                  browse-text="Chọn file"
                  accept=".xls, .xlsx"
                  ref="file-input"
                ></b-form-file>
              </div>
              <div class="w-100 d-flex justify-content-center">
                <ladda-btn
                  :loading="isLoading"
                  @click.native="importExcel"
                  data-style="zoom-out"
                  class="btn btn-primary"
                >
                  <i class="fa fa-plus-circle"></i>
                  Tạo mới
                </ladda-btn>
              </div>
            </div>
          </b-modal>
        </b-col>
        <b-col sm="4">
          <b-button class="mt-3" variant="danger" block @click="cancel()">Hủy Bỏ <i class="fa fa-times"></i></b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<style scoped>
.custom-column {
  height: 110px;
  overflow-y: auto;
  max-width: 250px;
}
</style>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import sosService from 'domain/services/internal-sos-service'
import cancelPenaltyService from 'domain/services/config-cancel-penalty'
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import cycleTime from 'infrastructures/helpers/date.js'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import CustomButton from 'components/elements/common/CustomButton'
import SelectUserPenalty from '../penalties/SelectUserPenalty'
import SelectOptions from './SelectOptions'
import SelectType from './SelectType'

const initialData = () => {
  return {
    from: cycleTime.getMonthSalaryByDate(moment(Date.now()).format('YYYY-MM-DD')).from,
    to: cycleTime.getMonthSalaryByDate(moment(Date.now()).format('YYYY-MM-DD')).to,
    selectCodeCod: [],
    selectFormula: [],
    selectRegion: [],
    selectStation: [],
    selectTypePenalty: [],
    selectProvince: [],
    note: ''
  }
}

export default {
  name: 'config-cancel-penalties',
  metaInfo: {
    title: 'Config bỏ phạt'
  },

  components: {
    SelectType,
    Multiselect,
    commonHelper,
    flatPickr,
    vueNumeric,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    moment,
    CustomButton,
    SelectOptions,
    SelectUserPenalty,
    cycleTime
  },
  data: () => ({
    sortBy: 'id',
    sortDesc: true,
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      totalItems: 0
    },
    searchData: initialData(),
    saveData: initialData(),
    dataConfigs: [],
    fieldDataConfig: [
      {key: 'id', label: 'Id', sortable: true},
      {key: 'from', label: 'Ngày bắt đầu', sortable: true},
      {key: 'to', label: 'Ngày kết thúc', sortable: true},
      {key: 'formula_detail', label: 'Công thức lương', sortable: false},
      {key: 'type_area', label: 'Vùng bỏ phạt', sortable: true},
      {key: 'area_detail', label: 'Chi tiết vùng bỏ phạt', sortable: false},
      {key: 'penalties', label: 'Loại bỏ phạt', sortable: false},
      {key: 'note', label: 'Ghi chú', sortable: false},
      {key: 'modified', label: 'Sửa gần nhất'},
      {key: 'manage', label: 'Quản lý', sortable: false}
    ],
    backupData: [],
    loading: {
      search: false,
      confirm: false
    },
    isBusy: false,
    isUpdate: false,
    dataOptions: {
      formulaOptions: [],
      stationOptions: [],
      provinceOptions: [],
      penaltyOptions: [],
      regionOptions: [
        {id: 10, name: 'Miền Bắc'},
        {id: 20, name: 'Miền Trung'},
        {id: 30, name: 'Miền Nam'}
      ]
    },
    typeValue: '',
    idUpdate: null,
    stringCodeCods: '',
    file2: null,
    isLoading: false,
    typePenalty: [
      {Key: 'sach_tuyen', Description: 'Sạch tuyến'},
      {Key: 'tich_xanh', Description: 'Tick xanh'},
      {Key: 'chat_luong_lay', Description: 'Chất lượng lấy'},
      {Key: 'trung_chuyen_tra', Description: 'Trung chuyển trả'},
      {Key: 'sach_tra', Description: 'Sạch trả'},
      {Key: 'mot_phien', Description: 'Thiếu 1 phiên'},
      {Key: 'hai_phien', Description: 'Thiếu 2 phiên'},
      {Key: 'mot_phien_du', Description: 'Coi 1 phiên thành 2 phiên'},
      {Key: 'hai_phien_du', Description: 'Coi 0 phiên thành 2 phiên'}
    ],
    urlTemplate: ''
  }),

  computed: {
    totalPages () {
      return Math.ceil(this.page.totalItems / this.page.perPage)
    },
    listCodeCods () {
      let arrCod = this.stringCodeCods.split(',')
      return arrCod.map(item => item.trim())
    }
  },
  watch: {
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      if (modalId === 'modal-import-excel') {
        this.file2 = null
      }
    })
  },
  methods: {
    // Lấy thông tin phạt
    getDataConfigs () {
      let dataSend = {
        from: this.searchData.from ? moment(new Date(this.searchData.from)).format('YYYY-MM-DD') : null,
        to: this.searchData.to ? moment(new Date(this.searchData.to)).format('YYYY-MM-DD') : null,
        formulas: this.searchData.selectFormula,
        type_penalties: this.searchData.selectTypePenalty,
        users: this.searchData.selectCodeCod,
        regions: this.searchData.selectRegion,
        provinces: this.searchData.selectProvince,
        stations: this.searchData.selectStation,
        page: this.page.currentPage,
        limit: this.page.perPage
      }
      this.loading.search = true
      this.dataConfigs = []
      cancelPenaltyService.apiGetConfig(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.dataConfigs = Object.values(data)
            this.backupData = JSON.parse(JSON.stringify(data))
            this.$forceUpdate()
          } else {
            this.dataConfigs = []
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

    createConfig () {
      if (this.saveData.selectTypePenalty.length === 0) return commonHelper.showMessage('Vui lòng chọn loại phạt được bỏ')
      if (this.saveData.from === null || this.saveData.to === null) return commonHelper.showMessage('Khoảng thời gian áp dụng không hợp lệ')
      let dataSend = {
        from: this.saveData.from ? moment(new Date(this.saveData.from)).format('YYYY-MM-DD') : null,
        to: this.saveData.to ? moment(new Date(this.saveData.to)).format('YYYY-MM-DD') : null,
        formulas: this.saveData.selectFormula,
        type_penalties: this.saveData.selectTypePenalty,
        users: this.saveData.selectCodeCod,
        regions: this.saveData.selectRegion,
        provinces: this.saveData.selectProvince,
        stations: this.saveData.selectStation,
        note: this.saveData.note,
        id_cods: this.stringCodeCods ? this.listCodeCods : []
      }
      cancelPenaltyService.apiSaveCancelPenalties(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.cancel()
          this.getDataConfigs()
        } else {
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi tạo config bỏ phạt'))
    },
    openCreateModel () {
      this.isUpdate = false
      this.resetForm()
      this.$bvModal.show('create-config-salary')
    },

    openModelUpdate (data) {
      this.resetForm()
      this.isUpdate = true
      this.idUpdate = data.id
      this.saveData.from = data.from
      this.saveData.to = data.to
      this.saveData.selectFormula = data.formula_detail
      this.typeValue = data.type_area
      this.saveData.note = data.note
      switch (data.type_area) {
        case 'user': this.saveData.selectCodeCod = data.area_detail
          break
        case 'region': this.saveData.selectRegion = data.area_detail
          break
        case 'province': this.saveData.selectProvince = data.area_detail
          break
        case 'station': this.saveData.selectStation = data.area_detail
          break
      }
      this.saveData.selectTypePenalty = data.penalties
      this.$bvModal.show('create-config-salary')
    },

    updateConfig () {
      if (confirm('Bạn có chắc chắn muốn cập nhập thông tin không?')) {
        let dataSend = {
          id: this.idUpdate,
          from: this.saveData.from ? moment(new Date(this.saveData.from)).format('YYYY-MM-DD') : null,
          to: this.saveData.to ? moment(new Date(this.saveData.to)).format('YYYY-MM-DD') : null,
          formulas: this.saveData.selectFormula,
          type_penalties: this.saveData.selectTypePenalty,
          users: this.typeValue === 'user' ? this.saveData.selectCodeCod : [],
          regions: this.typeValue === 'region' ? this.saveData.selectRegion : [],
          provinces: this.typeValue === 'province' ? this.saveData.selectProvince : [],
          stations: this.typeValue === 'station' ? this.saveData.selectStation : [],
          note: this.saveData.note,
          id_cods: this.stringCodeCods ? this.listCodeCods : []
        }
        cancelPenaltyService.apiUpdateConfig(dataSend).then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.cancel()
            this.getDataConfigs()
          } else {
            commonHelper.showMessage(res.data.message)
          }
        }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi xóa config bỏ phạt'))
      }
    },
    deleteConfig (data) {
      if (confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        cancelPenaltyService.apiUpdateConfig({'id': data, 'is_active': 1}).then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getDataConfigs()
          } else {
            commonHelper.showMessage(res.data.message)
          }
        }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi xóa config bỏ phạt'))
      }
    },
    getListPenalty () {
      this.loading.search = true
      cancelPenaltyService.apiGetListPenalties().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            for (let key in response.data.data) {
              this.dataOptions.penaltyOptions.push({id: key, name: response.data.data[key]})
            }
          }
        }
      }).catch(() => {
      }).then(() => {
        this.loading.search = false
      })
    },
    getAllFormula () {
      this.loading.search = true
      cancelPenaltyService.apiGetListFormula().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            response.data.data.map(item => {
              this.dataOptions.formulaOptions.push({id: item.code, name: item.name})
            })
          }
        }
      }).catch(() => {
      }).then(() => {
        this.loading.search = false
      })
    },
    getListProvince () {
      this.loading.search = true
      sosService.apiGetAllProvince().then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.dataOptions.provinceOptions = response.data.data
        }
      }).catch(() => {
      }).then(() => {
        this.loading.search = false
      })
    },
    getListStation () {
      this.loading.search = true
      sosService.apiGetAllStation().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataOptions.stationOptions = response.data.data
          }
        }
      }).catch(() => {
      }).then(() => {
        this.loading.search = false
      })
    },
    importExcel () {
      let dataSend = new FormData()
      if (this.file2 == null) {
        return commonHelper.showMessage('Chưa chọn file excel cần import', 'warning')
      }
      dataSend.append('files', this.file2)

      this.isLoading = true
      cancelPenaltyService.apiImportExcel(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.closeImportExcel()
          this.cancel()
          this.getDataConfigs()
        } else {
          this.isLoading = false
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi import file excel'))
    },
    exportTemplateExcel () {
      cancelPenaltyService.apiUpdateConfig().then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.cancel()
          this.getDataConfigs()
        } else {
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi export file mẫu'))
    },
    resetForm () {
      this.saveData = initialData()
      this.typeValue = ''
      this.stringCodeCods = ''
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    cancel () {
      this.isUpdate = false
      this.resetForm()
      this.$bvModal.hide('create-config-salary')
    },
    closeImportExcel () {
      this.$refs['file-input'].reset()
      console.log(Boolean(this.file2))
      this.isLoading = false
      this.$bvModal.hide('modal-import-excel')
    },
    getTypePenalties () {
      cancelPenaltyService.apiGetTypePenalties().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.typePenalty = response.data.data
          }
        }
      }).catch(() => {
      })
    },
    getUrlTemPlate () {
      cancelPenaltyService.exportTemplateExcel().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.urlTemplate = response.data.data
            console.log(this.urlTemplate)
          }
        }
      }).catch(() => {
      })
    }
  },

  created () {
    this.getUrlTemPlate()
    this.getDataConfigs()
    this.getAllFormula()
    this.getListPenalty()
    this.getListProvince()
    this.getListStation()
    this.getTypePenalties()
  }
}
</script>
