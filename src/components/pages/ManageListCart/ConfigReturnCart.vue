<template>
    <div v-if="fetched">
     <div class="contentHeader">
        <h3 class="ui-block-heading text-left">Config địa chỉ cho giỏ {{cartAlias}}</h3>
        <b-btn type="button" variant="success mb-4" ><router-link :to="{name: 'manage-list-cart/list'}" class="text-header-router">Danh sách tuyến </router-link> </b-btn>
     </div>
     <div class="form-filter">
       <b-form v-for="(address, key) in formData.listAddresses" :key="address.index" >
         <div class="add-border"></div>
         <div class="mt-3 font-weight-bold text-header">Địa điểm {{key + 1}}</div>
          <div class="d-flex justify-content-end">
            <b-button variant="danger" class="delete-element mt-3 buttom-delete ion-trash-b" @click="deleteAddress(address.index)"><i class="sidenav-icon ion ion-md-trash"></i>Xóa</b-button>
          </div>
          <div>
            <b-form-row>
              <b-col md="12">
                 <b-form-group label="Shop">
                   <select-shop-cart
                   :shop="address.shop"
                   :shopKey="address.index"
                   @onChange="selectedShopCarts"
                    ref="shopComponent"
                  ></select-shop-cart>
                 </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Số điện thoại">
                  <b-form-input  v-model="address.tel" type="number"></b-form-input>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Tỉnh/thành phố">
                  <select-province-config-cart :province="address.province" :provinces="provinces" :infoShopCart="provinceIdByShopCart" @selected="address.province = $event" ref="selectProvince"></select-province-config-cart>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Quận/huyện">
                 <select-district-config-cart :district="address.district" :infoShopCart="districtIdByShopCart" :provinceId="address.province" @selected="address.district = $event" ref="selectStations"></select-district-config-cart>
                </b-form-group>
              </b-col>
            </b-form-row>
            </div>
        </b-form>
        <div class="buttom-footer">
          <button @click="addNewAddress" class="btn btn-primary "><i class="sidenav-icon ion ion-md-add"></i>Thêm điểm địa điểm</button>
          <button  class="btn btn-success " @click="saveDataConfigCart()"><i class="sidenav-icon ion ion-ios-save" ></i>Lưu và xem kết quả</button>
        </div>
        <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
     </div>
  </div>
</template>

