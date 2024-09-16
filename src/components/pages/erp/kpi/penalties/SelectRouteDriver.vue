<template>
  <div>
    <multiselect
      class="multiselect-info"
      placeholder=""
      v-model="multipleValue"
      :options="multipleOptions"
      :multiple="false" label="name"
      selectedLabel='x'
      selectLabel=''
      deselectLabel=''
      track-by="id"/>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
const optionSelect = [
  { id: 1, name: 'Nội miền' },
  { id: 2, name: 'Liên tỉnh' },
  { id: 3, name: 'Liên miền' }
]
export default {
  name: 'select-route-driver',

  components: {
    Multiselect
  },

  props: ['status'],
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue ? this.multipleValue.id : null)
    },
    status () {
      this.getCurrentStatus()
    }
  },
  data: () => ({
    multipleOptions: optionSelect,
    multipleValue: null
  }),
  methods: {
    getCurrentStatus () {
      this.multipleValue = this.multipleOptions.filter(option => this.status.includes(`${option.id}`))
    }
  },
  created () {
    this.multipleValue = { id: 3, name: 'Nội miền' }
    this.$emit('model', this.multipleValue.id)
  }
}
</script>
