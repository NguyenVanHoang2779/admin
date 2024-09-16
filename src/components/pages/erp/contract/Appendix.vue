<template>
    <div class="appendix">
        <h4>
            Phụ lục <span>{{ appendix.appendix_number || '' }}</span>
            <span :class="appendix.status === 'disabled' && 'text-danger'"> - {{ appendixStatus[appendix.status] }}</span>
            <i class="ion ion-md-information-circle cursor-pointer" @click="showSlideModal()"></i>
            <button class="btn-outline-ghtk btn btn-sm" @click="gotoContract" v-if="showBackToContract">
              <i class="ion ion-ios-arrow-dropup-circle"></i> Xem hợp đồng
            </button>
            <span class="float-right">
              <b-btn variant="outline-ghtk" size="sm"  @click="genAppendixNumber" v-if="!appendix.appendix_number">Tạo số phụ lục</b-btn>
              <b-btn :variant="!editMode ? 'outline-ghtk' : 'outline-danger'" size="sm" @click="editMode = !editMode" v-if="canEditAppendix">
                <i :class="!editMode ? 'fas fa-pencil-alt' : 'fas fa-times'"></i>
                {{ !editMode ? 'Sửa phụ lục' : 'Hủy' }}
              </b-btn>
            </span>
        </h4>
        <div class="card" v-if="!hasNoAppendix" v-loading="loading">
                <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group label-size="lg">
                          <span slot="label">Nội dung cập nhật phụ lục <span class="text-danger">*</span></span>
                          <textarea
                            class="form-control"
                            v-model.trim="appendix.content"
                            name="content"
                            :disabled="!editMode"
                            rows="1"
                          ></textarea>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group label-size="lg">
                          <span slot="label">Ngày bắt đầu hiệu lực <span class="text-danger">*</span></span>
                          <datepicker
                            :disabled="!editMode"
                            v-model="appendix.effect_date"
                            format="dd-MM-yyyy"
                            placeholder="dd-mm-yyyy"
                            :bootstrapStyling="true"
                            :monday-first="true"
                            :full-month-name="true"
                            :calendar-button="true"
                            calendar-button-icon="ion ion-md-calendar"
                            :clear-button="true"
                            :use-utc="true"
                            :disabled-dates="effectDateDisable"
                        />
                        </b-form-group>
                      </div>
                    </div>
                    <h4 class="card-title" >Các khoản lương</h4>
                    <table class="table table-sm align-middle">
                        <thead class="thead-light">
                          <tr>
                            <th>Lương thử việc <span class="text-danger" v-show="requireTrialSalary">*</span></th>
                            <th>Lương chính thức <span class="text-danger">*</span></th>
                            <th>Lương OT thử việc</th>
                            <th>Lương OT chính thức</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                class="form-control"
                                :class="appendix.trial_salary === '' && contract.type_contract === 'probation' && 'is-invalid'"
                                v-model="appendix.trial_salary"
                                placeholder="Nhập lương thử việc"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'trial_salary')"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control"
                                :class="appendix.salary === '' && ['definite', 'definite_24', 'indefinite'].includes(contract.type_contract) && 'is-invalid'"
                                v-model="appendix.salary"
                                placeholder="Nhập lương chính thức"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'salary')"
                              />
                            </td>
                            <td>
                              <input
                                class="form-control"
                                v-model="appendix.trial_ot_salary"
                                placeholder="Lương OT thử việc"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'trial_ot_salary')"
                              />
                            </td>
                            <td>
                              <input
                                v-model="appendix.ot_salary"
                                class="form-control"
                                placeholder="Lương OT chính thức"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'ot_salary')"
                              />
                            </td>
                          </tr>
                        </tbody>
                    </table>

                    <h4 class="card-title">Các khoản hỗ trợ</h4>
                    <table class="table table-sm">
                        <thead class="thead-light">
                          <tr>
                            <th>Tên phụ cấp</th>
                            <th>Số tiền</th>
                            <th>Chịu thuế TNCN </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="align-middle">Phụ cấp trách nhiệm</td>
                            <td>
                              <input
                                class="form-control"
                                v-model="appendix.resp_allowance"
                                type="text"
                                placeholder="Phụ cấp trách nhiệm"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'resp_allowance')"
                              />
                            </td>
                            <td class="align-middle">
                              <b-form-checkbox
                                checked='1'
                                value="1"
                                unchecked-value="0"
                                disabled
                              >
                                <b>Chịu thuế</b>
                              </b-form-checkbox>
                            </td>
                          </tr>
                          <tr>
                            <td class="align-middle">Phụ cấp xăng xe, ăn đêm</td>
                            <td>
                              <input
                                class="form-control"
                                v-model="appendix.trans_allowance"
                                type="text"
                                placeholder="Phụ cấp xăng xe, ăn đêm"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'trans_allowance')"
                              />
                            </td>
                            <td class="align-middle">
                              <b-form-checkbox
                                disabled
                                checked='1'
                                value="1"
                                unchecked-value="0"
                              >
                                <b>Chịu thuế</b>
                              </b-form-checkbox>
                            </td>
                          </tr>
                          <tr>
                            <td class="align-middle">Phụ cấp ăn trưa</td>
                            <td>
                              <input v-model="appendix.meal_allowance"
                                class="form-control"
                                placeholder="Phụ cấp ăn trưa"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'meal_allowance')"
                              />
                            </td>
                            <td class="align-middle">
                              <b-form-checkbox
                                value="1"
                                unchecked-value="0"
                                disabled
                              >
                                Chịu thuế
                              </b-form-checkbox>
                            </td>
                          </tr>
                          <tr>
                            <td class="align-middle">Phụ cấp điện thoại</td>
                            <td>
                              <input
                                class="form-control"
                                v-model="appendix.mobile_allowance"
                                placeholder="Phụ cấp điện thoại"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'mobile_allowance')"
                              />
                            </td>
                            <td class="align-middle">
                              <b-form-checkbox
                                disabled
                                checked='1'
                                value="1"
                                unchecked-value="0"
                              >
                                Chịu thuế
                              </b-form-checkbox>
                            </td>
                          </tr>
                          <tr>
                            <td class="align-middle">Phụ cấp khoản công tác</td>
                            <td>
                              <input
                                class="form-control"
                                v-model="appendix.biztrip_allowance"
                                placeholder="Phụ cấp khoản công tác"
                                :disabled="!canUpdateSalary"
                                @change="onUpdateAppendix"
                                @input="inputMoney(appendix, 'biztrip_allowance')"
                              />
                            </td>
                            <td class="align-middle">
                              <b-form-checkbox
                                disabled
                                checked='1'
                                value="1"
                                unchecked-value="0"
                              >
                                Chịu thuế
                              </b-form-checkbox>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                    <div class="mt-4 text-center">
                      <button v-if="editMode" class="btn btn-ghtk w-25" @click="updateAppendix">
                        <i class="fas fa-save"></i> Lưu lại
                      </button>
                    </div>
                </div>
        </div>
        <div class="card col-md-12 mb-4" v-else>
          <div class="card-body">Không tìm thấy phụ lục nào đang hiệu lực gắn với hợp đồng này !</div>
        </div>

        <!-- Modal template -->
        <b-modal ref="modalAppendixInfo" modal-class="modal-top" hide-footer static>
          <div slot="modal-title">
            <span class="font-weight-light">Thông tin</span> PHỤ LỤC HỢP ĐỒNG<br>
            <small class="text-muted">Thông tin bổ sung đối chiếu</small>
          </div>
          <div class="row" >
            <div class="col-3 col-xl-5 text-muted mb-3">Người lập:   </div>
            <div class="col-9 col-xl-7 mb-3" >
                <span class="text-big" v-if="user_created.fullnname">{{ user_created.fullnname }} ({{ user_created.username }})</span>
            </div>
            <div class="col-3 col-xl-5 text-muted mb-3">Thời gian lập: </div>
            <div class="col-9 col-xl-7 mb-3" v-if="user_created.created">
              <span class="text-big">{{ user_created.created }}</span>
            </div>
          </div>
        </b-modal>
    </div>
