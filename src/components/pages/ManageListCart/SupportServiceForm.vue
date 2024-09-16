<template>
  <b-form>
    <b-form-row>
      <b-col md="8">
        <b-form-group label="Dịch vụ hỗ trợ">
          <b-form-checkbox v-model=" is_service_configured "></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-form-row>

    <b-form-row v-if=" is_service_configured " v-for="(service, index) in cart_services"
      :key=" service.id ">
      <b-col md="5">
        <b-form-group label="Dịch vụ">
          <select-service
            :type="'service'"
            :multiple="true"
            :placeholder="'Chọn dịch vụ'"
            :options="serviceOptions"
            :showCurrentSelectedInOptionList="true"
            @onChange="handleSelectService($event, index)"
            ref="serviceComponent"
            :selected="getSelectedService(index)"
          ></select-service>
        </b-form-group>
        <b-form-group class="pl-3">
          <b-form inline>
            <label class="mb-1 font-weight-normal" :for="'checkbox_address_' + service['id']">Config quận giao</label>
            <i v-b-popover.hover.left="'Config quận giao: Các đơn hàng có điểm giao tại các quận được chọn mới được gán dịch vụ.'" class="fa fa-info-circle ml-2" ></i>
            <b-form-checkbox class="ml-2" :id="'checkbox_address_' + service['id']" @change="handleAddressCheckboxChange($event, index)" v-model=" service['is_address_configured'] "></b-form-checkbox>
          </b-form>
          <div v-show="service['is_address_configured']" :key=" service.id ">
            <multi-select-service-address
              @onChange="handleSelectAddresses($event, index)"
              :type="[3,7]"
              :parent_id="parent_address_ids"
              :multiple="true"
              :selected="service['config_addresses']"
            ></multi-select-service-address>
          </div>
        </b-form-group>
        <b-form-group class="pl-3">
          <b-form inline>
            <label class="mb-1 font-weight-normal" :for="'checkbox_shop_' + service['id']">Config shop</label>
            <i v-b-popover.hover.left="'Config shop: Các đơn hàng của những shop được chọn sẽ mặc định được gán dịch vụ.'" class="fa fa-info-circle ml-2" ></i>
            <b-form-checkbox class="ml-2" :id="'checkbox_shop_' + service['id']" @change="handleShopCheckboxChange($event, index)" v-model=" service['is_shop_configured'] "></b-form-checkbox>
          </b-form>
          <div v-show="service['is_shop_configured']" :key=" service.id ">
            <multi-select-shop-carts
              @onChange="handleSelectShops($event, index)"
              :multiple="true"
              :selected="service['config_shops']"
            ></multi-select-shop-carts>
          </div>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="CoD lấy">
          <multi-select-name-of-cod
            @onChange=" handleSelectMainCods( $event, index ) "
            :multiple=" false "
            :selected="cart_services[index]['main_cods']"
            :positionJob="pkxPositionJobs"
          >
          </multi-select-name-of-cod>
        </b-form-group>
        <b-form-group label="CoD lấy bổ sung">
          <multi-select-name-of-cod
            @onChange="handleSelectSecondaryCods( $event, index )"
            :multiple="true"
            :selected="cart_services[index]['secondary_cods']"
            :positionJob="pkxPositionJobs"
          >
          </multi-select-name-of-cod>
        </b-form-group>
      </b-col>
      <b-col md="1">
        <b-form-group>
          <template v-slot:label>&nbsp;</template>
          <ladda-btn :loading=" false " @click.native=" deleteThisRow( index ) " data-style="expand-right"
            class="btn btn-md btn-outline-danger">
            <i class="ion ion-md-trash"></i>
          </ladda-btn>
        </b-form-group>
      </b-col>
    </b-form-row>

    <b-form-row v-if=" is_service_configured " class="text-center">
      <b-col md="12">
        <b-form-group>
          <ladda-btn v-if=" is_service_configured " @click.native=" addRow " data-style="expand-right"
            class="btn btn-outline-success add-address5">
            <i class="ion ion-md-add"></i>Thêm dịch vụ
          </ladda-btn>
        </b-form-group>
      </b-col>
    </b-form-row>
  </b-form>
</template>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import * as _ from 'lodash'

import MultiSelectNameOfCod from '../../elements/common/MultiSelectNameOfCod'
import SelectService from '../../elements/common/SelectService'
import manageLineService from '../../../domain/services/manage-line-service'
import MultiSelectServiceAddress from '../../elements/FilterBox/MultiSelectServiceAddress'
import MultiSelectShopCarts from '../../elements/common/MultiSelectShopCarts'

