<template>
  <div class="position-relative" v-loading="loading">
  <b-form-row>
    <b-form-group label="Tên team" class="col-md-12">
      <b slot="label" class="font-14">Tên team <span class="text-danger">*</span></b>
      <b-input v-model="teamDetail.name" @input="name => $emit('inputName', name)"></b-input>
    </b-form-group>
    <!-- <b-form-group label="Team cha(nếu có)" class="col-md-6">
      <SelectTeam v-model="teamDetail.parent_id" placeholder="Chọn team cha" />
    </b-form-group> -->
  </b-form-row>
  <TeamDetail
    :configs="teamDetail.configs"
    :permissions="permissions"
    :teamId="teamDetail.id"
    :updateTrigger="updateChildTeamTrigger"
    edit
  />
  <div class="text-center seperate mt-3" v-if="showUpdate">
    <b-btn variant="ghtk" class="mt-3" @click="updateTeamAction">{{ teamDetail.id ? 'Cập nhật' : 'Thêm team' }}</b-btn>
  </div>
</div>
</template>

<script>
import TeamDetail from './TeamDetail'
import SelectTeam from './SelectTeam'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'UpdateTeam',

  components: {
    TeamDetail,
    SelectTeam
  },

  props: {
    showUpdate: {
      default: true,
      type: Boolean
    },
    teamId: {},
    parentId: {},
    resetTrigger: {},
    updateTrigger: {}
  },

  data: _ => ({
    loading: false,
    updateChildTeamTrigger: false,
    teamDetail: {
      id: null,
      name: null,
      status: 'active',
      parent_id: null,
      configs: {
        managers: [],
        staffs: [],
        children: [],
        techStack: []
      }
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

  created () {
    if (this.teamId) this.getTeamDetail(this.teamId)
  },

  computed: {

  },

  watch: {
    resetTrigger () {
      helper.resetData(this.teamDetail, null, 2)
      if (this.teamId) this.getTeamDetail(this.teamId)
    },

    parentId: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (!this.teamDetail.parent_id) this.teamDetail.parent_id = this.parentId
      }
    },

    updateTrigger () {
      this.updateTeamAction()
    }
  },

  methods: {
    updateTeamAction () {
      if (!this.teamDetail.name) {
        alert('Vui lòng nhập tên team')
        return
      }

      if (this.teamDetail.configs.managers.length + this.teamDetail.configs.staffs.length < 1) {
        alert('Vui lòng thêm thành viên cho team')
        return
      }

      this.updateTeam()
    },

    async updateTeam () {
      let dataSend = {
        id: this.teamDetail.id || null,
        name: this.teamDetail.name,
        parent_id: this.teamDetail.parent_id,
        add_member: []
      }

      this.teamDetail.configs.managers.forEach(mem => {
        dataSend.add_member.push({
          is_manager: 1,
          member_id: mem.user_id,
          from: mem.from || null,
          to: mem.to || null
        })
      })
      this.teamDetail.configs.staffs.forEach(mem => {
        dataSend.add_member.push({
          is_manager: 0,
          member_id: mem.user_id,
          from: mem.from || null,
          to: mem.to || null
        })
      })
      const { data } = await teamConfigService.updateTeam(dataSend)
      this.$emit('update', data)
      if (data.success) {
        this.teamDetail.id = data.data.id
        helper.showMessage((dataSend.id ? 'Cập nhật team ' : 'Thêm team ') + `${this.teamDetail.name} thành công`, 'success')
        this.updateChildTeamTrigger = !this.updateChildTeamTrigger
        return data.data
      }

      helper.showMessage('Có lỗi khi ' + (dataSend.id ? 'cập nhật team ' : 'thêm team ') + `${this.teamDetail.name}: ${data.message}`)
      return false
    },

    async getTeamDetail (teamId) {
      this.loading = true
      const { data } = await teamConfigService.getTeamDetail(teamId)
      this.loading = false
      if (data.success) {
        this.teamDetail = {...this.teamDetail, ...(data.data.detail || {})}
        if (!this.teamDetail.configs) this.teamDetail.configs = {}
        this.teamDetail.configs.children = this.teamDetail.children || []
        this.teamDetail.configs.techStack = this.teamDetail.techStack || []
        this.teamDetail.configs.managers = data.data.members.filter(member => member.is_manager)
        this.teamDetail.configs.staffs = data.data.members.filter(member => !member.is_manager)
        return
      }

      helper.showMessage(data.message || 'Lấy thông tin team thất bại')
    }
  }
}
</script>
