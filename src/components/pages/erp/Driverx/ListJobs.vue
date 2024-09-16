<template>
  <h3 v-if="!menuWork">
    Màn này hiện đã đóng, vui lòng vào màn Tuyển dụng ở menu Quản lý công việc để tiếp tục thao tác hoặc liên hệ HR kho để được hỗ trợ!
  </h3>
  <div v-else>
    <!-- header  -->
    <b-row class="top align-items-center">
      <b-col md="4">
        <h4 class="m-0">Danh sách công việc</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <b-btn class="ml-1 custom-btn" variant="ghtk" @click="clearFilter"><i class="fas fa-sync-alt"></i> Xóa lọc</b-btn>
        <b-btn class="mr-1 btn-center" variant="ghtk" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-btn>
        <router-link :to="{name: 'driverx-create-job'}" :target="blankMode && '_blank'">
          <b-button class="mr-1" variant="ghtk"><i class="fas fa-plus"></i> Thêm mới</b-button>
        </router-link>
        <router-link :to="{name: 'driverx-training'}" :target="blankMode && '_blank'">
          <b-button variant="ghtk">Bài test ứng viên</b-button>
        </router-link>
      </b-col>
    </b-row>
    <div class="seperate-xs my-1"></div>
    <!-- filter  -->
    <b-row class="search-bar-wrapper search-bar-top">
      <b-col class="col-no-padding">
        <label class="form-label">SĐT hoặc CMND ứng viên</label>
        <input v-model="filter.code" type="text" placeholder="Nhập tên" class="form-control" />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Tên công việc</label>
        <input v-model="filter.name" type="text" placeholder="Nhập tên" class="form-control" />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Mã công việc</label>
        <input v-model="filter.id" type="text" placeholder="Nhập mã công việc" class="form-control" />
      </b-col>
      <b-col class="select-station col-no-padding">
        <label class="form-label">Chọn miền</label>
        <SingleSelectRegion @handleSelectedRegion="option => filter.region = option ? option.id : null"
          :reset="reset"
        />
      </b-col>
      <b-col class="select-station col-no-padding">
        <label class="form-label">Chọn tỉnh</label>
        <SingleSelectProvince @handleSelectedProvince="option => filter.provinceId = option ? option.id : null"
          :regionName="filter.region" :reset="reset"/>
      </b-col>
      <b-col class="select-station col-no-padding">
        <label class="form-label">Kho</label>
        <SingleSelectStation @handleSelectedStation="opt => filter.station = opt ? opt.id : null"
          :provinceId="filter.provinceId" :reset="reset"/>
      </b-col>
    </b-row>
    <b-row class="search-bar-wrapper">
      <b-col class="select-station col-no-padding">
        <label class="form-label">Vị trí</label>
        <b-form-select v-model="filter.type" :options="jobTypes"></b-form-select>
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Ngày bắt đầu</label>
        <v-date-picker mode="range" v-model="filter.start" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Thời gian bắt đầu', style: 'color:darkgrey;' }"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Ngày kết thúc</label>
        <v-date-picker mode="range" v-model="filter.end" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Thời gian kết thúc', style: 'color:darkgrey;' }"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Ngày tạo</label>
        <v-date-picker mode="range" v-model="filter.created" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'color:darkgrey;' }"
        />
      </b-col>
      <b-col class="select-station col-no-padding">
        <label class="form-label">Trạng thái tin</label>
        <b-form-select v-model="filter.status" :options="statuses"></b-form-select>
      </b-col>
    </b-row>
    <!-- Content  -->
    <div class="border round">
      <!-- paging  -->
    <div class="mb-1 mt-3">
      <div class="z-0 d-inline-block">
        <b-pagination
          class="m-0"
          size="sm"
          align="left"
          v-model="pagination.currentPage"
          :total-rows="pagination.total"
          :per-page="8"
          @change="onPageChange"
        >
        </b-pagination>
      </div>
      <b class="float-right">Trang {{ pagination.currentPage }}/{{ Math.ceil(pagination.total / 8) }}</b>
    </div>
    <!-- main content -->
    <b-row class="position-relative m-0 border mih-5re" :class="scrollMode ? smallScreen ? 'scroll-mode-small' : 'scroll-mode' : ''" v-loading="loading">
      <b-col>
        <section class="job" v-for="(job, index) in list" :key="`job${index}`">
            <div class="job-top">
              <div class="job-left">
                <b-carousel
                  class="carousel-custom"
                  :interval="3000"
                  controls
                  background="#ababab"
                  style="text-shadow: 1px 1px 2px #333; height: auto;"
                >
                  <template v-if="job.ErpDriverxJob.avatar">
                    <b-carousel-slide v-for="(src, index) in job.ErpDriverxJob.avatar.split(',')" :key="`slide-${index}`">
                      <template #img>
                        <img :src="src" class="custom-img" v-if="isImage(src)">
                        <video width="100%" height="100%" class="custom-img" controls v-else>
                          <source :src="src" type="video/mp4">
                          Your browser does not support the video tag.
                        </video>
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
              </div>
              <div class="job-center">
                <div>
                  <p>Mã công việc: {{ job.ErpDriverxJob.id }}</p>
                  <p>Tên công việc: <b>{{ job.ErpDriverxJob.name }}</b></p>
                  <p>Kho làm việc: {{ job.Station.name }}</p>
                </div>
                <div>
                  <p>Số lượng tuyển: {{ job.ErpDriverxJob.amount }}</p>
                  <p>Thời gian làm việc: Từ {{ job.ErpDriverxJob.start_hour }}h đến {{ job.ErpDriverxJob.end_hour }}h</p>
                  <p>Thu nhập: {{ job.ErpDriverxJob.money }}</p>
                </div>
              </div>
              <div class="job-right">
                <router-link
                  v-if="job.ErpDriverxJob.is_delete == 0"
                  :to="{name: 'driverx-job-detail', params: { id: job.ErpDriverxJob.id }}"
                  :target="blankMode && '_blank'"
                >
                  <b-button variant="outline-ghtk" class="btn-full-width">Xem DS ứng viên</b-button>
                </router-link>
                <router-link
                  v-if="job.ErpDriverxJob.is_delete == 0"
                  :to="{name: 'driverx-edit-job', params: {id: job.ErpDriverxJob.id}}"
                  :target="blankMode && '_blank'"
                >
                  <b-button variant="outline-ghtk" class="btn-full-width">Sửa</b-button>
                </router-link>
                <b-button variant="outline-danger" v-if="job.ErpDriverxJob.is_delete == 1" @click="reActive(job.ErpDriverxJob.id)">
                  Khôi phục tin
                </b-button>
                <b-button variant="outline-danger" v-else-if="job.ErpDriverxJob.is_delete == 0" @click="deleteJob(job.ErpDriverxJob.id)">
                  Xóa
                </b-button>
              </div>
            </div>
            <div class="job-bottom">
              <div>
                <p class="job-creator">
                  Người đăng:<b> {{ job.User.fullname }}</b>
                </p>
              </div>
              <div class="job-info-boxes">
                <div class="job-info-box">
                  <b-button variant="outline-secondary" class="border-0">Ứng tuyển: {{ job.ErpDriverxJob.apply }}</b-button>
                </div>
                <div class="job-info-box">
                  <b-button variant="outline-secondary" class="border-0">Trúng tuyển: {{ job.ErpDriverxJob.selected }}</b-button>
                </div>
                <div class="job-info-box">
                  <b-button variant="outline-secondary" class="border-0">Nhận việc: {{ job.ErpDriverxJob.taken }}</b-button>
                </div>
                <div class="job-info-box">
                  <b-button variant="outline-secondary" class="border-0">Lưu thông tin: {{ job.ErpDriverxJob.save_info }}</b-button>
                </div>
                <div class="job-info-box">
                  <b-button variant="outline-secondary" class="border-0">Cần tuyển thêm: {{ job.ErpDriverxJob.amount - job.ErpDriverxJob.taken }}</b-button>
                </div>
              </div>
            </div>
        </section>
      </b-col>
    </b-row>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverxService from 'domain/services/driverx-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import config from './config'

