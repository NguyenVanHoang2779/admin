<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      label="desc"
      track-by="value"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
      @input="val => { $emit('change', val) }"
      @select="val => { $emit('select', val) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Candidate from 'domain/entities/Candidate'

export default {
  name: 'select-join-time',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      type: String,
      default: 'Thời gian nhận việc'
    },
    value: {
      default: null
    }
  },

  data: () => ({
    option: null,
    options: Candidate.joinTimeOption
  }),

  created () {
  },

  watch: {
    value: function (newVal, oldVal) {
      if (!newVal) {
        this.option = null
        return
      }
      this.set()
    }
  },

  methods: {
    set () {
      let op = this.options.filter(o => (o.value === this.value))
      if (op) this.option = op
      else this.option = null
    }
  }
}
</script>
