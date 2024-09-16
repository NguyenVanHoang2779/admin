<template>
  <div class="list mt-4" v-loading="loading">
    <div v-if="penalties.length > 0">
      <DetailPenalty
        v-for="(penalty, index) in penalties" :key="index"
        :penalty="penalty"
        @editPenalty="editPenalty"
        @cancelPenalty="cancelPenalty"
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
      :dataReward="dataPenalty"
      @reloadListFstar="reloadListFstar"
      :fstar-type="'penalty'"
      :type-options="typeOptions"
    />
    <ModalPenaltyConfirm
      :title="titleModalConfirm"
      :content="contentModalConfirm"
      :action="actionModalConfirm"
      :dataPenalty="dataPenalty"
      @reloadListFstar="reloadListFstar"
    />
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import fstarService from 'domain/services/fstar-service'
import DetailPenalty from './DetailPenalty.vue'
import ModalPenaltyConfirm from '../Penalty/ModalPenaltyConfirm.vue'
import ModalFstar from '../ModalFstar.vue'

export default {
  name: 'UserPenalty',
  components: {
    ModalFstar,
    ModalPenaltyConfirm,
    DetailPenalty},
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
      penalties: [],
      dataPenalty: null,
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
    await this.getPenalty()
    await this.getTypePenalty()
  },
  methods: {
    async reloadListFstar () {
      await this.getPenalty()
    },
    editPenalty (data) {
      this.dataPenalty = data
      this.$bvModal.show('modal-penalty-fstar-edit')
    },
    cancelPenalty (data) {
      this.dataPenalty = data
      this.titleModalConfirm = 'Xác nhận bỏ phạt'
      this.actionModalConfirm = 'cancel'
      this.$bvModal.show('modal-action-penalty-confirm')
    },
    async handlePaginate () {
      await this.getPenalty()
    },
    async getPenalty () {
      this.loading = true
      const dataSend = {
        user_id: this.userId,
        from: this.from,
        to: this.to,
        page: this.filter.page,
        limit: this.filter.perPage
      }
      await fstarService.getPenalty(dataSend)
        .then(response => {
          if (response.data.success) {
            this.page.total = response.data.total || 0
            this.penalties = response.data.data
          } else {
            this.penalties = []
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          this.penalties = []
          helper.showMessage(error.response.data.message, 'error')
        })
      this.loading = false
    },
    async getTypePenalty () {
      await fstarService.getTypePenalty()
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
