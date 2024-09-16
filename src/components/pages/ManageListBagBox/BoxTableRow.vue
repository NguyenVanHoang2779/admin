<template>
  <tr>
    <td>
      <div class="mb-2">
        Mã: {{ box.erp_alias }}
        <span v-if="box.box_id">(ID:#{{ box.box_id }})</span>
      </div>
      <div class="mb-2" v-if="box.origin_st_id">
        Kho quản lý: {{ box.origin_st_name }}
      </div>
      <div class="mb-2">
        {{ box.src_st_name || 'Chưa chọn kho' }}{{ box.src_st_id }} =>
        {{ box.dst_st_name || 'Chưa chọn kho' }}{{ box.dst_st_id }}
      </div>
    </td>
    <td class="show-hide-logs hide_more">
      <ul v-if="box.logs && box.logs.length" class="pl-2 box-log-list">
        <template v-for="(log, logIndex) in filterLogsByAction(box.logs)">
          <li :key="logIndex" :class="{more: logIndex < box.logs.length - maxNumberOfLogDisplayed}">
            {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
            <span v-if="log.url && log.url.length">
              <a class="link-item" v-for="(url, urlIndex) in log.url" :href="url" @click.prevent="showImage(url)">Ảnh {{++urlIndex}}</a>
            </span>
          </li>
        </template>
      </ul>
      <div v-if="box.validation_logs && box.validation_logs.scan &&  box.validation_logs.scan.length" class="mb-2 block-logs">
        <b>Log lỗi quét Hộp</b>
        <ul>
          <li v-for="(log, logIndex) in box.validation_logs['scan']" :key="logIndex">
            {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
          </li>
        </ul>
      </div>
      <div v-if="box.validation_logs && box.validation_logs.import_cage && box.validation_logs.import_cage.length" class="mb-2 block-logs">
        <b>Log quét nhập chuồng</b>
        <ul>
          <li v-for="(log, logIndex) in box.validation_logs.import_cage" :key="logIndex">
            {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
          </li>
        </ul>
      </div>
      <div v-if="box.box_cage_import_logs && box.box_cage_import_logs.length" class="mb-2 block-logs">
        <b>Log nhập chuồng</b>
        <ul class="pl-2 box-log-list">
          <li v-for="(log, logIndex) in box.box_cage_import_logs" :key="logIndex">
            {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
          </li>
        </ul>
      </div>
      <a v-if="box.logs.length >= maxNumberOfLogDisplayed" href="#" class="btnShowHide" @click.prevent="showHideLogs($event)" data-title-hide="Ẩn" data-title-show="Hiển thị">
        &nbsp;
      </a>
    </td>
    <td>{{ formatDate(box.created) }}</td>
    <td>{{ box.username }}</td>
    <td>{{ box.weight }}</td>
    <td>
      <template v-if="box.truck">
        <p>{{ [box.truck.code || '', box.truck.alias || '', box.truck.color || ''].filter(value => !!value).join(' - ') }}</p>
      </template>
    </td>
    <td>
      <template v-if="box.packages">
        <a class="link-item" v-for="pkgOrder in box.packages" :key="pkgOrder" :href="`/admin?alias=${pkgOrder}`" target="_blank"> {{ pkgOrder }}</a>
      </template>
    </td>
    <td class="show-hide-logs hide_more">
      <ul v-if="box.logs && box.logs.length" class="pl-2 box-log-list">
        <template v-for="(log, logIndex) in filterLogsByAction(box.logs,this.action)">
          <li :key="logIndex" :class="{more: logIndex < box.logs.length - maxNumberOfLogDisplayed}">
            {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
          </li>
        </template>
        <a v-if="box.logs.length >= maxNumberOfLogDisplayed" href="#" class="btnShowHide" @click.prevent="showHideLogs($event)" data-title-hide="Ẩn" data-title-show="Hiển thị">&nbsp;
        </a>
      </ul>
    </td>
    <td>
      <a class="btn btn-primary mb-2" target="_blank" :href="getIOTCameraURL(box.box_id)">Check CAM</a><br>
      <b-button type="button" :disabled="isMissingBox()" variant="primary" class="mb-2" @click.prevent="reportMissingBox">Báo mất</b-button><br>
      <b-button type="button" :disabled="checkPermissionAddPrivateNote()" variant="primary" class="mb-2" @click.prevent="addPrivateNoteForBox">Ghi chú</b-button><br>
      <b-button type="button" :disabled="!isMissingBox()" variant="primary" @click.prevent="reportFoundBox">Tìm thấy hộp</b-button>
    </td>
  </tr>
</template>

<script>
import moment from 'moment'
import GreenBox from '../../../domain/entities/GreenBox'
import CommonEntity from '../../../domain/entities/CommonEntity'

export default {
  name: 'BoxTableRow',
  props: ['box', 'currentUser'],
  data () {
    return {
      maxNumberOfLogDisplayed: 5,
      action: 'addPrivateNote',
      GROUP_MODULE_MANAGER: ['61', '76', '147', '148', '73'], //  GROUP_MODULE_MANAGER: position_job
      GROUP_POST_OFFICE: ['192', '114', '189'], // GROUP_POST_OFFICE: position_job
      BDH_gr_id: '22'
    }
  },
  methods: {
    isMissingBox () {
      return this.box && parseInt(this.box.status) === GreenBox.Status.Missing
    },
    getIOTCameraURL (boxId) {
      return CommonEntity.IOT_BASE_URL + '/camera/green-box?box_id=' + boxId
    },
    reportMissingBox () {
      this.$emit('reportMissingBox', {
        boxErpAlias: this.box.erp_alias,
        originStation: {
          id: this.box.origin_st_id,
          name: this.box.origin_st_name
        }
      })
    },
    reportFoundBox () {
      this.$emit('reportFoundBox', {
        boxErpAlias: this.box.erp_alias,
        originStation: {
          id: this.box.origin_st_id,
          name: this.box.origin_st_name
        }
      })
    },
    formatDate (dateValue) {
      return dateValue ? moment(dateValue).format('HH:mm:ss DD/MM/YYYY') : ''
    },
    showHideLogs (event) {
      const td = event.target.closest('td')
      if (!td) {
        return null
      }

      if (td.classList.contains('hide_more')) {
        td.classList.remove('hide_more')
      } else {
        td.classList.add('hide_more')
      }
    },
    addPrivateNoteForBox () {
      this.$emit('addPrivateNote', {
        boxErpAlias: this.box.erp_alias,
        boxId: this.box.box_id
      })
    },
    filterLogsByAction (logs, actionLog = null) {
      // eslint-disable-next-line no-unused-vars
      let arrLogs
      if (actionLog === this.action) {
        arrLogs = logs.filter((log) => {
          return log.action === this.action
        })
      } else {
        arrLogs = logs.filter((log) => {
          return log.action !== this.action
        })
      }
      return arrLogs
    },
    checkPermissionAddPrivateNote () {
      if (this.box.box_id === null) {
        return true
      }
      if (this.currentUser.Group.id !== this.BDH_gr_id && this.currentUser.Group.id !== this.GSKV_gr_id && this.currentUser.Group.id !== '5' && this.currentUser.Group.id !== '12' && this.currentUser.Group.id !== '19') {
        return true
      }
      if (this.currentUser.Group.id === '5') {
        if (!this.GROUP_MODULE_MANAGER.includes(this.currentUser.ErpPosition.id)) {
          return true
        }
      }
      if (this.currentUser.Group.id === '19') {
        if (!this.GROUP_POST_OFFICE.includes(this.currentUser.ErpPosition.id)) {
          return true
        }
      }
      return false
    },
    showImage (url) {
      this.$emit('showDialogImg', {
        url: url,
        showModal: true
      })
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
