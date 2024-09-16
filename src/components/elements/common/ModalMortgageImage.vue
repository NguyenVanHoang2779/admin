<template>
  <b-modal hide-footer id="mortgage-bank" ref="mortgageBank" title="Chi tiết giấy thế chấp ngân hàng" ok-only static centered>
    <b-row v-if="mortgageImage">
    <div v-viewer class="doc-img">
      <img :src="mortgageImage" class="rounded mt-2 mr-3 document-images" @click="showImage">
    </div>
    </b-row>
    <div v-if="!mortgageImage">Không thấy dữ liệu</div>
  </b-modal>
</template>
<script>
import VueImg from 'v-img'
import Viewer from 'v-viewer'
export default {
  props: ['mortgageImage'],
  name: 'modal-mortgage-image',

  components: {
    VueImg,
    Viewer
  },
  watch: {

  },

  data: () => ({

  }),

  computed: {},

  created () {
  },

  methods: {
    showImage (timeString) {
      const viewer = this.$el.querySelector('.doc-img').$viewer
      viewer.show()
    }
  }
}
</script>
<style>
.document-images {
  cursor: pointer;
  height: 150px;
}
</style>
