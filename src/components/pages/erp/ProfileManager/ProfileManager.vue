<template>
<div class="wrapper">
<!--  <h1>Màn này hiện đã đóng, vui lòng vào tag Hồ sơ trên màn Cần xử lý ở menu Quản lý công việc để tiếp tục thao tác!</h1>-->
  <b-row class="top align-items-center">
    <b-col md="4">
      <h4 class="m-0">Kiểm soát hồ sơ nhân sự</h4>
    </b-col>
    <b-col md="8" class="text-right">
      <b-button variant="ghtk" class="custom-btn-filter" @click="search">
        <i class="sidenav-icon ion ion-md-search"></i>Tìm kiếm
      </b-button>
      <b-button variant="ghtk" @click="clearFilter">
        <i class="ion ion-md-trash"></i> Xóa lọc
      </b-button>
      <b-button variant="ghtk" @click="openAddModal = true">
        <i class="ion ion-md-add"></i>Thêm hồ sơ
      </b-button>
      <router-link :to="{ name: 'config-type' }" class="blink">
        <b-button variant="ghtk">
          Cấu hình danh mục hồ sơ
        </b-button>
      </router-link>
      <router-link :to="{ name: 'config-position' }" class="blink">
        <b-button variant="ghtk">
          Cấu hình hồ sơ nhân sự
        </b-button>
      </router-link>
      <router-link :to="{ name: 'document-analytic' }" class="blink">
        <b-button variant="ghtk">
            Thống kê
        </b-button>
      </router-link>
    </b-col>
  </b-row>

  <div class="seperate-xs my-1"></div>

  <!-- filter  -->
  <div>
    <b-row class="mb-1">
      <b-col md="3">
          <b-form-input placeholder="CMND / Mã profile" v-model="filter.code"></b-form-input>
      </b-col>
      <b-col md="3">
          <b-form-input placeholder="Username / Họ tên" v-model="filter.name"></b-form-input>
      </b-col>
      <b-col md="3">
        <SingleSelectProvince @handleSelectedProvince="option => filter.province = option ? option.id : null"
          :reset="resetSelectProvince" custom-class=""/>
      </b-col>
      <b-col md="3">
        <SingleSelectPosition @handleSelectedPosition="option => filter.position = option ? option.id : null"
          :reset="resetSelectPosition"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="3">
        <SingleSelectStation
          @handleSelectedStation="option => filter.station = option ? option.id : null"
          placeholder="Chọn kho"
          :reset="resetSelectStation"
          custom-class=""
        />
      </b-col>
      <b-col md="3">
        <SingleSelectDocumentType
          @handleSelected="option => filter.document = option ? option.id : null"
          :reset="resetSelectDocument"
          />
      </b-col>
      <b-col md="3">
        <Multiselect
          v-model="filter.status"
          :options="statusOptions"
          placeholder="Trạng thái"
          label="name"
          track-by="id"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          <span class="placeholder" slot="placeholder">Trạng thái</span>
        </Multiselect>
      </b-col>
      <b-col md="3">
        <v-date-picker mode="range" v-model="filter.from" locale="vi"
          color="green"
          :input-props="{ placeholder: 'Khoảng thời gian upload', style: 'color:darkgrey;' }"
        />
      </b-col>
    </b-row>
  </div>
  <!-- content  -->
  <div>
    <!-- paging  -->
    <div class="mb-1 mt-3">
      <div class="z-0 d-inline-block">
        <b-pagination
          class="m-0 paginator-ghtk"
          size="sm"
          align="left"
          v-model="pagination.currentPage"
          :total-rows="pagination.total"
          :per-page="12"
          @change="onPageChange"
        >
        </b-pagination>
      </div>
      <b class="float-right">Trang {{ pagination.currentPage }}/{{ Math.ceil(pagination.total / 12) }}</b>
    </div>
    <!-- Document -->
    <b-row v-loading="loading" class="border border-secondary position-relative mih-10re m-0" :class="scrollMode && 'scroll-mode'">
      <DocumentUploadItem
        class="mb-3"
        v-for="(item, index) in list"
        :key="`upload-${index}`" :item="item"
        :permissons="permissons"
        @approve="approve"
        @remove="remove"
      />
    </b-row>
  </div>

  <!-- modal  -->
  <Upload
    :openModal="openAddModal"
    @done="createDocument"
    @updateOpen="updateOpenAddModal"
    :per-page="pagination.limit"
  />

  <b-modal static id="modal-conform-approve-document" hide-footer title="Xác nhận duyệt hồ sơ" @hiden="resetData">
    <div v-if="curDocument && +curDocument.ProfileDocument.document_id === +13 && dataUpdate.status">
      <b-form-group label-cols="4" label-cols-lg="3" label="Họ tên" label-for="input-default" disabled>
        <b-input id="input-default" class="rounded" v-model="curDocument.MasterProfile.fullname" disabled></b-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label="Hồ sơ" label-for="input-default" disabled>
        <b-input id="input-default" class="rounded" v-model="curDocument.ErpDocument.name" disabled></b-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label-for="input-default">
        <span slot="label">Số <span class="text-danger">*</span></span>
        <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.no_number"></b-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label-for="input-default">
        <span slot="label">Hạng bằng <span class="text-danger">*</span></span>
        <b-input id="input-default" class="rounded" v-model="dataUpdate.driverLicense.class"></b-input>
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label-for="input-default">
        <span slot="label">Ngày bắt đầu <span class="text-danger">*</span></span>
        <v-date-picker
          :popover="{visibility: 'focus'}"
          mode="date"
          v-model="dataUpdate.driverLicense.beginning_date"
          locale="vi"
          color="green"
          :input-props="{ placeholder: 'Ngày bắt đầu'}"
        />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label-for="input-default">
        <span slot="label">Ngày kết thúc</span>
        <v-date-picker
          :popover="{visibility: 'focus'}"
          mode="date"
          v-model="dataUpdate.driverLicense.expiry_date"
          locale="vi"
          color="green"
          :input-props="{ placeholder: 'Ngày kết thúc'}"
        />
      </b-form-group>
    </div>
    <div v-else>
      Bạn có chắc chắn muốn {{dataUpdate.status ? 'duyệt' : 'từ chối'}} hồ sơ
    </div>
    <div class="text-center mt-3">
      <button class="btn btn-ghtk rounded" @click="execApprove({id: curDocument.ProfileDocument.id, status: dataUpdate.status})">Xác nhận</button>
    </div>
  </b-modal>

