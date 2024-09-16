<template>
  <div>
    <div class="form-filter">
      <b-form-row class="mt-2">
        <b-col sm="12">
          <b-form-row>
            <b-col>
              <multiselect
                class="multiselect"
                v-model="SessionScript.work_shift"
                placeholder="Chọn Ca"
                track-by="value"
                label="text"
                :options="WorkShiftOptions"
                :multiple="false"
                select-label="✓"
                deselect-label="✗"
                selected-label="✓"
                @input="changeWorkShift"
              />
            </b-col>
          </b-form-row>
        </b-col>
      </b-form-row>

      <b-form-row  class="mt-2">
          <b-col sm="12" class="form-inline">
            <b-form-input
              size="sm"
              type="time"
              v-model="SessionScript.start_time"
              class="mr-2 input-size"
              :disabled="isDisableTime"
            />
            -
            <b-form-input
              size="sm"
              type="time"
              v-model="SessionScript.end_time"
              class="ml-2 input-size"
              :disabled="isDisableTime"
            />
          </b-col>
      </b-form-row>

      <b-form-row  class="mt-2">
        <b-col sm="12">
          <multiselect
            class="multiselect"
            v-model="SessionScript.day_of_weeks"
            placeholder="Chọn ngày"
            track-by="value"
            label="text"
            :options="DayOptions"
            :multiple="true"
            select-label="✓"
            deselect-label="✗"
            selected-label="✓"
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
    SessionScript: {
      type: Object,
      required: true
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
      return _.isEmpty(this.SessionScript.work_shift)
    }
  }
}
</script>

<style scoped>
.input-size {
  width: 110px !important;
}
</style>
