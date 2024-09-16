<template>
  <div class="list mt-4" v-loading="loading">
    <div v-if="rewards.length > 0">
      <DetailReward
        v-for="(reward, index) in rewards" :key="index"
        :reward="reward"
        @editReward="editReward"
        @approveReward="approveReward"
        @removeReward="removeReward"
        @cancelReward="cancelReward"
      />
      <div class="d-flex align-items-center mt-3">
        <span class="text-center">{{`Trang ${filter.page} trên ` + Math.ceil(page.total/filter.perPage)}}</span>
        <b-pagination
          class="ml-2 paginator-ghtk my-0"
          size="sm"
          v-model="filter.page"
          :total-rows="page.total"
          :per-page="filter.perPage"
          @input="handlePaginate"
        ></b-pagination>
      </div>
    </div>
    <div v-else>
      <div class="text-center">Không có dữ liệu</div>
    </div>
    <ModalFstar
      :actionModal="'edit'"
      :dataReward="dataReward"
      @reloadListFstar="reloadListFstar"
      :fstar-type="'reward'"
      :type-options="typeOptions"
    />
    <ModalRewardConfirm
      :title="titleModalConfirm"
      :content="contentModalConfirm"
      :action="actionModalConfirm"
      :dataReward="dataReward"
      @reloadListFstar="reloadListFstar"
    />
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import fstarService from 'domain/services/fstar-service'
import DetailReward from './DetailReward.vue'
import DetailPenalty from '../Penalty/DetailPenalty.vue'
import ModalRewardConfirm from './ModalRewardConfirm.vue'
import ModalFstar from '../ModalFstar.vue'

export default {
  name: 'UserReward',
  components: {
    DetailPenalty,
    DetailReward,
    ModalRewardConfirm,
    ModalFstar
  },
  props: {
    userId: {
      type: Number | null,
      default: null
    },
    from: {
      type: String | null,
      default: helper.formatDate(new Date(), 'YYYY-MM-DD')
    },
    to: {
      type: String | null,
      default: helper.formatDate(new Date(), 'YYYY-MM-DD')
    }
  },
  computed: {
    helper: _ => helper
  },
  data () {
    return {
      loading: false,
      rewards: [],
      dataReward: null,
      titleModalConfirm: '',
      contentModalConfirm: '',
      actionModalConfirm: '',
      page: {
        total: 0
      },
      filter: {
        page: 1,
        perPage: 10
      },
      typeOptions: []
    }
  },
  async created () {
    await this.getReward()
    await this.getTypeReward()
  },
  methods: {
    async handlePaginate () {
      await this.getReward()
    },
    async reloadListFstar () {
      await this.getReward()
    },
    editReward (data) {
      this.dataReward = data
      this.$bvModal.show('modal-reward-fstar-edit')
    },
    approveReward (data) {
      this.dataReward = data
      this.titleModalConfirm = 'Xác nhận duyệt khen thưởng'
      this.contentModalConfirm = 'Bạn có chắc chắn muốn duyệt khen thưởng ?'
      this.actionModalConfirm = 'approve'
      this.$bvModal.show('modal-action-reward-confirm')
    },
    removeReward (data) {
      this.dataReward = data
      this.titleModalConfirm = 'Xác nhận xóa khen thưởng'
      this.contentModalConfirm = 'Bạn có chắc chắn muốn xóa khen thưởng ?'
      this.actionModalConfirm = 'remove'
      this.$bvModal.show('modal-action-reward-confirm')
    },
    cancelReward (data) {
      this.dataReward = data
      this.titleModalConfirm = 'Xác nhận từ chối khen thưởng'
      this.contentModalConfirm = 'Bạn có chắc chắn muốn từ chối khen thưởng ?'
      this.actionModalConfirm = 'cancel'
      this.$bvModal.show('modal-action-reward-confirm')
    },
    async getReward () {
      this.loading = true
      const dataSend = {
        user_id: this.userId,
        from: this.from,
        to: this.to,
        page: this.filter.page,
        limit: this.filter.perPage
      }

      await fstarService.getReward(dataSend)
        .then(response => {
          if (response.data.success) {
            this.page.total = response.data.total || 0
            this.rewards = response.data.data
          } else {
            this.rewards = []
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          this.rewards = []
          helper.showMessage(error.response.data.message, 'error')
        })
      this.loading = false
    },
    async getTypeReward () {
      await fstarService.getTypeReward()
        .then(response => {
          if (response.data.success) {
            this.typeOptions = response.data.data
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.list .detail:nth-child(odd) {
  background-color: #F4FEF6;
}
</style>
