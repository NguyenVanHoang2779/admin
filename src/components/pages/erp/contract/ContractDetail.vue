<template>
    <div class="contract-detail" v-loading="loading">
        <div v-if="!not_found">
            <contract-info
              v-if="!edit_contract"
              :contract="contract"
              :profile="profile"
              @edit_mode="changeModeContract"
            />
            <contract-info-update
              v-else
              :contract="contract"
              :profile="profile"
              :permission="permission"
              @edit_mode="changeModeContract"
            />
            <!-- Thông tin phụ lục -->
            <div v-if="contract.type_contract !== 'partnership'">
                <appendix
                  :contract="contract"
                  :can-edit="canEditAppendix"
                  :permission="permission"
                />
                <div class="mt-2">
                  <list-appendix :contract_id="contract.id" :can-edit-draft="canEditAppendix" />
                  <span class="float-right" v-show="contract.status === 'active' && profile.status !== 'disabled'">
                    <b-link
                      class="btn btn-outline-ghtk"
                      :to="{name: 'create-order', params: { profileId: profile.staff_code || null, orderType: 'new_appendix' }}"
                      target="_blank"
                    >
                      <span><i class="fas fa-plus"></i> Tạo đề xuất phụ lục</span>
                    </b-link>
                  </span>
                </div>
            </div>
        </div>
        <div class="card-body" v-else>{{ errMsg || 'Không tìm thấy hợp đồng !' }}</div>
    </div>
</template>

<script>
import Appendix from './Appendix'
import ListAppendix from './ListAppendix'
import ContractInfo from './ContractInfo'
import ContractInfoUpdate from './ContractInfoUpdate'

// service
import contractService from 'domain/services/contract-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'contract-detail',

  components: {
    ContractInfo,
    ListAppendix,
    Appendix,
    ContractInfoUpdate
  },

  data: () => ({
    not_found: false,
    edit_contract: false,
    loading: false,
    permission: {},
    profile: {
      id: null,
      fullname: null,
      staff_code: null,
      status: 'active',
      personal_id_number: null,
      tel: null,
      user_id: null,
      username: null,
      group_id: null,
      department: null,
      position: null,
      station: null,
      user_status_id: 3
    },
    contract: {
      id: null,
      contract_number: '',
      start_date: '',
      contract_date: '',
      type_contract_desc: '',
      end_date: '',
      has_kpi: 0,
      status: 'active',
      type_contract: '',
      is_deletd: 0,
      e_contract: null,
      channel_id: null,
      liquidate_date: null
    },
    errMsg: null
  }),

  created () {
    this.contract.id = this.$route.params.id
    this.getPermissionOnContract(this.contract.id)
    this.getContractData()
  },

  computed: {
    canEditAppendix () {
      return !+this.contract.is_deleted && this.contract.status !== 'draft' &&
        this.permission && (this.permission.update_kpi || this.permission.update_kpi_active_contract)
    }
  },

  methods: {
    changeModeContract (editMode) {
      this.edit_contract = !!editMode
    },

    getPermissionOnContract (contractId) {
      contractService.getPermissionOnContract({ contract_id: contractId })
        .then(res => {
          if (res.data.success) {
            this.permission = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy quyền thao tác trên hợp đồng !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getContractData () {
      if (!this.contract.id) return
      this.loading = true
      contractService.getContractDetail({ contract_id: this.contract.id })
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.EmpContract) {
            this.not_found = false
            let data = res.data.data
            this.contract = data.EmpContract

            this.profile.id = data.MasterProfile.id
            this.profile.staff_code = data.MasterProfile.staff_code
            this.profile.fullname = data.MasterProfile.fullname
            this.profile.personal_id_number = data.MasterProfile.personal_id_number
            this.profile.status = data.MasterProfile.status

            this.profile.user_id = data.User.id
            this.profile.group_id = data.User.group_id
            this.profile.username = data.User.username
            this.profile.user_status_id = data.User.status_id

            this.profile.department = data.EmpPosition.department
            this.profile.position = data.EmpPosition.position_name
            this.profile.station = data.Station.name
          } else {
            this.errMsg = res.data.message || 'Không lấy được thông tin hợp dồng !'
            this.not_found = true
            helper.showMessage(this.errMsg, 'warning')
          }
        })
        .catch(e => {
          this.not_found = true
          this.errMsg = 'Có lỗi xảy ra, không lấy được thông tin hợp đồng !' + e
          helper.showMessage(this.errMsg, 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    }
  }
}
</script>
