<template>
  <div>
    <multiselect
            v-model="asyncSelected"
            label="name"
            track-by="id"
            :placeholder="placeholder"
            :options="asyncFound"
            :multiple="false"
            :searchable="true"
            :internal-search="false"
            :clear-on-select="true"
            :close-on-select="true"
            :hide-selected="false"
            select-label=""
            selected-label=""
            deselect-label=""
          >
        <span slot="noResult">{{ message }}</span>
        <span slot="noOptions">{{ message }}</span>
        <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import candidateService from 'domain/services/candidate-service'

import debounce from 'debounce'

export default {
  props: {
    tag: {},
    placeholder: {
      default: 'Chọn tag'
    }
  },

  name: 'multi-select-tag',

  components: {
    Multiselect,
    debounce
  },
  watch: {
    tag () {
      this.asyncSelected = this.tag
    },
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    }
  },

  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  computed: {},

  created () {
    this.asyncFind()
  },

  methods: {
    asyncFind: debounce(function (query) {
      this.asyncLoading = true
      this.asyncFound = []
      candidateService.getListTagByHr({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
    .multiselect {
        border-left: none!important;
        border-right: none!important;
        border-top: none!important;
    }
</style>
