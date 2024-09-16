<template>
  <div class="profile-document mt-1" v-if="files.length > 0">
    <div
      v-for="(file, idx) in files"
      class="profile-document__element"
      v-if="files.length > 0"
      :class="'file-' + idx && files.length > idx ? 'mr-1' : ''"
    >
      <a :href="file" target="_blank">
        <img
          v-if="['pdf', 'video', 'image'].includes(helper.getFileType(file))"
          class="image-document"
          :src="imageUrlRender(file)"
          :alt="alt"
        />
      </a>
    </div>
  </div>
</template>

<style scoped src="@/assets/sass/components/fstar/previewfile.scss" lang="scss"></style>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'PreviewFile',
  computed: {
    helper: _ => helper
  },
  props: {
    files: {
      type: Array,
      default: _ => ([])
    },
    alt: {
      type: String,
      default: ''
    }
  },
  methods: {
    imageUrlRender (link) {
      let fileType = helper.getFileType(link)
      link += ['pdf', 'video'].includes(fileType) ? '?extract=thumb' : ''
      if (fileType === 'doc') link = 'https://cache.giaohangtietkiem.vn/d/88896e53582a41399fae1c24d0324a86.jpg?width=450&height=359'
      return link
    }
  }
}
</script>
