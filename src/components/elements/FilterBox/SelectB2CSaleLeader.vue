<template>
    <multiselect v-model="selectedUsers"
                 id="ajax"
                 label="name"
                 track-by="code"
                 placeholder="Gõ để tìm quản lý B2C Sale"
                 open-direction="bottom"
                 :options="users"
                 :multiple="false"
                 :searchable="true"
                 :loading="isLoading"
                 :internal-search="false"
                 :clear-on-select="true"
                 :close-on-select="true"
                 :options-limit="300"
                 :limit="3"
                 :max-height="600"
                 :show-no-results="false"
                 :hide-selected="false"
                 :selectedLabel="``"
                 :tagPlaceholder="``"
                 :selectLabel="``"
                 :deselectLabel="`X`"
                 @search-change="searchUsers"
                 @input="selected"
    >
        <!--<template slot="tag" slot-scope="{ option, remove }">
        <span class="custom__tag"><span>{{ option.name }}</span>
        <span class="custom__remove" @click="remove(option)">❌</span></span></template>-->
        <!--<template slot="clear" slot-scope="props">
            <div class="multiselect__clear" v-if="selectedUsers.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
        </template><span slot="noResult">Oops! Không tìm thấy người dùng nào, hãy thử với từ khóa khác.</span>-->
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import shopService from 'domain/services/shop-service'

export default {
  name: 'search-b2c-leader',
  components: {
    Multiselect
  },
  data: () => ({
    selectedUsers: [],
    users: [],
    isLoading: false
  }),
  methods: {
    clearAll () {
    },
    searchUsers (dataSearch) {
      this.isLoading = true
      // if (!dataSearch || dataSearch.length < 3) {
      //   this.isLoading = false
      //   return
      // }
      shopService.searchB2CSaleLeader({'search': dataSearch}).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              if (response.data.data) {
                this.users = response.data.data
              }
            }
          }
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.isLoading = false
        // if (this.selectedUsers.hasOwnProperty('code')) {
        //     this.$emit('selected', this.selectedUsers)
        // }
      })
    },
    selected () {
      this.$notify({
        group: 'default',
        type: 'text-white bg-success',
        title: 'Thông báo',
        text: 'Đã chọn leader sale B2C'
      })
      if (this.selectedUsers && this.selectedUsers.hasOwnProperty('code')) {
        this.$emit('selected', this.selectedUsers.code)
      } else {
        this.$emit('selected', null)
      }
    }
  },
  created () {
    // let dataUser = localStorage.getItem('current_user')
    // dataUser = JSON.parse(dataUser)
    // let option = {
    //   name: dataUser.full_name + ' - ' + dataUser.username,
    //   code: dataUser.username
    // }
    // this.selectedUsers.push(option)
    let all = {
      name: 'Tất cả',
      code: 'all'
    }
    if (this.user) {
      this.users.push(all)
      // this.users.push(option)
    } else {
      this.users = []
      this.users.push(all)
      // this.users.push(option)
    }
    this.searchUsers()
  }
}
</script>

<style scoped>

</style>
