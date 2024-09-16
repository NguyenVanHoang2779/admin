<template>
  <div>
    <div class="d-flex justify-content-between my-2">
      <h5>Config thời gian thao tác lấy hàng {{ scripts.length ? `(${scripts.length} kịch bản)` : '' }}</h5>
      <div v-if="dataLoading"><i class="fa fa-spin fa-spinner"/></div>
      <b-button variant="outline-success" size="sm" @click.prevent="doShowCreateModal">
        <i class="fa fa-plus" aria-hidden="true"/>
        Thêm kịch bản
      </b-button>
    </div>

    <div class="overflow-x-scroll table-responsive" style="max-height: 1000px">
      <table class="table w-xl-100 table-bordered" style="min-width: 800px" v-show="scripts.length > 0">
        <tr class="bg-light text-center">
          <th style="min-width: 150px">Kịch bản</th>
          <th style="min-width: 300px">Thông tin shop</th>
          <th style="min-width: 200px">Thời gian</th>
          <th style="min-width: 200px">Vận hành</th>
          <th style="min-width: 200px">Để lại CS check</th>
          <th>Thao tác</th>
        </tr>
        <tr v-for="(script, index) in scripts" :key="index">
          <td>
            <div>{{ script.script_name }}</div>
          </td>
          <td>
            <table class="table table-borderless table-sm mb-0">
              <tr>
                <td width="90px">Tên shop:</td>
                <td>
                  <b-badge
                    class="mr-1"
                    :key="shopIndex"
                    v-for="(shopName, shopIndex) in script.details.shop_names" variant="secondary"
                  >
                    {{ shopName.name }}
                  </b-badge>
                </td>
              </tr>
              <tr>
                <td>Loại shop:</td>
                <td>
                  <b-badge
                    class="mr-1"
                    :key="shopTypeIndex"
                    v-for="(shopType, shopTypeIndex) in script.details.shop_types"
                    variant="success"
                  >
                    {{ master.shopTypes[shopType] }}
                  </b-badge>
                </td>
              </tr>
              <tr>
                <td>Loại hàng:</td>
                <td>
                  <b-badge
                    class="mr-1"
                    :key="goodTypeIndex"
                    v-for="(goodType, goodTypeIndex) in script.details.good_types"
                    variant="success"
                  >
                    {{ master.goodTypes[goodType] }}
                  </b-badge>
                </td>
              </tr>
              <tr>
                <td>Loại đơn:</td>
                <td>
                  <b-badge
                    class="mr-1"
                    :key="pkgTypeIndex"
                    v-for="(pkgType, pkgTypeIndex) in script.details.package_types"
                    variant="success"
                  >
                    {{ master.packageTypes[pkgType] }}
                  </b-badge>
                </td>
              </tr>
            </table>
          </td>
          <td>
            <table class="table table-borderless table-sm w-auto mb-0">
              <tr>
                <td>Thời gian tối thiểu:</td>
                <td>{{ script.min_time_process }} phút</td>
              </tr>
              <tr>
                <td>Thời gian tối đa:</td>
                <td>{{ script.max_time_process }} phút</td>
              </tr>
              <tr>
                <td>Thời gian mỗi đơn:</td>
                <td>{{ script.time_process_package }} phút</td>
              </tr>
            </table>
          </td>
          <td>
            <table class="table table-borderless table-sm w-auto mb-0">
              <tr>
                <td>Kiểm tra:</td>
                <td>
                  <span>
                    {{
                      script.details.package_type_need_checks.map(item => master.packageTypeNeedChecks[item]).join(', ')
                    }}
                  </span>
                  <span v-if="script.check_all_package_type === true">
                    <span>
                      {{ script.max_package_of_check }}
                    </span>% ĐH - Tối đa:<span>{{ script.percent_package_of_check }}</span> ĐH
                  </span>
                </td>
              </tr>
              <tr>
                <td>Kb ưu tiên:</td>
                <td>
                  {{ script.details.priority_scripts.map(priorityScript => master.priorityScripts[priorityScript]).join(', ') }}
                </td>
              </tr>
            </table>
          </td>
          <td>
            <table class="table table-borderless table-sm w-auto mb-0" v-if="script.is_configured_cs_check">
              <tr>
                <td>Shop gửi bưu cục:</td>
                <td>
                  <span>{{script.percent_sent_at_post_office}}% ĐH </span>
                </td>
              </tr>
              <tr>
                <td>Lấy thành công: </td>
                <td>
                  <span>{{script.percent_pick_success}}% ĐH </span>
                </td>
              </tr>
              <tr>
                <td>Cân nặng: </td>
                <td>
                  <span>{{script.details.package_weights.map(item => master.packageWeights[item]).join(', ')}} .</span>
                  <span> Tỉ lệ : {{script.percent_package_weight}}% </span>
                </td>
              </tr>
              <tr>
                <td>Shop tag: </td>
                <td>
                  {{script.details.shop_tags.map(item => master.shopTags[item]).join(', ')}}
                </td>
              </tr>
            </table>
          </td>
          <td>
            <b-button variant="outline-success" size="sm" block @click.prevent="doShowEditModal(index)">
              <i class="fa fa-pencil"/>
              Sửa
            </b-button>
            <b-button variant="outline-success" size="sm" block @click.prevent="doShowCloneModal(index)">
              <i class="fas fa-copy"/>
              Clone
            </b-button>
            <b-button variant="outline-danger" size="sm" block @click.prevent="onDeleteScript(index, script.script_name)">
              <i class="fa fa-trash"/>
              Xóa
            </b-button>
          </td>
        </tr>
      </table>
    </div>
    <modal-process-time-config
      v-if="isShowProcessTimeConfigModal"
      :mode="mode"
      :shopsForSearching="shopsForSearching"
      :index="indexNeedEdit"
      :script="scriptNeedEdit"
      :autofill-process-time-data="autofillProcessTimeData"
      @closed="onHideLogModal()"
      @updated="onUpdateScript"
    />
  </div>
