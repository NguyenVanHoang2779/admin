<template>
  <div class="table-responsive">
    <div class="search-driver">
      <div class="row">
        <div class="col-2">
          <multiselect
            placeholder="Nhập tên tài xế"
            v-model="filter.fullname"
            :options="fullNameOptions"
            label="text"
            track-by="text"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :searchable="true"
            :clear-on-select="false"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </multiselect>
        </div>
        <div class="col-2">
          <multiselect
                       placeholder="Nhập CCCD/CMT"
                       v-model="filter.personal_id_number"
                       :options="idNumberOptions"
                       label="text"
                       track-by="value"
                       selectedLabel="Đã chọn"
                       deselectLabel="Bỏ chọn"
                       selectLabel="Chọn"
                       :searchable="true"
                       :clear-on-select="false"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </multiselect>
        </div>
        <div class="col-2">
          <multiselect
                       placeholder="Nhập SĐT"
                       v-model="filter.tel"
                       :options="telOptions"
                       label="text"
                       track-by="text"
                       selectedLabel="Đã chọn"
                       deselectLabel="Bỏ chọn"
                       selectLabel="Chọn"
                       :searchable="true"
                       :clear-on-select="false"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </multiselect>
        </div>
        <div class="col-2">
          <b-form-select v-model="filter.selectStatus" :options="statusOptions"></b-form-select>
        </div>
        <div class="col-4">
          <button class="btn btn-success" @click="getListRentDrivers(1)">Tìm kiếm</button>
        </div>
      </div>
    </div>
    <table class="table b-table table-striped table-hover tb-driver" aria-rowcount="100" v-loading="isLoading">
      <thead class="">
        <tr>
          <th aria-colindex="4">Họ và tên</th>
          <th aria-colindex="4">Số CCCD/CMT</th>
          <th aria-colindex="4">SĐT</th>
          <th aria-colindex="2">Ảnh chân dung</th>
          <th aria-colindex="4">Ảnh CCCD/CMT</th>
          <th aria-colindex="2">Trạng thái</th>
          <th aria-colindex="2">Thao tác</th>
        </tr>
      </thead>
      <tbody v-if="listPlansData && listPlansData.length > 0">
        <tr v-for="(res, index) in listPlansData" :key="index">
          <td>{{ res.full_name }}</td>
          <td>{{ res.personal_id_number }}</td>
          <td>{{ res.tel }}</td>
          <td v-if="res.avatar_personal"><b-link @click="showMaintenanceDoc(res.avatar_personal, res.id)"><img v-bind:src="res.avatar_personal" alt=""></b-link></td>
          <td v-else class="los-img">Thiếu ảnh</td>
          <td>
            <b-link v-if="res.before_avatar_personal" @click="showMaintenanceDoc(res.before_avatar_personal, res.id)"><img v-bind:src="res.before_avatar_personal" alt=""></b-link>
            <span v-else class="los-img">Thiếu ảnh</span>
            <b-link v-if="res.after_avatar_personal" @click="showMaintenanceDoc(res.after_avatar_personal, res.id)"><img v-bind:src="res.after_avatar_personal" alt=""></b-link>
            <span v-else class="los-img">Thiếu ảnh</span>
          </td>
          <td class="">
            <b-form-select v-model="res.status" :options="statusOptions" @change="changeStatusRentDriver($event, res)"></b-form-select>
          </td>
          <td class="text-center">
            <router-link :to="{name: 'edit-truck-driver', params: { id: res.id }, query: {'profile_id': profileId}}" class="btn btn-sm btn-outline-success"><i class="fa fas fa-edit"></i></router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <b-pagination
      v-if="totalItems"
      v-model="currentPage"
      :total-rows="totalItems"
      :per-page="perPage"
      aria-controls="my-table"
      @input="getListRentDrivers(currentPage)"
    ></b-pagination>
    <modal-view-documents :notFound="viewDoc.notFound" :trigger="viewDoc.trigger" :files="viewDoc.files" :title="viewDoc.title"></modal-view-documents>
  </div>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import Viewer from 'v-viewer'
