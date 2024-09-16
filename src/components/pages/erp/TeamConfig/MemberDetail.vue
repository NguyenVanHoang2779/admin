<template>
  <tr>
    <td>
      {{ idx }}. {{ member.fullname }} ({{ member.username }}) - {{ member.position_name }} - {{ member.duty_name }} - {{ member.level }}({{ member.ranking }})
      <!-- <router-link
        v-if="update"
        class="text-ghtk cursor-pointer fas fa-pencil-alt ml-1"
        :to="{ name: 'edit-user', params: { id: member.user_id } }"
        target="_blank"
      ></router-link> -->
      <!-- <i class="text-danger cursor-pointer fas fa-trash ml-1" @click="deleteMember(manager)" v-if="canDeleteMember"></i> -->
    </td>
    <td>
      <input type="date" v-model="member.from" class="form-control form-control-sm font-14 pl-0 border-0" v-if="update" @input="checkToDate" />
      <span v-else>{{ helper.formatDate(member.from) }}</span>
    </td>
    <td>
      <div v-if="update" class="d-flex justify-content-between align-items-center">
        <input v-show="!!member.to" type="date" v-model="member.to" class="form-control form-control-sm font-14 pl-0 border-0" @input="checkToDate" />
        <b-btn v-show="!member.to && member.team_id" size="sm" @click="member.to = new Date().toISOString().split('T')[0]" variant="outline-ghtk">Rời team</b-btn>
        <i v-show="!member.team_id" class="fas fa-times text-danger font-large float-right" @click="$emit('delete')"></i>
      </div>
      <span v-else>{{ helper.formatDate(member.to) }}</span>
    </td>
    <!-- <td>
      <b-badge variant="ghtk" class="mr-1 skill cursor-pointer" v-for="(skill, idx) in member.skills || []" :key="idx">
        {{ skill.tag_name }}
        <i class="fas fa-times delete-skill ml-1 text-danger" title="Xáo kỹ nằng" @click="removeSkillAction(skill)" v-if="update"></i>
      </b-badge>
      <span v-if="update">
        <i class="fas fa-plus text-ghtk" title="Thêm kỹ năng" @click="addSkill" v-show="!showInputSkill"></i>
        <div v-if="showInputSkill" class="d-flex w-100">
          <b-select
            :options="listSkill"
            textField="tag_name"
            valueField="tag_id"
            @change="skillId => attackSkillAction(skillId)"
            size="sm"
          ></b-select>
          <b-btn size="sm" variant="danger"><i class="fas fa-times" @click="showInputSkill = false"></i></b-btn>
        </div>
      </span>
    </td> -->
  </tr>
</template>

<style scoped>
  .delete-skill {
    display: none;
  }
  .skill:hover > .delete-skill {
    display: inline;
  }
  td {
    border: none;
    padding: 0;
    margin: 0;

  }
</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'member-detail',

  props: {
    idx: {
      default: '-'
    },
    member: {
      type: Object,
      default: _ => ({})
    },
    update: {
      type: Boolean,
      default: true
    }
  },

  data: _ => ({
    showInputSkill: false,
    listSkill: []
  }),

  computed: {
    helper: _ => helper
  },

  methods: {
    addSkill () {
      this.getListSkill(this.member.department_id, this.member.position_id)
      this.showInputSkill = true
    },

    async getListSkill (departmentId, positionId) {
      const {data} = await teamConfigService.getListSkill({department_id: departmentId, position_ids: [positionId]})
      if (data.success) {
        this.listSkill = data.data
        return
      }

      helper.showMessage(data.message || 'Có lỗi khi lấy danh sách kỹ năng')
      this.listSkill = []
    },

    async attackSkillAction (skillId) {
      const {data} = await teamConfigService.updateSkill({user_id: this.member.user_id, tags_add: [skillId]})

      if (data.success) {
        helper.showMessage('Gán kỹ năng thành công', 'success')
        let skill = this.listSkill.find(s => +s.tag_id === +skillId)
        if (skill) this.member.skills.push(skill)
        return
      }

      helper.showMessage('Có lỗi khi gán kỹ năng')
    },

    async removeSkillAction (skill) {
      const {data} = await teamConfigService.updateSkill({user_id: this.member.user_id, tags_remove: [skill.tag_id]})

      if (data.success) {
        helper.showMessage('Xóa kỹ năng thành công', 'success')
        let idx = this.member.skills.findIndex(s => +s.tag_id === +skill.tag_id)
        this.member.skills.splice(idx, 1)
        return
      }

      helper.showMessage('Có lỗi khi xóa kỹ năng')
      return false
    },

    checkToDate (date) {
      if (this.member.to && new Date(this.member.from).getTime() >= new Date(this.member.to).getTime()) {
        helper.showMessage('Ngày rời team không được nhỏ hơn ngày bắt đầu vào team')
        this.member.to = null
      }
    }
  }
}
</script>
