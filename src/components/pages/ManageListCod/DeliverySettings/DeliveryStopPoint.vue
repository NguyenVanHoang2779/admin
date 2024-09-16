<template>
  <div>
    <div class="mb-3">
      <div class="table-responsive1 mb-3">
        <table class="table" style="min-width: 1200px; table-layout: fixed">
          <thead>
          <tr>
            <th style="width: 100px"></th>
            <th style="width: 37%"></th>
            <th style="width: 16%">Khung thời gian nhận hàng</th>
            <th style="width: 16%">Đặc tính khu vực</th>
            <th style="width: 16%">Yêu cầu nhận hàng</th>
            <th style="width: 150px">Thao tác</th>
          </tr>
          </thead>

          <tbody v-if="!stopPoints.length">
          <tr>
            <td colspan="6">Chưa có điểm nào được cài đặt. Vui lòng nhấn vào nút <b>Thêm</b> để thêm điểm mới</td>
          </tr>
          </tbody>

          <draggable v-else element="tbody" :list="stopPoints" handle=".handle">
            <tr v-for="(point, pointIndex) in stopPoints" :key="point.stop_point_id">
              <td>
                <div class="handle no-wrap col-form-label">Điểm {{ pointIndex + 1 }}:</div>
              </td>
              <td>
                <multi-select-address-lv5 :lv4Ids="addressLv4" v-model="point.points" @change="sendPointsToGmap" :ignore-list="gmapIds" />
                <div class="invalid-feedback d-block note-point" v-if="point.note">{{point.note}}</div>
              </td>
              <td>
                <multiselect
                  class="multiselect-success stop-point-tag"
                  v-model="point.deliver_time"
                  placeholder="Chọn khung giờ"
                  track-by="id"
                  :options="deliverTimeOptions(point.deliver_time)"
                  :multiple="true"
                  select-label="✓"
                  deselect-label="✗"
                  selected-label="✓"
                  :taggable="true"
                  :custom-label="customDeliverTime"
                  @tag="(tagName) => addNewDeliverTime(point, tagName) && false"
                  @input="(listSelected) => doShowDeliverTimeModal(point, listSelected)"
                />
              </td>
              <td>
                <multiselect
                  class="multiselect-success stop-point-tag"
                  v-model="point.characteristics"
                  tag-placeholder="Thêm đặc tính khu vực"
                  placeholder="Chọn đặc tính khu vực"
                  tag-position="bottom"
                  label="name"
                  track-by="id"
                  :options="characteristicsOptions(point.characteristics)"
                  :multiple="true"
                  :taggable="true"
                  select-label="✓"
                  deselect-label="✗"
                  selected-label="✓"
                  @tag="(tagName) => addNewCharacteristics(point, tagName)"
                />
              </td>
              <td>
                <multiselect
                  class="multiselect-success stop-point-tag"
                  v-model="point.delivery_habits"
                  tag-placeholder="Thêm yêu cầu nhận hàng"
                  placeholder="Chọn yêu cầu nhận hàng"
                  tag-position="bottom"
                  label="name"
                  track-by="id"
                  :options="deliveryHabitsOptions(master.delivery_habits)"
                  :multiple="true"
                  :taggable="true"
                  select-label="✓"
                  deselect-label="✗"
                  selected-label="✓"
                  @tag="(tagName) => addNewDeliveryHabits(point, tagName)"
                />
              </td>
              <td class="position">
                <b-button
                  class="mb-2 w-100"
                  size="sm"
                  @click.prevent="doShowLogModal(point)"
                  :disabled="isNaN(Number(point.stop_point_id))"
                >
                  Xem log
                </b-button>
                <b-button
                  class="mb-2 w-100"
                  size="sm"
                  @click.prevent="doShowNoteModal(point)"
                >
                  Ghi chú
                </b-button>
                <b-button
                  :id="'popover_' + point.stop_point_id"
                  variant="link"
                  class="mb-2 w-100"
                  size="sm"
                >
                  <i class="fas fa-ellipsis-h"/>
                </b-button>
                <b-popover :target="'popover_' + point.stop_point_id" triggers="hover" placement="bottom">
                  <b-button variant="outline" size="sm" @click.prevent="showModalConfirm(point.stop_point_id)">Xóa</b-button>
                </b-popover>
              </td>
            </tr>
          </draggable>
        </table>
      </div>

      <div class="mb-3">
        <b-button variant="outline-success" @click.prevent="addNewStopPoint()">
          <i class="fas fa-plus"/> Thêm
        </b-button>
      </div>
    </div>

    <div class="g-map-iframe">
      <iframe id="routeMapId" :src="urlMap" @on="sendPointsToGmap()" ref="routeMapId"/>
    </div>

    <modal-point-note
      v-if="showNoteModal && activeRow"
      v-model="activeRow.note"
      @closed="onHiddenNoteModal"
    />

    <modal-point-log
      v-if="showLogModal && activeRow && activeRow.stop_point_id"
      :stop-point-id="activeRow.stop_point_id"
      @closed="onHiddenLogModal"
    />

    <modal-point-deliver-time
      v-if="showAddDeliverTimeModal && activeRow"
      v-model="activeRow.deliver_time"
      :deliver-time="master.DeliverTime"
      :default-val="defaultDeliverTime"
      @closed="onHideDeliverTimeModal"
      />
  </div>
