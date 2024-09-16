<template>
    <div>
        <div class="ui-block">
            <b-row>
                <b-col style="padding-top: 0.5em">
                    <h4 class="ui-block-heading">Quản lý profile chính của công ty</h4>
                </b-col>
                <b-col class="text-right">
                    <b-btn variant="success" v-b-modal.modal-add-profile>+ Tạo mới profile công ty</b-btn>
                    <modal-add-profile @getListCompanyProfile="search"></modal-add-profile>
                </b-col>
            </b-row>
        </div>
        <div class="mb-2">
            <b-row class="h-col-50">
                <b-col md="2">
                    <input placeholder="Mã số thuế" v-model="taxIdenNumber" type="text" min="9" max="12" class="form-control"/>
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Tên công ty, mã công ty" v-model="keyword"  @keyup.enter="searchProfile" class="form-control" />
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Nhập biển số xe quản lý" v-model="code"  @keyup.enter="searchProfile" class="form-control" />
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="Nhập username công ty" v-model="usernameCompany"  @keyup.enter="searchProfile" class="form-control" />
                </b-col>
                <b-col md="2">
                    <b-form-select v-model="companyType" :options="companyOptions"></b-form-select>
                </b-col>
                <b-col md="2">
                    <single-select-profile-region @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col md="2" class="mb-2">
                    <b-form-select v-model="status" :options="statusOptions"></b-form-select>
                </b-col>
                <b-col md="2" class="mb-2">
                    <b-form-select v-model="range_time_filter" :options="range_time_filter_options"></b-form-select>
                </b-col>
                <b-col md="2" class="mb-2">
                    <flat-pickr v-model="range_time" :config="rangeConfig" placeholder="Chọn khoảng thời gian" />
                </b-col>
                <b-col md="6" class="text-right">
                    <b-btn type="button" variant="primary" @click="searchProfile()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                </b-col>
            </b-row>
        </div>

        <div class="mb-3">
            <div class="wrapper-list-master" v-loading="appLoading">
                <b-card no-body v-if="profiles.length > 0">
                    <table class="table mb-0 table-hover table-bordered">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Loại đối tác</th>
                            <th>Tên công ty</th>
                            <th>Mã công ty</th>
                            <th>Mã số thuế</th>
                            <th>Khu vực</th>
                            <th>Ngày bắt đầu hợp tác</th>
                            <th>Số xe chưa kiểm duyệt</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(profile, index) in profiles">
                            <td>{{index + currentPage*10 -9}}</td>
                            <td>{{profile.organization_type}}</td>
                            <td>
                                <img v-if="profile.image_logo" :src="profile.image_logo" width="35" height="35" style="border-radius: 50%;" alt="avatar" class="img-circle"/>
                                &nbsp;&nbsp; {{profile.fullname}}
                            </td>
                            <td>{{profile.organization_code}}</td>
                            <td>{{profile.tax_iden_number}}</td>
                            <td>{{profile.region}}</td>
                            <td>{{profile.cooperate_date}}</td>
                            <td><a :href="'/adm/profile-company/master-company/edit/' + profile.id" class="count-truck" target="_blank">{{ profile.truck_not_approve }}</a></td>
                            <td><span :class="getStatusClass(profile.status)">{{ getStatusName(profile.status) }}</span></td>
                            <td>
<!--                                <b-btn class="btn btn-md btn-outline-info" @click="companyProfileId = profile.id"><i class="ion ion-md-eye"></i></b-btn>-->
                                <router-link :to="{name: 'edit-master-profile-company', params: { id: profile.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
<!--                                <b-btn class="btn btn-md btn-outline-danger" @click="deleteProfile(profile)"><i class="ion ion-md-trash"></i></b-btn>-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="mt-3" v-if="totalPages > 1">
                        <b-row>
                            <b-col md="6">
                                <b-pagination
                                        :total-rows="totalItems"
                                        v-model="currentPage"
                                        :per-page="perPage"
                                        v-on:input="search"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
                <div v-if="appLoading === false && profiles.length === 0 && firstTime === false">
                    <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy profile phù hợp.</span>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss">
    .wrapper-list-master {
        position: relative;
        min-height: 120px;
    }
    .h-col-50 .col-md-2 {
        max-height: 50px;
    }
    .exporting-btn {
        span {
            position: relative; padding-left: 20px
        }
        .sk-folding-cube.sk-primary{
            position: absolute; height: 12px; width: 12px; top: -37px; left: 0
        }
    }
    .count-truck {
      color: #195BBF !important;
      text-decoration: underline !important;
    }
</style>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import MasterCompanyProfile from 'domain/entities/MasterCompanyProfile'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import ModalAddProfile from './ModalAddProfile'
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'

