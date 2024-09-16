<template>
  <div class="wrapper-object">
    <b-modal
      class="modal-role-position"
      title="Danh sách các role được tạo riêng cho từng vị trí"
      id="id-modal-role-position"
      static
      @hide="onClose()"
    >
      <div class="list-data-container">
<!--        search-->
        <div class="add-permission-cus w-30 mb-4">
          <b-form-input
            class="input-search-cus"
            v-model="dataQuickSearch"
            placeholder="Tìm kiếm..."
            @input="quickSearch"
          >
          </b-form-input>
        </div>

        <!--      table -->
        <div class="table-user mt-2">
          <div class="wrapper-list-master">
            <b-card no-body style="border: none;">
              <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
                <thead>
                <tr class="trCustom">
                  <th class="w-5">STT</th>
                  <th class="w-10">Position Id</th>
                  <th class="w-25">Position Name</th>
                  <th class="w-10">Role Id</th>
                  <th class="w-25">Role Name</th>
                  <th class="w-30">Description</th>
                  <th class="w-5">Action</th>
                </tr>
                </thead>
                <tbody v-loading="loading" class="position-relative" style="height: 54px;">
                <tr style="text-align: center;" v-for="(record, index) in dataRolePosition" :key="index" v-if="dataRolePosition && dataRolePosition.length > 0">
                  <td>{{ (index + 1) }}</td>
                  <td>{{ record.position_id }}</td>
                  <td>{{ record.position_name }}</td>
                  <td>{{ record.role_id }}</td>
                  <td>{{ record.role_name }}</td>
                  <td>{{ record.description }}</td>
                  <td>
                    <router-link
                      class="user-link"
                      :to="'/rbac/role-dashboard/' + record.role_name">
                      <i class="ion ion-ios-eye"></i>
                    </router-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-card>
            <div class="no-result-cus" v-if="!loading && dataRolePosition && dataRolePosition.length === 0">Không tìm thấy kết quả</div>
          </div>
        </div>
      </div>
      <template slot="modal-footer">
        <button :disabled="loading" type="button" class="btn btn-success" @click="onClose">Đóng</button>
      </template>
    </b-modal>
  </div>
</template>
<style scoped lang="scss">
.modal-role-position {
  /deep/ .modal-dialog {
    max-width: 99rem !important;
    margin-top: 1rem !important
  }
  /deep/ .modal-header {
    padding: 1rem !important;
    .close {
      font-size: 1.5rem !important;
    }
  }
  /deep/ .modal-body {
    padding-bottom: 0rem !important;
  }
  /deep/ .modal-footer {
    text-align: center;
    display: inline-block;
  }
}

.icon-compare-cus {
  display: flex;
  justify-content: center;
  line-height: 3rem;
  font-weight: 500;
}

.wrapper-object{
  margin-top: 0rem !important;
}
.wrapper-object.topRowCustom{
  margin-bottom: 20px;
}
.list-data-container {
  max-height: 48rem;
  min-height: 12rem;
  overflow-y: auto;
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
  //height: 2rem !important;
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
  top: -2.2rem;
  color: #f66a6a;
}

.btn-add, .user-link {
  padding: 0.3rem 0.6rem;
  border: 1px solid green;
  border-radius: 4px;
  display: inline-block;
}

.btn-add {
  padding: 0.3rem 0.75rem;
  color: #2f9d3c;
  cursor: pointer;
}

.user-current, .user-compare {
  padding: 0 !important;
  text-align: center !important;
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
// component
export default {
  name: 'modal-role-position',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect
  },
  props: {
  },
  data: () => ({
    loading: false,
    dataRolePosition: [],
    dataQuickSearch: '',
    dataRolePositionBefore: []
  }),

  watch: {
  },

  mounted () {
  },
  computed: {
  },
  created () {
    this.getData()
  },

  methods: {
    onClose () {
      this.resetData()
    },

    resetData () {
      this.$bvModal.hide('id-modal-role-position')
    },

    getData: async function () {
      this.loading = true
      try {
        const res = await PermissionManagement.getListRolePosition()
        if (res.data.success) {
          this.dataRolePositionBefore = this.dataRolePosition = res.data.data
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy danh sách role theo position', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    quickSearch () {
      if (this.dataQuickSearch.length > 0) {
        this.dataRolePosition = this.dataRolePositionBefore.filter((item) => item.position_name.toUpperCase().includes(this.dataQuickSearch.toUpperCase()))
      } else {
        this.dataRolePosition = JSON.parse(JSON.stringify(this.dataRolePositionBefore))
      }
    }
  }
}
</script>
