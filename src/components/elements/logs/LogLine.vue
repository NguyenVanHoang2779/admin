<template>
  <ul class="log-line pb-2">
    <LineItem
      class="line-item-onboard"
      v-for="(log, idx) in logs"
      :key="idx"
      :active="true"
      :message="log.message"
      :time="formatDate(log[timeField])"
      :user="formatUser(log)"
      :contentStyle="contentStyle"
      :headStyle="headStyle"
      :tailStyle="tailStyle"
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
  .mh-65px {
    max-height: 65px;
  }
</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// custom component
import LineItem from './LineItem.vue'

export default {
  name: 'log-line',

  components: {
    LineItem
  },

  props: {
    logs: {},
    timeField: {
      default: 'created'
    },
    userField: {
      default: 'created_by'
    },
    contentStyle: {
      default: _ => ({'padding-left': '0.8rem'})
    },
    headStyle: {
      default: _ => ({'width': '10px', 'height': '10px'})
    },
    tailStyle: {
      default: _ => ({'left': '4px', 'height': 'calc(100% - 0.25rem)', 'top': '0.8rem'})
    }
  },

  data: _ => ({

  }),

  methods: {
    formatDate (date, format = 'DD-MM-YYYY HH:mm:ss') {
      return helper.formatDate(date, format)
    },

    formatUser (log) {
      if (!log || !log[this.userField] || !log[this.userField].username) return ''

      return +log[this.userField].id !== 1 ? (log[this.userField].username + (log[this.userField].position_name ? ' - ' + log[this.userField].position_name : ''))
        : log[this.userField].username
    }
  }
}
</script>
