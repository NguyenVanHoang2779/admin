<template>
  <div>
    <b-modal ref="modalListDetail" :title="title" hide-footer @hidden="hideModal" content-class="modal-list-Detail" body-class="modal-list-detail__body">
        <div class="list-users-detail-wrapper mb-3">
          <b-tabs justified lazy v-model="tabIndex">
            <b-tab v-for="(value , index) in dataTab[type]" :key="index">
              <template v-slot:title>
               <b>{{value.desc}}</b>
               <b-badge variant="primary" v-if="dataStatistic[value.value] && typeof dataStatistic[value.value] === 'object'">
                 {{+dataStatistic[value.value].numEmployee}}
                </b-badge>
                <b-badge variant="primary" v-else-if="dataStatistic[value.value] && typeof +dataStatistic[value.value] === 'number'">
                 {{+dataStatistic[value.value]}}
                </b-badge>
                <b-badge v-else variant="primary">0</b-badge>
              </template>
              <div class="list-users-detail">
                <div v-if="type === 'candidate'" class="">
                  <div v-for="(item, index) in dataTab[type][+tabIndex].data" class="list-users-detail__item list-users-detail-item" :key="index">
                    <i @click="gotoDetail(item.ErpCandidate)" class="list-users-detail-item__arrow ion d-block ion-ios-arrow-forward"></i>
                    <div class="list-users-detail-item__row list-users-detail-item__name">{{ item.ErpCandidate.name }} ({{ item.ErpCandidate.phone }})</div>
                    <div class="list-users-detail-item__row">Nơi đăng kí: {{ item.AddressProvince.name }} - {{ item.AddressDistrict.name }}</div>
                    <div class="list-users-detail-item__row">
                      Nguồn: {{ referral[item.ErpCandidate.referral] }} - {{ source[item.ErpCandidate.referral] ? source[item.ErpCandidate.referral][item.ErpCandidate.source] : item.ErpCandidate.source }}
                    </div>
                    <div class="list-users-detail-item__row">Vị trí: {{ item.JobReferencesReward.job_name }}</div>
                    <div class="list-users-detail-item__row" v-if="tabIndex === 2">Ngày nhận việc: {{ moment(item.ErpCandidate.expected_join_date).format('DD-MM-YYYY') }}</div>
                  </div>
                </div>

                <div v-if="type === 'employee_document'" class="">
                  <div v-for="(item, index) in dataTab[type][+tabIndex].data" class="list-users-detail__item list-users-detail-item" :key="index">
                    <i @click="gotoDetail(item.MasterProfile)" class="list-users-detail-item__arrow ion d-block ion-ios-arrow-forward"></i>
                    <div class="list-users-detail-item__row list-users-detail-item__name">
                      {{ item.MasterProfile.fullname }} ({{ item.User.username }})
                      <b-badge class="ml-1 mr-1" :variant="profileCnBConfirm[item.MasterProfile.cnb_confirmed].variant">
                        {{profileCnBConfirm[item.MasterProfile.cnb_confirmed].desc}}
                      </b-badge>
                    </div>
                    <div class="list-users-detail-item__row">Vị trí: {{ item.Position.position_name }} - Kho {{item.Station.name}}</div>
                    <div class="list-users-detail-item__row">Cần bổ sung: {{ Object.values(item.listMissDocument).length }} nội dung</div>
                    <div>
                      <b-badge class="mr-1" variant="primary" v-for="(doc, index) in item.listMissDocument" :key="index">{{doc}}</b-badge>
                    </div>
                  </div>
                </div>

                <div v-if="type === 'employee_contract'" class="">
                  <div v-for="(item, index) in dataTab[type][+tabIndex].data" class="list-users-detail__item list-users-detail-item" :key="index">
                    <i @click="gotoDetail(item.User)" class="list-users-detail-item__arrow ion d-block ion-ios-arrow-forward"></i>
                    <div class="list-users-detail-item__row list-users-detail-item__name">
                      {{ item.User.fullname }} ({{ item.User.username }})
                      <b-badge class="ml-1 mr-1" variant="danger" v-if="moment(item.EmpContract.end_date) <= moment()">Hết hạn</b-badge>
                      <b-badge class="ml-1 mr-1" variant="warning" v-else>Chưa có</b-badge>
                    </div>
                    <div class="list-users-detail-item__row">Vị trí: {{ item.Position.position_name }} - Kho {{item.Station.name}}</div>
                    <div class="list-users-detail-item__row" v-if="contractDesc[item.EmpContract.type_contract]">
                      Hợp đồng: {{ contractDesc[item.EmpContract.type_contract] }}  -  {{item.EmpContract.contract_number}}{{item.EmpContract.has_kpi === '1' ? '  -  Có KPI' : ''}}
                    </div>
                    <div class="list-users-detail-item__row" v-if="item.EmpContract.start_date">Thời gian: {{ moment(item.EmpContract.start_date).format('DD-MM-YYYY') }}  ->  {{ moment(item.EmpContract.end_date).format('DD-MM-YYYY') }}</div>
                  </div>
                </div>

                <div v-if="type === 'employee_dependant'" class="">
                  <div v-for="(item, index) in dataTab[type][+tabIndex].data" class="list-users-detail__item list-users-detail-item" :key="index">
                    <i @click="gotoDetail(item)" class="list-users-detail-item__arrow ion d-block ion-ios-arrow-forward"></i>
                    <div class="list-users-detail-item__row list-users-detail-item__name">{{ item.fullname }} ({{ item.CodCode }}) - {{item.Address}}</div>
                    <div class="list-users-detail-item__row">Vị trí: {{ item.PositionName }}/{{item.WorkTypeDesc}}  -  kho {{item.Station}}</div>
                    <div class="list-users-detail-item__row">Số NPT: {{ item.no_of_dependants ? item.no_of_dependants : 0 }}/{{ item.sumOfDependant }}</div>
                    <div class="row bg-light" v-for="(dependant, idx) in item.DependentPeople" :key="dependant.id">
                      <div class="d-inline-block border col-1">{{idx + 1}}</div>
                      <div class="d-inline-block border col-6">{{dependant.fullname}}</div>
                      <div class="d-inline-block border col-2">{{relationship[dependant.relationship]}}</div>
                      <div class="d-inline-block border col-3">{{statusRegister[dependant.register_status]}}</div>
                    </div>
                  </div>
                </div>

                <div v-if="type === 'employee_status'">
                  <div v-for="(item, index) in dataTab[type][+tabIndex].data" class="list-users-detail__item list-users-detail-item" :key="index">
                    <i @click="gotoDetail(item)" class="list-users-detail-item__arrow ion d-block ion-ios-arrow-forward"></i>
                    <div class="list-users-detail-item__row list-users-detail-item__name">{{ item.MasterProfile.fullname }} - {{ item.User.username }}</div>
                    <div class="list-users-detail-item__row">Vị trí: {{ item.Position.position_name }} -  kho {{ item.Station.name }}</div>
                    <div class="list-users-detail-item__row">Trạng thái:
                      <b-badge class="ml-1 mr-1" variant="danger">Cần HR xác nhận hồ sơ</b-badge>
                      <b-badge class="float-right mr-5" variant="danger" v-show="overtime(item.MasterProfile.created)">Đã quá 48h</b-badge>
                    </div>
                  </div>
                </div>

                <infinite-loading spinner="spiral" @infinite="infiniteHandler">
                  <div slot="no-more"></div>
                  <div slot="no-results"></div>
                </infinite-loading>
              </div>
            </b-tab>
          </b-tabs>
        </div>
    </b-modal>
  </div>
