<template>
  <multiselect
    v-model="selected"
    label="name"
    track-by="gmap_id"
    placeholder="Nhập tìm kiếm địa chỉ"
    select-label="✓"
    deselect-label="✗"
    selected-label="✓"
    :options="addresses"
    :multiple="multiple"
    :loading="loading"
    :internal-search="false"
    :hide-selected="false"
    :show-labels="false"
    @search-change="asyncFind"
  >
    <span slot="noResult">Không tìm thấy kết quả</span>
    <span slot="noOptions">Nhập ít nhất 2 kí tự</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import manageListCodService from 'domain/services/manage-list-cod-service'
import debounce from 'debounce'

export default {
  name: 'MultiSelectAddressLv5',
  components: {
    Multiselect,
    debounce
  },
  props: {
    value: {
      type: [Object, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: () => { return {} }
    },
    lv4Ids: {
      type: Array,
      default: () => []
    },
    ignoreList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    addresses: [],
    loading: false,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
    selected: {
      get () {
        if (this.multiple) {
          return Array.isArray(this.value) ? this.value : []
        }
        return this.value
      },
      set (value) {
        if (this.multiple) {
          this.$emit('input', Array.isArray(value) ? value : [])
        } else {
          this.$emit('input', value || null)
        }
        this.$nextTick(() => this.$emit('change'))
      }
    }
  },
  methods: {
    asyncFind: debounce(async function (query) {
      this.addresses = []
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }

      const params = {
        ...this.params,
        lv4_ids: this.lv4Ids,
        term: query
      }

      try {
        this.loading = true
        const addresses = await manageListCodService.getAddress5(params)
        this.addresses = addresses.filter(point => !this.ignoreList.includes(point.gmap_id))
      } catch (reason) {
        console.error('Call api error:', reason)
      } finally {
        this.loading = false
      }

      if (!this.addresses.length) {
        this.message = 'Không tìm thấy kết quả'
      }
    }, 500)
  }
}
</script>
