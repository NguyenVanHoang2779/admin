<template>
  <div class="wrapper-object">
    <div class="list-data-container">
      <div class="action-cus">
        <div class="title-cus">Danh sách quyền</div>
        <div class="add-permission-cus">
          <b-button class="btn-sm" variant="outline-success" @click="$bvModal.show('id-add-role-for-model')"><i class="ion ion-ios-add"></i> Chỉ định Role cho Position</b-button>
          <select-role
            :multiple="false"
            :placeholder="'Tìm kiếm role...'"
            style="margin-left: 0.6rem;height: 2rem;width: 10rem; min-height: 0"
            class="input-search-cus"
            @selectRole="handleSelectedRole"
          >
          </select-role>
          <b-button :disabled="loadingPosition" class="btSearch btn-sm" @click="searchRole()">
            <i class="ion ion-md-search"></i>
          </b-button>
        </div>
      </div>

<!--      table position-->
      <div class="table-user mt-2">
        <div class="option-object row">
          <label class="col-md-5" for="" style="line-height: 2rem;font-weight: 500;"><i class="ion ion-ios-ribbon" style="color: orange; margin-right: 0.5rem;"></i>Danh sách quyền ứng với position: ({{ dataPosition.length || 0 }} role)</label>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body style="border: none;">
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-5">STT</th>
                <th class="w-15">Role</th>
                <th class="w-20">Mô tả</th>
                <th class="w-50">Danh sách quyền</th>
                <th class="w-10">Thao tác</th>
              </tr>
              </thead>
              <tbody v-loading="loadingPosition" class="position-relative" style="height: 54px;">
              <tr v-for="(record, index) in dataPosition" :key="index" v-if="dataPosition && dataPosition.length > 0">
                <td style="text-align: center; padding-left: 0rem;">{{ (pagePosition.current_page * pagePosition.per_page - pagePosition.per_page) + (index + 1) }}</td>
                <td>{{ record.name }}</td>
                <td>{{ record.description }}</td>
                <td class="list-permission">
                  <div class="left-list-per">
                    <div v-if="record.list_permission">
                      <router-link v-for="(permission, idP) in record.list_permission" :id="idP"
                                   :key="idP"
                                   class="tag-permission"
                                   :to="'/rbac/permission-dashboard/' + permission.name">
                        {{ permission.description }}
                      </router-link>
                    </div>
                  </div>
                </td>
                <td style="text-align: center; padding-left: 0rem;">
                  <span class="btn-remove" @click="removeRole(record, 'position')">
                    <i class="ion ion-md-trash"></i>
                  </span>
                  <router-link
                    class="user-link"
                    :to="'/rbac/role-dashboard/' + record.name">
                    <i class="ion ion-ios-eye"></i>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loadingPosition && dataPosition && dataPosition.length === 0">Danh sách trống</div>
        </div>
        <!-- paging  -->
        <div class="row mt-3 align-items-center" v-if="+pagePosition.total_row > +pagePosition.per_page">
          <div class="col col-md-12 text-right">
            <b class="text-black">
              Bản ghi/ trang
            </b>
            <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                    v-model="pagePosition.per_page" @change="getListRoleByPosition()">
              <option>5</option>
              <option>10</option>
            </select>
            <div class="z-0 d-inline-block">
              <b-pagination
                class="paginator-ghtk mb-0"
                size="sm"
                align="left"
                v-model="pagePosition.current_page"
                :total-rows="+pagePosition.total_row"
                :per-page="+pagePosition.per_page"
                @input="getListRoleByPosition()"
              >
              </b-pagination>
            </div>
          </div>
        </div>
      </div>

      <modal-assign-role-for-model
      :model-id="this.infoPosition.id || null"
      :model-type="'position'"
      :title="'Thêm role cho position'"
      @AddRoleForModelSuccess="assignSuccess"
      ></modal-assign-role-for-model>
    </div>
  </div>
</template>
<style scoped lang="scss">
.wrapper-object{
  margin-top: 0rem !important;
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
    /deep/ .multiselect__tags {
      padding: 0.2rem !important;
      min-height: 2rem !important;
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
  top: -2.3rem;
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
    background-color: #415653;
    color: white;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    border-radius: 0.25rem;
  }
  a:hover {
    background-color: #627472;
  }
}

</style>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'
import ModalAssignRoleForModel from '../UserPermissionManagement/ModalAssignRoleForModel.vue'
import SelectRole from './../PermissionManagement/SelectRole.vue'

// component

export default {
  name: 'list-role-permission-position',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect,
    ModalAssignRoleForModel,
    SelectRole
  },
  props: {
    infoPosition: {}
  },
  data: () => ({
    loadingPosition: false,
    listPermission: [],
    pagePosition: {
      current_page: 1,
      per_page: 5,
      total_row: 0
    },
    dataSearch: null,
    object: null,
    dataPosition: []
  }),

  watch: {
    infoPosition: {
      deep: true,
      handler (oldVal, newVal) {
        if (this.infoPosition && this.infoPosition.id) {
          this.getListRoleByPosition()
        }
      },
      immediate: true
    }
  },

  mounted () {
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
      this.dataSearch = null
    },

    removeRole: async function (role, type) {
      if (type === 'position') {
        if (!confirm('Bạn có chắc chắn muốn loại vị trí ' + this.infoPosition.position_name + ' khỏi role ' + (role.name || '') + ' không? Điều này sẽ ảnh hưởng đến tất cả các user có vị trí này!')) {
          return
        }
      }
      let data = {
        type: 'remove',
        model_type: type,
        model_ids: [this.infoPosition.id],
        role_id: role.id
      }
      this.loadingPosition = true
      try {
        const res = await PermissionManagement.updateRole(data)
        if (res.data.success) {
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công đối tượng khỏi role', 'success')
          await this.getListRoleByPosition()
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi loại đối tượng khỏi role', 'warning')
        }
      } finally {
        this.loadingPosition = false
      }
    },

    assignSuccess () {
      this.getListRoleByPosition()
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    // Position
    getListRoleByPosition: async function () {
      if (!this.infoPosition.id) {
        return commonHelpers.showMessage('Không xác định được position_id', 'warning')
      }
      this.loadingPosition = true
      let params = {
        position_id: this.infoPosition.id,
        ...this.pagePosition
      }
      if (this.dataSearch) {
        params.role_id = this.dataSearch
      }
      try {
        const res = await PermissionManagement.getListRole(params)
        if (res.data.success) {
          this.dataPosition = res.data.data.data
          this.pagePosition.current_page = res.data.data.current_page
          this.pagePosition.per_page = res.data.data.per_page
          this.pagePosition.total_row = res.data.data.total
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách role theo position', 'warning')
        }
      } finally {
        this.loadingPosition = false
      }
    },

    searchRole () {
      this.getListRoleByPosition()
    },

    handleSelectedRole (option) {
      if (option.id) {
        this.dataSearch = option.id
      } else {
        this.dataSearch = null
      }
    }
  }
}
</script>
