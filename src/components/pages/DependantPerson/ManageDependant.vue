<template>
  <div class="small-scrollbar">
    <b-row class="align-items-center">
      <b-col cols="4">
<!--        <h4 class="my-0">Quản lý người phụ thuộc</h4>-->
      </b-col>
      <b-col cols="8" class="text-right">
        <b-btn variant="ghtk" @click="getDependant(1)"><span class="ion ion-md-search" ></span> Tìm kiếm</b-btn>
        <b-btn variant="ghtk" @click="addDependant()"><span class="ion ion-md-add"></span> Thêm NPT</b-btn>
        <b-btn v-if="checkPermissionExportAllPage()" variant="ghtk" @click="exportDependant"><span class="ion ion-md-download"></span> Xuất Excel </b-btn>
        <b-btn variant="ghtk" @click="checkCanUpdateRegisterStatus">Cập nhập nhanh trạng thái đăng kí của NPT</b-btn>
      </b-col>
    </b-row>
    <div class="seperate-xs my-1"></div>
    <b-row class="mb-3">
          <b-col cols="2" class="mb-1">
            <b-input v-model="filter.fullnameUsername" placeholder="Họ tên/Username nhân viên" />
          </b-col>
          <b-col cols="2">
            <b-input v-model="filter.taxIdenNumberPersonalId" placeholder="CMND/Mã nhân viên/Mã số thuế" />
          </b-col>
          <b-col cols="2">
            <single-select-region @handleSelectedRegion="handleSelectedRegion"></single-select-region>
          </b-col>
          <b-col cols="2">
            <single-select-province @handleSelectedProvince="handleSelectedProvince" :regionName="filter.regionId" custom-class=""></single-select-province>
          </b-col>
          <b-col cols="2">
            <single-select-station :province-id="filter.provinceId" @handleSelectedStation="handleSelectedStation" custom-class=""></single-select-station>
          </b-col>
          <b-col cols="2" md="2">
            <b-form-select :options="optionStatus" v-model="filter.status"></b-form-select>
          </b-col>
          <b-col cols="2">
            <b-form-select :options="optionsYear" v-model="filter.year" ></b-form-select>
          </b-col>
          <b-col cols="2">
            <b-form-select :options="optionsMonth" v-model="filter.month" ></b-form-select>
          </b-col>
          <b-col sm="8" class="text-right" >
          </b-col>
    </b-row>
    <!-- paging -->
    <div class="paging mx-1">
      <div class="z-0 d-inline-block">
        <b-pagination
          class="mb-1"
          size="sm"
          align="left"
          hide-goto-end-buttons
          v-model="pageData.curPage"
          :total-rows="+pageData.totalItems"
          :per-page="pageData.perPage"
          @change="getDependant"
        >
        </b-pagination>
      </div>
    </div>
    <!-- list -->
    <table class="table table-sm table-hover table-bordered">
      <thead>
        <tr>
          <th class="text-center">STT</th>
          <th>Tên nhân viên</th>
          <th>Mã nhân viên</th>
          <th>Vị trí</th>
          <th>kho</th>
          <th>Số NPT</th>
          <th class="text-center">Chi tiết</th>
        </tr>
      </thead>
      <tbody v-loading="loading" class="position-relative">
        <tr v-for="(item ,index) in items" :key="item.mp_id">
            <td class="text-center">{{ (pageData.curPage - 1) * pageData.perPage + index + 1 }}</td>
            <td>{{ item.fullname }}</td>
            <td>{{ item.staff_code }}</td>
            <td>{{ item.position.department + ' - ' + item.position.position_name}}</td>
            <td>{{ item.Station }}</td>
            <td>{{ item.no_of_dependants ? (item.no_of_dependants + '/' + item.sumOfDependant) : ('0/' + item.sumOfDependant) }}</td>
            <td class="text-center">
              <b-btn v-b-modal.modal-sm @click="listDependant(item)" variant="outline-ghtk" title="Xem người phụ thuộc" size="sm">
                <i class="ion ion-md-eye"></i>
              </b-btn>
              <b-btn @click="addDependant(item.staff_code)" variant="outline-ghtk" title="Thêm người phụ thuộc" size="sm">
                <i class="ion ion-md-add"></i>
              </b-btn>
            </td>
        </tr>
        <tr v-show="!items || !items.length">
          <td colspan="8" class="text-center h-25vh align-middle"><b>Không có người lao động nào !</b></td>
        </tr>
      </tbody>
    </table>
    <!-- modal -->
    <ListDependant :profile="curProfile" :filter="filter" :mpFullname="curProfileName"/>
    <UpdateDependantPerson
      @updateOk="getDependant()"
      :staffcode="staffcode"
      v-if="addingDependant"
    />
    <QuickUpdateStatusDependant
      :optionMonth="optionsMonth"
      :optionStatus="optionStatus"
      @dataChange="getDependant()"
    />
  </div>
</template>

<script>
// custom component
import QuickUpdateStatusDependant from './QuickUpdateStatusDependant'
import UpdateDependantPerson from './UpdateDependantPerson'
import ListDependant from './ModalListDependant'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
// service
import dependantService from 'domain/services/dependant-person-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import Dependant from 'domain/entities/Dependant'

