<template>
  <div class="wrapper">
    <div class="list-data-container" v-if="isShowDashboard">
      <b-row class="top topRowCustom align-items-center">
        <b-col md="8">
          <h4 class="m-0">QUẢN LÝ PHÂN QUYỀN HRM</h4>
        </b-col>
      </b-row>

      <div class="search-cus">
        <b-form-input
          class="input-search-cus"
          v-model="dataSearch"
          @keyup.enter="searchPermission"
          placeholder="Tìm kiếm quyền..."
        >
        </b-form-input>
        <b-button :disabled="loading" class="btSearch" @click="searchPermission">
          <i class="ion ion-md-search"></i>
        </b-button>
      </div>

      <div class="mb-3">
        <div class="action-cus">
          <div class="title-cus">Danh sách các quyền</div>
          <div class="add-permission-cus">
            <b-button variant="outline-success" @click="showLog()"> Kiểm tra log</b-button>
            <b-button variant="outline-info" @click="$bvModal.show('id-add-permission')"><i class="ion ion-ios-add"></i> Thêm nhóm quyền mới</b-button>
          </div>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body>
            <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
              <thead>
              <tr class="trCustom">
                <th class="w-5">STT</th>
                <th class="w-20">Tên</th>
                <th class="w-45">Mô tả</th>
                <th class="w-15">Thời gian tạo</th>
                <th class="w-15">Thao tác</th>
              </tr>
              </thead>
              <tbody v-loading="loading" class="position-relative" style="height: 54px;">
              <tr style="text-align: center;" v-for="(record, index) in listPermission" :key="index" v-if="listPermission && listPermission.length > 0">
                <td style="padding-top: 0.8rem !important;">{{ (page.current_page * page.per_page - page.per_page) + (index + 1) }}</td>
                <td style="padding-top: 0.8rem !important;">{{ record.name }}</td>
                <td style="padding-top: 0.8rem !important;">{{ record.description }}</td>
                <td style="padding-top: 0.8rem !important;"> {{ formatDate(record.created_at, 'DD-MM-YYYY H:mm:ss') }}</td>
                <td>
                  <b-button class="btn-build-cus" @click="showDetailPermission(record)" variant="ghtk" >
                    <i class="ion ion-md-build"></i>
                  </b-button>
                  <b-button variant="ghtk" @click="editPermission(record)" style="background-color: white;color: #1a701d;border: 1px solid;">
                    <i class="fas fa-pencil-alt"></i>
                  </b-button>
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loading && listPermission && listPermission.length === 0">&#128557; Không tìm thấy danh sách permission !</div>
        </div>
      </div>
      <!-- paging  -->
      <div class="row mt-3 align-items-center">
        <div class="col col-md-9 text-left">
          <b class="text-black">
            Bản ghi/ trang
          </b>
          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                  v-model="page.per_page" @change="getListPermission()">
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
              @input="getListPermission()"
            >
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
<!--  component xem chi tiết 1 permission-->
    <detail-permission v-if="currentPermissionEdit && !isShowDashboard"
                      :data-permission="currentPermissionEdit"
                      @back="isShowDashboard = true"
                       @showModal="showModal"
                       @showModalAssignRole="showModalAssignRole"
    >
    </detail-permission>
    <modal-add-permission
      @addPermissionSuccess="reloadData()"
    >
    </modal-add-permission>
    <modal-add-role
      :data-permission="dataPermissionRole"
    >
    </modal-add-role>
    <modal-assign-model-to-role
      :data-role="dataRole"
      :type-update="typeUpdateRole"
    >
    </modal-assign-model-to-role>
    <modal-log-role
      :is-get-log-role="isGetLog"
      @getLogRoleDone="isGetLog = false"
      :title="'Log thay đổi permission'"
      :type="'permission'"
    ></modal-log-role>
    <modal-edit-permission
      :data-permission="dataPermissionEdit"
      @editPermissionSuccess="editPermissionSuccess()"
    >
    </modal-edit-permission>
  </div>
</template>
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
  font-size: 19px;
  position: relative;
  margin: auto;
  text-align: center;
  top: -2.8rem;
  font-family: ui-rounded;
}

</style>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'
import WebStorage from 'infrastructures/web-storage'

// component
import DetailPermission from './DetailPermission.vue'
import ModalAddPermission from './ModalAddPermission.vue'
import ModalEditPermission from './ModalEditPermission.vue'
import ModalAddRole from './ModalAddRole.vue'
import ModalAssignModelToRole from './ModalAssignModelToRole.vue'
import ModalLogRole from '../UserPermissionManagement/ModalLogRole.vue'
import rolePermissionConst from '@/const/rolePermission'

export default {
  name: 'permission-dashboard',
  components: {
    ModalLogRole,
    PermissionManagement,
    commonHelpers,
    Multiselect,
    DetailPermission,
    ModalAddPermission,
    ModalAddRole,
    ModalAssignModelToRole,
    ModalEditPermission,
    WebStorage
  },
  data: () => ({
    loading: false,
    listPermission: [],
    dataRequest: {
      name: ''
    },
    page: {
      current_page: 1,
      per_page: 10,
      total_row: 0
    },
    dataSearch: '',
    isShowDashboard: true,
    currentPermissionEdit: null,
    dataPermissionRole: {},
    dataRole: {},
    typeUpdateRole: 'assign',
    isGetLog: false,
    dataPermissionEdit: null,
    absoluteSearch: false,
    storage: null
  }),

  watch: {
  },
  computed: {
  },
  created () {
    window.onblur = function () { document.title = 'Quản lý Permission' }
    if (this.$route && this.$route.params && this.$route.params.permission_name) {
      this.dataSearch = this.$route.params.permission_name
      this.absoluteSearch = true
      this.searchPermission()
    } else {
      this.getListPermission()
    }
    this.storage = new WebStorage()
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    editPermission (record) {
      this.dataPermissionEdit = record
      this.$bvModal.show('id-edit-permission')
    },

    editPermissionSuccess () {
      this.dataPermissionEdit = null
      this.getListPermission()
    },

    showLog () {
      this.isGetLog = true
      this.$bvModal.show('id-modal-log-role')
    },

    reloadData () {
      this.page.current_page = 1
      this.getListPermission()
    },

    getListPermission: async function () {
      this.loading = true
      let params = {...this.page}
      if (this.dataSearch.length > 0) {
        params.name = this.dataSearch
      }
      try {
        const res = await PermissionManagement.getListPermission(params)
        if (res.data.success) {
          this.listPermission = res.data.data.data
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

    searchPermission: async function () {
      if (this.dataSearch.length === 0) {
        return this.getListPermission()
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
        const res = await PermissionManagement.getListPermission(params)
        if (res.data.success) {
          this.listPermission = res.data.data.data
          this.page.current_page = res.data.data.current_page
          this.page.per_page = res.data.data.per_page
          this.page.total_row = res.data.data.total
          if (this.absoluteSearch && +res.data.data.total === 1 && res.data.data.data[0]) {
            this.showDetailPermission(res.data.data.data[0])
          }
          this.absoluteSearch = false
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    showDetailPermission (record) {
      this.isShowDashboard = false
      this.currentPermissionEdit = record
      this.storage.set(rolePermissionConst.KEY_CACHE_PATH_BACK, record.name)
    },

    showModal (data) {
      this.dataPermissionRole = data
      this.$bvModal.show('id-add-role')
    },

    showModalAssignRole ({typeUpdateRole, data}) {
      this.dataRole = data
      this.typeUpdateRole = typeUpdateRole
      this.$bvModal.show('id-modal-assign-role')
    }
  }
}
</script>
