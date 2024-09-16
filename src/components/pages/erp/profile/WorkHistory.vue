<template>
    <div class="card-body">
        <div class="top-wrapper">
          <div class="top">
            <div class="top-add">
              <b-button :variant="showingType === 'transfer' ? 'info' : 'light'">
                Điều chuyển/Thuyên chuyển
              </b-button>
            </div>
            <b-button variant="link" @click="showDetail('transfer')">(Xem chi tiết)</b-button>
        </div>
        <div class="top">
            <div class="top-add">
              <b-button :variant="showingType === 'promotion' ? 'info' : 'light'">
                Bổ nhiệm/Giáng chức
              </b-button>
            </div>
            <b-button variant="link" @click="showDetail('promotion')">(Xem chi tiết)</b-button>
        </div>
          <div class="top">
            <div class="top-add">
              <b-button :variant="showingType === 'pause' ? 'info' : 'light'">
                Tạm dừng/ Ngừng công tác
              </b-button>
            </div>
            <b-button variant="link" @click="showPauseWorkDetail">(Xem chi tiết)</b-button>
          </div>
          <div class="top">
            <div class="top-add" @click="openDetailContract">
              <b-button :variant="showingType === 'contract' ? 'info' : 'light'">
                <i class="fa fa-eye"></i> Lịch sử thay đổi hợp đồng
              </b-button>
            </div>
          </div>
        </div>
        <ModalAddWorkHistory
          @toggle="toggleModal"
          @refresh="reloadHistories"
          :open="openModal"
          :users="users"
        />
        <PauseWorkHistories
          :histories="histories"
          :orderType="orderType"
          :orderField="orderField"
          @refresh="reloadPauseHistories"
          @changeOrder="changeOrder"
          v-if="showPauseWork"
        />
        <WorkHistories
        :orderType="orderType"
        :orderField="orderField"
        :histories="histories"
        @refresh="reloadHistories"
        @changeOrder="changeOrder"
        :showingType="showingType"
        v-else
        />
        <modal-detail-contract
          id="detail-contract"
          :profile="profile"
          @click="openDetailContract"
        ></modal-detail-contract>
    </div>
</template>

<script>
import ModalAddWorkHistory from './ModalAddWorkHistory'
import ModalAddPauseWorkHistory from './ModalAddPauseWorkHistory'
import userService from 'domain/services/user-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import WorkHistories from './WorkHistories'
import PauseWorkHistories from './PauseWorkHistories'
import ModalDetailContract from '../contract/ModalDetailContract.vue'

export default {
  components: {
    ModalAddWorkHistory,
    ModalAddPauseWorkHistory,
    WorkHistories,
    PauseWorkHistories,
    ModalDetailContract
  },
  props: ['users', 'reloadHistory'],
  data () {
    return {
      openModal: false,
      histories: [],
      showPauseWork: false,
      showingType: 'transfer',
      showContract: false,
      profile: {
        id: this.$route.params.id,
        fullname: null,
        userId: null,
        username: null
      },
      orderField: 'start_date',
      orderType: 'desc',
      orderSource: null
    }
  },
  mounted () {
    this.showDetail()
  },
  methods: {
    changeOrder ({field, type, source}) {
      this.orderType = type
      this.orderField = field
      this.orderSource = source
    },
    toggleModal (status) {
      this.openModal = status
    },
    async showPauseWorkDetail () {
      try {
        this.$startLoading()
        const {data} = await userService.getUserPauseWorkHistory({id: this.$route.params.id, order: `${this.orderField} ${this.orderType}`})
        this.showPauseWork = true
        this.showingType = 'pause'
        this.histories = data.histories
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },
    async showDetail (searchType = 'transfer') {
      try {
        this.$startLoading()
        const {data} = await userService.getUserWorkHistory({id: this.$route.params.id, type: searchType, order: `${this.orderField} ${this.orderType}`})
        this.showPauseWork = false
        this.showingType = searchType
        this.histories = data.histories
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },
    reloadHistories () {
      this.showDetail(this.showingType)
    },
    reloadPauseHistories () {
      this.showPauseWorkDetail()
    },
    openDetailContract () {
      this.showingType = 'contract'
      this.$bvModal.show('detail-contract')
    }
  },
  watch: {
    orderField () {
      if (this.orderSource === 'pause') this.showPauseWorkDetail()
      else if (this.orderSource === 'default') this.showDetail(this.showingType)
    },
    orderType () {
      if (this.orderSource === 'pause') this.showPauseWorkDetail()
      else if (this.orderSource === 'default') this.showDetail(this.showingType)
    },
    reloadHistory () {
      this.showPauseWorkDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
  display: flex;
  align-items: center;

  &-add {
    display: flex;
    cursor: pointer;
  }

  &-title {
    margin: 0 5px 0 5px;
  }
}
.top-wrapper{
  margin-bottom: 2vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
