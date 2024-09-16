<template>
    <b-modal v-model="isShowModal" size="lg" @shown="showModal" @hidden="hideModal">
        <div slot="modal-title">
            <span>Tickets ({{sosTicketDetail.total_sos_ticket}} tickets)</span>
        </div>
        <div>
            <b-row>
                <b-col cols="12">
                    <b-row>
                        <b-col cols="6">
                            <label class="form-label font-title">Trạng thái chưa tiếp nhận</label>
                        </b-col>
                        <b-col cols="6 content-form">
                            <b-row>
                                <b-col cols="8">
                                    <div class="content-value">
                                        <span v-text="sosTicketDetail.total_unreceived_sos_ticket"></span> tickets ( + <span v-text="sosTicketDetail.total_current_unreceived_sos_ticket" class="text-success"></span> tickets)
                                    </div>
                                </b-col>
                                <b-col cols="4">
                                    <label class="form-label font-title">
                                        <b-button @click="openLink($router.resolve({name:'execution-sos', query: { ticket_type: sosTicketDetail.ticket_type, status: 1 } }).href)" class="button-control" size="sm" variant="primary">Chi tiết</b-button>
                                    </label>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <hr/>
            <b-row>
                <b-col cols="12">
                    <b-row>
                        <b-col cols="6">
                            <label class="form-label font-title">Trạng thái đang xử lý</label>
                        </b-col>
                        <b-col cols="6 content-form">
                            <b-row>
                                <b-col cols="8">
                                    <div class="content-value">
                                        <span v-text="sosTicketDetail.total_in_progress_sos_ticket"></span> tickets ( + <span v-text="sosTicketDetail.total_current_in_progress_sos_ticket" class="text-success"></span> tickets)
                                    </div>
                                </b-col>
                                <b-col cols="4">
                                    <label class="form-label font-title">
                                        <b-button @click="openLink($router.resolve({name:'execution-sos', query: { ticket_type: sosTicketDetail.ticket_type, status: 2 } }).href)" class="button-control" size="sm" variant="primary">Chi tiết</b-button>
                                    </label>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
             </b-row>
        </div>
    </b-modal>
</template>
<script>
export default {
  name: 'sos-ticket-details-modal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },

    dataSosTicket: {
      type: Object
    }
  },
  data: () => ({
    isShowModal: this.isShow,
    sosTicketDetail: {}
  }),

  watch: {
    isShow (newValue, oldValue) {
      this.isShowModal = newValue
      this.$emit('toggleModal', newValue)
    },
    dataSosTicket (newValue, oldValue) {
      if (newValue) {
        this.sosTicketDetail = JSON.parse(JSON.stringify(newValue))
      } else {
        console.log('Cannot retrive data')
      }
    }
  },
  methods: {
    openLink (link) {
      window.open(link, '_blank')
    },
    showModal () {
      this.$emit('toggleModal', true)
    },
    hideModal () {
      this.$emit('toggleModal', false)
      this.$stopLoading()
    }
  }
}
</script>
<style scoped>
    .content-value {
       font-weight: 600;
    }
    .font-title {
        font-size: 1rem;
    }
    .content-form {
        text-align: right;
    }
</style>
