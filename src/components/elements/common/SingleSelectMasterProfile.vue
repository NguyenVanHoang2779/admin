<template>
  <div class="w-100">
    <multiselect
            v-model="profileOption"
            :options="profileOptions"
            placeholder="Tìm kiếm theo CMND, Họ tên, Mã nhân viên"
            label="name"
            track-by="name"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :custom-label="customLabel"
            :allow-empty="false"
            :searchable="true"
            :internal-search="false"
            :show-no-results="false"
            @search-change="search"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import staffService from 'domain/services/staff-service'
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'

export default {
  name: 'singe-select-master-profile',

  props: {
    masterId: {
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    profileOption: null,
    profileOptions: [],
    saveAllProfileOption: [],
    masterInfo: []
  }),

  created () {
    this.getAllProfile()
  },

  watch: {
    profileOption: function (newprofileOption, oldprofileOption) {
      this.$emit('handleChooseMasterProfile', newprofileOption)
    }
  },

  methods: {
    getAllProfile: function () {
      this.$startLoading()
      staffService.getAllMasterProfile()
        .then((res) => {
          if (res.data.success) {
            this.profileOptions = res.data.data
            this.saveAllProfileOption = res.data.data
            this.profileOption = this.masterId ? this.profileOptions.find((item) => item.id === this.masterId) : null
          }
        })
        .catch((e) => {
          console.log('where error: handleChooseObjectType')
        }).then(() => {
          this.$stopLoading()
        })
    },

    search: debounce(function (searchQuery) {
      if (!searchQuery || searchQuery.length < 2) {
        return
      }
      let temp = this.saveAllProfileOption.filter(item => (item.name.toLowerCase() + item.staffCode.toLowerCase() + item.personalIdNumber.toLowerCase()).search(searchQuery) !== -1)
      if (temp.length > 0) {
        this.profileOptions = temp
      } else this.profileOptions = []
    }, 500),

    customLabel: function ({ name, personalIdNumber }) {
      return `${name} - ${personalIdNumber}`
    }
  }
}
</script>
