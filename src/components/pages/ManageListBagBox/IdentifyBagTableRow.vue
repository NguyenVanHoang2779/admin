<template>
  <tr>
    <td>
      <div class="mb-2">
        {{ bag.erp_alias }}
        <span v-if="bag.order">|{{ bag.order }}</span>
      </div>
      <div class="mb-2" v-if="bag.src_name && bag.dst_name">
        {{ bag.src_name || 'Chưa chọn kho' }} =>
        {{ bag.dst_name || 'Chưa chọn kho' }}
      </div>
    </td>

    <td class="bag-logs">
      <ul v-if="bagLogList.logsScan.length" class="mb-2 block-logs">
        <li v-for="(log, logIndex) in bagLogList.logsScan" :key="logIndex">
          <div v-if="log.type === 'LogConfirm'">
            <a class="link-item" :href="`/adm/profile/staff/${log.cuid}`" target="_blank">{{log.cuser}} </a>({{formatDate(log.created)}}): {{log.desc}}
            <a @click.p.prevent="openUrlInDialog($event)" :href="`/admin/AdBags/getListHisTruckUser?bag_order=${bag.order}&created=${log.created}`" target="_blank">Chi tiết</a>
          </div>

          <div v-else-if="log.type === 'LogScan'">
            <div v-if="log.action === 'QlmdConfirmShift' && (log.desc.length > 200)">
              <div :id="`childBagLogs-${bag.order}${logIndex}`" class="collapse-two-line" style="-webkit-box-orient: vertical;">
                <a class="link-item" :href="`/adm/profile/staff/${log.cuid}`" target="_blank">{{log.cuser}} </a>({{formatDate(log.created)}}): {{log.desc}}
              </div>
              <div :id="`childBagLog-${bag.order}${logIndex}`" class="d-none">
                <a class="link-item" :href="`/adm/profile/staff/${log.cuid}`" target="_blank">{{log.cuser}} </a>({{formatDate(log.created)}}): {{log.desc}}
              </div>
              <span> <a :href="`#childBagLog-${bag.order}${logIndex}`" @click.prevent="showHideChildBagLogs($event)" style="color: #02a065;">Xem thêm</a></span>
            </div>
            <div v-else-if="log.action === 'scannerWheelSorterLogWheel' || log.action === 'scannerWheelSorterLogOutbound'">
              <div class="collapse-two-line" style="-webkit-box-orient: vertical;">
                <a class="link-item" :href="`/adm/profile/staff/${log.cuid}`" target="_blank">{{log.cuser}} </a>({{formatDate(log.created)}}): <span v-html="log.desc"></span>
              </div>
            </div>
            <div v-else>
              <a class="link-item" :href="`/adm/profile/staff/${log.cuid}`" target="_blank">{{log.cuser}} </a>({{formatDate(log.created)}}): {{log.desc}}
              <a v-if="log.action === 'finishVerifyBagSession'" @click.p.prevent="openUrlInDialog($event)" :href="`/admin/AdBags/getPackageByBag?bag_order=${bag.order}&action=${log.action}`">Chi tiết</a>
            </div>
          </div>

          <div v-else-if="log.type === 'LogLego'">
            admin({{formatDate(log.created)}}): {{log.msg}}
            <a v-for="(link, linkIndex) in log.list_image" :key="linkIndex" :href="link" target="_blank">Link {{ linkIndex + 1 }}</a>
          </div>
        </li>
      </ul>

      <!-- HisBagLog: Có vẻ không còn được dùng -->
      <ul v-if="bag.HisBagLog && bag.HisBagLog.length" class="mb-2 block-logs">
        <li v-for="(log, logIndex) in bag.HisBagLog" :key="logIndex">
          {{ log.cuser }}({{ formatDate(log.created) }}): {{ log.desc }}
        </li>
      </ul>

      <!-- DescLogWaitExportation -->
      <div v-if="bag.LogWaitExportation && bag.LogWaitExportation.length" class="mb-2 block-logs">
        <b>Log chuồng</b>
        <ul>
          <li v-for="(log, logIndex) in bag.LogWaitExportation" :key="logIndex" v-html="log" />
        </ul>
      </div>

      <!-- LogReport -->
      <div v-if="bag.LogReport && bag.LogReport.length" class="mb-2 block-logs">
        <b>Log report</b>
        <ul>
          <li v-for="(log, logIndex) in bag.LogReport" :key="logIndex" v-html="log" />
        </ul>
      </div>

      <!-- ScanBagLogs -->
      <div v-if="bag.ScanBagLogs && bag.ScanBagLogs.length" class="mb-2 block-logs">
        <b>Log quét xuất/nhập</b>
        <ul>
          <li v-for="(log, logIndex) in bag.ScanBagLogs" :key="logIndex" v-html="log" />
        </ul>
      </div>

      <!-- ScanBagLogs (Log quét bàn giao bao Dteam/Rteam) -->
      <div class="show-hide-logs hide_more">
        <div v-if="bagLogList.logsScanDteam.length" class="mb-2 block-logs">
          <b>Log quét bàn giao bao Dteam/Rteam</b>
          <ul>
            <li v-for="(log, logIndex) in bagLogList.logsScanDteam" :key="logIndex" :class="{more: logIndex < bagLogList.logsScanDteam.length - maxNumberOfLogDisplayed}">
              <span><a class="link-item" :href="`/adm/profile/staff/${log.cuid}`" target="_blank">{{log.cuser}} </a>({{formatDate(log.created)}}): {{log.desc}}</span>
            </li>
          </ul>
        </div>
        <a v-if="bagLogList.logsScanDteam.length >= maxNumberOfLogDisplayed" href="#" class="btnShowHide" @click.prevent="showHideLogs($event)" data-title-hide="Ẩn" data-title-show="Hiển thị">
          &nbsp;
        </a>
      </div>

      <!-- ImageTruckBugket: Có vẻ như phần này ko còn được dùng -->
      <div v-if="bag.ImageTruckBugket && bag.ImageTruckBugket.length" class="mb-2 block-logs">
        <b>Log ảnh chụp thùng xe</b>
        <ul>
          <li v-for="(log, logIndex) in bag.ImageTruckBugket" :key="logIndex">
            {{ log.username }}({{ formatDate(log.created) }}) đã chụp ảnh thùng xe cho điểm dừng
            ({{ log.station_name }}) tại kho ({{ log.station_name }}) trong phiên {{ log.ss_id }}
            <a class="link-item" target="_blank" :href="log.image_url">
              <i>Link({{ logIndex + 1 }})</i>
            </a>
          </li>
        </ul>
      </div>
      <div v-if="bag.LogErrorValidate && bag.LogErrorValidate.length" class="mb-2 block-logs">
        <b>Log lỗi quét bao</b>
        <ul>
          <li v-for="(log, logIndex) in bag.LogErrorValidate" :key="logIndex" v-html="log" />
        </ul>
      </div>

      <div v-if="bag.FragileImage && bag.FragileImage.length" class="mb-2 block-logs">
        <b>Log ảnh</b>
        <ul>
          <li v-for="(log, logIndex) in bag.FragileImage" :key="logIndex" v-html="log" />
        </ul>
      </div>
    </td>
    <td>{{ formatDate(bag.created) }}</td>
    <td>{{ bag.created_username }}</td>
    <td>
      <template v-if="bag.Packages && bag.Packages.length">
        <a class="link-item" v-for="pkgOrder in bag.Packages" :key="pkgOrder" :href="`/admin?alias=${pkgOrder}`" target="_blank"> {{ pkgOrder }}</a>
      </template>
    </td>
    <td class="show-hide-logs hide_more">
      <ul v-if="bag.notes && bag.notes.length" class="pl-2 box-log-list">
        <template v-for="(log, logIndex) in bag.notes">
          <li :key="logIndex" :class="{more: logIndex < bag.notes.length - maxNumberOfLogDisplayed}">
            {{ log }}
          </li>
        </template>
        <a v-if="bag.notes.length >= maxNumberOfLogDisplayed" href="#" class="btnShowHide" @click.prevent="showHideLogs($event)" data-title-hide="Ẩn" data-title-show="Hiển thị">&nbsp;
        </a>
      </ul>
    </td>
    <td>
      <b-link
        target="_blank"
        class="btn btn-primary mb-2"
        :class="{'disabled': checkEmptyIdentifyBag(bag.order)}"
        :href="getIOTCameraURL(bag.order)">
        Check CAM
      </b-link><br>
      <b-button type="button" :disabled="checkPermissionReport(true, false)" variant="primary" class="mb-2" @click.prevent="reportMissingIdentifyBag">Báo mất</b-button><br>
      <b-button type="button" :disabled="checkPermissionReport(false, false)" variant="primary" class="mb-2" @click.prevent="addPrivateNoteForIdentifyBag">Ghi chú</b-button><br>
      <b-button type="button" :disabled="checkPermissionReport(false, true)" variant="primary" @click.prevent="reportFoundIdentifyBag">Tìm thấy</b-button>
    </td>
  </tr>
