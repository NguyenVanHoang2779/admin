<template>
    <div>
        <b-modal size="lg" id="modal-work-process" centered :hide-footer="true" :hide-body="true" @hide="reset()" static>
            <div slot="modal-title">
                Xác nhận thời gian công tác
            </div>
            <b-form-row>
                <b-form-group label="Ngày bắt đầu công việc mới (*)" class="col-md-6">
                    <template slot='label'>
                        Ngày bắt đầu công việc mới <span class='is-danger'>(*)</span>
                    </template>
                    <datepicker
                            v-model="startDate"
                            id="start-new-work"
                            name="start-new-work"
                            format="dd-MM-yyyy"
                            :bootstrapStyling="true"
                            :monday-first="true"
                            :full-month-name="true"
                            placeholder="Ngày bắt đầu chuyển công tác mới"
                            :required="true"
                            :calendar-button="true"
                            calendar-button-icon="ion ion-md-calendar"
                            :clear-button="true"
                            v-validate="{required: true}"
                    />
                    <span v-show="errors.firstRule('start-new-work') == 'required'" class="help is-danger">Không để trống trường này </span>
                </b-form-group>
                <b-form-group label="Ngày kết thúc công việc cũ (*)" class="col-md-6">
                    <template slot='label'>
                        Ngày kết thúc công việc cũ <span class='is-danger'>(*)</span>
                    </template>
                    <datepicker
                            v-model="endDate"
                            id="end-old-work"
                            name="end-old-work"
                            format="dd-MM-yyyy"
                            :bootstrapStyling="true"
                            :monday-first="true"
                            :full-month-name="true"
                            placeholder="Ngày kết thúc công tác cũ"
                            :required="true"
                            :calendar-button="true"
                            calendar-button-icon="ion ion-md-calendar"
                            :clear-button="true"
                            v-validate="{required: true}"
                    />
                    <span v-show="errors.firstRule('end-old-work') == 'required'" class="help is-danger">Không để trống trường này </span>
                </b-form-group>
            </b-form-row>
            <div class="row text-center d-block">
                <button class="btn btn-primary" @click="confirmWorkProcess()">Xác nhận</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
// helper
import helper from 'infrastructures/helpers/common-helpers'

Vue.use(VeeValidate)

export default {
  name: 'modal-work-process',

  components: {
    Datepicker
  },

  props: [
    'endOldWork', 'startNewWork'
  ],

  data: () => ({
    endDate: this.endOldWork,
    startDate: this.startNewWork
  }),

  created () {
  },

  watch: {
    startDate: function (newValue, oldValue) {
      const date = new Date(newValue)
      this.endDate = date.setDate(date.getDate() - 1)
    }
  },

  methods: {
    reset () {
      // this.errors.clear()
      this.startDate = null
      this.endDate = null
    },
    confirmWorkProcess () {
      let startNewWork = new Date(this.startDate)
      let endOldWork = new Date(this.endDate)
      if (startNewWork.getTime() - 86400 < endOldWork.getTime()) {
        helper.showMessage('Ngày bắt đầu công việc mới phải lớn hơn ngày kết thúc công việc cũ ít nhất 1 ngày!', 'warning')
      } else {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$emit('update:endOldWork', this.endDate)
            this.$emit('update:startNewWork', this.startDate)
            this.$emit('confirmEditUser')
            this.$bvModal.hide('modal-work-process')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>
