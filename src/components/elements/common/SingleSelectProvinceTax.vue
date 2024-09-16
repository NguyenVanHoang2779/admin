<template>
  <div class="mb-4">
    <multiselect
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="option"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :options="options"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  name: 'single-select-province-tax',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      type: String,
      default: 'Chọn tỉnh'
    },
    isDisabled: {
      type: Boolean
    },
    provinceCode: {
      default: null
    },
    state: Boolean
  },

  data () {
    return {
      option: null,
      options: []
    }
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedProvince', newValue)
    },
    provinceCode: function () {
      if (this.provinceCode) {
        this.option = this.options.find((option) => {
          return parseInt(option.code) === parseInt(this.provinceCode)
        })
      }
    }
  },

  async created () {
    this.options = await this.$store.getters['location/getProvinces']
  },

  methods: {
  }
}
</script>

<style scoped>

</style>
