<template>
  <div class="wrapper">
      <div class="top topRowCustom align-items-center">
        <div class="title-permission">
          <div><span @click="$emit('backToDetailPermission')" class="back-cus"><i style="cursor: pointer;" class="ion ion-ios-arrow-back"></i></span></div>
          <div class="ml-4">
            <h4 style="color: #02a065; line-height: 2.2rem !important;" class="m-0">THÔNG TIN CHI TIẾT ROLE:</h4>
          </div>
          <div class="ml-2">
            <h4 style="color: #02a065; line-height: 2.2rem !important;" class="m-0">{{ dataRole.description.toUpperCase() }}</h4>
          </div>
        </div>
        <div class="btn-add-role">
          <b-button variant="outline-info" @click="$emit('showModalAssignRole', {typeUpdateRole: 'assign', data: dataRole})"><i class="ion ion-ios-add"></i> Thêm đối tượng mới vào role</b-button>
        </div>
      </div>

      <div class="mb-3">
        <div class="action-cus">
          <div class="title-cus">
            <b-form-input
              style="margin-left: 0.6rem;"
              class="input-search-cus"
              v-model="username"
              placeholder="Tìm kiếm user..."
            >
            </b-form-input>
            <b-button :disabled="modelLoading" class="btSearch" style="background: #080808;margin-left: 1rem;" @click="search">
              <i class="ion ion-md-search"></i>
            </b-button>
          </div>
          <div class="add-permission-cus">
            <b-button variant="outline-danger" @click="$emit('showModalAssignRole', {typeUpdateRole: 'remove', data: dataRole})"><i class="ion ion-ios-add"></i> Xoá đối tượng khỏi role</b-button>
          </div>
        </div>
        <div class="wrapper-list-master">
          <b-card no-body>
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
              <tbody v-loading="modelLoading" class="position-relative" style="height: 54px;">
              <tr style="text-align: center;" v-for="(model, index) in listModel" :key="index" v-if="listModel && listModel.length > 0">
                <td style="padding-top: 0.8rem !important;">{{ index + 1 }}</td>
                <td style="padding-top: 0.8rem !important;">{{ model.username }}</td>
                <td style="padding-top: 0.8rem !important;">{{ model.fullname }}</td>
                <td style="padding-top: 0.8rem !important;">{{ model.group_name }}</td>
                <td style="padding-top: 0.8rem !important;">{{ model.department }}</td>
                <td style="padding-top: 0.8rem !important;">{{ model.position_name }}</td>
                <td>
                  <b-button variant="ghtk" @click="removeRole(model)" style="background-color: white;color: red;border: 1px solid;">
                    <i class="ion ion-md-trash"></i>
                  </b-button>
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
          <div class="no-result-cus" v-if="!modelLoading && listModel && listModel.length === 0 ">&#128557; Chưa có user nào được config cho role !</div>
        </div>
      </div>
    <!-- paging  -->
    <div class="row mt-3 align-items-center">
      <div class="col col-md-9 text-left">
        <b class="text-black">
          Bản ghi/ trang
        </b>
        <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                v-model="pageRole.per_page" @change="getListModelByRole()">
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
            v-model="pageRole.current_page"
            :total-rows="+pageRole.total_row"
            :per-page="+pageRole.per_page"
            @input="getListModelByRole()"
          >
          </b-pagination>
        </div>
      </div>
    </div>
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
  .btn-add-role {

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
  box-shadow: 2px -4px #b1b1b1;
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
  margin-bottom: 0.8rem;
  justify-content: space-between;
  .title-cus {
    display: flex;
    font-size: 20px;
    font-weight: 500;
  }
  .add-permission-cus {
    display: flex;
    button {
      font-weight: 500;
      width: 14.5rem;
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
}
.back-cus {
  font-size: 24px;
}
</style>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'

export default {
  name: 'detail-permission',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect
  },
  props: {
    dataRole: {}
  },
  data: () => ({
    modelLoading: false,
    listModel: [],
    dataRequest: {
      name: ''
    },
    username: '',
    dataRoleSearch: '',
    // listModelBefore: [],
    isQuickSearch: false,
    pageRole: {
      current_page: 1,
      per_page: 10,
      total_row: 0
    }
  }),

  watch: {
    dataRole: {
      immediate: true,
      handler (old, val) {
        this.getListModelByRole()
      },
      deep: true
    }
  },
  computed: {
  },
  created () {
  },

  mounted () {
    this.$root.$on('AssignRoleSuccess', idRole => {
      if (+idRole === +this.dataRole.id) {
        this.getListModelByRole()
      }
    })
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    removeRole: async function (model) {
      if (!confirm('Bạn có chắc chắn muốn loại ' + (model.username || '') + ' khỏi role ' + (this.dataRole.name || '') + ' !')) {
        return
      }
      let data = {
        type: 'remove',
        model_type: 'user',
        model_ids: [model.user_id],
        role_id: this.dataRole.id
      }
      this.loading = true
      try {
        const res = await PermissionManagement.updateRole(data)
        if (res.data.success) {
          let data = res.data.data || []
          if (data.list_user_failed && data.list_user_failed.length > 0) {
            await this.getListModelByRole()
            return commonHelpers.showMessage(data.list_user_failed.join(',') + ' chưa thuộc role ' + (this.dataRole.name || ''), 'warning')
          }
          commonHelpers.showMessage(res.data.message || 'Đã xóa thành công user khỏi role', 'success')
          await this.getListModelByRole()
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi loại bỏ user khỏi role', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    // quickSearchRole () {
    //   if (this.dataRoleSearch.length > 0) {
    //     this.listModel = this.listModelBefore.filter((item) => item.description.toUpperCase().includes(this.dataRoleSearch.toUpperCase()))
    //     this.isQuickSearch = true
    //   } else {
    //     this.listModel = JSON.parse(JSON.stringify(this.listModelBefore))
    //   }
    // },

    getListModelByRole: async function () {
      if (!this.dataRole || (this.dataRole && !this.dataRole.id)) {
        return commonHelpers.showMessage('Không xac định được được id Permission', 'warning')
      }
      let params = {
        role_id: this.dataRole.id,
        ...this.pageRole
      }
      if (this.username.length > 0) {
        params.username = this.username
      }
      this.modelLoading = true
      try {
        const res = await PermissionManagement.getListModelByRole(params)
        if (res.data.success) {
          this.listModel = res.data.data.data
          this.pageRole.current_page = res.data.data.current_page
          this.pageRole.per_page = res.data.data.per_page
          this.pageRole.total_row = res.data.data.total
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi Hr xác nhận', 'warning')
        }
      } finally {
        this.modelLoading = false
      }
    },

    search () {
      this.pageRole.current_page = 1
      this.pageRole.per_page = 10
      this.getListModelByRole()
    },

    openModal () {
      this.$bvModal.show('id_modalConfig')
    }
  }
}
</script>
