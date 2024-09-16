<template>
    <div>
        <multiselect
                v-model="option"
                :options="options"
                :disabled="isDisabled"
                placeholder="Chọn lỗi"
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
import evaluationService from 'domain/services/evaluation-service'

export default {
  name: 'single-select-reason-shop-vote',

  components: {
    Multiselect
  },
  props: {
    reason: {
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
      this.$emit('handleSelectedCauseShop', newValue)
    },

    reason: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    getList: function () {
      evaluationService.getReasonShopVote()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.reason) {
        this.option = this.options.find((option) => {
          return option === this.reason
        })
      }
    }
  }
}
</script>
