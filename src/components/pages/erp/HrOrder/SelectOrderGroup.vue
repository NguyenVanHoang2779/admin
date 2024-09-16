<template>
    <multiselect
      v-model="option"
      :options="options"
      :group-values="categoryGroup ? 'groups' : null"
      :group-label="categoryGroup ? 'category_name' : null"
      :group-select="categoryGroup && groupSelect"
      :disabled="disabled"
      :multiple="multiple"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      :placeholder="placeholder"
      label="name"
      track-by="alias"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :hide-selected="hideSelect"
      :close-on-select="autoClose"
      @input="val => {$emit('input', val)}"
      @select="val => {$emit('select', val)}"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
      <template slot="option" slot-scope="props">
        <span :class="!props.option.$isLabel && categoryGroup && 'pl-2 border-left border-secondary'"> {{ props.option.name || props.option.$groupLabel }}</span>
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
  name: 'select-order-group',
  props: {
    groupOptions: {
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
      default: 'Chọn loại khai báo'
    },
    state: {
      type: Boolean,
      default: null
    },
    group: { // nhóm đề xuất muốn chuyền vào
      type: String,
      default: null
    },
    groupSelect: { // chọn nhóm của mutiselect
      default: null
    },
    category: { // loại category muốn truyền vào
      default: null
    },
    categoryGroup: { // nhóm theo category
      default: true,
      type: Boolean
    },
    appendCategory: { // nối thêm tên category vào sau option
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
    options: []
  }),

  watch: {
    group (newVal, oldval) {
      this.setList()
    }
  },

  methods: {
    setList () {
      if (!this.group || !this.options || !Array.isArray(this.options) || !this.options.length) {
        this.option = null
        return
      }

      if (!this.categoryGroup) {
        if (!this.multiple) {
          let op = this.options.find(gr => (gr.alias === this.group))
          if (op) this.option = op
          return
        }

        let group = this.group.splite(',')
        let ops = this.options.filter(gr => (group.includes(gr.alias)))
        this.option = ops
      } else {
        if (!this.multiple) {
          this.options.every(cate => {
            if (Array.isArray(cate.groups)) {
              let op = cate.groups.find(gr => (gr.alias === this.group))
              if (op) this.option = op
            }
            if (this.option && this.option.length) return false
            return true
          })
          return
        }

        let group = this.group.splite(',')
        this.options.every(cate => {
          if (Array.isArray(cate.groups)) {
            let ops = cate.groups.filter(gr => (group.includes(gr.alias)))
            if (ops) this.option = [...this.option, ...ops]
          }
        })
      }
    },

    getType () {
      if (!helper.isEmpty(this.groupOptions) || sessionStorage.getItem('hrOrderType')) {
        if (!helper.isEmpty(this.groupOptions)) this.buildOption(this.groupOptions)
        else this.buildOption(JSON.parse(sessionStorage.getItem('hrOrderType')))
        this.setList()
        return
      }
      hrOrderService.getType()
        .then(res => {
          if (res.data.success) {
            this.buildOption(res.data.data)
            this.setList()
            sessionStorage.setItem('hrOrderType', JSON.stringify(res.data.data))
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra, không lấy được danh sách loại khai báo !')
        })
    },

    buildOption (data) {
      if (!data || !Array.isArray(data) || !data.length) return
      this.options = []
      if (this.categoryGroup) {
        let temData = {}
        data.forEach(group => {
          let category = group.category || 'other'
          if (!temData[category]) {
            temData[category] = {
              category: category,
              category_name: group.category_name || 'Khác',
              groups: [
                { alias: group.alias, category: group.category, name: group.group + (this.appendCategory ? `(${group.category_name})` : '') }
              ]
            }
          } else {
            temData[category].groups.push({ alias: group.alias, category: group.category, name: group.group + (this.appendCategory ? `(${group.category_name})` : '') })
          }
        })
        this.options = Object.values(temData)
      } else {
        data.forEach(group => {
          if (group.alias) {
            this.options.push({ alias: group.alias, category: group.category, name: group.group + (this.appendCategory ? `(${group.category_name})` : '') })
          }
        })
      }
    }
  }
}
</script>
