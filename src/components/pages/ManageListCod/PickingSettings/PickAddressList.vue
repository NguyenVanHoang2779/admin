<template>
  <div class="table-responsive">
    <table class="w-100 table table-bordered table-striped">
      <thead>
      <tr>
        <th style="width: 50px">STT</th>
        <th style="width: 30%">Tên shop</th>
        <th style="width: 10%">Mã shop</th>
        <th style="width: 10%">Số điện thoại</th>
        <th>Địa chỉ Shop</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(address, addressIndex) in pickingAddresses" :key="address.id">
        <td class="text-center">{{ addressIndex + 1 }}</td>
        <td>{{ address.shop_name }}</td>
        <td>{{ address.shop_code }}</td>
        <td>{{ address.shop_tel }}</td>
        <td>{{ address.shop_first_address }}, {{ address.shop_last_address }} </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PickAddressList',
  props: {
    pickingAddresses: {
      type: Array,
      required: true
    }
  }
}
</script>
