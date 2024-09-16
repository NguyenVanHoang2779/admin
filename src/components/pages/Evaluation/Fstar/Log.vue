<template>
  <div class="mt-2 log">
    <ul class="ant-timeline">
      <li class="ant-timeline-item" v-for="(log, index) in logs" :key="index">
        <div class="ant-timeline-item-tail"></div>
        <div class="ant-timeline-item-head-log">
        </div>
        <div class="ant-timeline-item-content">
          <span v-html="log"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped src="@/assets/sass/components/fstar/log.scss" lang="scss"></style>

<script>
export default {
  name: 'Log',
  props: {
    logs: {
      type: Array,
      default: _ => ([])
    }
  }
}
</script>
