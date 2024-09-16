<template>
    <b-modal scrollable id="modal-logs" size="lg" ref="modal-log" title="Lịch sử hồ sơ" static>
    <div v-loading="loading">
      <div v-if="!logs.length">
        Không có lịch sử hồ sơ
      </div>
      <div class="scrollable strip">
          <div class="row" v-for="(log, index) in logs" :key="index" style="padding: 8px">
            <div class="col-4 text-center">
                <router-link class="mt-2" :to="{name: 'edit-user', params: { id: log.created_by }}">{{ log.created_name }}</router-link> <br/>
                {{ formatDate(log.created) }}
            </div>
            <div class="col-8">
              <div v-for="(value, name) in log.diffs" :key="name">
                <span v-if="value || value === '0'">Cập nhật <b>"{{ logFieldLocale[name] || name }}"</b> mới: <b>{{ logFieldDate.includes(name) ? formatDate(value, 'DD-MM-YYYY') : value }}</b></span>
                <span v-else>Xóa <b>"{{ logFieldLocale[name] || name }}"</b></span>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div slot="modal-footer">
        <b-button
        variant="primary"
        @click="hideModal()"
        >
        Đóng
        </b-button>
    </div>
    </b-modal>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<style lang="scss" scoped>
    .scrollable {
      max-height: 600px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .strip>div:nth-child(odd){
      background: #f8f8f8
    }
</style>

<script>
import profileService from 'domain/services/profile-service'
import commonHelpers from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
export default {
  name: 'modal-master-log',

  components: {
    commonHelpers
  },

  props: [
    'masterId',
    'show'
  ],

  data: () => ({
    loading: true,
    logs: [
    ],
    logFieldLocale: {
      'fullname': 'Họ tên',
      'tel': 'Số điện thoại',
      'birthday': 'Ngày sinh',
      'gender': 'Giới tính',
      'personal_id_number': 'Số CMND/CCCD',
      'poi_personal_id_number_name': 'Nơi cấp CMND/CCCD',
      'doi_personal_id_number': 'Ngày cấp CMND/CCCD',
      'status': 'Trạng thái',
      'join_date': 'Ngày vào',
      'trial_date': 'Ngày thử việc',
      'contract_date': 'Ngày chính thức',
      'native_country_province_name': 'Tỉnh nguyên quán',
      'native_country_district_name': 'Quận/huyện nguyên quán',
      'native_country_sub_district_name': 'Phường/xã nguyên quán',
      'resident_address_province_name': 'Tỉnh thường trú',
      'resident_address_district_name': 'Quận/huyện thường trú',
      'resident_address_sub_district_name': 'Phường/xã thường trú',
      'resident_address_detail': 'Chi tiết thường trú',
      'cnb_confirmed': 'Xác nhận của C&B',
      'region': 'Miền',
      'resign_date': 'Ngày nghỉ việc',
      'resign_type': 'Hình thức nghỉ việc',
      'pause_work_type': 'Trạng thái công tác'
    },
    logFieldDate: [
      'birthday', 'join_date', 'trial_date', 'contract_date', 'resign_date', 'doi_personal_id_number', 'created'
    ],
    status: {
      'active': 'Đang làm việc',
      'disable': 'Đã nghỉ việc',
      'pause': 'Tạm dừng công việc',
      'not_verified': 'Chờ nhận việc'
    },
    gender: {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác'
    },
    cnb_confirmed: {
      '0': 'Chưa xác nhận hồ sơ',
      '1': 'Đã xác nhận hồ sơ',
      '2': 'Hồ sơ đã có thông tin'
    },
    resign_type: {
      'nghi_dung_quy_trinh': 'Nghỉ đúng quy trình',
      'nghi_ngang': 'Nghỉ ngang',
      'sa_thai': 'Sa thải'
    }
  }),

  watch: {
    show: function (newVal, oldVal) {
      this.getLogs(this.masterId)
      this.$refs['modal-log'].show()
    }
  },

  methods: {
    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },
    hideModal () {
      this.$refs['modal-log'].hide()
    },

    getLogs (mpId) {
      this.loading = true
      let sendData = {
        master_id: mpId
      }
      profileService.getLogs(sendData)
        .then(response => {
          if (response.data.success) {
            this.logs = response.data.data
            this.formatData()
          } else {
            commonHelpers.showMessage(response.data.message || 'Có lỗi xảy ra khi lấy log', 'warning')
          }
        }).catch(e => {
          console.log(e)
        }).then(() => {
          this.loading = false
        })
    },

    formatData () {
      this.logs.forEach(log => {
        if (log.diffs.gender) {
          log.diffs.gender = this.gender['' + log.diffs.gender]
        }
        if (log.diffs.cnb_confirmed) {
          log.diffs.cnb_confirmed = this.cnb_confirmed['' + log.diffs.cnb_confirmed]
        }
        if (log.diffs.status) {
          log.diffs.status = this.status['' + log.diffs.status]
        }
        if (log.diffs.resign_type) {
          log.diffs.resign_type = this.resign_type['' + log.diffs.resign_type]
        }
      })
    }
  }
}
</script>
