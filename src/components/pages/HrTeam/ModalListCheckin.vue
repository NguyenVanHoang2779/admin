<template>
  <div>
    <b-modal ref="modalListCheckin" :title="title" hide-footer @hidden="hideModal" content-class="modal-list-checkin" body-class="modal-list-checkin__body">
        <div v-if="listItems" class="list-users-checkin-wrapper">
          <div class="list-users-checkin">
            <div v-for="item in listItems" class="list-users-checkin__item list-users-checkin-item">
              <i @click="gotoDetail(item)" class="list-users-checkin-item__arrow ion d-block ion-ios-arrow-forward"></i>
              <div class="list-users-checkin-item__row list-users-checkin-item__name">{{ item.fullname }} ({{ item.username }})</div>
              <div class="list-users-checkin-item__row">Kho: {{ item.station_name }} / {{ item.province_name }}</div>
              <div class="list-users-checkin-item__row">Vị trí: {{ item.position_name }}</div>
              <div class="list-users-checkin-item__row">
                Đang chờ duyệt: <span class="list-users-checkin-item__number">{{ item.request_pending_number }}</span> yêu cầu
              </div>
            </div>
            <infinite-loading spinner="spiral" @infinite="infiniteHandler">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
    </b-modal>
  </div>
</template>
<script>
import HrStatisticService from 'domain/services/hr-statistic-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'modal-list-checkin',

  components: {
    InfiniteLoading
  },

  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    title: {
      default: 'Yêu cầu duyệt công',
      type: String
    },
    type: {
      default: 'pending-checkin',
      type: String
    },
    filters: {
      type: Object
    },
    listApiFilter: {
      default: () => ([]),
      type: Array
    }
  },

  data: () => ({
    listItems: [],
    page: 1
  }),

  watch: {
    isShow: function (newVal, oldVal) {
      if (newVal) {
        this.showModal()
      } else {
        this.hideModal()
      }
    }
  },

  created () {
  },

  methods: {
    resetDefault () {
      this.listItems = []
      this.page = 1
    },

    hideModal () {
      this.resetDefault()
      this.$refs.modalListCheckin.hide()
      this.$emit('toggleModal', false)
    },

    showModal () {
      this.$refs.modalListCheckin.show()
      this.$emit('toggleModal', true)
    },

    gotoDetail (item) {
      let queryData = commonHelper.encodeQueryData({
        province_id: item.province_id,
        station_id: item.station_id,
        username: item.username,
        from: this.filters.from,
        to: this.filters.to
      })
      let url = `/admin/timesheet/manager-checkin?${queryData}`
      window.open(url, '_blank')
    },

    infiniteHandler ($state) {
      let params = {
        page: this.page,
        type_statistic: this.type
      }
      HrStatisticService.getCheckinDataDetail(params).then((res) => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            this.page = this.page + 1
            $state.loaded()
            this.listItems = [...this.listItems, ...res.data.data]
          } else {
            $state.complete()
          }
        } else {
          throw res.data.message
        }
      }).catch(e => {
        commonHelper.showMessage(e, 'warning')
      })
    }
  }
}
</script>
<style lang="scss">
  .modal-list-checkin {
    &__body {
      padding: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .list-users-checkin-wrapper {
    height: calc(100vh - 120px);
    overflow-y: auto;
  }
  .list-users-checkin {
    padding: 0 15px;
    &__item {
      border-bottom: 1px solid #ccc;
    }
  }

  .list-users-checkin-item {
    position: relative;
    padding: 10px 0;

    &__row {
      padding: 3px 0;
    }

    &__arrow {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 30px;
      color: green;
      cursor: pointer;
    }

    &__name {
      font-weight: bold;
    }

    &__number {
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
