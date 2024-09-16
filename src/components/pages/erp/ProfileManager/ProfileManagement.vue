<template>
  <div class="wrapper profile-management">
    <!-- filter  -->
    <div v-if="!isClosingShift" class="row filter pb-2 justify-content-between input-border">
      <div class="mb-1 col-md-2 input-filter">
        <b-form-input
          placeholder="Username / Họ tên"
          class="rounded placeholder-darkgrey"
          v-model="filter.name"
        ></b-form-input>
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <b-form-input
          placeholder="CMND / Mã profile"
          v-model="filter.code"
          class="rounded placeholder-darkgrey"
        ></b-form-input>
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <single-select-profile-region
          @handleSelectedRegion="handleSelectedRegion"
          :region="filter.region"
          :reset="resetSelectRegion"
          :selectClass="'z-5 multiselect-ghtk multiselect-no-horizontal'">
        </single-select-profile-region>
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <SingleSelectProvince
          :select-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          @handleSelectedProvince="option => filter.province = option ? option.id : null"
          :reset="resetSelectProvince"
        />
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <SingleSelectStation
          :selectClass="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          @handleSelectedStation="option => filter.station = option ? option.id : null"
          placeholder="Chọn kho"
          :reset="resetSelectStation"
        />
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <v-date-picker
          mode="range" v-model="filter.from" locale="vi"
          color="green"
          class="placeholder-contain font-12"
          style="color: #4E5155 !important;"
          :input-props="{ placeholder: 'Khoảng thời gian upload', style: 'color:darkgrey; font-size: 14px;' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <Multiselect
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          v-model="filter.submitStatus"
          :options="submitStatusOptions"
          placeholder="Trạng thái nộp"
          label="name"
          track-by="value"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          <span class="placeholder" slot="placeholder">Trạng thái nộp</span>
        </Multiselect>
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <Multiselect
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          v-model="filter.status"
          :options="statusOptions"
          placeholder="Trạng thái duyệt"
          label="name"
          track-by="value"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          <span class="placeholder" slot="placeholder">Trạng thái duyệt</span>
        </Multiselect>
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <SingleSelectDocumentType
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          @handleSelected="option => filter.document = option ? option.id : null"
          :reset="resetSelectDocument"
        />
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <single-select-department
          @handleSelectedDepartment="handleSelectedDepartment"
          :department-id="filter.department_id"
          :reset="resetSelectDepartment">
        </single-select-department>
      </div>
      <div class="mb-1 col-md-2 input-filter">
        <SingleSelectPosition
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          @handleSelectedPosition="option => filter.position = option ? option.id : null"
          :reset="resetSelectPosition"
        />
      </div>

      <div class="text-right col-md-2 input-filter">
        <button :disabled="loading" class="btn btn-ghtk rounded w-100 font-weight-bold" @click="search()">
          Tìm kiếm
        </button>
      </div>
    </div>
    <!-- content  -->
    <div>
      <!-- Data -->
      <div class="table">
        <table class="table table-bordered table-sm">
          <thead v-if="!isClosingShift">
          <tr class="text-center header-row">
            <th class="profile-col"><b>Nhân viên</b></th>
            <th class="detail-col"><b>Chi tiết hồ sơ</b></th>
            <th class="action-col w-20"><b>Thao tác</b></th>
          </tr>
          </thead>
          <tbody class="position-relative" v-loading="loading">
          <template v-for="(data, index) in list">
            <row-data
              :documents="data.documents"
              :key="index"
              :master-profile="data.master_profile"
              :slideStart="slideStart"
              :permissions="permissions"
              @eventApprove="approveOne"
              @delete="prepareRemove"
              @eventApproveAll="approveAll"
              @eventConfirmRefuseAll="confirmRefuseAll"
              @eventViewPhone="viewPhone"
              @showCicDetail="showCicDetail"
              @eventHaveCicPending="notice('Bạn cần duyệt hồ sơ CIC trước khi duyệt tất cả')"
            />
          </template>
          </tbody>
        </table>
      </div>

      <!-- paging  -->
      <div v-if="!isClosingShift" class="row my-3 align-items-center">
        <div class="col col-md-5 text-left">
          <div v-if="+pagination.total">
          <b>Số người / trang</b>
          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                  v-model="pagination.limit" @change="getList()">
            <option v-for="value in [2, 4, 8, 16]">{{value}}</option>
          </select>
          <div class="z-0 d-inline-block">
            <b-pagination
              class="paginator-ghtk mb-0"
              size="sm"
              align="left"
              v-model="pagination.currentPage"
              :total-rows="pagination.total"
              :per-page="pagination.limit"
              @input="getList(true)"
            >
            </b-pagination>
          </div>
          </div>
        </div>
        <div class="col col-md-7 text-right">
          <b-button class="rounded" variant="ghtk" @click="openAddModal = true">
            <!--          <i class="ion ion-md-add"></i>-->
            + Thêm hồ sơ
          </b-button>
          <!--        <router-link :to="{ name: 'config-type' }" class="blink">-->
          <b-button @click="openLink({ name: 'config-type' })" class="rounded ml-1 mb-1" variant="ghtk">
            Cấu hình danh mục hồ sơ
          </b-button>
          <!--        </router-link>-->
          <!--        <router-link :to="{ name: 'config-position' }" class="blink">-->
          <b-button @click="openLink({ name: 'config-position' })" class="rounded ml-1 mb-1" variant="ghtk">
            Cấu hình hồ sơ nhân sự
          </b-button>
          <!--        </router-link>-->
          <!--        <router-link :to="{ name: 'document-analytic' }" class="blink">-->
          <b-button @click="openLink({ name: 'document-analytic' })" class="rounded ml-1 mb-1" variant="ghtk">
            Thống kê
          </b-button>
          <!--        </router-link>-->
        </div>
      </div>
    </div>
    <!-- modal  -->
    <Upload
      :openModal="openAddModal"
      @done="createDocument"
      @updateOpen="updateOpenAddModal"
      :per-page="pagination.limit"
      :hidePopup="hideUploadPopup"
      :uploading="uploading"
    />

    <b-modal static id="modal-confirm-approve-document-one"
      hide-footer
      :title="curDocument && curDocument.ProfileDocument && +curDocument.ProfileDocument.document_id === 10 && dataUpdate.status ? 'Xác nhận duyệt thông tin người bảo lãnh' : 'Xác nhận duyệt hồ sơ'"
    >
      <div v-if="curDocument && curDocument.ProfileDocument && +curDocument.ProfileDocument.document_id === +13 && dataUpdate.status">
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Họ tên</span>
          <b-input id="input-default" class="rounded" v-model="currentMasterProfile.fullname" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Hồ sơ</span>
          <b-input id="input-default" class="rounded" v-model="curDocument.ErpDocument.name" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Số <span class="text-danger">*</span></span>
          <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.no_number"></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Hạng bằng <span class="text-danger">*</span></span>
          <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.class"></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Ngày bắt đầu <span class="text-danger">*</span></span>
          <v-date-picker
            :popover="{visibility: 'focus'}"
            mode="date"
            v-model="dataUpdate.driverLicense.beginning_date"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày bắt đầu', style: 'font-size: 14px !important; color: #4E5155 !important;'}"
          />
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Ngày kết thúc</span>
          <v-date-picker
            :popover="{visibility: 'focus'}"
            mode="date"
            v-model="dataUpdate.driverLicense.expiry_date"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày kết thúc', style: 'font-size: 14px !important; color: #4E5155 !important;'}"
          />
        </b-form-group>
      </div>
      <FormGuardianInfo
        v-else-if="curDocument && curDocument.ProfileDocument && +curDocument.ProfileDocument.document_id === 10 && dataUpdate.status"
        :guardian="dataUpdate.guardian"
      />
      <VehicleRcInfo
        v-else-if="curDocument && curDocument.ProfileDocument && +curDocument.ProfileDocument.document_id === erpDocument.TYPE_VEHICLE_RC && dataUpdate.status"
        :rc-info="curDocument.ErpVehicleRC" :fullname="currentMasterProfile.fullname" :document-name="curDocument.ErpDocument.name"
      />
