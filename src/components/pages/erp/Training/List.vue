<template>
  <div>
    <b-row class="top align-items-center">
      <b-col md="4">
        <h4 class="m-0">Danh sách bài đào tạo</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <b-btn variant="ghtk" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-btn>
        <b-btn variant="ghtk" @click="clearFilter">
          <i class="fas fa-sync-alt"></i> Xóa lọc
        </b-btn>
        <router-link :to="{ name: 'add-training' }">
          <b-btn variant="ghtk" @click="openCreateTest = true">
            <i class="fas fa-plus"></i> Thêm mới
          </b-btn>
        </router-link>
      </b-col>
    </b-row>
    <div class="seperate-xs my-1"></div>
    <b-row class="search-bar-wrapper">
      <b-col class="col-no-padding">
        <label class="form-label">Tên bài đào tạo</label>
        <input
          v-model="filter.name"
          type="text"
          placeholder="Nhập tên"
          class="form-control"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Mã bài đào tạo</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Chọn bộ phận</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Chọn vị trí</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Miền</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
    </b-row>
    <b-row class="search-bar-wrapper">
      <b-col class="col-no-padding">
        <label class="form-label">Tỉnh</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Kho</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Ngày hiển thị</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="col-no-padding">
        <label class="form-label">Thời hạn hoàn thành</label>
        <input
          type="text"
          placeholder="Nhập tên"
          class="form-control"
          disabled="true"
        />
      </b-col>
      <b-col class="btn-group-search col-no-padding">
      </b-col>
    </b-row>
    <!-- paging -->
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
    <!-- data -->
    <div>
      <section class="test bg-light">
        <div class="table-title">Tên</div>
        <div class="table-title">Bộ phận</div>
        <div class="table-title">Vị trí</div>
        <div class="table-title">Miền</div>
        <div class="table-title">Tỉnh</div>
        <div class="table-title">Kho</div>
        <div class="table-title">Sau ngày vào</div>
        <div class="action-group table-title">Thao tác</div>
      </section>
      <div :class="scrollMode && 'scroll-mode'" v-loading="loading" class="position-relative mih-5re">
      <section class="test" v-for="(test, index) in list" :key="`test${index}`">
        <div>{{ test.ErpTrainingTest.name }}</div>
        <div>{{ test[0].departments || '--' }}</div>
        <div>{{ test[0].positions || '--' }}</div>
        <div>{{ test.ErpTrainingTest.regions || '--' }}</div>
        <div>{{ test[0].addreses || '--' }}</div>
        <div>{{ test[0].stations || '--' }}</div>
        <div>{{ test.ErpTrainingTest.start_days }}</div>
        <div class="action-group">
          <router-link
            :to="{ name: 'build-training', params: { id: test.ErpTrainingTest.id } }"
          >
            <b-btn variant="outline-ghtk" size="sm" title="Sửa trang"><i class="fa fa-wrench"></i></b-btn>
          </router-link>
          <router-link
            :to="{ name: 'edit-training', params: { id: test.ErpTrainingTest.id } }"
          >
            <b-btn variant="outline-ghtk" size="sm" title="Sửa bài học"><i class="far fa-edit"></i></b-btn>
          </router-link>
          <b-button variant="outline-danger" size="sm" @click="deleteTest(test.ErpTrainingTest.id)" title="Xóa bài"><i class="fas fa-trash"></i></b-button>
        </div>
      </section>
      </div>
    </div>
  </div>
</template>
<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import trainingService from 'domain/services/training-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
export default {
  components: { SingleSelectStation, SingleSelectProvince, SingleSelectRegion },

  props: {
    scrollMode: {
      default: false,
      type: Boolean
    }
  },

  mounted () {
    this.getJobs()
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
        name: null
      },
      reset: false,
      openCreateTest: false
    }
  },
  methods: {
    async getJobs () {
      try {
        this.loading = true
        const { data } = await trainingService.getTrainingTests({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success) {
          this.list = data.tests
          this.pagination.total = data.total
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    clearFilter () {
      this.filter = {
        name: null
      }

      this.getJobs()
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getJobs()
    },
    async search () {
      this.resetPagination()
      this.getJobs()
    },
    deleteTest (id) {
      this.$bvModal
        .msgBoxConfirm('Bạn có chắc muốn xóa bài đào tạo này?', {
          title: 'Xóa bài đào tạo',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Tiếp tục',
          cancelTitle: 'Hủy',
          hideHeaderClose: false,
          centered: true
        })
        .then((ok) => {
          if (ok) this.executeDeleteTest(id)
        })
        .catch((_) => {})
    },
    async executeDeleteTest (id) {
      try {
        this.loading = true
        const { data } = await trainingService.deleteTrainingTest({ id })
        if (data.success) {
          commonHelper.showMessage(data.message, 'success')
          this.getJobs()
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 8,
        total: 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.table-title{
  font-weight: bold;
}
.btn-center {
  margin-left: 5px;
  margin-right: 5px;
}
.test {
  border-bottom: 1px solid #ccc;
  padding: 15px 15px 15px 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
  width: 100%;
  align-content: center;
  justify-content: center;
}
.action-group {
  text-align: end;
}
.col-no-padding {
  padding-left: 0px;
  max-width: 350px;
}
.btn-full-width {
  width: 100%;
}

.job:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.scroll-mode {
  max-height: 60vh;
  overflow: auto;
  border-bottom: 1px solid #ccc;
}

.action {
  display: flex;
  justify-content: flex-start;
}
.search-bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 0.75rem;
  margin-bottom: 10px;
}

.search-bar-top {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
}
.loading-wrapper {
  margin-top: 10%;
}
.pagination {
  margin-top: 20px;
}
.short_desc > p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-group-search {
  display: flex;
  justify-content: flex-end;
}
.btn-center {
  margin-left: 5px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-img {
  max-height: 150px !important;
  width: 100%;
  min-height: 150px !important;
}
.custom-btn {
  width: 92px;
}
</style>

<style>
.select-station > .mb-4 {
  margin-bottom: unset !important;
}
</style>