export default {
  name: 'manager-master-company-profile',
  components: {
    SingleSelectProfileRegion,
    SingleSelectProvince,
    ModalAddProfile,
    flatPickr
  },

  data: () => ({
    taxIdenNumber: '',
    keyword: '',
    code: '',
    usernameCompany: '',
    region: '',
    companyProfileId: '',
    companyType: '',
    profiles: [],
    appLoading: false,
    firstTime: true,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    status: '',
    checked: '',
    statusOptions: MasterCompanyProfile.getStatusOptions(),
    companyOptions: [
      { value: '', text: 'Loại công ty' },
      { value: 1, text: 'Vận tải đường bộ' },
      { value: 2, text: 'Vận tải đường sắt' },
      { value: 3, text: 'Vận tải hàng không' },
      { value: 4, text: 'Vận tải đường thủy' },
      { value: 5, text: 'Shop' }
    ],
    checkedOptions: [
      { value: '', text: 'Trạng thái xác nhận hồ sơ' },
      { value: 1, text: 'Đã xác nhận' },
      { value: 2, text: 'Đã có thông tin' },
      { value: 0, text: 'Chưa có thông tin' }
    ],

    range_time_filter: null,
    range_time: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    range_time_filter_options: [
      {value: null, text: 'Options áp dụng time'},
      {value: 'cooperate_date', text: 'Ngày bắt đầu hợp tác'},
      {value: 'terminate_date', text: 'Ngày chấm dứt hợp tác'}
    ],

    toggleExportModalShow: false,
    URLExportedFile: '#',
    exportRight: false,
    exporting: false,
    exported: false,
    exportTitles: [],
    downloaded: true,
    statusToQlts: 0
  }),

  created () {
    this.getStatusCompanyProfileToQlts()
    this.search()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
  },

  methods: {
    searchProfile () {
      this.currentPage = 1
      this.search()
    },

    getStartEndFromTimeRange () {
      if (!this.range_time) return {}
      let range = this.range_time.split('to').map(item => item.trim())
      if (range.length === 2) {
        return ({
          startTime: moment(range[0], 'DD-MM-YYYY').format('YYYY-MM-DD'),
          endTime: moment(range[1], 'DD-MM-YYYY').format('YYYY-MM-DD')
        })
      }
    },

    search () {
      this.appLoading = true
      let timeRange = this.getStartEndFromTimeRange()
      let params = {
        taxIdenNumber: this.taxIdenNumber,
        keyword: this.keyword,
        code: this.code,
        usernameCompany: this.usernameCompany,
        companyType: this.companyType,
        region: this.region,
        status: this.status,
        checked: this.checked,
        timeFilterType: this.range_time_filter,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
        page: this.currentPage,
        limit: this.perPage
      }
      CompanyProfileService.getCompanyProfileList(params)
        .then(res => {
          if (res.data.success) {
            this.profiles = res.data.data.data
            this.totalItems = res.data.data.total
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
      this.firstTime = false
    },
    handleSelectedRegion (option) {
      this.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    },

    getBriefStatusName (briefStatus) {
      return MasterCompanyProfile.getBriefStatusName(briefStatus)
    },

    getBriefStatusClass (briefStatus) {
      return MasterCompanyProfile.getBriefStatusClass(briefStatus)
    },

    getStatusName (status) {
      return MasterCompanyProfile.getStatusName(status)
    },

    getStatusClass (status) {
      return MasterCompanyProfile.getStatusClass(status)
    },

    getStatusCompanyProfileToQlts () {
      let params = {}
      CompanyProfileService.getStatusCompanyProfileToQlts(params)
        .then(res => {
          if (res.data.success) {
            this.statusToQlts = res.data.data.data
            if (this.statusToQlts === 1) {
              window.location.href = '/adm/error/404'
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    }

    // deleteProfile (profile) {
    //   if (!confirm(`Bạn có chắc chắn muốn xóa profile ${profile.fullname} ?`)) {
    //     return
    //   }
    //
    //   this.$startLoading()
    //   CompanyProfileService.deleteProfile(profile.id)
    //     .then(res => {
    //       if (res.data.success) {
    //         this.$notify({
    //           group: 'default',
    //           type: 'bg-success text-white',
    //           title: 'Thông báo',
    //           text: 'Xóa profile thành công!'
    //         })
    //         this.search()
    //       } else {
    //         this.$notify({
    //           group: 'default',
    //           type: 'bg-warning text-dark',
    //           title: 'Thông báo',
    //           text: res.data.message
    //         })
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e)
    //       this.$notify({
    //         group: 'default',
    //         type: 'bg-warning text-dark',
    //         title: 'Thông báo',
    //         text: 'Có lỗi xảy ra trong quá trình xóa profile.'
    //       })
    //     })
    //     .then(() => {
    //       this.appLoading = false
    //       this.$stopLoading()
    //     })
    // }
  }
}
</script>
