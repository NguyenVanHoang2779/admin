<template>
  <div class="detail-logs-update">
    <div class="log-title">
      <b class="text-deatil-log">Chi tiết log</b>
    </div>
    <div class="content-detail-log">
      <ul class="log-timeline" v-if="detailLog">
        <li class="log-timeline-item" v-for="(log, idx) in detailLog" :key="idx">
          <div class="log-timeline-item-tail"></div>
          <div class="log-timeline-item-head ant-timeline-item-head-blue"></div>
          <div class="log-timeline-item-content">
            <span>{{ formatDate(log.created, 'DD-MM-YYYY HH:mm:ss') }} </span>
            <span v-if="log.created_by">{{ log.created_by.username || '' }}
              <span v-if="log.created_by.position_name">- {{ log.created_by.position_name || '' }}</span></span>
            <span v-if="log.message && !log.message.old && !log.message.new" v-html="log.message"> </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DetailLogOrderResignWork',
  props: {
    detailLog: {
      default: null
    }
  },
  methods: {
    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-logs-update {
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
    line-height: 1.9;
    -webkit-font-feature-settings: "tnum","tnum";
    font-feature-settings: "tnum","tnum";
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .log-timeline-item {
    position: relative;
    margin: 0;
    padding: 0 4px 0;
    list-style: none;
  }
  .log-timeline-item-tail {
    position: absolute;
    top: 8px;
    left: 0.41rem;
    height: calc(100% - 4px);
    border-left: 2px solid #BDBDBD;
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
    top: -16px;
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
    padding-top: 18px;
  }

  .content-detail-log::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
.text-deatil-log{
  color: #000000;
}

.text-time {
  font-weight: 500;
  color: #000000;
}

</style>
