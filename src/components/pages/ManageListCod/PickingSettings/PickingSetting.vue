<template>
  <div class="picking-setting">
    <b-form>
      <b-card>
        <template #header>
          <h4 class="mb-0">Cài đặt lộ trình Cod lấy</h4>
        </template>

        <template #footer v-if="isShowForm">
          <div  class="text-right">
            <b-button class="input-size" variant="success" :disabled="isLoading || isSaving" @click.prevent="onSubmitForm">
              <i class="fa" :class="{'fa-save': !isSaving, 'fa-spin fa-spinner': isSaving}" />
              Lưu
            </b-button>
          </div>
        </template>

        <b-alert v-if="message" ref="nofity" show :variant="messageType" v-html="filterHtml(message)" />

        <div v-if="isLoading" class="text-center">
          <i class="fa fa-spin fa-spinner mr-2"/> Đang tải...
        </div>

        <div v-if="isShowForm">
          <h5 class="mb-3">Tổng quan: {{totalShop}} Shop</h5>
          <pick-address-list
            :picking-addresses="pickAddresses"
            class="mb-3"
            style="max-height: 200px;"
          />

          <h5 class="mb-3">Lộ trình PK ({{totalShopConfigured}}/{{totalShop}} Shop)</h5>
          <picking-stop-point
            class="mb-3"
            v-model="points"
            :master="{
              pickAddresses: master.pickAddresses,
              characteristics: master.characteristics,
              attributes: master.attributes,
              cartAddressLevel4Ids
            }"
          />
        </div>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import manageListCodService from 'domain/services/manage-list-cod-service'
