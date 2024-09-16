<template>
  <multiselect
    :disabled="disabled"
    v-model="option"
    :options="options"
    label="name"
    track-by="id"
    :placeholder="placeholder"
    :multiple="multiple"
    :searchable="true"
    :loading="asyncLoading"
    :internal-search="false"
    :clear-on-select="clearOnSelect"
    :close-on-select="autoClose"
    :hide-selected="hideSelected"
    :show-labels="false"
    @search-change="find"
    @select="op => { $emit('select', op) }"
    @remove="op => { $emit('remove', op) }"
    @input="ops => { $emit('input', ops) }"
  >
    <span slot="noResult">Không có kết quả phù hợp !</span>
    <span slot="noOptions">{{ message }}</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>
<script>
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'

export default {
  name: 'SelectSuggest',

  props: {
    value: {
      default: null
    },
    placeholder: {
      default: null
    },
    hideSelected: {
      default: true
    },
    autoClose: {
      default: true
    },
    options: {
      type: Array,
      default: () => []
    },
    asyncLoading: {
      default: false
    },
    message: {
      default: 'Nhập ít nhất 2 ký tự'
    },
    clearOnSelect: {
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    option: null
  }),

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (newVal) { this.option = newVal }
    }
  },

  methods: {
    find: debounce(function (query) {
      this.$emit('find', query)
    })
  }
}

</script>
