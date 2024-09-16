<template>
  <multiselect
    v-model="problemOption"
    :class="customClass"
    :options="problemOptions"
    :multiple="true"
    :limit="limit"
    :placeholder="placeholder"
    label="name"
    track-by="id"
    selectedLabel=""
    deselect-label="X"
    selectLabel=""
    :close-on-select="autoClose"
    :hide-selected="hideSelect"
    :disabled="isDisabled"
    @input="handleInput(problemOption)"
  >
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<style scoped lang="scss">

</style>

<script>
// components
import Multiselect from 'vue-multiselect'

// services
import ticketService from '../../../domain/services/ticket-service'

// helpers
import helpers from '../../../infrastructures/helpers/common-helpers'

export default {
  name: 'multi-select-problem',
  components: {
    Multiselect
  },
  props: {
    customClass: {
      default: 'multiselect-primary'
    },
    placeholder: {
      default: 'Loại vấn đề'
    },
    limit: {
      default: 5
    },
    autoClose: {
      default: false
    },
    hideSelect: {
      default: false
    },
    isDisabled: {
      default: false
    }
  },
  data: () => ({
    problemOption: null,
    problemOptions: []
  }),
  methods: {
    handleInput (options) {
      this.$emit('handleProblemSelected', options)
    },
    async getProblemOptions () {
      try {
        const res = await ticketService.getTicketTypes()
        if (res.data.success) {
          let data = Object.entries(res.data.data)
          this.problemOptions = data.map(([key, value]) => ({ id: key, name: value }))
        }
      } catch (e) {
        console.log(e)
        helpers.showMessage('Có lỗi khi lấy loại vấn đề!', 'error', 'Lỗi')
      }
    }
  },
  created () {
    this.getProblemOptions()
  }
}
</script>
