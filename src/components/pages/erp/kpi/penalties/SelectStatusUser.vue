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
  { id: 3, name: 'Đang hoạt động' },
  { id: 2, name: 'Khóa tạm thời' },
  { id: 1, name: 'Khóa vĩnh viễn' }
]
export default {
  name: 'select-status-user',

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
  },
  created () {
    this.multipleValue = [{ id: 3, name: 'Đang hoạt động' }]
    this.$emit('model', this.multipleValue.map(a => a.id))
  }
}
</script>
