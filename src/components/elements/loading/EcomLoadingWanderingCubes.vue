<template>
  <div class="absolute-loading" v-if="enable === true">
    <div class="sk-wandering-cubes sk-primary">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>

<style scoped>
    .absolute-loading {
        position: absolute;
        bottom: 150px;
        left: 38%;
        width: 150px;
        height: 50px;
        z-index: 999999;
        margin: 0 auto;
    }
</style>

<script>
export default {
  name: 'ecom-loading-wandering-cubes',

  props: ['enable']
}
</script>
