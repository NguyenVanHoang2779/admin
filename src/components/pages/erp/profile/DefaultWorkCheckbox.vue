<template>
<div>
  <b-form-checkbox-group id="checkbox-default-work" v-model="default_work" name="select-default-work" class="py-2">
    <b-form-checkbox value="down_truck">Nhập hàng</b-form-checkbox>
    <b-form-checkbox value="sorting_package">Rã bao</b-form-checkbox>
    <b-form-checkbox value="labeling">Chia hàng</b-form-checkbox>
    <b-form-checkbox value="sorting_bag">Nhập chuồng</b-form-checkbox>
    <b-form-checkbox value="up_truck">Xuất hàng</b-form-checkbox>
    <b-form-checkbox v-if="isOnsite" value="transit">Trung chuyển</b-form-checkbox>
  </b-form-checkbox-group>
</div>
</template>

<script>

export default {
  name: 'DefaultWorkCheckbox',
  props: ['job', 'index', 'isOnsite'],
  data: () => ({
    default_work: []
  }),
  methods: {},
  created () {
    this.default_work = this.job
  },
  watch: {
    default_work () {
      this.$emit('update-item-config', this.index, this.default_work)
    },
    job (newVal) {
      this.default_work = newVal
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
