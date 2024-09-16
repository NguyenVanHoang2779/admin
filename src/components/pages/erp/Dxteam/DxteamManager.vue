<template>
    <div class="work-schedule-config">
        <div class="ui-block">
            <b-row>
                <b-col md="6">
                    <h4 class="ui-block-heading" style="display: inline-flex">Chuyển đổi tài khoản DTeam</h4>
                </b-col>
                <b-col md="6" class="text-right">
                    <b-btn variant="outline-success" v-b-modal.modal-config-plan-swap>
                        Cấu hình lịch chuyển tài khoản
                    </b-btn>
                </b-col>
            </b-row>
        </div>
        <hr>
        <div class="mt-2">
            <b-row>
                <b-col md="2">
                    <single-select-province @keyup.enter="search()" :custom-class="''" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                </b-col>
                <b-col md="2">
                    <single-select-station
                        :is-disabled="!permissionAll()"
                        @keyup.enter="search()"
                        :custom-class="''"
                        :provinceId="provinceId"
                        :stationId="userInfo && userInfo.hasOwnProperty('Station') && !permissionAll() ? userInfo.Station.id : null"
                        @handleSelectedStation="handleSelectedStation">
                    </single-select-station>
                </b-col>
                <b-col md="2">
                    <b-form-select v-model="userType" :options="UserOptions"></b-form-select>
                </b-col>
                <b-col md="2">
                    <b-form-input v-model="keyword" class="only-bottom-border" placeholder="Nhập tên, usermame" @keyup.enter="search()" >
                    </b-form-input>
                </b-col>
                <b-col class="text-right">
                    <b-button class="btn btn-primary" @click="search()">Tìm kiếm</b-button>
                </b-col>
            </b-row>
        </div>
        <div class="mt-3 mb-3">
            <div class="" v-loading="appLoading">
                <table class="table table-hover table-bordered table-vertical">
                    <thead class="thead-dark">
                    <tr>
                        <th>STT</th>
                        <th>Tỉnh</th>
                        <th>Kho</th>
                        <th>Họ và tên</th>
                        <th>Username</th>
                        <th>Tài khoản active</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(user, index) in listUser" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{user.province}}</td>
                        <td>{{user.station}}</td>
                        <td>{{user.fullname}}</td>
                        <td>{{user.username}}</td>
                        <td>
                            <b-form-select v-model="user.status_id" :options="statusOptions" @change="updateUser(user)"></b-form-select>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="mt-3" v-if="totalPages > 1">
                    <b-row>
                        <b-col md="6">
                            <b-pagination
                                    :total-rows="totalItems"
                                    v-model="currentPage"
                                    :per-page="perPage"
                                    v-on:input="getUsers()"
                            />
                        </b-col>
                        <b-col md="6">
                            <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                        </b-col>
                    </b-row>
                </div>
                <modal-config-plan-swap></modal-config-plan-swap>
            </div>
        </div>
    </div>
</template>

<script>
// service
import profileService from 'domain/services/profile-service'

// component
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import ModalConfigPlanSwap from './ModalConfigPlanSwap'
import VueMonthlyPicker from 'vue-monthly-picker'
import commonHelper from 'infrastructures/helpers/common-helpers'

// entities
import { mapGetters } from 'vuex'

export default {
  name: 'DteamManager',
  components: {
    SingleSelectProvince,
    SingleSelectStation,
    ModalConfigPlanSwap,
    VueMonthlyPicker
  },
  data: () => ({
    appLoading: false,
    statusOptions: {
      2: 'Dx',
      3: 'Dteam'
    },
    userType: null,
    UserOptions: [
      { value: null, text: 'Loại tài khoản active' },
      { value: 2, text: 'Dx' },
      { value: 3, text: 'Dteam' }
    ],
    provinceId: null,
    stationId: null,
    keyword: null,
    listUser: [],
    currentPage: 1,
    totalItems: 0,
    perPage: 10
  }),

  created () {
    this.getUsers()
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {},

  methods: {
    permissionAll () {
      if (this.userInfo && this.userInfo.hasOwnProperty('Group')) {
        if ([19].includes(+this.userInfo.Group.id)) {
          return false
        }
      }
      return true
    },

    search () {
      this.currentPage = 1
      this.getUsers()
    },

    getUsers () {
      this.appLoading = true
      let params = {
        provinceId: this.provinceId,
        stationId: this.stationId,
        keyword: this.keyword,
        userType: this.userType,
        page: this.currentPage,
        limit: this.perPage
      }
      profileService.getListUserSwapDxteam(params)
        .then(res => {
          if (res.data.success) {
            this.listUser = res.data.data.data
            this.totalItems = res.data.data.count
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    updateUser (user) {
      let data = {
        masterProfileId: user.master_profile_id,
        userId: user.user_id,
        status_id: user.status_id
      }
      profileService.swapUserDxteam(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            this.getUsers()
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : null
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : null
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
