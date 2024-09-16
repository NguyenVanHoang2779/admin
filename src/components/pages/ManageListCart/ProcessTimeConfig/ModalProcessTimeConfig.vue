<template>
  <div>
    <b-modal
      :title="'Cập nhật thời gian thao tác tại điểm'"
      size="lg"
      header-bg-variant="success"
      header-text-variant="white"
      no-close-on-backdrop
      centered
      static
      scrollable
      v-model="show"
      id="ModalCartScript"
    >
      <table class="table table-borderless table-sm mb-0">
        <tr>
          <b>Thông tin Shop</b>
        </tr>
        <tr>
          <td width="150px" :class="error.scriptName ? 'text-danger' : ''">Tên kịch bản:</td>
          <td>
            <b-input type="text" v-model="script.script_name" placeholder="Đặt tên gợi nhớ cho kịch bản"/>
          </td>
        </tr>
        <tr>
          <td :class="error.details ? 'text-danger' : ''" width="150px">{{ master.details.shop_names.text }}</td>
          <td>
            <multi-select-shop-for-cart-scripts
              :options="shopsForSearching"
              :selected="script.details.shop_names"
              @onChange="handleSelectShops($event)"
            />
          </td>
        </tr>
        <tr>
          <td :class="error.details ? 'text-danger' : ''">{{ master.details.shop_types.text }}</td>
          <td>
            <multi-select-features
              :multiple="true"
              :placeholder="'Tất cả'"
              :options="options.shopTypes"
              :master="master.shopTypes"
              @onChange="handleSelectFeatures($event, 'shop_types')"
              :selected="script.details.shop_types"
            />
          </td>
        </tr>
        <tr>
          <td :class="error.details ? 'text-danger' : ''">{{ master.details.good_types.text }}</td>
          <td>
            <multi-select-features
              :multiple="true"
              :placeholder="'Tất cả'"
              :options="options.goodTypes"
              :master="master.goodTypes"
              @onChange="handleSelectFeatures($event, 'good_types')"
              :selected="script.details.good_types"
            />
          </td>
        </tr>
        <tr>
          <td :class="error.details ? 'text-danger' : ''">{{ master.details.package_types.text }}</td>
          <td>
            <multi-select-features
              :multiple="true"
              :placeholder="'Tất cả'"
              :options="options.packageTypes"
              :master="master.packageTypes"
              @onChange="handleSelectFeatures($event, 'package_types')"
              :selected="script.details.package_types"
            />
          </td>
        </tr>
        <hr/>
        <tr>
          <b>Thời gian</b>
        </tr>
        <tr>
          <td :class="error.minTimeProcess ? 'text-danger' : ''">Thời gian tối thiểu:</td>
          <td>
            <b-form-select :disabled="autofill" v-model="script.min_time_process">
              <option v-for="index in optionMinTimeProcess" :value="index">{{ index }} phút</option>
            </b-form-select>
          </td>
        </tr>
        <tr>
          <td :class="error.maxTimeProcess ? 'text-danger' : ''">Thời gian tối đa:</td>
          <td>
            <b-form-select :disabled="autofill" v-model="script.max_time_process">
              <option v-for="index in optionMaxTimeProcess" :value="index">{{ index }} phút</option>
            </b-form-select>
            <div v-if="autofill">
              <small>{{ timeConfigNote }}</small>
            </div>
          </td>
        </tr>

        <tr>
          <td :class="error.timeProcessPackage ? 'text-danger' : ''">Thời gian từng đơn:</td>
          <td>
            <b-form-select v-model="script.time_process_package">
              <option v-for="index in optionTimeProcessPackage" :value="index">{{ index }} phút</option>
            </b-form-select>
          </td>
        </tr>
        <hr/>
        <tr>
          <b>Vận hành</b>
        </tr>
        <tr>
          <td :class="error.packageTypeNeedChecks ? 'text-danger' : ''">Kiểm tra:</td>
          <table class="table table-borderless table-sm mb-0">
            <tr>
              <td style="width: 55%">
                <multi-select-features
                  :multiple="true"
                  :placeholder="'Chọn kịch bản ưu tiên'"
                  :options="options.packageTypeNeedChecks"
                  :master="master.packageTypeNeedChecks"
                  @onChange="handleSelectFeatures($event, 'package_type_need_checks')"
                  :selected="script.details.package_type_need_checks"
                  :disabled="autofill"
                />
              </td>
              <td>
                <b-form-select v-model="script.percent_package_of_check" :disabled="autofill || checkAllPackageType">
                  <option v-for="index in optionPercentPackageOfCheck" :value="index">{{ index }}% ĐH</option>
                </b-form-select>
              </td>

              <td :class="error.maxPackageOfCheck ? 'text-danger' : '' "><span class="title-max-package">Tối đa</span></td>
              <td>
                <b-form-select v-model="script.max_package_of_check" :disabled="autofill || checkAllPackageType">
                  <option v-for="index in optionMaxPackageOfCheck" :value="index">{{ index }} ĐH</option>
                </b-form-select>
              </td>
            </tr>
          </table>
        </tr>

        <tr>
          <td :class="error.priorityScripts ? 'text-danger' : ''">{{ master.details.priority_scripts.text }}:</td>
          <td>
            <multi-select-features
              :multiple="true"
              :placeholder="'Chọn kịch bản ưu tiên'"
              :options="options.priorityScripts"
              :master="master.priorityScripts"
              @onChange="handleSelectFeatures($event, 'priority_scripts')"
              :selected="script.details.priority_scripts"
              :disabled="autofill"
            />
          </td>
        </tr>
        <hr/>
      </table>
      <!--OSNV-4879 Config kịch bản CS check -->
     <cs-check v-model="configCsCheck" @updatedCsCheckConfig="changeConfigCSCheck"/>

      <template #modal-footer="{ hide }">
        <div v-if="loading" class="text-center">
          <i class="fa fa-spin fa-spinner"/> Đang tải dữ liệu...
        </div>

        <b-alert variant="warning" class="py-1" v-html="errorMessage" show v-else-if="errorMessage"/>
        <b-button variant="outline-secondary" @click="hide()">Đóng</b-button>
        <b-button variant="outline-success" v-if="mode === 'edit'" @click="handleSaveScript()">
          Sửa
        </b-button>
        <b-button variant="outline-success" v-if="mode === 'create'" @click="handleSaveScript()">
          Thêm
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ManageLineService from '../../../../domain/services/manage-line-service'
import MultiSelectShopForCartScripts from '../../../elements/common/MultiSelectShopForCartScripts'
import MultiSelectFeatures from '../../../elements/common/MultiSelectFeatures'
import CartScript from '../../../../domain/entities/CartScript'
import * as _ from 'lodash'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import CsCheck from './CsCheck.vue'

