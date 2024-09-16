<template>
  <div class="take-care-ticket low-income-ticket">
    <div class="content">
      <!-- Thu nhập thấp -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Thu nhập thấp</td>
        </tr>
        </thead>
        <!-- Kho có >= 2 COD trạng thái MP = active -->
        <tbody v-if="ticketInfo.detail.salary_user">
        <tr>
          <td>Lương (tạm tính): <span>{{ ticketInfo.detail.salary_user }}</span></td>
        </tr>
        <tr>
          <td>Trung bình lương của kho (tạm tính): <span>{{ ticketInfo.detail.salary_station }}</span></td>
        </tr>
        </tbody>
        <!-- Đối với kho có 1 COD trạng thái mp = active -->
        <tbody v-if="ticketInfo.detail.salary_month">
        <tr>
          <td>Lương kỳ hiện tại: <span>{{ ticketInfo.detail.salary_month }}</span></td>
        </tr>
        <tr>
          <td>Trung kỳ trước: <span>{{ ticketInfo.detail.salary_last_month }}</span></td>
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
// helper
import helpers from '../../../../../../infrastructures/helpers/common-helpers'

// components
import Action from '../Action.vue'

export default {
  name: 'LowIncomeTicket',
  components: {
    Action
  },
  props: {
    ticketInfo: {
      type: Object
    }
  },
  methods: {
    moneyFormat (value) {
      return helpers.moneyFormat(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../../assets/sass/components/take-care-ticket.scss';
</style>
