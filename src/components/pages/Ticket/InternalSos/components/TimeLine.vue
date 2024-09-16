<template>
    <ul class="ant-timeline">
        <li class="ant-timeline-item" v-for="(log, idx) in  logs" :key="`log-${idx}`" style="padding: 0; font-size: 14px">
            <div class="ant-timeline-item-tail"></div>
            <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
            <div class="ant-timeline-item-content">
                <span>{{ formatDate(log.created) }}</span>
                <span v-html="log.message"></span>
            </div>
        </li>
    </ul>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'

export default {
  props: {
    logs: {},
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
    }
  },

  methods: {
    formatDate (date, format = 'DD-MM-YYYY HH:mm:ss') {
      return helper.formatDate(date, format)
    },

    formatUser (log) {
      if (!log || !log.created_by_info || !log.created_by_info.username) return ''

      return +log.created_by_info.id !== 1 ? (log.created_by_info.username + ' - ' + log.created_by_info.position_name)
        : log.created_by_info.username
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
    }
    .ant-timeline-item-tail {
        position: absolute;
        top: 10px;
        left: 3px;
        height: calc(100% - 10px);
        border-left: 2px solid #b3b0b0;
    }
    .ant-timeline-item-head-blue {
        color: #14a05b;
        border-color: #14a05b !important;
    }
    .ant-timeline-item-head {
        position: absolute;
        width: 8px;
        height: 8px;
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
