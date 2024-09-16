<template>
  <div>
    <b-modal
      hide-footer
      ref="edit-modal"
      id="modal-add-union"
      :title="title"
      modal-class="modal-xxl modal-create-union"
      @show="showEditModal"
      bodyClass="mh-75 overflow-auto"
      v-loading="loading"
    >
      <div class="position-relative" v-loading="loading">
        <b-row>
          <b-card class="col-md-12 border-0">
            <b-form-group
                label-cols-sm="2"
              >
              <template slot='label'>Người tạo đề xuất</template>
              <b-form-input class="col-md-3" v-if="currEditing" v-model="staffInfo.create_by_fullname" readonly ></b-form-input>
              <b-form-input class="col-md-3" v-else v-model="createBy.fullname" readonly ></b-form-input>
            </b-form-group>
            <b-form-group
                label-cols-sm="2"
            >
              <template slot='label'>
                Mã Nhân Viên <span class='red-text'>(*)</span>
              </template>
              <b-form-input
                  class="col-md-3"
                  @input="checkUsername()"
                  :disabled="type!=='create' || !isChangeStaffCode"
                  :state="validField(staffInfo.staff_code)"
                  v-model="staffInfo.staff_code"
                  id="staff-code"
                  name="staff-code"
                  v-validate="'required'"
                  type="number"
                  :readonly="isReadOnly"
                  placeholder="Nhập mã nhân viên"
              >
              </b-form-input>
              <div class="position-absolute" v-if="loadingMasterProfile"><em class="fa fa-spin fa-spinner"/></div>
              <span id="notification-warnning" class="noti-error" v-if="!validStaffCode && staffInfo.staff_code">{{noti}}</span>
              <span id="notification-success" class="noti-success" v-if="validStaffCode && staffInfo.staff_code">{{infoUserSuccess}}</span>
              <span v-show="errors.firstRule('staff-code') == 'required'" class="noti-error">Không để trống trường này </span>
            </b-form-group>
          </b-card>
        </b-row>
        <b-row>
          <b-card class="col-md-12 ml-2 mr-2 pl-0 pr-0 rounded w-100" sub-title="Thông tin cá nhân" sub-title-text-variant="black">
            <b-row>
              <b-col>
                <b-form-group >
                  <label class="form-label">Username</label>
                  <b-form-input
                      readonly=""
                      v-model="staffInfo.username">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label class="form-label">
                    Họ và tên
                  </label>
                  <b-form-input
                    readonly=""
                    v-model="staffInfo.fullname"
                    type="text">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Ngày sinh</label>
                  <b-form-input
                      readonly=""
                      v-model="staffInfo.birthday">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Vị trí</label>
                  <b-form-input
                      readonly=""
                      v-model="staffInfo.position_name">
                  </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group >
                  <label class="form-label">Miền</label>
                  <b-form-input
                      readonly=""
                      v-model="staffInfo.region">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Tỉnh</label>
                  <b-form-input
                    readonly=""
                    v-model="staffInfo.province_name"
                    type="text">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Kho</label>
                  <b-form-input
                      readonly=""
                      v-model="staffInfo.station_name">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
              </b-col>
            </b-row>
          </b-card>
          <b-card class="mt-3 ml-2 mr-2 pl-0 pr-0 rounded w-100" sub-title="Thông tin đóng bảo hiểm xã hội" sub-title-text-variant="black">
            <b-row>
              <b-col>
                <b-form-group >
                  <label class="form-label">Ngày ký HĐLĐ</label>
                  <b-form-input
                      readonly=""
                      v-model="staffInfo.contract_date">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Thâm niên</label>
                  <b-form-input
                    readonly=""
                    v-model="staffInfo.senior_months"
                    type="text">
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
              </b-col>
              <b-col>
              </b-col>
            </b-row>
          </b-card>
          <b-card class="mt-3 ml-2 mr-2 pl-0 pr-0 rounded w-100" sub-title="Thông tin thanh toán" sub-title-text-variant="black">
            <b-row>
              <b-col>
                <b-form-group >
                  <label class="form-label">Chủ tài khoản</label>
                  <b-form-input
                    v-model="staffInfo.bank_account_name"
                    @input="handleBankAccountInput()"
                    maxlength="200"
                    disabled
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Số tài khoản</label>
                  <b-form-input
                    v-model="staffInfo.bank_account_number"
                    type="text"
                    @keydown="blockKeyNotNumeric($event)"
                    maxlength="200"
                    disabled
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Ngân hàng</label>
                  <b-form-input
                    v-model="staffInfo.bank_name"
                    type="text"
                    maxlength="200"
                    disabled
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
              </b-col>
            </b-row>
          </b-card>
          <b-card class="mt-3 ml-2 mr-2 pl-0 pr-0 rounded w-100" sub-title="Chế độ công đoàn" sub-title-text-variant="black">
            <b-row>
              <b-col>
                <b-form-group >
                  <label class="form-label" >Chế độ <span class='red-text'>(*)</span></label>
                  <b-form-select
                      v-model="staffInfo.union_type"
                      @change="changeUnionType"
                      :options="typeUnionOptions"
                      :disabled="isReadOnly"
                      >
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label" >Tiền được nhận <span class='red-text'>(*)</span></label>
                  <b-form-input
                    :value="convertMoney(staffInfo.money)"
                    :formatter="convertMoney"
                    :disabled="true"
                    maxlength="200"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group >
                  <label class="form-label">Ghi chú</label>
                  <b-form-input
                    v-model="staffInfo.note"
                    type="text"
                    maxlength="200"
                    :disabled="isReadOnly"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group v-if="isReadOnly">
                  <label class="form-label">Ngày phát sinh chế độ<span class='red-text'>(*)</span></label>
                  <b-form-input
                    :value="formatDate(staffInfo.active_date, 'DD/MM/YYYY')"
                    type="text"
                    :disabled="isReadOnly"
                  >
                  </b-form-input>
                </b-form-group>
                <b-form-group v-else>
                  <label class="form-label">Ngày phát sinh chế độ<span class='red-text'>(*)</span></label>
                  <v-date-picker
                    :popover="{visibility: 'focus'}"
                    mode="date"
                    v-model="staffInfo.active_date"
                    locale="vi"
                    color="green"
                    :input-props="{ placeholder: 'dd/mm/yyyy'}"
                  />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group v-if="currEditing" >
                  <label class="form-label">Trạng thái</label>
                  <b-form-select
                    v-model="staffInfo.status"
                    :options="statusUnion"
                    @change="changeUnionStatus"
                    :disable="userInfo.User.group_id!==1"
                    >
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="showNumberInput">
              <b-form-group class="col-md-3 max-width-20">
                  <label class="form-label">{{ labelNumberInput }}</label>
                  <b-form-input
                    v-model="staffInfo.coefficient"
                    @input="changeQuantity"
                    type="number"
                    min="1"
                    :disabled="isReadOnly"
                    @keydown="blockKeyNotNumeric($event)"
                    >
                  </b-form-input>
                </b-form-group>
            </b-row>
            <b-form-checkbox
              v-if="staffInfo.union_type === 3 "
              v-model="staffInfo.is_buy_funeral_wreath"
              button-variant="info"
              :class="isReadOnly ? '' : 'checkbox-ghtk' "
              :disabled="isReadOnly"
            >
              Vòng hoa
            </b-form-checkbox>
            <b-row v-if="staffInfo.union_type === 3 && staffInfo.is_buy_funeral_wreath">
              <b-form-group class="col-md-3 max-width-20 mt-1">
                <b-form-input
                  v-model="staffInfo.expense_other"
                  type="number"
                  :disabled="isReadOnly"
                  placeholder="Nhập giá trị vòng hoa"
                  >
                </b-form-input>
              </b-form-group>
            </b-row>
            <b-row v-if="staffInfo.file_desc.length > 0">
              <b-col>
                <template>
                  <div class="div-file-type">
                    <span class="span-file-type">Giấy tờ yêu cầu <span class='red-text'>(*)</span></span>
                    <div class="pt-3" v-for="(documentRequired, index) in staffInfo.file_desc" :key="index">
                      <p class="text-black mt-2 mb-1">
                        {{ documentRequired.name }}
                        <span v-if="!isReadOnly" :class="classElCountDocs(documentRequired.type)">
                          {{ countFileUpload[documentRequired.type] }}/{{ staffInfo.coefficient }}
                        </span>
                      </p>
                      <template>
                        <div v-if="isReadOnly && staffInfo.docs.length > 0" class="text-left d-flex">
                          <div v-for="(file, index) in staffInfo.docs" class="img-bounder mt-1 mr-2" :key="index">
                            <b-img
                              v-if="checkIfImage(file.file_url) && file.document_type === documentRequired.type"
                              v-img="{group: `files`}" :src="file.file_url" :alt="file.file_name" class="rounded mt-2 mr-3 border" style="height: 150px; max-width: 100px"
                            ></b-img>
                            <b-link
                              v-if="!checkIfImage(file.file_url) && file.document_type === documentRequired.type"
                              @click="openLink(file.file_url)"
                            >
                              <h4><b-badge variant="primary">{{file.file_name}}</b-badge></h4>
                            </b-link>
                          </div>
                        </div>
                      </template>
                      <template>
                        <div class="text-left d-flex">
                          <div v-for="(file, index) in fileDocuments[documentRequired.type]" class="img-bounder mt-1 mr-2" :key="index">
                            <b-img
                              v-if="file.type.indexOf('image') === 0"
                              v-img="{group: `files`}" :src="file.link_file" :alt="file.name" class="rounded mt-2 mr-3 border" style="height: 150px; max-width: 100px"
                            ></b-img>
                            <div v-else class="mt-2 mr-3">
                              <b-link @click="openLink(file.file_url)" class="mr-3">
                                <h4><b-badge variant="primary">{{file.file_name}}</b-badge></h4>
                              </b-link>
                              <br>
                            </div>
                          </div>
                          <div v-for="(file, index) in fileAdded[documentRequired.type]" class="img-bounder mt-1 mr-2" :key="index">
                            <span v-if="staffInfo.file_desc" @click="deleteFile($event, index, false, documentRequired.type)" class="icon ion-md-close-circle btn-disable-file" title="Xóa"></span>
                            <a href="javascript:void(0)">
                              <b-img
                                v-if="file.type.includes('image')"
                                :src="getUrl(file)" :alt="file.name" class="rounded mt-2 mr-3 border" style="height: 150px; max-width: 100px;"
                              >
                              </b-img>
                              <b-link v-else class="mr-3" @click="openLink(getUrl(file))">
                                <h4><b-badge class="mt-2 mr-2" variant="primary">{{file.name}}</b-badge></h4>
                              </b-link>
                            </a>
                          </div>
                          <div v-if="!isReadOnly" class="img-bounder mt-1 mb-4">
                            <b-form-group class="dragdrop">
                              <b-form-file
                                v-if="reRenderFileInput"
                                accept="image/*"
                                placeholder="Thêm file"
                                @input="onFileChange($event, documentRequired.type)"
                                :file-name-formatter="formatNames"
                              >
                              </b-form-file>
                            </b-form-group>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </b-col>
            </b-row>
          </b-card>
        </b-row>
        <br>
        <div align="center" v-if="!isReadOnly">
          <b-btn id="close-btn" class="w-10re mr-3" variant="secondary" :disabled="addBtnDisabled" @click="closeUnionModal()">Đóng</b-btn>
          <b-btn id="add-btn" class="w-10re" variant="ghtk" :disabled="addBtnDisabled" @click="createUnionOffer()">Đề xuất</b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import UnionService from 'domain/services/union-service'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import debounce from 'debounce'
