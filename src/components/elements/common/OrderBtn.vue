<template>
  <span @click="updateOrder">
    <i class="fas fa-sort-numeric-down-alt" v-show="order === 'asc'"></i>
    <i class="fas fa-sort-numeric-up-alt" v-show="order === 'desc'"></i>
    <i class="fas fa-sort-numeric-down" v-show="order === 'asc'"></i>
    <i class="fas fa-sort-numeric-up" v-show="order === 'desc'"></i>
    <i class="fas fa-exchange-alt text-muted order-icon" v-show="!order"></i>
  </span>
</template>

<style scoped>
  .order-icon {
    -ms-transform: rotate(90deg); /* IE 9 */
    transform: rotate(90deg);
  }
</style>

<script>
export default {
  name: 'order-btn',
  props: {
    order: {
      default: null
    },

    orderFlow: {
      default: _ => ({
        '': 'asc',
        asc: 'desc',
        desc: null
      })
    }
  },

  methods: {
    updateOrder () {
      this.$emit('updateOrder', this.orderFlow[this.order || ''] || null)
    }
  }

}
</script>
