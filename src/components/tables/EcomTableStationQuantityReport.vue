<template>
  <div>
    <div class="demo-vertical-spacing">
      <table class="table">
        <tbody>
        <tr class="table-active" v-for="(value, key) in childRes">
          <th>{{value}}</th>
          <td>{{key}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcomTableStationQuantityReport',

  props: ['childRes']
}
</script>