import Vue from 'vue'
import moment from 'moment'
import ModalViewDocuments from 'components/elements/common/ModalViewDocuments'

Vue.use(Viewer)

export default {
  name: 'rent-list-driver',

  components: {
    Multiselect,
    ModalViewDocuments
  },

  props: ['profileId', 'isFresh'],

  data: () => ({
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    listPlans: [],
    listPlansData: [],
    isLoading: false,
    filter: {
      fullname: '',
      personal_id_number: '',
      tel: '',
      selectStatus: ''
    },
    routerOptions: [],
    codeOptions: [],
    fullNameOptions: [],
    idNumberOptions: [],
    telOptions: [],
    viewDoc: {
      trigger: false,
      notFound: false,
      files: [],
      title: 'Chi tiết tài liệu'
    },
    statusOptions: [
      { value: '', text: 'Trạng thái nhân sự' },
      { value: 1, text: 'Chờ duyệt' },
      { value: 2, text: 'Đang hoạt động' },
      { value: 3, text: 'Dừng hoạt động' },
      { value: 4, text: 'Sa thải' }
    ]
  }),

  computed: {

  },

  watch: {
    listPlans: function (newVal, oldVal) {
      this.listPlansData = JSON.parse(JSON.stringify(newVal))
    },
    profileId: function (newVal, oldVal) {
    },
    isFresh: function (newVal, oldVal) {
      this.getListRentDrivers(this.currentPage)
    }
  },

  created () {
    this.getListRentDrivers(1)
  },

  methods: {
    moment (data) {
      return moment(data)
    },
    getListRentDrivers: function (currentPage) {
      this.$startLoading()
      this.isLoading = true
      let dataRequest = {
        id: this.profileId,
        page: currentPage,
        limit: this.perPage,
        full_name: this.filter.fullname ? this.filter.fullname.value : '',
        personal_id_number: this.filter.personal_id_number ? this.filter.personal_id_number.value : '',
        tel: this.filter.tel ? this.filter.tel.value : '',
        status: this.filter.selectStatus ? this.filter.selectStatus : ''
      }
      CompanyProfileService.getListRentDrivers(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.listPlans = res.data.data.data
            this.totalItems = res.data.data.total
            this.getRentDriverByProfileId()
          } else {
            this.listPlans = []
          }
        })
        .catch((e) => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu', 'warning')
        }).then(() => {
          this.isLoading = false
          this.$stopLoading()
        })
    },
    clearFilter () {
      this.filter = {
        fullname: '',
        personal_id_number: '',
        tel: '',
        selectStatus: ''
      }
    },
    getRentDriverByProfileId () {
      this.$startLoading()
      let dataRequest = {
        profile_id: this.profileId
      }
      CompanyProfileService.getRentDriverByProfileId(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.fullNameOptions = res.data.data.name ? res.data.data.name : []
            this.idNumberOptions = res.data.data.idNumber ? res.data.data.idNumber : []
            this.telOptions = res.data.data.tel ? res.data.data.tel : []
          } else {
            this.fullNameOptions = []
            this.idNumberOptions = []
            this.telOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    showMaintenanceDoc (documents, id) {
      this.viewDoc.files = [{'id': id, 'type': 'image/jpeg', 'name': '', 'link_file': documents}] || []
      this.viewDoc.trigger = !this.viewDoc.trigger
      this.viewDoc.notFound = true
    },
    changeStatusRentDriver: function (value, plan) {
      if (!confirm(`Bạn chắc chắn muốn thay đổi trạng thái nhân sự này?`)) {
        return
      }
      let dataSend = {
        'id': plan.id,
        'status': plan.status
      }
      CompanyProfileService.changeStatusRentDriver(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getListRentDrivers(this.currentPage)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình thay đổi trạng thái xe thuê.'
          })
        })
    }
  }
}
</script>

<style scoped>
.search-driver {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}
.tb-driver img {
  width: 86px;
  height: 53px;
}
.tb-driver .los-img {
  color: #EA0505;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
}
</style>
