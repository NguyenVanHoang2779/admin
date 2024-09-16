<template>
  <div class="wrapper-per">
    <div class="list-data-container">
        <div class="action-cus">
          <div class="title-cus">Danh sách các quyền được phép truy cập</div>
          <div class="add-permission-cus">
            <b-button class="btn-sm" variant="outline-info"><i class="ion ion-ios-add"></i> Thêm quyền mới vào role</b-button>
            <b-form-input
              style="margin-left: 0.6rem;height: 2rem;width: 10rem; min-height: 0"
              class="input-search-cus"
              v-model="dataSearch"
              placeholder="tìm kiếm quyền..."
            >
            </b-form-input>
            <b-button :disabled="loading" class="btSearch btn-sm" @click="searchPermission">
              <i class="ion ion-md-search"></i>
            </b-button>
          </div>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body style="border: none;">
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
                <td style="padding-top: 0.8rem !important;">{{ index + 1 }}</td>
                <td style="padding-top: 0.8rem !important;">{{ record.name }}</td>
                <td style="padding-top: 0.8rem !important;">{{ record.description }}</td>
                <td style="padding-top: 0.8rem !important;"> {{ formatDate(record.created_at, 'DD-MM-YYYY H:mm:ss') }}</td>
                <td>
                  <b-button class="btn-build-cus" @click="showDetailPermission(record)" variant="ghtk" >
                    <i class="ion ion-md-build"></i>
                  </b-button>
                  <b-button class="btn-delete-cus" variant="ghtk" @click="deletePermission(record)">
                    <i class="ion ion-md-trash"></i>
                  </b-button>
                </td>
              </tr>
              <tr style="text-align: center;" v-if="+page.total_row > +page.per_page">
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
                <td style="padding-top: 0.8rem !important;">...</td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!loading && listPermission && listPermission.length === 0">Danh sách trống</div>
        </div>
      <!-- paging  -->
      <div class="row mt-3 align-items-center" v-if="+page.total_row > +page.per_page">
        <div class="col col-md-12 text-right">
          <b class="text-black">
            Bản ghi/ trang
          </b>
          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                  v-model="page.per_page" @change="getListPermissionByRole()">
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
              @input="getListPermissionByRole()"
            >
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.wrapper-per {
  margin-top: 1rem !important;
}
.wrapper-per .topRowCustom{
  margin-bottom: 20px;
}
.list-data-container {
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #eff0f2;
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

.btSearch {
  height: 2rem !important;
  background: black !important;
  margin-left: 0.3rem !important;
}

.btn-delete-cus {
  background-color: white;
  color: red;
  border: 1px solid;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  line-height: 1.5;
  border-radius: 0.3rem;
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
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}
.no-result-cus {
  font-size: 16px;
  position: relative;
  margin: auto;
  text-align: center;
  top: -2.5rem;
}

</style>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'

// component

export default {
  name: 'table-permission',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect
  },
  props: {
    dataRole: {}
  },
  data: () => ({
    loading: false,
    listPermission: [],
    page: {
      current_page: 1,
      per_page: 5,
      total_row: 0
    },
    dataSearch: ''
  }),

  watch: {
    dataRole: {
      immediate: true,
      handler (old, val) {
        this.getListPermissionByRole()
      },
      deep: true
    }
  },
  computed: {
  },
  created () {
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },
    getListPermissionByRole: async function () {
      if (!this.dataRole.id) {
        return commonHelpers.showMessage('Không xác định được roleId', 'warning')
      }
      this.loading = true
      let params = {
        role_id: this.dataRole.id,
        ...this.page
      }
      try {
        const res = await PermissionManagement.getListPermissionByRole(params)
        if (res.data.success) {
          this.listPermission = res.data.data.data
          this.page.current_page = res.data.data.current_page
          this.page.per_page = res.data.data.per_page
          this.page.total_row = res.data.data.total
        } else {
          commonHelpers.showMessage(res.data.success || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách quyền', 'warning')
        }
      } finally {
        this.loading = false
        this.$emit('loadNumberPermission', this.page.total_row || 0)
      }
    },

    searchPermission: async function () {
      if (this.dataSearch.length === 0) {
        return this.getListPermissionByRole()
      }
      this.loading = true
      let params = {
        name: this.dataSearch
      }
      try {
        const res = await PermissionManagement.searchPermission(params)
        if (res.data.success) {
          this.listPermission = res.data.data
        } else {
          commonHelpers.showMessage(res.data.success || 'Có lỗi xảy ra', 'warning')
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

    deletePermission: async function (permission) {
      if (!confirm('Bạn có chắc chắn muốn xóa permission ' + permission.name + ' không !')) {
        return
      }
      let data = {
        permission_id: permission.id
      }
      this.loading = true
      try {
        const res = await PermissionManagement.deletePermission(data)
        if (res.data.success) {
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công permission', 'success')
          this.getListPermissionByRole()
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

    showDetailPermission (record) {
      this.isShowDashboard = false
      this.currentPermissionEdit = record
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
