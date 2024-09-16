<template>
  <div v-loading="loading">
    <div>
      <b-row class="top">
        <h3 class="mt-2">Danh sách bài test</h3>
      </b-row>
    </div>
    <hr>
    <b-row class="search-bar-wrapper">
      <b-col class="col-no-padding">
        <label class="form-label">Tên bài test</label>
        <input v-model="filter.name" type="text" placeholder="Nhập tên" class="form-control" />
      </b-col>
      <b-col class="btn-group-search col-no-padding">
        <b-button class="ml-1 custom-btn" @click="clearFilter"><i class="fas fa-sync-alt"></i> Xóa lọc</b-button>
        <b-button class="mr-1 btn-center" variant="primary" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-button>
        <b-button class="mr-1" variant="success" @click="openCreateTest = true">
            <i class="fas fa-plus"></i> Thêm mới
        </b-button>
      </b-col>
    </b-row>
    <b-row class="row-wrapper">
        <section class="job" v-for="(test, index) in list" :key="`test${index}`">
              <div class="job-left">
                <b>{{ test.name }}</b>
              </div>
              <div class="job-center"></div>
              <div class="job-right">
                <router-link :to="{name: 'training-builder', params: {id: test.id}}" class="btn-center">
                  <b-button variant="outline-secondary" class="btn-full-width">Sửa</b-button>
                </router-link>
                <b-button variant="outline-secondary" @click="deleteTest(test.id)">Xóa</b-button>
              </div>
        </section>
    </b-row>
    <b-row class="pagination">
      <b-pagination
        v-model="pagination.currentPage"
        :total-rows="pagination.total"
        :per-page="8"
        v-on:change="onPageChange"
      ></b-pagination>
    </b-row>
    <CreateTest :open="openCreateTest" @createTest="createTest" @close="openCreateTest = false"/>
  </div>
</template>
<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverxService from 'domain/services/driverx-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import CreateTest from './CreateTest.vue'

export default {
  components: {SingleSelectStation, SingleSelectProvince, SingleSelectRegion, CreateTest},
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
        const {data} = await driverxService.getTests({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success) {
          this.list = data.tests
        } else commonHelper.showMessage(data.message, 'error')
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    },
    async createTest (reqData) {
      this.openCreateTest = false
      this.loading = true
      try {
        const {data} = await driverxService.createTest(reqData)
        if (data.success) {
          await this.getJobs()
          commonHelper.showMessage('Thành công', 'success')
        } else commonHelper.showMessage(data.message, 'error')
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
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
      this.$bvModal.msgBoxConfirm('Bạn có chắc xóa bài test này?', {
        title: 'Xóa bài test',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) this.executeDeleteTest(id)
        })
        .catch(_ => {})
    },
    async executeDeleteTest (id) {
      try {
        this.loading = true
        const {data} = await driverxService.deleteTest({id})
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
.btn-center{
  margin-left: 5px;
  margin-right: 5px;
}
.job{
  width: 100%;
  border: 1px solid #eee;
  padding: 15px 15px 15px 15px;
  background-color: #eee;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  align-content: center;

  &-center{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-right{
    display: flex;
    justify-content: flex-end;
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

.row-wrapper{
  margin-top: 5vh;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}
.action{
  display: flex;
  justify-content: flex-start;
}
.search-bar-wrapper{
  display: flex;
  justify-content: space-between;
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
