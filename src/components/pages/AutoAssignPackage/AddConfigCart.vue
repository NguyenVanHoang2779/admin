<template>
    <div>
        <div class="ui-block">
          <div class="list-order-header col-md-12">
              <b-row style="margin-top: -1em">
                <b-col style="padding-top: 0.5em">
                  <h4 class="ui-block-heading" style="margin: 0px; display: inline-block">Gán giỏ liền kề </h4>
                </b-col>
                <b-col class="text-right">
                  <b-btn variant="success" :to="'/auto-assign/list'">Danh sách khu vực</b-btn>
                </b-col>
              </b-row>
            </div>
            <div class="auto-assign-config-cart" v-if ="this.hasIdArea">
                <form>
                    <b-form-row>
                        <b-form-group label="Tên giỏ" class="col-md-1">
                        </b-form-group>
                        <b-form-group label="Điểm trung tâm" class="col-md-2">
                        </b-form-group>
                        <b-form-group label="Lat" class="col-md-1">
                        </b-form-group>
                        <b-form-group label="Long" class="col-md-1">
                        </b-form-group>
<!--                        <b-form-group class="col-md-6" label="Giỏ liền kề">-->
<!--                        </b-form-group>-->
                        <fieldset data-v-17144331="" class="form-group col-md-6">
                          <span tabindex="-1" class="col-form-label pt-0">Giỏ liền kề</span>
                          <span tabindex="-1"><i class="text-red-color">  (Độ ưu tiên của giỏ giảm dần từ trái qua phải) </i></span>
                        </fieldset>
                        <b-form-group label="" class="col-md-1">
                        </b-form-group>
                    </b-form-row>

                    <div v-for="(item, index) in listCarts" :key="item.cart_id">
                      <b-form-row>
                          <b-form-group label="" class="col-md-1">
                              <p class="auto-assign_text_line_height">{{ item.cart_name }}</p>
                          </b-form-group>
                          <b-form-group label="" class="col-md-2">
                              <b-input type="text" placeholder="Điểm trung tâm" v-model="listCarts[index].center_point" required/>
                          </b-form-group>
                          <b-form-group label="" class="col-md-1">
                              <b-input type="text" placeholder="Lat" v-model="listCarts[index].lat" required/>
                          </b-form-group>
                          <b-form-group label="" class="col-md-1">
                              <b-input type="text" placeholder="Long" v-model="listCarts[index].lng" required/>
                          </b-form-group>

                          <b-form-group class="col-md-5" label="">
                            <multiselect
                              v-model="listCarts[index].cart_neighbor"
                              :options="listCarts[index].optionsCarts"
                              :multiple="true"
                              :placeholder="cartPlaceholder"
                              track-by="name"
                              selectLabel=""
                              :closeOnSelect="false"
                              selectedLabel=""
                              deselectLabel="x"
                              label="name"/>
                          </b-form-group>
                          <b-form-group label="" class="col-md-2 add-config-cart-action">
                            <b-form-row>
                              <a :href="item.editLink" class="col-md-6 text-center">Xem giỏ</a>

                              <b-button size="sm" class="col-md-6" variant="outline-success" @click="openModalEdit(item.cart_name, index)">
                                <i class="ion ion-md-create"></i>
                                Độ ưu tiên
                              </b-button>
                            </b-form-row>
                          </b-form-group>
                      </b-form-row>
                    </div>

                    <b-form-row>
                        <div class="col-md-12">
                            <b-form-group>
                                <span slot="label">&nbsp;</span>
                                <div class="text-center left">
                                    <b-btn @click="subForm()" variant="primary">Lưu thông tin</b-btn>
                                </div>
                            </b-form-group>
                        </div>
                    </b-form-row>
                </form>
            </div>
        </div>

      <!--modal-->
      <b-modal
        ref="configPriority"
        :title=configPriorityCartName
        @ok="configPriority"
        @cancel="cancel"
        cancel-title="Hủy bỏ" static
      >
        <b-form-row>
          <b-form-group label="Tên giỏ" class="col-md-6">
          </b-form-group>
          <b-form-group label="Độ ưu tiên" class="col-md-6">
          </b-form-group>
        </b-form-row>
        <b-form-row v-for="(item) in this.listCartPriority" :key="item.id">
          <b-form-group label="" class="col-md-6">
            <p class="auto-assign_text_line_height">Giỏ {{ item.name }} </p>
          </b-form-group>
          <b-form-group label="" class="col-md-6">
            <b-form-input type="number" placeholder="Độ ưu tiên" min="1" v-model="item.priority" required/>
          </b-form-group>
        </b-form-row>
      </b-modal>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<script>
