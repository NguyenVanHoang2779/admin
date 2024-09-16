<template>
  <div>
      <multiselect
          v-model="selectedSource"
          :options="options"
          :placeholder="placeholder"
          label="name"
          track-by="id"
          selectedLabel="Đã chọn"
          deselectLabel="X"
          selectLabel=""
          :searchable="true"
          :multiple="multiple"
          @input="handleChange"
          :disabled="disable"
      >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'SelectSourceRecruitment',

  components: {
    Multiselect
  },

  props: {
    multiple: false,
    source: {
      type: String,
      default: null
    },
    placeholder: {
      default: 'Chọn nguồn giới thiệu'
    },
    disable: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    selectedSource: null,
    options: [
      {
        name: 'Mạng xã hội',
        id: 'social_network'
      },
      {
        name: 'Jobsite tuyển dụng',
        id: 'web'
      },
      {
        name: 'Ngày hội việc làm',
        id: 'workfes'
      },
      {
        name: 'Giới thiệu nội bộ',
        id: 'employee'
      },
      {
        name: 'Quảng cáo ngoài trời',
        id: 'outdoor'
      },
      {
        name: 'Đối tác tuyển dụng',
        id: 'other'
      }
    ]
  }),

  watch: {
    source: function (newValue, oldValue) {
      this.selectedSource = this.options.find(function (option) {
        return option.id === newValue
      })
    },

    selectedSource: function (newValue, oldVal) {
      this.$emit('handleSourceSelected', newValue)
    }
  },

  methods: {
    handleChange (selectedOption) {
      console.log(123)
      // Xử lý khi option được chọn thay đổi
      this.$emit('selected-option-changed', selectedOption)
    }
  }
}
</script>
