<template>
  <table class="table table-sm table-bordered">
    <thead>
      <tr>
        <th>Thông tin cũ</th>
        <th>Thông tin thay đổi</th>
      </tr>
    </thead>
    <tbody v-if="logs.new">
      <tr v-for="(typeData, type) in logs.new" :key="type">
        <td class="old-data">
          <VisualData :data="logs.old[type]" />
        </td>
        <td class="new-data">
          <VisualData :data="typeData" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import VisualData from './VisualData'
export default {
  name: 'log-change',

  components: {
    VisualData
  },

  props: {
    logs: {
      default: _ => ({})
    }
  }
}
</script>
