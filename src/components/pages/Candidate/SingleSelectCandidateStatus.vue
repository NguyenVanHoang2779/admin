<template>
  <div class="mb-4">
    <multiselect
      v-model="statusOption"
      :options="statusOptions"
      placeholder="Chọn trạng thái"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn trạng thái</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Candidate from 'domain/entities/Candidate'

export default {
  name: 'single-select-candidate-status',

  components: {
    Multiselect
  },

  props: [
    'status'
  ],

  data: () => ({
    statusOption: null,
    statusOptions: []
  }),

  created () {
    let candidateObject = new Candidate()
    this.statusOptions = candidateObject.getStatusOptions()
  },

  watch: {
    status: function (newVal, oldVal) {
      if (newVal == null) {
        this.statusOption = null
      }
    },

    statusOption: function (newValue, oldValue) {
      this.$emit('handleChooseStatus', newValue)
    }
  }
}
</script>
