<template>
  <multiselect
    v-model="quantities"
    :options="types"
    :multiple="true"
    :placeholder="placeholder"
    track-by="name"
    label="name"
    @input="updateValueAction"
  />
</template>

<script>
import Multiselect from 'vue-multiselect'
import * as _ from 'lodash'

export default {
  name: 'MultiSelectQuantity',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn sản lượng'
    },
    value: {
      type: Array
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {code: 'lt30', name: '< 30 ĐH/Tháng'},
      {code: 'lt50', name: '30 - 50 ĐH/Tháng'},
      {code: 'lt100', name: '50 - 100 ĐH/Tháng'},
      {code: 'lt200', name: '100 - 200 ĐH/Tháng'},
      {code: 'gte200', name: '> 200 ĐH/Tháng'}
    ],
    quantities: []
  }),
  mounted () {
    this.quantities = this.types.filter((item) => this.value.includes(item.code))
  },
  methods: {
    updateValueAction: function () {
      this.$emit('input', _.map(this.quantities, 'code'))
    }
  }
}
</script>
