<template>
  <div class="wrapper-object">
    <div class="list-data-container">
      <div class="action-cus">
        <div class="title-cus">Danh sách chi tiết đối tượng được config role</div>
        <div class="add-permission-cus">
          <b-button class="btn-sm" variant="outline-danger" style="margin-right: 0.6rem;" @click="showModalAssignRole('remove')"><i class="ion ion-ios-add"></i> Xóa đối tượng khỏi role</b-button>
          <b-button class="btn-sm" variant="outline-success" @click="showModalAssignRole('assign')"><i class="ion ion-ios-add"></i> Thêm đối tượng mới vào role</b-button>
          <b-form-input
            style="margin-left: 0.6rem;height: 2rem;width: 10rem; min-height: 0"
            class="input-search-cus"
            v-model="dataSearch"
            placeholder="Nhập username..."
          >
          </b-form-input>
          <b-button :disabled="loadingGroup || loadingUser || loadingPosition" class="btSearch btn-sm" @click="getListModelByRole('search')">
            <i class="ion ion-md-search"></i>
          </b-button>
        </div>
      </div>

      <!--      table group-->
      <div class="table-group">
        <div class="option-object row">
          <label class="col-md-5" for="" style="line-height: 2rem;font-weight: 500;"><i class="ion ion-ios-people" style="color: yellowgreen; margin-right: 0.5rem;"></i>Group:</label>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body style="border: none;">
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-20">STT</th>
                <th class="w-20">GroupId</th>
                <th class="w-20">Name</th>
                <th class="w-20">Description</th>
                <th class="w-20">Action</th>
              </tr>
              </thead>
              <tbody v-loading="loadingGroup" class="position-relative">
              <tr style="text-align: center;" v-for="(group, index) in dataGroup" :key="index" v-if="dataGroup && dataGroup.length > 0">
                <td>{{ index + 1 }}</td>
                <td>{{ group.id }}</td>
                <td>{{ group.name }}</td>
                <td>{{ group.description }}</td>
                <td>
                  <b-button class="btn-sm" @click="removeGroupFromRole(group)" variant="ghtk" style="background-color: white;color: red;border: 1px solid; padding: 0.3rem 0.8rem !important;">
                    <i class="ion ion-md-trash"></i>
                  </b-button>
<!--                  <b-button class="btn-sm" variant="ghtk" style="background-color: white;color: #02637c;border: 1px solid; padding: 0.3rem 0.7rem !important;">-->
<!--                    <i class="ion ion-ios-eye"></i>-->
<!--                  </b-button>-->
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loadingGroup && dataGroup && dataGroup.length === 0">Không có group được config</div>
        </div>
      </div>

<!--      table position-->
      <div class="table-position">
        <div class="option-object row">
          <label class="col-md-5" for="" style="line-height: 2rem;font-weight: 500;"><i class="ion ion-ios-ribbon" style="color: orange; margin-right: 0.5rem;"></i>Position:</label>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body style="border: none;">
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-15">STT</th>
                <th class="w-20">PositionId</th>
                <th class="w-20">Name</th>
                <th class="w-25">Status</th>
                <th class="w-20">Action</th>
              </tr>
              </thead>
              <tbody v-loading="loadingPosition" class="position-relative">
              <tr style="text-align: center;" v-for="(position, index) in dataPosition" :key="index" v-if="dataPosition && dataPosition.length > 0">
                <td>{{ index + 1 }}</td>
                <td>{{ position.id }}</td>
                <td>{{ position.position_name }}</td>
                <td>{{ position.status }}</td>
                <td>
                  <b-button class="btn-sm" @click="removeModelFromRole(position, 'position')" variant="ghtk" style="background-color: white;color: red;border: 1px solid; padding: 0.3rem 0.8rem !important;">
                    <i class="ion ion-md-trash"></i>
                  </b-button>
                  <router-link
                    class="user-link"
                    :to="'/rbac/position-dashboard/' + position.id">
                    <i class="ion ion-ios-eye"></i>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loadingPosition && dataPosition && dataPosition.length === 0">Không có position được config</div>
        </div>
      </div>

      <!--      table user-->
      <div class="table-user mt-2">
        <div class="option-object row">
          <label class="col-md-5" for="" style="line-height: 2rem;font-weight: 500;"><i class="ion ion-ios-person" style="color: green; margin-right: 0.5rem;"></i>User:</label>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body style="border: none;">
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-10">STT</th>
                <th class="w-15">Username</th>
                <th class="w-15">Fullname</th>
                <th class="w-15">Group</th>
                <th class="w-15">Department</th>
                <th class="w-15">Position</th>
                <th class="w-15">Action</th>
              </tr>
              </thead>
              <tbody v-loading="loadingUser" class="position-relative" style="height: 54px;">
              <tr style="text-align: center;" v-for="(user, index) in dataUser" :key="index" v-if="dataUser && dataUser.length > 0">
                <td style="padding-top: 0.8rem !important;">{{ (page.current_page * page.per_page - page.per_page) + (index + 1) }}</td>
                <td style="padding-top: 0.8rem !important;">{{ user.username }}</td>
                <td style="padding-top: 0.8rem !important;">{{ user.fullname }}</td>
                <td style="padding-top: 0.8rem !important;">{{ user.group_name }}</td>
                <td style="padding-top: 0.8rem !important;">{{ user.department }}</td>
                <td style="padding-top: 0.8rem !important;">{{ user.position_name }}</td>
                <td>
                  <span class="btn-remove" @click="removeModelFromRole(user, 'user')">
                    <i class="ion ion-md-trash"></i>
                  </span>
                  <router-link
                               class="user-link"
                               :to="'/rbac/user-dashboard/' + user.user_id">
                    <i class="ion ion-ios-eye"></i>
                  </router-link>
                </td>
              </tr>
              <tr style="text-align: center;" v-if="+page.total_row > + ((page.current_page * page.per_page - page.per_page) + dataUser.length)">
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loadingUser && dataUser && dataUser.length === 0">Không có user được config</div>
        </div>
        <!-- paging  -->
        <div class="row mt-3 align-items-center" v-if="+page.total_row > +page.per_page">
          <div class="col col-md-12 text-right">
            <b class="text-black">
              Bản ghi/ trang
            </b>
            <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                    v-model="page.per_page" @change="getListModelByRole()">
              <option>5</option>
              <option>10</option>
            </select>
            <div class="z-0 d-inline-block">
              <b-pagination
                class="paginator-ghtk mb-0"
                size="sm"
                align="left"
                v-model="page.current_page"
                :total-rows="+page.total_row"
                :per-page="+page.per_page"
                @input="getListModelByRole()"
              >
              </b-pagination>
            </div>
          </div>
        </div>
      </div>

    </div>
    <modal-assign-model-to-role
      :data-role="dataRole"
      :type-update="typeUpdateRole"
      @assignSuccess="assignSuccess"
      @showModalNoticeRole="showModalNoticeRole"
    >
    </modal-assign-model-to-role>
    <modal-notice
      :type="typeNotice"
      :message="messageNotice"
      :data-notice="dataNotice"
      :type-update-role="typeUpdateRole"
      @close="closeModalNotice"
    >
    </modal-notice>
  </div>
