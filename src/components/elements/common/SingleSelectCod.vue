<template>
    <b-row class="my-1">
        <b-col sm="12">
            <multiselect
                    v-model="asyncSelected"
                    label="name"
                    track-by="id"
                    placeholder="Nhập ít nhất 2 kí tự để tìm kiếm"
                    :options="asyncFound"
                    :multiple="false"
                    :searchable="true"
                    :loading="asyncLoading"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    :disabled="isDisable"
                    @search-change="asyncFind">
                <span slot="noResult">{{message}}</span>
                <span slot="noOptions">{{message}}</span>
            </multiselect>
        </b-col>
    </b-row>
</template>
<script>
import Multiselect from 'vue-multiselect'
import evaluationService from 'domain/services/evaluation-service'

import debounce from 'debounce'

export default {
  props: ['user', 'isDisable'],
  name: 'single-select-cod',

  components: {
    Multiselect,
    evaluationService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    user () {
      this.asyncSelected = this.user
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
    this.asyncSelected = this.user
  },

  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      evaluationService.apiGetListCod({term: query}).then(response => {
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
