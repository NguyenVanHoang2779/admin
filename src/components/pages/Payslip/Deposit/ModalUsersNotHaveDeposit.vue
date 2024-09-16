<template>
    <div>
        <b-modal  modal-class="modal-xl" id="modal-users-not-have-deposit" :hide-footer="true" :hide-header="true" @show="getListUserNotHaveDeposit(pageData.currentPage)" static>
            <div class="deposit-history">
                <p>Danh sách nhân viên chưa có cọc:</p>

                <div>
                    <button class="btn btn-outline-info float-right ml-5" @click="setOriginDeposit()">Config tiền đặt cọc theo rule</button>
                    <b-form-group class="float-right">
                        <template v-slot:label>
                            <b-form-checkbox
                                    v-model="allSelected"
                                    :indeterminate="indeterminate"
                                    aria-describedby="flavours"
                                    aria-controls="flavours"
                                    @change="toggleAll"
                            >
                                {{ allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
                            </b-form-checkbox>
                        </template>
                    </b-form-group>
                </div>

                <table  class="table mb-0 table-bordered">
                    <thead class="thead-light">
                    <tr>
                        <th>STT</th>
                        <th>Mã nhân viên</th>
                        <th>Tên nhân viên</th>
                        <th>Ngày vào làm</th>
                        <th>Vị trí</th>
                        <th>Loại nhân viên</th>
                        <th>Tùy chọn</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(mas,index) in listMas">
                        <td>{{(pageData.currentPage - 1) * pageData.perPage + index + 1}}</td>
                        <td>{{mas.staff_code}}</td>
                        <td>{{mas.fullname}}</td>
                        <td>{{mas.join_date}}</td>
                        <td>{{mas.groups.toString()}}</td>
                        <td>{{mas.work_types.toString()}}</td>
                        <td class="text-center">
                            <b-form-checkbox
                                    v-model="listMasId[(pageData.currentPage - 1) * pageData.perPage + index]"
                                    :value="mas.id"
                                    :unchecked-value="null"
                            >
                            </b-form-checkbox>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <b-card-body class="pt-0 pb-3">
                    <div class="row">
                        <div class="col-sm pt-3">
                            <b-pagination :total-rows="pageData.totalItems"
                                          v-model="pageData.currentPage"
                                          :per-page="pageData.perPage"
                                          v-on:change="pageChanged"
                            />
                        </div>
                        <div class="col-sm text-sm-left text-center pt-3">
                            <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ totalPages }}</span>
                        </div>
                    </div>
                </b-card-body>
                <!-- / Pagination -->
            </div>
        </b-modal>
    </div>
</template>

<script>
import depositService from 'domain/services/deposit-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-users-not-have-deposit',

  components: {
  },

  props: [],

  data: () => ({
    listMasId: [],
    tmpId: [],
    allSelected: false,
    indeterminate: false,
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 6
    },
    listMas: []
  }),

  created () {
  },

  computed: {
    totalPages () {
      return Math.ceil(this.pageData.totalItems / this.pageData.perPage)
    }
  },

  watch: {
  },

  methods: {
    changeStatus (masId, index) {
      this.$set(this.listMasId, index, masId)
    },

    toggleAll () {
      if (!this.allSelected) {
        this.listMasId = this.tmpId
      } else {
        this.listMasId = []
      }
    },

    setOriginDeposit () {
      if (!confirm('Bạn chắc chắn muốn cập nhật thông tin cọc ban đầu của những người đã chọn!')) return
      let data = {
        listMasId: this.listMasId
      }
      depositService.setOriginDeposit(data)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getListUserNotHaveDeposit(this.pageData.currentPage)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    pageChanged (page) { // Event check pagination change
      this.getListUserNotHaveDeposit(page)
      this.pageData.currentPage = page
    },

    getListUserNotHaveDeposit (page) {
      let data = {
        page: page,
        limit: this.pageData.perPage
      }
      depositService.getListUserNotHaveDeposit(data)
        .then((res) => {
          if (res.data.success) {
            this.listMas = res.data.data['listMas']
            this.tmpId = res.data.data.listMasId
            this.pageData.totalItems = res.data.data['count']
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
</style>
