<template>
  <div class="update-master-profile">
    <div class="ui-block">
      <h4 class="ui-block-heading">Cập nhật profile chính của nhân viên</h4>
      <hr>
      <div class="mb-3">
        <b-row>
          <b-col md="2">
            <b-input placeholder="CMND/Hộ chiếu" v-model="cmnd" type="number" min="9" max="12"/>
          </b-col>
          <b-col md="2">
            <b-input type="text" placeholder="Nhập thông tin user" v-model="username"/>
          </b-col>
          <b-col>
            <single-select-station @handleSelectedStation="handleSelectedStation"></single-select-station>
          </b-col>
          <b-col>
            <single-select-department @handleSelectedDepartment="handleSelectedDepartment"></single-select-department>
          </b-col>
          <b-col>
            <single-select-position @handleSelectedPosition="handleSelectedPosition" :department-id="departmentId"></single-select-position>
          </b-col>
          <b-col>
            <b-btn type="button" variant="primary" @click="currentPage = 1; search();"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <h6 class="mb-1">1. Tìm kiếm các tài khoản của User</h6>
        <div class="pl-3">
          <b-card no-body v-if="users.length > 0">
            <table class="table mb-0 table-bordered">
              <thead>
              <tr>
                <th>STT</th>
                <th>username</th>
                <th>fullname</th>
                <th>CMND</th>
                <th>Vị trí</th>
                <th>Loại hình làm việc</th>
                <th>Kho</th>
                <th>Chọn profile</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users">
                  <td>{{index + 1}}</td>
                  <td>{{user.username}}</td>
                  <td>{{user.fullname}}</td>
                  <td>{{user.cmnd}}</td>
                  <td>{{user.positionName}}</td>
                  <td>{{user.work_type_description}}</td>
                  <td>{{user.stationName}}</td>
                  <td>
                    <b-form-group>
                      <b-form-checkbox-group v-model="usersSelected">
                        <b-form-checkbox :value="user"></b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
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
                    v-on:input="search"
                  />
                </b-col>
                <b-col md="6">
                  <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                </b-col>
              </b-row>
            </div>
          </b-card>
          <div v-if="appLoading === false && users.length === 0 && firstTime === false">
            <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy user phù hợp.</span>
          </div>
        </div>
      </div>
      <div>
        <h6 class="mb-1">2. Chọn profile chính</h6>
        <div class="pl-3">
          <b-card no-body v-if="usersSelected.length > 0">
            <table class="table mb-0 table-bordered">
              <thead>
              <tr>
                <th>STT</th>
                <th>username</th>
                <th>fullname</th>
                <th>CMND</th>
                <th>Vị trí</th>
                <th>Loại hình làm việc</th>
                <th>Kho</th>
                <th>Chọn profile</th>
                <th>Chọn profile chính</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in usersSelected">
                  <td>{{index + 1}}</td>
                  <td>{{user.username}}</td>
                  <td>{{user.fullname}}</td>
                  <td>{{user.cmnd}}</td>
                  <td>{{user.positionName}}</td>
                  <td>{{user.work_type_description}}</td>
                  <td>{{user.stationName}}</td>
                  <td>
                    <b-form-group>
                      <b-form-checkbox-group v-model="usersSelected">
                        <b-form-checkbox :value="user"></b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </td>
                  <td>
                    <b-form-group>
                      <b-form-radio-group v-model="mainProfileSelected">
                        <b-form-radio :value="user.profileId"></b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                  </td>
                </tr>
              </tbody>
            </table>
            <b-row class="mt-3 mb-3">
              <b-col md="2" offset-md="10"><b-btn class="btn btn-outline-primary" @click="updateMasterProfile">Xác nhận</b-btn></b-col>
            </b-row>
          </b-card>
        </div>
        <div v-if="firstTime">
        </div>
        <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .update-master-profile .form-group {
      margin-bottom: 0;
    }
</style>

<script>
import profileService from 'domain/services/profile-service'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'

export default {
  name: 'master-profile-manager',
  components: {
    SkRotatingPlane,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectDepartment
  },

  data: () => ({
    username: '',
    cmnd: '',
    stationId: '',
    departmentId: '',
    positionId: '',
    users: [],
    usersSelected: [],
    mainProfileSelected: null,
    uncheckUser: false,
    appLoading: false,
    firstTime: true,
    currentPage: 1,
    totalItems: 0,
    perPage: 5
  }),

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    usersSelected: function (newValue, oldValue) {
      let callBack = (item) => {
        return item.id === this.mainProfileSelected
      }
      let isMaster = newValue.filter((item) => callBack(item))
      if (isMaster.length === 0) {
        this.mainProfileSelected = null
      }
    }
  },

  methods: {
    search: function () {
      if (!this.validate()) {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo lỗi',
          text: 'CMND phải nhập đủ hoặc username phải nhập ít nhất 3 kí tự'
        })
        return
      }
      this.appLoading = true
      let params = {
        cmnd: this.cmnd,
        username: this.username,
        stationId: this.stationId,
        departmentId: this.departmentId,
        positionId: this.positionId,
        page: this.currentPage,
        limit: this.perPage
      }
      profileService.getUserList(params)
        .then(res => {
          if (res.data.success) {
            this.users = res.data.data.data
            this.totalItems = res.data.data.total
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
      this.firstTime = false
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : ''
    },

    handleSelectedDepartment: function (option) {
      this.departmentId = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    },

    validate: function () {
      let isOkCmnd = this.cmnd.length === 0 || (this.cmnd.length === 9 || this.cmnd.length === 12)
      let isOkUsername = this.username.length === 0 || this.username.length >= 3
      if (!(isOkCmnd && isOkUsername)) {
        return false
      }
      return true
    },

    updateMasterProfile: function (option) {
      let userIds = this.usersSelected.map((item) => item.userId)
      let params = {
        userIds: userIds,
        mainProfileId: this.mainProfileSelected
      }
      profileService.updateMainProfile(params)
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo thành công',
              text: 'Đã xác nhận profile chính thành công'
            })
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo lỗi',
              text: res.data.message
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  },
  created () {
  }
}
</script>
