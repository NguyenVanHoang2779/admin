<template>
  <div>
    <b-modal id="modal-user-manage" modal-class="modal-md" ref="typeDocumentsModal" title="Quản lý User" @hidden="resetModal" centered hide-footer>
      <b-tabs
        active-nav-item-class="font-weight-bold text-success"
        active-tab-class="font-weight-bold text-success"
        content-class="mt-3"
      >
        <b-tab v-if="permissionDocument.global" title="User quản lý văn bản chung" active>
          <div v-if="listUsers.global && listUsers.global.length > 0" class="d-flex">
            <div>
              <span class="types" v-for="user in listUsers.global" :key="user.id">
                <span class="document-type">
                  <a href="javascript:void(0)" class="position-relative">
                    <i class="ion ion-md-close-circle-outline position-absolute" @click="updateUserManage(user.id, 'delete', 'global')"></i>
                    <span>{{user.username}} - {{user.fullname}}</span>
                  </a>
                </span>
              </span>
            </div>
          </div>
          <div v-else>Không có User nào!</div>
          <div  v-if="!formAddUser" class="mt-3"><b-button variant="outline-success" @click="addFormUser">+ Thêm User</b-button></div>
          <div v-else class="mt-3">
            <b-row>
              <b-col md="8">
                <multi-select-user :users="userIdsAdd" @onChange="handleUserSelected" :multi="true" ></multi-select-user>
              </b-col>
              <b-col md="4">
                <b-button variant="success" @click="updateUserManage(userIdsAdd, 'add', 'global')" style="padding: 5px; float:left"><i class="ion ion-md-save"></i> Thêm User</b-button>
                <i class="ion ion-md-close cancel-attach-type" @click="addFormUser"></i>
              </b-col>
            </b-row>
          </div>
        </b-tab>
        <b-tab v-if="permissionDocument.legislation" title="User quản lý văn bản pháp lý">
          <div v-if="listUsers.legislation && listUsers.legislation.length > 0" class="d-flex">
            <div>
              <span class="types" v-for="user in listUsers.legislation" :key="user.id">
                <span class="document-type">
                  <a href="javascript:void(0)" class="position-relative">
                    <i class="ion ion-md-close-circle-outline position-absolute" @click="updateUserManage(user.id, 'delete', 'legislation')"></i>
                    <span>{{user.username}} - {{user.fullname}}</span>
                  </a>
                </span>
              </span>
            </div>
          </div>
          <div v-else>Không có User nào!</div>
          <div  v-if="!formAddUser" class="mt-3"><b-button variant="outline-success" @click="addFormUser">+ Thêm User</b-button></div>
          <div v-else class="mt-3">
            <b-row>
              <b-col md="8">
                <multi-select-user :users="userIdsAdd" @onChange="handleUserSelected" :multi="true" ></multi-select-user>
              </b-col>
              <b-col md="4">
                <b-button variant="success" @click="updateUserManage(userIdsAdd, 'add', 'legislation')" style="padding: 5px; float:left"><i class="ion ion-md-save"></i> Thêm User</b-button>
                <i class="ion ion-md-close cancel-attach-type" @click="addFormUser"></i>
              </b-col>
            </b-row>
          </div>
        </b-tab>
      </b-tabs>

    </b-modal>
  </div>
</template>
<script>

// service
import documentService from 'domain/services/document-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import MultiSelectUser from 'components/elements/document/MultiSelectUser'

export default {
  name: 'modal-user-manage',

  props: [
    'permissionDocument'
  ],

  components: {
    MultiSelectUser
  },

  data: () => ({
    documentTypeName: '',
    formAddUser: false,
    listUsers: {},
    userIdsAdd: ''
  }),

  created () {
    this.getListUserManage()
  },

  watch: {
  },

  methods: {
    addFormUser: function () {
      this.formAddUser = !this.formAddUser
    },

    resetModal: function () {
      this.formAddUser = false
    },

    getListUserManage: function () {
      documentService.getListUserManage()
        .then(res => {
          if (res.data.success) {
            this.listUsers = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    updateUserManage: function (userIds, status, type) {
      let data = {}
      if (status === 'delete') {
        if (!confirm(`Bạn có chắc chắn muốn xóa User quản lý?`)) return
        data = {
          userIds,
          status,
          type
        }
      }
      if (status === 'add') {
        data = {
          'userIds': this.getUserSelected(userIds),
          status,
          type
        }
      }
      documentService.updateUserManage(data)
        .then(res => {
          if (res.data.success) {
            this.getListUserManage()
            this.addFormUser()
            commonHelper.showMessage(res.data.data, 'success')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getUserSelected: function (option) {
      return option ? option.map((item) => item.id).toString() : ''
    },

    handleUserSelected: function (option) {
      this.userIdsAdd = option || null
    }
  }
}
</script>

<style lang="scss" scoped>
  .only-bottom-border {
    border: 0;
    border-bottom: solid 1px;
    border-radius: 0;
    border-bottom-color: #8b949d;
  }

  .cancel-attach-type {
    height: 32px;
    line-height: 32px;
    width: 32px;
    color: #6b778c;
    font-size: 24px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;
  }
  .types a {
    margin-top: 5px;
    float: left;
    position: relative;
    margin-right: 20px;
    width: auto;
    height: 30px;
    padding: 0 12px;
    line-height: 30px;
    background: #1f8dd6;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    i {
      display: none;
      top: -8px;
      left: -5px;
      color: #6e7a8a;
      background: white;
      border-radius: 16px;
    }
  }

  .types a:before {
    content: "";
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    border-style: solid;
  }

  .types a:after {
    content: "";
    position: absolute;
    top: 13px;
    width: 4px;
    height: 4px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    background: #fff;
    -moz-box-shadow: -1px -1px 2px #004977;
    -webkit-box-shadow: -1px -1px 2px #004977;
    box-shadow: -1px -1px 2px #004977;
  }
  /* Add rounded corners to left end of the anchor tag */
  .document-type a {
    -moz-border-radius-bottomleft: 4px;
    -webkit-border-bottom-left-radius: 4px;
    border-bottom-left-radius: 4px;
    -moz-border-radius-topleft: 4px;
    -webkit-border-top-left-radius: 4px;
    border-top-left-radius: 4px;
  }

  /* Position right and show only left border of triangle  */
  .document-type a:before {
    right: -15px;
    border-color: transparent transparent transparent #1f8dd6;
    border-width: 15px 0 15px 15px;
  }

  /* Fix the circle between anchor box and triangle right to it  */
  .document-type a:after {
    right: -2px;
  }

  .types a:hover {
    background: #1d85ca;
    i {
      display: inline;
    }
  }

  .document-type a:hover:before {
    border-color: transparent transparent transparent #1d85ca;
  }
</style>
