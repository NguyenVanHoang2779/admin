<template>
  <div class="row">
<!--    <div style="margin-left: 12px">-->
<!--      <b-btn v-if="!option.disabled"-->
<!--             @click="-->
<!--                   option.disabled = !option.disabled"-->
<!--             variant="danger icon-btn"><span class="ion-md-close"></span>-->
<!--      </b-btn>-->
<!--      <b-btn v-else @click="option.disabled = !option.disabled;-->
<!--                   option.visible = false;-->
<!--                   option.object_id = null" variant="success icon-btn"><span class="ion-md-checkmark"></span>-->
<!--      </b-btn>-->
<!--    </div>-->
    <div class="col-md">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-0" role="tab">
          <b-button class="text-left" block
                    :aria-expanded="option.visible ? 'true' : 'false'"
                    :aria-controls="'accordion-'+ object_type.id"
                    :disabled="option.disabled"
                    @click="option.visible = !option.visible"
                    :variant="option.disabled ? 'outline-danger' : 'outline-primary'"
          >
            #{{object_type.id}} {{object_type.name}}
            <b-badge variant="light">{{ option.object_id }}</b-badge>
            <div class="float-right collapse-icon"></div>
          </b-button>
        </b-card-header>
        <b-collapse :id="'accordion-'+ object_type.id" v-model="option.visible" accordion="accordion">
          <b-card-body>
            <option-config-type @model="option.object_id = $event" v-bind:type_id="object_type.id"></option-config-type>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import vueNumeric from 'vue-numeric'
import kpiCodService from 'domain/services/kpi-cod-service'
// import commonHelper from 'infrastructures/helpers/common-helpers'
import OptionConfigType from './OptionConfigType'
export default {
  name: 'option-choose-config-campaign',
  props: [
    'object_type'
  ],

  components: {
    vueNumeric,
    kpiCodService,
    OptionConfigType
  },
  watch: {
    option: {
      immediate: false,
      deep: true,
      handler (newValue) {
        // if (newValue.disabled) {
        //   this.$emit('model', -1)
        // } else {
        this.$emit('model', parseInt(newValue.object_id))
        // }
      }
    }
  },
  data: () => (
    {
      option: {
        disabled: false,
        visible: false,
        object_id: null
      }
    }
  ),
  computed: {
  },
  methods: {
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
</style>
