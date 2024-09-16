<template>
  <div>
    <b-modal static id="modal-create-document" title="Thêm hồ sơ" v-model="open" @hidden="onClose">
      <b-form v-loading="loading">
        <b-form-group>
          <span slot="label" class="font-14">Mã MP <span class="text-danger">*</span></span>
          <b-form-input
            v-model="masterProfileId"
            type="email"
            placeholder="Mã master profile"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Họ tên">
          <b-form-input
           :disabled="true"
            v-model="info.fullname"
            placeholder="Họ và tên"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Kho">
          <SingleSelectStation
            :stationId="stationId"
            :isDisabled="true"
            placeholder="Chọn kho"
          />
        </b-form-group>

        <b-form-group label="Vị trí">
          <SingleSelectPosition
            :positionJob="positionId"
            :isDisabled="true"
          />
        </b-form-group>

        <b-form-group>
          <span slot="label" class="font-14">Loại hồ sơ <span class="text-danger">*</span></span>
          <SingleSelectDocumentType @handleSelected="selectDocType" :customClass="'z-5'" :reset="resetDocumentType" />
        </b-form-group>

        <b-form-group label="Ghi chú">
          <b-form-textarea
            v-model="note"
            placeholder="Ghi chú"
            rows="3"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group>
          <span slot="label" class="font-14">File <span class="text-danger">*</span></span>
          <b-form-file v-for="(file, index) in files" :key="`file${index}`"
            :multiple="true"
            accept=".jpg, .png, .gif, .jpeg, .pdf"
            class="custom-file z-0"
            v-model="files[index]"
            placeholder="Vui lòng chọn file upload..."
          ></b-form-file>
          <b-button variant="outline-secondary" size="sm" @click="files.push([])">Thêm file khác</b-button>
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
          <button type="button" class="btn btn-secondary" @click="open = false">Hủy</button>
          <button type="button" class="btn btn-success" @click="done" :disabled="uploading">Xong</button>
      </template>
    </b-modal>

    <b-modal static id="modal-input-driver-license" hide-footer :title="'Nhập thông tin Bằng lái xe'" @hidden="onSave">
      <div>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Họ tên</span>
          <b-input id="input-default" class="rounded" v-model="info.fullname" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Hồ sơ</span>
          <b-input id="input-default" class="rounded" value="Bằng lái xe" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Số <span class="text-danger">*</span></span>
          <b-input id="input-default" class="rounded" v-model="driverLicense.no_number"></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Hạng bằng <span class="text-danger">*</span></span>
          <b-input id="input-default" class="rounded" v-model="driverLicense.class"></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Ngày bắt đầu <span class="text-danger">*</span></span>
          <v-date-picker
            :popover="{visibility: 'focus'}"
            mode="date"
            v-model="driverLicense.beginning_date"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày bắt đầu', style: 'font-size: 14px !important; color: #4E5155 !important;'}"
          />
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Ngày kết thúc</span>
          <v-date-picker
            :popover="{visibility: 'focus'}"
            mode="date"
            v-model="driverLicense.expiry_date"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày kết thúc', style: 'font-size: 14px !important; color: #4E5155 !important;'}"
          />
        </b-form-group>
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="saveDriverLicense" :disabled="uploading">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-input-vehicle-rc" hide-footer :title="'Nhập thông tin Giấy chứng nhận đăng ký xe'" @hidden="onSave">
      <div>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Họ tên</span>
          <b-input id="input-default" class="rounded" v-model="info.fullname" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4">
          <span slot="label" class="font-14">Hồ sơ</span>
          <b-input id="input-default" class="rounded" value="Giấy chứng nhận đăng ký xe" disabled></b-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="4" label-for="input-default">
          <span slot="label" class="font-14">Biển số xe</span>
          <div>
            <b-input id="input-default" class="rounded input_license_plate" v-model="vehicleRC.head_license_plate"></b-input>
            <span> - </span>
            <b-input id="input-default" class="rounded input_license_plate" v-model="vehicleRC.tail_license_plate"></b-input>
          </div>
        </b-form-group>
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="saveVehicleRC" :disabled="uploading">Xác nhận</button>
      </div>
    </b-modal>

    <b-modal static id="modal-input-guardian" hide-footer title="Nhập thông tin Người bảo lãnh" @hidden="onSave">
      <FormGuardianInfo :guardian="guardian" />
      <div class="text-center mt-3">
        <button class="btn btn-ghtk rounded" @click="saveGuardian" :disabled="uploading">Xác nhận</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import SingleSelectDocumentType from 'components/elements/common/SingleSelectDocumentType'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import profileService from 'domain/services/profile-mamanger-service'
