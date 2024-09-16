<template>
  <div>
    <ul v-if="show">
      <li v-for="item in data" :key="item.id" v-if="item !== null">
        <div class="mb-2 item-team cursor-pointer align-items-center" :id="item.id" :class="{'active-click': Object.keys(currentTeam).length !== 0 && item.id === currentTeam.id}">
          <div class="action" @click="toggle(item)">
            <span v-if="!focusedTeam">
              <i v-if="item.opened && typeof item.children !== 'undefined'" class="fa fa-chevron-down" aria-hidden="true"></i>
              <i v-else class="fa fa-chevron-right" aria-hidden="true"></i>
            </span>
          </div>
          <div class="name" @click="infoTeam(item)">
            {{ item.name }}
          </div>
          <i v-if="loading && team.id === item.id" class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
          <span v-if="!loading" class="action-add-child-no-active ml-auto mr-1">
            <i aria-hidden="true" class="fa fa-plus-square"></i>
          </span>
          <span v-if="!loading && !focusedTeam" @click.stop="toggle(item, true)" class="action-add-child ml-auto mr-1"><i aria-hidden="true" class="fa fa-plus-square"></i></span>
        </div>
        <TreeItem
          v-if="typeof item.children !== 'undefined' && item.children.length > 0"
          :data.sync="item.children"
          :currentTeam.sync="currentTeam"
          v-show="item.opened"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import teamConfigService from 'domain/services/team-config-service'
import helper from 'infrastructures/helpers/common-helpers'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import LaddaBtn from '@/vendor/libs/ladda/Ladda.vue'
import {eventBus} from '@/main'

Vue.use(BlockUI)

export default {
  name: 'TreeItem',
  components: {LaddaBtn},
  props: {
    data: {
      type: Array | Object,
      sync: true,
      required: false
    },
    currentTeam: {
      type: Object,
      sync: true,
      required: false
    },
    focusedTeam: {
      type: Boolean,
      sync: true,
      required: false,
      default: false
    }
  },
  computed: {
    helper: _ => helper
  },
  data: () => ({
    loading: false,
    show: false,
    team: {}
  }),
  created () {
    this.show = true
  },
  watch: {
    focusedTeam: function () {
      this.clickToFocusedTeam(this.data[0])
    }
  },
  mounted () {
    let el = document.getElementById('idItem').firstChild
    el.style.paddingLeft = 0
    el.style.border = 'none'
  },
  methods: {
    async toggle (item, checkAddChild = false) {
      if (checkAddChild) {
        item.opened = true
        this.scrollToTop()
        // eventBus.$emit('clickToTeam', item, true)
      } else {
        item.opened = !item.opened
        // await this.clickToTeam(item)
      }
      await this.clickToTeam(item, checkAddChild)
    },
    reload () {
      this.show = false
      this.show = true
    },
    async getChildTeam (item, checkAddChild) {
      this.team = item
      this.loading = true
      let { data } = await teamConfigService.getChildTeam({
        parent_id: item.id
      })
      this.loading = false
      if (data.success) {
        let result = data.data
        result.forEach(function (itemChild, index) {
          itemChild.cursor = String(item.cursor + '.children.' + index)
        })

        item.children = result

        eventBus.$emit('clickToTeam', item, checkAddChild)
      } else {
        helper.showMessage(data.message)
      }
    },
    async clickToTeam (item, checkAddChild) {
      if (item.opened) {
        await this.getChildTeam(item, checkAddChild)
      } else {
        item.children = []
      }
      this.reload()
    },
    async clickToFocusedTeam (item) {
      eventBus.$emit('clickToTeam', item, false)
      this.reload()
    },
    async infoTeam (item) {
      eventBus.$emit('clickToTeam', item, false)
      this.scrollToTop()
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
i {
  color: #646363;
}
ul{
  list-style: none;
  padding-left: 35px;
  margin-left: 9px;
}
.item-team {
  display: flex;
  min-width: 8rem;
}
.item-team .name {
  padding-left: 0.4rem;
  width: 85%;
}
.item ul:last-child {
  border-left: #97d2bd 1px solid;
}
.item-team:hover {
  background-color: #e7eaee;
}
.item-team:hover > .action-add-child {
  display: block;
}
.item-team:hover > .action-add-child-no-active {
  display: none;
}
.action span {
  padding-left: 4px;
}
.active-click {
  background-color: #dde0e5;
  border-left: 3px solid #02a065;
}
.action-add-child {
  display: none;
}
.action-add-child-no-active {
  opacity: 0;
}
</style>
