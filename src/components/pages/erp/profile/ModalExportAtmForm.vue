<template>
  <b-modal v-model="isShowModal" size="lg" @shown="showModal" @hidden="hideModal" title="In Phiếu ATM">
    <div>
      <b-row>
          <b-col cols="12">
              <b-row>
                <b-col cols="12" class="button-export">
                  <b-button class="w-100" variant="outline-primary" @click="exportRegisterBankServiceForm">
                    <i v-if="loadingRegisterBankService" class="fa fa-spin fa-spinner"/>
                    <i v-else class="fa fa-file-alt"/>
                    Đăng ký mở tài khoản
                    </b-button>
                </b-col>
                <b-col cols="12" class="button-export">
                  <b-button class="w-100" variant="outline-success" @click="exportChangingEBankingServiceForm">
                    <i v-if="loadingEBankingService" class="fa fa-spin fa-spinner"/>
                    <i v-else class="fa fa-file-alt"/>
                    Đổi dịch vụ ngân hàng
                  </b-button>
                </b-col>
                <b-col cols="12" class="button-export">
                  <b-button class="w-100" variant="outline-info" @click="exportChangingCustomerInformationForm">
                    <i v-if="loadingCustomerInformation" class="fa fa-spin fa-spinner"/>
                    <i v-else class="fa fa-file-alt"/>
                    Đổi thông tin khách hàng
                  </b-button>
                </b-col>
                <b-col cols="12" class="button-export">
                  <b-button class="w-100" variant="outline-warning" @click="exportRequestCardServiceForm">
                    <i v-if="loadingRequestCardService" class="fa fa-spin fa-spinner"/>
                    <i v-else class="fa fa-file-alt"/>
                    Cung cấp dịch vụ thẻ
                  </b-button>
                </b-col>
                <b-col cols="12" class="button-export">
                  <b-button class="w-100" variant="outline-danger" @click="exportRegistrationEBankingService">
                    <i v-if="loadingRegisterEBanking" class="fa fa-spin fa-spinner"/>
                    <i v-else class="fa fa-file-alt"/>
                    Đăng ký dịch vụ E-banking
                  </b-button>
                </b-col>
              </b-row>
          </b-col>
       </b-row>
    </div>
  </b-modal>
</template>
<script>
import profileService from 'domain/services/profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-export-atm-form',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    dataMasterProfile: {
      type: Object
    }
  },
  data: () => ({
    isShowModal: this.isShow,
    toggle: false,
    masterProfileDetail: {},
    loadingRegisterBankService: false,
    loadingEBankingService: false,
    loadingCustomerInformation: false,
    loadingRequestCardService: false,
    loadingRegisterEBanking: false
  }),
  watch: {
    isShow (newValue, oldValue) {
      this.isShowModal = newValue
      this.$emit('toggleModal', newValue)
    },
    dataMasterProfile (newValue, oldValue) {
      if (newValue) {
        this.masterProfileDetail = JSON.parse(JSON.stringify(newValue))
      } else {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-warning',
          title: 'Thông báo',
          text: 'Không thể lấy dữ liệu'
        })
      }
    }
  },
  methods: {
    showModal () {
      this.$emit('toggleModal', true)
    },
    hideModal () {
      this.$emit('toggleModal', false)
      this.$stopLoading()
    },
    exportRegisterBankServiceForm () {
      this.loadingRegisterBankService = true
      let params = {
        'master_profile_id': this.masterProfileDetail.id,
        'form': 'register_service'
      }
      profileService.exportAtmTemplate(params).then(res => {
        if (!res.data.success) throw new Error(res.data.message)
        window.open(res.data.data)
      }).catch(e => {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: e
        })
      }).finally(() => {
        this.loadingRegisterBankService = false
      })
    },
    exportChangingEBankingServiceForm () {
      this.loadingEBankingService = true
      let params = {
        'master_profile_id': this.masterProfileDetail.id,
        'form': 'changing_ebanking_servive'
      }
      profileService.exportAtmTemplate(params).then(res => {
        if (!res.data.success) throw new Error(res.data.message)
        commonHelper.showMessage(res.data.message, 'success')
        window.open(res.data.data)
      }).catch(e => {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: e
        })
      }).finally(() => {
        this.loadingEBankingService = false
      })
    },
    exportChangingCustomerInformationForm () {
      this.loadingCustomerInformation = true
      let params = {
        'master_profile_id': this.masterProfileDetail.id,
        'form': 'changing_customer_information'
      }
      profileService.exportAtmTemplate(params).then(res => {
        if (!res.data.success) throw new Error(res.data.message)
        commonHelper.showMessage(res.data.message, 'success')
        window.open(res.data.data)
      }).catch(e => {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: e
        })
      }).finally(() => {
        this.loadingCustomerInformation = false
      })
    },
    exportRequestCardServiceForm () {
      this.loadingRequestCardService = true
      let params = {
        'master_profile_id': this.masterProfileDetail.id,
        'form': 'request_card_service'
      }
      profileService.exportAtmTemplate(params).then(res => {
        if (!res.data.success) throw new Error(res.data.message)
        commonHelper.showMessage(res.data.message, 'success')
        window.open(res.data.data)
      }).catch(e => {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: e
        })
      }).finally(() => {
        this.loadingRequestCardService = false
      })
    },
    exportRegistrationEBankingService () {
      this.loadingRegisterEBanking = true
      let params = {
        'master_profile_id': this.masterProfileDetail.id,
        'form': 'register_e_banking_service'
      }
      profileService.exportAtmTemplate(params).then(res => {
        if (!res.data.success) throw new Error(res.data.message)
        commonHelper.showMessage(res.data.message, 'success')
        window.open(res.data.data)
      }).catch(e => {
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: e
        })
      }).finally(() => {
        this.loadingRegisterEBanking = false
      })
    }
  }
}
</script>
<style scoped>
    .button-export {
      margin-bottom: 10px;
    }
    .content-value {
       font-weight: 600;
    }
    .font-title {
        font-size: 0.9rem;
    }
    .content-form {
        text-align: right;
    }
    .popover {
        min-width: 30em !important;
    }
</style>