</template>
<style scoped lang="scss">
.wrapper-object{
  margin-top: -3rem !important;
}
.wrapper-object.topRowCustom{
  margin-bottom: 20px;
}
.list-data-container {
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #eff0f2;
}
.wrapper-list-master {
  position: relative;
}
.h-col-50 .col-md-2 {
  max-height: 50px;
}

.table tbody tr td {
  word-break: break-all
}
h4 {
  font-size: 23px !important;
  font-weight: 600 !important;
}
.trCustom {
  background-color: #f8f9fa;
  color: black;
  height: 10%;
  font-weight: 700;
  text-align: center;
}
.trCustom th {
  padding-left: 10px;
  height: 44px;
  padding-bottom: 10px;
}

.search-cus {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 2.2rem;
  .input-search-cus {
    width: 50%;
    border-bottom-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    transform: translateY(-7px);
    padding-left: 1rem !important;
  }
}

.col-md-1-5 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 10%;
  flex: 0 0 10%;
  max-width: 10%;
}

.btSearch {
  height: 2rem !important;
  background: black !important;
  margin-left: 0.3rem !important;
}

.action-cus {
  display: flex;
  margin-bottom: 0.4rem;
  justify-content: space-between;
  .title-cus {
    font-size: 15px;
    font-weight: 500;
  }
  .add-permission-cus {
    display: flex;
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
  font-size: 14px;
  position: relative;
  margin: auto;
  text-align: center;
  top: -1.65rem;
  color: #f66a6a;
}

.btn-remove, .user-link {
  padding: 0.3rem 0.6rem;
  border: 1px solid green;
  border-radius: 4px;
  display: inline-block;
}

.btn-remove {
  border: 1px solid red;
  padding: 0.3rem 0.75rem;
  color: red;
  cursor: pointer;
}

</style>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'

// component
import ModalAssignModelToRole from '../PermissionManagement/ModalAssignModelToRole.vue'
import ModalNotice from '../PermissionManagement/ModalNotice.vue'

export default {
  name: 'list-object',
  components: {
    ModalNotice,
    PermissionManagement,
    commonHelpers,
    Multiselect,
    ModalAssignModelToRole
  },
  props: {
    dataRole: {}
  },
  data: () => ({
    loadingUser: false,
    loadingGroup: false,
    loadingPosition: false,
    listPermission: [],
    page: {
      current_page: 1,
      per_page: 5,
      total_row: 0
    },
    typeUpdateRole: 'assign',
    dataSearch: '',
    object: null,
    dataUser: [],
    dataGroup: [],
    dataPosition: [],
    messageNotice: null,
    typeNotice: null,
    dataNotice: null
  }),

  watch: {
  },

  mounted () {
    if (this.dataRole) {
      this.getListModelByRole()
      this.getInfoGroupByRole()
      this.getListPositionByRole()
    }
  },
  computed: {
  },
  created () {
  },

  methods: {
    onClose () {
      this.resetData()
    },

    resetData () {
    },
    closeModalNotice () {

    },
    assignSuccess ({type}) {
      switch (type) {
        case 'user':
          this.getListModelByRole()
          break
        case 'position':
          this.getListPositionByRole()
          break
        case 'group':
          this.getInfoGroupByRole()
          break
      }
    },

    showModalNoticeRole ({from, data, roleId, type}) {
      this.fromModal = from
      this.typeNotice = 'success'
      this.messageNotice = type === 'assign' ? 'Thêm đối tượng vào role thành công' : 'Xóa thành công đối tượng khỏi role'
      this.dataNotice = data
      this.typeUpdateRole = type
      this.$bvModal.show('id-modal-notice-cus')
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    // User
    getListModelByRole: async function (type = null) {
      if (!this.dataRole.id) {
        return commonHelpers.showMessage('Không xác định được roleId', 'warning')
      }
      this.loadingUser = true
      let params = {
        role_id: this.dataRole.id,
        ...this.page
      }
      if (type === 'search' && this.dataSearch && this.dataSearch.length > 0) {
        params.username = this.dataSearch
      }
      try {
        const res = await PermissionManagement.getListModelByRole(params)
        if (res.data.success) {
          this.dataUser = res.data.data.data
          this.page.current_page = res.data.data.current_page
          this.page.per_page = res.data.data.per_page
          this.page.total_row = res.data.data.total
        } else {
          commonHelpers.showMessage(res.data.success || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách user', 'warning')
        }
      } finally {
        this.loadingUser = false
        this.$emit('updateStatistics', {type: 'user', total: this.page.total_row || 0})
      }
    },

    // Group
    getInfoGroupByRole: async function () {
      if (!this.dataRole.id) {
        return commonHelpers.showMessage('Không xác định được roleId', 'warning')
      }
      this.loadingGroup = true
      let params = {
        role_id: this.dataRole.id
      }
      try {
        const res = await PermissionManagement.getInfoGroupByRole(params)
        if (res.data.success) {
          if (res.data.data) {
            this.dataGroup = res.data.data
          }
        } else {
          commonHelpers.showMessage(res.data.success || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách quyền', 'warning')
        }
      } finally {
        this.loadingGroup = false
        this.$emit('updateStatistics', {type: 'group', total: this.dataGroup.length || 0})
      }
    },
    // position
    getListPositionByRole: async function () {
      if (!this.dataRole.id) {
        return commonHelpers.showMessage('Không xác định được roleId', 'warning')
      }
      this.loadingGroup = true
      let params = {
        role_id: this.dataRole.id
      }
      try {
        const res = await PermissionManagement.getListPositionByRole(params)
        if (res.data.success) {
          if (res.data.data) {
            this.dataPosition = res.data.data
          }
        } else {
          commonHelpers.showMessage(res.data.success || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách quyền', 'warning')
        }
      } finally {
        this.loadingGroup = false
        this.$emit('updateStatistics', {type: 'position', total: this.dataPosition.length || 0})
      }
    },

    removeModelFromRole: async function (model, type) {
      if (!confirm('Bạn có chắc chắn muốn loại ' + (type === 'position' ? 'vị trí ' : '') + (model.username || model.position_name) + ' khỏi role ' + (this.dataRole.name || '') + ' !')) {
        return
      }
      let data = {
        type: 'remove',
        model_type: type,
        model_ids: type === 'user' ? [model.user_id] : [model.id],
        role_id: this.dataRole.id
      }
      this.loading = true
      try {
        const res = await PermissionManagement.updateRole(data)
        if (res.data.success) {
          let data = res.data.data || []
          if (data.list_user_failed && data.list_user_failed.length > 0) {
            return commonHelpers.showMessage(data.list_user_failed.join(',') + 'chưa thuộc role ' + (this.dataRole.name || ''), 'warning')
          }
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công user khỏi role', 'success')
          type === 'user' ? await this.getListModelByRole() : await this.getListPositionByRole()
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi loại đối tượng khỏi role', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    removeGroupFromRole: async function (group) {
      if (!confirm('Bạn có chắc chắn muốn loại group ' + group.group_name + ' khỏi role ' + (this.dataRole.name || '') + ' không? Điều này đồng nghĩa với việc role sẽ bị xóa và sẽ ảnh hưởng đến tất cả các user có cùng group!')) {
        return
      }
      this.loadingGroup = true
      try {
        const res = await PermissionManagement.removeGroupRole({role_id: this.dataRole.id})
        if (res.data.success) {
          await this.getInfoGroupByRole()
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công group khỏi role', 'success')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi loại đối tượng khỏi role', 'warning')
        }
      } finally {
        this.loadingGroup = false
      }
    },

    showModal (data) {
      this.dataPermissionRole = data
      this.$bvModal.show('id-add-role')
    },

    showModalAssignRole (type) {
      this.typeUpdateRole = type
      this.$bvModal.show('id-modal-assign-role')
    }
  }
}
</script>
