<template>
    <b-container fluid>
        <b-row class="my-1">
            <b-col style="transform: translateY(25%)" sm="3">
                <label class="font-italic">Trạng thái:</label>
            </b-col>
            <b-col sm="9">
                <multiselect
                        class="multiselect-info"
                        placeholder=""
                        v-model="multipleValue"
                        :options="multipleOptions"
                        :multiple="true" label="name"
                        selectedLabel = 'x'
                        selectLabel = ''
                        deselectLabel = ''
                        track-by="id" />
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import Multiselect from 'vue-multiselect'
const optionSelect = [
  { id: 1, name: 'Chưa tiếp nhận' },
  { id: 2, name: 'Đang xử lý' },
  { id: 3, name: 'Đã xử lý' }
]
export default {
  name: 'select-status-sos-ticket',

  components: {
    Multiselect
  },

  props: ['status'],
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue)
    },
    status () {
      this.getCurrentStatus()
    }
  },
  data: () => ({
    multipleOptions: optionSelect,
    multipleValue: optionSelect
  }),
  methods: {
    getCurrentStatus () {
      this.multipleValue = this.multipleOptions.filter(option => this.status.includes(`${option.id}`))
    }
  }
}
</script>
