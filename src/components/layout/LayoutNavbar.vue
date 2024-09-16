<template>
  <b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">

    <!-- Sidenav toggle -->
    <b-navbar-nav class="align-items-lg-center mr-auto mr-lg-4" v-if="sidenavToggle">
      <a class="nav-item nav-link px-0 ml-2 ml-lg-0" href="javascript:void(0)" @click="toggleSidenav">
        <i class="ion ion-md-menu text-large align-middle" />
      </a>
    </b-navbar-nav>

    <!-- Navbar toggle -->
    <b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>

    <b-collapse is-nav id="app-layout-navbar">
      <b-navbar-nav class="align-items-lg-center">
        <b-nav-item href="https://admin.giaohangtietkiem.vn/admin"> <i class="sidenav-icon ion ion-ios-home"/>Trang chủ</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="align-items-lg-center ml-auto">
        <b-nav-item-dropdown v-if="userInfo && userInfo.hasOwnProperty('User')" :right="!isRTL" class="demo-navbar-user">
          <template slot="button-content">
            <span class="d-inline-flex flex-lg-row-reverse align-items-center align-middle">
              <img :src="userInfo.MasterProfile.image_profile" alt class="d-block rounded-circle" width="30px" height="30px">
              <span class="px-1 mr-lg-2 ml-2 ml-lg-0">{{ userInfo.User.fullname }}</span>
            </span>
          </template>
          <b-dd-item href="/admin/logout"><i class="ion ion-ios-log-out text-danger"></i> &nbsp; Đăng xuất</b-dd-item>
          <b-dd-item :to="'/profile/master/edit/' + +(userInfo && userInfo.MasterProfile && userInfo.MasterProfile.staff_code)">
            <i class="ion ion-ios-contact text-info"></i> &nbsp; Thông tin cá nhân
          </b-dd-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else href="/admin/logout"> <i class="ion ion-ios-log-out text-danger"></i> Đăng xuất</b-nav-item>
      </b-navbar-nav>
    </b-collapse>

  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app-layout-navbar',

  props: {
    sidenavToggle: {
      type: Boolean,
      default: true
    }
  },

  computed: mapGetters({
    userInfo: 'userInfo'
  }),

  methods: {
    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },

    getLayoutNavbarBg () {
      return this.layoutNavbarBg
    }
  }
}
</script>
