<template>
    <div>
        <b-modal ref="curModal" :title="(action === 'confirm' ? 'Xác nhận' : 'Từ chối') + ' thưởng giới thiệu'" centered hide-footer>
            <div class="text-center mt-2">
                <h5>{{(action === 'confirm' ? 'Xác nhận' : 'Từ chối')}} thưởng giới thiệu</h5>
            </div>
            <b-form-group v-if="status == 'pending' && action == 'confirm' && role == 'OP'" label="Đánh giá ứng viên">
                <b-form-textarea v-model="comment" rows=2>
                </b-form-textarea>
            </b-form-group>
            <hr>
            <b-row>
                <b-col class='text-right'>
                    <b-btn variant='default' @click="hideModal"> Hủy bỏ </b-btn>
                    <b-btn v-if="action == 'confirm'" variant='primary' @click="confirm">Xác nhận</b-btn>
                    <b-btn v-if="action == 'abort'" variant='danger' @click="abort">Từ chối</b-btn>
                </b-col>
            </b-row>
        </b-modal>
        <sweet-modal ref="successModal" icon="success"><b>{{(action === 'confirm' ? 'Xác nhận' : 'Từ chối')}} thành công</b></sweet-modal>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import {SweetModal, SweetModalTab} from 'sweet-modal-vue'
import referenceRewardService from 'domain/services/reference-reward-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-confirm-reward',

  components: {
    SweetModal,
    SweetModalTab
  },

  props: [
    'id',
    'trigger',
    'status',
    'role',
    'action'
  ],

  data: () => ({
    comment: ''
  }),

  created () {
  },

  watch: {
    trigger: function (newVal, oldVal) {
      this.$refs['curModal'].show()
    }
  },

  methods: {
    confirm () {
      let dataSend = {
        id: this.id,
        comment: this.comment
      }
      referenceRewardService.confirm(dataSend)
        .then(res => {
          if (res.data.success) {
            this.hideModal()
            this.showSuccessModal()
            this.$emit('updateStatus', {id: this.id, status: res.data.newStatus, comment: res.data.comment})
          } else {
            helper.showMessage(res.data.message || 'Không duyệt được thưởng gới thiệu !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra !', 'warning')
        })
    },

    abort () {
      referenceRewardService.abort({id: this.id})
        .then(res => {
          if (res.data.success) {
            this.hideModal()
            this.showSuccessModal()
            this.$emit('updateStatus', {id: this.id, status: res.data.newStatus})
          } else {
            helper.showMessage(res.data.message || 'Không từ chối được thưởng gới thiệu !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra !', 'warning')
        })
    },

    hideModal () {
      this.comment = ''
      this.$refs['curModal'].hide()
    },

    showSuccessModal () {
      this.$refs['successModal'].open()
      setTimeout(() => { this.$refs['successModal'].close() }, 1200)
    }

  }
}
</script>
