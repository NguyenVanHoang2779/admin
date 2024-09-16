<template>
  <h3>
    {{ message }}
  </h3>
</template>

<script>
export default {
  name: 'ScreenClosed',
  props: {
    message: {
      default: 'Màn này hiện đã đóng, liên hệ HR kho để được hỗ trợ!'
    }
  }
}
</script>

<style scoped>

</style>