import PickingStopPoint from './PickingStopPoint'
import PickAddressList from './PickAddressList'
import ManageListCod from '../../../../domain/entities/ManageListCod'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'PickingSetting',

  components: {
    PickAddressList,
    PickingStopPoint
  },

  props: {
    userId: {
      type: Number,
      required: true
    },
    cartAddressLevel4Ids: {
      type: Array,
      required: true
    }
  },

  computed: {
    totalShop () {
      if (!Array.isArray(this.pickAddresses)) {
        return 0
      }

      const shopCodes = new Set()
      this.pickAddresses.forEach(pickingAddress => {
        shopCodes.add(pickingAddress.shop_code)
      })
      return shopCodes.size
    },

    totalShopConfigured () {
      const pickAddressIds = new Set()

      this.points.forEach(point => {
        if (!Array.isArray(point.points) || !point.points.length) {
          return
        }

        point.points.forEach(p => {
          if (p.pick_address_id) {
            pickAddressIds.add(p.pick_address_id)
          }
        })
      })

      const shopConfigured = new Set()
      if (pickAddressIds.size) {
        this.pickAddresses.forEach(pickingAddress => {
          if (pickAddressIds.has(pickingAddress.id)) {
            shopConfigured.add(pickingAddress.shop_code)
          }
        })
      }

      return shopConfigured.size
    }
  },

  data () {
    return {
      isLoading: false,
      isShowForm: false,
      isSaving: false,
      message: '',
      messageType: 'warn',

      pickAddresses: [],
      points: [],
      master: {
        pickAddresses: [],
        characteristics: [],
        attributes: []
      }
    }
  },

  created () {
    this.getData()
  },

  methods: {
    filterHtml (message) {
      return commonHelper.filterHtml(message)
    },

    getStopPoints () {
      return this.points.map(stopPoint => {
        const isTypePickingAddress = stopPoint.type === ManageListCod.pointTypes.PICK_ADDRESS.value
        const isTypePickingDCC5 = stopPoint.type === ManageListCod.pointTypes.DCC5.value
        const isTypePickingMpShop = stopPoint.type === ManageListCod.pointTypes.MP_SHOP.value
        stopPoint.points = commonHelper.arrayWrap(stopPoint.points).filter(
          (value, index, self) =>
            (isTypePickingAddress && self.findIndex((m) => m.pick_address_id === value.pick_address_id) === index) ||
            (isTypePickingDCC5 && self.findIndex((m) => m.gmap_id === value.gmap_id) === index) ||
            (isTypePickingMpShop && self.findIndex((m) => m.mp_address_id === value.mp_address_id) === index)
        )
        stopPoint.pick_times = commonHelper.arrayWrap(stopPoint.pick_times).filter(
          (value, index, self) => self.findIndex((m) => m.id === value.id) === index
        )

        return {
          stop_point_id: stopPoint.stop_point_id,
          points: commonHelper.arrayWrap(stopPoint.points).map(point => {
            return {
              gmap_id: isTypePickingDCC5 ? parseInt(point.gmap_id) : 0,
              pick_address_id: isTypePickingAddress ? parseInt(point.pick_address_id) : 0,
              mp_address_id: isTypePickingMpShop ? parseInt(point.mp_address_id) : 0,
              name: isTypePickingAddress ? '' : point.name,
              point_id: isTypePickingMpShop ? point.point_id : '',
              lat: point.lat,
              lng: point.lng
            }
          }).filter(item => item.gmap_id || item.pick_address_id || item.mp_address_id),
          pick_time: commonHelper.arrayWrap(stopPoint.pick_times),
          characteristics: commonHelper.arrayWrap(stopPoint.characteristics),
          attributes: commonHelper.arrayWrap(stopPoint.attributes),
          note: stopPoint.note,
          type: stopPoint.type,
          bring_back_immediately: Number(stopPoint.bring_back_immediately)
        }
      })
    },

    /**
     * Kiểm tra dữ liệu user nhập vào đã đầy đủ hay chưa
     */
    validateInputData (data) {
      if (!data.settings.length) {
        return
      }

      // Validate lộ trình
      const errors = []
      data.settings.forEach((stopPoint, stopPointIndex) => {
        const stopPointError = []
        if (!stopPoint.points.length) {
          stopPointError.push('Bạn chưa chọn điểm.')
        }

        const isTypePickingAddress = stopPoint.type === ManageListCod.pointTypes.PICK_ADDRESS.value

        if (!stopPoint.pick_time.length && isTypePickingAddress) {
          stopPointError.push('Bạn chưa chọn Khung thời gian lấy hàng.')
        }

        if (!stopPoint.attributes.length && isTypePickingAddress) {
          stopPointError.push('Bạn chưa chọn Đặc điểm sản phẩm.')
        }

        if (!stopPoint.characteristics.length && isTypePickingAddress) {
          stopPointError.push('Bạn chưa chọn Đặc tính khu vực.')
        }

        if (stopPointError.length) {
          errors.push(`<ul>Điểm ${stopPointIndex + 1}:<li> ${stopPointError.join('</li> <li>')}</li></ul>`)
        }
      })

      // Có lỗi validate
      if (errors.length) {
        throw new Error('<b>Cài đặt lộ trình Cod lấy:</b> ' + errors.join(' '))
      }
    },

    setMessage (message, messageType) {
      this.message = message
      this.messageType = messageType
      if (this.message) {
        this.$nextTick(() => {
          if (this.$refs.nofity && this.$refs.nofity.$el) {
            // Browser Safari not support this feature
            this.$refs.nofity.$el.scrollIntoView({
              block: 'center',
              inline: 'center',
              behavior: 'smooth'
            })
          }
        })
      }
    },

    async onSubmitForm () {
      const data = {
        user_id: this.userId,
        settings: this.getStopPoints()
      }

      console.log('data:', JSON.stringify(data, null, 4))

      try {
        this.message = ''
        this.validateInputData(data)
        this.isSaving = true
        const message = await manageListCodService.saveConfigPkRoute(this.userId, data)
        this.setMessage(message, 'info')
        // Lưu ok, reload data
        this.$nextTick(() => this.getData())
      } catch (reason) {
        this.setMessage(reason instanceof Error ? reason.message : reason.toString(), 'warning')
      } finally {
        this.isSaving = false
      }
    },

    async getData () {
      try {
        this.isLoading = true
        this.isShowForm = false

        const apiResponse = await Promise.all([
          manageListCodService.getPickingAddressList(this.userId),
          manageListCodService.getPickingSettingRoute(this.$route.params.id)
        ])

        this.pickAddresses = commonHelper.arrayWrap(apiResponse[0])

        this.master.pickAddresses = this.pickAddresses.map((item) => {
          return {
            gmap_id: 0,
            pick_address_id: parseInt(item.id),
            name: '',
            lat: item.lat,
            lng: item.lng,
            address_name: `${item.shop_name} - ${item.shop_code} - ${item.shop_tel} - ${item.shop_first_address}`,
            searchString: commonHelper.removeVietnameseTone(`${item.shop_name}@|@${item.shop_code}`),
            type: item.type
          }
        })

        this.master.characteristics = apiResponse[1].master.characteristics.map(item => {
          return {id: parseInt(item.id), name: item.name}
        })

        this.master.attributes = apiResponse[1].master.attributes.map(item => {
          return {id: parseInt(item.id), name: item.name}
        })

        const pickAddressIds = []
        const mpAddressIds = []
        this.points = apiResponse[1].settings.map(stopPoint => {
          stopPoint.stop_point_id = parseInt(stopPoint.stop_point_id)
          stopPoint.attributes = commonHelper.arrayWrap(stopPoint.attributes).map(item => {
            return {id: parseInt(item.id), name: item.name}
          })
          stopPoint.characteristics = commonHelper.arrayWrap(stopPoint.characteristics).map(item => {
            return {id: parseInt(item.id), name: item.name}
          })
          stopPoint.pick_times = commonHelper.arrayWrap(stopPoint.pick_times).map(item => {
            return {id: parseInt(item.id), from_time: item.from_time, to_time: item.to_time}
          })
          stopPoint.pick_times = commonHelper.arrayWrap(stopPoint.pick_times).filter(
            (value, index, self) => self.findIndex((m) => m.id === value.id) === index
          )
          stopPoint.points = commonHelper.arrayWrap(stopPoint.points).map(item => {
            const pickAddressId = parseInt(item.pick_address_id)
            const mpAddressId = parseInt(item.mp_address_id)
            let addressName = `${item.shop_name} - ${item.shop_first_address}`
            if (pickAddressId) {
              pickAddressIds.push(pickAddressId)
              addressName = `${item.shop_name} - ${item.shop_code} - ${item.shop_tel} - ${item.shop_first_address}`
            } else if (mpAddressId) {
              mpAddressIds.push(mpAddressId)
              addressName = `${item.name}`
            }

            return {
              gmap_id: parseInt(item.gmap_id),
              pick_address_id: pickAddressId,
              mp_address_id: mpAddressId,
              name: item.name,
              shop_code: item.shop_code,
              shop_name: item.shop_name,
              shop_tel: item.shop_tel,
              point_id: mpAddressId ? item.point_id : '',
              first_address: mpAddressId ? item.first_address : '',
              last_address: mpAddressId ? item.last_address : '',
              lat: item.lat,
              lng: item.lng,
              address_name: addressName
            }
          })
          stopPoint.points.bring_back_immediately = Number(stopPoint.bring_back_immediately)
          const isTypePickingAddress = stopPoint.type === ManageListCod.pointTypes.PICK_ADDRESS.value
          const isTypePickingDCC5 = stopPoint.type === ManageListCod.pointTypes.DCC5.value
          const isTypePickingMpShop = stopPoint.type === ManageListCod.pointTypes.MP_SHOP.value
          stopPoint.points = commonHelper.arrayWrap(stopPoint.points).filter(
            (value, index, self) =>
              (isTypePickingAddress && self.findIndex((m) => m.pick_address_id === value.pick_address_id) === index) ||
              (isTypePickingDCC5 && self.findIndex((m) => m.gmap_id === value.gmap_id) === index) ||
              (isTypePickingMpShop && self.findIndex((m) => m.mp_address_id === value.mp_address_id) === index)
          )
          return stopPoint
        })

        // Load danh sách các khung giờ gán với mỗi pick_address_id và cache lại.
        // ở component phía trong khi call lại sẽ được lấy từ cache thay vì call lên server
        await manageListCodService.getPickTimeByPickAddress(pickAddressIds)
        await manageListCodService.getPickTimeByMpAddress(mpAddressIds)

        this.isShowForm = true
      } catch (reason) {
        this.setMessage(reason.toString(), 'warning')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
