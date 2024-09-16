<template>
  <div>
      <multiselect :class="customClass"
      v-model="option"
      :options="options"
      :multiple="true"
      :placeholder="placeholder"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :disabled="isDisabled"
      :limit="limitProp"
      :hide-selected="hideSelected"
      :close-on-select="autoClose"
      @input="onInput()"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="placeholder" class="placeholder">{{placeholder}}</span>
    </multiselect>
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
import driverxService from 'domain/services/driverx-service'

export default {
  name: 'multi-select-station',

  components: {
    Multiselect
  },

  props: {
    reset: {},
    autoClose: {
      default: true
    },
    hideSelected: {
      default: false
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Chọn loại giấy tờ'
    },
    customClass: {
      type: String,
      default: 'multiselect-primary'
    },
    documentTypes: {
      default: ''
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  mounted () {
    this.getList()
  },

  watch: {
    option (newValue) {
      this.$emit('change', newValue)
    },

    reset () {
      this.option = []
    },

    documentTypes () {
      this.setList()
    }
  },

  methods: {
    onInput () {
      this.$emit('handleSelected', this.option)
    },

    setList () {
      if (this.documentTypes) {
        this.option = []
        this.documentTypes.split(',').forEach(documentId => {
          let doc = this.options.find(op => (('' + op.id) === documentId))
          if (doc) this.option.push(doc)
        })
      } else this.option = null
    },

    getList: function () {
      driverxService.getDocumentTypes()
        .then(({data}) => {
          if (data.success) {
            this.options = data.list
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