import ErpDocument from 'domain/entities/ErpDocument'
import FormGuardianInfo from './FormGuardianInfo'

import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  components: {
    SingleSelectDocumentType,
    SingleSelectPosition,
    SingleSelectStation,
    FormGuardianInfo
  },
  props: {
    openModal: false,
    hidePopup: null,
    uploading: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      open: false,
      masterProfileId: null,
      fullname: null,
      stationId: null,
      positionId: null,
      documentId: null,
      note: null,
      files: [],
      info: {},
      timmer: null,
      driverLicense: {
        no_number: null,
        class: null,
        beginning_date: null,
        expiry_date: null,
        document_name: null
      },
      guardian: {
        fullname: null,
        birthday: null,
        personal_id: null,
        personal_id_date: null,
        personal_id_place: null,
        resident_province: null,
        resident_district: null,
        resident_sub_district: null,
        resident_detail: null,
        current_province: null,
        current_district: null,
        current_sub_district: null,
        current_detail: null,
        relation: null,
        phone: null,
        license_place: null,
        bltnds_reason: null,
        other_info: null,
        note: null
      },
      vehicleRC: {
        head_license_plate: null,
        tail_license_plate: null
      },
      resetDocumentType: false
    }
  },
  methods: {
    saveDriverLicense () {
      if (this.checkRequiredInfoDriverLicense()) {
        this.saveDocument()
      } else {
        commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin Bằng lái xe.', 'warning')
      }
    },
    saveGuardian () {
      if (this.checkRequiredInfoGuardian()) {
        this.saveDocument()
      } else {
        commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin Người bảo lãnh.', 'warning')
      }
    },
    saveVehicleRC () {
      if (this.checkRequiredVehicleRCInfo()) {
        this.saveDocument()
      } else {
        commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin biển số xe.', 'warning')
      }
    },
    done () {
      if (+this.documentId === ErpDocument.TYPE_DRIVER_LICENSE) {
        if (this.checkRequiredInfo()) {
          this.$bvModal.hide('modal-create-document')
          this.hidePopup = null
          this.$bvModal.show('modal-input-driver-license')
        } else {
          commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin hồ sơ.', 'warning')
        }
      } else if (+this.documentId === ErpDocument.TYPE_GUARDIAN_LETTER) {
        if (this.checkRequiredInfo()) {
          this.$bvModal.hide('modal-create-document')
          this.hidePopup = null
          this.$bvModal.show('modal-input-guardian')
        } else {
          commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin hồ sơ.', 'warning')
        }
      } else if (+this.documentId === ErpDocument.TYPE_VEHICLE_RC) {
        if (this.checkRequiredInfo()) {
          this.$bvModal.hide('modal-create-document')
          this.hidePopup = null
          this.$bvModal.show('modal-input-vehicle-rc')
        } else {
          commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin hồ sơ.', 'warning')
        }
      } else if (this.checkRequiredInfo()) {
        this.saveDocument()
      } else {
        commonHelper.showMessage('Bạn cần nhập đầy đủ thông tin hồ sơ.', 'warning')
      }
    },

    saveDocument () {
      let formData = new FormData()
      if (this.masterProfileId) formData.append('masterProfileId', this.masterProfileId)
      if (this.fullname) formData.append('fullname', this.fullname)
      if (this.stationId) formData.append('stationId', this.stationId)
      if (this.positionId) formData.append('positionId', this.positionId)
      if (this.documentId) formData.append('documentId', this.documentId)
      if (this.note) formData.append('note', this.note)
      this.files.map((fs, i) => {
        fs.map((f, j) => {
          if (f.name) formData.append('files[' + i + j + ']', f)
        })
      })
      formData.append('is_hr', 1)
      if (+this.documentId === ErpDocument.TYPE_DRIVER_LICENSE) {
        formData.append('driver_no_number', this.driverLicense.no_number)
        formData.append('driver_class', this.driverLicense.class)

        let beginningDate = ''
        if (this.driverLicense.beginning_date) {
          beginningDate = new Date(this.driverLicense.beginning_date)
          beginningDate = beginningDate.toISOString()
        }
        formData.append('driver_beginning_date', beginningDate)

        let expiryDate = ''
        if (this.driverLicense.expiry_date) {
          expiryDate = new Date(this.driverLicense.expiry_date)
          expiryDate = expiryDate.toISOString()
        }
        formData.append('driver_expiry_date', expiryDate)
      }
      if (+this.documentId === ErpDocument.TYPE_GUARDIAN_LETTER) {
        formData.append('doc_data', JSON.stringify(this.guardian))
      }

      if (+this.documentId === ErpDocument.TYPE_VEHICLE_RC) {
        formData.append('head_license_plate', this.vehicleRC.head_license_plate)
        formData.append('tail_license_plate', this.vehicleRC.tail_license_plate)
      }

      this.$emit('done', formData)
    },

    checkRequiredInfo () {
      return this.masterProfileId && this.info.fullname && this.stationId && this.positionId &&
      this.documentId && this.files.length && this.files[0].length
    },

    checkRequiredInfoDriverLicense () {
      return this.driverLicense.no_number && this.driverLicense.class && this.driverLicense.beginning_date
    },

    checkRequiredInfoGuardian () {
      return this.guardian.fullname && this.guardian.birthday && this.guardian.personal_id && this.guardian.personal_id_date &&
        this.guardian.personal_id_place && this.guardian.resident_province && this.guardian.resident_district &&
        this.guardian.resident_sub_district && this.guardian.current_province && this.guardian.current_district &&
        this.guardian.current_sub_district && this.guardian.relation && this.guardian.phone && this.guardian.license_place &&
        this.guardian.bltnds_reason && this.guardian.other_info
    },

    checkRequiredVehicleRCInfo () {
      return this.vehicleRC.head_license_plate && this.vehicleRC.tail_license_plate
    },

    selectDocType (d) {
      this.documentId = d.id
    },
    selectPosition (p) {
      this.positionId = p.id
    },
    selectStation (s) {
      this.stationId = s.id
    },
    async onClose () {
      if (+this.documentId !== ErpDocument.TYPE_GUARDIAN_LETTER &&
        +this.documentId !== ErpDocument.TYPE_DRIVER_LICENSE &&
        +this.documentId !== ErpDocument.TYPE_VEHICLE_RC) {
        await this.onSave()
      }
    },
    async onSave () {
      await this.reset()
      this.$emit('updateOpen', false)
    },
    reset (close = true) {
      if (close) this.open = false
      this.masterProfileId = null
      this.fullname = null
      this.stationId = null
      this.positionId = null
      this.documentId = null
      this.note = null
      this.files = [[]]
      this.info = {}
      this.resetDocumentType = null
      this.driverLicense = {
        no_number: null,
        class: null,
        beginning_date: null,
        expiry_date: null,
        document_name: null
      }
      this.vehicleRC = {
        head_license_plate: null,
        tail_license_plate: null
      }
      this.guardian = {
        fullname: null,
        birthday: null,
        personal_id: null,
        personal_id_date: null,
        personal_id_place: null,
        resident_province: null,
        resident_district: null,
        resident_sub_district: null,
        resident_detail: null,
        current_province: null,
        current_district: null,
        current_sub_district: null,
        current_detail: null,
        relation: null,
        phone: null,
        license_place: null,
        bltnds_reason: null,
        other_info: null,
        note: null
      }
    },
    searchMasterProfile () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(async () => {
        try {
          this.loading = true
          const {data} = await profileService.getDocumentDataFromMPId({id: this.masterProfileId})
          if (data.success) {
            this.info.fullname = data.info.ErpMasterProfile.fullname
            this.info.station = data.info.Station.name
            this.info.position = data.info.EmpPosition.position_name
            this.stationId = data.info.Station.id
            this.positionId = data.info.EmpPosition.id
          } else {
            this.reset(false)
            commonHelper.showMessage(data.message, 'warning')
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
        }
      }, 800)
    }
  },
  watch: {
    openModal (v) {
      if (v) {
        this.resetDocumentType = false
        this.hidePopup = null
        this.$bvModal.show('modal-create-document')
      } else {
        this.$bvModal.hide('modal-create-document')
      }
    },
    open (v) {
      this.$emit('updateOpen', v)
    },
    masterProfileId () {
      if (this.masterProfileId) this.searchMasterProfile()
    },
    hidePopup () {
      if (this.hidePopup === true) {
        this.$bvModal.hide('modal-create-document')
        this.$bvModal.hide('modal-input-driver-license')
        this.$bvModal.hide('modal-input-guardian')
        this.$bvModal.hide('modal-input-vehicle-rc')
      }
    }
  }
}
</script>

<style scoped>
.custom-file{
  margin-bottom: 10px;
}
.input_license_plate {
  display: inline-block;
  width: 90px;
}
</style>
