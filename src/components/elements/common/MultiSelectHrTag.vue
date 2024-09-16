<template>
  <multiselect
     :class="customClass"
     v-model="option"
     :options="options"
     :multiple="true"
     :placeholder="placeholder"
     label="name"
     track-by="id"
     selectedLabel=""
     deselectLabel="X"
     selectLabel=""
     :close-on-select="autoClose"
     :hide-selected="hideSelected"
     :disabled="disabled"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>

import Multiselect from 'vue-multiselect'

import hrTagService from 'domain/services/hr-tag-service'

export default {
  name: 'multi-select-hr-tag',

  components: {
    Multiselect
  },

  props: {
    autoClose: {
      default: null
    },
    hideSelected: {
      default: null
    },
    placeholder: {
      default: 'Chọn thẻ'
    },
    customClass: {
      default: 'multiselect-primary'
    },
    disabled: {
      default: false
    },
    tableName: {},
    scope: {
      default: 'global'
    },
    reload: {
      default: false
    },
    type: {
      default: null
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleHrTagSelected', newValue)
    },
    reload: function (newValue, oldValue) {
      this.getList()
    }
  },

  methods: {
    getList () {
      let params = {
        table_name: this.tableName,
        scope: this.scope,
        type: this.type || null
      }
      hrTagService.getList(params)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
