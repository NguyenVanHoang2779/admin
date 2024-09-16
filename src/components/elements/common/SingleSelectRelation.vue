<template>
  <select class="form-control custom-select" @change="onChange">
    <option value="">{{placeholder}}</option>
    <option v-for="(option, idx) in options[relationOption] || []" :key="idx" :value="option.value" :selected="selectedOption(option)">
      {{ option.text }}
    </option>
  </select>
</template>

<script>

export default {
  name: 'single-select-relation',

  components: {
  },

  props: {
    value: {},
    placeholder: {},
    relationOption: {
      type: String,
      default: 'household'
    }
  },
  data: () => ({
    selected: null,
    options: {
      household: [
        {
          text: 'Chủ hộ',
          value: 'Chủ hộ'
        },
        {
          text: 'Vợ',
          value: 'Vợ'
        },
        {
          text: 'Chồng',
          value: 'Chồng'
        },
        {
          text: 'Bố',
          value: 'Bố'
        },
        {
          text: 'Mẹ',
          value: 'Mẹ'
        },
        {
          text: 'Em',
          value: 'Em'
        },
        {
          text: 'Anh',
          value: 'Anh'
        },
        {
          text: 'Chị',
          value: 'Chị'
        },
        {
          text: 'Con',
          value: 'Con'
        },
        {
          text: 'Cháu',
          value: 'Cháu'
        },
        {
          text: 'Ông',
          value: 'Ông'
        },
        {
          text: 'Bà',
          value: 'Bà'
        },
        {
          text: 'Cô',
          value: 'Cô'
        },
        {
          text: 'Dì',
          value: 'Dì'
        },
        {
          text: 'Chú',
          value: 'Chú'
        },
        {
          text: 'Thím',
          value: 'Thím'
        },
        {
          text: 'Bác',
          value: 'Bác'
        },
        {
          text: 'Cậu',
          value: 'Cậu'
        },
        {
          text: 'Mợ',
          value: 'Mợ'
        },
        {
          text: 'Con dâu',
          value: 'Con dâu'
        },
        {
          text: 'Con rể',
          value: 'Con rể'
        },
        {
          text: 'Chắt',
          value: 'Chắt'
        },
        {
          text: 'Bạn bè',
          value: 'Bạn bè'
        },
        {
          text: 'Họ hàng',
          value: 'Họ hàng'
        },
        {
          text: 'Khác',
          value: 'Khác'
        }
      ],
      guardian: [
        {
          text: 'Ông',
          value: 'Ông'
        },
        {
          text: 'Bà',
          value: 'Bà'
        },
        {
          text: 'Bố',
          value: 'Bố'
        },
        {
          text: 'Mẹ',
          value: 'Mẹ'
        },
        {
          text: 'Vợ',
          value: 'Vợ'
        },
        {
          text: 'Chồng',
          value: 'Chồng'
        },
        {
          text: 'Anh',
          value: 'Anh'
        },
        {
          text: 'Chị',
          value: 'Chị'
        },
        {
          text: 'Em',
          value: 'Em'
        },
        {
          text: 'Bạn bè',
          value: 'Bạn bè'
        },
        {
          text: 'Họ hàng',
          value: 'Họ hàng'
        }
      ]
    }
  }),

  methods: {
    selectedOption (option) {
      if (this.value) {
        return option.value === this.value
      }
    },

    onChange (event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
