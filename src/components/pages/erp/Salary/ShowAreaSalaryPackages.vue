<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Bảng hiển thị vùng của đơn hàng</div>
    </h4>
    <b-card no-body style="background-image: -webkit-linear-gradient(right, #FAFAFA, #FAFAFA 50%, transparent 10%, transparent 100%)">
      <b-card-body>
        <div class="row">
          <div class="col-md-4">
            <div>
              <label class="form-label">Mã COD</label>
              <b-form-input id="inputLive"
                            v-model.trim="codAlias"
                            :disabled="loadingExport"
                            type="text"
                            :state="aliasState"
                            aria-describedby="inputLiveFeedback"
                            placeholder="Nhập mã COD"></b-form-input>
              <b-form-invalid-feedback id="inputLiveFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                Vui lòng kiểm tra lại mã Cod
              </b-form-invalid-feedback>
            </div>
            <br>
            <div>
              <b-form-group label="Khoảng thời gian">
                <flat-pickr v-model="range_time" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/>
                <p v-if="range_time !== '' " style="font-size: 13px; line-height: 30px"><strong><i>&emsp;(*) ứng với dữ liệu từ <span style="color: red">{{range_time.split(' to ')[0]}}</span> đến <span style="color: red">{{range_time.split(' to ')[1]}}</span></i></strong></p>
              </b-form-group>
            </div>
            <div >
              <ladda-btn @click.native="runProcess" :disabled="loadingExport" :loading="loadingButton" data-style="expand-right" class="btn btn-primary" style="width: 40%">
                Show
              </ladda-btn>
              <ladda-btn @click.native="exportExcel" :disabled="loadingButton || articlesData.length === 0" :loading="loadingExport" data-style="expand-right" class="btn btn-success" style="width: 40%">
                Xuất excel
              </ladda-btn>
            </div>
            <div>
            </div>
            <div></div>
          </div>
          <div v-if="typeof infoCod.cod_id !== 'undefined'" class="col-md-8" style="float: right">
            <div class="media col-md-10 col-lg-8 col-xl-7 py-5 mx-auto" style="float: right" >
              <!--<img :src="infoCod.avatar" alt class="d-block ui-w-100 rounded-circle" width="300" height="300">-->
              <img :src="baseUrl + '/static/img/noimage.png'" alt class="d-block ui-w-100 rounded" width="300" height="300">
              <div class="media-body ml-5">
                <h4 class="font-weight-bold mb-4">{{infoCod.fullname}} - {{infoCod.user_id}}</h4>

                <div class="text-muted mb-4">
                  <p><strong>Kho: </strong>{{infoCod.station_name}} - {{infoCod.station_id}}</p>
                  <p><strong>Vị trí: </strong>{{infoCod.position_name}} - {{infoCod.position_id}}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="col-md-7" style="float: right">
            <div class="media col-md-10 col-lg-8 col-xl-7 py-5 mx-auto" style="float: right">
              <img :src="baseUrl + '/static/img/noimage.png'" alt class="d-block ui-w-100 rounded" width="300" height="300">
              <div class="media-body ml-5">
                <h4 class="font-weight-bold mb-4">.........</h4>

                <div class="text-muted mb-4">
                  <p><strong>Kho: </strong>.........</p>
                  <p><strong>Vị trí: </strong>.........</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <br>
    <b-card no-body>
      <!-- Table controls -->
      <b-card-body>
        <div class="row pr-bar">
          <div class="col">
            Số lượng: &nbsp;
            <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto"/>
            trên {{articlesData.length}} đơn hàng
          </div>
          <div class="col">
            <b-progress :max="totalCountDate" class="mt-8">
              <b-progress-bar :value="countDate" :precision="2" show-progress>
              </b-progress-bar>
            </b-progress>
          </div>
          <div class="col">
            <b-input
             size="sm" placeholder="Tìm kiếm..." class="d-inline-block float-lg-right w-50" @input="filter($event)" />
          </div>
        </div>
      </b-card-body>
      <!-- / Table controls -->
      <!-- Table -->
      <hr class="border-light m-0">
      <div class="table-responsive">
        <table class="w-100">
          <tr>
            <th class="w-25">Đơn hàng</th>
            <th class="w-45">Thông tin địa chỉ</th>
            <th class="w-35">Vùng tính lương</th>
          </tr>
          <tr>
            <td colspan="3">
              <b-table
                id = 'dataTable'
                ref = 'dataTable'
                :items="articlesData"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :striped="true"
                :bordered="true"
                :current-page="currentPage"
                :per-page="perPage"
                style="text-align: center;"
                class="card-table">
              </b-table>
            </td>
          </tr>
        </table>
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
                          size="sm" />
          </div>
        </div>
      </b-card-body>
    </b-card>
    <notifications group="notifications-default" />
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import config from 'config/app.base'
import salaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
export default {
  name: 'ara-packages',
  metaInfo: {
    title: 'Area Packages'
  },
  components: {
    salaryService,
    flatPickr,
    LaddaBtn
  },
  data: () => ({
    // Options
    totalCountDate: 0,
    countDate: 0,
    infoCod: {},
    codAlias: '',
    range_time: '',
    loadingButton: false,
    loadingExport: false,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'Y-m-d'
    },
    dataUrl: config.baseApiUrl + 'AdSalaryCods/getAllPackagesOfCodInRangeTime',
    searchKeys: ['alias', 'type', 'street', 'ward', 'prioritize', 'date', 'order', 'customer_province', 'district', 'cart_alias'],
    sortBy: 'date',
    sortDesc: false,
    perPage: 10,

    fields: [
      { key: 'date', label: 'Ngày tháng', sortable: true, thStyle: 'width: 12%' },
      { key: 'order', sortable: true, thStyle: 'width: 4%' },
      { key: 'type', label: 'Loại', sortable: true, thStyle: 'width: 4%' },
      { key: 'first_address', label: 'Địa chỉ lấy', sortable: true },
      { key: 'cart_alias', label: 'Mã giỏ', sortable: true },
      { key: 'street', label: 'Đường/Phố', sortable: true },
      { key: 'ward', label: 'Phường/Xã', sortable: true },
      { key: 'district', label: 'Quận/Huyện', sortable: true },
      { key: 'customer_province', label: 'Tỉnh/Thành Phố', sortable: true },
      { key: 'area_package', label: 'Đơn', sortable: true, thStyle: 'width: 4%' },
      { key: 'area_cart', label: 'Giỏ', sortable: true, thStyle: 'width: 4%' },
      { key: 'area_street', label: 'Đường', sortable: true, thStyle: 'width: 4%' },
      { key: 'area_ward', label: 'Phường/Xã', sortable: true, thStyle: 'width: 4%' },
      { key: 'prioritize', label: 'Tính theo', sortable: true, thStyle: 'width: 4%' }
    ],

    articlesData: [],
    originalArticlesData: [],

    currentPage: 1
  }),

  computed: {
    aliasState () {
      if (/(T|t)([0-9]+)/.test(this.codAlias) || this.codAlias === '') return true
      return false
    },
    totalItems () {
      return this.articlesData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  methods: {
    exportExcel () {
      if (this.articlesData.length === 0) return
      this.loadingExport = true
      salaryService.exportDataPackagesArea({
        codAlias: this.infoCod.cod_alias,
        data: this.articlesData
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.hasOwnProperty('path')) {
            window.location.href = response.data.path
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
        this.loadingExport = false
      })
    },
    runProcess () {
      this.articlesData = this.originalArticlesData = []
      this.countDate = this.totalCountDate = 0
      this.infoCod = {}
      if (this.codAlias === '' || this.range_time === '') return false
      let rangetime = this.range_time.split(' to ')
      if ((typeof rangetime[0] === 'undefined') || (typeof rangetime[1] === 'undefined') || (rangetime[0] === rangetime[1])) {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Khoảng thời gian không hợp lệ!'
        })
        return 0
      }
      this.loadingButton = true
      salaryService.getInfoCod({alias: this.codAlias}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            this.infoCod = response.data.data
          } else {
            return 0
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
        if (typeof this.infoCod.cod_id === 'undefined') {
          this.loadingButton = false
          return 0
        } else {
          let range = this.range_time.split(' to ')
          let fromTimestamp = (new Date(range[0])).getTime()
          let toTimestamp = (new Date(range[1])).getTime()
          this.totalCountDate = (toTimestamp + 86400000) - fromTimestamp
          this.getDataDateByDate(this.infoCod.cod_id, fromTimestamp, toTimestamp)
        }
      })
    },
    getDataDateByDate (codId, from, to) {
      let dataSend = {
        'codId': codId,
        'from': from,
        'to': (from + 86400000)
      }
      salaryService.getAllPackagesOfCodInRangeTime(dataSend).then(response => {
        this.countDate += 86400000
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message + ' cho ngày ' + (new Date(from)).toLocaleDateString()
          })
          if (response.data.success) {
            if (response.data.hasOwnProperty('data')) {
              let data = response.data.data
              this.articlesData = this.articlesData.concat(data)
              this.originalArticlesData = this.articlesData.slice(0)
            }
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra khi lấy dữ liệu ngày ' + (new Date(from)).toLocaleDateString()
        })
        this.loadingButton = false
        return 0
      }).then(() => {
        if ((from + 86400000) > to) {
          this.loadingButton = false
          return 0
        }
        this.getDataDateByDate(codId, from + 86400000, to)
      })
    },
    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalArticlesData.filter(d => {
        console.log()
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
  }
}
</script>

<style scoped>
  th {
    text-align: center;
    height: 40px;
    border: 1px;
  }
  .pr-bar {
    display: flex;
    align-content: center;
  }
  .mt-8 {
    margin-top: 8px;
  }
  .w-25 {
    width: 25%;
  }
  .w-45 {
    width: 45%;
  }
  .w-35 {
    width: 35%;
  }
</style>
