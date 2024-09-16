<template>
  <div>
    <multiselect class="multiselect-primary"
                 v-model="option"
                 :options="options"
                 :multiple="true"
                 placeholder="Chọn giỏ"
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
<!--    {{moduleIds}}-->
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
  name: 'multi-select-station',

  components: {
    Multiselect
  },

  props: {
    moduleIds: {},
    cartId: {},
    stationIds: {},
    autoClose: {},
    hideSelected: {},
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    }
  },

  data: () => ({
    cartIds: null,
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
      this.$emit('handleCartSelected', result)
    },

    moduleIds: function (newVal, oldVal) {
      this.getList()
    }
  },

  methods: {
    setList (newValue) {
      this.cartIds = []
      newValue.forEach(item => {
        if (item) this.cartIds.push(item.id)
      })
      return this.cartIds.toString()
    },

    getList: function () {
      let params = {
        'id': this.moduleIds
      }
      CtvtvService.getAllCartByModuleIds(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            if (this.cartId) {
              this.option = []
              this.cartId.split(',').forEach(cartId => {
                let option = this.options.find(op => (op.id) === cartId)
                if (option) this.option.push(option)
              })
            }
          } else {
            this.options = []
            this.option = []
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