<script>
import SelectProvinceConfigCart from 'components/elements/FilterBox/SelectProvinceConfigCart'
import SelectDistrictConfigCart from 'components/elements/FilterBox/SelectDistrictConfigCart'
import SelectShopCart from 'components/elements/FilterBox/SelectShopCart'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import * as _ from 'lodash'
import ManageLineService from 'domain/services/manage-line-service'
export default {
  data () {
    return {
      formData: {
        listAddresses: [

        ]
      },
      provinceIdByShopCart: {},
      districtIdByShopCart: {},
      provinces: [],
      count: 0,
      infoShopCart: {},
      shopId: '',
      appLoading: false,
      cartId: this.$route.params.id,
      cartAlias: this.$route.params.alias,
      provinceId: '',
      telShop: '',
      selected:
        {
          district: [],
          shop: [],
          province: [],
          tel: []
        },
      fetched: false,
      formItemIndex: 0
    }
  },
  created () {
    this.getDataConfigShop()
    this.getOptionsProvince()
  },
  components: {
    SelectProvinceConfigCart, SelectDistrictConfigCart, SelectShopCart, LoadingMiniBottom
  },
  methods: {
    addNewAddress () {
      this.formData.listAddresses.push({
        index: this.formItemIndex++,
        shop: {
          id: '',
          name: ''
        },
        tel: '',
        province: {
          id: '',
          name: ''
        },
        district: {
          id: '',
          name: ''
        }
      })
    },
    getOptionsProvince: function () {
      let dataSend = {
        type: 0
      }
      ManageLineService.getProvince(dataSend).then(response => {
        if (response.data.success) {
          this.provinces = response.data.data

          if (!this.multiple) {
            this.provinces.unshift({
              code: '',
              name: this.placeholder
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    getDataConfigShop () {
      let params = {}
      params['cart_id'] = this.cartId
      ManageLineService.getConfigShop(params).then((response) => {
        this.formData.listAddresses = response.data.data.map(item => {
          return {
            index: this.formItemIndex++,
            shop: {
              id: item.shop_id,
              name: item.shop_name
            },
            tel: item.tel,
            province: {
              id: item.province_id,
              name: item.province_name
            },
            district: {
              id: item.district_id,
              name: item.district_name
            }
          }
        })
        if (this.formData.listAddresses.length === 0) {
          this.addNewAddress()
        }
        this.fetched = true
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
      })
    },
    deleteAddress (addressKey) {
      const addressIndex = this.formData.listAddresses.findIndex(item => item.index === addressKey)
      this.formData.listAddresses.splice(addressIndex, 1)
    },
    selectedShopCarts (option, key) {
      const addressIndex = this.formData.listAddresses.findIndex(item => item.index === key)
      if (!_.isNil(option)) {
        this.formData.listAddresses[addressIndex].shop.id = option.id
        this.formData.listAddresses[addressIndex].shop.name = option.name
      }
      let params = {
        shop_id: this.formData.listAddresses[addressIndex].shop.id
      }
      ManageLineService.getInfoShopCart(params).then((response) => {
        if (response.data.success) {
          this.infoShopCart = response.data.data
          this.formData.listAddresses[addressIndex].province.id = this.infoShopCart.province_id
          this.formData.listAddresses[addressIndex].province.name = this.infoShopCart.province
          this.formData.listAddresses[addressIndex].district.id = this.infoShopCart.district_id
          this.formData.listAddresses[addressIndex].district.name = this.infoShopCart.district
          this.formData.listAddresses[addressIndex].tel = this.infoShopCart.tel
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
      })
    },
    saveDataConfigCart () {
      let validated = true
      let params = {
        cart_id: this.$route.params.id,
        pick_addresses: []
      }
      if (this.formData.listAddresses.length === 0) {
        commonHelper.showMessage('Vui lòng lưu ít nhất 1 địa điểm', 'error')
        return
      }
      for (const element of this.formData.listAddresses) {
        if (!element.shop.id) {
          commonHelper.showMessage('Vui lòng chọn shop', 'error')
          validated = false
          break
        }

        if (!element.tel) {
          commonHelper.showMessage('Vui lòng chọn số điện thoại', 'error')
          validated = false
          break
        }

        if (!element.province.id) {
          commonHelper.showMessage('Vui lòng chọn tỉnh/thành phố', 'error')
          validated = false
          break
        }

        if (!element.district.id) {
          commonHelper.showMessage('Vui lòng chọn quận huyện', 'error')
          validated = false
          break
        }
        params.pick_addresses.push({
          shop_id: element.shop.id,
          tel: element.tel,
          province_id: element.province.id,
          district_id: element.district.id
        })
      }
      if (validated) {
        this.appLoading = true
        ManageLineService.saveConfigShop(params).then((response) => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.appLoading = false
          } else {
            commonHelper.showMessage(response.data.message, 'error')
            this.appLoading = false
          }
        }).catch((e) => {
          commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
          this.appLoading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-filter {
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  padding: 20px;
}

.contentHeader {
  display: flex;
  justify-content: space-between;
}
#add-line {
  color: white;
}
.element {
  display: flex;
  justify-content: space-between;
}
.add-border {
  border-top: 1px rgb(156, 153, 153) solid;
}
.buttom-delete {
  border-radius: 30px;
  height: 37px;
  width: 100px;
}

.text-header-router {
  color: white;
}
.buttom-footer {
  display: flex;
  justify-content: space-between;
}
.text-header {
  color: rgb(13, 95, 31);
}
</style>
