<template>
  <div>
    <multiselect class="multiselect-primary"
     v-model="option"
     :options="options"
     :multiple="false"
     placeholder="Chọn Miền"
     label="name"
     track-by="name"
     selectedLabel="Đã chọn"
     deselectLabel="Bỏ chọn"
     selectLabel="Chọn"
     :disabled="isDisabled"
     :limit="limitProp"
     :hide-selected="false"
     :close-on-select="autoClosed"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
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
import SalaryService from 'domain/services/salary-service'

export default {
  name: 'multi-select-region',

  components: {
    Multiselect,
    SalaryService
  },

  props: {
    isSelectAll: {
      default: 1
    },
    autoClose: {},
    hideSelected: {},
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    }
  },

  data: () => ({
    autoClosed: true,
    hideSelect: false,
    provinceIds: null,
    regionIds: null,
    option: null,
    options: [
      {'id': 'HN', 'name': 'Hà Nội'},
      {'id': 'HCM', 'name': 'Thành Phố HCM'},
      {'id': 'MB', 'name': 'Miền Bắc'},
      {'id': 'MT', 'name': 'Miền Trung'},
      {'id': 'MN', 'name': 'Miền Nam'}
    ]
  }),

  created () {
    if (this.autoClose !== undefined && this.autoClose !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
  },

  watch: {
    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    option: function (newValue, oldValue) {
      this.$emit('handleRegionSelected', newValue)
    }
  },

  methods: {
  }
}
</script>
