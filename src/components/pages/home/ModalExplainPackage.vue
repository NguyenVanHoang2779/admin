<template>
  <div>
      <b-btn @click="$refs.ultraWide.open()" class="btn btn-md btn-outline-secondary btn-modal-explain">?</b-btn>
      <sweet-modal title="" width="80%" ref="ultraWide" class="ml-5" style="background-color: #22323F">
        <table class="table">
          <thead>
            <tr class="text-left">
              <th>Keywords</th>
              <th>What?</th>
              <th>How?</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-left">
              <td>đơn nội tỉnh</td>
              <td>đơn có <span style="background-color: #FFF90B; color: #0D0D0D;">tỉnh lấy = tỉnh giao</span></td>
              <td></td>
            </tr>
            <tr class="text-left">
              <td>đơn nội tỉnh ngày</td>
              <td>đơn nội tỉnh được <span style="background-color: #FFF90B; color: #0D0D0D;">chọn giao giờ hành chính</span></td>
              <td>giao giờ hành chính: khi ca làm việc là ca ngày (ca sáng, ca chiều)</td>
            </tr>
            <tr class="text-left">
              <td>đơn nội tỉnh tối</td>
              <td>đơn nội tỉnh được <span style="background-color: #FFF90B; color: #0D0D0D;">chọn giao tối</span></td>
              <td>giao tối: khi ca làm việc là ca tối</td>
            </tr>
            <tr class="text-left">
              <td>đơn nội tỉnh CN</td>
              <td>đơn nội tỉnh được <span style="background-color: #FFF90B; color: #0D0D0D;">chọn giao CN</span></td>
              <td></td>
            </tr>
            <tr class="text-left">
              <td>đơn nội tỉnh giao nội thành</td>
              <td>đơn nội tỉnh <span style="background-color: #FFF90B; color: #0D0D0D;">giao đến nội thành</span></td>
              <td></td>
            </tr>
            <tr class="text-left">
              <td>đơn nội tỉnh giao huyện</td>
              <td>đơn nội tỉnh <span style="background-color: #FFF90B; color: #0D0D0D;">giao đến huyện</span></td>
              <td></td>
            </tr>
            <tr class="text-left">
              <td>đơn liên tỉnh</td>
              <td>đơn có <span style="background-color: #FFF90B; color: #0D0D0D;">tỉnh lấy # tỉnh giao</span></td>
              <td></td>
            </tr>
            <tr class="text-left">
              <td>đơn nội miền</td>
              <td>đơn liên tỉnh có <span style="background-color: #FFF90B; color: #0D0D0D;">miền của tỉnh giao = miền của tỉnh lấy</span></td>
              <td></td>
            </tr>
            <tr class="text-left">
              <td>đơn liên miền</td>
              <td>đơn liên tỉnh có <span style="background-color: #FFF90B; color: #0D0D0D;">miền của tỉnh giao # miền của tỉnh lấy</span></td>
              <td></td>
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
  name: 'modal-explain-package',

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
