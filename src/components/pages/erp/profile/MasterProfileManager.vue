<template>
  <div class="small-scrollbar">
    <div>
      <b-row class="align-items-center">
        <b-col md="4"><h4 class="m-0">Profile chính của nhân viên</h4></b-col>
        <b-col class="text-right" md="8">
          <div>
            <b-btn type="button" variant="ghtk" @click="searchProfile()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
            <b-btn variant="ghtk" @click="resetSearch()"><i class="sidenav-icon fas fa-eraser"></i> Xóa lọc</b-btn>
            <span v-if="checkPermissionExportAllPage()">
              <b-btn v-if="exporting" variant="ghtk" class="exporting-btn">
                <span>
                  <div class="sk-folding-cube sk-primary">
                    <div class="sk-cube1 sk-cube"></div>
                    <div class="sk-cube2 sk-cube"></div>
                    <div class="sk-cube4 sk-cube"></div>
                    <div class="sk-cube3 sk-cube"></div>
                  </div>
                  Đang xuất...</span>
              </b-btn>
              <div class="d-inline-block" v-else-if="exported" @click="setDownloaded">
                <b-btn variant="ghtk" :href="URLExportedFile" target="blank">
                  <i class="ion ion-md-download"></i> Tải xuống
                </b-btn>
              </div>
              <b-btn v-else variant="ghtk" @click="showExportModal">
                <i class="ion ion-md-print"></i> Xuất dữ liệu
              </b-btn>
            </span>
            <button v-if="isShowAvatar" class="btn btn-ghtk" @click="showColAvatar">
              <i class="ion ion-md-print"></i> In Thẻ
            </button>
            <button v-else class="btn btn-danger" @click="printAvatar">
              <i class="ion ion-md-print"></i> In Thẻ
            </button>
            <!-- In Giấy xác nhận -->
            <button class="btn btn-ghtk" @click="$bvModal.show('modal-preview-print-info')">
              <i class="ion ion-md-print"></i> In giấy xác nhận
            </button>
          </div>
        </b-col>
      </b-row>
      <div class="seperate-xs my-1"></div>
      <div class="mb-2">
        <b-row>
          <b-col md="2">
            <input placeholder="CMND" v-model="cmnd" type="number" min="9" max="12" @keyup.enter="searchProfile" class="form-control"/>
          </b-col>
          <b-col md="2">
            <input placeholder="Mã Profile" v-model="staffCode" type="number" min="9" max="12" @keyup.enter="searchProfile" class="form-control"/>
          </b-col>
          <b-col md="2">
            <input type="text" placeholder="username" v-model="username" @keyup.enter="searchProfile" class="form-control" />
          </b-col>
          <b-col md="2">
            <input type="text" placeholder="Họ tên" v-model="fullName" @keyup.enter="searchProfile" class="form-control" />
          </b-col>
          <b-col md="2" class="mb-2">
            <input type="text" placeholder="Mã COD" v-model="codAlias" @keyup.enter="searchProfile" class="form-control" />
          </b-col>
          <b-col md="2">
            <input type="number" placeholder="SĐT" v-model="phoneNumber" @keyup.enter="searchProfile" class="form-control" />
          </b-col>
          <b-col md="2">
            <multi-select-region :regions="regions ? regions.toString() : ''" @handleSelectedRegion="handleSelectedRegion"></multi-select-region>
          </b-col>
          <b-col md="2">
            <multi-select-province :province-ids="provinceIds" @handleProvinceSelected="handleProvinceSelected"></multi-select-province>
          </b-col>
          <b-col md="2">
            <multi-select-station :province-ids="provinceIds" :station-ids="stationIds" @handleStationSelected="handleStationSelected"></multi-select-station>
          </b-col>
          <b-col md="2">
            <multi-select-department :department-ids="departmentIds" @handleDepartmentSelected="handleDepartmentSelected"></multi-select-department>
          </b-col>
          <b-col md="2" class="mb-2">
            <multi-select-position :position-ids="positionIds" @handlePositionSelected="handlePositionSelected" :department-ids="departmentIds"></multi-select-position>
          </b-col>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="cnbConfirmStatus" :options="cnbConfirmStatusOptions"></b-form-select>
          </b-col>
          <b-col md="2" class="mb-2">
            <select-profile-status
              @change="selectProfileStatus"
              :multiple="true"
              :status="status"
            ></select-profile-status>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2" class="mb-2">
            <b-form-select v-model="range_time_filter" :options="range_time_filter_options"></b-form-select >
          </b-col>
          <b-col md="2" class="mb-2">
            <v-date-picker mode="range" v-model="range_time" locale="vi" :popover="{visibility: 'focus'}"
                           color="green"
                           :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'font-size:14px; line-height: unset' }"
                           @keyup.enter="search"/>
          </b-col>
          <b-col md="2" class="text-left">
            <div>
              <single-select-gender
              :gender="gender"
              @handleSelectedGender="handleSelectedGender"
            >
            </single-select-gender>
            </div>
          </b-col>
          <b-col md="2">
            <b-form-select
              v-model="resignReason"
              :options="resignReasonOptions"
            ></b-form-select>
          </b-col>
          <b-col md="2">
