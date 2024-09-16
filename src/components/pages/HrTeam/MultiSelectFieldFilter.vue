<template>
    <multiselect
            v-model="asyncSelected"
            label="name"
            track-by="name"
            placeholder=""
            :options="fieldFilters"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="true"
            :hide-selected="true"
    >
        <span slot="noResult">{{message}}</span>
        <span slot="noOptions">{{message}}</span>
    </multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'

export default {
  props: [
    'fieldFilters'
  ],
  name: 'multi-select-field-filter',

  components: {
    Multiselect,
    sosService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    fieldFilters () {
      this.$set(this, 'asyncFound', this.fieldFilters)
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    message: 'Nhập tên field muốn lọc'
  }),

  computed: {},

  created () {
  },

  methods: {
  }
}
</script>
