<template>
  <b-modal static :id="id" title="Đề xuất quá hạn xử lý" modal-class="modal-lg-custom">
    <b-alert show variant="danger">
      Thông báo: Hạn xử lý là <b>6h (làm việc)</b> kể từ thời điểm được gán xử lý
      <div>- Bạn sẽ bị phạt thẻ những ngày có đề xuất trễ hạn xử lý</div>
      <span class="text-primary cursor-pointer" id="detail-penalize">Chi tiết mức phạt</span>
      <b-popover target="detail-penalize" triggers="hover click">
        Tính theo chu kỳ thưởng phạt:
        <table class="table table-sm">
          <tr>
            <th>Ngày vi phạm</th>
            <th>Loại thẻ</th>
            <th>Mức phạt</th>
          </tr>
          <tr v-for="penalize in detailpenalize" :key="penalize.id">
            <td>{{ penalize.day }}</td>
            <td>{{ penalize.type }}</td>
            <td>{{ penalize.amount }}</td>
          </tr>
        </table>
      </b-popover>
    </b-alert>
    <div class="d-inline-flex w-100">
      <b-select
        class="w-12re"
        :options="optionTime"
        v-model="time"
        @change="updateTimeFilter"
      ></b-select>
      <div :class="time === -1 ? 'd-flex' : 'd-none'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">Từ</span>
          </div>
          <Datepicker
            :language="language.vi"
            v-model="missDeadlineFilter.from"
            format='dd/MM/yyyy'
            placeholder="dd/mm/yyyy"
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
          <div class="input-group-prepend">
            <span class="input-group-text">Đến</span>
          </div>
          <Datepicker
            :language="language.vi"
            v-model="missDeadlineFilter.to"
            format='dd/MM/yyyy'
            placeholder="Hiện tại"
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
        </div>
        <b-btn variant="info" class="ml-2" @click="$emit('getOrderMissDeadline')"><i class="fas fa-search"></i></b-btn>
      </div>
    </div>
    <div class="my-2">
      <span class="text-warn">{{ orderMissDeadline.length }} đề xuất gán bạn xử lý đã quá hạn, trong đó {{ orderMissDeadlineSolved }} đã được xử lý</span>
      <span class="text-danger">{{ orderMissDeadline.length - orderMissDeadlineSolved }} chưa được xử lý</span>
    </div>
    <hr class="my-0" />

    <div class="table-deadline" id="table-deadline" v-loading="loading">
    <table class="table table-sm table-hover table-borderless">
      <tr>
        <th>Mã đề xuất</th>
        <th>Thời gian được gán xử lý</th>
        <th>Hạn xử lý</th>
        <th>Thời gian xử lý</th>
        <th>Tình trạng xử lý</th>
      </tr>
      <template v-for="(o, idx) in orderMissDeadline">
      <tr :key="idx" v-if="o.still_assigned">
        <td>{{ o.order_code }}</td>
        <td>{{ formatDate(o.assign_time, 'HH:mm:ss DD/MM/YYYY') }}</td>
        <td>{{ formatDate(o.deadline, 'HH:mm:ss DD/MM/YYYY') }}</td>
        <td>{{ formatDate(o.resolved_time, 'HH:mm:ss DD/MM/YYYY') }}</td>
        <td><span class="text-danger">Chưa xử lý</span></td>
      </tr>
      </template>
      <template v-for="(o, idx) in orderMissDeadline">
      <tr :key="idx" v-if="!o.still_assigned">
        <td>{{ o.order_code }}</td>
        <td>{{ formatDate(o.assign_time, 'HH:mm:ss DD/MM/YYYY') }}</td>
        <td>{{ formatDate(o.deadline, 'HH:mm:ss DD/MM/YYYY') }}</td>
        <td>{{ formatDate(o.resolved_time, 'HH:mm:ss DD/MM/YYYY') }}</td>
        <td>{{ o.order_status === 'da_huy' ? 'Đã hủy đề xuất' : 'Đã xử lý' }}</td>
      </tr>
      </template>
      <tr v-show="!orderMissDeadline || !orderMissDeadline.length" >
        <td colspan="5">
          <div class="text-center align-center py-3">
            <i class="ion ion-md-happy font-x-large"></i>
            <b>Không có đề xuất nào quá hạn xử lý</b>
          </div>
        </td>
      </tr>
    </table>
    </div>
  </b-modal>
</template>

<style lang="css" scoped>
  .table-deadline {
    max-height: 50vh;
    overflow: auto;
  }
</style>

<script>
// build-component
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

export default {
  name: 'modal-order-miss-deadline',

  props: {
    id: {},

    orderMissDeadline: {
      type: Array,
      default: () => ([])
    },

    missDeadlineFilter: {
      type: Object
    },

    orderMissDeadlineSolved: {
      type: Number,
      default: 0
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Datepicker
  },

  data: () => ({
    language: {
      vi: vi
    },
    time: null,
    detailpenalize: [
      { id: 1, day: 'Ngày 1', type: 'Thẻ vàng', amount: 'Cảnh cáo' },
      { id: 2, day: 'Ngày 2', type: 'Thẻ vàng', amount: 'Cảnh cáo' },
      { id: 3, day: 'Ngày 3', type: 'Thẻ vàng', amount: '200.000' },
      { id: 4, day: 'Ngày 4', type: 'Thẻ vàng', amount: '200.000' },
      { id: 5, day: 'Ngày >4', type: 'Thẻ đỏ', amount: '500.000' }
    ],
    optionTime: [
      { value: null, text: 'Hôm nay' },
      { value: 10, text: '10 ngày gần đây' },
      { value: 15, text: '15 ngày gần đây' },
      { value: 30, text: '1 tháng trở lại đây' },
      { value: -1, text: 'Nhập ngày' }
    ]
  }),

  computed: {
    moment
  },

  methods: {
    genCodeOrder (id, prefix = 'BH', postfix = '', codeLength = 6) {
      return helper.genCode(id, prefix, postfix, codeLength)
    },

    formatDate (date, format) {
      if (!date) return null
      return helper.formatDate(date, format)
    },

    updateTimeFilter (val) {
      this.missDeadlineFilter.to = null
      this.missDeadlineFilter.from = null
      if (val === 10) this.missDeadlineFilter.from = moment().subtract(10, 'days').format('YYYY-MM-DD')
      if (val === 15) this.missDeadlineFilter.from = moment().subtract(15, 'days').format('YYYY-MM-DD')
      if (val === 30) this.missDeadlineFilter.from = moment().subtract(1, 'months').format('YYYY-MM-DD')
      let tblEl = this.$el.querySelector('#table-deadline')
      if (tblEl) tblEl.scrollTo({ top: 0, behavior: 'smooth' })
      if (val !== -1) this.$emit('getOrderMissDeadline')
    }
  }
}
</script>