export default {
  name: 'SupportServiceForm',
  components: {
    MultiSelectNameOfCod,
    LaddaBtn,
    SelectService,
    MultiSelectServiceAddress,
    MultiSelectShopCarts
  },
  async created () {
    await this.getAllServices()
    await this.getApplyingServices()
  },
  props: {
    parent_address_ids: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    cart_services: [
      {
        id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
        service_ids: [],
        main_cods: [],
        secondary_cods: [],
        config_shops: [],
        config_addresses: [],
        is_shop_configured: false,
        is_address_configured: false
      }
    ],
    availableServices: [],
    is_service_configured: false,
    pkxPositionJobs: [232] // OSNV 1160 Position job của PKX
  }),
  methods: {
    async getAllServices () {
      try {
        this.availableServices = await manageLineService.getAllServiceTypes()
      } catch (reason) {
        this.message = reason.toString()
      }
    },
    async getApplyingServices () {
      if (_.isEmpty(this.$route.params.id)) {
        this.cart_services = []
        return
      }
      try {
        const dataSend = {
          cart_id: this.$route.params.id
        }
        this.cart_services = await manageLineService.getCartServices(dataSend)
        if (this.cart_services.length > 0) {
          this.is_service_configured = true
        }
        this.cart_services.forEach((cartService, index) => {
          cartService['id'] = 'id_' + new Date().getTime().toString() + '_' + Math.random().toString()
          if (cartService['config_addresses'].length > 0) {
            cartService['is_address_configured'] = true
          }
          if (cartService.config_shops.length > 0) {
            cartService.is_shop_configured = true
          }
        })
      } catch (reason) {
        this.message = reason.toString()
      }
    },
    getSelectedService (index) {
      if (this.cart_services[index]) {
        return this.availableServices.filter(service => this.cart_services[index]['service_ids'].includes(service.service_id))
      }
      return []
    },
    handleSelectMainCods (option, index) {
      if (!_.isEmpty(option)) {
        this.cart_services[index]['main_cods'][0] = option
      } else {
        this.cart_services[index]['main_cods'] = []
      }
    },
    handleSelectSecondaryCods (option, index) {
      this.cart_services[index]['secondary_cods'] = option
    },
    handleSelectService (option, index) {
      if (!_.isEmpty(option)) {
        this.cart_services[index]['service_ids'] = option
      } else {
        this.cart_services[index]['service_ids'] = []
      }
    },
    handleSelectAddresses (option, index) {
      if (!_.isEmpty(option)) {
        this.cart_services[index]['config_addresses'] = option
      } else {
        this.cart_services[index]['config_addresses'] = []
      }
    },
    handleSelectShops (option, index) {
      if (!_.isEmpty(option)) {
        this.cart_services[index]['config_shops'] = option
      } else {
        this.cart_services[index]['config_shops'] = []
      }
    },
    addRow () {
      this.cart_services.push({
        id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
        service_ids: [],
        main_cods: [],
        secondary_cods: [],
        config_shops: [],
        config_addresses: [],
        is_shop_configured: false,
        is_address_configured: false
      })
    },
    deleteThisRow (index) {
      this.cart_services.splice(index, 1)
    },
    removeCheckbox () {
      this.is_service_configured = false
      this.cart_services = [
        {
          id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
          service_ids: [],
          main_cods: [],
          secondary_cods: [],
          config_shops: [],
          config_addresses: [],
          is_shop_configured: false,
          is_address_configured: false
        }
      ]
    },
    handleAddressCheckboxChange (checked, index) {
      const obj = this.cart_services[index]
      obj['is_address_configured'] = checked
      this.cart_services.splice(index, 1, obj)
    },
    handleShopCheckboxChange (checked, index) {
      const obj = this.cart_services[index]
      obj['is_shop_configured'] = checked
      this.cart_services.splice(index, 1, obj)
    }
  },
  computed: {
    serviceOptions () {
      const selectedServiceIds = this.cart_services.map((service) => service.service_ids).flat()
      const filteredServices = this.availableServices.filter((service) => {
        return !selectedServiceIds.includes(service.service_id)
      })
      return filteredServices
    }
  },
  watch: {
    'cart_services': {
      deep: true,
      handler: function () {
        if (_.isEmpty(this.cart_services)) {
          this.removeCheckbox()
        }
        this.$emit('input', [this.cart_services, this.is_service_configured])
      }
    },
    'is_service_configured': {
      deep: true,
      handler: function () {
        if (!this.is_service_configured) {
          this.$emit('input', [[], this.is_service_configured])
        } else {
          this.$emit('input', [this.cart_services, this.is_service_configured])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
