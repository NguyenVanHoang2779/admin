<template>
    <b-modal hide-footer :id="id" :title="!curEdit ? 'Thêm người phụ thuộc' : 'Chỉnh sửa người phụ thuộc'" modal-class="modal-xxl" @shown="initData" @hide="resetForm" static>
      <form autocomplete="off">
      <b-row>
        <b-card class="col-md-6">
          <b-col>
            <b-form-group label-cols-sm="3">
              <span slot='label'>Mã Nhân Viên<span class='red-text'>*</span></span>
              <b-form-input
                @input="checkUsername()"
                :disabled="!!curEdit"
                :state="validField(dependant.staff_code)"
                v-model="dependant.staff_code"
                name="staff-code"
                v-validate="'required'"
                type="number"
              >
              </b-form-input>
              <span id="notification-warnning" class="noti-error" v-if="!validStaffCode && dependant.staff_code">{{ noti }}</span>
              <span id="notification-success" class="noti-success" v-if="validStaffCode && dependant.staff_code">{{ infoUserSuccess }}</span>
              <span v-show="errors.firstRule('staff-code') == 'required'" class="noti-error">{{ note.notEmpty }}</span>
            </b-form-group>
            <b-form-group label-cols-sm="3">
              <span slot='label'>Họ và tên NPT <span class='red-text'>*</span></span>
              <b-form-input
                :state="validField(dependant.fullname)"
                name="fullname"
                v-validate="'required'"
                v-model="dependant.fullname"
                maxlength="100"
                @blur="checkDependantByName()">
              </b-form-input>
              <span class="noti-error" v-show="!this.curEdit && existDependant">NPT với tên tương ứng đã tồn tại</span>
              <span v-show="errors.firstRule('fullname') == 'required'" class="noti-error">{{ note.notEmpty }} </span>
            </b-form-group>
            <b-form-group label-cols-sm="3">
              <span slot='label'>Ngày sinh NPT <span class='red-text'>*</span></span>
              <Datepicker
                :input-class="{'invalid-input': (dependant.birthday === null ? true : false)}"
                v-model="dependant.birthday"
                format="dd/MM/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder="Ngày sinh NPT"
                v-validate="'required'"
                name="birthday"
                :use-utc="true"
                :language="language.vi"
              />
              <span v-show="errors.firstRule('birthday') == 'required'" class="noti-error">{{ note.notEmpty }} </span>
              <span>Tuổi : {{dependant.age}}</span>
            </b-form-group>
            <b-form-group label-cols-sm="3">
              <span slot='label'>Giới tính <span class='red-text'>*</span></span>
              <b-form-select
                :options="gender"
                v-model="dependant.gender"
                :state="validField(dependant.gender)"
              >
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols-sm="3">
              <span slot='label'>Quan hệ với người nộp thuế <span class='red-text'>*</span></span>
              <b-form-select
                :options="relationship"
                v-model="dependant.relationship"
                :state="validField(dependant.relationship)"
              >
                <template v-slot:first>
                  <option :value="null" disabled>---Quan hệ với người nộp thuế---</option>
                </template>
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols-sm="3">
              <span slot='label'>Từ tháng <span class='red-text'>*</span></span>
              <Datepicker
                :language="language.vi"
                minimum-view="month"
                :input-class="{'invalid-input': (dependant.from_reduce === null ? true : false)}"
                v-model="dependant.from_reduce"
                format="MM/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder=""
                v-validate="'required'"
                name="from_reduce"
                :use-utc="true"
              />
              <span v-show="errors.firstRule('from_reduce') == 'required'" class="noti-error">{{ note.notEmpty }} </span>
            </b-form-group>
            <b-form-group label-cols-sm="3" label="Đến tháng">
              <Datepicker
                :language="language.vi"
                minimum-view="month"
                v-model="dependant.to_reduce"
                format="MM/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                placeholder=""
                name="to_reduce"
                :use-utc="true"
              />
            </b-form-group>
          </b-col>
        </b-card>
        <b-card class="col-md-6">
          <b-col>
            <b-form-group label-cols-sm="3" label="MST của NPT">
              <b-form-input
                v-model="dependant.tax_iden_number"
                name="tax-dependant"
                :class="{'is-danger': errors.has('tax-dependant')}"
                v-validate="{numeric: true, length: 10}"
                @keyup="limitLength('tax_iden_number', 10, ...arguments)"
                @input="checkDependantByMst"
                type="number"
              >
              </b-form-input>
               <p class="noti-error" v-if="!validMstDependant && dependant.tax_iden_number ">{{ note.tax }}</p>
              <span v-show="errors.firstRule('tax-dependant') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
              <span v-show="errors.firstRule('tax-dependant') == 'length'" class="help is-danger">Mã số thuế không đúng </span>
            </b-form-group>
            <b-form-group
              label-cols-sm="3"
              label="Số CMND/Hộ chiếu của NPT"
              v-if="(this.dependant.age >= 15 || !this.dependant.age) && !hasTax"
            >
              <b-form-input
                v-model="dependant.personal_id_number"
                name="personal-id-dependant"
                v-validate="{required:true, numeric: true, min: 9, max: 12, regex: /^(.{12}|.{9})$/}"
                :class="{'is-danger': errors.has('personal-id-dependant')}"
                @keyup="limitLength('personal_id_number', 12, ...arguments)"
                :state="(!dependant.personal_id_number  && dependant.age > 14) ? false : null"
                @input="checkDependantByCMND"
                type="number"
              >
              </b-form-input>
              <p class="noti-error" v-if="validCMNDDependant && dependant.personal_id_number">NPT với CMND tương ứng đã tồn tại</p>
              <span v-show="errors.firstRule('personal-id-dependant') == 'required'  && dependant.age > 14" class="help is-danger">{{ note.notEmpty }} </span>
              <span v-show="errors.firstRule('personal-id-dependant') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
              <span v-show="errors.firstRule('personal-id-dependant') == 'min'" class="help is-danger">Không đủ ký tự CMND </span>
              <span v-show="errors.firstRule('personal-id-dependant') == 'max'" class="help is-danger">Vượt quá ký tự CMND</span>
              <span v-show="errors.firstRule('personal-id-dependant') == 'regex'" class="help is-danger">Số CMND không đúng</span>
            </b-form-group>

            <div v-if="!(hasTax || dependant.age > 17 || dependant.personal_id_number)">
              <h6>Thông tin trên giấy khai sinh NPT(với NPT không có CMND)</h6>
              <b-row>
                <b-col>
                  <b-form-group label-cols-sm="3">
                    <span slot='label'>Số <span class='red-text'>*</span></span>
                    <b-form-input
                      :state="(dependant.number_gks === ''  && (dependant.age < 15 || !dependant.personal_id_number)) ? false : null"
                      name="number-shk-id-dependant"
                      v-model="dependant.number_gks"
                      v-validate="'required'"
                    >
                    </b-form-input>
                    <span v-show="errors.firstRule('number-shk-id-dependant') == 'required' && (dependant.age < 15 || !dependant.personal_id_number)" class="noti-error">{{ note.notEmpty }}</span>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label-cols-sm="3">
                    <span slot='label'>Quyển số <span class='red-text'>*</span></span>
                    <b-form-input
                      :state="(dependant.number_book_gks === ''  && (dependant.age < 15 || !dependant.personal_id_number)) ? false : null"
                      name="number-book-shk-id-dependant"
                      v-model="dependant.number_book_gks"
                      v-validate="'required'"
                    >
                    </b-form-input>
                    <span v-show="errors.firstRule('number-book-shk-id-dependant') == 'required' && (dependant.age < 15 || !dependant.personal_id_number)" class="noti-error">{{ note.notEmpty }}</span>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label-cols-sm="3">
                    <span slot='label'>Tỉnh/Thành phố <span class='red-text'>*</span></span>
                    <single-select-province-tax
                      :state="validField(dependant.provinceId)"
                      @handleSelectedProvince = handleSelectedProvince
                      :province-code="dependant.provinceId"
                    >
                    </single-select-province-tax>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label-cols-sm="3">
                    <span slot='label'>Quận/Huyện <span class='red-text'>*</span></span>
                    <single-select-district-tax
                      @handleSelectedDistrict= handleSelectedDistrict
                      :province-code="dependant.provinceId"
                      :district-code="dependant.districtId"
                      name="province"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label-cols-sm="3">
                    <span slot='label'>Phường/Xã <span class='red-text'>*</span></span>
                    <single-select-commune-tax
                      @handleSelectedCommune= handleSelectedCommune
                      :district-code="dependant.districtId"
                      :commune-code="dependant.communeId"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-card>
      </b-row>
      </form>
      <br>
      <b-row>
        <b-card v-if="!curEdit" class="col-md-12">
          <h5 align="center">Hồ sơ đăng kí NPT</h5>
          <b-row>
            <b-col>
              <b-card sub-title="Tài liệu thông tin người phụ thuộc">
                <b-form-group
                  v-if="dependant.personal_id_number || dependant.age > 14"
                  label-cols-sm="3"
                  label="CMND người phụ thuộc"
                >
                  <b-form-file
                    multiple
                    accept="image/* , .pdf"
                    v-model="dependant.fileCmndDependant"
                    :state="validField(dependant.fileCmndDependant)"
                    placeholder="Ảnh/Scan CMND người phụ thuộc"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                    </template>
                  </b-form-file>
                </b-form-group>
                <b-form-group
                    v-if="(dependant.age < 18 && !dependant.personal_id_number) && !dependant.tax_iden_number"
                    label-cols-sm="3"
                    label="Giấy khai sinh"
                >
                  <b-form-file
                    multiple
                    accept="image/* , .pdf"
                    v-model="dependant.fileBirthCertificate"
                    :state="validField(dependant.fileBirthCertificate)"
                    placeholder="Giấy khai sinh người phụ thuộc"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                    </template>
                  </b-form-file>
                </b-form-group>
                <b-form-group
                  v-if="checkWorkAge() && dependant.relationship !== 1"
                  label-cols-sm="3"
                  label="Chứng nhận không thể lao động"
                >
                  <b-form-file
                    multiple
                    accept="image/* , .pdf"
                    v-model="dependant.fileInabilityToWork"
                    :state="validField(dependant.fileInabilityToWork)"
                    placeholder="Chứng nhận không có khả năng lao động"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                    </template>
                  </b-form-file>
                </b-form-group>
                <div v-if="dependant.relationship !== 4">
                  <b-form-group
                      v-if="dependant.relationship !== 1"
                      label-cols-sm="3"
                      label="Sổ hộ khẩu"
                  >
                    <b-form-file
                      multiple
                      accept="image/* , .pdf"
                      v-model="dependant.fileHousehold"
                      :state="validField(dependant.fileHousehold)"
                      placeholder="Sổ hộ khẩu"
                      drop-placeholder="Drop file here..."
                    >
                      <template slot="file-name" slot-scope="{ names }">
                        <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                      </template>
                    </b-form-file>
                  </b-form-group>
                  <b-form-group label-cols-sm="3"
                      label="Giấy tờ khác (nếu có)"
                  >
                    <b-form-file class="mb-3"
                      multiple
                      accept="image/* , .pdf, .doc, dot, .wbk, dotx, dotm, .docx, .docm, docb"
                      v-model="dependant.fileOther"
                      placeholder="Giấy tờ khác"
                      drop-placeholder="Drop file here..."
                    >
                      <template slot="file-name" slot-scope="{ names }">
                        <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                      </template>
                    </b-form-file>
                  </b-form-group>
                </div>
                <div v-else>
                  <span class="text-danger">Nhập ít nhất 1 trong 4 loại hồ sơ dưới đây</span>
                  <b-form-group
                      label-cols-sm="3"
                      label="Giấy xác nhận nghĩa vụ nuôi dưỡng (nếu có)"
                  >
                    <b-form-file
                      multiple
                      accept="image/* , .pdf, .doc, dot, .wbk, .dotx, .dotm, .docx, .docm, .docb"
                      v-model="dependant.fileXNNPTTNCN"
                      :state="validField(dependant.fileXNNPTTNCN)"
                      placeholder="Giấy xác nhận nghĩa vụ nuôi dưỡng"
                      drop-placeholder="Drop file here..."
                    >
                      <template slot="file-name" slot-scope="{ names }">
                        <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                      </template>
                    </b-form-file>
                  </b-form-group>
                  <b-form-group
                      label-cols-sm="3"
                      label="Sổ hộ khẩu (cùng Sổ hộ khẩu)"
                  >
                    <b-form-file
                      multiple
                      accept="image/* , .pdf, .doc, dot, .wbk, .dotx, .dotm, .docx, .docm, .docb"
                      v-model="dependant.fileHousehold"
                      placeholder="Sổ hộ khẩu (cùng Sổ hộ khẩu)"
                      drop-placeholder="Drop file here..."
                    >
                      <template slot="file-name" slot-scope="{ names }">
                        <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                      </template>
                    </b-form-file>
                  </b-form-group>
                  <b-form-group
                      label-cols-sm="3"
                      label="Đăng ký tạm trú (không cùng Sổ hộ khẩu)"
                  >
                    <b-form-file
                      multiple
                      accept="image/* , .pdf, .doc, dot, .wbk, .dotx, .dotm, .docx, .docm, .docb"
                      v-model="dependant.fileTemporaryResidence"
                      placeholder="Đăng ký tạm trú (không cùng Sổ hộ khẩu)"
                      drop-placeholder="Drop file here..."
                    >
                      <template slot="file-name" slot-scope="{ names }">
                        <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                      </template>
                    </b-form-file>
                  </b-form-group>
                  <b-form-group
                      label-cols-sm="3"
                      label="Tờ khai có xác nhận của UBND xã nơi NPT cư trú"
                  >
                    <b-form-file
                      multiple
                      accept="image/* , .pdf, .doc, dot, .wbk, .dotx, .dotm, .docx, .docm, .docb"
                      v-model="dependant.fileConfirmOfCommittee"
                      placeholder="Tờ khai có xác nhận của UBND xã nơi NPT cư trú"
                      drop-placeholder="Drop file here..."
                    >
                      <template slot="file-name" slot-scope="{ names }">
                        <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                      </template>
                    </b-form-file>
                  </b-form-group>
                </div>
              </b-card>
            </b-col>
            <b-col>
              <b-card sub-title="Giấy tờ phục vụ việc đăng kí">
                <b-form-group label-cols-sm="3" label="Giấy đăng kí 20-DK-TH-NPT" >
                  <b-form-file class="mb-3"
                    multiple
                    accept="image/* , .pdf, .doc, dot, .wbk, dotx, dotm, .docx, .docm, docb"
                    v-model="dependant.fileDKNPT"
                    :state="validField(dependant.fileDKNPT)"
                    placeholder="Mẫu đăng kí 20-DK-TH-NPT"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                    </template>
                  </b-form-file>
                </b-form-group>
                <b-form-group label-cols-sm="3"
                    label="Giấy ủy quyền ĐK NPT"
                >
                  <b-form-file class="mb-3"
                    multiple
                    accept="image/* , .pdf, .doc, dot, .wbk, dotx, dotm, .docx, .docm, docb"
                    v-model="dependant.fileAuthority"
                    :state="validField(dependant.fileAuthority)"
                    placeholder="Giấy ủy quyền"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                    </template>
                  </b-form-file>
                </b-form-group>
                <b-form-group
                    v-if="dependant.age >= 18 || (dependant.age >= 15 && dependant.relationship !== 1)"
                    label-cols-sm="3"
                    label="Kê khai thu nhập"
                >
                  <b-form-file
                    multiple
                    accept="image/* , .pdf, .doc, dot, .wbk, .dotx, .dotm, .docx, .docm, .docb"
                    v-model="dependant.fileDetailIncome"
                    :state="validField(dependant.fileDetailIncome)"
                    placeholder="File kê khai thu nhập"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="primary" v-for="(name, index) in names" :key="index" class="mr-1">{{ name }}</b-badge>
                    </template>
                  </b-form-file>
                </b-form-group>
                <div>Mẫu đăng kí : <b-link @click="downloadFile('DKNPT')">Mẫu 20-DK-TH-NPT -> tải xuống</b-link></div>
                <div>Mẫu giấy ủy quyền : <b-link @click="downloadFile('Authority')">Ủy quyền đăng ký NPT -> tải xuống</b-link></div>
                <div v-if="dependant.relationship === 4">Mẫu giấy trực tiếp nuôi dưỡng : <b-link @click="downloadFile('XNNPTTNCN')">Mẫu 07/XN-NPT-TNCN -> tải xuống</b-link></div>
                <div v-if="dependant.age >= 18 || (dependant.age >= 15 && dependant.relationship !== 1)">Kê khai thu nhập : <b-link @click="downloadFile('DetailIncome')">Mẫu kê khai thu nhập -> tải xuống</b-link></div>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-row>
      <br>
      <div class="d-flex justify-content-between align-items-center justify-content-between">
        <div>Tổng dung lượng các file không được vượt quá 15MB mỗi lần tải lên!</div>
        <div>
          <b-btn variant="success btn-round" @click="addDependant()" :disabled="validCMNDDependant || !validMstDependant || addBtnDisabled || existDependant">{{ btnAddTitle }}</b-btn>
        </div>
      </div>
    </b-modal>
