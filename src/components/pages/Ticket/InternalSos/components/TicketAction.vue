<template>
    <div class="ticket-sos-action">
        <div class="ticket-group-button">
          <!-- <ticket-button v-if="data.item.ticket_status_id === 1" @click.native="changeStatusTicket(2)" v-bind:classBT="`ticket-button-primary`" v-bind:labelBT="`Tiếp nhận`"></ticket-button> -->
          <ticket-button v-bind:classBT="`ticket-button-info`"  @click.native="showModalChangeType(data.item)" v-bind:labelBT="`Đổi mục SOS`"></ticket-button>
          <button class="ticket-button-note btn btn-success" @click="showModalNote(data.item.ticket_id, data.index)">Ghi chú</button>
          <!-- <ticket-button v-if="data.item.ticket_status_id === 2 || data.item.ticket_status_id === 1" @click.native="changeStatusTicket(3)" v-bind:classBT="`ticket-button-success`" v-bind:labelBT="`Hoàn thành`"></ticket-button>
          <ticket-button v-if="data.item.ticket_status_id === 3" @click.native="changeStatusTicket(1)" v-bind:classBT="`ticket-button-danger`" v-bind:labelBT="`Re-open`"></ticket-button>
          <ticket-button v-bind:classBT="`ticket-button-danger`" @click.native="showModalConfirmIgnore(data.item)" v-bind:labelBT="`Bỏ qua`"></ticket-button> -->
        </div>
        <notifications group="notifications-default"/>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import TicketButton from './TicketButton'
import TextReadMore from './TextReadMore'
import sosService from 'domain/services/internal-sos-service'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
export default {
  props: ['data'],
  name: 'ticket-action',

  components: {
    Multiselect,
    TicketButton,
    TextReadMore,
    sosService,
    SweetModal,
    SweetModalTab
  },
  watch: {
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  methods: {
    changeStatusTicket (newValue) {
      if (!this.data.detailsShowing) this.data.toggleDetails()
      sosService.apiChangeStatusTicket({
        new_value: newValue,
        ticket_id: this.data.item.ticket_id
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.data.item.ticket_logs = response.data.data
            this.data.item.ticket_status_id = newValue
          }
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        const container = this.$root.$el.querySelector(`#log-tab-${this.data.item.ticket_id}`)
        if (typeof container !== 'undefined') {
          setTimeout(() => { container.scrollTop = container.scrollHeight }, 0.01)
        }
      })
    },

    showModalChangeType (dataRow) {
      this.$root.$emit('clickChangeTypeTicket', dataRow)
    },

    showModalConfirmIgnore (data) {
      this.$root.$emit('clickConfirmIgnoreTicket', data)
    },

    showModalNote (ticketId = null, indexTicket = null) {
      this.$emit('clickNote', {ticketId: ticketId, indexTicket: indexTicket})
    }
  }
}
</script>

<style scoped lang="scss">
   .content-ticket {
       margin: 1%;
       padding: 1% 1% 0 2%;
       border-left: 4px solid green;
       background-color: #e8f1ff;
       width: 100%;
   }

   .ticket-button-note {
       color: white;
       font-weight: 500;
       height: 40px;
       width: 100%;
       background-color: #069255;
   }
</style>
