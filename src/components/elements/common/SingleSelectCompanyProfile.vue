<template>
    <div class="w-100">
        <multiselect
                v-model="profileOption"
                :options="profileOptions"
                placeholder="Tìm kiếm theo tên công ty"
                track-by="id"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :disabled="disabled"
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
import CompanyProfileService from 'domain/services/company-profile-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'singe-select-company-profile',

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    masterId: {
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: false
    },
    companyType: ''
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
    this.getCompanyProfileList()
  },

  watch: {
    profileOption: function (newprofileOption, oldprofileOption) {
      this.$emit('handleChooseProfileCompany', newprofileOption)
    },
    masterId: function () {
      this.profileOption = this.masterId ? this.profileOptions.find((item) => item.id === this.masterId) : null
    }
  },

  methods: {
    getCompanyProfileList: function () {
      let dataRequest = {
        isPaging: false,
        companyType: this.companyType
      }
      CompanyProfileService.getCompanyProfileList(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.profileOptions = res.data.data.data.map((profile) => {
              profile.shortName = profile.short_name
              delete profile.short_name
              return profile
            })
            this.saveAllProfileOption = res.data.data.data
            this.profileOption = this.masterId ? this.profileOptions.find((item) => item.id === this.masterId) : null
          }
        })
        .catch((e) => {
          console.log('where error: handleChooseObjectType')
        }).then(() => {
          this.$stopLoading()
        })
    },

    search: function (searchQuery) {
      let temp = this.saveAllProfileOption.filter((item) => (item.shortName.toLowerCase() + item.tax_iden_number.toLowerCase()).search(searchQuery) !== -1)
      if (temp.length > 0) {
        this.profileOptions = temp
      }
    },
    customLabel: function ({ shortName }) {
      return `${shortName}`
    }
  }
}
</script>
