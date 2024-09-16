<template>
    <div>
        <ListCandidates
            class="table-data mh-100"
            :listCandidates="listCandidates"
            :isStaffShiftPage="isStaffShiftPage"
            :permissions="permissions"
            @createUserSuccess="refreshPage"
            @reloadCandidates="refreshPage"
            @refreshModelTags="refreshPage"
            @explainCandidate="explainCandidate"
        >
        </ListCandidates>
        <infinite-loading spinner="spiral" @infinite="loadMore" ref="infiniteLoading" >
            <div slot="no-more" class="text-center">Đã đến cuối trang !</div>
            <div slot="no-results" class="text-center">Không có dữ liệu nào !</div>
        </infinite-loading>
    </div>
</template>

<script>
import candidateService from 'domain/services/candidate-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// build-in Component
import InfiniteLoading from 'vue-infinite-loading'

// component
import ListCandidates from '../Candidate/ListCandidates'
export default {
  name: 'CandidatesBoard',
  components: {
    InfiniteLoading,
    ListCandidates
  },
  props: {
    teamId: {
      default: null
    },
    triggerCandidate: {
      default: 0
    },
    isStaffShiftPage: {
      default: true
    },
    isLoadFirstTime: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listCandidates: [],
      permissions: [],
      totalCandidates: 0,
      loading: false,
      must_handle: 1,
      page: 1,
      limit: 10,
      default_page: 1,
      stateLoad: null
    }
  },

  watch: {
    loading (newVal) {
      this.$emit('load', {loading: newVal})
    },

    totalCandidates (newVal) {
      this.$emit('changeTotalCandidates', {total: newVal})
    },

    teamId (newVal) {
      if (newVal) {
        this.refreshPage()
      } else {
        this.totalCandidates = 0
      }
    },

    triggerCandidate () {
      this.refreshPage()
    },

    listCandidates (newVal) {
      if (newVal.length === 0) {
        this.$emit('finishedClosingShift')
      } else {
        this.$emit('unfinishedClosingShift')
      }
    }
  },

  created () {
    if (this.isLoadFirstTime) {
      this.refreshPage()
    }
  },

  methods: {
    loadMore ($state) {
      if (this.page > 1) {
        if ($state) {
          this.stateLoad = $state
        }
        this.getCandidates(false, this.stateLoad)
      }
    },

    explainCandidate (candidate) {
      this.$emit('explainCandidate', candidate)
    },

    async refreshPage () {
      this.totalCandidates = 0
      this.listCandidates = []
      if (this.stateLoad) {
        this.stateLoad.reset()
      }
      await this.getCandidates(true)
    },

    async getCandidates (isReload = false) {
      this.loading = true
      if (isReload) {
        this.page = 1
      }
      const params = {
        must_handle: this.must_handle,
        team_id: this.teamId,
        page: this.page,
        limit: this.limit
      }

      try {
        const {data} = await candidateService.getCandidateListV2(params)
        if (data.success) {
          if (data.data.length) {
            this.totalCandidates = data.count
            this.listCandidates = this.listCandidates || []
            this.listCandidates.push(...data.data)
            this.permissions = data.permission
            this.page = this.page + 1
            if (this.stateLoad) {
              this.stateLoad.loaded()
            }
          } else {
            if (this.stateLoad) {
              this.stateLoad.complete()
            }
          }
        } else {
          helper.showMessage(data.message || 'Không thuộc vùng quản lý !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
