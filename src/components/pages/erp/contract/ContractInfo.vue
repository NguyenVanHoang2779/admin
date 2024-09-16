<template>
    <div class="row">
      <div class="col-md-12">
        <h4 class="m-0 d-inline">
          Hợp đồng {{ contract.contract_number }}
          <span v-show="contract.status === 'draft'"> - Bản nháp</span>
          <span v-show="!!+contract.is_deleted" class="text-danger"> - Đã xóa</span>
        </h4>
        <span v-if="canAction" class="float-right">
          <!-- Chưa ký điện tử thì cho sửa HĐ, xóa HĐ -->
          <span v-if="!contract.e_contract">
            <b-btn variant="outline-ghtk mr-1" @click="changeToEditMode" v-show="contract.status === 'draft'">
              <i class="ion ion-ios-create"></i> {{ contract.status === 'draft' ? 'Cập nhật hợp đồng nháp' : 'Cập nhật hợp đồng' }}
            </b-btn>
            <!-- <b-btn variant="outline-danger mr-1" @click="deleteContract">
              <i class="fas fa-trash"></i>
              {{ contract.status === 'draft' ? 'Xóa hợp đồng nháp' : 'Xóa hợp đồng' }}
            </b-btn> -->
          </span>

          <!-- Nếu có HĐ nháp thì cho phép update đã ký -->
          <span v-show="contract.status === 'draft'">
            <b-btn v-if="!canSignEContract" variant="outline-ghtk mr-1" v-b-modal.detail-file-contract>Đã ký HĐ</b-btn>
            <b-btn v-else variant="outline-ghtk mr-1" v-b-modal.detail-file-contract>Active hợp đồng nháp</b-btn>
            <!-- Nếu chưa có nhóm chat thì cho phép tạo nhóm chat -->
            <b-btn v-if="canCreateChatForSigning" @click="createChatForSigning" variant="outline-ghtk">Tạo nhóm chat ký HĐ</b-btn>
          </span>
          <!-- Có thể thanh lý, xem thông tin thanh lý -->
          <b-btn v-if="canLiquidate" variant="outline-danger" v-b-modal.detail-liquidate-contract>
            {{ contract.status === 'active' ? 'Thanh lý/ Chấm dứt HĐ' : 'Thông tin thanh lý' }}
          </b-btn>
          <!-- Tạo đề xuất HĐ nếu hiện tại có HĐ active -->
          <span v-show="contract.status === 'active'">
            <b-link
              v-if="!employeeOrder.contract || !employeeOrder.contract.contract || !employeeOrder.contract.contract.new_contract"
              :to="{name: 'create-order', params: { profileId: profile.staff_code || null, orderType: 'new_contract' }}"
              class="btn btn-outline-ghtk mr-1"
              target="_blank"
            >
              <i class="fas fa-plus"></i> Tạo đề xuất hợp đồng mới
            </b-link>
            <b-link
              v-else
              :to="{name: 'list-order', params: { orderCode: employeeOrder.contract.contract.new_contract.id || null }}"
              class="btn btn-outline-ghtk mr-1"
              target="_blank"
            >
              <i class="fas fa-eye"></i> Xem đề xuất hợp đồng
            </b-link>
            <!-- Xem file đã ký -->
            <b-btn variant="outline-ghtk mr-1" v-b-modal.detail-file-contract>Xem file HĐ đã ký</b-btn>
            <!-- cho phép Cập nhật HĐ về draft nếu chưa ký điện tử  -->
            <!-- <b-btn v-if="!contract.e_contract" variant="outline-ghtk" @click="updateStatusContract('draft')">Chuyển về thành HĐ nháp</b-btn> -->
          </span>
          <!-- In HĐ -->
          <contract-export :contract="contract" :can-sign-e-contract="canSignEContract" />
        </span>
      </div>
      <div class="col-md-12 contract-detail">
            <div class="card mb-4">
                <div class="row no-gutters row-bordered">
                    <div class="col-md-8 col-lg-12 col-xl-8">
                        <h6 class="card-header"><i class="ion  ion-ios-cloud-done"></i>&nbsp;Thông tin hợp đồng
                            <span v-if="contract.status === 'disable'" class="badge badge-danger">HẾT HIỆU LỰC</span>
                        </h6>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">Số hợp đồng : </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <span class="text-big">{{contract.contract_number}}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">Loại hợp đồng : </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <span class="text-big">{{ contract.type_contract_desc }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">Tính lương theo KPI :  </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <b-form-checkbox
                                            disabled
                                            v-model="contract.has_kpi"
                                            value="1"
                                            unchecked-value="0"
                                    >
                                        <b>KPI</b>
                                    </b-form-checkbox>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">Ngày ký:  </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <span class="text-big">{{contract.contract_date}}</span>
                                </div>
                            </div>
                            <hr class="border-light container-m--x mt-0 mb-4">
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">Ngày bắt đầu:   </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <span class="text-big">{{contract.start_date}}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">Ngày kết thúc :  </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <span v-if ="contract.end_date" class="text-big">{{contract.end_date}}</span>
                                    <span  class="text-big" v-else >Vô thời hạn</span>
                                </div>
                            </div>
                            <div class="row" v-show="contract.liquidate_date">
                                <div class="col-3 col-xl-5 text-muted mb-3">Ngày thanh lý :  </div>
                                <div class="col-9 col-xl-7 mb-3">
                                    <span class="text-big">{{contract.liquidate_date}}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 col-xl-5 text-muted mb-3">ID Group chat ký hợp đồng (channel_id):  </div>
                                <div class="col-9 col-xl-7 mb-3" v-if="contract.has_kpi">
                                    <span  class="text-big">{{contract.channel_id || 'Chưa có'}}</span>
                                </div>
                                <div class="col-9 col-xl-7 mb-3" v-else>
                                    <span  class="text-big">Hợp đồng không ký điện tử</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 col-lg-12 col-xl-4 bg-white">
                        <h6 class="card-header"><i class="ion ion-ios-person"></i>&nbsp;Thông tin cá nhân</h6>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6 col-xl-5 text-muted mb-3">Mã nhân viên</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ profile.staff_code }}</span></div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Họ tên</div>
                                <div class="col-6 col-xl-7 mb-3 text-big">{{ profile.fullname }}</div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Tài khoản chính</div>
                                <div class="col-6 col-xl-7 mb-3 text-big">
                                  {{ profile.username }}
                                </div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Số CMT</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{profile.personal_id_number}}</span> </div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Vị trí</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{profile.department}} - {{profile.position}}</span></div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Kho</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{profile.station}}</span></div>
                                <div class="col-12">
                                  <b-alert :show="profile && profile.status === 'disabled'" variant="danger">
                                    <b>Lưu ý:</b><br/>
                                    <div v-show="profile.status === 'disabled'">- Nhân viên này đã nghỉ việc, không thể tạo, cập nhật hợp đồng !</div>
                                  </b-alert>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
      <ModalDetailFile
        :contract-id="contract.id"
        :id="'detail-file-contract'"
        title="Thông tin file HĐ đã ký"
        :edit="contract.status === 'draft'"
        :signed="true"
        @updateOk="contract.status = 'active'"
      />
      <ModalLiquidateContract
        :contract-id="contract.id"
        :contract="contract"
        :id="'detail-liquidate-contract'"
        :title="'Thanh lý hợp đồng ' + contract.contract_number"
        :edit="contract.status === 'active'"
        @updateOk="updateLiquidateOk"
      />
      <hr class="border-light container-m--x mt-0 mb-4"><br/>
    </div>
