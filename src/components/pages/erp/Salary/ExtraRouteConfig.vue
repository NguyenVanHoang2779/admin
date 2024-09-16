<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Lương tối thiểu và ngày công chuẩn theo tuyến</div>
    </h4>
    <b-card no-body>
      <!-- Table controls -->
      <b-card-body>
        <div class="row">
          <div class="col">
            Số lượng: &nbsp;
            <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto"/>
            trên {{articlesData.length}} tuyến
          </div>
          <div class="col">
            <b-input size="sm" placeholder="Tìm kiếm..." class="d-inline-block w-auto float-sm-right"
                     @input="filter($event)"/>
          </div>
        </div>

      </b-card-body>
      <!-- / Table controls -->

      <!-- Table -->
      <hr class="border-light m-0">
      <div class="table-responsive">

        <b-table
          :items="articlesData"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="true"
          :current-page="currentPage"
          :per-page="perPage"
          class="card-table">

          <template v-slot:cell(actions)="data">
            <b-btn variant="default btn-xs icon-btn md-btn-flat" v-b-modal.modals-default
                   @click="editButtonClick(data.item)" v-b-tooltip.hover title="Sửa"><i class="ion ion-md-create"></i>
            </b-btn>
          </template>
        </b-table>
      </div>

      <!-- Pagination -->
      <b-card-body class="pt-0 pb-3">

        <div class="row">
          <div class="col-sm text-sm-left text-center pt-3">
            <span class="text-muted" v-if="totalItems">Trang {{ currentPage }} trên {{ totalPages }}</span>
          </div>
          <div class="col-sm pt-3">
            <b-pagination class="justify-content-center justify-content-sm-end m-0"
                          v-if="totalItems"
                          v-model="currentPage"
                          :total-rows="totalItems"
                          :per-page="perPage"
                          size="sm"/>
          </div>
        </div>

      </b-card-body>
      <!-- / Pagination -->

    </b-card>
    <b-modal ref="myModalRef" id="modals-default" @ok="saveChangeExtraRoute" static>
      <div slot="modal-title">
        Tuyến {{routeEdit.route_name}}<br>
        <small class="text-muted">{{routeEdit.route_type}}</small>
      </div>
      <p class="alert-danger" style="text-align: center">{{message}}</p>
      <b-form-row>
        <b-form-group label="Lương tối thiểu" class="col">
          <b-form-input id="inputLive"
                        v-model.trim="routeEdit.minimum_salary"
                        type="number"
                        :state="warningMoney"
                        aria-describedby="inputLiveFeedback"
                        placeholder="đơn vị VNĐ"></b-form-input>
          <b-form-invalid-feedback id="inputLiveFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Số tiền nhập vào quá lớn. Vui lòng kiểm tra lại!
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group label="Chọn cách tính ngày công chuẩn" class="col">
          <multiselect v-model="routeObjectEdit"
                       label="name"
                       track-by="code"
                       :options="listRequiredWorkShifts"
                       :taggable="true"
                       @input="changeValueTable"
                       placeholder="Chọn"
          ></multiselect>
        </b-form-group>
      </b-form-row>
    </b-modal>
    <notifications group="notifications-default"/>
    <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import salaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Multiselect from 'vue-multiselect'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

