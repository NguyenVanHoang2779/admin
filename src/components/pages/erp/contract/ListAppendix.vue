<template>
    <span class="d-inline-block">
        <b-btn variant="outline-ghtk" @click="showSlideModal()">
          <i class="fas fa-file-alt"></i> Các phụ lục đính kèm
        </b-btn>
        <!-- Modal template -->
        <b-modal ref="slideModal" hide-footer static centered modal-class="modal-xxl">
            <div slot="modal-title">
              <p class="text-center text-big mb-4">Danh sách các phụ lục đã đính kèm với hợp đồng</p>
            </div>
            <table class="table table-sm card-table">
              <thead class="thead-light">
                <tr>
                    <th>Ngày tạo</th>
                    <th>Ngày hiệu lực</th>
                    <th>Trạng thái</th>
                    <th>Người tạo</th>
                    <th></th>
                </tr>
              </thead>
              <tbody class="position-relative mih-5re" v-loading="loading">
                <tr v-for="(appendix, idx) in listAppendix" :key="idx">
                  <td>{{ appendix.EmpContractSalary.created }}</td>
                  <td>{{ appendix.EmpContractSalary.effect_date }}</td>
                  <td>
                      <span class="badge badge-ghtk badge-pill" v-if="appendix.EmpContractSalary.status=='active'">HIỆU LỰC</span>
                      <span class="badge badge-ghtk badge-pill" v-if="appendix.EmpContractSalary.status=='signed'">ĐÃ KÝ</span>
                      <span class="badge badge-info badge-pill" v-if="appendix.EmpContractSalary.status=='draft'">BẢN NHÁP</span>
                      <span class="badge badge-danger badge-pill" v-if="appendix.EmpContractSalary.status=='disable'">HẾT HIỆU LỰC</span>
                  </td>
                  <td>
                    {{ appendix.UserCreated && appendix.UserCreated.fullname ? appendix.UserCreated.fullname : 'Import Excel' }}
                  </td>
                  <td>
                    <a href="#" class="btn btn-success btn-sm" @click="goto(appendix.EmpContractSalary.id)">
                      Xem <i class="ion ion-ios-arrow-dropright-circle"></i>
                    </a>
                    <b-link
                      v-show="appendix.EmpContractSalary.status === 'draft' && canEditDraft"
                      class="btn btn-success btn-sm"
                      :to="{name: 'appendix-detail', params: {
                          canEdit: true ,
                          appendix_id: +appendix.EmpContractSalary.id,
                          id: +appendix.EmpContractSalary.id,
                          contract: appendix.EmpContract
                        }
                      }"
                    >
                      Sửa <i class="ion ion-md-create"></i>
                    </b-link>
                    <!-- <button class="btn btn-sm btn-outline-danger" @click="deleteAppendix(appendix.EmpContractSalary.id)" v-show="appendix.EmpContractSalary.status === 'draft'">
                      Xóa phụ lục
                    </button> -->
                  </td>
                </tr>
              </tbody>
            </table>
        </b-modal>
    </span>
</template>

<script>
import contractService from 'domain/services/contract-service'

export default {
  name: 'ListAppendix',

  props: ['contract_id', 'canEditDraft'],

  data: () => ({
    listAppendix: [],
    loading: false
  }),

  methods: {
    showSlideModal () {
      this.$refs.slideModal.show()
      this.getListAppendix(this.contract_id)
    },

    hideSlideModal () {
      this.$refs.slideModal.hide()
    },

    getListAppendix (contractId) {
      this.loading = true
      contractService.getListAppendixOfContract({contract_id: contractId})
        .then(res => {
          if (res.data.success) {
            this.listAppendix = res.data.data || []
          } else {
            this.listAppendix = []
            console.log(res.data.message || 'Có lối khi lấy danh sách phụ lục đính kèm !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },

    deleteAppendix (appendixId) {
      if (!confirm('Bạn có chắc chắn muốn xóa phụ lục này ? Lưu ý chỉ nên xóa phụ lục sai, lỗi')) return
      contractService.deleteAppendix({appendix_id: appendixId})
        .then(res => {
          if (res.data.success) {
            this.listAppendix = this.listAppendix.filter(appendix => (+appendix.EmpContractSalary.id !== +appendixId))
          } else {
            console.log(res.data.message || 'Có lối khi lấy danh sách phụ lục đính kèm !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {

        })
    },

    goto (id) {
      let url = '/contract/appendix/' + id
      this.$router.push(url)
    }
  }
}
</script>
