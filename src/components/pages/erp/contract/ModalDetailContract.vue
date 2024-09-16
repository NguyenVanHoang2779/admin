<template>
  <div>
    <b-modal :id="id" modal-class="modal-xxl" centered hide-footer @shown="getContractByProfile">
      <template slot="modal-title">
        <span>Thông tin chi tiết hợp đồng nhân viên: <i><b v-if="profile">{{ profile.fullname }}</b></i></span>
      </template>
      <div>
        <table class="table table-hover table-bordered table-sm mb-0">
          <tr class="table-header-ghtk">
            <th class="text-center">User</th>
            <th class="text-center">Trạng thái HĐ</th>
            <th>Số HĐ</th>
            <th>Loại HĐ</th>
            <th>Chức vụ</th>
            <th>Bộ phận</th>
            <th class="text-center">Ngày hiệu lực HĐ</th>
            <th class="text-center">Ngày kết thúc</th>
            <th class="text-center">lương cơ bản</th>
            <th class="text-center">phụ cấp</th>
            <th class="text-center">Tính KPI</th>
            <th class="text-center">Tình trạng</th>
            <th class="text-center">Chi tiết</th>
          </tr>
          <tbody class="position-relative" v-loading="loading">
          <tr v-for="(contract, idx) in listContract" :key="idx">
            <td class="text-center position-relative" v-b-popover.hover="{html: true, content: '<strong>User chính</strong>', variant: 'success'}" v-if="+contract.User.id === +profile.userId" variant="info">
              <div class="position-absolute main-user-note"></div>
              <div><b>{{ contract.User.username }}</b></div>
              <b-badge :variant="userVariant[contract.User.status_id]">{{ userStatus[contract.User.status_id] }}</b-badge>
            </td>
            <td class="text-center" v-else>
              <div><b>{{ contract.User.username }}</b></div>
              <b-badge :variant="userVariant[contract.User.status_id]">{{ userStatus[contract.User.status_id] }}</b-badge>
            </td>
            <td class="text-center">
              <div>
                <!-- <b class="disable-contract" @click="disableContract(contract.Contract)" v-if="contract.Contract.status === 'active'">Vô hiệu HĐ</b> -->
                <span>&nbsp;</span>
              </div>
              <b-badge :variant="contractStatusVariant[contract.Contract.status] || 'ghtk'" class="w-5re">
                {{ contractStatus[contract.Contract.status] || '' }}
              </b-badge>
            </td>
            <td>{{ contract.Contract.contract_number }}</td>
            <td>{{ contractType[contract.Contract.type_contract] || '' }}</td>
            <td>{{ '' }}</td>
            <td>{{ '' }}</td>
            <td class="text-center">{{ formatDate(contract.Contract.start_date, 'DD-MM-YYYY') }}</td>
            <td class="text-center">{{ formatDate(contract.Contract.end_date, 'DD-MM-YYYY') }}</td>
            <td class="text-center">{{ formatMoney(contract.ContractSalary.salary) }}</td>
            <td class="text-center">
              {{ formatMoney( +contract.ContractSalary.biztrip_allowance +
                              +contract.ContractSalary.meal_allowance +
                              +contract.ContractSalary.mobile_allowance +
                              +contract.ContractSalary.trans_allowance +
                              +contract.ContractSalary.resp_allowance
                            )
              }}
            </td>
            <td class="text-center">
              <i
                class="ion font-rem-4"
                :class="+contract.Contract.has_kpi ? 'ion-md-checkmark text-ghtk' : 'ion-md-close text-danger'"
                :title="+contract.Contract.has_kpi ? 'Có' : 'không'"
              ></i>
            </td>
            <td class="text-center">
              <b-badge :variant="getVariant(contract.Contract.print_status)" class="w-4re">
                {{ printStatus[contract.Contract.print_status] }}
              </b-badge>
            </td>
            <td class="text-center">
              <b-btn variant="outline-ghtk" title="Xem chi tiết lương" @click="openDetailSalary(contract)" size="sm" class="mb-1">
                <i class="fas fa-pencil-alt"></i>
              </b-btn>
              <b-btn variant="outline-ghtk" title="Xem các phụ lục đính kèm" @click="openDetailAppendix(contract)" size="sm" class="mb-1">
                <i class="fas fa-paperclip"></i>
              </b-btn>
              <b-btn variant="outline-ghtk" title="Xem file hợp đồng, phụ lục" @click="openDetailFile(contract)" size="sm"><i class="fas fa-file"></i></b-btn>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    <modal-detail-salary
      id="detail-salary"
      :contract="curContract"
      :type="detailSalaryType"
      @created-appendix="createdAppendix"
    ></modal-detail-salary>
    <modal-detail-file
      id="detail-file"
      :contract="curContract"
    ></modal-detail-file>
  </div>
