<template>
  <div class="wrapper">
    <div class="detail-per-cus">
      <div class="header-cus">
      <b-row class="align-items-center search-user">
        <b-col md="8">
          <h4 class="m-0">QUẢN LÝ QUYỀN POSITION</h4>
        </b-col>
      </b-row>
        <b-row>
        <b-col class="row search">
          <multi-select-position
            class="mul-cus"
            :auto-close="true"
            :is-multiple="false"
            @handlePositionSelected="handlePositionSelected"
            :hide-selected="true">
          </multi-select-position>
          <b-button :disabled="loading || !positionId" class="ml-2 btSearch btn-sm" @click="getDataPosition">
            <i class="ion ion-md-search"></i>
          </b-button>
        </b-col>
      </b-row>
      </div>
      <div class="mt-2 mb-2">
        <b-button variant="outline-success" class="btn-sm" @click="showListRolePosition()"> Xem danh sách các role được tạo cho vị trí</b-button>
      </div>

      <!--      header-->
      <div class="top header-detail-role align-items-center" v-if="infoPosition">
        <div class="title-group">
          <div class="title-left">
            <div class="ml-4">
              <h4 style="color: #02a065; line-height: 2.2rem !important; font-size: 20px !important;" class="m-0">THÔNG TIN POSITION</h4>
            </div>
          </div>
        </div>
        <div class="description-cus row">
          <div class="name col-md-3">PositionId: {{ infoPosition.id }}</div>
          <div class="name col-md-3">Name: {{ infoPosition.position_name }}</div>
          <div class="des col-md-3">Status: {{ infoPosition.status }}</div>
        </div>
      </div>

<!--      Log-->
      <div class="log-cus" v-if="infoPosition">
        <b-button class="btn btn-sm btn-outline-success" @click="showModalLogPosition">
           Kiểm tra log
        </b-button>
      </div>

      <!--      body-->
      <div class="mb-3 body-cus">
        <!--        Danh sách các đối tượng đang được áp dụng-->
        <div class="container-object" v-if="infoPosition">
          <list-role-permission-position
            :info-position="infoPosition"
          >
          </list-role-permission-position>
        </div>
      </div>
    </div>
    <modal-log-role
      :info-model="infoPositionGetLog"
      :title="'Log thay đổi quyền của position'"
      :type="'position'"
      @resetData="infoPositionGetLog = null"
    ></modal-log-role>
    <modal-role-position
    ></modal-role-position>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'
import ListRolePermissionPosition from './ListRolePermissionPosition.vue'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import ModalLogRole from '../UserPermissionManagement/ModalLogRole.vue'
import ModalRolePosition from './ModalRolePosition.vue'

// component

export default {
  name: 'position-dashboard',
  components: {
    ModalRolePosition,
    PermissionManagement,
    commonHelpers,
    Multiselect,
    ListRolePermissionPosition,
    ModalLogRole,
    MultiSelectPosition
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
    currentRoleEdit: null,
    positionId: null,
    dataGetLog: null,
    infoPosition: null,
    infoPositionGetLog: null
  }),

  watch: {
  },
  computed: {
  },
  created () {
    window.onblur = function () { document.title = 'Position permission' }
    if (this.$route && this.$route.params && this.$route.params.position_id) {
      this.positionId = this.$route.params.position_id
      this.getDataPosition()
    }
  },

  mounted () {
  },

  methods: {
    showListRolePosition () {
      this.$bvModal.show('id-modal-role-position')
    },
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    openModal () {
      this.$bvModal.show('id_modalConfig')
    },

    showModalLogPosition () {
      this.infoPositionGetLog = this.infoPosition
      this.$bvModal.show('id-modal-log-role')
    },

    getDataPosition: async function () {
      if (!this.positionId) {
        return commonHelpers.showMessage('Không xác định được positionId', 'warning')
      }
      this.loading = true
      let params = {
        position_id: this.positionId
      }
      try {
        const res = await PermissionManagement.getDataPosition(params)
        if (res.data.success) {
          if (res.data.data && res.data.data[0]) {
            this.infoPosition = res.data.data[0]
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

    handlePositionSelected (option) {
      this.positionId = option ? option.id : null
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
