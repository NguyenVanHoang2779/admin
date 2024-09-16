<template>
  <b-modal hide-footer id="modal-add-config-campaign">
    <div v-if="campaign" slot="modal-title">
      <p class="mb-0">Thêm config cho cụm {{campaign.title ? campaign.title : ''}}</p>
      <p class="font-weight-light font-italic" style="font-size: 15px">Áp dụng: Từ {{ campaign.from ? campaign.from : 'Vô hạn' }} đến {{ campaign.to ? campaign.to : 'Vô hạn' }}</p>
    </div>
    <div class="row mb-4">
      <!--Loại hình làm việc-->
      <div class="col-md-6">
        <div class="row mb-2">
          <div class="col-md-6">
            <label class="form-label">Loại hình làm việc <span class="text-danger">(*)</span></label>
            <multiselect
              v-model="filter.work_type.selected"
              label="name"
              track-by="id"
              placeholder=""
              :options="filter.work_type.options"
              :multiple="false"
              :searchable="true"
              :loading="filter.work_type.loading"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel=""
              :internal-search="true"
              :clear-on-select="true"
              :close-on-select="true"
              :hide-selected="false">
              <span slot="noResult">Không có kết quả phù hợp</span>
              <span slot="noOptions">Không có dữ liệu</span>
            </multiselect>
          </div>
          <!--Phạm vi áp dụng-->
          <div class="col-md">
            <label class="form-label">Chọn phạm vi áp dụng <span class="text-danger">(*)</span></label>
            <multiselect
              class=""
              v-model="filter.option_area.selected"
              label="name"
              track-by="id"
              placeholder=""
              :options="filter.option_area.options"
              :multiple="false"
              :searchable="true"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel=""
              :allow-empty="false"
              :internal-search="true"
              :clear-on-select="true"
              :close-on-select="true"
              :hide-selected="false">
              <span slot="noResult">Không có kết quả phù hợp</span>
              <span slot="noOptions">Không có dữ liệu</span>
            </multiselect>
          </div>
        </div>
        <div class="row">
          <div class="col-md">
            <!--Theo miền-->
            <div v-if="filter.option_area.selected.id === 'region'">
<!--              <label class="form-label">Danh sách ID Miền <span class="text-danger">(*)</span></label>-->
              <b-input placeholder="Nhập list ID Miền cách nhau bởi dấu phẩy" trim v-model="filter.region.selected_ids"></b-input>
            </div>
            <!--Theo tỉnh/thành-->
            <div v-if="filter.option_area.selected.id === 'province'">
<!--              <label class="form-label">Danh sách ID Tỉnh/Thành phố <span class="text-danger">(*)</span></label>-->
              <b-input placeholder="Nhập list ID Tỉnh cách nhau bởi dấu phẩy" trim v-model="filter.province.selected_ids"></b-input>
            </div>
            <!--Theo quận huyện-->
            <div v-if="filter.option_area.selected.id === 'district'">
<!--              <label class="form-label">Danh sách ID Quận/Huyện <span class="text-danger">(*)</span></label>-->
              <b-input placeholder="Nhập list ID Huyện cách nhau bởi dấu phẩy" trim v-model="filter.district.selected_ids"></b-input>
            </div>
            <!--Theo kho-->
            <div v-if="filter.option_area.selected.id === 'station'">
<!--              <label class="form-label">Danh sách ID Kho <span class="text-danger">(*)</span></label>-->
              <b-input placeholder="Nhập list ID Kho cách nhau bởi dấu phẩy" trim v-model="filter.station.selected_ids"></b-input>
            </div>
            <!--Theo username-->
            <div v-if="filter.option_area.selected.id === 'user'">
