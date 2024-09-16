<template>
  <tr>
    <td>
      <div class="handle no-wrap col-form-label">Điểm {{ pointIndex + 1 }}:</div>
    </td>
    <td>
      <div class="d-flex">
        <b-form-select
          v-model="point.type"
          :options="Object.values(pointTypes)"
          class="mr-2"
          style="flex:0 0 110px;"
          @change="onChangePointType"
        />
        <div style="flex: 1 1 auto;width: calc(100% - 120px);">
          <select-picking-address
            class="multiselect-success"
            v-if="point.type === pointTypes.PICK_ADDRESS.value"
            v-model="location"
            :pick-addresses="master.pickAddresses"
            :ignore-list="idsSelected.pickAddressIds"
            :multiple="false"
            @change="onChangePickingAddress"
          />
          <multi-select-address-lv5
            class="multiselect-success"
            v-else-if="point.type === pointTypes.DCC5.value"
            v-model="location"
            :lv4Ids="master.cartAddressLevel4Ids"
            :ignore-list="idsSelected.gmapIds"
            :multiple="false"
          />
          <multi-select-mp-shop
            class="multiselect-success"
            v-else
            v-model="location"
            :ignore-list="idsSelected.mpAddressIds"
            :multiple="false"
            @change="onChangePickingAddress"
          />
        </div>
      </div>
      <div
        v-if="point.note"
        class="invalid-feedback d-block note-point"
      >
        {{point.note}}
      </div>
    </td>
    <td>
      <multiselect
        class="multiselect-success"
        v-model="point.pick_times"
        placeholder="Chọn khung giờ"
        track-by="id"
        :options="pickTimeOptions"
        :loading="isLoadingPickingTime"
        :multiple="true"
        select-label="✓"
        deselect-label="✗"
        selected-label="✓"
        :custom-label="customPickTimeLabel"
      />
    </td>
    <td>
      <multiselect
        class="multiselect-success"
        v-model="point.characteristics"
        tag-placeholder="Thêm đặc tính khu vực"
        placeholder="Chọn đặc tính khu vực"
        tag-position="bottom"
        label="name"
        track-by="id"
        :options="master.characteristics"
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
        class="multiselect-success"
        v-model="point.attributes"
        tag-placeholder="Thêm đặc điểm sản phẩm"
        placeholder="Chọn đặc điểm sản phẩm"
        tag-position="bottom"
        label="name"
        track-by="id"
        :options="master.attributes"
        :multiple="true"
        :taggable="true"
        select-label="✓"
        deselect-label="✗"
        selected-label="✓"
        @tag="(tagName) => addNewAttributes(point, tagName)"
      />
    </td>
    <td>
      <b-form-checkbox
        :name="'name_check_box_' + pointIndex"
        v-model="point.bring_back_immediately"
        value=1
        unchecked-value=0
        :disabled="isDisableBringBackNow"
        class="ghtk-checkbox"
      >
        Mang về ngay
      </b-form-checkbox>
    </td>
    <td class="position">
      <b-button
        class="mb-2 w-100"
        size="sm"
        @click.prevent="showModal('log')"
        :disabled="isNaN(Number(point.stop_point_id))"
      >
        Xem log
      </b-button>
      <b-button
        class="mb-2 w-100"
        size="sm"
        @click.prevent="showModal('note')"
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
        <b-button variant="outline" size="sm" @click.prevent="showModal('delete')">Xóa</b-button>
      </b-popover>
    </td>
  </tr>
</template>

<script>
import MultiSelectAddressLv5 from '../../../elements/FilterBox/MultiSelectAddressLv5'
import Multiselect from 'vue-multiselect'
import SelectPickingAddress from './SelectPickingAddress'
import ManageListCod from '../../../../domain/entities/ManageListCod'
import manageListCodService from '../../../../domain/services/manage-list-cod-service'
import moment from 'moment'
import MultiSelectMpShop from '../../../elements/FilterBox/MultiSelectMpShop'

