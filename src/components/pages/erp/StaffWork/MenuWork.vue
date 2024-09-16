<template>
  <div :class="menuIsShowing ? 'menu_work' : 'menu_work menu_work--hide'" @click.prevent="focusHrWork()">
    <div class="bg-white sidebar">
      <div class="sidebar-header py-2">
        <b-btn class="collapse-btn" variant="outline-light" :title="menuIsShowing ? 'Thu gọn' : 'Mở rộng'"
               @click.prevent="changeCollapse()">
          <i class="fas fa-bars"></i>
        </b-btn>
        <h4 class="py-2 text-center mb-0 ml-3 sidebar-title">Quản lý công việc</h4>
      </div>
      <div class="sidebar-menu" v-if="listWork">
        <router-link v-for="(work, key) in (listWork || {})" :key="key" :class="generateBtnWorkClass(key)"
                     :to="{path: routerLinks[key]}">
          {{ work.desc }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.collapse-btn {
  border: 1px solid #ddd;
  color: black;
  padding-left: 0.65rem;
  padding-right: 0.65rem;
  margin: 0 5px;
}

.sidebar-menu {
  list-style: none;
  padding-inline-start: 0;
}

.active-work {
  background-color: #ddd;
}

.menu-item {
  display: block;
  border-bottom: 0.2px #ccc solid;
  width: 100%;
  padding: 0.75rem;
  color: black;
  transition: background-color 0.3s linear, padding-left 0.3s linear, color 0s;
}

.menu-item:not(.menu-item--staff-shift):hover {
  background-color: #069255;
  color: white;
  padding-left: 30px;
}

.menu-item--staff-shift {
  padding: 0;
  display: block;
  width: 130px;
  height: 24px;
  line-height: 24px;
  color: #069255;
  border: 1px #069255 solid;
  text-align: center;
  margin: 0.75rem auto;

  &:hover {
    transition-duration: 0.3s;
    background-color: #069255;
    color: white;
  }
}

.menu_work {
  width: 17.5rem;
  background-color: white;
  border-left: 1px solid rgba(24, 28, 33, 0.06);
  -webkit-transition: width 0.5s linear;
  -moz-transition: width 0.5s linear;
  -o-transition: width 0.5s linear;
  transition: width 0.5s linear;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  .sidebar-header {
    display: flex;
  }

  .sidebar {
    .sidebar-title, .menu-item-text {
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .sidebar-menu {
      display: block;

      .menu-item:not(.menu-item--staff-shift) {
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.menu_work--hide {
  width: 3.5rem;
  box-shadow: 0 2px 4px #b9b6b6;
  -webkit-transition: width 0.5s linear;
  -moz-transition: width 0.5s linear;
  -o-transition: width 0.5s linear;
  transition: width 0.5s linear;
  z-index: 1000;

  .sidebar {
    .sidebar-menu {
      display: none;

      .menu-item:not(.menu-item--staff-shift) {
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.router-link-active {
  background-color: #ddd;
}
</style>
<script>
// entities
import IframeHelper from 'domain/entities/iframeHelper'
import {eventBus} from '../../../../main'

export default {
  name: 'menu-work',

  props: {
    collapseOnChange: {
      default: false,
      type: Boolean
    },
    listWork: {
      default: _ => ({}),
      type: Object
    },
    hideMode: {
      default: true,
      type: Boolean
    }
  },

  data: _ => ({
    menuIsShowing: true,
    menuExpand: {},
    routerLinks: {
      'recruitment': '/staff-work/recruitment',
      'staff_work': '/staff-work/works',
      'take_care': '/staff-work/take-care',
      'driverx': '/staff-work/driverx',
      'staff_onboard': '/staff-work/onboard',
      'contract_sign': '/staff-work/contracts',
      'checkin_manager': '/staff-work/checkin',
      'deposit': '/staff-work/deposit',
      'f_star': '/staff-work/f-star',
      'master_profile': '/staff-work/master-profile',
      'off_work': '/staff-work/stop-working',
      'closing_shift': '/staff-work/closing-shift',
      'training_class': '/staff-work/classes',
      'post_dashboard': '/staff-work/station-operation',
      'hub_dashboard': '/staff-work/hubs',
      'must_handle': '/staff-work/must-handle',
      'staff_resign': '/staff-work/staff-resign',
      'staff_management': '/staff-work/staff-management',
      'staff_management_by_level': '/staff-work/staff-management',
      'staff_support': '/staff-work/staff-support'
    }
  }),

  methods: {
    focusHrWork () {
      IframeHelper.sendMessage({type: 'status_iframe', payload: {is_focus: true}}, null)
    },

    generateBtnWorkClass (key) {
      let result = 'menu-item text-left'
      if (key === 'closing_shift') {
        result = 'menu-item menu-item--staff-shift'
      }
      return result
    },

    changeCollapse () {
      this.menuIsShowing = !this.menuIsShowing
      eventBus.$emit('changeCollapseWork', this.menuIsShowing)
    }
  }
}
</script>
