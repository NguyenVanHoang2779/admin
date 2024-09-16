<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <div class="header">
          <b-col>
            <h3 class="mt-2">Config các chỉ số COD</h3>
          </b-col>
          <b-row>
            <b-col class="ml-3">
                <b-btn variant="outline-info" @click="openConfigCart()">Config chỉ số hội nhập</b-btn>
                <b-btn class="ml-3" variant="outline-danger" @click="openConfigHardCart()">Config tuyến khó</b-btn>
                <b-btn class="ml-3" variant="outline-primary" @click="openConfigCouponRegion()">Config vùng coupon</b-btn>
                <b-btn class="ml-3" variant="outline-success" @click="openConfigSalaryByCart()">Config đơn giá theo tuyến</b-btn>
            </b-col>
          </b-row>
        </div>
      </b-card-body>
      <br>
    </b-card>
    <br>
    <b-card no-body v-if="configCart">
      <b-card-body>
        <ConfigCart/>
      </b-card-body>
    </b-card>
    <b-card no-body v-if="configHartCart">
      <b-card-body>
        <ConfigHardCart/>
      </b-card-body>
    </b-card>
    <b-card no-body v-if="ConfigCouponRegion">
      <b-card-body>
        <ConfigCouponRegion/>
      </b-card-body>
    </b-card>
    <b-card no-body v-if="configSalaryByCart">
      <b-card-body>
        <ConfigSalaryByCart/>
      </b-card-body>
    </b-card>
  </div>
</template>
<style scoped>
</style>
<script>
import ConfigCart from './ConfigCart'
import ConfigHardCart from './ConfigHardCart'
import ConfigCouponRegion from './ConfigCouponRegion'
import ConfigSalaryByCart from './ConfigSalaryByCart'
export default {
  name: 'config-cod-index',
  components: {
    ConfigCart,
    ConfigHardCart,
    ConfigCouponRegion,
    ConfigSalaryByCart
  },
  data: () => ({
    configCart: true,
    configHartCart: false,
    ConfigCouponRegion: false,
    configSalaryByCart: false
  }),
  methods: {
    openConfigCart () {
      this.resetAllModel()
      this.configCart = true
    },
    resetAllModel () {
      this.configCart = false
      this.configHartCart = false
      this.ConfigCouponRegion = false
      this.configSalaryByCart = false
    },
    openConfigHardCart () {
      this.resetAllModel()
      this.configHartCart = true
    },
    openConfigCouponRegion () {
      this.resetAllModel()
      this.ConfigCouponRegion = true
    },
    openConfigSalaryByCart () {
      this.resetAllModel()
      this.configSalaryByCart = true
    }
  }
}
</script>
