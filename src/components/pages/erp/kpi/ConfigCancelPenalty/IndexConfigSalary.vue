<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
      <div>Quản lý config lương</div>
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
                <label class="font-italic">Loại config:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.penaltyOptions" @model="searchData.selectTypePenalty = $event" :value="searchData.selectTypePenalty" class-name="multiselect-warning"></select-options>
              </b-col>
            </b-row>
          </div>

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic">Username:</label>
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
                <label class="font-italic">Vị trí:</label>
              </b-col>
              <b-col sm="9">
                <select-options :multiple-options="dataOptions.positionOptions" @model="searchData.selectPosition = $event" :value="searchData.selectPosition" class-name="multiselect-danger"></select-options>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic"></label>
              </b-col>
              <b-col sm="9" class="row p-0 m-0" style="z-index: 0">
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
        <b-row class="mb-2">
          <b-col>
            Mỗi trang:
            <b-select size="sm" @input="getDataConfigs" v-model="page.perPage" :options="[20, 50, 100]" class="d-inline-block w-auto" />
          </b-col>
          <b-col v-if="page.totalItems" class="col-sm text-sm-left text-center">
            <div class="row float-right">
              <span class="text-muted mr-2">Trang {{ page.currentPage }}/{{Math.ceil(page.totalItems / page.perPage)}} trên {{page.totalItems}} bản ghi</span>
              <b-pagination class="justify-content-center justify-content-sm-end m-0 clear-zindex"
                            v-model="page.currentPage"
                            :total-rows="page.totalItems"
                            :per-page="page.perPage"
                            v-on:input="getDataConfigs"
                            size="sm"
              >
              </b-pagination>
            </div>
          </b-col>
        </b-row>
        <br>
        <b-table class="ghtk-table"
          sort-icon-left
          responsive
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items="dataConfigs"
          :fields="fieldDataConfig"
          head-variant="light"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          style="text-align: center;"
          :busy="isBusy"
        >
          <template #table-colgroup="scope">
            <col
              v-for="field in scope.fields"
              :key="field.key"
              :style="{ width: (field.key === 'formula_detail' || field.key === 'penalties' || field.key === 'position_detail')
               ? '10%' : ( (field.key === 'value') ? '120px' : ( (field.key === 'modified') ? '10%' :
               ( (field.key === 'manage') ? '40px' : ( (field.key === 'type_area') ? '50px' : 'auto')))) }"
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
            <b-list-group v-if="data.item.formula_detail.length !== 0">
              <b-list-group-item class="mx-2 mb-1 pl-2" v-for="item in data.item.formula_detail" :key="item.id" variant="success">
                {{item.name}}
              </b-list-group-item>
            </b-list-group>
              <b-list-group v-else>
                <b-list-group-item class="mx-2 mb-1 pl-2" variant="success">Áp dụng tất cả</b-list-group-item>
              </b-list-group>
            </div>
          </template>
          <template v-slot:cell(position_detail)="data">
            <div class="custom-column p-1" style="text-align: left">
              <b-list-group v-if="data.item.position_detail.length !== 0">
                <b-list-group-item class="mx-2 mb-1 pl-2" v-for="item in data.item.position_detail" :key="item.id" variant="warning">
                  {{item.name}}
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-else>
                <b-list-group-item class="mx-2 mb-1 pl-2" variant="warning">Áp dụng tất cả</b-list-group-item>
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
              <b-list-group v-if="data.item.area_detail.length !== 0">
                <b-list-group-item class="mx-2 mb-1 pl-2" v-for="item in data.item.area_detail" :key="item.id" variant="primary">
                  {{item.name}}
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-else>
                <b-list-group-item class="mx-2 mb-1 pl-2" variant="warning">Áp dụng tất cả</b-list-group-item>
              </b-list-group>
            </div>
          </template>
          <template v-slot:cell(value)="data">
            <div class="custom-column">
              <div class="mx-1 p-1">
                {{ data.item.value}} VNĐ
              </div>
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
      </b-card-body>
    </b-card>
    <b-modal id="create-config-salary" modal-class="modal-xl" size="xl" hide-footer @close="cancel()">
      <template v-slot:modal-title class="w-100">
        <h3 class="text-white text-center w-100 mb-0" v-if="!isUpdate"> Thêm config lương</h3>
        <h3 class="text-white text-center w-100 mb-0" v-else> Sửa config lương</h3>
      </template>
      <b-row class="mb-3">
        <b-col sm="6">
          <b-row>
            <b-col class="label-penalty-note" sm="3">
              <label class="font-italic">Tên config:</label>
            </b-col>
            <b-col>
              <b-form-input id="textarea" type="text" v-model="saveData.selectName" :state="nameState"
                            aria-describedby="input-live-help input-live-feedback"></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Tên không được dài quá 32 ký tự
              </b-form-invalid-feedback>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
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
              <label class="font-italic">Loại lương:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.penaltyOptions" @model="saveData.selectTypePenalty = $event" :holder="'Chọn loại lương muốn config'" :value="saveData.selectTypePenalty" class-name="multiselect-warning" :triggerSingle="true"></select-options>
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
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Phạm vi:</label>
            </b-col>
            <b-col>
              <select-type @model="typeValue = $event" :holder="'Chọn phạm vi'" :value="typeValue"></select-type>
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
              <datepicker v-model="saveData.to" :clear-button="true" placeholder="Đến Ngày" :bootstrapStyling="true" :format="customFormatter" />
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Mức lương:</label>
            </b-col>
            <b-col>
              <b-form-input id="muc-luong" type="number" v-model="saveData.selectValue"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Vị trí:</label>
            </b-col>
            <b-col>
              <select-options :multiple-options="dataOptions.positionOptions" @model="saveData.selectPosition = $event" :holder="'Chọn vị trí'" :value="saveData.selectPosition" class-name="multiselect-success"></select-options>
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
          <b-row v-show="(typeValue === 'province')" class="mb-3">
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
          <b-row v-show="(typeValue === 'user')" class="mb-3">
            <b-col class="label-penalty-search" sm="3">
              <label class="font-italic">Username:</label>
            </b-col>
            <b-col>
              <select-user-penalty @model="saveData.selectCodeCod = $event" :holder="'Chọn username'" :value="saveData.selectCodeCod"></select-user-penalty>
            </b-col>
          </b-row>
          <b-row v-show="(typeValue === 'user')">
            <b-col class="label-penalty-list-cod" sm="3">
              <label class="font-italic">Danh sách User:</label>
            </b-col>
            <b-col>
              <b-form-textarea
                id="textarea"
                v-model="stringCodeCods"
                placeholder="Nhập danh sách User cách nhau bởi dấu ' , '"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row v-if="!isUpdate">
        <b-col sm="6">
          <b-button class="mt-3" variant="success" block @click="createConfig()">Tạo Mới</b-button>
        </b-col>
        <b-col sm="6">
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
                <h4>Các loại lương hợp lệ</h4>
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
      </b-row>
      <b-row v-else >
        <b-col sm="5">
        </b-col>
        <b-col>
          <b-button class="mt-3" variant="success" block @click="updateConfig()">Cập Nhật</b-button>
        </b-col>
        <b-col sm="5">
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
.custom-column {
  height: 110px;
  overflow-y: auto;
  max-width: 250px;
}
.ghtk-table /deep/ .thead-light {
  background: #02a065;
  th {
    color: white;
    display: table-cell;
    margin: 0 auto;
    text-align: center;
    vertical-align: middle;
  }
}
</style>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import sosService from 'domain/services/internal-sos-service'
import cancelPenaltyService from 'domain/services/config-cancel-penalty'
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
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
    selectPosition: [],
    selectTypePenalty: [],
    selectProvince: [],
    selectValue: 0,
    note: '',
    selectName: ''
  }
}