</template>

<script>
// service
import dependantService from 'domain/services/dependant-person-service'
// built-in component
import Datepicker from 'vuejs-datepicker'
import { vi } from 'vuejs-datepicker/dist/locale'
// custom component
import SingleSelectProvinceTax from 'components/elements/common/SingleSelectProvinceTax'
import SingleSelectDistrictTax from 'components/elements/common/SingleSelectDistrictTax'
import SingleSelectCommuneTax from 'components/elements/common/SingleSelectCommuneTax'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import debounce from 'debounce'
import moment from 'moment'

import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'update-depentdent-person',

  props: {
    curEdit: {
      default: null
    },
    staffcode: {
      default: null
    },
    id: {
      default: 'update-dependant-person'
    }
  },

  components: {
    Datepicker,
    SingleSelectProvinceTax,
    SingleSelectDistrictTax,
    SingleSelectCommuneTax
  },

  data: _ => ({
    language: {
      vi
    },
    addBtnDisabled: false,
    infoUserSuccess: '',
    noti: '',
    validStaffCode: false,
    validCMNDDependant: false,
    validMstDependant: true,
    existDependant: false,
    dependant: {
      master_profile_id: null,
      dependantId: null,
      staff_code: null,
      fullname: null,
      birthday: '',
      age: null,
      gender: null,
      tax_iden_number: null,
      personal_id_number: null,
      relationship: null,
      number_gks: null,
      number_book_gks: null,
      provinceId: null,
      districtId: null,
      communeId: null,
      from_reduce: '',
      to_reduce: '',
      fileCmndDependant: null,
      fileBirthCertificate: null,
      fileInabilityToWork: null,
      fileHousehold: null,
      fileXNNPTTNCN: null,
      fileDKNPT: null,
      fileOther: null,
      fileAuthority: null,
      fileDetailIncome: null,
      fileTemporaryResidence: null,
      fileConfirmOfCommittee: null
    },
    relationship: [
      {text: 'Con', value: 1},
      {text: 'Vợ/chồng', value: 2},
      {text: 'Cha/mẹ', value: 3},
      {text: 'Khác', value: 4}
    ],
    gender: [
      {text: 'Nam', value: 'male'},
      {text: 'Nữ', value: 'female'}
    ],
    note: {
      notEmpty: 'Không để trống trường này !',
      tax: 'Người phụ thuộc với MST tương ứng đã tồn tại !'
    },
    linkFile: {
      DKNPT: '/erp/ErpDependentPerson/download20DKNPT',
      Authority: '/erp/ErpDependentPerson/downloadAuthority',
      XNNPTTNCN: '/erp/ErpDependentPerson/downloadXNNPTTNCN',
      DetailIncome: '/erp/ErpDependentPerson/downloadDetailIncome'
    }
  }),

  computed: {
    moment,
    btnAddTitle () {
      if (this.dependant.tax_iden_number) return 'Đăng kí thay đổi'
      if (this.curEdit) return 'Cập nhật'
      return 'Đăng kí mới'
    },
    hasTax () {
      if (!this.curEdit && this.dependant.tax_iden_number) return true
      return false
    }
  },

  watch: {
    'dependant.staff_code': function (newVal, oldVal) {
      if (newVal) this.checkUsername(newVal)
    },

    'dependant.tax_iden_number': function () {
      this.dependant.personal_id_number = null
      this.resetBirthForm()
    },

    'dependant.birthday': function (newVal, oldVal) {
      this.calculateAge()
    }
  },

  methods: {
    initData () {
      this.resetForm()
      if (this.curEdit) {
        this.getDependant(this.curEdit)
        return
      }
      if (this.staffcode) this.dependant.staff_code = this.staffcode
    },

    validField (field) {
      if (field === null) return null
      if (field < 0 || field.length === 0) return false
    },

    calculateAge () {
      if (this.dependant.birthday) {
        let birthday = moment(this.dependant.birthday)
        this.dependant.age = Math.round((moment().diff(birthday, 'months') / 12) * 100) / 100
      } else {
        this.dependant.age = null
      }
    },

    limitLength (varName, length) {
      let len = this.dependant[varName].length
      if (len > length) {
        this.dependant[varName] = this.dependant[varName].substring(0, length)
      }
    },

    checkWorkAge () {
      // "Nam: Đủ 60 tuổi 03 tháng Nữ: Đủ 55 tuổi 04 tháng"
      if (!this.dependant.gender && this.dependant.age > 14 && this.dependant.age < 60.25) return true
      if (this.dependant.age > 14) {
        if ((this.dependant.gender === 'male' && this.dependant.age < 60.25) || (this.dependant.gender === 'female' && this.dependant.age < 55.33)) return true
        else return false
      }
      return false
    },

    checkDataUpdate () {
      let formValidated = true
      if (this.existDependant) formValidated = false
      if (!this.dependant.staff_code) {
        this.dependant.staff_code = ''
        formValidated = false
      } else {
        if (!this.validStaffCode) formValidated = false
      }
      if (!this.dependant.fullname) {
        this.dependant.fullname = ''
        formValidated = false
      }
      if (this.dependant.gender === null || this.dependant.gender === '') {
        this.dependant.gender = ''
        formValidated = false
      }
      if (!this.dependant.birthday) {
        this.dependant.birthday = null
        formValidated = false
      }
      if (!this.dependant.relationship) {
        this.dependant.relationship = ''
        formValidated = false
      }
      if (!this.dependant.from_reduce) {
        this.dependant.from_reduce = null
        formValidated = false
      }
      if (!this.dependant.tax_iden_number) {
        if (this.dependant.age < 15) {
          if (!this.dependant.personal_id_number) {
            if (!this.dependant.number_gks) {
              this.dependant.number_gks = ''
              formValidated = false
            }
            if (!this.dependant.number_book_gks) {
              this.dependant.number_book_gks = ''
              formValidated = false
            }
            if (!this.dependant.provinceId) {
              this.dependant.provinceId = ''
              formValidated = false
            }
            if (!this.dependant.districtId) {
              this.dependant.districtId = ''
              formValidated = false
            }
            if (!this.dependant.communeId) {
              this.dependant.communeId = ''
              formValidated = false
            }
          }
        }
        if (this.dependant.age >= 15 && !this.dependant.personal_id_number) {
          this.dependant.personal_id_number = ''
          formValidated = false
        }
      }

      return formValidated
    },

    setForm (data) {
      if (data.id) this.dependant.dependantId = data.id
      if (data.master_profile_id) this.dependant.master_profile_id = data.master_profile_id
      if (data.staff_code) this.dependant.staff_code = data.staff_code
      if (data.tax_iden_number) this.dependant.tax_iden_number = data.tax_iden_number
      if (data.fullname) this.dependant.fullname = data.fullname
      if (data.birthday) this.dependant.birthday = data.birthday
      if (data.gender) this.dependant.gender = data.gender
      if (data.relationship) this.dependant.relationship = data.relationship
      if (data.number_gks) this.dependant.number_gks = data.number_gks
      if (data.number_book_gks) this.dependant.number_book_gks = data.number_book_gks
      if (data.birthplace_province) this.dependant.provinceId = data.birthplace_province.code
      if (data.birthplace_district) this.dependant.districtId = data.birthplace_district.code
      if (data.birthplace_sub_district) this.dependant.communeId = data.birthplace_sub_district.code
      if (data.from_reduce) {
        let fromReduce = new Date(data.from_reduce)
        let month = fromReduce.getMonth() + 1
        if (month < 10) month = '0' + month
        this.dependant.from_reduce = fromReduce.getFullYear() + '-' + month
      }
      if (data.to_reduce) {
        let toReduce = new Date(data.to_reduce)
        let month = toReduce.getMonth() + 1
        if (month < 10) month = '0' + month
        this.dependant.to_reduce = toReduce.getFullYear() + '-' + month
      }
      // if (data.fileCmndUser) this.dependant.fileCmndUser = data.fileCmndUser
      if (data.fileCmndDependant) this.dependant.fileCmndDependant = data.fileCmndDependant
      if (data.fileBirthCertificate) this.dependant.fileBirthCertificate = data.fileBirthCertificate
      if (data.fileInabilityToWork) this.dependant.fileInabilityToWork = data.fileInabilityToWork
      if (data.fileHousehold) this.dependant.fileHousehold = data.fileHousehold
      if (data.fileXNNPTTNCN) this.dependant.fileXNNPTTNCN = data.fileXNNPTTNCN
      if (data.fileDKNPT) this.dependant.fileDKNPT = data.fileDKNPT
      if (data.fileAuthority) this.dependant.fileAuthority = data.fileAuthority
      if (data.personal_id_number) this.dependant.personal_id_number = data.personal_id_number
    },

    resetForm () {
      this.dependant.dependantId = null
      if (!this.dependant.staff_code || this.curEdit) this.dependant.master_profile_id = null
      this.dependant.staff_code = null
      this.dependant.tax_iden_number = null
      this.dependant.fullname = null
      this.dependant.birthday = ''
      this.dependant.age = null
      this.dependant.gender = null
      this.dependant.personal_id_number = null
      this.dependant.relationship = null
      this.dependant.number_gks = null
      this.dependant.number_book_gks = null
      this.dependant.provinceId = null
      this.dependant.districtId = null
      this.dependant.communeId = null
      this.dependant.from_reduce = ''
      this.dependant.to_reduce = ''
      // this.dependant.fileCmndUser = null
      this.dependant.fileCmndDependant = null
      this.dependant.fileBirthCertificate = null
      this.dependant.fileInabilityToWork = null
      this.dependant.fileHousehold = null
      this.dependant.fileXNNPTTNCN = null
      this.dependant.fileDKNPT = null
      this.dependant.fileAuthority = null
    },

    resetBirthForm () {
      this.dependant.number_gks = null
      this.dependant.number_book_gks = null
      this.dependant.provinceId = null
      this.dependant.districtId = null
      this.dependant.communeId = null
    },

    downloadFile (fileType = null) {
      if (!fileType || !this.linkFile[fileType]) {
        helper.showMessage('không tồn tại link đường đẫn cho file này, liên hệ với IT để được hỗ trợ !', 'warning')
        return
      }
      window.open(this.linkFile[fileType], '_blank')
    },

    checkUsername: debounce(function (query) {
      if (query.length < 5) return
      dependantService.checkUserByStaffCode({staff_code: query})
        .then(res => {
          if (res.data.success) {
            this.validStaffCode = true
            this.dependant.master_profile_id = res.data.data.master_profile_id
            this.noti = ''
            this.infoUserSuccess = 'Người nộp thuế : ' + res.data.data.name + '( ' + res.data.data.birthday + ' )'
          } else {
            this.dependant.master_profile_id = null
            this.validStaffCode = false
            this.noti = 'Mã nhân viên nộp thuế không đúng!'
          }
        })
    }, 500),

    checkDependantByName () {
      if (!this.dependant.master_profile_id || !this.dependant.fullname) return
      let param = {
        master_profile_id: this.dependant.master_profile_id,
        dependantName: this.dependant.fullname
      }
      dependantService.checkDependantByName(param)
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.id !== this.curEdit) this.existDependant = true
          } else this.existDependant = false
        })
        .catch(e => {
          this.existDependant = false
          console.log(e)
        })
    },

    checkDependantByMst: debounce(function (query) {
      if (query.length !== 10) return
      let param = {
        mst: query
      }
      dependantService.checkDependantByMst(param)
        .then(res => {
          if (res.data.success && res.data.data) {
            let mst = res.data.data
            if (!mst.ErpDependantPeople && !mst.MasterProfile) {
              this.validMstDependant = true
              return
            }
            if (mst.ErpDependantPeople.tax_iden_number === query) {
              this.validMstDependant = false
              this.note.tax = 'Người phụ thuộc với MST tương ứng đã tồn tại !'
            }
            if (mst.MasterProfile.tax_iden_number === query) {
              this.validMstDependant = false
              this.note.tax = 'Nhập MST của Người phụ thuộc nếu có, không nhập MST của người nộp thuế !'
            }
          } else this.validMstDependant = true
        })
        .catch(e => {
          console.log(e)
          this.validMstDependant = true
        })
    }, 500),

    checkDependantByCMND: debounce(function (query) {
      if (![9, 12].includes(query.length)) return
      let param = {
        CMND: this.dependant.personal_id_number
      }
      dependantService.checkDependantByCMND(param)
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.id !== this.curEdit) this.validCMNDDependant = true
          else this.validCMNDDependant = false
        })
    }, 500),

    addDependant () {
      if (this.checkDataUpdate()) {
        this.addBtnDisabled = true
        let dataUpdate = {}
        for (let key in this.dependant) {
          if (this.dependant[key] === null || this.dependant[key] === '' || this.dependant[key] === []) continue
          dataUpdate[key] = this.dependant[key]
        }
        let dataSend = new FormData()
        Object.keys(dataUpdate).forEach(key => {
          if (key.indexOf('file') === 0) {
            for (let i = 0; i < dataUpdate[key].length; i++) {
              dataSend.append(key + '[' + i + ']', dataUpdate[key][i])
            }
          } else if (key === 'birthday' || key === 'from_reduce' || key === 'to_reduce') {
            let date = new Date(dataUpdate[key])
            dataSend.append(key, date.toISOString().split('T')[0])
          } else if (dataUpdate[key] !== null) dataSend.append(key, dataUpdate[key])
        })
        dependantService.addDependantPerson(dataSend)
          .then(res => {
            if (res.data.success) {
              helper.showMessage(res.data.message, 'success')
              this.$emit('updateOk')
              this.$bvModal.hide('update-dependant-person')
            } else {
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch(e => {
            helper.showMessage('Các file tải lên vượt quá dung lượng cho phép (>15MB). Vui lòng kiểm tra lại.', 'warning')
            console.log(e)
          })
          .then(_ => {
            this.addBtnDisabled = false
          })
      } else {
        alert('Cần nhập đúng và đầy đủ thông tin cần thiết !')
      }
    },

    getDependant (dependant) {
      if (!dependant) {
        helper.showMessage('không có ID người phụ thộc cần lấy thông tin !', 'warning')
        return
      }
      this.loading = true
      dependantService.getDependantById({ dependantId: dependant })
        .then(res => {
          console.log(res.data.data)
          if (res.data.success) this.setForm(res.data.data)
          else helper.showMessage(res.data.message || 'Không lấy được thông tin NPT !', 'warning')
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, không lấy được thông tin NPT !', 'warning')
        })
        .then(_ => {
          this.loading = false
        })
    },

    handleSelectedProvince (option) {
      this.dependant.provinceId = option ? option.code : ''
    },

    handleSelectedDistrict (option) {
      this.dependant.districtId = option ? option.code : ''
    },

    handleSelectedCommune (option) {
      this.dependant.communeId = option ? option.code : ''
    }
  }
}
</script>

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
</style>
<style>
  .invalid-input {
    border-color: #d9534f;
  }
  .invalid-input:focus {
    border-color: #d9534f;
    box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.25) !important;
  }
</style>
