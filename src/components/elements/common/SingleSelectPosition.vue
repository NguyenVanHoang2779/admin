<template>
    <multiselect
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
      :disabled="isDisabled"
      @select="op => { $emit('select', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-service'

export default {
  name: 'single-select-position',

  components: {
    Multiselect
  },

  props: {
    isDisabled: {
      type: Boolean
    },
    departmentName: {},
    departmentId: {},
    positionJob: {},
    isShowDepartmentAlias: {
      type: Boolean,
      default: true
    },
    listPositionDisable: null,
    reset: {},
    placeholder: {
      default: 'Chọn vị trí làm việc'
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
    isShowDepartmentAlias: function (newValue, oldValue) {
      this.getList()
    },

    departmentName: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.option = null
        this.options = []
        if (newValue) this.getPositionListByDepartment(newValue)
        else this.getList()
      }
    },

    departmentId: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.option = null
        this.options = []
        if (newValue) this.getPositionListByDepartment(newValue)
        else this.getList()
      }
    },

    option: function (newValue, oldValue) {
      this.$emit('handleSelectedPosition', newValue)
    },

    positionJob: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    },

    reset () {
      this.option = null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.positionJob) {
        let opt = this.options.find(op => (+op.id === +this.positionJob))
        if (opt) this.option = opt
      }
    },

    disablePosition () {
      if (this.listPositionDisable != null) {
        let arr = []
        this.options.forEach((item) => {
          if (this.listPositionDisable.includes(parseInt(item.id))) {
            item.$isDisabled = true
          }
          arr.push(item)
        })
        this.options = arr
      }
    },

    async getList () {
      await this.$store.dispatch('position/getPositions')
      this.options = this.isShowDepartmentAlias
        ? this.$store.getters['position/positionsWithDepartmentAlias']
        : this.$store.getters['position/allPositions']
      this.disablePosition()
      this.setSelectedOption()
    },

    getPositionListByDepartment: function (value) {
      let params = {
        department: value
      }
      profileService.getPositionListByDepartment(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.disablePosition()
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
