<template>
  <div>
    <b-modal
      class="modal-add-role-cus"
      :title="typeUpdate === 'assign' ? 'Thêm đối tượng vào role' : 'Xóa đối tượng khỏi role'"
      id="id-modal-assign-role"
      static
      @hide="onClose()"
    >
      <div v-loading="loading">
        <b-row class="mb-3" v-if="dataRole && dataRole.name">
          <b-col md="12">
            <label class="form-label">Role</label>
            <b-form-input
              id="input-live"
              v-model="dataRole.name"
              :disabled="true"
              aria-describedby="input-live-help input-name-feedback"
              trim>
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3" v-if="dataRole && dataRole.description">
          <b-col md="12">
            <label class="form-label">Mô tả role</label>
            <b-form-input
              id="input-live"
              v-model="dataRole.description"
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

        <div v-if="optionSelected === 'user'">
          <label class="form-label">Nhập username</label>
          <b-row class="mb-3">
            <b-col md="12">
              <multi-select-user
                class="z-3 multiselect-ghtk multiselect-no-horizontal"
                @onChange="selectedUser"
                :users="listUserChoice"
                placeholder="Nhân viên">
              </multi-select-user>
            </b-col>
          </b-row>
        </div>
        <div v-if="optionSelected === 'position'">
          <label class="form-label">Chọn position</label>
          <b-row class="mb-3">
            <b-col md="12">
              <multi-select-position
                @handlePositionSelected="handlePositionSelected"
                :auto-close="false"
                :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
                :hide-selected="true">
              </multi-select-position>
            </b-col>
          </b-row>
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
      </div>
      <template slot="modal-footer">
        <button :disabled="loading" :style="typeUpdate === 'remove' ? 'background-color: red;' : ''" type="button" class="btn btn-success" @click="updateRole()" style="margin-right: 45%">{{ typeUpdate === 'assign' ? 'Thêm' : 'Xóa'}}</button>
      </template>
    </b-modal>
    <modal-show-progress
      :max-progress="maxProgress"
      :cache-key="cacheKey"
      :type-update="typeUpdate"
      @progressComplete="progressComplete"
      >
    </modal-show-progress>
  </div>
</template>

<script>
// service
import PermissionManagement from 'domain/services/permission-management-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import SelectRole from './SelectRole.vue'
import Multiselect from 'vue-multiselect'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import modalShowProgress from './ModalShowProgress.vue'

export default {
  name: 'ModalAssignModelToRole',
  components: {
    PermissionManagement,
    Multiselect,
    SelectRole,
    MultiSelectUser,
    MultiSelectPosition,
    modalShowProgress
  },
  props: {
    dataRole: {},
    typeUpdate: null
  },

  data () {
    return {
      loading: false,
      roleName: '',
      userSelectedBySuggest: [],
      description: '',
      optionSelected: 'user',
      positionId: [],
      options: [
        { name: 'Chọn user', alias: 'user' },
        { name: 'Chọn position', alias: 'position' }
      ],
      listUserFailed: [],
      maxProgress: null,
      cacheKey: '',
      listUserChoice: [],
      note: null
    }
  },
  created () {
    this.resetData()
  },
  computed: {
  },
  watch: {
    optionSelected: function (val, oldVal) {
      switch (this.optionSelected) {
        case 'user':
          this.positionId = []
          break
        case 'position':
          this.userSelectedBySuggest = []
          break
      }
    }
  },
  methods: {
    onClose () {
      this.resetData()
    },

    progressComplete () {
      this.$bvModal.hide('id-modal-assign-role')
      this.$root.$emit('AssignRoleSuccess', this.dataRole.id)
    },

    async updateRole () {
      if (!this.dataRole.name) {
        return commonHelpers.showMessage('Không xác định được tên của role', 'warning')
      }

      let params = {
        type: this.typeUpdate,
        role_id: this.dataRole.id,
        model_type: this.optionSelected
      }
      switch (this.optionSelected) {
        case 'user':
          if (this.userSelectedBySuggest.length === 0) return commonHelpers.showMessage('Vui lòng chọn user', 'warning')
          params.model_ids = this.userSelectedBySuggest
          break
        case 'position':
          if (this.positionId.length === 0) return commonHelpers.showMessage('Vui lòng chọn vị trí', 'warning')
          params.model_ids = this.positionId
          break
      }

      if (this.note) {
        params.note = this.note
      }
      this.loading = true
      try {
        const res = await PermissionManagement.updateRole(params)
        if (res.data.success) {
          let data = res.data.data || []
          if (data.type && data.type === 'api') {
            this.$bvModal.hide('id-modal-assign-role')
            this.$emit('assignSuccess', {type: this.optionSelected})
            if (data.list_user_failed && data.list_user_failed.length > 0) {
              if (params.model_ids.length === data.list_user_failed.length) {
                return commonHelpers.showMessage('User ' + data.list_user_failed.join(', ') + (this.typeUpdate === 'assign' ? ' đã thuộc role' : ' không thuộc role'), 'warning')
              }
              this.$emit('showModalNoticeRole', {from: 'assign-role', data: data.list_user_failed, roleId: this.dataRole.id, type: this.typeUpdate})
            } else {
              commonHelpers.showMessage(res.data.message || 'Thành công', 'success')
            }
          }
          // else if (data.type && data.type === 'job') {
          //   // show modal tiến trình job
          //   if (data.total_user) {
          //     this.maxProgress = data.total_user
          //     this.cacheKey = data.cacheKey || ''
          //     this.$bvModal.show('id-modal-show-progress')
          //   }
          // }
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

    selectedUser (listOption) {
      this.userSelectedBySuggest = listOption ? listOption.map((option) => option.id) : []
    },

    handlePositionSelected (ops) {
      this.positionId = ops ? ops.map(item => item.id) : []
    },

    resetData () {
      this.note = null
      this.listUserChoice = []
      this.roleName = ''
      this.description = ''
      this.listUserFailed = []
      this.userSelectedBySuggest = []
      this.positionId = []
      this.groupId = []
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
    max-width: 39rem !important;
    margin-top: 9rem !important
  }
  /deep/ .modal-header {
    padding: 1rem !important;
    .close {
      font-size: 1.5rem !important;
    }
  }
  .is-danger {
    display: inline-block;
    border-color: #ff0000;
    color: #ff0000;
    box-shadow: none;
  }
}

</style>
