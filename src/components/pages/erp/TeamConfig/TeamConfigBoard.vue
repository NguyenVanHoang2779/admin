<template>
  <div class="small-scrollbar">
    <b-row>
      <b-col md=6>
        <h5 class="mb-1">CƠ CẤU TEAM</h5>
      </b-col>
      <b-col md=6 class="text-right">
      </b-col>
    </b-row>

    <b-row class="my-2">
      <b-col md="3" sm="6" lg="3" class="mb-1">
        <SelectTeam v-model="filter.team_id" placeholder="Chọn team" @input="getTeamConfig()" multiple ref="select-team-filter"/>
      </b-col>
      <b-col md="3" sm="6" lg="3" class="mb-1">
        <!-- <SelectUser v-model="filter.user_id" placeholder="Chọn user" :multiple="false" /> -->
        <b-input v-model.trim="filter.username" placeholder="Họ tên/username" @keyup.enter="getTeamConfig()" ></b-input>
      </b-col>
      <b-col md="3" sm="6" lg="3" class="mb-1">
       <!-- <b-input v-model.trim="filter.team_name" placeholder="Tên team"></b-input> -->
       <SelectTechStack v-model="filter.tech_stack" department_id="2" placeholder="Chọn công nghệ sử dụng" @input="getTeamConfig()" multiple />
      </b-col>
      <b-col md="3" sm="6" lg="3" class="text-right">
        <b-btn variant="ghtk" @click="getTeamConfig()"><i class="fas fa-filter"></i> Tìm kiếm</b-btn>
        <b-btn variant="ghtk" @click="resetFilter()"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>
        <b-btn variant="outline-ghtk" @click="updateTeamAction()" v-if="permissions.create_team">
          <i class="fas fa-plus"></i> Thêm Team
        </b-btn>
      </b-col>
    </b-row>

    <table class="table table-hover table-bordered table-sm">
      <thead class="table-header-ghtk">
        <tr>
          <th class="text-center w-5">STT</th>
          <th class="w-10 cursor-pointer" @click="updateOrder('parent_team_order')">
            Team cha
            <OrderBtn :order="filter.parent_team_order" />
          </th>
          <th class="w-10 cursor-pointer" @click="updateOrder('team_order')">
            Tên team
            <OrderBtn :order="filter.team_order" />
          </th>
          <th class="text-left">Cơ cấu team</th>
          <th class="text-center w-5"></th>
        </tr>
      </thead>
      <tbody class="position-relative" v-loading="loading">
        <tr v-for="(team, idx) in teamConfig" :key="team.id">
          <td class="text-center">{{ 1+ idx + filter.perPage * (filter.page - 1) }}</td>
          <td>{{ team.parent_name }}</td>
          <td>{{ team.name }}</td>
          <td>
            <TeamDetail :configs="team.configs" :teamId="team.id" :edit="false" :permissions="permissions" />
          </td>
          <td class="text-center">
            <b-btn size="sm" v-if="permissions.update_team" variant="outline-success" title="Chỉnh sửa team" @click="updateTeamAction(team)">
              <i class="fas fa-pencil-alt"></i>
            </b-btn>
            <!-- <b-btn size="sm" v-if="permissions.delete_team" variant="outline-danger" title="Xóa team" @click="deleteTeamAction(team.id)">
              <i class="fas fa-trash-alt"></i>
            </b-btn> -->
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex align-items-center mt-3">
      <span class="text-center">{{`Trang ${filter.page} trên ` + Math.ceil(page.total/filter.perPage)}}</span>
      <b-pagination
        class="ml-2 paginator-ghtk my-0"
        size="sm"
        v-model="filter.page"
        :total-rows="page.total"
        :per-page="filter.perPage"
        @input="getTeamConfig"
      ></b-pagination>
    </div>

    <!-- Modal -->
    <b-modal static id="update-team" :title="current.team.id ? 'Cập nhật team' : 'Thêm team'" modal-class="modal-xl" hide-footer @hidden="checkUpdateTeam">
      <UpdateTeam :teamId="current.team.id" :resetTrigger="current.resetTrigger" @update="updateTeamOk"/>
    </b-modal>
  </div>
</template>

<style lang="css" scoped>

</style>

<script>

// custom component
import UpdateTeam from './UpdateTeam'
import TeamDetail from './TeamDetail'
import SelectTeam from './SelectTeam'
import SelectTechStack from './SelectTechStack'
import SelectUser from 'components/elements/common/SelectUser'
import OrderBtn from 'components/elements/common/OrderBtn'

// service
import teamConfigService from 'domain/services/team-config-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
// import Formula from 'domain/entities/Formula'

export default {
  name: 'list-team-config',

  components: {
    UpdateTeam,
    TeamDetail,
    SelectTeam,
    SelectUser,
    SelectTechStack,
    OrderBtn
  },

  created () {
    this.getTeamConfig()
  },

  data: () => ({
    loading: false,
    page: {
      total: 0
    },
    filter: {
      page: 1,
      perPage: 10,
      user_id: null,
      username: null,
      team_order: 'asc',
      parent_team_order: 'asc',
      tech_stack: null,
      team_id: null,
      team_name: null
    },
    teamConfig: [],
    current: {
      team: {},
      resetTrigger: false
    },
    permissions: {
      create_team: true,
      update_team: true,
      delete_team: true,
      update_member: true,
      delete_member: true,
      create_member: true
    }
  }),

  computed: {
    helper: _ => helper
  },

  methods: {
    deleteTeamAction (teamId) {
      if (!teamId) return

      const { data } = teamConfigService.deleteTeam(teamId)
      if (data.success) {
        helper.showMessage(data.message, 'success')
      } else helper.showMessage(data.message)
    },

    updateTeamAction (team) {
      this.current.team = team || {}
      this.current.resetTrigger = !this.current.resetTrigger
      this.$bvModal.show('update-team')
    },

    resetFilter () {
      this.filter.page = 1
      helper.resetData(this.filter, ['page', 'perPage', 'team_order', 'parent_team_order'])
      this.getTeamConfig()
    },

    async getTeamConfig () {
      let filter = {...this.filter}
      if (filter.user_id) filter.user_id = filter.user_id.id
      this.loading = true
      let { data } = await teamConfigService.getTeamConfig(filter)
      this.loading = false
      if (data.success) {
        this.page.total = data.data.total || 0
        data = data.data.data
        for (const team of data) {
          team.configs = {}
          team.configs.children = team.children || []
          team.configs.managers = team.members.filter(member => member.is_manager) || []
          team.configs.staffs = team.members.filter(member => !member.is_manager) || []

          delete team.members
          delete team.child_team
        }
        this.teamConfig = data
      } else helper.showMessage(data.message)
    },

    updateOrder (field) {
      if (!field) return
      if (!this.filter[field]) this.filter[field] = 'asc'
      else if (this.filter[field] === 'asc') this.filter[field] = 'desc'
      else if (this.filter[field] === 'desc') this.filter[field] = null

      this.getTeamConfig()
    },

    updateTeamOk (data) {
      if (data.success) {
        this.$bvModal.hide('update-team')
      }
    },

    checkUpdateTeam () {
      this.getTeamConfig()
      this.$refs['select-team-filter'].getListOption()
    }
  }
}
</script>
