<template>
    <div>
        <!--Lớn hơn 1 ảnh -->
        <div v-if="data.item.ticket_image.length > 1" class="wrapper-image">
            <div v-for="(image, i) in data.item.ticket_image" :key="i">
                <a class="img-thumbnail" href="javascript:void(0)">
                    <img v-img="{group: `${data.index}`}" :src="image.file_path" :alt="image.file_name" class="rounded img-fluid">
                </a>
            </div>
        </div>
        <!--1 ảnh -->
        <div v-else-if="data.item.ticket_image.length === 1" class="wrapper-image-1">
            <a class="img-thumbnail" href="javascript:void(0)">
                <img v-img="{group: `${data.index}`}" :src="data.item.ticket_image[0].file_path" :alt="data.item.ticket_image[0].file_name" class="rounded img-fluid-1">
            </a>
        </div>
        <!--không có ảnh -->
        <div v-else class="wrapper-image-1">
            <img :src="baseUrl + '/static/img/noimage.png'" alt class="rounded img-fluid-1">
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import VueImg from 'v-img'
Vue.use(VueImg, {
  altAsTitle: true
})
export default {
  props: ['data'],
  name: 'ticket-image',

  components: {
  },
  watch: {
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
