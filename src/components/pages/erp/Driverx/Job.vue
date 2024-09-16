<template>
  <div v-loading="loading">
    <div>
      <b-row class="top">
        <h3 class="mt-2">Danh sách công việc</h3>
        <div>
          <b-button variant="outline-secondary">Danh sách ứng tuyển</b-button>
        </div>
      </b-row>
    </div>
    <hr>
    <b-row class="search-bar-wrapper">
      <b-col>
        <label class="form-label">Tên công việc</label>
        <input v-model="filter.name" type="text" placeholder="Nhập tên" class="form-control" />
      </b-col>
      <b-col>
        <label class="form-label">Ngày bắt đầu</label>
        <v-date-picker mode="range" v-model="filter.start" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Ngày bắt đầu', style: 'color:darkgrey;' }"
        />
      </b-col>
      <b-col class="select-station">
        <label class="form-label">Kho</label>
        <SingleSelectStation @handleSelectedStation="opt => filter.station = opt ? opt.id : null"/>
      </b-col>
      <b-col>
        <label class="form-label">Ngày tạo</label>
        <v-date-picker mode="range" v-model="filter.created" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'color:darkgrey;' }"
        />
      </b-col>
      <b-col class="btn-group-search">
        <b-button class="ml-1" @click="clearFilter"><i class="fas fa-sync-alt"></i> Xóa lọc</b-button>
        <b-button class="mr-1 btn-center" variant="primary" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-button>
        <router-link :to="{name: 'driverx-create-job'}">
          <b-button class="mr-1" variant="success"><i class="fas fa-plus"></i> Thêm mới</b-button>
        </router-link>
      </b-col>
    </b-row>
    <b-row class="row-wrapper jobs" v-for="(jobs, index) in list" :key="`job${index}`">
      <b-col class="job" v-for="(job, index) in jobs" :key="`job${index}`">
          <router-link :to="{name: 'driverx-job-detail', params: { id: job.ErpDriverxJob.id }}" class="job-item">
          <b-carousel
            class="carousel-custom"
            :interval="3000"
            controls
            background="#ababab"
            style="text-shadow: 1px 1px 2px #333; height: 300px;"
          >
            <template v-if="job.ErpDriverxJob.avatar">
              <b-carousel-slide v-for="(src, index) in job.ErpDriverxJob.avatar.split(',')" :key="`slide-${index}`">
                <template #img>
                  <img :src="src" class="custom-img">
                </template>
              </b-carousel-slide>
            </template>
            <template v-else>
              <b-carousel-slide>
                <template #img>
                  <img src="https://cache.giaohangtietkiem.vn/image/show/123af3e2-6e2c-41e3-b260-6140ef79ae19/no_file.png?width=400"
                  class="custom-img">
                </template>
              </b-carousel-slide>
            </template>
          </b-carousel>
          </router-link>
          <h4 class="job-name">{{ job.ErpDriverxJob.name }}</h4>
          <div class="job-body">
            <p><b>Kho</b>: {{ job.Station.name }}</p>
            <p><b>Thu nhập</b>: {{ job.ErpDriverxJob.money }}</p>
            <p><b>Ngày bắt đầu</b>: {{ job.ErpDriverxJob.start_date | dateFormated }}</p>
            <p><b>Giờ bắt đầu làm việc</b>: {{ job.ErpDriverxJob.start_hour }}h</p>
            <p><b>Giờ kết thúc</b>: {{ job.ErpDriverxJob.end_hour }}h</p>
            <div class="action">
              <router-link :to="{name: 'driverx-edit-job', params: {id: job.ErpDriverxJob.id}}">
                <b-button class="ml-1" size="sm" variant="outline-secondary">
                  Sửa <i class="fa fa-edit"></i>
                </b-button>
              </router-link>
              <b-button class="ml-1" size="sm" variant="outline-danger" @click="deleteJob(job.ErpDriverxJob.id)">
                Xóa <i class="fa fa-trash"></i>
              </b-button>
            </div>
          </div>
      </b-col>
    </b-row>
    <b-row class="pagination">
      <b-pagination
        v-model="pagination.currentPage"
        :total-rows="pagination.total"
        :per-page="8"
        v-on:change="onPageChange"
      ></b-pagination>
    </b-row>
  </div>
</template>
<script>
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverxService from 'domain/services/driverx-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'

export default {
  components: {SingleSelectStation},
  mounted () {
    this.getList()
  },
  data () {
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        limit: 8,
        total: 0
      },
      list: [],
      filter: {
        name: null,
        station: null,
        start: null,
        created: null
      }
    }
  },
  methods: {
    async getList () {
      try {
        this.loading = true
        const {data} = await driverxService.getJobs({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        this.list = data.data
        this.pagination.total = data.total
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getList()
    },
    async search () {
      this.resetPagination()
      this.getList()
    },
    async clearFilter () {
      this.filter = {
        name: null,
        station: null,
        start: null,
        created: null
      }
      await this.resetPagination()
      this.getList()
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 8,
        total: 0
      }
    },
    deleteJob (id) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc xóa công việc này?', {
        title: 'Xóa công việc',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) this.execDeleteJob(id)
        })
        .catch(_ => {})
    },
    async execDeleteJob (id) {
      try {
        this.loading = true
        const {data} = await driverxService.deleteJob({id})
        if (data.success) {
          commonHelper.showMessage(data.message, 'success')
          this.getList()
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    }
  },
  filters: {
    dateFormated (d) {
      return moment(d).format('DD-MM-YYYY')
    }
  }
}
</script>

<style scoped lang="scss">
.action{
  display: flex;
  justify-content: flex-start;
}
.search-bar-wrapper{
  align-items: flex-end;
}
.loading-wrapper{
  margin-top: 10%;
}
.pagination{
  margin-top: 20px;
}
.short_desc > p{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.job{
  &-name{
    min-height: 60px;
    padding-left: 10px;
    padding-right: 10px;
  }
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
  padding-left: 0px;
  padding-right: 0px;
  margin-right: 1vw;
  cursor: pointer;
  &-body{
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
  }
  &-img{
    min-height: 180px;
    width: 100%;
    background-image: url('https://cache.giaohangtietkiem.vn/image/show/d7afa1c9-6b96-4e15-b8fa-00b62c5b8851/image_4.png?width=355');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  &-name{
    padding-top: 10px;
  }
  &-item{
    color: rgb(78, 81, 85);
  }
}
.row-wrapper{
  margin-top: 5vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
}
.btn-group-search{
  display: flex;
  justify-content: space-between;
}
.btn-center{
  margin-left: 5px;
}
.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-img{
  width: 100%;
  max-height: 250px;
  min-height: 250px;
}
</style>
<style>
.job-item > .slide{
  height: auto !important;
}
</style>

<style>
.select-station > .mb-4 {
  margin-bottom: unset !important;
}
</style>
