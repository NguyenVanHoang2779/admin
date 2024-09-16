<template>
  <div class="router-transitions">
    <div class="wrapper">
      <div class="sidebar" id="sideBar">
        <div class="sidebar-header">
          <div class="logo">
            <img src="https://admin.giaohangtietkiem.vn/img/logo_57.png" alt="ECOM JSC" class="logo" data-aui-responsive-header-index="0" v-bind:width="100">
            <label v-if="isOpenSideBar" for="">Quản lý phân quyền HRM</label>
          </div>
        </div>
        <div class="link-cus">
          <router-link :class="checkActiveClass('role-dashboard')"
                       :to="{path: '/rbac/role-dashboard'}">
            <i class="ion ion-ios-albums"></i>{{ isOpenSideBar ? 'Quản lý Role' : '' }}
          </router-link>
          <router-link :class="checkActiveClass('permission-dashboard')"
                       :to="{path: '/rbac/permission-dashboard'}">
            <i class="ion ion-ios-folder-open"></i>{{ isOpenSideBar ? 'Quản lý Permission' : '' }}
          </router-link>
          <router-link :class="checkActiveClass('position-dashboard')"
                       :to="{path: '/rbac/position-dashboard'}">
            <i class="ion ion-ios-ribbon"></i>{{ isOpenSideBar ? 'Quản lý quyền Position' : '' }}
          </router-link>
          <router-link :class="checkActiveClass('user-dashboard')"
                       :to="{path: '/rbac/user-dashboard'}">
            <i class="ion ion-ios-person"></i>{{ isOpenSideBar ? 'Quản lý quyền User' : '' }}
          </router-link>
          <router-link :class="checkActiveClass('document')"
                       :to="{path: '/rbac/document'}">
            <i class="ion ion-ios-book"></i>{{ isOpenSideBar ? 'Document' : '' }}
          </router-link>
        </div>
      </div>

      <!-- Page content -->
      <div class="content" id="content">
        <div class="btn-toggle" @click="toggleSideBar">
          <i v-if="isOpenSideBar" class="ion ion-ios-arrow-dropleft-circle"></i>
          <i v-else class="ion ion-ios-arrow-dropright-circle"></i>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>
<script>

export default {
  name: 'permission-layout',
  components: {

  },
  data: () => ({
    isOpenSideBar: true
  }),

  methods: {
    toggleSideBar: function () {
      if (this.isOpenSideBar) {
        document.getElementById('sideBar').style.width = '52px'
        document.getElementById('content').style.marginLeft = '52px'
      } else {
        document.getElementById('sideBar').style.width = '250px'
        document.getElementById('content').style.marginLeft = '250px'
      }
      this.isOpenSideBar = !this.isOpenSideBar
    },

    checkActiveClass: function (key) {
      let currentLink = this.$route.name
      if (currentLink === key) {
        return 'active'
      }
      return ''
    }
  }

}
</script>

<style lang="scss" scoped>
.sidebar {
  margin: 0;
  padding: 0;
  width: 250px;
  background-color: #f1f1f1;
  position: fixed;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
}

.sidebar-header {
  margin-top: 1.2rem;
  margin-bottom: 0.8rem;
}

.sidebar a {
  display: block;
  color: black;
  padding: 16px;
  text-decoration: none;
  max-height: 50px;
  font-size: 15px;
}

.sidebar a.active {
  background-color: #02a065;
  color: white;
}

/* Links on mouse-over */
.sidebar a:hover:not(.active) {
  background-color: #555;
  color: white;
}

.link-cus i {
  padding-right: 10px;
}

div.content {
  margin-left: 250px;
  padding: 1px 16px;
  height: 1000px;
  position: relative;
}

.btn-toggle {
  position: absolute;
  display: block;
  border: none;
  font-size: 22px;
  margin: 1rem auto;
  outline: none;
  left: -10px;
  top: -8px;
  cursor: pointer;
}

.logo {
  img {
    width: 39px;
    margin-left: 0.4rem;
  }
  label {
    display: inline-block;
    margin-left: 0.6rem;
    font-weight: 500;
  }
}

@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar a {float: left;}
  div.content {margin-left: 0;}
}

@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
}
</style>
