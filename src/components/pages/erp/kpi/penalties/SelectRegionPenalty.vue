<template>
    <b-container fluid>
        <b-row class="my-1">
            <b-col style="transform: translateY(25%)" sm="3">
                <label class="font-italic">{{ title }}</label>
            </b-col>
            <b-col sm="9">
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import debounce from 'debounce'
export default {
  props: ['title'],
  name: 'select-user-penalty',

  components: {
    Multiselect,
    sosService,
    debounce,
    MultiSelectRegion
  },
  watch: {
    asyncSelected () {
      this.$emit('model', this.asyncSelected.map(a => a.id))
    }
  },
  data: () => ({
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
    this.$emit('model', this.asyncSelected.map(a => a.id))
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
