<template>
  <div class="small-scrollbar">
      <b-row class="mb-1">
        <b-col md="6"><h4 class="ui-block-heading">Cơ cấu team nhân sự</h4></b-col>
        <b-col md="6" class="text-right">
          <router-link :to="{name: 'add-hrteam'}" class="btn btn-md btn-success ml-1"><i class="ion ion-md-add"></i> Thêm nhóm</router-link>
        </b-col>
      </b-row>

      <b-row class="mb-2">
          <b-col md="2" class="mb-1">
            <select-profile-region
              :region="region"
              @handleSelectedRegion="handleSelectedRegion"
            >
            </select-profile-region>
          </b-col>
          <b-col md="2">
            <single-select-province @handleSelectedProvince="handleSelectedProvince" :regionName="region" :province-id="provinceId" custom-class=""></single-select-province>
          </b-col>
          <b-col md="2">
            <single-select-station :province-id="provinceId" @handleSelectedStation="handleSelectedStation" :stationId="stationId" custom-class=""></single-select-station>
          </b-col>
           <b-col md="2">
              <single-select-module :station-id="stationId" @handleSelectedModule="handleSelectedModule" :module-id="moduleId" custom-class=""></single-select-module>
          </b-col>
          <b-col md="2">
            <single-select-department @handleSelectedDepartment="handleSelectedDepartment" :department-id="departmentId"></single-select-department>
          </b-col>
          <b-col md="2">
            <single-select-position @handleSelectedPosition="handleSelectedPosition" :department-id="departmentId" :position-job="positionId"></single-select-position>
          </b-col>
          <b-col md="2">
            <select-group-type
              :group-type="groupType"
              @input="selectGroupType"
            ></select-group-type>
          </b-col>
          <b-col md="2">
            <b-input type="text" placeholder="Tên team" v-model="teamName" @keyup.enter="search"/>
          </b-col>
          <b-col md="4">
            <select-hr-member
              :member-ids="userId"
              @handleSelectedHrMember="handleSelectedMemberSearch"
            >
            </select-hr-member>
          </b-col>
          <b-col md="4" class="text-right">
            <b-btn variant="primary" @click="currentPage = 1; search();"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
            <b-btn variant="secondary" @click="resetFilter"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>
          </b-col>
      </b-row>
      <div class="mb-3">
            <table class="table mb-0 table-hover table-bordered table-sm" v-loading="loading">
              <thead>
              <tr>
                <th class="text-center">STT</th>
                <th class="text-center">Tên nhóm</th>
                <th class="text-center">Loại nhóm</th>
                <th class="text-center">Trưởng nhóm</th>
                <th class="text-center w-25">Thành viên</th>
                <th class="text-center">Khu vực quản lý</th>
                <th class="text-center">Tính KPI</th>
                <th class="text-center">Action</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(hrteam, index) in hrteams" :key="index">
                  <td class="text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td>
                    {{ hrteam.name }}
                  </td>
                  <td>
                    {{ groupTeamDesc[hrteam.group_type] || '' }}
                  </td>
                  <td>
                    <div v-if="hrteam.leader_id">
                      <div v-for="(leader, idx) in hrteam.leader_id" :key="idx" class="mb-3">
                        <router-link v-if="leader.master_profile_id" :to="{name: 'edit-master-profile', params: { id: leader.master_profile_id }}">{{leader.fullname}} ( {{leader.username}} )</router-link>
                        <router-link v-else-if="leader.id" :to="{name: 'edit-user', params: { id: leader.id }}">{{leader.fullname}} ( {{leader.username}} )</router-link>
                        <p v-else-if="hrteam.leader">{{hrteam.leader.fullname}} ( {{leader.username}} )</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div v-for="(member, idx) in hrteam.members" :key="idx" class="mb-3">
                      <span> {{member.User.fullname}} ( {{member.User.username}} - {{member.Station.name}})</span>
                    </div>
                  </td>
                  <td>
                    <div class="hr-team-list-region" v-if="hrteam.list_regions && hrteam.list_regions.length > 0">
                      <b>Miền: </b>
                      <span class="hr-team-list-region__item" v-for="region in hrteam.list_regions">{{ region.name }}</span>
                    </div>
                    <div class="hr-team-list-region" v-if="hrteam.list_provinces && hrteam.list_provinces.length > 0">
                      <b>Tỉnh: </b>
                      <span class="hr-team-list-region__item" v-for="province in hrteam.list_provinces">{{ province.name }}</span>
                    </div>
                    <div class="hr-team-list-region" v-if="hrteam.list_districts && hrteam.list_districts.length > 0">
                      <b>Quận/Huyện: </b>
                      <span class="hr-team-list-region__item" v-for="item in hrteam.list_districts">{{ item.name }}</span>
                    </div>
                    <div class="hr-team-list-region" v-if="hrteam.list_sub_districts && hrteam.list_sub_districts.length > 0">
                      <b>Phường/Xã: </b>
                      <span class="hr-team-list-region__item" v-for="item in hrteam.list_sub_districts">{{ item.name }}</span>
                    </div>
                    <div class="hr-team-list-region" v-if="hrteam.list_stations && hrteam.list_stations.length > 0">
                      <b>Kho: </b>
                      <span class="hr-team-list-region__item" v-for="station in hrteam.list_stations">{{ station.name }}</span>
                    </div>
                    <div class="hr-team-list-region"
                         v-if="hrteam.sub_group_type === 'hr_care' && hrteam.list_departments && hrteam.list_departments.length > 0">
                      <b>Bộ phận: </b>
                      <span class="hr-team-list-region__item" v-for="item in hrteam.list_departments">{{ item.name }}</span>
                    </div>
                    <div class="hr-team-list-region" v-if="hrteam.sub_group_type === 'hr_care' && hrteam.list_positions && hrteam.list_positions.length > 0">
                      <b>Vị trí: </b>
                      <span class="hr-team-list-region__item" v-for="item in hrteam.list_positions">{{ item.position_name }}</span>
                    </div>
                    <div class="hr-team-list-region" v-if="hrteam.sub_group_type === 'hr_recruitment' && hrteam.recruitment_job_array && hrteam.recruitment_job_array.length > 0">
                      <b>Job tuyển dụng: </b>
                      <span class="hr-team-list-region__item" v-for="item in hrteam.recruitment_jobs">{{ item.name }}</span>
                    </div>
                  </td>
                  <td class="text-center">
                    {{ hrteam.has_kpi ? 'Có' : '' }}
                  </td>
                  <td class="text-center">
                    <router-link class="btn btn-outline-ghtk btn-sm mb-1" :to="{name: 'edit-hrteam', params: { id: hrteam.id }}" title="Chỉnh sửa team">
                      <i class="ion ion-md-create"></i>
                    </router-link>
                    <b-btn variant="outline-danger mb-1" size="sm" @click="deleteHrTeam(hrteam)" title="Xóa team">
                      <i class="ion ion-md-trash"></i>
                    </b-btn>
                    <!-- <b-btn class="btn btn-md btn-outline-success mb-1" @click="quickUpdate(hrteam)" title="Lưu thay đổi"><i class="fas fa-save"></i></b-btn> -->
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-center mt-3 mb-1" v-if="hrteams && hrteams.length === 0">Không có Team nào !</div>
            <b-row class="mt-3" v-else>
              <b-col>
                <b-pagination
                  :total-rows="totalItems"
                  v-model="currentPage"
                  :per-page="perPage"
                  v-on:input="search"
                  align="center"
                />
              </b-col>
            </b-row>
      </div>
  </div>
