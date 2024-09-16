<template>
  <div>
      <multiselect class="multiselect-primary"
      v-model="provinceOption"
      :options="provinceOptions"
      :multiple="true"
      :limit="5"
      :max="5"
      placeholder="Chọn tỉnh"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Nhấn để bỏ chọn tỉnh"
      selectLabel="Nhấn enter để chọn"
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

  data: () => ({
    provinceOption: null,
    provinceOptions: []
  }),

  created () {
    this.getAllProvince()
  },

  watch: {
    provinceOption: function (newValue, oldValue) {
      this.$emit('handleProvinceSelected', newValue)
    }
  },

  methods: {
    getAllProvince: function () {
      dashboardV4.getAllProvince()
        .then((res) => {
          if (res.data.success) {
            this.provinceOptions = [{id: -1, name: 'Toàn quốc'}, ...res.data.data]
            this.provinceOption = this.provinceOptions.filter(x => x.id === 1 || x.id === 126)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