import Multiselect from 'vue-multiselect'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import MultiSelectCart from '../Ctvtv/MultiSelectCart'
import autoAssignService from 'domain/services/auto-assign-service.js'
import commonHelper from 'infrastructures/helpers/common-helpers'
import axios from 'axios'
import config from 'config/app.base'
import * as _ from 'lodash'

export default {
  name: 'auto-assign',
  components: {
    LoadingMiniBottom,
    Multiselect,
    MultiSelectCart
  },

  props: {
    cartPlaceholder: {
      type: String,
      default: 'Chọn giỏ'
    }
  },

  data: () => ({
    success: true,
    appLoading: false,
    hasIdArea: false,
    name: '',
    listUsers: [],
    idArea: null,
    selectedCart: [],
    listCartNb: [],
    listCarts: [],
    carts: [
      { name: 'Vue.js', value: 'JavaScript' },
      { name: 'Adonis', value: 'JavaScript' },
      { name: 'Rails', value: 'Ruby' },
      { name: 'Sinatra', value: 'Ruby' },
      { name: 'Laravel', value: 'PHP' },
      { name: 'Phoenix', value: 'Elixir' }
    ],

    cartPriority: [],
    configPriorityCartName: '',
    cartLeftConfigPriority: '',
    listCartInArea: [],
    indexCart: 0,
    listCartPriority: [],
    isCheckValidatePriority: true,

    selected: {
      null_default: null,
      province: 'hn_group',
      district: 1,
      station: 1,
      cart: []
    },
    value: null,
    options: ['list', 'of', 'options'],

    provinceIds: 1,
    stationIds: 1,
    limitProp: 1

  }),
  methods: {
    async subForm () {
      let data = {}
      data.id = this.idArea
      data.carts = this.listCarts
      await this.checkValidatePriority()

      console.log(this.listCarts)
      if (this.isCheckValidatePriority) {
        this.$startLoading()
        autoAssignService.updateConfigCart(data).then(res => {
          res = res.data
          if (res.success) {
            commonHelper.showMessage('Cập nhật thành công', 'success')
          } else {
            commonHelper.showMessage(res.message, 'error')
          }
        }).then(() => {
          this.$stopLoading()
        }).catch((e) => {
          console.log(e)
          this.$stopLoading()
          commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        })
      }
    },

    async checkValidatePriority () {
      this.isCheckValidatePriority = true
      this.listCarts.forEach((cart) => {
        let listPriority = []
        if (cart.cart_neighbor.length == 0) {
          commonHelper.showMessage(cart.cart_name + ': Giở liền kề không được để trống', 'error')
          this.isCheckValidatePriority = false
        }
        cart.cart_neighbor.forEach((cartNeighbor) => {
          if (!cartNeighbor.priority) {
            commonHelper.showMessage(cart.cart_name + ': Độ ưu tiên không được để trống', 'error')
            this.isCheckValidatePriority = false
          } else if (cartNeighbor.priority < 1) {
            commonHelper.showMessage(cart.cart_name + ': Độ ưu tiên phải lớn hơn 0', 'error')
            this.isCheckValidatePriority = false
          } else if (cartNeighbor.priority > 127) {
            commonHelper.showMessage(cart.cart_name + ': Độ ưu tiên phải nhỏ hơn 128', 'error')
            this.isCheckValidatePriority = false
          } else {
            listPriority.push(cartNeighbor.priority)
          }
        })

        let listPriorityUnique = [...new Set(listPriority)];
        if (listPriorityUnique.length !== listPriority.length && listPriority.length > 0) {
          commonHelper.showMessage(cart.cart_name + ': Độ ưu tiên không được giống nhau', 'error')
          this.isCheckValidatePriority = false
        }
      })
    },

    getCartData (id) {
      return autoAssignService.getConfigCart(id).then(res => {
        res = res.data
        let dataArea = res.areaInfo
        if (res.success) {
          this.listCarts = res.data
          this.listCarts = this.handleData(this.listCarts, dataArea.station_id)
          this.listCarts.forEach((cart) => {
            cart.cart_neighbor.sort(function (a, b) {
              return a.priority - b.priority
            })
          })
        } else {
          commonHelper.showMessage(res.message, 'error')
          this.listCarts = []
        }
      }).catch(() => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        this.listCarts = []
      })
    },

    getCartByStation (aaId) {
      let dataStation = {
        'aa_id': aaId
      }

      this.carts = []
      return axios.get(config.baseApiUrl + 'AdCarts/getCartByAreaForSelect', {'params': dataStation}).then(response => {
        for (var key of Object.keys(response.data)) {
          // listCartInArea.push({'id': key, 'name': response.data[key]})
          this.listCartInArea.push({
            id: key,
            name: response.data[key]
          })
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },

    handleData (data, stationId) {
      data.forEach(item => {
        item.editLink = '/admin/carts/edit/' + item.cart_id
      })

      this.listCartNb = this.listCartInArea
      data.forEach(item => {
        item.editLink = '/admin/carts/edit/' + item.cart_id

        let cartList = this.listCartInArea.filter(nbCart => {
          return nbCart.id !== item.cart_id
        })
        item.optionsCarts = _.cloneDeep(cartList)
      })

      return data
    },

    openModalEdit (configPriorityCartName, indexCart) {
      this.indexCart = indexCart
      let cart_neighbor = _.cloneDeep(this.listCarts[indexCart].cart_neighbor)
      this.listCartPriority = cart_neighbor

      this.configPriorityCartName = 'Config độ ưu tiên giỏ ' + configPriorityCartName
      this.$refs.configPriority.show()
    },

    configPriority () {
      let isInt = true
      let listPriority = []
      this.listCartPriority.forEach((item) => {
        if (!item.priority) {
          commonHelper.showMessage(item.name + ': Độ ưu tiên không được để trống', 'error')
          isInt = false
          this.isCheckValidatePriority = false
        } else if (item.priority < 1) {
          commonHelper.showMessage(item.name + ': Độ ưu tiên phải lớn hơn 0', 'error')
          this.isCheckValidatePriority = false
          isInt = false
        } else if (item.priority > 127) {
          commonHelper.showMessage(item.name + ': Độ ưu tiên phải nhỏ hơn 128', 'error')
          this.isCheckValidatePriority = false
          isInt = false
        } else {
          listPriority.push(item.priority)
        }

        let listPriorityUnique = [...new Set(listPriority)];
        if (listPriorityUnique.length !== listPriority.length && listPriority.length > 0) {
          commonHelper.showMessage(item.name + ': Độ ưu tiên không được giống nhau', 'error')
          this.isCheckValidatePriority = false
          isInt = false
        }
      })

      if (isInt) {
        this.listCartPriority.sort(function (a, b) {
          return a.priority - b.priority
        })

        this.listCarts[this.indexCart].cart_neighbor = this.listCartPriority
      }
    },

    cancel () {
    }
  },
  async created () {
    const idArea = this.$route.params.id
    if (idArea) {
      this.hasIdArea = true
      this.idArea = idArea
      await this.getCartByStation(idArea)
      await this.getCartData(idArea)
    }
  },
  mounted () {
  },
  computed: {
  },
  metaInfo: {
    title: 'Gán giỏ liền kề'
  }
}
// $(document).ready(function () {
//   $('ul.droptrue').sortable({connectWith: 'ul'
//   })
//
//   $('ul.dropfalse').sortable({
//     connectWith: 'ul',
//     dropOnEmpty: false
//   })
//
//   $('#sortable1, #sortable2, #sortable3').disableSelection()
// })

</script>

<style scoped>
    .center {
        margin: 0 auto;
    }

    #sortable1, #sortable2, #sortable3 { list-style-type: none; margin: 0; float: left; margin-right: 10px; background: #eee; padding: 5px; width: 143px;}
    #sortable1 li, #sortable2 li, #sortable3 li { margin: 5px; padding: 5px; font-size: 1.2em; width: 120px; }

    .align-content-center {
        text-align: center;
    }

    .auto-assign-config-cart {
      padding-top: 30px;
    }

    .auto-assign-config-cart .auto-assign_text_line_height {
      height: 38px;
      line-height: 38px;
    }
    .text-red-color{
      color: red;
      font-size: 0.694rem;
    }
</style>
