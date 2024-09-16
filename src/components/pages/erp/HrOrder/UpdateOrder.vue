<template>
  <div class="small-scrollbar multiselect-ghtk">
    <div class="mb-2 header-form" v-loading="loading.orderInfo">
      <b-row>
        <b-col md="6">
          <h4 v-show="!modalStyle">Thay đổi BHXH, BHYT, Hợp đồng</h4>
          <div v-if="showAction(order) && flowAction[duty] && !isRelateOrder">
            <span v-for="(btnAction, key) in flowAction[duty][order.status] || []" :key="key + '_btn'">
              <b-btn
                variant="outline-ghtk"
                @click="checkStatusUpdate(btnAction.action)"
                class="mr-1"
                v-if="!btnAction.order_group || btnAction.order_group.includes(order.order_group)"
              >
                {{ btnAction.text || (statusDesc[btnAction.action] && statusDesc[btnAction.action].desc) }}
              </b-btn>
            </span>
          </div>
          <div v-if="order.status === 'co_ket_qua' && curUser && curUser.User && curUser.User.id && order.created_by && +order.created_by.id === +curUser.User.id">
            <b-btn
              variant="outline-ghtk"
              @click="checkStatusUpdate('nhan_ban_giao')"
              class="w-25"
            >
              Đã nhận bàn giao/thanh toán
            </b-btn>
          </div>
        </b-col>
        <b-col md="6" class="text-right">
          <b-btn variant="light" :to="{ name: 'list-order' }" v-show="!modalStyle"><i class="fas fa-arrow-left"></i> Danh sách đề xuất</b-btn>
          <b-btn variant="ghtk" class="w-25" @click="updateOrder" v-if="allowUpdate && edit" :disabled="!canUpdate">
            {{ order.id ? 'CHỈNH SỬA' : 'ĐỀ XUẤT' }}
          </b-btn>
        </b-col>
      </b-row>
    </div>
    <div class="order-type">
      <b-form-row>
        <b-form-group label="Loại khai báo" class="col-md-3">
          <span slot="label">Loại khai báo <span class="text-danger">*</span></span>
          <select-order-group
            :group-options="orderTypeOption"
            @input="selectGroupOrder"
            :group="order.order_group"
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
            :group-alias="order.order_group"
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
            placeholder=""
          ></select-order-status>
        </b-form-group>
      </b-form-row>
    </div>

    <div class="employee-info">
      <div class="header mb-3 mt-1 font-weight-bold">
        Thông tin người lao động
      </div>
      <div class="position-relative" v-loading="loading.profileInfo">
        <b-alert :show="!!noti.staffCode && !isRelateOrder" variant="warning">
          <b>Lưu ý: </b> <span v-html="noti.staffCode"></span>
        </b-alert>
        <b-form-row>
          <b-form-group class="col-md-3" label="Mã nhân viên" :disabled="!!(profileId || order.id)" v-show="showMpField('staff_code')">
            <span slot="label">Mã nhân viên <span class="text-danger">*</span></span>
            <input
              type="number"
              class="form-control"
              :class="{ 'is-invalid': employee.masterProfile.staff_code === '' }"
              v-model="employee.masterProfile.staff_code"
              @input="checkStaffCode"
            />
          </b-form-group>
          <b-form-group class="col-md-3" label="Họ và tên" disabled v-show="showMpField('fullname')">
            <b-input v-model="employee.masterProfile.fullname"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Trạng thái BHXH hiện tại" disabled v-show="showMpField('insurance_desc')">
            <b-input v-model="employee.insurance.insurance_desc"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Trạng thái MP" disabled v-show="showMpField('mp_status')">
            <b-input v-model="employee.masterProfile.status"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Vị trí" disabled v-show="showMpField('position_name')">
            <input class="form-control" v-model="employee.empProfile.position_name" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Nơi làm việc (kho hiện tại)" disabled v-show="showMpField('station_name')">
            <b-input v-model="employee.user.station_name"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Hình thức làm việc" disabled v-show="showMpField('work_type')">
            <input class="form-control" v-model="employee.user.work_type" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày vào" disabled v-show="showMpField('join_date')">
            <input class="form-control" v-model="employee.masterProfile.join_date" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày thử việc" disabled v-show="showMpField('trial_date')">
            <input class="form-control" v-model="employee.masterProfile.trial_date" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày lương chuẩn" disabled v-show="showMpField('start_date_day')">
            <input class="form-control" v-model="employee.empProfile.start_date_day" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày chính thức" disabled v-show="showMpField('contract_date')">
            <input class="form-control" v-model="employee.masterProfile.contract_date" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Thời gian thử việc (tháng)" disabled v-show="showMpField('trial_time')">
            <input class="form-control" v-model="employee.masterProfile.trial_time" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Chỉ có năm sinh *" v-show="showMpField('birthday_status')">
            <span slot="label">Chỉ có năm sinh <span class="text-danger">*</span></span>
            <b-select
              :options="birthdayStatusOptions"
              v-model="order.additional_info.birthday_status"
              :state="order.additional_info.birthday_status === '' ? false : null"
            ></b-select>
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày sinh" disabled v-show="showMpField('birthday')">
            <b-input v-model="employee.masterProfile.birthday"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Giới tính" disabled v-show="showMpField('gender')">
            <input class="form-control" v-model="employee.masterProfile.gender" />
          </b-form-group>
          <b-form-group class="col-md-3" label="CMND/CCCD" disabled v-show="showMpField('personal_id_number')">
            <b-input v-model="employee.masterProfile.personal_id_number"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Ngày cấp" disabled v-show="showMpField('doi_personal_id_number')">
            <b-input v-model="employee.masterProfile.doi_personal_id_number"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Nơi cấp" disabled v-show="showMpField('poi_personal_id_number')">
            <b-input v-model="employee.masterProfile.poi_personal_id_number"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Tỉnh/ TP thường trú" disabled v-show="showMpField('resident_address_province')">
            <input class="form-control" v-model="employee.masterProfile.resident_address_province" />
          </b-form-group>
          <b-form-group class="col-md-3" label="Quận/ Huyện thường trú" disabled v-show="showMpField('resident_address_district')">
            <b-input v-model="employee.masterProfile.resident_address_district"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Xã/Phường thường trú" disabled v-show="showMpField('resident_address_sub_district')">
            <b-input v-model="employee.masterProfile.resident_address_sub_district"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Chi tiết thường trú" disabled v-show="showMpField('resident_address_detail')">
            <b-input v-model="employee.masterProfile.resident_address_detail"></b-input>
          </b-form-group>
          <b-form-group class="col-md-3" label="Số điện thoại" disabled v-show="showMpField('tel')">
            <input class="form-control" v-model="employee.masterProfile.tel" />
          </b-form-group>
        </b-form-row>
      </div>
    </div>

    <b-alert :show="!!isRelateOrder" variant="warning">
      <b>Vui lòng nhập đủ thông tin cho đề xuất liên quan này</b>
    </b-alert>

    <!-- BHXH  -->
    <div v-show="!order.order_category || order.order_category === 'insurance'">
    <div v-if="order.order_group === 'up'">
      <div class="social-insurance">
        <div class="header mb-3 mt-2 font-weight-bold">
          BHXH
        </div>
        <div>
          <b-form-row>
            <b-form-group class="col-md-3" label="Mã số BHXH (nếu đã có)">
              <input
                type="number"
                class="form-control"
                v-model="order.additional_info.insurance_register"
                @input="validInput(order.additional_info, 'insurance_register', { length: 10, min: 0 })"
              />
            </b-form-group>
            <b-form-group class="col-md-3" label="Số sổ BHXH (Với mẫu sổ cũ từ 01/8/2017 về trước)">
              <input
                :disabled="!!order.additional_info.insurance_register"
                type="number"
                class="form-control"
                v-model="order.additional_info.insurance_book_number"
                @input="validInput(order.additional_info, 'insurance_book_number', { length: 10, min: 0 })"
              />
            </b-form-group>
            <b-form-group class="col-md-3" label="Người giữ sổ BHXH">
              <span slot="label">Người giữ sổ BHXH <span class="text-danger">*</span></span>
              <b-select :options="insuranceBookStatusOptions" v-model="order.additional_info.keep_insurance_book_status"></b-select>
            </b-form-group>
            <b-form-group class="col-md-3" label="">
              <span slot="label">Mã hộ gia đình (nếu đã có sổ BHXH) <span class="text-danger" v-show="!!(order.additional_info.insurance_register || order.additional_info.insurance_book_number)">*</span></span>
              <b-input
                v-model="order.additional_info.number_household"
                :state="((order.additional_info.insurance_register || order.additional_info.insurance_book_number) && !order.additional_info.number_household) ? false : null"
              ></b-input>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group class="col-md-3" label="Tăng từ tháng, năm">
              <span slot="label">Tăng từ tháng, năm <span class="text-danger">*</span></span>
              <Datepicker
                :language="language.vi"
                v-model="order.from_month"
                format='MM/yyyy'
                placeholder="mm/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                minimum-view="month"
              />
            </b-form-group>
            <b-form-group class="col-md-3" label="Tăng đến tháng, năm">
              <span slot="label">Tăng đến tháng, năm</span>
              <Datepicker
                :language="language.vi"
                v-model="order.to_month"
                format='MM/yyyy'
                placeholder="mm/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                minimum-view="month"
                @input="checkToMonth"
              />
            </b-form-group>
            <b-form-group class="col-md-3" label="Mức đóng tiền lương" disabled>
              <input type="text" class="form-control" v-model="employee.salary.salary" />
            </b-form-group>
            <b-form-group class="col-md-3" label="Tỷ lệ đóng (%)">
              <input type="number" class="form-control" v-model="order.additional_info.pay_rate" min="0" max="100" />
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group class="col-md-3" label="Phụ cấp trách nhiệm">
              <input class="form-control" v-model="order.additional_info.resp_allowance" @input="inputMoney(order.additional_info, 'resp_allowance')">
            </b-form-group>
            <b-form-group class="col-md-3" label="Các khoản bổ sung">
              <input type="text" class="form-control" v-model="order.additional_info.complementary_allowance" @input="inputMoney(order.additional_info, 'complementary_allowance')"/>
            </b-form-group>
            <b-form-group class="col-md-3" label="Mã vùng sinh sống">
              <input
                class="form-control"
                type="number"
                v-model="order.additional_info.area_code"
                @input="validInput(order.additional_info, 'area_code', { min: 0, max: 4 })"
              />
            </b-form-group>
            <b-form-group class="col-md-3" label="Mã vùng lương tối thiểu" :disabled="true">
              <b-select :options="salaryAreaOptions" v-model="employee.salary.min_salary_area"></b-select>
            </b-form-group>
          </b-form-row>
        </div>
      </div>

      <div class="medical-insurance">
        <div class="header mb-3 mt-2 font-weight-bold">
          BHYT
        </div>
        <div>
          <b-form-row>
            <b-form-group label="Tỉnh/TP nơi KCB" class="col-md-4">
              <SelectAdministrativeProvince
                :province-code="order.additional_info.province_hospital_register"
                @select="val => (order.additional_info.province_hospital_register = val ? val.code : null)"
              />
            </b-form-group>
            <b-form-group label="Bệnh viện đăng kí KCB" class="col-md-4">
              <SelectHospital
                :province-code="order.additional_info.province_hospital_register"
                :hospitalCode="order.additional_info.hospital_register"
                @select="val => (order.additional_info.hospital_register = val ? val.code : null)"
              />
            </b-form-group>
          </b-form-row>
        </div>
      </div>

      <div class="contract">
        <div class="header mb-3 mt-2 font-weight-bold">
          Thông tin hợp đồng
        </div>
        <div>
          <b-form-row>
            <b-form-group class="col-md-4" label="Loại hợp đồng lao động" disabled>
              <input type="text" class="form-control" v-model="employee.contract.contract_type_name" />
            </b-form-group>
            <b-form-group class="col-md-4" label="Ngày bắt đầu hợp đồng lao động" disabled>
              <input type="text" class="form-control" :value="formatDate(employee.contract.start_date)" />
            </b-form-group>
            <b-form-group class="col-md-4" label="Ngày kết thúc hợp đồng lao động" disabled>
              <input type="text" class="form-control" :value="formatDate(employee.contract.end_date)" />
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group class="col-md-4" label="Vị trí" disabled>
              <input type="text" class="form-control" v-model="employee.user.group_name" />
            </b-form-group>
            <b-form-group class="col-md-4" label="Ngày bắt đầu giữ vị trí" disabled>
              <input type="text" class="form-control" :value="formatDate(employee.empProfile.active_date)" />
            </b-form-group>
            <b-form-group class="col-md-4" label="Ngày kết thúc giữ vị trí" disabled>
              <input type="text" class="form-control" :value="formatDate(employee.empProfile.disable_date)" />
            </b-form-group>
          </b-form-row>
        </div>
      </div>

      <div class="family" v-show="showHouseHold">  <!-- Tăng mới cần thông tin gia đình -->
        <div class="header mb-3 mt-2 font-weight-bold">
          Phụ lục gia đình
          <span class="float-right">
            <button class="btn btn-sm btn-outline-ghtk" @click="suggestData">Lấy gợi ý thông tin hộ khẩu</button>
          </span>
        </div>
        <b-form-row>
          <b-form-group class="w-100">
            <div class="input-group">
              <input type="number"
                class="form-control"
                placeholder="Số sổ hộ khẩu"
                v-model="order.additional_info.shk_number"
                @input="validInput(order.additional_info, 'shk_number', { length: 9 })"
              />
              <div class="m-0 w-20">
              <single-select-province
                placeholder="Tỉnh/TP theo hộ khẩu"
                :province-id="order.additional_info.resident_address_province && order.additional_info.resident_address_province.id"
                @handleSelectedProvince="selectValue(...arguments, order.additional_info, 'resident_address_province')"
              />
              </div>
              <div class="m-0 w-20">
              <single-select-district
                placeholder="Quận huyện theo hộ khẩu"
                :province-id="order.additional_info.resident_address_province && order.additional_info.resident_address_province.id"
                :district-id="order.additional_info.resident_address_district && order.additional_info.resident_address_district.id"
                @handleSelectedDistrict="selectValue(...arguments, order.additional_info, 'resident_address_district')"
              />
              </div>
              <div class="m-0 w-20">
              <single-select-sub-district
                placeholder="Phường/xã theo hộ khẩu"
                :district-id="order.additional_info.resident_address_district && order.additional_info.resident_address_district.id"
                :sub-district-id="order.additional_info.resident_address_commune && order.additional_info.resident_address_commune.id"
                @handleSelectedSubDistrict="selectValue(...arguments, order.additional_info, 'resident_address_commune')"
              />
              </div>
              <input type="text" class="form-control" placeholder="Địa chỉ chi tiết theo hộ khẩu" v-model.trim="order.additional_info.resident_address_detail" />
            </div>
          </b-form-group>
          <table class="table table-bordered table-sm">
            <thead>
              <tr class="bg-light">
                <th class="text-center w-10">Họ tên</th>
                <th class="text-center w-15">Chỉ có tháng năm</th>
                <th class="text-center w-20">Ngày tháng năm sinh</th>
                <th class="text-center w-10">Giới tính</th>
                <th class="text-center w-10">Quốc tịch</th>
                <th class="text-center w-10">Dân tộc</th>
                <th class="text-center w-10">Mối QH với chủ hộ</th>
                <th class="text-center w-15">CMND</th>
                <th class="text-center w-5"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, memIdx) in order.household" :key="memIdx">
                <td>
                  <input type="text" v-model.trim="member.fullname" class="form-control" :disabled="!!member.id">
                </td>
                <td>
                  <b-select :options="birthdayStatusOptions" v-model="member.birthday_status" :disabled="!!member.id"></b-select>
                </td>
                <td>
                  <Datepicker
                    :disabled="!!member.id"
                    :language="language.vi"
                    v-model="member.birthday"
                    format='dd/MM/yyyy'
                    placeholder="dd/mm/yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                  />
