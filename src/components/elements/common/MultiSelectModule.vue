<template>
  <div>
      <multiselect class="multiselect-primary"
      v-model="option"
      :options="options"
      :multiple="true"
      :placeholder="placeholder"
      label="alias"
      track-by="alias"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :close-on-select="autoClose"
      :hide-selected="hideSelected"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="placeholder" class="placeholder">{{placeholder}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import hrteamService from 'domain/services/hrteam-service'

export default {
  name: 'multi-select-module',

  components: {
    Multiselect
  },

  props: {
    stationIds: {},
    moduleIds: {},
    autoClose: {
      default: false
    },
    hideSelected: {
      default: false
    },
    placeholder: {
      default: 'Chọn module'
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleModuleSelected', newValue)
    },

    stationIds: function (newValue, oldValue) {
      if (newValue) {
        this.getList(newValue)
        this.option = null
      }
    },

    moduleIds: function (newVal, oldVal) {
      if (this.options && this.options.length > 0) {
        this.setList()
      }
    }
  },

  methods: {
    setList () {
      if (this.moduleIds) {
        this.option = []
        this.moduleIds.split(',').forEach(moduleId => {
          this.options.forEach(op => {
            if (('' + op.id) === moduleId) this.option.push(op)
          })
        })
      }
    },

    getList: function (stationIds) {
      hrteamService.getAllModuleByStationIds({ stationIds: stationIds })
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
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
