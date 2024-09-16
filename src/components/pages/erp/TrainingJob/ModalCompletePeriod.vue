<template>
  <b-modal :class="'modal-custom modal-complete-custom'" id='modal-complete-period' centered title="Hoàn thành"
           @hidden="hideModal" hide-header hide-footer static
           @show="initData"
  >
    <div class="modal-header-custom text-center" style="line-height: 2rem">
      <span class="text-header">Hoàn thành</span>
      <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
    </div>
    <div v-loading="loading" class="content-custom">
      <div class="header-custom">
        <p>Vui lòng đánh giá học viên khi hoàn thành buổi. Kết quả đánh giá là cơ sở để xếp loại các học viên!</p>
        <p>Các trường hợp không đánh giá sẽ được coi là “Bình thường”</p>
      </div>

      <div class="search-custom">
        <b-input type="text"
                 class="input-search"
                 v-model="dataSearch"
                 @input="quickSearch"
                 placeholder="Nhập tên, username học viên"
        >
        </b-input>
        <span class="icon-search-custom"><i class="ion ion-md-search"></i></span>
      </div>

      <b-row class="header-table-custom">
        <b-col md="3">
          <div>Học viên</div>
        </b-col>

        <b-col md="3">
          <div>Tinh thần học tập</div>
        </b-col>

        <b-col md="3">
          <div>Chuyên cần</div>
        </b-col>

        <b-col md="3">
          <div>Nhận xét riêng (nếu có)</div>
        </b-col>
      </b-row>

      <hr class="mx-3"/>

      <div :class="students && students.length > 10 ? 'table-content-custom' : ''">
        <template v-for="(student) in students">
        <b-row :key="student.id" class="font-larger align-items-center mb-4">
          <b-col md="3">
            <div class="d-flex">
              <div v-viewer class="mr-2">
                <img :src="student.avatar" alt="avatar" height="44" width="44" class="rounded-circle">
              </div>
              <div class="px-0 font-size-15">
                <span class="font-weight-500">{{ student.fullname }} ({{ student.username }})</span>
                <br/>
                <span>{{ student.score }} điểm | {{ student.result_desc }}</span>
              </div>
            </div>
          </b-col>

          <b-col md="3">
            <div>
              <multiselect class="multiselect-custom mt-1"
                           :class="student.learning_spirit ? 'border-active' : ''"
                           v-model="student.learning_spirit"
                           :options="ReviewStudentEntity.learningSpirits"
                           placeholder="Chọn nội dung"
                           selectedLabel="Đã chọn"
                           deselectLabel="Bỏ chọn"
                           selectLabel="Chọn"
                           track-by="id"
                           label="name"
                           :searchable="true"
                           :multiple="false"
                           :allow-empty="true"
                           :clearOption="true"
                           @select="checkNumberCurrentReviews(student)"
                           @remove="checkNumberCurrentReviews(student)"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
          </b-col>

          <b-col md="3">
            <div>
              <multiselect class="multiselect-custom mt-1"
                           :class="student.assiduous ? 'border-active' : ''"
                           v-model="student.assiduous"
                           :options="ReviewStudentEntity.attitudes"
                           placeholder="Chọn nội dung"
                           selectedLabel="Đã chọn"
                           deselectLabel="Bỏ chọn"
                           selectLabel="Chọn"
                           track-by="id"
                           label="name"
                           :searchable="true"
                           :multiple="false"
                           :allow-empty="true"
                           :clearOption="true"
                           @select="checkNumberCurrentReviews(student)"
                           @remove="checkNumberCurrentReviews(student)"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
          </b-col>

          <b-col md="3">
            <div class="note-student">
              <textarea
                :class="student.note ? 'border-active' : ''"
                :rows="setRows(student.note)"
                v-model="student.note"
                placeholder="Nhập nhận xét"
                class="inp-note"
                @input="checkNumberCurrentReviews(student)"
              />
            </div>
          </b-col>
        </b-row>
      </template></div>
    </div>

    <div class="total-review-current text-right mr-5">
      <div>Đã đánh giá: {{ currentReviews }}/{{ listStudentBefore ? listStudentBefore.length : 0 }}</div>
    </div>

    <div class="text-center mb-3">
      <b-btn size="md" class="mt-2 btn-outline-success rounded mb-2 font-initial btn-custom mr-4" @click="hideModal()">Đóng</b-btn>
      <b-btn size="md" class="mt-2 rounded mb-2 btn-ghtk font-initial btn-custom" :disabled="disableAction" @click="confirmCompletePeriod()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
.border-active {
  border-color: #0fe58f !important;
  border: 1px solid #0fe58f;
  border-radius: 6px;
}
.inp-note {
  width: 100%;
  margin-top: 1rem;
  border: 0;
  color: #000000;
  background: #ffffff;
  outline: none;
  word-break: break-word;
  min-height: 2rem;
  max-height: 5rem;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
  text-align: center;
  font-size: 15px;
}

.font-size-15 {
  font-size: 15px;
}
.modal-complete-custom {
    /deep/ .modal-dialog {
    max-width: 1100px !important;
    width: 1100px !important;
  }
}

.content-custom {
  padding: 1.3rem;
}

