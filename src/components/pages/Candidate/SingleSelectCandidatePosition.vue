<template>
  <div>
    <multiselect
      :class="customClass"
      v-model="positionOption"
      :options="positionOptions"
      placeholder="Chọn vị trí"
      label="job_name"
      track-by="id"
      selectedLabel="Đã chọn"
      selectLabel=""
      deselectLabel="X"
      :searchable="true"
      :multiple="multiple"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn vị trí</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import candidateService from 'domain/services/candidate-service'
export default {
  name: 'single-select-candidate-position',

  components: {
    Multiselect
  },

  props: {
    jobId: {
      default: null
    },
    hrview: {
      default: null
    },
    customClass: {
      default: ''
    },
    multiple: {
      default: false
    }
  },

  data: () => ({
    positionOption: null,
    positionOptions: []
  }),

  created () {
    this.getJobs()
  },

  watch: {
    jobId: function (newVal, oldVal) {
      if (newVal) {
        let position = this.positionOptions.find(position => (position.id === newVal))
        if (position) this.positionOption = position
        else this.positionOption = null
      } else {
        this.positionOption = null
      }
    },

    positionOption: function (newValue, oldValue) {
      this.$emit('handleChoosePosition', newValue)
    }
  },

  methods: {
    getJobs () {
      candidateService.getJobList()
        .then(res => {
          if (res.data.success) {
            if (this.hrview) this.positionOptions = res.data.data
            else {
              let candidateJob = ['1', '2', '3'] // ứng viên chỉ nhìn thấy 3 vị trí ứng tuyển có id này
              let option = null
              for (const job of candidateJob) {
                option = res.data.data.find(position => (position.id === job))
                if (option) this.positionOptions.push(option)
              }
            }
            // format position from jobId
            if (this.jobId) {
              let position = this.positionOptions.find(position => (position.id === this.jobId))
              if (position) this.positionOption = position
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