<!--                  <input class="form-control" type="date" v-model="member.birthday">-->
                </td>
                <td>
                  <b-select :options="genderOptions" v-model="member.gender" :disabled="!!member.id"></b-select>
                </td>
                <td>
                  <b-select :options="nationalityOptions" v-model="member.nationality" :disabled="!!member.id"></b-select>
                </td>
                <td>
                  <select-ethnic
                    :disabled="!!member.id"
                    :ethnic-value="member.ethnic"
                    @handleSelectedEthnic="op => { member.ethnic = op ? op.value : 'Vietnam' }"
                    placeholder=""
                  ></select-ethnic>
                </td>
                <td>
                  <single-select-relation v-model="member.relation" :disabled="!!member.id"></single-select-relation>
                </td>
                <td>
                  <input :disabled="!!member.id" type="number" v-model="member.personal_id" class="form-control" @input="validInput(member, 'personal_id', { length: 12 })">
                </td>
                <td class="text-center align-middle">
                  <b-btn variant="outline-danger" size="sm" title="Xóa thành viên" @click="deleteFamilyMember(memIdx)"><i class="fas fa-times"></i></b-btn>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div class="text-left">
                    <b-btn
                      size="sm"
                      variant="outline-ghtk"
                      @click="addFamilyMember()"
                      :disabled="!canAddMember()"><i class="fas fa-plus"
                    ></i> Thêm thành viên</b-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </b-form-row>
      </div>
    </div>
    <div v-else>
      <div class="insurance">
        <div class="header mb-3 mt-2 font-weight-bold">
          BHXH, BHYT
        </div>
        <div>
          <b-form-row>
            <b-form-group disabled label="Mã số BHXH" class="col-md-4">
              <b-input v-model="employee.masterProfile.insurance_register"></b-input>
            </b-form-group>
            <b-form-group disabled label="Mã số BHYT" class="col-md-4">
              <b-input v-model="employee.masterProfile.health_ins_number"></b-input>
            </b-form-group>
          </b-form-row>
        </div>
      </div>
      <div class="data-type-order">
        <div class="header mb-3 mt-2 font-weight-bold">
          {{ `${order.group_name || ''} - ${order.order_type_name || ''}`  }}
        </div>
        <b-form-row class="time-change" v-if="showTimeChange()">
          <b-form-group class="col-md-4">
            <span slot="label" id="popover-date-modify">
              {{ order.order_group === 'down' ? 'Ngày bắt đầu nghỉ' : 'Ngày bắt đầu điều chỉnh' }}
              <span class="text-danger">*</span>
              <i class="fas fa-info-circle" v-show="order.order_group === 'modify'"></i>
            </span>
            <b-popover target="popover-date-modify" triggers="hover" v-if="order.order_group === 'modify'">
              <b>Ngày nhân viên chuyển công tác, thay đổi mức lương...</b>
            </b-popover>
            <Datepicker
              :language="language.vi"
              v-model="order.start_date"
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
          <b-form-group class="col-md-4" label="Từ tháng">
            <span slot="label">Từ tháng <span class="text-danger">*</span></span>
            <Datepicker
              :language="language.vi"
              v-model="order.from_month"
              format='MM/yyyy'
              placeholder="mm/yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              minimum-view="month"
            />
          </b-form-group>
          <b-form-group class="col-md-4" label="Đến tháng">
            <Datepicker
              :language="language.vi"
              v-model="order.to_month"
              format='MM/yyyy'
              placeholder="mm/yyyy"
              :full-month-name="true"
              :bootstrapStyling="true"
              :monday-first="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              minimum-view="month"
            />
          </b-form-group>
        </b-form-row>
        <!-- Chế độ -->
        <div v-if="order.order_group === 'regime'">
          <!-- Thông tin ngày bát đầu nghỉ, đi làm, ... -->
          <b-form-row>
            <b-form-group class="col-md-4" label="Từ ngày">
              <span slot="label" id="popover-regime-from">Từ ngày <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-regime-from" triggers="hover">
                <b>Ghi theo giấy ra viện</b>
              </b-popover>
              <Datepicker
                :language="language.vi"
                v-model="order.regime_data.from"
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
            <b-form-group class="col-md-4" label="Đến ngày">
              <span slot="label" id="popover-regime-to">Đến ngày <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-regime-to" triggers="hover">
                <b>Ghi theo giấy ra viện</b>
              </b-popover>
              <Datepicker
                :language="language.vi"
                v-model="order.regime_data.to"
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
            <b-form-group class="col-md-4" label="Tổng số ngày">
              <span slot="label" id="popover-regime-total">Tổng số ngày <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-regime-total" triggers="hover">
                <b>= Đến ngày - Từ ngày - (ngày Chủ nhật, ngày lễ, tết) - (ngày phép NLĐ đã dùng)</b>
              </b-popover>
              <input type="number" class="form-control" min="0" v-model="order.regime_data.total">
            </b-form-group>
            <b-form-group class="col-md-4" label="Ngày bắt đầu nghỉ tại công ty">
              <span slot="label" id="popover-pause-from">Ngày bắt đầu nghỉ tại công ty <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-pause-from" triggers="hover">
                <b>Ghi theo ngày công thực tế</b>
              </b-popover>
              <Datepicker
                :language="language.vi"
                v-model="order.regime_data.pause_from"
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
            <b-form-group class="col-md-4" label="Ngày đi làm lại">
              <span slot="label" id="popover-pause-to">Ngày đi làm lại <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-pause-to" triggers="hover">
                <b>Ghi theo ngày công thực tế</b>
              </b-popover>
              <Datepicker
                :language="language.vi"
                v-model="order.regime_data.pause_to"
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
            <b-form-group class="col-md-4" label="Tổng số ngày">
              <span slot="label" id="popover-pause-total">Tổng số ngày <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-pause-total" triggers="hover">
                <b>= Đến ngày - Từ ngày - (ngày Chủ nhật, ngày lễ, tết) - (ngày phép NLĐ đã dùng)</b>
              </b-popover>
              <input type="number" class="form-control" min="0" v-model="order.regime_data.pause_total">
            </b-form-group>
          </b-form-row>
          <!-- Thông tin bổ xung chế độ con ốm -->
          <b-form-row v-if="+order.order_type_id === 25">
            <b-form-group class="col-md-4" label="Mã thẻ BHYT của con">
              <input type="text" class="form-control" min="0" v-model="order.regime_data.child_health_ins_number" @input="validInput(order.regime_data, 'child_health_ins_number', { length: 15 })" />
            </b-form-group>
          </b-form-row>
          <!-- thông tin bổ xung chế độ thai sản -->
          <b-form-row v-if="+order.order_type_id === 24 || +order.order_type_id === 26">
            <b-form-group class="col-md-4" label="Ngày sinh con">
              <span slot="label" id="popover-birth-date">Ngày sinh con <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-birth-date" triggers="hover">
                <b>Ghi theo giấy khai sinh hoặc chứng sinh</b>
              </b-popover>
              <Datepicker
                :language="language.vi"
                v-model="order.regime_data.birth_date"
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
            <b-form-group class="col-md-4" label="Số lượng con">
              <span slot="label" id="popover-num-children">Số lượng con <i class="fas fa-info-circle"></i></span>
              <b-popover target="popover-num-children" triggers="hover">
                <b>Ghi theo giấy ra viện</b>
              </b-popover>
              <input type="number" min="0" class="form-control" v-model="order.regime_data.num_children" @input="validInput(order.regime_data, 'num_children', { min: 0, max: 5 })" />
            </b-form-group>
            <b-form-group class="col-md-4" label="Hình thức sinh">
              <span slot="label">Hình thức sinh</span>
              <b-select v-model="order.regime_data.birth_type" :options="birthTypeOptions"></b-select>
            </b-form-group>
            <!-- Thai sản nam cần CMND/CCCD vợ -->
            <b-form-group class="col-md-4" label="CMND/CCCD vợ" v-if="+order.order_type_id === 24">
              <span slot="label">CMND/CCCD vợ</span>
              <input type="number" class="form-control" v-model="order.regime_data.wife_personal_number" @input="validInput(order.regime_data, 'wife_personal_number', { length: 12 })">
            </b-form-group>
          </b-form-row>
        </div>
        <!-- thông tin Điều chỉnh -->
        <div class="data-change">
          <b-form-row v-if="modifyConfig[order.order_type_id]">
            <!-- old value -->
            <b-form-group :class="modifyConfig[order.order_type_id].oldInput.class" :disabled="modifyConfig[order.order_type_id].oldInput.disable">
              <span slot="label">{{ modifyConfig[order.order_type_id].oldInput.label }}</span>
              <!-- Mức đóng BHXH -->
              <input type="text" v-model="order.old_value" class="form-control" v-if="+order.order_type_id === 7" @input="inputMoney(order, 'old_value')" />
              <!-- Tỉ lệ đóng BHXH -->
              <input type="number" v-model="order.old_value" class="form-control" v-if="+order.order_type_id === 32" @input="validInput(order, 'old_value', { min: 0, max: 32 })" />
              <!-- Điều chỉnh CMND/CCCD -->
              <input type="number" v-model="order.old_value" class="form-control" v-if="+order.order_type_id === 28" @input="validInput(order, 'old_value', { length: 12 })" />
              <!-- Cập nhật số điện thoại -->
              <input type="number" v-model="order.old_value" class="form-control" v-if="+order.order_type_id === 29" @input="validInput(order, 'old_value', { length: 10 })" />
              <!-- Quốc tịch, Họ và tên -->
              <input v-model.trim="order.old_value" class="form-control" v-if="[11, 13].includes(+order.order_type_id)" />
              <!-- Vị trí -->
              <single-select-position
                v-if="[9].includes(+order.order_type_id)"
                :position-job="order.old_value"
              ></single-select-position>
              <!-- Giới tính -->
              <select-gender
                v-if="[10].includes(+order.order_type_id)"
                @change="op => (order.old_value = op ? op.value : null)"
                :hide-select="false"
                :gender="order.old_value"
              ></select-gender>
              <!-- Ngày sinh -->
              <Datepicker
                v-if="[12].includes(+order.order_type_id)"
                :language="language.vi"
                v-model="order.old_value"
                format='dd/MM/yyyy'
                placeholder="dd/mm/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
              <!-- Nơi làm việc -->
              <single-select-station
                v-if="[8].includes(+order.order_type_id)"
                :station-id="order.old_value"
                @handleSelectedStation="op => (order.old_value = op ? op.id : null)"
              ></single-select-station>
              <!-- Địa chỉ thường chú -->
              <div class="input-group" v-if="[31].includes(+order.order_type_id)">
                <single-select-province
                  custom-class="m-0 w-25"
                  placeholder="Tỉnh/TP theo hộ khẩu"
                  :province-id="order.additional_info.old_resident_province && order.additional_info.old_resident_province.id"
                  @handleSelectedProvince="selectValue(...arguments, order.additional_info, 'old_resident_province')"
                />
                <single-select-district
                  custom-class="m-0 w-25"
                  placeholder="Quận huyện theo hộ khẩu"
                  :province-id="order.additional_info.old_resident_province && order.additional_info.old_resident_province.id"
                  :district-id="order.additional_info.old_resident_district && order.additional_info.old_resident_district.id"
                  @handleSelectedDistrict="selectValue(...arguments, order.additional_info, 'old_resident_district')"
                />
                <single-select-sub-district
                  custom-class="m-0 w-25"
                  placeholder="Phường/xã theo hộ khẩu"
                  :district-id="order.additional_info.old_resident_district && order.additional_info.old_resident_district.id"
                  :sub-district-id="order.additional_info.old_resident_commune && order.additional_info.old_resident_commune.id"
                  @handleSelectedSubDistrict="selectValue(...arguments, order.additional_info, 'old_resident_commune')"
                />
                <input type="text" class="form-control" placeholder="Chi tiết (chỉ nhập số nhà, tên đường)" v-model.trim="order.additional_info.old_resident_detail">
              </div>
            </b-form-group>
            <!-- new value -->
            <b-form-group :class="modifyConfig[order.order_type_id].newInput.class" :disabled="modifyConfig[order.order_type_id].newInput.disable">
              <span slot="label">{{ modifyConfig[order.order_type_id].newInput.label }}</span>
              <!-- Mức đóng BHXH -->
              <input type="text" v-model="order.new_value" class="form-control" v-if="+order.order_type_id === 7" @input="inputMoney(order, 'new_value')"/>
              <!-- Tỉ lệ đóng BHXH -->
              <input type="number" v-model="order.new_value" class="form-control" v-if="+order.order_type_id === 32" @input="validInput(order, 'new_value', { min: 0, max: 32 })" />
              <!-- Điều chỉnh CMND/CCCD -->
              <input type="number" v-model="order.new_value" class="form-control" v-if="+order.order_type_id === 28" @input="validInput(order, 'new_value', { length: 12 })" />
              <!-- Cập nhật số điện thoại -->
              <input type="number" v-model="order.new_value" class="form-control" v-if="+order.order_type_id === 29" @input="validInput(order, 'new_value', { length: 10 })" />
              <!-- Quốc tịch, Họ và tên -->
              <input v-model.trim="order.new_value" class="form-control" v-if="[11, 13].includes(+order.order_type_id)" />
              <!-- Vị trí -->
              <single-select-position
                v-if="[9].includes(+order.order_type_id)"
                :position-job="order.new_value"
                @handleSelectedPosition="selectPosition"
              ></single-select-position>
              <!-- Giới tính -->
              <select-gender
                v-if="[10].includes(+order.order_type_id)"
                @change="op => (order.new_value = op ? op.value : null)"
                :gender="order.new_value"
                :hide-select="false"
              ></select-gender>
              <!-- Ngày sinh -->
              <Datepicker
                v-if="[12].includes(+order.order_type_id)"
                :language="language.vi"
                v-model="order.new_value"
                format='dd/MM/yyyy'
                placeholder="dd/mm/yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
              <!-- Nơi làm việc -->
              <single-select-station
                v-if="[8].includes(+order.order_type_id)"
                :station-id="order.new_value"
                @handleSelectedStation="op => (order.new_value = op ? op.id : null)"
              ></single-select-station>
              <!-- Địa chỉ thường chú -->
              <div class="input-group" v-if="[31].includes(+order.order_type_id)">
                <single-select-province
                  custom-class="m-0 w-25"
                  placeholder="Tỉnh/TP theo hộ khẩu"
                  :province-id="order.additional_info.new_resident_province && order.additional_info.new_resident_province.id"
                  @handleSelectedProvince="selectValue(...arguments, order.additional_info, 'new_resident_province')"
                />
                <single-select-district
                  custom-class="m-0 w-25"
                  placeholder="Quận huyện theo hộ khẩu"
                  :province-id="order.additional_info.new_resident_province && order.additional_info.new_resident_province.id"
                  :district-id="order.additional_info.new_resident_district && order.additional_info.new_resident_district.id"
                  @handleSelectedDistrict="selectValue(...arguments, order.additional_info, 'new_resident_district')"
                />
                <single-select-sub-district
                  custom-class="m-0 w-25"
                  placeholder="Phường/xã theo hộ khẩu"
                  :district-id="order.additional_info.new_resident_district && order.additional_info.new_resident_district.id"
                  :sub-district-id="order.additional_info.new_resident_commune && order.additional_info.new_resident_commune.id"
                  @handleSelectedSubDistrict="selectValue(...arguments, order.additional_info, 'new_resident_commune')"
                />
                <input type="text" class="form-control" placeholder="Chi tiết (chỉ nhập số nhà, tên đường)" v-model.trim="order.additional_info.new_resident_detail">
              </div>
            </b-form-group>
          </b-form-row>
          <div v-else-if="+order.order_type_id === 30"> <!-- Điều chỉnh nơi đăng ký khám chữa bệnh -->
            <b-form-row>
              <b-form-group class="col-md-4" label="Tỉnh nơi ĐK KCB cũ">
                <SelectAdministrativeProvince
                  :province-code="order.additional_info.province_hospital_register_old"
                  @select="val => (order.additional_info.province_hospital_register_old = val ? val.code : null)"
                />
              </b-form-group>
              <b-form-group class="col-md-4" label="Nơi ĐK KCB cũ">
                <SelectHospital
                  :province-code="order.additional_info.province_hospital_register_old"
                  :hospitalCode="order.old_value"
                  @select="val => (order.old_value = val ? val.code : null)"
                />
              </b-form-group>
            </b-form-row>
            <b-form-row>
              <b-form-group class="col-md-4" label="Tỉnh nơi ĐK KCB mới">
                <SelectAdministrativeProvince
                  :province-code="order.additional_info.province_hospital_register_new"
                  @select="val => (order.additional_info.province_hospital_register_new = val ? val.code : null)"
                />
              </b-form-group>
              <b-form-group class="col-md-4" label="Nơi ĐK KCB mới">
                <SelectHospital
                  :province-code="order.additional_info.province_hospital_register_new"
                  :hospitalCode="order.new_value"
                  @select="val => (order.new_value = val ? val.code : null)"
                />
              </b-form-group>
            </b-form-row>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- Contract -->
    <div v-show="order.order_category === 'contract'">
    <div v-show="order.order_group === 'contract'">
      <div class="contract-info">
        <div class="header mb-3 mt-2 font-weight-bold">
          {{ `${order.group_name || ''} - ${order.order_type_name || ''}` }}
        </div>
        <b-form-row>
          <b-form-group class="col-md-3">
            <span slot="label">Loại hợp đồng <span class="text-danger">*</span></span>
            <select-contract-type
              :disabled="order.order_type_alias !== 'new_contract'"
              @select="selectContractType"
              :contract-type="order.contract_info.type_contract"
            ></select-contract-type>
          </b-form-group>
          <b-form-group class="col-md-3">
            <span slot="label">Ngày bắt đầu <span class="text-danger">*</span></span>
            <Datepicker
              :disabled="order.order_type_alias !== 'new_contract'"
              :language="language.vi"
              v-model="order.contract_info.start_date"
              format='dd/MM/yyyy'
              placeholder="dd/mm/yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="order.order_type_alias === 'new_contract'"
              @selected="suggestEndDateContract"
            />
          </b-form-group>
          <b-form-group class="col-md-3">
            <span slot="label">Ngày kết thúc <span class="text-danger" v-show="requireContractField.includes('end_date')">*</span></span>
            <Datepicker
              :disabled="order.order_type_alias !== 'new_contract'"
              :language="language.vi"
              v-model="order.contract_info.end_date"
              format='dd/MM/yyyy'
              placeholder="dd/mm/yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="order.order_type_alias === 'new_contract'"
              :disabled-dates="{to: new Date(order.contract_info.start_date)}"
            />
          </b-form-group>
          <b-form-group class="col-md-3">
            <span slot="label">Ngày ký</span>
            <Datepicker
              :disabled="order.order_type_alias !== 'new_contract'"
              :language="language.vi"
              v-model="order.contract_info.contract_date"
              format='dd/MM/yyyy'
              placeholder="dd/mm/yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="order.order_type_alias === 'new_contract'"
            />
          </b-form-group>
          <b-form-group class="col-md-12" v-show="order.order_type_alias === 'new_contract'">
            <span slot="label">Lý do ký kết</span>
            <input
              list="contract-reason-option"
              class="form-control"
              v-model.trim="order.note"
            />
            <datalist id="contract-reason-option">
              <option>Người lao động mới</option>
              <option>Gia hạn hợp đồng</option>
              <option>Thay đổi loại hợp đồng</option>
            </datalist>
          </b-form-group>
        </b-form-row>
        <!-- alert old contract -->
        <b-alert variant="warning" :show="!!noti.oldContract">
          <span v-html="noti.oldContract"></span><br/>
          <b-form-group label="Vui lòng chọn phương án xử lý hợp đồng cũ:" v-slot="{ ariaDescribedby }" v-if="canUpdate">
            <b-form-radio-group
              id="radio-group-resolve-old-contract"
              v-model="oldContractResolve.plan"
              :aria-describedby="ariaDescribedby"
              name="radio-group-resolve-old-contract"
              stacked
              :state="!oldContractResolve.plan ? false : null"
            >
              <!-- <b-form-radio value="update">
                Thanh lý hợp đồng cũ
                <input type="date" v-model="oldContractResolve.date" class="simple-input" />
              </b-form-radio> -->
              <!-- <b-form-radio value="delete">Xóa hợp đồng cũ</b-form-radio> -->
            </b-form-radio-group>
          </b-form-group>
          <b v-else>Không thể tạo đề xuất !</b>
        </b-alert>
      </div>
      <div class="salary-allowance">
        <div class="header mb-3 mt-2 font-weight-bold">
          Lương và phúc lợi
        </div>
        <b-alert :show="!!(noti.salary)">
          <b>Thông tin:</b> {{ noti.salary }} <span v-show="editSalalary">, bạn có thể chỉnh sửa lại.</span>
          <span class="float-right">
            <button class="btn btn-sm btn-outline-ghtk" @click="assignOldData()" v-if="employee.contract.id">
              Lấy theo HĐ cũ
            </button>
            <button class="btn btn-sm btn-outline-ghtk" @click="getAreaSalary(order.contract_info.start_date || order.contract_info.effect_date)">
              Lấy theo lương vùng
            </button>
          </span>
        </b-alert>
        <!-- Lý do, ngày bắt đầu thay đổi lương -->
        <b-form-row class="reason-change-salary" v-if="order.order_type_alias === 'new_appendix'">
          <b-form-group class="col-md-6" label="Lý do thay đổi lương, phụ cấp">
            <span slot="label">Lý do thay đổi lương, phụ cấp <span class="text-danger">*</span></span>
            <input class="form-control" v-model.trim="order.note" list="appendix-reason-option"/>
            <datalist id="appendix-reason-option">
              <option>Chưa có thông tin lương, phụ cấp</option>
              <option>Thay đổi vùng lương tối thiểu</option>
              <option>Tăng chức</option>
              <option>Giáng chức</option>
              <option>Thông tin lương sai</option>
            </datalist>
          </b-form-group>
          <b-form-group class="col-md-6">
            <span slot="label">Ngày lương bắt đầu hiệu lực <span class="text-danger" v-show="requireContractField.includes('effect_date')">*</span></span>
            <Datepicker
              :language="language.vi"
              v-model="order.contract_info.effect_date"
              format='dd/MM/yyyy'
              placeholder="dd/mm/yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :disabled-dates="{
                to: new Date(employee.salary.effect_date || employee.contract.start_date),
                from: employee.contract.end_date && new Date(employee.contract.end_date)
              }"
              @selected="getAreaSalary"
            />
          </b-form-group>
        </b-form-row>
        <!-- Thông tin lương -->
        <b-form-row class="salary">
          <b-form-group class="col-md-3">
            <span slot="label">Lương thử việc <span class="text-danger" v-show="requireContractField.includes('trial_salary')">*</span></span>
            <input type="text" class="form-control" v-model="order.contract_info.trial_salary" @input="inputMoney(order.contract_info, 'trial_salary')" />
          </b-form-group>
          <b-form-group class="col-md-3" :disabled="!editSalalary">
            <span slot="label">Lương chính thức <span class="text-danger" v-show="requireContractField.includes('salary')">*</span></span>
            <input type="text" class="form-control" v-model="order.contract_info.salary" @input="inputMoney(order.contract_info, 'salary')" />
          </b-form-group>
          <b-form-group
            class="col-md-3"
            :disabled="!order.contract_info.salary_date && order.contract_info.has_kpi && !editSalalary"
            v-show="order.order_type_alias === 'new_contract'"
          >
            <span slot="label">Ngày lương chuẩn</span>
            <b-select
              :options="salaryDateOps"
              v-model="order.contract_info.salary_date"
            ></b-select>
          </b-form-group>
          <b-form-group class="col-md-3 text-center input-kpi" disabled>
            <span slot="label">Tính lương theo kpi</span>
            <b-checkbox
              id="checkbox-kpi"
              v-model="order.contract_info.has_kpi"
              name="checkbox-kpi"
              :value="true"
              :unchecked-value="false"
            >
            </b-checkbox>
          </b-form-group>
        </b-form-row>
        <!-- thông tin phụ cấp  -->
        <b-form-row class="allowance">
          <b-form-group class="col-md-2" label="Phụ cấp trách nhiệm">
            <input type="text" class="form-control" v-model="order.contract_info.resp_allowance" @input="inputMoney(order.contract_info, 'resp_allowance')" />
          </b-form-group>
          <b-form-group class="col-md-2" label="Phụ cấp xăng xe, ăn đêm">
            <input type="text" class="form-control" v-model="order.contract_info.trans_allowance" @input="inputMoney(order.contract_info, 'trans_allowance')" />
          </b-form-group>
          <b-form-group class="col-md-2" label="Phụ cấp ăn trưa">
            <input type="text" class="form-control" v-model="order.contract_info.meal_allowance" @input="inputMoney(order.contract_info, 'meal_allowance')" />
          </b-form-group>
          <b-form-group class="col-md-2" label="Phụ cấp điện thoại">
            <input type="text" class="form-control" v-model="order.contract_info.mobile_allowance" @input="inputMoney(order.contract_info, 'mobile_allowance')" />
          </b-form-group>
          <b-form-group class="col-md-2" label="Phụ cấp khoản công tác">
            <input type="text" class="form-control" v-model="order.contract_info.biztrip_allowance" @input="inputMoney(order.contract_info, 'biztrip_allowance')" />
          </b-form-group>
        </b-form-row>
      </div>
      <!-- Ký hợp đồng 12 tháng thì yêu cầu chọn loại đề xuất BHXH luôn -->
      <div class="relate-order" v-show="order.contract_info.type_contract === 'definite' && !this.order.id && this.order.order_type_alias === 'new_contract'">
        <div class="header mb-3 mt-2 font-weight-bold">
          BHXH
        </div>
        <b-alert show>
          <b>Lưu ý:</b> Nhân viên ký hợp đồng 12 tháng yêu cầu tạo đề xuất tăng BHXH kèm theo<br>
          Vui lòng chọn phương án báo tăng BHXH (nếu có)
        </b-alert>
        <b-form-row>
          <b-form-group label="Loại khai báo BHXH" class="col-md-3">
            <!-- <span slot="label">Loại khai báo BHXH<span class="text-danger">*</span></span> -->
            <select-order-group
              @input="op => { relate_order.group = op ? op.alias : null }"
              :group="relate_order.group"
              :disabled="true"
              :category-group="true"
              :multiple="false"
            ></select-order-group>
          </b-form-group>
          <b-form-group label="Phương án BHXH" class="col-md-3">
            <!-- <span slot="label">Phương án BHXH<span class="text-danger">*</span></span> -->
            <select-order-type
              :has-group="false"
              :group-alias="relate_order.group"
              @input="op => { relate_order.type = op ? op.id : null }"
              :type="relate_order.type"
              :disabled="!!order.id"
            ></select-order-type>
          </b-form-group>
        </b-form-row>
      </div>
    </div>
    </div>
    <!-- Quá trình công tác -->
    <div v-show="order.order_category === 'working_process'">
      <div class="header mb-3 mt-2 font-weight-bold">
        {{ `${order.group_name || ''} - ${order.order_type_name || ''}` }}
      </div>
      <div v-show="order.order_group === 'stop_working'">
        <div class="stop-working-info">
          <b-form-row>
            <b-form-group label="Ngày bắt đầu nghỉ" class="col-md-3">
              <span slot="label">Ngày bắt đầu nghỉ <span class="text-danger">*</span></span>
              <Datepicker
                :language="language.vi"
                v-model="order.resign_info.resign_date"
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
            <b-form-group label="Loại nghỉ" class="col-md-3">
              <span slot="label">Loại nghỉ <span class="text-danger">*</span></span>
              <b-select v-model="order.resign_info.resign_type" :options="resignTypeOptions"></b-select>
            </b-form-group>
            <b-form-group label="Phạt % lương (nếu có)" class="col-md-3">
              <input type="number" v-model="order.resign_info.resign_fine" class="form-control" @input="validInput(order.resign_info, 'resign_fine', { min: 0, max: 100 }, null, checkResignType)" />
            </b-form-group>
            <b-form-group label="Lý do nghỉ" class="col-md-12">
              <span slot="label">Lý do nghỉ <span class="text-danger">*</span></span>
              <b-input v-model="order.resign_info.resign_reason" list="resign-reason-option"></b-input>
              <datalist id="resign-reason-option">
                <option>Sức khỏe không đảm bảo</option>
                <option>Không đáp ứng được thời gian, địa điểm</option>
                <option>Không phù hợp với tính chất công việc</option>
                <option>Không phù hợp với môi trường, văn hóa</option>
                <option>Việc cá nhân/gia đình</option>
                <option>Định hướng công việc mới</option>
                <option>Chế độ, thu nhập không đảm bảo</option>
                <option>Hết HĐ/Thời vụ</option>
                <option>Tạm nghỉ do dịch bệnh</option>
                <option>Nghỉ sinh (vi phạm thỏa thuận)</option>
              </datalist>
            </b-form-group>
          </b-form-row>
        </div>
      </div>
      <div v-if="order.order_type_alias === 'modify_ekyc_info'" class="card-images">
        <div class="card-images-item" v-for="(imageUrl, index) in order.additional_info.card_images" :key="index">
          <img :src="imageUrl" alt="">
        </div>
      </div>
      <div v-if="order.order_group === 'user_info'">
        <table class="table table-sm table-borderless" v-if="hasShowChangeInfo">
          <tr>
            <th style="width: 50%;">Thông tin hiện tại</th>
            <th>Thông tin thay đổi</th>
          </tr>
          <tr v-for="(blockDataNew, blockKeyNew) in order.new_value" :key="blockKeyNew">
            <td>
              <template v-if="order.order_type_alias !== 'modify_ekyc_info'">
                <b>{{ fieldDesc[blockKeyNew] || blockKeyNew }}</b><br />
              </template>
              <div v-for="(val, field) in blockDataNew" :key="'old_' + field">
                <template v-if="field === 'list_child_household'">
                  <table class="table table-sm table-borderless">
                    <tr>
                      <th>Họ tên con</th>
                      <th>Ngày sinh</th>
                      <th>Giới tính</th>
                      <th>CMND(Mã số định danh cá nhân)</th>
                      <th>Giấy khai sinh con</th>
                    </tr>
                    <ListChildren :children="order.old_value[blockKeyNew][field] || []" />
                  </table>
                </template>
                <template v-else>
                - {{ fieldDesc[field] || field }} :
                <span v-if="order.old_value[blockKeyNew][field]">
                <span v-if="(typeof order.old_value[blockKeyNew][field] !== 'object')">
                  <span>{{ order.old_value[blockKeyNew][field] || null }}</span>
                </span>
                <div v-else class="ml-2">
                  <table v-if="Array.isArray(order.old_value[blockKeyNew][field])" class="table table-sm">
                    <tr>
                      <th v-for="(headerVal, header) in val[0]" :key="'sub_header_old' + header">{{ fieldDesc[header] || header }}</th>
                    </tr>
                    <tr v-for="(item, idx) in order.old_value[blockKeyNew][field]" :key="idx">
                      <td v-for="(subFieldValue, subField) in val[0]" :key="'sub_data_old' + subField">
                        {{ item[subField] || null }}
                      </td>
                    </tr>
                  </table>
                  <span v-else>
                    <span v-for="(itemVal, subField) in order.old_value[blockKeyNew][field]" :key="subField">
                      {{ fieldDesc[subField] || subField }} : {{ itemVal }}
                    </span>
                  </span>
                </div>
                </span>
                </template>
              </div>
            </td>
            <td>
              <template v-if="order.order_type_alias !== 'modify_ekyc_info'">
                <b>{{ fieldDesc[blockKeyNew] || blockKeyNew }}</b><br />
              </template>
              <div v-for="(val, field) in blockDataNew" :key="'new' + field">
                <template v-if="field === 'list_child_household'">
                  <table class="table table-sm table-borderless">
                    <tr>
                      <th>Họ tên con</th>
                      <th>Ngày sinh</th>
                      <th>Giới tính</th>
                      <th>CMND(Mã số định danh cá nhân)</th>
                      <th>Giấy khai sinh con</th>
                    </tr>
                    <ListChildren :children="val"/>
                  </table>
                </template>
                <template v-else>
                - {{ fieldDesc[field] || field }} :
                <span v-if="(typeof val !== 'object')">
                  <span>{{ val }}</span>
                </span>
                <div v-else class="ml-2">
                  <table v-if="Array.isArray(val)" class="table table-sm">
                    <tr>
                      <th v-for="(headerVal, header) in val[0]" :key="'sub_header_new' + header">{{ fieldDesc[header] || header }}</th>
                    </tr>
                    <tr v-for="(item, idx) in val" :key="idx">
                      <td v-for="(itemVal, subField) in item" :key="'sub_data_new' + subField">
                        {{ itemVal }}
                      </td>
                    </tr>
                  </table>
                  <span v-else>
                    <span v-for="(itemVal, subField) in val" :key="subField">
                      {{ fieldDesc[subField] || subField }} : {{ itemVal }}
                    </span>
                  </span>
                </div>
              </template>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Ghi chú -->
    <b-form-row>
      <b-form-group class="col-md-12" label="Ghi chú" v-show="showNote">
        <textarea name="note" id="note" rows="2" class="form-control" v-model.trim="order.note"></textarea>
      </b-form-group>
    </b-form-row>

    <!-- File đính kèm -->
    <fieldset v-if="showInputFile()" class="border rounded form-group">
      <legend class="d-inline col-form-label label-file">Thêm chứng từ/File (Nếu có)</legend>
      <b-form-row v-for="(file, idxFile) in this.order.files" :key="idxFile" class="border-bottom align-items-center">
        <b-form-group class="col-md-4 mb-0">
          <b-select :options="fileTypeOptions[order.order_category]" v-model="file.type" placeholde="Chọn loại chứng từ/file"></b-select>
        </b-form-group>
        <b-form-group class="col-md-7 mb-0">
          <file-view-upload
            class="d-inline-block"
            :input-id="'file_' + idxFile"
            :input-style="{ width: '4rem' }"
            :allow-delete="false"
            :hideUploadButton="true"
            height="5rem"
            :edit="true"
            :files="file.file_exist || []"
            :file-add="file.file_add || []"
          ></file-view-upload>
        </b-form-group>
        <b-form-group class="col-md-1 mb-0 text-right">
          <b-btn variant="outline-danger" title="Xóa chứng từ" v-show="!file.file_exist || !file.file_exist.length" size="sm" @click="deleteLicense(idxFile)"><i class="fas fa-times"></i></b-btn>
        </b-form-group>
      </b-form-row>
      <div class="text-left">
        <b-btn variant="outline-ghtk" size="sm" @click="addLicenses()" :disabled="!canAddLicenses()"><i class="fas fa-plus"></i> Thêm chứng từ/File</b-btn>
      </div>
    </fieldset>

    <div class="text-center mt-3" v-if="showActionApproveReportEkyc">
      <b-btn variant="ghtk" class="w-25" @click="updateStatus('duyet', null)" :disabled="!canUpdate">DUYỆT</b-btn>
    </div>
    <div class="text-center mt-3" v-if="allowUpdate && edit">
      <b-btn variant="ghtk" class="w-25" @click="updateOrder" :disabled="!canUpdate">{{ order.id ? 'CHỈNH SỬA' : 'ĐỀ XUẤT' }}</b-btn>
    </div>
    <!-- modal -->
    <b-modal static title="Nhập lý do từ chối" id="reject-reason-modal-1">
      <b-textarea
        v-model="rejectReason"
      >
      </b-textarea>
      <div slot="modal-footer" class="w-100 text-center">
        <b-btn variant="outline-ghtk" @click="updateStatus('tu_choi', rejectReason)">OK</b-btn>
        <b-btn variant="outline-danger" @click="$bvModal.hide('reject-reason-modal-1')">Hủy</b-btn>
      </div>
    </b-modal>

    <modal-detail-file
      id="detail-file-contract-1"
      title="File hợp đồng"
      :contract-id="contractId"
    ></modal-detail-file>
    <ModalCheckBeforeApproveContract
      :data-check="dataCheckBeforeApproveContract"
      :is-show="isShowModalCheckBeforeApproveContract"
      @toggleModal="toggleModalCheckBeforeApproveContract"
      @continueApprove="updateStatus('duyet', null,true)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .header {
    border-bottom: 3px solid #ddd;
    font-size: 1rem;
  }
  .label-file {
    width: fit-content;
  }

  .input-kpi {
    .custom-control {
      padding-left: 0;
    }

    .custom-control-label {
      position: relative !important;
    }
  }

  .simple-input {
    border: 0;
    border-bottom: 1px solid #ccc;
    background: transparent;
  }

  .card-images {
     display: flex;
     justify-content: space-between;

    &-item {
      flex-grow: 1;
      display: flex;
      justify-content: end;
      padding: 0 10px;

      &:last-child {
        justify-content: left;
      }
    }

    img {
      width: 100%;
      height: auto;
      max-width: 420px;
      max-height: 270px;
    }
  }
