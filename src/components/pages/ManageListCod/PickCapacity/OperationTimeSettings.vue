<template>
  <div>
    <div v-if="loading" class="text-center">
      <i class="fa fa-spinner fa-spin mr-2"/> Đang tải cấu hình Thời gian thao tác...
    </div>
    <b-alert variant="warning" class="mb-0" show v-else-if="errorMessage">{{ errorMessage }}</b-alert>
    <div v-else>
      <table class="table table-responsive w-auto">
        <thead>
        <tr>
          <th colspan="6">Thời gian thao tác</th>
        </tr>
        </thead>
        <tbody>
        <tr :key="index" v-for="(key, index) in Object.keys(master)">
          <td>
            <span class="mx-3">{{ master[key].title }}:</span>
          </td>
          <td>
            <input style="width: 75px" type="number" v-model.number="configs[key]"
                   :class="{'form-control': true}">
          </td>
          <td>{{ master[key].unit }}</td>
        </tr>
        <tr colspan="3">
          <td colspan="3" v-if="validationMessage">
            <b-alert variant="warning" class="mb-0" show>{{ validationMessage }}</b-alert>
          </td>
        </tr>
        <tr>
          <td>
            <b-form-checkbox v-model="allowExplosion.checked" :disabled="!settings.allowConfig" class="mt-3">
              {{ allowExplosion.title }}
            </b-form-checkbox>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationTimeSettings',
  data () {
    return {}
  },
  props: {
    configs: {
      type: Object,
      required: true
    },
    master: {
      type: Object,
      required: true
    },
    allowExplosion: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    validationMessage: {
      type: String,
      default: '',
      required: true
    },
    errorMessage: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style scoped>

</style>
