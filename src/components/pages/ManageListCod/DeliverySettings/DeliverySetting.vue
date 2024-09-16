<template>
  <div class="delivery-setting">
    <b-card>
      <template #header>
        <h4 class="mb-0">Cài đặt lộ trình Cod giao</h4>
      </template>

      <h5 class="mb-3">Lộ trình</h5>
      <delivery-stop-point
        :master="master"
        :address-lv4="addressLv4"
        v-model="points"
      />
    </b-card>
  </div>
</template>

<script>
import DeliveryStopPoint from './DeliveryStopPoint'
export default {
  name: 'DeliverySetting',
  components: {DeliveryStopPoint},
  props: {
    value: {
      type: Array,
      required: true
    },
    master: {
      type: Object,
      required: true
    },
    addressLv4: {
      type: Array,
      required: true
    }
  },
  computed: {
    points: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
