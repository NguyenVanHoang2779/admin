<template>
    <div>
        <h4 class="py-3 mb-4">
            <p class="font-weight-bold m-0">Quản lý SOS nội bộ</p>
        </h4>
        <!-- Header -->
        <div class="border-right-0 border-left-0 container-m--x">
            <div class="row">
                <div class="col-md-9">
                    <!-- Sale stats -->
                    <b-card no-body class="mb-4">
                        <b-card-body>
                            <b-form-group>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="my-1">
                                            <input-sos-code @model="searchData.inputCodeTicket = $event"></input-sos-code>
                                        </div>
                                        <div class="my-1">
                                            <select-status-sos-ticket @model="searchData.selectStatusSos = $event" :status="ticketDetails.ticketStatusSos"></select-status-sos-ticket>
                                        </div>
                                        <div class="my-1">
                                            <select-type-sos-ticket @model="searchData.selectTypeSos = $event"></select-type-sos-ticket>
                                        </div>
                                        <div class="my-1">
                                            <select-range-time-sos-ticket @model="searchData.selectRangeTimeSos = $event"></select-range-time-sos-ticket>
                                        </div>
                                        <div class="my-1 container-fluid">
                                            <b-row class="my-1">
                                                <b-col style="line-height: 2.5rem" sm="3">
                                                    <label class="font-italic">Hạn xử lý:</label>
                                                </b-col>
                                                <b-col sm="9">
                                                    <v-date-picker  color="green" mode="range" placeholder="Chon thoi gian" :popover="{visibility: 'focus'}"
                                                      :theme-styles="{dayContent: {fontSize: '0.9rem'}}" v-model="searchData.selectRangeDeadLine" locale="vi"/>
                                                </b-col>
                                            </b-row>
                                        </div>
                                        <div class="my-1 container-fluid">
                                            <b-row class="my-1">
                                                <b-col style="transform: translateY(25%)" sm="3">
                                                    <label class="font-italic">Đáp ứng hạn xử lý:</label>
                                                </b-col>
                                                <b-col sm="9">
                                                  <b-form-select v-model="searchData.selectStatusDeadline" :options="optionStatusDeadline">
                                                  </b-form-select>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <b-container fluid class="my-1">
                                            <b-row class="my-1">
                                                <b-col style="transform: translateY(25%)" sm="3">
                                                    <label class="font-italic">Miền người tạo:</label>
                                                </b-col>
                                                <b-col sm="9">
                                                    <single-select-region @handleSelectedRegion="handleSelectedRegion" placeholder=""></single-select-region>
                                                </b-col>
                                            </b-row>
                                        </b-container>
                                        <div class="my-1">
                                            <select-province-sos-ticket @model="searchData.selectProvinceSos = $event"></select-province-sos-ticket>
                                        </div>
                                        <div class="my-1">
                                            <select-station-sos-ticket @model="searchData.selectStationSos = $event"></select-station-sos-ticket>
                                        </div>
                                        <div class="my-1">
                                            <select-user-sos-ticket @model="searchData.selectCreatedUserSos = $event" v-bind:title="`Người tạo:`"></select-user-sos-ticket>
                                        </div>
                                        <div class="my-1">
                                            <select-user-sos-ticket @model="searchData.selectHandledUserSos = $event" v-bind:title="`Người thực hiện:`"></select-user-sos-ticket>
                                        </div>
                                        <div class="my-1 container-fluid">
                                            <b-row class="my-1">
                                                <b-col style="line-height: 2.5rem" sm="3">
                                                  <label class="font-italic">Tag sos:</label>
                                                </b-col>
                                                <b-col sm="9">
                                                    <MultiSelectHrTag
                                                        :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                                                        v-model="searchData.hr_tag_ids"
                                                        :multiple="false"
                                                        :scope="scope"
                                                        :table-name="tableName"
                                                        :reload="reloadListTag"
                                                        @handleHrTagSelected="handleHrTagSelected"
                                                    />
                                                </b-col>
                                            </b-row>
                                        <div class="my-1 container-fluid">
                                    </div>
                                </div>
                                    </div>
                                </div>
                            </b-form-group>
                            <b-form-group>
                                <div class="row justify-content-center">
                                    <div class="col-md-2">
                                        <b-btn @click="reloadPage" style="width: 100%;" variant="outline-primary">
                                            <i class="ion ion-md-sync" aria-hidden="true"></i> Làm lại
                                        </b-btn>
                                    </div>
                                    <div class="col-md-2">
                                        <ladda-btn style="width: 100%;" :loading="searchData.loadingSearch" @click.native="buttonSearchClick()" data-style="zoom-out" class="btn btn-success">
                                            <i class="ion ion-md-search"></i> Tìm kiếm
                                        </ladda-btn>
                                    </div>
                                    <div class="col-md-2" v-if="checkPermissionExportAllPage()">
                                        <b-btn style="width: 100%;"  @click="exportData" data-style="zoom-out" class="btn btn-info">
                                            <template v-if="exported">
                                              <i class="fas fa-download" aria-hidden="true"/> Xuất dữ liệu
                                            </template>
                                            <template v-else>
                                              <i class="fas fa-sync fa-spin" aria-hidden="true"/> Xuất dữ liệu
                                            </template>
                                        </b-btn>
                                    </div>
                                    <div class="col-md-2" v-if="viewConfig">
                                      <b-btn to="/sos-noi-bo/config-type" style="width: 100%;" variant="outline-secondary">
                                            <i class="ion ion-ios-construct" aria-hidden="true"/> Config
                                        </b-btn>
                                    </div>
                                </div>
                            </b-form-group>
                        </b-card-body>
                    </b-card>

                </div>
                <div class="col-md-3">
                    <!-- Type gadgets chart -->
                    <chart-sos-ticket @timeChange="changeChartTime"></chart-sos-ticket>
                    <!-- / Type gadgets chart -->
                </div>
            </div>
        </div>
        <div class="border-top-0 mb-4 ui-bordered container-m--x">
            <b-card no-body>
                <b-card-body>
                    <div class="row">
                        <div class="col">
                            Mỗi trang: &nbsp;
                            <b-select size="sm" @input="pageChange" v-model="page.perPage" :options="[20, 50, 100]" class="d-inline-block w-auto" />
                        </div>
                        <div class="col">
                            <b-btn variant="outline-primary" class="float-sm-right" v-b-modal.modal-list-ticket-ignore >Danh sách bỏ qua <b-badge variant="light">{{tableTicket.count_ignore_tickets}}</b-badge></b-btn>
                        </div>
                    </div>
                    <br>
                    <b-card-body class="pt-0 pb-3">

                        <div class="row">
                            <div class="col-sm text-sm-left text-center">
                                <span class="text-muted" v-if="page.totalItems">Trang {{ page.currentPage }}/{{Math.ceil(page.totalItems / page.perPage)}} trên {{page.totalItems}} bản ghi</span>
                            </div>
                            <b-pagination class="justify-content-center justify-content-sm-end m-0 clear-zindex"
                                v-if="page.totalItems"
                                v-model="page.currentPage"
                                :total-rows="page.totalItems"
                                :per-page="page.perPage"
                                v-on:input="pageChange"
                                size="sm"
                            >
                            </b-pagination>
                        </div>

                    </b-card-body>
                    <div class="table-responsive">
                        <b-table
                            :busy="tableTicket.isBusy"
                            @sort-changed="sortingChanged"
                            :items="tableTicket.articlesData"
                            :fields="tableTicket.fields"
                            :sort-by.sync="tableTicket.sortBy"
                            :sort-desc.sync="tableTicket.sortDesc"
                            :striped="false"
                            :borderless="true"
                            :bordered="false"
                            :fixed="false"
                            tbody-tr-class="rowClass"
                            class="ticket-table">
                            <template v-slot:cell(content)="data">
                                <div class="row">
                                    <div class="col ticket__title">
                                        <div class="ticket__title__name">
                                            <h5><i style="font-size: 130%" class="ion ion-md-share-alt"></i><b>&nbsp;{{data.item.ticket_id}}/{{data.item.ticket_type_name}}</b></h5>
                                        </div>
                                        <div class="ticket__tag--wrap">
                                            <div class="ticket__tag" v-for="(tag, index) in data.item.tags" :key="tag.id">
                                                <div class="ticket__tag--name">{{ tag.name }}</div>
                                                <i @click="onDetach(data.item, tag, data.index, index)" class="ticket__tag--delete fa fa-times-circle"></i>
                                            </div>
                                            <b-button class="tag-manage" pill size="sm" variant="outline-secondary" @click="openTagManage(data)">+ Tag</b-button>
                                        </div>
                                    </div>
                                    <div class="col justify-content-end mt-1" style="max-width: max-content">
                                        <b-badge variant="outline-default" v-if="data.item.ticket_status_id === 0">{{statusTicket[0]}}</b-badge>
                                        <b-badge variant="outline-danger" v-if="data.item.ticket_status_id === 1">{{statusTicket[1]}}</b-badge>
                                        <b-badge variant="outline-primary" v-if="data.item.ticket_status_id === 2">{{statusTicket[2]}}</b-badge>
                                        <b-badge variant="outline-success" v-if="data.item.ticket_status_id === 3">{{statusTicket[3]}}</b-badge>
                                    </div>
                                </div>
                                <div class="row">
                                    <!--Nội dung ticket -->
                                    <div class="col-md-2">
                                        <ticket-image v-bind:data="data"></ticket-image>
                                    </div>
                                    <div class="col-md-10 content-ticket">
                                        <text-read-more v-bind:text="data.item.ticket_desc" v-bind:words="80"></text-read-more>
                                        <!-- <hr class="mb-0">
                                        <div class="row justify-content-center text-center">
                                            <div @click="buttonCountLogsClick(data)" class="col-md-6 button-comment no-select"><p class="pt-3">
                                                <i class="ion ion-md-clipboard"></i> {{data.item.ticket_refs.length}} Đề xuất
                                            </p></div>
                                            <div @click="buttonCommentClick(data, data.item.ticket_id)" class="col-md-6 button-comment no-select"><p class="pt-3">
                                                <svg height="18px" viewBox="0 -24 480 480" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="m408 0h-336c-39.746094.0429688-71.9570312 32.253906-72 72v208c.0429688 39.746094 32.253906 71.957031 72 72h22.238281l-14.078125 70.398438c-.605468 3.027343.585938 6.128906 3.054688 7.976562s5.78125 2.109375 8.511718.671875l150.25-79.046875h166.023438c39.746094-.042969 71.957031-32.253906 72-72v-208c-.042969-39.746094-32.253906-71.9570312-72-72zm56 280c-.035156 30.914062-25.085938 55.964844-56 56h-168c-1.300781 0-2.578125.316406-3.726562.921875l-137.128907 72.175781 12.695313-63.496094c.480468-2.355468-.121094-4.800781-1.640625-6.660156-1.519531-1.863281-3.796875-2.941406-6.199219-2.941406h-32c-30.914062-.035156-55.964844-25.085938-56-56v-208c.035156-30.914062 25.085938-55.964844 56-56h336c30.914062.035156 55.964844 25.085938 56 56zm0 0"/></svg>
                                                {{data.item.ticket_logs.filter((obj) => obj.type === 'comment').length}} phản hồi</p>
                                            </div>
                                        </div> -->
                                    </div>
                                    <div class="col-md-12">
                                        <div class="ticket__logs">
                                            <div class="ticket__logs__title">
                                                <h5>Ghi chú:</h5>
                                            </div>
                                            <div class="ticket__logs__content">
                                                <time-line
                                                  :logs="data.item.logs"
                                                >
                                                </time-line>
                                            </div>
                                          </div>
                                    </div>
                                </div>
                            </template>

                            <template v-slot:cell(info)="data">
                                <div class="row">
                                    <div class="col-md-8">
                                        <i style="font-size: 130%" class="ion ion-ios-contact"></i>
                                        {{data.item.ticket_creator_info.username}}/
                                        {{data.item.ticket_creator_info.fullname}}/
                                        <span @click="showTel(data.item.ticket_id)">{{data.item.ticket_creator_info.tel}}</span>/
                                        {{data.item.ticket_creator_info.province_name}}/
                                        {{data.item.ticket_creator_info.station_name}}/
                                        {{data.item.ticket_creator_info.position_name}}
                                    </div>
                                    <div class="col-md-4">
                                        <div>
                                          <i style="font-size: 130%" class="ion ion-md-time"></i>
                                          <span>
                                          {{data.item.ticket_created_text}}
                                          </span>
                                        </div>
                                        <div v-if="data.item.ticket_deadline" :class="{'text-danger': !data.item.ticket_deadline_status, 'text-success': data.item.ticket_deadline_status}">
                                          {{data.item.ticket_deadline_status ? 'Hạn xử lý:' : 'Trễ hẹn:'}} {{data.item.ticket_deadline}}
                                        </div>
                                    </div>
                                </div>
                              <hr class="m-1">
                              <div>
                                  <multi-select-user type="group" v-bind:data="data"></multi-select-user>
                                  <multi-select-user type="group_watch" v-bind:data="data"></multi-select-user>
                              </div>
                            </template>

                            <template v-slot:cell(created)="data">
                                <p>{{data.item.ticket_created_text}}</p>
                            </template>
                            <template v-slot:cell(actions)="data">
                                <ticket-action
                                    v-bind:data="data"
                                    @clickChangeTypeTicket="dataModalChange = $event"
                                    @clickNote="showModalNote"
                                ></ticket-action>
                            </template>
                            <template v-slot:row-details="data">
                                <ticket-log-tab v-bind:data="data" v-bind:user="infoUserLogin"></ticket-log-tab>
                            </template>
