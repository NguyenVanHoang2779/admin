<template>
  <div>
    <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
    <table class="table">
      <thead>
      <tr>
        <th>Vùng</th>
        <th v-for="(cost, index) in objectDetail.data">Vùng {{ index }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Đơn giá 1 đơn/điểm</th>
        <td v-for="(cost, index) in objectDetail.data">
          <vue-numeric v-model="objectDetail.data[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                       currency-symbol-position="suffix"></vue-numeric>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import vueNumeric from 'vue-numeric'
export default {
  name: 'table-config-type-1',
  props: {
    objectDetail: {
      type: Object,
      required: false,
      default: function () {
        return {
          data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0}
        }
      }
    }
  },

  components: {
    vueNumeric
  },
  watch: {
    objectDetail: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        this.$emit('model', newValue)
      }
    }
  },
  data: () => (
    {
    }
  ),
  computed: {
  },
  methods: {
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
</style>
