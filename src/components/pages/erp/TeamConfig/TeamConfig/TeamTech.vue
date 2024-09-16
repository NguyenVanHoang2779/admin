<template>
  <div>
    <div v-if="!showEdit" class="input-team d-flex justify-content-between align-items-center">
      <div class="tech">{{ team.skill !== null ? team.skill : 'Chưa có công nghệ sử dụng' }}</div>
      <span class="save-team-icon" @click="showEdit = true; skill = team.skill.trim()"><i class="fas fa-pencil-alt cursor-pointer" aria-hidden="true"></i></span>
    </div>
    <div v-else class="input-team team-bg-input d-flex justify-content-between align-items-center">
      <input @keyup.enter="submitEditSkill" class="input i-team" v-model="skill" type="text"
             placeholder="Nhập công nghệ sử dụng"/>
      <i v-if="loading" class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
      <span v-if="!loading" @click="showEdit = false; skill = team.skill" class="save-team-icon mr-4 ml-1"><i class="fa fa-times"
                                                                                         aria-hidden="true"></i></span>
      <span v-if="!loading" @click="submitEditSkill" class="save-team-icon"><i class="fa fa-check"
                                                                                      aria-hidden="true"></i></span>
    </div>
  </div>
</template>

<script>
import teamConfigService from 'domain/services/team-config-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'TeamTech',
  props: {
    team: {
      type: Object,
      require: true,
      default: _ => ({})
    }
  },
  data: () => ({
    skill: '',
    showEdit: false,
    loading: false
  }),
  computed: {
    helper: _ => helper
  },
  created () {
    this.skill = this.team.skill.trim()
  },
  methods: {
    async submitEditSkill () {
      this.loading = true
      await teamConfigService.updateSkillTeam({
        id: this.team.id,
        skill: this.skill.trim()
      })
        .then(response => {
          if (response.data.success) {
            if (this.skill === '') {
              this.team.skill = null
            } else {
              this.team.skill = this.skill.trim()
            }
            helper.showMessage(response.data.message, 'success')
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })

      this.loading = false
      this.showEdit = false
    }
  }
}
</script>

<style scoped lang="scss">
  .input-team {
    outline: 0;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    background: #f2f2f2;
  }

  .team-bg-input {
    background: #f2f2f2;
  }

  .input-team input {
    background: #fff;
    overflow-x: auto;
    width: 100%;
    box-sizing: border-box;
    padding: 7px;
    border: 1px #BDBDBD solid;
    border-radius: 4px;
  }
  i {
    color: #646363;
  }
  .tech {
    word-break: break-all;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
