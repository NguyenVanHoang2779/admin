<template>
  <div class="p-3">
    <div class="row filter pb-2 pl-2 pr-2 justify-content-between input-border">
      <!-- Start Filter -->
      <div class="mb-1 pr-1 input-filter">
        <SingleSelectUser
            class="multiselect-ghtk multiselect-no-horizontal"
            @onChange="op => {filter.user_id = op ? op.id : null}"
            placeholder="Họ tên/username"
        ></SingleSelectUser>
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <input
            class="form-control"
            type="number"
            placeholder="CMND/CCCD"
            v-model="filter.identify_id"
            :disabled="false"
            @input="validateInput(filter, 'identify_id', { length: 12 })"
        />
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <MultiSelectDepartment
            class="multiselect-ghtk multiselect-no-horizontal"
            :department-ids="filter.department"
            :auto-close="true"
            :hide-selected="true"
            placeholder="Bộ phận"
            @handleDepartmentSelected="handleDepartmentSelected"
        />
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <MultiSelectPosition
            class="multiselect-ghtk multiselect-no-horizontal"
            :department-ids="filter.department"
            :position-ids="filter.position"
            :autoClose="true"
            :hideSelected="true"
            placeholder="Vị trí"
            @handlePositionSelected="handlePositionSelected"
        />
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <MultiSelectRegion
            :customClass="'multiselect-ghtk multiselect-no-horizontal'"
            :autoClose="true"
            :hideSelected="true"
            :regions="filter.region ? filter.region : ''"
            @handleSelectedRegion="handleSelectedRegion"
        />
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <MultiSelectProvince
            :customClass="'multiselect-ghtk multiselect-no-horizontal'"
            :province-ids="filter.province"
            :region="filter.region"
            :auto-close="true"
            :hide-select="true"
            @handleProvinceSelected="handleSelectedProvince"
        ></MultiSelectProvince>
      </div>
      <div class="mb-1 pl-1 input-filter">
        <MultiSelectStation
            class="multiselect-ghtk multiselect-no-horizontal"
            :province-ids="filter.province"
            :autoClose="true"
            :hideSelected="true"
            @input="handleStationSelected"
        ></MultiSelectStation>
      </div>
    </div>
    <div class="row filter pb-2 pl-2 pr-2 justify-content-between input-border">
      <div class="mb-1 pr-1 input-filter">
        <input
            class="form-control"
            type="number"
            placeholder="Mã đề xuất"
            v-model="filter.union_offer_code"
            :disabled="false"
            @input="validateInput(filter, 'order_id', { length: 12 })"
        />
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <MultiSelectUnionType
          class="multiselect-ghtk multiselect-no-horizontal"
          @onChange="handleSelectedUnionType"
        ></MultiSelectUnionType>
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <MultiSelectUnionStatus
          class="multiselect-ghtk multiselect-no-horizontal"
          ref="selectStatus"
          @onChangeStatusSelected="handleSelectedStatus"
        ></MultiSelectUnionStatus>
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <SingleSelectUser
            class="multiselect-ghtk multiselect-no-horizontal"
            @onChange="op => {filter.handler_id = op ? op.id : null}"
            placeholder="Người xử lý"
        ></SingleSelectUser>
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <v-date-picker
            v-model="filter.deadline"
            mode="range"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Hạn xử lý', style: 'font-size:14px; line-height: unset', class: 'form-control rounded' }"
            :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="mb-1 pl-1 pr-1 input-filter">
        <v-date-picker
            v-model="filter.created"
            mode="range"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày tạo', style: 'font-size:14px; line-height: unset', class: 'form-control rounded' }"
            :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="text-right input-filter pl-1">
        <button class="btn btn-ghtk rounded w-100" @click="getUnionOffers">Tìm kiếm</button>
      </div>
      <!-- End Filter -->
    </div>
    <!-- list -->
    <div class="table-sticky mh-70 table-data">
      <table class="table table-sm mb-0 bordered" aria-describedby="list union offer">
        <thead>
        <tr class="text-center text-black">
          <th class="w-30"><b>Nhân viên</b></th>
          <th class="border-right border-left"><b>Trạng thái</b></th>
          <th class="w-15"><b>Thao tác</b></th>
        </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading">
        <tr v-for="(unionOffer, index) in unionOffers" :key="index">
          <td class="info p-2">
            <div class="d-flex justify-content-between">
              <div class="profile mt-1 mr-2 mb-1">
                <img
                    class="img-circle image-gallery mt-2 mr-2 mb-2"
                    alt="avatar"
                    :src="unionOffer.user_info.avatar ? unionOffer.user_info.avatar : staffInfo.defaultAvatar"
                />
                <div class="d-inline-block">
                  <div class="text-black member-info font-weight-600">{{ unionOffer.user_info.full_name }} ({{ unionOffer.user_info.username }})</div>
                  <div class="text-black position">{{ unionOffer.user_info.position }} - {{ unionOffer.user_info.station }}</div>
                </div>
              </div>
              <div class="btn-profile m-2">
                <b-dd
                  left variant="outline-ghtk w-100"
                  class="w-100 justify-content-end mb-2"
                  toggle-class="btn-pill btn-sm"
                  dropdown
                  no-caret
                  menuClass="border-radius-3 p-0 border-ghtk overflow-hidden"
                >
                <span slot="button-content" class="w-100">
                  Xem
                </span>
                  <b-dd-item
                    class="action-view border-bottom-ghtk"
                    @click="openUnionOfferInfoModal(unionOffer.data.id)">
                    Xem đề xuất <em class="fas fa-chevron-right float-right"></em>
                  </b-dd-item>
                  <b-dd-item class="action-view" @click="openStaffProfileScreen(unionOffer.user_info.id)">
                    Xem profile <em class="fas fa-chevron-right float-right"></em>
                  </b-dd-item>
                </b-dd>
                <button @click="showStaffContactModal(unionOffer.user_info.full_name, unionOffer.user_info.position, unionOffer.user_info.id)">
                  Gọi
                </button>
              </div>
            </div>
            <h5 class="text-ghtk">Ngày tạo đề xuất: {{ formatDateTime(unionOffer.data.created_at, 'DD/MM/YYYY') }}</h5>
            <div class="d-flex flex-wrap mt-2">
              <h6 class="tag p-1 w-max-content bg-ghtk text-white d-flex justify-content-center align-center text-center mr-2">
                Công đoàn
              </h6>
              <h6
                class="tag p-1 w-max-content text-white d-flex justify-content-center align-center text-center"
                :class="colorTagStatus(unionOffer.data.status)"
              >
                {{ unionOffer.data.status_name }}
              </h6>
            </div>
            <div class="document-union">
              <template>
                <div v-viewer class="position-relative mr-1 d-inline-block">
                  <div class="num-img-extend" :class="unionOffer.data.docs.length > 1 ? '' : 'd-none'">
                    +{{ unionOffer.data.docs.length - 1 }}
                  </div>
                  <template v-for="(document, index) in unionOffer.data.docs">
                    <img
                        :key="index"
                        :class="index < 1 ? 'd-inline-block' : 'd-none'"
                        class="image-document"
                        :src="document.file_url"
                        v-if="checkIfImage(document.file_url)"
                        alt="Hồ sơ"
                    />
                    <div v-else>
                      <b-link
                        @click="openLink(document.file_url)"
                      >
                        <h6><b-badge variant="primary">{{document.file_name}}</b-badge></h6>
                      </b-link>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </td>
          <td class="p-2">
            <h5 class="text-ghtk mt-2 pt-1">CĐ.{{ unionOffer.data.code }} - {{ unionOffer.data.name }}</h5>
            <h5 class="text-black font-weight-500 font-14">Hạn xử lý: {{ formatDateTime(unionOffer.data.deadline, 'HH:mm:ss DD/MM/YYYY') }}</h5>
            <h5 class="text-black font-weight-500 font-14 mb-2">Chi tiết log</h5>
            <UnionLogs :unionOffer="unionOffer.data"></UnionLogs>
          </td>
          <td class="border-left p-2">
            <div class="mt-1 mb-2 d-flex justify-content-center">
              <h5
                @click="showHandlerModal(unionOffer.user_handle)"
                class="text-ghtk bg-transparent border-0 p-0 mt-2 mb-1 cursor-pointer"
              >
                Người xử lý
              </h5>
            </div>
            <div
                class="mt-1"
                v-for="(handler, index) in unionOffer.user_handle"
                :key="index"
                :class="index > 1 ? 'd-none' : 'd-flex'"
            >
              <img
                  class="img-small mr-2"
                  :src="handler.avatar ? handler.avatar : staffInfo.defaultAvatar"
                  alt="avatar"
              />
              <span class="text-black">{{ handler.username }} - {{ handler.station }}</span>
            </div>
            <div class="action d-flex flex-column align-items-center mt-3" v-if="showAction(unionOffer.user_handle)">
              <div v-if="unionOffer.data.status === unionStatus.pending_hr">
                <button
                  @click="changeUnionStatus(unionOffer.data.id, unionOffer.data.type, unionStatus.pending_cb)"
                  class="btn btn-outline-ghtk pt-1 pb-1"
                >
                  HR duyệt
                </button>
              </div>
              <div  v-if="unionOffer.data.status === unionStatus.pending_cb">
                <button
                  @click="changeUnionStatus(unionOffer.data.id, unionOffer.data.type, unionStatus.approved)"
                  class="btn btn-outline-ghtk pt-1 pb-1"
                >
                  C&B duyệt
                </button>
              </div>
              <div v-if="unionOffer.data.status < unionStatus.approved">
                <button class="btn btn-outline-danger pt-1 pb-1" @click="showRejectModal(unionOffer.data.id, unionOffer.data.type)">
                  Từ chối
                </button>
              </div>
            </div>
          </td>
        </tr>
        <!-- no record -->
        <tr v-show="loading">
          <td colspan="3" class="font-weight-bold text-center no-record">
            <div class="my-5"></div>
          </td>
        </tr>
        <tr v-show="!loading && unionOffers.length === 0">
          <td colspan="3" class="font-weight-bold text-center no-record">
            <div class="my-5">Không tìm thấy đề xuất công đoàn !</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- modal -->
    <b-modal hide-footer id="modal-list-union-mp" ref="ultraWide" title="Chi tiết công đoàn" @hidden="reloadPage" modal-class="modal-xxl" centered>
      <table class="table table-hover table-bordered table-sm">
        <thead class="thead-light">
        <tr>
          <th>STT</th>
          <th>Họ và tên</th>
          <th>Chế độ</th>
          <th>Tiền chế độ</th>
          <th>Giấy tờ</th>
          <th>Trạng thái</th>
          <th>Ngày đề xuất</th>
          <th>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(info, index) in listItems" v-bind:key="info.id">
          <td>{{index + 1}}</td>
          <td>{{info.fullname}}</td>
          <td>{{info.desc}}</td>
          <td>{{covertMoney(info.money)}}</td>
          <td>
            <div class="action-btn">
              <b-btn size="sm" variant="outline-ghtk" @click="showModalFile(info.files)"><i class="icon ion-ios-document"></i></b-btn>
            </div>
          </td>
          <td>
            <b-form-select
                size="sm"
                v-model="info.status"
                @change="changeUnionStatus(info, ...arguments)"
                :options="optionStatus"
                >
            </b-form-select>
          </td>
          <td>{{formatDate(info.created)}}</td>
          <td>
            <!-- <div class="action-btn">
              <b-btn v-b-modal.modal-sm @click="openEditModal('edit', info.id, null, $event)" variant="outline-success icon-btn" class="btn-md mb-1" title="Chỉnh sửa người phụ thuộc này">
                <span class="ion ion-md-create"></span>
              </b-btn>
              <b-btn v-b-modal.modal-sm @click="deleteDependant(info)" variant="outline-danger icon-btn" class="btn-md" title="Xóa người phụ thuộc này" :disabled="disableInput">
                <span class="ion ion-md-trash"></span>
              </b-btn>
            </div>  -->
            <div class="action-btn">
              <span>
              <a href="#" @click="openEditModal('edit', info.id, null, $event)">
                Chỉnh sửa
              </a>
              |
              <a href="#" @click="deleteUnionOffer(info, $event)" class="text-danger">
                Xóa
              </a>
              </span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </b-modal>
    <b-modal ref="modal-noti" id="bv-modal-noti" hide-footer>
      <template v-slot:modal-title>
        Thông báo
      </template>
      <div class="d-block text-center">
        <h3>Không tìm thấy dữ liệu</h3>
        <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-noti')">Đóng</b-button>
      </div>
    </b-modal>
    <modal-create-union
      @onCreated="getUnionOffers()"
      :currEditing="currEditing"
      :trigger="triggerEdit"
      :type="typeEdit"
      :staffcode="staffcode"
      :typeUnions="typeUnions"
      :typeUnionOptions="typeUnionOptions"
      :isChangeStaffCode="isChangeStaffCode"
      :unionId="unionModal.id"></modal-create-union>
    <!--Popup từ chối đề xuất-->
    <b-modal
      id="modal-reject-union"
      hide-footer
      title="Từ chối"
      modal-class="modal-reject-union"
    >
      <b-form-group label="Chọn lý do từ chối" v-loading="rejectModalData.isLoading">
        <label slot="label" class="font-14">Chọn lý do từ chối</label>
        <div class="d-inline-flex" v-for="option in rejectModalData.reason">
          <b-form-checkbox
              :disabled="rejectModalData.isReadOnly"
              v-model="rejectModalData.reasonSelected"
              :value=option
              name="check-button"
              class="button-checkbox"
              button
              button-variant="checkbox-outline-ghtk"
          >
            {{ option }}
          </b-form-checkbox>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="col-form-label font-14">Lý do khác:</label>
        <b-form-textarea
            v-model="rejectModalData.reasonOther"
            placeholder="Nhập lý do từ chối đề xuất"
        ></b-form-textarea>
      </b-form-group>
      <div align="center">
        <b-btn variant="ghtk" @click="reject()">
          Xác nhận
        </b-btn>
      </div>
    </b-modal>

    <!--Popup danh sách người xử lý-->
    <b-modal
      id="modal-handler-list"
      hide-footer
      title="Danh sách người xử lý"
      modal-class="modal-handler-list scrollable"
      scrollable
    >
      <div class="d-flex flex-column">
        <div>
          <div class="handler-list p-2" v-for="(handler, index) in handlerModalData.list" :key="index">
            <div class="d-flex align-content-center">
              <img
                class="img-circle img-medium mr-2"
                :src="handler.avatar ? handler.avatar : staffInfo.defaultAvatar"
                alt="avatar"
              />
              <div class="ms-1 d-flex align-items-center">
                <strong class="text-highlight">
                  {{ handler.full_name }} - {{ handler.username }} - {{ handler.position }}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <!--Popup staff contact-->
    <b-modal
      id="modal-staff-contact"
      hide-footer
      title="Gọi nhân viên"
      modal-class="modal-handler-list scrollable"
      size="sm"
    >
      <strong>Nhân viên: </strong><span>{{ this.staffContactInfo.fullName }}</span>
      <br>
      <strong>Vị trí: </strong><span>{{ this.staffContactInfo.position }}</span>
      <br>
      <strong>Số điện thoại: </strong><span>{{ this.staffInfo.phoneNumber }}</span>
      <span v-if="loadingPhone"><em class="fa fa-spin fa-spinner"/></span>
      <div class="d-flex justify-content-center mt-3">
        <b-btn variant="ghtk" @click="$bvModal.hide('modal-staff-contact')">Đóng</b-btn>
      </div>
    </b-modal>

    <!-- paging -->
    <div class="d-flex justify-content-between pt-3">
      <div class="paging mt-1 d-block w-75">
        <div class="col text-left p-0 mt-2">
          <b>
            Bản ghi/ trang
          </b>
          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block" v-model="pageData.perPage" @change="getUnionOffers()">
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <div class="z-0 d-inline-block">
            <b-pagination
                class="paginator-ghtk mb-0"
                size="sm"
                align="left"
                v-model="pageData.currentPage"
                :total-rows="+pageData.totalItems"
                :per-page="+pageData.perPage"
                @change="pageChanged"
            >
            </b-pagination>
          </div>
        </div>
      </div>
      <div>
        <button class="btn btn-ghtk" @click="showCreateUnionModal">
          <em class="ion ion-ios-add"></em> Thêm đề xuất
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {SweetModal, SweetModalTab} from 'sweet-modal-vue'
import ModalQuickUpdateUnion from './ModalQuickUpdateUnion'
import ModalCreateUnion from './ModalCreateUnion'
import MultiSelectUnionStatus from 'components/elements/common/MultiSelectUnionStatus'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import UnionService from 'domain/services/union-service'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import UnionLogs from './UnionLogs.vue'
import Vue from 'vue'
import VueImg from 'v-img'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// mixins
import ExportMixin from 'mixins/ExportMixin'
import SingleSelectUser from 'components/elements/common/SingleSelectUser.vue'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince.vue'
import MultiSelectStation from 'components/elements/common/MultiSelectStation.vue'
import MultiSelectHrTag from 'components/elements/common/MultiSelectHrTag.vue'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition.vue'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment.vue'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion.vue'
import MultiSelectUnionType from 'components/elements/common/MultiSelectUnionType.vue'

