<template>
  <div>
    <b-modal :id="id" modal-class="modal-xxl" centered hide-footer @hide="addAppendix = false">
      <template slot="modal-title">
        <span><i><b class="text-info">{{ type === 'salary' ? 'Lương': 'Phụ lục' }}</b></i> hợp đồng: <i><b v-if="contract && contract.Contract">
            {{ contract.Contract.contract_number }} - {{ contractType[contract.Contract.type_contract] || '' }}
        </b></i></span>
      </template>
      <div class="text-right mb-1" v-if="contract.Contract && contract.Contract.status === 'active'">
        <b-btn :variant="addAppendix ? 'danger' : 'success'" size="sm" @click="addAppendix = !addAppendix">{{ addAppendix ? 'Hủy thêm phụ lục' : 'Thêm phụ lục' }}</b-btn>
      </div>
      <div>
        <table class="table table-hover table-bordered table-sm font" v-if="contract.Contract">
          <thead class="table-header-ghtk">
          <tr>
            <th class="text-center align-middle" rowspan="2">Số phụ lục</th>
            <th class="text-center align-middle" rowspan="2" v-show="type === 'appendix'">Trạng thái</th>
            <th class="text-center align-middle" rowspan="2">Ngày hiệu lực phụ lục</th>
            <th class="text-center align-middle" rowspan="2">Lương cơ bản</th>
            <th class="text-center" colspan="5">Phụ cấp</th>
            <th class="text-center align-middle" rowspan="2">Tổng</th>
            <th class="text-center align-middle" rowspan="2" v-show="type === 'appendix'">Nội dung thay đổi</th>
            <th class="text-center align-middle" rowspan="2">Tình trạng</th>
            <th class="text-center align-middle" rowspan="2">Người tạo</th>
          </tr>
          <tr>
            <th class="text-center">Trách nhiệm</th>
            <th class="text-center">Xăng xe, ăn đêm</th>
            <th class="text-center">Ăn trưa</th>
            <th class="text-center">Điện thoại</th>
            <th class="text-center">Khoản công tác</th>
          </tr>
          </thead>
          <tbody class="positiob-relative" v-loading="loading">
          <template v-if="listAppendix && listAppendix.length > 0">
            <tr class="font-weight-bold" v-for="(appendix, idx) in listAppendix" :key="idx" >
              <td class="text-center">{{ appendix.appendix_number }}</td>
              <td class="text-center" v-show="type === 'appendix'">
                <b-badge
                  :variant="contract.Contract.status === 'active' && appendix.status === 'active'? 'ghtk' : 'danger'"
                >
                  {{ contract.Contract.status === 'active' && appendix.status === 'active' ? 'Còn hiệu lực' : 'Hết hiệu lực' }}
                </b-badge>
              </td>
              <td class="text-center">{{ formatDate(appendix.effect_date || appendix.created, 'DD-MM-YYYY') }}</td>
              <td class="text-center">{{ formatMoney(appendix.salary) }}</td>
              <td class="text-center">{{ formatMoney(appendix.resp_allowance) }}</td>
              <td class="text-center">{{ formatMoney(appendix.trans_allowance) }}</td>
              <td class="text-center">{{ formatMoney(appendix.meal_allowance) }}</td>
              <td class="text-center">{{ formatMoney(appendix.mobile_allowance) }}</td>
              <td class="text-center">{{ formatMoney(appendix.biztrip_allowance) }}</td>
              <td class="text-center">{{
                formatMoney(  +appendix.salary +
                              +appendix.biztrip_allowance +
                              +appendix.meal_allowance +
                              +appendix.mobile_allowance +
                              +contract.ContractSalary.trans_allowance +
                              +appendix.resp_allowance
                            )
                  }}
              </td>
              <td v-show="type === 'appendix'">{{ appendix.content }}</td>
              <td class="text-center">
                <b-badge :variant="getVariant(appendix.print_status)" class="w-4re">
                  {{ printStatus[appendix.print_status] }}
                </b-badge>
              </td>
              <td>{{ appendix.created_by }}</td>
            </tr>
          </template>
          <tr v-show="!listAppendix || listAppendix.length === 0">
            <td class="text-center" colspan="13">Không có thông tin lương, phụ lục hợp đồng !</td>
          </tr>
          </tbody>
        </table>
        <div class="text-center" v-else>Không có thông tin hợp đồng !</div>
        <div class="" v-if="addAppendix">
          <appendix
            :edit="true"
            :data-appendix="listAppendix && listAppendix[0]"
            :contract="contract.Contract"
            @updateAppendixOk="createdAppendix"
          ></appendix>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// entities
import Contract from 'domain/entities/Contract'

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// Api service
import staffService from 'domain/services/staff-service'
// custom component
import Appendix from './Appendix'

export default {
  name: 'detail-salary',

  components: {
    Appendix
  },

  props: {
    id: {
      default: null
    },
    contract: {
      type: Object,
      default: () => ({})
    },
    type: {
      default: 'salary',
      type: String
    }
  },

  data: () => ({
    contractType: Contract.typeOptions,
    listAppendix: null,
    loading: null,
    printStatus: Contract.printStatus,
    addAppendix: false
  }),

  watch: {
    type (newVal, oldVal) {
      if (newVal === 'appendix') this.getListAppendix()
      else if (this.type === 'salary') {
        this.listAppendix = []
        this.listAppendix.push(this.contract.ContractSalary)
      }
    },

    'contract.Contract.id': function (newVal, oldval) {
      if (newVal) {
        if (this.type === 'appendix') this.getListAppendix()
        else {
          this.listAppendix = []
          this.listAppendix.push(this.contract.ContractSalary)
        }
      }
    }
  },

  methods: {
    formatDate (date, format) {
      return commonHelper.formatDate(date, format)
    },

    formatMoney (amount) {
      return commonHelper.formatMoney(amount)
    },

    getListAppendix () {
      this.loading = true
      if (!this.contract.Contract.id) return
      staffService.getListAppendix({contract_id: this.contract.Contract.id})
        .then(res => {
          if (res.data.success) {
            this.listAppendix = res.data.data
          } else {
            this.listAppendix = null
            commonHelper.showMessage(res.data.message || 'Không lấy được thông tin phụ lục của hợp đồng !')
          }
        })
        .catch(e => {
          console.log(e)
          commonHelper.showMessage('Không lấy được thông tin phụ lục của hợp đồng !')
        })
        .then(() => {
          this.loading = false
        })
    },

    createdAppendix (appendix) {
      this.addAppendix = false
      if (this.type === 'salary') this.listAppendix[0] = appendix
      else {
        if (this.listAppendix[0]) this.listAppendix[0].status = 'disable'
        this.listAppendix.unshift(appendix)
      }
      this.contract.ContractSalary = appendix
      this.$emit('created-appendix', appendix)
    },

    getVariant (status) {
      if (!status) return 'warning'
      if (['notPrint'].includes(status)) return 'secondary'
      if (['printed'].includes(status)) return 'ghtk'
      if (['received'].includes(status)) return 'ghtk'
    }
  }
}
</script>
