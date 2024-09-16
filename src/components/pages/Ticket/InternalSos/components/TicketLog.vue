<template>
    <hr class="hr-text" :data-content = "`${text}`">
</template>
<script>
export default {
  props: ['text'],
  name: 'ticket-log',

  components: {
  },
  watch: {
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
    .hr-text {
        margin: 0;
        line-height: 1em;
        position: relative;
        outline: 0;
        border: 0;
        text-align: center;
        height: 2.5em;
        opacity: .8;
        font-size: 13px;
    &:before {
        content: '';
        background: linear-gradient(to right, transparent, #3393dd, transparent);
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
     }
    &:after {
        content: attr(data-content);
        position: relative;
        display: inline-block;
        padding: 0.5em;
        line-height: 1.5em;
        color: #3393dd;
        background-color: white;
     }
    }
</style>
