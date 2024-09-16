<template>
  <div>
      <multiselect
          :class="customClass"
          v-model="provinceOption"
          :options="provinceOptions"
          :multiple="true"
          :limit="5"
          deselect-label="X"
          placeholder="Chọn tỉnh"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="Nhấn để bỏ chọn tỉnh"
          selectLabel="Nhấn enter để chọn"
          @input="handleInput(provinceOption)"
          @remove="remove"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import dashboardV4 from 'domain/admin/dashboardV4'

export default {
  name: 'multi-select-province',

  components: {
    Multiselect
  },

  props: {
    customClass: {
      default: 'multiselect-primary'
    }
  },

  data: () => ({
    provinceOption: null,
    provinceOptions: []
  }),

  created () {
    this.getAllProvince()
  },

  watch: {
    provinceOption: function (newValue, oldValue) {
      let hasAll = (newValue && newValue.id === -1) || (newValue && newValue.length > 1 && newValue.findIndex((x) => x.id === -1) !== -1)
      if (hasAll === true) {
        this.$emit('handleProvinceSelected', this.provinceOptions)
      } else {
        this.$emit('handleProvinceSelected', newValue)
      }
    }
  },

  methods: {
    getAllProvince: function () {
      dashboardV4.getAllProvince()
        .then((res) => {
          if (res.data.success) {
            this.provinceOptions = [{id: -1, name: 'Toàn quốc'}, ...res.data.data]
            this.provinceOption = this.provinceOptions[0]
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    handleInput: function (provinceOption) {
      let all = provinceOption.findIndex((x) => x.id === -1) === provinceOption.length - 1

      if (all) {
        this.provinceOption = {id: -1, name: 'Toàn quốc'}
      } else {
        let allProvince = provinceOption.filter((x) => x.id !== -1)
        this.provinceOption = allProvince
      }
    }
  }
}
</script>