</template>

<script>
// service
import hrOrderService from 'domain/services/hr-order-service'
import contractService from 'domain/services/contract-service'

// custom component
import ContractExport from 'components/pages/erp/contract/ContractExport'
import ModalDetailFile from './ModalDetailFile'
import ModalLiquidateContract from './ModalLiquidateContract'

// entities
import Contract from 'domain/entities/Contract'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'contract-info',

  components: {
    ContractExport,
    ModalDetailFile,
    ModalLiquidateContract
  },

  props: {
    contract: {},
    profile: {}
  },

  data: () => ({
    contractType: Contract.typeOptions,
    employeeOrder: {}
  }),

  computed: {
    canSignEContract () {
      return +this.contract.has_kpi && ['service_contract', 'indefinite', 'definite', 'definite_24', 'probation'].includes(this.contract.type_contract)
    },

    canCreateChatForSigning () {
      return this.canSignEContract && !this.contract.channel_id && !this.contract.e_contract
    },

    canAction () {
      return !+this.contract.is_deleted
    },

    canLiquidate () {
      return ['active', 'disable'].includes(this.contract.status)
    }
  },

  watch: {
    'profile.staff_code' (newVal, oldVal) {
      if (newVal) this.getOrderOfProfile(newVal)
    }
  },

  methods: {
    changeToEditMode () {
      this.$emit('edit_mode', true)
    },

    deleteContract () {
      if (!this.contract || !this.contract.id) return
      let msg = `Chỉ nên xóa hợp đồng khi tạo sai, thừa\n`
      msg += `Bạn thực sự muốn xóa hợp đồng:\n- ${this.contractType[this.contract.type_contract]}\n- Số: ${this.contract.contract_number}`
      if (!confirm(msg)) return

      this.$startLoading()
      contractService.deleteContract({ contract_id: this.contract.id })
        .then(res => {
          if (res.data.success) {
            this.contract.is_deleted = true
            helper.showMessage(res.data.message || 'Xóa hợp đồng thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Không xóa được hợp đồng, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, không xóa được hợp đồng !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    updateStatusContract (status) {
      if (!this.contract || !this.contract.id || !status) return
      let msg = ''
      if (status === 'active') msg = `Hợp đồng này hiện đang là bản nháp\nBạn thực sự muốn cập nhật trạng thái về hợp đồng hiệu lực`
      if (status === 'draft') msg = `Hợp đồng này đang có hiệu lực\nBạn thực sự muốn cập nhật trạng thái về hợp đồng nháp để ký lại`
      msg += `\n- ${this.contractType[this.contract.type_contract]}\n- Số: ${this.contract.contract_number}`
      if (!confirm(msg)) return

      let data = {
        contract_id: this.contract.id,
        status: status
      }

      this.$startLoading()
      contractService.updateStatusContract(data)
        .then(res => {
          if (res.data.success) {
            this.contract.status = status
            helper.showMessage(res.data.message || 'Cập nhật hợp đồng thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Không cập nhật được hợp đồng, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, không cập nhật được hợp đồng !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    // Lấy đề xuất chưa hoàn thành của nhân viên
    getOrderOfProfile (profileId = null) {
      if (!profileId) profileId = this.masterInfo.id
      if (!profileId) return
      hrOrderService.getOrderOfProfile({ profile_id: profileId, status: ['cho_duyet', 'da_duyet_supervisor', 'da_duyet_leader', 'thieu_ho_so'], category: 'contract' })
        .then(res => {
          if (res.data.success) {
            this.employeeOrder = res.data.data
          } else {
            console.log(res.data.message || 'getOrderOfProfile: Không thể lấy thông tin các đề xuất của nhân viên !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    // Tạo nhóm chat ký HĐ
    createChatForSigning () {
      if (!this.profile.id) return

      this.$startLoading()
      contractService.createChatForSigning({profile_id: this.profile.id})
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.success && res.data.data.success[this.profile.id]) {
            helper.showMessage(res.data.message || 'Tạo nhóm chat ký hợp đồng thành công')
            this.contract.channel_id = res.data.data.success[this.profile.id] || 1
          } else {
            helper.showMessage(res.data.message || 'Không tạo được nhóm chat ký hợp đồng !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra !')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    updateLiquidateOk (data) {
      this.contract.status = data.contract_status
      this.contract.liquidate_date = data.liquidate_date
    }
  }
}
</script>
