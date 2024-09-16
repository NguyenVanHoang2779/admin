<template>
  <b-modal
    v-model="openModal"
    :title="`Đơn hàng ${pkgOrder}`"
    @hidden="close"
  >
    <div class="pkg-container" v-if="pkg.Package" v-loading="loading">
      <div class="pkg-details">
        <a class="go-detail" href="`https://admin.giaohangtietkiem.vn/admin?alias=${pkg.Package.alias}`" target="_blank">
          Xem chi tiết đơn hàng
        </a>
        <p class="pkg-code">Mã KH DH: {{ pkg.Package.client_id }}</p>
        <p>Thu tiền hộ: <b>***đ</b></p>
        <p>Đóng bảo hiểm: {{ pkg.Package.insurance }} đ</p>
        <p>Phí ship: {{ pkg.Package.ship_money }} đ</p>
        <p>Phí trả: {{ pkg.Package.return_fee }} đ</p>
        <p>Trạng thái: {{ pkg.Package.package_status_id | pkgStatusToText }}</p>
        <p><b>Chú ý</b></p>
        <p><b>Ghi chú</b>: <span v-html="pkg.Package.message"></span></p>
        <p><b>Ghi chú nội bộ</b>: <span v-html="pkg.Package.private_message"></span></p>
        <p><b>Chấm điểm cho COD</b>: Chưa có đánh giá</p>
      </div>
      <div class="pkg-issue">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-2 variant="default">
              Logs đơn hàng
            </b-button>
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <Timline :logs="pkg.Package.log"/>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <div class="pkg-container" v-else>
      Không tìm thấy thông tin đơn hàng
    </div>
    <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close">Đóng</button>
    </template>
  </b-modal>
</template>

<script>
import newMemberService from 'domain/services/new-member-service'
import Timline from './TimeLine.vue'

export default {
  props: ['open', 'pkgOrder'],
  components: {Timline},
  data () {
    return {
      openModal: false,
      pkg: {},
      pickLogs: [],
      loading: false
    }
  },
  methods: {
    done () {
      this.openModal = false
      this.$emit('togglePkgPopup', {pkgOrder: null, state: false})
    },
    close () {
      this.openModal = false
      this.$emit('togglePkgPopup', {pkgOrder: null, state: false})
    },
    async getPkgData () {
      try {
        this.loading = true
        const {data} = await newMemberService.getPkgInfoByOrder({package_order: this.pkgOrder})
        this.pkg = data.data
      } catch (e) {
        this.pkg = {}
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    open (v) {
      this.openModal = v
      if (v === true && this.pkgOrder) {
        this.getPkgData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.go-detail{
  color: #14a05b;
  font-size: 12px;
  text-decoration: underline;
  font-weight: 400;
}
.pkg-code{
  margin-top: 20px;
}
</style>