<!--            <select-contract-type-->
<!--              :contract-type="contractType"-->
<!--              @input="handleSelectedContractType"-->
<!--            ></select-contract-type>-->
          </b-col>
          <b-col md="2">
<!--            <single-select-duty-->
<!--              @handleSelected="handleSelectedDuty"-->
<!--              :duty-id="duty_id"-->
<!--            >-->
<!--            </single-select-duty>-->
          </b-col>
          <b-col md="4" class="text-right">
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <div class="paging mt-3 mx-3">
          <div class="z-0 d-inline-block">
            <b-pagination
              class="mb-1"
              size="sm"
              align="left"
              v-model="currentPage"
              :total-rows="totalItems"
              :per-page="perPage"
              @input="search"
            >
            </b-pagination>
          </div>
          <b class="float-right">Trang {{ currentPage }}/{{ totalPages }}</b>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body>
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re">
              <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Họ và tên</th>
                <th>CMND</th>
                <th>username</th>
                <th>Vị trí</th>
                <th>Loại hình làm việc</th>
                <th>Kho</th>
                <th>Trạng thái làm việc</th>
                <th>Trạng thái hồ sơ</th>
                <th>Action</th>
                <th v-if="!isShowAvatar" class="d-flex" >
                  <b-form-checkbox
                          v-model="allSelected"
                          :indeterminate="false"
                          aria-describedby="flavours"
                          aria-controls="flavours"
                          @change="selectAllAvatar"
                          style="margin-right: 5px"
                  >
                  </b-form-checkbox>
                  Avatar
                </th>
              </tr>
              </thead>
              <tbody v-loading="appLoading" class="position-relative">
                <tr v-for="(profile, index) in profiles" :key="index">
                  <!-- <td>{{(currentPage - 1) * perPage + index + 1}}</td> -->
                  <td>{{profile.staff_code}}</td>
                  <td>
                    <img v-if="profile.image_profile" :src="profile.image_profile" alt="avatar"
                         class="cursor-pointer img-circle image-gallery"
                         @click="(masterProfileId = profile.id) && $bvModal.show('modal-image-gallery')"/>
                    <div class="d-inline-block">
                      <div  :class="codGroupIds.includes(parseInt(profile.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                          class="member-info-item"
                          @click="gotoCodProfile(profile.group_id, profile.userId)">{{profile.fullname}}</div>
                      <span class="text-has-action" @click="showTel(index)">{{profile.tel}}</span>
                    </div>
                  </td>
                  <td>{{profile.cmnd}}</td>
                  <!-- <td>{{profile.tel}}</td> -->
                  <td>
                    <div
                      :class="codGroupIds.includes(parseInt(profile.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                      class="member-info-item"
                      @click="gotoCodProfile(profile.group_id, profile.userId)">
                      {{ profile.username }}</div>
                  </td>
                  <td>{{profile.positionName}}</td>
                  <td>{{profile.work_type_description}}</td>
                  <td>
                    {{profile.stationName}} {{ profile.provinceName ? '('+profile.provinceName+')' : ''}}
                  </td>
                  <td><span :class="getBriefStatusProfileClass(profile.status)">{{getBriefStatusProfileName(profile.status)}}</span></td>
                  <td><span :class="getBriefStatusClass(profile.cnb_confirmed)">{{ getBriefStatusName(profile.cnb_confirmed) }}</span></td>
                  <td>
                    <b-btn variant="outline-ghtk" size="sm" @click="(masterProfileId = profile.id) && $bvModal.show('modal-detail')" title="Danh sách tài khoản">
                      <i class="ion ion-md-eye"></i>
                    </b-btn>
                    <router-link :to="{name: 'edit-master-profile', params: { id: profile.id }}" class="btn btn-outline-ghtk btn-sm" title="Chỉnh sửa Profile" :target="blankMode && '_blank'">
                      <i class="ion ion-md-create"></i>
                    </router-link>
                    <router-link :to="{name: 'add-user', params: { id: profile.id }}" class="btn btn-outline-ghtk btn-sm" title="Thêm tài khoản" :target="blankMode && '_blank'">
                      <i class="ion ion-md-add"></i>
                    </router-link>
                    <b-btn variant="outline-success" size="sm" @click="openForceActiveWallet(profile)" title="Config bắt buộc kích hoạt ví">
                      <i class="ion ion-md-card"></i>
                    </b-btn>
                    <b-btn variant="outline-danger" size="sm" @click="deleteProfile(profile)" title="Xóa Profile">
                      <i class="ion ion-md-trash"></i>
                    </b-btn>
                  </td>
                  <td v-if="!isShowAvatar" style="width: 5%">
                    <b-form-checkbox v-if="profile.userId"
                            v-model="listUserId[(currentPage - 1) * perPage + index]"
                            :value="profile.userId"
                            :unchecked-value="null"
                            style="text-align: center"
                            @input="choiceAvatar"
                    >
                    </b-form-checkbox>
                  </td>
                </tr>
                <!-- no record -->
                <tr v-show="!appLoading && !profiles.length && !firstTime">
                  <td colspan="10" class="font-weight-bold text-center">
                    <div class="my-5">Rất tiếc, không tìm thấy profile phù hợp !</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <modal-detail-master-profile :masterProfileId="masterProfileId"></modal-detail-master-profile>
          </b-card>
        </div>
      </div>
    </div>
    <modal-force-active-wallet
      :masterProfileId="masterProfileId"
      :isCurrentForce="isCurrentForce"
      @reset="resetForceWallet()"
    >
    </modal-force-active-wallet>
    <modal-export-master-profile
      :titles="exportTitles"
      :show="toggleExportModalShow"
      @handleExport="exportMasterProfile"
      @handleExportImage="exportImageFileMas"
      @handleExportDuty="exportRank"
      @handleExportContract="exportContract"
    >
    </modal-export-master-profile>
    <modal-image-gallery :master-profile-id="masterProfileId"></modal-image-gallery>

    <PreviewPrintInfo />
  </div>
