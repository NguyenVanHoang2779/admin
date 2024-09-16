<template>
  <div class="take-care-ticket overtime-ticket">
    <div class="content">
      <!-- Tăng ca -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Tăng ca</td>
        </tr>
        </thead>
        <tbody>
        <!-- Tăng ca tuần 1 -->
        <tr>
          <td>{{ ticketInfo.detail.title_week_1 }}</td>
        </tr>
        <tr>
          <td>
            Checkin: <span>{{ ticketInfo.detail.checkin_week_1 }}</span>
            / Checkout: <span>{{ ticketInfo.detail.checkout_week_1 }}</span>
            ({{ ticketInfo.detail.range_time_week_1 }})
          </td>
        </tr>
        <!-- Tăng ca tuần 2 -->
        <tr>
          <td>Lý do tăng ca: <span>{{ ticketInfo.detail.reason_week_1 }}</span></td>
        </tr>
        <tr>
          <td></td>
        </tr>
        <tr>
          <td>{{ ticketInfo.detail.title_week_2 }}</td>
        </tr>
        <tr>
          <td>
            Checkin: <span>{{ ticketInfo.detail.checkin_week_1 }}</span>
            / Checkout: <span>{{ ticketInfo.detail.checkout_week_1 }}</span>
            ({{ ticketInfo.detail.range_time_week_1 }})
          </td>
        </tr>
        <tr>
          <td>Lý do tăng ca: <span>{{ ticketInfo.detail.reason_week_2 }}</span></td>
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
import Action from '../Action.vue'

export default {
  name: 'OvertimeTicket',
  components: {
    Action
  },
  props: {
    ticketInfo: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../../assets/sass/components/take-care-ticket.scss';
</style>
