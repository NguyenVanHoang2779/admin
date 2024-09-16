<template>
  <b-modal
    :title="'Thông báo'"
    id="modal-noti"
  >
    <div style="text-align: center; font-size: 19px; padding: 20px 5px;">{{ message }}</div>
    <template slot="modal-footer">
      <button type="button" class="btn btn-success" style="background-color: #069255 !important; width: 10rem !important; margin-left: auto; margin-right: auto" @click="closeModal()">Ok</button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: ''
  },
  methods: {
    closeModal () {
      this.$bvModal.hide('modal-noti')
    }
  }
}
</script>

<style scoped>

</style>
