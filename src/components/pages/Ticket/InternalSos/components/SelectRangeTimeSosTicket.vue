<template>
    <b-container fluid>
        <b-row class="my-1">
            <b-col style="transform: translateY(25%)" sm="3">
                <label class="font-italic">Khoảng thời gian:</label>
            </b-col>
            <b-col sm="9">
                <flat-pickr v-model="range_time" :config="rangeConfig" placeholder=""/>
                <p v-if="range_time !== '' && typeof range_time.split(' to ')[1] !== 'undefined'" style="font-size: 12px; line-height: 30px; float: left"><strong><i>&emsp;(*) ứng với dữ liệu
                    từ <span style="color: red">{{range_time.split(' to ')[0]}} 00:00:00</span> đến <span
                            style="color: red">{{range_time.split(' to ')[1]}} 23:59:59</span></i></strong></p>
<!--                <p v-else style="font-size: 12px; line-height: 30px; float: left">&emsp;</p>-->
            </b-col>
        </b-row>
    </b-container>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'select-range-time-sos-ticket',

  components: {
    flatPickr
  },
  watch: {
    range_time () {
      this.$emit('model', this.range_time)
    }
  },
  data: () => ({
    range_time: '',
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'Y-m-d'
    }
  }),
  computed: {},
  created () {
    this.$emit('model', this.range_time)
  },
  methods: {}
}
</script>
