<template>
  <div>
    <multiselect class="multiselect-primary"
                 v-model="option"
                 :options="options"
                 :multiple="true"
                 placeholder="Chọn module"
                 label="name"
                 track-by="name"
                 selectedLabel="Đã chọn"
                 deselectLabel="Bỏ chọn"
                 selectLabel="Chọn"
                 :disabled="isDisabled"
                 :limit="limitProp"
                 :hide-selected="hideSelect"
                 :close-on-select="autoClosed"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
<!--    <div><pre>{{stationId}}</pre></div>-->
<!--    <div><pre>{{options}}</pre></div>-->
<!--    <div><pre>{{option}}</pre></div>-->
  </div>
</template>

<style scoped>
  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
  }
  .non-blur >>> .multiselect__tags {
    background: white;
  }
  .non-blur >>> .multiselect__tag-icon {
    display: none
  }
  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import CtvtvService from 'domain/services/ctvtv-service'

export default {
  name: 'multi-select-module',

  components: {
    Multiselect
  },

  props: {
    stationId: {},
    autoClose: {},
    hideSelected: {},
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    moduleId: {}
  },

  data: () => ({
    moduleIds: null,
    autoClosed: true,
    hideSelect: false,
    option: [],
    options: []
  }),

  created () {
    if (this.autoClose !== undefined && this.autoClose !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
    this.getList()
  },

  watch: {
    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    option: function (newValue) {
      let result = this.setList(newValue)
      this.$emit('handleModuleSelected', result)
    },
    stationId: function (newValue) {
      this.getList()
    }
  },

  methods: {
    setList (newValue) {
      if (newValue) {
        this.moduleIds = []
        newValue.forEach(item => {
          if (item) this.moduleIds.push(item.id)
        })
        return this.moduleIds.toString()
      }
    },

    getList () {
      let params = {
        'id': this.stationId
      }
      CtvtvService.getAllModuleByStationId(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            // this.setList()
            if (this.moduleId) {
              this.option = []
              this.moduleId.split(',').forEach(moduleId => {
                let option = this.options.find(op => (op.id) === moduleId)
                if (option) this.option.push(option)
              })
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