<!--      Hồ sơ CIC-->
<!--      <div v-else-if="curDocument && curDocument.ProfileDocument && +curDocument.ProfileDocument.document_id === 58 && dataUpdate.status">-->
<!--        <p>Lịch sử nợ xấu trong 5 năm gần nhất <span class="text-danger">*</span></p>-->
<!--        <b-form-group>-->
<!--          <b-form-radio-group-->
<!--            v-model.number="curDocument.ProfileDocument.bad_debt"-->
<!--            :options="[{ text: 'Có', value: 1 },{ text: 'Không', value: 0 }]"-->
<!--            name="plain-inline"-->
<!--            plain-->
<!--          ></b-form-radio-group>-->
<!--        </b-form-group>-->
<!--        <b-row class="my-1">-->
<!--          <b-col sm="2">-->
<!--            <label class="mt-2">Hạng <span class="text-danger">*</span></label>-->
<!--          </b-col>-->
<!--          <b-col sm="10">-->
<!--            <multiselect-->
<!--              :value="optionLevelCredit.filter((item) => +item.id === +curDocument.ProfileDocument.credit_level)"-->
<!--              @input="curDocument.ProfileDocument.credit_level = $event.id"-->
<!--              placeholder=""-->
<!--              label="name"-->
<!--              track-by="id"-->
<!--              :options="optionLevelCredit"-->
<!--              :multiple="false"-->
<!--              :loading="loading"-->
<!--              :searchable="true"-->
<!--              :internal-search="false"-->
<!--              :close-on-select="true"-->
<!--              :hide-selected="true"-->
<!--              selectLabel=""-->
<!--              selectedLabel=""-->
<!--            ></multiselect>-->
<!--          </b-col>-->
<!--        </b-row>-->
<!--      </div>-->
      <div v-else>
        Bạn có chắc chắn muốn {{ dataUpdate.status ? 'duyệt' : 'từ chối' }} hồ sơ
      </div>
      <div class="text-center mt-3">
        <button
          class="btn btn-ghtk rounded"
          :disabled="updatingStatus"
          @click="execApprove({id: curDocument.ProfileDocument.id, status: dataUpdate.status})"
        >Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-confirm-approve-document-all" hide-footer
             :title="'Xác nhận duyệt hồ sơ'">
      <div>Bạn có chắc chắn muốn {{ dataUpdate.statusAll ? 'duyệt' : 'từ chối' }} tất cả hồ sơ</div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="execApprove()" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-confirm-approve-document-all-driver-license" hide-footer
             :title="'Nhập thông tin Bằng lái xe'">
      <div>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Họ tên</span>
          <b-input id="input-default" class="rounded" v-model="currentMasterProfile.fullname" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Hồ sơ</span>
          <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.document_name" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Số <span class="text-danger">*</span></span>
          <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.no_number"></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Hạng bằng <span class="text-danger">*</span></span>
          <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.class"></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Ngày bắt đầu <span class="text-danger">*</span></span>
          <v-date-picker
            :popover="{visibility: 'focus'}"
            mode="date"
            v-model="dataUpdate.driverLicense.beginning_date"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày bắt đầu', style: 'font-size: 14px !important; color: #4E5155 !important;'}"
          />
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Ngày kết thúc</span>
          <v-date-picker
            :popover="{visibility: 'focus'}"
            mode="date"
            v-model="dataUpdate.driverLicense.expiry_date"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày kết thúc', style: 'font-size: 14px !important; color: #4E5155 !important;'}"
          />
        </b-form-group>
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="confirmDriverLicense()" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-confirm-approve-document-all-guard" hide-footer title="Xác nhận duyệt thông tin người bảo lãnh">
      <FormGuardianInfo :guardian="dataUpdate.guardian" />
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="confirmGuardian()" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-confirm-approve-document-all-vehicle-rc" hide-footer title="Xác nhận duyệt thông tin Giấy chứng nhận đăng ký xe">
      <VehicleRcInfo
        :rc-info="dataUpdate.vehicleRC" :fullname="currentMasterProfile.fullname" :document-name="curDocument.ErpDocument.name"
      />
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="confirmVehicleRC()" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-send-chat" hide-footer title="Xác nhận gửi chat">
      <div>Bạn có chắc chắn muốn gửi chat?</div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="execSendChat()">Gửi chat</button>
      </div>
    </b-modal>

    <b-modal static id="modal-input-refuse-reason-all" header-class="justify-content-center" hide-footer title="Từ chối">
      <b-form-textarea id="input-default" class="rounded" rows="5" v-model.trim="refuseReason" placeholder="Nhập lý do từ chối"></b-form-textarea>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="refuseAll()" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-input-refuse-reason-one" header-class="justify-content-center" hide-footer title="Từ chối">
      <div v-if="curDocument && curDocument.ProfileDocument  && +curDocument.ProfileDocument.document_id === 10">
        <span slot="label" class="font-14">Lý do từ chối/nghi ngờ NBL <span class="text-danger">*</span></span>
        <SelectGuardianReason
          multiple
          v-model="dataUpdate.guardian.bltnds_reason"
          option-type="rejected"
        />
      </div>
      <div v-else>
        <b-form-textarea id="input-default" class="rounded" rows="5" v-model.trim="refuseReason" placeholder="Nhập lý do từ chối"></b-form-textarea>
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="refuseOne(curDocument.ProfileDocument.document_id)" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-input-refuse-reason-all-guardian" hide-footer title="Từ chối">
      <div>
        <span slot="label" class="font-14">Lý do từ chối/nghi ngờ NBL <span class="text-danger">*</span></span>
        <SelectGuardianReason
          multiple
          v-model="dataUpdate.guardian.bltnds_reason"
          option-type="rejected"
        />
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="refuseAllGuardian()" :disabled="updatingStatus">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-input-delete-reason" header-class="justify-content-center" hide-footer title="Xóa">
      <b-form-textarea id="input-default" class="rounded" rows="5" v-model.trim="deleteReason" placeholder="Nhập lý do xóa"></b-form-textarea>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="remove()">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-show-phone" title="Gọi ứng viên" centered ref="phone-number" title-class="w-100" header-class="text-center" hide-footer size="sm">
      <div class="d-block text-start">
        <div><b>Họ tên:</b> {{currentMasterProfile.fullname}}</div>
        <div><b>Vị trí:</b> {{currentMasterProfile.position_name}}</div>
        <div><b>Số điện thoại:</b> {{currentMasterProfile.tel}}</div>
      </div>
      <div class="row mt-3">
        <div class="col text-center">
          <button class="btn btn-ghtk rounded text-white" @click="closeModalPhone()">Đóng</button>
        </div>
      </div>
    </b-modal>

    <modal-approve-cic
      :profile-document-id="currentDocId"
      :user="currentUser"
      @approved="closeModelApproveCic"
      @reConfirm="reConfirmCic"
      :permissionEditCic="permissionEditCic"
    >
    </modal-approve-cic>

    <modal-approve-cic-backup
      :profile-document-id="currentDocId"
      :user="currentUser"
      @approved="closeModelApproveCicBackup"
    >
    </modal-approve-cic-backup>

    <modal-detail-cic
      :profile-document-id="currentDocId"
      :user="currentUser"
    >
    </modal-detail-cic>
    <Notification :message="messageNoti"></Notification>
  </div>
