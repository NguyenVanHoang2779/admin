<template>
    <div>
        <b-modal :class="'modal-custom'" size="md" id='modal-confirm-class' centered title="Xác nhận" @hidden="hideModal" hide-header hide-footer static>
            <div class="modal-header-custom text-center">
                <span class="text-header">Xác nhận</span>
                <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
            </div>
            <div class="class-period" title="Danh sách buổi học">
                <div v-if="classDetail">
                    <div v-for="(classInfo, idx) in classDetail.class.periods">
                        <b>Buổi {{idx + 1}}</b>: <span v-if="classInfo['ErpTpPeriod']">{{ classInfo['ErpTpPeriod'].content }} | Thời gian: {{formatDate(classInfo['ErpTpClassPeriod'].start_time, 'H:mm DD-MM-YYYY')}}</span>
                         | Địa điểm: <span v-if="classInfo['ErpTpClassPeriod'].form === 'online'">Học trực tuyến</span> <span v-else>{{classInfo['Station']['name']}}</span>
                    </div>
                </div>
            </div>
            <div class="text-center mt-1 mb-1">
                <b-btn variant="ghtk" class="btn-roll-up-student" @click="confirmClass()" v-if="!isConfirming">Xác nhận</b-btn>
                <b-btn variant="ghtk" class="btn-roll-up-student" disabled v-if="isConfirming"> <i class="fa fa-spin fa-spinner"></i>Đang xác nhận</b-btn>
            </div>
        </b-modal>

    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="css" scoped>
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
        padding: 3px 33px;
    }
</style>

<script>
import moment from 'moment'
import trainingService from 'domain/services/training-service'
// helper

import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-confirm-class',

  components: {
  },

  props: [
    'classDetail'
  ],

  data: _ => ({
    isConfirming: false
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },
    confirmClass () {
      this.isConfirming = true
      let data = {
        classId: this.classDetail.class.id
      }

      trainingService.confirmClass(data)
        .then((res) => {
          if (res.data.success) {
            this.isConfirming = false
            // list classes
            helper.showMessage(res.data.message, 'success')
            this.$bvModal.hide('modal-confirm-class')
            this.$emit('refreshPage')
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi lấy thông tin lớp học !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$bvModal.hide('modal-confirm-class')
          this.loading = false
        })
    },
    hideModal () {
      this.$bvModal.hide('modal-confirm-class')
      this.isConfirming = false
    }
  }
}
</script>
