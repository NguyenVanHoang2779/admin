<template>
  <div>
    <b-modal
      class="modal-add-role-cus"
      title='Thêm role'
      id="id-add-role"
      static
      @hide="onClose()"
    >
      <div v-loading="loading">
        <b-row class="mb-3" v-if="dataPermission && dataPermission.name">
          <b-col md="12">
            <label class="form-label">Permission</label>
            <b-form-input
              id="input-live"
              v-model="dataPermission.name"
              :disabled="true"
              aria-describedby="input-live-help input-name-feedback"
              trim>
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3" v-if="dataPermission && dataPermission.description">
          <b-col md="12">
            <label class="form-label">Mô tả permission</label>
            <b-form-input
              id="input-live"
              v-model="dataPermission.description"
              :disabled="true"
              aria-describedby="input-live-help input-name-feedback"
              trim>
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-1 mt-4 ml-1">
            <b-form-radio-group
              v-model="optionSelected"
              :options="options"
              class="mb-3"
              value-field="alias"
              text-field="name"
              disabled-field="notEnabled"
            ></b-form-radio-group>
        </b-row>

        <div v-if="optionSelected === 'new'">
          <b-row class="mb-3">
            <b-col md="12">
              <label class="form-label">Nhập tên role</label>
              <b-form-input
                id="input-role"
                name="input-role"
                v-model="roleName"
                placeholder="Nhập tên role"
                v-validate="{ required: true }"
                :class="{'is-danger': errors.has('input-role')}"
                aria-describedby="input-live-help input-name-feedback"
                trim>
              </b-form-input>
              <span v-show="errors.firstRule('input-role') == 'required'" class="mt-2 is-danger">Vui lòng nhập tên role </span>
            </b-col>
          </b-row>

          <b-row class="mb-3">
            <b-col md="12">
              <label class="form-label">Nhập mô tả role</label>
              <b-form-input
                id="input-role-description"
                name="input-role-description"
                v-model="description"
                placeholder="Nhập mô tả"
                v-validate="{ required: true }"
                :class="{'is-danger': errors.has('input-role-description')}"
                aria-describedby="input-live-help input-name-feedback"
              >
              </b-form-input>
              <span v-show="errors.firstRule('input-role-description') == 'required'" class="mt-2 is-danger">Vui lòng nhập mô tả role </span>
            </b-col>
          </b-row>
        </div>
        <div v-if="optionSelected === 'available'">
          <label class="form-label">Nhập tên role</label>
          <b-row class="mb-3">
            <b-col md="12">
              <select-role
              :multiple="false"
              :placeholder="'nhập để tìm kiếm...'"
              @selectRole="handleSelectedRole"
              >
              </select-role>
            </b-col>
          </b-row>
        </div>
        <b-row class="mb-3">
          <b-col md="12">
            <label class="form-label" style="color: red;">Đặt tên role theo nguyên tắc: (<span class="text-danger">*</span>)</label>
            <div class="name-rule-cus">
              <p>ten-group-team.cap-bac</p>
              <p>Ví dụ: hrm-team.leader, hrm-team.staff</p>
            </div>
            <span v-show="errors.firstRule('input-permission-description') == 'required'" class="mt-2 is-danger">Vui lòng nhập mô tả role</span>
          </b-col>
        </b-row>

      </div>
      <template slot="modal-footer">
        <button :disabled="loading" type="button" class="btn btn-success" @click="createRole()" style="margin-right: 41%">Thêm mới</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import SelectRole from './SelectRole.vue'
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
  name: 'ModalAddRole',
  components: {
    PermissionManagement,
    Multiselect,
    SelectRole
  },
  props: {
    dataPermission: {}
  },

  data () {
    return {
      loading: false,
      roleName: '',
      roleNameSelectedBySuggest: '',
      description: '',
      optionSelected: 'new',
      options: [
        { name: 'Thêm role mới', alias: 'new' },
        { name: 'Thêm role đã có sẵn', alias: 'available' }
      ]
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

    async createRole () {
      let isValidate = false
      await this.$validator.validateAll().then((result) => {
        isValidate = result
        return true
      })
      if (!isValidate) return
      if (!this.dataPermission.name) {
        return commonHelpers.showMessage('Không xác định được tên của permission', 'warning')
      }

      if (this.roleNameSelectedBySuggest.length === 0 && this.optionSelected === 'available') {
        return commonHelpers.showMessage('Vui lòng chọn role', 'warning')
      }

      let data = {
        permission: this.dataPermission.name,
        name: this.optionSelected === 'new' ? this.roleName : this.roleNameSelectedBySuggest,
        description: this.description,
        type: this.optionSelected
      }
      this.loading = true
      try {
        const res = await PermissionManagement.addRoleToPermission(data)
        if (res.data.success) {
          this.$root.$emit('AddRoleSuccess', this.dataPermission.id)
          commonHelpers.showMessage(res.data.message || 'Thêm role thành công cho permission', 'success')
          this.$bvModal.hide('id-add-role')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    handleSelectedRole (option) {
      if (option && option.name) {
        this.roleNameSelectedBySuggest = option.name
      }
    },

    resetData () {
      this.roleName = ''
      this.description = ''
      this.$nextTick(() => {
        this.$validator.reset()
      })
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
