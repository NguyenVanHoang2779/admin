<template>
  <div class="text-right tab-work-scroll">
    <div class="pre-tab pre-tab-left">
      <div class="pre-btn text-ghtk" v-if="tabScroll.leftShow" @click="scrollTab('tab-work', 'left')">
        <i class="ion ion-ios-arrow-back"></i>
      </div>
    </div>
    <div class="work-options" v-scroll="checkScrollTab" v-resize="checkScrollTab" id="tab-work">
      <div v-for="(option) in options" :key="option.key" class="px-1 d-inline-block tab-work-element" :class="(isActiveTab === option.key) ? 'active' : ''">
        <b-btn
          :class="(isActiveTab === option.key) ? 'btn-ghtk' : 'btn-ghtk-disable'"
          class="btn btn-pill mr-1"
          @click="changeTab(option.key)"
        >
          <span>{{ option.name }}</span>
          <span>
            <i v-show="loading" class="fas fa-spinner fa-pulse"></i>
            <span v-show="!loading &&  ![null, undefined].includes(statistic[option.key])">
              ({{ statistic[option.key] || 0 }})
            </span>
          </span>
        </b-btn>
      </div>
    </div>
    <div class="pre-tab pre-tab-right">
      <div class="pre-btn text-ghtk" v-if="tabScroll.rightShow" @click="scrollTab('tab-work', 'right')">
        <i class="ion ion-ios-arrow-forward"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-work-scroll {
  display: flex;
  justify-content: end;
  align-items: center;
  overflow: auto;
  margin-left: 1rem;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.work-options {
  width: 70%;
  overflow: auto;
  white-space: nowrap;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.pre-tab {
  top: -1px;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 100;
  width: 5%;
  left: 0.25rem;
  font-size: 24px;
  cursor: pointer;
  .pre-btn {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

<script>

export default {
  name: 'slide-tab',

  props: {
    options: {},
    statistic: [],
    loading: false,
    selected: null
  },

  data () {
    return {
      isActiveTab: null,
      tabScroll: {
        leftShow: false,
        rightShow: false
      },
      scrollLeft: 0
    }
  },

  computed: {
  },

  mounted () {
    let el = document.getElementById('tab-work')
    if (el) this.checkScrollTab(null, el)
    this.isActiveTab = this.selected
    window.addEventListener('resize', this.handleScrollTab)
  },

  watch: {
    selected: function (newVal) {
      this.isActiveTab = newVal
      this.scrollLeft = document.getElementById('tab-work').scrollLeft
    },

    loading: async function (newValue) {
      let el = document.getElementById('tab-work')
      if (newValue === false) {
        this.$nextTick(function () {
          el.scrollLeft = this.scrollLeft
          this.checkScrollTab(null, el)
        })
      }
    }
  },

  methods: {
    changeTab (key) {
      if (key !== this.selected) {
        this.$emit('changeTab', key)
      }
    },

    scrollTab (el, type) {
      el = document.getElementById(el)
      if (!el) {
        return
      }
      if (type === 'right') {
        el.scrollLeft += 150
      } else {
        el.scrollLeft -= 150
      }

      this.checkScrollTab(null, el)
    },

    handleScrollTab () {
      let el = document.getElementById('tab-work')

      if (el) this.checkScrollTab(null, el)
    },

    checkScrollTab (evt, el) {
      if (el.scrollWidth > el.offsetWidth) {
        this.tabScroll.rightShow = true
        this.tabScroll.leftShow = true
      } else {
        this.tabScroll.rightShow = false
        this.tabScroll.leftShow = false
      }
      if (el.scrollLeft <= 0) {
        this.tabScroll.leftShow = false
      } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
        this.tabScroll.rightShow = false
      }
    }
  }
}
</script>
