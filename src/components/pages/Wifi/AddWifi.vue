<template>
  <b-modal id="add-wifi" ref="my-modal" size="lg" no-close-on-backdrop button-size="sm"
           @ok="add" @cancel="cancel" @close="close" cancel-title="Hủy bỏ" static>
    <div slot="modal-title">{{title}}</div>
    <b-row>
      <b-col>
        <b-form-group
          label="Chọn kho:"
          label-for="input-1"
          :state="null"
        >
          <single-select-station :station-id="wifi.stationId" @handleSelectedStation="handleSelectedStation"></single-select-station>
        </b-form-group>
        <b-form-group
          label="Nhập tên wifi:"
          label-for="input-name"
          :state="null"
        >
          <b-form-input id="input-name" v-model="wifi.name" placeholder="Nhập tên wifi" :state="null" trim></b-form-input>
        </b-form-group>
        <b-form-group
          label="Trạng thái:"
          label-for="input-1"
        >
          <multiselect
            v-model="wifi.status"
            :options="statuses"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            placeholder="Trạng tháng wifi">
          </multiselect>
        </b-form-group>
        <b-form-group
          label="Nhập bssid:"
          label-for="input-bssid"
        >
          <div v-click-outside="closeSuggestion">
            <b-form-input id="input-bssid" @click="evenClickInputBssid" @input="emptyBssid" @blur="validateBssid" v-model="wifi.bssid" placeholder="Nhập bssid" trim></b-form-input>
            <b-card ref="suggestion" class="custom-suggest" style="display: none;">
              <p class="element" v-for="item in suggestionBssid" :key="item" @click="chooseSuggestion(item)">{{item}}</p>
            </b-card>
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
          <b-alert v-if="invalidMess" show variant="danger" class="custom-arler">{{invalidMess}}</b-alert>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import CommonHelper from 'infrastructures/helpers/common-helpers'
import WifiService from 'domain/services/wifi-service'
import ClickOutside from 'vue-click-outside'
import Multiselect from 'vue-multiselect'

export default {
  name: 'AddWifi',

  components: {
    Multiselect,
    CommonHelper,
    SingleSelectStation
  },

  directives: {
    ClickOutside
  },

  props: [
    'triggerShow',
    'objWifi'
  ],

  watch: {
    triggerShow: function (newVal, oldVal) {
      this.openModal()
    },

    'wifi.bssid': function (newVal, oldVal) {
      if (newVal) {
        this.openSuggestion()
        if (this.suggestionBssid.includes(this.wifi.bssid)) this.closeSuggestion()
        else this.matches()
      } else this.closeSuggestion()
    },

    'wifi.id': function (newVal, oldVal) {
      if (newVal) {
        this.title = 'Cập nhật wifi:'
      } else this.title = 'Thêm wifi tại kho:'
    },

    'wifi.stationId': function (newVal, oldVal) {
      if (newVal) {
        this.clearInvalidMess()
        this.getListBssidSuggestion()
      }
    },

    objWifi: function (newVal, oldVal) {
      if (newVal) {
        this.asssignValue(Object.assign({}, newVal))
      }
    }
  },

  created () {
  },

  data: () => ({
    title: 'Thêm wifi tại kho:',
    wifi: {
      id: '',
      name: '',
      bssid: '',
      stationId: '',
      status: 'active'
    },
    invalidField: '',
    invalidMess: '',
    suggestionBssid: [],
    listSuggestionBssid: [],
    statuses: ['active', 'disable']
  }),

  methods: {
    openModal: function () {
      this.$refs['my-modal'].show()
    },

    add: function (modal) {
      let data = this.wifi
      WifiService.addWifi(data).then(res => {
        if (res.data.success) {
          CommonHelper.showMessage(res.data.message, 'success')
          this.$emit('success')
          this.cleaderData()
        } else {
          CommonHelper.showMessage(res.data.message, 'warning')
          modal.preventDefault()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    cancel: function (modal) {
      this.cleaderData()
    },

    close: function () {
      this.cleaderData()
    },

    openSuggestion: function () {
      if (this.suggestionBssid.length > 0) {
        this.$refs['suggestion'].style.display = 'block'
      }
    },

    closeSuggestion: function () {
      this.$refs['suggestion'].style.display = 'none'
    },

    chooseSuggestion: function (suggest) {
      this.wifi.bssid = suggest
      this.closeSuggestion()
    },

    matches: function () {
      this.suggestionBssid = this.listSuggestionBssid.filter((str) => {
        return str.indexOf(this.wifi.bssid) >= 0
      }, this.wifi).slice(0, 10)
    },

    getListBssidSuggestion: function () {
      WifiService.getListBssidSuggestionByStation(this.wifi.stationId).then(res => {
        if (res.data.success) {
          this.listSuggestionBssid = res.data.data
          this.suggestionBssid = res.data.data.slice(0, 10)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleSelectedStation: function (option) {
      this.wifi.stationId = option ? option.id : ''
    },

    validateBssid: function () {
      this.clearInvalidMess()
      if (!this.wifi.stationId) {
        this.invalidField = 'station'
        this.invalidMess = 'Vui lòng chọn kho trước.'
        return
      }

      let regx = /([0-9a-fA-F]{2}(:|$)){6}/
      if (!this.wifi.bssid.match(regx)) {
        this.invalidField = 'bssid'
        this.invalidMess = 'Bssid không hợp lệ.'
      }
    },

    emptyBssid: function () {
      this.clearInvalidMess()
      if (!this.wifi.bssid) {
        this.invalidField = 'bssid'
        this.invalidMess = 'Bssid không được để trống.'
      }
    },

    evenClickInputBssid: function () {
      this.clearInvalidMess()
      if (!this.wifi.stationId) {
        this.invalidField = 'station'
        this.invalidMess = 'Vui lòng chọn kho trước.'
        return
      }
      this.openSuggestion()
    },

    clearInvalidMess: function () {
      this.invalidField = ''
      this.invalidMess = ''
    },

    cleaderData: function () {
      this.wifi = {
        id: '',
        name: '',
        bssid: '',
        stationId: '',
        status: 'active'
      }
    },

    asssignValue: function (data) {
      this.wifi.id = data.id
      this.wifi.name = data.name
      this.wifi.bssid = data.bssid
      this.wifi.stationId = data.station_id
      this.wifi.status = data.status
    },

    getState: function (con1, con2) {
      if (con1 === con2) return false
      return null
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .custom-suggest >>> .card-body {
    padding: 10px 0px 0px 0px;
  }

  .element {
    margin-bottom: 3px;
    padding: 5px 5px 5px 24px;
  }

  .element:hover {
    background-color: #f8f9fa;
  }

  .custom-arler {
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