</template>

<style scoped lang="scss">
  .image-gallery {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    vertical-align: initial;
  }
  .wrapper-list-master {
    position: relative;
    min-height: 120px;
  }
  .h-col-50 .col-md-2 {
    max-height: 50px;
  }
  .exporting-btn {
    span {
      position: relative; padding-left: 20px
    }
    .sk-folding-cube.sk-primary{
      position: absolute;
      height: 12px;
      width: 12px;
      top: -37px;
      left: 0
    }
  }
  .mh-{
    &5re{
      min-height: 5rem;
    }
    &10re{
      min-height: 10rem;
    }
    &25{
      min-height: 25%;
    }
    &75{
      min-height: 75%;
    }
    &50{
      min-height: 50%;
    }
    &100{
      min-height: 100%;
    }
  }
</style>

<script>
// service
import profileService from 'domain/services/profile-service'

// entities
import MasterProfile from 'domain/entities/MasterProfile'
import ManageListCod from 'domain/entities/ManageListCod'

// mixins
import ExportMixin from 'mixins/ExportMixin'

// custom component
import PreviewPrintInfo from './ModalPreviewPrintInfo'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'
import SingleSelectGender from 'components/elements/common/SingleSelectGender'
import ModalDetailMasterProfile from 'components/pages/erp/profile/ModalDetailMasterProfile'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import ModalExportMasterProfile from './ModalExportMasterProfile'
import ModalImageGallery from './ModalImageGallery'
import moment from 'moment'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectContractType from 'components/elements/common/SelectContractType'
import SelectProfileStatus from 'components/elements/common/SelectProfileStatus'
import SingleSelectDuty from 'components/elements/common/SingleSelectDuty'
import helper from 'infrastructures/helpers/common-helpers'
import ModalForceActiveWallet from './ModalForceActiveWallet'

