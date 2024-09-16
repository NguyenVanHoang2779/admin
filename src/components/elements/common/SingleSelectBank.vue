<template>
    <div>
        <multiselect
                v-model="option"
                :options="options"
                :disabled="isDisabled"
                placeholder="Chọn ngân hàng"
                label="name"
                track-by="name"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :searchable="true"
        >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </multiselect>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import staffService from 'domain/services/staff-service'

export default {
  name: 'single-select-bank',

  components: {
    Multiselect
  },
  props: {
    bankCode: {

    },
    isDisabled: {
      type: Boolean
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
      this.$emit('handleSelectedBank', newValue)
    },

    bankCode: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    getList: function () {
      if (sessionStorage.getItem('listBank')) {
        this.options = JSON.parse(sessionStorage.getItem('listBank'))
        this.setSelectedOption()
        return
      }
      staffService.getListBank()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
            sessionStorage.setItem('listBank', JSON.stringify(this.options))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.bankCode) {
        this.option = this.options.find((option) => {
          return option.id === this.bankCode
        })
      }
    }
  }
}
</script>
