<!--Bảng hiện thị config các object-->
<template>
  <div>
    <!--    #1 Phụ cấp đơn điểm theo vùng-->
    <div v-if="typeId === 1">
      <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
      <table class="table">
        <thead>
        <tr>
          <th>Vùng</th>
          <th v-for="(cost, index) in objectDetail[1].data">Vùng {{ index }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Đơn giao</th>
          <td v-for="(cost, index) in objectDetail[1].data">
            <vue-numeric v-model="objectDetail[1].data[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>

        <tr>
          <th scope="row">Điểm lấy/trả</th>
          <td v-for="(cost, index) in objectDetail[1].point_p_r">
            <vue-numeric v-model="objectDetail[1].point_p_r[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>
        <tr>
          <th scope="row">Đơn lấy</th>
          <td v-for="(cost, index) in objectDetail[1].package_p">
            <vue-numeric v-model="objectDetail[1].package_p[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>
        <tr>
          <th scope="row">Đơn trả</th>
          <td v-for="(cost, index) in objectDetail[1].package_r">
            <vue-numeric v-model="objectDetail[1].package_r[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="title_object mb-4"><span class="font-weight-bold">Bonus tuyến khó: </span>
        <vue-numeric v-model="objectDetail[1].route_bonus" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                     currency-symbol-position="suffix"></vue-numeric> trên 1 đơn giao - điểm lấy/trả
      </div>
    </div>

    <!--    #2 Phụ cấp vượt ngưỡng theo vùng-->
    <div v-if="typeId === 2">
      <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
      <table class="table">
        <thead>
        <tr>
          <th>Vùng</th>
          <th v-for="(cost, index) in objectDetail[2].data">Vùng {{ index }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Ngưỡng đơn/điểm</th>
          <td v-for="(cost, index) in objectDetail[2].data">
            <vue-numeric v-model="objectDetail[2].data[index]" class="input-money" currency="" v-bind:min="0" v-bind:max="200"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="title_object mb-4"><span class="font-weight-bold">Đơn giá: </span>
        <vue-numeric v-model="objectDetail[2].cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                     currency-symbol-position="suffix"></vue-numeric> trên 1 đơn/điểm
      </div>
      <div class="title_object mb-2"><span class="font-weight-bold">Thâm niên: </span>
        <vue-numeric v-model="objectDetail[2].seniority" class="input-money" currency="" v-bind:min="0" v-bind:max="1000"
                     currency-symbol-position="suffix"></vue-numeric> ngày
      </div>
    </div>

    <!--    #3 Phụ cấp vượt ngưỡng trên tổng đơn/điểm trên ngày-->
    <div v-if="typeId === 3">
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
        <tr v-for="(value, index) in objectDetail[3].data">
          <td>
            <vue-numeric v-model="objectDetail[3].data[index].point" class="input-money" currency="" v-bind:min="0" v-bind:max="1000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
          <td>
            <vue-numeric v-model="objectDetail[3].data[index].cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="1000000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
          <td>
            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                   @click="removeRow(3, index)"><i class="ion ion-md-close"></i></b-btn>
          </td>
        </tr>
        </tbody>
      </table>
      <div>
        <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
               @click="addRow(3)"><i class="ion ion-md-add"></i></b-btn>
      </div>
      <div class="title_object mb-2"><span class="font-weight-bold">Thâm niên: </span>
        <vue-numeric v-model="objectDetail[3].seniority" class="input-money" currency="" v-bind:min="0" v-bind:max="1000"
                     currency-symbol-position="suffix"></vue-numeric> ngày
      </div>
    </div>

    <!--    #4 Phụ cấp đi làm theo ngày công-->
    <div v-if="typeId === 4">
      <div class="title_object mb-4"><span class="font-weight-bold">Phụ cấp: </span>
        <vue-numeric v-model="objectDetail[4].cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="1000000"
                     currency-symbol-position="suffix"></vue-numeric> trên 1 ngày
      </div>
      <div class="title_object mb-2"><span class="font-weight-bold">Thâm niên: </span>
        <vue-numeric v-model="objectDetail[4].seniority" class="inputThêm config cho-money" currency="" v-bind:min="0" v-bind:max="1000"
                     currency-symbol-position="suffix"></vue-numeric> ngày
      </div>
    </div>

    <!--    #5 Phụ cấp đơn giao theo cân nặng-->
    <div v-if="typeId === 5">
      <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
      <table class="table mb-2" style="min-width: 40%">
        <thead>
        <tr>
          <th>Từ</th>
          <th>Phụ cấp</th>
          <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(value, index) in objectDetail[5].data">
          <td>
            <vue-numeric v-model="objectDetail[5].data[index].from_weight" class="input-money" currency="gam" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
          <td>
            + <vue-numeric v-model="objectDetail[5].data[index].cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="1000000"
                         currency-symbol-position="suffix"></vue-numeric> /
             <vue-numeric v-model="objectDetail[5].data[index].per_weight" class="input-money" currency="gam" v-bind:min="0" v-bind:max="100000"
                                                                                         currency-symbol-position="suffix"></vue-numeric>
          </td>
          <td>
            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                   @click="removeRow(5, index)"><i class="ion ion-md-close"></i></b-btn>
          </td>
        </tr>
        </tbody>
      </table>
      <div>
        <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
               @click="addRow(5)"><i class="ion ion-md-add"></i></b-btn>
      </div>
    </div>

    <!--    #6 Phụ cấp riêng theo đơn điểm-->
    <div v-if="typeId === 6">
      <div class="title_object mb-2"><span class="font-weight-bold">Bảng config</span></div>
      <table class="table">
        <thead>
        <tr>
          <th>Vùng</th>
          <th v-for="(cost, index) in objectDetail[1].data">Vùng {{ index }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Đơn giao hoặc điểm lấy/trả</th>
          <td v-for="(cost, index) in objectDetail[1].data">
            <vue-numeric v-model="objectDetail[1].data[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>
        <tr>
          <th scope="row">Đơn lấy/trả</th>
          <td v-for="(cost, index) in objectDetail[1].data">
            <vue-numeric v-model="objectDetail[1].data[index]" class="input-money" currency="đ" v-bind:min="0" v-bind:max="100000"
                         currency-symbol-position="suffix"></vue-numeric>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import vueNumeric from 'vue-numeric'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'table-config-type',
  props: {
    typeId: {
      type: Number,
      required: false
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
        this.$emit('model', newValue[this.typeId])
      }
    }
  },
  data: () => (
    {
      objectDetail: {
        1: {
          data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
          point_p_r: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
          package_p: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
          package_r: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
          route_bonus: 0},
        2: {data: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0}, cost: 0, seniority: 0},
        3: {data: [{point: 0, cost: 0}], seniority: 0},
        4: {cost: 0, seniority: 0},
        5: {data: [{from_weight: 0, cost: 0, per_weight: 0}]}
      }
    }
  ),
  computed: {
  },
  methods: {
    removeRow (typeId, index) {
      this.objectDetail[typeId].data.splice(index, 1)
    },
    addRow (typeId) {
      let check = this.objectDetail[typeId].data.map(a => a.cost).includes(0)
      if (check) {
        commonHelper.showMessage('Không được bỏ trống dữ liệu bảng', 'error')
      } else {
        this.objectDetail[typeId].data.push({point: 0, cost: 0})
      }
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
</style>
