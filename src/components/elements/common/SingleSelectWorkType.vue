<template>
  <div class="select-user-work-type">
    <multiselect
            v-model="option"
            :options="options"
            :disabled="isDisabled"
            label="name"
            track-by="name"
            placeholder="Chọn kiểu nhân viên"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :searchable="true"
            @select="op => $emit('select', op)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn kiểu nhân viên</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import staffService from 'domain/services/staff-service'

export default {
  name: 'single-select-worktype',

  components: {
    Multiselect
  },

  props: {
    positionJob: { },
    workTypeId: { },
    isDisabled: {
      type: Boolean
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    if (this.positionJob) this.getWorkTypeByPositionJob(this.positionJob)
  },

  watch: {
    positionJob: function (newValue, oldValue) {
      if (newValue) {
        this.option = null
        this.options = []
        this.getWorkTypeByPositionJob(newValue)
      }
    },

    option: function (newValue, oldValue) {
      this.$emit('handleSelectedWorkType', newValue)
    },

    workTypeId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.workTypeId && this.options && this.options.length) {
        this.option = this.options.find(option => {
          return parseInt(option.id) === parseInt(this.workTypeId)
        })
      }
    },

    getWorkTypeByPositionJob (positionJob) {
      if (!positionJob) return
      let params = {
        position_id: positionJob
      }
      staffService.getWorkTypeByPositionJob(params)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            if (this.workTypeId) {
              this.setSelectedOption()
            }
          } else {
            this.options = []
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}

</script>
