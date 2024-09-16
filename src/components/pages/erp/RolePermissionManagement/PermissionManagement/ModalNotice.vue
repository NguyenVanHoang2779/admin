<template>
  <div>
    <b-modal
      class="modal-notice"
      id="id-modal-notice-cus"
      hide-header
      hide-header-close
      hide-footer
      static
      @hide="onClose()"
    >
      <div>
        <b-row class="logo-cus">
          <div v-if="type === 'success'"><i class="ion ion-ios-checkmark-circle-outline green-icon"></i></div>
          <div v-if="type === 'failed'"><i style="color: rgb(205 23 23);" class="ion ion-ios-close-circle-outline"></i></div>
        </b-row>
        <b-row class="status-cus">
            <div v-if="type === 'success'">Thành công !</div>
            <div v-if="type === 'failed'">Thất bại !</div>
        </b-row>

        <b-row class="mb-2 message-cus">
          <div>{{ message }}</div>
        </b-row>
        <b-row class="mb-2 message-data-cus" v-if="dataNotice && dataNotice.length > 0">
          <b-col md="12">
            <span>Những user:</span>
            <span v-for="(username, idx) in dataNotice" :id="idx">{{ idx > 0 ? (', ' + username) : username }}</span>
            <span v-if="typeUpdateRole === 'assign'">đã thuộc role !</span>
            <span v-if="typeUpdateRole === 'remove'">không thuộc role !</span>
          </b-col>
        </b-row>
      </div>
      <div class="btn-cus mt-4 mb-3">
        <button type="button" class="btn btn-success" :style="type === 'success' ? 'background-color: green;' : (type === 'falied' ? 'background-color: rgb(205 23 23);' : '')" @click="done()">Đóng</button>
      </div>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: 'ModalNotice',
  components: {
  },
  props: {
    type: '',
    message: '',
    dataNotice: [],
    typeUpdateRole: ''
  },

  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    onClose () {
    },

    done () {
      this.$emit('close', this.type)
      this.$bvModal.hide('id-modal-notice-cus')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-notice {
  /deep/ .modal-dialog {
    max-width: 32rem !important;
    margin-top: 10.5rem !important
  }
  /deep/ .modal-content {
    border-radius: 15px !important;
  }
}

.logo-cus, .status-cus, .message-cus {
  justify-content: center;
  font-family: 'Roboto';
}
.logo-cus {
  font-size: 6.5rem;
}
.status-cus {
  font-size: 2rem;
  font-weight: 600;
  margin-top: -0.7rem;
  margin-bottom: 0.5rem;
}

.message-cus {
  font-size: 1.5rem;
  font-weight: 100;
}

.message-data-cus{
  color: chocolate;
  font-size: 15px;
  text-align: center;
}
.btn-cus {
  display: flex;
  justify-content: center;
  button {
    display: block;
    width: 8.5rem;
    font-weight: 500;
    border-radius: 0.8rem;
  }
}

</style>
