<template>
  <div :class="customClass">
    <multiselect
      v-model="referrerOption"
      :options="referrerOptions"
      placeholder="Chọn người giới thiệu"
      track-by="username"
      :custom-label="displayLabel"
      selectedLabel="Đã chọn"
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
      :loading="loading"
      :multiple="false"
      @search-change="fetchData"
      @input="handleChange"
      :disabled="disable"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn người giới thiệu</span>
    </multiselect>
  </div>
</template>

<script>
import debounce from 'debounce'
import Multiselect from 'vue-multiselect'
import userService from 'domain/services/user-service'
export default {
  name: 'SelectReferrer',

  components: {
    Multiselect
  },

  props: {
    referrerId: {
      type: String,
      default: null
    },
    customClass: {
      default: 'mb-4'
    },
    disable: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    searchQuery: '',
    referrerOption: null,
    referrerOptions: [],
    loading: false
  }),

  created () {
    this.getRefferers()
    this.searchSelected(this.referrerId)
  },

  watch: {
    referrerId: function (newValue, oldValue) {
      this.searchSelected(newValue)
    }
  },

  methods: {
    searchSelected (id) {
      let find = this.referrerOptions.find(item => item.id === id)
      console.log(id, find)
      if (find) {
        this.referrerOption = find
      } else {
        userService.getBasicInfoById({id: id})
          .then(response => {
            if (response.data.success) {
              if (response.data.data) {
                console.log(response.data.data)
                this.referrerOptions.push(response.data.data)
                this.referrerOption = response.data.data
              } else this.referrerOption = null
            } else {
              this.referrerOption = null
            }
          })
      }
    },

    displayLabel ({username, fullname}) {
      return fullname + ' (' + username + ')'
    },

    clear () {
      this.referrerOption = null
      this.fetchData()
    },

    getRefferers () {
      this.fetchData('')
    },

    fetchData (searchQuery) {
      this.searchQuery = searchQuery
      this.debounceFetchData()
    },

    debounceFetchData: debounce(function () {
      if (this.referrerOption) return
      this.loading = true
      userService.fetchDataForUserFilter({'needle': this.searchQuery})
        .then(res => {
          if (res.data.success) {
            this.referrerOptions = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    }, 500),

    handleChange (selectedOption) {
      // Xử lý khi option được chọn thay đổi
      this.$emit('selected-option-changed', selectedOption)
    }
  }
}
</script>
