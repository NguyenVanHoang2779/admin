<template>
  <div class="wrapper-object">
    <b-modal
      class="modal-show-difference"
      title="So sánh quyền"
      id="id-modal-show-difference"
      static
      @hide="onClose()"
    >
      <div class="list-data-container">
        <div class="action-cus row">
          <div class="col-5">
            <b-input
              v-model="infoNameCurrent"
              disabled>
            </b-input>
          </div>
          <div class="col-md-1 icon-compare-cus">Với</div>
          <div class="col-6">
            <div class="add-permission-cus row">
              <multi-select-user
                ref="refSelectUser"
                class="z-3 mul-cus multiselect-no-horizontal"
                @onChange="selectedUser"
                style="margin: 0 !important;width: 30rem; min-height: 0"
                :multiple="false"
                placeholder="Nhập username muốn so sánh...">
              </multi-select-user>
              <b-button :disabled="loading || !userIdCompare" class="btSearch" @click="getDataCompare('compare')">
                <i class="ion ion-md-search"></i>
              </b-button>
            </div>
          </div>
        </div>

        <!--      table -->
        <div class="table-user mt-2" v-if="infoUserCurrent && infoUserCompare && dataAllRole && dataAllRole.length > 0">
          <div class="option-object row">
            <label class="col-md-5" for="" style="line-height: 2rem;font-weight: 500;">So sánh danh sách role với user {{ infoUserCompare.username }}:</label>
          </div>
          <div class="wrapper-list-master">
            <b-card no-body style="border: none;">
              <table class="table table-hover table-bordered table-sm mb-0 mih-5re shadow-sm">
                <thead>
                <tr class="trCustom">
                  <th class="w-5">STT</th>
                  <th class="w-15">Role</th>
                  <th class="w-50">Danh sách quyền</th>
                  <th class="w-10">{{ infoUserCurrent.username }}</th>
                  <th class="w-10">{{ infoUserCompare.username }}</th>
                  <th class="w-10">Thao tác</th>
                </tr>
                </thead>
                <tbody v-loading="loading" class="position-relative" style="height: 54px;">
                <tr v-for="(record, index) in dataAllRole" :key="index">
                  <td style="text-align: center; padding-left: 0rem;">{{ (index + 1) }}</td>
                  <td>{{ record.name }}</td>
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
                  <td class="user-current">
                    <i v-if="isExistItem(dataUserCurrent, record.id)" class="fa fa-check-circle" style="color: green"></i>
                    <i v-else class="fa fa-times-circle" style="color: red"></i>
                  </td>
                  <td class="user-compare">
                    <i v-if="isExistItem(dataUserCompare, record.id)" class="fa fa-check-circle" style="color: green"></i>
                    <i v-else class="fa fa-times-circle" style="color: red"></i>
                  </td>
                  <td style="text-align: center; padding-left: 0rem;">
                  <span v-if="!isExistItem(dataUserCurrent, record.id) && isExistItem(dataUserCompare, record.id)" class="btn-add" @click="assignRole(record)">
                    <i class="ion ion-md-add"></i>
                  </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-card>
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
.modal-show-difference {
  /deep/ .modal-dialog {
    max-width: 82rem !important;
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
  max-height: 49rem;
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
import moment from 'moment/moment'
// component
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
export default {
  name: 'modal-show-difference-user',
  components: {
    PermissionManagement,
    commonHelpers,
    Multiselect,
    MultiSelectUser
  },
  props: {
    infoUserCurrent: null
  },
  data: () => ({
    dataSearch: null,
    userIdCompare: null,
    loading: false,
    dataUserCurrent: [],
    dataUserCompare: [],
    infoUserCompare: null,
    dataAllRole: [],
    infoNameCurrent: ''
  }),

  watch: {
    infoUserCurrent: {
      deep: true,
      handler (oldVal, newVal) {
        if (this.infoUserCurrent && this.infoUserCurrent.user_id) {
          this.getDataCompare('current')
          if (this.infoUserCurrent.username && this.infoUserCurrent.fullname && this.infoUserCurrent.position_name) {
            this.infoNameCurrent = this.infoUserCurrent.username + ' - ' + this.infoUserCurrent.fullname + ' - ' + this.infoUserCurrent.position_name
          }
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
      this.userIdCompare = null
      this.loading = false
      this.dataUserCompare = []
      this.infoUserCompare = null
      this.dataAllRole = []
      this.$refs.refSelectUser.resetOption()
      this.$emit('closeModal')
      this.$bvModal.hide('id-modal-show-difference')
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    getDataCompare: async function (typeUser) {
      if (typeUser === 'compare' && !this.userIdCompare) {
        return commonHelpers.showMessage('Không xác định được userId', 'warning')
      }
      if (typeUser === 'current' && !this.infoUserCurrent.user_id) {
        return commonHelpers.showMessage('Không xác định được userId', 'warning')
      }
      this.loading = true
      let params = {
        user_id: typeUser === 'current' ? this.infoUserCurrent.user_id : this.userIdCompare,
        get_all: 1,
        position_id: this.infoUserCurrent.position_id
      }
      try {
        const res = await PermissionManagement.getDataCompare(params)
        if (res.data.success) {
          if (res.data.data && res.data.data.data) {
            if (typeUser === 'current') {
              this.dataUserCurrent = res.data.data.data
            } else {
              this.dataUserCompare = res.data.data.data
              this.dataAllRole = this.convertDataRole()
            }
          }
          if (res.data.data && res.data.data.infoUser) {
            this.infoUserCompare = res.data.data.infoUser
          }
        } else {
          this.dataUserCompare = []
          this.dataAllRole = []
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        this.dataUserCompare = []
        this.dataAllRole = []
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    convertDataRole () {
      let data = [...this.dataUserCompare, ...this.dataUserCurrent]
      let dataAllRole = []
      data.forEach((item) => {
        if (!this.isExistItem(dataAllRole, item.id)) {
          dataAllRole.push(item)
        }
      })
      return dataAllRole
    },

    isExistItem (arr, id) {
      if (!arr.find((item) => +item.id === +id)) {
        return false
      }
      return true
    },

    selectedUser (option) {
      this.userIdCompare = option ? option.id : null
    },

    async assignRole (role) {
      if (!confirm('Bạn có chắc chắn muốn assign role ' + role.name + ' cho user ' + (this.infoUserCurrent.username || '') + ' !')) {
        return
      }

      if (!role.id) {
        return commonHelpers.showMessage('Không xác định được role Id', 'warning')
      }

      let data = {
        type: 'assign',
        model_ids: [this.infoUserCurrent.user_id],
        role_id: role.id,
        model_type: 'user'
      }
      this.loading = true
      try {
        const res = await PermissionManagement.updateRole(data)
        if (res.data.success) {
          this.$emit('assignSuccess')
          commonHelpers.showMessage(res.data.message || 'Thêm role thành công cho user', 'success')
          this.dataUserCurrent.push(role)
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi', 'warning')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
