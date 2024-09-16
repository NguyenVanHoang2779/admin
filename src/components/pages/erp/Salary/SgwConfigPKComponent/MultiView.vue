<template>
  <div class="non-blur custom-multiselect">
    <multiselect
      class="multiselect-primary"
      v-model="option"
      :options="options"
      track-by="name"
      label="name"
      :disabled="true"
      :multiple="true"
      :allow-empty="true"
      :close-on-select="false"
    />
  </div>
</template>

<style scoped>
.non-blur >>> .multiselect--disabled {
  opacity: 1 !important;
}
.non-blur >>> .multiselect__tags {
  background: white;
}
.non-blur >>> .multiselect__tag-icon {
  display: none;
}
.custom-multiselect {
  max-height: 200px;
  overflow: auto;
}
</style>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-view',

  components: {
    Multiselect
  },
  props: ['options', 'option']
}
</script>