export default {
  name: 'master-profile-manager',
  mixins: [ExportMixin],
  components: {
    ModalForceActiveWallet,
    SingleSelectProfileRegion,
    SkRotatingPlane,
    ModalDetailMasterProfile,
    ModalExportMasterProfile,
    ModalImageGallery,
    SingleSelectGender,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectDepartment,
    MultiSelectPosition,
    SelectContractType,
    SelectProfileStatus,
    SingleSelectDuty,
    PreviewPrintInfo
  },

  props: {
    profileStatus: {
      default: null
    },

    blankMode: {
      default: null,
      type: Boolean
    }
  },

  data: () => ({
    filter: null,
    duty_id: null,
    contractType: '',
    modules: '',
    resignReason: null,
    gender: null,
    username: '',
    fullName: '',
    cmnd: '',
    staffCode: '',
    codAlias: '',
    phoneNumber: '',
    regions: '',
    provinceIds: null,
    stationIds: '',
    departmentName: '',
    departmentIds: '',
    positionIds: '',
    masterProfileId: '',
    isCurrentForce: false,
    profiles: [],
    listUserId: [],
    allSelected: false,
    isShowAvatar: true,
    appLoading: false,
    firstTime: true,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    status: '',
    cnbConfirmStatus: '',
    statusOptions: MasterProfile.getStatusOptions(),
    cnbConfirmStatusOptions: [
      { value: '', text: 'Trạng thái xác nhận hồ sơ' },
      { value: 1, text: 'Đã xác nhận' },
      { value: 2, text: 'Đã có thông tin' },
      { value: 0, text: 'Chưa có thông tin' }
    ],

    range_time_filter: null,
    range_time: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    range_time_filter_options: [
      {value: null, text: 'Options áp dụng time'},
      {value: 'created_time', text: 'Ngày tạo user'},
      {value: 'join_date', text: 'Ngày vào'},
      {value: 'resign_date', text: 'Ngày nghỉ việc'},
      {value: 'comeback_date', text: 'Ngày đi làm lại'}
    ],
    resignReasonOptions: [
      {text: 'Chọn lý do nghỉ việc', value: null},
      {text: 'Sức khỏe không đảm bảo'},
      {text: 'Không đáp ứng được thời gian, địa điểm'},
      {text: 'Không phù hợp với tính chất công việc'},
      {text: 'Không phù hợp với môi trường, văn hóa'},
      {text: 'Việc cá nhân/gia đình'},
      {text: 'Định hướng công việc mới'},
      {text: 'Cho nghỉ gian lận'},
      {text: 'Chế độ, thu nhập không đảm bảo'},
      {text: 'Năng lực yếu kém'},
      {text: 'Hết HĐ/Thời vụ'},
      {text: 'Nghỉ sinh (vi phạm thỏa thuận)'},
      {text: 'Nghỉ thai sản'},
      {text: 'Nghỉ không lương'},
      {text: 'Nghỉ ốm đau dài hạn'},
      {text: 'Thái độ làm việc kém'},
      {text: 'Nghỉ do thiên tai dịch bệnh'},
      {text: 'Nghỉ do tạm đình chỉ'},
      {text: 'Khác'}
    ],

    toggleExportModalShow: false,
    URLExportedFile: '#',
    exportRight: false,
    exporting: false,
    exported: false,
    exportTitles: [],
    downloaded: true,
    codGroupIds: ManageListCod.codGroupIds
  }),

  beforeCreate () {
    if (!window.popStateDetected) {
      localStorage.removeItem('masterProfileFilter')
    }
  },

  created () {
    if (this.$route.query.status) this.status = this.$route.query.status
    if (this.$route.query.cnbConfirmStatus) this.cnbConfirmStatus = this.$route.query.cnbConfirmStatus
    this.baywatch(['cmnd', 'staffCode', 'username', 'fullName', 'region', 'provinceId', 'stationId', 'departmentName', 'positionId', 'status', 'cnbConfirmStatus', 'range_time_filter', 'range_time'], this.allowExport.bind(this))
    window.addEventListener('beforeunload', this.onCloseHandler)
    this.getTitlesExport()
    if (localStorage.getItem('masterProfileFilter') !== null) {
      this.filter = JSON.parse(localStorage.getItem('masterProfileFilter'))
    }

    this.search(this.currenPage, this.filter)
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  watch: {
    profileStatus: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) {
          this.status = newVal
          this.searchProfile()
        }
      }
    }
  },

  methods: {
    openForceActiveWallet (profile) {
      this.masterProfileId = profile.id
      this.isCurrentForce = profile.is_force_wallet
      this.$bvModal.show('modal-force-active-wallet')
    },

    gotoCodProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    },

    printAvatar () {
      let listUserId = this.listUserId.filter((userId) => {
        return typeof userId !== 'undefined' && userId !== null
      }).toString()
      if (listUserId === '') {
        alert('Vui lòng chọn avatar để in!')
      } else {
        let url = window.location.protocol + '//' + window.location.host + '/admin/users/printAvatar?user_ids=' + listUserId
        window.open(url, 'popupWindow', 'width=800,height=600,scrollbars=yes')
        this.showColAvatar()
      }
    },

    selectAllAvatar () {
      if (!this.allSelected) {
        this.listUserId = this.profiles.map((profile) => {
          return profile.userId
        })
      } else {
        this.listUserId = []
      }
    },

    choiceAvatar () {
      let tmp = this.listUserId.filter((userId) => {
        return typeof userId !== 'undefined' && userId !== null
      })
      let allUser = this.profiles.map((profile) => {
        return profile.userId
      }).filter((userId) => {
        return typeof userId !== 'undefined' && userId !== null
      })
      if (tmp.length === allUser.length) {
        this.allSelected = true
      } else {
        this.allSelected = false
      }
    },

    showColAvatar () {
      this.isShowAvatar = !this.isShowAvatar
    },

    showTel (profileIndex) {
      this.profiles[profileIndex].tel = this.profiles[profileIndex].tel_origin
    },

    baywatch (props, watcher) {
      let iterator = function (prop) {
        this.$watch(prop, watcher)
      }
      props.forEach(iterator, this)
    },

    onCloseHandler (e) {
      if (this.exporting) {
        helper.showMessage('File đang được xuất, đóng cửa sổ sẽ làm mất file !', 'warning', 'Thông báo')
        e.returnValue = 'File đang được xuất, đóng cửa sổ sẽ làm mất file !'
      }
      if (!this.downloaded) {
        helper.showMessage('File được xuất chưa được tải về, đóng cửa sổ sẽ làm mất file !', 'warning', 'Thông báo')
        e.returnValue = 'File được xuất chưa được tải về, đóng cửa sổ sẽ làm mất file !'
      }
    },

    getTitlesExport () {
      profileService.getTitlesToExportMasterProfile()
        .then(response => {
          if (response.data.success) {
            this.exportRight = response.data.allowExport
            if (this.exportRight) this.exportTitles = response.data.data || []
          }
        })
    },

    allowExport () {
      if (this.exporting) return
      if (!this.downloaded) {
        if (!confirm('Bạn chưa tải về file đã xuất. Bạn chắc chắn muốn tiếp tục?')) return
      }
      this.exporting = false
      this.exported = false
      this.downloaded = true
      this.URLExportedFile = '#'
    },

    showExportModal () {
      this.toggleExportModalShow = !this.toggleExportModalShow
    },

    searchProfile () {
      this.currentPage = 1
      this.search()
    },

    getStartEndFromTimeRange (rangeTime) {
      return {
        from: moment(rangeTime.start).format('YYYY-MM-DD'),
        to: moment(rangeTime.end).format('YYYY-MM-DD')
      }
    },

    search (page, filter) {
      if (!this.validate()) {
        helper.showMessage('CMND/Mã nhân viên phải nhập đủ hoặc username/Họ tên phải nhập ít nhất 3 kí tự !', 'warning', 'Lỗi')
        return
      }
      this.appLoading = true
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let params
      if (!filter) {
        params = {
          duty_id: this.duty_id,
          cmnd: this.cmnd,
          staffCode: this.staffCode,
          username: this.username,
          fullName: this.fullName,
          codAlias: this.codAlias,
          phoneNumber: this.phoneNumber,
          region: this.regions,
          provinceId: this.provinceIds,
          stationId: this.stationIds,
          modules: this.modules,
          contractType: this.contractType,
          departmentId: this.departmentIds,
          positionId: this.positionIds,
          gender: this.gender,
          status: this.status,
          cnbConfirmStatus: this.cnbConfirmStatus,
          timeFilterType: this.range_time_filter,
          startTime: timeRange.from,
          endTime: timeRange.to,
          resignReason: this.resignReason,
          page: this.currentPage,
          limit: this.perPage
        }
      } else {
        params = filter
        this.duty_id = this.duty_id
        this.username = filter.username
        this.fullName = filter.fullName
        this.contractType = filter.contractType
        this.modules = filter.modules
        this.cmnd = filter.cmnd
        this.staffCode = filter.staffCode
        this.codAlias = filter.codAlias
        this.regions = filter.region
        this.provinceIds = filter.provinceId
        this.stationIds = filter.stationId
        this.departmentIds = filter.departmentId
        this.positionIds = filter.positionId
        this.gender = filter.gender
        this.status = filter.status
        this.cnbConfirmStatus = filter.cnbConfirmStatus
        this.range_time_filter = filter.timeFilterType
        if (filter.endTime && filter.startTime) {
          this.range_time = {
            start: new Date(filter.startTime),
            end: new Date(filter.endTime)
          }
        }
      }

      localStorage.setItem('masterProfileFilter', JSON.stringify(params))
      profileService.getMasterProfileList(params)
        .then(res => {
          if (res.data.success) {
            this.profiles = res.data.data.data
            this.totalItems = res.data.data.total
          } else {
            this.totalItems = 0
            this.profiles = []
            if (res.data.err_type === 'permission') helper.showMessage('Bạn không có quyền thao tác trên màn này !', 'warning', 'Thông báo')
            else helper.showMessage(res.data.message || 'Không lấy được danh sách nhân viên !', 'warning', 'Thông báo')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
      this.firstTime = false
    },

    handleSelectedDuty (option) {
      this.duty_id = option ? option.id : ''
    },

    selectProfileStatus (op) {
      if (!op) {
        this.status = null
        return
      }
      this.status = op.map(el => (el.value)).toString()
    },

    handleSelectedRegion (option) {
      if (option && option.length) {
        this.regions = option.map(option => option.id)
      } else {
        this.regions = null
      }
    },

    handleProvinceSelected: function (provinceOptions) {
      this.provinceIds = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleStationSelected: function (option) {
      this.stationIds = option.length ? option.map((item) => item.id).toString() : null
    },

    handleDepartmentSelected: function (option) {
      this.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handlePositionSelected: function (option) {
      this.positionIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedGender: function (option) {
      this.gender = option ? option.value : null
    },

    handleSelectedContractType (op) {
      this.contractType = op ? op.value : null
    },

    validate: function () {
      let validCmnd = !this.cmnd || this.cmnd.length >= 8
      let validStaffCode = !this.staffCode || this.staffCode.length >= 8
      let validUsername = !this.username || this.username.length >= 3
      let validFullName = !this.fullName || this.fullName.length >= 3
      if (!(validCmnd && validStaffCode && validUsername && validFullName)) {
        return false
      }
      return true
    },

    deleteProfile (profile) {
      if (!confirm(`Bạn có chắc chắn muốn xóa profile ${profile.fullname} - code: ${profile.staff_code} ?`)) {
        return
      }

      this.$startLoading()
      profileService.deleteProfile(profile.id)
        .then(res => {
          if (res.data.success) {
            helper.showMessage('Xóa profile thành công!', 'success', 'Thông báo')
            this.search()
          } else {
            helper.showMessage(res.data.message || 'Không xóa được Profile !', 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra trong quá trình xóa profile.', 'warning', 'Lỗi')
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    getBriefStatusProfileName (briefStatusProfile) {
      return MasterProfile.getBriefStatusProfileName(briefStatusProfile)
    },

    getBriefStatusProfileClass (briefStatusProfile) {
      return MasterProfile.getBriefStatusProfileClass(briefStatusProfile)
    },

    getBriefStatusName (briefStatus) {
      return MasterProfile.getBriefStatusName(briefStatus)
    },

    getBriefStatusClass (briefStatus) {
      return MasterProfile.getBriefStatusClass(briefStatus)
    },

    setDownloaded () {
      this.downloaded = true
      this.exported = false
    },

    checkJobStatus (jobId) {
      let getJobStat = setInterval(() => {
        profileService.checkJobStatus({job_id: jobId})
          .then(response => {
            let data = response.data.data
            if (response.data.success) {
              if (data.job_status === 'closed') {
                clearInterval(getJobStat)
                if (data.message) {
                  helper.showMessage(data.message || 'Có lỗi khi kiểm tra Job xuất dữ liệu.', 'warning', 'Lỗi')
                } else {
                  this.exported = true
                  this.URLExportedFile = data.url
                  helper.showMessage('Đã xuất xong file dữ liệu', 'success', 'Xuất file thành công')
                  this.downloaded = false
                }
                this.exporting = false
              }
            } else {
              helper.showMessage(data.message || 'Có lỗi khi kiểm tra Job xuất dữ liệu.', 'warning', 'Xảy ra lỗi')
              clearInterval(getJobStat)
              this.exporting = false
            }
          })
      }, 2000)
    },

    exportMasterProfile (titles) {
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let params = {
        cmnd: this.cmnd,
        staffCode: this.staffCode,
        username: this.username,
        fullName: this.fullName,
        region: this.regions,
        provinceId: this.provinceIds,
        stationId: this.stationIds,
        departmentId: this.departmentIds,
        positionId: this.positionIds,
        status: this.status,
        cnbConfirmStatus: this.cnbConfirmStatus,
        titles: titles,
        timeFilterType: this.range_time_filter,
        startTime: timeRange.from,
        endTime: timeRange.to
      }
      this.exporting = true
      profileService.exportMasterProfile(params)
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi kiểm tra Job xuất dữ liệu.', 'warning', 'Xảy ra lỗi')
            this.exporting = false
          }
        })
        .catch(e => {
          this.exporting = false
          console.log(e)
        })
    },

    exportImageFileMas () {
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let params = {
        cmnd: this.cmnd,
        staffCode: this.staffCode,
        username: this.username,
        fullName: this.fullName,
        region: this.regions,
        provinceId: this.provinceIds,
        stationId: this.stationIds,
        departmentId: this.departmentIds,
        positionId: this.positionIds,
        status: this.status,
        cnbConfirmStatus: this.cnbConfirmStatus,
        timeFilterType: this.range_time_filter,
        startTime: timeRange.from,
        endTime: timeRange.to
      }
      this.exporting = true
      profileService.exportMasterProfileImage(params)
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            helper.showMessage(res.data.message, 'warning', 'Xảy ra lỗi')
            this.exporting = false
          }
        })
    },

    exportRank () {
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let params = {
        cmnd: this.cmnd,
        staffCode: this.staffCode,
        username: this.username,
        fullName: this.fullName,
        region: this.regions,
        provinceId: this.provinceIds,
        stationId: this.stationIds,
        departmentId: this.departmentIds,
        positionId: this.positionIds,
        status: this.status,
        cnbConfirmStatus: this.cnbConfirmStatus,
        timeFilterType: this.range_time_filter,
        startTime: timeRange.from,
        endTime: timeRange.to
      }
      this.exporting = true
      profileService.exportRank(params)
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            helper.showMessage(res.data.message, 'warning', 'Xảy ra lỗi')
            this.exporting = false
          }
        })
    },

    resetForceWallet () {
      this.masterProfileId = null
      this.search()
    },

    exportContract () {
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let params = {
        cmnd: this.cmnd,
        staffCode: this.staffCode,
        username: this.username,
        fullName: this.fullName,
        region: this.regions,
        provinceId: this.provinceIds,
        stationId: this.stationIds,
        departmentId: this.departmentIds,
        positionId: this.positionIds,
        status: this.status,
        cnbConfirmStatus: this.cnbConfirmStatus,
        timeFilterType: this.range_time_filter,
        startTime: timeRange.from,
        endTime: timeRange.to
      }
      this.exporting = true
      profileService.exportContract(params)
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi kiểm tra Job xuất dữ liệu.', 'warning', 'Xảy ra lỗi')
            this.exporting = false
          }
        })
        .catch(e => {
          this.exporting = false
          console.log(e)
        })
    },

    resetSearch () {
      this.cmnd = null
      this.staffCode = null
      this.username = null
      this.fullName = null
      this.codAlias = null
      this.regions = null
      this.provinceIds = null
      this.stationIds = null
      this.modules = null
      this.contractType = null
      this.departmentIds = null
      this.positionIds = null
      this.gender = null
      this.status = ''
      this.cnbConfirmStatus = ''
      this.range_time_filter = null
      this.range_time = null
      this.resignReason = null
      this.perPage = 10
      this.searchProfile()
    }
  }
}
</script>
