<template>
  <div class="mb-4">
    <multiselect
      v-model="dateOption"
      :options="dateOptions"
      placeholder="Chọn khoảng thời gian"
      label="name"
      track-by="value"
      selectedLabel="Đã chọn"
      deselectLabel="X"
      selectLabel=""
      :searchable="false"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn khoảng thời gian</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-date-range',

  components: {
    Multiselect
  },

  props: [
    'candidateDate'
  ],

  data: () => ({
    dateOption: null,
    dateOptions: [
      {
        id: 1,
        name: 'Hôm nay',
        value: 1
      },
      {
        id: 2,
        name: '3 ngày gần nhất',
        value: 3
      },
      {
        id: 3,
        name: '1 tuần gần nhất',
        value: 7
      },
      {
        id: 4,
        name: '1 tháng gần nhất',
        value: 30
      },
      {
        id: 5,
        name: '2 tháng gần nhất',
        value: 60
      },
      {
        id: 6,
        name: '3 tháng gần nhất',
        value: 90
      },
      {
        id: 7,
        name: '6 tháng gần nhất',
        value: 182
      },
      {
        id: 8,
        name: '1 năm gần nhất',
        value: 365
      }
    ]

  }),

  watch: {
    candidateDate: function (newValue, oldValue) {
      if (newValue == null) {
        this.dateOption = null
      }
    },

    dateOption: function (newValue, oldValue) {
      this.$emit('handleChooseDateRange', newValue)
    }
  }
}
</script>
