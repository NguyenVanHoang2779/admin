<template>
  <div>
    <b-form-input
      :state="nameState"
      v-model.trim="inputVal"
      aria-describedby="input-live-help input-live-feedback"
      placeholder="Nhiều bag order cách nhau bởi dấu phẩy"
      trim
    ></b-form-input>
  </div>
</template>
<script>
export default {
  name: 'input-bag-order',

  components: {},
  watch: {
    inputVal () {
      let arrBag = this.inputVal.split(',').filter(item => {
        if (item !== '') return Number(item)
      })
      this.$emit('model', arrBag)
    }
  },
  data: () => ({
    inputVal: ''
  }),
  computed: {
    nameState () {
      if (/^[\d,]+$/.test(this.inputVal) || this.inputVal === '') return true
      return false
    }
  },
  created () {
  },
  methods: {}
}
</script>
