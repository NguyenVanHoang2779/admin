<template>
    <multiselect
      :class="customClass"
      v-model="jobOption"
      :options="jobOptions"
      :multiple="true"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :hide-selected="hideSelected"
      :close-on-select="autoClosed"
      :disabled="disabled"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'

export default {
  name: 'multi-select-recruitment-job',

  props: {
    jobIds: {
      default: null
    },
    autoClose: {
      default: null
    },
    hideSelected: {
      default: null
    },
    placeholder: {
      default: 'Chọn job tuyển dụng'
    },
    customClass: {
      default: null
    },
    disabled: {
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    autoClosed: true,
    hideSelect: false,
    jobOption: null,
    jobOptions: []
  }),

  created () {
    this.getAllJob()
    if (this.autoClose !== undefined && this.autoClosed !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
  },

  watch: {
    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    jobIds: function (newValue, oldValue) {
      if (!newValue) {
        this.jobOption = null
      }
      if (this.jobOptions && this.jobOptions.length > 0) {
        this.setList()
      }
    },

    jobOption: function (newValue, oldValue) {
      this.$emit('handleJobSelected', newValue)
    }
  },

  methods: {
    setList () {
      if (!this.jobOptions || this.jobOptions.length === 0) return
      if (this.jobIds && this.jobIds.length > 0) {
        this.jobOption = []
        this.jobIds.split(',').forEach(jobId => {
          let option = this.jobOptions.find(op => (+op.id === +jobId))
          if (option) this.jobOption.push(option)
        })
      }
    },

    getAllJob: function () {
      let cacheKey = 'allRecruitmentJob'
      if (sessionStorage.getItem(cacheKey)) {
        this.jobOptions = JSON.parse(sessionStorage.getItem(cacheKey))
        this.setList()
        return
      }
      recruitmentService.getJobs()
        .then((res) => {
          if (res.data.success) {
            this.jobOptions = res.data.data.map(function (job) {
              return {
                id: job.id,
                name: job.name
              }
            })
            this.setList()
            sessionStorage.setItem(cacheKey, JSON.stringify(this.jobOptions))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