export default {
  name: 'PickingStopPointRow',
  components: {
    MultiSelectMpShop,
    SelectPickingAddress,
    MultiSelectAddressLv5,
    Multiselect
  },
  props: {
    pointIndex: {
      type: Number,
      required: true
    },
    point: {
      type: Object,
      required: true
    },
    idsSelected: {
      type: Object,
      required: true
    },
    master: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      pointTypes: ManageListCod.pointTypes,
      pickTimeOptions: [],
      isLoadingPickingTime: false
    }
  },
  computed: {
    location: {
      get () {
        if (Array.isArray(this.point.points) && this.point.points.length) {
          return this.point.points[0]
        }
        return null
      },
      set (value) {
        this.point.points = value ? [value] : []
        this.$nextTick(() => this.onChangedPoint())
      }
    },

    isDisableBringBackNow () {
      return Number(this.point.type) === this.pointTypes.DCC5.value
    }
  },
  mounted () {
    this.getPickTimeOptions()
  },
  methods: {
    /**
     * Khi thay đổi địa chỉ -> Reset các đặc tính và update lại gmap, pick options
     */
    onChangedPoint () {
      this.point.pick_times = []
      this.point.characteristics = []
      this.point.attributes = []
      this.point.bring_back_immediately = 0
      this.$emit('changePoint')
      this.getPickTimeOptions()
    },

    /**
     * Khi thay đổi loại của điểm -> Reset mọi thứ
     */
    onChangePointType () {
      this.point.points = []
      this.point.pick_times = []
      this.point.characteristics = []
      this.point.attributes = []
      this.point.bring_back_immediately = 0
      this.pickTimeOptions = []
      this.$emit('changePoint')
    },

    /**
     * Khi thay đổi địa chỉ lấy -> reset lại khung thời gian lấy hàng
     */
    onChangePickingAddress () {
      this.pickTimeOptions = []
    },

    /**
     * Lấy options chọn thời gian
     */
    async getPickTimeOptions () {
      if (!Array.isArray(this.point.points)) {
        this.pickTimeOptions = []
        return
      }

      const points = this.point.points
      const type = points[0].hasOwnProperty('type') ? points[0].type : 0
      const pickAddressIds = points.map(point => {
        return type === ManageListCod.pointTypes.PICK_ADDRESS.value ? point.pick_address_id : point.mp_address_id
      }).filter(pickAddressId => !!pickAddressId)
      if (!pickAddressIds.length) {
        this.pickTimeOptions = []
        return
      }

      try {
        this.isLoadingPickingTime = true
        let pickTimeList = {}
        if (type === ManageListCod.pointTypes.PICK_ADDRESS.value) {
          pickTimeList = await manageListCodService.getPickTimeByPickAddress(pickAddressIds)
        } else {
          pickTimeList = await manageListCodService.getPickTimeByMpAddress(pickAddressIds)
        }
        this.pickTimeOptions = Object.values(pickTimeList).reduce((timeList, items) => {
          timeList.push(...items)
          return timeList
        }, [])
      } catch (reason) {
        this.$root.$emit('onError', reason instanceof Error ? reason.message : reason.toString())
      } finally {
        this.isLoadingPickingTime = false
      }
    },

    /**
     * Format lại định dạng hiển thị thời gian Khung thời gian nhận hàng
     */
    customPickTimeLabel (obj) {
      if (!obj.name) {
        const fromTime = moment('2022-06-28 ' + obj.from_time).format('HH:mm')
        const toTime = moment('2022-06-28 ' + obj.to_time).format('HH:mm')
        obj.name = `${fromTime} - ${toTime}`
      }
      return obj.name
    },

    /**
     * Thêm mới tag đặc tính khu vực
     * @param point Điểm cầm thêm
     * @param tagName Tag sẽ được thêm
     */
    addNewCharacteristics (point, tagName) {
      this.$emit('addNewTag', point, tagName, 'characteristics', 'characteristics')
    },

    /**
     * Thêm mới tag thói quen nhận hàng
     * @param point Điểm cần thêm
     * @param tagName Tag sẽ được thêm
     */
    addNewAttributes (point, tagName) {
      this.$emit('addNewTag', point, tagName, 'attributes', 'attributes')
    },

    /**
     * Hiển thị modal
     * @param modalName
     */
    showModal (modalName) {
      this.$emit('showModal', modalName, this.pointIndex)
    }
  }
}
</script>
