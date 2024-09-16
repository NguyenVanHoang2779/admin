<template>
  <b-form-select v-model="status"
    :options="vote.type == 'awol' ? statusAWOLOption :statusReportOption"
    :disabled="isDisable"
    @change="onChange"
  >
  </b-form-select>
</template>
<script>

export default {
  props: ['index', 'vote', 'isDisable', 'isCs'],
  data: () => ({
    status: null,
    voteTmp: this.vote,
    statusReportOption: [
      { value: null, text: 'Xác nhận đánh giá' },
      { value: 0, text: 'Shop report đúng' },
      { value: 1, text: 'Shop report sai' }
    ],
    statusAWOLOption: [
      { value: null, text: 'Xác nhận COD nghỉ' },
      { value: 1, text: 'Nghỉ hợp lệ' },
      { value: 0, text: 'Nghỉ không hợp lệ' }
    ]
  }),

  watch: {
    'vote.status': function (newVal, oldVal) {
      this.status = this.vote.status
    }
  },
  methods: {
    onChange ($event, index) {
      // if (!confirm(`Bạn có chắc chắn với lựa chọn này? Lưu ý: Không thể thay đổi kết quả khi đã xác nhận!`)) {
      //   this.status = null
      //   return
      // }
      this.$emit('change', {option: $event, codPenaltyId: this.vote.cod_penalty_id, index: this.index})
    }
  }
}
</script>