</style>
<script>
// build-component
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

// custom component
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SelectOrderType from './SelectOrderType'
import SelectOrderGroup from './SelectOrderGroup'
import SelectOrderStatus from './SelectOrderStatus'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SelectGender from 'components/elements/common/SelectGender'
import SelectEthnic from 'components/elements/common/SelectEthnic'
import SingleSelectRelation from 'components/elements/common/SingleSelectRelation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SelectContractType from 'components/elements/common/SelectContractType'
import ModalDetailFile from 'components/pages/erp/contract/ModalDetailFile'
import SelectAdministrativeProvince from 'components/elements/common/SelectAdministrativeProvince'
import SelectHospital from 'components/elements/common/SelectHospital'
import ListChildren from 'components/elements/children/ListChildren.vue'
import ModalCheckBeforeApproveContract from 'components/pages/erp/HrOrder/ModalCheckBeforeApproveContract'

// service
import hrOrderService from 'domain/services/hr-order-service'
import hrOrderServiceNew from 'domain/services/hr-order-service-new'
import contractService from 'domain/services/contract-service'

// entities
import Contract from 'domain/entities/Contract'
import Order from 'domain/entities/Order'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
  name: 'update-order',

  props: {
    approve_report_wrong_identity: {
      default: false
    },
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
      dafault: null
    },
    edit: {
      type: Boolean,
      default: true
    },
    displayFrom: null
  },

  components: {
    SingleSelectStation,
    SelectOrderType,
    SelectOrderStatus,
    SelectOrderGroup,
    Datepicker,
    Multiselect,
    FileViewUpload,
    SingleSelectPosition,
    SelectGender,
    SelectEthnic,
    SingleSelectRelation,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    SelectContractType,
    ModalDetailFile,
    SelectAdministrativeProvince,
    SelectHospital,
    ListChildren,
    ModalCheckBeforeApproveContract
  },

  created () {
    this.getType()
    if (this.idOrder) this.detailOrder(this.idOrder)
    else if (this.profileId) {
      this.getProfileInfo(this.profileId)
      this.employee.masterProfile.id = this.profileId
      this.employee.masterProfile.staff_code = this.profileId
    }
  },

  data: _ => ({
    loading: {
      ProfileInfo: false,
      orderInfo: false
    },
    loadingModal: false,
    // check đủ điều kiện để tạo đề xuất
    eligibleCreate: true,
    // Check là đề xuất này hợp lệ khi tạo ra, không thừa hay conflic với data đã có
    legalCreate: true,

    // kiểm tra là đề xuất liên quan
    isRelateOrder: null,
    duty: null,
    censor: null,
    rejectReason: null,
    //
    language: {
      vi: vi
    },
    contractType: Contract.typeOptions,
    birthTypeOptions: Order.birthTypeOptions,
    birthdayStatusOptions: Order.birthdayStatusOptions,
    insuranceBookStatusOptions: Order.insuranceBookStatusOptions,
    genderOptions: Order.genderOptions,
    nationalityOptions: Order.nationalityOptions,
    salaryAreaOptions: Order.salaryAreaOptions,
    fileTypeOptions: Order.fileTypeOptions,
    flowAction: Order.flowAction,
    statusDesc: Order.statusDesc,
    salaryDateOps: Contract.salaryDateOps,
    resignTypeOptions: [
      { value: null, text: '' },
      { value: 'nghi_dung_quy_trinh', text: 'Nghỉ đúng quy trình' },
      { value: 'nghi_ngang', text: 'Nghỉ ngang' },
      { value: 'cho_thoi_viec', text: 'Cho thôi việc' },
      { value: 'nghi_truoc_han', text: 'Nghỉ trước hạn' }
    ],
    fieldDesc: [],
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
      10: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Giới tính sai' },
        newInput: { class: 'col-md-4', disable: false, label: 'Giới tính đúng' },
        inputFile: true,
        showTimeChange: true
      },
      13: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Họ và tên sai' },
        newInput: { class: 'col-md-4', disable: false, label: 'Họ và tên đúng' },
        inputFile: true,
        showTimeChange: true
      },
      11: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Quốc tịch sai' },
        newInput: { class: 'col-md-4', disable: false, label: 'Quốc tịch đúng' },
        inputFile: true,
        showTimeChange: true
      },
      12: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Ngày sinh sai' },
        newInput: { class: 'col-md-4', disable: false, label: 'Ngày sinh đúng' },
        inputFile: true,
        showTimeChange: true
      },
      28: {
        oldInput: { class: 'col-md-4', disable: false, label: 'CMND/CCCD cũ' },
        newInput: { class: 'col-md-4', disable: false, label: 'CMND/CCCD mới' },
        inputFile: true,
        showTimeChange: false
      },
      29: {
        oldInput: { class: 'col-md-4', disable: false, label: 'Số điện thoại cũ' },
        newInput: { class: 'col-md-4', disable: false, label: 'Số điện thoại mới' },
        inputFile: false,
        showTimeChange: false
      },
      31: {
        oldInput: { class: 'col-md-12', disable: false, label: 'Thường trú cũ' },
        newInput: { class: 'col-md-12', disable: false, label: 'Thường trú mới' },
        inputFile: false,
        showTimeChange: false
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
      order_type_name: null,
      group_name: null,
      from_month: null,
      to_month: null,
      start_date: null,
      new_value: null,
      old_value: null,
      status: null,
      deadline: null,
      note: null,
      additional_info: {
        insurance_register: null,
        insurance_book_number: null,
        number_household: null,
        salary_pay_amount: null,
        pay_rate: null,
        resp_allowance: null,
        complementary_allowance: null,
        salary_area: null,
        area_code: null,
        min_salary_area: null,
        province_hospital_register: null,
        hospital_register: null,
        old_resident_province: null,
        new_resident_province: null,
        old_resident_district: null,
        new_resident_district: null,
        old_resident_commune: null,
        new_resident_commune: null,
        old_resident_detail: null,
        new_resident_detail: null,
        province_hospital_register_old: null,
        province_hospital_register_new: null,
        birthday_status: null,
        keep_insurance_book_status: null,
        shk_number: null,
        resident_address_province: null,
        resident_address_district: null,
        resident_address_sub_district: null,
        resident_address_detail: null
      },
      files: [
        {
          type: null,
          file_exist: [],
          file_add: []
        }
      ],
      household: [],
      regime_data: {
        from: null,
        to: null,
        total: null,
        pause_from: null,
        pause_to: null,
        pause_total: null,
        birth_date: null,
        num_children: null,
        birth_type: null,
        wife_personal_number: null,
        child_health_ins_number: null
      },
      contract_info: {
        type_contract: null,
        start_date: null,
        end_date: null,
        contract_date: null,
        trial_salary: null,
        salary: null,
        has_kpi: null,
        resp_allowance: null,
        trans_allowance: null,
        meal_allowance: null,
        mobile_allowance: null,
        biztrip_allowance: null,
        salary_date: null
      },
      resign_info: {
        resign_date: null,
        resign_reason: null,
        resign_type: null,
        resign_fine: null
      }
    },
    relate_order: {
      id: null,
      group: 'up',
      type: null
    },
    relateOrderData: {
      hrOrder: {},
      type: {}
    },
    employee: {
      masterProfile: {
        id: null,
        staff_code: null,
        region: null,
        fullname: null,
        status: null,
        birthday: null,
        gender: null,
        personal_id_number: null,
        poi_personal_id_number: null,
        doi_personal_id_number: null,
        resident_address_province: null,
        resident_address_district: null,
        resident_address_sub_district: null,
        resident_address_detail: null,
        tel: null,
        insurance_register: null,
        number_household: null,
        ins_book_with_comp: null,
        hospital_register: null,
        province_hospital_register: null,
        health_ins_number: null,
        join_date: null,
        trial_date: null,
        contract_date: null,
        trial_time: null
      },
      empProfile: {
        position_job: null,
        position_name: null,
        active_date: null,
        disable_date: null,
        start_date_day: null
      },
      user: {
        id: null,
        username: null,
        station_id: null,
        status_id: null,
        station_name: null,
        work_type: null
      },
      contract: {
        id: null,
        contract_number: null,
        type_contract: null,
        has_kpi: null,
        start_date: null,
        end_date: null,
        liquidate_date: null,
        status: null,
        contract_type_name: null
      },
      e_contract: {
        file: null,
        savis_code: null
      },
      salary: {
        trial_salary: null,
        salary: null,
        trial_ot_salary: null,
        ot_salary: null,
        resp_allowance: null,
        trans_allowance: null,
        meal_allowance: null,
        mobile_allowance: null,
        biztrip_allowance: null,
        min_salary_area: null,
        effect_date: null,
        status: null
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
        category: ['insurance', 'contract', 'working_process']
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
      gender: {
        group: ['up']
      },
      personal_id_number: {
        group: ['up', 'user_info']
      },
      poi_personal_id_number: {
        group: ['up', 'user_info']
      },
      doi_personal_id_number: {
        group: ['up', 'user_info']
      },
      resident_address_province: {
        group: ['up']
      },
      resident_address_district: {
        group: ['up']
      },
      resident_address_sub_district: {
        group: ['up']
      },
      resident_address_detail: {
        group: ['up']
      },
      tel: {
        group: ['up']
      },
      insurance_register: null,
      number_household: null,
      ins_book_with_comp: null,
      hospital_register: null,
      province_hospital_register: null,
      health_ins_number: null,
      join_date: {
        category: ['contract', 'working_process']
      },
      trial_date: {
        category: ['contract']
      },
      contract_date: {
        category: ['contract', 'working_process']
      },
      trial_time: {
        category: ['contract']
      },
      //
      position_name: {
        category: ['insurance', 'contract', 'working_process']
      },
      active_date: null,
      disable_date: null,
      start_date_day: {
        category: ['contract']
      },
      //
      username: null,
      station_id: null,
      status_id: null,
      station_name: {
        category: ['insurance', 'contract', 'working_process']
      },
      work_type: {
        category: ['contract', 'working_process']
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
    oldContractResolve: {
      id: null,
      plan: null,
      date: null
    },
    //
    contractId: null,
    noti: {
      salary: null,
      oldContract: null,
      staffCode: null
    },
    //
    relateInfo: [],
    isShowModalCheckBeforeApproveContract: false,
    dataCheckBeforeApproveContract: null
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    orderTypeProfileWatcher () {
      return this.order.order_type_alias + '_' + +this.order.profile_id + '_' + (this.employee.user.username || '')
    },

    profileContractWatcher () {
      return +this.order.profile_id + '_' + (this.order.contract_info.type_contract || '') + (this.order.contract_info.start_date || '')
    },

    showNote () {
      return this.showNoteInput.category.includes(this.order.order_category) ||
            this.showNoteInput.group.includes(this.order.order_group) || this.showNoteInput.type.includes(this.order.order_type_alias)
    },

    requireContractField () {
      if (this.order.order_group !== 'contract') return []
      let field = []

      if (this.order.order_type_alias === 'new_contract') {
        field.push('type_contract', 'start_date')
        if (['definite', 'definite_24', 'probation'].includes(this.order.contract_info.type_contract)) field.push('end_date')
      }
      if (this.order.order_type_alias === 'new_appendix') field.push('contract_id', 'effect_date')
      if (this.order.contract_info.type_contract === 'probation') field.push('trial_salary')
      if (['definite', 'definite_24', 'indefinite', 'parttime', 'service_contract'].includes(this.order.contract_info.type_contract)) field.push('salary')

      return field
    },

    // hiện nút cập nhật
    allowUpdate () {
      if (this.order.order_type_alias === 'modify_ekyc_info') {
        return false
      }
      return !this.order.status || ['cho_duyet', 'thieu_ho_so'].includes(this.order.status) ||
      (
        ['new_contract', 'new_appendix'].includes(this.order.order_type_alias) &&
        this.order.status === 'da_duyet' && !this.relateInfo.signed
      )
    },

    // disable nút cập nhật
    canUpdate () {
      return this.eligibleCreate && this.legalCreate
    },

    // quyền edit thông tin lương
    editSalalary () {
      return !+this.order.contract_info.has_kpi || ['binhvt', 'hungtd3', 'xoandt', 'namtt11', 'ngoctv5', 'toandv15'].includes(this.curUser.User.username)
    },

    showHouseHold () {
      return this.order.order_type_alias === 'TM'
    },

    hasShowChangeInfo () {
      return ['change_info', 'modify_ekyc_info'].includes(this.order.order_type_alias)
    },

    showActionApproveReportEkyc () {
      return this.order.order_type_alias === 'modify_ekyc_info' && !['tu_choi', 'hoan_thanh'].includes(this.order.status)
    }
  },

  watch: {
    'order.contract_info.end_date': function (newVal, oldVal) {
      if (this.order.order_type_alias === 'new_contract' && this.order.contract_info.start_date && newVal) {
        if (moment(newVal) <= moment(this.order.contract_info.start_date)) {
          helper.showMessage('Ngày kết thúc của hợp đồng không được nhỏ hơn ngày bắt đầu của hợp đồng !', 'warning')
          this.order.contract_info.end_date = null
        }
      }
    },

    'order.order_type_id': function (newVal, oldVal) {
      if (this.order.id) return
      if (+newVal === 1 || +newVal === 33) this.order.additional_info.pay_rate = 32
      else if (+newVal === 2) this.order.additional_info.pay_rate = 0.5
      else this.order.additional_info.pay_rate = null
      if (+oldVal === 1) this.order.household = []
    },

    orderType: {
      immediate: true,
      handler (newVal, oldVal) {
        this.employee.masterProfile.staff_code = null
        this.checkStaffCode()
        if (newVal) {
          this.initOrderType(newVal)
        } else this.selectGroupOrder(null)
      }
    },

    idOrder (newval, oldVal) {
      this.isRelateOrder = false
      if (newval) this.detailOrder(newval)
      else this.resetAllData()
    },

    orderTypeProfileWatcher (newVal, oldval) {
      this.eligibleCreate = true
      this.legalCreate = true
      this.resetObj(this.noti)
      if (this.order.order_type_alias && this.order.order_type_alias && this.order.profile_id && this.employee.user.id) {
        if (this.order.order_type_alias === 'new_appendix') {
          if (!this.employee.contract.id) {
            this.noti.staffCode = 'Nhân viên này chưa có hợp đồng, không thể tạo đề xuất thay đổi lương !'
            this.eligibleCreate = false
          } else {
            this.order.contract_info.contract_id = this.employee.contract.id
            this.order.contract_info.type_contract = this.employee.contract.type_contract
            this.order.contract_info.contract_date = this.employee.contract.contract_date
            this.order.contract_info.start_date = this.employee.contract.start_date
            this.order.contract_info.end_date = this.employee.contract.end_date
          }
        }

        if (!this.idOrder && this.eligibleCreate && this.legalCreate) {
          // lấy gợi ý dữ liệu đề xuất
          this.suggestData()
          // auto fill một số thông tin
          this.initDataFromEmployee()
        }
      }
    },

    profileContractWatcher (newVal, oldVal) {
      if (this.order.order_type_alias === 'new_contract') this.checkConflicOldContract()
      else this.noti.oldContract = ''
    }
  },

  methods: {
    showMpField (field) {
      return !this.order.order_category ||
        (
          this.showEmployeeInfo[field] &&
          (
            (this.showEmployeeInfo[field].category && this.showEmployeeInfo[field].category.includes(this.order.order_category)) ||
            (this.showEmployeeInfo[field].group && this.showEmployeeInfo[field].group.includes(this.order.order_group)) ||
            (this.showEmployeeInfo[field].type && this.showEmployeeInfo[field].type.includes(this.order.order_type_alias))
          )
        )
    },

    suggestEndDateContract (startDate) {
      this.getAreaSalary(startDate)
      if (!startDate) {
        this.order.contract_info.end_date = null
        this.order.contract_info.contract_date = null
        return
      }
      this.order.contract_info.contract_date = startDate
      if (this.order.contract_info.type_contract === 'definite') {
        this.order.contract_info.end_date = moment(startDate).add(1, 'y').subtract(1, 'day').format('YYYY-MM-DD')
      } else if (this.order.contract_info.type_contract === 'definite_24') {
        this.order.contract_info.end_date = moment(startDate).add(2, 'y').subtract(1, 'day').format('YYYY-MM-DD')
      } else if (this.order.contract_info.type_contract === 'probation') {
        this.order.contract_info.end_date = moment(startDate).add(2, 'M').subtract(1, 'day').format('YYYY-MM-DD')
      } else {
        this.order.contract_info.end_date = null
      }
    },

    suggestKpi (typeContract) {
      if (!typeContract) return
      if (typeContract === 'apprenticeship') this.order.contract_info.has_kpi = false
    },

    checkConflicOldContract () {
      // không có HĐ, start_date, edit, tạo HĐLĐ từ HDDV, ngày HĐ hợp lệ => reset data xử lý HĐ, noti HĐ
      if (
        !this.employee.contract.id || !this.order.contract_info.start_date || this.idOrder ||
        (this.employee.contract.end_date && moment(this.employee.contract.end_date).add(1, 'day') <= moment(this.order.contract_info.start_date)) ||
        (this.employee.contract.liquidate_date && moment(this.employee.contract.liquidate_date).add(1, 'day') <= moment(this.order.contract_info.start_date)) ||
        (this.employee.contract.type_contract === 'service_contract' && this.order.contract_info.type_contract !== 'service_contract')
      ) {
        this.noti.oldContract = null
        this.resetObj(this.oldContractResolve)
        return
      }
      // build noti cảnh báo ngày HĐ
      this.noti.oldContract = 'Nhân viên này đã có hợp đồng <b>' +
        (this.contractType[this.employee.contract.type_contract] || '') + '</b>' +
        (this.employee.contract.end_date ? ' hết hạn vào ngày <b>' + helper.formatDate(this.employee.contract.end_date) + '</b>' : ' Không xác định thời hạn') +
        (this.employee.e_contract.file ? ' và <b>Đã ký điện tử</b>' : '')
      if (this.employee.contract.end_date) {
        this.noti.oldContract += '<br/> Ngày bắt đầu của hợp đồng mới <b>' +
          helper.formatDate(this.order.contract_info.start_date) + '</b> trước ngày kết thúc của hợp đồng cũ.'
      }
      // Nếu đã ký Điện tử hoặc có HĐ active thì không cho tạo đề xuất, cập nhật HĐ
      if (
        this.employee.e_contract.file ||
        (this.employee.contract.status === 'active' && this.employee.contract.type_contract !== 'service_contract')
      ) this.legalCreate = false
      else { // cho phép chọn phương án xử lý HĐ cũ
        this.oldContractResolve.id = this.employee.contract.id
        this.oldContractResolve.date = moment(this.order.contract_info.start_date).subtract(1, 'day').format('YYYY-MM-DD')
      }
    },

    suggestData () {
      if (!this.order.order_type_id || !this.order.order_type_alias || !this.order.profile_id || !this.employee.user.id) {
        return
      }
      let params = {
        orderId: this.order.id,
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
              let saveField = res.data.data.saveField
              if (!helper.isEmpty(res.data.data.suggestData)) {
                let suggestData = res.data.data.suggestData
                for (const field in suggestData) {
                  if (saveField) this.order[saveField][field] = suggestData[field]
                  else this.order[field] = suggestData[field]
                }
                if (['new_contract', 'new_appendix'].includes(this.order.order_type_alias)) {
                  this.noti.salary = 'Lương được hệ thống gợi ý theo lương vùng tối thiểu'
                }
              } else {
                if (saveField) this.resetObj(this.order[saveField])
                this.noti.salary = ''
              }
            }
          } else {
            if (res.data.data) {
              if (res.data.data.prevent) {
                this.noti.staffCode = res.data.message
                this.legalCreate = false
              }
              if (res.data.data.show_msg) {
                helper.showMessage(res.data.message || 'Không lấy được dữ liệu gợi ý cho đề xuất !')
              }
            }
            console.log(res.data.message || 'Có lỗi khi lấy thông tin gợi ý !')
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

    initOrderType (typeAlias) {
      let orderType = null
      for (const category of this.orderTypeOption) {
        if (!category || helper.isEmpty(category.types)) continue
        orderType = category.types.find(every => every.alias === typeAlias)
        if (orderType) break
      }
      this.selectTypeOrder(orderType)
    },

    checkStatusUpdate (action) {
      if (action === 'export_contract') {
        this.exportContract()
        return
      }

      if (action === 'upload_contract') {
        this.contractId = this.order.relate_record_id
        if (!this.contractId) {
          alert('Không tìm thấy ID Hợp đồng cho đề xuất này !')
          return
        }
        this.$bvModal.show('detail-file-contract-1')
        return
      }

      if (action === 'tu_choi') {
        this.$bvModal.show('reject-reason-modal-1')
        return
      }

      this.updateStatus(action, this.rejectReason)
    },

    exportContract () {
      if (!this.order.relate_record_id) {
        alert('Đề xuất này không có thông tin mã hợp đồng !')
        return
      }
      let params = {
        contract_id: this.order.relate_record_id,
        type: 0
      }
      contractService.exportContract(params)
        .then(res => {
          if (res.data.success) window.open(res.data.data)
          else helper.showMessage(res.data.message || 'Đã có lỗi xảy ra vui lòng thử lại sau !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không xuất được hợp đồng !', 'warning')
        })
    },

    getAreaSalary (date = null, username = null) {
      if (!username) username = this.employee.user.username
      if (!username) return

      contractService.getInitSalary({ username: username, date })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data
            if (+data.salary) this.order.contract_info.salary = this.formatMoney(data.salary)
            else this.order.contract_info.salary = null
            if (+data.trial_salary) this.order.contract_info.trial_salary = this.formatMoney(data.trial_salary)
            else this.order.contract_info.trial_salary = null
            if (+data.meal_allowance) this.order.contract_info.meal_allowance = this.formatMoney(data.meal_allowance)
            else this.order.contract_info.meal_allowance = null
            if (+data.resp_allowance) this.order.contract_info.resp_allowance = this.formatMoney(data.resp_allowance)
            else this.order.contract_info.resp_allowance = null
            if (+data.mobile_allowance) this.order.contract_info.mobile_allowance = this.formatMoney(data.mobile_allowance)
            else this.order.contract_info.mobile_allowance = null
            if (+data.biztrip_allowance) this.order.contract_info.biztrip_allowance = this.formatMoney(data.biztrip_allowance)
            else this.order.contract_info.biztrip_allowance = null
            if (+data.trans_allowance) this.order.contract_info.trans_allowance = this.formatMoney(data.trans_allowance)
            else this.order.contract_info.trans_allowance = null
            this.noti.salary = 'Lương được tự động lấy theo lương vùng tối thiểu'
          } else {
            this.noti.salary = null
            helper.showMessage(res.data.message || 'Có lỗi xảy ra khi khởi tạo dữ liệu phụ lục hợp đồng !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    updateStatus (action, rejectReason, isContinueApprove = false) {
      if (!action || !this.order.id) return
      if (action === 'tu_choi' && !rejectReason) {
        alert('Vui lòng nhập lý do từ chối !')
        return
      }

      if (this.order.order_type_alias === 'resign' && (action === 'duyet' || action === 'tu_choi')) {
        this.approveResign(action, rejectReason)
        return
      }

      let data = {
        id: this.order.id,
        action: action,
        reason: rejectReason,
        isContinueApprove: isContinueApprove
      }
      this.loading.orderInfo = true
      hrOrderService.updateStatus(data)
        .then(res => {
          if (res.data.success) {
            this.order.status = res.data.update_status
            helper.showMessage(res.data.message || 'Cập nhật trạng thái thành công !', 'success')
            // cập nhật lại người duyệt
            if (res.data.censor && Array.isArray(res.data.censor)) {
              this.censor = res.data.censor.map(user => user.id).toString()
            } else {
              this.censor = null
            }
            if (action === 'tu_choi') {
              this.$bvModal.hide('reject-reason-modal-1')
            } else if (action === 'duyet' && isContinueApprove) {
              this.toggleModalCheckBeforeApproveContract(false)
            }
            res.data.status = res.data.update_status
            res.data.id = data.id
            if (this.modalStyle) this.$emit('changeStatusOk', res.data)
            if (this.displayFrom && this.displayFrom === 'support-staff' && action === 'duyet') {
              this.$emit('confirmSuccess')
            }
          } else {
            if (action === 'duyet' && res.data.data && res.data.data.is_valid === false) {
              this.dataCheckBeforeApproveContract = res.data.data.data_check
              this.toggleModalCheckBeforeApproveContract(true)
            } else {
              helper.showMessage(res.data.message || 'Không thể chuyển trạng thái của đề xuất !', 'warning')
            }
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra, không thay đổi được trạng thái đề xuất !', 'warning')
        })
        .then(_ => {
          this.rejectReason = null
          this.loading.orderInfo = false
        })
    },

    toggleModalCheckBeforeApproveContract (isShow) {
      this.isShowModalCheckBeforeApproveContract = isShow
    },

    async approveResign (action, reason) {
      const event = action === 'duyet' ? 'approve' : 'reject'

      const form = new FormData()
      form.append('type', 'event')
      form.append('event', event)

      if (Object.keys(this.order.resign_info).length) {
        for (const [key, value] of Object.entries(this.order.resign_info)) {
          if (!value) continue
          form.append(`data[${key}]`, value)
        }
      }

      if (reason) {
        form.append('data[reason]', reason)
      }

      if (this.order.note) {
        form.append('data[note]', this.order.note)
      }

      if (Array.isArray(this.order.files)) {
        for (const group of this.order.files) {
          if (Array.isArray(group.file_add)) {
            group.file_add.forEach((file, idx) => {
              form.append(`files[${group.type}][${idx}]`, file)
            })
          }
        }
      }

      this.loading.orderInfo = true

      const req = await hrOrderServiceNew.updateResignationProposal(this.order.id, form)
      const {success, message, data} = req.data
      if (success) {
        this.order.status = data.status
        helper.showMessage(message || 'Cập nhật trạng thái thành công !', 'success')

        // cập nhật lại người duyệt
        if (data.censor && Array.isArray(data.censor)) {
          this.censor = data.censor.map(user => user.id).toString()
        } else {
          this.censor = null
        }

        if (action === 'tu_choi') this.$bvModal.hide('reject-reason-modal-1')

        if (this.modalStyle) this.$emit('changeStatusOk', data)

        if (this.displayFrom && this.displayFrom === 'support-staff' && action === 'duyet') {
          this.$emit('confirmSuccess')
        }
      } else {
        helper.showMessage(message, 'warning')
      }

      this.rejectReason = null
      this.loading.orderInfo = false
    },

    showAction () {
      if (!this.order || !this.duty) return false
      if (this.duty === 'CnB') return true

      if (this.approve_report_wrong_identity) return true

      // Điều kiện theo người duyệt
      if (!this.censor || typeof this.censor !== 'string') return false
      let censor = this.censor.split(',')
      return this.curUser && this.curUser.User && censor.includes(this.curUser.User.id + '')
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
      this.resetObj(this.noti)
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
        this.noti.staffCode = null
        this.order.profile_id = null
        this.resetEmployee()
        this.resetData()
        return
      }
      if (this.employee.masterProfile.staff_code.length < 8) {
        this.noti.staffCode = 'Mã nhân viên phải bao gồm 8 ký tự số VD: 00345678'
        this.resetObj(this.employee.masterProfile, 'staff_code')
        this.resetEmployee('masterProfile')
        this.resetData()
        return
      }
      if (this.employee.masterProfile.staff_code.length === 8) {
        this.getProfileInfo(this.employee.masterProfile.staff_code)
        return
      }
      helper.validValue(this.employee.masterProfile, 'staff_code', { length: 8 })
    },

    checkToMonth (date) {
      if (this.order.from_month && moment(date).isBefore(this.order.from_month)) {
        alert('Tháng kết thúc phải lớn hơn tháng bắt đầu')
        this.order.to_month = null
      }
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
        if (!this.order.start_date) {
          if (this.order.order_group === 'down') message += '- Ngày bắt đầu nghỉ\n'
          if (this.modifyConfig[this.order.order_type_id] && this.modifyConfig[this.order.order_type_id].showTimeChange) message += '- Ngày bắt đầu điều chỉnh\n'
        }
        if (!this.order.from_month) {
          if (this.order.order_group === 'up') message += '- Tháng bắt đầu tăng\n'
          if (this.order.order_group === 'down') message += '- Tháng bắt đầu giảm\n'
          if (this.modifyConfig[this.order.order_type_id] && this.modifyConfig[this.order.order_type_id].showTimeChange) message += '- Tháng bắt đầu điều chỉnh\n'
        }
        if (this.order.order_group === 'modify') {
          if (helper.isEmpty(this.order.old_value)) {
            if (+this.order.order_type_id === 7) message += '- Mức đóng BHXH cũ\n'
            if (+this.order.order_type_id === 8) message += '- Nơi làm việc cũ\n'
            if (+this.order.order_type_id === 9) message += '- Vị trí cũ\n'
            if (+this.order.order_type_id === 10) message += '- Giới tính sai\n'
            if (+this.order.order_type_id === 11) message += '- Quốc tịch sai\n'
            if (+this.order.order_type_id === 12) message += '- Ngày sinh sai\n'
            if (+this.order.order_type_id === 13) message += '- Họ và tên sai\n'
            if (+this.order.order_type_id === 28) message += '- CMND/CCCD cũ\n'
            if (+this.order.order_type_id === 30) message += '- Nơi đăng ký KCB cũ\n'
          }
          if (helper.isEmpty(this.order.new_value)) {
            if (+this.order.order_type_id === 7) message += '- Mức đóng BHXH mới\n'
            if (+this.order.order_type_id === 8) message += '- Nơi làm việc mới\n'
            if (+this.order.order_type_id === 9) message += '- Vị trí mới\n'
            if (+this.order.order_type_id === 10) message += '- Giới tính đúng\n'
            if (+this.order.order_type_id === 11) message += '- Quốc tịch đúng\n'
            if (+this.order.order_type_id === 12) message += '- Ngày sinh đúng\n'
            if (+this.order.order_type_id === 13) message += '- Họ và tên đúng\n'
            if (+this.order.order_type_id === 28) message += '- CMND/CCCD mới\n'
            if (+this.order.order_type_id === 30) message += '- Nơi đăng ký KCB mới\n'
          }
          // Thông tin thay đổi thường chú
          if (+this.order.order_type_id === 31) {
            if (
              helper.isEmpty(this.order.additional_info.new_resident_province) ||
              helper.isEmpty(this.order.additional_info.new_resident_district) ||
              helper.isEmpty(this.order.additional_info.new_resident_commune)
            ) message += '- Thông tin thường trú mới\n'
            if (
              helper.isEmpty(this.order.additional_info.old_resident_province) ||
              helper.isEmpty(this.order.additional_info.old_resident_district) ||
              helper.isEmpty(this.order.additional_info.old_resident_commune)
            ) message += '- Thông tin thường trú cũ\n'
          }
        }
        // Với phương án tăng mới: Nếu điền mã số BHXH thì bắt buộc điền Mã hộ gia đình, ko bắt buộc điền phụ lục gia đình. Nếu ko điền mã BHXH thì bắt buộc điền phụ lục gia đình
        if (this.order.order_group === 'up' && [1].includes(+this.order.order_type_id)) {
          if (this.order.additional_info.insurance_register || this.order.additional_info.insurance_book_number) {
            if (!this.order.additional_info.number_household) message += '- Mã hộ gia đình\n'
          } else {
            if (!this.order.household || !this.order.household.length || (this.order.household.length === 1 && !this.canAddMember())) message += '- Mã số BHXH hoặc phụ lục gia đình\n'
          }
        }
      }
      // loại đề xuất hợp dồng
      if (this.order.order_group === 'contract') {
        this.requireContractField.forEach(field => {
          if (this.order.contract_info[field]) return
          switch (field) {
            case 'contract_id':
              message += '- ID hợp đồng cần thay đổi lương, phụ lục\n'
              return
            case 'salary':
              message += '- Lương chính thức\n'
              return
            case 'start_date':
              message += '- Ngày bắt đầu hợp đồng\n'
              return
            case 'end_date':
              message += '- Ngày kết thúc\n'
              return
            case 'type_contract':
              message += '- Loại hợp đồng\n'
              return
            case 'trial_salary':
              message += '- Lương thử việc\n'
              return
            case 'effect_date':
              message += '- Ngày lương bắt đầu hiệu lực\n'
          }
        })

        if (this.order.order_type_alias === 'new_contract' && !this.idOrder) {
          // if (this.order.contract_info.type_contract === 'definite' && (!this.relate_order.group || !this.relate_order.type)) {
          //   message += '- Loại khai báo BHXH\n'
          // }
          if (this.noti.oldContract && !this.oldContractResolve.plan) {
            message += '- phương án xử lý hợp đồng cũ\n'
          }
        }
        if (this.order.order_type_alias === 'new_appendix') {
          if (!this.order.note) {
            message += '- Lý do thay đổi lương, phụ cấp\n'
          }
        }
      }

      return message || true
    },

    inputMoney (ref, field) {
      return helper.inputMoney(ref, field)
    },

    formatMoney (val) {
      return helper.formatMoney(val)
    },

    formatDate (date, format = 'DD-MM-YYYY') {
      return helper.formatDate(date, format)
    },

    validInput (ref, field, conf, callBefor, callAfter) {
      if (callBefor) callBefor(ref[ref])
      helper.validValue(ref, field, conf)
      if (callAfter) callAfter(ref[field])
    },

    checkResignType (resignFine) {
      if (resignFine) this.order.resign_info.resign_type = 'nghi_ngang'
      else this.order.resign_info.resign_type = 'nghi_dung_quy_trinh'
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
          if (this.order[field] instanceof Date) data.append(field, this.order[field].toDateString())
          else data.append(field, this.order[field])
        } else data.append(field, '')
      }
      // append thông tin bổ xung
      let additionalInfo = {}
      for (const field in (this.order.additional_info || {})) {
        if (this.order.additional_info[field]) additionalInfo[field] = this.order.additional_info[field]
      }
      data.append('additional_info', JSON.stringify(additionalInfo))
      // append thông tin chế độ
      let regimeData = {}
      for (const field in (this.order.regime_data || {})) {
        if (this.order.regime_data[field]) regimeData[field] = this.order.regime_data[field]
      }
      data.append('regime_data', JSON.stringify(regimeData))
      // append file
      if (Array.isArray(this.order.files) && this.order.files.length) {
        for (const f of this.order.files) {
          if (Array.isArray(f.file_add)) {
            for (const idx in f.file_add) {
              if (f.file_add[idx]) data.append(f.type + '[' + idx + ']', f.file_add[idx])
            }
          }
        }
      }
      // append thông tin thành viên gia đình
      if (Array.isArray(this.order.household) && this.order.household.length) {
        for (let idx in this.order.household) {
          if (!this.order.household[idx].fullname || !this.order.household[idx].relation) this.order.household.splice(idx, 1)
        }

        if (this.order.household.length) data.append('household', JSON.stringify(this.order.household))
      }
      // append thông tin hợp đồng
      if (this.order.order_category === 'contract') {
        data.append('contract_info', JSON.stringify(this.order.contract_info))
      }

      // append thông tin nghỉ việc
      if (this.order.order_group === 'stop_working') {
        data.append('resign_info', JSON.stringify(this.order.resign_info))
      }

      // append thông tin đề xuất liên quan nếu có
      if (this.relate_order.type && this.relate_order.group) {
        data.append('relate_order', JSON.stringify(this.relate_order))
      }
      // append thêm thông tin xử lý cho bản ghi HĐ cũ nếu data bị conflic, sai
      if (this.oldContractResolve.plan && this.oldContractResolve.id) {
        data.append('old_contract_resolve', JSON.stringify(this.oldContractResolve))
      }

      if (this.$route.query.sos_id) data.append('sos_id', this.$route.query.sos_id)
      this.$startLoading()
      hrOrderService.updateOrder(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Thêm/Cập nhật đề xuất thành công', 'success')
            if (!this.order.id) { // tạo mới đề xuất
              let relateOrder = res.data.relateOrder
              if (relateOrder && relateOrder.create_new && relateOrder.hrOrder && relateOrder.hrOrder.id) {
                // yêu cầu nhập thêm thông tin đề xuất liên quan
                this.detailOrder(relateOrder.hrOrder.id)
                this.isRelateOrder = true
                helper.showToast('Vui lòng nhập dầy đủ thông tin của đề xuất phát sinh kèm theo này', 'warning')
              } else {
                if (this.modalStyle) {
                  this.resetAllData()
                  this.$emit('addOrderOk', res.data.data)
                } else {
                  this.isRelateOrder = false
                  this.order.id = res.data.data.id
                  this.relateOrderData = relateOrder
                }
              }
            } else if (this.isRelateOrder && this.modalStyle) { // chỉnh sửa đề xuất liên quan
              this.resetAllData()
              helper.cleanToast()
              this.$emit('addOrderOk', res.data.data)
            } else {
              this.$emit('addOrderOk', res.data.data)
            }
          } else {
            helper.showMessage(res.data.message || 'Không cập nhật được thông tin đề xuất !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(_ => {
          this.order.files.file_add = []
          this.$stopLoading()
        })
    },

    detailOrder (id) {
      if (!id) id = this.idOrder
      if (!id) return
      this.loading.orderInfo = true
      hrOrderService.detailOrder({ id: id })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.order = res.data.data
            this.duty = res.data.duty[this.order.order_category]
            this.censor = res.data.censor
            this.fieldDesc = res.data.fieldDesc || []
            this.relateInfo = res.data.relateInfo || []
            if (res.data.data.profile_id) {
              this.employee.masterProfile.staff_code = helper.genCode(res.data.data.profile_id, '', '', 8)
              this.getProfileInfo(this.employee.masterProfile.staff_code)
            }
            if (res.data.relateOrder) this.relateOrderData = res.data.relateOrder
          } else {
            helper.showMessage(res.data.message || 'Không lấy được đề xuất, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.loading.orderInfo = false
        })
    },

    getProfileInfo (profileId) {
      if (!profileId) profileId = this.profileId
      if (!profileId) return
      if (!this.idOrder) {
        this.order.household = []
      }
      this.loading.profileInfo = true
      let params = {
        profileId: profileId,
        category: this.order.order_category,
        group: this.order.order_group,
        alias: this.order.order_type_alias
      }
      hrOrderService.getProfile(params)
        .then(res => {
          if (res.data.success) {
            this.employee = res.data.data

            // format data để hiển thị
            if (this.employee.masterProfile.birthday) this.employee.masterProfile.birthday = moment(this.employee.masterProfile.birthday).format('DD-MM-YYYY')
            if (this.employee.masterProfile.join_date) this.employee.masterProfile.join_date = moment(this.employee.masterProfile.join_date).format('DD-MM-YYYY')
            if (this.employee.masterProfile.trial_date) this.employee.masterProfile.trial_date = moment(this.employee.masterProfile.trial_date).format('DD-MM-YYYY')
            if (this.employee.masterProfile.contract_date) this.employee.masterProfile.contract_date = moment(this.employee.masterProfile.contract_date).format('DD-MM-YYYY')
            if (this.employee.masterProfile.doi_personal_id_number) this.employee.masterProfile.doi_personal_id_number = moment(this.employee.masterProfile.doi_personal_id_number).format('DD-MM-YYYY')
            if (this.employee.empProfile.start_date_day) this.employee.empProfile.start_date_day = moment(this.employee.empProfile.start_date_day).format('DD-MM-YYYY')

            if (this.employee.salary.salary) helper.inputMoney(this.employee.salary, 'salary')
            if (this.employee.salary.trial_salary) helper.inputMoney(this.employee.salary, 'trial_salary')
            if (this.employee.salary.meal_allowance) helper.inputMoney(this.employee.salary, 'meal_allowance')
            if (this.employee.salary.trans_allowance) helper.inputMoney(this.employee.salary, 'trans_allowance')
            if (this.employee.salary.resp_allowance) helper.inputMoney(this.employee.salary, 'resp_allowance')
            if (this.employee.salary.biztrip_allowance) helper.inputMoney(this.employee.salary, 'biztrip_allowance')
            if (this.employee.salary.mobile_allowance) helper.inputMoney(this.employee.salary, 'mobile_allowance')

            if (!this.idOrder) {
              this.order.profile_id = this.employee.masterProfile.id
            }
          } else {
            helper.showMessage(res.data.message || 'Không lấy được thông tin người lao động, vui lòng thử lại sau !', 'warning')
            // reset lại thông tin người lao động
            this.resetObj(this.employee.masterProfile, 'staff_code')
            this.resetEmployee('masterProfile')
            // reset lại thông tin đề xuất
            this.resetData()
            this.noti.staffCode = res.data.message || ('Không tồn tại nhân viên có mã ' + this.employee.masterProfile.staff_code)
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.loading.profileInfo = false
        })
    },

    initDataFromEmployee () {
      // init data với loại khai báo BHXH
      if (this.order.order_category === 'insurance') {
        // kiểm tra hợp đồng để gen cảnh báo
        if (this.employee.masterProfile && this.employee.masterProfile.id) {
          if (this.employee.contract && this.employee.contract.id) {
            if (!['indefinite', 'definite', 'definite_24', 'probation'].includes(this.employee.contract.type_contract)) {
              this.noti.staffCode = 'Hợp đồng của nhân viên này' +
                                  (this.contractType[this.employee.contract.type_contract] ? (' là ' + this.contractType[this.employee.contract.type_contract]) : '') +
                                  ' không phải hợp đồng lao động'
            } else if (this.employee.contract.end_date && moment().isAfter(this.employee.contract.end_date)) {
              this.noti.staffCode = (this.contractType[this.employee.contract.type_contract] || 'Hợp đồng') + ' của nhân viên này đã hết hạn'
            }
          } else {
            this.noti.staffCode = 'Nhân viên này chưa có hợp đồng lao động'
          }
        }
        // khởi tạo thông tin cho đề xuất
        if (!this.order.additional_info.resp_allowance) {
          this.order.additional_info.resp_allowance = +this.employee.salary.resp_allowance || null
          if (this.order.additional_info.resp_allowance) helper.inputMoney(this.order.additional_info, 'resp_allowance')
        }
      }
      this.assignOldData()
    },

    canAddMember () {
      if (!this.order.household || !this.order.household.length) return true
      let lastMember = this.order.household[this.order.household.length - 1]
      return lastMember.id || (lastMember.fullname && lastMember.relation && lastMember.birthday)
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

    addFamilyMember () {
      this.order.household.push({
        fullname: '',
        birthday_status: '',
        birthday: '',
        gender: '',
        nationality: 'Vietnam',
        ethnic: 'kinh',
        relation: '',
        personal_id: ''
      })
    },

    deleteFamilyMember (idx) {
      if (!this.order.household[idx]) return
      this.order.household.splice(idx, 1)
    },

    showInputFile () {
      return this.order.order_group === 'supply_bhxh' || this.order.order_group === 'supply_bhyt' || this.order.order_group === 'regime' || this.order.order_group === 'stop_working' ||
      (this.modifyConfig[this.order.order_type_id] && this.modifyConfig[this.order.order_type_id].inputFile)
    },

    showTimeChange () {
      return this.order.order_group === 'down' || (this.modifyConfig[this.order.order_type_id] && this.modifyConfig[this.order.order_type_id].showTimeChange)
    },

    selectTypeOrder (op) {
      if (op) {
        this.order.order_type_id = op.id
        this.order.order_type_alias = op.alias
        this.order.order_type_name = op.name
        this.order.order_group = op.group_alias
        this.order.group_name = op.group_name
        this.order.order_category = op.category
        if (op.alias === 'new_contract') {
          this.relate_order.group = 'up'
          this.relate_order.type = null
        }
      } else {
        this.order.order_type_id = null
        this.order.order_type_alias = null
        this.order.order_type_name = null
        this.relate_order.group = null
        this.relate_order.type = null
      }

      this.order.new_value = null
      this.order.old_value = null
      this.order.additional_info.province_hospital_register_old = null
      this.order.additional_info.province_hospital_register_new = null
      // reset lại file hồ sơ khi điều chỉnh
      if (this.modifyConfig[this.order.order_type_id] && !this.modifyConfig[this.order.order_type_id].inputFile) {
        this.order.file = []
      }

      // Reset lại data chế độ
      this.order.regime_data.birth_date = null
      this.order.regime_data.num_children = null
      this.order.regime_data.birth_type = null
      this.order.regime_data.wife_personal_number = null
      this.order.regime_data.child_health_ins_number = null
    },

    // gán giá trị cũ theo như thông tin master profile
    assignOldData () {
      // init data với loại khai báo hợp đồng
      if (['new_contract', 'new_appendix'].includes(this.order.order_type_alias)) {
        if (this.employee.contract.id) {
          this.noti.salary = 'Lương được tự động lấy từ hợp đồng cũ'
          // Khởi tạo mức lương ban đầu từ hợp đồnng cũ
          if (this.employee.salary.salary) this.order.contract_info.salary = this.employee.salary.salary
          if (this.employee.salary.trial_salary) this.order.contract_info.trial_salary = this.employee.salary.trial_salary

          if (this.employee.salary.resp_allowance) this.order.contract_info.resp_allowance = this.employee.salary.resp_allowance
          if (this.employee.salary.mobile_allowance) this.order.contract_info.mobile_allowance = this.employee.salary.mobile_allowance
          if (this.employee.salary.meal_allowance) this.order.contract_info.meal_allowance = this.employee.salary.meal_allowance
          if (this.employee.salary.trans_allowance) this.order.contract_info.trans_allowance = this.employee.salary.trans_allowance
          if (this.employee.salary.biztrip_allowance) this.order.contract_info.biztrip_allowance = this.employee.salary.biztrip_allowance
          if (this.order.order_type_alias === 'new_appendix') {
            this.order.contract_info.has_kpi = !!+this.employee.contract.has_kpi
          }
        }
      } else {
        this.noti.salary = null
        this.resetObj(this.order.contract_info)
      }
      if (this.order.order_type_alias === 'modify_pay_amount') { // Mức đóng BHXH
        this.order.old_value = this.employee.salary.salary
        this.inputMoney(this.order, 'old_value')
      }
      if (this.order.order_type_alias === 'modify_position') this.order.old_value = this.employee.empProfile.position_job // Vị trí
      if (this.order.order_type_alias === 'modify_workplace') this.order.old_value = this.employee.user.station_id // Nơi làm việc
      if (this.order.order_type_alias === 'modify_pay_rate') this.order.old_value = +this.employee.insurance.company_cost + +this.employee.insurance.worker_cost // tỉ lệ đóng BHXH
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
      // tự động chọn loại đề xuất
      let initType = null
      if (op) {
        let orderGroup = this.orderTypeOption.find(every => every.alias === op.alias) || {}
        let types = orderGroup.types || []
        if (types.length === 1) {
          initType = types[0]
        } else if (orderGroup.alias === 'up') { // mặc định chọn tăng mới nếu chọn tăng BHXH
          initType = types.find(every => every.alias === 'TM')
        } else if (orderGroup.alias === 'contract') { // mặc định chọn tạo mới HĐ khi chọn loại HĐ
          initType = types.find(every => every.alias === 'new_contract')
        }
      }
      if (initType) {
        this.selectTypeOrder(initType)
      } else {
        this.order.order_type_id = null
        this.order.order_type_alias = null
        this.order.order_type_name = null
      }

      // reset lại dữ liệu đã nhập nếu có
      this.resetData()
    },

    resetData () {
      this.order.new_value = null
      this.order.note = null
      this.order.old_value = null
      this.order.start_date = null
      this.order.to_month = null
      this.order.from_month = null
      this.order.files = [{ type: null, file_add: [], file_exist: [] }]
      this.resetObj(this.noti, 'staffCode')
      if (this.order.additional_info) {
        this.resetObj(this.order.additional_info)
      } else this.order.additional_info = {}

      if (this.order.regime_data) {
        this.resetObj(this.order.regime_data)
      } else this.order.regime_data = {}

      if (this.order.contract_info) {
        this.resetObj(this.order.contract_info)
      } else this.order.contract_info = {}

      if (this.order.resign_info) {
        this.resetObj(this.order.resign_info)
      } else this.order.resign_info = {}

      this.order.household = []
    },

    selectPosition (op) {
      this.order.new_value = op && op.id
    },

    resetObj (ref, exceptField = null) {
      helper.resetData(ref, exceptField)
    },

    selectValue (op, ref, field, opField) {
      if (!opField) ref[field] = op || null
      else if (op) ref[field] = op[opField] || null
      else op[opField] = null
    },

    selectContractType (op) {
      this.order.contract_info.type_contract = op ? op.value : null

      // reset đề xuất liên quan
      this.relate_order.group = 'up'
      this.relate_order.type = null
      // auto sinh ngày kết thúc
      this.suggestEndDateContract(this.order.contract_info.start_date)
      // Gợi ý tính KPI
      this.suggestKpi(this.order.contract_info.type_contract)
    }
  }
}
</script>
