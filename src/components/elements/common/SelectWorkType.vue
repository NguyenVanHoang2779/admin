<template>
  <multiselect
    v-model="option"
    :options="options"
    :disabled="disabled"
    :multiple="multiple"
    :close-on-select="autoClose"
    label="work_type_description"
    :placeholder="placeholder"
    track-by="id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :searchable="true"
    @input="ops => $emit('input', ops.map(op => op.id).toString())"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import depositService from 'domain/services/deposit-service'

export default {
  name: 'multi-select-worktype',

  components: {
    Multiselect
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu nhân viên'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    },
    appendGroupType: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getListWorkType()
  },

  watch: {
    value (newVal) {
      this.setSelectedOption(newVal)
    },
    position (newVal) {
      this.getListWorkType(newVal)
    }
  },

  methods: {
    setSelectedOption (workTypeIds) {
      if (this.multiple) {
        this.option = []
        if (workTypeIds) {
          workTypeIds.split(',').forEach(workTypeId => {
            this.options.forEach(op => {
              if (+op.id === +workTypeId) this.option.push(op)
            })
          })
        }
      } else {
        this.option = this.options.find(op => +op.id === +workTypeIds) || null
      }
    },

    getListWorkType (positions) {
      if (!positions && sessionStorage.getItem('allWorkTypeUser')) {
        this.options = JSON.parse(sessionStorage.getItem('allWorkTypeUser'))
        this.setSelectedOption(this.value)
        return
      }
      let params = {
        position: positions,
        append_group_type: this.appendGroupType
      }
      depositService.getListWorkType(params)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data || []
            this.setSelectedOption(this.value)
            if (!positions) sessionStorage.setItem('allWorkTypeUser', JSON.stringify(this.options))
          } else {
            this.option = []
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
