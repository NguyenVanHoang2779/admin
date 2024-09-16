<template>
  <div>
    <b-modal
      class="modal-add-permission-cus"
      title='Chỉnh sửa quyền'
      id="id-edit-permission"
      static
      @hide="onClose()"
    >
      <div v-loading="loading">
        <b-row class="mb-3">
          <b-col md="12">
            <label class="form-label">Tên permission (<span class="text-danger">*</span>)</label>
            <b-form-input
              id="input-permission"
              name="input-permission"
              v-model="permissionName"
              :disabled="true"
              aria-describedby="input-permission-help input-name-feedback"
              trim>
            </b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="12">
            <label class="form-label">Mô tả (<span class="text-danger">*</span>)</label>
            <b-form-input
              id="input-permission-description"
              name="input-permission-description"
              v-model="description"
              aria-describedby="input-live-help input-name-feedback"
              >
            </b-form-input>
          </b-col>
        </b-row>
      </div>
      <template slot="modal-footer">
        <button :disabled="loading" type="button" class="btn btn-success" @click="editPermission()" style="margin-right: 41%">Cập nhật</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ModalEditPermission',
  components: {
    PermissionManagement,
    Multiselect
  },
  props: {
    dataPermission: null
  },

  data () {
    return {
      loading: false,
      permissionName: null,
      description: null
    }
  },
  computed: {
  },
  created () {
    this.setData()
  },
  watch: {
    dataPermission: function (old, newVal) {
      this.setData()
    }
  },

  mounted () {
  },
  methods: {
    onClose () {

    },
    setData () {
      if (this.dataPermission && this.dataPermission.name) {
        this.permissionName = this.dataPermission.name
      }
      if (this.dataPermission && this.dataPermission.description) {
        this.description = this.dataPermission.description
      }
    },

    async editPermission () {
      let data = {
        name: this.permissionName,
        description: this.description
      }
      this.loading = true
      try {
        const res = await PermissionManagement.editPermission(data)
        if (res.data.success) {
          commonHelpers.showMessage(res.data.message || 'Chỉnh sửa permission thành công', 'success')
          this.$bvModal.hide('id-edit-permission')
          this.$emit('editPermissionSuccess')
        } else {
          commonHelpers.showMessage(res.data.message || 'Chỉnh sửa permission thành công', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-add-permission-cus {
  /deep/ .modal-dialog {
    max-width: 32rem !important;
    margin-top: 10.5rem !important
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
