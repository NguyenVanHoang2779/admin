<template>
    <b-container fluid>
        <b-row class="my-1">
            <b-col style="transform: translateY(25%)" sm="3">
                <label class="font-italic">Mã ticket:</label>
            </b-col>
            <b-col sm="9">
                <b-form-input
                        id="input-live"
                        :state="nameState"
                        v-model="inputVal"
                        aria-describedby="input-live-help input-live-feedback"
                        placeholder="Nhập mã Ticket"
                        trim
                ></b-form-input>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
export default {
  name: 'input-sos-code',

  components: {},
  watch: {
    inputVal () {
      this.$emit('model', this.inputVal)
    }
  },
  data: () => ({
    inputVal: ''
  }),
  computed: {
    nameState () {
      if (/^\d+$/.test(this.inputVal) || this.inputVal === '') return true
      return false
    }
  },
  created () {
  },
  methods: {}
}
</script>
