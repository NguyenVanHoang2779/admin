<template>
  <div>
    <div class="mb-3">
      <div class="table-responsive1 mb-3">
        <table class="table" style="min-width: 1200px; table-layout: fixed">
          <thead>
          <tr>
            <th style="width: 100px">Điểm</th>
            <th style="width: 34%"></th>
            <th style="width: 13%">Khung thời gian nhận hàng</th>
            <th style="width: 13%">Đặc tính khu vực</th>
            <th style="width: 13%">Đặc điểm sản phẩm</th>
            <th style="width: 12%">Hình thức lấy hàng</th>
            <th style="width: 150px">Thao tác</th>
          </tr>
          </thead>

          <tbody v-if="!stopPoints.length">
          <tr>
            <td colspan="6">Chưa có điểm nào được cài đặt. Vui lòng nhấn vào nút <b>Thêm</b> để thêm điểm mới</td>
          </tr>
          </tbody>

          <draggable v-else element="tbody" :list="stopPoints" handle=".handle">
            <picking-stop-point-row
              v-for="(point, pointIndex) in stopPoints"
              :key="point.stop_point_id"
              :point="point"
              :point-index="pointIndex"
              :ids-selected="idsSelected"
              :master="master"
              @addNewTag="addNewTag"
              @changePoint="redrawGmap"
              @showModal="doShowModal"
            />
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
      <iframe id="routeMapId" :src="urlMap" @on="redrawGmap()" ref="routeMapId"/>
    </div>

    <modal-point-note
      v-if="showNoteModal && activeRow"
      v-model="activeRow.note"
      @closed="onHiddenModal('note')"
    />

    <modal-point-log
      v-if="showLogModal && activeRow && activeRow.stop_point_id"
      :stop-point-id="activeRow.stop_point_id"
      component="PickingSetting"
      @closed="onHiddenModal('log')"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import ModalPointNote from './../ModalPointNote'
import ModalPointLog from './../ModalPointLog'
import manageListCodService from '../../../../domain/services/manage-list-cod-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import PickingStopPointRow from './PickingStopPointRow'
import ManageListCod from '../../../../domain/entities/ManageListCod'

export default {
  name: 'PickingStopPoint',
  components: {
    PickingStopPointRow,
    ModalPointLog,
    ModalPointNote,
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
    }
  },
  data () {
    const GMAP_URL = process && process.env && process.env.GMAP_URL
      ? process.env.GMAP_URL
      : 'https://gmap-addresses-frontend.ghtklab.com'

    return {
      urlMap: GMAP_URL,
      activeRow: null,
      showNoteModal: false,
      showLogModal: false,
      coordinates: {}
    }
  },
  computed: {
    /**
     * Danh sách các Ids đã chọn. Những Id này sẽ không được chọn lại
     * @returns {{pickAddressIds: Number[], gmapIds: Number[]}}
     */
    idsSelected () {
      const gmapIds = new Set()
      const pickAddressIds = new Set()
      const mpAddressIds = new Set()

      this.stopPoints.forEach(point => {
        if (!Array.isArray(point.points) || !point.points.length) {
          return
        }

        point.points.forEach(p => {
          if (p.gmap_id) {
            gmapIds.add(p.gmap_id)
          }

          if (p.pick_address_id) {
            pickAddressIds.add(p.pick_address_id)
          }

          if (p.mp_address_id) {
            mpAddressIds.add(p.mp_address_id)
          }
        })
      })

      return {
        gmapIds: Array.from(gmapIds),
        pickAddressIds: Array.from(pickAddressIds),
        mpAddressIds: Array.from(mpAddressIds)
      }
    },

    /**
     * Danh sách các điểm dừng.
     */
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
    this.redrawGmap()
  },
  methods: {
    /**
     * Hiển thị modal
     * @param modalName
     * @param pointIndex
     */
    doShowModal (modalName, pointIndex) {
      this.activeRow = this.stopPoints[pointIndex]

      switch (modalName) {
        case 'log':
          this.showLogModal = true
          break
        case 'note':
          this.showNoteModal = true
          break
        case 'delete':
          this.showModalConfirm(this.stopPoints[pointIndex].stop_point_id)
          break
        default:
          console.error('PkSettingStopPoint.doShowModal: modalName không hợp lệ.', modalName)
      }
    },

    onHiddenModal (modalName) {
      this.activeRow = null
      switch (modalName) {
        case 'log':
          this.showLogModal = false
          break
        case 'note':
          this.showNoteModal = false
          break
        default:
          console.error('PkSettingStopPoint.onHiddenModal: modalName không hợp lệ.', modalName)
      }
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
     * Tính toán lại các điểm và đẩy dữ liệu về map để hiển thị
     */
    async redrawGmap () {
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
          this.coordinates = await manageListCodService.calculatePickingPointCoordinates(points)
        } else {
          this.coordinates = []
        }

        if (this.$refs && this.$refs.routeMapId) {
          this.$refs.routeMapId.contentWindow.postMessage(this.coordinates, '*')
        }
      } catch (reason) {
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString())
      }
    },

    /**
     * Thêm mới điểm
     */
    addNewStopPoint () {
      this.stopPoints.push({
        stop_point_id: 'NewPoint_' + new Date().getTime().toString(),
        points: [],
        pick_times: [],
        characteristics: [],
        attributes: [],
        note: '',
        type: ManageListCod.pointTypes.PICK_ADDRESS.value
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
