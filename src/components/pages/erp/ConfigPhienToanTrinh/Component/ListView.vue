<template>
  <div class="non-blur custom-multiselect">
    <multiselect class="multiselect-secondary custom-multiselect"
                 v-model="options"
                 :options="options"
                 :multiple="true"
                 :disabled="true"
                 :allow-empty="true"
                 placeholder="Không có"
    >
    </multiselect>
  </div>
</template>

<style scoped>
.non-blur >>> .multiselect--disabled {
  opacity: 1!important;
}
.non-blur >>> .multiselect__tags {
  background: white;
}
.non-blur >>> .multiselect__tag-icon {
  display: none
}
.custom-multiselect {
  max-height: 200px;
  max-width: 1000px;
  overflow: auto;
}
.custom-multiselect::-webkit-scrollbar {
  width: 6px;
  border-radius: 5px;
  background-color:#F5F5F5;
}
.custom-multiselect::-webkit-scrollbar-thumb {
  background-color: rgb(194, 194, 194);
  border-radius: 5px;
}
.custom-multiselect::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}
</style>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'list-view',

  components: {
    Multiselect
  },

  props: {
    options: {
      default: []
    }
  },

  data: () => ({
  }),

  created () {
  },

  watch: {
  },

  methods: {
  }
}
</script>
