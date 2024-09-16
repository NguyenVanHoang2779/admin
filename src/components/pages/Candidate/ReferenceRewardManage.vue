<template>
  <div class="small-scrollbar">
    <div class="ui-block">
      <b-row>
        <b-col><h4 class="ui-block-heading">Danh sách thưởng giới thiệu</h4></b-col>
        <ladda-btn v-if="checkPermissionExportAllPage()" :loading="isProcessingExport" @click.native="exportExcel()" class="btn btn-success">
          <i class="sidenav-icon ion ion-md-document"></i> Xuất excel
        </ladda-btn>
        <b-btn v-if="!isProcessingExport && this.fileExcel.length > 0" type="button" variant="outline-danger btn-download" @click="getDownloadExcelLink()">
          <i class="ion d-block ion-ios-cloud-download"></i>
        </b-btn>
        <b-col class="input-month">
          <vue-monthly-picker v-model="filter.month" alignment="center" date-format="MM/YYYY" @selected="applyFilter"></vue-monthly-picker>
        </b-col>
      </b-row>
      <hr>
      <b-row class='limit-height-55'>
        <b-col md="3">
          <single-select-profile-region @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
        </b-col>
        <b-col md="3">
          <single-select-province
            @handleSelectedProvince="handleSelectedProvince"
            :region-name="filter.region"
          ></single-select-province>
        </b-col>
        <b-col md="3">
          <single-select-station
            :province-id="filter['provinceId']"
            @handleSelectedStation="handleSelectedStation"
            placeholder="Chọn kho người giới thiệu"
          ></single-select-station>
        </b-col>
        <b-col md="3">
          <multiselect
            v-model="filter.status"
            :options="status"
            placeholder="Chọn trạng thái"
            label="name"
            track-by="name"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
          >
          </multiselect>
        </b-col>
        <b-col md="3" class="mt-1">
          <b-input v-model="filter.candidate_term" placeholder="Tên/ CMND ứng viên"></b-input>
        </b-col>
        <b-col md="3" class="mt-1">
          <b-input v-model="filter.referrer_term" placeholder="Username/ Tên/ người giới thiệu"></b-input>
        </b-col>
        <b-col md="3" class="mt-1">
          <MultiSelectStation
            placeholder="Chọn kho của người được giới thiệu"
            :provinceIds="filter.provinceId"
            @input="selectStationCandidate"
          />
        </b-col>
        <b-col class="text-right mt-1">
          <b-btn variant="ghtk" @click="currentPage = 1; applyFilter();"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
        </b-col>
      </b-row>
      <b-row class='my-3 justify-content-between'>
        <b-col md="2" v-for="(stt, index) in status" :key="index">
          <b-row class='justify-content-between'>
            <b-col md="9">{{ stt.name }}</b-col>
            <b-col class='text-right' md="3"><b>{{ statusCount[stt.value] }}</b></b-col>
          </b-row>
          <b-progress :max="total - 0" class="border">
            <b-progress-bar
              :value="statusCount[stt.value] - 0"
              :variant="statusVariant[stt.value] + ' text-dark'"
              :label="((statusCount[stt.value]/total) * 100).toFixed(2) + `%`"
            ></b-progress-bar>
          </b-progress>
        </b-col>
      </b-row>
      <div class="mb-3">
        <b-card no-body class="mt-0">
        <b-table
          ref="curTable"
          :busy.sync="tblBusy"
          :items="tblItemsProvider"
          :fields="tableFields"
          :per-page="perPage"
          :current-page="curPage"
          :filter="tblFilter"
          hover
          striped
          table-variant="light"
          small
          outlined
        >
          <!-- Additional Header -->
          <template v-slot:thead-top>
            <b-tr>
              <b-th variant="secondary" class="border-right"></b-th>
              <b-th colspan="4" class="text-center border-right" variant="danger">Người giới thiệu</b-th>
              <b-th colspan="4" class="text-center border-right" variant="primary">Người được giới thiệu</b-th>
              <b-th colspan="6" variant="secondary"></b-th>
            </b-tr>
          </template>

          <!-- Columns -->
          <template v-slot:cell(status)="row">
            <b-badge :variant="statusVariant[row.item.status]" class="status-badge">{{statusLocale[row.item.status]}}</b-badge>
          </template>

          <template v-slot:cell(candidate_name)="row">
            <b>{{ row.item.candidate.name }}</b> ({{ row.item.candidate.username }})
          </template>

          <template v-slot:cell(referrer_name)="row">
            <b>{{ row.item.referrer.name }}</b> ({{ row.item.referrer.username }})
          </template>

          <template v-slot:cell(join_date)="row">
            {{moment(row.item.candidate.join_date).format('DD/MM/YYYY')}}
          </template>

          <template v-slot:cell(actions)="row">
            <b-btn  size="sm" :disabled="!canConfirm(row.item.status)" :variant="canConfirm(row.item.status) ? 'outline-primary' : 'default'" class="action-button" @click="doAction(row.item.id, row.item.status, 'confirm')">
              Xác nhận
            </b-btn>
            <b-btn size="sm" :disabled="!canAbort(row.item.status)" :variant="canAbort(row.item.status) ? 'outline-danger' : 'default'" class="action-button" @click="doAction(row.item.id, row.item.status, 'abort')">
              Từ chối
            </b-btn>
          </template>

          <!-- Pagination -->
          <template slot='table-caption'>
            <div v-if="!tblBusy">
              <b-row v-if="total > 0">
                <b-col class="text-center">
                  <b-pagination v-model="curPage" :per-page="perPage" :total-rows="total" align="center"></b-pagination>
                  <span>Số {{perPage * (curPage-1) + 1}} - {{Math.min(perPage*curPage, total)}} trên {{total}}</span>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col class="text-center">Không tồn tại bản ghi nào !</b-col>
              </b-row>
            </div>
            <div v-else>
              <b-row>
                <b-col class="text-center">Đang tải dữ liệu...</b-col>
              </b-row>
            </div>
          </template>
        </b-table>
        </b-card>
      </div>
    </div>
    <modal-confirm :id="curId" :role="role" :action="action" :status="curStatus" :trigger="toggleConfirmModal" @updateStatus="updateStatus"></modal-confirm>
  </div>
