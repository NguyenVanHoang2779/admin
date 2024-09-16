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
      @search-change="fetchData"
      @open="clear"
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
  name: 'single-select-candidate-referrer',

  components: {
    Multiselect
  },

  props: {
    referrerId: {
      type: String
    },
    customClass: {
      default: 'mb-4'
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
  },

  watch: {
    referrerOption: function (newValue, oldValue) {
      this.$emit('handleChooseRefferer', newValue)
    },

    referrerId: function (newValue, oldValue) {
      let find = this.referrerOptions.find(item => item.id === newValue)
      if (find) this.referrerOption = find
      else {
        userService.getBasicInfoById({id: newValue})
          .then(response => {
            if (response.data.success) {
              if (response.data.data) {
                this.referrerOptions.push(response.data.data)
                this.referrerOption = response.data.data
              } else this.referrerOption = null
            } else {
              this.referrerOption = null
            }
          })
      }
    }
  },

  methods: {
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
            if (this.candidateReferrer !== null) {
              this.referrerOption = this.referrerOptions.find(item => (item.id === this.candidateReferrer))
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    }, 500)
  }
}
</script>
