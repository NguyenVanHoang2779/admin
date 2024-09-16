<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Chọn chức vụ"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :disabled="isDisabled"
      @select="op => $emit('select', op)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn chức vụ</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import profileService from 'domain/services/profile-service'

export default {
  name: 'single-select-duty',

  components: {
    Multiselect
  },
  props: {
    dutyType: {},
    dutyId: null,
    isDisabled: {
      type: Boolean
    }
  },
  data: () => ({
    allDuty: [],
    option: null,
    options: [],
    dutyByType: {
      office: [1, 3, 10, 8, 9, 6, 7],
      operation: [1, 2, 3, 4, 5, 6, 7]
    }
  }),

  created () {
    this.getList()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelected', newValue)
    },

    dutyId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    },

    dutyType (newVal) {
      this.setOptions(newVal)
    }
  },

  methods: {
    getList: function () {
      if (sessionStorage.getItem('listDuties')) {
        this.allDuty = JSON.parse(sessionStorage.getItem('listDuties'))
        this.setOptions(this.dutyType)
        this.setSelectedOption()
        return
      }
      profileService.getDutiesList()
        .then((res) => {
          if (res.data.success) {
            this.allDuty = res.data.data
            sessionStorage.setItem('listDuties', JSON.stringify(this.allDuty))
            this.setOptions(this.dutyType)
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setOptions (type) {
      if (!type) this.options = this.allDuty
      let options = []
      if (this.dutyByType[type]) {
        for (const dutyId of this.dutyByType[type]) {
          this.allDuty.forEach(op => +op.id === dutyId && options.push(op))
        }
      }

      this.options = options
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.dutyId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.dutyId)
        })
      }
    }
  }
}

</script>
