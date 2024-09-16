<template>
  <div>
    <b-badge variant="ghtk" class="mr-1 skill cursor-pointer" v-for="(skill, idx) in skills" :key="idx">
      {{ skill.tag_name }}
      <slot name="delete-btn">
        <i class="fas fa-times delete-skill ml-1" title="Xóa kỹ năng" @click="removeSkillAction(skill)" v-if="update"></i>
      </slot>
    </b-badge>
    <span v-if="update" class="d-inline-block">
      <slot name="add-btn">
        <i class="fas fa-plus text-ghtk font-larger" title="Thêm kỹ năng" @click="addSkill" v-show="!showInput"></i>
      </slot>
      <div v-if="showInput" class="d-flex w-100">
        <b-select
          :options="listSkill"
          textField="tag_name"
          valueField="tag_id"
          @change="skillId => attackSkillAction(skillId)"
          size="sm"
        ></b-select>
        <b-btn size="sm" variant="danger" @click="showInput = false"><i class="fas fa-times"></i></b-btn>
      </div>
    </span>
  </div>
</template>

<style scoped>
  .delete-skill {
    display: none;
  }
  .skill:hover > .delete-skill {
    display: inline;
  }
</style>
<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'TechStack',

  components: {},

  props: {
    department_id: {},
    position_id: {},
    update: {
      type: Boolean,
      default: true
    },
    target: {
      type: Object,
      default: _ => ({
        id: null,
        type: 'user'
      })
    },
    skills: {
      type: Array,
      default: _ => ([])
    }
  },

  data: _ => ({
    showInput: false,
    listSkill: []
  }),

  methods: {
    addSkill () {
      this.getListSkill(this.department_id, this.position_id)
      this.showInput = true
    },

    async getListSkill (departmentId, positionIds) {
      if (positionIds) {
        if (!Array.isArray(positionIds)) positionIds = [positionIds]
      } else positionIds = []

      const {data} = await teamConfigService.getListSkill({department_id: departmentId, position_ids: positionIds})
      if (data.success) {
        this.listSkill = data.data
        return
      }

      helper.showMessage(data.message || 'Có lỗi khi lấy danh sách kỹ năng')
      this.listSkill = []
    },

    async attackSkillAction (skillId) {
      if (this.target && this.target.id && this.target.type) {
        const {data} = await teamConfigService.updateSkill({target: this.target, tags_add: [skillId]})

        if (data.success) {
          helper.showMessage('Gán kỹ năng thành công', 'success')
          let skill = this.listSkill.find(s => +s.tag_id === +skillId)
          if (skill) this.skills.push(skill)
          return
        }

        helper.showMessage('Có lỗi khi gán kỹ năng: ' + data.message)
      } else {
        let skill = this.listSkill.find(s => +s.tag_id === +skillId)
        if (skill) this.skills.push(skill)
      }
    },

    async removeSkillAction (skill) {
      if (this.target && this.target.id && this.target.type) {
        const {data} = await teamConfigService.updateSkill({target: this.target, tags_remove: [skill.tag_id]})

        if (data.success) {
          helper.showMessage('Xóa kỹ năng thành công', 'success')
          let idx = this.skills.findIndex(s => +s.tag_id === +skill.tag_id)
          this.skills.splice(idx, 1)
          return
        }

        helper.showMessage('Có lỗi khi xóa kỹ năng: ' + data.message)
        return false
      } else {
        let idx = this.skills.findIndex(s => +s.tag_id === +skill.tag_id)
        this.skills.splice(idx, 1)
      }
    }
  }
}
</script>
