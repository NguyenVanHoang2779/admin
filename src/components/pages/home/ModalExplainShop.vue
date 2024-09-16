<template>
  <div>
      <b-btn @click="$refs.ultraWide.open()" class="btn btn-md btn-outline-secondary btn-modal-explain">?</b-btn>
      <sweet-modal title="" width="80%" ref="ultraWide" class="ml-5" style="background-color: #22323F">
        <table class="table">
          <thead>
            <tr class="text-left row">
              <th class="col-2">Keywords</th>
              <th class="col-4">What?</th>
              <th class="col-6">How?</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-left row">
              <td class="col-2">tổng shop active</td>
              <td class="col-4">tổng shop có <span style="background-color: #FFF90B; color: #0D0D0D;">đơn chưa hoàn thành với GHTK</span></td>
              <td class="col-6">đơn chưa hoàn thành với GHTK là đơn có trạng thái đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">không phải</span> [đã đối soát, đã đối soát công nợ trả hàng] <small><a href="https://docs.giaohangtietkiem.vn/#tr-ng-th-i-n-h-ng24" target="_blank">click để xem tất cả trạng thái đơn hàng tại đây</a></small></td>
            </tr>
            <tr class="text-left row">
              <td class="col-2">số shop mới</td>
              <td class="col-4">số shop <span style="background-color: #FFF90B; color: #0D0D0D;">mới sử dụng dịch vụ GHTK</span></td>
              <td class="col-6">shop mới sử dụng dịch vụ GHTK được định nghĩa như sau:<br>
                <b>Prime, VIP</b>: shop có số điện thoại và địa chỉ lấy mới<br>
                <b>B2B, C2C</b>: shop có mã shop mới
              </td>
            </tr>
            <tr class="text-left row">
              <td class="col-2">tổng đơn hàng</td>
              <td class="col-4">tổng đơn đăng mới trong ngày</td>
              <td class="col-6"></td>
            </tr>
            <tr class="text-left row">
              <td class="col-2">TB đơn/shop</td>
              <td class="col-4">tổng đơn hàng/ tổng shop đăng đơn đó</td>
              <td class="col-6"></td>
            </tr>
            <tr class="text-left row">
              <td class="col-2">số shop rời bỏ</td>
              <td class="col-4">số shop không đăng đơn trong vòng <span style="background-color: #FFF90B; color: #0D0D0D;">5 ngày</span> tính đến thời điểm hiện tại (tính cả T7, CN)</td>
              <td class="col-6"></td>
            </tr>
            <tr class="text-left row">
              <td class="col-2">số shop quay lại</td>
              <td class="col-4">số shop <span style="background-color: #FFF90B; color: #0D0D0D;">5 ngày</span> trước không đăng đơn, đến bây giờ có đơn</td>
              <td class="col-6"></td>
            </tr>
          </tbody>
        </table>
      </sweet-modal>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import {SweetModal, SweetModalTab} from 'sweet-modal-vue'

export default {
  name: 'modal-explain-shop',

  components: {
    SweetModal,
    SweetModalTab
  },

  data: () => ({
  }),

  created () {
  },

  methods: {
  }
}
</script>