</template>

<script>
import contractService from 'domain/services/contract-service'

import Datepicker from 'vuejs-datepicker'

// entities
import Contract from 'domain/entities/Contract'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'Appendix',

  components: {
    Datepicker
  },

  props: {
    contract: {
      type: Object,
      default: _ => ({})
    },
    appendix_id: {},
    canEdit: {
      type: Boolean,
      default: false
    },
    dataAppendix: {},
    permission: {}
  },

  data: () => ({
    editMode: false,
    appendix: {
      id: null,
      appendix_number: null,
      trial_salary: null,
      salary: null,
      trial_ot_salary: null,
      ot_salary: null,
      resp_allowance: null,
      trans_allowance: null,
      meal_allowance: null,
      mobile_allowance: null,
      biztrip_allowance: null,
      content: null,
      effect_date: null,
      status: null
    },
    user_created: {
      fullnname: '',
      username: '',
      created: null
    },
    contractData: {
      contract_number: null,
      id: null
    },
    appendixStatus: Contract.status,
    hasNoAppendix: false,
    showBackToContract: false,
    loading: null,
    effectDateDisable: {
      to: null,
      from: null
    }
  }),

  watch: {
    dataAppendix: {
      handler: function (newValue) {
        this.initDataAppendix()
      },
      deep: true
    }
  },

  created () {
    if (!helper.isEmpty(this.dataAppendix)) this.initDataAppendix()
    else if (this.contract && this.contract.id) {
      this.showContractAppendix()
    } else if (this.appendix_id || this.$route.params.id) {
      this.showDetailAppendix()
    }
  },

  computed: {
    canEditAppendix () {
      return this.appendix.status === 'draft' && this.canEdit
    },

    canUpdateSalary () {
      return this.editMode && this.permission && this.permission.update_salary
    },

    requireTrialSalary () {
      return this.contract.type_contract === 'probation'
    }
  },

  methods: {
    initDataAppendix () {
      if (!helper.isEmpty(this.dataAppendix)) {
        this.appendix.salary = this.dataAppendix.salary || null
        this.appendix.trial_salary = this.dataAppendix.trial_salary || null
        this.appendix.ot_salary = this.dataAppendix.ot_salary || null
        this.appendix.trial_ot_salary = this.dataAppendix.trial_ot_salary || null
        this.appendix.meal_allowance = this.dataAppendix.meal_allowance || null
        this.appendix.resp_allowance = this.dataAppendix.resp_allowance || null
        this.appendix.trans_allowance = this.dataAppendix.trans_allowance || null
        this.appendix.mobile_allowance = this.dataAppendix.mobile_allowance || null
        this.appendix.biztrip_allowance = this.dataAppendix.biztrip_allowance || null
        this.appendix.content = this.dataAppendix.content || null
        this.appendix.effect_date = this.dataAppendix.effect_date || null
        this.appendix.appendix_number = this.dataAppendix.appendix_number || null

        // format tiền lương để hiển thị
        this.inputMoney(
          this.appendix,
          ['salary', 'trial_salary', 'ot_salary', 'trial_ot_salary', 'meal_allowance', 'resp_allowance', 'trans_allowance', 'mobile_allowance', 'biztrip_allowance']
        )
      }
    },

    showDetailAppendix () {
      let data = {
        appendix_id: this.appendix_id || this.$route.params.id
      }
      this.showBackToContract = true
      this.loading = true
      contractService.getDetailAppendix(data)
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data && res.data.data.EmpContractSalary) {
              if (res.data.effect_date_allow) {
                if (res.data.effect_date_allow.from) {
                  this.effectDateDisable.to = new Date(res.data.effect_date_allow.from)
                }
                if (res.data.effect_date_allow.to) {
                  this.effectDateDisable.from = new Date(res.data.effect_date_allow.to)
                }
              }
              let data = res.data.data
              this.contractData = data.EmpContract
              // Salary
              this.appendix.id = data.EmpContractSalary.id || null
              this.appendix.salary = data.EmpContractSalary.salary || null
              this.appendix.trial_salary = data.EmpContractSalary.trial_salary || null
              this.appendix.trial_ot_salary = data.EmpContractSalary.trial_ot_salary || null
              this.appendix.ot_salary = data.EmpContractSalary.ot_salary || null
              // Allowance
              this.appendix.resp_allowance = data.EmpContractSalary.resp_allowance || null
              this.appendix.trans_allowance = data.EmpContractSalary.trans_allowance || null
              this.appendix.meal_allowance = data.EmpContractSalary.meal_allowance || null
              this.appendix.mobile_allowance = data.EmpContractSalary.mobile_allowance || null
              this.appendix.biztrip_allowance = data.EmpContractSalary.biztrip_allowance || null
              // more info
              this.appendix.status = data.EmpContractSalary.status
              this.appendix.content = data.EmpContractSalary.content || null
              this.appendix.effect_date = data.EmpContractSalary.effect_date || null
              this.appendix.appendix_number = data.EmpContractSalary.appendix_number || null
              // Create info
              this.user_created.fullnname = data.UserCreated.fullname
              this.user_created.username = data.UserCreated.username
              this.user_created.created = data.EmpContractSalary.created

              // format tiền lương để hiển thị
              this.inputMoney(
                this.appendix,
                ['salary', 'trial_salary', 'ot_salary', 'trial_ot_salary', 'meal_allowance', 'resp_allowance', 'trans_allowance', 'mobile_allowance', 'biztrip_allowance']
              )
            } else {
              this.hasNoAppendix = true
            }
          } else {
            helper.showMessage(res.data.mesage || 'Không lấy được thông tin phụ lục hợp đồng, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Không lấy được thông tin phụ lục hợp đồng, vui lòng thử lại sau !', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    showContractAppendix () {
      this.loading = true
      contractService.getAppendixOfContract({ contract_id: this.contract.id })
        .then(res => {
          if (res.data.success) {
            if (res.data.data && res.data.data.EmpContractSalary) {
              if (res.data.effect_date_allow) {
                if (res.data.effect_date_allow.from) {
                  this.effectDateDisable.to = new Date(res.data.effect_date_allow.from)
                }
                if (res.data.effect_date_allow.to) {
                  this.effectDateDisable.from = new Date(res.data.effect_date_allow.to)
                }
              }
              let data = res.data.data
              this.contractData.contract_number = data.EmpContract.contract_number
              this.contractData.id = data.EmpContractSalary.contract_id
              // Salary
              this.appendix.id = data.EmpContractSalary.id || null
              this.appendix.salary = data.EmpContractSalary.salary || null
              this.appendix.trial_salary = data.EmpContractSalary.trial_salary || null
              this.appendix.trial_ot_salary = data.EmpContractSalary.trial_ot_salary || null
              this.appendix.ot_salary = data.EmpContractSalary.ot_salary || null
              // Allowance
              this.appendix.resp_allowance = data.EmpContractSalary.resp_allowance || null
              this.appendix.trans_allowance = data.EmpContractSalary.trans_allowance || null
              this.appendix.meal_allowance = data.EmpContractSalary.meal_allowance || null
              this.appendix.mobile_allowance = data.EmpContractSalary.mobile_allowance || null
              this.appendix.biztrip_allowance = data.EmpContractSalary.biztrip_allowance || null
              // more info
              this.appendix.status = data.EmpContractSalary.status
              this.appendix.content = data.EmpContractSalary.content || null
              this.appendix.effect_date = data.EmpContractSalary.effect_date || null
              this.appendix.appendix_number = data.EmpContractSalary.appendix_number || null
              // Create info
              this.user_created.fullnname = data.UserCreated.fullname
              this.user_created.username = data.UserCreated.username
              this.user_created.created = data.EmpContractSalary.created

              // format tiền lương để hiển thị
              this.inputMoney(
                this.appendix,
                ['salary', 'trial_salary', 'ot_salary', 'trial_ot_salary', 'meal_allowance', 'resp_allowance', 'trans_allowance', 'mobile_allowance', 'biztrip_allowance']
              )
            } else {
              this.hasNoAppendix = true
            }
          } else {
            helper.showMessage(res.data.message)
          }
        })
        .catch(e => {
          helper.showMessage('Không lấy được thông tin phụ lục hợp đồng, vui lòng thử lại sau !', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    showSlideModal () {
      this.$refs.modalAppendixInfo.show()
    },

    updateAppendix () {
      let data = {
        ...this.appendix
      }
      if (!data.content) {
        alert('Vui lòng nhập lý do cập nhật phụ lục !')
        return
      }
      if (!data.effect_date) {
        alert('Vui lòng nhập ngày bắt đầu hiệu lực !')
        return
      }
      // format lại thông tin tiền để update
      this.updateMoney(
        data,
        ['salary', 'trial_salary', 'ot_salary', 'trial_ot_salary', 'meal_allowance', 'resp_allowance', 'trans_allowance', 'mobile_allowance', 'biztrip_allowance']
      )
      // check required field
      if (!data.trial_salary && this.contract.type_contract === 'probation') {
        this.appendix.trial_salary = ''
        alert('Vui lòng nhập mức lương thử việc')
        return
      }
      if (!data.salary && ['definite', 'definite_24', 'indefinite'].includes(this.contract.type_contract)) {
        this.appendix.salary = ''
        alert('Vui lòng nhập mức lương chính thức')
        return
      }
      data.contract_id = this.contract.id || this.contractData.id
      contractService.updateAppendix(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật phụ lục thành công !', 'success')
            this.editMode = false
            this.$emit('updateAppendixOk', res.data.data)
          } else {
            helper.showMessage(res.data.message || 'Đã có lỗi xảy ra, vui lòng liên hệ đội kĩ thuật để được hỗ trợ !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra không thêm được hợp đồng, liên hệ với IT để được hỗ trợ', 'warning')
        })
        .finally(_ => {
          this.loading = false
        })
    },

    onUpdateAppendix () {
      this.$emit('update', this.appendix)
    },

    gotoContract () {
      this.$router.push('/contract/detail/' + (this.contract.id || this.contractData.id || this.appendix.contract_id || this.contract_id_num))
    },

    inputMoney (ref, field) {
      if (typeof field === 'string') return helper.inputMoney(ref, field)
      if (Array.isArray(field) && field.length) {
        for (const fie of field) {
          helper.inputMoney(ref, fie)
        }
      }
    },

    updateMoney (ref, field) {
      try {
        if (typeof field === 'string') {
          if (!ref[field] || typeof ref[field] !== 'string') return
          ref[field] = ref[field].replace(/\D/g, '')
        }
        if (Array.isArray(field) && field.length) {
          for (const fie of field) {
            if (!ref[fie] || typeof ref[fie] !== 'string') continue
            ref[fie] = ref[fie].replace(/\D/g, '')
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    genAppendixNumber (data) {
      let dataAppendix = {
        contract_id: this.contract.id || this.contractData.id,
        appendix_id: this.appendix.id
      }

      this.$startLoading()
      contractService.genAppendixNumber(dataAppendix)
        .then(res => {
          if (res.data.success) {
            this.appendix.appendix_number = res.data.data.appendix_number || 1
            helper.showMessage(res.data.message || 'Tạo số phụ lục thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi tạo số phụ lục')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi tạo số phụ lục !')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    }
  }
}
</script>
