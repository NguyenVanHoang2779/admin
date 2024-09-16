<template>
  <div class="small-scrollbar">
    <b-modal :id="id" :title="titleModal" @hide="resetData"  modal-class="modal-md" @shown="initData()" static hide-footer header-class="justify-content-center">
      <div class="txt-alert mb-2" v-if="!checkModalClose">
        Vui lòng chọn công việc mà bạn muốn tạo tài khoản cho ứng viên. Sau khi tạo tài khoản cho 1 công việc, các công việc còn lại sẽ chuyển về trạng thái Lưu thông tin
      </div>
      <div class="txt-alert mb-2" v-else>
        Tất cả các công việc do ứng viên ứng tuyển dưới đây sẽ chuyển về trạng thái <b>Lưu thông tin</b> sau khi từ chối ứng viên. Bạn có chắc chắn muốn từ chối ứng viên này?
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
          <div class="btn--status btn mr-1">
            <select
              :class="getCandidateStatusClass(job.status)"
              @click="updateStageStatus(job, key)"
              class="form-control-sm border-0"
              v-model="job.status"
            >
              <option value="new"><span>Cần liên hệ</span></option>
              <option value="interview"><span>Đang phỏng vấn</span></option>
              <option value="selected"><span>Đã trúng tuyển</span></option>
              <option value="taken"><span>Đã nhận việc</span></option>
              <option value="save_info"><span>Lưu thông tin</span></option>
            </select>
          </div>
          <div class="btn--create_user" v-if="!checkModalClose">
            <b-btn class="btn btn-success text-white" id='modal-show-job-btn-create' name='modal-show-job-btn-create' @click="$emit('clickAction', {status: 'take_job', job: job, candidate: candidate})">
              Tạo tài khoản
            </b-btn>
          </div>
        </div>
      </div>
      <div v-if="checkModalClose" class="reason-reject-candidate">
        <b-form-group>
          <textarea
            class="rounded form-control"
            v-model.trim="rejectReason"
            name="reject-reason-input"
            rows="4"
            placeholder="Nhập lý do từ chối ứng viên"
          ></textarea>
        </b-form-group>
        <div class="footer-job d-flex justify-content-center mt-4 mb-2">
            <b-btn class="btn btn__close pl-4 pr-4 mr-2" @click="$bvModal.hide(id)"> Đóng </b-btn>
            <b-btn
                class="btn btn-success btn__save pl-4 pr-4"
                @click="$emit('clickAction', {status:'saveinfo', candidate: candidate, reason: rejectReason})"
                id='modal-show-job-btn-confirm'
                name='modal-show-job-btn-confirm'
            >
                Xác nhận
            </b-btn>
        </div>
      </div>
      <div v-else class="footer-job d-flex justify-content-center mt-4 mb-2">
        <b-btn class="btn btn-success btn__close_v2 pl-4 pr-4" @click="$bvModal.hide(id)"> Đóng </b-btn>
      </div>
    </b-modal>
  </div>
</template>
<script>

// components
import ModalSendSms from './ModalSendSms'
// service
import candidateService from 'domain/services/candidate-service'
// eslint-disable-next-line no-unused-vars
import Helper from 'infrastructures/helpers/common-helpers'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import Candidate from '../../../domain/entities/Candidate'

export default {
  name: 'modal-show-job',

  components: {
    ModalSendSms
  },

  props: {
    id: {
      type: String,
      default: 'modal-show-job'
    },
    candidate: {
      type: Object,
      default: _ => ({})
    },
    typeCandidateJob: {
      String,
      default: 'taken_job'
    }
  },

  data: () => ({
    stageStatus: null,
    curCandidate: {
      idx: null,
      candidate_id: null,
      status: null,
      statusText: null,
      evaluate: null,
      reason_saveinfo: null,
      apply_date: null
    },
    reasonSaveinfOption: [
      { text: 'Không liên hệ được', value: 'contact_fail' },
      { text: 'Hủy ứng tuyển', value: 'cancel_recruit' },
      { text: 'Trượt phỏng vấn', value: 'rejected' },
      { text: 'Từ chối nhận việc', value: 'refused' },
      { text: 'khác', value: 'other' }
    ],
    listCandidates: [],
    loading: false,
    listJob: [],
    checkModalClose: false,
    titleModal: 'Duyệt ứng viên Driver&X',
    rejectReason: ''
  }),

  created () {
  },

  methods: {
    initData () {
      if (this.typeCandidateJob === 'saveinfo') {
        this.checkModalClose = true
        this.titleModal = 'Từ chối ứng viên Driver&X'
      } else {
        this.checkModalClose = false
        this.titleModal = 'Duyệt ứng viên Driver&X'
      }
      this.getJobOrCandidate()
    },

    getJobOrCandidate (candidateId = null) {
      this.loading = true
      if (this.candidate) {
        candidateId = this.candidate.id || null
      }
      if (!candidateId) return
      this.$startLoading()
      candidateService.getJobOrCandidate({ candidate_id: candidateId })
        .then(res => {
          this.loading = false
          this.$stopLoading()
          if (res.data.success) {
            this.listJob = res.data.data
          } else {
            Helper.showMessage(res.data.message || 'không lấy được job của ứng viên!', 'warning')
          }
        })
        .catch(e => {
          this.$stopLoading()
          this.loading = false
          Helper.showMessage('Đã có lỗi xảy ra, không lấy được job của ứng viên!', 'warning')
        })
    },
    resetData () {
      this.listJob = []
      this.stageStatus = null
      this.curCandidate = null
      this.loading = false
      this.rejectReason = ''
    },

    getCandidateStatusClass (status) {
      let candidate = new Candidate()
      return candidate.getStatusClass(status)
    },

    updateStageStatus (job, idx) {
      if (!job) return
      this.loading = true
      this.$startLoading()
      candidateService.updateStatusJob(job)
        .then(res => {
          this.loading = false
          this.$stopLoading()
          if (res.data.success) {
            this.getJobOrCandidate()
          } else {
            Helper.showMessage(res.data.message || 'Cập nhật trạng thái không thành công!', 'warning')
          }
        })
        .catch(e => {
          this.$stopLoading()
          this.loading = false
          Helper.showMessage('Đã có lỗi xảy ra, Cập nhật trạng thái không thành công!', 'warning')
        })
    },

    formatDate (date, format) {
      if (date) return Helper.formatDate(date, format)
      return null
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
