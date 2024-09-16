<template>
  <div class="mt-2 text-size">
    <b-row class="low-height">
        <b-col sm="2" >
            <b-form-input v-model="filter['name_cmnd_phone_mail']" placeholder="Họ tên, CMND, SĐT, Email" @keyup.enter.native="search"></b-form-input>
        </b-col>
        <b-col sm="2">
            <b-form-input v-model="filter['staff_code']" placeholder="Mã nhân viên" @keyup.enter.native="search"></b-form-input>
        </b-col>
        <b-col sm="2">
            <single-select-profile-region :region="filter['region']" @handleSelectedRegion="setRegion"></single-select-profile-region>
        </b-col>
         <b-col sm="2">
            <single-select-province :region-name="filter['region']" :province-id="filter['province_id']" @handleSelectedProvince="setProvince"></single-select-province>
        </b-col>
        <b-col sm="2">
            <single-select-district :province-id="filter['province_id']+''" :district-id="filter['district_id']" @handleSelectedDistrict="setDistrict" ></single-select-district>
        </b-col>
        <b-col sm="2">
          <single-select-referral :referral="filter['referral']" @on-select="setReferral"></single-select-referral>
        </b-col>
    </b-row>
    <b-row class="low-height">
        <b-col sm="2">
          <single-select-candidate-referrer :referrer-id="filter['referrer_id']" @handleChooseRefferer="setReferrer" placeholder="Chọn người giới thiệu"></single-select-candidate-referrer>
        </b-col>
        <b-col sm="2">
            <single-select-candidate-processors :processor-id="filter['processor_id']" @handleChooseRefferer="setProcessor"></single-select-candidate-processors>
        </b-col>
        <b-col sm="2">
          <single-select-candidate-position :job-id="filter['job_id']" @handleChoosePosition="setJob"></single-select-candidate-position>
        </b-col>
        <b-col sm="2">
          <multiselect
            v-model="dateFilterType"
            :options="dateFilterOptions"
            label="name"
            placeholder="Tìm theo thời gian"
            selectLabel=""
            deselectLabel="X"
          ></multiselect>
        </b-col>
        <b-col sm="2">
            <flat-pickr v-model="dateFilter" :config="rangeConfig" placeholder="Chọn khoảng thời gian" class="mb-4"/>
        </b-col>
        <b-col class="text-left wrapper" sm="2">
          <b-btn variant="primary" @click="search">Tìm kiếm</b-btn>
          <b-btn variant="danger"  @click="reset" class="mr-2">Bỏ chọn</b-btn>
        </b-col>
    </b-row>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style lang="scss">
  .btn-wraper {
    min-width: 280px;
    .btn {
      width: 120px;
      margin-left: 0px;
      margin-right: 0px;
    }
  }
  .low-height {
    max-height: 40px!important;
    margin-bottom: 10px!important;
  }
</style>

<script>

import Multiselect from 'vue-multiselect'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectCandidateReferrer from './SingleSelectCandidateReferrer'
import SingleSelectReferral from './SingleSelectReferral'
import SingleSelectCandidatePosition from './SingleSelectCandidatePosition'
import SingleSelectCandidateProcessors from './SingleSelectCandidateProcessors'
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'

export default {
  name: 'candidate-filter',

  components: {
    Multiselect,
    SingleSelectProfileRegion,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectCandidateReferrer,
    SingleSelectReferral,
    SingleSelectCandidatePosition,
    SingleSelectCandidateProcessors,
    flatPickr
  },

  props: [
    'id',
    'trigger',
    'status',
    'role',
    'action'
  ],

  data: () => ({

    rangeConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },

    dateFilter: '',

    filter: {
      region: null,
      province_id: null,
      district_id: null,
      referral: null,
      job_id: null,
      referrer_id: null,
      processor_id: null,
      name_cmnd_phone_mail: null
    },

    dateFilterType: '',
    dateFilterOptions: [
      {value: 'created', name: 'Ngày đăng kí dự tuyển'},
      {value: 'expected_join_date', name: 'Ngày dự kiến nhận việc'}
      // {value: 'start_date', name: 'Ngày bắt đầu làm việc'}
    ]

  }),

  created () {
  },

  watch: {
    trigger: function (newVal, oldVal) {
      this.$refs['curModal'].show()
    }
  },

  methods: {
    setRegion (region) {
      this.filter.province_id = null
      if (!region) this.filter['region'] = null
      else this.filter['region'] = region.id
    },

    setProvince (province) {
      this.filter['province_id'] = province.id + ''
    },

    setDistrict (district) {
      this.filter['district_id'] = district.id
    },

    setReferrer (referrer) {
      if (referrer) this.filter['referrer_id'] = referrer.id
      else this.filter['referrer_id'] = null
    },

    setReferral (referral) {
      this.filter['referral'] = referral.value
    },

    setJob (job) {
      this.filter['job_id'] = job.id
    },

    setProcessor (processor) {
      this.filter['processor_id'] = processor.id
    },

    reset () {
      this.dateFilter = null
      this.dateFilterType = null
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = ''
      })
      this.$emit('search', this.filter)
    },

    search () {
      if (this.dateFilter && this.dateFilterType) {
        let range = this.dateFilter.split('to').map(item => item.trim())
        if (range.length === 2) {
          this.filter.dateFilterType = this.dateFilterType.value
          this.filter.start_date = moment(range[0], 'DD-MM-YYYY').format('YYYY-MM-DD')
          this.filter.end_date = moment(range[1], 'DD-MM-YYYY').format('YYYY-MM-DD')
        } else {
          delete this.filter.dateFilterType
          delete this.filter.start_date
          delete this.filter.end_date
        }
      } else {
        delete this.filter.dateFilterType
        delete this.filter.start_date
        delete this.filter.end_date
      }
      this.$emit('search', this.filter)
    }
  }
}
</script>
