<template>
  <div>
    <template v-for="(number, key, idx) in quantity">
        <b-button
          :class="(curActive == key || (key == 'all' && !curActive)) ? 'active' : ''" class="custom-button"
          variant="outline-ghtk"
          :key="idx"
          @click="switchStatus(key)"
        >
          {{statusDesc[key]}}
          <b-badge variant="light">{{ number }}</b-badge>
        </b-button>
    </template>
  </div>
</template>

<style scoped>
  @media only screen and (max-width: 1400px) {
    .custom-button {
      padding-left: 2px;
      padding-right: 2px;
      font-size: 0.8em!important;
    }
  }
  .custom-button {
    padding-left: 12px;
    padding-right: 12px;
    font-size: 0.9em;
    margin-right: 5px;
    margin-bottom: 5px;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import Candidate from 'domain/entities/Candidate'

export default {
  name: 'select-candidate-status-buttons',

  components: {
    Multiselect
  },

  props: {
    quantity: {
      type: Object,
      default: _ => ({})
    },
    curActive: {
      default: null
    }
  },

  data: () => ({
    statusDesc: Candidate.listStatus
  }),

  created () {
    this.$set(this.statusDesc, 'all', 'Tất cả')
  },

  methods: {
    switchStatus (key) {
      this.$emit('on-change', key)
    }
  }
}
</script>
