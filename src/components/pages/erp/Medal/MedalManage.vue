<template>
    <div class="medal-manage">
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Quản lý danh hiệu</h4>
<!--            <b-btn variant="primary" class="float-right">Config danh hiệu</b-btn>-->
        </div>
        <div class="mt-2">
            <b-row>
                <b-col md="2" class="mb-2">
                    <input type="text" placeholder="CMND/Mã profile" v-model="staff_code" class="form-control" />
                </b-col>
                <b-col md="2">
                    <input type="text" placeholder="username, Họ tên" v-model="keyword" class="form-control" />
                </b-col>
                <b-col md="2">
                    <multi-select-region  @handleSelectedRegion="handleSelectedRegion"></multi-select-region>
                </b-col>
                <b-col md="2">
                    <single-select-province :custom-class="''" :provinceId="provinceId" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                </b-col>
                <b-col md="2">
                    <single-select-station  :custom-class="''" @handleSelectedStation="handleSelectedStation"></single-select-station>
                </b-col>
                <b-col md="2">
                    <multi-select-department :department-ids="departmentIds" @handleDepartmentSelected="handleDepartmentSelected"></multi-select-department>
                </b-col>
                <b-col md="2" class="mb-2">
                    <multi-select-position :position-ids="positionIds" @handlePositionSelected="handlePositionSelected" :department-ids="departmentIds"></multi-select-position>
                </b-col>
                <b-col md="2">
                    <single-select-medal @handleSelected="handleSelectedMedal"></single-select-medal>
                </b-col>
                <b-col md="2" class="md-2">
                    <datepicker
                            v-model="from"
                            format="dd-MM-yyyy"
                            :bootstrapStyling="true"
                            :monday-first="true"
                            :full-month-name="true"
                            placeholder="Thời gian bắt đầu"
                            :required="true"
                            :calendar-button="true"
                            calendar-button-icon="ion ion-md-calendar"
                            :clear-button="true"
                    />
                </b-col>
                <b-col md="2" class="md-2">
                    <datepicker
                            v-model="to"
                            format="dd-MM-yyyy"
                            :bootstrapStyling="true"
                            :monday-first="true"
                            :full-month-name="true"
                            placeholder="Thời gian kết thúc"
                            :required="true"
                            :calendar-button="true"
                            calendar-button-icon="ion ion-md-calendar"
                            :clear-button="true"
                    />
                </b-col>
                <b-col md="4" class="text-right">
                    <b-btn variant="success" @click="search()">Tìm kiếm</b-btn>
                    <b-btn variant="primary"  v-b-modal.modal-add-user>+ Thêm</b-btn>
                </b-col>
            </b-row>
        </div>
        <div>
            <div class="mb-3">
                <div class="wrapper-list-shop-vote" v-loading="isLoadingConfig">
                    <div v-if="listMedals.length > 0">
                        <table class="table table-hover table-bordered table-vertical">
                            <thead class="thead-dark">
                            <th>Mã nhân viên</th>
                            <th>Họ và tên</th>
                            <th>Username</th>
                            <th>Vị trí</th>
                            <th>Kho</th>
                            <th>Danh hiệu</th>
                            <th>Chi tiết danh hiệu</th>
                            <th>Trạng thái</th>
                            <th>Thời gian bắt đầu danh hiệu</th>
                            <th>Thời gian kết thúc danh hiệu</th>
                            <th>Thao tác</th>
                            </thead>
                            <tbody>
                            <tr  v-for="(medal, index) in listMedals" :key="index">
                            <td>{{ medal.staff_code }}</td>
                            <td>{{ medal.fullname }}</td>
                            <td>{{ medal.username }}</td>
                            <td>{{ medal.position }}</td>
                            <td>{{ medal.station }}</td>
                            <td>{{ medal.name }}</td>
                            <td>{{ medal.description }}</td>
                            <td>
                                <b-badge variant="success" v-if="medal.status === 'active'">Đang hiệu lực</b-badge>
                                <b-badge variant="secondary" v-if="medal.status === 'disable'">Hết hiệu lực</b-badge>
                            </td>
                            <td>{{ formatDate(medal.from) }}</td>
                            <td>{{ formatDate(medal.to) }}</td>
                            <td>
                                <b-btn variant="danger" size="sm" @click="deleteMedal(medal.id)">Xóa</b-btn>
                            </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        Không tìm thấy nhân viên nào được gán danh hiệu
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-3" v-if="totalPages > 0">
            <b-row>
                <b-col md="6">
                    <b-pagination
                            :total-rows="totalItems"
                            v-model="currentPage"
                            :per-page="perPage"
                            v-on:input="getMedals"
                    />
                </b-col>
                <b-col md="6">
                    <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                </b-col>
            </b-row>
        </div>
        <modal-add-user @getMedals="search()"></modal-add-user>
    </div>
</template>

<script>
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import ModalAddUser from './ModalAddUser'
import SingleSelectMedal from 'components/elements/common/SingleSelectMedal'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
// service
import medalService from 'domain/services/medal-service'

export default {
  name: 'medal-manage',
  components: {
    MultiSelectRegion,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectMedal,
    MultiSelectDepartment,
    MultiSelectPosition,
    ModalAddUser,
    Datepicker
  },
  data: () => ({
    staff_code: null,
    keyword: null,
    region: null,
    provinceId: null,
    stationId: null,
    departmentIds: '',
    positionIds: '',
    from: null,
    to: null,
    isLoadingConfig: false,
    listMedals: [],
    medalId: null,
    currentPage: 1,
    totalItems: 0,
    perPage: 10
  }),

  created () {
    this.getMedals()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {},

  methods: {
    search () {
      this.currentPage = 1
      this.getMedals()
    },

    formatDate (date, format) {
      return commonHelper.formatDate(date, format)
    },
    formatMedal (medal) {
      switch (medal) {
        case 'ambassador':
          return 'Đại sứ'
        case 'trust':
          return 'Tín nhiệm'
        case 'love':
          return 'Thả tim'
        default:
          return ''
      }
    },
    deleteMedal (id) {
      if (!confirm(`Bạn có chắc chắn muốn xóa danh hiệu`)) {
        return
      }
      let data = {
        id: id
      }
      medalService.deleteProfileMedal(data)
        .then(response => {
          if (response.data.success) {
            this.search()
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    getMedals () {
      this.isLoadingConfig = true
      let param = {
        page: this.currentPage,
        limit: this.perPage,
        keyword: this.keyword,
        staff_code: this.staff_code,
        region: this.region,
        provinceId: this.provinceId,
        stationId: this.stationId,
        departmentIds: this.departmentIds,
        positionIds: this.positionIds,
        medal_id: this.medalId,
        from: this.from,
        to: this.to
      }

      medalService.getProfileMedals(param)
        .then(response => {
          if (response.data.success) {
            this.listMedals = response.data.data.data
            this.totalItems = response.data.data.count
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        }).finally(() => {
          this.isLoadingConfig = false
        })
    },
    handleSelectedRegion: function (option) {
      if (option && option.length) {
        this.region = option.map(option => option.id)
      } else {
        this.region = null
      }
    },
    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : null
    },
    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : null
    },
    handleDepartmentSelected: function (option) {
      this.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },
    handlePositionSelected: function (option) {
      this.positionIds = option ? option.map((item) => item.id).toString() : ''
    },
    handleSelectedMedal (option) {
      this.medalId = option ? option.id : null
    }
  }
}
</script>

<style lang="scss" scoped>
    .ui-block {
        border-bottom: 1px solid #eeeeee;
    }
</style>
