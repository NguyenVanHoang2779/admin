<template>
    <div>
        <div class="notification-company">
            <b-alert
                    :variant="notify_add_company.type"
                    dismissible
                    fade
                    :show="notify_add_company.showDismissibleAlert"
                    @dismissed="notify_add_company.showDismissibleAlert = false"
            >
                {{notify_add_company.message}}
            </b-alert>
        </div>
        <b-modal ref="modal-add-profile" id="modal-add-profile" size="lg" title="Thêm profile tổ chức" v-model="modalShow" ok-only static>
            <b-row>
                <b-col md="6" class="text-left sperator-right">
                    <b-form-row>
                        <b-form-group class="col-md-12">
                            <template slot='label'>
                                Tên công ty <span class='red-text'>(*)</span>
                            </template>
                            <b-form-input
                                    v-model="companyProfile.fullname"
                                    placeholder="Tên công ty"
                                    id="fullname"
                                    name="fullname"
                                    v-validate="'required'"
                                    :class="{'is-danger': errors.has('fullname')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('fullname') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-12">
                            <template slot='label'>
                                Tên rút gọn <span class='red-text'>(*)</span>
                            </template>
                            <b-form-input
                                    v-model="companyProfile.short_name"
                                    placeholder="Tên rút gọn"
                                    id="short_name"
                                    name="short_name"
                                    v-validate="'required'"
                                    :class="{'is-danger': errors.has('short_name')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('short_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Loại đối tác <span class='red-text'>(*)</span>
                            </template>
                            <b-form-select
                                    v-model="companyProfile.organization_type"
                                    :options="selectRegions"
                                    class="mb-3"
                                    id="organization_type"
                                    name="organization_type"
                                    v-validate="'required'"
                                    :class="{'is-danger': errors.has('organization_type')}"
                            >
                                <template v-slot:first>
                                    <option :value="null" disabled>-- Chọn loại đối tác --</option>
                                </template>
                            </b-form-select>
                            <span v-show="errors.firstRule('organization_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group >
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Mã số thuế <span class='red-text'>(*)</span>
                            </template>
                            <b-form-input
                                    v-model="companyProfile.tax_iden_number"
                                    placeholder="Mã số thuế"
                                    id="tax_iden_number"
                                    name="tax_iden_number"
                                    v-validate="'required'"
                                    :class="{'is-danger': errors.has('tax_iden_number')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('tax_iden_number') == 'required'" class="help is-danger">Không để trống trường này </span>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Tài khoản ngân hàng
                            </template>
                            <b-form-input
                                    v-model="companyProfile.bank_account_number"
                                    placeholder="Tài khoản ngân hàng"
                                    id="bank_account_number"
                                    name="bank_account_number"
                                    v-validate="{alpha_num: true}"
                                    :class="{'is-danger': errors.has('bank_account_number')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('bank_account_number') == 'alpha_num'" class="help is-danger">Tài khoản ngân hàng chỉ gôm chữ và số </span>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Tên ngân hàng
                            </template>
                            <b-form-input
                                    v-model="companyProfile.bank_name"
                                    placeholder="Tên ngân hàng"
                            >
                            </b-form-input>
                        </b-form-group >
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Số điện thoại liên hệ
                            </template>
                            <b-form-input
                                    v-model="companyProfile.contact_tel"
                                    placeholder="Điện thoại liên hệ"
                                    id="contact_tel"
                                    name="contact_tel"
                                    v-validate="{numeric: true}"
                                    :class="{'is-danger': errors.has('contact_tel')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('contact_tel') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                        </b-form-group >
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Email liên hệ
                            </template>
                            <b-form-input
                                    v-model="companyProfile.contact_email"
                                    placeholder="Email liên hệ"
                                    id="contact_email"
                                    name="contact_email"
                                    v-validate="{email: true}"
                                    :class="{'is-danger': errors.has('contact_email')}"
                            >
                            </b-form-input>
                            <span v-show="errors.firstRule('contact_email') == 'email'" class="help is-danger">Sai định dạng </span>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group label="Miền" class="col-md-6">
                            <single-select-profile-region
                                    @handleSelectedRegion="handleSelectedRegion"
                                    :region="companyProfile.region">
                            </single-select-profile-region>
                        </b-form-group >
                        <b-form-group class="col-md-6">
                            <template slot='label'>
                                Đại diện pháp lý
                            </template>
                            <b-form-input
                                    v-model="companyProfile.legal_representative_name"
                                    placeholder="Đại diện pháp lý"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-form-row>
                </b-col>
                <b-col md="6" class="text-left">
                    <b-form-group label="Chỗ ở hiện tại:">
                        <b-form-input placeholder="Số nhà, tên đường" v-model="companyProfile.current_address_detail" class="mb-2"></b-form-input>
                        <single-select-province :province-id="companyProfile.current_address_province" @handleSelectedProvince="setProvinceNow"></single-select-province>
                        <div style="margin-top: -1em"><single-select-district :province-id="companyProfile.current_address_province" :district-id="companyProfile.current_address_district" @handleSelectedDistrict="setDistrictNow"></single-select-district></div>
                    </b-form-group>
                    <b-form-row>
                        <b-form-group label="Ngày bắt đầu hợp tác" md="6">
                            <b-form-input v-model="companyProfile.cooperate_date" type="date" placeholder="Chọn ngày"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Ngày kết thúc hợp tác" md="6">
                            <b-form-input v-model="companyProfile.terminate_date" type="date" placeholder="Chọn ngày"></b-form-input>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-file
                                v-model="logo"
                                :state="Boolean(logo)"
                                placeholder="Chọn logo công ty"
                                drop-placeholder="Drop file here..."
                        ></b-form-file>
                    </b-form-row>
                </b-col>
            </b-row>
            <template slot="modal-footer">
                <b-button variant="primary" @click="addCompanyProfile()">
                    Thêm mới profile
                </b-button>
            </template>
        </b-modal>
        <notifications group='add-company'></notifications>
    </div>
