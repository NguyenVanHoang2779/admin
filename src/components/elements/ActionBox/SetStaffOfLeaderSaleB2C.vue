<template>
    <div >
        <div class="sk-wave sk-primary" v-if="loading" style=" height: 40px;margin: 0 auto;">
            <div class="sk-rect sk-rect1"></div> <div class="sk-rect sk-rect2"></div> <div class="sk-rect sk-rect3"></div> <div class="sk-rect sk-rect4"></div> <div class="sk-rect sk-rect5"></div>
        </div>
        <div v-if="!loading">
            <div v-if="leader_id" >
                <button  v-if="!is_staff" @click="assignStaffForLeader"  class="btn btn-success" data-style="expand-left" style="width: 100%">
                    <span class="ladda-label">Thêm nhân viên</span>
                </button>
                <button v-if="is_staff" @click="removeStaffOfLeader"  class="btn btn-danger" data-style="expand-left" style="width: 100%">
                    <span class="ladda-label">Bỏ chọn nhân viên</span>
                </button>
            </div>
            <div  v-if="!leader_id">
                <button :loading="loading" class="btn btn-outline-info" data-style="expand-left" style="width: 100%">
                    <span class="ladda-label">Chọn leader để thao tác tiếp</span>
                </button>
            </div>
        </div>
        <!--<b-badge variant="outline-warning"></b-badge>-->
    </div>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<script>
import shopService from 'domain/services/shop-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
export default {
  name: 'SetStaffOfLeaderSaleB2C',
  props: {
    leader_id: null,
    staff_id: null,
    force_update: 0
  },
  components: {
    LaddaBtn
  },
  data: () => ({
    is_staff: false,
    loading: false
  }),
  methods: {
    assignStaffForLeader () {
      this.loading = true
      if (!this.leader_id) {
        return
      }
      shopService.assignStaffForLeader(this.leader_id, this.staff_id).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              this.is_staff = response.data.data
              this.loading = false
            }
          }
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.loading = false
      })
    },
    removeStaffOfLeader () {
      this.loading = true
      shopService.removeStaffOfLeader(this.leader_id, this.staff_id).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              this.is_staff = !response.data.data
              this.loading = false
            }
          }
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.loading = false
      })
    },
    checkStaffOfLeader () {
      this.loading = true
      shopService.checkStaffOfLeader(this.leader_id, this.staff_id).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              this.is_staff = response.data.data
              if (response.data.data) {
              }
            }
          }
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.$forceUpdate()
        this.loading = false
      })
    }
  },
  watch: {
    leader_id: function (val) {
      if (val) {
        this.checkStaffOfLeader()
      }
      return null
    },
    staff_id: function (val) {
      if (val) {
        this.checkStaffOfLeader()
      }
      return null
    },
    force_update: function (val) {
      if (val) {
        this.checkStaffOfLeader()
      }
      return null
    }
  },
  created () {
    if (this.leader_id) {
      this.checkStaffOfLeader()
    }
  }
}
</script>

<style scoped>
    span.ladda-spinner {
        position: absolute!important;
        top: 20px;
    }
</style>
