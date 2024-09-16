<template>
    <div>
        <div class="title_object mb-4"><span class="font-weight-bold">Phụ cấp: </span>
            <vue-numeric v-model="objectDetail.cost" class="input-money" currency="đ" v-bind:min="0" v-bind:max="1000000"
                         currency-symbol-position="suffix"></vue-numeric> trên 1 ngày
        </div>
      <div class="title_object mb-2"><span class="font-weight-bold">Thâm niên: </span>
        <vue-numeric v-model="objectDetail.seniority" class="input-money" currency="" v-bind:min="0" v-bind:max="1000"
                     currency-symbol-position="suffix"></vue-numeric> ngày
      </div>
    </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import vueNumeric from 'vue-numeric'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'table-config-type-4',
  props: {
    objectDetail: {
      type: Object,
      required: false,
      default: function () {
        return {
          cost: 0,
          seniority: 0
        }
      }
    }
  },

  components: {
    vueNumeric,
    commonHelper
  },
  watch: {
    objectDetail: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        this.$emit('model', newValue)
      }
    }
  },
  data: () => (
    {
    }
  ),
  computed: {},
  methods: {
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
</style>