export default {
  props: {
    scrollMode: {
      default: false,
      type: Boolean
    },

    smallScreen: {
      default: false,
      type: Boolean
    },

    blankMode: {
      default: null
    },

    menuWork: {
      default: false
    }
  },

  components: {SingleSelectStation, SingleSelectProvince, SingleSelectRegion},
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
        end: null,
        created: null,
        region: null,
        provinceId: null,
        type: null,
        id: null,
        code: null,
        status: null
      },
      reset: false,
      jobTypes: config.jobTypes,
      statuses: config.statuses
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
        end: null,
        created: null,
        type: null,
        region: null,
        provinceId: null,
        id: null,
        code: null,
        status: null
      }
      this.reset = !this.reset
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
    },
    isImage (path) {
      if (!path) return null
      let imageReg = /[/.](gif|jpg|jpeg|tiff|png)$/i
      return imageReg.test(path)
    },
    reActive (id) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn khôi phục tin này?', {
        title: 'Khôi phục tin',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) this.execReActiveJob(id)
        })
        .catch(_ => {})
    },
    async execReActiveJob (id) {
      try {
        this.loading = true
        const {data} = await driverxService.reActiveJob({id})
        if (data.success) {
          let idx = this.list.findIndex(item => parseInt(item.ErpDriverxJob.id) === parseInt(id))
          if (idx >= 0) this.list[idx].ErpDriverxJob.is_delete = 0
          commonHelper.showMessage(data.message, 'success')
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        console.log(e)
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
.scroll-mode {
  max-height: 70vh;
  overflow: auto;
  &-small {
    max-height: 65vh;
    overflow: auto;
  }
}
.job{
  width: 100%;
  border: 1px solid #eee;
  padding: 15px 15px 0px 15px;
  background-color: #eee;
  margin-bottom: 20px;
  &-top{
    display: grid;
    grid-template-columns: 2fr 8fr 2fr;
    justify-content: center;
  }
  &-bottom{
    display: grid;
    grid-template-columns: 2fr 8fr 2fr;
  }
  &-center{
    padding-left: 3vw;
    padding-right: 3vw;
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
  &-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  &-creator{
    padding-top: 10px;
  }
  &-info-boxes{
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 2fr 2fr;
    margin-bottom: 10px;
  }
  &-info-box{
    display: flex;
    justify-content: center;
  }
}
.col-no-padding{
  padding-left: 0px;
  max-width: 350px;
}
.btn-full-width{
  width: 100%;
}

.job:hover{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action{
  display: flex;
  justify-content: flex-start;
}
.search-bar-wrapper{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  align-items: flex-end;
  padding-left: 0.75rem;
  margin-bottom: 10px;
}

.search-bar-top{
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
.btn-group-search{
  display: flex;
  justify-content: flex-end;
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
  max-height: 150px !important;
  width: 100%;
  min-height: 150px !important;
}
.custom-btn{
  width: 92px;
}
</style>

<style>
.select-station > .mb-4 {
  margin-bottom: unset !important;
}
</style>
