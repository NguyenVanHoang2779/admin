<template>
  <div>
    <b-modal
      class="modal-add-permission-cus"
      title='Thêm quyền mới'
      id="id-add-permission"
      static
      @hide="onClose()"
    >
      <div v-loading="loading">
        <b-row class="mb-3">
          <b-col md="12">
            <label class="form-label">Nhập tên permission (<span class="text-danger">*</span>)</label>
            <b-form-input
              id="input-permission"
              name="input-permission"
              v-model="permissionName"
              placeholder="Nhập tên permission"
              aria-describedby="input-permission-help input-name-feedback"
              v-validate="{ required: true }"
              :class="{'is-danger': errors.has('input-permission')}"
              trim>
            </b-form-input>
            <span v-show="errors.firstRule('input-permission') == 'required'" class="mt-2 is-danger">Vui lòng nhập tên permission </span>
<!--            <b-form-invalid-feedback id="input-permission-help">This is a required field.</b-form-invalid-feedback>-->
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="12">
            <label class="form-label">Nhập mô tả (<span class="text-danger">*</span>)</label>
            <b-form-input
              id="input-permission-description"
              name="input-permission-description"
              v-model="description"
              v-validate="{ required: true }"
              :class="{'is-danger': errors.has('input-permission-description')}"
              placeholder="Nhập mô tả"
              aria-describedby="input-live-help input-name-feedback"
              >
            </b-form-input>
            <span v-show="errors.firstRule('input-permission-description') == 'required'" class="mt-2 is-danger">Vui lòng nhập mô tả permission</span>
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
        <b-row class="mb-3">
          <b-col md="12">
            <label class="form-label" style="color: red;">Đặt tên permission theo nguyên tắc: (<span class="text-danger">*</span>)</label>
            <div class="name-rule-cus">
              <p>nhom-quyen.hanh-dong</p>
              <p>Ví dụ: dependant.listing, dependant.update-status</p>
            </div>
            <span v-show="errors.firstRule('input-permission-description') == 'required'" class="mt-2 is-danger">Vui lòng nhập mô tả permission</span>
          </b-col>
        </b-row>
      </div>
      <template slot="modal-footer">
        <button :disabled="loading" type="button" class="btn btn-success" @click="createPermission()" style="margin-right: 41%">Thêm mới</button>
      </template>
    </b-modal>
    <modal-notice
    :type="typeNotice"
    :message="messageNotice"
    :data-notice="dataNotice"
    :type-update-role="typeUpdateRole"
    @close="closeModalNotice"
    >
    </modal-notice>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import ModalNotice from './ModalNotice.vue'
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
  name: 'ModalAddPermission',
  components: {
    PermissionManagement,
    Multiselect,
    ModalNotice
  },
  props: {
  },

  data () {
    return {
      loading: false,
      permissionName: null,
      description: '',
      typeNotice: '',
      messageNotice: '',
      dataNotice: [],
      currentRoleId: null,
      typeUpdateRole: '',
      note: null
    }
  },
  computed: {
  },
  watch: {
  },

  mounted () {
    this.$root.$on('showModalNotice', ({from, data, roleId, type}) => {
      this.currentRoleId = roleId
      this.fromModal = from
      this.typeNotice = 'success'
      this.messageNotice = type === 'assign' ? 'Thêm đối tượng vào role thành công' : 'Xóa thành công đối tượng khỏi role'
      this.dataNotice = data
      this.typeUpdateRole = type
      this.$bvModal.show('id-modal-notice-cus')
    })
  },
  methods: {
    onClose () {
      this.resetData()
    },

    async createPermission () {
      let isValidate = false
      await this.$validator.validateAll().then((result) => {
        isValidate = result
        return true
      })
      if (!isValidate) return
      let data = {
        name: this.permissionName,
        description: this.description
      }
      if (this.note) {
        data.note = this.note
      }
      this.loading = true
      try {
        const res = await PermissionManagement.createPermission(data)
        if (res.data.success) {
          this.messageNotice = res.data.message || 'Thêm quyền thành công'
          this.typeNotice = 'success'
        } else {
          this.messageNotice = res.data.message || 'Có lỗi xảy ra, tạo quyền thất bại'
          this.typeNotice = 'failed'
        }
        this.fromModal = 'modal-add-permission'
        this.$bvModal.show('id-modal-notice-cus')
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    resetData () {
      this.note = null
      this.permissionName = ''
      this.description = ''
      this.$nextTick(() => {
        this.$validator.reset()
      })
    },

    closeModalNotice (type) {
      if (type === 'success') {
        if (this.fromModal === 'modal-add-permission') {
          this.$bvModal.hide('id-add-permission')
          this.$emit('addPermissionSuccess')
        }

        if (this.fromModal === 'assign-role') {
          if (this.currentRoleId) {
            this.$root.$emit('AssignRoleSuccess', this.currentRoleId)
            this.listUserAssigned = []
          }
        }
      }
      this.typeNotice = ''
      this.messageNotice = ''
      this.dataNotice = []
      this.currentRoleId = null
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-add-permission-cus {
  /deep/ .modal-dialog {
    max-width: 32rem !important;
    margin-top: 4.5rem !important
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