</template>

<style lang="scss" scoped>
  .hr-team-list-region {
    &__item {
      margin-right: 5px;
      &:after {
        content: ","
      }
      &:last-child {
        margin-right: 0;
        &:after {
          content: none;
        }
      }
    }
  }
</style>

<script>
// service
import hrteamService from 'domain/services/hrteam-service'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'

// custom component
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import SelectHrMember from './SelectHrMember'
import SelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import SelectGroupType from './SelectGroupType'

// utility
import commonHelper from 'infrastructures/helpers/common-helpers'

// entities
import Hrteam from 'domain/entities/Hrteam'

export default {
  name: 'manager-hrteam',
  components: {
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectDepartment,
    SingleSelectModule,
    MultiSelectProvince,
    SelectHrMember,
    SelectProfileRegion,
    MultiSelectUser,
    SelectGroupType
  },

  data: () => ({
    region: null,
    provinceId: '',
    stationId: '',
    moduleId: '',
    departmentId: '',
    positionId: '',
    currentPage: 1,
    totalItems: 0,
    perPage: 5,
    hrteams: null,
    teamName: '',
    userId: '',
    loading: null,
    groupType: null,
    groupTeamDesc: Hrteam.groupTeamDesc
  }),

  beforeCreate () {
    if (!window.popStateDetected) {
      sessionStorage.removeItem('hrTeamFilter')
    }
  },

  created () {
    let hrTeamFilter = JSON.parse(sessionStorage.getItem('hrTeamFilter'))
    if (hrTeamFilter) {
      this.teamName = hrTeamFilter.teamName
      this.region = hrTeamFilter.region
      this.provinceId = hrTeamFilter.provinceId
      this.stationId = hrTeamFilter.stationId
      this.moduleId = hrTeamFilter.moduleId
      this.departmentId = hrTeamFilter.departmentId
      this.positionId = hrTeamFilter.positionId
      this.currentPage = hrTeamFilter.page
      this.perPage = hrTeamFilter.limit
      this.userId = hrTeamFilter.userId
      this.groupType = hrTeamFilter.groupType
    }
    this.search()
  },

  methods: {
    handleSelectedModule (option) {
      this.moduleId = option ? option.id : null
    },

    search: function () {
      this.loading = true
      let params = {
        teamName: this.teamName,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        moduleId: this.moduleId,
        departmentId: this.departmentId,
        positionId: this.positionId,
        page: this.currentPage,
        limit: this.perPage,
        userId: this.userId,
        groupType: this.groupType
      }
      sessionStorage.setItem('hrTeamFilter', JSON.stringify(params))
      hrteamService.getAll(params)
        .then(async res => {
          if (res.data.success) {
            this.hrteams = res.data.data
            if (this.hrteams && this.hrteams.length > 0) {
              for (let i = 0; i < this.hrteams.length; i++) {
                this.hrteams[i].recruitment_jobs = await this.getListJobs(this.hrteams[i].recruitment_job_array)
              }
            }
            this.totalItems = res.data.total
            if (this.totalItems === 0) {
              this.hrteams = []
            }
          } else commonHelper.showMessage(res.data.mesage || 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'warning')
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau', 'warning')
        })
        .then(() => {
          this.loading = false
        })
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    },

    handleSelectProvinceManager (option, index) {
      let hasAll = option ? option.find(item => (+item.id === -1)) : true
      if (hasAll) {
        this.hrteams[index].province_id = ''
        this.hrteams[index].region = 'MN,MT,MB,HN,HCM'
        return
      }
      this.hrteams[index].province_id = option ? option.filter(val => +val.id).map(item => item.id).toString() : ''
      this.hrteams[index].region = option ? option.filter(val => !+val.id).map(item => item.id).toString() : ''
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : ''
    },

    handleSelectedDepartment: function (option) {
      this.departmentId = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    },

    handleSelectedMember (option, index) {
      this.hrteams[index].member_id = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedMemberSearch (option) {
      if (option instanceof Array) {
        this.userId = option ? option.map((item) => item.id).toString() : ''
        return
      }

      this.userId = option ? option.id : ''
    },

    handleSelectedRegion (option) {
      this.region = option ? option.id : null
    },

    selectGroupType (op) {
      this.groupType = op ? op.value : ''
    },

    deleteHrTeam (team) {
      if (!confirm(`Bạn có chắc chắn muốn xóa nhóm ${team.name} ?`)) {
        return
      }
      this.$startLoading()
      hrteamService.deleteHrTeam(team.id)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message || 'Xóa nhóm thành công', 'success')
            this.search()
          } else {
            commonHelper.showMessage(res.data.message || 'Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        })
        .then(() => {
          this.$stopLoading()
        })
    },

    quickUpdate (hrteam) {
      if (!hrteam || !hrteam.id) {
        commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        return
      }
      this.$startLoading()
      let dadtaSend = {
        id: hrteam.id,
        leaderIds: hrteam.leader_id.map(l => (l.id)).toString(),
        memberIds: hrteam.member_id,
        provinceIds: hrteam.province_id,
        regions: hrteam.region,
        quickEdit: true
      }

      hrteamService.updateHrTeam(dadtaSend)
        .then(res => {
          if (res.data.success) commonHelper.showMessage(res.data.message || 'Update thông tin nhóm thành công', 'success')
          else commonHelper.showMessage(res.data.message || 'Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        })
        .catch((e) => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        }).then(() => {
          this.$stopLoading()
        })
    },

    resetFilter () {
      this.region = null
      this.provinceId = ''
      this.stationId = ''
      this.moduleId = ''
      this.departmentId = ''
      this.positionId = ''
      this.teamName = ''
      this.userId = ''
      this.groupType = ''
      this.search()
    },

    async getListJobs (jobIds) {
      if (commonHelper.isEmpty(jobIds)) {
        return []
      }
      let listJobs = await recruitmentService.getAllJob()
      return listJobs.filter((op) => jobIds.includes(op.id))
    }
  }
}
</script>
