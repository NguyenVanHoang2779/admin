<template>
    <div>
        <div class="ui-block">
            <div class="header-container">
                <div class="row">
                    <div class="col-md-8">
                        <h4 class="ui-block-heading">Config cọc đầu vào</h4>
                    </div>
            </div>
        </div>
        <div class="ui-bordered pt-4 px-4">
            <div v-if="listConfigs.length > 0">
            <b-card no-body :bg-variant="index % 2 ? 'light' : 'default'" v-for="(config, index) in listConfigs" :key="`config-${index}`" class="mb-4 px-5 pt-3">
                <b-button variant="danger" size="sm" class="delete-btn" @click="removeConfig(index)"><i class="fa fa-times"/></b-button>
                <b-button variant="primary" size="sm" class="copy-btn" @click="copyConfig(index)"><i class="fa fa-copy"/></b-button>
                <b-form-row>
                    <b-form-group class="col-md-3"  label="Bộ phận">
                        <single-select-department
                                @handleSelectedDepartment="handleSelectedDepartment(config, ...arguments)"
                                :department-id="config.department_id"
                        >
                        </single-select-department>
                    </b-form-group>
                    <b-form-group class="col-md-3"  label="Vị trí">
                      <multi-select-position
                        @handlePositionSelected="handleSelectedPosition(config, ...arguments)"
                        :position-ids="config.position_ids"
                        :auto-close="false"
                        :hide-selected="true"
                        :custom-class="''"
                        :department-ids="config.department_id">
                      </multi-select-position>
                    </b-form-group>
                    <b-form-group class="col-md-3"  label="Công việc mặc định" v-if="+config.position === +whStaffOnsitePositions">
                        <b-form-checkbox-group id="checkbox-default-work" v-model="config.default_work" name="select-default-work">
                            <b-form-checkbox class="custom-checkbox" value="down_truck">Xuống tải</b-form-checkbox>
                            <b-form-checkbox class="custom-checkbox" value="sorting_bag">Sorting bao</b-form-checkbox>
                            <b-form-checkbox class="custom-checkbox" value="sorting_package">Sorting đơn</b-form-checkbox>
                            <b-form-checkbox class="custom-checkbox" value="labeling">Làm hàng</b-form-checkbox>
                            <b-form-checkbox class="custom-checkbox" value="up_truck">Lên tải</b-form-checkbox>
                            <b-form-checkbox class="custom-checkbox" value="transit">Trung chuyển</b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                    <b-form-group class="col-md-3"  label="Kiểu nhân viên">
                        <multi-select-work-type
                                @handleSelectedWorkType="handleSelectedWorkType(config, ...arguments)"
                                :work-type-id="config.work_type_id"
                                :position-custom="config.position_ids"
                                append_group_type="1"
                        >
                        </multi-select-work-type>
                    </b-form-group>

                    <b-form-group class="col-md-3"  label="Chọn miền:">
                        <single-select-profile-region :region="config.region" @handleSelectedRegion="handleSelectedRegion($event,index)"></single-select-profile-region>
                    </b-form-group>

                    <b-form-group label="Chọn tỉnh (có thể chọn nhiều):" id="input-group-province" class="col-md-3">
                        <multi-select-province
                                @input="handleSelectedField('provinceId', ...arguments, index)"
                                :region="config.region"
                                :pre-load="true"
                                :province-ids="config.provinceId"
                                :limit-prop="99999"
                                :auto-close="false"
                                :hide-selected="true"
                                placeholder="Chọn tỉnh"
                                :custom-class="''"
                        ></multi-select-province>
                    </b-form-group>

                    <b-form-group label="Chọn kho (có thể chọn nhiều): " id="input-group-station" class="col-md-3">
                        <multi-select-station
                                :limit-prop="9999"
                                :station-ids="config.stationId"
                                @handleStationSelected="handleSelectedField('stationId', ...arguments,index)"
                                :auto-close="false"
                                :hide-selected="true"
                                :province-ids="config.provinceId"
                                placeholder="Chọn kho"
                                :custom-class="''"
                        ></multi-select-station>
                    </b-form-group>

                    <b-form-group class="col-md-3"  label="Tổng tiền cần cọc:">
                        <vue-numeric v-model="config.payment_money" class="form-control" currency="VNĐ" v-bind:min="0" v-bind:max="15000000"
                                     currency-symbol-position="suffix"></vue-numeric>
                    </b-form-group>

                    <b-form-group class="col-md-3"  label="Tiền cọc nộp lúc nhận việc:">
                        <vue-numeric v-model="config.receivable_at_work" class="form-control" currency="VNĐ" v-bind:min="0" v-bind:max="15000000"
                                     currency-symbol-position="suffix"></vue-numeric>
                    </b-form-group>
                    <b-form-group class="col-md-3"  label="Thời gian bắt đầu áp dụng:">
                        <v-date-picker v-model="config.from" locale="vi"
                                       color="green"
                                       :input-props="{ placeholder: 'Chọn thời gian bắt đầu áp dụng', style: 'font-size:14px; line-height: unset' }"/>
                    </b-form-group>
                    <b-form-group class="col-md-3"  label="Thời gian bắt đầu kết thúc áp dụng:">
                        <v-date-picker v-model="config.to" locale="vi"
                                       color="green"
                                       :input-props="{ placeholder: 'Chọn thời gian kết thúc áp dụng', style: 'font-size:14px; line-height: unset' }"/>
                    </b-form-group>
                </b-form-row>
            </b-card>
            </div>
            <div v-else>
                Chưa có config
            </div>
            <b-row>
                <b-col>
                    <b-btn variant="outline-success" class="btn-sm" @click="addConfig()">
                        <i class="ion ion-md-add"></i>&nbsp; Thêm config
                    </b-btn>
                </b-col>
            </b-row>
            <div class="text-center mt-3 mb-3">
                <b-btn variant="success" @click="updateConfigDeposit()">Lưu config</b-btn>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import VueNumeric from 'vue-numeric'