export default {
  name: 'config-cancel-penalties',
  metaInfo: {
    title: 'Config lương'
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
    cycleTime,
    kpiPenaltyService
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
      // {key: 'id', label: 'Id', sortable: true},
      {key: 'from', label: 'Ngày bắt đầu', sortable: false},
      {key: 'to', label: 'Ngày kết thúc', sortable: false},
      {key: 'name', label: 'Tên config', sortable: false},
      {key: 'formula_detail', label: 'Công thức lương', sortable: false},
      {key: 'position_detail', label: 'Vị trí', sortable: false},
      {key: 'type_area', label: 'Phạm vi', sortable: true},
      {key: 'area_detail', label: 'Chi tiết phạm vi', sortable: false},
      {key: 'value', label: 'Mức lương', sortable: false},
      {key: 'penalties', label: 'Loại lương', sortable: false},
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
      positionOptions: [],
      regionOptions: [
        {id: 10, name: 'Miền Bắc'},
        {id: 20, name: 'Miền Trung'},
        {id: 30, name: 'Miền Nam'}
      ]
    },
    typeValue: 'user',
    idUpdate: null,
    stringCodeCods: '',
    file2: null,
    isLoading: false,
    typePenalty: [],
    urlTemplate: ''
  }),

  computed: {
    totalPages () {
      return Math.ceil(this.page.totalItems / this.page.perPage)
    },
    listCodeCods () {
      let arrCod = this.stringCodeCods.split(',')
      return arrCod.map(item => item.trim())
    },
    nameState () {
      return (this.saveData.selectName.length < 32)
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
        positions: this.searchData.selectPosition,
        page: this.page.currentPage,
        limit: this.page.perPage,
        type: 'config_salary'
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
      if (this.saveData.selectTypePenalty.length === 0) return commonHelper.showMessage('Vui lòng chọn loại lương config')
      if (this.saveData.from === null) return commonHelper.showMessage('Khoảng thời gian áp dụng không hợp lệ')
      let dataSend = {
        from: this.saveData.from ? moment(new Date(this.saveData.from)).format('YYYY-MM-DD') : null,
        to: this.saveData.to ? moment(new Date(this.saveData.to)).format('YYYY-MM-DD') : null,
        formulas: this.saveData.selectFormula,
        type_penalties: this.saveData.selectTypePenalty,
        users: [],
        regions: [],
        provinces: [],
        stations: [],
        positions: this.saveData.selectPosition,
        value: this.saveData.selectValue,
        name: this.saveData.selectName,
        note: this.saveData.note,
        id_cods: this.stringCodeCods ? this.listCodeCods : []
      }
      switch (this.typeValue) {
        case 'user': dataSend.users = this.saveData.selectCodeCod
          break
        case 'region': dataSend.regions = this.saveData.selectRegion
          break
        case 'province': dataSend.provinces = this.saveData.selectProvince
          break
        case 'station': dataSend.stations = this.saveData.selectStation
          break
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
      this.saveData.selectValue = data.value
      this.saveData.selectName = data.name
      this.saveData.selectPosition = data.position_detail
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
          positions: this.saveData.selectPosition,
          value: this.saveData.selectValue,
          name: this.saveData.selectName,
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
      cancelPenaltyService.apiGetListConfigSalary().then(response => {
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
    getListPosition () {
      this.loading.search = true
      kpiPenaltyService.apiGetAllPositions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            response.data.data.map(item => {
              this.dataOptions.positionOptions.push({id: item.id, name: item.name})
            })
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
      dataSend.append('type', 'config_salary')
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
      this.typeValue = 'user'
      this.stringCodeCods = ''
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    cancel (hideModal) {
      this.typeValue = 'user'
      this.isUpdate = false
      this.resetForm()
      this.$bvModal.hide('create-config-salary')
    },
    closeImportExcel () {
      this.$refs['file-input'].reset()
      this.isLoading = false
      this.$bvModal.hide('modal-import-excel')
    },
    getTypePenalties () {
      cancelPenaltyService.apiGetTypeConfigSalary().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.typePenalty = response.data.data
          }
        }
      }).catch(() => {
      })
    },
    getUrlTemPlate () {
      let dataSend = {
        code: 'template_config_luong'
      }
      cancelPenaltyService.apiExportTemplateExcel(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.urlTemplate = response.data.data
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
    this.getListPosition()
  }
}
</script>
