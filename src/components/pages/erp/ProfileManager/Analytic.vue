<template>
  <div class="wrapper" v-loading="loading" v-if="userInfo.User">
    <div class="ui-block">
      <div class="top">
        <h4 class="ui-block-heading">Thống kê hồ sơ nhân sự</h4>
        <div>
          <router-link :to="{ name: 'profile-manager' }" class="blink">
            <b-button variant="outline-secondary" size="sm">
              Quay lại
            </b-button>
          </router-link>
        </div>
      </div>
      <hr>
    </div>
  <div class="mb-2">
    <b-row>
      <b-col md="4">
        <SingleSelectStation
          @handleSelectedStation="option => filter.station = option ? option.id : null"
          placeholder="Chọn kho"
          :reset="resetSelectStation"
          :stationId="filter.station || null"
        />
      </b-col>
      <b-col md="4">
          <b-form-input placeholder="CMND / Mã profile" v-model="filter.code"></b-form-input>
      </b-col>
      <b-col md="4">
          <b-form-input placeholder="Username / Họ tên" v-model="filter.name"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="row-custom">
      <b-col md="4">
        <SingleSelectPosition @handleSelectedPosition="option => filter.position = option ? option.id : null"
          :reset="resetSelectPosition"/>
      </b-col>
      <b-col md="4">
        <SingleSelectProvince @handleSelectedProvince="option => filter.province = option ? option.id : null"
          :reset="resetSelectProvince"/>
      </b-col>
    </b-row>
    <b-row class="row-custom row-last">
        <b-col md="8">
          <div class="analytic-bar">
            <div class="analytic-box">
              <b>Số lượng HS thiếu</b>
              <p><b-badge variant="secondary" class="custom-baged">{{ lackingDocs }}</b-badge></p>
            </div>
            <div class="analytic-box">
              <b>Tỷ lệ HS thiếu</b>
              <p>
                <b-badge variant="secondary" class="custom-baged">
                  {{ lackingDocs > 0 && totalDocs > 0 ? (lackingDocs / totalDocs * 100).toFixed(3) : 100 }} %
                </b-badge>
              </p>
            </div>
            <div class="analytic-box">
              <b>Số lượng nhân viên thiếu HS</b>
              <p><b-badge variant="warning" class="custom-baged">{{ userLackingDocs }}</b-badge></p>
            </div>
            <div class="analytic-box">
              <b>Tỷ lệ nhận viên thiếu HS</b>
              <p><b-badge variant="warning" class="custom-baged">{{ (userLackingDocs / pagination.total * 100).toFixed(3) }} %</b-badge></p>
            </div>
          </div>
        </b-col>
        <b-col md="4">
          <div class="custom-btn-group">
            <b-button variant="light" @click="clearFilter">
              <i class="ion ion-md-trash"></i> Xóa lọc
            </b-button>
            <b-button variant="success" class="custom-btn-filter" @click="search">
              <i class="sidenav-icon ion ion-md-search"></i>Tìm kiếm
            </b-button>
          </div>
        </b-col>
    </b-row>
  </div>
  <div class="main">
    <div class="list">
      <b-row class="line list-header">
        <div class="stt">
          <b>Mã MP</b>
        </div>
        <div>
          <b>Nhân viên</b>
        </div>
        <div>
          <b>Hồ sơ đã có</b>
        </div>
        <div>
          <b>Hồ sơ còn thiếu</b>
        </div>
        <!-- <div>
          <b>Hồ sơ quá hạn</b>
        </div> -->
      </b-row>
      <b-row class="line list-body" v-for="(item, index) in list" :key="`u${index}`">
        <div class="stt">
          {{ item.User.master_profile_id }}
        </div>
        <div>
          {{ item.User.fullname }}
        </div>
        <div>
          <span v-for="(doc, index) in item.docs" :key="`doc${index}`">
            <b-badge variant="success">{{ doc.ErpDocument.name }}</b-badge>&nbsp;
          </span>
        </div>
        <div>
          <span v-for="(lack, index) in item.lacking" :key="`lacking${index}`">
            <b-badge variant="secondary">{{ lack.ErpDocument.name }}</b-badge>&nbsp;
          </span>
        </div>
        <!-- <div>
          Giấy khám sức khỏe
        </div> -->
      </b-row>
    </div>
    <b-pagination
      v-if="!paginationLoading"
      v-model="pagination.currentPage"
      :total-rows="pagination.total"
      :per-page="12"
      v-on:change="onPageChange"
      class="custom-pagination"
    ></b-pagination>
    <div class="lds-ellipsis" v-else><div></div><div></div><div></div><div></div></div>
  </div>
  </div>
  <div v-else v-loading="loading"></div>
