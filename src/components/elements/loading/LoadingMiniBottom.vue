<template>
    <div class="loading fixed-loading" v-if="enable === true">
        <div class="sk-three-bounce sk-primary">
            <div class="sk-child sk-bounce1"></div>
            <div class="sk-child sk-bounce2"></div>
            <div class="sk-child sk-bounce3"></div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<script>
export default {
  name: 'loading-mini-bottom',
  props: ['enable'],
  method: {
  }
}
</script>
<style scoped>
    .fixed-loading {
        position: fixed;
        bottom: 30px;
        left: 50%;
        width: 150px;
        height: 50px;
        z-index: 999999;
        margin: 0 auto;
    }
</style>
