<template>
  <b-modal
    v-model="show"
    :class="{loading: loading | saving}"
    class="SmartLocker-ModalConfigCart"
    hide-footer
    static
  >
    <template #modal-title>
      <div>Ngăn tủ {{ cell.cell_name }}</div>
    </template>

    <b-form>
      <b-form-group label="Ngăn tủ" label-cols-sm="2" label-align="left">
        <div class="form-control disable">{{ cell.cell_name }}</div>
      </b-form-group>

      <b-form-group label="Tủ" label-cols-sm="2" label-align="left">
        <div class="form-control disable">{{ cell.cabinet_name }}</div>
      </b-form-group>

      <b-form-group label="Kho" label-cols-sm="2" label-align="left">
        <div class="form-control disable">{{ cell.station_name }}</div>
      </b-form-group>

      <b-form-group label="Tuyến" label-cols-sm="2" label-align="left">
        <select-carts-v2 class="width-200 mr-1" v-model="carts" :params="params" :disabled="loading"/>
      </b-form-group>

      <div slot="modal-footer" class="w-100 text-center">
        <b-button variant="success" :disabled="loading || saving" @click.prevent="doSave">
          <i class="fa fa-spinner fa-spin" v-if="saving"/>
          <i class="fa fa-check" v-else/>
          Cập nhật
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import SelectCartsV2 from '../../elements/FilterBox/SelectCartsV2'
import SmartLockerService from '../../../domain/services/smart-locker-service'
import commonHelpers from '../../../infrastructures/helpers/common-helpers'

export default {
  name: 'ModalConfigCart',
  components: {
    SelectCartsV2
  },
  props: {
    cell: {
      type: Object,
      required: true
    },
    params: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      show: false,
      loading: true,
      saving: false,
      carts: []
    }
  },
  created () {
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
    this.show = true
    this.getCartsOfCell()
  },
  methods: {
    /**
     * Lấy danh sách các carts được gán vào ngăn tủ
     */
    async getCartsOfCell () {
      try {
        this.loading = true
        this.carts = (await SmartLockerService.getCartsOfCell(this.cell.cell_id)).map(cart => {
          return {
            id: cart.id,
            name: cart.alias
          }
        })
      } catch (reason) {
        commonHelpers.showMessage(reason.toString())
      } finally {
        this.loading = false
      }
    },

    /**
     * Lưu thay đổi
     */
    async doSave () {
      try {
        this.saving = true
        await SmartLockerService.saveCartsOfCell(this.cell.cell_id, this.carts.map(cart => cart.id))
        this.cell.carts = this.carts.map(cart => cart.name)
        this.show = false
      } catch (reason) {
        commonHelpers.showMessage(reason.toString())
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss">
.SmartLocker-ModalConfigCart {
  .close {
    border: none !important;
  }

  &.loading {
    .modal-body {
      position: relative;

      &:before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
      }

      &:after {
        position: absolute;
        content: "Đang xử lý...";
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 5px 20px;
        border-radius: 5px;
        z-index: 2;
        overflow: hidden;
        font-font: "Time new roman, Arial";
      }
    }
  }
}
</style>
