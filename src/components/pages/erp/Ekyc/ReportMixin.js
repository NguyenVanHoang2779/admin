import commonHelper from 'infrastructures/helpers/common-helpers'
import ekycService from 'domain/services/ekyc-service'
import moment from 'moment'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  components: {Viewer},
  data () {
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        limit: 10,
        total: 0
      },
      list: [],
      filter: {
        name: null,
        code: null,
        status: null
      },
      reset: false,
      options: [
        { value: null, text: 'Chọn trạng thái' },
        { value: 'new', text: 'Chưa duyệt' },
        { value: 'true', text: 'Báo lỗi đúng' },
        { value: 'false', text: 'Báo lỗi sai' }
      ]
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      try {
        this.loading = true
        const {data} = await ekycService.getReports({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success) {
          this.list = data.reports
          this.pagination.total = data.total
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
          commonHelper.showMessage(e.response.data.message, 'warning')
        } else {
          commonHelper.showMessage(e.message, 'error')
        }
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
        name: null,
        code: null,
        status: null
      }
      this.reset = !this.reset
      this.resetPagination()
      this.getList()
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
    async approve (id, status) {
      try {
        this.loading = true
        const {data} = await ekycService.approveEkycReport({
          id,
          status
        })
        commonHelper.showMessage(data.message, 'success')
        this.getList()
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
          commonHelper.showMessage(e.response.data.message, 'warning')
        } else {
          commonHelper.showMessage(e.message, 'error')
        }
      } finally {
        this.loading = false
      }
    }
  },
  filters: {
    statusToText (v) {
      switch (v) {
        case 'new':
          return 'Chưa duyệt'
        case 'true':
          return 'Báo lỗi đúng'
        case 'false':
          return 'Báo lỗi sai'
        default:
          return 'N/A'
      }
    },
    timeFormat (value, format = 'HH:mm:ss DD-MM-YYYY') {
      return moment(value).format(format)
    }
  }
}
