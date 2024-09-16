<template>
  <div class="paging mt-3 d-flex">
    <div style="width: 85%">
      <div>
        <b class="float-left">Trang {{ page.currentPage }}/{{ Math.ceil(page.totalItems/page.perPage) }}</b>
      </div>
      <div class="z-0 d-inline-block paginator-ghtk ml-2">
        <b-pagination
          class="mb-1"
          size="sm"
          align="left"
          v-model="page.currentPage"
          :total-rows="page.totalItems"
          :per-page="page.perPage"
          @input="onChangePage()"
        >
        </b-pagination>
      </div>
    </div>
<!--    <AddCandidate v-if="duty"-->
<!--      :isUploading="isUploading"-->
<!--      :fileExcelCandidateDisabled="fileExcelCandidateDisabled"-->
<!--      @changeFileExcelCandidateDisabled="changeFileExcelCandidateDisabled"-->
<!--      @importing="resetMessageImport"-->
<!--    >-->
<!--    </AddCandidate>-->
  </div>
</template>

<script>
// import AddCandidate from './AddCandidate'
export default {
  name: 'Pagination',
  components: {
    // AddCandidate
  },
  props: {
    page: {},
    isUploading: {
      default: false
    },
    fileExcelCandidateDisabled: {
      default () {
        return []
      }
    },
    duty: {
      default: true
    }
  },
  methods: {
    onChangePage () {
      this.$emit('changePage', this.page.currentPage)
    },

    changeFileExcelCandidateDisabled (data) {
      this.$emit('changeFileExcelCandidateDisabled', data)
    },

    resetMessageImport () {
      this.$emit('importing')
    }
  }
}
</script>

<style scoped>

</style>
