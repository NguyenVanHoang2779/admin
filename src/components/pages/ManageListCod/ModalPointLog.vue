<template>
  <div>
    <b-modal
      title="Lịch sử thay đổi thông tin lộ trình"
      size="lg"
      header-bg-variant="white"
      header-text-variant="black"
      static
      centered
      scrollable
      v-model="show"
    >
      <div v-if="loading" class="text-center">
        <i class="fa fa-spin fa-spinner"/> Đang tải...
      </div>

      <table class="table log-config">
        <thead></thead>
        <tbody>
        <tr v-for="(item, index) in logs" :key="index">
          <td style="width: 20%">
            <div><span class="mt-2">{{item.created_user_fullname}}</span></div>
            <div><span class="mt-2">{{item.date_created}}</span></div>
            <div><span class="mt-2">{{item.time_created}}</span></div>
          </td>
          <td style="width: 80%">
            <div><span v-html="filterHtml(item.desc)"></span></div>
          </td>
        </tr>
        </tbody>
      </table>

      <template #modal-footer="{ hide }">
        <div class="w-100">
          <b-button
            variant="outline-secondary"
            size="sm"
            class="float-right"
            @click="hide()"
          >
            Đóng
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import manageListCodService from '../../../domain/services/manage-list-cod-service'
import commonHelper from '../../../infrastructures/helpers/common-helpers'

export default {
  name: 'ModalPointLog',
  props: {
    stopPointId: {
      type: Number,
      required: true
    },
    component: {
      type: String,
      default: 'DeliverySetting'
    }
  },
  data () {
    return {
      logs: [],
      show: false,
      loading: false
    }
  },
  mounted () {
    this.getLog()
    this.show = true
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
  },
  methods: {
    filterHtml (html) {
      return commonHelper.filterHtml(html)
    },
    async getLog () {
      try {
        this.loading = true
        switch (this.component) {
          case 'PickingSetting':
            this.logs = await manageListCodService.getPickingSettingLog(this.stopPointId)
            break
          case 'DeliverySetting':
          default:
            this.logs = await manageListCodService.getDeliverySettingLog(this.stopPointId)
            break
        }
      } catch (reason) {
        commonHelper.showMessage(reason.toString(), 'error')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
  .log-config > tbody {
    display: block;
    height: 400px;
    width: 100%;
    overflow-y: auto;
  }

  .log-config > tbody > tr {
    display: table;
    width: 100%;
    table-layout: inherit;
  }

  .log-config > tbody > tr:nth-child(odd) > td,
  .log-config > tbody > tr:nth-child(odd) > th {
    background-color: #f3fafc;
  }
</style>
