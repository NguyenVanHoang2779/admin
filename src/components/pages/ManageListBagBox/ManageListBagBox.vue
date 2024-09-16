<template>
  <div class="pageManageListBagBox">
    <h4>Quản lý bao, hộp &amp; KIT</h4>

    <div v-if="!isReady">
      <b-alert v-if="errorMessage" variant="danger" show>{{errorMessage}}</b-alert>
      <div v-else class="text-center p-3">
        <i class="fa fa-spin fa-spinner" /> Đang tải ...
      </div>
    </div>

    <template v-if="isReady">
      <b-card class="mb-3">
        <b-card-body class="p-0">
          <b-form>
            <b-row>
              <b-col md="6" sm="12">
                <b-form-group label="Tra cứu" label-cols-sm="3" label-align="right">
                  <b-form-radio-group v-model="filters.filterType" :options="filterTypes" v-on:change="changeFilterType" class="pt-2" label-align="right" />
                </b-form-group>

                <b-form-group label="Mã bao" label-cols-sm="3" :class="isFilterByBag ? cssClassForBagFilter : cssClassForIdentifyBagFilter" label-align="right">
                  <b-form-input v-model="filters.bagOrders" :disabled="!(isFilterByBag || isFilterByIdentifyBag)" placeholder="Nhiều mã bao cách nhau bởi dấu(,) hoặc dấu cách" />
                </b-form-group>

                <b-form-group label="Mã hộp" label-cols-sm="3" :class="cssClassForBoxFilter" label-align="right">
                  <b-form-input v-model="filters.erpAlias" :disabled="!isFilterByBox"  placeholder="Nhiều mã hộp cách nhau bởi dấu(,) hoặc dấu cách" />
                </b-form-group>

                <b-form-group label="Mã đơn lẻ" label-cols-sm="3" :class="cssClassForBagFilter" label-align="right">
                  <b-form-input v-model="filters.packageOrders" :disabled="!isFilterByBag"  placeholder="Nhiều mã đơn cách nhau bởi dấu(,) hoặc dấu cách" />
                </b-form-group>

                <b-form-group label="Mã KIT" label-cols-sm="3" :class="cssClassForKitFilter" label-align="right">
                  <b-form-input v-model="filters.kitAlias" :disabled="!isFilterByKit"  placeholder="Nhiều mã KIT cách nhau bởi dấu(,) hoặc dấu cách" />
                </b-form-group>

                <b-form-group label="Thời gian tạo" label-cols-sm="3" label-align="right">
                  <b-input-group class="mb-2 select-datetime">
                    <b-form-input v-model="filters.dateCreatedFrom" type="datetime-local" placeholder="YYYY-MM-DD HH:ii:ss"/>
                    <b-input-group-prepend is-text>đến</b-input-group-prepend>
                    <b-form-input v-model="filters.dateCreatedTo" type="datetime-local" placeholder="YYYY-MM-DD HH:ii:ss"/>
                  </b-input-group>
                </b-form-group>

                <b-form-group label="Người tạo" label-cols-sm="3" label-align="right">
                  <multi-select-user v-model="filters.creator" />
                </b-form-group>

                <b-form-group label="PTVC" label-cols-sm="3" :class="isFilterByBag ? cssClassForBagFilter : cssClassForIdentifyBagFilter" label-align="right">
                  <multi-select-transport-type v-model="filters.transportType" :disabled="!(isFilterByBag || isFilterByIdentifyBag)" />
                </b-form-group>

                <b-form-group label="Loại" label-cols-sm="3" :class="isFilterByBag ? cssClassForBagFilter : cssClassForIdentifyBagFilter" label-align="right">
                  <multi-select-bag-type v-model="filters.bagType" :disabled="!(isFilterByBag || isFilterByIdentifyBag)" :multiple="false" />
                </b-form-group>

                <b-form-group label="Hiển thị" label-cols-sm="3" label-align="right">
                  <b-row>
                    <b-col md="6" sm="12">
                      <b-form-checkbox-group v-if="!isFilterByIdentifyBag" v-model="filters.bagDisplayOptions" :disabled="!isFilterByBag" :options="displayOptions.BAG" stacked />
                      <b-form-checkbox-group v-else v-model="filters.bagDisplayOptions" :disabled="!isFilterByIdentifyBag" :options="displayOptions.BAG_IDENTIFY" stacked />
                    </b-col>
                    <b-col md="6" sm="12">
                      <b-form-checkbox-group v-model="filters.boxDisplayOptions" :disabled="!isFilterByBox || !filters.sourceStation.length" :options="displayOptions.BOX" stacked />
                      <b-form-checkbox-group v-model="filters.kitDisplayOptions" :disabled="!isFilterByKit || !filters.sourceStation.length" :options="displayOptions.KIT" stacked />
                      <i>Lưu ý: Chỉ được áp dụng khi kho nguồn được chọn</i>
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-col>

              <b-col md="6" sm="12">
                <b-form-group label="Kho quản lý" label-cols-sm="3" label-align="right" :hidden="isFilterByKit">
                  <multi-select-station :disabled="!(isFilterByBox || isFilterByIdentifyBag)" v-model="filters.managementStation" />
                </b-form-group>

                <b-form-group label="Kho nguồn" label-cols-sm="3" label-align="right">
                  <multi-select-station v-model="filters.sourceStation" :limit-station="isFilterByKit ? 1 : 9999" />
                </b-form-group>

                <b-form-group label="Kho đích" label-cols-sm="3" label-align="right" :class="isFilterByKit ? 'field-disabled' : ''">
                  <multi-select-station v-model="filters.destinationStation" :disabled="isFilterByKit" />
                </b-form-group>

                <b-form-group label="Kho hiện tại" label-cols-sm="3" label-align="right">
                  <multi-select-station v-model="filters.currentStation" :limit-station="isFilterByKit ? 1 : 9999" />
                </b-form-group>

                <b-form-group label="Trạng thái" label-cols-sm="3" label-align="right" :class="isFilterByKit ? 'field-disabled' : ''">
                  <multi-select-bag-status v-model="filters.bagStatus" v-if="isFilterByBag" />
                  <multi-select-identify-bag-status v-model="filters.identifyBagStatus" v-else-if="isFilterByIdentifyBag" />
                  <multi-select-box-status v-model="filters.boxStatus" v-else :disabled="isFilterByKit" />
                </b-form-group>

                <b-form-group label="Trạng thái chuyển kho" label-cols-sm="3" label-align="right">
                  <multi-select-bag-transfer-status v-model="filters.bagTransferStatus" v-show="isFilterByBag || isFilterByIdentifyBag" />
                  <multi-select-box-transfer-status v-model="filters.boxTransferStatus" v-show="isFilterByBox" />
                  <multi-select-box-transfer-status v-model="filters.kitTransferStatus" v-show="isFilterByKit" />
                </b-form-group>

                <b-form-group label="Xe tải" label-cols-sm="3" label-align="right">
                  <multi-select-truck v-model="filters.truckOrder" />
                </b-form-group>

                <b-form-group label="Kho xuất" label-cols-sm="3" label-align="right" :class="(!(isFilterByBag || isFilterByIdentifyBag) || !filters.truckOrder || !filters.truckOrder.length) ? 'field-disabled' : ''">
                  <multi-select-station v-model="filters.exportedStation" :disabled="!(isFilterByBag || isFilterByIdentifyBag) || !filters.truckOrder || !filters.truckOrder.length"/>
                </b-form-group>

                <b-form-group label="Thời gian xuất" label-cols-sm="3" label-align="right" :class="(!filters.truckOrder || !filters.truckOrder.length) ? 'field-disabled' : ''">
                  <b-input-group class="mb-2 select-datetime">
                    <b-form-input v-model="filters.dateExportedFrom" type="datetime-local" placeholder="YYYY-MM-DD HH:ii:ss" :disabled="!filters.truckOrder || !filters.truckOrder.length" />
                    <b-input-group-prepend is-text>đến</b-input-group-prepend>
                    <b-form-input v-model="filters.dateExportedTo" type="datetime-local" placeholder="YYYY-MM-DD HH:ii:ss" :disabled="!filters.truckOrder || !filters.truckOrder.length" />
                  </b-input-group>

                  <div class="font-italic">
                    <u>Lưu ý:</u>

                    <ul v-if="(isFilterByBag || isFilterByIdentifyBag)">
                      <li><b>Kho xuất</b> và <b>Thời gian xuất</b> chỉ được áp dụng nếu xe tải được chọn.</li>
                      <li><b>Loại</b> là <b>Bao Dteam</b> chỉ được áp dụng khi <b>Kho nguồn</b> hoặc <b>Kho đích</b> hoặc <b>Kho hiện tại</b> được chọn.</li>
                    </ul>

                    <ul v-else>
                      <li><b>Thời gian xuất</b> chỉ được áp dụng nếu xe tải được chọn.</li>
                    </ul>
                  </div>
                </b-form-group>
              </b-col>

              <b-col sm="12" class="text-center">
                <b-button @click="doResetForm" type="button" variant="default" class="mr-1">
                  <i class="fa fa-redo" /> Làm lại
                </b-button>
                <b-button :disabled="loading" @click="doSearch" type="button" variant="primary" class="ml-1 position-relative">
                  <i class="fa" :class="{'fa-search': !loading, 'fa-spin fa-spinner': loading}"/> Tìm kiếm
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-card-body>
      </b-card>

      <div class="form-inline d-flex mb-3">
        <label class="mr-3">Tổng số bản ghi: {{ data.totalItems }}</label>
        <b-pagination class="mb-0 mr-3" style="z-index: 0;" :total-rows="data.totalItems" v-model="data.currentPage" :per-page="data.perPage" v-on:change="onPageChanged"/>
        <span class="text-muted mr-3" v-if="data.totalItems"> Trang {{ data.currentPage }} trên {{ data.totalPages }}</span>
        <b-form-select :disabled="loading" :value="data.perPage" :options="optionsPerPage" v-on:change="onChangedPerPage" />
        <span class="col"></span>
      </div>

      <b-card class="mb-3">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>
                <span v-if="data.isFilteredByBag">Bao</span>
                <span v-else-if="data.isFilteredByIdentifyBag">Bao định danh</span>
                <span v-else-if="data.isFilteredByBox">Hộp</span>
                <span v-else>KIT</span>
              </th>
              <th>Mô tả</th>
              <th>Thời gian tạo</th>
              <th>Người tạo</th>
              <th v-if="data.isFilteredByBag || data.isFilteredByBox">Cân nặng (hệ thống)</th>
              <th v-if="data.isFilteredByBag || data.isFilteredByBox">Xe tải</th>
              <th>Danh sách đơn hàng</th>
              <th>Ghi chú</th>
              <th v-if="!data.isFilteredByBag">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!data.totalItems">
              <td :colspan="(isFilterByBag || isFilterByIdentifyBag) ? 8 : 9">
                <b-alert show dismissible variant="warning">
                  <i class="sidenav-icon ion ion-ios-warning"></i>
                  Không có dữ liệu phù hợp, vui lòng thử lại.
                </b-alert>
              </td>
            </tr>
            <template v-if="data.totalItems">
              <template v-for="(row, rowIndex) in data.items">
                <bag-table-row v-if="data.isFilteredByBag" :key="row.order" :bag="row" :transport-types="masterConfig.transport_type" @openUrlInDialog="openUrlInDialog" />
                <identify-bag-table-row v-else-if="data.isFilteredByIdentifyBag"
                                        :key="rowIndex"
                                        :bag="row"
                                        :currentUser="$store.state.userInfo"
                                        @reportMissingIdentifyBag="reportMissingIdentifyBag"
                                        @reportFoundIdentifyBag="reportFoundIdentifyBag"
                                        @addPrivateNoteForIdentifyBag="addPrivateNoteForIdentifyBag"
                                        @showDialogImg="showDialogImg" />
                <box-empty-box-temp v-else-if="data.isFilteredByBox && !row.box_id" :key="rowIndex" :box="row" />
                <box-table-row v-else-if="data.isFilteredByBox" :key="rowIndex" :box="row" :currentUser="$store.state.userInfo" @reportMissingBox="reportMissingBox" @reportFoundBox="reportFoundBox" @addPrivateNote="addPrivateNote"  @showDialogImg="showDialogImg" />
                <kit-table-row v-else :key="rowIndex" :kit="row" :currentUser="$store.state.userInfo" @reportMissingKit="reportMissingKit" @reportFoundKit="reportFoundKit" @addPrivateNoteForKitParent="addPrivateNoteForKitParent" />
              </template>
            </template>
            </tbody>
          </table>
        </div>
      </b-card>

      <div class="form-inline d-flex mb-3" v-if="data.totalItems.length">
        <label class="mr-3">Tổng số bản ghi: {{ data.totalItems }}</label>
        <b-pagination class="mb-0 mr-3" style="z-index: 0;" :total-rows="data.totalItems" v-model="data.currentPage" :per-page="data.perPage" v-on:change="onPageChanged"/>
        <span class="text-muted mr-3" v-if="data.totalItems"> Trang {{ data.currentPage }} trên {{ data.totalPages }}</span>
        <b-form-select :disabled="loading" v-model="data.perPage" :options="optionsPerPage" v-on:change="onChangedPerPage" />
        <span class="col"></span>
      </div>
    </template>

    <open-url-in-dialog v-model="urlInDialog" />
    <report-missing-box :erp-alias="boxMissing.boxErpAlias" :origin-station="boxMissing.originStation" @changed="onChangedReportMissingBox" />
    <report-found-box :erp-alias="boxFound.boxErpAlias" :origin-station="boxFound.originStation" @changed="onChangedReportFoundBox" />
    <add-private-note-for-box :erp-alias="boxAddPrivateNote.boxErpAlias" :box-id="boxAddPrivateNote.boxId" @changedPrivateNote="onChangedAddPrivateNote" />
    <report-missing-kit :erp-alias="kitMissing.kitErpAlias" :kit-id="kitMissing.kitId" :kit-user-id="kitMissing.kitUserId" :origin-station="kitMissing.originStation" :user-id="parseInt(kitMissing.userId)" @changed="onChangedReportMissingKit" />
    <report-found-kit :erp-alias="kitFound.kitErpAlias" :kit-id="kitFound.kitId" :kit-user-id="kitFound.kitUserId" :origin-station="kitFound.originStation" :user-id="parseInt(kitFound.userId)" @changed="onChangedReportFoundKit" />
    <add-private-note-for-kit :asset-alias="kitAddPrivateNote.kitAssetAlias" :kit-user-id="kitAddPrivateNote.kitUserId" :user-id="parseInt(kitAddPrivateNote.userId)" @changedPrivateNoteKit="onChangedAddPrivateNoteKit" />
    <show-dialog-image :data="dataImage" />
    <report-missing-identify-bag :cycle-identify-bag-id="identifyBagMissing.cycleIdentifyBagId"
                                 :identify-bag-id="identifyBagMissing.identifyBagId"
                                 :bag-erp-alias="identifyBagMissing.bagErpAlias"
                                 :bag-order="identifyBagMissing.bagOrder"
                                 :user-id="identifyBagMissing.userId"
                                 :username="identifyBagMissing.username"
                                 :action="identifyBagMissing.action"
                                 @changed="onChangedReportMissingIdentifyBag" />
    <report-found-identify-bag :cycle-identify-bag-id="identifyBagFound.cycleIdentifyBagId"
                               :identify-bag-id="identifyBagFound.identifyBagId"
                               :bag-erp-alias="identifyBagFound.bagErpAlias"
                               :bag-order="identifyBagFound.bagOrder"
                               :user-id="identifyBagFound.userId"
                               :username="identifyBagFound.username"
                               :action="identifyBagFound.action"
                               @changed="onChangedReportFoundIdentifyBag" />
    <add-private-note-for-identify-bag :cycle-identify-bag-id="identifyBagAddNote.cycleIdentifyBagId"
                                       :identify-bag-id="identifyBagAddNote.identifyBagId"
                                       :bag-erp-alias="identifyBagAddNote.bagErpAlias"
                                       :bag-order="identifyBagAddNote.bagOrder"
                                       :user-id="identifyBagAddNote.userId"
                                       :username="identifyBagAddNote.username"
                                       :action="identifyBagAddNote.action"
                                       @changedPrivateNoteIdentifyBag="onChangedAddPrivateNoteIdentifyBag" />
  </div>