import depositService from 'domain/services/deposit-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import User from 'domain/entities/User'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'

export default {
  name: 'config-initial-deposit',

  components: {
    SingleSelectDepartment,
    MultiSelectWorkType,
    SingleSelectProfileRegion,
    MultiSelectProvince,
    MultiSelectStation,
    VueNumeric,
    MultiSelectPosition
  },

  data: () => ({
    listConfigs: [],
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    whStaffOnsitePositions: User.WH_STAFF_ONSITE_POSITIONS,
    optionPositions: [
      { value: null, text: 'Vui lòng chọn bộ phận/ vị trí' },
      { value: 'cod', text: 'COD' },
      { value: 'cod-flex', text: 'COD CTV linh động' },
      { value: 'driver', text: 'Tài xế' },
      { value: 'xlhh_onsite', text: 'XLHH onsite' }
    ]
  }),

  created () {
    this.getConfigDeposits()
  },

  computed: {
  },

  watch: {
  },

  methods: {
    getConfigDeposits () {
      let data = {
        page: 1,
        limit: 1000
      }
      depositService.getConfigDeposits(data)
        .then(res => {
          if (res.data.success) {
            this.listConfigs = res.data.data.data.map((item) => {
              if (item.from != null) {
                item.from = new Date(item.from)
              }
              if (item.to != null) {
                item.to = new Date(item.to)
              }
              return item
            })
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    updateConfigDeposit () {
      let data = this.listConfigs
      depositService.updateConfigDeposit(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },
    addConfig () {
      this.listConfigs.push({
        department_id: null,
        position: null,
        work_type_id: null,
        default_work: null,
        region: null,
        provinceId: null,
        stationId: null,
        payment_money: 0,
        receivable_at_work: 0,
        rangeTime: null,
        from: null,
        to: null,
        position_ids: null
      })
    },
    removeConfig (index) {
      if (index >= 0) {
        this.listConfigs.splice(index, 1)
      }
    },
    copyConfig (index) {
      if (index >= 0) {
        this.listConfigs.push({
          department_id: this.listConfigs[index].department_id,
          position_ids: this.listConfigs[index].position_ids,
          work_type_id: this.listConfigs[index].work_type_id,
          default_work: this.listConfigs[index].default_work,
          region: this.listConfigs[index].region,
          provinceId: this.listConfigs[index].provinceId,
          stationId: this.listConfigs[index].stationId,
          payment_money: this.listConfigs[index].payment_money,
          receivable_at_work: this.listConfigs[index].receivable_at_work,
          rangeTime: this.listConfigs[index].rangeTime,
          from: this.listConfigs[index].from,
          to: this.listConfigs[index].to
        })
      }
    },
    handleSelectedDepartment (config, options) {
      if (!config) return
      if (options) {
        config.department_id = options.id
      } else {
        config.department_id = null
      }
    },

    handleSelectedPosition: function (config, options) {
      if (!config) return
      if (options) {
        config.position_ids = options.map(op => op.id).toString()
      } else {
        config.position_ids = config.position_ids ? config.position_ids : ''
      }
    },

    handleSelectedWorkType (config, options) {
      if (!config) return
      if (options) {
        config.work_type_id = options.map(op => op.id).toString()
      } else {
        config.work_type_id = config.work_type_id ? config.work_type_id : ''
      }
    },
    handleSelectedRegion (option, index) {
      this.listConfigs[index].region = option ? option.id : ''
    },
    handleSelectedField (field, option, index) {
      this.listConfigs[index][field] = option ? option.map((item) => item.id).toString() : ''
    }
  }
}
</script>
<style scoped lang="scss">
 .delete-btn {
     position: absolute;
     top: 5px;
     right: 10px;
 }
 .copy-btn {
     position: absolute;
     top: 5px;
     right: 50px;
     z-index: 999;
 }
</style>
