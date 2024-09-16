<template>
  <div class="take-care-ticket ticket-refund">
    <div class="content">
      <!-- Bồi hoàn -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Bồi hoàn</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Mã ticket bồi hoàn: <a :href="ticketRefundLink"><u>{{ ticketInfo.detail.ticket_id }}</u></a></td>
          <td>Mã đơn hàng: <a :href="orderLink"><u>{{ ticketInfo.detail.pkg_order }}</u></a></td>
        </tr>
        <tr>
          <td>Tiền bồi hoàn: <span>{{ ticketInfo.detail.refund_money }}</span></td>
          <td>Loại bồi hoàn: <span>{{ ticketInfo.detail.refund_type }}</span></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Button -->
    <Action
      :ticketInfo="ticketInfo"
    ></Action>
  </div>
</template>

<script>

import config from '../../../../../../config/app.base'
import Action from '../Action.vue'

export default {
  name: 'RefundTicket',
  components: {
    Action
  },
  props: {
    ticketInfo: {
      type: Object
    }
  },
  computed: {
    ticketRefundLink () {
      return `${config.domainGhtkAdmin}/admin/issues-refund?id=${this.ticketInfo.detail.ticket_id}`
    },
    orderLink () {
      return `${config.domainGhtkAdmin}/admin?alias=${this.ticketInfo.detail.pkg_order}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../../assets/sass/components/take-care-ticket.scss';
</style>