</template>

<script>
import moment from 'moment'
import commonHelper from './../../../infrastructures/helpers/common-helpers'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'
import MultiSelectTransportType from './../../elements/common/MultiSelectTransportType'
import MultiSelectBagType from './../../elements/common/MultiSelectBagType'
import MultiSelectBagStatus from './../../elements/common/MultiSelectBagStatus'
import MultiSelectIdentifyBagStatus from './../../elements/common/MultiSelectIdentifyBagStatus'
import MultiSelectBoxStatus from './../../elements/common/MultiSelectBoxStatus'
import MultiSelectBagTransferStatus from './../../elements/common/MultiSelectBagTransferStatus'
import MultiSelectBoxTransferStatus from './../../elements/common/MultiSelectBoxTransferStatus'
import MultiSelectTruck from './../../elements/common/MultiSelectTruck'
import MultiSelectStation from './../../elements/common/MultiSelectStationV2'
import MultiSelectUser from './../../elements/common/MultiSelectUserV2'
import BagTableRow from './BagTableRow'
import IdentifyBagTableRow from './IdentifyBagTableRow'
import BoxEmptyBoxTemp from './BoxEmptyBoxTemp'
import BoxTableRow from './BoxTableRow'
import OpenUrlInDialog from './OpenUrlInDialog'
import ReportMissingBox from './ReportMissingBox'
import ReportFoundBox from './ReportFoundBox'
import ReportMissingKit from './ReportMissingKit'
import ReportFoundKit from './ReportFoundKit'
import ReportMissingIdentifyBag from './ReportMissingIdentifyBag'
import ReportFoundIdentifyBag from './ReportFoundIdentifyBag'
import GreenBox from '../../../domain/entities/GreenBox'
import AddPrivateNoteForBox from './AddPrivateNoteForBox'
import AddPrivateNoteForKit from './AddPrivateNoteForKit'
import AddPrivateNoteForIdentifyBag from './AddPrivateNoteForIdentifyBag'
import ShowDialogImage from './ShowDialogImage'
import KitTableRow from './KitTableRow.vue'
import Kit from '../../../domain/entities/Kit'
import IdentifyBag from '../../../domain/entities/IdentifyBag'

