<template>
  <div>
    <!-- header  -->
    <b-row class="top align-items-center">
      <b-col md="4">
        <h4 class="m-0">Danh sách nhân viên báo lỗi EKYC</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <b-btn class="ml-1 custom-btn" variant="ghtk" @click="clearFilter">
          <i class="fas fa-sync-alt"></i> Xóa lọc
        </b-btn>
        <b-btn class="mr-1 btn-center" variant="ghtk" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-btn>
      </b-col>
    </b-row>
    <div class="seperate-xs my-1"></div>
    <!-- filter  -->
    <b-row class="search-bar-wrapper search-bar-top">
      <b-col class="col-no-padding">
        <label class="form-label">Mã MP hoặc CMND</label>
        <input v-model="filter.code" type="text" placeholder="Nhập tên" class="form-control" />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Username hoặc Họ tên</label>
        <input v-model="filter.name" type="text" placeholder="Nhập tên" class="form-control" />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Trạng thái</label>
        <b-form-select v-model="filter.status" :options="options"></b-form-select>
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
    <b-row class="position-relative m-0 border mih-5re" v-loading="loading">
      <b-col>
        <section class="job" v-for="(report, index) in list" :key="`report${index}`">
            <div class="job-top">
              <div class="job-left">
                <b-carousel
                  class="carousel-custom"
                  :interval="3000"
                  controls
                  background="#ababab"
                  style="text-shadow: 1px 1px 2px #333; height: auto;"
                >
                  <template v-if="report.ErpEkycReport.files">
                    <b-carousel-slide v-for="(src, index) in report.ErpEkycReport.files.split(',')" :key="`slide-${index}`" v-viewer>
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
              </div>
              <div class="job-center">
                <p>Trạng thái: <b>{{ report.ErpEkycReport.status | statusToText }}</b></p>
                <p>Người báo cáo: <b>{{ report.MasterProfile.fullname }}</b></p>
                <p>Ngày báo cáo: <b>{{ report.ErpEkycReport.created | timeFormat }}</b></p>
              </div>
              <div class="job-right">
                <b-button variant="outline-ghtk" class="btn-full-width btn-custom" size="sm" @click="approve(report.ErpEkycReport.id, 'true')">
                  User báo lỗi đúng
                </b-button>
                <b-button variant="outline-secondary" size="sm" class="btn-full-width btn-end btn-custom" @click="approve(report.ErpEkycReport.id, 'false')">
                  User báo lỗi sai
                </b-button>
              </div>
            </div>
        </section>
      </b-col>
    </b-row>
    </div>
  </div>
</template>
<script>
import Report from './ReportMixin'
import 'viewerjs/dist/viewer.css'

export default {
  mixins: [Report]
}
</script>

<style scoped lang="scss">
.btn-custom{
  height: 38px;
}
.btn-end{
  margin-left: 5px;
}
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
  padding: 15px 15px 15px 15px;
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
    grid-template-columns: 1fr 1fr 1fr;
  }
  &-right{
    display: flex;
    justify-content: flex-end;
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
  cursor: pointer;
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
