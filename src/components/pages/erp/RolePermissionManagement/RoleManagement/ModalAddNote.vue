<template>
  <div>
    <b-modal
      class="modal-add-role-cus"
      title='Ghi chú'
      id="id-add-note"
      static
      @hide="onClose()"
    >
      <div>
        <div>
          <b-row class="mb-3">
            <b-col md="12">
              <label class="form-label">Nhập ghi chú: (không bắt buộc)</label>
              <b-form-input
                id="input-note"
                name="input-note"
                v-model="note"
                placeholder="Thay đổi này được thực hiện do task nào..."
                trim>
              </b-form-input>
            </b-col>
          </b-row>
        </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-success" @click="addNote()" style="margin-right: 41%">Xác nhận</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// service

export default {
  name: 'ModalAddNote',
  components: {
  },
  props: {
  },

  data () {
    return {
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

    addNote () {
      this.$emit('addNote', {note: this.note})
      this.$bvModal.hide('id-add-note')
    },

    resetData () {
      this.note = null
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
