<template>
  <div>
    <p><b>Tiến độ đề xuất</b></p>
    <ul class="ant-timeline">
      <li class="ant-timeline-item" v-for="(process, index) in processing" :key="index">
        <div class="ant-timeline-item-tail" v-if="index < processing.length - 1"></div>
        <div class="ant-timeline-item-head-active ant-timeline-item-head-blue" v-if="process.active === 1">
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-head" v-else>
          <div class="checkmark"></div>
        </div>
        <div class="ant-timeline-item-content">
          <span class="font-weight-bold">{{ process.status_name }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped src="@/assets/sass/components/fstar/progress.scss" lang="scss"></style>

<script>
export default {
  name: 'Progress',
  props: {
    processing: {
      type: Array,
      default: _ => ([])
    }
  }
}
</script>