export default {
  name: 'extra-route-configs',
  metaInfo: {
    title: 'Extra Route Configs'
  },
  components: {
    salaryService,
    flatPickr,
    LaddaBtn,
    Multiselect,
    LoadingMiniBottom
  },
  data: () => ({
    // Options
    appLoading: false,
    message: '',
    routeEdit: {
      minimum_salary: '',
      required_workshift: '',
      required_workshift_id: '',
      route_id: '',
      route_name: '',
      route_type: '',
      route_type_id: '',
      truck_code: '',
      update_by: ''
    },
    listRequiredWorkShifts: [
      {name: '1 ngày nghỉ 1 ngày', code: 1},
      {name: '2 ngày nghỉ 1 ngày', code: 2},
      {name: '6 ngày nghỉ 1 ngày', code: 3},
      {name: '4 ngày nghỉ 2 ngày', code: 4},
      {name: '8 ngày nghỉ 4 ngày', code: 5}
    ],
    routeObjectEdit: {},
    searchKeys: ['route_name', 'truck_code', 'route_type', 'minimum_salary', 'required_workshift', 'update_by'],
    sortBy: 'date',
    sortDesc: false,
    perPage: 20,

    fields: [
      {key: 'route_name', label: 'Tên tuyến', sortable: true, thStyle: 'width: 20%'},
      {key: 'truck_code', label: 'Xe tải', sortable: true, thStyle: 'width: 20%'},
      {key: 'route_type', label: 'Loại', sortable: true, thStyle: 'width: 15%'},
      // { key: 'province_name', label: 'Tỉnh', sortable: true, thStyle: 'width: 10%', variant: 'warning' },
      // { key: 'district_name', label: 'Huyện', sortable: true, variant: 'success' },
      // { key: 'station_name', label: 'Kho', sortable: true, variant: 'info' },
      {key: 'minimum_salary', label: 'Lương tối thiểu', sortable: true},
      {key: 'required_workshift', label: 'Cách  tính ngày công chuẩn', sortable: true},
      {key: 'update_by', label: 'Cập nhật bởi', sortable: true},
      {key: 'actions', label: 'Sửa', tdClass: 'text-center text-nowrap'}
    ],

    articlesData: [],
    articlesBackupData: [],
    originalArticlesData: [],

    currentPage: 1
  }),

  computed: {
    warningMoney () {
      if (this.routeEdit.minimum_salary > 99999999) return false
      return true
    },
    totalItems () {
      return this.articlesData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  methods: {
    changeValueTable () {
      this.routeEdit.required_workshift = (typeof this.routeObjectEdit.name === 'undefined') ? '' : this.routeObjectEdit.name
    },
    editButtonClick (route) {
      this.routeEdit = route
      if (route.required_workshift_id !== '') {
        let id = route.required_workshift_id - 1
        this.routeObjectEdit = this.listRequiredWorkShifts[id]
      }
    },
    saveChangeExtraRoute (evt) {
      evt.preventDefault()
      if (!this.routeObjectEdit || !this.routeEdit.minimum_salary) {
        this.message = 'Vui lòng nhập đầy đủ thông tin'
      } else {
        this.appLoading = true
        let dataSend = {
          tr_id: this.routeEdit.route_id,
          minimum_salary: this.routeEdit.minimum_salary,
          work_type_id: this.routeObjectEdit.code
        }
        salaryService.apiSaveExtraRouteConfig(dataSend).then(response => {
          if (response.data.hasOwnProperty('success')) {
            this.$notify({
              group: 'notifications-default',
              type: response.data.success ? '' : 'bg-danger text-white',
              title: response.data.success ? 'Thành công' : 'Lỗi',
              text: response.data.message
            })
            this.$refs.myModalRef.hide()
            if (!response.data.success) {
              let data = this.articlesBackupData
              this.articlesData = data
              this.originalArticlesData = data.slice(0)
            }
          }
        }).catch(() => {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Đã có lỗi xảy ra.'
          })
        }).then(() => {
          this.appLoading = false
        })
      }
    },
    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalArticlesData.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.articlesData = filtered
    }
  },

  mounted () {
  },

  created () {
    this.appLoading = true
    salaryService.apiGetInfoRoutes({route_type_id: 2}).then(response => {
      if (response.data.hasOwnProperty('data')) {
        let data = response.data.data
        this.articlesData = this.articlesBackupData = data
        this.originalArticlesData = data.slice(0)
        this.appLoading = false
      }
    })
  }
}
</script>

<style>
</style>
