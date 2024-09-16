<template>
    <div class="row">
        <b-form-group label="Chọn Username" class="col-sm-12">
                <multiselect
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
                        @search-change="asyncFind">
                    <span slot="noResult">{{message}}</span>
                    <span slot="noOptions">{{message}}</span>
                </multiselect>
        </b-form-group>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'
import SalaryService from 'domain/services/salary-service'
export default {
  name: 'select-user-notification',
  props: [
    'postition'
  ],
  components: {
    Multiselect,
    sosService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('model', this.asyncSelected)
    }
  },
  data: () => ({
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    asyncSelected: [],
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
    this.$emit('model', this.asyncSelected)
  },
  methods: {
    reset () {
      this.asyncSelected = []
    },
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      SalaryService.searchUserIdByLocal({term: query, postition: this.postition}).then(response => {
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
