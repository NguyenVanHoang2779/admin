<template>
  <ul class="log-line">
    <LineItem
      class="line-item-onboard"
      v-for="(log, idx) in logs"
      :key="idx"
      :message="log.message"
      :time="formatDate(log.created)"
      :user="formatUser(log)"
      :contentStyle="{'padding-left': '0.8rem'}"
      :headStyle="{'width' : '0.44rem', 'height': '0.44rem', 'background-color': 'black', 'top': '0.4rem'}"
      :tailStyle="{'left': 'calc(0.42rem/2 - 1px)', 'height': 'calc(100% - 0.25rem)', 'top': '0.9rem'}"
    />
  </ul>
</template>

<style lang="scss" scoped>
  .log-line {
    font-variant: tabular-nums;
    -webkit-font-feature-settings: "tnum","tnum";
    font-feature-settings: "tnum","tnum";
    margin: 0;
    padding: 0;
    list-style: none;
    margin-left: 0.3rem;
  }
</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// custom component
import LineItem from 'components/elements/logs/LineItem.vue'

export default {
  name: 'log-line',

  components: {
    LineItem
  },

  props: {
    logs: {}
  },

  data: _ => ({

  }),

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
