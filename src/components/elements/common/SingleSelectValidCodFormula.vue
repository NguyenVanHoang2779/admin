<template>
  <div class="valid-formula-cod mb-4 w-100">
    <multiselect
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :disabled="isDisabled"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
    >
<!--      <template slot="option" slot-scope="props">-->
<!--        <div :class="props.option.disabled ? 'disabled-option' : ''" @click="clickFormula(props.option, $event)">{{ props.option.name }}</div>-->
<!--      </template>-->
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<style lang="scss" scoped>
  .valid-formula-cod {
    .disabled-option {
      cursor: no-drop;
      color: #999;
    }
  }
</style>

<script>
import userService from 'domain/services/user-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-valid-cod-formula',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      type: String,
      default: 'Chọn công thức tính lương COD'
    },
    positionJob: {
      type: String
    },
    workTypeId: {
      type: String
    },
    stationId: {
      type: String
    },
    formula: {
      type: Number
    },
    username: {
      type: String
    },
    isDisabled: {
      type: Boolean
    }
  },
  data: () => ({
    option: null,
    options: [],
    notify: {
      message: '',
      class: '',
      title: ''
    }
  }),

  created () {
    this.getListFormulas()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedFormula', newValue)
    },

    positionJob: function (newVal, oldVal) {
      this.autoChangeFormula()
    },

    workTypeId: function (newVal, oldVal) {
      this.autoChangeFormula()
    },

    stationId: function (newVal, oldVal) {
      this.autoChangeFormula()
    },

    formula: function (newVal, oldVal) {
      if (newVal) {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    clickFormula (option, event) {
      if (option.disabled) {
        event.stopPropagation()
      }
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.formula) {
        this.option = this.options.find((option) => {
          return parseInt(option.value) === parseInt(this.formula)
        })
      }
    },

    getListFormulas: function () {
      userService.getValidSalaryFormulasOfCod()
        .then((response) => {
          if (response.data.success) {
            this.options = response.data.data
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    autoChangeFormula () {
      if (!this.stationId || !this.positionJob || !this.workTypeId) {
        return
      }

      let param = {
        position_job: this.positionJob,
        work_type_id: this.workTypeId,
        station_id: this.stationId,
        username: this.username
      }
      userService.calculateCodFormula(param)
        .then((response) => {
          if (response.data.success) {
            let formula = parseInt(response.data.data.formula)
            if (formula > 0) {
              this.option = this.options.find((option) => {
                return option.value === formula
              })

              this.notify.success = true
              this.notify.message = response.data.message
              this.showNotification(true)
            }
          } else {
            this.notify.success = false
            this.notify.message = response.data.message
            this.showNotification(false)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'default',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify
      })
    }
  }
}
</script>
