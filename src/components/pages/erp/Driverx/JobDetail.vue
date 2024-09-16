<template>
  <div v-loading="loading">
    <div>
      <b-row class="top">
        <h3 class="mt-2">Danh sách ứng viên <span class="job-name">({{ job.name }})</span></h3>
      </b-row>
    </div>
    <hr>
    <b-row class="search-bar-wrapper">
      <b-col>
        <label class="form-label">Mã MP / CMND / số ĐT</label>
        <input type="text" class="form-control" v-model="filter.code"/>
      </b-col>
      <b-col>
        <label class="form-label">Họ tên</label>
        <input type="text" class="form-control" v-model="filter.name"/>
      </b-col>
      <b-col>
        <label class="form-label">Trạng thái</label>
        <b-form-select v-model="filter.status" :options="candidateStatus"></b-form-select>
      </b-col>
      <b-col>
        <label class="form-label">Tìm theo thời gian </label>
        <b-form-select v-model="filter.timeType" :options="searchTimeOptions"></b-form-select>
      </b-col>
      <b-col>
        <label class="form-label">Chọn thời gian</label>
        <v-date-picker mode="range" v-model="filter.from" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Khoảng thời gian apply', style: 'color:darkgrey;' }"
        />
      </b-col>
      <b-col class="btn-group-search">
        <b-button class="ml-1" @click="clearFilter"><i class="fas fa-sync-alt"></i> Xóa lọc</b-button>
        <b-button class="mr-1 btn-center" variant="primary" @click="search">
          <i class="fas fa-search"></i> Tìm kiếm
        </b-button>
      </b-col>
    </b-row>
    <b-row class="row-wrapper">
      <div class="boxes table-header">
        <div>
          <b>Họ tên</b>
        </div>
        <div>
          <b>Thông tin nghỉ việc</b>
        </div>
        <div>
          <b>Số ĐT</b>
        </div>
        <div>
          <b>Trạng thái</b>
        </div>
        <div>
          <b>Thời gian ứng tuyển</b>
        </div>
        <div>
          <b>Thời gian phỏng vấn</b>
        </div>
        <div>
          <b>Thời gian nhận việc</b>
        </div>
        <div>
          <b>Thao tác</b>
        </div>
      </div>
    </b-row>
    <b-row v-for="(candidate, index) in list" :key="`candidate-${index}`">
      <div class="boxes">
        <div class="info">
          <span>{{ candidate.Candidate.name }}</span>
        </div>
        <div class="cell">
          <ShowQuitInfo :candidate="candidate" v-if="candidate.MasterProfile.resign_type"/>
          <p v-else>Không có thông tin</p>
        </div>
        <div class="cell">
          {{ candidate.Candidate.phone }}
        </div>
        <div class="cell">
          <CandidateStatus
            :candidate="candidate.ErpCandidateJob"
            :id="candidate.ErpCandidateJob.id"
            :disabled="candidate.ErpCandidateJob.status === 'taken'"
            @changeStatus="changeStatus"
          />
        </div>
        <div class="cell">
          {{ candidate.ErpCandidateJob.created  | dateFormated }}
        </div>
        <div class="cell">
          {{ candidate.ErpCandidateJob.interview_time | dateFormated }}
        </div>
        <div class="cell">
          {{ candidate.ErpCandidateJob.join_date | dateFormated }}
        </div>
        <div class="cell">
          <div v-if="candidate.ErpCandidateJob.status === 'taken'">
            <b-button variant="warning" size="sm" @click="showModalCreateUser(candidate.Candidate)">
              Tạo tài khoản
            </b-button>
          </div>
          <b-link :href="'/admin/manage-candidates/exportCvCandidate?id_candidate=' + candidate.Candidate.id" download class="btn btn-outline-primary btn-sm mt-2 w-5rem">
            <span class="font-xs">Xuất file CV</span>
          </b-link>
        </div>
      </div>
    </b-row>
    <b-row class="pagination">
      <b-pagination
        v-model="pagination.currentPage"
        :total-rows="pagination.total"
        :per-page="8"
        v-on:change="onPageChange"
        class="custom-pagination"
      ></b-pagination>
    </b-row>
    <ModalDriverxCreateUser :candidate="currentCandidate"/>
  </div>
