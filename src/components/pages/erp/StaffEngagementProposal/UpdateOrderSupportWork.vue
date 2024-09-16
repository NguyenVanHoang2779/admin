<template>
  <div>
    <div class="small-scrollbar">
    <div class="order-type">
      <b-form-row>
        <b-form-group label="Loại khai báo" class="col-md-3">
          <span slot="label">Loại khai báo <span class="text-danger">*</span></span>
          <select-order-group
            :group-options="orderTypeOption"
            @input="selectGroupOrder"
            :group="supply_bhxh"
            :disabled="!!order.id"
            :category-group="true"
            :multiple="false"
          ></select-order-group>
        </b-form-group>
        <b-form-group label="Phương án" class="col-md-3">
          <span slot="label">Phương án <span class="text-danger">*</span></span>
          <select-order-type
            :type-options="orderTypeOption"
            :has-group="false"
            :group-alias="supply_bhxh"
            @input="selectTypeOrder"
            :type="order.order_type_id"
            :disabled="!!order.id"
          ></select-order-type>
        </b-form-group>
        <b-form-group label="Hạn duyệt" class="col-md-3">
          <Datepicker
            :language="language.vi"
            v-model="order.deadline"
            format='dd/MM/yyyy'
            placeholder="dd/mm/yyyy"
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
        </b-form-group>
        <b-form-group label="Trạng thái xử lý" class="col-md-3">
          <select-order-status
            :status="order.status"
            @select="op => { order.status = op ? op.value : null }"
            :disabled="true"
            placeholder="Trạng thái"
          ></select-order-status>
        </b-form-group>
      </b-form-row>
    </div>

    <div class="employee-info">
      <div class="header mb-3 mt-1 font-weight-bold">
        Thông tin người lao động
      </div>
      <div class="position-relative" v-loading="loadingProfileInfo">
        <b-alert :show="!!staffCodeAlert && !isRelateOrder" variant="warning">
          <b>Lưu ý: </b> <span v-html="staffCodeAlert"></span>
        </b-alert>
        <b-form-row>
          <b-form-group class="col-md-3" label="Mã nhân viên" :disabled="!!(profileId || order.id)">
            <span slot="label">Mã nhân viên <span class="text-danger">*</span></span>
            <input type="number" class="form-control" :class="{ 'is-invalid': employee.masterProfile.staff_code === '' }"
                   v-model="employee.masterProfile.staff_code" @input="checkStaffCode" placeholder="Mã nhân viên" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Họ và tên" :disabled="employee.masterProfile.fullname ? true : false">
            <b-input v-model="employee.masterProfile.fullname" placeholder="Họ và tên"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Trạng thái BHXH hiện tại" :disabled="true">
            <b-input v-model="filter.insurance_desc" placeholder="Trạng thái BHXH hiện tại"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Trạng thái MP" :disabled="employee.masterProfile.status ? true : false">
            <b-input v-model="employee.masterProfile.status" placeholder="trạng thái master profile"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Vị trí" :disabled="employee.empProfile.position_name ? true : false">
            <input class="form-control" v-model="employee.empProfile.position_name" placeholder="Vị trí" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Nơi làm việc (kho hiện tại)" :disabled="employee.user.station_name ? true : false">
            <b-input v-model="employee.user.station_name" placeholder="Nơi làm việc"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Chỉ có năm sinh *" :disabled="order.additional_info.birthday_status ? true : false">
            <span slot="label">Chỉ có năm sinh <span class="text-danger">*</span></span>
            <b-select
              :options="birthdayStatusOptions"
              v-model="order.additional_info.birthday_status"
              :state="order.additional_info.birthday_status === '' ? false : null"
            ></b-select>
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày sinh" :disabled="employee.masterProfile.birthday ? true : false">
            <b-input v-model="employee.masterProfile.birthday" placeholder="Ngày sinh"></b-input>
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <b-alert :show="!!isRelateOrder" variant="warning">
      <b>Vui lòng nhập đủ thông tin cho đề xuất liên quan này</b>
    </b-alert>

    <!-- BHXH  -->
    <div>
      <div class="insurance">
        <div class="header mb-3 mt-2 font-weight-bold">
          BHXH, BHYT
        </div>
        <div>
          <b-form-row>
            <b-form-group :disabled="true" label="Mã số BHXH" class="col-md-4">
              <b-input v-model="employee.masterProfile.insurance_register" placeholder="Mã số BHXH"></b-input>
            </b-form-group>
            <b-form-group :disabled="true" label="Mã số BHYT" class="col-md-4">
              <b-input v-model="employee.masterProfile.health_ins_number" placeholder="Mã số BHYT"></b-input>
            </b-form-group>
          </b-form-row>
        </div>
      </div>
    </div>
    </div>
    <!-- Ghi chú -->
    <b-form-row>
      <b-form-group class="col-md-12" label="Ghi chú" v-show="showNote">
        <textarea name="note" id="note" rows="2" class="form-control" v-model.trim="order.note"></textarea>
      </b-form-group>
    </b-form-row>

    <!-- File đính kèm -->
    <fieldset class="border rounded form-group">
      <legend class="d-inline col-form-label label-file">Thêm chứng từ/File (Nếu có)</legend>
      <b-form-row v-for="(file, idxFile) in this.order.files" :key="idxFile" class="border-bottom align-items-center">
        <b-form-group class="col-md-4 mb-0">
          <b-select :disabled="showAction" :options="fileTypeOptions[order.order_category]" v-model="file.type" placeholde="Chọn loại chứng từ/file"></b-select>
        </b-form-group>
        <b-form-group class="col-md-7 mb-0">
          <file-view-upload
            class="d-inline-block"
            :input-id="'file_insurance_' + idxFile"
            :input-style="{ width: '4rem' }"
            :allow-delete="false"
            :hideUploadButton="true"
            height="5rem"
            :files="file.file_exist || []"
            :file-add="file.file_add || []"
            :edit="!showAction"
          ></file-view-upload>
        </b-form-group>
        <b-form-group class="col-md-1 mb-0 text-right" v-if="!showAction">
          <b-btn variant="outline-danger" title="Xóa chứng từ" v-show="!file.file_exist || !file.file_exist.length" size="sm" @click="deleteLicense(idxFile)"><i class="fas fa-times"></i></b-btn>
        </b-form-group>
      </b-form-row>
      <div class="text-left" v-if="!showAction">
        <b-btn variant="outline-ghtk" size="sm" @click="addLicenses()" :disabled="!canAddLicenses()"><i class="fas fa-plus"></i> Thêm chứng từ/File</b-btn>
      </div>
    </fieldset>

    <div class="modal-footer"></div>
    <div v-if="edit">
      <div class="text-center justify-content-center d-flex mt-3" v-if="showAction || idOrder != null">
        <b-btn variant="ghtk" class="w-25" @click="updateStatusOrder">Xác nhận đã bàn giao</b-btn>
      </div>
      <div class="text-center justify-content-center d-flex mt-3" v-else>
        <b-btn variant="ghtk" class="w-25" @click="updateOrder"> Tạo đề xuất </b-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #modal-order-stop-work {
    .modal-header {
      justify-content: center;
    }

    footer {
      display: none !important;
    }
  }
  .header {
    border-bottom: 3px solid #ddd;
    font-size: 1rem;
  }
  .label-file {
    width: fit-content;
  }