</template>
<script>

import Multiselect from 'vue-multiselect'
import DocumentUploadItem from './DocumentUploadItem'
import profileService from 'domain/services/profile-mamanger-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import { mapGetters } from 'vuex'

export default {
  components: {
    Multiselect,
    DocumentUploadItem,
    SingleSelectPosition,
    SingleSelectDocumentType,
    SingleSelectStation,
    SingleSelectProvince
  },
  computed: mapGetters({
    userInfo: 'userInfo'
  }),
  data () {
    return {
      loading: false,
      paginationLoading: false,
      list: [],
      pagination: {
        currentPage: 1,
        limit: 12,
        total: 0
      },
      userLackingDocs: 0,
      lackingDocs: 0,
      totalDocs: 0,
      filter: {
        code: null,
        name: null,
        province: null,
        station: null,
        position: null,
        status: null,
        from: null,
        to: null
      },
      statusOptions: [
        {
          value: 'Chưa duyệt',
          name: 'Chưa duyệt'
        },
        {
          value: 'Đã duyệt',
          name: 'Đã duyệt'
        },
        {
          value: 'Từ chối',
          name: 'Từ chối'
        }
      ],
      resetSelectProvince: false,
      resetSelectPosition: false,
      resetSelectStation: false
    }
  },
  mounted () {
    this.getList(this.userInfo.User ? this.userInfo.User.station_id : null)
  },
  methods: {
    async search () {
      this.resetPagination()
      this.getList()
    },
    async getList (stationId = null) {
      if (stationId) this.filter.station = stationId
      try {
        this.loading = true
        const {data} = await profileService.getAnalyticList({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        this.list = data.list
        this.userLackingDocs = data.userLackingDocs
        this.lackingDocs = data.lackingDocs
        this.totalDocs = data.totalDocs
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
    async clearFilter () {
      this.filter = {
        code: null,
        name: null,
        province: null,
        station: this.userInfo.User.station_id,
        position: null,
        document: null,
        status: null,
        from: null,
        to: null
      }
      this.resetSelectPosition = !this.resetSelectPosition
      this.resetSelectProvince = !this.resetSelectProvince
      this.resetSelectStation = !this.resetSelectStation
      await this.resetPagination()
      this.getList()
    },
    resetPagination () {
      this.pagination = {
        currentPage: 0,
        limit: 10,
        total: 0
      }
    }
  },
  watch: {
    'filter.province': function (v) {
      if (v) this.filter.station = null
    }
  }
}
</script>
<style scoped lang="scss">
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #28a745;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
.top {
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.row{
  &-custom{
    margin-top: 10px;
  }
  &-last {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }
}
.custom-btn{
  &-filter{
    margin-left: 5px;
    margin-right: 5px;
  }
  &-group{
    display: flex;
    justify-content: flex-end;
  }
}
.custom-pagination{
  margin-top: 2vh;
}
.main{
  margin-top: 2vh;
}

.row-last{
  display: flex;
  align-items: center;
}

.line{
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 2fr;
  padding-left: 5px;
}
.list{
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
  padding: 20px;
  &-header{
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 20px;
  }
  &-body{
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #dee2e6;
  }
}
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
