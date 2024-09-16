<template>
  <div>
    <div v-if="loading" class="text-center">
      <i class="fa fa-spinner fa-spin mr-2"/> Đang tải cấu hình Năng lực CoD...
    </div>

    <b-alert variant="warning" class="mb-0" show v-else-if="errorMessage">{{ errorMessage }}</b-alert>

    <div v-else>
      <div class="overflow-x-scroll table-responsive">
        <table class="table w-auto">
          <thead>
          <tr>
            <th style="width: 150px">Thâm niên</th>
            <th v-for="(label, key) of master"
                :class="{'text-center':true, 'text-success': key == settings.currentCapacityConfig}">
              {{ label }}
            </th>
            <th></th>
          </tr>
          </thead>

          <tbody v-if="!configs.length">
          <tr>
            <td colspan="6">Chưa có cấu hình nào được cài đặt. Vui lòng nhấn vào nút <b>Thêm</b> để thêm cấu hình
              mới
            </td>
          </tr>
          </tbody>

          <tbody v-else>
          <tr v-for="(aCapacityConfig, index) in configs" :key="index">
            <td>Ca {{ index + 1 }}</td>
            <td v-for="(packageQuantity, pIndex) in aCapacityConfig" :key="index + '_' + pIndex">
              <input type="number"
                     :class="{'form-control': true, 'border-success': pIndex == settings.currentCapacityConfig}"
                     style="width: 100px"
                     v-model.number="configs[index][pIndex]">
            </td>
            <td>
              <b-button variant="secondary" class="w-100px" size="sm"
                        @click.prevent="doShowModalLog(index + 1)"
                        :class="{invisible: index + 1 > settings.currentTotalWorkShift}">
                Xem log
              </b-button>
              <b-button variant="outline-danger" size="sm" @click.prevent="removeConfigRow(index)"
                        :class="{invisible: index + 1 <= settings.defaultWorkShiftAmount}">
                Xóa
              </b-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <b-alert variant="warning" class="mb-0" show v-if="validationMessage">{{ validationMessage }}</b-alert>

      <div class="mb-2 d-flex flex-row justify-content-between">
        <div>
          <b-button variant="outline-success" size="sm" @click.prevent="addNewConfigRow()"
                    :disabled="configs.length >= settings.configsMaxLength">
            <i class="fas fa-plus"/> Thêm
          </b-button>
          <b-form-checkbox v-model="allowOverTarget.checked" :value="true" :disabled="isCodBadDebt" class="mt-3">
            {{ allowOverTarget.title }}
          </b-form-checkbox>
        </div>
      </div>
    </div>

    <modal-work-capacity-log v-if="isShowLogModal" :workShiftId="settings.workShiftIdLog" :user-id="this.userId"
                             @closed="onHideLogModal"/>
  </div>
</template>

<script>
import ModalWorkCapacityLog from './ModalWorkCapacityLog'

export default {
  name: 'WorkCapacityForm',
  components: {ModalWorkCapacityLog},
  props: {
    userId: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    validationMessage: {
      type: String,
      default: '',
      required: true
    },
    errorMessage: {
      type: String,
      default: '',
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    allowOverTarget: {
      type: Object,
      required: true
    },
    master: {
      type: Object,
      required: true
    },
    configs: {
      type: Array,
      required: true
    },
    isCodBadDebt: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowLogModal: false
    }
  },
  methods: {
    onHideLogModal () {
      this.isShowLogModal = false
    },
    doShowModalLog (workShift) {
      this.settings.workShiftIdLog = workShift
      this.isShowLogModal = true
    },
    addNewConfigRow () {
      const newRow = {}
      Object.keys(this.master).forEach(key => {
        newRow[key] = ''
      })
      this.configs.push(newRow)
    },
    removeConfigRow (index) {
      this.configs.splice(index, 1)
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="scss">
.w-100px {
  width: 100px;
}
</style>
