<template>
  <tr>
    <td>
      <div class="mb-2">
        Mã: {{ box.erp_alias }}
        <span >(Chưa được dùng)</span>
      </div>
      <div class="mb-2">
      </div>
    </td>
    <td class="show-hide-logs hide_more">
      <ul v-if="box.log_verify_box && box.log_verify_box.length" class="pl-2 box-log-list">
        <template v-for="(log, logIndex) in box.log_verify_box">
          <li :key="logIndex" :class="{more: logIndex < box.log_verify_box.length - maxNumberOfLogDisplayed}">
            {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
          </li>
        </template>
      </ul>
    </td>
    <td>{{ formatDate(box.created) }}</td>
    <td> Hệ thống tự động </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</template>

<script>
import moment from 'moment'

export default {
  name: 'BoxEmptyBoxTemp',
  props: ['box'],
  data () {
    return {
      maxNumberOfLogDisplayed: 5
    }
  },
  methods: {
    formatDate (dateValue) {
      return dateValue ? moment(dateValue).format('HH:mm:ss DD/MM/YYYY') : ''
    }
  }
}
</script>

<style scoped lang="scss">
.show-hide-logs {
  .btnShowHide:before {
    content: attr(data-title-hide);
  }

  &.hide_more {
    .more {
      display: none;
    }

    .btnShowHide:before {
      content: attr(data-title-show);
    }
  }
}
</style>
