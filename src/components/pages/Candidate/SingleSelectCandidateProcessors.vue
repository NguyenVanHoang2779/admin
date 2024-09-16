<template>
  <div class="mb-4">
    <multiselect
      v-model="selectedProcessor"
      :options="processorIds"
      placeholder="Chọn người xử lí"
      :custom-label="customLabel"
      track-by="username"
      selectedLabel="Đã chọn"
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn người xử lí</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import candidateService from 'domain/services/candidate-service'
export default {
  name: 'single-select-candidate-processor',
  components: {
    Multiselect
  },

  props: [
    'processorId'
  ],

  data: () => ({
    selectedProcessor: null,
    processorIds: []
  }),

  created () {
    this.getRefferers()
  },

  watch: {
    processorId: function (newVal, oldVal) {
      if (newVal) {
        this.selectedProcessor = this.processorIds.find(item => item.id === newVal)
      } else {
        this.selectedProcessor = null
      }
    },

    selectedProcessor: function (newValue, oldValue) {
      this.$emit('handleChooseRefferer', newValue)
    }
  },

  methods: {
    customLabel ({fullname, username, stationName}) {
      return fullname + ' (' + stationName + '-' + username + ')'
    },

    getRefferers () {
      candidateService.getProcessorList()
        .then(res => {
          if (res.data.success) {
            this.processorIds = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
