<template>
    <div>
      <div v-if="classDetail" class="classDetail overflow-auto mh-50" :ref="studentDetailId" @scroll="handleScroll()">
        <table class="table table-hover bg-white table-order-list w-100 table-responsive-sm table-border-custom mb-1">
          <thead>
          <tr class="header-row">
            <th class="text-center" style="width: 15%"><b>Học viên</b></th>
            <th class="text-center title-period" style="width: 12%"><b>Điểm danh</b></th>
            <th class="text-center title-period w-25"><b>Bài kiểm tra</b></th>
            <th class="text-center w-20"><b>Đánh giá/Ghi chú</b></th>
          </tr>
          </thead>
          <tbody class="position-relative">
          <tr v-for="(aca, idxAca) in listStudents" :key="idxAca" :class="+aca.status === STATUS.ACTIVE ? 'student--active' : 'student--inactive'">
            <!-- Học viên -->
            <td>
              <div class="student__info">
                <b>{{aca.fullname}}</b> (<b>{{aca.username}}</b>)
                <i v-show="classDetail.class.status != 'completed'" class="fa fa-times-circle cursor-pointer" style="color: red; font-size: medium" @click="showModalDeleteAcademy(classDetail.class.id, aca.user_id, aca.id)"></i>
              </div>
              <span class="student__position">{{aca.position}}</span>
            </td>
            <!-- Điểm danh -->
            <td class="text-center">
              <div class="box-period">
                <div class="box-period-child"
                     @click="period.can_edit_checkin ? rollUpStudent(period.id, aca.master_id, period.checkin_status, classDetail) : ''"
                     v-for="(period, idP) in aca.period"
                     :key="'period' + idP"
                >
                  <div v-if="+period.passed == 1">
                    <div :id="`attendance-${period.id}-${aca.master_id}`" :class="getClassPeriod(period, period.status_period)">{{+idP + 1}}</div>
                    <div :id="`title-attendance-${period.id}-${aca.master_id}`">{{getStatusPeriodOfStudent(period, classDetail.period, (+idP + 1))}}</div>
                  </div>
                  <div
                    v-else
                    :class="addClassShowTooltip(period, classDetail.period, (+idP + 1))"
                    :data-title="getTitleTooltip(aca.status, period, classDetail.period, (+idP + 1))"
                  >
                    <div class="tooltip-css"></div>
                    <div :id="`attendance-${period.id}-${aca.master_id}`" :class="getClassPeriod(period, period.status_period)">{{+idP + 1}}</div>
                    <div :id="`title-attendance-${period.id}-${aca.master_id}`">{{getStatusPeriodOfStudent(period, classDetail.period, (+idP + 1))}}</div>
                  </div>
                </div>
              </div>
            </td>
            <!-- Bài kiểm tra -->
            <td class="text-center">
                <div v-for="(period, idxPeriod) in aca.period || []" :key="aca.user_id + '_' + idxPeriod" style="display: inline-block">
                  <div class="d-inline-block w-6re" :key="period.user_test.user_test_id" v-if="period.user_test && +period.user_test.is_took_test === 1">
                    <div class="profile-document__element mr-1" style="flex-direction: column">
                      <div class="num-img-extend mb-1">
                        <!-- Xem bài kiểm tra -->
                        <span class="view-test cursor-pointer d-inline-flex" @click="showUserTest(period.user_test.user_test_id)">
                          <i class="far fa-eye font-10 text-ghtk"></i>
                          <span class="text-ghtk">Xem</span>
                        </span>
                        <!-- Chấm bài -->
                        <span
                            v-if="validateBtn(period, classDetail.class.periods, classDetail.class.is_lecturer, 'first')"
                            class="mark-test cursor-pointer d-inline-flex"
                            @click="showModalMark(aca.fullname, classDetail.class.id, period.user_test.user_test_id, idxAca, idxPeriod)"
                        >
                            <i class="far fa-edit mb-1 font-10" style="color: #00904A"></i>
                            <span class="text-ghtk">Chấm bài</span>
                        </span>
                        <!-- Chấm lại -->
                        <span
                            v-if="validateBtn(period, classDetail.class.periods, classDetail.class.is_lecturer, 'notFirst')"
                            class="mark-test cursor-pointer d-inline-flex"
                            @click="showModalMark(aca.fullname, classDetail.class.id, period.user_test.user_test_id, idxAca, idxPeriod)"
                        >
                            <i class="fas fa-pencil-alt cursor-pointer" style="color: #00904A"></i>
                            <span class="text-ghtk">Chấm lại</span>
                        </span>
                        <!-- Gửi lại bài -->
                        <span
                            v-if="showRetestBtn(period)"
                            class="mark-test cursor-pointer d-inline-flex"
                            @click="retest(period.user_id)"
                        >
                            <i class="fas fa-redo" style="color: #00904A"></i>
                            <span class="text-ghtk">Gửi lại bài</span>
                        </span>
                      </div>
                      <pdf :src="getTest(period.user_test)"></pdf>
                    </div>
                    <div class="text-center font-11 mt-1 font-weight-bold">
                      Buổi {{ idxPeriod + 1 }}: {{ testResult(period.user_test, period.score) }}
                    </div>
                  </div>
                </div>
            </td>
            <!-- Ghi chú -->
            <td>
              <div class="box-review">
                <div v-for="(period, idx) in sortArray(aca.note)" :key="'box-review-period' + idx" class="mb-10px review-custom">
                  <b-btn :disabled="period.status_period === 'coming_up'" class="btn btn-font-defualt btn-outline-ghtk btn-review"
                         :class="period.status_period === 'coming_up' ? 'btn-review-disabled' : ''"
                  @click="openModalReview(period)"
                  >
                    <i class="fa fa-pencil-alt cursor-pointer font-11"></i>
                    Đánh giá buổi {{ idx + 1 }}
                  </b-btn>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row m-0 justify-content-end" v-if="['happening', 'coming_up', 'pending'].includes(classDetail.class.status)">
        <div class="add-student-btn pl-1">
          <b-btn variant="ghtk" @click="showModalAddStudent(classDetail.class.id, classDetail.period.id, classDetail.class.tp_id)" class="w-100 rounded btn-header-class">+ Học viên</b-btn>
        </div>
      </div>
      <ModalUserTest :user-test-id="userTestId" :id="'modal-user-test_' + classDetail.class.id"></ModalUserTest>
    </div>
