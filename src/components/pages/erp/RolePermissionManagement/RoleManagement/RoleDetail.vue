<template>
  <div class="wrapper">
    <div class="detail-per-cus">
<!--      header-->
      <div class="top header-detail-role align-items-center">
        <div class="title-group">
          <div class="title-left">
            <div><span @click="$emit('back')" class="back-cus"><i style="cursor: pointer;" class="ion ion-ios-arrow-back"></i></span></div>
            <div class="ml-4">
              <h4 style="color: #02a065; line-height: 2.2rem !important;" class="m-0">THÔNG TIN CHI TIẾT ROLE</h4>
            </div>
          </div>
        </div>
        <div class="description-cus row">
          <div class="name col-md-3">Tên: {{ dataRole.name }}</div>
          <div class="des col-md-3">Mô tả: {{ dataRole.description }}</div>
          <div class="created col-md-3">Ngày tạo: {{ formatDate(dataRole.created_at, 'DD-MM-YYYY H:mm:ss') }}</div>
        </div>
      </div>

      <div class="statistics-cus">
<!--        Group-->
        <div class="card-cus">
          <div class="title title-group">
            Group:
          </div>
          <div class="number">{{ numberGroup }}<span class="text-tail">Group</span></div>
        </div>

        <!--        Position-->
        <div class="card-cus">
          <div class="title title-position">
            Position:
          </div>
          <div class="number" >{{ numberPosition }}<span class="text-tail">Position</span></div>
        </div>

<!--        User-->
        <div class="card-cus">
          <div class="title title-user">
            User:
          </div>
          <div class="number" >{{ numberUser }}<span class="text-tail">User</span></div>
<!--          <div class="number" v-else><i class="fas fa-spinner fa-pulse" style="margin-left: 5rem;font-size: 1.5rem;"></i></div>-->
        </div>
      </div>
<!--      body-->
      <div class="mb-3 body-cus">
<!--        Danh sách các đối tượng đang được áp dụng-->
        <div class="container-object">
          <list-object
          :data-role="dataRole"
          @updateStatistics="updateStatistics"
          >
          </list-object>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import moment from 'moment/moment'

// component
import ListObject from './ListObject.vue'

export default {
  name: 'role-detail',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect,
    ListObject
  },
  props: {
    dataRole: {}
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
    isShowDetailPermission: true,
    typeUpdateRole: 'assign',
    numberGroup: 0,
    numberPosition: 0,
    numberUser: 0

  }),

  watch: {
  },
  computed: {
  },
  created () {
  },

  mounted () {
    // this.$root.$on('AddRoleSuccess', idPermission => {
    //   if (+idPermission === +this.dataRole.id) {
    //     this.getListRoleByPermission()
    //   }
    // })
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    updateStatistics ({type, total}) {
      switch (type) {
        case 'group':
          this.numberGroup = total
          break
        case 'position':
          this.numberPosition = total
          break
        case 'user':
          this.numberUser = total
          break
      }
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

<style scoped lang="scss">
.content {
}
.wrapper {
  margin-top: 1.5rem;
  margin-left: 1rem;
  padding-bottom: 1rem;
}
.wrapper .header-detail-role{
  background-color: #fff;
  height: 9rem;
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
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  .btn-add-role {

  }
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

.statistics-cus {
  position: relative;
  display: flex;
  top: -2.8rem;
  padding-left: 3rem;
  .card-cus {
    background-color: #fff;
    margin-bottom: 30px;
    height: 9rem;
    width: 14rem;
    box-shadow: 0 1px 3px #e9e7e7;
    border-radius: 6px;
    margin-right: 8rem;
    min-width: 166px;
    .title {
      margin-top: 0.3rem;
      height: 40px;
      color: white;
      font-size: 14px;
      padding-top: 0.5rem;
      padding-left: 0.8rem;
      font-weight: 500;
    }
    .title-group {
      background: linear-gradient(to right,#53dfae,#73e9c0);
    }

    .title-position {
      background: linear-gradient(to right, #53a5df, #73d9e9);
    }
    .title-user {
      background: linear-gradient(to right, #53df6f, #d2e176);
    }
    .number {
      margin-top: 0.5rem;
      font-size: 43px;
      font-weight: 800;
      padding-left: 1rem;
      .text-tail {
        font-size: 16px;
        font-weight: 400;
        display: inline-block;
        font-family: 'Roboto';
        margin-left: 0.4rem;
      }
    }
    .list-type-object {
      margin-top: -0.6rem;
      span {
        display: inline-block;
        margin-left: 1rem;
        font-size: 12px;
      }
    }
  }
  .list-object {

  }
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
