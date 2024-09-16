<template>
  <div>
    <b-modal
      class="modal-add-role-cus"
      :title="title"
      id="id-add-role-for-model"
      static
      @hide="onClose()"
    >
      <div v-loading="loading">
        <div>
          <label class="form-label">Nhập tên role</label>
          <b-row class="mb-3">
            <b-col md="12">
              <select-role
                ref="selectRole"
                :multiple="false"
                :placeholder="'nhập để tìm kiếm...'"
                @selectRole="handleSelectedRole"
              >
              </select-role>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col md="12">
              <label class="form-label">Ghi chú</label>
              <b-form-input
                v-model="note"
                placeholder="Task liên quan... "
                aria-describedby="input-live-help input-name-feedback"
              >
              </b-form-input>
            </b-col>
          </b-row>
        </div>
      </div>
      <template slot="modal-footer">
        <button :disabled="loading" type="button" class="btn btn-success" @click="assignRole()" style="margin-right: 44%">Thêm</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import SelectRole from './../PermissionManagement/SelectRole.vue'
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate, {
  // This is the default
  inject: true,
  // Important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
  // This is not required but avoids possible naming conflicts
  errorBagName: 'errors'
})

export default {
  name: 'modal-assign-role-for-model',
  components: {
    PermissionManagement,
    Multiselect,
    SelectRole
  },
  props: {
    modelId: null,
    title: '',
    modelType: null
  },

  data () {
    return {
      loading: false,
      roleId: null,
      roleName: '',
      note: null
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    onClose () {
      this.resetData()
    },

    async assignRole () {
      if (!this.roleId) {
        return commonHelpers.showMessage('Vui lòng chọn role', 'warning')
      }

      if (!this.modelType) {
        return commonHelpers.showMessage('Không xác định được model Type', 'warning')
      }

      let params = {
        type: 'assign',
        model_ids: [this.modelId],
        role_id: this.roleId,
        model_type: this.modelType
      }
      if (this.note) {
        params.note = this.note
      }
      this.loading = true
      try {
        const res = await PermissionManagement.updateRole(params)
        if (res.data.success) {
          let data = res.data.data || []
          let userFailed = 0
          if (data.list_user_failed && data.list_user_failed.length > 0) {
            commonHelpers.showMessage(data.list_user_failed.join(',') + ' đã thuộc role ' + this.roleName + '!', 'warning')
            userFailed = data.list_user_failed.length
          }
          if (!(params.model_ids.length === userFailed)) {
            commonHelpers.showMessage(res.data.message || 'Thêm role thành công cho user', 'success')
          }
          this.$emit('AddRoleForModelSuccess')
          this.$refs.selectRole.resetData()
          this.$bvModal.hide('id-add-role-for-model')
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
    },

    handleSelectedRole (option) {
      if (option && option.id) {
        this.roleId = option.id
        if (option.name) {
          this.roleName = option.name
        }
      } else {
        this.roleId = null
        this.roleName = ''
      }
    },

    resetData () {
      this.roleId = null
      this.roleName = ''
      this.note = null
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-add-role-cus {
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

</style>
