<template>
  <div>
      <b-btn @click="$refs.ultraWide.open()" class="btn btn-md btn-outline-secondary btn-modal-explain">?</b-btn>
      <sweet-modal title="" width="80%" ref="ultraWide" class="ml-5" style="background-color: #22323F">
        <b-tabs>
          <b-tab title="Lấy" active>
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn đúng</td>
                  <td>đơn lấy đúng toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>đơn sai</td>
                  <td>đơn lấy sai toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>chờ lấy hàng</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> đăng đơn <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> COD báo lấy thành công</td>
                </tr>
                <tr class="text-left">
                  <td>lấy xong</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> COD báo lấy thành công <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> nhập kho lấy</td>
                </tr>
              </tbody>
            </table>
          </b-tab>
          <b-tab title="Giao" active>
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn đúng</td>
                  <td>đơn giao đúng toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>đơn sai</td>
                  <td>đơn giao sai toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>chờ giao hàng</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> nhập kho giao <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> điều phối đẩy đơn cho COD</td>
                </tr>
                <tr class="text-left">
                  <td>giao xong</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> điều phối đẩy đơn cho COD <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> COD báo giao thành công</td>
                </tr>
              </tbody>
            </table>
          </b-tab>
          <b-tab title="Trả" active>
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn đúng</td>
                  <td>đơn trả đúng toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>đơn sai</td>
                  <td>đơn trả sai toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>chờ trả</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> đơn chuyển sang trạng thái trả <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> nhập kho trả hàng</td>
                </tr>
                <tr class="text-left">
                  <td>trả xong</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> nhập kho trả hàng <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> COD báo trả hàng thành công</td>
                </tr>
              </tbody>
            </table>
          </b-tab>
          <b-tab title="Trung chuyển" active>
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn nội tỉnh</td>
                  <td>đơn có <span style="background-color: #FFF90B; color: #0D0D0D;">tỉnh lấy = tỉnh giao</span></td>
                </tr>
                <tr class="text-left">
                  <td>đơn liên tỉnh</td>
                  <td>đơn có <span style="background-color: #FFF90B; color: #0D0D0D;">tỉnh lấy # tỉnh giao</span></td>
                </tr>
                <tr class="text-left">
                  <td>thời gian chờ chuyển đi</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian từ khi</span> điều phối chốt ca nhập hàng vào kho <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> hàng được xuất lên xe tải</td>
                </tr>
                <tr class="text-left">
                  <td>thời gian di chuyển</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">khoảng thời gian di chuyển</span> của các xe tải giữa các kho hàng, <span style="background-color: #FFF90B; color: #0D0D0D;">từ khi</span> đơn hàng được xuất ra khỏi kho N-1 <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> được nhập vào kho N</td>
                </tr>
              </tbody>
            </table>
          </b-tab>
        </b-tabs>
      </sweet-modal>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import {SweetModal, SweetModalTab} from 'sweet-modal-vue'

export default {
  name: 'modal-explain-operation-speed',

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
