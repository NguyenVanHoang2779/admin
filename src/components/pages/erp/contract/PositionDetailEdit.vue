<template>
    <div>
        <h4 class="mb-3">
            Quản lí nội dung công việc
        </h4>
        <hr/>
        <b-row>
            <b-col><single-select-department :department-id.sync="department_id"/></b-col>
            <b-col class="text-left">
                <b-button variant="primary" @click="getPositionDetail">
                    <i v-show="!loading" class="fa fa-search"/>
                    <i v-show="loading" class="fa fa-spin fa-spinner"/>
                </b-button>
            </b-col>
            <b-col></b-col>
            <b-col></b-col>
        </b-row>
        <hr/>

        <b-card-group columns>
            <b-card
                    :border-variant="position.detail.id ? 'default' : 'danger'"
                    no-body
                    v-for="position in position_detail"
                    :key="position.id">
                <b-card-header>
                    <b-card-title>
                       <b-row>
                           <b-col>
                               <span style="color: #029860; "><i class="fa fa-info-circle mr-2"/>{{position.position_name}}</span>
                           </b-col>
                           <b-col  v-show="position.detail.backup !== position.detail.description" class="text-right">
                               <b-button size="sm" variant="warning" @click="revert(position)"><i class="fa fa-sync-alt"/></b-button>
                               <b-button size="sm" variant="success" @click="updatePositionDetail(position)"><i class="fa fa-check"/></b-button>
                           </b-col>
                       </b-row>
                    </b-card-title>
                    <b-card-sub-title>
                        <b>{{position.department}}</b>
                    </b-card-sub-title>
                </b-card-header>
                <b-card-body>
                    <label class="form-label">Nội dung công việc</label>
                    <b-form-textarea placeholder="Chưa có nội dung công việc" max-rows="10"
                                     v-model="position.detail.description"/>
                </b-card-body>
            </b-card>
        </b-card-group>
        <b-pagination
                align="center"
                :per-page="pagination.perPage"
                :total-rows="pagination.totalRows"
                v-model="pagination.currenPage"
                @input="getPositionDetail"
        />

    </div>
</template>

<script>
import ContractService from 'domain/services/contract-service'
import SingleSelectDepartment from 'components/pages/Position/SingleSelectDepartment'

export default {
  name: 'PositionDetailEdit',
  components: {SingleSelectDepartment},
  data: () => ({
    loading: false,
    pagination: {
      perPage: 9,
      currenPage: 1,
      totalRows: 100
    },
    position_detail: [],
    department_id: null
  }),
  created () {
    this.getPositionDetail()
  },
  methods: {
    revert (data) {
      data.detail.description = data.detail.backup
    },
    getPositionDetail () {
      this.loading = true
      ContractService
        .getPositionDetail({
          'page': this.pagination.currenPage,
          'per_page': this.pagination.perPage,
          'department_id': this.department_id
        })
        .then(res => {
          if (!res.data.success) throw new Error('Lỗi khi lấy dữ liệu')
          this.position_detail = res.data.data.positions
          this.pagination.totalRows = res.data.data.total
          this.position_detail.forEach(e => {
            e.detail.backup = e.detail.description
          })
        })
        .catch(e => {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: e
          })
          this.position_detail = []
        })
        .finally(() => { this.loading = false })
    },

    updatePositionDetail (data) {
      ContractService
        .updatePositionDetail({
          'pdid': data.detail.id,
          'pid': data.id,
          'description': data.detail.description
        })
        .then(res => {
          if (!res.data.success) throw new Error('Lỗi khi cập nhật dữ liệu')
          this.getPositionDetail()
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: 'Update thành công!'
          })
        })
        .catch(e => {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: e
          })
        })
    }
  }
}
</script>

<style scoped>

</style>
