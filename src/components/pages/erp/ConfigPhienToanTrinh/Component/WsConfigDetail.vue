<template>
  <div>
    <h2 class="text-center">Chi tiết các phiên toàn trình</h2>
    <table class="table b-table table-bordered table-striped">
      <thead>
      <tr class="text-secondary">
        <th class="text-center">#</th>
        <th class="text-center">Khung nhập</th>
        <th class="text-center">Thời điểm xuất</th>
        <th class="text-center">Cần xuất</th>
        <th class="text-center">Ca hẹn giao</th>
      </tr>
      </thead>
      <tbody v-for="(data, index) in listConfigDetail" :key="index">
      <tr class="table-light">
        <td class="text-center">{{index}}</td>
        <td class="text-center">
          <b-button-group size="sm" class="mb-2">
            <b-button variant="outline-success">Bắt đầu : {{data.ws_start_import}}</b-button>
            <b-button variant="outline-danger">Kết thúc : {{data.ws_finish_import}}</b-button>
          </b-button-group>
        </td>
        <td class="text-center">
          <b-button size="sm" variant="outline-danger">{{data.ws_export}}</b-button>
        </td>
        <td class="text-center">{{data.ws_config_type | filterConfigType}}</td>
        <td class="text-center">{{data.ws_type_id | filterType}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'WsConfigDetail',
  props: ['listConfigDetail'],
  filters: {
    filterType: (value) => {
      if (!value) return ''
      switch (+value) {
        case 0: return 'Sáng'
        case 1: return 'Gãy Sáng'
        case 2: return 'Chiều'
        case 3: return 'Gãy Chiều'
        case 4: return 'Tối'
        default: return 'Không xác định'
      }
    },
    filterConfigType: (value) => {
      if (!value) return ''
      switch (+value) {
        case 0: return 'Trong ngày'
        case 1: return 'Hôm sau'
        default: return 'Không xác định'
      }
    }
  }
}
</script>

<style scoped>

</style>
