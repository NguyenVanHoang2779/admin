<template>
<div>
  <b-form-group :disabled="disabled">
    <b-form-radio-group
      v-model="dependant.register_status"
      :options="options"
      :name="radioName"
      @change="checkStatus"
    ></b-form-radio-group>
  </b-form-group>
  <b-modal :id="'note-error-' + dependant.id" title="Thêm ghi chú" static centered @hide="resetStatus">
    <b-textarea
      autofocus
      v-model="note"
      placeholder="Thêm ghi chú"
      rows="5"
      max-rows="8"
    ></b-textarea>
    <div slot="modal-footer" class="w-100 text-center">
      <b-btn variant="success" @click="updateStatusDepentdentPerson(dependant.register_status)">OK</b-btn>
    </div>
  </b-modal>
</div>
</template>

<script>
import dependantService from 'domain/services/dependant-person-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'radio-change-status',

  props: {
    dependant: {
      type: Object,
      default: _ => ({})
    },
    disabled: false
  },

  data () {
    return {
      note: null,
      oldStatus: null,
      options: [
        { text: 'Chờ', value: 'wait' },
        { text: 'Thành công', value: 'success' },
        { text: 'Lỗi', value: 'error' },
        { text: 'Thiếu hồ sơ', value: 'incompleteFile' }
      ]
    }
  },

  computed: {
    radioName () {
      return 'radio-status-dependant-' + Math.random().toString()
    }
  },

  methods: {
    checkStatus (status) {
      this.oldStatus = this.dependant.register_status
      if (status === 'error') this.$bvModal.show('note-error-' + this.dependant.id)
      else this.updateStatusDepentdentPerson(status)
    },

    resetStatus () {
      if (this.oldStatus) this.dependant.register_status = this.oldStatus
    },

    updateStatusDepentdentPerson (status) {
      if (!status) return
      this.$startLoading()
      let params = {
        dependantId: this.dependant.id,
        status: status || this.dependant.register_status,
        note: status === 'error' ? this.note : null
      }
      dependantService.updateRegisterStatusDependant(params)
        .then(res => {
          if (res.data.success) {
            this.note = null
            if ((this.oldStatus === 'success' || status === 'success') && status !== this.oldStatus) this.$emit('dataChange')
            this.oldStatus = null
            this.$bvModal.hide('note-error-' + this.dependant.id)
            helper.showMessage(res.data.message, 'success')
          } else {
            this.dependant.register_status = this.oldStatus
            helper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          this.dependant.register_status = this.oldStatus
          helper.showMessage('Không thể cập nhật trạng thái !', 'warning')
          console.log(e)
        })
        .then(_ => {
          this.$stopLoading()
        })
    }
  }
}
</script>
