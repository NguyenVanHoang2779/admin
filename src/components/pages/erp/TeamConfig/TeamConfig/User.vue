<template>
  <tr>
    <td>{{ index }}</td>
    <td>{{ user.username }}</td>
    <td>{{ user.fullname }}</td>
    <td>{{ user.position_name }}</td>
    <td>{{ user.duty_name }}</td>
    <td style="height: 40px;width: 120px">
      <div v-if="update">
        <b-select
          class="form-control"
          style="min-width: 120px;"
          v-model="userForm.position_key"
          :options="optionsPosition"
          :required="true"
        />
      </div>
      <div v-else>
              <span v-if="user.value === 'manager'">
                Quản lý
              </span>
        <span v-else>
                Thành viên
              </span>
      </div>
    </td>
    <td>
      <div style="min-width: 150px">
        <datepicker
          class="font-14"
          v-model="userForm.from"
          format="yyyy-MM-dd"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="true"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="true"
          v-if="update"
        />
        <span v-else>{{ helper.formatDate(user.from, 'YYYY-MM-DD') }}</span>
      </div>
    </td>
    <td>
      <div style="min-width: 150px">
        <datepicker
          class="font-14"
          v-model="userForm.to"
          format="yyyy-MM-dd"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="true"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="true"
          v-if="update"
        />
        <span v-else>{{ helper.formatDate(user.to, 'YYYY-MM-DD') }}</span>
      </div>
    </td>
    <td>
      <div v-if="update" class="text-center">
        <span v-if="loading"><i class="fas fa-spinner fa-pulse text-success"></i></span>
        <span v-if="!loading" @click="cancelUpdate" class="cursor-pointer pr-1"><i class="fa fa-times"
                                                                                   aria-hidden="true"></i></span>
        <span v-if="!loading" class="cursor-pointer" @click="submitUpdateUserTeam"><i class="fa fa-check"
                                                                                      aria-hidden="true"></i></span>
      </div>
      <div v-else>
        <div class="d-flex align-item-center justify-content-center">
          <span class="mr-1 action" @click="setUpdateUser(user)">Sửa</span>
          <span class="mr-1 action" @click="setRemoveUser(user)">Xóa</span>
          <div v-if="tab === 'default'" @click="setPositionUser(user)">
            <span class="action">Bổ nhiệm</span>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import teamConfigService from 'domain/services/team-config-service'
import {eventBus} from '@/main'
import helper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'User',
  components: {
    Datepicker
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    team: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    tab: {
      type: String,
      required: true
    }
  },
  watch: {
    tab () {
      this.update = false
    }
  },
  data () {
    return {
      userUpdate: {},
      optionsPosition: {
        member: 'Thành viên',
        manager: 'Quản lý'
      },
      userForm: {
        log_base_id: null,
        team_id: null,
        position_key: 'member',
        from: null,
        to: null
      },
      update: false,
      loading: false
    }
  },
  computed: {
    helper: _ => helper
  },
  methods: {
    setUpdateUser (user) {
      this.userUpdate = user
      this.userForm.position_key = user.value
      this.userForm.from = user.from
      this.userForm.to = user.to
      this.userForm.log_id = user.log_id
      this.userForm.team_id = this.team.id
      this.userForm.log_base_id = user.log_base_id
      this.update = true
    },
    async submitUpdateUserTeam () {
      this.loading = true
      this.userForm.from = helper.formatDate(this.userForm.from, 'YYYY-MM-DD')
      this.userForm.to = helper.formatDate(this.userForm.to, 'YYYY-MM-DD')
      await teamConfigService.updateMemberTeam(this.userForm)
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
    cancelUpdate () {
      this.userForm.value = this.userUpdate.value
      this.userForm.from = this.userUpdate.from
      this.userForm.to = this.userUpdate.to
      this.update = false
    },
    async setPositionUser (user) {
      this.$emit('setPositionUser', user)
    },
    setRemoveUser (user) {
      this.$emit('setDeleteLogUser', user)
    },
    checkToDate () {
      if (this.userForm.to && new Date(this.userForm.from).getTime() >= new Date(this.userForm.to).getTime()) {
        helper.showMessage('Ngày rời team không được nhỏ hơn ngày bắt đầu vào team')
        this.userUpdate.to = null
      }
    }
  }
}
</script>

<style scoped lang="scss">
i {
  color: #646363;
}

.action {
  -webkit-box-align: center;
  align-items: center;
  appearance: none;
  cursor: pointer;
  display: inline-flex;
  user-select: none;
  background-image: none;
  border: none;
  border-radius: 5px;
  white-space: nowrap;
  outline: 0px;
  text-align: center;
  margin: 0px;
  transition: background-color 50ms ease-in-out 0s, border-color 50ms ease-in-out 0s;
  padding: 4px 12px !important;
  color: rgb(33, 33, 33);
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 0px 0px 1px inset !important;
}
</style>
