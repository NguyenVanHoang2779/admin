<template>
  <div class="contract-appendix">
    <appendix :appendix_id="appendix.id" :enable_add_appendix="false"></appendix>
  </div>
</template>

<script>
import Appendix from './Appendix'

export default {
  name: 'contract-detail',
  components: {
    Appendix
  },
  data: () => ({
    appendix: {
      id: null,
      enable_add_appendix: false // Create mode is create
    }
  }),

  created () {
    this.appendix.id = this.$route.params.id || null
  }
}
</script>