</div>
</template>
<script>

import Multiselect from 'vue-multiselect'
import DocumentUploadItem from './DocumentUploadItem'
import Upload from './UploadDocument'

// service
import profileService from 'domain/services/profile-mamanger-service'
import driverLicenseService from 'domain/services/driver-license-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import AnalyticBar from './AnalyticBar'

export default {
  components: {
    Multiselect,
    DocumentUploadItem,
    Upload,
    SingleSelectPosition,
    SingleSelectDocumentType,
    SingleSelectStation,
    SingleSelectProvince,
    AnalyticBar
  },

  props: {
    scrollMode: {
      default: false,
      type: Boolean
    }
  },

  data () {
    return {
      loading: false,
      paginationLoading: false,
      openAddModal: false,
      list: [],
      pagination: {
        currentPage: 1,
        limit: 12,
        total: 0
      },
      filter: {
        code: null,
        name: null,
        province: null,
        station: null,
        position: null,
        document: null,
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
      resetSelectDocument: false,
      resetSelectProvince: false,
      resetSelectPosition: false,
      resetSelectStation: false,
      curDocument: null,
      dataUpdate: {
        status: true,
        driverLicense: {
          no_number: null,
          class: null,
          beginning_date: null,
          expiry_date: null
        }
      },
      permissons: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    resetData () {
      this.curDocument = null
      commonHelper.resetData(this.dataUpdate, 2)
    },
    async search () {
      this.resetPagination()
      this.getList()
    },
    async getList () {
      try {
        this.loading = true
        const {data} = await profileService.getDocuments({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success) {
          this.list = data.data.list
          this.permissons = data.data.permissons
          this.getCount()
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async getCount () {
      try {
        this.paginationLoading = true
        const {data} = await profileService.getDocuments({
          ...this.filter,
          isCount: true
        })
        this.pagination.total = data.data.total
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.paginationLoading = false
      }
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getList()
    },
    updateOpenAddModal (v) {
      this.openAddModal = v
    },
    async createDocument (formData) {
      try {
        this.loading = true
        const {data} = await profileService.createDocument(formData)
        if (data.success) {
          commonHelper.showMessage('Thêm hồ sơ thành công', 'success')
          this.list = data.data.list
          this.openAddModal = false
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },

    approve (doc) {
      this.curDocument = doc.doc
      this.dataUpdate.status = doc.status
      // lấy thông tin bằng lái xen nếu có
      if (+doc.doc.ProfileDocument.document_id === 13) {
        this.getDriverLiense(doc.doc.ProfileDocument.master_profile_id)
      }
      this.$bvModal.show('modal-conform-approve-document')
    },

    async execApprove ({id, status}) {
      try {
        this.loading = true
        const {data} = await profileService.approveDocument({
          info: {id, status},
          dataUpdate: this.dataUpdate,
          query: {
            page: this.pagination.currentPage,
            limit: this.pagination.limit,
            ...this.filter
          }
        })
        if (data.success) {
          commonHelper.showMessage('Duyệt hồ sơ thành công', 'success')
          this.list = data.data.list
          this.pagination.total = data.data.total
          this.$bvModal.hide('modal-conform-approve-document')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async clearFilter () {
      this.filter = {
        code: null,
        name: null,
        province: null,
        station: null,
        position: null,
        document: null,
        status: null,
        from: null,
        to: null
      }
      this.resetSelectDocument = !this.resetSelectDocument
      this.resetSelectProvince = !this.resetSelectProvince
      this.resetSelectPosition = !this.resetSelectPosition
      this.resetSelectStation = !this.resetSelectStation
      await this.resetPagination()
      this.getList()
    },
    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 12,
        total: 0
      }
    },
    remove (id) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn xóa hồ sơ này?', {
        title: 'Xóa hồ sơ',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) {
            this.execRemove(id)
            this.getCount()
          }
        })
        .catch(_ => {})
    },

    getDriverLiense (masterProfileId) {
      this.$startLoading()
      driverLicenseService.getDriverLicenseOfProfile({master_profile_id: masterProfileId})
        .then(res => {
          if (res.data.success) {
            this.dataUpdate.driverLicense.no_number = res.data.data.no_number
            this.dataUpdate.driverLicense.class = res.data.data.class
            this.dataUpdate.driverLicense.expiry_date = res.data.data.expiry_date ? new Date(res.data.data.expiry_date) : null
            this.dataUpdate.driverLicense.beginning_date = res.data.data.beginning_date ? new Date(res.data.data.beginning_date) : null
          } else {
            commonHelper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin bằng lái xe !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    async execRemove (id) {
      try {
        this.loading = true
        const {data} = await profileService.removeDocument({
          id,
          query: {
            page: this.pagination.currentPage,
            limit: this.pagination.limit,
            ...this.filter
          }
        })

        if (data.success) {
          commonHelper.showMessage('Xóa hồ sơ thành công', 'success')
          this.list = data.data.list
          this.pagination.total = data.data.total
        } else commonHelper.showMessage(data.message, 'warning')
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
.scroll-mode {
  max-height: 65vh;
  overflow: auto;
}
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
</style>
