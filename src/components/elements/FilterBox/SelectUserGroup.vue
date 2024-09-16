<template>
  <multiselect
      v-model="selectedGroups"
      :options="groups"
      :multiple= "multiple"
      :placeholder="placeholder"
      track-by="name"
      label="name"
      selectLabel=""
      selectedLabel=""
      deselectLabel="x"
      @select="onSelectGroup"
      @remove="onRemoveGroup"
  />
</template>
<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-user-group',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Chọn nhóm tài khoản'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    groups: [],
    selectedGroups: []
  }),
  methods: {
    getOptions: function () {
      // Header check login
      axios.get(config.baseApiUrl + 'AdSearchStaff/getOptionForSearchBox').then(response => {
        if (response.data.success) {
          this.groups = response.data.data.options.groups

          if (!this.multiple) {
            this.groups.unshift({
              code: '',
              name: this.placeholder
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelectGroup: function (selectedOption, id) {
      if (this.multiple) {
        let data = []
        if (this.selectedGroups.length > 0) {
          for (let i = 0; i < this.selectedGroups.length; i++) {
            data.push(this.selectedGroups[i].code)
          }
        }
        data.push(selectedOption.code)
        this.$emit('selected', data)
      } else {
        this.selectedGroups = selectedOption.code
        this.$emit('selected', this.selectedGroups)
      }
    },
    onRemoveGroup: function () {
      this.selectedGroups = this.multiple ? [] : ''
      this.$emit('selected', [])
    },
    reset: function () {
      this.selectedGroups = this.multiple ? [] : ''
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
