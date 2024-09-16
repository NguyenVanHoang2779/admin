<template>
  <multiselect
    :multiple="true"
    :options="palletOptions"
    placeholder="Chọn pallet"
    :searchable="true"
    deselectLabel="Bỏ chọn"
    selectLabel="Chọn"
    selectedLabel="Đã chọn"
    track-by="name"
    label="name"
    v-model="palletOption"
    :disabled="isDisabled"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="val => { $emit('input', val) }"
    :clearOnSelect="clearSearch"
  >
    <span slot="noResult">Không tìm thấy</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-pallet-code',
  components: {
    Multiselect
  },

  props: {
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Chọn pallet'
    },
    palletCodes: {},
    palletOptions: {},
    hideSelected: {
      dafault: false
    },
    autoClose: {
      default: false
    },
    clearSearch: {
      default: true
    }
  },

  data: () => ({
    palletOption: []
  }),

  mounted () {
    if (!this.palletCodes || this.palletCodes.length < 1) this.palletOption = []
    else this.setList()
  },

  watch: {
    palletCodes (newVal, oldVal) {
      if (!newVal || newVal.length < 1) this.palletOption = []
      else this.setList()
    },

    palletOption (newValue, oldValue) {
      if (newValue.length !== oldValue.length) this.$emit('update:palletCodes', (newValue || []).map(pallet => pallet.name))
    }
  },

  created () {

  },

  methods: {
    setList () {
      if (!this.palletCodes || !this.palletCodes.length) {
        this.palletOption = []
        return
      }
      let ops = this.palletOptions.filter(o => {
        return this.palletCodes.includes(+o.name) || this.palletCodes.includes(o.name + '')
      })
      this.palletOption = ops
    }

  }
}
</script>

<style scoped>

</style>
