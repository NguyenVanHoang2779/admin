<template>
  <div>
    <b-modal
      class="modal-add-role-cus"
      title='Tạo role mới'
      id="id-create-role"
      static
      @hide="onClose()"
    >
      <div v-loading="loading">
        <div>
          <b-row class="mb-1 ml-1">
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
          <div v-if="optionSelected === 'group'">
            <label class="form-label">Chọn group</label>
            <b-row class="mb-3">
              <b-col md="12">
                <select-group
                  :auto-close="true"
                  :multiple="false"
                  @handleGroupSelected="handleGroupSelected"
                ></select-group>
              </b-col>
            </b-row>
            <p class="hint">Hệ thống sẽ tự động đặt tên và mô tả cho Role theo Group</p>
          </div>
        </div>
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
import Multiselect from 'vue-multiselect'
import SelectGroup from 'components/elements/common/SelectGroup'
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
  name: 'ModalCreateRole',
  components: {
    PermissionManagement,
    Multiselect,
    SelectGroup
  },
  props: {
  },

  data () {
    return {
      loading: false,
      roleName: '',
      roleNameSelectedBySuggest: '',
      description: '',
      optionSelected: 'new',
      positionId: [],
      options: [
        { name: 'Tạo role mới', alias: 'new' },
        { name: 'Tạo role cho group', alias: 'group' }
      ],
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

    async createRole () {
      if (this.optionSelected === 'group') {
        return this.createRoleFromGroup()
      }
      let isValidate = false
      await this.$validator.validateAll().then((result) => {
        isValidate = result
        return true
      })
      if (!isValidate) return
      let data = {
        name: this.roleName,
        description: this.description
      }
      if (this.note) {
        data.note = this.note
      }
      this.loading = true
      try {
        const res = await PermissionManagement.createRole(data)
        if (res.data.success) {
          this.$emit('created')
          commonHelpers.showMessage(res.data.message || 'Tạo role thành công', 'success')
          this.$bvModal.hide('id-create-role')
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

    async createRoleFromGroup () {
      this.loading = true
      try {
        const res = await PermissionManagement.createRoleFromGroup({group_id: this.groupId})
        if (res.data.success) {
          this.$emit('created')
          commonHelpers.showMessage(res.data.message || 'Tạo role thành công', 'success')
          this.$bvModal.hide('id-create-role')
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
      if (option.name) {
        this.roleNameSelectedBySuggest = option.name
      }
    },

    handleGroupSelected (option) {
      if (option && option.id) {
        this.groupId = option.id
      }
    },

    resetData () {
      this.note = null
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

.hint {
  color: #00b8ff;
}

</style>
