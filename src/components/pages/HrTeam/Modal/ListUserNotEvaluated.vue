<template>
    <div>
        <b-modal ref="modalListUserNotEvaluated" :title="title" hide-footer @hidden="hideModal" content-class="modal-list-user-not-evaluated" body-class="modal-list-user-not-evaluated__body">
            <div v-if="listItems" class="list-users-checkin-wrapper">
                <div class="list-users-checkin">
                    <div v-for="item in listItems" class="list-users-checkin__item list-users-checkin-item">
                        <i @click="gotoDetail(item)" class="list-users-checkin-item__arrow ion d-block ion-ios-arrow-forward"></i>
                        <div class="list-users-checkin-item__row list-users-checkin-item__name">{{ item.fullname }} (
                            <span v-if="item.alias">{{ item.alias }}</span>
                            <span v-else>{{ item.staff_code }}</span>
                            )
                            <span class="ml-1 mr-1" v-if="type==='approve-recompense'">
                                <span v-if="parseInt(item.type) === 1" class="recompense bg-danger">Phạt</span>
                                <span v-if="parseInt(item.type) === 2" class="recompense bg-success">Thưởng</span>
                            </span>
                        </div>
                        <div class="list-users-checkin-item__row">Kho: {{ item.name }}</div>
                        <div class="list-users-checkin-item__row">Vị trí: {{ item.position_name }}</div>
                        <div class="list-users-checkin-item__row" v-if="type==='approve-recompense'">Thời gian tạo: {{ item.created }}</div>
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
import cycleTime from 'infrastructures/helpers/date.js'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'modal-list-user-not-evaluated',

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
      default: 'not-evaluation',
      type: String
    },
    cycleEvaluation: {
      default: null,
      type: Object
    }
  },

  data: () => ({
    listItems: [],
    page: 1,
    time_format: null
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
    this.getStartEndFromTimeRange()
  },

  methods: {
    getStartEndFromTimeRange () {
      this.time_format = {
        from: cycleTime.daysInThisMonth(21, 20).from,
        to: cycleTime.daysInThisMonth(21, 20).to
      }
    },
    resetDefault () {
      this.listItems = []
      this.page = 1
    },

    hideModal () {
      this.resetDefault()
      this.$refs.modalListUserNotEvaluated.hide()
      this.$emit('toggleModal', false)
    },

    showModal () {
      this.$refs.modalListUserNotEvaluated.show()
      this.$emit('toggleModal', true)
    },

    gotoDetail (item) {
      let queryData = commonHelper.encodeQueryData({
        from: this.type === 'approve-recompense' ? '1970-01-01' : this.time_format.from,
        to: this.time_format.to
      })
      let url = `/adm/evaluation/detail/${item.id}?${queryData}`
      window.open(url, '_blank')
    },

    infiniteHandler ($state) {
      let params = {
        page: this.page
      }

      if (this.type === 'not-evaluation') {
        params.from = this.cycleEvaluation.from
        params.to = this.cycleEvaluation.to
      }

      switch (this.type) {
        case 'not-evaluation':
          this.getListUserNotEvaluated(params, $state)
          break
        case 'approve-recompense':
          this.getListUserRecompense(params, $state)
          break
      }
    },

    getListUserRecompense (params, $state) {
      HrStatisticService.getListUserRecompense(params).then((res) => {
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
    },

    getListUserNotEvaluated (params, $state) {
      HrStatisticService.getListUserNotEvaluated(params).then((res) => {
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
    .modal-list-user-not-evaluated {
        &__body {
            padding: 0;
        }
    }
    .modal-list-checkin {
        &__body {
            padding: 0;
        }
    }
</style>
<style lang="scss" scoped>
    .recompense {
        color: white;
        border-radius: 5px;
        padding: 4px 10px;
    }

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
