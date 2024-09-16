<template>
  <b-modal
  title="Chi tiết"
  modal-class="modal-cus"
  id="modal-proposal-details"
  header-class="justify-content-center header-modal-custom"
  size="sm"
  @hidden="resetData()"
  hide-footer
  static
  >
    <div class="wrap-cus" v-if="dataProposalDetail">
      <div class="container-cus" v-for="(detailOrder, id) in dataProposalDetail" :key="id">
        <div class="title-cus">{{id + 1}}{{'. ' + detailOrder.category_name }}</div>
        <div v-if="detailOrder.problems && detailOrder.problems.length > 0" class="problems-cus">Vấn đề: {{ convertData(detailOrder.problems) }}</div>
        <div v-if="detailOrder.solutions && detailOrder.solutions.length > 0" class="problems-cus">Mong muốn: {{ convertData(detailOrder.solutions) }}</div>
        <div v-if="detailOrder.detail && detailOrder.detail.length > 0" class="problems-cus">Chi tiết: {{ detailOrder.detail }}</div>
      </div>
    </div>
  </b-modal>

</template>

<script>
//
// import hrOrderService from 'domain/services/hr-order-service'
// import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'ModalProposalDetails',
  data: _ => ({
    loading: false,
    data: []
  }),
  props: {
    dataProposalDetail: null
  },
  computed: {
  },
  created () {

  },
  watch: {
  },
  methods: {
    resetData () {
    },
    convertData (data) {
      return data.map((item) => item.name).join(', ')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .modal-cus {
  .modal-dialog {
    max-width: 32.5rem !important;
    align-items: center;
    min-height: calc(100% - (1.75rem * 2));
    display: flex;
    -webkit-box-align: center;
  }
  .modal-header {
    height: 3rem !important;
  }
  .modal-title {
    line-height: 0.7 !important;
  }
  .close {
    display: inline-block !important;
    font-size: 1.5rem !important;
  }
}
.wrap-cus {
  font-size: 15px;
  color: black;
  .container-cus {
    margin-bottom: 0.5rem;
    .title-cus {
      font-weight: 500;
    }
    .problems-cus {
      margin-top: 0.5rem;
    }
  }
}
</style>
