<template>
  <span>
    <b-button id="btn-print" variant="outline-ghtk" :pressed="toggle" v-show="!canSignEContract">
      <i class="ion ion-md-print"/> In hợp đồng
    </b-button>
    <b-popover :show.sync="toggle" title="Chọn loại hợp đồng" target="btn-print" triggers="hover focus" placement="bottomright">
      <b-button-group vertical>
        <b-button class="w-100" variant="outline-ghtk" @click="exportContract">
          <i v-if="loadingContract" class="fa fa-spin fa-spinner"/>
          <i v-else class="fa fa-file-alt"/>
          {{contract.contract_number}}
        </b-button>
        <!-- <b-button class="w-100" variant="outline-danger" @click="exportLiquidation">
          <i v-if="loadingLiquidation" class="fa fa-spin fa-spinner"/>
          <i v-else class="fa fa-calendar-times"/>
          Thanh lý / Chấm dứt hợp đồng
        </b-button> -->
      </b-button-group>
    </b-popover>
  </span>
</template>

<script>
import ContractService from 'domain/services/contract-service'

// utility
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'contract-export',
  props: ['contract', 'canSignEContract'],
  data: () => ({
    loadingContract: false,
    loadingLiquidation: false,
    toggle: false
  }),
  methods: {
    exportContract () {
      this.loadingContract = true
      let params = {
        'contract_id': this.contract.id,
        'type': 0
      }
      ContractService.exportContract(params)
        .then(res => {
          if (res.data.success) window.open(res.data.data)
          else commonHelper.showMessage('Đã có lỗi xảy ra vui lòng thử lại sau!', 'warning')
        })
        .finally(() => {
          this.loadingContract = false
        })
    },

    exportLiquidation () {
      this.loadingLiquidation = true
      let params = {
        'contract_id': this.contract.id,
        'type': 1
      }
      ContractService.exportContract(params)
        .then(res => {
          if (!res.data.success) throw new Error(res.data.message)
          window.open(res.data.data)
        })
        .catch(e => {
          commonHelper.showMessage(e, 'warning')
        })
        .finally(_ => {
          this.loadingLiquidation = false
        })
    }
  }
}
</script>
