<template>
  <b-modal
    :id="explanationModalId"
    modal-class="modal-custom"
    size="lg"
    centered
    static
    hide-footer
    hide-header
  >
    <div class="title-explanation-modal">
      <span>{{ title }}</span>
      <button class="btn-hide-explanation-modal" @click="closeModal()">
        <img src="../../../../../../assets/images/icon/icon-hide.png" alt="icon-hide">
      </button>
    </div>
    <div
      class="content-explanation-modal"
    >
      <b-form-group
        id="input-group-awareness"
        label="Nhận thức của NLĐ về thực trạng "
        :label-for="awarenessElementId"
      >
        <span slot="label">Thực trạng <span class="text-danger">*</span></span>
        <b-form-input
          :disabled="isReadOnly"
          :id="awarenessElementId"
          :name="awarenessElementId"
          :aria-describedby="inputAwarenessElementId"
          v-model="form.awareness"
          :state="validateState('awareness')"
          type="text"
          placeholder="Nhập thực trạng của NLĐ"
        ></b-form-input>
        <b-form-invalid-feedback class="invalid-text" :id="inputAwarenessElementId">
          {{ messages.required }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="input-group-reason"
        label="Nguyên nhân "
        :label-for="reasonElementId"
      >
        <span slot="label">Nguyên nhân <span class="text-danger">*</span></span>
        <b-form-input
          :disabled="isReadOnly"
          :id="reasonElementId"
          :name="reasonElementId"
          :aria-describedby="inputReasonElementId"
          :state="validateState('reason')"
          v-model="form.reason"
          type="text"
          placeholder="Nhập nguyên nhân"
        ></b-form-input>
        <b-form-invalid-feedback class="invalid-text" :id="inputReasonElementId">
          {{ messages.required }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="input-group-plan"
        label="Phương án "
        :label-for="planElementId"
      >
        <span slot="label">Phương án <span class="text-danger">*</span></span>
        <div class="input-plan-checkbox" v-for="option in form.plan.options">
          <b-form-checkbox
            :disabled="isReadOnly"
            v-model="form.plan_types"
            :value=option.id
            name="check-button"
            class="button-checkbox"
            button
            button-variant="checkbox-outline-ghtk"
          >
            {{ option.name }}
          </b-form-checkbox>
        </div>
<!--        <p v-show="!(form.plan_types.length > 0)" class="invalid-text">-->
<!--          {{ messages.plan }}-->
<!--        </p>-->
        <b-form-input
          :disabled="isReadOnly"
          :id="planElementId"
          :name="planElementId"
          :aria-describedby="inputPlanElementId"
          :state="validateState('plan_detail')"
          v-model="form.plan_detail"
          type="text"
          placeholder="Chi tiết"
        ></b-form-input>
        <b-form-invalid-feedback class="invalid-text" :id="inputPlanElementId">
          {{ messages.required }}
        </b-form-invalid-feedback>
      </b-form-group>
      <div v-if="isReadOnly" class="text-complete-by mb-1">
        <i>{{ ticketInfo.log }}</i>
      </div>
    </div>
    <div v-if="!isReadOnly" class="text-center mt-2 mb-2">
      <b-btn
        variant="ghtk"
        class="btn button-close-explanation-modal"
        @click="save()"
      >
        Xác nhận
      </b-btn>
    </div>
  </b-modal>
</template>
<script>
// services
import ticketService from '../../../../../../domain/services/ticket-service'

// helpers
import helpers from '../../../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'ExplanationModal',
  props: {
    title: {
      type: String,
      default: 'Giải trình'
    },
    explanationModalId: {
      type: String,
      default: 'explanation-modal'
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    ticketInfo: {
      type: Object
    }
  },
  data: () => ({
    form: {
      awareness: null,
      reason: null,
      plan_detail: null,
      plan_types: [],
      plan: {
        options: [
          { id: '1', name: 'Thay đổi địa điểm' },
          { id: '2', name: 'Thay đổi tuyến' },
          { id: '3', name: 'Thay đổi vị trí làm việc' },
          { id: '4', name: 'Cần người đồng hành' },
          { id: '5', name: 'Tham gia lớp đào tạo' },
          { id: '6', name: 'Hướng dẫn thủ tục' },
          { id: '7', name: 'Phương án khác' }
        ]
      }
    },
    awarenessElementId: 'awareness',
    reasonElementId: 'reason',
    planElementId: 'plan',
    inputAwarenessElementId: 'input-awareness',
    inputReasonElementId: 'input-reason',
    inputPlanElementId: 'input-plan',
    messages: {
      required: 'Trường này không được để trống',
      plan: 'Vui lòng chọn ít nhất 1 phương án'
    }
  }),
  created () {
    if (this.isReadOnly) {
      this.form.awareness = this.ticketInfo.staff_opinion ? this.ticketInfo.staff_opinion : ''
      this.form.reason = this.ticketInfo.reason ? this.ticketInfo.reason : ''
      this.form.plan_detail = this.ticketInfo.plan_detail ? this.ticketInfo.plan_detail : ''
      this.form.plan_types = this.ticketInfo.plan_types ? Object.keys(this.ticketInfo.plan_types) : []
    }
    this.awarenessElementId = helpers.generateUniqueId(this.awarenessElementId)
    this.reasonElementId = helpers.generateUniqueId(this.reasonElementId)
    this.planElementId = helpers.generateUniqueId(this.planElementId)
    this.inputAwarenessElementId = helpers.generateUniqueId(this.inputAwarenessElementId)
    this.inputReasonElementId = helpers.generateUniqueId(this.inputReasonElementId)
    this.inputPlanElementId = helpers.generateUniqueId(this.inputPlanElementId)
  },
  methods: {
    validateState (ref) {
      if (this.form[ref] !== null) {
        if (this.form[ref].length === 0) {
          this.messages.required = 'Trường này không được để trống'
          return false
        }

        if (this.form[ref].length > 500) {
          this.messages.required = 'Trường này không được nhập quá 500 ký tự'
          return false
        }
      }
      return null
    },
    closeModal () {
      this.$bvModal.hide(this.explanationModalId)
    },
    save () {
      if (
        !this.form.awareness ||
        !this.form.reason ||
        !this.form.plan_types.length > 0 ||
        !this.form.plan_detail
      ) {
        this.form.awareness = this.form.awareness ? this.form.awareness.trim() : ''
        this.form.reason = this.form.reason ? this.form.reason.trim() : ''
        this.form.plan_detail = this.form.plan_detail ? this.form.plan_detail.trim() : ''
        helpers.showMessage('Vui lòng nhập đầy đủ thông tin', 'warning', 'Thông báo')
        return
      }

      if (this.form.awareness.length > 500 || this.form.plan_detail.length > 500 || this.form.reason.length > 500) {
        helpers.showMessage('Không nhập quá 500 ký tự', 'warning', 'Thông báo')
        return
      }

      this.completeTicket()
    },
    async completeTicket () {
      const data = {
        ticket_id: this.ticketInfo.id,
        content: this.form.content,
        staff_opinion: this.form.awareness,
        reason: this.form.reason,
        plan_detail: this.form.plan_detail,
        plan_types: this.form.plan_types
      }
      try {
        const res = await ticketService.completeTicket(data)
        if (res.data.success) {
          helpers.showMessage('Giải trình thành công', 'success', 'Thành công')
          this.closeModal()
          this.$parent.$parent.$parent.$parent.getTickets()
        } else {
          helpers.showMessage(res.data.message || 'Có lỗi xảy ra khi giải trình!', 'error', 'Lỗi')
        }
      } catch (error) {
        console.log(error)
        helpers.showMessage(error.response.data.message, 'error')
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import '../../../../../../assets/sass/components/modal-common';
</style>
