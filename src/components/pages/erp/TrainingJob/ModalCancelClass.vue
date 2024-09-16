<template>
    <div>
        <b-modal :class="'modal-custom'" size="sm" id='modal-cancel-class' centered title="Ghi chú" @hidden="hideModal" hide-header hide-footer static>
            <div class="modal-header-custom text-center">
                <span class="text-header">Hủy lớp</span>
                <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
            </div>
            <div class="class-period" title="Hủy lớp">
                <div>
                    <b-form-textarea
                        id="textarea"
                        v-model="note"
                        placeholder="Nhập lý do hủy lớp"
                        rows="5"
                        max-rows="6"
                    ></b-form-textarea>
                </div>
            </div>
            <div class="text-center mt-1 mb-1">
                <b-btn variant="ghtk" class="btn-roll-up-student" :disabled="disableAction" @click="cancelClass()">Xác nhận</b-btn>
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
// service
import trainingService from 'domain/services/training-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-cancel-class',

  components: {
  },

  props: [
    'classId'
  ],

  data: _ => ({
    disableAction: false,
    note: null
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    cancelClass () {
      if (!this.note) {
        helper.showMessage('Vui lòng nhập lý do hủy lớp!', 'warning')
        return
      }
      let data = {
        class_id: this.classId,
        note: this.note
      }
      this.disableAction = true

      trainingService.cancelClass(data)
        .then((res) => {
          if (res.data.success) {
            // list classes
            helper.showMessage(res.data.message, 'success')
            this.hideModal()
            this.$emit('refreshPage')
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi lấy thông tin lớp học !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.disableAction = false
          this.loading = false
        })
    },
    hideModal () {
      this.$bvModal.hide('modal-cancel-class')
    }
  }
}
</script>
