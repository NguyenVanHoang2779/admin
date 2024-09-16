<template>
  <div class="small-scrollbar">
    <b-modal id="modal-select-job-driver-x" @hide="resetData" :title="titleModal"  modal-class="modal-md" @shown="initData()" static hide-footer header-class="justify-content-center">
      <div class="txt-alert mb-2">
        {{title}}
      </div>
      <div class="content-job d-flex justify-content-between align-items-center mb-2" v-for="(job, key) in listJob" :key="key">
        <div class="content-job-info">
          <div class="info-title mb-2">
            <span><a :href="'/adm/driverx/'+job.job_id +'/edit'" target="_blank" class="job-name">{{ job.job_name || '' }}</a></span>
          </div>
          <div class="info-time">
            <span>Thời gian ứng tuyển: </span>
            <span>{{ formatDate(job.created, 'DD-MM-YYYY H:mm:ss') || '' }}</span>
          </div>
        </div>
        <div class="content-job-btn d-flex align-items-center p-2">
          <div class="btn mr-1">
              <div>{{statuses[job.status]}}</div>
          </div>
          <div class="btn--create_user">
            <b-btn class="btn btn-success text-white" id='modal-show-job-btn-create' name='modal-show-job-btn-create' @click="makeAppointment(job)">
            {{buttonAppointment}}
            </b-btn>
          </div>
        </div>
      </div>
      <div class="footer-job d-flex justify-content-center mt-4 mb-2">
        <b-btn class="btn btn-success btn__close_v2 pl-4 pr-4" @click="hideModal"> Đóng </b-btn>
      </div>
    </b-modal>
  </div>
</template>
<script>

// components
// service
import candidateService from 'domain/services/candidate-service'
import Helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalSelectJobDriverX',

  components: {
  },

  props: {
    candidate: {
      type: Object,
      default () {
        return {}
      }
    },
    typeAppointment: {
      default: 'interview'
    }
  },

  data: () => ({
    candidateData: this.candidate,
    statuses: {
      new: 'Cần liên hệ',
      selected: 'Đã trúng tuyển',
      taken: 'Đã nhận việc',
      save_info: 'Lưu thông tin',
      interview: 'Hẹn phỏng vấn'
    },
    status: '',
    typeAppointments: {
      contact: 'contact',
      interview: 'interview',
      expect_join: 'expect_join'
    },
    buttonAppointments: {
      contact: 'Cần liên hệ',
      interview: 'Hẹn phỏng vấn',
      expect_join: 'Hẹn nhận việc'
    },
    loading: false,
    listJob: [],
    titleModal: '',
    buttonAppointment: '',
    title: ''
  }),

  created () {
  },

  methods: {
    initData () {
      this.candidateData = this.candidate
      if (this.typeAppointment === this.typeAppointments.interview) {
        this.titleModal = 'Hẹn phỏng vấn ứng viên Driver&X'
        this.buttonAppointment = 'Hẹn phỏng vấn'
        this.title = 'Vui lòng chọn công việc mà bạn muốn hẹn lịch phỏng vấn với ứng viên.'
      } else if (this.typeAppointment === this.typeAppointments.expect_join) {
        this.titleModal = 'Hẹn nhận việc ứng viên Driver&X'
        this.buttonAppointment = 'Hẹn nhận việc'
        this.title = 'Vui lòng chọn công việc mà bạn muốn hẹn lịch nhận việc với ứng viên.'
      } else if (this.typeAppointment === this.typeAppointments.contact) {
        this.titleModal = 'Hẹn liên hệ ứng viên Driver&X'
        this.buttonAppointment = 'Hẹn liên hệ'
        this.title = 'Vui lòng chọn công việc mà bạn muốn hẹn lịch liên hệ với ứng viên.'
      } else {
        Helper.showMessage('Trạng thái hẹn lịch không hợp lệ!', 'warning')
        this.$bvModal.hide('modal-select-job-driver-x')
      }
      this.getJobOrCandidate(this.candidateData.id)
    },

    getJobOrCandidate (candidateId) {
      this.loading = true
      this.$startLoading()
      candidateService.getJobOrCandidate({ candidate_id: candidateId })
        .then(res => {
          this.loading = false
          this.$stopLoading()
          if (res.data.success && res.data.data.length > 0) {
            this.listJob = res.data.data
          } else {
            Helper.showMessage(res.data.message || 'không lấy được job của ứng viên!', 'warning')
            setTimeout(function () {
              this.hideModal()
            }.bind(this), 1000)
          }
        })
        .catch(e => {
          this.$stopLoading()
          this.loading = false
          Helper.showMessage('Đã có lỗi xảy ra, không lấy được job của ứng viên!', 'warning')
        })
    },

    makeAppointment (job) {
      this.$emit('selectedJobDriverX', {jobDriverX: job})
      this.hideModal()
    },

    resetData () {
      this.status = ''
      this.titleModal = ''
      this.buttonAppointment = ''
      this.listJob = []
      this.candidateData = null
      this.loading = false
    },

    formatDate (date, format) {
      if (date) return Helper.formatDate(date, format)
      return null
    },

    hideModal () {
      this.resetData()
      this.$bvModal.hide('modal-select-job-driver-x')
    }

  }
}
</script>

<style lang="scss" scoped>
.txt-alert {
  font-weight: 500;
  font-size: 16px;
}

.content-job {
  padding: 10px;
  border: 1px solid #BDBDBD;
  border-radius: 16px;

  &-info {
    .job-name {
      color: #000000;
    }

    .job-name:hover {
      color: blueviolet;
    }

    .info-title {
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }

    .info-time {
      font-size: 13px;
      font-weight: 500;
      color: #BDBDBD;
    }
  }

  &-btn {
    .btn--status {
      height: 50px;
      select {
        height: 100%;
        option {
          font-weight: 500;
        }
      }
    }

    .btn--create_user {
      button {
        background-color: #069255;
        border-radius: 10px;
        font-weight: 500;
      }
    }
  }
}

.footer-job {
    .btn__close {
      background-color: #BDBDBD;
      border-radius: 10px;
      font-weight: 500;
    }
    .btn__save, .btn__close_v2 {
      background-color: #069255;
      border-radius: 10px;
      font-weight: 500;
    }
}
</style>
