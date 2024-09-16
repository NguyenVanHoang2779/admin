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
  { id: 0, name: 'Chờ giao dịch' },
  { id: 1, name: 'Đang giao dịch' },
  { id: 2, name: 'Thành công' },
  { id: 3, name: 'Thất bại' },
  { id: 4, name: 'Cần đối soát' }
]
export default {
  name: 'select-status-payment',

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
