<template>
  <b-modal :class="'modal-custom modal-custom-500'" id='modal-student-no-mark' class="modal-std" centered title="Thông báo"
           hide-header hide-footer static>
    <div class="modal-header-custom text-center" style="line-height: 2rem">
      <span class="text-header">Thông báo</span>
      <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
    </div>
    <div class="content-notice">
      <div class="title-cus">Bạn không thể hoàn thành buổi học do có các học viên chưa được chấm điểm:</div>
      <div class="wrap-notice" v-for="(student, index) in listStudentNoMark" :id="index">
          {{index+1}}. {{student.full_name}} ({{student.user_name}})
      </div>
    </div>
    <div class="text-center">
      <b-btn size="md" style="line-height: 1rem; width: 8rem;" class="mt-4 rounded mb-2 btn-ghtk font-initial" @click="hideModal()">OK</b-btn>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
    .modal-std /deep/ .modal-dialog {
      max-width: 26rem !important;
    }
    .content-notice {
      padding: 1rem;
      font-size: 16px;
      .wrap-notice {
        margin-top: 0.8rem
      }
    }
    .text-color-black {
        color: black;
    }
    .class-period {
        padding: 5px 15px;
    }
    .text-header {
        font-size: 18px;
        font-weight: 500;
    }
    .modal-header-custom {
        background-color: #069255;
        color: white;
        position: relative;
        padding: 5px 10px;
    }
    .modal-header-custom .close {
        opacity: 0.8;
        color: white;
        font-size: 22px;
        font-weight: 400;
        position: absolute;
        top: 50%;
        right: 10px;
        margin: 0;
        padding: 0;
        line-height: 1.47;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
    }
    .btn-roll-up-student {
        border-radius: 3px;
        padding: 3px 25px;
    }
    .note-student input {
      width: 100%;
      font-size: 15px;
      padding-top: 5px;
    }
    ::placeholder {
      color: #828282;
    }
</style>

<script>
// service
export default {
  name: 'modal-student-no-mark',

  components: {
  },
  props: [
    'listStudentNoMark'
  ],

  data: _ => ({
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    hideModal () {
      this.$bvModal.hide('modal-student-no-mark')
    }
  }
}
</script>
