<template>
  <b-button variant="ghtk" @click="checkCanUpdateStatus">Cập nhập nhanh trạng thái của đề xuất</b-button>
</template>

<script>
import {SweetModal, SweetModalTab} from 'sweet-modal-vue'
import UnionService from 'domain/services/union-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'modal-quick-update-union',

  props: {
    optionMonth: {
      type: Array,
      default: null
    },
    optionStatus: {
      type: Array,
      default: null
    }
  },

  components: {
    SweetModal,
    SweetModalTab
  },

  computed: {
    rows () {
      return this.items.length
    },
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  data () {
    return {
      perPage: 10,
      currentPage: 1,
      fields: [
        {key: 'STT', label: 'STT'},
        {key: 'fullname', label: 'Tên Nhân viên'},
        {key: 'staff_code', label: 'Mã nhân viên'},
        {key: 'active_date', label: 'Ngày hưởng chế độ'},
        {key: 'desc', label: 'Nội dung chế độ'},
        {key: 'docs', label: 'Giấy tờ'},
        {key: 'status', label: 'Trạng thái đăng kí'}
      ],
      items: [
      ],
      fileDocuments: [],
      dataSearch: {
        month: null,
        status: null
      }
    }
  },

  methods: {
    openLink (link) {
      window.open(link)
    },
    resetModal () {
      this.dataSearch.month = null
      this.dataSearch.status = null
      this.items = []
      this.currentPage = 1
      this.$emit('reloadpage')
    },

    getStatus (value) {
      let status = ''
      switch (value) {
        case 'pending':
          status = 'Đang chờ'
          break
        case 'lack_document':
          status = 'Thiếu tài liệu'
          break
        case 'error':
          status = 'Lỗi'
          break
        case 'success':
          status = 'Thành công'
          break
      }
      return status
    },

    formatDate (datetime, type) {
      if (datetime) {
        if (type === 'month') return moment(datetime).format('MM-YYYY')
        if (type === 'date') return moment(datetime).format('DD-MM-YYYY')
      }
    },

    checkCanUpdateStatus () {
      let params = {
        username: this.userInfo.User ? this.userInfo.User.username : null
      }
      UnionService.checkCanUpdateStatus(params).then((res) => {
        if (res.data.success) {
          if (res.data.data && res.data.data.allowUpdate) {
            // this.$refs['tableUpdateStatusUnion'].show()
            if (!confirm('Bạn chắc chắn muốn cập nhật nhanh trạng thái?')) {
              return
            }
            this.quickUpdate()
          } else {
            commonHelper.showMessage('Bạn không có quyền cập nhật trạng thái chế độ công đoàn', 'warning')
          }
        } else {
          commonHelper.showMessage('Bạn không có quyền cập nhật trạng thái chế độ công đoàn', 'warning')
        }
      }).catch((e) => {
        console.log(e)
      })
    },

    quickUpdate () {
      this.$startLoading()
      // if (!this.dataSearch.month) {
      //   commonHelper.showMessage('bạn chưa chọn tháng đăng kí', 'warning')
      //   this.$stopLoading()
      //   return
      // }
      UnionService.quickUpdate().then((res) => {
        this.$stopLoading()
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch((e) => {
        this.$stopLoading()
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warning')
      })
    },

    getUnionDocuments (unionId) {
      this.$startLoading()
      this.fileDocuments = []
      UnionService.getUnionDocuments({id: unionId}).then((res) => {
        this.$stopLoading()
        if (res.data.success) {
          this.fileDocuments = res.data.data
          this.$refs['imageListDocs'].show()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warning')
      })
    },

    searchUnions () {
      this.$startLoading()
      if (!this.dataSearch.month && !this.dataSearch.status) {
        this.$stopLoading()
        commonHelper.showMessage('bạn chưa chọn tháng đăng kí hoặc trạng thái', 'warning')
        return
      }
      this.items = []
      UnionService.getUnionsForQuickUpdate(this.dataSearch).then((res) => {
        this.$stopLoading()
        if (res.data.success) {
          this.items = res.data.data
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warning')
      })
    }
  }
}

</script>

<style scoped>
  #modal-update-list-dependent-person > .modal-dialog {
    max-width: 80% !important;
  }
</style>
