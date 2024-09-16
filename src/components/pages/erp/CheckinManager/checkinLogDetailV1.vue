<template>
  <tr>
    <td :rowspan="userCheckin.check_ins.length || 1" v-if="!idx" class="border-right">
      <div class="pl-3">
        <div>
          <b>{{ userCheckin.user.fullname }} ({{ userCheckin.user.username }})</b> <br>
          <span>{{ userCheckin.user.position_name }} - {{
              userCheckin.user.work_type_name
            }} - {{ userCheckin.user.station_name }}</span> <br>
          <span>{{ userCheckin.user.tel }}</span>
        </div>
        <div class="mt-2">
          <button class="btn btn-ghtk btn-sm btn-pill" @click="showCheckinCalendar(userCheckin.user.user_id)">
            Công thường: {{ userCheckin.statistic.normal_approved }}/{{ userCheckin.statistic.standard }}
          </button>
          <button class="btn btn-ghtk btn-sm btn-pill" @click="showCheckinCalendar(userCheckin.user.user_id)">
            Tăng ca: {{ userCheckin.statistic.ot_approved }}
          </button>
        </div>
      </div>
    </td>
    <td>
      <div class="mh-10re overflow-auto pt-1">
        <TimeLine
          :logs="checkin.logs"
          :itemStyle="{}"
          time-field="time"
          message-field="message"
          :timeFormat="formatDate"
        />
      </div>
    </td>
    <td class="text-center">
      <div v-for="(actionDesc, action) in checkin.action || []" :key="action">
        <button
          class="btn btn-outline-ghtk btn-pill btn-sm w-50 mb-2"
          @click="showCheckinDetail(checkin.checkin_log.id, action, userCheckin.user.user_id)"
        >
          {{ actionDesc }}
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import TimeLine from '../StaffLog/TimeLine'
// service

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'checkin-log-detail-v1',
  props: {
    userCheckin: {
      type: Object
    },
    checkin: {
      type: Object
    },
    idx: {
      type: Number
    }
  },
  components: {
    TimeLine
  },
  methods: {
    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },
    showCheckinDetail (checkinId, action = 'view', userId) {
      let params = {
        checkinId: checkinId,
        action: action,
        userId: userId
      }
      this.$emit('showCheckinDetail', params)
    }
  }
}
</script>

<style scoped>

</style>