const TYPE_BAG = 'BAG'
const TYPE_IDENTIFY_BAG = 'IDENTIFY_BAG'
const TYPE_BOX = 'BOX'
const TYPE_KIT = 'KIT'
const DEFAULT_PER_PAGE = 25

// #30660 Khi search với bag_type là DTEAM thì yêu cần phải đi kèm điều kiện kho: [nguồn, hiện tại, đích]
const DTEAM_BAG_ID = 4
const DAYS_FOR_SEARCH = 7

export default {
  name: 'ManageListBagBox',
  components: {
    AddPrivateNoteForBox,
    AddPrivateNoteForKit,
    AddPrivateNoteForIdentifyBag,
    ReportFoundBox,
    ReportMissingBox,
    ReportFoundKit,
    ReportMissingKit,
    ReportMissingIdentifyBag,
    ReportFoundIdentifyBag,
    OpenUrlInDialog,
    BoxEmptyBoxTemp,
    BoxTableRow,
    BagTableRow,
    IdentifyBagTableRow,
    MultiSelectStation,
    MultiSelectTruck,
    MultiSelectBoxTransferStatus,
    MultiSelectBagTransferStatus,
    MultiSelectBoxStatus,
    MultiSelectBagStatus,
    MultiSelectIdentifyBagStatus,
    MultiSelectBagType,
    MultiSelectTransportType,
    MultiSelectUser,
    ShowDialogImage,
    KitTableRow
  },
  data () {
    return {
      displayOptions: {
        BAG: [
          { text: 'Chỉ hiển thị bao chưa xử lý', value: 'filter_only_not_process' },
          { text: 'Chỉ hiển thị bao liên vùng Dteam', value: 'filter_only_lv_dteam' },
          { text: 'Chỉ hiển thị bao xuất nhập liền kề', value: 'filter_only_import_and_export' }
        ],
        BAG_IDENTIFY: [
          { text: 'Chỉ hiển thị bao liên vùng Dteam', value: 'filter_only_lv_dteam' }
        ],
        BOX: [
          { text: 'Chỉ hiển thị hộp đã xuất kho', value: 'show_export_box' },
          { text: 'Chỉ hiển thị hộp ở trong kho', value: 'show_inner_st_box' }
        ],
        KIT: [
          { text: 'Chỉ hiển thị KIT đã xuất khỏi kho', value: 'show_export_kit' },
          { text: 'Chỉ hiển thị KIT ở trong kho', value: 'show_inner_st_kit' }
        ]
      },
      filterTypes: [
        { text: 'Bao hàng', value: TYPE_BAG },
        { text: 'Bao định danh', value: TYPE_IDENTIFY_BAG },
        { text: 'Hộp nhựa', value: TYPE_BOX },
        { text: 'KIT nông sản', value: TYPE_KIT }
      ],
      optionsPerPage: [
        { value: 25, text: '25' },
        { value: 50, text: '50' },
        { value: 75, text: '75' },
        { value: 100, text: '100' }
      ],
      loading: false,
      isReady: false,
      urlInDialog: '',
      errorMessage: '',
      data: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        perPage: DEFAULT_PER_PAGE,
        items: [],
        isFilteredByBox: false,
        isFilteredByIdentifyBag: false,
        isFilteredByBag: true
      },
      masterConfig: {},
      hasDefaultFilter: false,
      boxMissing: {
        boxErpAlias: null,
        originStation: null
      },
      boxAddPrivateNote: {
        boxErpAlias: null,
        boxId: null
      },
      kitAddPrivateNote: {
        kitAssetAlias: null,
        kitUserId: null,
        userId: null
      },
      boxFound: {
        boxErpAlias: null,
        originStation: null
      },
      kitMissing: {
        kitErpAlias: null,
        originStation: null,
        kitId: null,
        kitUserId: null,
        userId: null
      },
      kitFound: {
        kitErpAlias: null,
        originStation: null,
        kitId: null,
        kitUserId: null,
        userId: null
      },
      identifyBagMissing: {
        cycleIdentifyBagId: null,
        identifyBagId: null,
        bagErpAlias: null,
        bagOrder: null,
        userId: null,
        username: null,
        action: null,
        desc: null
      },
      identifyBagFound: {
        cycleIdentifyBagId: null,
        identifyBagId: null,
        bagErpAlias: null,
        bagOrder: null,
        userId: null,
        username: null,
        action: null,
        desc: null
      },
      identifyBagAddNote: {
        cycleIdentifyBagId: null,
        identifyBagId: null,
        bagErpAlias: null,
        bagOrder: null,
        userId: null,
        username: null,
        action: null,
        desc: null
      },
      filters: {
        filterType: TYPE_BAG,
        bagOrders: '',
        erpAlias: '',
        packageOrders: '',
        kitAlias: '',
        dateCreatedFrom: '',
        dateCreatedTo: '',
        creator: [],
        transportType: [],
        bagType: '',
        sourceStation: [],
        destinationStation: [],
        currentStation: [],
        exportedStation: [],
        managementStation: [],
        bagStatus: [],
        identifyBagStatus: [],
        boxStatus: [],
        bagTransferStatus: [],
        boxTransferStatus: [],
        kitTransferStatus: [],
        bagDisplayOptions: [],
        boxDisplayOptions: [],
        kitDisplayOptions: [],
        dateExportedFrom: '',
        dateExportedTo: '',
        truckOrder: '',
        page: 1,
        perPage: DEFAULT_PER_PAGE
      },
      dataImage: {
        url: '',
        action: false
      }
    }
  },
  computed: {
    cssClassForBagFilter () {
      return this.isFilterByBag ? '' : 'field-disabled'
    },
    cssClassForIdentifyBagFilter () {
      return this.isFilterByIdentifyBag ? '' : 'field-disabled'
    },
    cssClassForBoxFilter () {
      return this.isFilterByBox ? '' : 'field-disabled'
    },
    cssClassForKitFilter () {
      return this.isFilterByKit ? '' : 'field-disabled'
    },
    isFilterByBag () {
      return this.filters.filterType === TYPE_BAG
    },
    isFilterByIdentifyBag () {
      return this.filters.filterType === TYPE_IDENTIFY_BAG
    },
    isFilterByBox () {
      return this.filters.filterType === TYPE_BOX
    },
    isFilterByKit () {
      return this.filters.filterType === TYPE_KIT
    }
  },
  async created () {
    await this.getMasterConfig()

    if (this.$route.query.bag_order) {
      this.filters.bagOrders = this.$route.query.bag_order
      this.hasDefaultFilter = true
    }

    if (this.$route.query.pkg_order) {
      this.filters.packageOrders = this.$route.query.pkg_order
      this.hasDefaultFilter = true
    }

    if (this.$route.query.erp_alias) {
      this.filters.erpAlias = this.$route.query.erp_alias
      this.filters.filterType = TYPE_BOX
      this.hasDefaultFilter = true
    }

    if (this.hasDefaultFilter) {
      this.doSearch()
    } else {
      // Đặt mặc định
      this.setDefaultFilters()
    }
  },
  watch: {
    'filters.dateCreatedFrom': {
      handler (newValue) {
        if (!newValue || !this.createDateTimeObject(newValue)) {
          this.filters.dateCreatedFrom = moment().subtract(DAYS_FOR_SEARCH, 'day').format('YYYY-MM-DDTHH:mm:ss')
        }
      }
    },
    '$store.state.userInfo.Station': function (value) {
      if (!this.hasDefaultFilter && value && value.id && !this.filters.currentStation.length) {
        this.filters.currentStation = [value]
      }
    }
  },
  methods: {
    onChangedReportMissingBox ({boxErpAlias, isMissing}) {
      if (isMissing) {
        this.data.items.forEach((box, boxIndex) => {
          if (box.erp_alias === boxErpAlias) {
            box.status = GreenBox.Status.Missing
            this.$set(this.data.items, boxIndex, box)
          }
        })
      }
      this.boxMissing = {
        boxErpAlias: null,
        originStation: null
      }
    },
    onChangedReportFoundBox ({boxErpAlias, isFound}) {
      if (isFound) {
        this.data.items.forEach((box, boxIndex) => {
          if (box.erp_alias === boxErpAlias) {
            box.status = GreenBox.Status.Active
            this.$set(this.data.items, boxIndex, box)
          }
        })
      }
      this.boxFound = {
        boxErpAlias: null,
        originStation: null
      }
    },
    onChangedAddPrivateNote () {
      this.boxAddPrivateNote = {
        boxErpAlias: null,
        boxId: null
      }
    },
    onChangedReportMissingKit ({kitErpAlias, isMissing}) {
      if (isMissing) {
        this.data.items.forEach((kit, kitIndex) => {
          if (kit.asset_alias === kitErpAlias) {
            kit.status = Kit.Status.Missing
            this.$set(this.data.items, kitIndex, kit)
          }
        })
      }
      this.kitMissing = {
        kitErpAlias: null,
        originStation: null,
        kitId: null,
        kitUserId: null,
        userId: this.$store.state.userInfo.User.id
      }
    },
    onChangedReportFoundKit ({kitErpAlias, isFound}) {
      if (isFound) {
        this.data.items.forEach((kit, kitIndex) => {
          if (kit.asset_alias === kitErpAlias) {
            kit.status = Kit.Status.Active
            this.$set(this.data.items, kitIndex, kit)
          }
        })
      }
      this.kitFound = {
        kitErpAlias: null,
        originStation: null,
        kitId: null,
        kitUserId: null,
        userId: this.$store.state.userInfo.User.id
      }
    },
    onChangedAddPrivateNoteKit ({isNoteSuccess}) {
      if (isNoteSuccess) {
        this.loadData()
      }
      this.kitAddPrivateNote = {
        kitAssetAlias: null,
        kitUserId: null,
        userId: this.$store.state.userInfo.User.id
      }
    },
    onChangedReportMissingIdentifyBag ({identifyBagId, isMissing}) {
      if (isMissing) {
        this.data.items.forEach((identifyBag, identifyBagIndex) => {
          if (identifyBag.identify_bag_id === identifyBagId) {
            identifyBag.status = IdentifyBag.Status.Missing
            this.$set(this.data.items, identifyBagIndex, identifyBag)
          }
        })
      }
      this.identifyBagMissing = {
        identifyBagId: null,
        bagErpAlias: null,
        bagOrder: null,
        userId: null,
        username: null,
        action: null,
        desc: null
      }
    },
    onChangedReportFoundIdentifyBag ({identifyBagId, isFound}) {
      if (isFound) {
        this.data.items.forEach((identifyBag, identifyBagIndex) => {
          if (identifyBag.identify_bag_id === identifyBagId) {
            identifyBag.status = IdentifyBag.Status.Active
            this.$set(this.data.items, identifyBagIndex, identifyBag)
          }
        })
      }
      this.identifyBagFound = {
        identifyBagId: null,
        bagErpAlias: null,
        bagOrder: null,
        userId: null,
        username: null,
        action: null,
        desc: null
      }
    },
    onChangedAddPrivateNoteIdentifyBag ({isNoteSuccess}) {
      if (isNoteSuccess) {
        this.loadData()
      }
      this.identifyBagAddNote = {
        identifyBagId: null,
        bagErpAlias: null,
        bagOrder: null,
        userId: null,
        username: null,
        action: null,
        desc: null
      }
    },
    reportMissingBox (box) {
      this.boxMissing = box
    },
    reportFoundBox (box) {
      this.boxFound = box
    },
    addPrivateNote (box) {
      this.boxAddPrivateNote = box
    },
    addPrivateNoteForKitParent (kit) {
      this.kitAddPrivateNote = kit
    },
    reportMissingKit (kit) {
      this.kitMissing = kit
    },
    reportFoundKit (kit) {
      this.kitFound = kit
    },
    reportMissingIdentifyBag (identifyBag) {
      this.identifyBagMissing = identifyBag
    },
    reportFoundIdentifyBag (identifyBag) {
      this.identifyBagFound = identifyBag
    },
    addPrivateNoteForIdentifyBag (identifyBag) {
      this.identifyBagAddNote = identifyBag
    },
    createDateTimeObject (datetimeValue) {
      if (!datetimeValue) {
        return undefined
      }
      const dateObject = new Date(datetimeValue)
      return isNaN(dateObject.getTime()) ? undefined : moment(dateObject)
    },
    setDefaultFilters () {
      this.filters.dateCreatedFrom = moment().subtract(DAYS_FOR_SEARCH, 'day').format('YYYY-MM-DDTHH:mm:ss')

      if (this.$store.state.userInfo.Station) {
        this.filters.currentStation = [this.$store.state.userInfo.Station]
      }
    },
    async getMasterConfig () {
      try {
        this.isReady = false
        this.masterConfig = await manageListBagBoxService.getFilterConfigs()
        this.isReady = true
      } catch (reason) {
        this.errorMessage = reason.toString()
        commonHelper.showMessage(reason.toString(), 'error')
      }
    },
    openUrlInDialog (url) {
      this.urlInDialog = url
    },
    onChangedPerPage (perPage) {
      this.filters.perPage = perPage
      this.loadData()
    },
    onPageChanged (page) {
      this.filters.page = page
      this.loadData()
    },
    doSearch () {
      this.filters.page = 1
      this.loadData()
    },
    getStationIds (stationList) {
      if (!Array.isArray(stationList) || !stationList.length) {
        return undefined
      }
      return stationList.map((station) => Number(station.id))
    },
    parseDateTime (datetimeValue) {
      if (!datetimeValue) {
        return undefined
      }
      const dateObject = new Date(datetimeValue)
      return isNaN(dateObject.getTime()) ? undefined : moment(dateObject).format('YYYY-MM-DD HH:mm:ss')
    },
    doSearchBox () {
      const filters = {
        erp_alias: this.filters.erpAlias || undefined,
        cr_from: this.parseDateTime(this.filters.dateCreatedFrom),
        cr_to: this.parseDateTime(this.filters.dateCreatedTo),
        cuid: this.filters.creator.length ? this.filters.creator.map(item => Number(item.id)) : undefined,
        src_st_id: this.getStationIds(this.filters.sourceStation),
        dst_station_id: this.getStationIds(this.filters.destinationStation),
        cur_station_id: this.getStationIds(this.filters.currentStation),
        management_station_id: this.getStationIds(this.filters.managementStation),
        box_status: this.filters.boxStatus.length ? this.filters.boxStatus : undefined,
        transfer_status: this.filters.boxTransferStatus.length ? this.filters.boxTransferStatus : undefined,
        truck_order: this.filters.truckOrder.length ? this.filters.truckOrder.map(item => Number(item.id)) : undefined,
        exp_from: this.parseDateTime(this.filters.dateExportedFrom),
        exp_to: this.parseDateTime(this.filters.dateExportedTo),
        page: this.filters.page || 1,
        limit: this.filters.perPage
      }

      if (filters.erp_alias) {
        filters.erp_alias = filters.erp_alias.split(/[, ]+/g).map(item => item.trim()).filter(item => !!item)
      }

      // show_export_box/show_inner_st_box
      this.filters.boxDisplayOptions.forEach((optionName) => {
        filters[optionName] = 1
      })

      if (!filters.truck_order) {
        filters.exp_from = undefined
        filters.exp_to = undefined
      }

      if (filters.erp_alias && filters.erp_alias.some(alias => /[^0-9a-z]/i.test(alias))) {
        throw new Error('Mã hộp chỉ được phép bao gồm các ký tự: 0 tới 9 hoặc A tới Z')
      }

      return manageListBagBoxService.searchBox(filters)
    },

    doSearchBag () {
      const filters = {
        bag_order: this.filters.bagOrders || undefined,
        pkg_order: this.filters.packageOrders || undefined,
        cr_from: this.parseDateTime(this.filters.dateCreatedFrom),
        cr_to: this.parseDateTime(this.filters.dateCreatedTo),
        cuid: this.filters.creator.length ? this.filters.creator.map(item => Number(item.id)) : undefined,
        src_st_id: this.getStationIds(this.filters.sourceStation),
        dst_station_id: this.getStationIds(this.filters.destinationStation),
        cur_station_id: this.getStationIds(this.filters.currentStation),
        transport_type: this.filters.transportType.length ? this.filters.transportType : undefined,
        bag_status: this.filters.bagStatus.length ? this.filters.bagStatus : undefined,
        bag_type: this.filters.bagType || undefined,
        transfer_status: this.filters.bagTransferStatus.length ? this.filters.bagTransferStatus : undefined,
        truck_order: this.filters.truckOrder.length ? this.filters.truckOrder.map(item => Number(item.id)) : undefined,
        exp_station_id: this.getStationIds(this.filters.exportedStation),
        exp_from: this.parseDateTime(this.filters.dateExportedFrom),
        exp_to: this.parseDateTime(this.filters.dateExportedTo),
        page: this.filters.page || 1,
        limit: this.filters.perPage
      }

      // filter_only_not_process/filter_only_Lv_dteam/filter_only_import_and_export
      this.filters.bagDisplayOptions.forEach((optionName) => {
        filters[optionName] = 1
      })

      if (filters.bag_order) {
        filters.bag_order = filters.bag_order.split(/[, ]+/g).map(item => item.trim()).filter(item => !!item)
      }

      if (filters.pkg_order) {
        filters.pkg_order = filters.pkg_order.split(/[, ]+/g).map(item => item.trim()).filter(item => !!item)
      }

      if (!filters.truck_order) {
        filters.exp_from = undefined
        filters.exp_to = undefined
        filters.exp_station_id = undefined
      }

      if (filters.bag_type && parseInt(filters.bag_type) === DTEAM_BAG_ID &&
        !(filters.src_st_id || filters.dst_station_id || filters.cur_station_id)
      ) {
        throw new Error('Loại là Bao Dteam chỉ được áp dụng khi Kho nguồn hoặc Kho đích hoặc Kho hiện tại được chọn.')
      }

      return manageListBagBoxService.searchBag(filters)
    },

    doSearchIdentifyBag () {
      const filters = {
        bag_order: this.filters.bagOrders || undefined,
        cr_from: this.parseDateTime(this.filters.dateCreatedFrom),
        cr_to: this.parseDateTime(this.filters.dateCreatedTo),
        cuid: this.filters.creator.length ? this.filters.creator.map(item => Number(item.id)) : undefined,
        src_st_id: this.getStationIds(this.filters.sourceStation),
        dst_station_id: this.getStationIds(this.filters.destinationStation),
        cur_station_id: this.getStationIds(this.filters.currentStation),
        transport_type: this.filters.transportType.length ? this.filters.transportType : undefined,
        identify_bag_status: this.filters.identifyBagStatus.length ? this.filters.identifyBagStatus : undefined,
        bag_type: this.filters.bagType || undefined,
        management_station_id: this.getStationIds(this.filters.managementStation),
        transfer_status: this.filters.bagTransferStatus.length ? this.filters.bagTransferStatus : undefined,
        truck_order: this.filters.truckOrder.length ? this.filters.truckOrder.map(item => Number(item.id)) : undefined,
        exp_station_id: this.getStationIds(this.filters.exportedStation),
        exp_from: this.parseDateTime(this.filters.dateExportedFrom),
        exp_to: this.parseDateTime(this.filters.dateExportedTo),
        page: this.filters.page || 1,
        limit: this.filters.perPage
      }

      // filter_only_not_process/filter_only_Lv_dteam/filter_only_import_and_export
      this.filters.bagDisplayOptions.forEach((optionName) => {
        filters[optionName] = 1
      })

      if (filters.bag_order) {
        filters.bag_order = filters.bag_order.split(/[, ]+/g).map(item => item.trim()).filter(item => !!item)
      }

      if (!filters.truck_order) {
        filters.exp_from = undefined
        filters.exp_to = undefined
        filters.exp_station_id = undefined
      }

      if (filters.bag_type && parseInt(filters.bag_type) === DTEAM_BAG_ID &&
        !(filters.src_st_id || filters.dst_station_id || filters.cur_station_id)
      ) {
        throw new Error('Loại là Bao Dteam chỉ được áp dụng khi Kho nguồn hoặc Kho đích hoặc Kho hiện tại được chọn.')
      }

      return manageListBagBoxService.searchIdentifyBag(filters)
    },

    doSearchKit () {
      const filters = {
        kit_alias: this.filters.kitAlias || undefined,
        cr_from: this.parseDateTime(this.filters.dateCreatedFrom),
        cr_to: this.parseDateTime(this.filters.dateCreatedTo),
        cuid: this.filters.creator.length ? this.filters.creator.map(item => Number(item.id)) : undefined,
        src_st_id: this.getStationIds(this.filters.sourceStation),
        cur_station_id: this.getStationIds(this.filters.currentStation),
        transfer_status: this.filters.kitTransferStatus.length ? this.filters.kitTransferStatus : undefined,
        truck_order: this.filters.truckOrder.length ? this.filters.truckOrder.map(item => Number(item.id)) : undefined,
        exp_from: this.parseDateTime(this.filters.dateExportedFrom),
        exp_to: this.parseDateTime(this.filters.dateExportedTo),
        page: this.filters.page || 1,
        limit: this.filters.perPage
      }

      this.filters.kitDisplayOptions.forEach((optionName) => {
        filters[optionName] = 1
      })

      if (filters.kit_alias) {
        filters.kit_alias = filters.kit_alias.split(/[, ]+/g).map(item => item.trim()).filter(item => !!item)
      }

      if (!filters.truck_order) {
        filters.exp_from = undefined
        filters.exp_to = undefined
      }

      return manageListBagBoxService.searchKit(filters)
    },

    async loadData () {
      this.loading = true
      try {
        let data
        if (this.isFilterByBox) {
          data = await this.doSearchBox()
          this.data.isFilteredByBox = true
          this.data.isFilteredByIdentifyBag = false
          this.data.isFilteredByBag = false
        } else if (this.isFilterByIdentifyBag) {
          data = await this.doSearchIdentifyBag()
          this.data.isFilteredByBox = false
          this.data.isFilteredByIdentifyBag = true
          this.data.isFilteredByBag = false
        } else if (this.isFilterByBag) {
          data = await this.doSearchBag()
          this.data.isFilteredByBox = false
          this.data.isFilteredByIdentifyBag = false
          this.data.isFilteredByBag = true
        } else {
          data = await this.doSearchKit()
          this.data.isFilteredByBox = false
          this.data.isFilteredByIdentifyBag = false
          this.data.isFilteredByBag = false
        }

        if (Object.prototype.toString.call(data) !== '[object Object]') {
          throw new Error('Có lỗi trong quá trình nhận dữ liệu từ máy chủ')
        }

        const totalItems = data.total || data.data.length
        this.data.totalItems = totalItems
        this.data.totalPages = Math.ceil(totalItems / this.data.perPage)
        this.data.currentPage = data.current_page || 1
        this.data.perPage = data.per_page || this.filters.perPage
        this.data.items = Array.isArray(data.data) ? data.data : []
      } catch (reason) {
        commonHelper.showMessage(reason.toString(), 'error')
      } finally {
        this.loading = false
      }
    },
    doResetForm () {
      this.loading = false
      this.filters = {
        ...this.filters,
        ...{
          bagOrders: '',
          erpAlias: '',
          packageOrders: '',
          dateCreatedFrom: '',
          dateCreatedTo: '',
          creator: [],
          transportType: [],
          bagType: '',
          sourceStation: [],
          destinationStation: [],
          currentStation: [],
          bagStatus: [],
          boxStatus: [],
          bagTransferStatus: [],
          boxTransferStatus: [],
          bagDisplayOptions: [],
          boxDisplayOptions: [],
          kitDisplayOptions: [],
          managementStation: [],
          dateExportedFrom: '',
          dateExportedTo: '',
          truckOrder: ''
        }}
      this.setDefaultFilters()
    },
    changeFilterType (filterType) {
      if (filterType === TYPE_KIT) {
        if (this.filters.sourceStation.length > 1) {
          this.filters.sourceStation = []
        }
        if (this.filters.currentStation.length > 1) {
          this.filters.currentStation = []
        }
      }
    },
    showDialogImg (dataModal) {
      this.dataImage = {
        url: dataModal.url,
        showModal: dataModal.showModal
      }
    }
  }
}
</script>

<style lang="scss">
.pageManageListBagBox {
  .col-form-label,
  .custom-control-label {
    transition: color ease 100ms;
  }

  .field-disabled .col-form-label,
  .field-disabled .custom-control-label {
    color: #e2e2e2;
  }
  .select-datetime .input-group-text {
    padding-left: 5px;
    padding-right: 5px;
  }

  .link-item {
    color: #00904a;
  }

  .link-item + .link-item {
    &:before {
      content: ",";
      margin-right: 0.25rem;
      color: #000;
    }
  }
}
</style>
