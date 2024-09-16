<template>
    <div class="ui-block">
        <h4 class="ui-block-heading">Quản lý khóa app nhân viên</h4>
        <hr>
        <div class="mb-2">
            <b-row class="h-col-50">
                <b-col md="2">
                    <input placeholder="Mã Profile" v-model="staff_code" type="number" min="9" max="12" @keyup.enter="searchUser" class="form-control"/>
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="username, Họ tên" v-model="term" @keyup.enter="searchUser" class="form-control" />
                </b-col>
                <b-col md="2">
                    <single-select-profile-region @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
                </b-col>
                <b-col md="2">
                    <single-select-province @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                </b-col>
                <b-col md="2">
                    <single-select-station :province-id="provinceId" @handleSelectedStation="handleSelectedStation"></single-select-station>
                </b-col>
                <b-col md="2">
                    <single-select-department @handleSelectedDepartment="handleSelectedDepartment"></single-select-department>
                </b-col>
                <b-col md="2" class="mb-2">
                    <single-select-position @handleSelectedPosition="handleSelectedPosition" :department-id="departmentId" :position-job="positionId"></single-select-position>
                </b-col>
                <b-col md="2" class="md-2">
                    <b-form-select v-model="status" :options="optionStatus" name="status" class="mb-3">
                        <template v-slot:first>
                            <option :value="null">-- Trạng thái --</option>
                        </template>
                    </b-form-select>
                </b-col>
                <b-col md="8" class="text-right">
                    <b-btn type="button" variant="primary" @click="getListStaff()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                </b-col>
            </b-row>
        </div>
        <div class="mb-3 position-relative">
            <div class="wrapper-list-master" v-loading="appLoading">
                <b-card no-body v-if="listUser.length > 0">
                    <table class="table b-table table-striped table-hover is_align_middle">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã nhân viên</th>
                            <th>Username</th>
                            <th>Tên nhân viên</th>
                            <th>Kho</th>
                            <th>Vị trí</th>
                            <th>Username người khóa</th>
                            <th>Người khóa</th>
                            <th>Vị trí người khóa</th>
                            <th>Ngày khóa</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(user, index) in listUser">
                            <td>{{(currentPage - 1) * perPage + index + 1}}</td>
                            <td>{{user.staff_code}}</td>
                            <td>{{user.username}}</td>
                            <td>{{user.fullname}}</td>
                            <td>{{user.station_name}}</td>
                            <td>{{user.position_name}}</td>
                            <td>{{user.lock_app_user}}</td>
                            <td>{{user.lock_app_fullname}}</td>
                            <td>{{user.lock_app_position}}</td>
                            <td>{{convertDate(user.lock_app_time)}}</td>
                            <td v-if="parseInt(user.lock_app_status) == 0">
                                Chưa khóa
                            </td>
                            <td v-else-if="parseInt(user.lock_app_status) == 1">
                                Đã khóa
                            </td>
                            <td v-if="parseInt(user.lock_app_status) == 0">
                                <b-button variant="outline-danger" @click="showModal(user.user_id, 1)">Khóa</b-button>
                            </td>
                            <td v-else-if="parseInt(user.lock_app_status) == 1">
                                <b-button variant="outline-success" @click="showModal(user.user_id, 0)">Mở khóa</b-button>
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
                                        v-on:input="searchUser"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
                <b-modal id="modal-lock-user" hide-footer hide-header>
                    <h4>Nhập lí do khóa (mở app)</h4>
                    <br>
                    <div style="position: relative; width: 100%; max-width: 600px">
                        <b-form-input class="only-bottom-border" style="max-width: 600px; padding-right: 35px; " v-model="note" placeholder="Nhập lý do" @keyup.enter.native="controlUserApp"></b-form-input>
                        <b-btn style="position: absolute; top: 2px; right: 10px; border: none; background: rgba(0,0,0,0); padding: 0" @click="controlUserApp()">
                            <i font-size: style="font-size: 20px" class="icon ion-ios-send text-primary" ></i>
                        </b-btn>
                    </div>
                </b-modal>
                <div v-if="appLoading === false && listUser.length === 0">
                    <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy profile phù hợp.</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import profileService from 'domain/services/profile-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'UserLockAppManager',
  components: {
    SingleSelectProfileRegion,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectDepartment
  },
  data: () => ({
    listUser: [],
    note: '',
    term: '',
    staff_code: '',
    region: '',
    provinceId: '',
    stationId: '',
    moduleId: '',
    departmentId: '',
    positionId: '',
    work_type_id: '',
    appLoading: false,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    optionStatus: [
      { value: 0, text: 'Chưa khóa' },
      { value: 1, text: 'Đã khóa' }
    ],
    status: null,
    userId: null,
    lock: null
  }),

  created () {
    this.getListStaff()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
  },

  mounted () {
  },

  methods: {
    searchUser () {
      this.currentPage = 1
      this.getListStaff()
    },
    getListStaff: function () {
      this.appLoading = true
      let params = {
        staff_code: this.staff_code,
        term: this.term,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        departmentId: this.departmentId,
        positionId: this.positionId,
        status: this.status,
        page: this.currentPage,
        limit: this.perPage
      }
      profileService.getListStaff(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.listUser = response.data.data
            this.totalItems = response.data.totalItem
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    showModal: function (userId, lock) {
      this.userId = userId
      this.lock = lock
      this.$bvModal.show('modal-lock-user')
    },

    resetDataLock: function () {
      this.userId = null
      this.lock = null
      this.note = ''
    },

    controlUserApp: function () {
      let data = {
        userId: this.userId,
        lock: this.lock,
        note: this.note
      }
      profileService.controlUserApp(data).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.$bvModal.hide('modal-lock-user')
            this.getListStaff()
            this.resetDataLock()
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        }
      })
        .catch(e => {
          console.log(e)
        })
    },

    handleSelectedRegion (option) {
      this.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
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

    convertDate: function (data) {
      if (data == null) return ''
      return moment(data).format('DD-MM-YYYY')
    }
  }
}
</script>

<style>
    .only-bottom-border{
        border-top: none;
        border-left: none;
        border-right: none;
    }
</style>
