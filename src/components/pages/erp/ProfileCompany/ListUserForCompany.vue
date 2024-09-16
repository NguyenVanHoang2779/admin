<template>
    <div class="table-responsive">
        <div class="search-user">
            <div class="row">
                <div class="col-4">
                    <b-form-input class="only-bottom-border" style="max-width: 600px; padding-right: 35px;"
                                  v-model="searchText"
                                  placeholder="Nhập username hoặc biển số xe được gán"
                                  @keyup.enter.native="searchUser">
                    </b-form-input>
                    <b-btn class="button-remove" @click="resetListUser">
                        <i font-size: style="font-size: 20px" class="icon ion-ios-close remove-text" ></i>
                    </b-btn>
                </div>
                <div class="col-2">
                    <b-form-select v-model="selectUserStatus" :options="statusOptions"></b-form-select>
                </div>
                <div class="col-6">
                    <button class="btn btn-success" style="" @click="searchUser()" >Tìm kiếm</button>
                </div>
            </div>
        </div>
        <table class="table b-table table-striped table-hover" aria-rowcount="100">
            <thead class="">
            <tr>
                <th>STT</th>
                <th aria-colindex="1" class="">UserId</th>
                <th aria-colindex="2" class="">username</th>
                <th aria-colindex="2" class="">Mã COD</th>
                <th aria-colindex="4" class="">Ngày tạo</th>
                <th aria-colindex="4" class="">Xe được gán</th>
                <th aria-colindex="4" class="">Trạng thái</th>
                <th aria-colindex="4" class="">Action</th>
            </tr>
            </thead>
            <tbody class="">
            <tr class="" v-for="(user, index) in currentUserOfPage">
                <td>{{ index  + perPage * currentPage - 9 }}</td>
                <td class="">{{ user.id }}</td>
                <td class="">{{ user.username }}</td>
                <td class="">{{ user.alias }}</td>
                <td class="">{{ convertTime(user.created) }}</td>
                <td class="">
                    <b-form-group v-if="parseInt(user.position_job) === 99">
                        <b-input-group>
                            <single-select-truck
                                    v-model="order"
                                    :show-info="true"
                                    @handleChooseTruck="handleChooseTruck($event, index)"
                                    :truck-order="user.order"
                                    :list-vehicles.sync="listVehicles"
                            >
                            </single-select-truck>
                        </b-input-group>
                    </b-form-group>
                </td>
                <td class="">
                    <b-form-select v-model="user.status_id" :options="statusOptions"></b-form-select>
                </td>
                <td class="">
                    <ladda-btn :loading="isUpdatingStatus[index]" @click.native="updateStatus(user.id)" data-style="zoom-out" class="btn btn-outline-primary">
                        Thay đổi trạng thái
                    </ladda-btn>
                    <span v-if="parseInt(user.position_job) === 99">
                        <ladda-btn  @click.native="mapTruckAndUser(user.id, order[index], true)" data-style="zoom-out" class="btn btn-outline-primary" v-if="!user.order">
                            Gán xe
                        </ladda-btn>
                        <ladda-btn @click.native="mapTruckAndUser(user.id, null, false)" data-style="zoom-out" class="btn btn-outline-danger" v-else>
                            Hủy gán xe
                        </ladda-btn>
                    </span>
                    <router-link :to="{name: 'edit-user-company', params: { id: user.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
                </td>
            </tr>
            </tbody>
        </table>
        <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
        ></b-pagination>
    </div>
</template>

<script>
import moment from 'moment'
import User from 'domain/entities/User'
import userService from 'domain/services/user-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectTruck from 'components/elements/common/SingleSelectTruck'
import CompanyProfileService from 'domain/services/company-profile-service'

