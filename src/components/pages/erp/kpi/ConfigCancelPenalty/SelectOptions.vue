<template>
  <div>
    <multiselect
      class="custom-multiselect"
      :class="className"
      :placeholder="!holder ? '' : holder"
      v-model="multipleValue"
      :options="multipleOptions"
      :multiple="true"
      selectedLabel='x'
      selectLabel=''
      :loading='loading'
      deselectLabel=''
      label="name"
      :showPointer=true
      track-by="id"
    >
      <span slot="noResult">Không tìm thấy kết quả</span>
      <span slot="noOptions">Có lỗi xảy ra khi lấy dữ liệu</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-options',
  components: {
    Multiselect
  },
  watch: {
    multipleValue: function (newVal, oldVal) {
      if (this.triggerSingle && newVal.length > 1) {
        this.multipleValue[0] = this.multipleValue[1]
        this.multipleValue.pop()
      }
      this.$emit('model', this.multipleValue.map(a => a.id))
    }
  },
  props: {
    holder: {
      type: String,
      default: ''
    },
    multipleOptions: Array,
    value: Array,
    className: String,
    triggerSingle: false
  },
  data: () => ({
    multipleValue: [],
    loading: false
  }),
  methods: {
  },
  computed: {
  },
  created () {
    this.multipleValue = this.value
    this.$emit('model', this.multipleValue.map(a => a.id))
  }
}
</script>
