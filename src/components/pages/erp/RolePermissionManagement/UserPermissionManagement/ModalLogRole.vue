<template>
  <div>
    <b-modal
      class="id-modal-log-user"
      :title="title"
      id="id-modal-log-role"
      static
      @hide="onClose()"
      hide-footer
    >
      <div v-loading="loading">
        <div class="row">
          <div class="dateLog col-md-4">
            <label for="">Chọn khoảng thời gian:</label>
            <Datepicker
              :language="language.vi"
              :readonly="true"
              minimum-view="month"
              v-model="dateLog"
              format="MM/yyyy"
              placeholder="Chọn khoảng thời gian"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
            />
          </div>
          <div class="actionLog col-md-4">
            <label for="">Chọn loại log:</label>
            <Multiselect
              v-model="actionLog"
              :options="listOptions"
              label="description"
              track-by="id"
              selectedLabel="x"
              deselectLabel="x"
              selectLabel="Chọn"
            ></Multiselect>
          </div>
          <div class="actionLog col-md-4" v-if="type === 'role'">
            <label for="">Role:</label>
            <select-role
              :multiple="false"
              :placeholder="'Chọn role...'"
              @selectRole="handleSelectedRole"
            >
            </select-role>
          </div>
        </div>
        <div class="mt-3 mb-2 d-flex justify-content-center">
          <button :disabled="loading" type="button" class="btn btn-success" @click="getLogModel">Kiểm tra</button>
        </div>
        <div class="content-log">
          <div class="search-log">
            <label class="form-label">Danh sách log thay đổi:</label>
            <b-form-input @input="quickSearch()" v-model="dataSearch" placeholder="Tìm kiếm"></b-form-input>
          </div>
          <div class="list-log" v-if="listLog && listLog.length > 0">
            <div class="list-item-wrapper" v-for="(log) in listLog">
              <div class="list-bullet"></div>
              <div class="list-item">
                <div class="list-content">
                  <div v-html="$options.filters.htmlConvert(log)"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p style="text-align: center;font-size: 15px;color: red; margin-top: 1.5rem;">Danh sách log trống</p>
          </div>
        </div>
        <div class="mt-3 mb-4">
          <hr>
        </div>
        <div class="row align-items-center">
          <div class="col mb-3 col-md-12 text-center">
            <b class="text-black">
              Bản ghi/ trang
            </b>
            <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                    v-model="page.per_page" @change="getLogModel()">
              <option>10</option>
              <option>20</option>
            </select>
            <div class="z-0 d-inline-block">
              <b-pagination
                class="paginator-ghtk mb-0"
                size="sm"
                align="left"
                v-model="page.current_page"
                :total-rows="+page.total_row"
                :per-page="+page.per_page"
                @input="getLogModel()"
              >
              </b-pagination>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'

// component
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'
import SelectRole from '../PermissionManagement/SelectRole.vue'
import Vue from 'vue'

Vue.filter('htmlConvert', function (value) {
  const regex = /{([^{}]+)}/g
  const boldText = '<span class="bold">$1</span>'
  return value.replace(regex, boldText)
})

