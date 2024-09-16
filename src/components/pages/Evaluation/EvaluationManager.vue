<template>
    <div>
          <!-- Header  -->
          <b-row class="top align-items-end">
            <b-col md="5">
              <h4 class="mb-3">Quản lý đánh giá nhân viên</h4>
              <div class="text-note">
                Lưu ý: <br>
                <div class="pl-3">
                    <span v-if="parseInt(groupId) === 15">- Thời gian đánh giá là tất cả các ngày trong tuần.</span>
                    <span v-else>
                        - Chu kỳ 1: Từ 21 – 4 hàng tháng, thời gian đánh giá từ 5 – 8 hàng tháng. <br>
                        - Chu kỳ 2: Từ 5 – 20 hàng tháng, thời gian đánh giá từ 21 – 24 hàng tháng.
                    </span><br>
                    - Chỉ hiển thị nhân viên đã làm việc nhiều hơn 10 ngày. <br>
                    - Chỉ hiển thị nhân viên dưới quyền quản lý. <span v-if="parseInt(groupId) !== 3">Vui lòng liên hệ HR để gán nhân viên.</span>
                </div>
              </div>
            </b-col>
            <b-col md="7" class="text-right">
              <div v-if="exportRight && checkPermissionExportAllPage()" class="d-inline-block ml-1">
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
                  <b-btn v-else variant="ghtk" @click="exportRecompense">
                      <i class="ion ion-md-print"></i> Xuất dữ liệu thưởng phạt
                  </b-btn>
              </div>
              <div v-if="exportRightEvaluation && checkPermissionExportAllPage()" class="d-inline-block ml-1">
                  <b-btn v-if="exportingEvaluation" variant="ghtk" class="exporting-btn">
                    <span>
                      <div class="sk-folding-cube sk-primary">
                        <div class="sk-cube1 sk-cube"></div>
                        <div class="sk-cube2 sk-cube"></div>
                        <div class="sk-cube4 sk-cube"></div>
                        <div class="sk-cube3 sk-cube"></div>
                      </div>
                      Đang xuất...</span>
                  </b-btn>
                  <div class="d-inline-block" v-else-if="exportedEvaluation" @click="setEvaluationDownloaded">
                      <b-btn variant="ghtk" :href="URLExportedFileEvaluation" target="blank">
                          <i class="ion ion-md-download"></i> Tải xuống
                      </b-btn>
                  </div>
                  <b-btn v-else variant="ghtk" @click="exportEvaluation">
                      <i class="ion ion-md-print"></i> Xuất dữ liệu đánh giá
                  </b-btn>
              </div>
            </b-col>
          </b-row>
          <div class="seperate-xs my-1"></div>
          <!-- filter  -->
          <b-row class="h-col-50">
                    <b-col md="2">
                        <input placeholder="Mã Profile" v-model="staff_code" type="number" min="9" max="12" @keyup.enter="searchEvaluation" class="form-control"/>
                    </b-col>
                    <b-col md="2">
                        <input type="text" placeholder="username, Họ tên" v-model="keyword" @keyup.enter="searchEvaluation" class="form-control" />
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-profile-region @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-province :custom-class="''" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-station :province-id="provinceId" @handleSelectedStation="handleSelectedStation"></single-select-station>
                    </b-col>
                    <b-col md="2" class="z-5">
                        <single-select-department @handleSelectedDepartment="handleSelectedDepartment"></single-select-department>
                    </b-col>
                    <b-col md="2" class="z-3">
                        <single-select-position @handleSelectedPosition="handleSelectedPosition" :departmentName="departmentName" :position-job="positionId"></single-select-position>
                    </b-col>
                    <b-col md="2" class="z-3">
                        <single-select-work-type @handleSelectedWorkType="handleSelectedWorkType" :position-job="positionId" :work-type-id="work_type_id"></single-select-work-type>
                    </b-col>
                    <b-col md="2" class="z-3">
                        <single-select-module @handleSelectedModule="handleSelectedModule" :station-id="stationId" :module-id="moduleId"></single-select-module>
                    </b-col>
            <b-col md="2" class="z-3">
              <div class="select-reward-status">
                <multiselect
                  v-model="reward_status"
                  :options="statusRewardOptions"
                  :disabled="false"
                  label="name"
                  track-by="name"
                  placeholder="Trạng thái đề xuất thưởng"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  selectLabel="Chọn"
                  :searchable="true"
                >
                  <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  <span class="placeholder" slot="placeholder">Trạng thái đề xuất thưởng</span>
                </multiselect>
              </div>
            </b-col>
            <b-col md="2" class="z-3">
              <div class="select-penalty-status">
                <multiselect
                  v-model="penalty_status"
                  :options="statusPenaltyOptions"
                  :disabled="false"
                  label="name"
                  track-by="name"
                  placeholder="Trạng thái đề xuất phạt"
                  selectedLabel="Đã chọn"
                  deselectLabel="Bỏ chọn"
                  selectLabel="Chọn"
                  :searchable="true"
                >
                  <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                  <span class="placeholder" slot="placeholder">Trạng thái đề xuất phạt</span>
                </multiselect>
              </div>
            </b-col>
                    <b-col md="2">
                        <v-date-picker mode="range" v-model="range_time" locale="vi"
                            color="green"
                            :input-props="{ placeholder: reverseFormatDate(time_format.from) + ' - ' + reverseFormatDate(time_format.to), style: 'font-size:14px; line-height: unset' }"
                            @keyup.enter="search"/>
                    </b-col>
                    <b-col md="2" class="z-3">
                        <multiselect
                            v-model="status_id"
                            :options="statusIdOptions"
                            placeholder="Chọn trạng thái"
                            label="name"
                            track-by="name"
                            selectedLabel="Đã chọn"
                            deselectLabel="Bỏ chọn"
                            selectLabel="Chọn"
                            :searchable="true"
                          >
                            <span class="placeholder" slot="placeholder">Chọn trạng thái</span>
                          </multiselect>
                    </b-col>
            <b-col md="2" class="z-3">
              <b-btn variant="ghtk" @click="searchEvaluation()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
              </b-btn>
            </b-col>
          </b-row>
          <!-- paging  -->
          <div class="mb-1 mt-3">
            <div class="z-0 d-inline-block">
              <b-pagination
                class="m-0"
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
           <!-- Table content -->
          <div :class="scrollMode && 'table-sticky'" class="border rounded table-content">
                    <table class="table table-striped table-sm table-hover is_align_middle mih-10re m-0">
                        <thead>
                            <tr>
                                <th>Kho</th>
                                <th>Mã nhân viên</th>
                                <th>Tên nhân viên</th>
                                <th>Số điện thoại</th>
                                <th>Username</th>
                                <th>Bộ phận</th>
                                <th v-if="parseInt(groupId) !== 15">Module</th>
                                <th>Cần cải thiện</th>
                                <th>Bình thường</th>
                                <th>Đáng khen ngợi</th>
                                <th>Thẻ vàng</th>
                                <th>Thẻ đỏ</th>
                                <th>Thưởng</th>
                                <th v-if="parseInt(groupId) !== 15">Shop vote</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class="position-relative" v-loading="appLoading">
                            <tr v-for="(evaluation, key) in evaluations" :key="key">
                                <td>{{evaluation.station}}</td>
                                <td>{{evaluation.staff_code}}</td>
                                <td>
                                    <img v-if="evaluation.link_avatar" :src="evaluation.link_avatar" width="35" height="35" style="border-radius: 50%;" alt="avatar" class="rounded-circle"/>
                                    &nbsp;&nbsp;
                                  <p
                                    :class="codGroupIds.includes(parseInt(evaluation.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                                    class="member-info-item"
                                    @click="gotoCodProfile(evaluation.group_id, evaluation.user_id)">
                                    {{ evaluation.fullname }} </p>
                                </td>
                                <td>{{evaluation.tel}}</td>
                                <td>
                                  <p
                                    :class="codGroupIds.includes(parseInt(evaluation.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                                    class="member-info-item"
                                    @click="gotoCodProfile(evaluation.group_id, evaluation.user_id)">
                                    {{ evaluation.username }} </p>
                                </td>
                                <td>{{evaluation.department}}</td>
                                <td  v-if="parseInt(groupId) !== 15">{{evaluation.module}}</td>
                                <td>{{evaluation.manager.need_improve}}</td>
                                <td>{{evaluation.manager.normal}}</td>
                                <td>{{evaluation.manager.praise}}</td>
                                <td>{{evaluation.recompense.yellow_card}}</td>
                                <td>{{evaluation.recompense.red_card}}</td>
                                <td>{{evaluation.recompense.reward}}</td>
                                <td v-if="parseInt(groupId) !== 15">
                                    <span v-if="checkGroupUser(evaluation.group_id)">
                                    {{Math.round(evaluation.shop.average_vote)}}<i class="ion ion-ios-star yellow-icon"></i>
                                    / {{evaluation.shop.count_vote}} lượt vote
                                    </span>
                                    <span v-else>Không có dữ liệu</span>
                                </td>
                                <td>
                                    <router-link
                                      :to="{name: 'detail-evaluation', params: { id: evaluation.user_id }, query: { from: time_format.from, to: time_format.to }}"
                                      class="btn btn-sm btn-outline-ghtk"
                                    >
                                    <i class="ion ion-md-eye"></i>
                                    </router-link>
                                </td>
                            </tr>
                            <tr v-show="!appLoading && (!evaluations || !evaluations.length)">
                              <td colspan="20">
                                <div class="text-center">
                                  <b>Rất tiếc, không tìm thấy profile phù hợp !</b>
                                </div>
                              </td>
                            </tr>
                        </tbody>
                    </table>
          </div>
    </div>
