<template>
  <div class="take-care-ticket penalty-card-ticket">
    <div class="content">
      <!-- Tân binh -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Tân binh</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            Ngày cần liên hệ: <span>{{ ticketInfo.detail.date_contact }}</span>
          </td>
        </tr>
        <tr>
          <td>Danh sách hồ sơ còn thiếu: <span>{{ ticketInfo.detail.missing_document }}</span></td>
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
  name: 'RockieTicket',
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
@import 'src/assets/sass/components/take-care-ticket.scss';
</style>
