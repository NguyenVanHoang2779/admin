<template>
  <div>
    <multiselect
      class="multiselect-info"
      placeholder=""
      v-model="multipleValue"
      :options="multipleOptions"
      :multiple="true" label="name"
      selectedLabel='x'
      selectLabel=''
      deselectLabel=''
      track-by="id"/>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
const optionSelect = [
  { id: 'bank', name: 'Giao dịch qua ngân hàng' },
  { id: 'ekyc', name: 'Giao dịch qua ví' }
]
export default {
  name: 'select-type-payment',

  components: {
    Multiselect
  },

  props: ['status'],
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue.map(a => a.id))
    },
    status () {
      this.getCurrentStatus()
    }
  },
  data: () => ({
    multipleOptions: optionSelect,
    multipleValue: []
  }),
  methods: {
    getCurrentStatus () {
      this.multipleValue = this.multipleOptions.filter(option => this.status.includes(`${option.id}`))
    }
  }
}
</script>