</template>

<style lang="scss">
    .sperator-right {
        border-right: 1px solid rgba(0, 0, 0, 0.2)
    }
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  name: 'modal-add-profile',

  components: {
    SingleSelectProfileRegion,
    SingleSelectProvince,
    SingleSelectDistrict
  },

  props: [
  ],

  data: () => ({
    modalShow: false,
    logo: null,
    companyProfile: {
      status: 'active', // Trạng thái
      organization_type: null, // Loại tổ chức
      fullname: '', // Tên tổ chức
      short_name: '', // Tên viết tắt
      region: '', // Miền
      cooperate_date: '',
      terminate_date: '',
      legal_representative_name: '',
      legal_representative_tel: '',
      legal_representative_cmnd: '',
      current_address_province: '', // Chỗ hiện tại  Tỉnh/TP
      current_address_district: '', // Chỗ hiện tại  Quận/Huyện
      current_address_sub_district: '', // Chỗ hiện tại Xã/phường
      current_address_detail: '', // Chỗ hiện tại / Chi tiết
      contact_tel: '',
      contact_email: '',
      bank_name: '', // Tên ngân hàng ( bank_code)
      bank_account_number: '', // Số TK ngân hàng
      bank_account_name: '', // Tên chủ TK ngân hàng
      bank_brand: '', // Chi nhánh ngân hàng
      tax_iden_number: '', // Mã số thuế
      image_logo: '',
      cnb_confirmed: 0
    },
    selectRegions: [
      { value: 'Vận tải Đường bộ', text: 'Vận tải Đường bộ' },
      { value: 'Vận tải Đường sắt', text: 'Vận tải Đường sắt' },
      { value: 'Vận tải Hàng không', text: 'Vận tải Hàng không' },
      { value: 'Vận tải Đường thủy', text: 'Vận tải Đường thủy' },
      { value: 'Shop', text: 'Shop' }
    ],
    notify: {
      message: '',
      class: '',
      title: '',
      duration: ''
    },
    notify_add_company: {
      showDismissibleAlert: false,
      message: '',
      type: ''
    }
  }),

  watch: {
    modalShow: function (newValue, oldValue) {
      if (newValue === false) {
        this.companyProfile = {
          status: 'active', // Trạng thái
          organization_type: null, // Loại tổ chức
          fullname: '', // Tên công ty
          short_name: '', // Tên rút gọn
          region: '', // Miền
          cooperate_date: '',
          terminate_date: '',
          legal_representative_name: '',
          legal_representative_tel: '',
          legal_representative_cmnd: '',
          current_address_province: '', // Chỗ hiện tại  Tỉnh/TP
          current_address_district: '', // Chỗ hiện tại  Quận/Huyện
          current_address_sub_district: '', // Chỗ hiện tại Xã/phường
          current_address_detail: '', // Chỗ hiện tại / Chi tiết
          contact_tel: '',
          contact_email: '',
          bank_name: '', // Tên ngân hàng ( bank_code)
          bank_account_number: '', // Số TK ngân hàng
          bank_account_name: '', // Tên chủ TK ngân hàng
          bank_brand: '', // Chi nhánh ngân hàng
          tax_iden_number: '', // Mã số thuế
          image_logo: '',
          cnb_confirmed: 0
        }
      }
    }
  },

  methods: {
    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-company',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify,
        duration: this.notify.duration
      })
    },

    addCompanyProfile () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let dataSend = new FormData()
          dataSend.append('file', this.logo)
          dataSend.append('fullname', this.companyProfile.fullname)
          dataSend.append('short_name', this.companyProfile.short_name)
          dataSend.append('region', this.companyProfile.region)
          dataSend.append('organization_type', this.companyProfile.organization_type)
          dataSend.append('tax_iden_number', this.companyProfile.tax_iden_number)
          dataSend.append('bank_account_number', this.companyProfile.bank_account_number)
          dataSend.append('bank_name', this.companyProfile.bank_name)
          dataSend.append('contact_tel', this.companyProfile.contact_tel)
          dataSend.append('contact_email', this.companyProfile.contact_email)
          dataSend.append('current_address_detail', this.companyProfile.current_address_detail)
          dataSend.append('current_address_province', this.companyProfile.current_address_province)
          dataSend.append('current_address_district', this.companyProfile.current_address_district)
          dataSend.append('cooperate_date', this.companyProfile.cooperate_date)
          dataSend.append('terminate_date', this.companyProfile.terminate_date)
          dataSend.append('legal_representative_name', this.companyProfile.legal_representative_name)

          CompanyProfileService.addCompanyProfile(dataSend)
            .then((res) => {
              if (res.data.success) {
                commonHelper.showMessage(res.data.message, 'success')
                this.$bvModal.hide('modal-add-profile')
                this.$emit('getListCompanyProfile')
              } else {
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
            .catch((e) => {
              console.log(e)
            })
            .then(() => {
              this.$stopLoading()
            })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    handleSelectedRegion (option) {
      this.region = option ? option.id : ''
    },

    setProvinceNow (province) {
      if (!province) {
        this.companyProfile.current_address_province = null
        return
      }
      this.companyProfile.current_address_province = province.id
      // this.companyProfile.current_address_district = province.name
    },

    setDistrictNow (district) {
      if (!district) {
        this.companyProfile.current_address_district = null
        // this.companyProfile.district_register_name = null
        return
      }
      this.companyProfile.current_address_district = district.id
      // this.companyProfile.district_register_name = district.name
    }

  }
}
</script>