// services
import hrmTicketService from 'domain/services/Erp/ticket-service'
import profileService from 'domain/services/profile-service'

// helpers
import commonHelper from 'infrastructures/helpers/common-helpers'
import {mapGetters} from 'vuex'

import positionList from '@/const/positions'

// import moment from 'moment'
Vue.use(VueImg, {
  altAsTitle: true
})
Vue.use(Viewer)

export default {
  name: 'manager-union',

  mixins: [ExportMixin],

  props: ['dataSearchInput'],

  components: {
    MultiSelectUnionType,
    MultiSelectRegion,
    MultiSelectDepartment,
    MultiSelectPosition,
    MultiSelectHrTag,
    MultiSelectStation,
    MultiSelectProvince,
    SingleSelectUser,
    ModalQuickUpdateUnion,
    ModalCreateUnion,
    SweetModal,
    SweetModalTab,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectRegion,
    PerfectScrollbar,
    Viewer,
    MultiSelectUnionStatus,
    UnionLogs
  },
  data () {
    return {
      firstSelectStatus: true,
      unionModal: {
        id: null
      },
      loadingPhone: false,
      loading: false,
      staffcode: null,
      fileChange: false,
      allowEdit: false,
      disableInput: false,
      currEditing: null,
      isChangeStaffCode: true,
      triggerEdit: false,
      typeEdit: '',
      dataChange: false,
      numUserHasDependant: 0,
      typeUnions: [],
      typeUnionOptions: [
        { text: '-- Chọn loại chế độ --', value: null }
      ],
      selected: null,
      pageData: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 10,
        totalRow: 0
      },
      fileDocuments: [],
      fileDocumentSrcs: [],
      dependantId: null,
      dependant: {
        birthplace_province: '',
        birthplace_district: '',
        birthplace_sub_district: ''
      },
      items: [], // mảng dữ liệu chế độ công đoàn cho nhiều master_profile
      singleItem: {}, // dữ liệu về các chế độ công đoàn cho một master profile
      listItems: [], // dữ liệu về các chế độ công đoàn cho một master profile
      striped: false,
      bordered: false,
      borderless: false,
      outlined: false,
      small: false,
      hover: false,
      dark: false,
      fixed: false,
      footClone: false,
      headVariant: null,
      tableVariant: '',
      noCollapse: false,
      dataSearch: {
        provinceId: null,
        stationId: null,
        regionId: null,
        taxIdenNumberPersonalId: null,
        fullnameUsername: null,
        month: null,
        year: null,
        status: null,
        page: null,
        type: null
      },
      optionsYear: [
        { text: '-- Chọn năm --', value: null }
      ],
      optionsMonth: [
        { text: '-- Chọn tháng đăng kí --', value: null },
        { text: 'Tháng 1', value: '1' },
        { text: 'Tháng 2', value: '2' },
        { text: 'Tháng 3', value: '3' },
        { text: 'Tháng 4', value: '4' },
        { text: 'Tháng 5', value: '5' },
        { text: 'Tháng 6', value: '6' },
        { text: 'Tháng 7', value: '7' },
        { text: 'Tháng 8', value: '8' },
        { text: 'Tháng 9', value: '9' },
        { text: 'Tháng 10', value: '10' },
        { text: 'Tháng 11', value: '11' },
        { text: 'Tháng 12', value: '12' }
      ],
      optionStatus: [
        { text: '-- Chọn trạng thái đề xuất --', value: null },
        {text: 'Đang chờ', value: 'pending'},
        {text: 'Thiếu tài liệu', value: 'lack_document'},
        {text: 'Lỗi', value: 'error'},
        {text: 'Thành công', value: 'success'}
      ],
      logs: [],
      editNoteMode: {
        type: 'edit',
        dependant_id: null,
        new_note: null
      },
      notEnoughFile: null,
      filter: {
        region: null,
        province: null,
        station: null,
        user_id: null,
        department: null,
        deadline: null,
        position: null,
        handler_id: null,
        created: null,
        union_offer_code: null,
        identify_id: null,
        status: null,
        union_type: null
      },
      rejectModalData: {
        isLoading: false,
        unionOfferId: null,
        unionType: null,
        reason: [
          'Thiếu hồ sơ',
          'Quá hạn đề xuất',
          'Sai ngày phát sinh chế độ'
        ],
        reasonSelected: null,
        reasonOther: '',
        isReadOnly: false
      },
      staffInfo: {
        defaultAvatar: 'https://cache.giaohangtietkiem.vn/d/b04440d8dc4a05f744f1680ad42ecd1c.jpg?width=450&height=450',
        phoneNumber: ''
      },
      unionOffers: [],
      titleToast: {
        success: 'Thành công',
        error: 'Lỗi',
        warning: 'Cảnh báo'
      },
      unionStatus: {
        pending_hr: 1,
        pending_cb: 2,
        approved: 3,
        rejected: 4
      },
      handlerModalData: {
        list: []
      },
      staffContactInfo: {
        fullName: '',
        position: '',
        phone: ''
      }
    }
  },

  watch: {
    hardFixClassFileInput (typeFile) {

    },

    allowEdit (newValue, oldValue) {
      if (!newValue) {
        // this.fileAdded.fileCmndUser = []
        this.fileAdded.fileCmndDependent = []
        this.fileAdded.fileBirthCertificate = []
        this.fileAdded.fileInabilityToWork = []
        this.fileAdded.fileHousehold = []
        this.fileAdded.fileXNNPTTNCN = []
        this.fileAdded.fileDKNPT = []
        this.fileAdded.fileOther = []
        this.fileAdded.fileAuthority = []
        // this.fileDeleted.fileCmndUser = []
        this.fileDeleted.fileCmndDependent = []
        this.fileDeleted.fileBirthCertificate = []
        this.fileDeleted.fileInabilityToWork = []
        this.fileDeleted.fileHousehold = []
        this.fileDeleted.fileXNNPTTNCN = []
        this.fileDeleted.fileDKNPT = []
        this.fileDeleted.fileOther = []
        this.fileDeleted.fileAuthority = []

        let fileDeletedEl = this.$el.querySelectorAll('.file-deleted')
        for (var i = 0, len = fileDeletedEl.length | 0; i < len; i = i + 1 | 0) {
          fileDeletedEl[i].classList.remove('file-deleted')
        }
        this.$el.querySelector('#topFile').scrollIntoView()
      }
    }
  },

  computed: {
    totalItems () {
      return this.items.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    ...mapGetters({
      curUser: 'userInfo'
    })
  },

  created () {
    this.createYearOption()
    if (!this.typeUnions.length) {
      this.getUnionType()
    }
    if (this.dataSearchInput) {
      this.dataSearch = {...this.dataSearch, ...this.dataSearchInput}
      this.searchUser()
      return
    }
    // Mặc định với vị trí này không lọc status nên call api để lấy data luôn
    if (this.curUser && (parseInt(this.curUser.ErpPosition.id) === positionList.DEPUTY_DIRECTTOR_HR || parseInt(this.curUser.ErpPosition.id) === positionList.DIRECTTOR_HR)) {
      this.getUnionOffers()
      this.firstSelectStatus = false
    }
  },
  mounted () {
    if (this.curUser) {
      this.changeSelectStatus()
    }
  },
  methods: {
    showAction (userHandle) {
      userHandle = JSON.parse(JSON.stringify(userHandle)).map(e => e.id)
      if (
        this.curUser.User.username === 'maitdtt' || this.curUser.User.username === 'oanhntm' ||
        parseInt(this.curUser.ErpPosition.id) === positionList.DEPUTY_DIRECTTOR_HR || parseInt(this.curUser.ErpPosition.id) === positionList.DIRECTTOR_HR ||
        (userHandle && userHandle.length > 0 && userHandle.includes(parseInt(this.curUser.User.id)))
      ) {
        return true
      }
      return false
    },
    changeSelectStatus () {
      // Với position 269, 286 => view all
      // Với maidtt, oanhntm => Chờ C&B duyệt
      // Còn lại Chờ HR duyệt
      if (this.curUser.User.username === 'maitdtt' || this.curUser.User.username === 'oanhntm') {
        this.$refs.selectStatus.handleInput([
          { id: 2, name: 'Chờ C&B duyệt' }
        ])
      } else if (parseInt(this.curUser.ErpPosition.id) !== positionList.DEPUTY_DIRECTTOR_HR && parseInt(this.curUser.ErpPosition.id) !== positionList.DIRECTTOR_HR) {
        this.$refs.selectStatus.handleInput([
          { id: 1, name: 'Chờ HR duyệt' }
        ])
      }
    },
    checkIfImage (link) {
      const imagePattern = /\.(jpg|jpeg|png|gif|bmp|svg)$/i

      return imagePattern.test(link)
    },
    async getPhoneNumberByUserId (userId) {
      this.staffInfo.phoneNumber = ''
      try {
        this.loadingPhone = true
        const data = {
          user_id: userId
        }
        const res = await profileService.getPhoneNumberByUserId(data)
        if (res.data.success) {
          this.staffInfo.phoneNumber = res.data.data.tel || ''
        } else {
          commonHelper.showMessage(res.data.message || 'Không lấy được số điện thoại của user', 'warning')
        }
      } finally {
        this.loadingPhone = false
      }
    },
    openUnionOfferInfoModal (id) {
      this.unionModal.id = id
      this.typeEdit = 'show'
      this.triggerEdit = !this.triggerEdit
      this.$bvModal.show('modal-add-union')
    },
    openStaffProfileScreen (userId) {
      window.open(`/adm/profile/staff/` + userId, '_blank')
    },
    async getUnionOffers () {
      this.loading = true
      const filter = this.convertDataFilter()
      const page = {
        page: this.pageData.currentPage,
        limit: this.pageData.perPage
      }
      const params = {
        ...filter,
        ...page
      }
      try {
        const res = await hrmTicketService.getUnionOffers(params)
        if (res.data.success) {
          this.unionOffers = res.data.data
          this.pageData.totalItems = res.data.total
          this.pageData.totalPages = res.data.last_page
          this.pageData.totalRow = res.data.total
          this.pageData.currentPage = res.data.current_page
          this.pageData.perPage = res.data.per_page
        } else {
          commonHelper.showMessage(res.data.message, 'error', this.titleToast.error)
        }
      } catch (e) {
        commonHelper.showMessage('Không lấy được danh sách đề xuất công đoàn', 'error', this.titleToast.error)
      } finally {
        this.loading = false
      }
    },
    convertDataFilter () {
      const formatDate = 'YYYY-MM-DD'
      let filter = {
        ...this.filter
      }
      filter.department = filter.department ? filter.department.split(',') : null
      filter.position = filter.position ? filter.position.split(',') : null
      filter.region = filter.region ? filter.region.split(',') : null
      filter.province = filter.province ? filter.province.split(',') : null
      filter.station = filter.station ? filter.station.split(',') : null
      filter.union_type = filter.union_type ? filter.union_type.split(',') : null
      filter.status = filter.status ? filter.status.split(',') : null
      if (filter.deadline) {
        filter.deadline_start = commonHelper.formatDate(filter.deadline.start, formatDate)
        filter.deadline_end = commonHelper.formatDate(filter.deadline.end, formatDate)
      }
      if (filter.created) {
        filter.created_start = commonHelper.formatDate(filter.created.start, formatDate)
        filter.created_end = commonHelper.formatDate(filter.created.end, formatDate)
      }
      delete filter.deadline
      delete filter.created

      return filter
    },
    async reject () {
      this.rejectModalData.isLoading = true
      const reasonReject = this.rejectModalData.reasonOther ? this.rejectModalData.reasonSelected + ', ' + this.rejectModalData.reasonOther : this.rejectModalData.reasonSelected
      if (!reasonReject) {
        commonHelper.showMessage('Vui lòng chọn lý do từ chối', 'error', this.titleToast.error)
        this.rejectModalData.isLoading = false
        return
      }
      try {
        const res = await hrmTicketService.changeStatusUnionOffer({
          union_offer_id: this.rejectModalData.unionOfferId,
          status: this.unionStatus.rejected,
          union_type: this.rejectModalData.unionType,
          reason: reasonReject
        })
        if (res.data.success) {
          commonHelper.showMessage('Đã từ chối đề xuất"', 'success', this.titleToast.success)
          this.$bvModal.hide('modal-reject-union')
          this.rejectModalData.unionOfferId = null
          this.rejectModalData.unionType = null
          this.rejectModalData.reasonSelected = null
          this.rejectModalData.reasonOther = ''
          await this.getUnionOffers()
        } else {
          commonHelper.showMessage(res.data.message, 'error', this.titleToast.error)
        }
      } catch (e) {
        commonHelper.showMessage('Không thể từ chối đề xuất công đoàn', 'error', this.titleToast.error)
      } finally {
        this.rejectModalData.isLoading = false
      }
    },
    showHandlerModal (handlers) {
      this.handlerModalData.list = handlers
      this.$bvModal.show('modal-handler-list')
    },
    showRejectModal (id, type) {
      this.rejectModalData.unionOfferId = id
      this.rejectModalData.unionType = type
      this.$bvModal.show('modal-reject-union')
    },
    showStaffContactModal (fullName, position, userId) {
      this.getPhoneNumberByUserId(userId)
      this.staffContactInfo.fullName = fullName
      this.staffContactInfo.position = position
      this.staffContactInfo.phone = this.staffInfo.phoneNumber
      this.$bvModal.show('modal-staff-contact')
    },
    colorTagStatus (status) {
      switch (status) {
        case this.unionStatus.pending_hr:
        case this.unionStatus.pending_cb:
          return 'bg-tag-pending'
        case this.unionStatus.approved:
          return 'bg-tag-approved'
        case this.unionStatus.rejected:
          return 'bg-tag-rejected'
        default:
          return 'bg-tag-status'
      }
    },
    formatDateTime (dateTime, format) {
      return commonHelper.formatDate(dateTime, format)
    },
    showCreateUnionModal () {
      this.typeEdit = 'create'
      this.triggerEdit = !this.triggerEdit
      this.$bvModal.show('modal-add-union')
    },
    showImage (timeString) {
      const viewer = this.$el.querySelector('.doc-img').$viewer
      viewer.show()
    },
    covertMoney (money) {
      return commonHelper.formatMoney(money)
    },
    getUnionType () {
      hrmTicketService.getUnionTypes().then(res => {
        if (res.data.success) {
          this.typeUnions = res.data.data
          if (this.typeUnions.length) {
            let types = []
            this.typeUnions = this.typeUnions.sort((x, y) => {
              let n = +x.type - (+y.type)
              if (n !== 0) {
                return n
              }

              return +x.seniority - (+y.seniority)
            })
            this.typeUnions.forEach(typeUnion => {
              if (types.indexOf(typeUnion.type) === -1) {
                types.push(typeUnion.type)
                this.typeUnionOptions.push({...typeUnion, text: typeUnion.name, value: typeUnion.type})
              }
            })
          }
        }
      }).catch(e => console.error('error getUnionTypes', e))
    },
    createYearOption () {
      let currentYear = new Date().getFullYear()
      for (let i = 0; i < 10; i++) {
        this.optionsYear.push(
          {text: ('Năm ' + (currentYear - i)), value: (currentYear - i)}
        )
      }
    },

    async changeUnionStatus (id, type, status) {
      this.loading = true
      let params = {
        union_offer_id: id,
        union_type: type,
        status: status
      }
      try {
        const res = await hrmTicketService.changeStatusUnionOffer(params)
        if (res.data.success) {
          commonHelper.showMessage('Đã duyệt đề xuất thành công', 'success', this.titleToast.success)
          await this.getUnionOffers()
        } else {
          commonHelper.showMessage(res.data.message, 'warn', this.titleToast.warning)
        }
      } catch (e) {
        commonHelper.showMessage('Không thể duyệt đề xuất công đoàn', 'error', this.titleToast.error)
      } finally {
        this.loading = false
      }
    },

    formatDate (date, justMonth) {
      if (!date) return
      let dat = new Date(date)
      let d = dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate()
      let m = (dat.getMonth() + 1) < 10 ? '0' + (dat.getMonth() + 1) : (dat.getMonth() + 1)
      let y = dat.getFullYear()
      if (justMonth) return (m + '/' + y)
      return (d + '/' + m + '/' + y)
    },

    scrollHandle (evt) {
    },

    handleChange (value) {
      if (value) this.dataChange = value
    },

    countUserHasDependant () {
      UnionService.countUserHasDependant().then(res => {
        if (res.data.success === true) {
          this.numUserHasDependant = res.data.data.countUserHasDependant
        } else {
          commonHelper.showMessage(res.data.message, 'error', this.titleToast.error)
        }
      }).then(() => {
        this.$stopLoading()
      }).catch((e) => {
        commonHelper.showMessage('Không lấy được dữ liệu tổng số người đăng kí NPT', 'error', this.titleToast.error)
        this.$stopLoading()
      })
    },

    pageChanged (page) {
      this.pageData.currentPage = page
      this.getUnionOffers()
    },

    isNumber (evt) {
      evt = (evt) || window.event
      let charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault()
      } else {
        return true
      }
    },

    async getUnionsByMasterProfileId (item, isCurrDetail) {
      let param = {
        id: item.master_profile_id || item.id,
        region_id: item.region_id || '',
        province_id: item.province_id || '',
        station: item.station || ''
      }
      this.singleItem = item
      if (!isCurrDetail) {
        this.listItems = []
      }
      await UnionService.getUnionsByMasterProfileId(param).then(res => {
        if (isCurrDetail) {
          this.listItems = []
        }
        if (res.data.success === true) {
          this.listItems = res.data.data
        } else {
          commonHelper.showMessage(res.data.message, 'warn', this.titleToast.warning)
        }
      }).catch((e) => {
        commonHelper.showMessage('Không lấy được dữ liệu', 'warn', this.titleToast.warning)
      }).then(() => {
        this.$stopLoading()
      })
    },

    showModalFile: function (files) {
      this.fileDocuments = files
      this.fileDocumentSrcs = this.fileDocuments.map(e => e.link_file)
      this.$refs['imageDocs'].show()
    },

    handleSelectedProvince (ops) {
      this.filter.province = ops ? ops.map(item => item.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    handleSelectedRegion (ops) {
      this.filter.region = ops ? ops.map(item => item.id).toString() : ''
    },

    handleSelectedUnionType (ops) {
      this.filter.union_type = ops ? ops.map(item => item.type).toString() : ''
    },

    handleSelectedStatus (ops) {
      this.filter.status = ops ? ops.map(item => item.id).toString() : ''
      if (this.firstSelectStatus) {
        this.getUnionOffers()
        this.firstSelectStatus = false
      }
    },

    searchUser (page, newSearch) {
      this.loading = true
      if (newSearch) {
        this.pageData.currentPage = 1 // Set current page to 1
        this.dataSearch.page = 1
      }
      this.dataSearch.page = page
      UnionService.getUnionOffers(this.dataSearch).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.count
          this.pageData.perPage = response.data.pagination.limit
          this.pageData.totalPages = response.data.pagination.pageCount
          this.pageData.totalRow = response.data.pagination.totalRow
          this.pageData.current = response.data.pagination.page

          this.pageData.count = response.data.pagination.count
          this.items = response.data.data
        } else {
          this.$refs['modal-noti'].show()
        }
      }).finally(_ => {
        this.loading = false
      })
    },

    searchStaff () {
      this.searchUser()
    },

    updateOk () {
      if (this.typeEdit === 'edit') {
        if (this.singleItem.id) {
          this.dataChange = true
          this.getUnionsByMasterProfileId(this.singleItem)
        }
      } else if (this.typeEdit === 'create') {
        this.searchStaff()
      }
    },

    reloadPage () {
      if (this.dataChange) {
        this.searchUser(this.pageData.currentPage)
        this.dataChange = false
      }
      this.singleItem = {}
      this.listItems = []
    },

    deleteUnionOffer (union) {
      if (!confirm('Bạn có chắc chắn muốn xóa đề xuất của ' + union.fullname + ' không ?')) {
        return
      }
      let param = {
        unionId: union.id
      }
      this.$startLoading()
      UnionService.deleteUnionOffer(param)
        .then(res => {
          if (res.data.success) {
            this.dataChange = true
            this.getUnionsByMasterProfileId(union)
            commonHelper.showMessage(res.data.message, 'success', this.titleToast.success)
          } else {
            if (res.data.success === false) commonHelper.showMessage(res.data.message, 'warning', this.titleToast.warning)
            else {
              this.disableInput = true
              commonHelper.showMessage('Bạn không có quyền xóa !', 'warning', this.titleToast.warning)
            }
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra', 'warning', this.titleToast.warning)
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    openEditModal (type, editId, staffcode, event) {
      if (event) event.preventDefault()
      this.currEditing = editId
      this.triggerEdit = !this.triggerEdit
      this.typeEdit = type
      if (staffcode) {
        this.isChangeStaffCode = false
        this.staffcode = staffcode
      } else {
        this.isChangeStaffCode = true
        this.staffcode = null
      }
    },

    showModalNote () {
      this.$refs['modal-note'].show()
    },

    exportUnion () {
      let stringSearch = ''
      for (let key in this.dataSearch) {
        if (this.dataSearch[key] !== null && this.dataSearch[key] !== '' && key !== 'page') {
          stringSearch += (key + '=' + this.dataSearch[key] + '&')
        }
      }
      window.open('/erp/ErpUnionOffer/exportExcelUnions?' + stringSearch, '_blank')
    },

    disableRadioFunction () {
      this.disableInput = true
    },

    setEditFile () {
      this.allowEdit = !this.allowEdit
    },

    reloadChange () {
      this.fileDependant = []
      this.notEnoughFile = null
      if (this.dataChange) {
        this.getUnionsByMasterProfileId(this.singleItem)
      }
      this.allowEdit = false
      this.dataChange = false
    },

    deleteFile (event, typeName, indexFile, uploaded) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.fileDeleted[typeName].push(this.fileDependant[typeName]['files'][indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
        } else {
          let index = this.fileDeleted[typeName].indexOf(this.fileDependant[typeName]['files'][indexFile].id)
          if (index >= 0) {
            this.fileDeleted[typeName].splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.fileAdded[typeName].splice(indexFile, 1)
      }
    },

    formatNames (files) {
      if (files) return `${files.length} files selected`
      return ''
    },

    getUrl (file) {
      return URL.createObjectURL(file)
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    validateInput (ref, field, options) {
      return commonHelper.validValue(ref, field, options)
    },

    handleDepartmentSelected (ops) {
      this.filter.department = ops ? ops.map(item => item.id).toString() : ''
    },

    handlePositionSelected (ops) {
      this.filter.position = ops ? ops.map(item => item.id).toString() : ''
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/components/union.scss';
</style>
