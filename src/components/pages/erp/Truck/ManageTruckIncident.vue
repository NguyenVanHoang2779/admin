<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Quản lý sự vụ xe tải
            </h4>
            <hr>
            <div class="mb-2">
                <b-row class="h-col-50">
                    <b-col md="3">
                      <v-date-picker
                        mode="range"
                        v-model="dateFilter"
                        locale="vi"
                        color="green"
                        :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'font-size:14px; line-height: unset' }"
                        @input="searchTruckIncident(null)"
                      />
                    </b-col>
                    <b-col md="3">
                      <router-link :to="{name: 'add-incident'}" class="btn btn-success"><i class="ion ion-ios-add"></i> Thêm mới</router-link>
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="mb-3">
            <div class="wrapper-list-master" v-loading="appLoading">
                <b-card no-body v-if="listIncidents.length > 0">
                    <table class="table mb-0 table-hover">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày tai nạn</th>
                            <th>Địa điểm tai nạn</th>
                            <th>Username tài xế</th>
                            <th>Số điện thoại tài xế</th>
                            <th>Mức độ hư hỏng xe</th>
                            <th>Tình trạng sửa chữa xe</th>
                            <th>Phiếu sửa chữa</th>
                            <th>Chi phí sửa chữa</th>
                            <th>Cập nhật</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in listIncidents">
                            <td>{{item.id}}</td>
                            <td>{{item.accident_day}}</td>
                            <td>{{item.accident_site}}</td>
                            <td>{{item.username_driver}}</td>
                            <td>{{item.tel}}</td>
                            <td>{{checkLevelDamage(item.level_damage)}}</td>
                            <td>{{checkStatusRepair(item.status_repair)}}</td>
                            <td v-if="item.image"><a @click="onViewImage(item, index)">Xem ảnh</a></td>
                            <td v-else></td>
                            <td>{{item.fee}}</td>
                            <td>
                              <div class="mb-2">
                                <b-btn size="sm" variant="default" class="mr-2" :to="{name: 'edit-incident', params: { id: item.id }}" :target="'_blank'"><span class="ion ion-md-create"></span>&nbsp;&nbsp;Sửa</b-btn>
                                <b-btn size="sm" variant="default" @click="deleteTruckIncident(item)"><span class="ion ion-ios-remove-circle-outline"></span>&nbsp;&nbsp;Xóa</b-btn>
                              </div>
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
                                        v-on:input="getAllTruck()"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
                <div v-if="appLoading === false && listIncidents.length === 0">
                    <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy sự vụ nào!</span>
                </div>
            </div>
          <!-- popup xem ảnh sửa chữa -->
          <b-modal class="vertical-align-modal" ref="image-incident-modal" id="viewIncidentModal" static>
            <template slot="modal-title">
              <div><span>PHIẾU SỬA CHỮA</span></div>
            </template>
            <div class="position-relative" v-loading="loading">
              <div class="row">
                <div class="col-md-2" v-for="(item) in curImage.listImage">
                  <a class="text-dark" :href="item"><img :src="item" alt="avatar" height="100" width="100" style="padding-right: 30px;"></a>
                </div>
              </div>
            </div>
            <br/>
            <span><b>Lưu ý:</b> Click vào từng ảnh để phóng to ảnh muốn xem</span>
            <div slot="modal-footer"  class="w-100 text-center">
              <b-button size="md" variant="primary" @click="changeStatus()">
                Đồng ý
              </b-button>
            </div>
          </b-modal>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Candidate from 'domain/entities/Candidate'
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Vue from 'vue'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'ManageTruckIncident',
  components: {
    Candidate
  },
  data: () => ({
    listIncidents: [],
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    filter: {
      start_date: null,
      end_date: null
    },
    curImage: {
      idx: null,
      listImage: []
    },
    appLoading: false,
    moment: moment,
    totalItemsLog: 0,
    currentPageLog: 1,
    perPageLog: 10,
    timeSearch: '',
    dateFilter: null
  }),
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    },
    totalPageLog () {
      return Math.ceil(this.totalItemsLog / this.perPageLog)
    }
  },

  watch: {
    dateFilter (newVal, oldVal) {
      if (newVal) {
        if (newVal.start) {
          this.filter.start_date = moment(newVal.start).format('YYYY-MM-DD')
        } else this.filter.start_date = null
        if (newVal.end) {
          this.filter.end_date = moment(newVal.end).format('YYYY-MM-DD')
        } else this.filter.end_date = null
      } else {
        this.filter.start_date = null
        this.filter.end_date = null
      }
    }
  },

  created () {
    this.getAllTruckIncident(this.filter)
  },

  methods: {
    resetTime () {
      this.timeSearch = ''
    },
    searchTruckIncident (resetStatus = null) {
      this.currentPage = 1
      this.getAllTruckIncident(this.filter)
    },
    getAllTruckIncident (reqParams) {
      this.$startLoading()
      CompanyProfileService.getAllTruckIncident(reqParams)
        .then(res => {
          if (res.data.success) {
            this.listIncidents = res.data.data
            this.totalItems = res.data.count
          }
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra hoặc bạn không có quyền thao tác', 'warn')
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    checkLevelDamage: function (val) {
      if (val === 'light') {
        return 'Nhẹ'
      }
      if (val === 'relatively') {
        return 'Tương đối'
      }
      if (val === 'heavy') {
        return 'Nặng'
      }
    },

    checkStatusRepair: function (val) {
      if (val === 'fixed') {
        return 'Đã sửa xong'
      }
      if (val === 'repairing') {
        return 'Đang sửa chữa'
      }
    },

    deleteTruckIncident: function (incident) {
      if (!confirm(`Bạn có chắc chắn muốn xóa sự vụ xe tải này ?`)) {
        return
      }
      let dataSend = {
        'incidentId': incident.id
      }
      CompanyProfileService.deleteTruckIncident(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getAllTruckIncident()
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
            text: 'Có lỗi xảy ra trong quá trình dừng hoạt động của xe.'
          })
        })
        .finally(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    reset: function () {
      this.dateFilter = null
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = null
      })
      this.searchTruckIncident(this.filter)
    },

    onViewImage (item, index) {
      if (item.image !== null || item.image !== 'undefined') {
        this.curImage.idx = index
        this.curImage.listImage = item.image.split(',')
        this.$refs['image-incident-modal'].show()
      }
    }
  }
}
</script>

<style scoped>
  .upload-file {
    text-align: center;
    padding-top: 1.3rem;
    width: 100%;
    height: 4rem;
    border: 1px #c5c5c5;
    border-style: dashed;
  }
  .upload-file:hover {
    background-color: #b6e6b6;
    border: 1px #c5c5c5;
    border-style: dashed;
  }
  .table td {
      vertical-align: middle;
  }
  .only-bottom-border{
      border-top: none;
      border-left: none;
      border-right: none;
  }
</style>

<style>
.vc-text-base {
  font-size: inherit;
}
</style>
