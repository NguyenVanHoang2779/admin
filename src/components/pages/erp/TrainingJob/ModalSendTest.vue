<template>
    <b-modal
        :class="'modal-custom'"
        size="lg"
        id='modal-send-test'
        centered title="Xác nhận gửi bài kiểm tra"
        @hidden="hideModal"
        hide-header hide-footer v-loading="loading" static
    >
      <div class="modal-header-custom text-center py-2">
        <span class="text-header">Xác nhận gửi bài kiểm tra</span>
        <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
      </div>
      <b-btn
        @click="toggleCollapse('test')"
        class="font-weight-500 font-large w-100 text-left py-2 d-flex justify-content-between text-black" v-b-toggle.test
        style="background-color: #F7F7F7">
        <div class="px-4 w-100 d-flex justify-content-between">
          Bài kiểm tra
          <i class="fa mt-1" style="color: #a3a4a6" :class="collapseIcon && collapseIcon.test ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </div>
      </b-btn>
      <b-collapse visible class="px-4" id="test">
        <div class="class-period">
          <div v-if="!helper.isEmpty(data) && !helper.isEmpty(data.file)" class="profile-document__element cursor-pointer ml-1"
               @click="helper.openLink(data.file)">
            <div class="document-type-desc">
              Bài kiểm tra {{ data.order }}
            </div>
            <div style="color: white; font-style: italic" class="num-img-extend">
              <i class="fa fa-eye mr-1"/>Xem</div>
            <img :src="data.file + '?extract=thumb&height=160'"/>
          </div>
        </div>
      </b-collapse>
      <b-btn
        v-if="data.joined"
        @click="toggleCollapse('student_checked')"
        class="font-weight-500 font-large w-100 text-left py-2 text-black" v-b-toggle.student-checked
        style="background-color: #F7F7F7">
        <div class="w-100 d-flex px-4 justify-content-between" >
          <div>
            <span>Học viên đã điểm danh: </span>
            <span style="color: red">{{data.joined.length}}</span>
          </div>
          <i class="fa mt-1" style="color: #a3a4a6" :class="collapseIcon && collapseIcon.student_checked ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </div>
      </b-btn>
      <b-collapse visible class="mt-2 px-5" id="student-checked">
        <div class="row" style="height: 7rem; overflow-y: scroll;">
          <template v-for="(student, idx) in data.joined">
            <b-col class="d-flex mb-2" md="6" :key="idx" v-viewer>
              <div class="w-15">
                <img :src="student.avatar" alt="avatar" height="46" width="46" class="rounded-circle">
              </div>
              <div class="w-80 ml-2 d-flex mb-2" style="flex-direction: column">
                <span class="font-weight-500">{{ student.full_name }} | {{ student.username }}</span>
                <span class="text-nowrap">{{ student.position }} | {{ student.station }}</span>
              </div>
            </b-col>
          </template>
        </div>
      </b-collapse>
      <b-btn
        v-if="data.absent"
        @click="toggleCollapse('student_absent')"
        class="font-weight-500 font-large w-100 text-left py-2 text-black" v-b-toggle.student-absent
        style="background-color: #F7F7F7">
        <div class="w-100 d-flex px-4 justify-content-between" >
          <div>
            <span>Học viên chưa điểm danh: </span>
            <span style="color: red">{{data.absent.length}}</span>
          </div>
          <i class="fa mt-1" style="color: #a3a4a6" :class="collapseIcon && collapseIcon.student_absent ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </div>
      </b-btn>
      <b-collapse visible class="mt-2 px-5" id="student-absent">
        <div class="row" style="height: 7rem; overflow-y: scroll;">
          <template v-for="(student, idx) in data.absent">
            <b-col class="d-flex mb-2" md="6" :key="idx" v-viewer>
              <div class="w-15">
                <img :src="student.avatar" alt="avatar" height="46" width="46" class="rounded-circle">
              </div>
              <div class="w-80 ml-2 d-flex mb-2" style="flex-direction: column">
                <span class="font-weight-500">{{ student.full_name }} | {{ student.username }}</span>
                <span class="text-nowrap">{{ student.position }} | {{ student.station }}</span>
              </div>
            </b-col>
          </template>
        </div>
      </b-collapse>
      <div class="text-center my-3">
        <b-btn variant="ghtk" class="btn-roll-up-student" style="width: 18%" :disabled="disableAction" @click="senMessageTest()">Xác nhận</b-btn>
      </div>
    </b-modal>
</template>

<style lang="scss" scoped>
.document-type-desc {
  z-index: 1;
  text-align: center;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  padding: 3px;
}

.num-img-extend {
  pointer-events: none;
  text-align: center;
  font-size: unset;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 86%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-document__element {
  width: 15.5%;
  position: relative;
  height: 99%;
  display: inline-block;
}
.class-period {
  padding: 15px;
  color: black;
  font-size: 0.894rem;
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
</style>

<script>
// componet
import PeriodTestBuilder from '../Education/PeriodTestBuilder'

// service
import trainingService from 'domain/services/training-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-send-test',

  components: {
    PeriodTestBuilder
  },

  props: [
    'classDetail',
    'triggerSearch'
  ],

  data: _ => ({
    disableAction: false,
    periodTestType: 'view',
    collapseIcon: {
      test: false,
      student_checked: false,
      student_absent: false
    },
    data: {},
    loading: false
  }),

  created () {
  },

  computed: {
    helper () {
      return helper
    }
  },

  watch: {
    triggerSearch: function (newVal) {
      this.getSendTestInfo()
    }
  },

  methods: {
    toggleCollapse (type) {
      this.collapseIcon[type] = !this.collapseIcon[type]
    },
    showModalTest () {
      this.$bvModal.show('edit-period-test')
    },
    async getSendTestInfo () {
      try {
        this.loading = true
        const data = await trainingService.getSendTestInfo({classPeriodId: this.classDetail.period.id})
        if (!data.data.success) return helper.showMessage(data.data.message || 'Gặp lỗi khi lấy dữ liệu xác nhân gửi bài!')
        else this.data = data.data.data
      } catch (e) {
        helper.showMessage(e.message || 'Gặp lỗi khi lấy dữ liệu xác nhân gửi bài!')
      } finally {
        this.loading = false
      }
    },
    senMessageTest () {
      if (this.classDetail.class.status === 'completed') {
        helper.showMessage('Không gửi được bài kiểm tra do đã hoàn thành!')
        return
      }
      this.disableAction = true
      trainingService.senMessageTest(this.classDetail)
        .then((res) => {
          if (res.data.success) {
            // list classes
            helper.showMessage(res.data.message, 'success')
            this.$bvModal.hide('modal-send-test')
            this.$emit('refreshPage')
            this.note = null
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi gửi tin nhắn thông báo làm bài kiểm tra !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.disableAction = false
          this.loading = false
        })
    },
    resetData () {
      this.collapseIcon = {
        test: false,
        student: false
      }
      this.data = {}
    },
    hideModal () {
      this.resetData()
      this.$bvModal.hide('modal-send-test')
    }
  }
}
</script>
