<template>
  <b-form-group>
    <div v-html="label" slot="label"></div>
    <Datepicker
      :value="value"
      @input="date => $emit('input', date)"
      format="dd-MM-yyyy"
      :bootstrapStyling="true"
      :monday-first="true"
      :full-month-name="true"
      placeholder="Chọn ngày"
      :required="true"
      :calendar-button="true"
      calendar-button-icon="ion ion-md-calendar"
      :clear-button="true"
    />
  </b-form-group>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'select-time-approve',

  components: {
    Datepicker
  },

  props: {
    value: {},
    label: {}
  }
}
</script>
