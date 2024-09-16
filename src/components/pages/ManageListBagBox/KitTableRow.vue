<template>
  <tr>
    <td>
      <div class="mb-2">
        Mã: {{ kit.asset_alias }}
        <span v-if="kit.kit_user_id">(ID:#{{ kit.kit_user_id }})</span>
      </div>
      <div class="mb-2" v-if="kit.src_station_id">
        Kho nguồn: {{ kit.src_station_name }}
      </div>
      <div class="mb-2" v-if="kit.truck_order">
        Xe tải: {{ kit.truck_code }}
      </div>
    </td>
    <td class="show-hide-logs hide_more">
      <ul v-if="kit.xteam_logs && kit.xteam_logs.length" class="pl-2 box-log-list">
        <template v-for="(xteamLog, xteamLogIndex) in kit.xteam_logs">
          <li :key="xteamLogIndex" :class="{more: xteamLogIndex < kit.xteam_logs.length - maxNumberOfLogDisplayed}">
            {{ xteamLog.username }}({{ formatDate(xteamLog.created) }}): {{ xteamLog.desc }}
          </li>
        </template>
      </ul>

      <div v-if="kit.kit_logs && kit.kit_logs.length" class="mb-2 block-logs">
        <b>Log xuất/nhập</b>
        <ul>
          <template v-for="(log, logIndex) in kit.kit_logs">
              <li :key="logIndex" :class="{more: logIndex < kit.kit_logs.length - maxNumberOfLogDisplayed}">
              {{ log.username }}({{ formatDate(log.created) }}): {{ log.desc }}
            </li>
          </template>
        </ul>
      </div>
      <a v-if="(kit.xteam_logs && kit.xteam_logs.length >= maxNumberOfLogDisplayed)
        || (kit.kit_logs && kit.kit_logs.length >= maxNumberOfLogDisplayed)"
         href="#" class="btnShowHide"
         @click.prevent="showHideLogs($event)"
         data-title-hide="Ẩn"
         data-title-show="Hiển thị">
      </a>
    </td>
    <td>{{ formatDate(kit.created) }}</td>
    <td>{{ kit.username }}</td>
    <td>
      <template v-if="kit.packages">
        <a class="link-item" v-for="(pkgOrder, pkgIndex) in kit.packages" :key="pkgIndex" :href="`/admin?alias=${encodeURI(pkgOrder)}`" target="_blank"> {{ pkgOrder }}</a>
      </template>
    </td>
    <td class="show-hide-logs hide_more">
      <ul v-if="kit.note && kit.note.length" class="pl-2 box-log-list">
        <template v-for="(description, descriptionIndex) in kit.note">
          <li :key="descriptionIndex" :class="{more: descriptionIndex < kit.note.length - maxNumberOfLogDisplayed}">
            {{ description.username }}({{ formatDate(description.created) }}): {{ description.note }}
          </li>
        </template>
        <a v-if="kit.note && kit.note.length >= maxNumberOfLogDisplayed" href="#" class="btnShowHide" @click.prevent="showHideLogs($event)" data-title-hide="Ẩn" data-title-show="Hiển thị">&nbsp;
        </a>
      </ul>
    </td>
    <td>
      <b-button type="button" variant="primary" class="mb-2" @click.prevent="addPrivateNoteForKit">Ghi chú</b-button><br>
      <b-button type="button" :disabled="isMissingKit()" variant="primary" class="mb-2" @click.prevent="reportMissingKit">Báo mất</b-button><br>
      <b-button type="button" :disabled="isFoundKit()" variant="primary" @click.prevent="reportFoundKit">Tìm thấy kit</b-button>
    </td>
  </tr>
</template>

<script>
import moment from 'moment'
import Kit from '../../../domain/entities/Kit'

export default {
  name: 'KitTableRow',
  props: ['kit', 'currentUser'],
  data () {
    return {
      maxNumberOfLogDisplayed: 5,
      REPORT_MISSING_AND_FOUND_KIT: ['72', '131'], // REPORT_MISSING_AND_FOUND_KIT: position_job
      BDH_gr_id: '22'
    }
  },
  methods: {
    isMissingKit () {
      if (this.currentUser.Group.id === this.BDH_gr_id && this.REPORT_MISSING_AND_FOUND_KIT.includes(this.currentUser.ErpPosition.id)) {
        return this.kit && parseInt(this.kit.status) === Kit.Status.Missing
      }
      return true
    },
    isFoundKit () {
      if (this.currentUser.Group.id === this.BDH_gr_id && this.REPORT_MISSING_AND_FOUND_KIT.includes(this.currentUser.ErpPosition.id)) {
        return this.kit && parseInt(this.kit.status) !== Kit.Status.Missing
      }
      return true
    },
    reportMissingKit () {
      this.$emit('reportMissingKit', {
        kitErpAlias: this.kit.asset_alias,
        originStation: {
          id: this.kit.src_station_id
          // name: this.kit.origin_st_name
        },
        kitId: this.kit.kit_id,
        kitUserId: this.kit.kit_user_id,
        userId: this.currentUser.User.id
      })
    },
    reportFoundKit () {
      this.$emit('reportFoundKit', {
        kitErpAlias: this.kit.asset_alias,
        originStation: {
          id: this.kit.src_station_id
          // name: this.kit.origin_st_name
        },
        kitId: this.kit.kit_id,
        kitUserId: this.kit.kit_user_id,
        userId: this.currentUser.User.id
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
    addPrivateNoteForKit () {
      this.$emit('addPrivateNoteForKitParent', {
        kitAssetAlias: this.kit.asset_alias,
        kitUserId: this.kit.kit_user_id,
        userId: this.currentUser.User.id
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
