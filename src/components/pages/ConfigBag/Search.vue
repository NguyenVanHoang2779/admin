<template>
  <div>
    <b-card class="mb-4">
      <b-form inline class="mb-4">
        <label class="form-label mr-sm-2" style="width: 7%; justify-content: left;">Nguồn đơn</label>
        <div class="ct-bag">
          <b-radio-group v-model="srcSelected" :options="optionsSrc" />
          <div style="width: inherit;">
            <div v-if="srcSelected">
              <multiselect
                v-model="provinceSrc"
                :options="provinces"
                placeholder="Chọn tỉnh"
                :multiple="true"
                label="name"
                track-by="id" />
            </div>
            <div v-else>
              <SelectStationBag
                @onChange="selectedSrcStation"
                @notResetSrcStation="notResetSrcStationParent"
                :resetSrcStation ="resetValueSrcStation">
              </SelectStationBag>
            </div>
          </div>
        </div>
      </b-form>
      <b-form inline class="mb-4">
        <label class="form-label mr-sm-2" style="width: 7%; justify-content: left;">Đích đơn</label>
        <div class="ct-bag">
          <b-radio-group v-model="dstSelected" :options="optionsDst" />
          <div style="width: inherit;">
            <div v-if="dstSelected">
              <multiselect
                v-model="provinceDst"
                :options="provinces"
                placeholder="Chọn tỉnh"
                :multiple="true"
                label="name"
                track-by="id" />
            </div>
            <div v-else>
              <SelectStationBag
                @onChange="selectedDstStation"
                @notResetDstStation="notResetDstStationParent"
                :resetDstStation ="resetValueDstStation">
              </SelectStationBag>
            </div>
          </div>
        </div>
      </b-form>
      <b-form inline class="mb-4">
        <label class="form-label mr-sm-2" style="width: 7%; justify-content: left;">Đích bao</label>
        <div style="width: 90%">
          <SelectStationBag
            @onChange="selectedDstBag"
            @notResetDstBag="notResetDstBagParent"
            :resetDstBag ="resetValueDstBag"
          >
          </SelectStationBag>
        </div>
      </b-form>
      <b-form inline class="mb-4">
        <label class="form-label mr-sm-2" style="width: 7%; justify-content: left;">Loại bao</label>
        <div style="width: 90%">
          <multiselect
            v-model="bagTypeValue"
            :options="bagTypeData"
            placeholder="Chọn loại bao"
            label="name"
            track-by="id" />
        </div>
      </b-form>
      <b-form inline class="mb-4">
        <label class="form-label mr-sm-2" style="width: 7%; justify-content: left;">PTVC</label>
        <div style="width: 90%">
          <multiselect
            v-model="transportValue"
            :options="transportData"
            placeholder="Chọn phương thức vận chuyển"
            label="name"
            track-by="value" />
        </div>
      </b-form>
      <b-form inline class="mb-4">
        <label class="form-label mr-sm-2" style="width: 7%; justify-content: left;">Người tạo</label>
        <div style="width: 90%">
          <multi-select-user v-model="cuid" />
        </div>
      </b-form>
      <div class="text-center mb-4">
        <b-btn variant="default" class="mr-4" @click="resetSearch">Làm lại</b-btn>
        <b-btn variant="success" @click="searchConfigBag">Tìm kiếm</b-btn>
      </div>
    </b-card>

    <b-pagination
      style="z-index: 0;"
      :total-rows="allRecord"
      v-model="pagePagination"
      :per-page="perPagePagination"
    />

    <b-card class="mb-4">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="selected" slot-scope="props">
          <div>
            <input v-model="props.row.selected" type="checkbox" @click="checkedDeleted(props.row.id)">
          </div>
        </template>
        <template slot="src_id" slot-scope="props">
          <div>
            <p>
              <span>Tỉnh({{props.row.src_id.province_ids.length}}): {{props.row.src_id.province_ids ? props.row.src_id.province_ids.map(function (elem) {return elem.name}).join(', ') : ''}}</span>
            </p>
            <p>
              <span>Kho({{props.row.src_id.station_ids.length}}): {{props.row.src_id.station_ids ? props.row.src_id.station_ids.map(function (elem) {return elem.name}).join(', ') : ''}}</span>
            </p>
          </div>
        </template>
        <template slot="dst_id" slot-scope="props">
          <div>
            <p>
              <span>Tỉnh({{props.row.dst_id.province_ids.length}}): {{props.row.dst_id.province_ids ? props.row.dst_id.province_ids.map(function (elem) {return elem.name}).join(', ') : ''}}</span>
            </p>
            <p>
              <span>Kho({{props.row.dst_id.station_ids.length}}): {{props.row.dst_id.station_ids ? props.row.dst_id.station_ids.map(function (elem) {return elem.name}).join(', ') : ''}}</span>
            </p>
          </div>
        </template>
        <template slot="dst_id_bag" slot-scope="props">
          <p>{{props.row.dst_id_bag.name}}</p>
        </template>
        <template slot="transport" slot-scope="props">
          <p>{{transportDisplay[props.row.transport]}}</p>
        </template>
        <template slot="bag_type" slot-scope="props">
          <p>{{bagTypeData.find(item => item.id == props.row.bag_type) ? (bagTypeData.find(item => item.id == props.row.bag_type)).name : ''}}</p>
        </template>
        <template slot="action" slot-scope="props">
          <div class="mb-2">
