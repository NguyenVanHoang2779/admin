<template>
  <div>
    <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
    <table class="table mb-2" style="min-width: 40%">
      <thead>
      <tr>
        <th>Đơn/điểm</th>
        <th>Phụ cấp</th>
        <th>&nbsp;</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(value, index) in objectDetail.data">
        <td>
          <vue-numeric v-model="objectDetail.data[index].point" class="input-money" currency="" v-bind:min="0" v-bind:max="1000"
                       currency-symbol-position="suffix"></vue-numeric>
        </td>
        <td>
          <vue-numeric v-model="objectDetail.data[index].cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="1000000"
                       currency-symbol-position="suffix"></vue-numeric>
        </td>
        <td>
          <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                 @click="removeRow(index)"><i class="ion ion-md-close"></i></b-btn>
        </td>
      </tr>
      </tbody>
    </table>
    <div>
      <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
             @click="addRow"><i class="ion ion-md-add"></i></b-btn>
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
import commonHelper from 'infrastructures/helpers/common-helpers'

// const defaultValue = [0, 0, 0, 0, 0, 0, 13123, 0]
export default {
  name: 'table-config-type-1',
  props: {
    objectDetail: {
      type: Object,
      required: false,
      default: function () {
        return {
          data: [{point: 0, cost: 0}],
          seniority: 0
        }
      }
    }
  },

  components: {
    vueNumeric,
    commonHelper
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
  computed: {},
  methods: {
    removeRow (index) {
      this.objectDetail.data.splice(index, 1)
    },
    addRow () {
      if (this.objectDetail.data.map(a => a.point).includes(0)) {
        commonHelper.showMessage('Không được bỏ trống dữ liệu bảng', 'error')
      } else {
        this.objectDetail.data.push({point: 0, cost: 0})
      }
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
</style>
