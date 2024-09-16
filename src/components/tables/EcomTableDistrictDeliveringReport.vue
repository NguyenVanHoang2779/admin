<template>
  <div>
    <div class="demo-vertical-spacing">
      <b-row>
        <b-col md="6">
          <table class="table">
            <tbody>
              <tr class="table-active" v-for="item in childRes[0]">
                <th>{{item.name}}</th>
                <td>{{item.value}}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col md="6">
          <table class="table">
            <tbody>
              <tr class="table-active" v-for="item in childRes[1]">
                <th>{{item.name}}</th>
                <td>{{item.value}}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ecom-table-district-delivering-report',

  props: ['childRes']
}
</script>
