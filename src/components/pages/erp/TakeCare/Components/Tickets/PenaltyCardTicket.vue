<template>
  <div class="take-care-ticket penalty-card-ticket">
    <div class="content">
      <!-- Thẻ phạt -->
      <table>
        <thead>
        <tr>
          <td colspan="2">{{ ticketInfo.id }}/Thẻ phạt</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td v-if="ticketInfo.detail.penalty_type === 'red'">
            Loại hình: <span>Thẻ đỏ <img src="../../../../../../assets/images/cards/red_card.png" alt="red_card"></span>
          </td>
          <td v-else>
            Loại hình: <span>Thẻ vàng <img src="../../../../../../assets/images/cards/yellow_card.png" alt="yellow_card"></span>
          </td>
          <td>Mức phạt: <span>{{ ticketInfo.detail.penalty_level }}</span></td>
          <!-- Biên bản -->
          <td
            v-if="countDocument > 0"
            rowspan="4"
            class="image-report"
          >
            <template>
              <div v-viewer class="position-relative mr-1 d-inline-block">
                <div class="num-img-extend" :class="countDocument > 1 ? '' : 'd-none'">
                  +{{ countDocument - 1 }}
                </div>
                <template  v-for="(document, index) in ticketInfo.detail.penalty_document">
                  <img
                    :key="index"
                    :class="index < 1 ? 'd-inline-block' : 'd-none'"
                    class="image-document"
                    :src="document"
                    alt="Biên bản"
                  />
                </template>
                <div class="document-type-desc" >
                  Biên bản
                </div>
              </div>
            </template>
          </td>
        </tr>
        <tr>
          <td>Giá trị phạt: <span>{{ ticketInfo.detail.penalty_money }}</span></td>
          <td>Nội dung: <span>{{ ticketInfo.detail.penalty_content }}</span></td>
        </tr>
        <tr>
          <td>Ngày vi phạm: <span>{{ ticketInfo.detail.penalty_date }}</span></td>
          <td>Người gán thẻ: <span>{{ ticketInfo.detail.penalty_created_by }}</span></td>
        </tr>
        <tr>
          <td colspan="2">
            Lý do phạt: <span>{{ ticketInfo.detail.penalty_reason }}</span>
          </td>
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
  name: 'PenaltyCardTicket',
  components: {
    Action
  },
  props: {
    ticketInfo: {
      type: Object
    }
  },
  computed: {
    countDocument () {
      return Object.keys(this.ticketInfo.detail.penalty_document).length
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../../assets/sass/components/take-care-ticket.scss';
</style>
