<template>
    <div :class="customClass">
        <multiselect
          v-model="option"
          :options="options"
          :disabled="isDisabled"
          :multiple="true"
          label="work_type_description"
          :class="customMultiselectClass"
          :placeholder="placeholder"
          track-by="id"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          selectLabel="Chọn"
          :searchable="true"
        >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
            <span class="placeholder" slot="placeholder">{{placeholder}}</span>
        </multiselect>
    </div>
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
    positionCustom: { },
    workTypeId: { },
    isDisabled: {
      type: Boolean
    },
    customClass: {
      type: String,
      default: ''
    },
    customMultiselectClass: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu nhân viên'
    },
    listPosition: {},
    screenDeposit: false,
    appendGroupType: {
      default: false
    },
    triggerDuplicateChange: {
      default: false
    }
  },
  data: () => ({
    option: null,
    options: [],
    triggerDuplicate: false
  }),

  created () {
    this.getListWorkType()
  },

  watch: {
    positionCustom: function (newValue, oldValue) {
      if (newValue) {
        this.getListWorkType(newValue)
      } else {
        this.options = []
        this.option = []
      }
    },

    option: function (newValue, oldValue) {
      this.$emit('handleSelectedWorkType', newValue)
    },

    triggerDuplicateChange: function (newValue, oldValue) {
      this.triggerDuplicate = this.triggerDuplicateChange
    },
    workTypeId: function (newValue, oldValue) {
      if (this.triggerDuplicate) {
        return
      }
      if (newValue) {
        this.setSelectedOption()
      } else {
        this.option = []
      }
    },

    listPosition: function (newValue, oldValue) {
      if (newValue) {
        this.getListWorkType()
      }
    }
  },

  methods: {
    setSelectedOption () {
      this.option = []
      if (this.options.length > 0 && this.workTypeId) {
        this.workTypeId.split(',').forEach(workTypeId => {
          this.options.forEach(op => {
            if (('' + op.id) === workTypeId) this.option.push(op)
          })
        })
      }
    },

    getListWorkType: function () {
      if (!this.positionCustom && sessionStorage.getItem('allWorkTypeUser') && this.screenDeposit) {
        this.options = JSON.parse(sessionStorage.getItem('allWorkTypeUser'))
        this.$emit('handleTriggerDuplicateChange', false)
        this.triggerDuplicate = false
        if (this.listPosition) this.setListOption(this.listPosition)
        this.setSelectedOption()
        return
      }
      let params = {
        position: this.positionCustom,
        screenDeposit: this.screenDeposit,
        append_group_type: this.appendGroupType
      }
      depositService.getListWorkType(params)
        .then((res) => {
          this.triggerDuplicate = false
          if (res.data.success) {
            this.options = res.data.data
            this.$emit('handleTriggerDuplicateChange', false)
            if (this.workTypeId) {
              this.setSelectedOption()
            }
            if (!this.positionCustom) sessionStorage.setItem('allWorkTypeUser', JSON.stringify(this.options))
            if (this.listPosition) this.setListOption(this.listPosition)
          } else {
            this.option = []
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setListOption (positions) {
      if (!positions || !this.workTypeId) return
      try {
        this.options = this.options.filter(op => {
          let arrayPosition = positions.split(',').filter(item => {
            if (op.position_ids.includes(parseInt(item))) return true
            if (op.position_ids.includes(item)) return true
          })

          if (arrayPosition || arrayPosition.length > 0) return true
        })
        this.setSelectedOption()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
