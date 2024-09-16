<template>
  <div>
    <b-btn variant="outline-info" @click="checkBeforeCreatePayslip"><i class="ion ion-md-add"></i> Tạo bảng lương theo điều kiện lọc</b-btn>
    <b-modal title="Tạo bảng lương" v-model="isShowModal" @hidden="onHidden" :no-close-on-backdrop="isProcessing" static>
      <p>Tổng số nhân viên(NV) tìm kiếm được theo bộ lọc: <b>{{ totalUser }}</b></p>
      <template v-if="totalUser > 0 && hasProcessingDone">
        <p>Tổng số NV đã được tạo bảng lương thành công: <b>{{ listSuccessUsers.length }}</b></p>
        <p>Tổng số NV tạo bảng lương thất bại do chưa checkin lần nào trong tháng: <b>{{ listFailUsers.by_checkin.length }}</b></p>
        <p>Tổng số NV tạo bảng lương thất bại do thiếu profile hoặc hợp đồng: <b>{{ listFailUsers.by_profile.length }}</b></p>
        <p>Tổng số NV tạo bảng lương thất bại do hệ thống: <b>{{ listFailUsers.by_payslip.length }}</b></p>
      </template>
      <template slot="modal-footer">
        <ladda-btn :loading="isProcessing" @click.native="createPayslipByFilter()" data-style="expand-right" class="btn btn-primary float-right">
          <i class="sidenav-icon ion ion-md-document"></i> Tạo dữ liệu bảng lương
        </ladda-btn>
        <b-btn class="float-right" variant="secondary" @click="closeModal">
          Đóng
        </b-btn>
      </template>
    </b-modal>
  </div>
</template>

<script>
import partnershipService from 'domain/services/partnership-payslip-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

export default {
  name: 'ecom-btn-create-payslip',

  components: {
    LaddaBtn
  },

  props: {
    dataFilter: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      isShowModal: false,
      totalUser: 0,
      listSuccessUsers: [],
      listFailUsers: {},
      isProcessing: false,
      hasProcessingDone: false
    }
  },

  methods: {
    closeModal () {
      this.isShowModal = false
    },

    checkBeforeCreatePayslip () {
      this.$startLoading()
      let dataSearch = {
        fullname: this.dataFilter.fullname,
        username: this.dataFilter.username,
        month: this.dataFilter.month,
        year: this.dataFilter.year,
        region: this.dataFilter.region,
        provinces: this.dataFilter.provinces,
        stations: this.dataFilter.stations,
        group_id: this.dataFilter.groupId,
        department: this.dataFilter.department,
        position_job: this.dataFilter.positionJob
      }

      partnershipService.checkBeforeCreatePayslip(dataSearch).then((response) => {
        if (response.data.success) {
          this.totalUser = response.data.total
          this.isShowModal = true
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => { // eslint-disable-line
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra trong quá trình tìm kiếm thông tin nhân viên'
        })
      }).then(() => {
        this.$stopLoading()
      })
    },

    createPayslipByFilter () {
      if (this.isProcessing) {
        return false
      }

      this.isProcessing = true
      let dataSearch = {
        fullname: this.dataFilter.fullname,
        username: this.dataFilter.username,
        month: this.dataFilter.month,
        year: this.dataFilter.year,
        region: this.dataFilter.region,
        provinces: this.dataFilter.provinces,
        stations: this.dataFilter.stations,
        group_id: this.dataFilter.groupId,
        department: this.dataFilter.department,
        position_job: this.dataFilter.positionJob
      }

      partnershipService.createPayslipByFilter(dataSearch).then((response) => {
        if (response.data.success) {
          this.hasProcessingDone = true
          this.listSuccessUsers = response.data.data.list_success
          this.listFailUsers = response.data.data.list_not_success
          this.isShowModal = true
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => { // eslint-disable-line
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra trong quá trình tìm kiếm thông tin nhân viên'
        })
      }).then(() => {
        this.isProcessing = false
      })
    },

    onHidden (event) {
      this.totalUser = 0
      this.hasProcessingDone = false
      this.listSuccessUsers = []
      this.listFailUsers = {}
    }
  }

}
</script>

<style scoped lang="scss">
</style>
