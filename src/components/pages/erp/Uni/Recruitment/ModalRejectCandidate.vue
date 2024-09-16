<template>
  <!--         Modal từ chối ứng viên-->
    <b-modal modal-class="modal-custom" size="md" centered  static id="modal-reject-candidate" @hide="resetModal()"  hide-footer hide-header>
        <div class="modal-title-contact">
            <span>Thông báo</span>
        </div>
    <div class="modal-content-contact">
        <div class="mb-2 d-flex justify-content-center">
            <span class="justify-content-center">Chọn tag và giải thích lý do từ chối ứng viên</span>
        </div>
        <div class="tag-reason mb-2">
            <b-btn
                  v-for="(tagReason, index) in tagReasons" :key="'tag_reason'+index"
                  :class="tagReason.active ? 'btn-ghtk' : 'btn-ghtk-disable'"
                  class="btn-radius pd-5 btn-filter-tag"
                  @click="chooseTagReason(tagReason)"
            >
                {{ tagReason.name }}
            </b-btn>
        </div>
        <div>
            <b-form-group>
                <textarea
                    class="rounded form-control"
                    v-model="reason"
                    name="reject-reason-input"
                    rows="4"
                    @blur="checkStrLenReason()"
                    placeholder="Nhập nội dung giải thích"
                ></textarea>
            </b-form-group>
        </div>
        <div v-if="isShowPreviewContent">
            <div class="alert-title">Preview nội dung tin nhắn gửi tới ứng viên</div>
            <div class="preview-sms" v-text="getPreviewSmsContent()"></div>
        </div>
    </div>
    <div class="text-center mt-3 mb-2">
        <b-btn variant="secondary" class="button-deny-modal" @click="closeModalDeny()">Đóng</b-btn>
        <b-btn
            variant="ghtk" class="button-deny-modal" :disabled="saveOk"
            name="candidate-manager-btn-deny-modal" id="candidate-manager-btn-deny-modal"
            @click="rejectCandidate()"
        >
            Xác nhận
        </b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
}
.modal-title-contact {
  text-align: center;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 18px;
  color: white;
  background: #069255;
}

.modal-content-contact {
  padding: 10px 30px 0px 30px;
  font-size: 16px;
  color: #000;
}

.btn-radius {
  border-radius: 20px;
}
.pd-5 {
  padding-bottom: 5px;
  padding-top: 5px;
}

.btn-filter-tag {
  margin: 5px;
}

.alert-title {
  font-weight: 500;
  text-align: center;
  font-size: 14px;
  margin-bottom: 7px;
}

.preview-sms {
  background-color: #F1F1F2;
  border: 1px solid #F1F1F2;
  font-size: 14px;
  padding: 8px;
}
</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalRejectCandidate',
  props: {
    curCandidate: {
      type: Object,
      required: false,
      default: null
    }
  },

  data () {
    return {
      reason: null,
      reasonRejectTag: [],
      tagReasons: [
        {
          name: 'Không liên hệ được',
          active: false,
          alias: 2
        },
        {
          name: 'Không phù hợp',
          active: false,
          alias: 7
        },
        {
          name: 'Hủy ứng tuyển',
          active: false,
          alias: 3
        },
        {
          name: 'Không đi phỏng vấn',
          active: false,
          alias: 4
        },
        {
          name: 'Không nhận việc',
          active: false,
          alias: 6
        },
        {
          name: 'Đủ nhu cầu',
          active: false,
          alias: 8
        }
      ],
      saveOk: false
    }
  },

  computed: {
    isShowPreviewContent () {
      let tagReasonAlias = this.reasonRejectTag ? this.reasonRejectTag.alias : ''
      return [7, 8].includes(tagReasonAlias)
    }
  },

  methods: {
    closeModalDeny () {
      this.$bvModal.hide('modal-reject-candidate')
    },

    checkStrLenReason () {
      if (this.reason && this.reason.length < 10) {
        helper.showMessage('Nhập lý do khác không được ít hơn 10 ký tự!', 'warning')
        return false
      }
    },

    chooseTagReason (val) {
      for (let key in this.tagReasons) {
        if (this.tagReasons[key].active && this.tagReasons[key].alias !== val.alias) {
          this.tagReasons[key].active = false
        }
      }
      if (val) val.active = !val.active
      if (val.active) {
        this.reasonRejectTag = val
      } else {
        this.reasonRejectTag = null
      }
    },

    resetModal () {
      this.reason = null
      this.reasonRejectTag = []
      this.saveOk = false
      this.tagReasons = this.tagReasons.map(function (tag) {
        return {
          name: tag.name,
          active: false,
          alias: tag.alias
        }
      })
      this.$emit('hideModal')
    },

    rejectCandidate () {
      if (helper.isEmpty(this.reason)) {
        helper.showMessage('Vui lòng nhâp nội dung giải thích!', 'warning')
        return
      }
      if (helper.isEmpty(this.reasonRejectTag)) {
        helper.showMessage('Vui lòng chọn tag giải thích!', 'warning')
        return
      }
      this.$emit('rejectCandidate', {
        reason: this.reason,
        reasonRejectTag: this.reasonRejectTag.alias
      })
    },

    getPreviewSmsContent () {
      let tagReasonAlias = this.reasonRejectTag ? this.reasonRejectTag.alias : ''
      let jobName = this.curCandidate ? (this.curCandidate.job ? this.curCandidate.job.name : '') : ''
      if (tagReasonAlias === 8) {
        return `Cảm ơn bạn đã ứng tuyển vị trí ${jobName} tại GHTK. Hiện tại GHTK đã tuyển đủ vị trí này, chúng tôi sẽ liên hệ với bạn sớm nhất khi có nhu cầu.`
      } else if (tagReasonAlias === 7) {
        return `Cảm ơn bạn đã ứng tuyển vị trí ${jobName} tại GHTK. Sau khi cân nhắc kỹ, thật tiếc chúng tôi chưa thể hợp tác với bạn cho vị trí này. Hi vọng sẽ có cơ hội phù hợp lần sau.`
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
