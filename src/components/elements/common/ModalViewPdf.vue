<template>
  <b-modal static hide-footer :id="id" :title="title" modal-class="modal-xxl" bodyClass="p-0">
    <iframe :src="link" frameborder="0" class="w-100 h-75vh"></iframe>
  </b-modal>
</template>

<script>
export default {
  name: 'model-view-pdf',

  props: {
    link: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'model-view-pdf'
    },
    title: {
      type: String,
      default: null
    }
  }
}
</script>
