<template>
  <div id="app">
    <router-view/>
    <notifications group="default" />
    <notifications group="toast" position="bottom right" />
    <loading-mini-bottom :enable="$parent.showLoading"></loading-mini-bottom>
    <div id="code-name" class="d-none">{{ userInfo && userInfo.hasOwnProperty('User') ? userInfo.User.id : '' }}</div>
  </div>
</template>

<style src="@/vendor/styles/bootstrap.scss" lang="scss"></style>
<style src="@/vendor/styles/appwork.scss" lang="scss"></style>
<style src="@/vendor/styles/theme-corporate.scss" lang="scss"></style>
<style src="@/vendor/styles/colors.scss" lang="scss"></style>
<style src="@/vendor/styles/uikit.scss" lang="scss"></style>
<style src="@/assets/sass/style.scss" lang="scss"></style>

<script>
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  metaInfo: {
    title: 'Index',
    titleTemplate: '%s - GHTK Admin'
  },

  components: {
    LoadingMiniBottom
  },

  computed: mapGetters({
    userInfo: 'userInfo'
  }),

  created () {
    this.$store.dispatch('getUserInfo')
  },

  updated () {
    // Remove loading state
    setTimeout(() => document.body.classList.remove('app-loading'), 1)
  }
}
</script>
