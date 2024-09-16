<template>
    <div class="row">
        <div class="col-md-12 card mb-4">
                    <div class="row no-gutters overflow-unset">
                        <div class="col-md-8 col-lg-12 col-xl-8">
                            <h6 class="card-header"><i class="ion  ion-ios-cloud-done"></i> Cập nhật thông tin hợp đồng - <b>{{ contract_update.contract_number }}</b></h6>
                            <div class="card-body">
                                <b-form-row>
                                    <b-form-group label="Chọn loại hợp đồng" class="col-md-6 z-100">
                                        <SelectContractType
                                          :disabled="!canUpdateKpi"
                                          :contract-type="contract_update.type_contract"
                                          @select="selectTypeContract"
                                        />
                                    </b-form-group>
                                    <b-form-group label="Nhập ngày kí hợp đồng" class="col-md-6">
                                        <datepicker
                                                v-model="contract_update.contract_date"
                                                :typeable=true
                                                format='yyyy-MM-dd'
                                                :bootstrapStyling="true"
                                                :monday-first="true"
                                                :full-month-name="true"
                                                placeholder="Chọn ngày kí hợp đồng"
                                                :calendar-button="true"
                                                calendar-button-icon="ion ion-md-calendar"
                                                :clear-button="true"
                                        />
                                    </b-form-group>
                                    <b-form-group label="Chọn ngày HĐ có hiệu lực" class="col-md-6">
                                        <datepicker
                                                v-model="contract_update.start_date"
                                                format="yyyy-MM-dd"
                                                :bootstrapStyling="true"
                                                :monday-first="true"
                                                :full-month-name="true"
                                                placeholder="Ngày HĐ có hiệu lực"
                                                :calendar-button="true"
                                                calendar-button-icon="ion ion-md-calendar"
                                                :clear-button="true"
                                                @input="onChangeStartDate"
                                        />
                                    </b-form-group>
                                    <b-form-group label="Chọn ngày kết thúc hợp đồng" class="col-md-6">
                                        <datepicker
                                                v-model="contract_update.end_date"
                                                format='yyyy-MM-dd'
                                                :bootstrapStyling="true"
                                                :monday-first="true"
                                                :full-month-name="true"
                                                placeholder="Chọn ngày kết thúc"
                                                :calendar-button="true"
                                                calendar-button-icon="ion ion-md-calendar"
                                                :clear-button="true"
                                                :disabled-dates="endDateDisable"
                                        />
                                    </b-form-group>
                                    <b-form-group label="" class="col-md-12">
                                        <b-form-checkbox
                                                v-model="contract_update.has_kpi"
                                                value="1"
                                                unchecked-value="0"
                                                :disabled="!canUpdateKpi"
                                        >
                                            <b>Tính lương theo KPI</b>
                                        </b-form-checkbox>
                                    </b-form-group>
                                </b-form-row>
                            </div>
                            <div class="card-footer border-0 text-center py-3">
                                <div class="row">
                                    <button  class="ml-2 btn btn-outline-ghtk" @click="saveContract">
                                        <i class="ion ion-ios-save"></i> Lưu thông tin hợp đồng
                                    </button>
                                    <button class="ml-2 btn btn-outline-danger" @click="changeToViewMode">
                                        <i class="fas fa-times"></i> Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-12 col-xl-4 current-salary" v-if="profile">
                            <h6 class="card-header"><i class="ion ion-ios-person"></i> Thông tin cá nhân</h6>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-6 col-xl-5 text-muted mb-3">Mã nhân viên</div>
                                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ profile.staff_code }}</span></div>
                                    <div class="col-6 col-xl-5 text-muted mb-3">Họ tên</div>
                                    <div class="col-6 col-xl-7 mb-3 text-big">{{ profile.fullname }}</div>
                                    <div class="col-6 col-xl-5 text-muted mb-3">Tài khoản chính</div>
                                    <div class="col-6 col-xl-7 mb-3 text-big">{{ profile.username }}</div>
                                    <div class="col-6 col-xl-5 text-muted mb-3">Số CMT</div>
                                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ profile.personal_id_number }}</span></div>
                                    <div class="col-6 col-xl-5 text-muted mb-3">Vị trí</div>
                                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ profile.department }} - {{ profile.position }}</span></div>
                                    <div class="col-6 col-xl-5 text-muted mb-3">Kho</div>
                                    <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ profile.station }}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import staffService from 'domain/services/staff-service'
import Contract from 'domain/entities/Contract'
import helper from 'infrastructures/helpers/common-helpers'

import SelectContractType from 'components/elements/common/SelectContractType'

export default {
  name: 'contract-info-update',

  components: {
    Datepicker,
    SelectContractType
  },

  props: {
    permission: {},
    contract: {},
    profile: {}
  },

  data: () => ({
    contract_update: {
    },
    endDateDisable: {
      to: null
    }
  }),

  created () {
    this.contract_update = JSON.parse(JSON.stringify(this.contract))
    this.endDateDisable.to = new Date(this.contract.start_date || null)
  },

  computed: {
    canUpdateKpi () {
      return this.permission && (this.permission.update_kpi || this.permission.update_kpi_active_contract)
    }
  },

  methods: {
    onChangeStartDate () {
      this.contract_update.contract_date = this.contract_update.start_date
      this.endDateDisable.to = this.contract_update.start_date

      this.contract_update.end_date = Contract.calculateEndDateByContractType(this.contract_update.type_contract, this.contract_update.start_date)
    },

    saveContract () {
      let dataSend = this.contract_update
      dataSend.contract_id = this.contract.id
      dataSend.type_contract = this.contract_update.type_contract
      if (this.contract_update.type_contract === 'indefinite') {
        this.contract_update.end_date = null
      }
      this.$startLoading()
      staffService.updateContract(dataSend)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật hợp đồng thành công', 'success')
            setTimeout(function () { location.reload() }, 600)
          } else {
            helper.showMessage(res.data.message || 'Không thể cập nhật hợp đồng', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra, không thể cập nhật thông tin hợp đồng !', 'warning')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    changeToViewMode () {
      this.$emit('edit_mode', false)
    },

    selectTypeContract (op) {
      this.contract_update.type_contract = op ? op.value : null
      this.contract_update.end_date = Contract.calculateEndDateByContractType(this.contract_update.type_contract, this.contract_update.start_date)
    }
  }
}
</script>
