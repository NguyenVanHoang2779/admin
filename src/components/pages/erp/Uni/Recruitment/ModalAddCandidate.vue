<template>
  <b-modal modal-class="modal-custom" size="sm" centered static id="modal-add-candidate" hide-footer hide-header>
    <div class="modal-title-contact">
      <span>Thêm ứng viên</span>
    </div>
    <div class="modal-content-contact">
      <div>
        <span>Vui lòng chọn hình thức để tạo ứng viên mới</span>
      </div>
    </div>
    <div class="text-center mt-3 mb-2">
      <b-btn variant="ghtk" class="button-add-candidate-modal" @click="openModalImportData()">Nhập dữ liệu</b-btn>
      <b-btn variant="ghtk" id='candidate-manage-btn-add-candidate-modal' name='candidate-manage-btn-add-candidate-modal' class="button-add-candidate-modal" @click="openLink('/adm/recruitment/candidate/create')">Thêm ứng viên</b-btn>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
.button-add-candidate-modal {
  width: 42%;
  border-radius: 5px;
  padding: 5px 0px;
}
.modal-title-contact {
  text-align: center;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 18px;
  color: white;
  background: #069255;
}
.modal-content-contact {
  padding: 10px 30px 0px 30px;
  font-size: 16px;
  color: #000;
}

</style>

<script>
export default {
  name: 'ModalAddCandidate',
  props: {
  },
  methods: {
    openModalImportData () {
      this.$emit('openModalImportData')
    },
    openLink (link) {
      window.open(link, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
