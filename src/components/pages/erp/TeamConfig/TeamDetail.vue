<template>
  <table class="w-100 simple-table">
    <!-- Quản lý  -->
    <tr>
      <th class="w-60">Quản lý ({{ numManager }})</th>
      <th class="w-20">Ngày vào team</th>
      <th class="w-20" v-if="teamId">Ngày rời team</th>
    </tr>
    <ListMemberDetail :members="configs.managers" :update="canUpdateMember"/>
    <AddMemberForm
      ref="formAddManager"
      v-if="canCreateMember"
      :loading="loadingManagerInfo"
      :memberAdded="memberAdded"
      @addMember="addMemberAction(...arguments, 'manager')"
      placeholder="Thêm quản lý"
    />
    <!-- Nhân viên  -->
    <tr>
      <th class="pt-2">Nhân viên ({{ numStaff }})</th>
      <th></th>
      <th v-if="teamId"></th>
    </tr>
    <ListMemberDetail :members="configs.staffs" :update="canUpdateMember"/>
    <AddMemberForm
      ref="formAddMember"
      v-if="canCreateMember"
      :loading="loadingMemberInfo"
      :memberAdded="memberAdded"
      @addMember="addMemberAction(...arguments, 'staff')"
      placeholder="Thêm thành viên"
    />
    <!-- Team con  -->
    <tr>
      <td colspan="10">
        <AddChildrenTeamForm
          v-if="canUpdateTeam"
          :children="configs.children"
          class="pt-2"
          :parentId="teamId"
          :updateTrigger="updateTrigger"
        />
      </td>
    </tr>
    <!-- techStack -->
    <tr>
      <td colspan="10" class="pt-2">
        <b>Công nghệ sử dụng:</b>
        <TechStack
          class="d-inline-block d-none"
          :skills="configs.techStack"
          :update="canUpdateTeam" department_id="2"
          :target="{ type: 'team', id: teamId }"
        />
      </td>
    </tr>
  </table>
</template>

<style scoped>
  .simple-table th, td {
    border: none;
    padding: 0;
    margin: 0;

  }
</style>

<script>
import SelectTeam from './SelectTeam'
import ListMemberDetail from './ListMemberDetail'
import AddMemberForm from './AddMemberForm'
import ListChildrenTeam from './ListChildrenTeam'
import AddChildrenTeamForm from './AddChildrenTeamForm'
import TechStack from './TechStack'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'TeamDetail',

  components: {
    SelectTeam,
    ListMemberDetail,
    AddMemberForm,
    ListChildrenTeam,
    AddChildrenTeamForm,
    TechStack
  },

  props: {
    updateTrigger: {},
    teamId: {},
    permissions: {},
    configs: {},
    edit: {
      default: false,
      type: Boolean
    }
  },

  data: _ => ({
    loadingMemberInfo: false,
    loadingManagerInfo: false
  }),

  computed: {
    helper: _ => helper,

    numChildTeam () {
      return this.configs.children ? this.configs.children.length : 0
    },

    numManager () {
      return this.configs.managers ? this.configs.managers.length : 0
    },

    numStaff () {
      return this.configs.staffs ? this.configs.staffs.length : 0
    },

    memberAdded () {
      return [...this.configs.staffs.map(mem => +mem.user_id), ...this.configs.managers.map(mem => +mem.user_id)]
    },

    canCreateMember () {
      return this.edit && this.permissions.create_member
    },

    canUpdateMember () {
      return this.edit && this.permissions.update_member
    },

    canDeleteMember () {
      return this.edit && this.permissions.delete_member
    },

    canUpdateTeam () {
      return this.edit && this.permissions.update_team
    },

    collapseIdChildTeam () {
      return 'list-child-team-' + this.teamId
    }
  },

  methods: {
    async addMemberAction (members, from, type = 'staff') {
      if (!members || !members.length) {
        alert('Vui lòng chọn thành viên')
        return
      }
      if (!from) {
        alert('Vui lòng chọn ngày vào team')
        return
      }

      // Lấy thông tin user
      if (type === 'staff') this.loadingMemberInfo = true
      else this.loadingManagerInfo = true
      const data = await Promise.all(members.map(member => teamConfigService.getUserInfo(member.id)))

      if (type === 'staff') this.loadingMemberInfo = false
      else this.loadingManagerInfo = false

      data.forEach((res, key) => {
        if (!res.data.success) {
          helper.showMessage('Không lấy được thông tin nhân viên này !')
          return
        }
        let userInfo = res.data.data
        // Check thêm thành viên trùng team
        if (userInfo.in_team && userInfo.in_team.length) {
          userInfo.in_team = userInfo.in_team.filter(team => !team.to && +team.id !== +this.teamId)
          if (userInfo.in_team && userInfo.in_team.length) {
            let msg = `Nhân viên ${userInfo.fullname} - ${userInfo.username} đã thuộc team:\n` +
              userInfo.in_team.map(team => `- ${team.name} từ ngày ${team.from}`).join('\n') +
              '\nBạn có muốn thêm nhân viên này vào team không?'
            if (!confirm(msg)) return
          }
        }

        // update giao diện
        userInfo.from = from
        userInfo.to = null
        userInfo.team_id = null
        if (type === 'manager') this.configs.managers.push(userInfo)
        else this.configs.staffs.push(userInfo)
      })

      this.$refs['formAddMember'].reset()
      this.$refs['formAddManager'].reset()
    },

    updateMemberAction (member) {
      if (!this.updateMember(this.teamId, member.user_id, {from: member.from, to: member.to})) {
        member.to = null
      }
    },

    async createMember (teamId, memberId, from) {
      const { data } = await teamConfigService.addMember(teamId, {member_id: memberId, from: from})
      if (data.success) {
        helper.showMessage(data.message, 'success')
        return data.data
      }
      helper.showMessage(data.message)
      return false
    },

    async updateMember (teamId, memberId, memberData) {
      const { updateMember } = await teamConfigService.updateMember(teamId, memberId, memberData)
      if (updateMember.success) {
        helper.showMessage(updateMember.message, 'success')
        return updateMember.data
      }

      helper.showMessage(updateMember.message)
      return false
    }
  }
}
</script>
