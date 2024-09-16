<template>
  <div class="mb-4" v-loading="loading" v-if="countPositions.length > 0">
    <span v-for="(count, index) in countPositions" :key="index">
      {{ count.position_name }} (<span class="text-success font-weight-bold">{{ count.count }}</span>)
      <span v-if="index < countPositions.length - 1">, </span>
    </span>
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'CountPositionUser',
  props: {
    team: {
      type: Object,
      required: true,
      sync: true
    }
  },
  data () {
    return {
      loading: false,
      countPositions: []
    }
  },
  created () {
    this.getCountPosition()
  },
  methods: {
    async getCountPosition () {
      this.loading = true
      let { data } = await teamConfigService.getCountPosition({
        id: this.team.id
      })
      if (data.success) {
        this.countPositions = data.data
      } else {
        helper.showMessage(data.message)
      }
      this.loading = false
    }
  }
}
</script>
