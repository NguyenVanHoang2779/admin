<template>
  <div class="take-care-ticket routine-care-ticket">
    <div class="content">
      <!-- Chăm sóc định kỳ -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Chăm sóc định kỳ</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Lương tháng trung bình: <span>{{ ticketInfo.detail.salary }}</span></td>
        </tr>
        <tr>
          <td>Đề xuất chờ duyệt: <span>{{ ticketInfo.detail.asset_order_pending }}</span></td>
        </tr>
        <tr>
          <td>Hồ sơ: <span>{{ ticketInfo.detail.document }}</span></td>
        </tr>
        <tr>
          <td>Tag xấu: <span>{{ ticketInfo.detail.tag_bad }}</span></td>
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
  name: 'RoutineCareTicket',
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
