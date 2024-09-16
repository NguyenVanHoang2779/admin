<template>
  <div>
    <multiselect
      v-model="asyncSelected"
      label="name"
      track-by="id"
      placeholder=""
      selectLabel=""
      :options="asyncFound"
      :multiple="false"
      :searchable="true"
      :loading="asyncLoading"
      :internal-search="false"
      :clear-on-select="true"
      :close-on-select="true"
      :hide-selected="true"
      @search-change="asyncFind">
      <span slot="noResult">{{ message }}</span>
      <span slot="noOptions">{{ message }}</span>
    </multiselect>
</div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'
export default {
  props: ['title', 'user'],
  name: 'select-user-penalty',

  components: {
    Multiselect,
    sosService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('model', this.asyncSelected)
    },
    user () {
      this.asyncSelected = this.user
    }
  },
  data: () => ({
    asyncSelected: {},
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
    this.$emit('model', this.asyncSelected)
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
      sosService.apiGetListUsers({term: query}).then(response => {
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
