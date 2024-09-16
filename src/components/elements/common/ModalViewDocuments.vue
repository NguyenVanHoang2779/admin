<template>
  <b-modal hide-footer id="modal-view-documents" ref="imageDocs" title="Chi tiết giấy tờ" ok-only static centered>
    <b-row :class="files.length > 6 ? 'ps ps--active-y': ''">
      <div v-for="(file) in files" :key="file.id" v-viewer class="doc-img">
        <img
          v-if="file.type && file.type.indexOf('image') === 0"
          :src="file.link_file" :alt="file.name" class="rounded mt-2 mr-3 document-images" @click="showImage"
        >
        <div v-else class="mt-2 mr-3">
          <b-link @click="openLink(file.link_file)" class="mr-3">
            <h4><b-badge variant="primary">{{file.name}}</b-badge></h4>
          </b-link>
        </div>
      </div>
    </b-row>
    <div v-if="!files.length && notFound">Không thấy dữ liệu</div>
  </b-modal>
</template>
<script>
import VueImg from 'v-img'
import Viewer from 'v-viewer'
export default {
  props: ['files', 'title', 'trigger', 'notFound'],
  name: 'modal-view-documents',

  components: {
    VueImg,
    Viewer
  },
  watch: {
    trigger: function (newVal, oldVal) {
      this.$refs['imageDocs'].show()
    },
    title: function (newVal, oldVal) {
      this.myTitle = newVal
    }
  },

  data: () => ({
    myTitle: ''
  }),

  computed: {},

  created () {
  },

  methods: {
    openLink (link) {
      window.open(link)
    },
    showImage (timeString) {
      const viewer = this.$el.querySelector('.doc-img').$viewer
      viewer.show()
    }
  }
}
</script>
<style scoped>
.document-images {
  cursor: pointer;
  height: 150px !important;
  width: auto !important;
}
.ps {
  overflow-y: scroll !important;
  max-height: 600px;
}
.doc-img img {
  max-width: 200px;
}
</style>
