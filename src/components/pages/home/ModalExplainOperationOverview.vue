<template>
  <div>
      <b-btn @click="$refs.ultraWide.open()" class="btn btn-md btn-outline-secondary btn-modal-explain">?</b-btn>
      <sweet-modal title="" width="80%" ref="ultraWide" class="ml-5" style="background-color: #22323F">
        <b-tabs>
          <b-tab title="Lấy" active>
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn phát sinh mới</td>
                  <td>đơn <span style="background-color: #FFF90B; color: #0D0D0D;">đăng mới tại thời điểm xem</span>, không quan tâm đã lấy hay chưa lấy</td>
                </tr>
                <tr class="text-left">
                  <td>đơn phát sinh cũ</td>
                  <td>đơn <span style="background-color: #FFF90B; color: #0D0D0D;">đăng trước thời điểm xem</span>, chưa được lấy</td>
                </tr>
                <tr class="text-left">
                <td>% hoàn thành</td>
                <td>tỷ lệ đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">lấy thành công</span> trong tổng số đơn phát sinh lấy</td>
              </tr>
              <tr class="text-left">
                <td>% toàn trình</td>
                <td>tỷ lệ đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">lấy đúng toàn trình</span> trong tổng số đơn lấy được xét toàn trình</td>
              </tr>
              <tr class="text-left">
                <td>thời gian hoàn thành TB</td>
                <td><span style="background-color: #FFF90B; color: #0D0D0D;">thời gian TB từ khi</span> shop đăng đơn <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> đơn hàng được nhập kho bởi điều phối</td>
              </tr>
              </tbody>
            </table>
          </b-tab>
          <b-tab title="Giao">
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn phát sinh mới</td>
                  <td>đơn <span style="background-color: #FFF90B; color: #0D0D0D;">nhập kho giao tại thời điểm xem</span>, không quan tâm đã giao hay chưa giao</td>
                </tr>
                <tr class="text-left">
                  <td>đơn phát sinh cũ</td>
                  <td>đơn <span style="background-color: #FFF90B; color: #0D0D0D;">nhập kho giao trước thời điểm xem</span>, chưa được giao</td>
                </tr>
                <tr class="text-left">
                  <td>% hoàn thành</td>
                  <td>tỷ lệ đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">giao thành công</span> trong tổng số đơn phát sinh giao</td>
                </tr>
                <tr class="text-left">
                  <td>% toàn trình</td>
                  <td>tỷ lệ đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">giao đúng toàn trình</span> trong tổng số đơn giao được xét toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>thời gian hoàn thành TB</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">thời gian TB từ khi</span> đơn hàng được nhập kho giao <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> được giao thành công</td>
                </tr>
              </tbody>
            </table>
          </b-tab>
          <b-tab title="Trả">
            <table class="table">
              <tbody>
                <tr class="text-left">
                  <td>đơn phát sinh mới</td>
                  <td>đơn <span style="background-color: #FFF90B; color: #0D0D0D;">nhập kho trả tại thời điểm xem</span>, không quan tâm đã trả hay chưa trả</td>
                </tr>
                <tr class="text-left">
                  <td>đơn phát sinh cũ</td>
                  <td>đơn <span style="background-color: #FFF90B; color: #0D0D0D;">nhập kho trả trước thời điểm xem</span>, chưa được trả</td>
                </tr>
                <tr class="text-left">
                  <td>% hoàn thành</td>
                  <td>tỷ lệ đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">trả thành công</span> trong tổng số đơn phát sinh trả</td>
                </tr>
                <tr class="text-left">
                  <td>% toàn trình</td>
                  <td>tỷ lệ đơn hàng <span style="background-color: #FFF90B; color: #0D0D0D;">trả đúng toàn trình</span> trong tổng số đơn trả được xét toàn trình</td>
                </tr>
                <tr class="text-left">
                  <td>thời gian hoàn thành TB</td>
                  <td><span style="background-color: #FFF90B; color: #0D0D0D;">thời gian TB từ khi</span> đơn hàng được nhập kho trả (đối với đơn nội kho là từ khi chuyển trạng thái sang đơn trả) <span style="background-color: #FFF90B; color: #0D0D0D;">đến khi</span> COD báo trả hàng thành công</td>
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
  name: 'modal-explain-operation-overview',

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
