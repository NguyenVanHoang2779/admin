<template>
<tbody>
  <tr>
    <th colspan="10" class="pt-2">
      <span @click="childTeamVisible = !childTeamVisible" class="text-underline-hover cursor-pointer">
        <!-- <i class="fas" :class="childTeamVisible ? 'fa-minus' : 'fa-plus'"></i> -->
        Team con ({{ numChildTeam }})
      </span>
    </th>
  </tr>
  <tr>
    <td colspan="10">
      <div v-show="childTeamVisible">
        <div v-for="(team, idx) in children" :key="team.id">
          <span class="text-ghtk-action text-underline-hover" @click="detailChildTeam(team)">{{ idx + 1 }}. {{ team.name }}</span>
          <!-- <i class="text-danger cursor-pointer fas fa-trash ml-1" @click="deleteChildTeam(team)" v-if="canDeleteMember"></i> -->
          <div class="ml-3 mb-2" v-if="team.configs">
            <TeamDetail
              :configs="team.configs"
              :teamId="team.id"
              :permissions="permissions"
              :edit="false"
              class="border border-dashed border-dark font-small"
            />
          </div>
        </div>
      </div>
    </td>
  </tr>
</tbody>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'ListChildrenTeam',

  components: {
    TeamDetail: () => import('./TeamDetail.vue')
  },

  props: {
    children: {
      type: Array,
      default: _ => ([])
    },
    permissions: {
      type: Object,
      default: _ => ({})
    }
  },

  data: _ => ({
    childTeamVisible: true
  }),

  computed: {
    numChildTeam () {
      return this.children.length
    }
  },

  methods: {
    async detailChildTeam (team) {
      let { data } = await teamConfigService.getTeamDetail(team.id)
      if (data.success) {
        data = data.data
        if (!team.configs) this.$set(team, 'configs', {})
        team.configs.children = data.detail.children || []
        team.configs.managers = data.members.filter(member => ['M1', 'M2', 'M3'].includes(member.ranking))
        team.configs.staffs = data.members.filter(member => !['M1', 'M2', 'M3'].includes(member.ranking))
        return
      }

      helper.showMessage(data.message || 'Lấy thông tin team con thất bại')
    }
  }
}
</script>
