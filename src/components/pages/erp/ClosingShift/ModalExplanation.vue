<template>
  <b-modal :id="id" :title="title" centered title-class="w-100" header-class="text-center" hide-footer @shown="resetData">
    <p class="text-black mb-0">{{config['full_name'][type]}} {{record.full_name}}</p>
    <p class="text-black mb-0">{{config['status'][type]}} {{record.status}}</p>
    <p class="text-black mb-0">{{config['deadline'][type]}} {{helper.formatDate(record.deadline, 'DD/MM/YYYY')}}</p>
    <textarea
      class="rounded form-control mt-4"
      v-model.trim="reason"
      name="reason"
      rows="4"
      placeholder="Nhập lý do xử lý muộn"
    ></textarea>
    <div class="text-center mt-4">
      <button class="btn btn-ghtk rounded text-white lh-0-8 font-weight-500" @click="$emit('confirmExplain', reason)">Xác nhận</button>
    </div>
  </b-modal>
</template>

<script>
// helpers
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-explanation',
  props: {
    id: {
      default: 'modal-explanation'
    },
    title: {
      default: 'Giải trình'
    },
    type: {
      default: null
    },
    record: {
      default: null
    }
  },
  data: _ => ({
    reason: null,
    config: {
      full_name: {
        recruitment: 'Ứng viên:',
        staff_work: 'Nhân viên:',
        onboard: 'Ứng viên:',
        off_work: 'Nhân viên:'
      },
      status: {
        recruitment: 'Trạng thái hiện tại:',
        staff_work: 'Vấn đề:',
        onboard: 'Chưa xong:',
        off_work: 'Chưa xong:'
      },
      deadline: {
        recruitment: 'Hạn xử lý:',
        staff_work: 'Hạn xử lý:',
        onboard: 'Hẹn nhận việc:',
        off_work: 'Ngày bắt đầu nghỉ:'
      }
    }
  }),
  computed: {
    helper: function () {
      return helper
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(this.id)
    },

    resetData () {
      this.reason = null
    }
  }
}
</script>

<style scoped>

</style>
