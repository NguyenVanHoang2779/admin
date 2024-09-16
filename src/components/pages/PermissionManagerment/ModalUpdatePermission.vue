<template lang="">
  <div>
    <b-modal title="Thêm quyền" id="update-permission" modal-class="modal-xl" centered @shown="getData" hide-footer>
      <div v-loading="loadingData">
        <b-row>
          <b-col>
            <b-form-group>
              <span slot:label>Nhóm chức năng <span class="text-danger">(*)</span></span>
              <select-group-function
                :disabled="type === 'edit'"
                :state="infoPermission.function_group_id === '' ? false : null"
                :group-function-ids="infoPermission.function_group_id"
                placeholder=""
                @handleGroupFunctionSelected="handleGroupFunctionSelected"
            ></select-group-function>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
              <span slot:label>Tên chức năng <span class="text-danger">(*)</span></span>
              <select-function
                :disabled="type === 'edit'"
                :function-ids="infoPermission.id"
                :group-function-ids="infoPermission.function_group_id"
                :state="infoPermission.id === '' ? false : null"
                placeholder=""
                @handleFunctionSelected="handleFunctionSelected"
              ></select-function>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Nhóm có quyền">
              <select-group
                :group-ids="infoPermission.group_id"
                placeholder=""
                :auto-close="true"
                @handleGroupSelected="handleSelectField('group_id', ...arguments)"
              ></select-group>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Bộ phận có quyền">
              <multi-select-department
                :department-ids="infoPermission.department_id"
                placeholder=""
                @handleDepartmentSelected="handleSelectField('department_id', ...arguments)"
                :auto-close="true"
              ></multi-select-department>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Vị trí có quyền">
              <multi-select-position
                :position-ids="infoPermission.position_id"
                placeholder=""
                @handlePositionSelected="handleSelectField('position_id', ...arguments)"
                :auto-close="true"
              ></multi-select-position>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Nhân viên có quyền">
              <select-user
                :user-ids="infoPermission.user_id"
                placeholder=""
                :group-user="groupUser"
                @handleSelectedUser="handleSelectField('user_id', ...arguments)"
              ></select-user>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="text-center w-100" slot="modal-footer">
          <b-btn variant="success" @click="updatePermission">Cập nhật config quyền</b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// service
import permissionService from 'domain/services/permission-managerment-service'

// Utilities
import commonHelper from 'infrastructures/helpers/common-helpers'

// custom components
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectUser from './SelectUser'
import SelectGroup from 'components/elements/common/SelectGroup'
import SelectFunction from './SelectFunction'
import SelectGroupFunction from './SelectGroupFunction'

export default {
  name: 'update-permission',

  props: {
    currentEdit: {
      default: null
    },
    type: {
      default: null
    }
  },

  components: {
    SelectGroupFunction,
    SelectFunction,
    SelectUser,
    SelectGroup,
    MultiSelectPosition,
    MultiSelectDepartment
  },

  data: () => ({
    infoPermission: {
      // type: null
      function_group_id: null,
      id: null,
      department_id: null,
      group_id: null,
      position_id: null,
      user_id: null,
      region: null,
      province_id: null,
      station_id: null
    },
    groupUser: [],
    loadingData: false
  }),

  watch: {
    currentEdit: function (newValue, oldValue) {
      this.resetModal()
    }
  },

  methods: {
    getData () {
      if (this.currentEdit) this.getPermissionById()
    },

    resetModal () {
      for (const field in this.infoPermission) this.infoPermission[field] = null
    },

    validDataUpdate () {
      let requiredField = {
        id: 'Chức năng',
        function_group_id: 'Nhóm chức năng'
      }

      let message = ''
      for (const key in requiredField) {
        if (!this.infoPermission[key]) {
          message += requiredField[key] + ', '
          this.infoPermission[key] = ''
        }
      }

      if (!this.infoPermission.user_id && !this.infoPermission.group_id && !this.infoPermission.position_id) message += 'nhóm, vị trí hoặc nhân viên có quyền!'

      return message
    },

    updatePermission () {
      let message = this.validDataUpdate()
      if (message) {
        commonHelper.showMessage('Thiếu thông tin ' + message, 'warning')
        return
      }
      this.$startLoading()
      permissionService.updatePermission(this.infoPermission).then((res) => {
        if (res.data.success) {
          this.$emit('dataChange')
          commonHelper.showMessage(res.data.message, 'success')
          this.$bvModal.hide('update-permission')
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((err) => {
        console.log(err)
      }).then(() => {
        this.$stopLoading()
      })
    },

    getPermissionById () {
      this.loadingData = true
      this.$startLoading()
      permissionService.getPermission({id: this.currentEdit}).then((res) => {
        if (res.data.success) {
          this.groupUser = []
          if (res.data.isIt) {
            this.groupUser.push(3, 9, 8, 10, 22, 6, 19, 24, 15, 25) // hr, sale, sale B2C, BMR , it, kế toán
          } else {
            this.groupUser.push(3, 9, 8, 10, 22, 6, 19, 24, 25) // hr, sale, sale B2C, BMR, kế toán
          }
          if (this.type === 'copy') {
            res.data.data.id = null
            res.data.data.function_group_id = null
          }
          this.infoPermission = res.data.data
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((err) => {
        console.log(err)
      }).then(() => {
        this.$stopLoading()
        this.loadingData = false
      })
    },

    handleGroupFunctionSelected (value) {
      if (value && value.id) this.infoPermission.function_group_id = value.id
      else this.infoPermission.function_group_id = ''
    },

    handleFunctionSelected (value) {
      if (value && value.id) this.infoPermission.id = value.id
      else this.infoPermission.id = ''
    },

    handleSelectField (field, value) {
      this.infoPermission[field] = ''
      if (value) value.map((el) => (this.infoPermission[field] += el.id + ','))
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