</template>

<script>
import * as _ from 'lodash'
import ModalProcessTimeConfig from './ModalProcessTimeConfig'
import CartScript from '../../../../domain/entities/CartScript'
import ManageLineService from 'domain/services/manage-line-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'ProcessTimeConfig',
  components: {
    ModalProcessTimeConfig,
    CartScript,
    ManageLineService
  },
  created () {
    this.getScripts()
  },
  data: () => ({
    master: CartScript.getMasterTagData(),
    isShowProcessTimeConfigModal: false,
    scriptNeedEdit: undefined,
    mode: 'create',
    indexNeedEdit: null,
    initScripts: [],
    dataLoading: false,
    scripts: [],
    autofillProcessTimeData: [],
    shopsForSearching: []
  }),
  methods: {
    onHideLogModal () {
      this.isShowProcessTimeConfigModal = false
    },
    async doShowCreateModal () {
      if (_.isEmpty(this.shopsForSearching)) {
        await this.getShopsByCartForCartScripts()
      }
      this.mode = 'create'
      this.scriptNeedEdit = undefined
      this.indexNeedEdit = null
      this.isShowProcessTimeConfigModal = true
    },
    async doShowEditModal (index) {
      if (_.isEmpty(this.shopsForSearching)) {
        await this.getShopsByCartForCartScripts()
      }
      this.scriptNeedEdit = {...this.scripts[index]}
      this.indexNeedEdit = index
      this.mode = 'edit'
      this.isShowProcessTimeConfigModal = true
    },
    doShowCloneModal (index) {
      if (_.isEmpty(this.shopsForSearching)) {
        this.getShopsByCartForCartScripts()
      }
      this.scriptNeedEdit = {...this.scripts[index]}
      this.scriptNeedEdit.id = null
      this.indexNeedEdit = null
      this.scriptNeedEdit.script_name = ''
      this.mode = 'create'
      this.isShowProcessTimeConfigModal = true
    },
    onUpdateScript ([index, script]) {
      if (!_.isNumber(index)) {
        this.scripts.push(script)
      } else {
        this.scripts.splice(index, 1, script)
      }
      this.getAutofillData()
    },
    async onDeleteScript (index, scriptName) {
      const confirmation = confirm(`Bạn có chắc chắn muốn xóa kịch bản ${scriptName} ?`)
      if (!confirmation) {
        return
      }
      try {
        this.dataLoading = true
        const dataSend = {
          script_id: this.scripts[index].id
        }
        const response = await ManageLineService.deleteScript(dataSend)
        this.scripts.splice(index, 1)
        commonHelper.showMessage(response, 'success')
        this.getAutofillData()
      } catch (reason) {
        this.message = reason.toString()
        commonHelper.showMessage(reason.toString(), 'warning')
      } finally {
        this.dataLoading = false
      }
    },
    async getScripts () {
      try {
        this.dataLoading = true
        const dataSend = {
          cart_id: this.$route.params.id
        }
        this.initScripts = await ManageLineService.getScripts(dataSend)
        this.formatData()
        this.getAutofillData()
      } catch (reason) {
        this.message = reason.toString()
      } finally {
        this.dataLoading = false
      }
    },
    formatData () {
      this.initScripts.forEach((script, index) => {
        const tmpScript = {...script}

        // format lại response để clear data và loại bỏ option id không có ở front-end
        const shopNamesId = this.master.details.shop_names.id
        const formattedShopNames = tmpScript.details[shopNamesId] ? tmpScript.details[shopNamesId].map(shopName => ({
          name: shopName.name,
          order: shopName.tag_id ? shopName.tag_id.toString() : '',
          code: shopName.code
        })) : []

        const shopTypesId = this.master.details.shop_types.id
        const formattedShopTypes = tmpScript.details[shopTypesId] ? tmpScript.details[shopTypesId]
          .filter(a => {
            return Object.keys(this.master.shopTypes).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        const goodTypesId = this.master.details.good_types.id
        const formattedGoodTypes = tmpScript.details[goodTypesId] ? tmpScript.details[goodTypesId]
          .filter(a => {
            return Object.keys(this.master.goodTypes).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        const packageTypesId = this.master.details.package_types.id
        const formattedPackageTypes = tmpScript.details[packageTypesId] ? tmpScript.details[packageTypesId]
          .filter(a => {
            return Object.keys(this.master.packageTypes).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        const packageTypeNeedChecksId = this.master.details.package_type_need_checks.id
        const formattedPackageTypeNeedChecks = tmpScript.details[packageTypeNeedChecksId] ? tmpScript.details[packageTypeNeedChecksId]
          .filter(a => {
            return Object.keys(this.master.packageTypeNeedChecks).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        const priorityScriptsId = this.master.details.priority_scripts.id
        const formattedPriorityScripts = tmpScript.details[priorityScriptsId] ? tmpScript.details[priorityScriptsId]
          .filter(a => {
            return Object.keys(this.master.priorityScripts).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        const packageWeightTagId = this.master.details.package_weights.id
        const formattedPackageWeights = tmpScript.details[packageWeightTagId] ? tmpScript.details[packageWeightTagId]
          .filter(a => {
            return Object.keys(this.master.packageWeights).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        const shopTagId = this.master.details.shop_tags.id
        const formattedShopTags = tmpScript.details[shopTagId] ? tmpScript.details[shopTagId]
          .filter(a => {
            return Object.keys(this.master.shopTags).includes(a.tag_id.toString())
          })
          .map(a => a.tag_id) : []

        let checkAllPackageType = false
        if (formattedPackageTypeNeedChecks.includes(CartScript.allCheckPackage)) {
          checkAllPackageType = true
        }

        const formattedScript = {
          id: tmpScript.id,
          script_name: tmpScript.script_name,
          min_time_process: tmpScript.min_time_process,
          max_time_process: tmpScript.max_time_process,
          time_process_package: tmpScript.time_process_package,
          max_package_of_check: tmpScript.max_package_of_check,
          percent_package_of_check: tmpScript.percent_package_of_check,
          check_all_package_type: checkAllPackageType,
          is_configured_cs_check: Boolean(tmpScript.is_configured_cs_check),
          percent_sent_at_post_office: tmpScript.percent_sent_at_post_office,
          percent_pick_success: tmpScript.percent_pick_success,
          percent_package_weight: tmpScript.percent_package_weight,
          details: {
            shop_names: formattedShopNames,
            shop_types: formattedShopTypes,
            good_types: formattedGoodTypes,
            package_types: formattedPackageTypes,
            priority_scripts: formattedPriorityScripts,
            package_type_need_checks: formattedPackageTypeNeedChecks,
            package_weights: formattedPackageWeights,
            shop_tags: formattedShopTags
          }
        }
        this.scripts.push(formattedScript)
      })
    },
    getAutofillData () {
      this.autofillProcessTimeData = []
      this.scripts.forEach((script, index) => {
        const data = script.details.shop_names ? script.details.shop_names.map(shopName => ({
          order: shopName.order,
          min_time_process: script.min_time_process,
          max_time_process: script.max_time_process,
          time_process_package: script.time_process_package,
          max_package_of_check: script.max_package_of_check,
          percent_package_of_check: script.percent_package_of_check,
          package_type_need_checks: script.details.package_type_need_checks,
          priority_scripts: script.details.priority_scripts,
          is_configured_cs_check: script.is_configured_cs_check,
          percent_sent_at_post_office: script.percent_sent_at_post_office,
          percent_pick_success: script.percent_pick_success,
          percent_package_weight: script.percent_package_weight,
          index: index,
          script_name: script.script_name
        })) : []
        this.autofillProcessTimeData = this.autofillProcessTimeData.concat(data)
      })
    },
    async getShopsByCartForCartScripts () {
      if (_.isEmpty(this.$route.params.id)) {
        this.cart_services = []
        return
      }
      try {
        this.dataLoading = true
        const dataSend = {
          cart_id: this.$route.params.id
        }
        this.shopsForSearching = await ManageLineService.getShopsByCartForCartScripts(dataSend)
        this.shopsForSearching = this.shopsForSearching.map((shop) => ({
          ...shop,
          search_string: commonHelper.removeVietnameseTone(shop.name + '|' + shop.code + '|' + shop.order) + '|' + shop.name + '|' + (shop.name ? shop.name.toLowerCase() : '')
        }))
      } catch (reason) {
        this.message = reason.toString()
      } finally {
        this.dataLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
