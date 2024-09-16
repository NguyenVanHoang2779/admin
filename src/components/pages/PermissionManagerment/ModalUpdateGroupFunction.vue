<template lang="">
  <div>
    <b-modal title="Thêm nhóm chức năng" id="update-group-function" modal-class="modal-md" centered @hide="resetModal">
      <b-row>
        <b-col>
          <b-form-group>
            <span slot:label>Tên nhóm chức năng <span class="text-danger">(*)</span></span>
            <b-form-input
              v-model="infoFunctionGroup.name"
              :state="infoFunctionGroup.name === '' ? false : null"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group>
            <span slot:label>Mô tả chi tiết <span class="text-danger">(*)</span></span>
            <b-form-textarea
              v-model="infoFunctionGroup.description"
              :state="infoFunctionGroup.description === '' ? false : null"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <div class="text-center w-100" slot="modal-footer">
        <b-btn variant="success" @click="updateFunctionGroup">Thêm nhóm chức năng</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
// service
import permissionService from 'domain/services/permission-managerment-service'

// Utilities
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'update-group-function',

  props: {},

  data: () => ({
    infoFunctionGroup: {
      // status: null
      name: null,
      description: null
    }
  }),

  methods: {
    resetModal () {
      for (const field in this.infoFunctionGroup) this.infoFunctionGroup[field] = null
    },

    validDataUpdate () {
      let requiredField = {
        name: 'Tên nhóm chức năng',
        description: 'Mô tả chi tiết'
      }

      let message = ''
      for (const key in requiredField) {
        if (!this.infoFunctionGroup[key]) {
          message += requiredField[key] + ', '
          this.infoFunctionGroup[key] = ''
        }
      }
      return message
    },

    updateFunctionGroup () {
      let message = this.validDataUpdate()
      if (message) {
        commonHelper.showMessage('Thiếu thông tin ' + message, 'warning')
        return
      }
      this.$startLoading()
      permissionService.updateFunctionGroup(this.infoFunctionGroup).then((res) => {
        if (res.data.success) this.$emit('updateStatus', res.data.data)
        else this.$emit('updateStatus')
      }).catch((err) => {
        console.log(err)
      }).then(
        this.$stopLoading()
      )
    }
  }
}
</script>
