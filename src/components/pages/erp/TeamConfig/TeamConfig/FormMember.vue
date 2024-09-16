<template>
  <div v-if="typeof team.id !== 'undefined'">
    <div class="form-group">
      <label for="">Chọn thành viên</label>
      <SelectUser v-model="users" multiple placeholder="Thêm thành viên"/>
    </div>
    <b-form-group label="Ngày vào team">
      <datepicker
        v-model="from"
        format="yyyy-MM-dd"
        :bootstrapStyling="true"
        :monday-first="true"
        :full-month-name="true"
        :calendar-button="true"
        calendar-button-icon="ion ion-md-calendar"
        :clear-button="true"
      />
    </b-form-group>
    <div class="form-group">
      <label for="">Vị trí trong team</label>
      <b-select
        v-model="positionKey"
        :options="optionsPosition"
        :required="true"
      />
    </div>
    <div class="mt-4">
      <b-btn variant="outline-ghtk" class="w-100" @click="addMember">
        Thêm thành viên
      </b-btn>
    </div>
    <b-modal id="modal-scrollable" class="modal-delete-team" scrollable
             hide-footer title="Bạn có chắc muốn thêm user đã ở trong team" v-model="confirmAddMember">
      <div class="mb-4">
        <ul class="list-group">
          <li class="list-group-item" v-for="(userInfo, index) in userConfirmInfo" :key="index">
            <b>{{userInfo.username}} - {{userInfo.fullname}} - {{userInfo.position_name}} - {{userInfo.station_name}}</b> đã vào team <b>{{userInfo.team_name}}</b> từ ngày <b>{{helper.formatDate(userInfo.from, 'YYYY-MM-DD')}}</b>
          </li>
        </ul>
      </div>
      <div class="mt-1">
        <ladda-btn
          data-style="zoom-out"
          class="btn btn-secondary float-right ml-1"
          @click.native="confirmAddMember = false"
        >
          Hủy
        </ladda-btn>

        <ladda-btn
          data-style="zoom-out"
          class="btn btn-success float-right"
          @click.native="submitAddMember"
        >
          Đồng ý
        </ladda-btn>
      </div>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import SelectUser from 'components/elements/common/SelectUser'
import helper from 'infrastructures/helpers/common-helpers'
import teamConfigService from 'domain/services/team-config-service'
import {eventBus} from '@/main'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'FormMember',
  components: {
    SelectUser,
    LaddaBtn,
    Datepicker
  },
  props: {
    team: {
      type: Object,
      required: true,
      sync: true
    },
    tab: {
      type: String,
      required: true
    }
  },
  watch: {
    tab () {
      this.users = []
      this.from = new Date().toISOString().split('T')[0]
    }
  },
  computed: {
    helper: _ => helper
  },
  data: _ => ({
    users: [],
    usersSubmit: [],
    from: new Date().toISOString().split('T')[0],
    optionsPosition: {
      member: 'Thành viên',
      manager: 'Quản lý'
    },
    positionKey: 'member',
    confirmAddMember: false,
    dataSend: [],
    userConfirmInfo: []
  }),
  methods: {
    async addMember () {
      if (!this.users || !this.users.length) {
        helper.showMessage('Vui lòng chọn thành viên')
        return
      }
      if (!this.from) {
        helper.showMessage('Vui lòng chọn ngày vào team')
        return
      }

      let dataSend = {
        id: this.team.id || null,
        add_member: []
      }

      this.users.forEach(mem => {
        dataSend.add_member.push({
          position_key: this.positionKey,
          member_id: mem.id,
          from: helper.formatDate(this.from, 'YYYY-MM-DD'),
          to: null
        })
      })

      await teamConfigService.infoUserInTeam(dataSend)
        .then(async response => {
          if (response.data.success) {
            this.dataSend = dataSend
            if (response.data.data.length > 0) {
              this.userConfirmInfo = response.data.data
              this.confirmAddMember = true
            } else {
              await this.submitAddMember()
            }
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    async submitAddMember () {
      await teamConfigService.addMemberTeam(this.dataSend)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.reset()
            eventBus.$emit('clickToTeam', this.team, false)
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
      this.confirmAddMember = false
    },
    reset () {
      this.users = []
      this.from = new Date().toISOString().split('T')[0]
      this.positionKey = 'member'
    }
  }
}
</script>

<style scoped>
  i {
    color: #646363;
  }
</style>
