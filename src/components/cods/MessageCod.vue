<template>
    <div class="message-cod-wrapper">
        <b-modal id="modal-1" modal-class="modal-xl" v-if="showModal" @close="showModal = true" :hide-footer="true"
                 :hide-header="true">
            <div class="panel">
                <label>Tổng số user nhận tin: {{this.dataDetail.length}}</label>
                <hr>
                <table class="table mb-0 text-center table-sm">
                    <thead>
                    <th>STT</th>
                    <th>UserId</th>
                    <th>Trạng thái</th>
                    </thead>
                    <tbody>
                    <template>
                        <tr v-for="(item, index) in this.dataDetail">
                            <td>{{index + 1}}</td>
                            <td style="width:80%;white-space: normal;word-break: break-all">{{item.user_id}}</td>
                            <td><b-badge v-if="item.status == true" variant="outline-success">Thành công</b-badge>
                                <b-badge v-if="item.status != true" variant="outline-danger">Thất bại</b-badge>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
            <div class="mb-4 text-center">
                <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
            </div>
        </b-modal>
        <b-card no-body>
            <b-card-body>
                <div class="header">
                    <b-col><h3 class="mt-2">Gửi thông báo lỗi lương cho nhân viên</h3></b-col>
                </div>
                <hr/>
                <b-row>
                    <b-form-group class="col-sm-3">
                        <label>Chọn chức vụ: </label>
                        <multiselect class="multiselect-primary"
                                     v-model="postition"
                                     :options="formulas"
                                     placeholder="Chọn chức vụ"
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
                    </b-form-group>
                    <b-form-group class="col-sm-3">
                        <label>Chọn miền: </label>
                        <multiselect class="multiselect-success"
                                     v-model="region.selected"
                                     :options="region.options"
                                     placeholder="Chọn Miền"
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
                    </b-form-group>
                    <b-form-group class="col-sm-3 mutiSelectScoll">
                        <label>Chọn tỉnh: </label>
                        <input type="checkbox" v-model="allProvinces">
                        <multiselect class="multiselect-success"
                                     v-model="provinces.selected"
                                     :options="provinces.options"
                                     placeholder="Chọn Tỉnh"
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
                    </b-form-group>
                    <b-form-group class="col-sm-3 mutiSelectScoll">
                        <label>Chọn kho: </label>
                            <input type="checkbox" v-model="allStation">
                            <multiselect class="multiselect-success"
                                         v-model="station.selected"
                                         :options="station.options"
                                         placeholder="Chọn kho"
                                         selectedLabel="Đã chọn"
                                         deselectLabel="Bỏ chọn"
                                         selectLabel="Chọn"
                                         track-by="name"
                                         label="name"
                                         :loading="stationLoading"
                                         :disabled="false"
                                         :searchable="true"
                                         :multiple="true"
                                         :hide-selected="true"
                                         :allow-empty="true"
                                         :close-on-select="false"
                            >
                                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
                            </multiselect>
                    </b-form-group>
                </b-row>
                <br>
                <b-row>
                    <b-form-group class="col-sm-6">
                        <label>Nhập User: </label>
                        <multiselect
                                v-model="asyncSelected"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="asyncFound"
                                :multiple="true"
                                :searchable="true"
                                :loading="asyncLoading"
                                :internal-search="false"
                                :clear-on-select="true"
                                :close-on-select="true"
                                :hide-selected="true"
                                @search-change="asyncFind">
                            <span slot="noResult">{{messageUser}}</span>
                            <span slot="noOptions">{{messageUser}}</span>
                        </multiselect>
                    </b-form-group>
                    <b-form-group class="col-sm-6">
                        <label>Lời nhắn: </label>
                        <b-textarea rows="3" placeholder="Lời nhắn" v-model="message"/>
                    </b-form-group>
                </b-row>
                <b-row>
                    <b-form-group class="col-sm-12 text-right">
                        <b-btn type="button" variant="primary" @click="addMessageCod()">Gửi lời nhắn</b-btn>
                    </b-form-group>
                </b-row>
                <hr/>
                <div class="table-responsive mb-4 text-center" style="overflow-y: scroll; overflow-x: hidden;">
                    <b-table
                            id="my-table"
                            :items="dataTable"
                            :fields="fields"
                            :per-page="perPage"
                            :current-page="currentPage"
                            class="text-center"
                    >
                        <template v-slot:cell(position)="data">
                            <span class="badge badge-success" v-for="itemPos in data.item.position" v-if="data.item.position !== null">
                                {{itemPos.name}} </span>
                            <span class="badge badge-success" v-else>
                                User </span>
                        </template>
                        <template v-slot:cell(message)="data">
                            {{data.item.message}}
                        </template>
                        <template v-slot:cell(created_by)="data">
                            <b-badge variant="outline-info">{{data.item.created_by}}</b-badge>
                        </template>
                        <template v-slot:cell(option)="data">
                            <b-btn variant="outline-primary borderless icon-btn" class="btn-xs" @click="detailMessage(data.item.detail.users)">
                                <i class="d-block fas fa-tasks"></i>
                            </b-btn>
                        </template>
                    </b-table>
                    <hr/>
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="totalItems"
                            :per-page="perPage"
                            aria-controls="my-table"
                    ></b-pagination>
                </div>
                <!-- Table -->
            </b-card-body>
        </b-card>
        <hr>
        <!--<b-card>-->
            <!--<BlockUI message="" :html="blockUI.html" v-if="loadingUI"/>-->
        <!--</b-card>-->
    </div>