export default {
  name: 'ModalLogRole',
  components: {
    SelectRole,
    Multiselect,
    Datepicker,
    PermissionManagement
  },
  props: {
    infoModel: null,
    isGetLogRole: false,
    title: null,
    type: null
  },

  data () {
    return {
      loading: false,
      roleId: null,
      listLog: [],
      actionLog: null,
      dateLog: new Date(),
      dataSearch: '',
      listOptions: [
      ],
      language: {
        vi: vi
      },
      originalListLog: [],
      page: {
        current_page: 1,
        per_page: 10,
        total_row: 0
      },
      listTypeLogModel: [
        {
          'id': 1,
          'name': 'ASS_ROLE_MODEL',
          'description': 'Thêm vào role'
        },
        {
          'id': 2,
          'name': 'REV_ROLE_MODEL',
          'description': 'Loại khỏi role'
        }
      ],
      listTypeLogRole: [
        {
          'id': 5,
          'name': 'ASSIGN_ROLE_PER',
          'description': 'Cấp quyền'
        },
        {
          'id': 6,
          'name': 'REVOKE_ROLE_PER',
          'description': 'Thu hồi quyền'
        },
        {
          'id': 7,
          'name': 'CREATE_ROLE',
          'description': 'Tạo role'
        },
        {
          'id': 8,
          'name': 'UPDATE_ROLE_PER',
          'description': 'Chỉnh sửa danh sách quyền'
        },
        {
          'id': 9,
          'name': 'DELETE_ROLE',
          'description': 'Xóa role'
        }
      ],
      listTypeLogPermission: [
        {
          'id': 10,
          'name': 'CREAT_PER',
          'description': 'Thêm permission'
        },
        {
          'id': 11,
          'name': 'DELETE_PER',
          'description': 'Xóa permission'
        },
        {
          'id': 11,
          'name': 'UPDATE_PER',
          'description': 'Chỉnh sửa permission'
        }
      ],
      idRoleLog: null
    }
  },
  computed: {
  },
  watch: {
    infoModel: function (val, oldVal) {
      if (this.infoModel && !this.isGetLogRole) {
        this.setListOption(this.listTypeLogModel)
      }
    },
    isGetLogRole: function (val, oldVal) {
      if (!this.infoModel && this.isGetLogRole) {
        if (this.type === 'role') {
          this.setListOption(this.listTypeLogRole)
        } else {
          this.setListOption(this.listTypeLogPermission)
        }
      }
    }
  },

  mounted () {
  },

  methods: {
    onClose () {
      this.resetData()
    },

    convertLog (log) {
      let regex = /{([^{}]+)}/g
      return log.replace(regex, '<span class="bold">$1</span>') || log
    },

    quickSearch () {
      if (this.dataSearch.length > 0) {
        this.listLog = this.originalListLog.filter((item) => item.toLowerCase().includes(this.dataSearch.toLowerCase()))
      } else {
        this.listLog = this.originalListLog
      }
    },

    setListOption (dataOption) {
      this.listOptions = JSON.parse(JSON.stringify(dataOption))
      this.actionLog = this.listOptions[0]
      this.getLogModel()
    },

    handleSelectedRole (option) {
      if (option && option.id) {
        this.idRoleLog = option.id
      } else {
        this.idRoleLog = null
      }
    },

    async getLogModel () {
      if (!this.infoModel && this.type !== 'role' && this.type !== 'permission') {
        return commonHelpers.showMessage('Không xác định được modelId', 'warning')
      }

      if (!this.actionLog) {
        return commonHelpers.showMessage('Vui lòng chọn loại log', 'warning')
      }

      if (!this.dateLog) {
        return commonHelpers.showMessage('Vui lòng chọn khoảng thời gian', 'warning')
      }

      let params = {
        action: this.actionLog.name,
        month: this.dateLog.getMonth() + 1,
        year: this.dateLog.getFullYear(),
        current_page: this.page.current_page,
        per_page: this.page.per_page
      }

      if (this.type === 'user') {
        params.fromable_type = 'App\\Models\\User'
        params.fromable_id = this.infoModel.user_id || null
      }

      if (this.type === 'position') {
        params.fromable_type = 'App\\Models\\EmpPosition'
        params.fromable_id = this.infoModel.id || null
      }

      if (this.type === 'role' && this.idRoleLog) {
        params.fromable_id = this.idRoleLog
      }
      this.loading = true
      try {
        const res = await PermissionManagement.getLogRolePermission(params)
        if (res.data.success) {
          this.listLog = this.originalListLog = res.data.data.data
          this.page.current_page = res.data.data.current_page
          this.page.per_page = res.data.data.per_page
          this.page.total_row = res.data.data.total
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi lấy log', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    resetData () {
      this.userId = null
      this.roleId = null
      this.actionLog = null
      this.listOptions = []
      this.idRoleLog = null
      if (this.isGetLogRole) {
        this.$emit('getLogRoleDone')
      } else {
        this.$emit('resetData')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.id-modal-log-user {
  /deep/ .modal-dialog {
    max-width: 38rem !important;
    margin-top: 4rem !important
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
    justify-content: center !important;
  }
  .is-danger {
    display: inline-block;
    border-color: #ff0000;
    color: #ff0000;
    box-shadow: none;
  }
}

.name-rule-cus {
  p:first-child {
    padding: 0.7rem;
    border: 1px solid green;
    color: #069255;
    text-align: center;
    margin-top: 0.8rem;
    font-size: 18px;
  }
  p:last-child {
    font-style: italic;
    color: chocolate;
  }
}

.list-item-wrapper {
  display: flex;
  align-items: center;
  position:relative;
}
.list-bullet {
  float:left;
  margin-right:20px;
  background:#14a05b;
  height:5px;
  width:5px;
  border-radius:100px;
  color:white;
  text-align:center;
}
.list-item {
  display:flex;
  align-items: center;
}
.black-line {
  background:#14a05b;
  z-index:3;
  width:1px;
  height:100%;
  position:absolute;
  left:2px;
}
.list-content {
  padding-top: 5px;
  padding-bottom: 5px;
}

.content-log {
  .search-log {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .list-log {
    max-height: 28rem;
    overflow-y: auto;
  }
  label {
    font-size: 16px;
    width: 60%;
    margin-top: 0.4rem;
  }
  input {
    width: 33%
  }
}

</style>
