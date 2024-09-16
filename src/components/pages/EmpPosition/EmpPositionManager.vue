<template>
  <div class="ui-block">
      <div class="mb-3">
        <b-row>
          <b-col md="6">
            <h4 class="ui-block-heading">Quản lý vị trí công việc</h4>
          </b-col>
          <b-col md="6" class="text-right" >
            <b-btn variant="success" @click="editPosition(modalAction.create, {})"><i class="ion ion-md-add"></i> Thêm mới vị trí</b-btn>
          </b-col>
        </b-row>
      </div>
      <!-- <hr> -->
      <div class="mb-3">
        <b-row>
          <b-col md="3">
            <single-select-department @handleSelectedDepartment="handleSelectedDepartment" :department-id="search.department_id"></single-select-department>
          </b-col>
          <b-col md="3">
            <SingleSelectPosition @handleSelectedPosition="handleSelectedPosition"/>
            <!-- <b-form-input type="text" placeholder="Nhập vị trí" v-model="search.position_name"></b-form-input> -->
          </b-col>
          <b-col md="3">
            <b-form-input type="text" placeholder="Nhập hình thức trả lương" v-model="search.type_salary"></b-form-input>
          </b-col>
          <b-col md="2" class="text-right">
            <b-btn type="button" variant="primary" @click="getListEmpPosition"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <div>
          <b-card no-body>
            <table class="table mb-0 table-hover table-bordered">
            <LoadingFadeCircle v-if="appLoading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);"/>
              <thead>
              <tr>
                <th>STT</th>
                <th>Phòng ban</th>
                <th>Vị trí</th>
                <th>Hình thức trả lương</th>
                <th>Nhóm</th>
                <th>Loại nhóm</th>
                <th>Thao tác</th>
              </tr>
              </thead>
              <tbody v-if="positions.length > 0">
                <tr v-for="(position, index) in positions" :key="index">
                  <td>
                    {{ links.offset + ++index }}
                  </td>
                  <td>
                    {{ position.ErpEmpDepartment.name }}
                  </td>
                  <td>
                    {{ position.ErpEmpPosition.position_name }}
                  </td>
                  <td>
                    {{ position.ErpEmpPosition.type_salary }}
                  </td>
                  <td>
                    {{ position.ErpGroup.name }}
                  </td>
                  <td>
                    {{ position.ErpEmpPosition.group_type | groupTypeName(groupTypes)  }}
                  </td>
                  <td>
                    <b-btn class="btn btn-outline-secondary" @click="editPosition(modalAction.update, position.ErpEmpPosition)"><i class="ion ion-md-create"></i></b-btn>
                  </td>
                </tr>
              </tbody>
              <b-card v-else class='text-center'>Không có bản ghi phù hợp</b-card>
            </table>

            <div class="mt-3" v-if="links.totalPage > 0">
              <b-row>
                <b-col>
                  <b-pagination
                    :total-rows="links.totalRow"
                    v-model="links.currentPage"
                    :per-page="links.itemsPerPage"
                    @input="onPagination"
                    align="center"
                  />
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>
      </div>
      <EmpPositionFormModal
        @updateModalShow="updateModalShow"
        :modalShow="modalShow"
       :position="position"
       :groupTypes="groupTypes"
       @handleCreate="handleCreate"
       @handleUpdate="handleUpdate"
       :action="action"
       />
    </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import EmpPositionService from 'domain/services/emp-position-service'
import LoadingFadeCircle from 'components/elements/loading/LoadingFadeCircle'
import EmpPositionFormModal from './EmpPositionFormModal'
import Helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'EmpPositionManager',
  components: {
    SingleSelectPosition,
    SingleSelectDepartment,
    LoadingFadeCircle,
    EmpPositionFormModal
  },

  data: () => ({
    appLoading: false,
    search: {
      department_id: '',
      position_id: '',
      type_salary: ''
    },
    positions: [],
    links: {
      totalPage: 0,
      totalRow: 0,
      currentPage: 0,
      itemsPerPage: 0,
      offset: 0
    },
    position: {},
    modalShow: false,
    groupTypes: {},
    modalAction: {
      create: 'CREATE',
      update: 'UPDATE'
    },
    action: ''
  }),

  created () {
    this.getListEmpPosition()
    this.getConfigGroupType()
  },

  computed: {

  },

  watch: {

  },

  filters: {
    groupTypeName (groupId, groupTypes) {
      return groupTypes[groupId]
    }
  },

  methods: {
    handleSelectedDepartment: function (option) {
      this.search.department_id = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.search.position_id = option ? option.id : ''
    },

    getListEmpPosition: function (query) {
      this.appLoading = true
      EmpPositionService.get({
        ...this.search,
        ...query
      })
        .then(res => {
          if (res.data.success) {
            this.positions = res.data.data.positions
            this.links = res.data.data.links
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    getConfigGroupType: function () {
      this.appLoading = true
      EmpPositionService.getConfigGroupType()
        .then(res => {
          if (res.data.success) {
            this.groupTypes = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    onPagination: function (page) {
      this.getListEmpPosition({'page': page})
    },

    editPosition: function (action, position) {
      this.action = action
      this.position = position
      this.modalShow = true
    },

    updateModalShow: function (showModal) {
      this.modalShow = showModal
    },

    handleUpdate: function (formData) {
      this.appLoading = true
      EmpPositionService.updatePosition(formData)
        .then(res => {
          if (res.data.success) {
            Helper.showMessage(res.data.message, 'success')
            this.modalShow = false
            this.onPagination(this.links.currentPage)
          } else {
            Helper.showMessage(res.data.message, 'fail')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    handleCreate: function (formData) {
      this.appLoading = true
      EmpPositionService.createPosition(formData)
        .then(res => {
          if (res.data.success) {
            this.modalShow = false
            Helper.showMessage(res.data.message, 'success')
            this.onPagination(this.links.currentPage)
          } else {
            Helper.showMessage(res.data.message, 'fail')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    }
  }
}
</script>
