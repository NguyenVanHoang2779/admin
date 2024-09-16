<template>
    <div>
        <b-modal modal-class="modal-xl" id="modal-config-plan-swap" title="Thêm danh hiệu" :hide-footer="true" @hide="hideModal()" @show="getConfig()" static>
            <div class="medal-body">
                <div class="border-bottom-custom mb-4">
                    <strong>Hiện tại đã có config đến ngày 20-08-2021</strong>
                </div>
                <div>
                    <b-form-row>
                        <b-form-group label="Số lượng cod Dx tối thiểu" class="col-md-6">
                            <span slot="label">Số lượng cod Dx tối thiểu<span class="text-danger">(*)</span></span>
                            <b-form-input type="number" v-model="min" min="0" max="100"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Số lượng cod Dx tối đa" class="col-md-6">
                            <span slot="label">Số lượng cod Dx tối đa<span class="text-danger">(*)</span></span>
                            <b-form-input type="number" v-model="max" min="0" max="100"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Số lượng cod Dx tối đa" class="col-md-6">
                            <span slot="label">Thời gian bắt đầu<span class="text-danger">(*)</span></span>
                            <datepicker
                                    v-model="from"
                                    format="dd-MM-yyyy"
                                    :bootstrapStyling="true"
                                    :monday-first="true"
                                    :full-month-name="true"
                                    placeholder="Thời gian bắt đầu"
                                    :required="true"
                                    :calendar-button="true"
                                    calendar-button-icon="ion ion-md-calendar"
                                    :clear-button="true"
                            />
                        </b-form-group>
                        <b-form-group label="Số lượng cod Dx tối đa" class="col-md-6">
                            <span slot="label">Thời gian kết thúc<span class="text-danger">(*)</span></span>
                            <datepicker
                                    v-model="to"
                                    format="dd-MM-yyyy"
                                    :bootstrapStyling="true"
                                    :monday-first="true"
                                    :full-month-name="true"
                                    placeholder="Thời gian kết thúc"
                                    :required="true"
                                    :calendar-button="true"
                                    calendar-button-icon="ion ion-md-calendar"
                                    :clear-button="true"
                            />
                        </b-form-group>
                    </b-form-row>
                </div>
            </div>
            <div class="mt-2 text-center">
                <b-btn variant="success" @click="saveConfig()">Lưu config</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'

// service
import profileService from 'domain/services/profile-service'

export default {
  name: 'modal-config-plan-swap',

  components: {
    Datepicker
  },

  props: [],

  data: () => ({
    min: 0,
    max: 100,
    from: null,
    to: null
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    hideModal () {
      this.min = null
      this.max = null
      this.from = null
      this.to = null
    },

    getConfig () {
      profileService.getConfigPlanDteam()
        .then(response => {
          if (response.data.success) {
            this.min = response.data.data['min']
            this.max = response.data.data['max']
            this.from = response.data.data['from']
            this.to = response.data.data['to']
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    saveConfig () {
      let data = {
        min: this.min,
        max: this.max,
        from: this.from,
        to: this.to
      }
      profileService.saveConfigPlanDteam(data)
        .then(response => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
    .border-bottom-custom {
        border: none;
        border-bottom: 1px solid #cccccc;
        font-size: 16px;
    }
</style>
