<template>
  <b-modal hide-footer :id="id" title="Cập nhập nhanh trạng thái đăng kí của NPT" modal-class='modal-xxl' @hide="resetModal">
    <b-row>
      <div class="col-md-8 text-left">
        <b-row>
          <b-form-select size="md" :options="optionMonth" v-model="filterSearch.month" class="col-md-4 mr-2">
          </b-form-select>
          <b-form-select size="md" :options="optionStatus" v-model="filterSearch.status" class="col-md-4 mr-2">
          </b-form-select>
          <b-button variant="success" title="Tìm kiếm" @click="searchDependant"><i class="fa fa-search"></i></b-button>
        </b-row>
      </div>
      <div class="overflow-auto col-md-4 text-right">
        <b-pagination
          v-model="filterSearch.page"
          :total-rows="filterSearch.totalItems"
          :per-page="filterSearch.limit"
          @change="searchDependant"
          aria-controls="my-table"
          align="right"
        ></b-pagination>
      </div>
    </b-row>

    <table class="table table-sm table-hover table-bordered">
      <thead>
      <tr>
        <th class="text-center">STT</th>
        <th>Tên nhân viên</th>
        <th>Mã nhân viên</th>
        <th>Ngày đăng kí</th>
        <th>Tháng bắt đầu giảm trừ</th>
        <th>Họ tên NPT</th>
        <th>Quan hệ</th>
        <th class="text-center">Trạng thái đăng kí</th>
      </tr>
      </thead>
      <tbody v-loading="loading" class="position-relative">
      <tr v-for="(item, index) in dependants" :key="item.id">
        <td class="text-center">{{ (filterSearch.page - 1) * filterSearch.limit + index + 1}}</td>
        <td>{{ item.mp_fullname }}</td>
        <td>{{ item.staff_code }}</td>
        <td>{{ formatDate(item.created) }}</td>
        <td>{{ formatDate(item.from_reduce) }}</td>
        <td>{{ item.fullname }}</td>
        <td>{{ relationshipDesc[item.relationship] }}</td>
        <td class="text-center">
          <RadioChangeStatus
            :dependant="item"
            @dataChange="dataChange = true"
          />
        </td>
      </tr>
      <tr v-show="!dependants || !dependants.length">
        <td colspan="20" class="text-center h-25vh align-middle"><b>Không có dữ liệu nào !</b></td>
      </tr>
      </tbody>
    </table>
  </b-modal>
</template>

<script>
// custom-component
import RadioChangeStatus from './RadioChangeStatus'
import dependantPersonService from 'domain/services/dependant-person-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import Dependant from 'domain/entities/Dependant'

export default {
  name: 'quick-update-status-dependant',

  props: {
    optionMonth: {
      type: Array,
      default: null
    },
    optionStatus: {
      type: Array,
      default: null
    },
    id: {
      default: 'quick-update-status-dependant'
    }
  },

  components: {
    RadioChangeStatus
  },

  data () {
    return {
      dataChange: false,
      relationshipDesc: Dependant.relationship,
      dependants: [],
      filterSearch: {
        month: null,
        status: null,
        limit: 20,
        page: 1,
        totalItems: 0
      },
      loading: false
    }
  },

  methods: {
    resetModal () {
      if (this.dataChange) this.$emit('dataChange')
      this.dataChange = false
      this.filterSearch.month = null
      this.filterSearch.status = null
      this.filterSearch.page = 1
      this.dependants = []
    },

    formatDate (date, format = 'DD-MM-YYYY') {
      if (date) return helper.formatDate(date, format)
      return null
    },

    searchDependant (page = 1) {
      if (!this.filterSearch.month || !this.filterSearch.status) {
        helper.showMessage('Bạn cần chọn tháng đăng kí và trạng thái !', 'warning')
        return
      }
      if (Number.isInteger(page)) {
        this.filterSearch.page = parseInt(page)
      }
      this.loading = true
      dependantPersonService.getDependantForQuickUpdate(this.filterSearch)
        .then(res => {
          if (res.data.success) {
            this.dependants = res.data.data || []
            this.filterSearch.totalItems = res.data.pagination.total || 0
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra !', 'warning')
        })
        .then(_ => {
          this.loading = false
        })
    }
  }
}
</script>
