<template>
    <div @scroll="endScroll" class="candidate-board" v-loading="loading">
      <ListCandidates
          class="table-data mh-100"
          :listCandidates="candidates"
          :newCandidates="newCandidates"
          :isCloseShift="isCloseShift"
          :permissions="permissions"
          @createUserSuccess="refreshPage"
          @reloadCandidates="refreshPage"
          @refreshModelTags="refreshPage"
          @openTagOfCandidate="openTagManage"
          @explanation="explanation"
      >
      </ListCandidates>
      <div v-if="candidates.length < 1">
        <p class="mb-3 text-center">Không có dữ liệu !</p>
      </div>
      <div v-else-if="paginate.current_page >= paginate.last_page">
        <p class="mb-3 text-center">Đã đến cuối trang !</p>
      </div>
      <CandidateTagModal
        :record-id="selectedCandidate.id"
        :tags-candidate="selectedCandidate.tags"
        @attach="pushCandidateTag"
      ></CandidateTagModal>
    </div>
</template>

<script>
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// component
import ListCandidates from '../Uni/Recruitment/ListCandidate.vue'
import CandidateTagModal from '../Uni/Recruitment/ModalCandidateTag.vue'

export default {
  name: 'NewCandidateBoard',
  components: {
    ListCandidates,
    CandidateTagModal
  },
  props: {
    teamId: {
      default: null
    },
    triggerCandidate: {
      default: 0
    },
    isCloseShift: {
      default: true
    },
    isLoadFirstTime: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isScrollGetCandidate: false,
      newCandidates: [],
      candidates: [],
      paginate: {
        total: 0,
        per_page: 10,
        from: 1,
        to: 0,
        current_page: 1,
        last_page: 0,
        first_page_url: '',
        last_page_url: '',
        links: [
          {
            url: null,
            label: '',
            active: false
          }
        ],
        next_page_url: '',
        path: '',
        prev_page_url: null
      },
      must_handle: 0,
      selectedCandidate: {
        id: null,
        tags: []
      },
      permissions: [],
      loading: false
    }
  },

  watch: {
    loading (newVal) {
      this.$emit('load', {loading: newVal})
    },

    teamId (newVal) {
      if (newVal) {
        this.refreshPage()
      } else {
        this.paginate.current_page = 1
        this.paginate.total = 0
        this.candidates = []
        this.newCandidates = []
      }
    },

    triggerCandidate () {
      this.refreshPage()
    },

    must_handle (number) {
      this.$emit('changeTotalCandidates', {total: number})
      if (number > 0) {
        this.$emit('unfinishedClosingShift')
      } else {
        this.$emit('finishedClosingShift')
      }
    }

    // candidates (newVal) {
    //   if (newVal.length === 0) {
    //     this.$emit('finishedClosingShift')
    //   } else {
    //     this.$emit('unfinishedClosingShift')
    //   }
    // }
  },

  created () {
    if (this.isLoadFirstTime && this.teamId) {
      this.refreshPage()
    }
  },

  methods: {
    async endScroll (el) {
      // Check trên product khi load đến cuối trang rồi nhưng vâẫn không scroll tiếp(ví dụ thanh scroll đang ở 10.5 nhưng điểm cuối là 11) nên cần trừ đi 20 để chạy được
      if (el.target.offsetHeight > 0 && el.target.scrollTop > 0 && ((el.target.offsetHeight + el.target.scrollTop) >= (el.target.scrollHeight - 20))) {
        if (this.paginate.current_page <= this.paginate.last_page) {
          await this.getCandidates(false)
        }
      }
    },

    async refreshPage () {
      this.paginate.current_page = 1
      this.paginate.total = 0
      this.candidates = []
      this.newCandidates = []

      await this.getCandidates(true)
      this.countCandidateMustHandle()
    },

    async getCandidates (isReload = false) {
      if (!this.teamId) {
        helper.showMessage('Bạn chưa chọn team chốt ca!', 'warning')
        return
      }

      if (this.isScrollGetCandidate) {
        return
      }

      this.isScrollGetCandidate = true
      this.loading = true
      if (isReload) {
        this.paginate.current_page = 1
      }
      const params = {
        emp_team_id: this.teamId,
        page: this.paginate.current_page ? this.paginate.current_page : 1,
        per_page: this.paginate.per_page ? this.paginate.per_page : 10
      }
      const res = await recruitmentService.getCandidateForCloseShift(params)
      const {success, data, permission, message} = res.data
      if (success) {
        if (data.length) {
          this.candidates = this.candidates || []
          this.newCandidates = data
          this.candidates.push(...data)
        }

        const paginate = {}
        Object.keys(this.paginate).forEach(key => {
          paginate[key] = res.data[key] || this.paginate[key]
        })
        this.paginate = paginate

        this.permissions = permission || []

        if (data.length) {
          this.paginate.current_page++
        }
      } else {
        helper.showMessage(message || 'Có lỗi xảy ra khi lấy dữ liệu tuyển dung!', 'warning')
      }
      this.loading = false
      this.isScrollGetCandidate = false
    },

    countCandidateMustHandle () {
      if (!this.teamId) {
        helper.showMessage('Bạn chưa chọn team chốt ca!', 'warning')
        return
      }

      const params = {
        emp_team_id: this.teamId,
        explained: 0,
        just_count: 1
      }

      recruitmentService.getCandidateForCloseShift(params)
        .then(res => {
          const {success, total, message} = res.data
          if (success) {
            this.must_handle = total
          } else {
            this.must_handle = 0
            helper.showMessage(message || 'Có lỗi xảy ra khi lấy dữ liệu tuyển dung!', 'warning')
          }
        }).catch(err => {
          this.must_handle = 0
          helper.showMessage(err.message || 'Có lỗi xảy ra khi lấy dữ liệu tuyển dung!', 'error')
        })
    },

    openTagManage (candidate) {
      if (candidate) {
        this.selectedCandidate = candidate
      }

      this.$bvModal.show('candidate-tag-modal')
    },

    pushCandidateTag (tag) {
      this.selectedCandidate.tags.push({
        tag_id: tag.tag_id,
        name: tag.tag_name,
        type: tag.tag_type
      })
    },

    explanation (candidate) {
      this.$emit('explainCandidate', candidate)
    }
  }
}
</script>

<style scoped>
.candidate-board {
  max-height: 100%;
  overflow-y: scroll;
}
</style>
