<template>
    <multiselect
      v-model="option"
      :options="options"
      :group-values="hasGroup ? 'types' : null"
      :group-label="hasGroup ? 'group' : null"
      :group-select="hasGroup && groupSelect"
      :disabled="disabled"
      :multiple="multiple"
      :class="customClass"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      selectGroupLabel=""
      deselectGroupLabel="X"
      :hide-selected="hideSelect"
      :close-on-select="autoClose"
      @input="val => {$emit('input', val)}"
      @select="val => {$emit('select', val)}"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
      <template slot="option" slot-scope="props">
        <span :class="!props.option.$isLabel && hasGroup && 'pl-2 border-left border-secondary'"> {{ props.option.name || props.option.$groupLabel }}</span>
      </template>
    </multiselect>
</template>

<style scoped>
  .stateTrue >>> .multiselect__tags {
    border-color: #28a745;
  }
  .stateFalse >>> .multiselect__tags {
    border-color: #d9534f;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'

// service
import hrOrderService from 'domain/services/hr-order-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'select-order-type',

  props: {
    customClass: {
      default: null
    },
    type: {},
    typeOptions: {
      type: Array,
      default: _ => ([])
    },
    disabled: {
      default: false,
      type: Boolean
    },
    multiple: {
      default: false,
      type: Boolean
    },
    hideSelect: {
      default: false,
      type: Boolean
    },
    autoClose: {
      default: true,
      type: Boolean
    },
    placeholder: {
      default: 'Chọn loại đề xuất'
    },
    state: {
      type: Boolean,
      default: null
    },
    hasGroup: {
      type: Boolean,
      default: true
    },
    groupAlias: {
      type: String,
      default: null
    },
    groupSelect: {
      type: Boolean,
      default: false
    },
    appendCategory: {
      default: false
    },
    appendGroup: { // nối thêm tên nhóm vào sau option
      default: false,
      type: Boolean
    }
  },

  components: {
    Multiselect
  },

  created () {
    this.getType()
  },

  data: _ => ({
    option: null,
    options: [],
    allOptions: []
  }),

  watch: {
    groupAlias () {
      this.buildOption(this.allOptions)
    },

    type () {
      this.setList()
    }
  },

  methods: {
    setList () {
      if (!this.type || !this.options || !Array.isArray(this.options) || !this.options.length) {
        this.option = null
        return
      }

      if (!this.multiple) {
        let op = this.options.find(type => (+type.id === +this.type))
        if (op) this.option = op
        return
      }

      this.option = []
      let type = this.type.split(',')
      let ops = null
      if (!this.hasGroup) {
        ops = this.options.filter(tp => (type.includes(tp.id + '') || type.includes(+tp.id)))
        if (ops) this.option = ops
      } else {
        this.options.forEach(group => {
          if (Array.isArray(group.types)) {
            ops = group.types.filter(tp => (type.includes(tp.id + '') || type.includes(+tp.id)))
            if (ops && ops.length) this.option.push(...ops)
          }
        })
      }
    },

    getType () {
      if (!helper.isEmpty(this.typeOptions) || sessionStorage.getItem('hrOrderType')) {
        this.buildOption(!helper.isEmpty(this.typeOptions) ? this.typeOptions : JSON.parse(sessionStorage.getItem('hrOrderType')))
        this.setList()
        return
      }
      hrOrderService.getType()
        .then(res => {
          if (res.data.success) {
            sessionStorage.setItem('hrOrderType', JSON.stringify(res.data.data))
            this.buildOption(res.data.data)
            this.setList()
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không lấy được danh sách loại khai báo !')
        })
    },

    buildOption (data) {
      if (!data || !Array.isArray(data) || !data.length) return
      this.allOptions = data
      this.options = []
      let groupAlias = null
      if (this.groupAlias) {
        groupAlias = this.groupAlias.split(',')
      }
      this.allOptions.forEach(group => {
        if (groupAlias && !groupAlias.includes(group.alias)) return
        if (this.hasGroup) {
          if (this.appendCategory) group.group = group.group + ` (${group.category_name})`
          if (this.appendGroup) {
            group.types.map(type => {
              type.name = type.name + ` (${type.group_name})`
            })
          }
          this.options.push(group)
        } else {
          if (this.appendGroup || this.appendCategory) {
            group.types.map(type => {
              type.name = type.name + ' (' + (this.appendGroup ? type.group_name : '') + (this.appendCategory && this.appendGroup ? '-' : '') + (this.appendCategory ? type.category_name : '') + ')'
            })
          }
          this.options.push(...group.types)
        }
      })
    }
  }
}
</script>