export default {
  name: 'list-user-for-company',

  components: {
    LaddaBtn,
    SingleSelectTruck
  },

  props: {
    listUsers: {
      type: Array,
      required: true
    },
    listVehicles: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    order: [],
    selectUserStatus: 3,
    statusOptions: User.statusOptions,
    truckOptions: [],
    listUsersData: [],
    isUpdatingStatus: [],
    perPage: 10,
    currentPage: 1,
    currentUserOfPage: [],
    searchText: ''
  }),

  computed: {
    rows () {
      return this.listUsersData.length
    }
  },

  watch: {
    listUsers: function (newVal, oldVal) {
      let self = this
      this.listUsersData = this.listUsers.filter(
        function (el) {
          return parseInt(el.status_id) === parseInt(self.selectUserStatus)
        }
      )
      this.currentUserOfPage = this.listUsersData.slice(this.currentPage * this.perPage - 10, this.currentPage * this.perPage)
    },

    currentPage: function (newVal, oldVal) {
      let perPage = this.perPage
      this.currentUserOfPage = this.listUsersData.slice(newVal * perPage - 10, newVal * perPage)
    }
  },

  created () {
    let self = this
    this.listUsersData = this.listUsers.filter(
      function (el) {
        return parseInt(el.status_id) === parseInt(self.selectUserStatus)
      }
    )
    this.currentUserOfPage = this.listUsersData.slice(0, this.perPage)
    this.isUpdatingStatus = Array(this.listUsers.length).fill(true)
  },

  methods: {
    resetListUser: function () {
      let self = this
      this.searchText = ''
      this.listUsersData = this.listUsersData = this.listUsers.filter(
        function (el) {
          return parseInt(el.status_id) === parseInt(self.selectUserStatus)
        }
      )
      this.currentUserOfPage = this.listUsersData.slice(0, this.perPage)
    },

    convertTime (time) {
      return time ? moment(time).format('DD-MM-YYYY') : ''
    },

    mapTruckAndUser: function (userId, order, map) {
      if (map === true && typeof (order) === 'undefined') {
        commonHelper.showMessage('Chọn xe trước khi gán!!!', 'error')
        return
      }
      let dataSend = {
        user_id: userId,
        order: order
      }
      CompanyProfileService.mapTruckAndUser(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.$emit('getCompanyProfile')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
          this.$emit('getCompanyProfile')
        }
      }).catch((error) => {
        console.log(error)
      }).then(() => {
      })
    },

    updateStatus (userId, e) {
      let selectedUser = this.listUsersData.find((user) => {
        return user.id === userId
      })

      if (!selectedUser) {
        this.notify.success = false
        this.notify.message = 'Có lỗi xảy ra, không load được thông tin profile'
        this.showNotification(false)
        return false
      }
      if (confirm(`Bạn có muốn chuyển trạng thái của tài khoản ${selectedUser.username} ?`)) {
        let indexOfUser = this.listUsersData.findIndex((user) => {
          return user.id === userId
        })
        this.isUpdatingStatus[indexOfUser] = true
        let statusId = selectedUser.status_id

        userService.updateStatus(userId, statusId).then(response => {
          if (response.data.success) {
            commonHelper.showMessage('Thay đổi trạng thái user thành công', 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
            this.$emit('getCompanyProfile')
          }
        }).catch((error) => {
          console.log(error)
        }).then(() => {
        })
      }
    },

    searchUser: function () {
      let self = this
      let temp = this.listUsers.filter(
        function (el) {
          el.truck_code = el.truck_code || ''
          return (el.username.toUpperCase().includes(self.searchText.toUpperCase()) || el.truck_code.toUpperCase().includes(self.searchText.toUpperCase())) && (parseInt(el.status_id) === parseInt(self.selectUserStatus))
        }
      )
      this.currentUserOfPage = temp.slice(0, this.perPage)
      this.listUsersData = temp
    },

    handleChooseTruck (option, index) {
      this.order[index] = option ? option.order : ''
    }
  }
}
</script>

<style scoped>
    .search-user {
        position: relative;
        width: 100%;
        margin-bottom: 10px;
    }
    .only-bottom-border{
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .remove-text {
        color: #dfe1e3;
    }
    .remove-text:hover {
        color: #6e7a8a;
    }
    .button-remove {
        position: absolute;
        top: 2px;
        right: 10px;
        border: none;
        background: rgba(0,0,0,0);
        padding: 0;
    }
</style>