import { mapGetters } from 'vuex'

// mixins
import ExportMixin from 'mixins/ExportMixin'

export default {
  name: 'manage-dependant',

  mixins: [ExportMixin],

  props: ['dataSearchInput'],

  components: {
    QuickUpdateStatusDependant,
    ListDependant,
    UpdateDependantPerson,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectRegion
  },

  data () {
    return {
      loading: null,
      staffcode: null,
      curProfile: null,
      curProfileName: null,
      pageData: {
        curPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 20
      },
      items: [], // mảng dữ liệu người phụ thuộc cho nhiều master_profile
      filter: {
        provinceId: null,
        stationId: null,
        regionId: null,
        taxIdenNumberPersonalId: null,
        fullnameUsername: null,
        month: null,
        year: null,
        status: null,
        page: null
      },
      optionsYear: [
        { text: '-- Chọn năm --', value: null }
      ],
      optionsMonth: [
        { text: '-- Chọn tháng đăng kí --', value: null },
        { text: 'Tháng 1 (21/12 -> 20/01)', value: '1' },
        { text: 'Tháng 2 (21/1 -> 20/02)', value: '2' },
        { text: 'Tháng 3 (21/2 -> 20/03)', value: '3' },
        { text: 'Tháng 4 (21/3 -> 20/04)', value: '4' },
        { text: 'Tháng 5 (21/4 -> 20/05)', value: '5' },
        { text: 'Tháng 6 (21/5 -> 20/06)', value: '6' },
        { text: 'Tháng 7 (21/6 -> 20/07)', value: '7' },
        { text: 'Tháng 8 (21/7 -> 20/08)', value: '8' },
        { text: 'Tháng 9 (21/8 -> 20/09)', value: '9' },
        { text: 'Tháng 10 (21/9 -> 20/10)', value: '10' },
        { text: 'Tháng 11 (21/10 -> 20/11)', value: '11' },
        { text: 'Tháng 12 (21/11 -> 20/12)', value: '12' }
      ],
      optionStatus: Dependant.optionStatus,
      addingDependant: false
    }
  },

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    })
  },

  created () {
    this.createYearOption()
    if (this.dataSearchInput) {
      this.filter = {...this.filter, ...this.dataSearchInput}
    }
    this.getDependant()
  },

  methods: {
    createYearOption () {
      let currentYear = new Date().getFullYear()
      for (let i = 0; i < 10; i++) {
        this.optionsYear.push(
          { text: ('Năm ' + (currentYear - i)), value: (currentYear - i) }
        )
      }
    },

    listDependant (profile) {
      this.curProfile = profile.mp_id
      this.curProfileName = profile.fullname
      this.$bvModal.show('modal-list-dependant')
    },

    handleSelectedProvince (option) {
      this.filter.provinceId = option ? option.id : null
    },

    handleSelectedStation (option) {
      this.filter.stationId = option ? option.id : null
    },

    handleSelectedRegion (option) {
      this.filter.regionId = option ? option.id : null
    },

    getDependant (page = 1) {
      this.loading = true
      this.pageData.curPage = page
      this.filter.page = this.pageData.curPage
      dependantService.dependantPersonCheck(this.filter)
        .then(res => {
          if (res.data.success) {
            this.items = res.data.data
            const countItems = this.items.length
            if (countItems < res.data.pagination.per_page) {
              this.pageData.totalItems = countItems
            } else {
              this.pageData.totalItems = res.data.pagination.per_page * res.data.pagination.current_page + 1
            }
            this.pageData.perPage = res.data.pagination.per_page
          } else {
            helper.showMessage(res.data.message || 'Không lấy được thông tin NPT !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(_ => {
          this.loading = false
        })
    },

    checkCanUpdateRegisterStatus () {
      if (!this.curUser.User || !this.curUser.User.username) {
        helper.showMessage('Bạn không có quyền cập nhật trạng thái đăng ký NPT !', 'warning')
        return
      }
      dependantService.checkCanUpdateRegisterStatus({ username: this.curUser.User.username })
        .then(res => {
          if (res.data.success) {
            if (res.data.data && res.data.data.allowUpdate) {
              this.$bvModal.show('quick-update-status-dependant')
            } else {
              helper.showMessage('Bạn không có quyền cập nhật trạng thái đăng ký NPT !', 'warning')
            }
          } else {
            helper.showMessage('Bạn không có quyền cập nhật trạng thái đăng ký NPT !', 'warning')
          }
        }).catch(e => {
          console.log(e)
        })
    },

    addDependant (staffcode = null) {
      this.addingDependant = true
      setTimeout(() => {
        this.staffcode = staffcode
        this.$bvModal.show('update-dependant-person')
      }, 100)
    },

    exportDependant () {
      let stringSearch = ''
      for (let key in this.filter) {
        if (this.filter[key] !== null && this.filter[key] !== '' && key !== 'page') {
          stringSearch += (key + '=' + this.filter[key] + '&')
        }
      }
      window.open('/erp/ErpDependentPerson/exportDependant?' + stringSearch, '_blank')
    }
  }
}
</script>
