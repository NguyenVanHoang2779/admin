<template>
  <div>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Họ tên người bảo lãnh <span class="text-danger">*</span></span>
      <b-input id="input-default" class="rounded" v-model="guardian.fullname"></b-input>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Ngày sinh <span class="text-danger">*</span></span>
      <v-date-picker :popover="{visibility: 'focus'}" mode="date" class="date-picker" v-model="guardian.birthday"
                      locale="vi" color="green" :input-props="{ placeholder: '', style: 'font-size: 0.894rem !important; color: #4E5155 !important;'}"/>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">CMND/CCCD <span class="text-danger">*</span></span>
      <b-input id="input-default" class="rounded" v-model="guardian.personal_id"
                name="guardian.personal_id"
                v-validate="{numeric: true, min: 9, max: 12, regex: /^(.{12}|.{9})$/}"
                :class="{'is-danger': errors.has('guardian.personal_id')}"
                @keyup="limitLengthGuardian('personal_id', 12, ...arguments)">
      </b-input>
      <span v-show="errors.firstRule('guardian.personal_id') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
      <span v-show="errors.firstRule('guardian.personal_id') == 'min'" class="help is-danger">Không đủ ký tự CMND </span>
      <span v-show="errors.firstRule('guardian.personal_id') == 'max'" class="help is-danger">Vượt quá ký tự CMND</span>
      <span v-show="errors.firstRule('guardian.personal_id') == 'regex'" class="help is-danger">Số cmnd không đúng</span>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Ngày cấp <span class="text-danger">*</span></span>
      <v-date-picker :popover="{visibility: 'focus'}" mode="date" class="date-picker" v-model="guardian.personal_id_date"
                      locale="vi" color="green" :input-props="{ placeholder: '', style: 'font-size: 0.894rem !important; color: #4E5155 !important;'}"/>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Nơi cấp <span class="text-danger">*</span></span>
      <single-select-poi-identity-card
        :state="guardian.personal_id_place == '' ? false : null"
        :placeholder="'Nơi cấp CMND'"
        :provinceId="guardian.personal_id_place"
        @handleSelectedProvince="selectedPoiPersonalId"
        @remove="removePoiPersonalId">
      </single-select-poi-identity-card>

    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Địa chỉ thường trú <span class="text-danger">*</span></span>
      <single-select-province
        @input="op => {guardian.resident_province = op ? op.id : null}"
        :provinceId="guardian.resident_province"
      ></single-select-province>
    </b-form-group>
    <div class="d-flex mb-3">
      <single-select-district
        @input="op => {guardian.resident_district = op ? op.id : null}"
        :provinceId="guardian.resident_province"
        :districtId="guardian.resident_district"
        class="mr-2"
      ></single-select-district>
      <single-select-sub-district
        @input="op => {guardian.resident_sub_district = op ? op.id : null}"
        :districtId="guardian.resident_district"
        :subDistrictId="guardian.resident_sub_district"
      ></single-select-sub-district>
    </div>
    <!-- <b-form-group>
      <input v-model.trim="guardian.resident_detail" class="form-control" placeholder="Số nhà, tên đường"/>
    </b-form-group> -->
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Địa chỉ hiện tại <span class="text-danger">*</span></span>
      <single-select-province
        @input="op => {guardian.current_province = op ? op.id : null}"
        :provinceId="guardian.current_province"
      ></single-select-province>
    </b-form-group>
    <div class="d-flex mb-3">
      <single-select-district
        @input="op => {guardian.current_district = op ? op.id : null}"
        :provinceId="guardian.current_province"
        :districtId="guardian.current_district"
        class="mr-2"
      ></single-select-district>
      <single-select-sub-district
        @input="op => {guardian.current_sub_district = op ? op.id : null}"
        :districtId="guardian.current_district"
        :subDistrictId="guardian.current_sub_district"
      ></single-select-sub-district>
    </div>
    <b-form-group>
      <input v-model.trim="guardian.current_detail" class="form-control" placeholder="Số nhà, tên đường"/>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Mối quan hệ <span class="text-danger">*</span></span>
      <SelectRelation v-model="guardian.relation" relationOption="guardian" />
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Số điện thoại <span class="text-danger">*</span></span>
      <b-input id="input-default" class="rounded" v-model="guardian.phone"
                name="guardian.phone"
                v-validate="{numeric: true, regex: /^(84|0)(3|5|7|8|9)([0-9]{8})$/}"
                :class="{'is-danger': errors.has('guardian.phone')}"
                @keyup="limitLengthGuardian('phone', 15, ...arguments)">
      </b-input>
      <span v-show="errors.firstRule('guardian.phone') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
      <span v-show="errors.firstRule('guardian.phone') == 'regex'" class="help is-danger">Số điện thoại không đúng</span>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Nơi xác thực giấy bảo lãnh <span class="text-danger">*</span></span>
      <b-input id="input-default" class="rounded" v-model="guardian.license_place"></b-input>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4">
      <span slot="label" class="font-14">Chọn lý do duyệt <span class="text-danger">*</span></span>
      <SelectGuardianReason v-model="guardian.bltnds_reason" option-type="approved" :auto-close="true" placeholder="" />
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4">
      <span slot="label" class="font-14">Thông tin khai thác thêm từ NBL <span class="text-danger">*</span></span>
      <b-input id="input-default" class="rounded" v-model="guardian.other_info"></b-input>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4">
      <span slot="label" class="font-14">Ghi chú</span>
      <b-input id="input-default" class="rounded" v-model="guardian.note"></b-input>
    </b-form-group>
  </div>
</template>

<script>
// custom components
// import helper from 'infrastructures/helpers/common-helpers'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SingleSelectPoiIdentityCard from 'components/elements/common/SingleSelectPoiIdentityCard'
import SelectRelation from 'components/elements/common/SingleSelectRelation'
import SelectGuardianReason from './SelectGuardianReason'
export default {
  name: 'form-guardian-info',

  components: {
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    SelectGuardianReason,
    SelectRelation,
    SingleSelectPoiIdentityCard
  },

  props: {
    guardian: {
      type: Object,
      default: _ => ({})
    }
  },
  data: _ => ({

  }),

  computed: {},

  methods: {
    removePoiPersonalId (option) {
      this.guardian.personal_id_place = null
    },

    selectedPoiPersonalId (option) {
      this.guardian.personal_id_place = option ? option.id : ''
    },

    limitLengthGuardian (varName, length) {
      let len = this.guardian[varName].length
      if (len > length) {
        this.guardian[varName] = this.guardian[varName].substring(0, length)
      }
    }
  }
}
</script>
