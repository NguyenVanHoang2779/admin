<template>
  <div>
    <div class="ui-block">
      <div class="mb-3">
        <b-row>
          <b-col md="6">
            <h4 class="ui-block-heading">Quản lý leader bộ phận, vị trí</h4>
          </b-col>
          <b-col md="6" class="text-right" >
            <b-btn variant="success" @click="openEditModal('create', null)"><i class="ion ion-md-add"></i> Thêm mới config leader</b-btn>
          </b-col>
        </b-row>
      </div>
      <!-- <hr> -->
      <div class="mb-3">
        <b-row>
          <b-col md="3">
            <single-select-department @handleSelectedDepartment="handleSelectedDepartment" :position-id="positionId">></single-select-department>
          </b-col>
          <b-col md="3">
            <single-select-position @handleSelectedPosition="handleSelectedPosition" :department-id="departmentId"></single-select-position>
          </b-col>
          <b-col md="4">
            <select-position-leader @handleLeaderSelected="handleLeaderSelected" :display-all="true" :leader-ids="leaders" :limit-prop=99999 :auto-close="false" :hide-selected="true"></select-position-leader>
          </b-col>
          <b-col md="2" class="text-right">
            <b-btn type="button" variant="primary" @click="currentPage = 1; search();"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <div>
          <b-card no-body>
            <table class="table mb-0 table-hover table-bordered">
              <thead>
              <tr>
                <th>STT</th>
                <th style="width: 30%">Bộ phận</th>
                <th style="width: 30%">Vị trí</th>
                <th>BGĐ/BĐH/Cấp trưởng</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(positionLeader, index) in positionLeaders" :key="index">
                  <td>{{(currentPage - 1) * perPage + index + 1}}</td>
                  <td>
                    {{positionLeader.department}}
                  </td>
                  <td>
                    {{positionLeader.position_name}}
                  </td>
                  <td>
                    <div v-if="positionLeader.leaders.length > 0">
                      <div v-for='leader in positionLeader.leaders'>
                        <router-link v-if="leader.master_profile_id != 0" :to="{name: 'edit-master-profile', params: { id: leader.master_profile_id }}"><b-badge variant="primary" >{{leader.fullname}} ( {{leader.username}} )</b-badge></router-link>
                        <router-link v-else-if="leader.main_profile_id != 0" :to="{name: 'edit-user', params: { id:  leader.main_profile_id}}"><b-badge variant="primary" >{{leader.fullname}} ( {{leader.username}} )</b-badge></router-link>
                        <b-badge variant="primary" v-else><p>{{leader.fullname}} ( {{leader.username}} )</p></b-badge>
                      </div>
                    </div>
                  </td>
                  <td style="">
                    <div style='margin:auto;width:fit-content'>
                      <b-btn class="btn btn-outline-secondary" @click="openEditModal('edit', positionLeader.id)"><i class="ion ion-md-create"></i></b-btn>
                      <b-btn class="btn btn-md btn-outline-danger" @click="deletePositionLeader(positionLeader)"><i class="ion ion-md-trash"></i></b-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <modal-edit-position-leader :currEditing="currEditing" :trigger="triggerEdit" :type="typeEdit" @on-updated="updatePositionLeader"></modal-edit-position-leader>
            <b-card v-if='totalItems === 0' class='text-center'>Không có bản ghi phù hợp</b-card>
            <div class="mt-3" v-if="totalPages > 0">
              <b-row>
                <b-col>
                  <b-pagination
                    :total-rows="totalItems"
                    v-model="currentPage"
                    :per-page="perPage"
                    v-on:input="search"
                    align="center"
                  />
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import PositionService from 'domain/services/position-service'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SelectPositionLeader from './SelectPositionLeader'
import ModalEditPositionLeader from './ModalEditPositionLeader'

import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'position-manager',
  components: {
    SingleSelectPosition,
    SingleSelectDepartment,
    SelectPositionLeader,
    ModalEditPositionLeader
  },

  data: () => ({
    departmentId: '',
    positionId: '',
    currentPage: 1,
    totalItems: -1,
    perPage: 10,
    positionLeaders: [],
    leaders: '',
    currEditing: null,
    triggerEdit: false,
    typeEdit: ''
  }),

  created () {
    this.search()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
  },

  methods: {
    search: function () {
      this.appLoading = true
      let params = {
        leader_id: this.leaders,
        department_id: this.departmentId,
        position_id: this.positionId,
        page: this.currentPage,
        limit: this.perPage
      }
      PositionService.get(params)
        .then(res => {
          if (res.data.success) {
            this.positionLeaders = res.data.data
            this.totalItems = res.data.total
            if (this.totalItems === 0) {
              this.positionLeaders = []
            }
          } else {
            this.totalItems = 0
            this.positionLeaders = []
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

    handleSelectedDepartment: function (option) {
      this.departmentId = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    },

    deletePositionLeader (positionLeader) {
      if (!confirm(`Bạn có chắc chắn muốn xóa config cho vị trí (${positionLeader.position_name}) thuộc phòng ban (${positionLeader.department}) không ?`)) {
        return
      }
      let id = {
        id: positionLeader.id
      }
      this.$startLoading()
      PositionService.delete(id)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Xóa bản ghi thành công!'
            })
            this.search()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình xóa bản ghi.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    handleLeaderSelected: function (option) {
      this.leaders = option ? option.map((item) => item.id).toString() : ''
    },

    openEditModal (type, positionId) {
      this.currEditing = positionId
      this.triggerEdit = !this.triggerEdit
      this.typeEdit = type
    },
    updatePositionLeader (success) {
      if (success) {
        commonHelper.showMessage('Cập nhật thông tin leader thành công', 'success')
        this.search()
      } else {
        commonHelper.showMessage('Có lỗi xảy ra trong quá trình cập nhật thông tin leader', 'fail')
      }
    }
  }
}
</script>
