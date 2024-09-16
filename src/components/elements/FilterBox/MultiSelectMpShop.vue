<template>
  <multiselect
    v-model="selected"
    label="name"
    track-by="mp_address_id"
    placeholder="Nhập tìm kiếm MP shop"
    select-label="✓"
    deselect-label="✗"
    selected-label="✓"
    :options="shops"
    :multiple="multiple"
    :loading="loading"
    :internal-search="false"
    :hide-selected="false"
    :show-labels="false"
    @search-change="asyncFind"
  >
    <span slot="noResult">Không tìm thấy kết quả</span>
    <span slot="noOptions">Nhập ít nhất 3 kí tự với mã shop</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'
import manageListCodService from '../../../domain/services/manage-list-cod-service'

export default {
  name: 'MultiSelectMpShop',
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
      default: () => {
        return {}
      }
    },
    ignoreList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      shops: [],
      loading: false,
      message: 'Nhập ít nhất 3 ký tự'
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
      this.shops = []
      if (query.length < 3) {
        this.message = 'Nhập ít nhất 3 ký tự'
        return
      }
      const params = {
        ...this.params,
        term: query
      }

      try {
        this.loading = true
        const shops = await manageListCodService.getMpShopAddress(params)
        this.shops = shops.filter(point => !this.ignoreList.includes(point.mp_address_id))
      } catch (reason) {
        console.error('Call api error:', reason)
        this.message = reason.message
      } finally {
        this.loading = false
      }

      if (!this.shops.length) {
        this.message = 'Không tìm thấy kết quả'
      }
    }, 500)
  }
}
</script>
