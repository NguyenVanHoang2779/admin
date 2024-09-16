<template>
  <ul class="ant-timeline">
    <li class="ant-timeline-item" v-for="(log, idx) in  logs" :key="`log-${idx}`" :style="itemStyle">
      <div class="ant-timeline-item-tail"></div>
      <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
      <div class="ant-timeline-item-content">
        <span :class="timeLogClass">{{ timeFormat ? timeFormat(log[timeField], 'HH:mm:ss DD-MM-YYYY') : log[timeField] }}</span>
        <span class="user-log" v-if="log.created_by">{{ log.created_by.username || '' }} {{ log.created_by.position_name ? ` - ${log.created_by.position_name}` : '' }}</span>
        <span class="user-log" v-else-if="log.user">{{ log.user.username || '' }} {{ log.user.station ? ` - ${log.user.station}` : '' }}</span>
        <span v-html="log[messageField]"></span>
        <span v-if="appendAction">
          <b class="text-ghtk-action text-underline-hover" v-if="log.action_censor" @click="$emit('action', { action: 'censor', data: log })">(Sửa)</b>
          <b class="text-ghtk-action text-underline-hover" v-if="log.type === 'update'" @click="$emit('action', { action: 'view-log-update', data: log.id })">(Chi tiết)</b>
        </span>
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
