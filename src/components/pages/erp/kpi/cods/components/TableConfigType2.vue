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
        <th scope="row">Ngưỡng đơn/điểm</th>
        <td v-for="(cost, index) in objectDetail.data">
          <vue-numeric v-model="objectDetail.data[index]" class="input-money" currency="" v-bind:min="0" v-bind:max="200"
                       currency-symbol-position="suffix"></vue-numeric>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="title_object mb-4"><span class="font-weight-bold">Đơn giá: </span>
      <vue-numeric v-model="objectDetail.cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                   currency-symbol-position="suffix"></vue-numeric> trên 1 đơn/điểm
    </div>
    <div class="title_object mb-2"><span class="font-weight-bold">Thâm niên: </span>
      <vue-numeric v-model="objectDetail.seniority" class="input-money" currency="" v-bind:min="0" v-bind:max="1000"
                   currency-symbol-position="suffix"></vue-numeric> ngày
    </div>
  </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import vueNumeric from 'vue-numeric'
// const defaultValue = [0, 0, 0, 0, 0, 0, 13123, 0]
export default {
  name: 'table-config-type-2',
  props: {
    objectDetail: {
      type: Object,
      required: false,
      default: function () {
        return {
          data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
          cost: 0,
          seniority: 0
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
      // cost_values: defaultValue
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
