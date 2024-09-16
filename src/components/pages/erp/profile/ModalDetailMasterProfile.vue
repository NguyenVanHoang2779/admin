<template>
  <div>
    <b-modal id="modal-detail" hide-footer ref="myModalRef" @show="loading = true" @shown="getUsersByMasterProfileId" @hidden="resetDefault" static modal-class="modal-lg-custom">
      <div slot="modal-title">
        Danh sách tất cả user của master profile
      </div>
      <div class="mb-3" v-if="users.length > 0">
        <table class="table mb-0 table-bordered table-sm">
          <thead>
            <tr>
              <th>UserId</th>
              <th>username</th>
              <th>Mã COD</th>
              <th>Trạng thái</th>
              <th>Vị trí</th>
              <th>Loại hình làm việc</th>
              <th>Kho</th>
              <th>Chức vụ</th>
              <th>Tài khoản chính</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :class="[user.main_profile_id === user.profileId ? 'table-danger' : '']" :key="index">
              <td>{{user.userId}}</td>
              <td>
                <p
                  :class="codGroupIds.includes(parseInt(user.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                  class="member-info-item"
                  @click="gotoCodProfile(user.group_id, user.userId)">
                  {{ user.username }}</p>
                </td>
              <td>{{user.codAlias}}</td>
              <td>{{ getUserStatusName(user.status_id) }}</td>
              <td>{{user.positionName}}</td>
              <td>{{user.work_type_description}}</td>
              <td>{{user.stationName}}</td>
              <td>{{ user.duty }}</td>
              <td class="text-center">
                <i v-if="user.main_profile_id === user.profileId" class="fa fa-check-circle main-user"></i>
              </td>
              <td>
                <router-link :to="{ name: 'edit-user', params: { id: user.userId } }" class="btn btn-outline-secondary btn-sm"><i class="ion ion-md-create"></i></router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="loading">
        Dữ liệu đang loading...
      </div>
      <div class="text-center">
        <b-btn class="btn btn-outline-secondary" @click="hideModal">Đóng</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import profileService from 'domain/services/profile-service'
import ManageListCod from 'domain/entities/ManageListCod'

import User from 'domain/entities/User'
export default {
  name: 'modal-detail-master-profile',

  components: {
  },

  props: [
    'masterProfileId'
  ],

  data: () => ({
    users: [],
    loading: false,
    codGroupIds: ManageListCod.codGroupIds
  }),

  created () {
  },

  watch: {
  },

  methods: {
    hideModal () {
      this.$refs.myModalRef.hide()
    },

    gotoCodProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    },

    getUsersByMasterProfileId: function () {
      let params = {
        id: this.masterProfileId
      }
      profileService.getUsersByMasterProfileId(params)
        .then((res) => {
          if (res.data.success) {
            this.users = res.data.data
            this.loading = false
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getUserStatusName (statusId) {
      return User.getStatusName(statusId)
    },

    resetDefault: function () {
      this.users = []
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-user {
    color: green;
    font-size: 20px;
  }
</style>
