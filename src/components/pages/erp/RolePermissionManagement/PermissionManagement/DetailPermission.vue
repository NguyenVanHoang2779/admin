<template>
  <div class="wrapper">
    <div class="detail-per-cus" v-if="isShowDetailPermission">
      <div class="top topRowCustom align-items-center">
        <div class="title-permission">
          <div><span @click="$emit('back')" class="back-cus"><i style="cursor: pointer;" class="ion ion-ios-arrow-back"></i></span></div>
          <div class="ml-4">
            <h4 style="color: #02a065; line-height: 2.2rem !important;" class="m-0">THÔNG TIN PERMISSION:</h4>
          </div>
          <div class="ml-2">
            <h4 style="color: #02a065; line-height: 2.2rem !important;" class="m-0">{{ dataPermission.description.toUpperCase() }}</h4>
          </div>
        </div>
      </div>

      <div class="action-cus">
        <div class="btn-add-role">
          <b-button variant="outline-info" @click="$emit('showModal', dataPermission)"><i class="ion ion-ios-add"></i> Thêm role mới vào permission</b-button>
        </div>
        <div class="add-permission-cus">
          <b-form-input
            class="input-search-cus"
            v-model="dataRoleSearch"
            placeholder="Tìm kiếm nhanh theo mô tả role..."
            @input="quickSearchRole"
          >
          </b-form-input>
        </div>
      </div>

      <div class="mb-3">
        <div class="title-cus mt-3 mb-2">Danh sách các role</div>

        <div class="wrapper-list-master">
          <b-card no-body>
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-5">STT</th>
                <th class="w-20">Role</th>
                <th class="w-45">Mô tả</th>
                <th class="w-15">Thời gian tạo</th>
                <th class="w-15">Thao tác</th>
              </tr>
              </thead>
              <tbody v-loading="roleLoading" class="position-relative" style="height: 54px;">
              <tr style="text-align: center;" v-for="(role, index) in listRole" :key="index" v-if="listRole && listRole.length > 0">
                <td style="padding-top: 0.8rem !important;">{{ index + 1 }}</td>
                <td style="padding-top: 0.8rem !important;">{{ role.name }}</td>
                <td style="padding-top: 0.8rem !important;">{{ role.description }}</td>
                <td style="padding-top: 0.8rem !important;"> {{ formatDate(role.created_at, 'DD-MM-YYYY H:mm:ss') }}</td>
                <td>
                  <router-link
                    class="user-link"
                    :to="'/rbac/role-dashboard/' + role.name">
                    <i class="ion ion-ios-eye"></i>
                  </router-link>
                  <span class="btn-remove" @click="deleteRoleFromPermission(role)">
                    <i class="ion ion-md-trash"></i>
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!roleLoading && listRole && listRole.length === 0 && !isQuickSearch">&#128557; Chưa có role nào được config cho Permission !</div>
          <div class="no-result-cus" v-if="!roleLoading && listRole && listRole.length === 0 && isQuickSearch">&#128557; Không có kết quả phù hợp !</div>
        </div>
      </div>
    </div>
    <!--  component xem chi tiết 1 role-->
    <detail-role v-if="currentRoleEdit && !isShowDetailPermission"
                       :data-role="currentRoleEdit"
                       @showModalAssignRole="showModalAssignRole"
                       @backToDetailPermission="isShowDetailPermission = true"
    >
    </detail-role>
  </div>
</template>
<style scoped lang="scss">
.wrapper .topRowCustom{
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .title-permission {
    display: flex;
  }
}
.wrapper-list-master {
  position: relative;
  min-height: 120px;
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
  .btSearch {
    width: 2.8%;
    background-color: #2EE59D;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    transform: translateY(-7px);
  }

}

.action-cus {
  display: flex;
  margin-bottom: 0.5rem;
  .add-permission-cus {
    display: flex;
    margin-right: 0.2rem;
    width: 14.9rem;
    button {
      font-weight: 500;
    }
  }
  button, input {
    font-size: 12px !important;
    padding: 0.5rem;
  }
}

.title-cus {
  font-size: 20px;
  font-weight: 500;
}

.btn-build-cus {
  background-color: white !important;
  border-color: #77b979 !important;
  color: #14797e !important;
}
.no-result-cus {
  font-size: 19px;
  position: relative;
  margin: auto;
  text-align: center;
  top: -2.8rem;
}
.back-cus {
  font-size: 24px;
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
.btn-add-role {
  margin-right: 0.7rem;
}
</style>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'
import DetailRole from './DetailRole.vue'

export default {
  name: 'detail-permission',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect,
    DetailRole
  },
  props: {
    dataPermission: {}
  },
  data: () => ({
    roleLoading: false,
    listRole: [],
    dataRequest: {
      name: ''
    },
    dataRoleSearch: '',
    listRoleBefore: [],
    isQuickSearch: false,
    currentRoleEdit: null,
    isShowDetailPermission: true
  }),

  watch: {
    dataPermission: {
      immediate: true,
      handler (old, val) {
        this.getListRoleByPermission()
      },
      deep: true
    }
  },
  computed: {
  },
  created () {
  },

  mounted () {
    this.$root.$on('AddRoleSuccess', idPermission => {
      if (+idPermission === +this.dataPermission.id) {
        this.getListRoleByPermission()
      }
    })
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    deleteRoleFromPermission: async function (role) {
      if (!confirm('Bạn có chắc chắn muốn xóa role ' + (role.name || '') + ' khỏi permission ' + (this.dataPermission.name || '') + ' !')) {
        return
      }
      let data = {
        role_name: role.name,
        permission_name: this.dataPermission.name
      }
      this.loading = true
      try {
        const res = await PermissionManagement.deleteRoleFromPermission(data)
        if (res.data.success) {
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công role khỏi permission', 'success')
          this.getListRoleByPermission()
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

    quickSearchRole () {
      if (this.dataRoleSearch.length > 0) {
        this.listRole = this.listRoleBefore.filter((item) => item.description.toUpperCase().includes(this.dataRoleSearch.toUpperCase()))
        this.isQuickSearch = true
      } else {
        this.listRole = JSON.parse(JSON.stringify(this.listRoleBefore))
      }
    },

    getListRoleByPermission: async function () {
      if (!this.dataPermission || (this.dataPermission && !this.dataPermission.id)) {
        return commonHelpers.showMessage('Không xac định được được id Permission', 'warning')
      }
      let params = {
        id_permission: this.dataPermission.id
      }
      this.roleLoading = true
      try {
        const res = await PermissionManagement.getListRoleByPermission(params)
        if (res.data.success) {
          this.listRole = this.listRoleBefore = res.data.data
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi Hr xác nhận', 'warning')
        }
      } finally {
        this.roleLoading = false
      }
    },

    showDetailRole (role) {
      this.isShowDetailPermission = false
      this.currentRoleEdit = role
    },

    openModal () {
      this.$bvModal.show('id_modalConfig')
    },

    showModalAssignRole (dataRole) {
      this.$emit('showModalAssignRole', dataRole)
    }
  }
}
</script>
