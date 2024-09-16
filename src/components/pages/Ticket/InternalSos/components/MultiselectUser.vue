<template>
    <div>
        <b-check v-model="checkViewAll" class="no-select"><i>{{this.type == 'group' ? 'Xem tất cả người xử lý' : 'Xem tất cả người theo dõi'}}</i></b-check>
        <multiselect
                :class="{'custom-multiselect': !checkViewAll, 'custom-multiselect-user': true}"
                v-model="asyncSelected"
                label="name"
                track-by="id"
                @remove="removeUser"
                @select="selectUser"
                @input="inputUsers"
                placeholder=""
                selectLabel=""
                :options="asyncFound"
                :multiple="true"
                :searchable="true"
                :loading="asyncLoading"
                :internal-search="false"
                :clear-on-select="true"
                :close-on-select="true"
                :hide-selected="true"
                :disabled="typeof isDisabled === 'undefined' ? false : isDisabled"
                @search-change="asyncFind">
            <span slot="noResult">{{message}}</span>
            <span slot="noOptions">{{message}}</span>
        </multiselect>
        <notifications group="notifications-default"/>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
import debounce from 'debounce'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  props: ['data', 'isDisabled', 'type'],
  name: 'multi-select-user',

  components: {
    Multiselect,
    sosService,
    debounce
  },
  watch: {
    asyncSelected () {
      this.$emit('model', this.asyncSelected)
    }
  },
  data: () => ({
    checkViewAll: false,
    asyncSelected: [],
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    willRemove: null,
    wilAdd: {
      index: -1,
      item: null
    },
    message: 'Nhập ít nhất 2 ký tự'
  }),
  computed: {
  },
  created () {
    if (this.type === 'group_watch') {
      this.asyncSelected = this.data.item.list_watch_users
    } else {
      this.asyncSelected = this.data.item.list_users
    }
  },
  methods: {
    inputUsers () {
      if (this.willRemove) {
        let selectedOption = this.willRemove
        let index = this.asyncSelected.findIndex(element => element.id === selectedOption.id)
        if (index > -1) this.asyncSelected.splice(index, 1)
        this.willRemove = null
      }
      if (this.wilAdd.item) {
        if (this.wilAdd.index > -1) this.asyncSelected.splice(this.wilAdd.index, 0, this.wilAdd.item)
        this.wilAdd = {
          index: -1,
          item: null
        }
      }
    },
    removeUser (selectedOption, id) {
      // if (!this.data.detailsShowing) this.data.toggleDetails()
      let data = {
        ticket_id: this.data.item.ticket_id,
        user_id: selectedOption.id,
        user_info: selectedOption.name,
        type: this.type
      }
      if (!confirm('Chắc chắn muốn xóa ' + selectedOption.name + ' không?')) {
        this.wilAdd.index = this.asyncSelected.findIndex(element => element.id === selectedOption.id)
        this.wilAdd.item = selectedOption
        return
      }
      sosService.apiRemoveUserHandleTicket(data).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.data.item.ticket_logs = response.data.data
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            this.asyncSelected.push(selectedOption)
            commonHelper.showMessage(response.data.message, 'warn')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Đã có lỗi xảy ra.', 'warn')
      }).then(() => {
        const container = this.$root.$el.querySelector(`#log-tab-${this.data.item.ticket_id}`)
        if (typeof container !== 'undefined') {
          setTimeout(() => { container.scrollTop = container.scrollHeight }, 0.01)
        }
      })
    },
    selectUser (selectedOption, id) {
      // if (!this.data.detailsShowing) this.data.toggleDetails()
      let data = {
        ticket_id: this.data.item.ticket_id,
        user_info: selectedOption.name,
        user_id: selectedOption.id,
        type: this.type
      }
      if (!confirm('Chắc chắn muốn thêm ' + selectedOption.name + ' không?')) {
        this.willRemove = selectedOption
        return
      }
      sosService.apiAddUserHandleTicket(data).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.data.item.ticket_logs = response.data.data
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            this.asyncSelected.splice(this.asyncSelected.findIndex(element => element.id === selectedOption.id), 1)
            commonHelper.showMessage(response.data.message, 'warn')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'warn')
      }).then(() => {
        const container = this.$root.$el.querySelector(`#log-tab-${this.data.item.ticket_id}`)
        if (typeof container !== 'undefined') {
          setTimeout(() => { container.scrollTop = container.scrollHeight }, 0.01)
        }
      })
    },
    asyncFind: debounce(function (query) {
      if (query) query = query.trim()
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      sosService.apiGetListUsers({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>

<style scoped lang="scss">
</style>
