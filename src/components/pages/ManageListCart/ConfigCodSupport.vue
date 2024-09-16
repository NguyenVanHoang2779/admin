<template>
  <div>
    <b-form-row v-for="(CodSupportItem, index) in codSupports" :key="index" class="mb-1 ml-1">
      <cod-support-row
        :row-index="index"
        :work-shift="workshift"
        :day-of-week-available="dayOfTheWeekAvailableOptions"
        :cod-support-data="CodSupportItem"
        @deleteRow="removeConfigRow"
        @changeCodSupport="changeCodSupport"
      />
    </b-form-row>

<!--    <b-button
      class="mt-2"
      variant="outline-success"
      size="sm"
      @click.prevent="addConfigCodSupport()"
      :disabled="isDisabledAddButton"
    ><i class="fas fa-plus"/>
      Thêm
    </b-button>-->

  </div>
</template>

<script>
import CodSupportRow from './CodSupportRow'
import * as _ from 'lodash'

export default {
  name: 'ConfigCodSupport',
  components: {
    CodSupportRow
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    DayOfWeek: {
      type: Array,
      required: true
    },
    workshift: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    addConfigCodSupport () {
      if (this.codSupports.length < this.DayOfWeek.length) {
        this.codSupports.push({
          day_of_week: [],
          cod_support: {},
          capacity: 0
        })
      }
    },

    removeConfigRow (index) {
      this.codSupports.splice(index, 1)
    },

    changeCodSupport (data, index) {
      this.codSupports[index].cod_support = data
    }
  },
  computed: {
    codSupports: {
      get () {
        if (!this.value || !Array.isArray(this.value)) {
          return []
        }
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },

    dayOfTheWeekOptions () {
      return this.DayOfWeek
    },

    dayOfTheWeekAvailableOptions () {
      const selectedDayIds = this.codSupports.map((item) => item.day_of_week.map((item) => Number(item.value))).flat()
      return this.dayOfTheWeekOptions.filter((item) => {
        return !selectedDayIds.includes(Number(item.value))
      })
    },

    isDisabledAddButton () {
      return _.isEmpty(this.dayOfTheWeekAvailableOptions) || this.codSupports.length >= this.DayOfWeek.length
    }
  },
  mounted () {
    this.$emit('is-disable-add-button', this.isDisabledAddButton)
  },
  updated () {
    this.$emit('is-disable-add-button', this.isDisabledAddButton)
  },
  watch: {
    dayOfTheWeekOptions () {
      this.$emit('is-disable-add-button', this.isDisabledAddButton)
    }
  }
}
</script>

<style scoped>
</style>