import SingleSelectProvinceTax from 'components/elements/common/SingleSelectProvinceTax'
import SingleSelectDistrictTax from 'components/elements/common/SingleSelectDistrictTax'
import SingleSelectCommuneTax from 'components/elements/common/SingleSelectCommuneTax'
import EditPeriodDocuments from 'components/pages/erp/Education/edit-period-documents'
import commonHelper from 'infrastructures/helpers/common-helpers'
import { mapGetters } from 'vuex'
import moment from 'moment'

// services
import hrmTicketService from 'domain/services/Erp/ticket-service'

// entities
import Union from 'domain/entities/Union'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'modal-create-union',

  props: {
    currEditing: {
      default: null
    },
    trigger: {
      default: false
    },
    type: {
      default: 'create'
    },
    staffcode: {
      default: null
    },
    typeUnions: {
      default: null
    },
    typeUnionOptions: {
      default: null
    },
    isChangeStaffCode: {
      default: null
    },
    unionId: {
      default: null
    }
  },

  components: {
    Datepicker,
    EditPeriodDocuments,
    SingleSelectProvinceTax,
    SingleSelectDistrictTax,
    SingleSelectCommuneTax,
    debounce
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    showNumberInput () {
      return Union.showNumberInput(this.staffInfo.union_type)
    },
    labelNumberInput () {
      return Union.labelNumberInput(this.staffInfo.union_type)
    }
  },

  data () {
    return {
      isShowInputFile: true,
      loading: false,
      addBtnDisabled: false,
      disable: false,
      title: 'Thêm đề xuất công đoàn',
      btnAddTitle: '',
      infoUserSuccess: '',
      noti: '',
      validStaffCode: false,
      allowEdit: false,
      createBy: {
        username: '',
        fullname: ''
      },
      staffInfo: {
        unionId: null,
        staff_code: null,
        master_profile_id: null,
        active_date: null,
        union_type: '',
        status: '',
        birthday: '',
        join_date: '',
        contract_date: '',
        seniors: 0,
        senior_months: '',
        position_name: '',
        station_name: '',
        province_name: '',
        region: '',
        bank_account_name: '',
        bank_account_number: '',
        bank_name: '',
        money: 0,
        baseMoney: 0,
        number_children: 1,
        files: [],
        file_desc: [],
        type_desc: '',
        create_by_user: '',
        create_by_fullname: '',
        note: '',
        region_id: '',
        station_id: '',
        province_id: '',
        is_buy_funeral_wreath: false,
        expense_other: 0,
        coefficient: 1
      },
      fileDeleted: [],
      fileAdded: [],
      reRenderFileInput: true,
      filesAccumulated: [],
      fileDocuments: [],
      formEditUnion: {
        master_profile_id: null,
        unionId: null,
        staff_code: null,
        fullname: null,
        birthday: '',
        age: null,
        gender: null,
        tax_iden_number: null,
        personal_id_number: null,
        number_gks: null,
        number_book_gks: null,
        provinceId: null,
        districtId: null,
        communeId: null,
        from: '',
        to: '',
        fileCmndDependent: null,
        fileBirthCertificate: null,
        fileInabilityToWork: null,
        fileHousehold: null,
        fileXNNPTTNCN: null,
        fileDKNPT: null,
        fileOther: null,
        fileAuthority: null
      },
      statusUnion: [
        {text: 'Đang chờ', value: 'pending'},
        {text: 'Thiếu tài liệu', value: 'lack_document'},
        {text: 'Lỗi', value: 'error'},
        {text: 'Thành công', value: 'success'}
      ],
      gender: [
        {text: 'Nam', value: 'male'},
        {text: 'Nữ', value: 'female'}
      ],
      loadingMasterProfile: false,
      isReadOnly: false,
      countFileUpload: []
    }
  },

  watch: {
    trigger: function () {
      this.noti = ''
      if (this.type === 'create') {
        this.title = 'Thêm đề xuất công đoàn'
        this.btnAddTitle = 'Đề xuất'
        this.isReadOnly = false
        this.allowEdit = false
        this.resetForm()
        if (this.staffcode) {
          this.validUserUnion(this.staffcode)
        }
        if (!this.createBy.username) {
          this.createBy.username = this.userInfo.User.username
          this.createBy.fullname = this.userInfo.User.fullname
        }
      }
      if (this.type === 'show') {
        this.resetForm()
        this.title = 'Thông tin đề xuất'
        this.allowEdit = false
        this.isReadOnly = true
        this.getUnionOffer(this.unionId)
      } else {
        this.title = 'Thêm đề xuất công đoàn'
        this.btnAddTitle = 'Cập nhật'
        this.allowEdit = true
        this.resetForm()
        if (!this.currEditing) return
        let param = {
          id: this.currEditing
        }
        UnionService.getUnionOffer(param).then(res => {
          if (res.data.success) {
            this.setForm(res.data.data)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch(e => {
          console.log(e)
        }).then(() => {
          this.appLoading = false
        })
      }

      this.$refs['edit-modal'].show()
    },
    unionId: function () {
      this.getUnionOffer(this.unionId)
    },
    'staffInfo.is_buy_funeral_wreath': function (value) {
      if (!value) {
        this.staffInfo.expense_other = null
      }
    }
  },

  methods: {
    checkIfImage (link) {
      const imagePattern = /\.(jpg|jpeg|png|gif|bmp|svg)$/i

      return imagePattern.test(link)
    },
    classElCountDocs (type) {
      this.isShowInputFile = parseInt(this.countFileUpload[type]) < parseInt(this.staffInfo.coefficient)

      return this.countFileUpload[type] <= this.staffInfo.coefficient ? 'text-ghtk' : 'red-text'
    },
    openLink (link) {
      window.open(link, '_blank')
    },
    onFileChange (file, type) {
      if (this.fileAdded[type]) {
        this.fileAdded[type].push(file)
      } else {
        this.fileAdded[type] = [file]
      }
      this.countFileUpload[type] = this.fileAdded[type].length
      this.$set(this.fileAdded, type, this.fileAdded[type])
      this.reRenderFileInput = false
      this.$nextTick(() => {
        this.reRenderFileInput = true
      })
    },
    async getUnionOffer (id) {
      try {
        const res = await hrmTicketService.getUnionOffer({id})
        if (res.data.success) {
          const unionInfo = res.data.data
          this.staffInfo.unionId = unionInfo.id
          this.staffInfo.staff_code = unionInfo.mp_id
          await this.validUserUnion(unionInfo.mp_id)
          this.staffInfo.union_type = unionInfo.type
          this.changeUnionType(unionInfo.type)
          this.staffInfo.status = unionInfo.status
          this.staffInfo.money = unionInfo.money
          this.staffInfo.coefficient = unionInfo.payment_detail.coefficient ? unionInfo.payment_detail.coefficient : 1
          this.staffInfo.money = +unionInfo.payment_detail.base_money * +this.staffInfo.coefficient
          this.createBy.fullname = unionInfo.created_user.fullname
          this.staffInfo.active_date = unionInfo.active_date
          this.staffInfo.note = unionInfo.reason
          this.staffInfo.docs = unionInfo.docs ? unionInfo.docs : []
          this.staffInfo.expense_other = unionInfo.payment_detail.expense_other
          this.staffInfo.is_buy_funeral_wreath = this.staffInfo.expense_other > 0
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra khi lấy thông tin đề xuất', 'error', 'Lỗi')
      }
    },

    showEditModal () {
      this.staffInfo.staff_code = this.staffcode
    },
    handleBankAccountInput () {
      if (this.staffInfo.bank_account_name) {
        const regexUnsignedName = /[\u0300-\u036f]/g // Bộ ký tự Unicode cho các dấu (Ví dụ: á, è, ô)
        this.staffInfo.bank_account_name = this.staffInfo.bank_account_name.normalize('NFD').replace(regexUnsignedName, '') // Chuyển chuỗi thành chuỗi không dấu
        this.staffInfo.bank_account_name = this.staffInfo.bank_account_name.trim().toUpperCase()
      }
    },
    // Chặn người dùng nhập các ký tự không phải số
    blockKeyNotNumeric (event) {
      const keyCode = event.keyCode
      if (keyCode === 8 || keyCode === 46) return true // Cho phép nhấn phím backspace và delete
      if (event.ctrlKey && (keyCode === 67 || keyCode === 86)) return true // cho phép nhấn tổ hợp phím copy (ctrl + c) và paste (ctrl + v)
      if (keyCode < 48 || (keyCode > 57 && keyCode < 96) || keyCode > 105) {
        event.preventDefault()
      }
    },
    convertMoney (money) {
      this.staffInfo.money = (money + '').replace(/\D/g, '')
      return commonHelper.formatMoney(money)
    },
    getUrl (file) {
      return URL.createObjectURL(file)
    },
    formatNames (files) {
      if (files) return `${files.length} files`
      return ''
    },
    deleteFile (event, indexFile, uploaded, type) {
      if (uploaded) {
        if (event.target.classList.contains('ion-md-close-circle')) {
          this.fileDeleted.push(this.fileDocuments[indexFile].id)
          event.target.setAttribute('title', 'Lấy lại')
        } else {
          let index = this.fileDeleted.indexOf(this.fileDocuments[indexFile].id)
          if (index >= 0) {
            this.fileDeleted.splice(index, 1)
            event.target.setAttribute('title', 'Xóa')
          }
        }
        event.target.classList.toggle('ion-md-close-circle')
        event.target.classList.toggle('ion-md-refresh-circle')
        event.target.nextElementSibling.classList.toggle('file-deleted')
      } else {
        this.fileAdded[type].splice(indexFile, 1)
      }
      this.countFileUpload[type] = this.fileAdded[type].length
    },
    changeUnionStatus (value) {
      // check permission
      if (this.userInfo.User.group_id !== 1 || this.userInfo.User.group_id !== 3) {
        // this.staffInfo.status
      }
    },
    changeQuantity (value) {
      this.staffInfo.money = this.staffInfo.baseMoney * value
      this.staffInfo.coefficient = value
    },
    changeUnionType (value) {
      this.fileAdded = []
      this.fileDocuments = []
      this.fileDeleted = []
      this.staffInfo.coefficient = 1
      this.staffInfo.is_buy_funeral_wreath = false
      this.staffInfo.expense_other = null
      if (value && this.staffInfo.seniors) {
        // find union
        for (let i = this.typeUnions.length - 1; i >= 0; i--) {
          if (this.typeUnions[i].type === value) {
            if (+this.staffInfo.seniors >= +this.typeUnions[i].seniority) {
              this.staffInfo.money = +this.typeUnions[i].amount
              this.staffInfo.baseMoney = +this.staffInfo.money
              if (this.typeUnions[i].required_docs) {
                this.allowEdit = true
                this.staffInfo.file_desc = this.typeUnions[i].required_docs
              } else {
                this.allowEdit = false
                this.staffInfo.file_desc = ''
              }
            } else if (Union.inListTypeDie(value)) {
              this.staffInfo.money = +this.typeUnions[i].amount
              this.staffInfo.baseMoney = +this.staffInfo.money
              this.staffInfo.baseMoney = 0
              this.staffInfo.file_desc = this.typeUnions[i].required_docs
            } else {
              this.staffInfo.money = 0
              this.staffInfo.baseMoney = 0
              this.staffInfo.file_desc = ''
            }
            this.staffInfo.union_type = value
            this.staffInfo.type_desc = this.typeUnions[i].name
            break
          }
        }
      }

      for (const requiredDoc of this.staffInfo.file_desc) {
        this.countFileUpload[requiredDoc.type] = 0
      }
    },

    validField (field) {
      if (field === null) return null
      if (field < 0 || field.length === 0) return false
    },

    convertToMonth (date) {
      if (date !== '') {
        var d2 = new Date()
        var d1 = new Date(date)
        var ydiff = d2.getYear() - d1.getYear()
        var mdiff = d2.getMonth() - d1.getMonth()

        var diff = ydiff * 12 + mdiff

        return diff
      }
      return 0
    },
    setForm (data) {
      if (data.id) this.staffInfo.unionId = data.id
      if (data.master_profile_id) this.staffInfo.master_profile_id = data.master_profile_id
      if (data.staff_code) this.staffInfo.staff_code = data.staff_code
      if (data.fullname) this.staffInfo.fullname = data.fullname
      if (data.birthday) this.staffInfo.birthday = commonHelper.formatDate(data.birthday, 'DD-MM-YYYY')
      if (data.username) this.staffInfo.username = data.username
      if (data.active_date) this.staffInfo.active_date = moment(data.active_date).toDate()

      if (data.join_date) {
        this.staffInfo.join_date = data.join_date
        this.staffInfo.contract_date = commonHelper.formatDate(data.contract_date, 'DD-MM-YYYY')
        this.staffInfo.seniors = this.convertToMonth(data.contract_date)
        this.staffInfo.senior_months = this.staffInfo.seniors + ' tháng'
      }
      if (data.bank_account_name) this.staffInfo.bank_account_name = data.bank_account_name
      if (data.bank_account_number) this.staffInfo.bank_account_number = data.bank_account_number
      if (data.bank_name) this.staffInfo.bank_name = data.bank_name
      if (data.region) this.staffInfo.region = data.region
      if (data.station_name) this.staffInfo.station_name = data.station_name
      if (data.position_name) this.staffInfo.position_name = data.position_name
      if (data.province_name) this.staffInfo.province_name = data.province_name
      if (data.station_id) this.staffInfo.station_id = data.station_id
      if (data.region_id) this.staffInfo.region_id = data.region_id
      if (data.province_id) this.staffInfo.province_id = data.province_id
      if (data.union_type) {
        this.changeUnionType(data.union_type)
      }
      if (data.status) this.staffInfo.status = data.status
      if (data.money) this.staffInfo.money = data.money
      if (data.number_children) this.staffInfo.number_children = data.number_children
      if (data.created_by && data.created_by.fullname) this.staffInfo.create_by_fullname = data.created_by.fullname
      if (data.files && data.files.length) this.fileDocuments = data.files
      if (data.note) this.staffInfo.note = data.note
    },

    resetForm () {
      this.staffInfo.unionId = null
      if (!this.staffInfo.staff_code || this.type === 'edit') this.staffInfo.master_profile_id = null
      this.staffInfo.staff_code = null
      this.staffInfo.fullname = ''
      this.staffInfo.username = ''
      this.staffInfo.birthday = ''
      this.staffInfo.money = 0
      this.staffInfo.baseMoney = 0
      this.fileAdded = []
      this.fileDeleted = []
      this.fileDocuments = []

      this.staffInfo.active_date = null
      this.staffInfo.join_date = ''
      this.staffInfo.contract_date = ''
      this.staffInfo.senior_months = ''
      this.staffInfo.bank_account_name = ''
      this.staffInfo.bank_account_number = ''
      this.staffInfo.bank_name = ''
      this.staffInfo.region = ''
      this.staffInfo.station_name = ''
      this.staffInfo.position_name = ''
      this.staffInfo.province_name = ''
      this.staffInfo.station_id = ''
      this.staffInfo.region_id = ''
      this.staffInfo.province_id = ''
      this.staffInfo.union_type = ''
      this.staffInfo.status = ''
      this.staffInfo.note = ''
      this.staffInfo.file_desc = ''
      this.staffInfo.type_desc = ''
      this.staffInfo.number_children = 1
      this.staffInfo.coefficient = 1
      this.staffInfo.expense_other = 0
    },
    async validUserUnion (staffCode) {
      if (!staffCode) {
        this.resetForm()
        return
      }
      this.loadingMasterProfile = true
      try {
        const response = await UnionService.validUserUnion({id: +staffCode})
        if (response.data.success) {
          this.validStaffCode = true
          this.setForm(response.data.data)
          this.noti = ''
        } else {
          this.staffInfo.master_profile_id = null
          this.validStaffCode = false
          this.noti = response.data.message
        }
      } catch (e) {
        this.noti = 'Có lỗi xảy ra'
      } finally {
        this.loadingMasterProfile = false
      }
    },

    checkUsername: debounce(function (query) {
      if (query && query.length < 5) {
        return
      }
      this.noti = ''
      this.validUserUnion(this.staffInfo.staff_code)
    }, 500),

    async createUnionOffer () {
      // Nếu thâm niên dưới 3 tháng và type khác đoàn viên/gia đình đoàn viên mất thì báo lỗi
      if (this.staffInfo.seniors < 3 && this.staffInfo.union_type !== 3 && this.staffInfo.union_type !== 4) {
        commonHelper.showMessage('Người lao động chưa  đủ thâm niên để hưởng chế độ này', 'error', 'Lỗi')
        return
      }
      if (this.staffInfo.is_buy_funeral_wreath && !this.staffInfo.expense_other) {
        commonHelper.showMessage('Vui lòng nhập giá trị vòng hoa', 'warning', 'Thông báo')
        return
      }
      this.loading = true
      const document = []
      for (const element of this.staffInfo.file_desc) {
        document[element.type] = this.fileAdded[element.type]
      }
      let data = new FormData()

      if (document.length > 0) {
        let index = 0
        for (let i = 0; i < document.length; i++) {
          if (typeof document[i] === 'undefined') continue
          for (const element of document[i]) {
            data.append('document[type][' + index + ']', i)
            data.append('document[file][' + index + ']', element)
            data.append('document[name][' + index + ']', element.name.slice(0, 19))
            index++
          }
        }
      }
      data.append('master_profile_id', this.staffInfo.master_profile_id)
      data.append('union_type', this.staffInfo.union_type)
      data.append('active_date', commonHelper.formatDate(this.staffInfo.active_date, 'YYYY-MM-DD'))
      data.append('coefficient', this.staffInfo.coefficient)
      if (this.staffInfo.expense_other) {
        data.append('expense_other', this.staffInfo.expense_other)
      }
      try {
        const res = await hrmTicketService.createUnionOffer(data)
        if (res.data.success) {
          this.$bvModal.hide('modal-add-union')
          this.$emit('onCreated')
          commonHelper.showMessage('Tạo đề xuất thành công', 'success', 'Thành công')
        } else {
          commonHelper.showMessage(res.data.message, 'error', 'Lỗi')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra', 'error', 'Lỗi')
      } finally {
        this.loading = false
      }
    },

    closeUnionModal () {
      this.$bvModal.hide('modal-add-union')
    },

    formatDate (date, format) {
      return commonHelper.formatDate(date, format)
    }
  }
}
</script>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
  .noti-error {
    color: red;
    font-size:12px;
  }
  .noti-success {
    color: green;
    font-size:12px;
  }
  .is-danger {
    font-size: 12px;
    color: red;
  }
.div-file-type {
  padding-bottom: 3px;
  /* max-width: 200px; */
}

.span-file-type {
  font-size: 0.894rem;
  font-weight: 500;
  color: black;
  line-height: 1.1;
}
.scrollbar-file-info {
  max-height: 70vh;
}
.scrollbar-log-info {
  max-height: 75vh;
}
.img-bounder {
  position: relative;
  display: inline-block;
}
.img-bounder:hover > .btn-disable-file {
  display: inline;
}
.file-deleted {
  opacity: 0.1;
}
.btn-disable-file {
  font-size: 20px;
  display: none;
  position: absolute;
  top: -10px;
  right: 2px;
}
.dragdrop {
  position: relative;
  width: 8rem;
  height: 110px;
}
.dragdrop >>> .custom-file-label {
  border: 3px dotted #00904A;
  height: 150px;
  width: 100px;
  line-height: 150px;
  text-align: center;
  color: #00904A;
  padding: 0;
  margin-top: 0.5rem;
}

.dragdrop .custom-file:hover >>> .custom-file-label {
  background: #00904A;
  color: #fff;
}

.dragdrop >>> .custom-file-label::after {
  display: none;
}

.max-width-20 {
  max-width: 20%;
}

.custom-control-label::before {
  border-color: #00904A;
  background-color: #00904A;
}
</style>
<style>
  .is-valid-input {
    border-color: #d9534f;
  }
  .is-valid-input:focus {
    border-color: #d9534f;
    box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.25) !important;
  }
</style>
