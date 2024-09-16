<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        :custom-label="nameWithOrder"
        track-by="order"
        placeholder="Nhập từ khóa để tìm kiếm Shop"
        :options="asyncFound"
        :multiple="true"
        :searchable="true"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="false"
        @search-change="asyncFind"
      >
        <span slot="noResult">{{ message }}</span>
        <span slot="noOptions">{{ message }}</span>
      </multiselect>
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'MultiSelectShopForCartScripts',
  components: {
    Multiselect
  },
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    asyncFound: [],
    asyncLoading: false,
    message: 'Danh sách trống',
    dataIsInitialized: false
  }),
  created () {
    if (this.selected) {
      this.dataIsInitialized = true
      this.asyncSelected = this.selected
    }
    this.asyncFound = this.options
  },
  computed: {
    asyncSelected: {
      get: function () {
        if (!Array.isArray(this.selected)) {
          return []
        }
        return this.selected
      },
      set: function (selected) {
        this.$emit('onChange', [selected, this.dataIsInitialized])
        this.dataIsInitialized = false
      }
    }
  },
  methods: {
    nameWithOrder (shop) {
      return shop.name + ' | ' + shop.order
    },
    asyncFind (query) {
      this.asyncFound = this.options.filter((shop) => {
        return shop.search_string.indexOf(query) >= 0
      })
    }
  }
}
</script>