</template>
<script>
import Vue from 'vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import SalaryService from 'domain/services/salary-service'
import kpiCodService from 'domain/services/kpi-cod-service'
import SelectCods from 'components/elements/FilterBox/SelectCods'
import debounce from 'debounce'
import BlockUI from 'vue-blockui'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
Vue.use(BlockUI)
export default {
  name: 'cod-message',
  metaInfo: {
    title: 'Tin nhắn thông báo lỗi lương cho nhân viên'
  },
  data () {
    return {
      allProvinces: false,
      allStation: false,
      dataMessage: '',
      formulas: [],
      searchData: {
        region: [],
        provinces: []
      },
      search: {
        start: new Date('Y-m-d'),
        end: new Date('Y-m-d')
      },
      station: {
        loading: false,
        options: [],
        selected: []
      },
      region: {
        loading: false,
        options: [
          {code: 10, name: 'Miền Bắc'},
          {code: 20, name: 'Miền Trung'},
          {code: 30, name: 'Miền Nam'}
        ],
        selected: []
      },
      provinces: {
        loading: false,
        options: [],
        selected: []
      },
      selected: {
        stations: [],
        user: [],
        types: [],
        cashier: []
      },
      stationDefault: [],
      message: '',
      provinceIds: '',
      stationLoading: false,
      testArry: [],
      totalItems: 0,
      currentPage: 1,
      perPage: 25,
      userFormat: [],
      searchAll: '',
      dataTable: [],
      dataDetail: [],
      showModal: true,
      fields: [
        {
          key: 'position',
          label: 'Chức vụ',
          sortable: true
        },
        {
          key: 'created',
          label: 'Ngày tạo',
          sortable: true
        },
        {
          key: 'message',
          label: 'Nội dung gửi',
          thStyle: 'width: 60%',
          sortable: true
        },
        {
          key: 'created_by',
          label: 'Người tạo',
          sortable: true
        },
        {
          key: 'option',
          label: 'Chi tiết',
          sortable: true
        }
      ],
      asyncSelected: [],
      asyncFound: [],
      asyncLoading: false,
      messageUser: 'Nhập ít nhất 2 ký tự',
      postition: [],
      idRunMessage: null,
      checkRun: '',
      blockUI: {
        loading: false,
        html: `<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div><h5>Đang xử lý dữ liệu</h5></div>`
      },
      opRe: false,
      opPro: false
    }
  },
  components: {
    flatPickr,
    Multiselect,
    kpiCodService,
    debounce,
    SelectCods
  },
  created () {
    this.getAllFormular()
    this.getDataMessage()
    this.getlistProvinces()
    this.getlistStation()
  },
  computed: {
    getData () {
      return this.dataMessage
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    getRegion () {
      return this.region.selected
    },
    getProvinces () {
      return this.provinces.selected
    }
  },
  watch: {
    getRegion () {
      this.opRe = true
      this.getlistProvinces()
    },
    getProvinces () {
      this.opPro = true
      this.getlistStation()
    },
    allProvinces (val) {
      if (val) {
        this.provinces.selected = this.provinces.options
      } else {
        this.provinces.selected = []
      }
    },
    allStation (val) {
      if (val) {
        this.station.selected = this.station.options
      } else {
        this.station.selected = []
      }
    }
  },
  methods: {
    clearFormInput () {
      this.postition = []
      this.region.selected = []
      this.provinces.selected = []
      this.station.selected = []
      this.message = ''
    },
    checkRunSendMessage () {
      let params = {
        id_message: this.idRunMessage
      }
      SalaryService.checkRunMessage(params)
        .then(res => {
          if (res.data.success) {
            clearInterval(this.checkRun)
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đang gặp sự cố! Vui lòng thử lại')
        })
    },
    getDataMessage () {
      SalaryService.getDataMessageAlert()
        .then(res => {
          this.dataTable = res.data.data
          this.totalItems = res.data.data.length
          return commonHelper.showMessage(res.data.message, 'success')
        })
        .catch(e => {
          commonHelper.showMessage('Đang gặp sự cố! Vui lòng thử lại')
        })
    },
    getAllFormular () {
      SalaryService.searchPostition()
        .then((res) => {
          this.formulas = res.data.data
        })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy công thức lương. Vui lòng thử lại sau', 'warning')
        })
    },
    getlistProvinces () {
      let regionId = []
      if (this.region.selected.length !== 0) {
        this.region.selected.forEach(item => {
          regionId.push(item.code)
        })
      }
      let params = {
        region_id: regionId
      }
      SalaryService.getProvincesByRegion(params)
        .then((res) => {
          this.provinces.options = res.data.data
          // if (this.opRe) {
          //   this.provinces.selected = this.provinces.options
          //   this.opRe = false
          // }
        })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy công thức lương. Vui lòng thử lại sau', 'warning')
        })
    },
    getlistStation () {
      let provinceId = []
      if (this.provinces.selected.length !== 0) {
        this.provinces.selected.forEach(item => {
          provinceId.push(item.code)
        })
      }
      let params = {
        province_id: provinceId
      }
      SalaryService.getlistStationByProvince(params).then((res) => {
        this.station.options = res.data.data
        // if (this.opPro) {
        //   this.station.selected = this.station.options
        //   this.opPro = false
        // }
      })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy công thức lương. Vui lòng thử lại sau', 'warning')
        })
    },
    addMessageCod () {
      if (!this.message || (this.postition.length === 0 && this.asyncSelected.length === 0)) {
        return commonHelper.showMessage('Lời nhắn || chức vụ không được bỏ trống !')
      }
      let params = {
        position_id: this.postition,
        region_id: this.region.selected,
        province_id: this.provinces.selected,
        station_id: this.station.selected,
        user_id: this.asyncSelected,
        message: this.message
      }
      SalaryService.postMessageCod(params).then(res => {
        if (res.data.success) {
          this.getDataMessage()
          this.clearFormInput()
          // this.checkRun = setInterval(() => {
          //   this.checkRunSendMessage()
          // }, 5000)
          return commonHelper.showMessage(res.data.message, 'success')
        }
        return commonHelper.showMessage(res.data.message)
      }).catch(() => commonHelper.showMessage('Có lỗi thêm dữ liệu'))
    },
    detailMessage (item) {
      this.dataDetail = []
      this.dataDetail = item
      this.$bvModal.show('modal-1')
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.messageUser = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      let regionId = []
      let positionId = []

      this.postition.forEach(item => {
        positionId.push(item.code)
      })
      this.region.selected.forEach(item => {
        regionId.push(item.code)
      })
      let params = {
        position_id: positionId,
        region: regionId,
        term: query
      }

      SalaryService.searchUser(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.messageUser = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.messageUser = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>
<style lang="scss">
.message-cod-wrapper {
  .mutiSelectScoll .multiselect__tags {
    overflow: auto;
    max-height: 200px;
  }
  label {
    font-weight: bold;
  }
}
</style>
