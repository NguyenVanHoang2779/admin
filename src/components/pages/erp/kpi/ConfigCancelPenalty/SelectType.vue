<template>
  <div>
    <multiselect
      class="multiselect-dark"
      :placeholder="!holder ? '' : holder"
      v-model="multipleValue"
      :options="multipleOptions"
      :multiple="false"
      selectedLabel='x'
      selectLabel=''
      :loading='loading'
      deselectLabel=''
      :showPointer=true>
      <span slot="noResult">Không tìm thấy kết quả</span>
      <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách kho</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
export default {
  name: 'select-type',
  components: {
    Multiselect,
    sosService
  },
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue)
    }
  },
  props: ['holder', 'value'],
  data: () => ({
    multipleOptions: [
      'user',
      'region',
      'province',
      'station'
    ],
    multipleValue: '',
    loading: false
  }),
  computed: {
  },
  created () {
    this.multipleValue = this.value
    this.$emit('model', this.multipleValue)
  }
}
</script>