</template>

<style scoped lang="scss">
  .num-img-extend {
    /*pointer-events: none;*/
    text-align: center;
    font-size: 11px;
    color: white;
    background-color: rgba(0, 0, 0, 0.47);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }

  .profile-document__element {
    overflow: hidden;
    position: relative;
    border: 1px solid #ddd;
    height: 8rem;
    &:hover .num-img-extend {
      display: flex;
      flex-direction: column;
    }
    .view-test, .mark-test {
      display: block;
      width: 70px;
      height: 18px;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
      border-radius: 0.5rem;
      background: #F1F1F1;
    }
    .mark-test {
      margin-top: 14px;
    }
  }

  .box-review {
    display: block;
    max-height: 120px;
    overflow-y: auto;
  }

  .review-custom {
    display:flex;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .btn-review {
    border-radius: 25px;
    font-size: 11px !important;
    padding: 0.3rem 0.7rem 0.15rem !important;
  }

  .btn-review-disabled {
    background-color: #ffffff !important;
    color: #ABABAB !important;
    border-color: #ABABAB !important;
  }
</style>

<script>
// component
import ModalAcademyNote from './ModalAcademyNote'
import ModalAddStudent from './ModalAddStudent'
import ModalAttendance from './ModalAttendance'
import ModalUserTest from './ModalUserTest.vue'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
// service
import hrTagService from 'domain/services/hr-tag-service'
import trainingService from 'domain/services/training-service'
import pdf from 'vue-pdf'
import {eventBus} from '../../../../main'

const BACKGROUND_TEST = 'https://cache.giaohangtietkiem.vn/d/e6dcfee9d93d42cf8ab3ae5794f27f22.pdf'
export default {
  name: 'list-academy',

  components: {
    ModalAcademyNote,
    ModalAttendance,
    ModalAddStudent,
    pdf,
    ModalUserTest
  },

  props: {
    classDetail: {
      default: null
    },
    editableTag: {
      default: true
    },
    duty: {
      default: null
    },
    triggerClickBtnSearch: {
      default: false
    },
    triggerRollUpStudent: {
      default: false
    },
    triggerCancelRollupStudent: {
      default: false
    },
    dataAttendance: {
      default: null
    },
    dataCancelAttendance: {
      default: null
    }
  },

  data: () => ({
    STATUS: {
      ACTIVE: 1,
      INACTIVE: 0
    },
    tags: [],
    masterId: null,
    classId: null,
    permissionHr: false,
    permissionVh: false,
    permissionIt: false,
    currComment: '',
    currentScore: 0,
    userTestId: null,
    studentDetailId: 'studentDetailId',
    dataGetListStudent: {
      class_id: null,
      class_period_id: null,
      page: 0,
      limit: 20
    },
    stopLoadData: false,
    isLoading: false,
    listStudents: []
  }),

  created () {
    this.allowPermissionAction()
    eventBus.$on('updateScore', this.updateScore)
    this.getListStudents()
  },

  watch: {
    classDetail (newVal, oldVal) {
      this.$refs[this.studentDetailId].scrollTop = 0
      this.dataGetListStudent.page = 0
      this.stopLoadData = false
      this.listStudents = []
      this.getListStudents()
    },
    triggerRollUpStudent (newVal, oldVal) {
      this.changeCheckinStatus('yes')
    },
    triggerCancelRollupStudent (newVal, oldVal) {
      this.changeCheckinStatus('no')
    }
  },

  computed: {
    helper () {
      return helper
    }
  },

  destroyed () {
    eventBus.$off('updateScore', this.updateScore)
  },

  methods: {
    changeCheckinStatus (checkinStatus) {
      for (let i = 0; i < Object.keys(this.listStudents).length; i++) {
        let student = this.listStudents[i]
        if (student.master_id === this.dataAttendance.master_id) {
          for (let j = 0; j < Object.keys(student.period).length; j++) {
            let period = student.period[j]
            if (period.id === this.dataAttendance.class_period_id) {
              this.listStudents[i].period[j].checkin_status = checkinStatus
              break
            }
          }
        }
      }
    },

    setValueGetListStudent (classDetail) {
      this.dataGetListStudent.class_id = classDetail.class.id
      this.dataGetListStudent.class_period_id = classDetail.period.id
      this.dataGetListStudent.page++
    },

    async retest (userId) {
      try {
        this.loading = true
        if (this.classDetail.class.status === 'completed') {
          helper.showMessage('Không gửi được bài kiểm tra do đã hoàn thành!')
          return
        }
        let payload = {...this.classDetail}
        payload.listStudents = payload.listStudents.filter(student => {
          return +student.user_id === +userId
        })
        payload.type = 'retest'
        const result = await trainingService.senMessageTest(payload)
        if (result.data.success) {
          this.$emit('refreshPage')
        }
        helper.showMessage(result.data.message, result.data.success ? 'success' : 'warn')
      } catch (e) {
        helper.showMessage('Không lấy được dữ liệu!', 'warn')
      } finally {
        this.loading = false
      }
    },
    testResult (userTest, score) {
      let result = +score + '/10'

      if (userTest && userTest.type_test !== 'multiple_choice' && userTest.is_graded !== 1) {
        result = 'Chưa chấm'
      }

      return result
    },
    // Kiểm tra điều kiện hiển thị nút gửi lại bài
    showRetestBtn (period) {
      // buổi học đã hoàn thành thì không hiển thị nút gửi lại bài
      if (period.status_period === 'finished') {
        return false
      }

      return period.can_resend_test
    },

    showUserTest (userTestId) {
      this.userTestId = userTestId
      this.$bvModal.show('modal-user-test_' + this.classDetail.class.id)
    },
    openLink (link) {
      window.open(link, '_blank')
    },
    triggerInputNote (type, id) {
      let hideId = null
      let showId = null
      if (type === 'hide') {
        hideId = 'edit_note_' + id
        showId = 'note_' + id
      }
      if (type === 'show') {
        showId = 'edit_note_' + id
        hideId = 'note_' + id
        let inputDom = document.getElementById('input_note_' + id)
        this.$nextTick(() => inputDom.focus())
      }
      let hide = document.getElementById(hideId)
      let show = document.getElementById(showId)
      hide.style.display = 'none'
      show.style.display = 'block'
    },
    setColorScore (score) {
      if (score < 8) {
        return 'colorRed'
      }
    },
    refreshPage () {
      this.$emit('refreshPage')
    },

    showModalAddStudent (classId, periodId, tpId) {
      this.$emit('action', {action: 'showModalAddStudent', classId, periodId, tpId})
    },

    showModalDeleteAcademy (classId, userId, masterId) {
      this.$emit('action', {action: 'showModalDeleteAcademy', classId, userId, masterId})
    },

    // Hiển thị modal chấm điểm
    showModalMark (fullName, idClass, userTestId, idStudent, idPeriod) {
      this.$emit('action', {action: 'showModalMark', userTestId, fullName, idClass, idStudent, idPeriod})
    },

    updateScore (dataEvent) {
      if (dataEvent.hasOwnProperty('idStudent') && dataEvent.hasOwnProperty('idPeriod') && dataEvent.hasOwnProperty('totalScore') && dataEvent.hasOwnProperty('userTestId')) {
        let idStudent = dataEvent.idStudent
        let idPeriod = dataEvent.idPeriod
        let userTestId = dataEvent.userTestId
        let totalScore = dataEvent.totalScore
        if (this.listStudents[idStudent] && this.listStudents[idStudent].period[idPeriod] && this.listStudents[idStudent].period[idPeriod].user_test && +this.listStudents[idStudent].period[idPeriod].user_test.user_test_id === +userTestId) {
          this.listStudents[idStudent].period[idPeriod].score = totalScore
          // hiển thị là chấm lại:
          this.listStudents[idStudent].period[idPeriod].user_test.is_graded = 1
        }
      }
    },
    getClassPeriod (period, periodStatus) {
      let defaultClass = 'text-white period-number bg-period-number-active lesson-information'
      let classColor = ' bg-period-number-dis-active'
      if (period.can_edit_checkin) defaultClass += ' cursor-pointer'
      if (periodStatus === 'finished') {
        if (parseInt(period.passed) === 1) classColor = ' bg-period-number-active'
        else classColor = ' bg-period-number-fail'
      }
      if (periodStatus !== 'finished' && period.checkin_status === 'yes') classColor = ' bg-period-number-active'
      defaultClass += classColor
      return defaultClass
    },

    getStatusPeriodOfStudent (periodOfStudent, currentPeriodOfClass, currentLoopClassIndex) {
      if (+currentPeriodOfClass.order >= currentLoopClassIndex) {
        if (periodOfStudent.checkin_status === 'yes') {
          return 'Có mặt'
        } else if (periodOfStudent.checkin_status === 'no' || periodOfStudent.checkin_status === null) {
          if (+currentPeriodOfClass.order === currentLoopClassIndex && currentPeriodOfClass.status !== 'finished') {
            return ''
          }
          return 'Vắng'
        }
      }
      return ''
    },

    addClassShowTooltip (period, currPeriod, currentLoopClass) {
      if (+currPeriod.order === currentLoopClass) {
        if (currPeriod.status !== 'finished' && currPeriod.status !== 'coming_up') {
          if (period.checkin_status === 'yes') return 'show-tooltip'
          else return 'show-tooltip'
        }
      }
    },

    getTitleTooltip (statusStudent, period, currPeriod, currentLoopClass) {
      if (+currPeriod.order < currentLoopClass || +statusStudent === this.STATUS.INACTIVE) return ''
      if (+currPeriod.order === currentLoopClass) {
        if (currPeriod.status !== 'finished') {
          if (period.checkin_status === 'yes') return 'Click để bỏ điểm danh học viên'
          else return 'Click để điểm danh cho học viên'
        } else if ((period.checkin_status !== 'yes' || period.score < 8 || !period.score)) return ''
      }
      if (+currPeriod.order > currentLoopClass && (period.checkin_status !== 'yes' || period.score < 8 || !period.score)) return ''
      return ''
    },

    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },

    rollUpStudent (classId, masterId, checkinStatus, classDetail) {
      this.$emit('action', {action: 'rollUpStudent', classId, masterId, checkinStatus, classDetail})
    },

    // Check điều kiện hiển thị button
    validateBtn (period, periodsInfo, isLecture, type) {
      // Phải là giảng viên mới được chấm bài
      if (!isLecture) {
        return false
      }
      // Lớp đã hoàn thành thì k hiện nút chấm điểm:
      if (periodsInfo.length > 0) {
        let data = periodsInfo.filter((item) => +item.ErpTpClassPeriod.tp_period_id === +period.user_test.tp_period_id)
        if (data[0] && data[0].ErpTpClassPeriod && data[0].ErpTpClassPeriod.status === 'finished') {
          return false
        }
      }
      // Bài kiểm tra chỉ có phần trắc nghiệm thì k hiện:
      if (period.user_test.type_test && String(period.user_test.type_test) === 'multiple_choice') {
        return false
      }
      // Đã làm bài thì mới hiển thị
      if (period.user_test.is_took_test && period.user_test.is_took_test === 0) {
        return false
      }
      // check hiển thị nút chấm bài:
      if (type === 'first') {
        // Đã chấm bài rồi thì không hiển thị nút chấm bài
        if (+period.user_test.is_graded === 1) {
          return false
        }
      } else {
        // check hiển thị nút chấm lại
        // chưa chấm bài thì không hiển thị
        if (+period.user_test.is_graded === 0) {
          return false
        }
        // đã passed nhưng là bài kiểm tra của lớp khác cùng ct thì không hiển thị chấm lại
        if (period.passed === '1' && period.user_test.is_old_test === 1) {
          return false
        }
      }

      return true
    },

    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await hrTagService.detach({
            record_id: +tag.record_id,
            table_name: tag.table_name,
            hr_tag_id: +tag.id
          })
          if (data.data.success) {
            this.$emit('refreshPage')
            this.tags = this.tags.filter(x => {
              return +x.id !== +tag.id
            })
            helper.showMessage(data.data.message || 'Bỏ gắn tag thành công!', 'success')
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY HH:mm:ss')
    },
    async addAcademyNote (note, id, masterId, domId) {
      let updateData = {
        id: id,
        note: note,
        masterId: masterId || null,
        classId: this.classDetail.class.id || null,
        periodStatus: this.classDetail.period.status || null
      }
      try {
        this.loading = true
        const {data} = await trainingService.addAcademyNote(updateData)
        if (data.success) {
          // list classes
          helper.showMessage(data.message, 'success')
          this.triggerInputNote('hide', domId)
          this.$emit('refreshPage')
        } else {
          helper.showMessage(data.message || 'Gặp lỗi khi thêm ghi chú!', 'warning')
        }
      } catch (e) {
        console.log(e.message)
      } finally {
        this.loading = false
      }
    },
    allowPermissionAction () {
      let duty = [...this.duty]
      if (duty.includes('IT')) {
        this.permissionHr = true
        this.permissionVh = true
        this.permissionConfirm = true
        this.permissionIt = true
      }

      if (duty.includes('HR')) {
        this.permissionHr = true
      }

      if (duty.includes('VH')) {
        this.permissionVh = true
      }

      if (duty.includes('curator-teacher')) {
        this.permissionConfirm = true
      }
    },
    sortArray (Obj) {
      let array = Object.values(Obj)
      return array.sort((a, b) => a.id < b.id ? -1 : 1)
    },

    getTest (test) {
      return test.file ? test.file : BACKGROUND_TEST
    },
    handleScroll () {
      if (this.stopLoadData || this.isLoading) {
        return true
      }
      const elementStudentDetail = this.$refs[this.studentDetailId]
      if (elementStudentDetail.scrollTop + elementStudentDetail.clientHeight + 100 >= elementStudentDetail.scrollHeight) {
        this.getListStudents()
      }
    },
    getListStudents () {
      this.isLoading = true
      this.setValueGetListStudent(this.classDetail)
      trainingService.getListStudents(this.dataGetListStudent)
        .then((res) => {
          if (res.data.success) {
            if (res.data.data.length < this.dataGetListStudent.limit) {
              this.stopLoadData = true
            }
            this.listStudents = [...this.listStudents, ...res.data.data]
            this.isLoading = false
          } else {
            helper.showMessage(res.data.message)
            this.isLoading = false
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            helper.showMessage(e.response.data.message)
            this.isLoading = false
          }
        })
    },
    openModalReview (data) {
      this.$emit('action', {action: 'showModalReview', dataModal: data})
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped lang="scss">
    .btn-font-defualt {
        font-size: 0.894rem;
    }
    .add-student-btn {
      padding-block: 0.75rem;
      width: 14.2857%;
    }
    .colorRed {
      color: rgba(234, 5, 5, 0.8);
    }
    .log-timeline .log-timeline-item:last-child .log-timeline-item-tail {
      height: calc(100% - 22px);
    }
    .table-data {
      min-height: 10vh;
      max-height: 75vh;
      overflow: auto;
      -ms-overflow-style: none;
    }
    .table-data::-webkit-scrollbar {
      width: 0 !important;
      display: none;
    }
    .table thead th {
      vertical-align: bottom;
      border-bottom: 2px solid #f1f1f2;
      position: sticky;
      top: -1px;
      background: #fafafa;
      z-index: 1;
    }
    .lesson-information {
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
      line-height: normal;
    }
    .action-btn {
        width: 110px;
        border-radius: 20px;
        text-align: center;
    }
    .period-number {
        width: 20px;
        height: 20px;
        border: solid 1px #f1f1f2;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 3px;
    }
    .bg-period-number-active {
        background: #069255;
        color: white;
    }
    .bg-period-number-dis-active {
        background: #BDBDBD;
        color: rgb(20, 12, 12);
    }
    .mb-10px {
      margin-bottom: 10px;
    }
    .bg-period-number-fail {
        background: rgba(234, 5, 5, 0.8);
    }
    .deleteTag {
      position: absolute;
      top: -5px;
      right: -5px;
      color: black;
      display: none;
    }

    .tag {
      display: inline-block;
      padding: 0 0.25rem;
      margin: 0;
    }
    .table-border-custom {
        border-right: 1px solid #dfe1e3;
        tr {
            border: solid 1px #f1f1f2;
        }
    }
    .detail-logs {
      ul.log-timeline {
        max-height: 154px;
        li:last-child {
          margin-bottom: -18px;
        }
      }
      .log-timeline{
        box-sizing: border-box;
        color: #000;
        font-variant: tabular-nums;
        line-height: 1rem;
        -webkit-font-feature-settings: "tnum","tnum";
        font-feature-settings: "tnum","tnum";
        /*margin: unset;*/
        padding: 0;
        list-style: none;
      }
      .log-timeline-item {
        position: relative;
        padding: 0 4px 0;
        list-style: none;
      }
      .log-timeline-item-tail {
        position: absolute;
        top: 8px;
        left: 0.4125rem !important;
        height: calc(100% - 4px);
        border-left: 1px solid #BDBDBD;
      }
      .log-timeline-item-head-blue {
        color: #14a05b;
        border-color: #14a05b !important;
      }
      .log-timeline-item-head {
        width: 6px;
        height: 6px;
        background-color: #000000;
        border: 2px solid transparent;
        border-radius: 89%;
      }
      .log-timeline-item-content {
        position: relative;
        top: -12px;
        margin: 0 0 0 14px;
        word-break: break-word;
        span.btn {
          border-radius: 20px;
          border: 1px solid #00904A;
        }
      }
      .time-log{
        color: #828282;
        font-size: 14px;
      }
      .content-detail-log {
        overflow-y: auto;
        padding-top: 5px;
        min-height: 2rem;
        max-height: 50px;
      }
      .content-detail-log::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
    }

    .default-tag {
      background: rgb(6, 146, 85);
      padding: 0px 5px;
      color: white;
      height: 25px;
      display: inline-block;
      margin: 2px 0px;
      line-height: 25px;
    }

    .default-tag:hover {
        .deleteTag {
            display: block;
        }
    }

    .tag-user-educate {
      flex-wrap: wrap;
    }

    .btn-header-class {
        font-size: 18px;
        line-height: initial;
    }

    .border-bottom-ghtk {
      border-top: none;
      border-left: none;
      border-right: none;
      &:focus{
        border-color: #069255;
      }
    }

    .box-period {
      display: flex;
      flex-wrap: wrap;
      &-child {
        width: 33%;
        margin-bottom: 8px;
      }
    }

    .box-score {
      display: flex;
      flex-wrap: wrap;
      &-child {
        width: 33%;
      }
    }

    .box-note {
      display: block;
      max-height: 50px;
      overflow-y: auto;
    }

    .box-note::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media only screen and (max-width: 1280px) {
      .title-period {
        width: 20% !important;
      }
    }

    .tooltip-css {
      display: none;
    }
    // css tooltip
    .show-tooltip[data-title]:hover:after {
        opacity: 1;
        visibility: visible;
      }
    .show-tooltip[data-title]:after {
        content: attr(data-title);
        background-color: #E5E5E5;
        color: #000;
        position: absolute;
        padding: 3px 12px;
        top: -1.9em;
        left: 8px;
        white-space: nowrap;
        opacity: 0;
        z-index: 1;
        visibility: hidden
      }
    .show-tooltip[data-title] {
        position: relative;
      }
    .show-tooltip:hover {
      .tooltip-css {
        transition: all 0.1s ease 0.5s;
        display: block;
        margin-top: -10px;
        margin-left: 23px;
        width: 0;
        height: 0;
        z-index: 1000;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #e5e5e5e5;
      }
    }
    .student--inactive {
      .student__info {
        color: #adadad;
      }
      .student__position {
        color: #adadad;
      }
    }
    .w-6re {
      width: 6rem;
    }
</style>
