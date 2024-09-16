<template>
  <ul class="onboard-line">
    <template v-for="(lecture, step) in lectures">
      <LineItem
        :key="step"
        :message="'Buổi ' + lecture.order_number + ': ' + lecture.title"
        :contentStyle="{'width': '100%', 'display': 'inline-block', 'padding': '0 0 0 1.5rem'}"
        :headStyle="{'width' : '0.5rem', 'height': '0.5rem', 'background-color': '#00904A', 'border': '2px solid transparent', 'border-radius': '100px', 'position': 'absolute', 'top': '0.35rem'}"
        :tailStyle="{'position': 'absolute', 'left': 'calc(0.837rem/2 - 4px)', 'border-left': '2px solid #e8e8e8', 'height': 'calc(150% - 1rem)', 'top': '0.85rem'}"
      ></LineItem>
    </template>
  </ul>
</template>

<style scoped>
.onboard-line {
  font-variant: tabular-nums;
  -webkit-font-feature-settings: "tnum","tnum";
  font-feature-settings: "tnum","tnum";
  margin: 0;
  padding: 0;
  list-style: none;
}
.step-handler {
  display: none;
}
.handled-info:hover .step-handler{
  display: inline;
}
</style>

<script>
import LineItem from 'components/elements/logs/LineItem.vue'

export default {
  name: 'period-line',

  components: {
    LineItem
  },

  props: {
    lectures: {}
  },

  data: _ => ({
  }),

  computed: {
  },

  methods: {

  }
}
</script>
