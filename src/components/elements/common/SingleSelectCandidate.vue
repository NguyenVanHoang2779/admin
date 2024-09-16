<template>
    <div>
        <multiselect
                :class="{'custom-multiselect': !checkViewAll, 'custom-multiselect-user': true}"
                v-model="asyncSelected"
                label="name"
                track-by="id"
                placeholder=""
                :options="asyncFound"
                :multiple="true"
                :searchable="true"
                :loading="asyncLoading"
                :internal-search="false"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true"
                :disabled="typeof isDisabled === 'undefined' ? false : isDisabled"
                @search-change="asyncFind">
            <span slot="noResult">{{message}}</span>
            <span slot="noOptions">{{message}}</span>
        </multiselect>
        <notifications group="notifications-default"/>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import candidateService from 'domain/services/candidate-service'
import debounce from 'debounce'

export default {
  props: ['data', 'isDisabled', 'multi'],
  name: 'multi-select-candidate',

  components: {
    Multiselect,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    },
    candidates () {
      this.asyncSelected = this.candidates
    }
  },
  data: () => ({
    checkViewAll: false,
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
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
      candidateService.apiGetListCandidates({term: query}).then(response => {
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

<style scoped lang="scss">
</style>
