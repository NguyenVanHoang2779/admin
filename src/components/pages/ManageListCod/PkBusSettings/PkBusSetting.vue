<template>
  <div class="delivery-setting">
    <b-card>
      <template #header>
        <h4 class="mb-0">Cấu hình Pk Bus</h4>
      </template>

      <pk-bus-setting-form :user-id="userId" />
    </b-card>
  </div>
</template>
<script>
import PkBusSettingForm from './PkBusSettingForm'
export default {
  name: 'PkBusSetting',
  components: {PkBusSettingForm},
  props: {
    userId: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
