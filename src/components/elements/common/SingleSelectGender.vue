<template>
    <div>
        <Multiselect
          :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
          v-model="option"
          :options="options"
          :disabled="isDisabled"
          placeholder="Chọn giới tính"
          label="text"
          track-by="text"
          selectedLabel=""
          deselectLabel="X"
          selectLabel=""
        >
        <template slot="placeholder">
          <span class="placeholder">Chọn giới tính</span>
        </template>
        </Multiselect>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  name: 'single-select-gender',
  components: {
    Multiselect
  },
  props: {
    gender: {
      type: String
    },

    isDisabled: {
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    }
  },

  data: () => ({
    storage: null,
    option: null,
    options: [
      {text: 'Nam', value: 'male'},
      {text: 'Nữ', value: 'female'},
      {text: 'Khác', value: 'other'}
    ]
  }),

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedGender', newValue)
    },

    gender: function (newValue, oldValue) {
      if (newValue) {
        let gender = this.options.find(gender => (gender.value === newValue))
        if (gender) this.option = gender
        else this.option = null
      } else this.option = null
    }
  }

}
</script>
