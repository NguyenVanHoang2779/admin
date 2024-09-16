<template>
    <b-modal modal-class="modal-custom" size="sm" centered  static id="modal-contact-candidate" @hide="resetModal()"  hide-footer hide-header>
        <div class="modal-title-contact">
            <span>Gọi ứng viên</span>
        </div>
        <div class="modal-content-contact" v-if="candidate">
              <div>
                  <b>Họ tên: </b><span>{{ candidate.name }}</span>
              </div>
              <div>
                  <b>Vị trí: </b><span v-if="candidate.job">{{ candidate.job.name }}</span>
              </div>
              <div>
                  <b>Số điện thoại: </b><span v-if="candidate.phone">{{ candidate.phone }}</span>
              </div>
        </div>
        <div class="text-center mt-2 mb-2">
            <b-btn variant="ghtk" class="button-close-modal-contact" @click="closeModalContact()">Đóng</b-btn>
        </div>
    </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
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
  name: 'ModalContactCandidate',
  props: {
    candidate: {
      default: null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeModalContact () {
      this.$bvModal.hide('modal-contact-candidate')
    },

    resetModal () {
      this.$emit('hideModal')
    }
  }
}
</script>

<style scoped>

</style>
