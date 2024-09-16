<template>
  <div class="take-care-ticket unauthorized-absence-ticket">
    <div class="content">
      <!-- Nghỉ không phép -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Nghỉ không phép</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Nghỉ không phép: <span>{{ ticketInfo.detail.date_on_leave }}</span></td>
        </tr>
        <tr v-if="ticketInfo.detail.date_on_leave_2">
          <td>Nghỉ không phép: <span>{{ ticketInfo.detail.date_on_leave_2 }}</span></td>
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
  name: 'UnauthorizedAbsenceTicket',
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
