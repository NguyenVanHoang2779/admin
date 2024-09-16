<template>
  <div class="wrapper">
    <div class="list-data-container" v-if="isShowDashboard">
      <b-row class="top topRowCustom align-items-center">
        <b-col md="8">
          <h4 class="m-0">QUẢN LÝ ROLE</h4>
        </b-col>
      </b-row>

      <div class="search-cus">
        <b-form-input
          class="input-search-cus"
          v-model="dataSearch"
          @keyup.enter="searchRoleByName"
          placeholder="Tìm kiếm role..."
        >
        </b-form-input>
        <b-button :disabled="loading" class="btSearch" @click="searchRoleByName">
          <i class="ion ion-md-search"></i>
        </b-button>
      </div>

      <div class="mb-3">
        <div class="action-cus">
          <div class="title-cus">Danh sách role</div>
          <div class="add-permission-cus">
            <b-button variant="outline-success" @click="showLog()"> Kiểm tra log</b-button>
            <b-button variant="outline-info" @click="$bvModal.show('id-create-role')"><i class="ion ion-ios-add"></i> Thêm role mới</b-button>
          </div>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body>
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-5">STT</th>
                <th class="w-15">Tên</th>
                <th class="w-20">Mô tả</th>
                <th class="w-50">Danh sách quyền</th>
                <th class="w-10">Chi tiết</th>
              </tr>
              </thead>
              <tbody v-loading="loading" class="position-relative" style="height: 54px;">
              <tr v-for="(record, index) in listRole" :key="index" v-if="listRole && listRole.length > 0">
                <td style="text-align: center; padding-left: 0rem;">{{ (page.current_page * page.per_page - page.per_page) + (index + 1) }}</td>
                <td>{{ record.name }}</td>
                <td>{{ record.description }}</td>
                <td class="list-permission">
                  <div class="left-list-per">
                    <div v-if="record.list_permission && (roleIdCurrent != record.id)">
                      <router-link v-for="(permission, idP) in record.list_permission" :id="idP"
                                   :key="idP"
                                   class="tag-permission"
                                   :to="'/rbac/permission-dashboard/' + permission.name">
                        {{ permission.description }}
                      </router-link>
                    </div>
                    <div v-else-if="+roleIdCurrent === +record.id">
                      <select-permission
                      :multiple="true"
                      :list-permission-selected="record.list_permission || []"
                      @selectPermission="handelSelectPermission"
                      ></select-permission>
<!--                      <div v-if="record.group_id && record.group_id > 0" class="mt-1" style="word-break: break-word;font-style: italic;">Bạn không thể thao tác cập nhật danh sách quyền trực tiếp cho role này do role được tạo cho group. Để thao tác, vui lòng click chi tiết.</div>-->
                    </div>
                    <div class="empty-list" v-else>
                      <span style="background-color: white;color: red;">Chưa config quyền</span>
                    </div>
                  </div>
                  <div class="right-list-per" v-if="!isEdit || +roleIdCurrent !== +record.id">
                    <i class="fas fa-pencil-alt ml-3" @click="editListPermission(record)"></i>
                  </div>
                  <div class="right-list-per" v-else>
                    <b-btn class="btn-sm btn-outline-success mb-1"
                           :style="isDisabled ? 'background-color: rgb(204, 204, 204) !important;color: black !important; border-color: #ccc !important;' : ''"
                           :disabled="validateAndConvertData(record)" @click="confirmPermission(record)">Lưu</b-btn>
                    <b-btn class="btn-sm btn-outline-danger" @click="roleIdCurrent = null">Hủy</b-btn>
                  </div>
                </td>
                <td style="text-align: center; padding-left: 0rem;">
                  <b-button class="btn-build-cus" @click="showDetailRole(record)" variant="ghtk" >
                    <i class="ion ion-md-build"></i>
                  </b-button>
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loading && listRole && listRole.length === 0">&#128557; Không tìm thấy danh sách role !</div>
        </div>
      </div>
      <!-- paging  -->
      <div class="row mt-3 align-items-center">
        <div class="col col-md-9 text-left">
          <b class="text-black">
            Bản ghi/ trang
          </b>
          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                  v-model="page.per_page" @change="getListRole()">
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <div class="z-0 d-inline-block">
            <b-pagination
              class="paginator-ghtk mb-0"
              size="sm"
              align="left"
              v-model="page.current_page"
              :total-rows="+page.total_row"
              :per-page="+page.per_page"
              @input="getListRole()"
            >
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--  component xem chi tiết 1 role-->
    <role-detail v-if="currentRoleEdit && !isShowDashboard"
                       :data-role="currentRoleEdit"
                       @back="handleBack()"
    >
    </role-detail>
    <modal-create-role
      @created="resetData"
    >
    </modal-create-role>
    <modal-log-role
      :is-get-log-role="isGetLog"
      @getLogRoleDone="isGetLog = false"
      :title="'Log thay đổi role'"
      :type="'role'"
    ></modal-log-role>
    <modal-add-note
      @addNote="addNote"
    >
    </modal-add-note>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'