<!--Busy table-->
                            <template v-slot:table-busy>
                                <div class="text-center text-primary my-2">
                                    <div class="col">
                                        <div class="sk-folding-cube sk-primary">
                                            <div class="sk-cube1 sk-cube"></div>
                                            <div class="sk-cube2 sk-cube"></div>
                                            <div class="sk-cube4 sk-cube"></div>
                                            <div class="sk-cube3 sk-cube"></div>
                                        </div>
                                    </div>
                                    <strong>Đang tải dữ liệu...</strong>
                                </div>
                            </template>
                        </b-table>
                    </div>
                    <!--Modal đổi mục sos-->
                    <modal-change-type-ticket v-bind:data="dataModalChange" @changeType="changeTypeSos($event)"></modal-change-type-ticket>

                    <!--Modal xác nhận bỏ qua sos-->
                    <modal-confirm-ignore-ticket @getTickets="buttonRestoreClick()"></modal-confirm-ignore-ticket>

                    <!--Modal danh sách ticket đã bỏ qua-->
                    <modal-list-ticket-ignore @getTickets="buttonRestoreClick"></modal-list-ticket-ignore>

                    <HrTagModalV2
                        :open="openTagModal"
                        :globalTags="globalTags"
                        :tableName="tableName"
                        :recordId="ticketId"
                        :attach-permission="attachPermission"
                        :scope='scope'
                        :havePersonalTag="false"
                        :permissions="permissionOnTag"
                        @refresh="refreshHrTags"
                        @refreshModelTags="refreshHrTags"
                        @action="closeTagManage()"
                        @attachTagSuccess="attachTagSuccess"
                    />

                    <ModalNote
                      :ticketId="ticketId"
                      @noteSuccess="updateNoteTicket"
                      @closeModalNote="closeModalNote"
                    >
                    </ModalNote>
                </b-card-body>
            </b-card>
        </div>
    </div>
