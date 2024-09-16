<template>
  <div>
    <b-modal id="modal-detail" size="lg" hide-footer ref="myModalRef" @show="loading = true" @shown="getListLoadingBlockByUserAndDate" @hidden="resetDefault" static>
      <div slot="modal-title">
        Danh sách tất cả profile của master
      </div>
      <div class="mb-3" v-if="reponseData.length > 0">
        <table class="table mb-0 table-bordered">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Nhóm được duyệt</th>
              <th>Số giờ được duyệt</th>
              <th>KPI</th>
<!--              <th>Người duyệt</th>-->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row) in reponseData" >
              <td>{{row.date}}</td>
              <td>{{row.module_alias}}</td>
              <td>{{row.hours}}</td>
              <td>{{row.kpi}}</td>
<!--              <td>{{user.positionName}}</td>-->
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="loading">
        Dữ liệu đang loading...
      </div>
      <div>
        <b-row>
          <b-col md="2" offset-md="10"><b-btn class="btn btn-outline-secondary" @click="hideModal">Đóng</b-btn></b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import staffService from 'domain/services/staff-service'
export default {
  name: 'modal-detail-loading-kpi',

  components: {
  },

  props: [
    'masterProfileId',
    'requestData'
  ],

  data: () => ({
    reponseData: [],
    users: [],
    loading: false
  }),

  created () {
  },

  watch: {
  },

  methods: {
    hideModal () {
      this.$refs.myModalRef.hide()
    },

    getListLoadingBlockByUserAndDate: function () {
      let params = {
        userId: this.requestData.id,
        date: this.requestData.date
      }
      staffService.getListLoadingBlockByUserAndDate(params)
        .then((res) => {
          if (res.data.success) {
            this.reponseData = res.data.data
            this.loading = false
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    resetDefault: function () {
      this.reponseData = []
    }
  }
}
</script>
