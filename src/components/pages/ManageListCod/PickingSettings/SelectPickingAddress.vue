<template>
  <multiselect
    class="multiselect-success stop-point-tag"
    v-model="selected"
    placeholder="Chọn shop"
    track-by="pick_address_id"
    label="address_name"
    :options="options"
    :multiple="multiple"
    select-label="✓"
    deselect-label="✗"
    selected-label="✓"
    :internal-search="false"
    @search-change="onInputKeyword"
  />
</template>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'SelectPickingAddress',
  components: {
    Multiselect
  },
  props: {
    pickAddresses: {
      type: Array,
      required: true
    },
    ignoreList: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, Object],
      default: null
    }
  },
  data () {
    return {
      keyword: '',
      pickAddressList: commonHelper.arrayWrap(this.pickAddresses)
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
    },
    options () {
      let selected = this.selected || []
      selected = Array.isArray(selected) ? selected : [selected]
      const idsSelected = selected.map(item => item.pick_address_id)

      return this.pickAddressList.filter((pickingAddress) => {
        if (this.keyword && pickingAddress.searchString.indexOf(this.keyword) === -1) {
          return false
        }

        const id = pickingAddress.pick_address_id
        if (this.ignoreList.length && this.ignoreList.includes(id) && !idsSelected.includes(id)) {
          return false
        }

        return true
      })
    }
  },
  methods: {
    onInputKeyword: function (keyword) {
      this.keyword = commonHelper.removeVietnameseTone((keyword || '').trim())
    }
  }
}
</script>
