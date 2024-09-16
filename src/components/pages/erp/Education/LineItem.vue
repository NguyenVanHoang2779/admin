<template>
  <li class="line-item">
    <div
      class="line-item-head"
      :class="active && 'active'"
      :style="headStyle"
    >
      <div
        class="position-absolute item-checked"
        :style="checkedStyle"
        v-show="checked"
      ></div>
    </div>
    <div class="line-item-tail" :style="tailStyle"></div>
    <div class="line-item-content" :style="contentStyle">
      <span class="line-time" :style="timeStyle">{{ time }}</span>
      <span class="line-user" :style="userStyle">{{ user }}</span>
      <span v-html="message"></span>
    </div>
    <slot name="line-item-append">
    </slot>
  </li>
</template>

<style scoped>
.line-item {
  position: relative;
  margin: 0;
  list-style: none;
}
.line-item-tail {
  position: absolute;
  top: 0.9rem;
  left: calc(0.837rem/2 - 4px);
  height: calc(150% - 1rem);
  border-left: 2px solid #e8e8e8;
}

.line-item-head {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #C4C4C4;
  border: 2px solid transparent;
  border-radius: 100px;
  position: absolute;
  top: 0.4rem;
}
.line-item-content {
  position: relative;
  word-break: break-word;
  display: inline-block;
  padding: 0 0 0 1rem;
}
.item-checked {
  color: white;
  width: 0.6rem;
  height: 0.3rem;
  border-bottom: 1px solid white;
  border-left: 1px solid white;
  transform: rotate(-45deg);
  top: 0.1rem;
  left: 0.1rem;
}
.active {
  background-color: #14a05b;
}

</style>

<script>
export default {
  name: 'line-item',

  props: {
    message: {},
    user: {},
    time: {},
    active: {
      type: Boolean,
      default: false
    },
    headStyle: {},
    tailStyle: {},
    timeStyle: {},
    userStyle: {},
    contentStyle: {},
    checkedStyle: {},
    checked: {
      type: Boolean,
      default: false
    }
  }
}
</script>