export default {
  name: 'ModalProcessTimeConfig',
  components: {
    CsCheck,
    MultiSelectFeatures,
    MultiSelectShopForCartScripts,
    CartScript
  },
  props: {
    index: {
      type: Number,
      required: false
    },
    script: {
      type: Object,
      default: () => ({
        details: {}
      })
    },
    shopsForSearching: {
      type: Array,
      default: () => ([])
    },
    autofillProcessTimeData: {
      type: Array,
      default: () => ([])
    },
    mode: {
      type: String,
      default: 'create'
    }
  },
  data () {
    return {
      master: CartScript.getMasterTagData(),
      options: CartScript.getOptions(),
      show: true,
      loading: false,
      errorMessage: null,
      error: {},
      timeConfigNote: '',
      autofill: false,
      optionMinTimeProcess: _.range(5, 16, 1),
      optionMaxTimeProcess: _.range(20, 61, 1),
      optionTimeProcessPackage: _.range(1, 11, 1),
      optionPercentPackageOfCheck: _.range(1, 100, 1),
      optionMaxPackageOfCheck: _.range(1, 200, 1),
      checkAllPackageType: false,
      configCsCheck: {}
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
    this.setConfigCsCheck()
  },
  methods: {
    handleSelectShops ([options, dataIsInitialized]) {
      const details = {...this.script.details, shop_names: options}
      this.script.details = details

      // auto fill thời gian thao tác theo shop, lấy shop đầu trong list
      this.autofill = false
      if (!_.isEmpty(options)) {
        const matchedData = this.autofillProcessTimeData.find(shop => {
          if (shop.index === this.index) return false
          return options.filter(selectedShop => (selectedShop.order.toString() === shop['order'].toString())).length
        })
        if (matchedData) {
          this.autofill = true
          this.script.min_time_process = matchedData.min_time_process
          this.script.max_time_process = matchedData.max_time_process
          this.script.max_package_of_check = matchedData.max_package_of_check
          this.script.percent_package_of_check = matchedData.percent_package_of_check
          this.script.priority_scripts = matchedData.priority_scripts
          this.script.details.package_type_need_checks = matchedData.package_type_need_checks
          this.script.details.priority_scripts = matchedData.priority_scripts
          this.script.details.priority_scripts = matchedData.priority_scripts
          this.script.details.priority_scripts = matchedData.priority_scripts
          this.script.is_configured_cs_check = matchedData.is_configured_cs_check
          this.script.percent_sent_at_post_office = matchedData.percent_sent_at_post_office
          this.script.percent_pick_success = matchedData.percent_pick_success
          this.script.percent_package_weight = matchedData.percent_package_weight

          // nếu lần đầu đổ dữ liệu vào modal thì giữ nguyên time_process_package,
          // nếu người dùng thay đổi tên shop thì mới gợi ý lại time_process_package
          if (!dataIsInitialized) {
            this.script.time_process_package = matchedData.time_process_package
          }

          if (this.mode === 'create') {
            this.timeConfigNote = `Tự động điền thời gian tối thiểu và tối đa do tên shop đã có ở kịch bản "${matchedData.script_name}"`
          }
          if (this.mode === 'edit') {
            this.timeConfigNote = `Không thể sửa thời gian tối thiểu và tối đa do tên shop đã có ở kịch bản "${matchedData.script_name}"`
          }
        }
      }
    },
    handleSelectFeatures (options, feature) {
      if (feature === CartScript.details.package_type_need_checks.value) {
        if (!options.includes(CartScript.allCheckPackage)) {
          this.checkAllPackageType = true
        } else {
          this.checkAllPackageType = false
          options = [CartScript.allCheckPackage]
        }
      }

      const details = {...this.script.details, [feature]: options}
      this.script.details = {...details}
    },
    async handleSaveScript () {
      this.validateSubmit()
      if (!_.isEmpty(this.errorMessage)) {
        return
      }
      try {
        const dataSave = this.prepareDataSave()
        this.loading = true
        const res = await ManageLineService.saveScript(dataSave)
        this.script.id = res.script_id
        commonHelper.showMessage('Lưu thành công', 'success')
        this.$emit('updated', [this.index, this.script])
        this.$bvModal.hide('ModalCartScript')
      } catch (reason) {
        this.message = reason.toString()
        commonHelper.showMessage(reason.toString(), 'warning')
      } finally {
        this.loading = false
      }
    },
    prepareDataSave: function () {
      const details = [].concat(
        this.script.details.shop_names.map(shop => ({
          type: this.master.details.shop_names.id,
          tag_id: shop.order
        })),
        this.script.details.shop_types.map(id => ({
          type: this.master.details.shop_types.id,
          tag_id: id
        })),
        this.script.details.good_types.map(id => ({
          type: this.master.details.good_types.id,
          tag_id: id
        })),
        this.script.details.package_types.map(id => ({
          type: this.master.details.package_types.id,
          tag_id: id
        })),
        this.script.details.package_type_need_checks.map(id => ({
          type: this.master.details.package_type_need_checks.id,
          tag_id: id
        })),
        this.script.details.priority_scripts.map(id => ({
          type: this.master.details.priority_scripts.id,
          tag_id: id
        })),
        this.script.details.package_weights.map(id => ({
          type: this.master.details.package_weights.id,
          tag_id: id
        })),
        this.script.details.shop_tags.map(id => ({
          type: this.master.details.shop_tags.id,
          tag_id: id
        }))
      )

      return {
        id: this.script.id,
        cart_id: this.$route.params.id,
        script_name: this.script.script_name,
        min_time: this.script.min_time_process,
        max_time: this.script.max_time_process,
        process_package_time: this.script.time_process_package,
        max_package_of_check: this.script.max_package_of_check,
        is_configured_cs_check: Number(this.script.is_configured_cs_check),
        percent_sent_at_post_office: this.script.percent_sent_at_post_office !== null ? this.script.percent_sent_at_post_office : 0,
        percent_pick_success: this.script.percent_pick_success !== null ? this.script.percent_pick_success : 0,
        percent_package_weight: this.script.percent_package_weight !== null ? this.script.percent_package_weight : 0,
        percent_package_of_check: this.script.percent_package_of_check,
        details: details
      }
    },
    validateSubmit () {
      const errorMessage = []
      this.error = {}

      if (_.isEmpty(this.script.script_name)) {
        this.error.scriptName = true
        errorMessage.push(`Vui lòng điền tên kịch bản.`)
      }

      if (
        _.isEmpty(this.script.details.shop_names) &&
        _.isEmpty(this.script.details.shop_types) &&
        _.isEmpty(this.script.details.good_types) &&
        _.isEmpty(this.script.details.package_types)
      ) {
        this.error.details = true
        errorMessage.push(`Vui lòng điền ít nhất 1 trong 4 trường: tên shop, loại shop, loại hàng, loại đơn`)
      }

      if (_.isEmpty(this.script.details.package_type_need_checks)) {
        this.error.packageTypeNeedChecks = true
        errorMessage.push(`Vui lòng điền ngành hàng cần kiểm tra`)
      }

      const priorityScriptValues = this.script.details.priority_scripts || []
      const pickShiftPriorityScripts = priorityScriptValues.filter(value => (CartScript.getShiftPriorityScripts).includes(value))
      if (!_.isEmpty(this.script.details.priority_scripts) && pickShiftPriorityScripts.length > 1) {
        this.error.priorityScripts = true
        errorMessage.push(`Vui lòng chọn chỉ 1 KB ca lấy hàng`)
      }
      if (!this.optionMinTimeProcess.includes(this.script.min_time_process)) {
        this.error.minTimeProcess = true
        errorMessage.push(`Vui lòng chọn thời gian tối thiểu`)
      }
      if (!this.optionMaxTimeProcess.includes(this.script.max_time_process)) {
        this.error.maxTimeProcess = true
        errorMessage.push(`Vui lòng chọn thời gian tối đa`)
      }
      if (!this.optionTimeProcessPackage.includes(this.script.time_process_package)) {
        this.error.timeProcessPackage = true
        errorMessage.push(`Vui lòng chọn thời gian từng đơn`)
      }

      if (
        Boolean(this.script.is_configured_cs_check) &&
        _.isEmpty(this.script.details.package_weights) &&
        _.isEmpty(this.script.details.shop_tags) &&
        this.script.percent_sent_at_post_office === null &&
        this.script.percent_pick_success === null &&
        this.script.percent_package_weight === null
      ) {
        errorMessage.push(`Vui lòng cấu hình kịch bản CS check.`)
      }

      this.errorMessage = errorMessage.join('<br>')
    },
    changeConfigCSCheck (data) {
      this.script.is_configured_cs_check = data.is_configure
      this.script.percent_sent_at_post_office = data.percent_sent_at_post_office
      this.script.percent_package_weight = data.percent_package_weight
      this.script.percent_pick_success = data.percent_pick_success
      this.script.details.package_weights = data.package_weights
      this.script.details.shop_tags = data.shop_tags
    },
    setConfigCsCheck () {
      this.configCsCheck = {
        is_configure: this.script.is_configured_cs_check !== undefined ? this.script.is_configured_cs_check : false,
        percent_sent_at_post_office: this.script.is_configured_cs_check ? this.script.percent_sent_at_post_office : null,
        percent_pick_success: this.script.is_configured_cs_check ? this.script.percent_pick_success : null,
        percent_package_weight: this.script.is_configured_cs_check ? this.script.percent_package_weight : null,
        package_weights: this.script.is_configured_cs_check ? this.script.details.package_weights : [],
        shop_tags: this.script.is_configured_cs_check ? this.script.details.shop_tags : []
      }
    }
  }
}

</script>
<style scoped>
.log-config > tbody {
  display: block;
  height: 700px;
  width: 100%;
  overflow-y: auto;
}

.log-config > tbody > tr {
  display: table;
  width: 100%;
  table-layout: inherit;
}

.title-max-package {
  padding-top: 0.438rem;
  display: block;
  white-space: nowrap
}
</style>