</template>

<style scoped lang="scss">
    th {
      background: #eee;
    }
    .table-content {
      max-height: 60vh;
    }
    .text-note {
        color: red;
        font-size: 13px;
        margin-top: -12px;
        padding-left: 10px;
    }
    .font-size-14 {
        font-size: 14px;
    }
    .h-col-50 .col-md-2 {
        max-height: 50px;
    }
    .yellow-icon {
        color: orange;
    }
    .exporting-btn {
        span {
            position: relative; padding-left: 20px
        }
        .sk-folding-cube.sk-primary{
            position: absolute; height: 12px; width: 12px; top: -37px; left: 0
        }
    }
</style>

<script>
import evaluationService from 'domain/services/evaluation-service'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import depositService from 'domain/services/deposit-service'
import cycleTime from 'infrastructures/helpers/date.js'
import ManageListCod from 'domain/entities/ManageListCod'

// mixins
import ExportMixin from 'mixins/ExportMixin'

import moment from 'moment'
import Multiselect from 'vue-multiselect'

export default {
  name: 'evaluation-employee-manager',

  mixins: [ExportMixin],

  components: {
    SingleSelectProfileRegion,
    SingleSelectModule,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectDepartment,
    SingleSelectWorkType,
    Multiselect
  },

  props: {
    scrollMode: {
      default: false,
      type: Boolean
    }
  },

  data: () => ({
    groupId: null,
    keyword: '',
    staff_code: '',
    region: '',
    provinceId: '',
    stationId: '',
    moduleId: '',
    departmentName: '',
    positionId: '',
    work_type_id: '',
    reward_status: '',
    penalty_status: '',
    evaluations: [],
    appLoading: false,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    range_time: null,
    time_format: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    evaluationDetail: '',
    URLExportedFile: '#',
    exportRight: true,
    exporting: false,
    exported: false,
    downloaded: false,
    URLExportedFileEvaluation: '#',
    exportRightEvaluation: true,
    exportingEvaluation: false,
    exportedEvaluation: false,
    downloadedEvaluation: false,
    codGroupIds: ManageListCod.codGroupIds,
    status_id: {
      value: 3,
      name: 'Đang hoạt động'
    },
    statusIdOptions: [
      {
        value: 1,
        name: 'Không hoạt động'
      },
      {
        value: 2,
        name: 'Tạm khóa'
      },
      {
        value: 3,
        name: 'Đang hoạt động'
      }
    ],
    statusRewardOptions: [
      { value: 0, name: 'Đề xuất' },
      { value: 2, name: 'Duyệt bởi Quản lý' },
      { value: 3, name: 'Duyệt bởi Trưởng bộ phân' },
      { value: 1, name: 'Từ chối' }
    ],
    statusPenaltyOptions: [
      { value: 5, name: 'Chốt phạt' },
      { value: 6, name: 'Bỏ phạt' }
    ]
  }),

  created () {
    this.getStartEndFromTimeRange()
    this.search()
    this.getGroupIdOfUser()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    range_time: function (newVal, oldVal) {
      this.getStartEndFromTimeRange()
    }
  },

  methods: {
    getGroupIdOfUser: function () {
      depositService.getGroupIdOfUser()
        .then((res) => {
          if (res.data.success) {
            this.groupId = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    reverseFormatDate (date) {
      return date.split('-').reverse().join('-')
    },

    exportRecompense () {
      let params = {
        staff_code: this.staff_code,
        keyword: this.keyword,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        moduleId: this.moduleId,
        departmentName: this.departmentName,
        positionId: this.positionId,
        workTypeId: this.work_type_id,
        from: this.time_format.from,
        to: this.time_format.to
      }
      this.exporting = true
      evaluationService.exportRecompense(params)
        .then(res => {
          if (res.data.success) {
            this.exported = true
            this.exporting = false
            if (res.data.data.length === 0) {
              this.$notify({
                group: 'default',
                type: 'text-dark bg-warning',
                title: 'Không có dữ liệu thưởng phạt trong thời gian này!',
                text: res.data.message
              })
              this.exported = false
            } else {
              this.URLExportedFile = res.data.data.url
            }
          } else {
            this.$notify({
              group: 'default',
              type: 'text-dark bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
            this.exporting = false
          }
        })
    },
    checkJobStatus (jobId) {
      let getJobStat = setInterval(() => {
        evaluationService.checkJobStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              if (response.data.job_status === 'closed') {
                clearInterval(getJobStat)
                if (response.data.message) {
                  this.$notify({
                    group: 'default',
                    type: 'text-dark bg-warning',
                    title: 'Xảy ra lỗi',
                    text: response.data.message
                  })
                } else {
                  this.exportedEvaluation = true
                  this.URLExportedFileEvaluation = response.data.file_path
                  this.$notify({
                    group: 'default',
                    type: 'text-white bg-primary',
                    title: 'Xuất file thành công',
                    text: 'Đã xuất xong file cọc'
                  })
                  this.downloadedEvaluation = false
                }
                this.exportingEvaluation = false
              }
            } else {
              this.$notify({
                group: 'default',
                type: 'text-dark bg-warning',
                title: 'Xảy ra lỗi',
                text: response.data.message
              })
              clearInterval(getJobStat)
              this.exportingEvaluation = false
            }
          })
      }, 2000)
    },

    exportEvaluation () {
      let params = {
        staff_code: this.staff_code,
        keyword: this.keyword,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        moduleId: this.moduleId,
        departmentName: this.departmentName,
        positionId: this.positionId,
        workTypeId: this.work_type_id,
        from: this.time_format.from,
        to: this.time_format.to
      }
      this.exportingEvaluation = true
      evaluationService.exportEvaluation(params)
        .then(res => {
          if (res.data.success) {
            this.checkJobStatus(res.data.job_id)
          } else {
            this.$notify({
              group: 'default',
              type: 'text-dark bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
            this.exportingEvaluation = false
          }
        })
    },

    setDownloaded () {
      this.downloaded = true
      this.exported = false
    },

    setEvaluationDownloaded () {
      this.downloadedEvaluation = true
      this.exportedEvaluation = false
    },

    searchEvaluation () {
      this.currentPage = 1
      this.search()
    },

    gotoCodProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    },

    getStartEndFromTimeRange () {
      if (this.$route.query.from && this.$route.query.from) {
        this.time_format = {
          from: this.$route.query.from,
          to: this.$route.query.to
        }
        return true
      }

      if (!this.range_time) {
        this.time_format = {
          from: cycleTime.daysInThisMonth(21, 20, true).from,
          to: cycleTime.daysInThisMonth(21, 20, true).to
        }
        return true
      }
      this.time_format = {
        from: moment(this.range_time.start).format('YYYY-MM-DD'),
        to: moment(this.range_time.end).format('YYYY-MM-DD')
      }
    },

    search () {
      this.appLoading = true
      let params = {
        staff_code: this.staff_code,
        keyword: this.keyword,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        moduleId: this.moduleId,
        departmentName: this.departmentName,
        positionId: this.positionId,
        workTypeId: this.work_type_id,
        from: this.time_format.from,
        to: this.time_format.to,
        status_id: this.status_id.value,
        reward_status: this.reward_status.value,
        penalty_status: this.penalty_status.value,
        page: this.currentPage,
        limit: this.perPage
      }
      evaluationService.getEvaluationList(params)
        .then(res => {
          if (res.data.success) {
            this.evaluations = res.data.data
            this.totalItems = res.data.count
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    setValueEvaluationDetail (data) {
      this.evaluationDetail = data
    },

    checkGroupUser (groupId) {
      return ['12', '14', '17', '18'].includes(groupId)
    },

    handleSelectedModule (option) {
      this.moduleId = option ? option.id : ''
    },

    handleSelectedRegion (option) {
      this.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : ''
    },

    handleSelectedDepartment: function (option) {
      this.departmentName = option ? option.name : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    },
    handleSelectedWorkType (option) {
      this.work_type_id = option ? option.id : ''
    },
    handleSelectedRewardStatus (option) {
      this.reward_status = option ? option.id : ''
    },
    handleSelectedPenaltyStatus (option) {
      this.penalty_status = option ? option.id : ''
    }
  }
}
</script>
