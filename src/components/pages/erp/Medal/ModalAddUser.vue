<template>
    <div>
        <b-modal modal-class="modal-xl" id="modal-add-user" title="Thêm danh hiệu" :hide-footer="true" @hide="hideModal()" static>
            <div class="medal-body">
                <div class="border-bottom-custom mb-4">
                    <strong>Thông tin nhân sự</strong>
                </div>
                <div>
                    <b-alert :show="!!staffCodeAlert && !!staff_code" variant="warning">
                        <b>Lưu ý: </b> <span v-html="staffCodeAlert"></span>
                    </b-alert>
                    <b-form-row>
                        <b-form-group label="Mã MP" class="col-md-3">
                            <span slot="label">Mã MP<span class="text-danger">(*)</span></span>
                            <b-form-input type="number" v-model="staff_code" maxlength="8" :formatter="formatLength"  @input="checkStaffCode"></b-form-input>
                        </b-form-group>
                        <b-form-group :disabled="true" label="Họ và tên" class="col-md-3">
                            <b-form-input :value="user.fullname"></b-form-input>
                        </b-form-group>
                        <b-form-group :disabled="true" label="Username" class="col-md-3">
                            <b-form-input :value="user.username"></b-form-input>
                        </b-form-group>
                        <b-form-group :disabled="true" label="Miền" class="col-md-3">
                            <b-form-input :value="user.region"></b-form-input>
                        </b-form-group>
                        <b-form-group :disabled="true" label="Tỉnh" class="col-md-3">
                            <b-form-input :value="user.province"></b-form-input>
                        </b-form-group>
                        <b-form-group :disabled="true" label="Kho" class="col-md-3">
                            <b-form-input :value="user.station"></b-form-input>
                        </b-form-group>
                        <b-form-group :disabled="true" label="Vị trí" class="col-md-3">
                            <b-form-input :value="user.position"></b-form-input>
                        </b-form-group>
                    </b-form-row>
                </div>

                <div class="border-bottom-custom mb-4 mt-3">
                    <strong>Danh hiệu</strong>
                </div>
                <div>
                    <b-form-row>
                        <b-form-group label="Danh hiệu" class="col-md-3">
                            <span slot="label">Danh hiệu<span class="text-danger">(*)</span></span>
                          <single-select-medal :medal-id="medalId" @handleSelected="handleSelectedMedal" :when-create="true"></single-select-medal>
                        </b-form-group>
                        <b-form-group label="Ngày bắt đầu danh hiệu" class="col-md-3">
                            <span slot="label">Ngày bắt đầu danh hiệu<span class="text-danger">(*)</span></span>
                            <datepicker
                                    v-model="from"
                                    format="dd-MM-yyyy"
                                    :bootstrapStyling="true"
                                    :monday-first="true"
                                    :full-month-name="true"
                                    placeholder="Ngày bắt đầu danh hiệu"
                                    :required="true"
                                    :calendar-button="true"
                                    calendar-button-icon="ion ion-md-calendar"
                                    :clear-button="true"
                            />
                        </b-form-group>
                        <b-form-group label="Ngày kết thúc danh hiệu" class="col-md-3">
                            <span slot="label">Ngày kết thúc danh hiệu<span class="text-danger">(*)</span></span>
                            <datepicker
                                    v-model="to"
                                    format="dd-MM-yyyy"
                                    :bootstrapStyling="true"
                                    :monday-first="true"
                                    :full-month-name="true"
                                    placeholder="Ngày kết thúc danh hiệu"
                                    :required="true"
                                    :calendar-button="true"
                                    calendar-button-icon="ion ion-md-calendar"
                                    :clear-button="true"
                            />
                        </b-form-group>
                    </b-form-row>
                </div>
            </div>
            <div class="mt-2 text-center">
                <b-btn variant="success" @click="createMedal()">Tạo danh hiệu</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectMedal from 'components/elements/common/SingleSelectMedal'

// service
import medalService from 'domain/services/medal-service'

export default {
  name: 'modal-add-user',

  components: {
    Datepicker,
    SingleSelectMedal
  },

  props: [],

  data: () => ({
    staff_code: null,
    staffCodeAlert: null,
    user: {},
    from: null,
    to: null,
    medalId: null
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    handleSelectedMedal (option) {
      this.medalId = option ? option.id : null
    },
    hideModal () {
      this.staff_code = null
      this.from = null
      this.to = null
      this.medalId = null
      this.resetEmployee()
    },
    formatLength (e) {
      return String(e).substring(0, 8)
    },
    checkStaffCode () {
      if (!this.staff_code) {
        this.resetEmployee()
        return
      }
      if (this.staff_code.length < 8) {
        this.resetEmployee()
        this.staffCodeAlert = 'Mã nhân viên phải bao gồm 8 ký tự số VD: 00345678'
        return
      }
      if (this.staff_code.length === 8) {
        this.staffCodeAlert = null
        this.getProfileInfo(this.staff_code)
      }
    },

    getProfileInfo (staffCode) {
      let param = {
        staff_code: staffCode
      }

      medalService.getProfileInfo(param)
        .then(response => {
          if (response.data.success) {
            this.user = response.data.data
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.allow_edit_level = false
        })
    },

    resetEmployee () {
      this.user = {}
    },
    resetObj (ref, exceptField = null) {
      commonHelper.resetData(ref, exceptField)
    },
    createMedal () {
      let data = {
        master_profile_id: this.user.master_profile_id,
        medal_id: this.medalId,
        from: this.from,
        to: this.to
      }

      medalService.createProfileMedal(data)
        .then(response => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.$bvModal.hide('modal-add-user')
            this.$emit('getMedals')
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.allow_edit_level = false
        })
    }
  }
}
</script>

<style scoped>
    .border-bottom-custom {
        border: none;
        border-bottom: 1px solid #cccccc;
        font-size: 16px;
    }
</style>
