<template>
  <div>
    <b-modal
      v-model="showModal"
      title="Cập nhật gói chiết khấu"
      @hidden="hideModal"
    >
      <div  class="no-data">
        <b-alert :show="alert.show" dismissible :variant="alert.type" @dismissed="alert.show = false">
          {{ alert.message }}
        </b-alert>
      </div>
      <form>
        <b-form-group>
          <label class="font-weight-bold">Gói chiết khấu: </label>
          <span class="font-weight-bold text-danger">{{deductionInfo.parent_name}}</span>
        </b-form-group>
        <b-form-group>
          <label class="font-weight-bold">Tên hiển thị:</label>
          <b-input type="text" v-model="deductionInfo.name"/>
        </b-form-group>
        <b-form-group>
          <label class="font-weight-bold">Số lượng đơn hàng yêu cầu:</label>
          <b-input type="number" v-model="deductionInfo.number_pkg"/>
        </b-form-group>
        <b-form-group>
          <label class="font-weight-bold">Ngưỡng cân và số tiền giảm:</label>
          <table role="table" aria-busy="false" aria-colcount="3" class="table b-table table-striped table-hover">
            <thead class="font-weight-bold">
            <tr>
              <th>Từ (kg)</th>
              <th>Đến (kg)</th>
              <th>Số tiền giảm (đ)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(detail,key) in deductionInfo.detail">
              <td>
                <b-input type="number" v-model="deductionInfo.detail[key].weight_pkg_from"/>
              </td>
              <td>
                <b-input type="number" v-model="deductionInfo.detail[key].weight_pkg_to"/>
              </td>
              <td>
                <b-input type="number" v-model="deductionInfo.detail[key].reduce_value"/>
              </td>
            </tr>
            </tbody>
          </table>
        </b-form-group>
      </form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="danger" @click="hideModal">
          Hủy
        </b-button>
        <ladda-btn
          :loading="loading[5]"
          @click.native="updateDeduction(5)"
          data-style="zoom-out"
          class="btn btn-primary"
        >
          Lưu
        </ladda-btn>
      </template>
    </b-modal>
  </div>
</template>
<script>
import shopService from 'domain/services/shop-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
export default {
  components: {
    LaddaBtn
  },
  name: 'update-deduction-config',
  props: [
    'activeModal',
    'editDeduction'
  ],
  data: function () {
    return {
      showModal: false,
      alert: {
        show: false,
        type: 'danger',
        message: 'hello 111'
      },
      deductionInfo: [],
      loading: [false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  watch: {
    activeModal: function (val) {
      this.showModal = val
    },
    editDeduction: function (val) {
      this.deductionInfo = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    startLoading (i) {
      if (this.loading[i]) {
        return
      }
      this.updateLoadingValue(i, true)
    },
    updateLoadingValue (index, value) {
      this.loading[index] = value
      this.loading = this.loading.slice(0)
    },
    hideModal () {
      this.$emit('modal-show', false)
      this.alert.show = false
      this.deductionInfo = JSON.parse(JSON.stringify(this.editDeduction))
    },
    updateDeduction: function (i) {
      let dataSend = this.deductionInfo
      this.startLoading(i)
      shopService.updateDeductionConfig(dataSend).then(response => {
        this.alert.show = true
        this.alert.message = response.data.message
        if (response.data.success) {
          this.alert.type = 'success'
          this.$emit('update-success', true)
        } else {
          this.alert.type = 'danger'
        }
      }).catch((error) => {
        if (error) {
        }
      }).then(() => {
        this.updateLoadingValue(i, false)
      })
    }
  }
}
</script>
