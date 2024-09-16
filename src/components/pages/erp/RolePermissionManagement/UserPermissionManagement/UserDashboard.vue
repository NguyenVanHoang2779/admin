<template>
  <div class="wrapper">
    <div class="detail-per-cus">
      <div class="header-cus">
        <b-row class="align-items-center search-user">
            <b-col md="8">
              <h4 class="m-0">QUẢN LÝ QUYỀN USER</h4>
            </b-col>
          </b-row>
          <b-row>
              <b-col class="row search">
                <multi-select-user
                  class="mul-cus"
                  @onChange="selectedUser"
                  :multiple="false"
                  placeholder="Nhập username...">
                </multi-select-user>
                <b-button :disabled="loading || !userId" class="mt-1 ml-2 btSearch btn-sm" @click="getDataUser">
                  <i class="ion ion-md-search"></i>
                </b-button>
              </b-col>
            </b-row>
      </div>

      <div class="top header-detail-role align-items-center" v-if="infoUser">
        <div class="title-group">
          <div class="title-left">
            <div class="ml-4">
              <h4 style="color: #02a065; line-height: 2.2rem !important; font-size: 20px !important;" class="m-0">THÔNG TIN USER</h4>
            </div>
          </div>
        </div>
        <div class="description-cus row">
          <div class="name col-md-3">Username: {{ infoUser.username }}</div>
          <div class="name col-md-3">Fullname: {{ infoUser.fullname }}</div>
          <div class="des col-md-3">Group: {{ infoUser.group_name }}</div>
          <div class="created col-md-3">Position: {{ infoUser.position_name }}</div>
        </div>
      </div>

<!--      Log-->
      <div class="log-cus" v-if="infoUser">
        <b-button class="btn btn-sm btn-outline-success" @click="showModalLog">
           Kiểm tra log
        </b-button>
      </div>

      <!--      body-->
      <div class="mb-3 body-cus">
        <!--        Danh sách các đối tượng đang được áp dụng-->
        <div class="container-object" v-if="infoUser">
          <list-role-permission-user
            :info-model="infoUser"
          >
          </list-role-permission-user>
        </div>
      </div>
    </div>
    <modal-log-role
    :info-model="dataGetLog"
    :title="'Log thay đổi quyền của user'"
    :type="'user'"
    @resetData="dataGetLog = null"
    ></modal-log-role>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import ListRolePermissionUser from './ListRolePermissionUser.vue'
import ModalLogRole from './ModalLogRole.vue'

// component

export default {
  name: 'user-dashboard',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect,
    MultiSelectUser,
    ListRolePermissionUser,
    ModalLogRole
  },
  props: {
  },
  data: () => ({
    loading: false,
    roleLoading: false,
    listRole: [],
    dataRequest: {
      name: ''
    },
    infoUser: null,
    currentRoleEdit: null,
    userId: null,
    dataGetLog: null
  }),

  watch: {
  },
  computed: {
  },
  created () {
    window.onblur = function () { document.title = 'User permission' }
    if (this.$route && this.$route.params && this.$route.params.user_id) {
      this.userId = this.$route.params.user_id
      this.getDataUser()
    }
  },

  mounted () {
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    openModal () {
      this.$bvModal.show('id_modalConfig')
    },

    showModalLog () {
      this.dataGetLog = JSON.parse(JSON.stringify(this.infoUser))
      this.$bvModal.show('id-modal-log-role')
    },

    getDataUser: async function () {
      if (!this.userId) {
        return commonHelpers.showMessage('Không xác định được userId', 'warning')
      }
      this.loading = true
      let params = {
        user_id: this.userId
      }
      try {
        const res = await PermissionManagement.getDataUser(params)
        if (res.data.success) {
          if (res.data.data && res.data.data[0]) {
            this.infoUser = res.data.data[0]
          }
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra lấy thông tin user', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    selectedUser (option) {
      this.userId = option ? option.id : null
    }
  }
}
</script>

<style scoped lang="scss">
.content {
}
.header-cus {
 width: 100%;
  margin-top: 1.5rem;
}
.search-user {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
}
.search {
  margin-left: 0rem;
  margin-bottom: 0.5rem;
}
.mul-cus {
  width: 24rem;
}
.btSearch {
  background-color: black !important;
  height: 2.3rem;
  width: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  margin-top: 0.25rem;
}
.wrapper {
  margin-left: 1rem;
  padding-bottom: 1rem;
}
.wrapper .topRowCustom{
  margin-bottom: 20px;
}
.wrapper .header-detail-role{
  background-color: #fff;
  height: 6.5rem;
  padding: 1rem;
  margin-bottom: 20px;
  border-radius: 3px;
  color: black;
  border: 1px solid #eff0f2;
  .title-group {
    display: flex;
    justify-content: space-between;
    .title-left {
      display: flex;
    }
  }
  .description-cus {
    font-size: 15px;
    padding-left: 2rem;
    margin-top: 0.5rem;
  }
}
.log-cus {
  margin-bottom: 0.7rem;
}
.view-object {
  margin-top: -3rem;
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
}

.action-cus {
  display: flex;
  margin-bottom: 0.5rem;
  justify-content: space-between;
  .title-cus {
    font-size: 20px;
    font-weight: 500;
  }
  .add-permission-cus {
    display: flex;
    margin-right: 0.2rem;
    width: 14.9rem;
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
}
.back-cus {
  font-size: 24px;
}
</style>
