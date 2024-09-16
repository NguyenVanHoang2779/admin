<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="id"
        :placeholder="labelCustom"
        :options="options"
        :multiple="false"
        :searchable="false"
        :loading="asyncLoading"
        :internal-search="false"
        :clear-on-select="true"
        :close-on-select="true"
        :hide-selected="true">
      </multiselect>
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from 'vue-multiselect'
import G3PL from 'domain/services/g3pl-service'
import WebStorage from 'infrastructures/web-storage'
import * as _ from 'lodash'
import Booking from 'domain/entities/Booking'

export default {
  name: 'SingleSelectG3PL',
  props: ['field', 'labelCustom'],
  components: {
    Multiselect
  },
  data: () => ({
    asyncSelected: null,
    options: [],
    asyncLoading: false
  }),
  created () {
    this.storage = new WebStorage()
    if (this.field === 'type_trip') {
      this.getAllTypeTrip()
    }
    if (this.field === 'weight') {
      this.getAllWeight()
    }
    if (this.field === 'reason_booking') {
      this.getAllReasonBooking()
    }
  },
  watch: {
    asyncSelected () {
      this.$emit('onChange', this.asyncSelected)
    }
  },
  methods: {
    resetValue () {
      this.asyncSelected = null
    },
    formatInput (data) {
      let result = []
      _.forEach(data, item => {
        result.push({ id: item, name: item })
      })

      return result
    },
    getAllTypeTrip () {
      let cacheKey = 'allTypeTripOfG3PL'
      let listCached = this.storage.get(cacheKey)
      if (listCached) {
        this.options = listCached
      } else {
        G3PL.getListTypeTrip()
          .then((response) => {
            if (response.data.success) {
              this.options = response.data.message
              this.storage.set(cacheKey, this.options)
            }
          }).catch((e) => {
            console.log(e)
          })
      }
    },
    getAllWeight () {
      let cacheKey = 'allWeightOfG3PL'
      let listCached = this.storage.get(cacheKey)
      if (listCached) {
        this.options = listCached
      } else {
        G3PL.getListWeight()
          .then((response) => {
            if (response.data.success) {
              this.options = this.formatInput(response.data.data)
              this.storage.set(cacheKey, this.options)
            }
          }).catch((e) => {
            console.log(e)
          })
      }
    },
    getAllReasonBooking () {
      let cacheKey = 'allReasonBookingtOfG3PL'
      let listCached = this.storage.get(cacheKey)
      if (listCached) {
        this.options = listCached
      } else {
        G3PL.getReasonBooking()
          .then((response) => {
            if (response.data.success) {
              this.options = this.formatInput(response.data.data)
              this.options.push({ id: Booking.reasonOther, name: Booking.reasonOther })
              this.storage.set(cacheKey, this.options)
            }
          }).catch((e) => {
            console.log(e)
          })
      }
    }
  }
}
</script>
