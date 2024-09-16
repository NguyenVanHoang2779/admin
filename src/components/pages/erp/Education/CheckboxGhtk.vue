<template>
  <div class="checkbox">
    <label
      class="label"
      :for="id"
    >
      <slot />
    </label>
    <div
      class="checkbox-custom-input-wrapper"
      :class="{'checkbox-custom-input-wrapper--checked': value}"
    >
      <input
        :id="id"
        class="checkbox-hidden-input"
        type="checkbox"
        :checked="value"
        @click="onInput"
      >
      <span
        v-if="value"
        class="checkbox-custom-input"
        :class="{'checkbox-custom-input--checked': value}"
      >
          &#x2714; <!-- tickmark -->
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckboxGhtk',
  props: {
    /**
     * A DOMString representing the id of the checkbox
     */
    id: {
      type: String,
      default: ''
    },
    /**
     * Control whether the checkbox should be checked from outside of the component.
     */
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onInput (event) {
      /**
       * v-model implementation
       * @type {boolean}
       */
      this.$emit('input', event.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  whitespace: no-wrap;
}

.checkbox-custom-input-wrapper {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  height: 40px;
  width: 40px;
  z-index: 10;
}

.checkbox-custom-input-wrapper--checked {
  border-color: #ccc;
}

.checkbox-custom-input {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #ccc;
  color: green;
  font-weight: 400;
  font-size: 20px;
}

.checkbox-custom-input--checked {
  background-color: #fff;
  border-radius: 0.25rem;
}

.checkbox-hidden-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  margin: 0;
}

.label {
  cursor: pointer;
}
</style>
