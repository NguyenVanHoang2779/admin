<template>
  <div>
    <multiselect
      v-model="selectedOption"
      :options="options"
      placeholder="Chọn vị trí làm việc"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :multiple="multiple"
      @input="handleChange"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'SelectJob',
  components: {Multiselect},
  props: {
    jobId: null,
    multiple: false
  },
  data () {
    return {
      options: [], // Danh sách options lấy từ server
      selectedOption: null// Option được chọn
    }
  },
  mounted () {
    // Gọi API để lấy danh sách options từ server
    this.fetchOptions()
  },

  created () {
  },

  watch: {
    jobId (newVal, oldVal) {
      this.selectedOption = this.options.find(function (option) {
        return option.id === newVal
      })
    }
  },

  methods: {
    async fetchOptions () {
      const response = await recruitmentService.getJobs()
      if (response.data.success) {
        this.options = response.data.data.map(function (job) {
          return {
            id: job.id,
            name: job.name
          }
        })
        const self = this
        this.selectedOption = this.options.find(function (option) {
          return option.id === self.jobId
        })
      } else {
        console.log(response.data.message || 'Không lấy được job')
      }
    },

    handleChange (selectedOption) {
      // Xử lý khi option được chọn thay đổi
      this.$emit('selected-option-changed', selectedOption)
    }
  }
}
</script>
