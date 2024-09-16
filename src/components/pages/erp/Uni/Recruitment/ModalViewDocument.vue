<template>
  <b-modal modal-class="modal-custom" size="lg" title="Hồ sơ" header-class="justify-content-center" centered static id="modal-view-document" hide-footer>
    <div class="modal-content">
      <div class="p-4 d-flex flex-wrap">
        <div class="pb-2 col-md-4" v-for="document in currentDocument || []">
          <strong class="pb-2">{{ document.document_name || 'Hồ sơ' }} </strong>
          <ViewDocument :document="document" class="mt-2" v-if="document.url.length > 0"></ViewDocument>
          <p v-else class="font-italic">(Chưa có)</p>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
/deep/ #mode-view-document {
  div {
    div {
      header {
        .modal-title {
          line-height: 10px;
        }
      }
    }
  }
}
</style>

<script>
import ViewDocument from './ViewDocument.vue'

export default {
  name: 'ModalViewDocument',
  components: {
    ViewDocument
  },
  props: {
    currentDocument: {
      type: Array,
      default: _ => ([])
    }
  },
  methods: {
  }
}
</script>
