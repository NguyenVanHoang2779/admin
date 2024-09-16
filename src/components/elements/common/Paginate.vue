<template>
  <div class="paginate row mt-3">
    <div class="col col-md-10 text-left">
      <span>Bản ghi/ trang</span>
      <select
        class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
        v-model="page.perPage"
        @change="changePaginate()"
      >
        <option>5</option>
        <option>10</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
      </select>
      <div class="z-0 d-inline-block">
        <b-pagination
          class="paginator-ghtk mb-0"
          size="sm"
          align="left"
          v-model="page.currentPage"
          :total-rows="+page.totalItems"
          :per-page="+page.perPage"
          @input="changePaginate()"
        >
        </b-pagination>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Paginate',
  props: {
    page: {
      type: Object
    }
  },
  methods: {
    changePaginate () {
      this.$emit('changePaginate', this.page.currentPage)
    }
  }
}
</script>

<style scoped lang="scss">
span {
  font-weight: 400;
}
</style>
