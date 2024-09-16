<template>
  <div>
    <b-modal :class="'modal-custom'" size="sm" id='modal-note-delete-student' centered title="Ghi chú" @hidden="hideModal" hide-header hide-footer static>
      <div class="modal-header-custom text-center">
        <span class="text-header">Xóa học viên</span>
        <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
      </div>
      <div class="class-period" title="Ghi chú">
        <div>
          <b-form-textarea
            id="textarea"
            v-model="note"
            placeholder="Nhập lý do xóa học viên"
            rows="5"
            max-rows="6"
          ></b-form-textarea>
        </div>
      </div>
      <div class="text-center mt-1 mb-1">
        <b-btn variant="ghtk" class="btn-roll-up-student" @click="deleteAcademy()">Xóa</b-btn>
      </div>
    </b-modal>

  </div>
</template>

<style lang="css" scoped>
  .class-period {
      padding: 5px 15px;
  }
  .text-header {
      font-size: 18px;
      font-weight: 500;
  }
  .modal-header-custom {
      background-color: #069255;
      color: white;
      position: relative;
      padding: 5px 10px;
  }
  .modal-header-custom .close {
      opacity: 0.8;
      color: white;
      font-size: 22px;
      font-weight: 400;
      position: absolute;
      top: 50%;
      right: 10px;
      margin: 0;
      padding: 0;
      line-height: 1.47;
      -webkit-transform: translate(0, -50%);
      transform: translate(0, -50%);
  }
  .btn-roll-up-student {
      border-radius: 3px;
      padding: 3px 25px;
  }
</style>

<script>
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalNoteDeleteStudent',

  components: {
  },

  props: {
    studentId: null
  },

  data () {
    return {
      note: ''
    }
  },
  computed: {
  },

  watch: {
  },

  methods: {
    deleteAcademy () {
      if (!this.note) {
        helper.showMessage('Vui lòng điền lý do xóa học viên')
        return
      }
      this.$emit('deleteStudent', this.note)
      this.hideModal()
    },

    hideModal () {
      this.$bvModal.hide('modal-note-delete-student')
      this.note = null
    }
  }
}
</script>
