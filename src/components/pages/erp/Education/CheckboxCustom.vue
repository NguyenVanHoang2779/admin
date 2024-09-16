<template>
  <div>
    <div class="checkbox-custom">
      <input v-model="checked" @click="check" type="checkbox" :id="id" :disabled="isDisabled">
      <label :for="id" :class="isDisabled && 'disabled'"></label>
    </div>
  </div>
</template>

<style scoped>
/* This css is for normalizing styles. You can skip this. */
*, *:before, *:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.checkbox-custom {
  display: block;
  margin-bottom: 15px;
  margin-right: 33px;
}

.checkbox-custom input {
  padding: 0;
  height: initial;
  width: initial;
  margin-bottom: 0;
  display: none;
  cursor: pointer;
}

.checkbox-custom label {
  position: relative;
  cursor: pointer;
}

.checkbox-custom label:before {
  content: '';
  -webkit-appearance: none;
  background-color: transparent;
  border: 1px solid #999898;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  padding: 17px 16px 17px 16px;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  cursor: inherit;
}

label.disabled {
  cursor: unset;
  background: #eee;
}

.checkbox-custom input:checked + label:after {
  content: '';
  display: block;
  position: absolute;
  top: 6px;
  left: 13px;
  width: 10px;
  height: 19px;
  border: solid #069255;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

@media screen and (min-width: 1281px) {
  .checkbox-custom {
    margin-right: 66px;
  }
}
</style>

<script>
export default {
  name: 'checkbox-custom',

  components: {},

  props: {
    isDisabled: {
      default: false
    },
    id: {
      default: null
    },
    isChecked: {
      default: false
    }
  },
  created () {
    this.checked = this.isChecked
  },
  data: () => ({
    checked: false
  }),
  watch: {
    checked () {
      this.$emit('model', this.checked)
    },
    isChecked () {
      this.checked = this.isChecked
    }
  },

  methods: {
    checkedNow () {
      this.checked = true
      this.$emit('model', this.checked)
    },

    check () {
      this.checked = !this.checked
      this.$emit('change', this.checked)
    },
    notCheck () {
      this.checked = false
      this.$emit('model', this.checked)
    }
  }
}
</script>