</template>
<style src="@/assets/sass/components/internal-sos.scss" lang="scss"></style>
<script>
import sosService from 'domain/services/internal-sos-service'
import InputSosCode from './components/InputSosCode'
import SelectStatusSosTicket from './components/SelectStatusSosTicket'
import SelectTypeSosTicket from './components/SelectTypeSosTicket'
import SelectRangeTimeSosTicket from './components/SelectRangeTimeSosTicket'
import SelectProvinceSosTicket from './components/SelectProvinceSosTicket'
import SelectUserSosTicket from './components/SelectUserSosTicket'
import SelectStationSosTicket from './components/SelectedStationSosTicket'
import TextReadMore from './components/TextReadMore'
import TicketLog from './components/TicketLog'
import TicketComment from './components/TicketComment'
import TicketComment2 from './components/TicketCommentV2'
import TicketLogTab from './components/TicketLogTab'
import TicketImage from './components/TicketImage'
import TicketAction from './components/TicketAction'
import ModalChangeTypeTicket from './components/ModalChangeTypeTicket'
import ModalConfirmIgnoreTicket from './components/ModalConfirmIgnoreTicket'
import ModalListTicketIgnore from './components/ModalListTicketIgnore'
import ChartSosTicket from './components/ChartSosTicket'
import HrTagModalV2 from '../../erp/HrOrder/HrTagModalV2'
import MultiSelectHrTag from '../../../elements/common/MultiSelectHrTag'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Vue from 'vue'
import VueImg from 'v-img'
import MultiSelectUser from './components/MultiselectUser'
import commonHelper from 'infrastructures/helpers/common-helpers'
import profileService from 'domain/services/profile-service'
import hrTagService from '../../../../domain/services/hr-tag-service'
import moment from 'moment'
import ModalNote from './components/ModalNote'
import TimeLine from './components/TimeLine'
// mixins
import ExportMixin from 'mixins/ExportMixin'

