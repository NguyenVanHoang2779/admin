<template>
  <b-col md="8">
      <div class="analytic-bar" v-loading="loading">
        <div class="analytic-box">
          <b>Số lượng HS thiếu</b>
          <p><b-badge variant="secondary" class="custom-baged">{{ lackingDocs.lack }}</b-badge></p>
        </div>
        <div class="analytic-box">
          <b>Tỷ lệ HS thiếu</b>
          <p><b-badge variant="secondary" class="custom-baged">{{ lackingDocs.percent }} %</b-badge></p>
        </div>
        <div class="analytic-box">
          <b>Số lượng nhân viên thiếu HS</b>
          <p><b-badge variant="warning" class="custom-baged">{{ userLackingDocs.total }}</b-badge></p>
        </div>
        <div class="analytic-box">
          <b>Tỷ lệ nhận viên thiếu HS</b>
          <p><b-badge variant="warning" class="custom-baged">{{ userLackingDocs.percent }}%</b-badge></p>
        </div>
        <!-- <div class="analytic-box">
          <b>Số lượng HS quá hạn</b>
          <p><b-badge variant="danger" class="custom-baged">{{ outOfDateData.totalOutOfDate }}</b-badge></p>
        </div>
        <div class="analytic-box">
          <b>Tỷ lệ HS quá hạn</b>
          <div><b-badge variant="danger" class="custom-baged">{{ outOfDateData.percent }}%</b-badge></div>
        </div> -->
      </div>
  </b-col>
</template>
<script>
import profileService from 'domain/services/profile-mamanger-service'

export default {
  data () {
    return {
      loading: false,
      lackingDocs: {
        lack: 0,
        percent: 0
      },
      userLackingDocs: {
        total: 0,
        percent: 0
      },
      outOfDateData: {
        totalOutOfDate: 0,
        percent: 0
      }
    }
  },
  mounted () {
    this.getAnalyticData()
  },
  methods: {
    async getAnalyticData () {
      try {
        this.loading = true
        const {data} = await profileService.getDocumentAnalytic()
        this.lackingDocs = data.lackingDocs
        this.userLackingDocs = data.userLackingDocData
        this.outOfDateData = data.outOfDateDocs
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.analytic{
  &-bar{
    display: flex;
    justify-content: space-between;
  }
}
.custom-baged{
  width: 100%;
}
</style>
