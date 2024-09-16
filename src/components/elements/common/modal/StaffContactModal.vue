<template>
  <b-modal
    :id="contactModalId"
    modal-class="modal-custom"
    size="sm"
    centered
    static
    hide-footer
    hide-header
  >
    <div class="title-contact-modal">
      <span>{{ title }}</span>
      <button class="btn-hide-modal" @click="closeModal()">
        <img src="../../../../assets/images/icon/icon-hide.png" alt="icon-hide">
      </button>
    </div>
    <div
      class="content-contact-modal"
      v-if="contactInfo"
    >
      <div>
        <b>Họ tên: </b><span>{{ contactInfo.fullname }}</span>
      </div>
      <div>
        <b>Vị trí: </b><span>{{ contactInfo.position_name }}</span>
      </div>
      <div>
        <b>Số điện thoại: </b><span>{{ contactInfo.tel }}</span>
      </div>
    </div>
    <div class="text-center mt-2 mb-2">
      <b-btn
        variant="ghtk"
        class="btn button-close-contact-modal"
        @click="closeModal()"
      >
        Đóng
      </b-btn>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'StaffContactModal',
  props: {
    contactInfo: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: 'Gọi nhân viên'
    },
    contactModalId: {
      type: String,
      default: 'contact-modal-staff'
    }
  },
  methods: {
    closeModal () {
      this.$bvModal.hide(this.contactModalId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/sass/components/modal-common.scss';
</style>
