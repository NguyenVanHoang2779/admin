<template>
  <tr class="education-row">
    <td class="border-right">
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-between mb-1 ml-2 mt-1">
          <span><b>Nội dung:</b> {{ syllabus.content }}</span>
        </div>
        <div class="mb-1 ml-2">
          <b>Mã chương trình:</b> {{ syllabus.code }}
        </div>
        <div class="mb-1 ml-2">
          <b>Thời gian tạo:</b> {{ helper.formatDate(syllabus.created, 'HH:mm:ss DD-MM-YYYY') }}
        </div>
        <div class="mb-1 ml-2">
          <b>Ngày bắt đầu:</b> {{ syllabus.time_start ? formatDate(syllabus.time_start) : '' }}
        </div>
        <div class="mb-1 ml-2">
          <b>Ngày kết thúc:</b> {{ syllabus.time_end ? formatDate(syllabus.time_end) : ''}}
        </div>
        <div class="mb-1 ml-2">
          <b>Người tạo:</b> {{ syllabus.created_by }}
        </div>
      </div>
      <b class="ml-2">Tài liệu:</b>
      <div class="profile-document mt-1 ml-2">
        <template v-for="(periodDocument, idxPeriodDoc) in syllabus.periods">

          <div v-if="periodDocument.documents.length > 0" :key="idxPeriodDoc" class="d-inline-block position-relative mr-1 mb-1 profile-document-container cursor-pointer"
               @click="$emit('action', {action: 'view-documents', data: periodDocument})">
            <div class="document-type-desc">
              Tài liệu buổi {{ idxPeriodDoc + 1 }}
            </div>
              <span>
                <img
                  :class="idxPeriodDoc"
                  class="image-document"
                  :src="getThumbnailPeriod(periodDocument)"
                  alt=""
                />
              </span>
          </div>
        </template>
      </div>
    </td>
    <td class="border-right">
      <div class="d-flex flex-column">
        <span class="mb-1 ml-2 mt-1"><b>Học viên:</b> {{ syllabus.positions}}</span>
        <span class="mb-1 ml-2"><b>Kiểu nhân viên:</b> {{ syllabus.work_types }}</span>
        <span class="mb-1 ml-2"><b>Thâm niên:</b> {{ syllabus.seniority_min }}-{{ syllabus.seniority_max }} ngày</span>
        <span class="mb-1 ml-2"><b>Khu vực:</b> {{ syllabus.regions }}</span>
        <span class="mb-1 ml-2"><b>Yêu cầu:</b> {{
            helper.isEmpty(syllabus.required_tp) ? 'Không' : syllabus.required_tp
          }}</span>
        <span class="mb-1 ml-2"><b>Số lượng học viên:</b> {{ syllabus.amount_min }}-{{ syllabus.amount_max }}</span>
      </div>
      <div class="mb-1 ml-2">
        <b>Nội dung:</b>
        <PeriodLine :lectures="syllabus.periods"></PeriodLine>
      </div>
      <div class="mt-3 ml-2">
        <b>Logs:</b>
        <LogLine
          time-field="created_at"
          ref="logLine"
          :logs="logSyllabus.logs"
          class="ml-0 overflow-auto mh-10re mb-1"
          :headStyle="{'width': '0.25rem', 'height': '0.25rem', 'background': 'black', 'top': '0.5rem'}"
          :tailStyle="{'left': '0.05rem', 'height': 'calc(100% - 0.12rem)', 'top': '0.8rem'}"
        />
        <div v-if="loadingLogs" class="text-center mt-2">
          <i class="fa fa-spin fa-spinner fa-2x ghtk-color"></i>
        </div>
      </div>
    </td>
    <!-- action  -->
    <td class="text-center">
      <div class="d-flex flex-column align-items-center">
        <button
          @click="$emit('action', {action: canEdit ? 'edit-syllabus' : 'view-syllabus' || null, data: {}})"
          class="btn btn-sm btn-outline-ghtk btn-pill mb-2 mt-1 font-unset btn-cus"
        >
          {{ canEdit ? 'Sửa' : 'Xem'}}
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
// service
import trainingUniService from 'domain/services/Erp/HrmUni/training-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

