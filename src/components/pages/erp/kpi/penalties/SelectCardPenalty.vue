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
  { id: 'red', name: 'Thẻ đỏ' },
  { id: 'yellow', name: 'Thẻ vàng' },
  { id: 'white', name: 'Thẻ trắng' },
  { id: 'purple', name: 'Thẻ tím' },
  { id: 'grey', name: 'Thẻ xám' }
]
export default {
  name: 'select-status-penalty',

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
