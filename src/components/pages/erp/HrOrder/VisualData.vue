<template>
  <div :class="'d-' + display" v-if="data">
    <template v-if="['array', 'object'].includes(type)">
      <!-- Là object có các mô tả các trường để hiển thị -->
      <span v-if="data.config_visual && data.config_visual.reduce">
        <b>{{ data[data.config_visual.desc_field || 'desc'] || null }}: </b>
        <visual-data
          class="pl-1"
          :data="data[data.config_visual.value_field || 'value'] || null"
          :format="data.config_visual.format || null"
          :allowEdit="allowEdit"
        />
      </span>
      <!-- Là object hay mảng không có các mô tả hiển thị thì hiển thị mặc định -->
      <template v-else>
        <div v-for="(subData, key) in data" :key="key">
          <span v-if="subData && ['array', 'object'].includes(typeof subData)">
            <span
              @click="expand(key)"
              class="expandable text-underline-hover cursor-pointer"
            >
              <b>{{ expandStatus[key] ? '&minus;' : '&#43;' }}</b> {{ key }}
            </span>:
          </span>
          <span v-else>{{ key }}:</span>

          <template v-if="subData">
            <visual-data
              v-if="expandStatus[key] !== false || !['array', 'object'].includes(typeof subData)"
              class="pl-3"
              :data="subData"
              :allowEdit="allowEdit"
            />
            <span v-else class="expandable cursor-pointer" @click="expand(key)">[....]</span>
          </template>
        </div>
      </template>
    </template>
    <span v-else>
      <span v-if="!editting">{{ formatedData }} <i v-show="allowEdit" class="fas fa-pencil-alt ml-1 text-ghtk-action" @click="editting = true"></i></span>
      <span v-else>
        <input type="text" v-model="data" @keypress.enter="editting = false">
      </span>
    </span>
  </div>
</template>

<style scoped>
  .expandable:hover {
    background: greenyellow;
  }
</style>

<script>
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'visual-data',

  props: {
    data: {},
    format: {},
    allowEdit: {
      default: false,
      type: Boolean
    }
  },

  data: _ => ({
    expandStatus: {},
    editting: false
  }),

  computed: {
    type () {
      if (!this.data) return 'string'
      return typeof this.data === 'object' ? (Array.isArray(this.data) ? 'array' : 'object') : typeof this.data
    },

    formatedData () {
      if (this.format === 'money') return helper.formatMoney(this.data)
      if (this.format === 'date') return helper.formatDate(this.data, 'DD/MM/YYYY')
      if (this.format === 'time') return helper.formatDate(this.data, 'HH:mm:ss')
      if (this.format === 'datetime') return helper.formatDate(this.data, 'DD/MM/YYYY HH:mm:ss')

      return this.data
    },

    display () {
      return ['array', 'object'].includes(this.type) ? 'block' : 'inline'
    }
  },

  methods: {
    expand (key) {
      if (this.expandStatus[key] === undefined) this.$set(this.expandStatus, key, true)

      this.expandStatus[key] = !this.expandStatus[key]
    }
  }
}
</script>