.table-content-custom {
  max-height: 26rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.header-custom {
  p {
    font-weight: 500;
    margin-bottom: 0.8rem;
    font-size: 15px;
  }
}

.search-custom {
  position: relative;
  margin-top: 1.8rem;
  .icon-search-custom {
    position: absolute;
    top: 23%;
    left: 1%;
  }

  i {
    font-size: 22px;
    color: #bfbfbf;
  }
}

.input-search {
  width: 26%;
  position: relative;
  border-radius: 10px;
  padding-left: 2rem !important;
}

.btn-custom {
  line-height: 1rem;
  width: 8rem;
}

.header-table-custom {
  margin-top: 2.5rem;
  text-align: center;
  color: #8b8b8b;
}

.total-review-current{
  color: #037a46;
  font-weight: 500;
  font-size: 15px;
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
   padding: 10px 10px;
   line-height: 2rem;
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
  text-align: center;
}
::placeholder {
  color: #828282;
}

/deep/ .multiselect__tags {
 text-align: center !important;
}
</style>

<script>
// service
import trainingService from 'domain/services/training-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import ReviewStudentEntity from 'domain/entities/ReviewsStudentEntity'

export default {
  name: 'modal-complete-period',

  components: {
    Multiselect,
    ReviewStudentEntity
  },
  props: [
    'classDetail',
    'classPeriodId'
  ],

  data: _ => ({
    disableAction: false,
    isCompleted: false,
    students: [],
    loading: false,
    studentsReviewed: [],
    dataSearch: null,
    currentReviews: 0,
    listStudentBefore: []
  }),

  created () {
  },

  computed: {
    ReviewStudentEntity () {
      return ReviewStudentEntity
    }
  },

  watch: {
    classPeriodId: function (val, oldVal) {
      if (this.classDetail && this.classDetail.period && this.classDetail.period.id) {
        this.getPeriodTestResult()
      }
    }
  },

  methods: {
    initData () {
      this.dataSearch = null
      if (this.students && this.listStudentBefore) {
        this.students = JSON.parse(JSON.stringify(this.listStudentBefore))
      }
    },
    quickSearch () {
      if (this.dataSearch && this.dataSearch.length > 0) {
        this.students = this.listStudentBefore.filter((item) =>
          item.username.toUpperCase().includes(this.dataSearch.toUpperCase()) ||
          item.fullname.toUpperCase().includes(this.dataSearch.toUpperCase())
        )
        this.isQuickSearch = true
      } else {
        this.students = JSON.parse(JSON.stringify(this.listStudentBefore))
      }
    },
    checkNumberCurrentReviews (user) {
      this.currentReviews = 0
      if (this.listStudentBefore) {
        this.listStudentBefore.forEach((item, index) => {
          if (+item.user_id === +user.user_id) {
            this.listStudentBefore[index].learning_spirit = user.learning_spirit || null
            this.listStudentBefore[index].assiduous = user.assiduous || null
            this.listStudentBefore[index].note = user.note || null
          }

          if (this.listStudentBefore[index].learning_spirit || this.listStudentBefore[index].assiduous || this.listStudentBefore[index].note) {
            this.currentReviews++
          }
        })
      }
    },

    setRows (data) {
      let rows = 1
      if (!data) {
        return rows
      }

      let strLength = data.length
      // Nhỏ hơn 22 kí tự thì để 1 hàng
      if (+strLength <= 22) {
        rows = 1
        // Lớn hơn 22 nhỏ hơn 44 kí tự thì để 2 hàng
      } else if (+strLength <= 44) {
        rows = 2
        // Còn lại 3 hàng
      } else {
        rows = 3
      }

      return rows
    },

    confirmCompletePeriod () {
      let dataComplete = {
        class_period_id: this.classDetail.period.id,
        note: this.note,
        order: this.classDetail.period.order,
        total_periods: (this.classDetail.class && this.classDetail.class.periods) ? this.classDetail.class.periods.length : 0,
        students: [],
        source_request: 'web'
      }

      let dataReviews = []
      this.listStudentBefore.forEach((student) => {
        dataComplete.students.push(
          {
            'student_id': student.user_id
          })

        if (student.learning_spirit || student.assiduous || student.note) {
          dataReviews.push({
            'user_id': student.user_id || null,
            'learning_spirit': student.learning_spirit || null,
            'assiduous': student.assiduous || null,
            'note': student.note || null
          })
        }
      })

      this.$emit('showModalConfirmCompletePeriod', {dataComplete: dataComplete, dataReviews: dataReviews})
    },

    async getPeriodTestResult () {
      try {
        this.loading = true
        let param = {classPeriodId: this.classDetail.period.id}
        const {data} = await trainingService.getPeriodTestResult(param)
        if (data.success) {
          this.students = this.convertData(data.data)
          this.listStudentBefore = JSON.parse(JSON.stringify(this.students))
        }
      } catch (e) {
        helper.showMessage('Không lấy được dữ liệu!', 'warn')
      } finally {
        this.loading = false
      }
    },

    convertData (data) {
      this.currentReviews = 0
      let results = []
      if (data.length > 0) {
        data.forEach((item) => {
          if (item.learning_spirit) {
            item.learning_spirit = ReviewStudentEntity.learningSpirits.find((op) => +op.id === +item.learning_spirit)
          }

          if (item.assiduous) {
            item.assiduous = ReviewStudentEntity.attitudes.find((op) => +op.id === +item.assiduous)
          }

          if (item.learning_spirit || item.assiduous || item.note) {
            this.currentReviews++
          }

          results.push(item)
        })
      }

      return results
    },

    hideModal () {
      this.$bvModal.hide('modal-complete-period')
    }
  }
}
</script>
