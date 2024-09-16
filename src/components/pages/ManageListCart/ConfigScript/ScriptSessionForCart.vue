<template>
  <div>
    <div class="form-filter">
      <b-form-row class="mt-2">
        <b-col sm="12">
          <b-form-row>
            <b-col>
              <multiselect
                class="multiselect"
                v-model="script.work_shift"
                placeholder="Chọn Ca"
                track-by="value"
                label="text"
                :options="WorkShiftOptions"
                :multiple="false"
                select-label="✓"
                deselect-label="✗"
                selected-label="✓"
                open-direction="bottom"
                @input="changeWorkShift"
              />
            </b-col>
          </b-form-row>
        </b-col>
      </b-form-row>

      <b-form-row  class="mt-2">
        <b-col sm="12">
          <multiselect
            class="multiselect"
            v-model="script.days_of_week"
            placeholder="Chọn ngày"
            track-by="value"
            label="text"
            :options="DayOptions"
            :multiple="true"
            :close-on-select="false"
            select-label="✓"
            deselect-label="✗"
            selected-label="✓"
            open-direction="bottom"
          />
        </b-col>
      </b-form-row>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'

export default {
  name: 'ScriptSession',
  components: {
    multiselect,
    ManageLineService
  },
  props: {
    script: {
      type: Object,
      default: () => ({
        days_of_week: [],
        work_shift: null
      })
    },
    SessionIndex: {
      type: Number,
      required: true
    }
  },
  created () {

  },
  data: () => ({
    dataLoading: false,
    WorkShiftOptions: DeliveryScript.workShiftOptions,
    DayOptions: DeliveryScript.dayOfWeekOptions
  }),
  methods: {
    changeWorkShift () {
      this.$emit('changeWorkShift', this.SessionIndex)
    }
  },
  computed: {
    isDisableTime () {
      return _.isEmpty(this.script.work_shift)
    }
  }
}
</script>

<style scoped>
.input-size {
  width: 110px !important;
}
</style>
