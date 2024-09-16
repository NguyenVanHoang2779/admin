<template lang="">
  <div>
    <b-modal :title="title" id="update-function" modal-class="modal-xl" centered @hide="resetModal" @shown="getData">
      <b-row>
        <b-col>
          <b-form-group>
            <span slot:label>Tên chức năng <span class="text-danger">(*)</span></span>
            <b-form-input
              v-model="infoFunction.name"
              :state="infoFunction.name === '' ? false : null"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="">
            <template slot="label">
              <div>
                Nhóm chức năng
                <span class="text-danger">(*)</span>
                <b-btn size="sm" variant="outline-success" class="float-right" v-b-modal.update-group-function>Thêm nhóm chức năng</b-btn>
              </div>
            </template>
            <select-group-function
              :group-function-ids="infoFunction.function_group_id"
              :state="infoFunction.function_group_id === '' ? false : null"
              :group-added="newGroupFunction"
              placeholder=""
              @handleGroupFunctionSelected="handleGroupFunctionSelected"
          ></select-group-function>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group>
            <span slot:label>Tên Controller</span>
            <b-form-input
              v-model="infoFunction.controller_name"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <span slot:label>Tên Function</span>
            <b-form-input
              v-model="infoFunction.function_name"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group>
            <span slot:label>Mô tả <span class="text-danger">(*)</span></span>
            <b-form-textarea
              v-model="infoFunction.function_description"
              :state="infoFunction.function_description === '' ? false : null"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Trạng thái">
            <select-function-status
              :function-status="infoFunction.status"
              placeholder=""
              @handleFunctionStatusSelected="handleFunctionStatusSelected"
          ></select-function-status>
          </b-form-group>
        </b-col>
      </b-row>
      <div class="text-center w-100" slot="modal-footer">
        <b-btn variant="success" @click="updateFunction">{{title}}</b-btn>
      </div>
    </b-modal>
    <modal-update-group-function
      @updateStatus="handleUpdateGroupFunction"
    ></modal-update-group-function>
  </div>
</template>

<script>
// service
import permissionService from 'domain/services/permission-managerment-service'

// Utilities
import commonHelper from 'infrastructures/helpers/common-helpers'

// custom components
import SelectFunctionStatus from './SelectFunctionStatus'
import SelectGroupFunction from './SelectGroupFunction'
import ModalUpdateGroupFunction from './ModalUpdateGroupFunction'

export default {
  name: 'update-function',

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
    ModalUpdateGroupFunction,
    SelectFunctionStatus
  },

  data: () => ({
    title: 'Thêm chức năng',
    infoFunction: {
      status: null,
      name: null,
      function_group_id: null,
      function_description: null,
      controller_name: null,
      function_name: null
    },
    newGroupFunction: null
  }),

  watch: {
    type: function (newVal, oldVal) {
      if (this.type === 'edit') this.title = 'Sửa chức năng'
      if (this.type === 'add') this.title = 'Thêm chức năng'
    }
  },

  methods: {
    getData () {
      if (this.currentEdit && this.type === 'edit') this.getFunctionById()
    },

    resetModal () {
      for (const field in this.infoFunction) this.infoFunction[field] = null
    },

    validDataUpdate () {
      let requiredField = {
        name: 'Tên chức năng',
        function_group_id: 'Nhóm chức năng',
        function_description: 'Mô tả chi tiết'
      }

      let message = ''
      for (const key in requiredField) {
        if (!this.infoFunction[key]) {
          message += requiredField[key] + ', '
          this.infoFunction[key] = ''
        }
      }
      return message
    },

    updateFunction () {
      let message = this.validDataUpdate()
      if (message) {
        commonHelper.showMessage('Thiếu thông tin ' + message, 'warning')
        return
      }
      this.$startLoading()
      permissionService.updateFunction(this.infoFunction).then((res) => {
        if (res.data.success) {
          this.$emit('dataChange')
          this.$bvModal.hide('update-function')
          commonHelper.showMessage(res.data.message, 'success')
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((err) => {
        console.log(err)
      }).then(
        this.$stopLoading()
      )
    },

    getFunctionById () {
      this.$startLoading()
      permissionService.getFunctionById({id: this.currentEdit}).then((res) => {
        if (res.data.success) {
          this.infoFunction = res.data.data
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((err) => {
        console.log(err)
      }).then(
        this.$stopLoading()
      )
    },

    handleGroupFunctionSelected (value) {
      if (value && value.id) this.infoFunction.function_group_id = value.id
      else this.infoFunction.function_group_id = ''
    },

    handleFunctionStatusSelected (value) {
      if (value && value.value) this.infoFunction.status = value.value
      else this.infoFunction.function_group_id = null
    },

    handleUpdateGroupFunction (value) {
      if (value && value.id) {
        this.newGroupFunction = {id: value.id, name: value.name}
        commonHelper.showMessage('Thêm nhóm chức năng thành công', 'success')
        this.$bvModal.hide('update-group-function')
        return
      }
      commonHelper.showMessage('Thêm nhóm chức năng không thành công', 'warning')
    }
  }
}
</script>
