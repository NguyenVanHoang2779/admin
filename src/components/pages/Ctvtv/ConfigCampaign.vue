<template>
  <div>
<!--    bắt đầu modal thêm campain-->
    <b-modal title="Thêm cấu hình" ref="modal-create-config" size="lg" hide-footer>
      <modal-config-campaign @exit="closeModal" :id="fId.id"></modal-config-campaign>
    </b-modal>
<!--    kết thúc modal thêm campain-->
<!--    bắt đầu modal sửa -->
    <b-modal title="Sửa cấu hình" ref="modal-edit-config" size="lg" hide-footer>
  `   <modal-edit-config-campaign @exit="closeModalEdit" :editConfig="editConfig" ></modal-edit-config-campaign>
    </b-modal>
<!--    kết thúc modal sửa-->
    <b-row>
      <h3>{{receiveDataroute.name}} ( Bắt đầu từ {{receiveDataroute.from}} đến {{receiveDataroute.to}} )</h3>
    </b-row>
    <h3 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div></div>
      <b-btn id="show-btn" @click="showModalCreateConfigCampaign" variant="primary btn-round" class="d-block"><span class="ion ion-md-add"></span>&nbsp;Thêm config</b-btn>
    </h3>
  <b-card>
    <b-table
      :fixed="fixed"
      id="my-table"
      small :fields="fields"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      responsive="sm">
      <template v-slot:cell(province)="data">
<!--        {{data}}-->
        <multi-select-province :province-ids="data.item.province" @handleProvinceSelected="handleProvinceSelected($event, data.item.id)" :isDisabled="true" ></multi-select-province>
      </template>
      <template v-slot:cell(station)="data">
<!--        {{data}}-->
        <multi-select-station :province-ids="data.item.province" :station-ids="data.item.station" @handleStationSelected="handleStationSelected($event, data.item.id)" :isDisabled="true"></multi-select-station>
      </template>
      <template v-slot:cell(module)="data">
        <multi-select-module :module-id="data.item.module" :station-id="data.item.station" @handleModuleSelected="handleModuleSelected($event)" :isDisabled="true"></multi-select-module>
      </template>
      <template v-slot:cell(cart)="data">
        <multi-select-cart :cart-id="data.item.cart" :module-ids = "data.item.module" @handleCartSelected="handleCartSelected($event)" :isDisabled="true"></multi-select-cart>
      </template>
      <template v-slot:cell(remunerationPackage)="data">
        <b-form-select
          id="input-1"
          required
          :options = "listRemunerationPackages"
          v-model="data.item.remunerationPackage"
          :disabled="true"
        ></b-form-select>
<!--        <multiselect v-model="data.item.remunerationPackage" :options = "listRemunerationPackages"  placeholder="Chọn gói tiền" label="name" track-by="name"></multiselect>-->
      </template>
      <template v-slot:cell(additionalPackage)="data">
        <b-form-select
          id="input-2"
          required
          :options="listAdditionalPackage"
          v-model="data.item.additionalPackage"
          :disabled="true"
        ></b-form-select>
      </template>
      <template v-slot:cell(save)="data">
        <div>
          <b-button variant="outline-info icon-btn" class="d-block btn-lg" block @click="saveConfig(data)"><span class="ion ion-md-create"></span></b-button>
        </div>
      </template>
    </b-table>
  </b-card>
  <br>
  <div class="overflow-auto">
    <b-pagination
      v-model="currentPage"
      :items="items"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      align="right"
    ></b-pagination>
  </div>
    <b-btn id="back" @click="btnBack" variant="success btn-round" class="d-block"><span class="ion ion-md-return-left"></span>&nbsp;Quay lại</b-btn>
<!--    start modal thông báo không tìm thấy dữ liệu-->
    <b-modal ref="modal-noti" hide-footer title="Thông báo">
      <div class="d-block text-center">
        <h3>Campaign chưa được gán với bất kì gói tiền công cộng tác viên nào cụ thể, bạn có thể đóng thông báo và tạo chúng</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Đóng</b-button>
    </b-modal>
<!--    end modal thông báo không tìm thấy dữ liệu-->
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import ModalEditConfigCampaign from './ModalEditConfigCampaign'
import ModalConfigCampaign from './ModalConfigCampaign'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import CtvtvService from 'domain/services/ctvtv-service'
import MultiSelectModule from './MultiSelectModule'
import MultiSelectCart from './MultiSelectCart'

export default {
  components: {
    MultiSelectModule,
    MultiSelectCart,
    ModalConfigCampaign,
    MultiSelectStation,
    MultiSelectProvince,
    ModalEditConfigCampaign,
    Multiselect
  },

  computed: {
    rows () {
      return this.items.length
    }
  },

  created () {
    this.showConfig()
    CtvtvService.getCampaign(this.fId).then(response => {
      this.receiveDataroute.name = response.data.data.campaign_name
      this.receiveDataroute.from = response.data.data.active_time
      this.receiveDataroute.to = response.data.data.expire_time
    }).catch(e => {
      this.errors.push(e)
    })
    CtvtvService.getListSelectRemunerationPackage().then(response => {
      if (response.data.success) {
        this.listRemunerationPackages = response.data.data
      }
    }).catch(e => {
      this.errors.push(e)
    })
    CtvtvService.getAdditionalPackage().then(response => {
      if (response.data.success) {
        this.listAdditionalPackage = response.data.data
      }
    }).catch(e => {
      this.errors.push(e)
    })
  },

  methods: {
    hideModal () {
      this.$refs['modal-noti'].hide()
    },

    btnBack () {
      this.$router.push({ name: 'manager-campaign' })
    },

    saveConfig (row) {
      this.editConfig = row
      this.$refs['modal-edit-config'].show()
    },

    showConfig () {
      this.$startLoading()
      CtvtvService.getConfigCampaign(this.fId).then(response => {
        if (response.data.success) {
          if (response.data.data === 'special') {
            this.$router.push({ name: 'manager-campaign' })
          }
          this.items = response.data.data
          this.$stopLoading()
        } else {
          this.$refs['modal-noti'].show()
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },

    closeModal () {
      this.$refs['modal-create-config'].hide()
      this.showConfig()
    },

    closeModalEdit () {
      this.$refs['modal-edit-config'].hide()
      // this.showConfig()
      location.reload()
    },

    showModalCreateConfigCampaign () {
      this.$refs['modal-create-config'].show()
    },
    handleStationSelected: function (option, id) {
      if (!this.formConfig[id]) {
        this.formConfig[id] = {}
      }
      this.formConfig[id].stationIds = option ? option.map((item) => item.id).join(',') : ''
    },

    handleProvinceSelected: function (option, id) {
      if (!this.formConfig[id]) {
        this.formConfig[id] = {}
      }
      this.formConfig[id].provinceIds = option ? option.map((item) => item.id).join(',') : ''
    },

    handleModuleSelected (value) {
      this.formConfig1.moduleId = value
    },

    handleCartSelected (value) {
      this.formConfig1.cartId = value
    }
  },

  data () {
    return {
      editConfig: {},
      fixed: true,
      fId: {
        id: this.$route.query.id
      },
      receiveDataroute: {
        name: '',
        from: '',
        to: ''
      },
      formConfig: [],
      formConfig1: {
        moduleId: null,
        cartId: null
      },
      listRemunerationPackages: [],
      perPage: 9,
      currentPage: 1,
      fields: [
        {key: 'province', label: 'Tỉnh được gán'},
        {key: 'station', label: 'Kho được gán'},
        {key: 'module', label: 'Module được gán'},
        {key: 'cart', label: 'Giỏ được gán'},
        {key: 'remunerationPackage', label: 'Gói tiền công được áp dụng'},
        {key: 'additionalPackage', label: 'Gói bổ sung'},
        {key: 'save', label: ''}
      ],
      items: [],
      listAdditionalPackage: [],
      options: [
        { name: 'Vue.js', language: 'JavaScript' },
        { name: 'Rails', language: 'Ruby' },
        { name: 'Sinatra', language: 'Ruby' },
        { name: 'Laravel', language: 'PHP' },
        { name: 'Phoenix', language: 'Elixir' }
      ]
    }
  }
}
</script>