</template>

<style lang="scss" scoped>
  .disable-contract {
    color: #26B4FF ;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: #d9534f;
    }
  }
  .main-user-note {
    width: 0.7rem;
    height: 0.7rem;
    border: 1px solid transparent;
    border-radius: 0.7rem;
    background-color: #02BC77;
    right: 0.3rem;
  }

</style>

<script>
// Api service
import staffService from 'domain/services/staff-service'

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// entities
import Contract from 'domain/entities/Contract'
import User from 'domain/entities/User'

// custom component
import ModalDetailSalary from './ModalDetailSalary'
import ModalDetailFile from './ModalDetailFile'

export default {
  name: 'detail-contract',

  components: {
    ModalDetailSalary,
    ModalDetailFile
  },

  props: {
    id: {
      default: null
    },
    profile: {
      type: Object,
      default: () => ({
        id: null,
        fullname: null,
        userId: null,
        username: null
      })
    }
  },

  data: () => ({
    loading: null,
    listContract: null,
    contractType: Contract.typeOptions,
    printStatus: Contract.printStatus,
    contractStatus: Contract.status,
    contractStatusVariant: {
      draft: 'warning',
      active: 'ghtk',
      disable: 'secondary'
    },
    userStatus: User.statusOptions,
    userVariant: User.statusVariant,
    curContract: {},
    detailSalaryType: 'salary' // bao gồm 2 loại salary và appendix
  }),

  /* created () {
    this.getContractByProfile()
  }, */

  watch: {
    // 'profile.id': function (newVal, oldVal) {
    //   if (!newVal) return
    //   this.getContractByProfile()
    // }
  },

  methods: {
    getContractByProfile () {
      if (!this.profile || !this.profile.id) return
      this.loading = true
      this.listContract = []
      staffService.getContractByProfile({ profile: this.profile.id })
        .then(res => {
          if (res.data.success) {
            this.listContract = res.data.data
          } else {
            this.listContract = null
            commonHelper.showMessage(res.data.message || 'Không lấy được danh sách hợp đồng, vui lòng thử lại sau !')
          }
        })
        .catch((err) => {
          commonHelper.showMessage('Không lấy được danh sách hợp đồng, vui lòng thử lại sau !')
          console.log(err)
        })
        .then(() => {
          this.loading = false
        })
    },

    formatDate (date, format) {
      return commonHelper.formatDate(date, format)
    },

    formatMoney (amount) {
      return commonHelper.formatMoney(amount)
    },

    openDetailSalary (contract) {
      this.detailSalaryType = 'salary'
      this.curContract = contract
      this.$bvModal.show('detail-salary')
    },

    openDetailAppendix (contract) {
      this.detailSalaryType = 'appendix'
      this.curContract = contract
      this.$bvModal.show('detail-salary')
    },

    openDetailFile (contract) {
      this.curContract = contract
      this.$bvModal.show('detail-file')
    },

    getVariant (status) {
      if (!status) return 'warning'
      if (['notPrint'].includes(status)) return 'secondary'
      if (['printed'].includes(status)) return 'ghtk'
      if (['received'].includes(status)) return 'ghtk'
    },

    disableContract (contract) {
      if (confirm(`Bạn thực sự muốn vô hiệu hóa hợp đồng: \n - ${this.contractType[contract.type_contract]} \n - Số: ${contract.contract_number}`)) {
        staffService.disableContract({ contract_id: contract.id })
          .then(res => {
            if (res.data.success) {
              contract.status = 'disable'
              commonHelper.showMessage(res.data.message || 'Vô hiệu hóa hợp đồng thành công', 'success')
            } else {
              commonHelper.showMessage(res.data.message || 'Vô hiệu hóa hợp đồng không thành công !', 'warning')
            }
          })
          .catch(e => {
            commonHelper.showMessage('Vô hiệu hóa hợp đồng không thành công !', 'warning')
            console.log(e)
          })
      }
    },

    createdAppendix (appendix) {
      if (this.curContract && +this.curContract.User.id === +this.profile.userId) this.$emit('update-salary', appendix)
    }
  }
}
</script>
