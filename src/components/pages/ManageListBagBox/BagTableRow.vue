<template>
  <tr>
    <td>
      <div v-if="Number(bag.is_pkg) > 0"><b>Mã đơn lẻ:</b> {{ bag.is_pkg }}</div>
      <div class="mb-2">
        {{ transportTypes && transportTypes[bag.transport] ? transportTypes[bag.transport] : 'Bay Bộ' }} -
        {{ bag.order }} ({{ bag.Packages ? bag.Packages.length : 0 }})
      </div>
      <div class="mb-2">
        {{ bag.src_name || 'Chưa chọn kho' }}{{ bag.src_code ? `(${bag.src_code})` : '' }} =>
        {{ bag.dst_name || 'Chưa chọn kho' }}{{ bag.dst_code ? `(${bag.dst_code})` : '' }}
      </div>

      <!-- Danh sách bao con -->
      <div class="child-bag-list mb-2">
        <div class="font-weight-bold">
          Bao con ({{ bag.BagsBag ? bag.BagsBag.length : 0 }})
          <span v-if="bag.BagsBag.length">: <a :href="`#childBagOrder-${bag.order}`" @click.prevent="showHideChildBags($event)">Show</a></span>
        </div>
        <div v-if="bag.BagsBag.length" :id="`childBagOrder-${bag.order}`" class="d-none">
          <span v-if="!bag.BagsBag || !bag.BagsBag.length">Không có bao con</span>
          <template v-else v-for="bagOrder in bag.BagsBag">
            <span class="link-item" :key="bagOrder"> {{ bagOrder }}</span>
          </template>
        </div>
      </div>
      <div>
        <a target="_blank" :href="getIOTCameraURL(bag.order)"> >> Check CAM</a>
      </div>
    </td>

    <td class="bag-logs">
      <!-- BagLog -->
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
    <td v-if="bag.pp_created">{{ formatDate(bag.pp_created) }}</td>
    <td v-else>{{ formatDate(bag.created) }}</td>
    <td>{{ bag.created_username }}</td>
    <td>{{ bag.weight }}</td>
    <td>
      <p v-if="bag.Truck">{{ [bag.Truck.code || '', bag.Truck.alias || '', bag.Truck.color || ''].filter(value => !!value).join(' - ') }}</p>
      <ul v-if="bagLogList.logsArrived.length" class="pl-1">
        <li v-for="(log, logIndex) in bagLogList.logsArrived" :key="logIndex">
          {{log.cuser}} ({{formatDate(log.created)}}) {{log.desc}}
        </li>
      </ul>
    </td>
    <td>
        <a class="link-item" v-for="pkgOrder in bag.Packages" :key="pkgOrder" :href="`/admin?alias=${pkgOrder}`" target="_blank"> {{ pkgOrder }}</a>
    </td>
    <td>
      <ul v-if="bag.BagsNote && bag.BagsNote.length" class="pl-1">
        <li v-for="(note, noteIndex) in bag.BagsNote" :key="noteIndex" v-html="note" />
      </ul>
    </td>
  </tr>
</template>

<script>
import moment from 'moment'
import CommonEntity from '../../../domain/entities/CommonEntity'

export default {
  name: 'BagTableRow',
  props: ['bag', 'transportTypes'],
  data () {
    return {
      customAddArrivedLogs: [],
      maxNumberOfLogDisplayed: 5
    }
  },
  computed: {
    bagLogList () {
      if (!this.bag.BagLog && this.bag.BagLog.length) {
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
    showHideChildBags (event) {
      const id = event.target.href.split('#').pop()
      const childBagView = document.querySelector('#' + id)
      if (!childBagView) {
        return
      }
      if (childBagView.classList.contains('d-none')) {
        childBagView.classList.remove('d-none')
      } else {
        childBagView.classList.add('d-none')
      }
    },
    formatDate (dateValue) {
      return dateValue ? moment(dateValue).format('HH:mm:ss DD/MM/YYYY') : ''
    },
    openUrlInDialog (event) {
      this.$emit('openUrlInDialog', event.target.href)
    },
    getIOTCameraURL (bagOrder) {
      return CommonEntity.IOT_BASE_URL + '/camera/bag-order?bag_order=' + bagOrder
    },
    showHideChildBagLogs (event) {
      const id = event.target.href.split('#childBagLog-').pop()
      const childBagView = document.querySelector('#childBagLog-' + id)
      event.target.classList.add('d-none')
      document.querySelector('#childBagLogs-' + id).classList.add('d-none')
      if (!childBagView) {
        return
      }
      if (childBagView.classList.contains('d-none')) {
        childBagView.classList.remove('d-none')
      } else {
        childBagView.classList.add('d-none')
      }
    },
    showHideLogs (event) {
      const div = event.target.closest('div')
      if (!div) {
        return null
      }

      if (div.classList.contains('hide_more')) {
        div.classList.remove('hide_more')
      } else {
        div.classList.add('hide_more')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bag-logs {
  ul {
    padding-left: 0.75rem;
  }

  .block-logs + .block-logs {
    &::before {
      content: "";
      border-top: 1px solid rgba(24, 28, 33, 0.06);
      display: block;
      padding-bottom: 0.5rem;
    }
  }
}
.collapse-two-line {
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  overflow: hidden;
  text-overflow: ellipsis;
}
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
