<template>
  <multiselect
    :class="customClass"
    v-model="option"
    :options="options"
    :multiple="true"
    :placeholder="placeholder"
    label="name"
    track-by="type"
    selected-label=""
    deselect-label="X"
    select-label=""
    :disabled="isDisabled"
    :limit="limitProp"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="handleInput"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import hrmTicketService from 'domain/services/Erp/ticket-service'
import helpers from 'infrastructures/helpers/common-helpers'

export default {
  name: 'MultiSelectUnionType',
  components: {
    Multiselect
  },
  props: {
    autoClose: {
      default: true
    },
    hideSelected: {
      default: true
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Loại đề xuất'
    },
    customClass: {
      default: 'multiselect-ghtk'
    }
  },
  data: () => ({
    option: null,
    options: [],
    typeBirthday: {
      type: 1,
      name: 'Sinh nhật đoàn viên'
    }
  }),
  created () {
    this.getUnionTypes()
  },
  methods: {
    handleInput () {
      this.$emit('onChange', this.option)
    },
    async getUnionTypes () {
      try {
        const res = await hrmTicketService.getUnionTypes()
        if (res.data.success) {
          this.options = res.data.data.map(item => {
            return {
              type: item.type,
              name: item.name
            }
          })
          this.options.unshift(this.typeBirthday)
        } else {
          helpers.showMessage(res.data.message, 'warning', 'Thông báo')
        }
      } catch (e) {
        helpers.showMessage('Có lỗi khi lấy danh sách loại đề xuất!', 'error', 'Lỗi')
      }
    }
  }
}
</script>
