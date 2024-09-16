<template>
  <div class="w-100" v-loading="loading">
    <div>
      <b-tabs
        active-nav-item-class="text-success"
      >
        <b-tab title="Hiện tại" @click="setDefaultTab" :active="tab === 'default'"></b-tab>
        <b-tab title="Quá trình" @click="setHistoryTab" :active="tab === 'history'"></b-tab>
        <b-tab title="Timeline" @click="setTimeLineTab" :active="tab === 'timeline'"></b-tab>
      </b-tabs>
    </div>
    <div style="min-width: 100%;overflow-x: auto;" v-if="tab === 'default' || tab === 'history'">
      <table class="table table-hover" style="min-width: 60rem">
        <thead>
        <tr>
          <th>STT</th>
          <th>Tài khoản</th>
          <th>Họ tên</th>
          <th>Vị trí</th>
          <th>Chức vụ</th>
          <th>Vị trí trong team</th>
          <th>Từ ngày</th>
          <th>Đến ngày</th>
          <th class="text-center">Thao tác</th>
        </tr>
        </thead>
        <tbody>
        <User
          v-for="(user, index) in users" :key="index"
          :user="user"
          :index="++index"
          :tab="tab"
          :team="team"
          @setPositionUser="setPositionUser"
          @setDeleteLogUser="setDeleteLogUser"
        />
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
          @input="handlePaginate"
        ></b-pagination>
      </div>
    </div>
    <TimeLine
      v-if="tab === 'timeline'"
      :team.sync="team"
    />
    <b-modal id="modal-scrollable" class="modal-delete-team" scrollable
             hide-footer :title="'Cài đặt vai trò trong team cho ' + userPosition.username" v-model="showModalPositionUser">
      <div class="form-group">
        <b-form-group label="Vị trí mới trong team">
          <b-select
            class="form-control"
            v-model="positionUserForm.position"
            :options="positionsInTeam"
            :required="true"
          />
        </b-form-group>
        <b-form-group label="Ngày bắt đầu vị trí mới">
          <datepicker
            v-model="positionUserForm.from"
            format="yyyy-MM-dd"
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
        </b-form-group>
      </div>
      <div class="mt-1">
        <ladda-btn
          data-style="zoom-out"
          class="btn btn-secondary float-right ml-1"
          @click.native="cancelUpdatePositionUser"
        >
          Hủy
        </ladda-btn>

        <ladda-btn
          data-style="zoom-out"
          class="btn btn-success float-right"
          @click.native="submitUpdatePositionUser"
        >
          Đồng ý
        </ladda-btn>
      </div>
    </b-modal>
    <b-modal id="modal-scrollable" class="modal-delete-team" scrollable
             hide-footer title="Bạn có chắc muốn xóa bản ghi này không" v-model="showModalDelete" v-if="Object.keys(userLog).length > 0">
      <div class="form-group">
        <b>{{userLog.username}} - {{userLog.fullname}} - {{userLog.position_name}} - {{userLog.duty_name}}</b> có vị trí {{ userLog.value === 'manager' ? 'Quản lý' : 'Thành viên' }} từ ngày {{ userLog.from }} <span v-if="userLog.to">đến ngày {{ userLog.to }}</span>
      </div>
      <div class="mt-1">
        <ladda-btn
          data-style="zoom-out"
          class="btn btn-secondary float-right ml-1"
          @click.native="showModalDelete = false"
        >
          Hủy
        </ladda-btn>

        <ladda-btn
          data-style="zoom-out"
          class="btn btn-success float-right"
          @click.native="submitRemoveLogUser"
        >
          Đồng ý
        </ladda-btn>
      </div>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import helper from 'infrastructures/helpers/common-helpers'
import User from './User.vue'
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import teamConfigService from 'domain/services/team-config-service'
import {eventBus} from '@/main'
import TimeLine from './TimeLine.vue'

export default {
  name: 'ListUser',
  components: {
    TimeLine,
    User,
    Datepicker,
    LaddaBtn
  },
  props: {
    team: {
      type: Object,
      required: true,
      sync: true
    }
  },
  computed: {
    helper: _ => helper
  },
  created () {
    this.setDefaultTab()
  },
  data () {
    return {
      tab: 'default',
      users: [],
      positionsInTeam: {
        member: 'Thành viên',
        manager: 'Quản lý'
      },
      update: false,
      userPosition: {},
      showModalPositionUser: false,
      showModalDelete: false,
      positionUserForm: {
        from: new Date(),
        position: ''
      },
      usersActive: [],
      usersHistory: [],
      page: {
        total: 0
      },
      filter: {
        page: 1,
        perPage: 10
      },
      userLog: {}
    }
  },
  methods: {
    async handlePaginate () {
      if (this.tab === 'default') {
        await this.setDefaultTab()
      } else if (this.tab === 'history') {
        await this.setHistoryTab()
      }
    },
    async setDefaultTab () {
      this.tab = 'default'
      await this.getUserActiveByTeam()
      this.users = this.usersActive
    },
    async setHistoryTab () {
      this.tab = 'history'
      await this.getUserHistoryByTeam()
      this.users = this.usersHistory
    },
    setTimeLineTab () {
      this.tab = 'timeline'
    },
    setPositionUser (user) {
      this.userPosition = user
      this.showModalPositionUser = true
      this.resetForm()
    },
    cancelUpdatePositionUser () {
      this.showModalPositionUser = false
      this.userPosition = {}
      this.resetForm()
    },
    resetForm () {
      this.positionUserForm.from = new Date()
      this.positionUserForm.position = 'member'
    },
    async getUserActiveByTeam () {
      this.loading = true
      this.filter.id = this.team.id
      await teamConfigService.getUserActiveByTeam(this.filter)
        .then(response => {
          if (response.data.success) {
            this.page.total = response.data.data.total || 0
            this.usersActive = response.data.data.data
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
      this.loading = false
    },
    async getUserHistoryByTeam () {
      this.loading = true
      this.filter.id = this.team.id
      await teamConfigService.getUserHistoryByTeam(this.filter)
        .then(response => {
          if (response.data.success) {
            this.page.total = response.data.data.total || 0
            this.usersHistory = response.data.data.data
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
      this.loading = false
    },
    async submitUpdatePositionUser () {
      if (this.positionUserForm.position === this.userPosition.value) {
        helper.showMessage('User đang có vị trí này trong team', 'error')
        return
      }
      const data = {
        log_id: this.userPosition.log_id,
        team_id: this.team.id,
        from: helper.formatDate(this.positionUserForm.from, 'YYYY-MM-DD'),
        position: this.positionUserForm.position
      }
      this.loading = true
      await teamConfigService.updatePositionMember(data)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            eventBus.$emit('clickToTeam', this.team, false)
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })
      this.loading = false
    },
    setDeleteLogUser (user) {
      this.userLog = user
      this.showModalDelete = true
    },
    async submitRemoveLogUser () {
      this.loading = true
      await teamConfigService.deleteMember(this.userLog.log_id)
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            eventBus.$emit('clickToTeam', this.team, false)
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
          this.searchResult = []
        })
      this.userLog = {}
      this.showModalDelete = false
      this.loading = false
    }
  }
}
</script>

<style scoped>
  i {
    color: #646363;
  }
  thead th {
    white-space: nowrap;
  }
  * {
    font-size: 0.894rem;
  }
</style>
