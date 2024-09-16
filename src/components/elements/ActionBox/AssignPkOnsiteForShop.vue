<template>
  <div >
    <div class="sk-wave sk-primary" v-if="loading" style=" height: 40px;margin: 0 auto;">
      <div class="sk-rect sk-rect1"></div> <div class="sk-rect sk-rect2"></div> <div class="sk-rect sk-rect3"></div> <div class="sk-rect sk-rect4"></div> <div class="sk-rect sk-rect5"></div>
    </div>
    <div v-if="!loading">
      <div v-if="shop_code">
        <button  v-if="is_assign == 0" @click="assignPkOnsiteForShop" class="btn btn-success" data-style="expand-left" style="width: 100%">
          <span class="ladda-label">Gán phụ kho onsite</span>
        </button>
        <button v-if="is_assign == 1" @click="removePkOnsiteOfShop" class="btn btn-danger" data-style="expand-left" style="width: 100%">
          <span class="ladda-label">Gỡ gán phụ kho onsite</span>
        </button>
      </div>
      <div>
      <div v-if="!shop_code">
        <button :loading="loading" class="btn btn-outline-info" data-style="expand-left" style="width: 100%">
          <span class="ladda-label">Chọn shop để thao tác tiếp</span>
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<script>
import shopService from 'domain/services/shop-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
export default {
  name: 'AssignPkOnsiteForShop',
  props: {
    shop_code: null,
    staff_type: null,
    username: null,
    fullname: null,
    user_id: null,
    group: null,
    is_assign: null,
    station: null,
    total_item: null
  },
  components: {
    LaddaBtn
  },
  data: () => ({
    loading: false
  }),
  // computed: {
  //   localIsAssign: {
  //     get () {
  //       return this.is_assign
  //     },
  //     set (value) {
  //       this.is_assign = value
  //     }
  //   }
  // },
  methods: {
    assignPkOnsiteForShop () {
      this.loading = true
      shopService.assignPkOnsiteForShop(this.user_id, this.shop_code).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
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
        this.checkAssign()
      })
    },
    removePkOnsiteOfShop () {
      this.loading = true
      shopService.removePkOnsiteOfShop(this.user_id, this.shop_code).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
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
        let localTotalItem = this.total_item - 1
        this.$emit('totalItemWasUpdated', localTotalItem)
        this.checkAssign()
      })
    },
    checkAssign () {
      this.loading = true
      shopService.checkAssign(this.user_id, this.shop_code, this.group).then(response => {
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
              let localIsAssign = response.data.data.is_assign
              this.$emit('isAssignWasUpdated', localIsAssign)
              this.$forceUpdate()
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
    }
  },
  watch: {
    shop_code: function (val) {
      if (val) {
        this.checkAssign()
      }
      return null
    },
    is_assign: function () {
      this.checkAssign()
    }
    // username: function (val) {
    //   if (val) {
    //     this.checkAssign()
    //   }
    //   return null
    // },
    // fullname: function (val) {
    //   if (val) {
    //     this.checkAssign()
    //   }
    //   return null
    // },
    // staff_type: function (val) {
    //   if (val) {
    //     this.checkAssign()
    //   }
    //   return null
    // },
    // station: function (val) {
    //   if (val) {
    //     this.checkAssign()
    //   }
    // }
    // force_update: function (val) {
    //   if (val) {
    //     this.checkAssign()
    //   }
    // },
  },
  created () {
    // this.checkAssign()
  }
}
</script>

<style scoped>
span.ladda-spinner {
  position: absolute!important;
  top: 20px;
}
</style>
