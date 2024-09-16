<template>
  <div class="form-filter">
    <multiselect
      class="multiselect mb-2"
      v-model="computedDaysOfWeek"
      placeholder="Chọn ngày"
      track-by="value"
      label="text"
      :options="dayOptions"
      :multiple="true"
      :close-on-select="false"
      select-label="✓"
      deselect-label="✗"
      selected-label="✓"
      open-direction="bottom"
    />
    <div v-for="errorMessage in errorMessages"><i class="text-danger">{{ errorMessage }}</i></div>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'

export default {
  name: 'DayOfWeekMultiSelect',
  components: {
    multiselect,
    ManageLineService
  },
  props: {
    daysOfWeek: {
      type: Array,
      default: () => ([])
    },
    SessionIndex: {
      type: Number,
      required: true
    },
    errorMessages: {
      type: Array,
      default: () => ([])
    },
    ignoreOptions: {
      type: Array,
      default: () => ([])
    }
  },
  created () {
  },
  data: () => ({
  }),
  methods: {
  },
  computed: {
    dayOptions () {
      return DeliveryScript.dayOfWeekOptions.filter(option => {
        return (!this.ignoreOptions.includes(option.value)) || (this.daysOfWeek.includes(option.value))
      })
    },
    computedDaysOfWeek: {
      get () {
        this.$emit('change')
        return DeliveryScript.dayOfWeekOptions.filter((dayOption) => {
          return this.daysOfWeek.includes(dayOption.value)
        })
      },
      set (days) {
        const daysSelected = days.map((day) => day.value)
        this.$emit('handleDaysOfWeek', daysSelected)
        this.$emit('change')
      }
    }
  }
}
</script>

<style scoped>
</style>