Vue.use(VueImg, {
  altAsTitle: true
})

const statusTicket = {
  0: 'Không xác định',
  1: 'Chưa tiếp nhận',
  2: 'Đang xử lý',
  3: 'Đã xử lý'
}

export default {
  name: 'internal-sos-manager',

  mixins: [ExportMixin],

  components: {
    ModalNote,
    MultiSelectUser,
    sosService,
    SelectUserSosTicket,
    InputSosCode,
    SelectStatusSosTicket,
    SelectTypeSosTicket,
    SelectRangeTimeSosTicket,
    SelectProvinceSosTicket,
    SelectStationSosTicket,
    TextReadMore,
    TicketLog,
    TicketComment,
    TicketImage,
    TicketLogTab,
    TicketAction,
    TicketComment2,
    ChartSosTicket,
    LaddaBtn,
    PerfectScrollbar,
    ModalChangeTypeTicket,
    ModalConfirmIgnoreTicket,
    ModalListTicketIgnore,
    SingleSelectRegion,
    HrTagModalV2,
    MultiSelectHrTag,
    TimeLine
  },
  data: () => ({
    viewConfig: false,
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      totalItems: 0
    },
    ticketDetails: {
      ticketStatusSos: []
    },
    searchData: {
      inputCodeTicket: '',
      selectTypeSos: [],
      selectStatusSos: [],
      selectRangeTimeSos: '',
      selectProvinceSos: [],
      selectStationSos: [],
      selectCreatedUserSos: [],
      selectHandledUserSos: [],
      loadingSearch: false,
      selectRegionSos: '',
      selectRangeDeadLine: {
        start: null,
        end: null
      },
      selectStatusDeadline: '',
      hr_tag_ids: []
    },
    optionStatusDeadline: [
      { value: 'ontime', text: 'Đúng hạn' },
      { value: 'late', text: 'Trễ hạn' }
    ],
    notify: {
      message: '',
      class: '',
      title: ''
    },
    tableTicket: {
      searchKeys: ['id', 'title'],
      sortBy: 'id',
      sortDesc: false,
      fields: [
        { key: 'content', label: 'Nội dung', sortable: false, thStyle: 'width: 55%' },
        { key: 'info', label: 'Thông tin', sortable: false, thStyle: 'width: 35%' },
        { key: 'actions', label: 'Hành động', sortable: false, thStyle: 'width: 10%' }
      ],
      articlesData: [],
      searchText: '',
      isBusy: false,
      count_ignore_tickets: 0
    },
    infoUserLogin: [],
    statusTicket: statusTicket,
    dataModalChange: [],
    current_type: 'default',
    exporting: false,
    exported: true,
    chartData: null,
    openTagModal: false,
    globalTags: [],
    tableName: 'sgw_tickets',
    ticketId: null,
    indexCurrentTicket: null,
    attachPermission: true,
    scope: 'global',
    reloadListTag: false,
    permissionOnTag: null
  }),

  created () {
    this.getTags()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.page.totalItems / this.page.perPage)
    }
  },
  methods: {
    handleSelectedRegion (option) {
      this.searchData.selectRegionSos = option ? option.id : null
    },

    fetchTickets () {
      if (this.$route.query.ticket_type !== undefined) {
        this.ticketDetails.ticketStatusSos = [this.$route.query.status]
      }
    },

    showModalNote (ticket) {
      this.ticketId = ticket.ticketId
      this.indexCurrentTicket = ticket.indexTicket
      this.$bvModal.show('modal-note-ticket')
    },

    updateNoteTicket (noteJustAdded) {
      this.tableTicket.articlesData[this.indexCurrentTicket].logs = this.tableTicket.articlesData[this.indexCurrentTicket].logs || []
      this.tableTicket.articlesData[this.indexCurrentTicket].logs.push(noteJustAdded)
      this.closeModalNote()
    },

    closeModalNote () {
      this.ticketId = null
    },

    openTagManage (ticket) {
      this.ticketId = ticket ? ticket.item.ticket_id : null
      this.attachPermission = !!ticket
      this.openTagModal = true
      this.indexCurrentTicket = ticket.index
    },

    closeTagManage () {
      this.recordId = null
      this.indexCurrentTicket = null
      this.openTagModal = false
    },

    async refreshHrTags () {
      await this.getTags()
    },

    buttonRestoreClick () {
      if (this.current_type === 'chart_time') {
        this.changeChartTime(this.chartData, this.page.currentPage)
      }
      if (this.current_type === 'search') {
        this.buttonSearchClick(this.page.currentPage)
      }
    },

    sortingChanged (ctx) {
    },

    buttonSearchClick (currentPage = 1) {
      this.page.currentPage = currentPage
      this.current_type = 'search'
      this.getTickets()
    },

    changeChartTime (time, currentPage = 1) {
      if (typeof time === 'undefined') return
      this.current_type = 'chart_time'
      this.chartData = time
      let range = []
      range[0] = time.start
      range[1] = time.end
      let status = time.status
      this.page.currentPage = currentPage
      if (typeof this.infoUserLogin.user_id !== 'undefined') {
        this.getTickets(range, status)
      } else {
        if (this.$route.query.ticket_type !== undefined) {
          this.current_type = 'statistic_sos'
          this.getTickets(null, this.$route.params.status)
        } else {
          sosService.apiGetInfoUserLogin().then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                this.infoUserLogin = response.data.data
                if (this.infoUserLogin.access_config) this.viewConfig = true
                this.getTickets(range, status)
              } else {
                window.location.href = this.baseUrl
              }
            }
          }).catch(() => {
          }).then(() => {
          })
        }
      }
    },

    pageChange () {
      if (this.current_type === 'statistic_sos') {
        this.page.currentPage = this.page.currentPage
        this.getTickets(null, this.$route.params.status)
      }
      if (this.current_type === 'chart_time') {
        this.changeChartTime(this.chartData, this.page.currentPage)
      }
      if (this.current_type === 'search') {
        this.buttonSearchClick(this.page.currentPage)
      }
    },

    exportData () {
      this.tableTicket.isBusy = true
      this.exported = false
      let rangeTimeSend = []
      if (this.searchData.selectRangeTimeSos !== '') {
        let rangeTime = this.searchData.selectRangeTimeSos.split(' to ')
        if (rangeTime.length === 1) {
          rangeTimeSend[0] = `${rangeTime[0]} 00:00:00`
          rangeTimeSend[1] = `${rangeTime[0]} 23:59:59`
        }
        if (rangeTime.length === 2) {
          rangeTimeSend[0] = `${rangeTime[0]} 00:00:00`
          rangeTimeSend[1] = `${rangeTime[1]} 23:59:59`
        }
      }
      let dataSend = {
        'code_ticket': this.searchData.inputCodeTicket !== undefined ? this.searchData.inputCodeTicket : null,
        'type': this.searchData.selectTypeSos.length === 0 ? [] : this.searchData.selectTypeSos.map(a => a.id),
        'status': this.searchData.selectStatusSos === 0 ? [] : this.searchData.selectStatusSos.map(a => a.id),
        'range_time': this.searchData.selectRangeTimeSos !== undefined ? rangeTimeSend : null,
        region: this.searchData.selectRegionSos,
        'province_creator': this.searchData.selectProvinceSos === 0 ? [] : this.searchData.selectProvinceSos.map(a => a.id),
        'station_handler': this.searchData.selectStationSos === 0 ? [] : this.searchData.selectStationSos.map(a => a.id),
        'creator_id': this.searchData.selectCreatedUserSos === 0 ? [] : this.searchData.selectCreatedUserSos.map(a => a.id),
        'handler_id': this.searchData.selectHandledUserSos === 0 ? [] : this.searchData.selectHandledUserSos.map(a => a.id),
        'export': true
      }
      sosService.apiExportTickets(dataSend).then(res => {
        if (res.data.success) {
          this.checkJobExportStatus(res.data.job_id)
        } else {
          commonHelper.showMessage('Có lỗi khi xuất dữ liệu', 'warning')
          this.exporting = false
          this.exported = false
        }
      }).catch(e => {
        this.exporting = false
        this.exported = false
      }).then(() => {
        this.tableTicket.isBusy = false
        commonHelper.showMessage('Quá trình có thể mất thời gian. Vui lòng chờ', 'success')
      })
    },

    checkJobExportStatus (jobId) {
      let getJobStat = setInterval(() => {
        profileService.checkJobStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              if (response.data.data.job_status === 'closed') {
                this.exported = true
                this.exporting = false
                clearInterval(getJobStat)
                if (response.data.data.url) {
                  window.location.href = response.data.data.url
                  commonHelper.showMessage('Đã xuất xong file dữ liệu', 'success')
                } else if (response.data.data.message) {
                  commonHelper.showMessage(response.data.data.message, 'warning')
                } else {
                  commonHelper.showMessage('Có lỗi xảy ra', 'warning')
                }
              }
            } else {
              commonHelper.showMessage(response.data.message, 'warning')
              clearInterval(getJobStat)
              this.exporting = false
            }
          })
      }, 3000)
    },

    getTickets (rangeTime = null, status = [1, 2, 3]) {
      let dataSend = {
        'status': [1, 2, 3],
        'limit': this.page.perPage,
        'page': this.page.currentPage
      }
      if (this.current_type === 'statistic_sos') {
        dataSend = {
          'hr_work_manage': true,
          'status': [this.$route.query.status],
          'type': this.$route.query.ticket_type.split(','),
          'limit': this.page.perPage,
          'page': this.page.currentPage
        }
      }
      if (this.current_type === 'search') {
        let rangeTimeSend = []
        if (this.searchData.selectRangeTimeSos !== '') {
          let rangeTime = this.searchData.selectRangeTimeSos.split(' to ')
          if (rangeTime.length === 1) {
            rangeTimeSend[0] = `${rangeTime[0]} 00:00:00`
            rangeTimeSend[1] = `${rangeTime[0]} 23:59:59`
          }
          if (rangeTime.length === 2) {
            rangeTimeSend[0] = `${rangeTime[0]} 00:00:00`
            rangeTimeSend[1] = `${rangeTime[1]} 23:59:59`
          }
        }
        // Remove params from URL
        if (this.$route.query.ticket_type !== undefined) this.$router.push({query: {ticket_type: undefined, status: undefined}})
        dataSend = {
          'code_ticket': this.searchData.inputCodeTicket !== undefined ? this.searchData.inputCodeTicket : null,
          'type': this.searchData.selectTypeSos.length === 0 ? [] : this.searchData.selectTypeSos.map(a => a.id),
          'status': this.searchData.selectStatusSos === 0 ? [] : this.searchData.selectStatusSos.map(a => a.id),
          'range_time': this.searchData.selectRangeTimeSos !== undefined ? rangeTimeSend : null,
          region: this.searchData.selectRegionSos,
          'province_creator': this.searchData.selectProvinceSos === 0 ? [] : this.searchData.selectProvinceSos.map(a => a.id),
          'station_handler': this.searchData.selectStationSos === 0 ? [] : this.searchData.selectStationSos.map(a => a.id),
          'creator_id': this.searchData.selectCreatedUserSos === 0 ? [] : this.searchData.selectCreatedUserSos.map(a => a.id),
          'handler_id': this.searchData.selectHandledUserSos === 0 ? [] : this.searchData.selectHandledUserSos.map(a => a.id),
          'hr_tag_ids': this.searchData.hr_tag_ids,
          'limit': this.page.perPage,
          'page': this.page.currentPage
        }
      }
      if (this.searchData.selectRangeDeadLine && this.searchData.selectRangeDeadLine.start) {
        if (!this.searchData.selectRangeDeadLine.end) return commonHelper.showMessage('Thông tin thời gian deadline không hợp lệ', 'warn')
        dataSend.start_deadline = moment(new Date(this.searchData.selectRangeDeadLine.start)).format('YYYY-MM-DD')
        dataSend.end_deadline = moment(new Date(this.searchData.selectRangeDeadLine.end)).format('YYYY-MM-DD')
      }
      if (this.searchData.selectStatusDeadline) dataSend.status_deadline = this.searchData.selectStatusDeadline
      if (this.current_type === 'chart_time') {
        if (typeof rangeTime === 'undefined') return
        dataSend = {
          'range_time': rangeTime,
          'status': status,
          'handler_id': this.infoUserLogin.user_id,
          'limit': this.page.perPage,
          'page': this.page.currentPage
        }
      }
      this.tableTicket.isBusy = true
      sosService.apiGetTickets(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.tableTicket.articlesData = data
            console.log(data)
            this.page.totalItems = response.data.total
            this.tableTicket.count_ignore_tickets = response.data.count_ignore_tickets
          } else {
            this.page.totalItems = response.data.total
            this.tableTicket.count_ignore_tickets = response.data.count_ignore_tickets
            commonHelper.showMessage('Không thể lấy thông tin ticket', 'fail')
            this.tableTicket.articlesData = []
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Không thể lấy thông tin ticket', 'fail')
      }).then(() => {
        this.tableTicket.isBusy = false
      })
    },

    showTel (ticketId) {
      let currentTicket = this.tableTicket.articlesData.find(element => element.ticket_id === ticketId)
      if (currentTicket) {
        currentTicket.ticket_creator_info.tel = currentTicket.ticket_creator_info.tel_origin
      }
    },

    getInfoUserLogin () {
      sosService.apiGetInfoUserLogin().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.infoUserLogin = response.data.data
          } else {
            window.location.href = this.baseUrl
          }
        }
      }).catch(() => {
      }).then(() => {
      })
    },

    async getTags () {
      this.reloadListTag = true
      try {
        const response = await hrTagService.getList({
          scope: 'global',
          table_name: this.tableName
        })
        if (response.data.success) {
          this.globalTags = response.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
              table_name: item.table_name
            }
          })
          this.permissionOnTag = response.data.permissions
        } else {
          this.globalTags = []
        }
      } catch (e) {
        console.log(e.getMessage())
      } finally {
        this.reloadListTag = false
      }
    },

    async onDetach (ticket, tag, ticketIndex, tagIndex) {
      try {
        if (confirm('Bạn có chắc muốn bỏ gắn tag ' + tag.name + ' ?')) {
          const {data} = await hrTagService.detach({
            table_name: this.tableName,
            record_id: ticket.ticket_id,
            hr_tag_id: tag.id
          })

          if (data.success) {
            commonHelper.showMessage(data.message, 'success')
            this.tableTicket.articlesData[ticketIndex].tags.splice(tagIndex, 1)
          } else {
            commonHelper.showMessage(data.message, 'warning')
          }
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      }
    },

    handleHrTagSelected (values) {
      this.searchData.hr_tag_ids = values.map((value) => {
        return value.id
      })
    },

    changeTypeSos (data) {
      this.searchData.inputCodeTicket = data.ticket_id
      this.current_type = 'search'
      this.getTickets()
    },

    reloadPage () {
      window.location.reload()
    },

    attachTagSuccess ({tag}) {
      this.tableTicket.articlesData[this.indexCurrentTicket].tags = this.tableTicket.articlesData[this.indexCurrentTicket].tags || []
      this.tableTicket.articlesData[this.indexCurrentTicket].tags.push(tag)
    }
  },

  mounted () {
    this.fetchTickets()
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>
<style lang="scss" scoped>
    .vc-text-base {
        font-size: inherit;
    }

    .btn-add-tag {
        font-size: 0.894rem;
        padding: 6px 18px;
        color: #069255;
        border: 0;
        background: none;
        &:focus{
            box-shadow: none
        }
        .focus{
            box-shadow: none
        }
    }

    .ticket__title {
        display: flex;
        flex-direction: row;

        .ticket__title__name {
            width: 30%;
        }

        .ticket__tag--wrap {
            width: 70%;
        }
    }

    .tag-manage {
        font-size: 0.894rem;
        padding: 6px 18px;
        color: #069255;
        border: 0;
        background: none;
        &:focus{
            box-shadow: none
        }
        .focus{
            box-shadow: none
        }
    }

    .ticket__tag--wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .ticket__tag {
            margin: 5px;
            color: #fff;
            text-align: center;
            display: inline-block;
            position: relative;
            margin: 5px;

        &:hover .ticket__tag--delete {
          display: block;
        }

        .ticket__tag--name {
            padding: 1px 8px;
            cursor: pointer;
            background-color: #069255;
        }

        .ticket__tag--delete {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          color: #000;
          cursor: pointer;
        }
      }
    }

    .ticket__logs {
        padding: 20px 0 0 0;

        .ticket__logs__title {
            h5 {
              font-weight: bold;
            }
        }

        .ticket__logs__content {
            padding-top: 3px;
            max-height: 150px;
            overflow-y: scroll;
        }
    }

</style>