</style>

<script>
// build-component
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

// custom component
import SelectOrderType from '../HrOrder/SelectOrderType'
import SelectOrderGroup from '../HrOrder/SelectOrderGroup'
import SelectOrderStatus from '../HrOrder/SelectOrderStatus'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import ModalDetailFile from 'components/pages/erp/contract/ModalDetailFile'

// service
import hrOrderService from 'domain/services/hr-order-service'

// entities
import Contract from 'domain/entities/Contract'
import Order from 'domain/entities/Order'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
  name: 'update-order-stop-work',

  props: {
    idOrder: {
      default: null
    },
    profileId: {
      default: null
    },
    modalStyle: {
      default: false,
      type: Boolean
    },
    orderType: {
      default: null
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  components: {
    SelectOrderType,
    SelectOrderStatus,
    SelectOrderGroup,
    Datepicker,
    Multiselect,
    FileViewUpload,
    ModalDetailFile
  },

  created () {
    this.getType()
    if (this.idOrder) {
      this.showAction = true
      this.detailOrder(this.idOrder)
    } else if (this.profileId) {
      this.getProfileInfo(this.profileId)
      this.employee.masterProfile.id = this.profileId
      this.employee.masterProfile.staff_code = this.profileId
    }
  },

  data: _ => ({
    loadingProfileInfo: false,
    loadingOrderInfo: false,

    // check đủ điều kiện để tạo đề xuất
    eligibleCreate: true,
    // Check là đề xuất này hợp lệ khi tạo ra, không thừa hay conflic với data đã có
    legalCreate: true,

    // kiểm tra là đề xuất liên quan
    isRelateOrder: null,
    duty: {
      insurance: null
    },
    censor: null,
    rejectReason: null,
    //
    language: {
      vi: vi
    },
    contractType: Contract.typeOptions,
    birthdayStatusOptions: Order.birthdayStatusOptions,
    fileTypeOptions: Order.fileTypeOptions,
    orderTypeOption: [],
    modifyConfig: {
      7: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Mức đóng BHXH cũ' },
        newInput: { class: 'col-md-4', disable: false, label: 'Mức đóng BHXH mới' },
        inputFile: false,
        showTimeChange: true
      },
      8: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Nơi làm cũ' },
        newInput: { class: 'col-md-4', disable: false, label: 'Nơi làm mới' },
        inputFile: false,
        showTimeChange: true
      },
      9: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Vị trí cũ' },
        newInput: { class: 'col-md-4', disable: false, label: 'Vị trí mới' },
        inputFile: false,
        showTimeChange: true
      },
      13: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Họ và tên sai' },
        newInput: { class: 'col-md-4', disable: false, label: 'Họ và tên đúng' },
        inputFile: true,
        showTimeChange: true
      },
      12: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Ngày sinh sai' },
        newInput: { class: 'col-md-4', disable: false, label: 'Ngày sinh đúng' },
        inputFile: true,
        showTimeChange: true
      },
      32: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Tỉ lệ cũ (%)' },
        newInput: { class: 'col-md-4', disable: false, label: 'Tỉ lệ mới (%)' },
        showTimeChange: true,
        inputFile: true
      }
    },
    order: {
      id: null,
      profile_id: null,
      order_category: null,
      order_group: null,
      order_type_id: null,
      order_type_alias: null,
      group_name: null,
      start_date: null,
      new_value: null,
      old_value: null,
      status: null,
      deadline: null,
      note: null,
      additional_info: {
        insurance_register: null,
        pay_rate: null,
        resp_allowance: null,
        birthday_status: null
      },
      files: [
        {
          type: null,
          file_exist: [],
          file_add: []
        }
      ]
    },
    employee: {
      masterProfile: {
        id: null,
        staff_code: null,
        region: null,
        fullname: null,
        status: null,
        birthday: null,
        insurance_register: null,
        health_ins_number: null
      },
      empProfile: {
        position_job: null,
        position_name: null
      },
      user: {
        id: null,
        username: null,
        station_id: null,
        status_id: null,
        station_name: null,
        work_type: null
      },
      e_contract: {
        file: null,
        savis_code: null
      },
      insurance: {
        id: null,
        insurance_id: null,
        status: null,
        from: null,
        to: null,
        insurance_desc: null,
        company_cost: null,
        worker_cost: null
      }
    },
    showEmployeeInfo: {
      staff_code: {
        category: ['insurance', 'working_process']
        // type: null,
        // group: null
      },
      region: null,
      fullname: {
        category: ['insurance', 'contract', 'working_process']
      },
      mp_status: {
        category: ['insurance', 'working_process']
      },
      birthday: {
        category: ['insurance']
      },
      birthday_status: {
        category: ['insurance']
      },
      insurance_register: null,
      health_ins_number: null,
      position_name: {
        category: ['insurance', 'working_process']
      },
      username: null,
      station_id: null,
      status_id: null,
      station_name: {
        category: ['insurance', 'working_process']
      },
      work_type: {
        category: ['working_process']
      },
      //
      insurance_id: null,
      insurance_status: null,
      insurance_from: null,
      insurancve_to: null,
      insurance_desc: {
        category: ['insurance']
      },
      company_cost: null,
      worker_cost: null
    },
    showNoteInput: {
      category: ['working_process'],
      group: ['modify', 'regime', 'supply_bhxh', 'supply_bhyt'],
      type: []
    },
    staffCodeAlert: null,
    //
    relateInfo: [],
    supply_bhxh: 'supply_bhxh',
    filter: {
      insurance_desc: null,
      health_ins_number: null,
      insurance_register: null
    },
    showAction: false
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    showNote () {
      return this.showNoteInput.category.includes(this.order.order_category) ||
            this.showNoteInput.group.includes(this.order.order_group) || this.showNoteInput.type.includes(this.order.order_type_alias)
    }
  },

  watch: {
    'order.order_type_id': function (newVal, oldVal) {
      if (this.order.id) {
        this.order.order_type_id = 18
      }
      if (+newVal === 1 || +newVal === 33) this.order.additional_info.pay_rate = 32
      else if (+newVal === 2) this.order.additional_info.pay_rate = 0.5
      else this.order.additional_info.pay_rate = null
    },

    'order.order_category': function (newVal, oldVal) {
      this.staffCodeAlert = null
      if (!this.idOrder) this.initAndFormatDataFromEmployee()
    },

    orderType: {
      immediate: true,
      handler (newVal, oldVal) {
        this.staffCodeAlert = null
        this.employee.masterProfile.staff_code = null
        this.checkStaffCode()
        if (newVal) {
          this.initOrderType(newVal)
        } else this.selectGroupOrder(null)
      }
    },

    idOrder (newval, oldVal) {
      this.staffCodeAlert = null
      this.isRelateOrder = false
      if (newval) this.detailOrder(newval)
      else this.resetAllData()
    },
    profileId (newval, oldVal) {
      this.staffCodeAlert = null
      if (newval && !this.idOrder) {
        this.getProfileInfo(newval)
        this.employee.masterProfile.id = newval
        this.employee.masterProfile.staff_code = newval
      } else this.resetAllData()
    }
  },

  methods: {
    suggestData () {
      if (this.idOrder || !this.order.order_type_id || !this.order.order_type_alias || !this.order.profile_id || !this.employee.user.id) {
        return
      }
      let params = {
        orderTypeId: this.order.order_type_id,
        orderTypeAlias: this.order.order_type_alias,
        profileId: this.order.profile_id,
        userId: this.employee.user.id,
        orderCategory: this.order.orderCategory
      }

      hrOrderService.suggestData(params)
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              if (!res.data.data.saveField || helper.isEmpty(res.data.data.suggestData)) return
              let saveField = res.data.data.saveField
              let suggestData = res.data.data.suggestData
              for (const field in suggestData) {
                this.order[saveField][field] = suggestData[field]
              }
              if (helper.isEmpty(suggestData)) {
                this.resetObj(this.order[saveField])
              }
            }
          } else {
            if (res.data.data && res.data.data.prevent) {
              this.staffCodeAlert = res.data.message
              this.legalCreate = false
            }
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu gợi ý cho đề xuất !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getType () {
      if (sessionStorage.getItem('hrOrderType')) {
        this.orderTypeOption = JSON.parse(sessionStorage.getItem('hrOrderType'))
        this.initOrderType(this.orderType)
        return
      }
      hrOrderService.getType()
        .then(res => {
          if (res.data.success) {
            sessionStorage.setItem('hrOrderType', JSON.stringify(res.data.data))
            this.orderTypeOption = res.data.data
            this.initOrderType(this.orderType)
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không lấy được danh sách loại khai báo !')
        })
    },

    initOrderType (type) {
      let orderType = null
      for (const category of this.orderTypeOption) {
        if (!category || helper.isEmpty(category.types)) continue
        orderType = category.types.find(every => every.alias === type)
        if (orderType) break
      }
      this.selectTypeOrder(orderType)
    },

    resetAllData () {
      // reset order info
      this.selectGroupOrder(null)
      this.order.id = null
      this.order.profile_id = null
      this.order.status = null
      this.order.files = [
        {
          type: null,
          file_exist: [],
          file_add: []
        }
      ]
      this.order.deadline = null
      this.staffCodeAlert = null
      this.censor = null
      this.isRelateOrder = null
      delete this.order.created_by

      // reset employee info
      this.resetEmployee()

      // khởi tạo loại đề xuất cần tạo nếu được truyền vào qua orderType
      this.initOrderType(this.orderType)
    },

    resetEmployee (except = null) {
      for (let field in this.employee) {
        if (field !== except) this.resetObj(this.employee[field])
      }
    },

    checkStaffCode () {
      if (!this.employee.masterProfile.staff_code) {
        this.staffCodeAlert = null
        this.resetEmployee()
        return
      }
      if (this.employee.masterProfile.staff_code.length < 8) {
        this.staffCodeAlert = 'Mã nhân viên phải bao gồm 8 ký tự số VD: 00345678'
        this.resetObj(this.employee.masterProfile, 'staff_code')
        this.resetEmployee('masterProfile')
        return
      }
      if (this.employee.masterProfile.staff_code.length === 8) {
        this.getProfileInfo(this.employee.masterProfile.staff_code)
        return
      }
      helper.validValue(this.employee.masterProfile, 'staff_code', { length: 8 })
    },

    validData () {
      let message = ''
      if (!this.order.order_group) {
        message += '- Loại khai báo\n'
      }
      if (!this.order.order_type_id) {
        message += '- Phương án đề xuất\n'
      }
      if (!this.order.profile_id) {
        message += '- Chọn người lao động\n'
      }
      // loại đề xuất BHXH
      if (!this.order.order_category || this.order.order_category === 'insurance') {
        if (!this.order.additional_info.birthday_status) {
          message += '- Chọn trạng thái ngày sinh\n'
          this.order.additional_info.birthday_status = ''
        }
      }

      if (!this.order.additional_info.birthday_status) {
        message += '- Chỉ có năm sinh\n'
      }

      return message || true
    },

    updateOrder () {
      let message = this.validData()
      if (message !== true) {
        alert('Vui lòng nhập đủ thông tin:\n' + message)
        return
      }

      let data = new FormData()
      for (const field in this.order) {
        if (typeof this.order[field] === 'object' && !(this.order[field] instanceof Date)) continue
        if (this.order[field]) {
          if (field === 'order_group') {
            this.order[field] = 'supply_bhxh'
          }
          if (field === 'order_type_name') {
            this.order[field] = 'Chốt sổ nghỉ việc'
          }
          if (field === 'group_name') {
            this.order[field] = 'Cấp/Gộp/Chốt BHXH'
          }
          if (field === 'order_type_alias') {
            this.order[field] = 'supply_bhxh_close'
          }
          if (field === 'order_category_name') {
            this.order[field] = 'BHXH'
          }
          if (field === 'order_category') {
            this.order[field] = 'insurance'
          }
          data.append(field, this.order[field])
        } else data.append(field, '')
      }
      if (Array.isArray(this.order.files) && this.order.files.length) {
        for (const f of this.order.files) {
          if (Array.isArray(f.file_add)) {
            for (const idx in f.file_add) {
              if (f.file_add[idx]) data.append(f.type + '[' + idx + ']', f.file_add[idx])
            }
          }
        }
      }
      this.$startLoading()
      hrOrderService.updateOrder(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('addOrderOk')
            this.resetEmployee()
            this.resetAllData()
            this.showAction = false
            helper.showMessage(res.data.message || 'Tạo đề xuất thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Tạo đề xuất không thành công!', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    updateStatusOrder () {
      let data = new FormData()
      data.append('id', this.idOrder)
      data.append('action', 'duyet')
      if (Array.isArray(this.order.files) && this.order.files.length) {
        for (const f of this.order.files) {
          if (Array.isArray(f.file_add)) {
            for (const idx in f.file_add) {
              if (f.file_add[idx]) data.append(f.type + '[' + idx + ']', f.file_add[idx])
            }
          }
        }
      }
      hrOrderService.updateStatus(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('addOrderOk')
            this.resetEmployee()
            this.resetAllData()
            this.showAction = false
            helper.showMessage(res.data.message || 'Xác nhận bàn giao thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Không cập nhật được thông tin đề xuất !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    detailOrder (id) {
      if (!id) return
      this.showAction = true
      this.loadingOrderInfo = true
      hrOrderService.detailOrder({ id: id })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.order = res.data.data
            if (this.order.order_group !== 'supply_bhxh') {
              this.supply_bhxh = 'supply_bhxh'
            }
            this.duty = res.data.duty
            this.censor = res.data.censor
            this.relateInfo = res.data.relateInfo || []
            if (res.data.data.profile_id) {
              this.employee.masterProfile.staff_code = helper.genCode(res.data.data.profile_id, '', '', 8)
              this.getProfileInfo(this.employee.masterProfile.staff_code)
            }
          } else {
            helper.showMessage(res.data.message || 'Không lấy được đề xuất, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.loadingOrderInfo = false
        })
    },

    getProfileInfo (profileId) {
      if (!profileId) profileId = this.profileId
      if (!profileId) return
      this.loadingProfileInfo = true
      let params = {
        profileId: profileId,
        category: this.order.order_category,
        group: this.order.order_group,
        alias: this.order.order_type_alias
      }
      hrOrderService.getProfile(params)
        .then(res => {
          if (res.data.success) {
            this.staffCodeAlert = null
            this.employee = res.data.data

            // format data để hiển thị
            this.filter.insurance_desc = this.employee.insurance.insurance_desc || null
            this.filter.health_ins_number = this.employee.masterProfile.health_ins_number || null
            this.filter.insurance_register = this.employee.masterProfile.insurance_register || null
            this.order.additional_info.birthday_status = 'dd/mm/yyyy'
            if (this.employee.masterProfile.birthday) this.employee.masterProfile.birthday = moment(this.employee.masterProfile.birthday).format('DD-MM-YYYY')
            if (!this.idOrder) {
              this.order.profile_id = this.employee.masterProfile.id
              this.initAndFormatDataFromEmployee()
            }
          } else {
            helper.showMessage(res.data.message || 'Không lấy được thông tin người lao động, vui lòng thử lại sau !', 'warning')
            // reset lại thông tin người lao động
            this.resetObj(this.employee.masterProfile, 'staff_code')
            this.resetEmployee('masterProfile')
            // reset lại thông tin đề xuất
            this.resetData()
            this.staffCodeAlert = res.data.message || ('Không tồn tại nhân viên có mã ' + this.employee.masterProfile.staff_code)
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.loadingProfileInfo = false
        })
    },

    initAndFormatDataFromEmployee () {
      // init data với loại khai báo BHXH
      if (!this.order.order_category || this.order.order_category === 'insurance') {
        // kiểm tra hợp đồng để gen cảnh báo
        if (this.employee.masterProfile && this.employee.masterProfile.id) {
          if (this.employee.contract && this.employee.contract.id) {
            if (!['indefinite', 'definite', 'definite_24', 'probation'].includes(this.employee.contract.type_contract)) {
              this.staffCodeAlert = 'Hợp đồng của nhân viên này' +
                                  (this.contractType[this.employee.contract.type_contract] ? (' là ' + this.contractType[this.employee.contract.type_contract]) : '') +
                                  ' không phải hợp đồng lao động'
            } else if (this.employee.contract.end_date && moment().isAfter(this.employee.contract.end_date)) {
              this.staffCodeAlert = (this.contractType[this.employee.contract.type_contract] || 'Hợp đồng') + ' của nhân viên này đã hết hạn'
            }
          } else {
            this.staffCodeAlert = 'Nhân viên này chưa có hợp đồng lao động'
          }
        } else this.staffCodeAlert = null

        this.assignOldData()
      }
    },

    canAddLicenses () {
      if (!this.order.files || !this.order.files.length) return true
      let lastLicense = this.order.files[this.order.files.length - 1]
      return !!(lastLicense && lastLicense.type && ((lastLicense.file_add && lastLicense.file_add.length) || (lastLicense.file_exist && lastLicense.file_exist.length)))
    },

    addLicenses () {
      this.order.files.push({
        type: null,
        file_add: [],
        file_exist: []
      })
    },

    deleteLicense (idx) {
      if (!this.order.files[idx]) return
      if (this.order.files[idx].file_exist && this.order.files[idx].file_exist.length) {
        helper.showMessage('Không thể xóa chứng từ đã upload !')
        return
      }
      this.order.files.splice(idx, 1)
    },

    selectTypeOrder (op) {
      if (op) {
        this.order.order_type_id = op.id
        this.order.order_type_alias = op.alias
        this.order.order_group = op.group_alias
        this.order.group_name = op.group_name
        this.order.order_category = op.category
      } else {
        this.order.order_type_id = null
        this.order.order_type_alias = null
      }

      this.order.new_value = null
      this.order.old_value = null
      // reset lại file hồ sơ khi điều chỉnh
      if (this.modifyConfig[this.order.order_type_id] && !this.modifyConfig[this.order.order_type_id].inputFile) {
        this.order.file = []
      }
      // gán giá trị cũ theo như thông tin master profile
      if (this.order.order_group === 'modify') this.assignOldData()
    },

    // gán giá trị cũ theo như thông tin master profile
    assignOldData () {
      if (this.order.order_group !== 'modify') return
      if (+this.order.order_type_id === 7) { // Mức đóng BHXH
        this.order.old_value = this.employee.salary.salary
        this.inputMoney(this.order, 'old_value')
      }
      if (+this.order.order_type_id === 9) this.order.old_value = this.employee.empProfile.position_job // Vị trí
      if (+this.order.order_type_id === 8) this.order.old_value = this.employee.user.station_id // Nơi làm việc
      if (+this.order.order_type_id === 32) this.order.old_value = +this.employee.insurance.company_cost + +this.employee.insurance.worker_cost // tỉ lệ đóng BHXH
    },

    selectGroupOrder (op) {
      if (op) {
        this.order.group_name = op.name
        this.order.order_group = op.alias
        this.order.order_category = op.category
      } else {
        this.order.group_name = null
        this.order.order_group = null
        this.order.order_category = null
      }
      // reset lại data
      if (op && op.alias === 'up') {
        this.order.order_type_id = 1
      } else this.order.order_type_id = null
      this.order.order_type_alias = null
      this.order.order_type_name = null

      this.resetData()
    },

    resetData () {
      this.order.new_value = null
      this.order.note = null
      this.order.old_value = null
      this.order.start_date = null
      this.order.files = [{ type: null, file_add: [], file_exist: [] }]

      if (this.order.additional_info) {
        this.resetObj(this.order.additional_info)
      } else this.order.additional_info = {}
    },

    resetObj (ref, exceptField = null) {
      helper.resetData(ref, exceptField)
    }
  }
}
</script>