<!--            <b-btn size="sm" variant="default" class="mr-2"><span class="ion ion-md-create"></span>&nbsp;&nbsp;Sửa</b-btn>-->
            <b-btn size="sm" variant="default" @click="showDelete(props.row.id)"><span class="ion ion-ios-remove-circle-outline"></span>&nbsp;&nbsp;Xóa</b-btn>
          </div>
<!--          <b-link><small style="color: green;">Xem Log</small></b-link>-->
        </template>
      </v-client-table>
    </b-card>
    <sweet-modal ref="successModalAll">
      <p class="mb-4 bold">Bạn có chắc chắn xóa tất cả config bao đã chọn không?</p>
      <div class="mb-2">
        <b-btn variant="success" @click="deleteAllConfigBag">Đồng ý</b-btn>
      </div>
    </sweet-modal>
    <sweet-modal ref="successModal">
      <p class="mb-4 bold">Bạn có chắc chắn xóa config bao không?</p>
      <div class="mb-2">
        <b-btn variant="success" @click="deleteConfigBag">Đồng ý</b-btn>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import SelectStationBag from 'components/elements/FilterBox/SelectStationBag'
import ConfigBagService from 'domain/services/config-bag-service'
import Multiselect from 'vue-multiselect'
import * as _ from 'lodash'
import {SweetModal} from 'sweet-modal-vue'
import MultiSelectUser from './../../elements/common/MultiSelectUserV3'

Vue.use(ClientTable)

const transportOptions = [
  { name: 'Tất cả', value: 'all' },
  { name: 'Bay', value: 'none' },
  { name: 'Bộ', value: 'onlyroad' }
]