</template>
<script>
import driverxService from 'domain/services/driverx-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import ModalDriverxCreateUser from 'components/pages/Candidate/ModalDriverxCreateUser'
import CandidateStatus from './CandidateStatus'
import ShowQuitInfo from './ShowQuitInfo'
import {candidateStatus, searchTimeOptions} from './config'

export default {
  components: {ModalDriverxCreateUser, CandidateStatus, ShowQuitInfo},
  data () {
    return {
      loading: true,
      pagination: {
        currentPage: 1,
        limit: 8,
        total: 0
      },
      list: [],
      filter: {
        code: null,
        name: null,
        from: null,
        status: null,
        timeType: null
      },
      currentCandidate: {},
      job: {},
      candidateStatus: candidateStatus,
      searchTimeOptions: searchTimeOptions
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      try {
        this.loading = true
        const {data} = await driverxService.getJobCandidates({
          jobId: this.$route.params.id,
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success) {
          this.list = data.list
          this.job = data.job
          this.pagination.total = data.total
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    showModalCreateUser (currentCandidate) {
      this.currentCandidate = currentCandidate
      this.$bvModal.show('modal-quick-create-user')
    },

    confirmChangeStatus (id, status) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn từ chối ứng viên này?', {
        title: 'Từ chối ứng viên',
        okVariant: 'danger',
        okTitle: 'Có',
        cancelTitle: 'Hủy',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(next => {
          if (next) this.changeStatus({id, status})
        })
        .catch(err => {
          console.log(err)
        })
    },

    async changeStatus ({id, status, note}) {
      try {
        this.loading = true
        const {data} = await driverxService.updateStatus({id, status, note})
        if (data.success) {
          let index = this.list.findIndex(job => job.ErpCandidateJob.id === id)
          this.list[index].ErpCandidateJob = data.job
          commonHelper.showMessage('Thành công', 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    genStatusBaged (status) {
      switch (status) {
        case 'new':
          return 'secondary'
        case 'taken':
          return 'primary'
        case 'rejected':
          return 'danger'
        case 'save_info':
          return 'info'
        case 'selected':
          return 'success'
        default:
          return 'success'
      }
    },
    async search () {
      this.resetPagination()
      this.getList()
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 10,
        total: 0
      }
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getList()
    },
    async clearFilter () {
      this.filter = {
        code: null,
        name: null,
        from: null,
        status: null,
        timeType: null
      }
      await this.resetPagination()
      this.getList()
    }
  },
  filters: {
    dateFormated (d) {
      return d ? moment(d).format('DD-MM-YYYY H:mm:ss') : 'Không có thông tin'
    },
    dateOnly (d) {
      return d ? moment(d).format('DD-MM-YYYY') : 'Không có thông tin'
    },
    JobStatus (s) {
      switch (s) {
        case 'new':
          return 'Chưa duyệt'
        case 'taken':
          return 'Đã nhận việc'
        case 'rejected':
          return 'Đã từ chối'
        case 'save_info':
          return 'Lưu thông tin'
        case 'selected':
          return 'Trúng tuyển'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search-bar-wrapper{
  align-items: flex-end;
}
.loading-wrapper{
  margin-top: 10%;
}
.pagination{
  margin-top: 20px;
}
.row-wrapper{
  margin-top: 5vh;
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
.boxes{
  padding: 1vh;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fff;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.avatar{
  width: 40px;
  height: auto;
  margin-right: 5px;
}
.info{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.table-header{
  padding-bottom: 2vh;
  border-bottom: 1px solid #dee2e6;
}
.cell{
  padding-top: 10px;
}
.job-name{
  font-size: 15px;
  font-weight:normal;
}
</style>
