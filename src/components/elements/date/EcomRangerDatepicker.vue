<template>
  <div>
    <b-row>
      <span class="ecom-text-datepicker">Từ:</span><datepicker v-model="from" :bootstrapStyling="true" :format="customFormatter" class="ecom-ranger-datepicker"/>
      <span class="ecom-text-datepicker">Đến:</span><datepicker v-model="to" :bootstrapStyling="true" :format="customFormatter" class="ecom-ranger-datepicker"/>
    </b-row>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style>
.ecom-ranger-datepicker {
  width: 150px;
  height: auto;
}
.ecom-text-datepicker {
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'ecom-ranger-datepicker',

  components: {
    Datepicker
  },

  props: ['fromDate', 'toDate', 'isChange', 'ischoosed'],

  data () {
    return {
      from: this.fromDate,
      to: this.toDate
    }
  },

  watch: {
    isChange: function (newIsChange, oldIsChange) {
      this.from = this.fromDate
      this.to = this.toDate
    },
    ischoosed: function (newIschoosed, oldIschoosed) {
      if (this.customFormatter(this.from) > this.customFormatter(this.to)) {
        this.from = this.to
      }
      this.changeValue()
    }
  },

  methods: {
    changeValue: function () {
      this.$emit('handleDataChoosed', {
        fromDate: this.customFormatter(this.from),
        toDate: this.customFormatter(this.to),
        isChange: moment().format()
      })
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>