<!--              <label class="form-label">Danh sách Username <span class="text-danger">(*)</span></label>-->
              <b-input placeholder="Nhập list Username cách nhau bởi dấu phẩy" trim v-model="filter.user.selected_usernames" @input="getListUsersByUsernames"></b-input>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md">
        <!--Theo miền-->
        <div v-if="filter.option_area.selected.id === 'region'">
          <label class="form-label">Chọn Miền <span class="text-danger">(*)</span></label>
          <multiselect
            class="custom-multiselect"
            v-model="filter.region.selected"
            label="name"
            track-by="id"
            placeholder=""
            :options="filter.region.options"
            :multiple="true"
            :searchable="true"
            :loading="filter.region.loading"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel=""
            :internal-search="true"
            :clear-on-select="true"
            :close-on-select="false"
            :hide-selected="false">
            <span slot="noResult">Không có kết quả phù hợp</span>
            <span slot="noOptions">Không có dữ liệu</span>
          </multiselect>
        </div>
        <!--Theo tỉnh/thành-->
        <div v-if="filter.option_area.selected.id === 'province'">
          <label class="form-label">Chọn Tỉnh/Thành phố <span class="text-danger">(*)</span></label>
          <multiselect
            class="custom-multiselect"
            v-model="filter.province.selected"
            label="name"
            track-by="id"
            placeholder=""
            :options="filter.province.options"
            :multiple="true"
            :searchable="true"
            :loading="filter.province.loading"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel=""
            :internal-search="true"
            :clear-on-select="true"
            :close-on-select="false"
            :hide-selected="false">
            <span slot="noResult">Không có kết quả phù hợp</span>
            <span slot="noOptions">Không có dữ liệu</span>
          </multiselect>
        </div>
        <!--Theo quận huyện-->
        <div v-if="filter.option_area.selected.id === 'district'">
          <label class="form-label">Chọn Quận/Huyện <span class="text-danger">(*)</span></label>
          <multiselect
            class="custom-multiselect"
            v-model="filter.district.selected"
            label="name"
            track-by="id"
            placeholder=""
            :options="filter.district.options"
            :multiple="true"
            :searchable="true"
            :loading="filter.district.loading"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel=""
            :internal-search="true"
            :clear-on-select="true"
            :close-on-select="false"
            :hide-selected="false">
            <span slot="noResult">Không có kết quả phù hợp</span>
            <span slot="noOptions">Không có dữ liệu</span>
          </multiselect>
        </div>
        <!--Theo kho-->
        <div v-if="filter.option_area.selected.id === 'station'">
          <label class="form-label">Chọn Kho <span class="text-danger">(*)</span></label>
          <multiselect
            class="custom-multiselect"
            v-model="filter.station.selected"
            label="name"
            track-by="id"
            placeholder=""
            :options="filter.station.options"
            :multiple="true"
            :searchable="true"
            :loading="filter.station.loading"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel=""
            :internal-search="true"
            :clear-on-select="true"
            :close-on-select="false"
            :hide-selected="false">
            <span slot="noResult">Không có kết quả phù hợp</span>
            <span slot="noOptions">Không có dữ liệu</span>
          </multiselect>
        </div>
        <!--Theo username-->
        <div v-if="filter.option_area.selected.id === 'user'">
          <label class="form-label">Username <span class="text-danger">(*)</span></label>
          <multiselect
            v-model="filter.user.selected"
            label="name"
            track-by="id"
            placeholder=""
            :options="filter.user.options"
            :multiple="true"
            :searchable="true"
            :loading="filter.user.loading"
            :internal-search="false"
            :clear-on-select="true"
            :close-on-select="false"
            :hide-selected="true"
            selectLabel=''
            @search-change="findUsers">
            <span slot="noResult">{{ filter.user.message }}</span>
            <span slot="noOptions">{{ filter.user.message }}</span>
          </multiselect>
        </div>
      </div>
    </div>
    <hr class="border-light container-m--x my-2">
    <div>
      <p class="mb-0"><strong>Lưu ý:</strong></p>
      <p class="mb-0">- Sẽ tự động ghi đè config mới nếu có config cùng loại đã tồn tại trong hệ thống</p>
      <p>- Nhấn nút x để chặn loại phụ cấp. Loại phụ cấp bị chặn sẽ không xuất hiện trong thời gian campaign diễn ra</p>
    </div>
    <perfect-scrollbar class="pr-2" :options="{wheelSpeed: 0.2,  wheelPropagation: false }" style="height: 400px">
      <div v-for="object_type in object_types">
        <option-choose-config-campaign @model="option[object_type.id] = $event"
                                       :object_type="object_type"></option-choose-config-campaign>
      </div>
    </perfect-scrollbar>
    <div class=" row float-right mt-5">
      <b-btn @click="$bvModal.hide('modal-add-config-campaign')" variant="secondary">Hủy</b-btn>&nbsp;
      <ladda-btn :loading="buttonSave.loading" @click.native="saveData" data-style="zoom-out" class="btn btn-success">
        Lưu dữ liệu
      </ladda-btn>
    </div>
  </b-modal>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import kpiCodService from 'domain/services/kpi-cod-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import OptionChooseConfigCampaign from './OptionChooseConfigCampaign'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import debounce from 'debounce'

