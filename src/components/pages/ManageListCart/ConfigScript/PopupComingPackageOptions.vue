<template>
  <div>
    <b-modal scrollable hide-footer title="Loại đơn" v-model="isShowModal" size="lg">
      <b-row class="mb-3" v-for="(props, index) in checkComingPackagePropsCheckboxList" :key="index">
        <b-col cols="3" class="font-weight-bold">{{ props.label }}</b-col>
        <b-col cols="9">
          <span
            class="btn-group-toggle"
            v-for="(option, optIndex) in props.options"
            data-toggle="buttons"
            :key="`${props.id}-${optIndex}`">
            <label
              :class="`btn btn-outline-success border-radius-3 px-3 py-0 mr-1 mb-2 ${(comingPackageOptions[props.id] || []).includes(option) ? 'active' : ''}`"
            >
              <input type="checkbox" @click="()=>{selectOption(props.id, option)}" :value="option.id"/>
              {{ option.name }}
            </label>
          </span>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="3" class="font-weight-bold d-flex align-items-center">
          <b-form-checkbox :checked="!isEmpty(averageOfDeliveryTimeProps.id)">{{ averageOfDeliveryTimeProps.label }}</b-form-checkbox>
        </b-col>
        <b-col cols="9">
          <multiselect
            v-model="comingPackageOptions[averageOfDeliveryTimeProps.id]"
            :multiple="true"
            track-by="id"
            label="id"
            :placeholder="averageOfDeliveryTimeProps.placeholder"
            :options="averageOfDeliveryTimeProps.options"
          />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="3" class="font-weight-bold d-flex align-items-center">
          <b-form-checkbox :checked="!isEmpty(pickProvinceProps.id)">{{ pickProvinceProps.label }}</b-form-checkbox>
        </b-col>
        <b-col cols="9">
          <multiselect
            v-model="comingPackageOptions[pickProvinceProps.id]"
            :multiple="true"
            track-by="id"
            label="name"
            :placeholder="pickProvinceProps.placeholder"
            :options="provinceOptions"
          />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="3" class="font-weight-bold d-flex align-items-center">
          <b-form-checkbox :checked="!isEmpty(shopProps.id)">{{ shopProps.label }}</b-form-checkbox>
        </b-col>
        <b-col cols="9">
          <multi-select-shop-for-deliver-cart-scripts :selected="comingPackageOptions[shopProps.id]" @onChange="handleSelectShops($event, shopProps.id)" />
        </b-col>
      </b-row>
      <div class="text-center">
        <b-button class="w-75 mt-3" variant="success" @click.prevent="$emit('closed')">Lưu</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import DeliveryScript from '../../../../domain/entities/DeliveryScript'
import MultiSelectShopForDeliverCartScripts from '../../../elements/common/MultiSelectShopForDeliverCartScripts.vue'
import * as _ from 'lodash'

import multiselect from 'vue-multiselect'

export default {
  name: 'PopupComingPackageOptions',
  components: {
    DeliveryScript,
    multiselect,
    MultiSelectShopForDeliverCartScripts
  },
  props: {
    comingPackageOptions: {
      type: Object,
      default: () => ({})
    },
    sessionElementOrder: {
      type: Number,
      required: true
    },
    taskElementOrder: {
      type: Number,
      required: true
    },
    provinceOptions: {
      type: Array,
      required: true
    }
  },
  computed: {
    checkComingPackagePropsCheckboxList () {
      return DeliveryScript.checkComingPackagePropsCheckboxList
    },
    averageOfDeliveryTimeProps () {
      return DeliveryScript.averageOfDeliveryTimeProps
    },
    pickProvinceProps () {
      return DeliveryScript.pickProvinceProps
    },
    shopProps () {
      return DeliveryScript.shopProps
    }
  },
  data () {
    return {
      isShowModal: true,
      checked: true,
      select: ''
    }
  },
  methods: {
    selectOption (propsValue, option) {
      this.$set(this.comingPackageOptions, propsValue, _.xor((this.comingPackageOptions[propsValue] || []), [option]))
      if (_.isEmpty(this.comingPackageOptions[propsValue])) {
        this.$delete(this.comingPackageOptions, propsValue)
      }
    },
    handleSelectShops (option, propValue) {
      this.$set(this.comingPackageOptions, propValue, option)
    },
    isEmpty (propValue) {
      return _.isEmpty(this.comingPackageOptions[propValue])
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
  }
}
</script>
<style scoped>
.custom-option-checkbox label {
  border-radius: 50px !important;
}
</style>
