<template>
    <span class="list-appendix">
        <b-btn variant="secondary" @click="showSlideModal()">Xem tất cả bảng giá</b-btn>
        <!-- Modal template -->
        <b-modal ref="slideModal" modal-class="modal-slide" hide-footer static>
            <div slot="modal-title"><p class="text-center text-big mb-4">Danh sách các bảng giá</p></div>
                <table class="table card-table" style="top: 0px; position: absolute">
                        <thead class="thead-light">
                        <tr>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th >Người tạo</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                           <tr v-for="priceUnit in listPriceUnit.disable">
                                <td>{{priceUnit[0].created}}</td>
                                <td>
                                    <span class="badge badge-danger badge-pill">HẾT HIỆU LỰC</span>
                                </td>
                                <td v-if="priceUnit[0].created_name">{{priceUnit[0].created_name}}</td>
                                <td  @click="setOldData(priceUnit)"><a href="#" class="btn btn-success btn-sm" v-b-modal.modal-history-price-detail>
                                    Xem  <i class="ion ion-ios-arrow-dropright-circle"></i>
                                </a></td>
                            </tr>
                           <tr v-for="priceUnit in listPriceUnit.active">
                                <td>{{priceUnit[0].created}}</td>
                                <td>
                                    <span class="badge badge-success badge-pill">Hiệu lực</span>
                                </td>
                                <td v-if="priceUnit[0].created_name">{{priceUnit[0].created_name}}</td>
                                <td  @click="setOldData(priceUnit)"><a href="#" class="btn btn-success btn-sm" v-b-modal.modal-history-price-detail>
                                    Xem  <i class="ion ion-ios-arrow-dropright-circle"></i>
                                </a></td>
                            </tr>
                        </tbody>
                </table>
            <modal-history-price-detail :old-price-units="tmp"></modal-history-price-detail>
        </b-modal>
    </span>
</template>
<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import ModalHistoryPriceDetail from './ModalHistoryPriceDetail'

export default {
  name: 'ListPriceUnit',
  components: {
    ModalHistoryPriceDetail
  },
  props: [
    'company_id'
  ],
  data: () => ({
    listPriceUnit: [],
    tmp: null
  }),
  methods: {
    setOldData: function (priceUnit) {
      this.tmp = priceUnit
    },
    showSlideModal () {
      this.$refs.slideModal.show()
      this.getListPriceUnit()
    },
    hideSlideModal () {
      this.$refs.slideModal.hide()
    },
    getListPriceUnit: function () {
      let dataSend = {
        company_id: this.company_id
      }
      CompanyProfileService.getListPriceUnit(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.listPriceUnit = response.data.data
          }
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
    },
    goto: function (id) {
      let url = '/contract/appendix/' + id
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
    .list-appendix{
        display: inline-block;
    }
</style>
