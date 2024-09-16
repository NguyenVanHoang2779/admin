<template>
  <div>
      <b-btn @click="$refs.ultraWide.open()" class="btn btn-md btn-outline-secondary btn-modal-explain">?</b-btn>
      <sweet-modal title="" width="80%" ref="ultraWide" class="ml-5" style="background-color: #22323F">
        <table class="table">
          <thead>
            <tr class="text-left">
              <th>Keywords</th>
              <th>What?</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-left">
              <td>số lượng active</td>
              <td>số COD đi làm tại thời điểm xem</td>
            </tr>
            <tr class="text-left">
              <td>perfomance hiện tại</td>
              <td>tổng đơn lấy| giao| trả thành công/ tổng COD đi làm tại thời điểm xem</td>
            </tr>
            <tr class="text-left">
              <td>năng suất hệ thống</td>
              <td>tổng đơn lấy| giao| trả phát sinh/ tổng COD đi làm tại thời điểm xem</td>
            </tr>
            <tr class="text-left">
              <td>vote sao</td>
              <td>vote sao trung bình & tổng lượt vote cho COD lấy| giao| trả</td>
            </tr>
            <tr class="text-left">
              <td>% delay không có log cuộc gọi</td>
              <td>tổng đơn delay không có log cuộc gọi/ tổng đơn delay</td>
            </tr>
            <tr class="text-left">
              <td>% số đơn bồi hoàn/tổng bồi hoàn</td>
              <td>tổng đơn bồi hoàn gán cho COD/ tổng đơn phải bồi hoàn</td>
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
  name: 'modal-explain-operation-cod-performance',

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