</template>
<script>

import {optionLevelCredit} from './OptionConst'
// custom components
import Multiselect from 'vue-multiselect'
import Upload from './UploadDocument'
import commonHelper from 'infrastructures/helpers/common-helpers'
import DateHelper from 'infrastructures/helpers/date'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import SingleSelectPoiIdentityCard from 'components/elements/common/SingleSelectPoiIdentityCard'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import AnalyticBar from './AnalyticBar'
import SelectGuardianReason from './SelectGuardianReason'
import FormGuardianInfo from './FormGuardianInfo'
import ModalApproveCic from './CicDocument/ModalApproveCic.vue'
import ModalDetailCic from './CicDocument/ModalDetailCic.vue'
import ModalApproveCicBackup from './CicDocument/ModalApproveCicBackup.vue'

// service
import profileService from 'domain/services/profile-mamanger-service'
import driverLicenseService from 'domain/services/driver-license-service'
import ErpDocument from 'domain/entities/ErpDocument'
import RowData from './RowData'
import moment from 'moment'
import Notification from '../common/Notification.vue'
import VehicleRcInfo from './VehicleRCInfo'

export default {
  name: 'profile-management',
  components: {
    VehicleRcInfo,
    Notification,
    ModalDetailCic,
    RowData,
    Multiselect,
    Upload,
    SingleSelectPosition,
    SingleSelectDocumentType,
    SingleSelectStation,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    SingleSelectUser,
    SingleSelectPoiIdentityCard,
    SingleSelectProfileRegion,
    SingleSelectDepartment,
    AnalyticBar,
    SelectGuardianReason,
    FormGuardianInfo,
    ModalApproveCic,
    ModalApproveCicBackup
  },

  props: {
    dataClosingShift: [],
    filterClose: [],
    paginationClose: [],
    isClosingShift: false,
    teamId: null,
    scrollMode: {
      default: false,
      type: Boolean
    },
    permissionsClosShift: null
  },
  watch: {
    dataClosingShift (newVal) {
      this.list = newVal
    },
    permissionsClosShift () {
      if (this.isClosingShift) {
        this.permissionEditCic = this.permissionsClosShift.edit_cic_doc
      }
    }
  },
  data () {
    let a = {
      erpDocument: ErpDocument,
      permissions: null,
      loading: false,
      updatingStatus: false,
      uploading: false,
      paginationLoading: false,
      openAddModal: false,
      list: [],
      datePlaceHolder: null,
      formatedFilter: null,
      pagination: {
        currentPage: 1,
        limit: 2,
        total: 0
      },
      filter: {
        code: null,
        name: null,
        region: null,
        province: null,
        station: null,
        position: null,
        document: null,
        submitStatus: null,
        status: {
          value: 'Chưa duyệt',
          name: 'Chưa duyệt'
        },
        department_id: null,
        // department: null,
        from: null,
        to: null,
        created_by: null
      },
      submitStatusOptions: [
        {
          value: '1',
          name: 'Đủ hồ sơ'
        },
        {
          value: 'overdue',
          name: 'Quá hạn nộp hồ sơ'
        },
        {
          value: '0',
          name: 'Thiếu hồ sơ'
        }
      ],
      statusOptions: [
        {
          value: 'Chưa duyệt',
          name: 'Chưa duyệt'
        },
        {
          value: 'Đã duyệt',
          name: 'Đã duyệt'
        },
        {
          value: 'Từ chối',
          name: 'Từ chối'
        },
        {
          value: 'nearly_expired_profile',
          name: 'Hồ sơ sắp hết hạn'
        }
      ],
      resetSelectDocument: false,
      resetSelectProvince: false,
      resetSelectPosition: false,
      resetSelectDepartment: false,
      resetSelectStation: false,
      resetSelectRegion: false,
      curDocument: {
        ErpDocument: {
          name: null
        }
      },
      dataUpdate: {
        status: true,
        statusAll: null,
        driverLicense: {
          no_number: null,
          class: null,
          beginning_date: null,
          expiry_date: null,
          document_name: null
        },
        vehicleRC: {
          head_license_plate: null,
          tail_license_plate: null
        },
        guardian: {
          status: null,
          fullname: null,
          birthday: null,
          personal_id: null,
          personal_id_date: null,
          personal_id_place: null,
          resident_province: null,
          resident_district: null,
          resident_sub_district: null,
          resident_detail: null,
          current_province: null,
          current_district: null,
          current_sub_district: null,
          current_detail: null,
          relation: null,
          phone: null,
          license_place: null,
          bltnds_reason: null,
          other_info: null,
          note: null
        }
      },
      currentIds: [],
      currentMpId: null,
      currentUserId: null,
      currentPositionId: null,
      isFirstLoad: true,
      refuseReason: '',
      deleteReason: '',
      action: null,
      actionRefuse: 'normal_doc',
      currentDocId: null,
      currentMasterProfile: {
        has_driver_license: false,
        has_guardian: false
      },
      slideStart: null,
      resetRefuseGuardian: null,
      hideUploadPopup: null,
      optionLevelCredit,
      dataCicCurrent: null,
      currentUser: null,
      isPermissionEdit: true,
      messageNoti: '',
      permissionEditCic: false
    }
    if (this.isClosingShift) a.filter = this.filterClose
    if (this.isClosingShift) a.pagination = this.paginationClose
    return a
  },

  mounted () {
    if (!this.dataClosingShift) this.getList()
    if (this.permissions) {
      this.permissionEditCic = this.permissions.edit_cic_doc
    } else if (this.permissionsClosShift) {
      this.permissionEditCic = this.permissionsClosShift.edit_cic_doc
    }
  },

  created () {
    if (this.dataClosingShift) this.list = this.dataClosingShift
    this.setDefaultDateRange()
  },

  methods: {
    async viewPhone (masterProfile) {
      this.currentMasterProfile = masterProfile
      this.$bvModal.show('modal-show-phone')
      await this.getPhoneNumber(masterProfile.user_id)
    },
    async getPhoneNumber (userId) {
      try {
        // this.loading = true
        const {data} = await profileService.getPhoneNumber({
          user_id: userId
        })
        if (data.success) {
          this.currentMasterProfile.tel = data.data.tel
        } else {
          commonHelper.showMessage(data.message)
        }
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        // this.loading = false
      }
    },
    selectPosition (op) {
      if (op) {
        this.filter.position_job = op.id
        this.filter.position_name = op.name
        this.filter.group_id = op.group_id
      } else {
        this.filter.position_job = null
        this.filter.position_name = null
        this.filter.group_id = null
      }
    },
    handleSelectedDepartment (option) {
      this.filter.department_id = option ? option.id : ''
      // this.filter.department = option ? option.name : ''
    },
    handleSelectedRegion (option) {
      this.filter.region = option ? option.id : ''
    },

    refuseAllGuardian () {
      if (!this.dataUpdate.guardian.bltnds_reason) {
        commonHelper.showMessage('Bạn cần nhập lý do từ chối.', 'warning')
        return false
      }
      this.$bvModal.hide('modal-input-refuse-reason-all-guardian')

      let guardDocsCount = this.countGuardianDocs()
      if ((this.currentIds.length - guardDocsCount) > 0) {
        // Nếu profile có thêm loại hồ sơ khác ngoài giấy bảo lãnh
        this.$bvModal.show('modal-input-refuse-reason-all')
      } else {
        this.refuseAll('guardian')
      }
    },
    countGuardianDocs () {
      let currentDocs = this.list[this.currentMpId]['documents']
      let count = 0
      currentDocs.forEach(function (item) {
        if (+item.ProfileDocument.document_id === 10) {
          count++
        }
      })
      return count
    },
    closeModalPhone () {
      this.$bvModal.hide('modal-show-phone')
    },
    setDefaultDateRange () {
      let today = DateHelper.reverseDateFormat(DateHelper.getToday('/'))
      let twoMonthAgo = DateHelper.reverseDateFormat(DateHelper.getCalculatedDate(2, 'MINUS', 'MONTH', '/'))
      this.filter.from = {
        start: new Date(twoMonthAgo),
        end: new Date(today)
      }
    },
    openLink (route) {
      window.open(this.$router.resolve(route).href, '_blank')
    },
    resetFormData () {
      this.refuseReason = ''
      this.deleteReason = ''
      this.action = null
      this.actionRefuse = 'normal_doc'
      this.currentIds = []
      this.currentMpId = null
      this.currentUserId = null
      this.currentPositionId = null
      this.currentDocId = null
      this.dataUpdate.guardian.bltnds_reason = null
    },
    prepareRequestData () {
      this.formatedFilter = {...this.filter}
      if (this.formatedFilter.from) {
        this.formatedFilter.from = {
          start: moment(this.formatedFilter.from.start).format('YYYY-MM-DD'),
          end: moment(this.formatedFilter.from.end).format('YYYY-MM-DD')
        }
      }
    },

    setDataForGuardian (mpId, action = 'approved') {
      commonHelper.resetData(this.dataUpdate.guardian)
      if (!this.list[mpId]['master_profile']['guardian']) return

      this.dataUpdate.guardian = {...this.dataUpdate.guardian, ...commonHelper.cloneDeep(this.list[mpId]['master_profile']['guardian'])}
      if (this.dataUpdate.guardian.birthday) this.dataUpdate.guardian.birthday = new Date(this.dataUpdate.guardian.birthday)
      if (this.dataUpdate.guardian.personal_id_date) this.dataUpdate.guardian.personal_id_date = new Date(this.dataUpdate.guardian.personal_id_date)
      if (action !== this.dataUpdate.guardian.status) this.dataUpdate.guardian.bltnds_reason = null
    },

    setDataForDriverLiense (mpId) {
      let data = this.list[mpId]['master_profile']['ErpDriverLicense']
      let driverLicenseDoc = this.getDriverLicensDocByMpId(mpId)
      this.dataUpdate.driverLicense = {
        beginning_date: data.beginning_date ? new Date(data.beginning_date) : null,
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
        class: data.class,
        no_number: data.no_number,
        document_name: driverLicenseDoc['ErpDocument']['name']
      }
    },

    setDataForVehicleRC (mpId) {
      let documents = this.list[mpId]['documents']
      for (let i = 0; i < documents.length; i++) {
        if (+documents[i].ProfileDocument.document_id === ErpDocument.TYPE_VEHICLE_RC) {
          this.dataUpdate.vehicleRC = documents[i].ErpVehicleRC
          this.curDocument = documents[i]
          break
        }
      }
    },

    getDriverLicensDocByMpId (mpId) {
      let documents = this.list[mpId]['documents']
      let driverLicenseDoc = {}
      documents.forEach(function (doc) {
        if (+doc['ProfileDocument']['document_id'] === 13) {
          driverLicenseDoc = doc
        }
      })
      return driverLicenseDoc
    },
    async search () {
      this.resetPagination()
      await this.getList()
    },
    async getList (isChangingPage = false) {
      try {
        this.prepareRequestData()
        if (commonHelper.isEmpty(this.filter.code)) this.filter.code = null
        if (commonHelper.isEmpty(this.filter.name)) this.filter.name = null
        this.loading = true
        const {data} = await profileService.getDocuments({
          team_id: this.teamId,
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.formatedFilter
        })
        if (data.success) {
          this.list = data.data.list
          this.permissions = data.permissions
          this.permissionEditCic = this.permissions.edit_cic_doc
          this.pagination.total = data.data.totalUsers
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    notice (message) {
      this.messageNoti = message
      this.$bvModal.show('modal-noti')
    },
    async getCount () {
      try {
        this.prepareRequestData()
        this.paginationLoading = true
        const {data} = await profileService.getDocuments({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.formatedFilter,
          isCount: true
        })
        this.pagination.total = data.data.totalUsers
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.paginationLoading = false
      }
    },
    updateOpenAddModal (v) {
      this.openAddModal = v
    },
    async createDocument (formData) {
      try {
        this.slideStart = null
        this.hideUploadPopup = null
        this.uploading = true
        const {data} = await profileService.createDocument(formData)
        this.uploading = false
        if (data.success) {
          this.slideStart = 0
          this.hideUploadPopup = true
          this.setDefaultDateRange()
          this.filter.status = {
            value: 'Chưa duyệt',
            name: 'Chưa duyệt'
          }
          commonHelper.showMessage('Thêm hồ sơ thành công', 'success')
          this.list = data.data.list
          this.openAddModal = false
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      }
    },

    // Duyệt tất cả hồ sơ của 1 master profile
    approveAll (data) {
      this.currentMasterProfile = data.currentMasterProfile
      this.currentIds = data.currentIds
      this.dataUpdate.statusAll = data.statusAll
      this.dataUpdate.status = data.status

      if (this.currentMasterProfile['has_driver_license']) {
        // Lấy thông tin bằng lái xe nêu hồ sơ có bằng lái xe
        this.setDataForDriverLiense(this.currentMasterProfile['master_profile_id'])
      }

      this.setDataForVehicleRC(this.currentMasterProfile['master_profile_id'])
      // Lấy thông tin người bảo lãnh nếu hồ sơ có hồ sơ bảo lãnh
      this.setDataForGuardian(this.currentMasterProfile['master_profile_id'], 'approved')

      if (this.currentMasterProfile['has_driver_license']) {
        // Nếu có Bằng lái xe thì bật popup nhập thông tin Bằng lái
        this.$bvModal.show('modal-confirm-approve-document-all-driver-license')
      } else if (this.currentMasterProfile['has_guardian']) {
        // Nếu ko có Bằng lái nhưng có Người bảo lãnh thì bật popup nhập thông tin người bảo lãnh
        this.$bvModal.show('modal-confirm-approve-document-all-guard')
      } else if (this.currentMasterProfile['has_vehicle_rc']) {
        // Nếu không có Bằng lái xe và người bảo lãnh thì bật popup nhập thông tin Giấy chứng nhận đăng ký xe
        this.$bvModal.show('modal-confirm-approve-document-all-vehicle-rc')
      } else if (this.currentMasterProfile['has_cic']) {
        for (let i = 0; i < data.curDocument.length; i++) {
          if (+data.curDocument[i].ProfileDocument.document_id === 58) {
            this.curDocument = data.curDocument[i]
          }
        }
        this.$bvModal.show('modal-confirm-approve-document-all-cic')
      } else {
        // Nếu chỉ có hồ sơ thường thì bật popup confirm
        this.$bvModal.show('modal-confirm-approve-document-all')
      }
    },

    confirmDriverLicense () {
      if (this.currentMasterProfile['has_guardian']) {
        this.$bvModal.show('modal-confirm-approve-document-all-guard')
      } else if (this.currentMasterProfile['has_vehicle_rc']) {
        this.$bvModal.show('modal-confirm-approve-document-all-vehicle-rc')
      } else {
        this.execApprove()
      }
    },

    confirmGuardian () {
      if (this.currentMasterProfile['has_vehicle_rc']) {
        this.$bvModal.show('modal-confirm-approve-document-all-vehicle-rc')
      } else {
        this.execApprove()
      }
    },

    confirmVehicleRC () {
      this.execApprove()
    },

    confirmCic () {
      this.$bvModal.hide('modal-confirm-approve-document-cic')
      // this.execApprove()
    },

    // Duyệt/từ chối hồ sơ riêng lẻ
    approveOne (doc) {
      this.curDocument = doc.doc
      this.dataUpdate.status = doc.status
      this.currentDocId = doc.doc.ProfileDocument.id
      if (!doc.status) {
        this.action = 'document_refused'
        this.currentMpId = this.currentMasterProfile.master_profile_id
        this.currentUserId = this.currentMasterProfile.user_id
      }
      // Lấy thông tin bằng lái xe nếu có
      if (+doc.doc.ProfileDocument.document_id === 13) {
        // this.getDriverLiense(doc.doc.ProfileDocument.master_profile_id)
        this.setDataForDriverLiense(doc.doc.ProfileDocument.master_profile_id)
      }
      // Set data cho giấy chứng nhận đăng ký xe
      if (+doc.doc.ProfileDocument.document_id === ErpDocument.TYPE_VEHICLE_RC) {
        // this.getDriverLiense(doc.doc.ProfileDocument.master_profile_id)
        this.dataUpdate.vehicleRC = this.curDocument.ErpVehicleRC
      }
      // Lấy thông tin người bảo lãnh nếu hồ sơ là hồ sơ bảo lãnh
      if (+doc.doc.ProfileDocument.document_id === 10) {
        this.setDataForGuardian(doc.doc.ProfileDocument.master_profile_id, doc.status ? 'approved' : 'rejected')
      }
      if (!doc.status) { // Nhập lý do từ chối
        this.$bvModal.show('modal-input-refuse-reason-one')
      } else { // Duyệt
        if (+doc.doc.ProfileDocument.document_id === 58) {
          this.currentUser = this.currentMasterProfile
          this.$bvModal.show('modal-approve-cic')
        } else {
          this.$bvModal.show('modal-confirm-approve-document-one')
        }
      }
    },

    refuseOne (documentTypeId = null) {
      if (+documentTypeId === 10) {
        if (!this.dataUpdate.guardian.bltnds_reason) {
          commonHelper.showMessage('Bạn cần nhập lý do từ chối.', 'warning')
          return false
        }
      } else {
        if (!this.refuseReason) {
          commonHelper.showMessage('Bạn cần nhập lý do từ chối.', 'warning')
          return false
        }
      }
      this.dataUpdate.statusAll = false
      this.currentIds = [this.currentDocId]
      // Send chat
      this.execSendChat()

      this.runExecApprove()
    },

    async execApprove (docData = false) {
      // docData !== false -> Duyệt/từ chối riêng lẻ
      if (this.dataUpdate.statusAll === false) { // Từ chối tất cả - Tắt popup nhập lý do

      } else { // Duyệt/Từ chối/Duyệt tất cả
        if (docData !== false) { // Duyệt/từ chối đơn lẻ
          this.currentIds = [docData.id]
        }
        this.runExecApprove()
      }
    },

    async runExecApprove () {
      try {
        this.slideStart = null
        this.prepareRequestData()
        this.loading = true
        let status = this.dataUpdate.status || this.dataUpdate.statusAll
        let query = {
          page: 1,
          limit: this.pagination.limit * this.pagination.currentPage,
          ...this.formatedFilter
        }
        if (this.teamId) query.team_id = this.teamId
        this.updatingStatus = true
        const {data} = await profileService.approveDocument({
          info: {id: this.currentIds, status: status, reason: this.refuseReason},
          dataUpdate: this.dataUpdate,
          query: query,
          curDocument: this.curDocument
        })
        this.updatingStatus = false
        if (data.success) {
          this.slideStart = 0
          this.resetFormData()
          commonHelper.showMessage('Duyệt hồ sơ thành công', 'success')
          this.list = data.data.list
          this.pagination.total = data.data.totalUsers
          this.$bvModal.hide('modal-input-refuse-reason-one')
          this.$bvModal.hide('modal-input-refuse-reason-all')
          this.$bvModal.hide('modal-confirm-approve-document-one')
          this.$bvModal.hide('modal-confirm-approve-document-all')
          this.$bvModal.hide('modal-confirm-approve-document-all-guard')
          this.$bvModal.hide('modal-confirm-approve-document-all-vehicle-rc')
          this.$bvModal.hide('modal-confirm-approve-document-all-driver-license')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },

    confirmRefuseAll (data) {
      this.currentIds = data.currentIds
      this.dataUpdate.statusAll = data.statusAll
      this.dataUpdate.status = data.status
      this.currentMpId = data.masterProfileId
      this.currentMasterProfile = data.currentMasterProfile
      this.currentUserId = data.userId
      this.action = data.action

      // Bật popup nhập lý do
      if (this.currentMasterProfile['has_guardian']) { // Bật popup nhập lý do nếu master profile có hồ sơ bảo lãnh
        this.setDataForGuardian(data.masterProfileId, 'rejected')
        this.$bvModal.show('modal-input-refuse-reason-all-guardian')
      } else {
        this.$bvModal.show('modal-input-refuse-reason-all')
      }
    },
    refuseAll (type = '') {
      if (type !== 'guardian' && !this.refuseReason) {
        commonHelper.showMessage('Bạn cần nhập lý do từ chối', 'warning')
        return false
      }
      // Send chat
      this.execSendChat()
      // Từ chối tất cả
      this.runExecApprove()
    },
    async execSendChat () {
      try {
        const {data} = await profileService.sendChat({
          action: this.action,
          user_id: this.currentUserId,
          master_profile_id: this.currentMpId,
          position_id: this.currentPositionId,
          reason: this.refuseReason,
          reason_guardian: this.dataUpdate.guardian.bltnds_reason,
          deleteReason: this.deleteReason,
          doc_ids: this.currentIds
        })
        if (data.success) {
          commonHelper.showMessage('Gửi chat thành công.', 'success')
        } else {
          commonHelper.showMessage('Gửi chat không thành công.', 'error')
        }
      } catch (e) {
        commonHelper.showMessage('Gửi chat không thành công.', 'error')
      } finally {
      }
      this.$bvModal.hide('modal-send-chat')
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 2,
        total: 0
      }
    },
    prepareRemove (id) { // Nhập lý do xóa
      this.currentDocId = id
      this.$bvModal.show('modal-input-delete-reason')
    },

    remove () {
      if (!this.deleteReason) {
        commonHelper.showMessage('Bạn cần nhập lý do xóa.', 'warning')
        return false
      }
      this.currentIds = [this.currentDocId]
      this.action = 'document_deleted'
      this.currentMpId = this.currentMasterProfile.master_profile_id
      this.currentUserId = this.currentMasterProfile.user_id
      // Send chat
      this.execSendChat()
      this.execRemove(this.currentDocId)
    },

    getDriverLiense (masterProfileId) {
      this.$startLoading()
      driverLicenseService.getDriverLicenseOfProfile({master_profile_id: masterProfileId})
        .then(res => {
          if (res.data.success) {
            this.dataUpdate.driverLicense.no_number = res.data.data.no_number
            this.dataUpdate.driverLicense.class = res.data.data.class
            this.dataUpdate.driverLicense.expiry_date = res.data.data.expiry_date ? new Date(res.data.data.expiry_date) : null
            this.dataUpdate.driverLicense.beginning_date = res.data.data.beginning_date ? new Date(res.data.data.beginning_date) : null
          } else {
            commonHelper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin bằng lái xe !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    async execRemove (id) {
      try {
        this.slideStart = null
        this.prepareRequestData()
        this.loading = true
        let deleteReason = this.deleteReason
        let query = {
          page: 1,
          limit: this.pagination.limit * this.pagination.currentPage,
          ...this.formatedFilter
        }
        if (this.teamId) query.team_id = this.teamId
        const {data} = await profileService.removeDocument({
          id,
          deleteReason,
          query: query
        })

        if (data.success) {
          this.slideStart = 0
          this.resetFormData()
          commonHelper.showMessage('Xóa hồ sơ thành công', 'success')
          this.list = data.data.list
          this.pagination.total = data.data.totalUsers
          this.$bvModal.hide('modal-input-delete-reason')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    closeModelApproveCic () {
      this.$bvModal.hide('modal-approve-cic')
      this.getList()
    },

    closeModelApproveCicBackup () {
      this.$bvModal.hide('modal-approve-cic-backup')
      this.getList()
    },

    showCicDetail ({doc, masterProfile}) {
      this.curDocument = doc
      this.currentDocId = doc.ProfileDocument.id
      this.currentUser = masterProfile
      this.$bvModal.show('modal-detail-cic')
    },

    reConfirmCic () {
      this.$bvModal.show('modal-approve-cic-backup')
    }
  }
}
</script>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped lang="scss">
.placeholder-darkgrey::placeholder {
  color: darkgrey !important;
}
.scroll-mode {
  max-height: 65vh;
  overflow: auto;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #28a745;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

.top {
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.row{
  &-custom{
    margin-top: 10px;
  }
  &-last {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }
}
.custom-btn{
  &-filter{
    margin-left: 5px;
    margin-right: 5px;
  }
  &-group{
    display: flex;
    justify-content: flex-end;
  }
}
.custom-pagination{
  margin-top: 2vh;
}
.main{
  margin-top: 2vh;
}

.row-last{
  display: flex;
  align-items: center;
}
.filter {
  padding: 0 0.5rem 0 0.5rem;
}
.input-filter {
  width: 20%;
  padding: 0 0.25rem;
}

.profile-management {
  .profile-col {
    width: 28%;
  }
  .detail-col {
    width: 60%;
  }
}
.table-documents {
  max-height: 600px;
}
input.is-danger, .help.is-danger {
  border-color: #E0B4B4 !important;
  color: #9F3A38 !important;
  box-shadow: none !important;
}
</style>
