<template>
  <multiselect
    v-model="selected"
    label="name"
    track-by="id"
    :placeholder="placeholder"
    :options="carts"
    :multiple="multiple"
    :searchable="true"
    :loading="loading"
    :internal-search="false"
    :clear-on-select="true"
    :close-on-select="true"
    :hide-selected="true"
    :disabled="disabled"
    selectLabel=""
    selectedLabel=""
    @search-change="doSearch"
  >
    <span slot="noResult">{{ message }}</span>
    <span slot="noOptions">{{ message }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'
import {handleResponse} from '../../../infrastructures/api-http'
import ManageLineService from '../../../domain/services/manage-line-service'

export default {
  name: 'SelectCartsV2',
  components: {
    Multiselect,
    debounce
  },
  props: {
    value: {
      type: [Object, Array, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: 'Nhập tuyến'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      carts: [],
      loading: false,
      message: 'Nhập ít nhất 2 ký tự.'
    }
  },
  computed: {
    selected: {
      get () {
        if (this.multiple) {
          return Array.isArray(this.value) ? this.value : []
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    doSearch: debounce(async function (query) {
      this.carts = []
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự.'
        return
      }

      try {
        this.loading = true
        const params = {
          ...this.params,
          term: query
        }
        this.carts = await handleResponse(ManageLineService.getLine(params), 'data')
        if (!this.carts.length) {
          this.message = 'Không tìm thấy kết quả.'
        }
      } catch (reason) {
        this.message = 'Không tìm thấy kết quả.'
      } finally {
        this.loading = false
      }
    }, 500)
  }
}
</script>