</template>

<script>
import moment from 'moment'
import CommonEntity from '../../../domain/entities/CommonEntity'
import IdentifyBag from '../../../domain/entities/IdentifyBag'

export default {
  name: 'IdentifyBagTableRow',
  props: ['bag', 'currentUser'],
  data () {
    return {
      maxNumberOfLogDisplayed: 5,
      action: 'addPrivateNote',
      IdentifyBag,
      GROUP_POSITION_JOB_MISSING_OR_FOUND: ['72', '131', '320'],
      BDH_gr_id: '22'
    }
  },
  computed: {
    bagLogList () {
      if (!this.bag.BagLog || this.bag.BagLog.length === 0) {
        return {
          logsArrived: [],
          logsScan: [],
          logsScanDteam: []
        }
      }

      const logs = this.bag.BagLog.map(log => {
        if (['cfmForward', 'cfmTransit', 'cfmImport'].indexOf(log.action) !== -1) {
          return {...log, type: 'LogConfirm'}
        }

        if (['addArrivedLogs', 'legoVerifyBag'].indexOf(log.action) === -1 && !log.is_from_lego) {
          return {...log, type: 'LogScan'}
        }

        if (log.is_from_lego) {
          return {...log, type: 'LogLego'}
        }

        return {...log, type: 'logArrived'}
      })

      return {
        logsArrived: logs.filter(log => log.type === 'logArrived'),
        logsScan: logs.filter(log => log.type !== 'logArrived' && log.action !== 'ScanHandingOverDteam'),
        logsScanDteam: logs.filter(log => log.action === 'ScanHandingOverDteam')
      }
    }
  },
  methods: {
    getIOTCameraURL (bagOrder) {
      return CommonEntity.IOT_BASE_URL + '/camera/bag-order?bag_order=' + bagOrder
    },
    reportMissingIdentifyBag () {
      this.$emit('reportMissingIdentifyBag', {
        cycleIdentifyBagId: this.bag._id,
        identifyBagId: this.bag.identify_bag_id,
        bagErpAlias: this.bag.erp_alias,
        bagOrder: this.bag.order,
        userId: parseInt(this.currentUser.User.id),
        username: this.currentUser.User.username,
        action: IdentifyBag.Action.ReportMissing
      })
    },
    reportFoundIdentifyBag () {
      this.$emit('reportFoundIdentifyBag', {
        cycleIdentifyBagId: this.bag._id,
        identifyBagId: this.bag.identify_bag_id,
        bagErpAlias: this.bag.erp_alias,
        bagOrder: this.bag.order,
        userId: parseInt(this.currentUser.User.id),
        username: this.currentUser.User.username,
        action: IdentifyBag.Action.ReportFound
      })
    },
    addPrivateNoteForIdentifyBag () {
      this.$emit('addPrivateNoteForIdentifyBag', {
        cycleIdentifyBagId: this.bag._id,
        identifyBagId: this.bag.identify_bag_id,
        bagErpAlias: this.bag.erp_alias,
        bagOrder: this.bag.order,
        userId: parseInt(this.currentUser.User.id),
        username: this.currentUser.User.username,
        action: IdentifyBag.Action.Note
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
    checkPermissionReport (isMissing, isFound) {
      if (this.bag.identify_bag_id === null || this.bag.identify_bag_id === undefined || this.bag.identify_bag_id === 0) {
        return true
      }

      // check trạng thái bao định danh có thể báo mất hay tìm thấy hay không
      var checkIsMissingOrFound = false
      if (isMissing) {
        checkIsMissingOrFound = this.bag &&
          (parseInt(this.bag.status) === IdentifyBag.Status.Missing ||
            parseInt(this.bag.is_deleted) === IdentifyBag.IsDelete.Yes)
      }
      if (isFound) {
        checkIsMissingOrFound = this.bag && parseInt(this.bag.status) !== IdentifyBag.Status.Missing
      }
      if (checkIsMissingOrFound) {
        return true
      }

      // check phân quyền user group_id = 22 và position_job in (72,131,320)
      return this.currentUser.Group.id !== this.BDH_gr_id ||
        !this.GROUP_POSITION_JOB_MISSING_OR_FOUND.includes(this.currentUser.ErpPosition.id)
    },
    checkEmptyIdentifyBag (order) {
      if (order === 0) {
        return true
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