</template>

<style lang="scss" scoped>
  .limit-height-55 .col-md-2 {
    height: 55px;
  }
  .action-button {
    width: 100px;
    margin-bottom: 4px;
  }
  .input-month {
    max-width: 220px;
  }
  .status-badge {
    width: 130px;
    padding: 5px;
  }
</style>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import referenceRewardService from 'domain/services/reference-reward-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import ModalConfirm from './ModalConfirmReward'
import VueMonthlyPicker from 'vue-monthly-picker'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// mixins
import ExportMixin from 'mixins/ExportMixin'

export default {
  name: 'reference-reward-manage',
  mixins: [ExportMixin],
  components: {
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectModule,
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectProfileRegion,
    ModalConfirm,
    VueMonthlyPicker,
    Multiselect,
    LaddaBtn
  },

  data: () => ({
    role: null,
    isProcessingExport: false,
    fileExcel: '',
    curPage: 1,
    perPage: 10,
    total: 0,

    filter: {
      provinceId: '',
      stationId: '',
      station_candidate: null,
      region: '',
      month: null,
      status: null,
      candidate_term: null,
      referrer_term: null
    },

    range_time: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },

    tblFilter: {
      provinceId: '',
      stationId: '',
      month: '',
      status: ''
    },

    tblBusy: false,
    tableFields: [
      {
        label: 'STT',
        key: 'index',
        tdClass: 'font-weight-bold text-center border-right',
        thClass: 'border-right'
      },
      {
        key: 'referrer.station_name',
        label: 'Kho'
      },
      {
        key: 'referrer_name',
        label: 'Họ tên (username)'
      },
      {
        key: 'referrer.status',
        label: 'Trạng thái MP'
      },
      // {
      //   key: 'referrer.staff_code',
      //   label: 'Mã NV'
      // },
      {
        key: 'referrer.position_name',
        label: 'Vị trí',
        tdClass: 'border-right',
        thClass: 'border-right'
      },
      {
        key: 'candidate.station_name',
        label: 'Kho'
      },
      {
        key: 'candidate_name',
        label: 'Họ tên (username)'
      },
      {
        key: 'candidate.status',
        label: 'Trạng thái MP'
      },
      // {
      //   key: 'candidate.staff_code',
      //   label: 'Mã NV'
      // },
      {
        key: 'candidate.position_name',
        label: 'Vị trí',
        tdClass: 'border-right',
        thClass: 'border-right'
      },
      {
        key: 'join_date',
        label: 'Ngày vào',
        thStyle: {
          width: '100px'
        }
      },
      {
        key: 'days_worked',
        label: 'Số ngày làm việc',
        tdClass: 'text-center'
      },
      {
        key: 'reward',
        label: 'Mức thưởng',
        tdClass: 'font-weight-bold text-danger text-right'
      },
      {
        key: 'status',
        label: 'Trạng thái'
      },
      {
        key: 'comment',
        label: 'Đánh giá'
      },
      {
        key: 'actions',
        label: 'Duyệt',
        thClass: 'text-center',
        tdClass: 'text-right'
      }
    ],

    statusLocale: {
      'pending': 'Chờ duyệt',
      'op_confirm': 'Trưởng kho duyệt',
      'hr_confirm': 'Nhân sự duyệt',
      'rewarded': 'Đã thưởng',
      'abort': 'Đã từ chối'
    },

    statusVariant: {
      'pending': 'info',
      'op_confirm': 'warning',
      'hr_confirm': 'primary',
      'rewarded': 'success',
      'abort': 'danger'
    },

    status: [
      {
        name: 'Chờ duyệt',
        value: 'pending'
      },
      {
        name: 'Trưởng kho duyệt',
        value: 'op_confirm'
      },
      {
        name: 'Nhân sự duyệt',
        value: 'hr_confirm'
      },
      {
        name: 'Đã thưởng',
        value: 'rewarded'
      },
      {
        name: 'Đã từ chối',
        value: 'abort'
      }
    ],

    statusCount: {
      'pending': 0,
      'op_confirm': 0,
      'hr_confirm': 0,
      'rewarded': 0,
      'abort': 0
    },

    toggleConfirmModal: false,
    curId: null,
    curStatus: null,
    action: null
  }),

  created () {
    this.getRole()
    // this.initData()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
  },

  methods: {
    exportExcel () {
      if (this.isProcessingExport) {
        return
      }
      let dataSend = {
        'filter': this.tblFilter,
        'sortBy': this.sortBy,
        'sortDesc': this.sortDesc,
        'perPage': this.perPage,
        'currentPage': this.currentPage,
        'apiUri': this.apiUri
      }
      this.isProcessingExport = true
      this.$startLoading()
      referenceRewardService.requestExportFile(dataSend)
        .then((response) => {
          if (response.data.success) {
            this.fileExcel = response.data.data
            this.isProcessingExport = false
            helper.showMessage(response.data.message || 'Đang xuất data', 'success')
          } else {
            this.isProcessingExport = false
            helper.showMessage(response.data.message || 'Không xuất được danh sách thưởng gới thiệu !', 'warning')
          }
        })
        .catch((error) => { // eslint-disable-line
          this.isProcessingExport = false
          helper.showMessage('Có lỗi xảy ra trong quá trình xuất excel !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    getDownloadExcelLink () {
      window.open(this.fileExcel, '_blank')
    },

    moment: function (data) {
      return moment(data)
    },

    initData () {
      this.filter.month = moment(new Date())
    },

    applyFilter () {
      let filterData = {}
      if (this.filter.month) {
        let date = this.filter.month
        filterData.month = date.format('MM')
        filterData.year = date.format('YYYY')
      }
      filterData.stationId = this.filter.stationId
      filterData.station_candidate = this.filter.station_candidate
      filterData.provinceId = this.filter.provinceId
      filterData.region = this.filter.region
      filterData.candidate_term = this.filter.candidate_term
      filterData.referrer_term = this.filter.referrer_term
      if (this.filter.status) filterData.status = this.filter.status.value
      this.tblFilter = Object.assign({}, filterData)
      this.$refs.curTable.refresh()
    },

    tblItemsProvider (ctx) {
      return referenceRewardService.getRefRewardList(ctx)
        .then(res => {
          if (res.data.success) {
            this.total = res.data.total
            Object.keys(this.statusCount).forEach(element => {
              this.statusCount[element] = +res.data.statusCount[element] || 0
            })
            return this.assignIndex(res.data.data)
          } else {
            helper.showMessage(res.data.message || 'Không lấy được danh sách thưởng gới thiệu !', 'warning')
          }
        })
    },

    getRole () {
      referenceRewardService.getRole()
        .then(res => {
          if (res.data.success) {
            this.role = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Không lấy được quyền hạn nhân viên !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra !', 'warning')
        })
    },

    getData () {
      referenceRewardService.getRefRewardList()
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data
            this.assignIndex()
          } else {
            helper.showMessage(res.data.message || 'Không lấy được danh sách thưởng gới thiệu !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra !', 'warning')
        })
    },

    assignIndex (tableData) {
      let idx = 1
      tableData.forEach(element => {
        element.index = (this.curPage - 1) * this.perPage + idx++
      })
      return tableData
    },

    canConfirm (status) {
      switch (this.role) {
        case 'HR':
        case 'IT':
          return (['op_confirm', 'hr_confirm'].includes(status))
        case 'OP':
          return status === 'pending'
      }
      return false
    },

    canAbort (status) {
      switch (this.role) {
        case 'HR':
        case 'IT':
          return (!['rewarded', 'abort'].includes(status))
        case 'OP':
          return status === 'pending'
      }
      return false
    },

    doAction (id, status, action) {
      this.toggleConfirmModal = !this.toggleConfirmModal
      this.curId = id
      this.curStatus = status
      this.action = action
    },

    updateStatus (rr) {
      this.$refs.curTable.refresh()
    },

    handleSelectedRegion: function (option) {
      this.filter['region'] = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.filter['provinceId'] = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.filter.stationId = option ? option.id : ''
    },

    selectStationCandidate (ops) {
      this.filter.station_candidate = ops ? ops.map(op => op.id).toString() : null
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    }
  }
}
</script>
