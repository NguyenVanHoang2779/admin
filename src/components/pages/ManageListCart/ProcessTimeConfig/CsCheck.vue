<template>
  <div>
    <b-row>
      <b-col md="12">
        <b-form-checkbox
          id="checkbox-config-cs-check"
          v-model="value.is_configure"
          name="checkbox-config-cs-check"
          @input="changeConfig"
        >
          <b>Yêu cầu CS check</b>
        </b-form-checkbox>
      </b-col>
    </b-row>

    <b-form-group v-if="Boolean(value.is_configure)">
      <b-row class="mt-2 ml-sm--1 form-inline">
        <b-col md="2"><span>Shop gửi BC</span></b-col>
        <b-col md="10">
          <multiselect
            class="multiselect select-size"
            v-model="value.percent_sent_at_post_office"
            placeholder="Chọn tỉ lệ shop gửi BC"
            :options="PercentOptions"
            :multiple="false"
            :custom-label="customLabel"
            deselect-label="✗"
            selected-label="✓"
            select-label="✓"
            @input="changeConfig"
          />
        </b-col>
      </b-row>

      <b-row class="mt-2 ml-sm--1 form-inline">
        <b-col md="2"><span>Lấy thành công</span></b-col>
        <b-col md="10" >
          <multiselect
            class="multiselect select-size"
            v-model="value.percent_pick_success"
            :options="PercentOptions"
            placeholder="Chọn tỉ lệ lấy hàng thành công"
            :multiple="false"
            :custom-label="customLabel"
            deselect-label="✗"
            selected-label="✓"
            select-label="✓"
            @input="changeConfig"
          />
        </b-col>
      </b-row>

      <b-row class="mt-2 ml-sm--1 form-inline">
        <b-col md="2"><span>Cân nặng</span></b-col>
        <b-col md="6">
          <multi-select-features
            class="select-size"
            :multiple="true"
            :placeholder="'Chọn shop tag'"
            :options="Options.packageWeights"
            :master="Master.packageWeights"
            :selected="value.package_weights"
            :disabled="false"
            style="padding-left: 20px!important;"
            @onChange="handleSelectFeatures($event, 'package_weight')"
          />
        </b-col>

        <b-col md="1"><span  style="padding-left: 10px!important;">Tỉ lệ</span></b-col>
        <b-col md="3">
          <multiselect
            class="multiselect"
            v-model="value.percent_package_weight"
            :options="PercentOptions"
            placeholder="Chọn tỉ lệ"
            :multiple="false"
            :custom-label="customLabel"
            deselect-label="✗"
            selected-label="✓"
            select-label="✓"
            style="max-width: 165px!important;"
            @input="changeConfig"
          />
        </b-col>
      </b-row>

      <b-row class="mt-2 ml-sm--1 form-inline">
        <b-col md="2"><span>Shop tag</span></b-col>
        <b-col md="10">
          <multi-select-features
            class="select-features-size"
            :multiple="true"
            :placeholder="'Chọn shop tag'"
            :options="Options.shopTags"
            :master="Master.shopTags"
            :selected="value.shop_tags"
            :disabled="false"
            @onChange="handleSelectFeatures($event, 'shop_tag')"
          />
        </b-col>
      </b-row>
    </b-form-group>
  </div>
</template>

<script>
import * as _ from 'lodash'
import Multiselect from 'vue-multiselect'
import CartScript from '../../../../domain/entities/CartScript'
import MultiSelectFeatures from '../../../elements/common/MultiSelectFeatures'

export default {
  name: 'CsCheck',

  components: {
    Multiselect,
    MultiSelectFeatures
  },

  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({
    Options: CartScript.getOptions(),
    Master: CartScript.getMasterTagData(),
    PercentOptions: _.range(1, 101, 1)
  }),

  methods: {
    customLabel (obj) {
      return `${obj} %`
    },

    handleSelectFeatures (options, feature) {
      if (feature === 'package_weight') {
        this.value.package_weights = options
      } else {
        this.value.shop_tags = options
      }
      this.formatConfigCsCheck()
      this.$emit('updatedCsCheckConfig', this.value)
    },

    changeConfig () {
      this.formatConfigCsCheck()
      this.$emit('updatedCsCheckConfig', this.value)
    },

    formatConfigCsCheck () {
      const isConfiguredCsCheck = Boolean(this.value.is_configure)
      this.value.percent_sent_at_post_office = isConfiguredCsCheck ? this.value.percent_sent_at_post_office : null
      this.value.percent_pick_success = isConfiguredCsCheck ? this.value.percent_pick_success : null
      this.value.percent_package_weight = isConfiguredCsCheck ? this.value.percent_package_weight : null
      this.value.package_weights = isConfiguredCsCheck ? this.value.package_weights : []
      this.value.shop_tags = isConfiguredCsCheck ? this.value.shop_tags : []
    }
  },
  computed: {
    configData: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('updatedCsCheckConfig', value)
      }
    }
  }
}
</script>

<style scoped>
  .select-size {
    padding-left: 20px!important;
    max-width: 590px!important;
  }

  .select-features-size {
    padding-left: 20px!important;
    max-width: 635px!important;
  }
</style>
