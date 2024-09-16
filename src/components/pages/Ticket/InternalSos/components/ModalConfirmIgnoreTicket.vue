<template>
    <b-modal ref="myModalRef" id="modal-confirm-ignore-ticket" hide-footer static>
        <div class="d-block text-center">
            <h4>Bạn có chắc muốn bỏ qua SOS này</h4>
        </div>
        <b-btn class="mt-3" variant="outline-danger" block @click="submitIgnoreTicket">Xác nhận</b-btn>
    </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import sosService from 'domain/services/internal-sos-service'
export default {
  props: ['listTypes', 'relationTypes'],
  name: 'modal-confirm-ignore-ticket',

  components: {
  },
  watch: {
  },
  data: () => ({
    data: '',
    ticket_id: '',
    user_created: ''
  }),
  computed: {
  },
  created () {
    this.$root.$on('clickConfirmIgnoreTicket', (data) => {
      this.data = data
      this.ticket_id = data.ticket_id
      this.user_created = data.ticket_creator_info.fullname
      this.$bvModal.show('modal-confirm-ignore-ticket')
    })
  },
  methods: {
    // Todo: Thay đổi trạng thái ticket user
    submitIgnoreTicket () {
      sosService.apiChangeStatusTicketUser({
        ticket_id: this.ticket_id,
        status: 0
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.$bvModal.hide('modal-confirm-ignore-ticket')
            this.$emit('getTickets')
          }
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).catch(() => {
      }).then(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