</template>
<script>
// entities
import Candidate from 'domain/entities/Candidate'
import Contract from 'domain/entities/Contract'
import Dependant from 'domain/entities/Dependant'
import MasterProfile from 'domain/entities/MasterProfile'

// library
import moment from 'moment'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

import HrStatisticService from 'domain/services/hr-statistic-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'modal-list-detail',

  components: {
    InfiniteLoading,
    PerfectScrollbar
  },

  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    title: {
      default: 'Nhân viên',
      type: String
    },
    type: {
      default: 'employee-document',
      type: String
    },
    filters: {
      type: Object
    },
    listApiFilter: {
      default: () => ([]),
      type: Array
    },
    dataStatistic: {
      type: Object
    },
    tab: {
      default: null
    }
  },

  data: () => ({
    referral: null,
    source: null,
    contractDesc: null,
    relationship: null,
    statusRegister: null,
    profileCnBConfirm: null,
    moment: moment,
    tabIndex: 0,
    dataTab: {
      candidate: [
        {value: 'contact', desc: 'Cần liên hệ', functionName: 'getStatisticCandidate', params: {status: 'contact', page: 1, type: 'detail'}, data: []},
        {value: 'interview', desc: 'Phỏng vấn', functionName: 'getStatisticCandidate', params: {status: 'interview', page: 1, type: 'detail'}, data: []},
        {value: 'expect_join', desc: 'Chờ nhận việc', functionName: 'getStatisticCandidate', params: {status: 'expect_join', page: 1, type: 'detail'}, data: []}
      ],
      employee_document: [
        {value: 'no_info', desc: 'Chưa có thông tin', functionName: 'getStatisticDataEmployeeDocument', params: {status: 'no_info', page: 1, type: 'detail'}, data: []},
        {value: 'has_info', desc: 'Đã có thông tin', functionName: 'getStatisticDataEmployeeDocument', params: {status: 'has_info', page: 1, type: 'detail'}, data: []}
      ],
      employee_contract: [
        {value: 'expired', desc: 'Hết hạn hợp đồng', functionName: 'getStatisticDataEmployeeContract', params: {status: 'expired', page: 1, type: 'detail'}, data: []},
        {value: 'no_contract', desc: 'Chưa có hợp đồng', functionName: 'getStatisticDataEmployeeContract', params: {status: 'no_contract', page: 1, type: 'detail'}, data: []}
      ],
      employee_dependant: [
        {value: 'incompleteFile', desc: 'Thiếu hồ sơ', functionName: 'getStatisticDataDependant', params: {status: 'incompleteFile', page: 1, type: 'detail'}, data: []},
        {value: 'error', desc: 'Lỗi', functionName: 'getStatisticDataDependant', params: {status: 'error', page: 1, type: 'detail'}, data: []},
        {value: 'wait', desc: 'Đang chờ', functionName: 'getStatisticDataDependant', params: {status: 'wait', page: 1, type: 'detail'}, data: []}
      ],
      employee_insurance: [
        {value: 'TM', desc: 'Tăng mới', functionName: 'getStatisticDataInsurance', params: {status: 'TM', page: 1, type: 'detail'}, data: []},
        {value: 'TL', desc: 'Tăng tham gia', functionName: 'getStatisticDataInsurance', params: {status: 'TL', page: 1, type: 'detail'}, data: []}
      ],
      employee_status: [
        {value: 'not_verified', desc: 'Điều phối tạo, cần HR xác nhận', functionName: 'getStatisticDataProfileStatus', params: {status: 'not_verified', page: 1, type: 'detail'}, data: []}
      ]
    }
  }),

  watch: {
    isShow: function (newVal, oldVal) {
      if (newVal) {
        this.showModal()
      } else {
        this.hideModal()
      }
    },

    tab: function (newValue, oldValue) {
      if (+newValue) this.tabIndex = newValue
    }
  },

  created () {
    this.referral = Candidate.referralEnums
    this.source = Candidate.sourceDesc
    this.contractDesc = Contract.typeOptions
    this.relationship = Dependant.relationship
    this.statusRegister = Dependant.statusDesc
    this.profileCnBConfirm = MasterProfile.statusCnBConfirm
  },

  methods: {
    overtime (time) {
      let start = moment(time)
      let end = moment()
      return Math.ceil(moment.duration(end.diff(start)).asDays()) > 2
    },

    resetTabData () {
      this.tabIndex = 0
      for (let item of this.dataTab[this.type]) {
        item.data = []
        item.params.page = 1
      }
    },

    scrollHandle (evt) {
    },

    hideModal () {
      this.resetTabData()
      this.$refs.modalListDetail.hide()
      this.$emit('toggleModal', false)
    },

    showModal () {
      this.$refs.modalListDetail.show()
      this.$emit('toggleModal', true)
    },

    gotoDetail (item) {
      let url = ''
      switch (this.type) {
        case 'candidate':
          url = `/adm/candidate/edit/${item.id}`
          break
        case 'employee_dependant':
          url = `/adm/dependent-person/manager/${item.staff_code}`
          break
        case 'employee_document':
          url = `/adm/profile/master/edit/${item.id}`
          break
        case 'employee_contract':
          url = `/adm/user/edit/${item.id}`
          break
        case 'employee_insurance':
          url = `/adm/insurance/list?mp_id=${item.id}`
          break
        case 'employee_status':
          url = `/adm/profile/master/edit/${item.MasterProfile.id}`
          break
      }
      window.open(url, '_blank')
    },

    infiniteHandler ($state) {
      this.getDataDetail(this.dataTab[this.type][this.tabIndex], $state, this.filters)
    },

    getDataDetail (config, $state, params = {}) {
      if (!config || !config.functionName) return
      if (this.listApiFilter.includes(config.functionName)) params = {...config.params, ...params}
      else params = config.params
      HrStatisticService[config.functionName](params)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.length > 0) {
              $state.loaded()
              config.params.page++
              config.data.push(...res.data.data)
            } else {
              $state.complete()
            }
          } else {
            throw res.data.message
          }
        }).catch(e => {
          commonHelper.showMessage(e, 'warning')
        })
    }
  }
}
</script>
<style lang="scss">
  .modal-list-detail {
    &__body {
      padding: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .list-users-detail-wrapper {
    padding: 0;
  }
  .list-users-detail {
    height: calc(100vh - 200px);
    padding: 0 15px;
    overflow-y: auto;
    &__item {
      border-bottom: 1px solid #ccc;
    }
  }

  .list-users-detail-item {
    position: relative;
    padding: 10px 0;

    &__row {
      padding: 3px 0;
    }

    &__arrow {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 30px;
      color: green;
      cursor: pointer;
    }

    &__name {
      font-weight: bold;
    }

    &__number {
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
