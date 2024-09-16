<template>
  <multiselect
    :class="customClass"
    v-model="option"
    :options="options"
    :multiple="true"
    :placeholder="placeholder"
    label="text"
    track-by="value"
    selected-label=""
    deselect-label="X"
    select-label="Chọn"
    :disabled="isDisabled"
    :limit="limitProp"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="val => { $emit('input', val) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<style scoped>
    .non-blur >>> .multiselect--disabled {
        opacity: 1!important;
    }
    .non-blur >>> .multiselect__tags {
        background: white;
    }
    .non-blur >>> .multiselect__tag-icon {
        display: none
    }
    .custom-multiselect {
        max-height: 200px;
        overflow: auto;
    }
</style>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-refusal-reason',

  components: {
    Multiselect
  },

  props: {
    resetRefuseGuardian: null,
    isSelectAll: {
      default: 1
    },
    autoClose: {
      default: false
    },
    hideSelected: {
      default: false
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    regions: {
      default: null
    },
    placeholder: {
      default: ''
    },
    customClass: {
      default: 'multiselect-primary'
    }
  },

  data: () => ({
    option: null,
    options: [
      { text: 'Không có mộc đỏ', value: 'miss_license' },
      { text: 'Không có ảnh NBL và CCCD', value: 'miss_image' },
      { text: 'Sai mẫu giấy BL/ Thiếu thông tin', value: 'wrong_license_miss_info' },
      { text: 'NBL không đồng ý bảo lãnh', value: 'rejected_guarant' },
      { text: 'NBL không đủ năng lực bảo lãnh', value: 'pending_suspect miss_capacity' },
      { text: 'Không liên hệ được NBL', value: 'miss_contact' },
      { text: 'Sai thông tin NBL', value: 'wrong_info_guardian' }
    ]
  }),

  created () {
    this.setSelectedOption()
  },

  watch: {
    resetRefuseGuardian (newValue, oldValue) {
      if (newValue) {
        this.option = []
      }
    },
    regions (newValue, oldValue) {
      this.setSelectedOption()
    },

    option (newValue, oldValue) {
      this.$emit('eventSelectRefusalReason', newValue)
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.regions) {
        this.option = []
        this.regions.split(',').forEach(re => {
          let op = this.options.find(o => ('' + o.id === '' + re))
          if (op) this.option.push(op)
        })
      } else this.option = null
    }
  }
}
</script>