export default {
  name: 'SearchBags',
  components: {
    SelectStationBag,
    Multiselect,
    SweetModal,
    MultiSelectUser
  },
  data: () => ({
    optionsSrc: [
      { text: 'Kho', value: 0 },
      { text: 'Tỉnh', value: 1 }
    ],
    optionsDst: [
      { text: 'Kho', value: 0 },
      { text: 'Tỉnh', value: 1 }
    ],
    bagTypeValue: {},
    bagTypeData: [],
    provinces: [],
    provinceSrc: [],
    provinceDst: [],
    transportValue: {},
    cuid: {},
    transportDisplay: {
      all: 'Tất cả',
      none: 'Bay',
      onlyroad: 'Bộ'
    },
    transportData: transportOptions,
    selectedSrc: [],
    selectedDstBagValue: [],
    selectedDst: [],
    srcSelected: 1,
    dstSelected: 1,
    tableData: [],
    showPackagesInLog: false,
    columns: ['selected', 'name', 'dst_id_bag', 'src_id', 'dst_id', 'bag_type', 'transport', 'create_user_name', 'created', 'action'],
    options: {
      perPage: 50,
      sortable: [],
      customFilters: [],
      headings: {
        selected: function (h) {
          return h('input', {
            attrs: {
              type: 'checkbox',
              id: 'selectAllCheckbox'
            },
            on: {
              click: (e) => {
                this.selectAll(e.srcElement.checked)
              }
            },
            ref: 'selectAllCheckbox'
          })
        },
        'action': function (h) {
          return h('span', {
            attrs: {
              class: 'ion d-block ion-md-remove-circle-outline',
              title: 'Xóa tất cả'
            },
            on: {
              click: (e) => {
                this.showDeleteAll()
              }
            }
          })
        },
        'name': 'Tên bao',
        'dst_id_bag': 'Đích bao',
        'src_id': 'Nguồn đơn',
        'dst_id': 'Đích đơn',
        'bag_type': 'Loại bao',
        'transport': 'PTVC',
        'create_user_name': 'Người tạo',
        'created': 'Ngày tạo'
        // 'action': 'Thao tác'
      },
      columnsClasses: {
        selected: 'text-center align-middle',
        action: 'text-center align-middle',
        name: 'align-middle',
        dst_id_bag: 'align-middle',
        src_id: 'align-middle w-25',
        dst_id: 'align-middle w-25',
        bag_type: 'align-middle',
        transport: 'align-middle',
        create_user_name: 'align-middle',
        created: 'align-middle'
      },
      filterable: false,
      resizableColumns: true,
      perPageValues: []
    },
    optionsPagination: {
      chunk: 5
    },
    pagePagination: 1,
    perPagePagination: 50,
    allRecord: 500,
    showPackage: false,
    showBag: false,
    showEdit: false,
    deleteId: 0,
    resetValueDstBag: 0,
    resetValueDstStation: 0,
    resetValueSrcStation: 0
  }),
  created () {
    this.searchConfigBag()
    this.getBagTypeConfig()
    this.getListProvinces()
  },
  watch: {
    srcSelected: function () {
      this.provinceSrc = []
      this.selectedSrc = []
    },
    dstSelected: function () {
      this.provinceDst = []
      this.selectedDst = []
    },
    pagePagination: function () {
      this.searchConfigBag()
    }
  },
  methods: {
    selectAll (checked) {
      let length = this.tableData.length
      for (let i = 0; i < length; i++) {
        this.tableData[i].selected = checked
      }
    },
    checkedDeleted (id) {
      this.tableData.forEach(el => {
        if (el.id === String(id)) {
          if (el.selected) {
            el.selected = false
          } else {
            el.selected = true
          }

          return 1
        }
      })
    },
    selectedSrcStation (option) {
      if (!_.isNil(option)) {
        this.selectedSrc = _.map(option, 'id')
      }
    },
    selectedDstBag (option) {
      if (!_.isNil(option)) {
        this.selectedDstBagValue = _.map(option, 'id')
      }
    },
    selectedDstStation (option) {
      if (!_.isNil(option)) {
        this.selectedDst = _.map(option, 'id')
      }
    },
    notResetDstBagParent (value) {
      this.resetValueDstBag = value
    },
    notResetDstStationParent (value) {
      this.resetValueDstStation = value
    },
    notResetSrcStationParent (value) {
      this.resetValueSrcStation = value
    },
    searchConfigBag () {
      let dataSend = {
        limit: this.perPagePagination
      }

      this.tableData = []

      if (this.pagePagination) {
        dataSend['page'] = this.pagePagination
      }

      if (this.provinceSrc) {
        dataSend['src_provice_id'] = _.map(this.provinceSrc, 'id')
      }

      if (this.provinceDst) {
        dataSend['dst_province_id'] = _.map(this.provinceDst, 'id')
      }
      if (this.selectedDstBagValue) {
        dataSend['dst_id_bag'] = this.selectedDstBagValue
      }
      if (this.selectedSrc) {
        dataSend['src_id'] = this.selectedSrc
      }
      if (this.selectedDst) {
        dataSend['dst_id'] = this.selectedDst
      }
      if (this.transportValue) {
        dataSend['transport'] = this.transportValue['value']
      }
      if (this.bagTypeValue) {
        dataSend['bag_type'] = this.bagTypeValue['id']
      }

      if (this.cuid) {
        dataSend['cuid'] = _.map(this.cuid, 'id')
      }

      ConfigBagService.searchConfigBag(dataSend).then(res => {
        if (res.data.success && res.data.data) {
          res.data.data.forEach(el => {
            el.selected = false
          })
          this.tableData = res.data.data
        } else {
          if (res.data.data && res.data.data.close_page) {
            this.$router.push({ name: 'error-403', params: { msg: 'Chức năng đang tạm đóng! Xin hãy chuyển sang sử dụng màn admin kho mới!' } })
          }
          this.$notify({
            group: 'default',
            type: 'bg-danger text-white',
            title: 'Thông báo',
            text: res.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra'
        })
      })
    },
    getBagTypeConfig () {
      ConfigBagService.getBagTypeConfig().then(res => {
        if (res.data.success && res.data.data) {
          this.bagTypeData = res.data.data
          this.bagTypeData.push({
            id: 0,
            name: 'Bao tổng'
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra'
        })
      })
    },
    getListProvinces () {
      ConfigBagService.getListProvinces().then(res => {
        if (res.data.success && res.data.data) {
          for (const [key, value] of Object.entries(res.data.data)) {
            this.provinces.push({
              id: key,
              name: value
            })
          }
        }
      }).catch(() => {
      })
    },
    resetSearch () {
      this.transportValue = {}
      this.bagTypeValue = {}
      this.provinceDst = []
      this.provinceSrc = []
      this.selectedSrc = []
      this.selectedDstBagValue = []
      this.selectedDst = []
      this.resetValueDstBag = 1
      this.resetValueDstStation = 1
      this.resetValueSrcStation = 1
    },
    showDelete (id) {
      this.deleteId = id
      this.$refs['successModal'].open()
    },
    showDeleteAll () {
      this.$refs['successModalAll'].open()
    },
    deleteAllConfigBag () {
      let listIds = []

      this.tableData.forEach(el => {
        if (el.selected) {
          listIds.push(el.id)
        }
      })

      ConfigBagService.deleteConfigBag(listIds).then(res => {
        if (res.data.success) {
          this.tableData = this.tableData.filter(el => !el.selected)
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-danger text-white',
            title: 'Thông báo',
            text: res.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra'
        })
      })

      this.$refs['successModalAll'].close()
    },

    deleteConfigBag () {
      ConfigBagService.deleteConfigBag(this.deleteId).then(res => {
        if (res.data.success) {
          this.tableData = this.tableData.filter(el => el.id !== this.deleteId)
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-danger text-white',
            title: 'Thông báo',
            text: res.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra'
        })
      })

      this.$refs['successModal'].close()
    }
  }
}
</script>

<style scoped>
  .ct-bag {
    width: 90%;
    align-items: center;
    display: flex;
    place-content: space-between;
  }
</style>