</template>

<script>
import MultiSelectAddressLv5 from '../../../elements/FilterBox/MultiSelectAddressLv5'
import Multiselect from 'vue-multiselect'
import Draggable from 'vuedraggable'
import ModalPointNote from '../ModalPointNote'
import ModalPointLog from '../ModalPointLog'
import ModalPointDeliverTime from '../ModalPointDeliverTime'
import manageListCodService from '../../../../domain/services/manage-list-cod-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import moment from 'moment'

const ID_ADD_MORE = -1
export default {
  name: 'DeliveryStopPoint',
  components: {
    ModalPointDeliverTime,
    ModalPointLog,
    ModalPointNote,
    MultiSelectAddressLv5,
    Multiselect,
    Draggable,
    manageListCodService,
    commonHelper
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    master: {
      type: Object,
      required: true
    },
    addressLv4: {
      type: Array,
      required: true
    }
  },
  data () {
    let GMAP_URL = process && process.env && process.env.GMAP_URL ? process.env.GMAP_URL : ''

    return {
      urlMap: GMAP_URL,
      activeRow: null,
      showNoteModal: false,
      showLogModal: false,
      showAddDeliverTimeModal: false,
      defaultDeliverTime: null,
      Coordinates: {}
    }
  },
  computed: {
    gmapIds () {
      const gmapIds = []
      this.stopPoints.forEach(point => {
        if (Array.isArray(point.points) && point.points.length) {
          gmapIds.push(...point.points.map(p => p.gmap_id))
        }
      })
      return gmapIds
    },
    stopPoints: {
      get () {
        if (!this.value || !Array.isArray(this.value)) {
          return []
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    this.sendPointsToGmap()
  },
  methods: {
    /**
     * Thêm mới tag đặc tính khu vực
     * @param point Điểm cầm thêm
     * @param tagName Tag sẽ được thêm
     */
    addNewCharacteristics (point, tagName) {
      this.addNewTag(point, tagName, 'characteristics', 'Characteristics')
    },

    /**
     * Thêm mới tag thói quen nhận hàng
     * @param point Điểm cần thêm
     * @param tagName Tag sẽ được thêm
     */
    addNewDeliveryHabits (point, tagName) {
      this.addNewTag(point, tagName, 'delivery_habits', 'DeliveryHabits')
    },

    /**
     * Thêm mới tag. Check trong Master, nếu chưa có thì sẽ thêm mới
     * @param point Điểm cần thêm
     * @param tagName Tag sẽ được thêm
     * @param fieldName Trường tương ứng trong point
     * @param masterFieldName Trường tương ứng trong Master
     */
    addNewTag (point, tagName, fieldName, masterFieldName) {
      tagName = (tagName || '').trim()
      if (!tagName.length) {
        return
      }

      const tagExists = this.master[masterFieldName].find((tag) => tag.name.toLowerCase() === tagName.toLowerCase())
      if (!tagExists) {
        this.master[masterFieldName].push({ id: null, name: tagName })
        point[fieldName].push({ id: null, name: tagName })
        return
      }

      if (!point[fieldName].some((tag) => tag.id === tagExists.id)) {
        point[fieldName].push(tagExists)
      }
    },

    /**
     * Các options cho khung thời gian nhận hàng. Bao gồm options mặc định + options được tạo bởi user
     * @param row
     */
    deliverTimeOptions (row) {
      return [
        ...this.master.DeliverTime,
        {id: ID_ADD_MORE, name: 'Thêm khung giờ khác'}
      ]
    },

    /**
     * Các options cho thói quen nhận hàng. Bao gồm options mặc định + options được tạo bởi user
     * @param row
     */
    deliveryHabitsOptions (row) {
      return this.master.DeliveryHabits
    },

    /**
     * Các options cho đặc tính khu vực. Bao gồm options mặc định + options được tạo bởi user
     * @param row
     */
    characteristicsOptions (row) {
      return this.master.Characteristics
    },

    /**
     * Tính toán lại các điểm và đẩy dữ liệu về map để hiển thị
     */
    async sendPointsToGmap () {
      const points = this.stopPoints.map((stopPoint) => {
        return stopPoint.points.map(point => {
          return {
            gmap_id: point.gmap_id,
            lat: point.lat,
            lng: point.lng
          }
        })
      })

      try {
        if (points.length) {
          this.Coordinates = await manageListCodService.calculateDeliveringPointCoordinates(points)
        } else {
          this.Coordinates = []
        }

        if (this.$refs && this.$refs.routeMapId) {
          this.$refs.routeMapId.contentWindow.postMessage(this.Coordinates, '*')
        }
      } catch (reason) {
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString())
      }
    },

    /**
     * Format lại định dạng hiển thị thời gian Khung thời gian nhận hàng
     */
    customDeliverTime (obj) {
      if (!obj.name) {
        const startTime = moment('2022-06-28 ' + obj.start_time).format('HH:mm')
        const endTime = moment('2022-06-28 ' + obj.end_time).format('HH:mm')
        obj.name = `${startTime} - ${endTime}`
      }
      return obj.name
    },

    /**
     * Hiển thị modal xem chi tiết log của điểm
     * @param row
     */
    doShowLogModal (row) {
      this.activeRow = row
      this.showLogModal = true
    },

    /**
     * Khi modal log được đóng lại
     */
    onHiddenLogModal () {
      this.activeRow = null
      this.showLogModal = false
    },

    /**
     * Hiển thị modal thêm mới ghi chú
     * @param row
     */
    doShowNoteModal (row) {
      this.activeRow = row
      this.showNoteModal = true
    },

    /**
     * Khi modal thêm mới ghi chú được đóng lại
     */
    onHiddenNoteModal () {
      this.activeRow = null
      this.showNoteModal = false
    },

    /**
     * Khi nhập time sau đó nhấn enter để nhập mới
     */
    addNewDeliverTime (row, tagName) {
      const match = /(\d{1,2})h *- *(\d{1,2})h/i.exec(tagName)
      this.defaultDeliverTime = match ? {start_time: parseInt(match[1]), end_time: parseInt(match[2])} : null
      setTimeout(() => {
        this.activeRow = row
        this.showAddDeliverTimeModal = true
      }, 500)
      return false
    },

    /**
     * Hiển thị modal thêm mới ghi chú
     */
    doShowDeliverTimeModal (row, listSelected) {
      const addMoreIndex = listSelected.findIndex(item => item.id === ID_ADD_MORE)
      if (addMoreIndex !== -1) {
        this.defaultDeliverTime = null
        this.activeRow = row
        this.showAddDeliverTimeModal = true
        row.deliver_time.splice(addMoreIndex, 1)
        return false
      }
    },

    /**
     * Khi modal thêm mới deliver time được đóng lại
     */
    onHideDeliverTimeModal () {
      this.activeRow = null
      this.showAddDeliverTimeModal = false
    },

    /**
     * Thêm mới điểm
     */
    addNewStopPoint () {
      this.stopPoints.push({
        stop_point_id: 'NewPoint_' + new Date().getTime().toString(),
        points: [],
        deliver_time: [],
        characteristics: [],
        delivery_habits: [],
        note: ''
      })
    },

    /**
     * Show modal confirm xóa điểm dừng
     */
    showModalConfirm (stopPointId) {
      this.$bvModal.msgBoxConfirm('Xác nhận xóa cấu hình điểm dừng', {
        title: 'Xác nhận xóa điểm dừng',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Xác nhận',
        cancelTitle: 'Không',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            this.stopPoints = this.stopPoints.filter((item) => (item.stop_point_id !== stopPointId))
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