const optionsArea = [
  {name: 'Theo Miền', id: 'region'},
  {name: 'Theo Tỉnh/Thành Phố', id: 'province'},
  {name: 'Theo Quận/Huyện', id: 'district'},
  {name: 'Theo Kho', id: 'station'},
  {name: 'Theo Username', id: 'user'}
]

export default {
  name: 'modal-add-config-campaign',
  props: {
    campaign: {}
  },
  components: {
    kpiCodService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    moment,
    debounce,
    OptionChooseConfigCampaign
  },
  watch: {
    'filter.region.selected_ids': function (newValue) {
      this.filter.region.selected = this.filter.region.options.filter((e) => {
        if (newValue.split(',').map(s => s.trim()).includes(String(e.id))) return e
      })
    },
    'filter.province.selected_ids': function (newValue) {
      this.filter.province.selected = this.filter.province.options.filter((e) => {
        if (newValue.split(',').map(s => s.trim()).includes(String(e.id))) return e
      })
    },
    'filter.district.selected_ids': function (newValue) {
      this.filter.district.selected = this.filter.district.options.filter((e) => {
        if (newValue.split(',').map(s => s.trim()).includes(String(e.id))) return e
      })
    },
    'filter.station.selected_ids': function (newValue) {
      this.filter.station.selected = this.filter.station.options.filter((e) => {
        if (newValue.split(',').map(s => s.trim()).includes(String(e.id))) return e
      })
    },
    'filter.station.selected_usernames': function (newValue) {
      this.filter.station.selected = this.filter.station.options.filter((e) => {
        if (newValue.split(',').map(s => s.trim()).includes(String(e.id))) return e
      })
    }
  },
  mounted () {
    // $(this.$refs.vuemodal).on('hidden.bs.modal', this.doSomethingOnHidden)
  },
  data: () => (
    {
      object_types: [],
      filter: {
        user: {
          loading: false,
          options: [],
          selected: [],
          selected_usernames: '',
          message: 'Nhập ít nhất 2 kí tự'
        },
        option_area: {
          selected: optionsArea[0],
          options: optionsArea
        },
        region: {
          loading: false,
          options: [],
          selected: [],
          selected_ids: ''
        },
        province: {
          loading: false,
          options: [],
          selected: [],
          selected_ids: ''
        },
        district: {
          loading: false,
          options: [],
          selected: [],
          selected_ids: ''
        },
        station: {
          loading: false,
          options: [],
          selected: [],
          selected_ids: ''
        },
        work_type: {
          loading: false,
          options: [],
          selected: [],
          selected_ids: ''
        }
      },
      option: {},
      buttonSave: {
        loading: false
      }
    }
  ),
  computed: {
    usernameState () {
      if (/^[a-z]/.test(this.filter.username) || this.filter.username === '') return true
      return false
    }
  },
  methods: {
    resetValue () {
      this.option = {}
      this.filter.work_type.selected = []
      this.filter.option_area.selected = []
      this.filter.region.selected = []
      this.filter.province.selected = []
      this.filter.district.selected = []
      this.filter.station.selected = []
      this.filter.user.selected = []
    },
    // get list users by username
    getListUsersByUsernames: debounce(function (query) {
      if (query.length < 3) return
      this.filter.user.loading = true
      kpiCodService.apiGetListUsersByUsernames({usernames: this.filter.user.selected_usernames.split(',').map(s => s.trim())}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.user.options = response.data.data
            this.filter.user.selected = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách miền', 'error')
      }).then(() => {
        this.filter.user.loading = false
      })
    }, 500),
    // Tìm CTV
    findUsers: debounce(function (query) {
      if (this.filter.work_type.selected.length < 1) {
        commonHelper.showMessage('Chưa chọn loại hình làm việc', 'error')
        return true
      }
      this.filter.user.loading = true
      kpiCodService.apiSearchUserCtv({work_type: this.filter.work_type.selected.id, term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.user.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách miền', 'error')
      }).then(() => {
        this.filter.user.loading = false
      })
    }, 500),
    // Loại hình làm việc ctv
    getCtvWorkTypes () {
      this.filter.work_type.loading = true
      kpiCodService.apiCtvGetWorkTypes().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.work_type.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      }).then(() => {
        this.getStations()
        this.filter.work_type.loading = false
      })
    },

    // lấy danh sách miền
    getRegions () {
      this.filter.region.loading = true
      kpiCodService.apiCtvGetRegions().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.region.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách miền', 'error')
      }).then(() => {
        this.filter.region.loading = false
      })
    },

    // lấy danh sách tỉnh
    getProvinces () {
      this.filter.province.loading = true
      kpiCodService.apiCtvGetProvinces().then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$root.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            this.filter.province.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      }).then(() => {
        this.filter.province.loading = false
      })
    },

    // lấy danh sách quận huyện
    getDistricts () {
      this.filter.district.loading = true
      kpiCodService.apiCtvGetDistricts().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.district.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      }).then(() => {
        this.filter.district.loading = false
      })
    },

    // lấy danh sách kho
    getStations () {
      this.filter.station.loading = true
      if (this.filter.province.selected.length === 0) {
        this.filter.station.selected = []
      }
      kpiCodService.apiCtvGetStations().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.filter.station.options = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.filter.station.loading = false
      })
    },

    // lấy danh sách loại thù lao
    getObjectTypes () {
      kpiCodService.apiGetObjectTypes().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.object_types = response.data.data
            for (const index in this.object_types) {
              let id = this.object_types[index].id
              this.option[id] = null
            }
          } else {
            return 0
          }
        }
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi khi lấy type object', 'error')
      }).then(() => {
        // this.object_type.loading = false
      })
    },

    // lưu dữ liệu
    saveData () {
      // this.buttonSave.loading = true
      let dataSend = {
        campaign_id: this.campaign.id,
        object_ids: this.option,
        work_type: typeof this.filter.work_type.selected.id === 'undefined' ? null : this.filter.work_type.selected.id,
        scope_type: typeof this.filter.option_area.selected.id === 'undefined' ? null : this.filter.option_area.selected.id,
        region_ids: this.filter.region.selected.map(a => a.id),
        province_ids: this.filter.province.selected.map(a => a.id),
        district_ids: this.filter.district.selected.map(a => a.id),
        station_ids: this.filter.station.selected.map(a => a.id),
        user_ids: this.filter.user.selected.map(a => a.id)
      }
      if (dataSend.object_ids.length === 0) {
        commonHelper.showMessage('Chưa chọn loại Thù lao', 'error')
        this.buttonSave.loading = false
        return 0
      }
      if (dataSend.work_type === null) {
        commonHelper.showMessage('Chưa chọn loại hình làm việc', 'error')
        this.buttonSave.loading = false
        return 0
      }
      kpiCodService.apiSaveCtvConfigV2(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
            this.hideModal()
          } else {
            commonHelper.showMessage(response.data.message, response.data.success ? 'success' : 'error')
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lưu dữ liệu', 'error')
      }).then(() => {
        this.$parent.getCampaigns()
        this.buttonSave.loading = false
      })
    },
    hideModal () {
      this.$bvModal.hide('modal-add-config-campaign')
    }
  },
  created () {
    this.getObjectTypes()
    this.getRegions()
    this.getProvinces()
    this.getDistricts()
    this.getStations()
    this.getCtvWorkTypes()
  }
}
</script>

<style scoped lang="scss">
</style>
