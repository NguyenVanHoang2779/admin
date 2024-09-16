<template>
    <div>
        <b-modal :class="'modal-custom'" size="sm" id='modal-academy-note' centered title="Ghi chú" @hidden="hideModal" hide-header hide-footer static>
            <div class="modal-header-custom text-center">
                <span class="text-header">Ghi chú</span>
                <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
            </div>
            <div class="class-period" title="Ghi chú">
                <div>
                    <b-form-textarea
                            id="textarea"
                            v-model="note"
                            placeholder="Nhập ghi chú"
                            rows="5"
                            max-rows="6"
                    ></b-form-textarea>
                </div>
            </div>
            <div class="text-center mt-1 mb-1">
                <b-btn variant="ghtk" class="btn-roll-up-student" @click="addAcademyNote()">Lưu</b-btn>
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
  name: 'modal-confirm-class',

  components: {
  },

  props: [
    'classAcademyInfoId', 'masterId', 'classId', 'periodStatus'
  ],

  data: _ => ({
    note: null
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    addAcademyNote () {
      let data = {
        id: this.classAcademyInfoId,
        note: this.note,
        masterId: this.masterId || null,
        classId: this.classId || null,
        periodStatus: this.periodStatus || null
      }

      trainingService.addAcademyNote(data)
        .then((res) => {
          if (res.data.success) {
            // list classes
            helper.showMessage(res.data.message, 'success')
            this.$bvModal.hide('modal-academy-note')
            this.$emit('refreshPage')
            this.note = null
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi thêm ghi chú!', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    },
    hideModal () {
      this.$bvModal.hide('modal-academy-note')
    }
  }
}
</script>
