<template>
  <div>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Họ tên</span>
      <b-input id="input-default" class="rounded" :value="fullname" disabled></b-input>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Hồ sơ</span>
      <b-input id="input-default" class="rounded" :value="documentName" disabled></b-input>
    </b-form-group>
    <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
      <span slot="label" class="font-14">Biển số xe</span>
      <div>
        <b-input id="input-default" class="rounded input_license_plate" v-model="rcInfo.head_license_plate"></b-input>
        <span> - </span>
        <b-input id="input-default" class="rounded input_license_plate" v-model="rcInfo.tail_license_plate"></b-input>
      </div>
    </b-form-group>
  </div>
</template>
<style scoped lang="scss">
  .input_license_plate {
    display: inline-block;
    width: 90px;
  }
</style>

<script>
export default {
  name: 'vehicle-rc-info',

  components: {
  },

  props: {
    rcInfo: {
      type: Object,
      default: _ => ({})
    },
    fullname: {
      type: String,
      default: ''
    },
    documentName: {
      type: String,
      default: ''
    }
  },
  data: _ => ({
    rcInfoData: {}
  })
}
</script>