// custom component
import PeriodLine from './PeriodLine'
// custom component
import LogLine from 'components/elements/logs/LogLine.vue'

export default {
  name: 'education-row',
  components: {
    PeriodLine,
    LogLine
  },
  props: {
    syllabus: {
      type: Object,
      default: () => ({})
    },
    permissionEdit: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.getLogSyllabus(this.syllabus)
    this.$refs.logLine.$el.addEventListener('scroll', this.handleScroll)
  },
  data: _ => ({
    logSyllabus: {
      currentPage: 0,
      totalPage: 0,
      logs: []
    },
    loadingLogs: false
  }),
  watch: {
    syllabus: function () {
      this.logSyllabus.logs = []
      this.getLogSyllabus(this.syllabus)
    }
  },
  computed: {
    helper: function () {
      return helper
    },
    organization_desc: function () {
      if (this.syllabus.organization_type === 'all') return 'Offline, Online'
      if (this.syllabus.organization_type === 'online') return 'Online'
      if (this.syllabus.organization_type === 'offline') return 'Offline'
      return ''
    },
    statusMapper: function () {
      let desc = ''
      if (this.syllabus.status === 'closed') desc = 'Đóng'
      if (this.syllabus.status === 'open') return 'Mở'
      return desc
    },
    canEdit () {
      return this.syllabus.update_permission || this.syllabus.force_update_permission
    }
  },
  methods: {
    getThumbnailPeriod (period) {
      return period.documents[0].links.thumbnail
    },
    formatDate (date) {
      let d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      let year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }

      return [day, month, year].join('-')
    },
    async getLogSyllabus (syllabus, page = 1, limit = 10) {
      try {
        this.loadingLogs = true
        const data = await trainingUniService.getLogSyllabus({
          tp_id: syllabus.id,
          page: page,
          limit: limit
        })
        this.logSyllabus.logs = this.logSyllabus.logs.concat(data.data.data)
        this.logSyllabus.currentPage = data.data.current_page
        this.logSyllabus.totalPage = data.data.total_page
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loadingLogs = false
      }
    },
    handleScroll () {
      const logLineElement = this.$refs.logLine.$el
      if (logLineElement.scrollTop + logLineElement.clientHeight >= logLineElement.scrollHeight &&
        this.logSyllabus.currentPage < this.logSyllabus.totalPage &&
        this.logSyllabus.totalPage !== 0) {
        this.getLogSyllabus(this.syllabus, this.logSyllabus.currentPage + 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.organize-form {
  &-active, &-disable {
    border-radius: 100px;
    width: 16px;
    height: 16px;

    .checkmark {
      transform: rotate(45deg);
      height: 9px;
      width: 5px;
      margin-top: 0.12rem;
      margin-left: 37%;
      border-bottom: 1px solid #FFFFFF;
      border-right: 1px solid #FFFFFF;
    }
  }

  &-active {
    background-color: #14a05b;
    border-color: #14a05b;
  }

  &-disable {
    background-color: #BDBDBD;
    border-color: #BDBDBD;
  }
}

.profile-document {
  position: relative;
  width: 100%;
  height: 100%;
  &-container {
    width: 5vw;
    height: 13vh;
  }
}

.education-row {
  color: #000;
}
.education-row:hover {
  background-color: #F4FEF6;
}

.w-51 {
  width: 51% !important;
}

.check-style {
  color: white;
  background: #BDBDBD;
  border-radius: 10px;
}

.active {
  background: #069255;
}

.inactive {
  background: red;
}

.view-pdf {
  position: unset !important;
}

.document-type-desc {
  text-align: center;
  font-size: xx-small;
  color: white;
  background-color: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
}

.image-document {
  width: 5vw;
  height: 13vh;
  display: inline-block;
  border: 1px solid #ccc;
  vertical-align: middle;
}
.btn-cus {
  box-shadow: 1px 3px 2px #c9c3c3ed;
  border-radius: 8px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  font-size: 14px;
  text-align: center;
  display: block;
  margin: auto;
  width: 100px;
}
</style>
