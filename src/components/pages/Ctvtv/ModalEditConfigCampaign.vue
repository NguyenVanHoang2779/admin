<template>
  <b-container>
<!--    {{editConfig}}-->
    <b-row>
      <b-col>
        <b-form-group
          id="input-group-5"
          label="Tỉnh được gán: "
          label-for="input-5"
        >
          <multi-select-province v-model="formConfig.provinceIds" :province-ids="editConfig.item.province" @handleProvinceSelected="handleProvinceSelected"></multi-select-province>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          id="input-group-6"
          label="Kho được gán tương ứng: "
          label-for="input-6"
        >
          <multi-select-station :province-ids="formConfig.provinceIds" :station-ids="editConfig.item.station" @handleStationSelected="handleStationSelected"></multi-select-station>
        </b-form-group>
      </b-col>
    </b-row>
    <br>
    <b-row v-if="lenProvinceIds==1">
      <b-col>
        <b-form-group
          id="input-group-9"
          label="Chọn modul tương ứng với kho: "
          label-for="input-9"
        >
          <multi-select-module :module-id="editConfig.item.module" :station-id="formConfig.stationIds" @handleModuleSelected="handleModuleSelected($event)"></multi-select-module>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          id="input-group-10"
          label="Chọn giỏ tương ứng với modul: "
          label-for="input-9"
        >
          <multi-select-cart :cart-id="editConfig.item.cart" :module-ids = "formConfig.moduleId" @handleCartSelected = "handleCartSelected($event)"></multi-select-cart>
        </b-form-group>
      </b-col>
    </b-row>
    <br>
    <b-row>
      <b-col>
        <b-form-group
          id="input-group-7"
          label="Gói tiền công: "
          label-for="input-7"
        >
          <b-form-select
            id="input-7"
            required
            :options = "listRemunerationPackages1"
            v-model="formConfig.remunerationPackage"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          id="input-group-8"
          label="Gói bổ sung`: "
          label-for="input-8"
        >
          <b-form-select
            id="input-8"
            required
            :options="listAdditionalPackage1"
            v-model="formConfig.additionalPackage"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-button class="mt-3" block @click="editConfigCampaign" variant="primary">Cập nhập</b-button>
<!--        <pre>{{formConfig}}</pre>-->
  </b-container>
</template>

<script>
import CtvtvService from 'domain/services/ctvtv-service'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectModule from './MultiSelectModule'
import MultiSelectCart from './MultiSelectCart'
export default {
  computed: {
    lenProvinceIds () {
      if (this.formConfig.stationIds) {
        if (this.formConfig.stationIds.includes(',')) {
          return 2
        } else {
          return 1
        }
      }
    }
  },

  props: ['editConfig', 'id'],

  components: {MultiSelectStation, MultiSelectProvince, MultiSelectModule, MultiSelectCart},

  created () {
    this.formConfig.remunerationPackage = this.editConfig.item.remunerationPackage
    this.formConfig.additionalPackage = this.editConfig.item.additionalPackage
    CtvtvService.getListSelectRemunerationPackage().then(response => {
      if (response.data.success) {
        this.listRemunerationPackages1 = response.data.data
      }
    }).catch(e => {
      this.errors.push(e)
    })
    CtvtvService.getAdditionalPackage().then(response => {
      if (response.data.success) {
        this.listAdditionalPackage1 = response.data.data
      }
    }).catch(e => {
      this.errors.push(e)
    })
  },

  data () {
    return {
      isDisabled: false,
      formConfig: {
        campaignId: this.$route.query.id,
        id: this.editConfig.item.id,
        provinceIds: null,
        stationIds: null,
        moduleId: null,
        cartId: null,
        additionalPackage: null,
        remunerationPackage: null
      },
      listAdditionalPackage1: [],
      listRemunerationPackages1: []
    }
  },

  watch: {
    'formConfig.stationIds': function () {
      this.formConfig.moduleId = null
      this.formConfig.cartId = null
    },
    'formConfig.provinceIds': function () {
      this.formConfig.moduleId = null
      this.formConfig.cartId = null
    }
  },

  methods: {
    editConfigCampaign () {
      CtvtvService.updateConfigCampaign(this.formConfig).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: response.data.message
          })
          this.$emit('exit', true)
          // this.viewListCampaign()
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },

    handleStationSelected: function (option) {
      this.formConfig.stationIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleProvinceSelected: function (option) {
      this.formConfig.provinceIds = option ? option.map((item) => item.id).toString() : ''
    },

    handleModuleSelected (value) {
      this.formConfig.moduleId = value
    },

    handleCartSelected (value) {
      this.formConfig.cartId = value
    }
  }
}
</script>
