<template>
    <div>
        <p v-b-toggle.collapse-2 class="m-1 show-off-info" @click="onToggle">{{ showText }}</p>
        <b-collapse id="collapse-2" class="off-info">
            <span>{{ candidate.MasterProfile.resign_date | dateOnly }}</span>
            <span>{{ candidate.MasterProfile.resign_type }}</span>
            <span>{{ candidate.MasterProfile.resign_reason }}</span>
        </b-collapse>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['candidate'],
  data: () => ({ show: false, showText: 'Xem thông tin' }),
  methods: {
    onToggle () {
      this.show = !this.show
      this.showText = this.show ? 'Ẩn thông tin nghỉ việc' : 'Xem thông tin'
    }
  },
  filters: {
    dateOnly (d) {
      return d ? moment(d).format('DD-MM-YYYY') : 'Không có thông tin'
    }
  }
}
</script>
<style scoped>
.off-info{
  display: flex;
  flex-direction: column;
}
.show-off-info{
  cursor: pointer;
  color: #409eff;
}
</style>
