<template>
  <ul class="ant-timeline">
    <li class="ant-timeline-item" v-for="(log, index) in  logs" :key="`log-${index}`" style="">
      <div class="ant-timeline-item-tail"></div>
      <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
      <div class="ant-timeline-item-content">
        <span class="user-log" >{{ getLogMessage(log) }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    logs: {},
    appendAction: {},
    itemStyle: {
      type: Object,
      default: _ => ({
        'padding': '0 0 20px',
        'fontSize': '14px'
      })
    },
    timeField: {
      default: 'created'
    },
    messageField: {
      default: 'desc'
    },
    timeFormat: {
      type: Function
    },
    timeLogClass: {}
  },

  methods: {
    getLogMessage (log) {
      if (typeof log === 'object' && log !== null) {
        return log.message
      }

      return log
    }
  }
}
</script>
<style scoped>
.ant-timeline{
  box-sizing: border-box;
  color: #000;
  font-variant: tabular-nums;
  line-height: 1.5;
  -webkit-font-feature-settings: "tnum","tnum";
  font-feature-settings: "tnum","tnum";
  margin: 0;
  padding: 0;
  list-style: none;
}

.ant-timeline-item {
  position: relative;
  margin: 0;
  list-style: none;
  padding: 0 0 20px; font-size: 14px;
}

.ant-timeline-item:last-child {
  padding: 0;
}

.ant-timeline-item-tail {
  position: absolute;
  top: 10px;
  left: 4px;
  height: calc(100% - 10px);
  border-left: 2px solid #e8e8e8;
}

.ant-timeline-item-head-blue {
  color: #14a05b;
  border-color: #14a05b !important;
}

.ant-timeline-item-head {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #14a05b;
  border: 2px solid transparent;
  border-radius: 100px;
}

.ant-timeline-item-content {
  position: relative;
  top: -6px;
  margin: 0 0 0 18px;
  word-break: break-word;
}
</style>