import SelectPermission from './SelectPermission.vue'
import WebStorage from 'infrastructures/web-storage'

// component
import RoleDetail from './RoleDetail.vue'
import ModalCreateRole from './ModalCreateRole.vue'
import ModalLogRole from '../UserPermissionManagement/ModalLogRole.vue'
import ModalAddNote from './ModalAddNote.vue'
import rolePermissionConst from '@/const/rolePermission'
export default {
  name: 'role-dashboard',
  components: {
    ModalLogRole,
    PermissionManagement,
    commonHelpers,
    Multiselect,
    RoleDetail,
    SelectPermission,
    ModalCreateRole,
    ModalAddNote
  },
  data: () => ({
    loading: false,
    listRole: [],
    dataRequest: {
      name: ''
    },
    page: {
      current_page: 1,
      per_page: 10,
      total_row: 0
    },
    dataSearch: '',
    isGetLog: false,
    isShowDashboard: true,
    currentRoleEdit: null,
    dataPermissionRole: {},
    dataRole: {},
    typeUpdateRole: 'assign',
    listPermission: [],
    roleIdCurrent: null,
    isEdit: false,
    listPermissionAfter: [],
    isDisabled: true,
    absoluteSearch: false,
    note: null,
    pathBefore: null,
    storage: null
  }),

  watch: {
  },
  computed: {
  },
  created () {
    window.onblur = function () { document.title = 'Quản lý Role' }
    if (this.$route && this.$route.params && this.$route.params.role_name) {
      this.dataSearch = this.$route.params.role_name
      this.absoluteSearch = true
      this.searchRoleByName()
    } else {
      this.getListRole()
    }
    this.storage = new WebStorage()
  },

  methods: {
    handleBack () {
      if (this.pathBefore) {
        this.$router.push(this.pathBefore)
      } else {
        this.isShowDashboard = true
      }
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    showLog () {
      this.isGetLog = true
      this.$bvModal.show('id-modal-log-role')
    },

    validateAndConvertData (data) {
      let listPermissionBefore = []
      if (data.list_permission && data.list_permission.length > 0) {
        listPermissionBefore = data.list_permission.map((item) => item.name)
      }

      let listPermissionAdd = this.array_diff(this.listPermissionAfter, listPermissionBefore)
      let listPermissionRemove = this.array_diff(listPermissionBefore, this.listPermissionAfter)

      if (listPermissionAdd.length > 0 || listPermissionRemove.length > 0) {
        this.isDisabled = false
        return false
      }
      this.isDisabled = true
      return true
    },

    editListPermission (role) {
      this.roleIdCurrent = role.id
      this.isEdit = true
      if (role.list_permission && role.list_permission.length > 0) {
        this.listPermissionAfter = role.list_permission.map((item) => item.name)
      }
    },

    handelSelectPermission (option) {
      this.listPermissionAfter = option.map(item => item.name) || []
    },

    confirmPermission () {
      this.$bvModal.show('id-add-note')
    },

    addNote ({note}) {
      if (note) {
        this.note = note
      }
      this.editPermission()
    },

    editPermission: async function () {
      this.loading = true
      if (!this.roleIdCurrent) {
        return commonHelpers.showMessage('Không xác định được RoleId', 'warning')
      }
      let params = {
        role_id: this.roleIdCurrent,
        list_permission_after: this.listPermissionAfter
      }
      if (this.note) {
        params.note = this.note
      }
      try {
        const res = await PermissionManagement.updateListPermissionOfRole(params)
        if (res.data.success) {
          this.resetData()
          commonHelpers.showMessage(res.data.message || 'Chỉnh sửa list permission thành công', 'success')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách quyền', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    array_diff (arr1, arr2) {
      return arr1.filter(item => !arr2.includes(item))
    },

    resetData () {
      this.page.current_page = 1
      this.getListRole()
      this.isEdit = false
      this.roleIdCurrent = null
      this.listPermissionAfter = []
      this.note = null
    },

    getListRole: async function () {
      this.loading = true
      let params = {...this.page}
      if (this.dataSearch.length > 0) {
        params.name = this.dataSearch
      }
      try {
        const res = await PermissionManagement.getListRole(params)
        if (res.data.success) {
          this.listRole = res.data.data.data
          this.page.current_page = res.data.data.current_page
          this.page.per_page = res.data.data.per_page
          this.page.total_row = res.data.data.total
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách quyền', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    searchRoleByName: async function () {
      if (this.dataSearch.length === 0) {
        return this.getListRole()
      }
      this.loading = true
      let params = {
        name: this.dataSearch,
        ...this.page
      }
      if (this.absoluteSearch) {
        params.absolute_search = 1
      }
      try {
        const res = await PermissionManagement.getListRole(params)
        if (res.data.success) {
          if (res.data.data && res.data.data.data) {
            this.listRole = res.data.data.data
            this.page.current_page = res.data.data.current_page
            this.page.per_page = res.data.data.per_page
            this.page.total_row = res.data.data.total
            // show detail nếu bấm từ màn permission sang
            if (this.absoluteSearch && +res.data.data.total === 1 && res.data.data.data[0]) {
              this.showDetailRole(res.data.data.data[0])
              let permissionName = this.storage.get(rolePermissionConst.KEY_CACHE_PATH_BACK)
              if (permissionName && permissionName.length > 0) {
                this.pathBefore = '/rbac/permission-dashboard/' + permissionName
              }
              this.storage.remove(rolePermissionConst.KEY_CACHE_PATH_BACK)
            }
            this.absoluteSearch = false
          }
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi Hr xác nhận', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    deleteRole: async function (permission) {
      if (!confirm('Bạn có chắc chắn muốn xóa permission ' + permission.name + ' không !')) {
        return
      }
      let data = {
        permission_id: permission.id
      }
      this.loading = true
      try {
        const res = await PermissionManagement.deleteRole(data)
        if (res.data.success) {
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công permission', 'success')
          this.getListRole()
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi Hr xác nhận', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    showDetailRole (record) {
      this.isShowDashboard = false
      this.currentRoleEdit = record
    },

    showModalAssignRole ({typeUpdateRole, data}) {
      this.dataRole = data
      this.typeUpdateRole = typeUpdateRole
      this.$bvModal.show('id-modal-assign-role')
    }
  }
}
</script>
<style scoped lang="scss">
.wrapper {
  margin-top: 1.5rem;
  margin-left: 1rem;
}
.wrapper .topRowCustom{
  margin-bottom: 20px;
}
.wrapper-list-master {
  position: relative;
  min-height: 120px;
}
.h-col-50 .col-md-2 {
  max-height: 50px;
}

.table tbody tr td {
  word-break: break-all;
  vertical-align: middle;
  padding-left: 1rem;
  border: none;
  border-top: 1px solid #f1f1f2;
  border-right: 1px solid #f1f1f2;
}
h4 {
  font-size: 23px !important;
  font-weight: 600 !important;
}
.trCustom {
  background-color: #02a065;
  color: white;
  height: 10%;
  font-weight: 700;
  text-align: center;
}
.trCustom th {
  padding-left: 10px;
  height: 44px;
  padding-bottom: 10px;
  text-align: center;
}

.list-permission {
  margin: 0 ;
  display: flex;
  width: 100%;
  .left-list-per {
    width: 93%;
    //max-height: 7rem;
    //overflow-y: auto;
  }
  .left-list-per::-webkit-scrollbar
  {
    width: 5px;
    background-color: #dddddd;
    border-radius: 10px;
  }

  .left-list-per::-webkit-scrollbar-thumb
  {
    background-color: #b3b2b2;
    border-radius: 10px;
  }

  .right-list-per {
    width: 7%;
    padding: 0.3rem;
    i {
      cursor: pointer;
    }
  }
  a {
    display: inline-block;
    padding: 0.3rem;
    background-color: #02a065;
    color: white;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    border-radius: 0.25rem;
  }
  a:hover {
    background-color: #1ceb9e;
  }
}

.search-cus {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  .input-search-cus {
    width: 35%;
    border-bottom-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    transform: translateY(-7px);
    padding-left: 1rem !important;
  }
  .btSearch {
    width: 3.8%;
    background-color: #02a065;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    transform: translateY(-7px);
  }

}

.action-cus {
  display: flex;
  margin-bottom: 1.5rem;
  justify-content: space-between;
  .title-cus {
    font-size: 20px;
    font-weight: 500;
  }
  .add-permission-cus {
    margin-right: 0.2rem;
    button {
      font-weight: 500;
    }
  }
}
.btn-build-cus {
  background-color: white !important;
  border-color: #77b979 !important;
  color: #14797e !important;
}
.no-result-cus {
  font-size: 16px;
  position: relative;
  margin: auto;
  text-align: center;
  top: -2.8rem;
}

</style>
