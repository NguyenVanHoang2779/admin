<template>
  <div>
    <b-form-checkbox
      v-model="team.has_kpi"
      value="1"
      unchecked-value="0"
      @change="changeTickKpi($event)"
    >
      {{ team.has_kpi == 1 ? 'Bỏ tính KPI' : 'Tính KPI' }}
    </b-form-checkbox>
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'TickKpi',
  props: {
    team: {
      type: Object,
      required: true,
      sync: true
    }
  },
  data: () => ({
    has_kpi: 0
  }),
  created () {
    this.has_kpi = this.team.has_kpi
  },
  computed: {
    helper: _ => helper
  },
  methods: {
    async changeTickKpi (e) {
      await teamConfigService.updateTeamKpi({
        id: this.team.id,
        has_kpi: e
      })
        .then(response => {
          if (response.data.success) {
            this.team.has_kpi = e
            helper.showMessage(response.data.message, 'success')
          } else {
            this.team.has_kpi = this.has_kpi
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          this.team.has_kpi = this.has_kpi
          helper.showMessage(error.response.data.message, 'error')
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
