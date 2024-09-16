<template>
  <div class="small-scrollbar">
    <div>
      <!-- header  -->
      <b-row class="align-items-center">
        <b-col md="4">
          <h2 class="m-0 font-weight-bold text-dark">Hiệu quả hoạt động</h2>
          <h6 class="mt-4 font-italic">Cập nhật {{ lastUpdateTime }}</h6>
        </b-col>
        <b-col class="text-right">
          <b-button class="badge-pill mr-1" v-bind:class="btnFocusIndex === 0 ? 'btn-ghtk': 'btn-light'"
                    @click="filterTime(0)">Tuần này
          </b-button>
          <b-button class="badge-pill mr-1" v-bind:class="btnFocusIndex === 1 ? 'btn-ghtk': 'btn-light'"
                    @click="filterTime(1)">Tháng này
          </b-button>
          <b-button class="badge-pill" v-bind:class="btnFocusIndex === 2 ? 'btn-ghtk': 'btn-light'"
                    @click="filterTime(2)">3 tháng
          </b-button>
        </b-col>
      </b-row>
      <!-- filter  -->
      <b-row class="mt-4">
        <b-col class="col-md-2 mr-0">
          <SingleSelectRegion
            @handleSelectedRegion="option => filter.region = option ? option.id : null" :reset="reset"
            class="multiselect-ghtk"/>
        </b-col>
        <b-col class="col-md-2 mr-0">
          <SingleSelectProvince @handleSelectedProvince="option => filter.provinceId = option ? option.id
          : null" :regionName="filter.region" :reset="reset"
                                custom-class="multiselect-ghtk"/>
        </b-col>
        <b-col class="col-md-2 mr-0">
          <SingleSelectStation
            @handleSelectedStation="opt => filter.station = opt ? opt.id : null"
            :provinceId="filter.provinceId" :reset="reset"
            custom-class="multiselect-ghtk"/>
        </b-col>
        <b-col class="col-md-1 mr-5">
          <b-btn class="btn-center" variant="ghtk" @click="search"><i class="fas fa-search"></i> Tìm kiếm</b-btn>
        </b-col>
        <b-col class="col-md-1 mr-0">
          <b-btn class="btn-center" variant="ghtk" @click="clearFilter"><i class="fas fa-sync-alt"></i> Xóa lọc</b-btn>
        </b-col>
      </b-row>
      <b-row class="m-2">
        <span class="cursor-pointer font-weight-bold mx-2"
              v-bind:class="orderByIndex === 0 ? 'text-dark': 'text-success'" @click="filterOrder(0)">SL thấp</span>
        <div class="vr"></div>
        <!--        <span class="cursor-pointer font-weight-bold mx-2" v-bind:class="orderByIndex === 1 ? 'text-dark': 'text-success'" @click="orderByIndex=1">CL thấp</span>-->
        <!--        <div class="vr"></div>-->
        <span class="cursor-pointer font-weight-bold mx-2"
              v-bind:class="orderByIndex === 1 ? 'text-dark': 'text-success'" @click="filterOrder(1)">CF cao</span>
        <div class="vr"></div>
        <span class="cursor-pointer font-weight-bold mx-2"
              v-bind:class="orderByIndex === 2 ? 'text-dark': 'text-success'"
              @click="filterOrder(2)">Top thẻ phạt</span>
        <div class="vr"></div>
        <span class="cursor-pointer font-weight-bold mx-2"
              v-bind:class="orderByIndex === 3 ? 'text-dark': 'text-success'" @click="filterOrder(3)">Nghỉ nhiều</span>
      </b-row>
      <!--paginate-->
      <div class="row mb-1">
        <div class="col-sm text-sm-left text-center pt-2 ml-1">
          <span class="text-muted">Trang {{ pagination.currentPage }} trên {{ totalPages }}</span>
        </div>
        <div class="col-sm pt-1">
          <b-pagination class="justify-content-center justify-content-sm-end m-0 paginator-ghtk"
                        v-model="pagination.currentPage"
                        :total-rows="pagination.total"
                        :per-page="pagination.limit"
                        @input="getList()"
                        size="sm"
          >
          </b-pagination>
        </div>
      </div>
      <!--Dashboard Data-->
      <section class="border">
        <div class="text-size fixed-thead" v-loading="loading">
          <table class="table table-hover m-0 table-bordered">
            <tr>
              <th>
                <div class="text-left font-weight-bold p-1">Bưu cục</div>
              </th>
              <th class="border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="cursor-pointer" @click="sortByField('overall_quantity')">Sản lượng
                    <br>
                    <small class="text-second_custom">(ĐH)</small>
                    <span>
                      <span v-if="filter.orderField !== 'overall_quantity'">
                        <i class="icon ion-md-arrow-dropdown"></i>
                        <i class="icon ion-md-arrow-dropup"></i>
                      </span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center">Chất lượng
                    <!--                    <br>-->
                    <!--                    <span>-->
                    <!--                      <span v-if="filter.orderField !== 'overall_quality'"><i-->
                    <!--                        class="icon ion-md-arrow-dropdown"></i><i-->
                    <!--                        class="icon ion-md-arrow-dropup"></i></span>-->
                    <!--                      <span v-else>-->
                    <!--                        <i class="icon text-ghtk"-->
                    <!--                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>-->
                    <!--                      </span>-->
                    <!--                    </span>-->
                  </span>
                </div>
              </th>
              <th class="border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('salary_expense')">Lương
                    <br>
                    <small class="text-second_custom">(VNĐ/ĐH)</small>
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'salary_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0 border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('refund_expense')">Bồi hoàn
                    <br>
                    <small class="text-second_custom">(VNĐ/ĐH)</small>
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'refund_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0 border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('allocation_expense')">Cấp phát
                    <br>
                    <small class="text-second_custom">(VNĐ/ĐH)</small>
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'allocation_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0 border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('location_expense')">Địa điểm
                    <br>
                    <small class="text-second_custom">(VNĐ/ĐH)</small>
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'location_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0 border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('office_expense')">HCVP
                    <br>
                    <small class="text-second_custom">(VNĐ/ĐH)</small>
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'office_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('total_expense')">Tổng
                    <br>
                    <small class="text-second_custom">(VNĐ/ĐH)</small>
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'total_expense'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0 border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('total_penalty')">Tổng thẻ phạt
                    <br>
                    <span>
                      <span v-if="filter.orderField !== 'total_penalty'"><i
                        class="icon ion-md-arrow-dropdown"></i><i
                        class="icon ion-md-arrow-dropup"></i></span>
                      <span v-else>
                        <i class="icon text-ghtk"
                           :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                      </span>
                    </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0 border-right-0">
                <div class="text-center text-nowrap font-weight-bold p-1">
                  <span class="text-center cursor-pointer" @click="sortByField('working_employee')">Đi làm<span>
                    <br>
                    <span v-if="filter.orderField !== 'working_employee'"><i
                      class="icon ion-md-arrow-dropdown"></i><i
                      class="icon ion-md-arrow-dropup"></i></span>
                    <span v-else>
                      <i class="icon text-ghtk"
                         :class="filter.orderType === 'desc' ? 'ion-md-arrow-dropdown' : 'ion-md-arrow-dropup'"></i>
                    </span>
                  </span>
                  </span>
                </div>
              </th>
              <th class="border-left-0">
                <div class="text-center text-nowrap font-weight-bold p-1"><span>Tuyển/nghỉ</span></div>
              </th>
            </tr>
            <template v-for="(statistic, index) in list">
              <tr :key="index" class="pay-label">
                <td class="address-custom">
                  <span class="text-dark text-fw-500">{{ statistic.station_name }}</span>
                  <br>
                  <span class="text-second_custom">{{ statistic.station_address }}</span>
                </td>
                <td class="text-center p-4 border-right-0">{{ statistic.overall_quantity | formatNumber }}</td>
                <td class="text-center p-4 border-left-0">{{ statistic.overall_quality }}%</td>
                <td class="text-center p-4 border-right-0">{{ statistic.salary_expense | formatNumber }}</td>
                <td class="text-center p-4 border-right-0  border-left-0">
                  {{ statistic.refund_expense | formatNumber }}
                </td>
                <td class="text-center p-4 border-right-0  border-left-0">
                  {{ statistic.allocation_expense | formatNumber }}
                </td>
                <td class="text-center p-4 border-right-0  border-left-0">
                  {{ statistic.location_expense | formatNumber }}
                </td>
                <td class="text-center p-4 border-right-0  border-left-0">
                  {{ statistic.office_expense | formatNumber }}
                </td>
                <td class="text-center p-4 border-left-0">{{ statistic.total_expense | formatNumber }}</td>
                <td class="text-center p-4 border-right-0 ">{{ statistic.total_penalty | formatNumber }} Thẻ</td>
                <td class="text-center p-4 border-right-0 border-left-0">
                  {{ statistic.working_employee | formatNumber }}
                </td>
                <td class="text-center p-4 border-left-0">
                  {{ statistic.total_recruit | formatNumber }}/{{ statistic.total_layoff | formatNumber }}
                </td>
              </tr>
            </template>
            <tr v-show="!list || list.length === 0">
              <td class="text-center align-middle no-result" colspan="100"><b>Rất tiếc, Không có bản ghi nào !</b></td>
            </tr>
          </table>
        </div>
      </section>
    </div>
  </div>

</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import stationDashService from 'domain/services/station-dash-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment'

Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
})
export default {
  name: 'station-operation-dash',
  props: {
    smallScreen: {
      default: false,
      type: Boolean
    },
    blankMode: {
      default: null
    },
    scrollMode: {
      default: false,
      type: Boolean
    }
  },
  components: {SingleSelectStation, SingleSelectProvince, SingleSelectRegion},
  mounted () {
    this.initialData()
    this.filterTime(0)
  },
  data () {
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        limit: 5,
        total: 0
      },
      list: [],
      filter: {
        station: null,
        start: null,
        end: null,
        region: null,
        provinceId: null,
        orderField: null,
        orderType: null,
        type: 'POST'
      },
      reset: false,
      lastUpdateTime: '',
      isFocus: [
        {id: 1, orderBy: 'overall_quantity', orderType: 'asc'},
        {id: 2, orderBy: 'total_expense', orderType: 'desc'},
        {id: 3, orderBy: 'total_penalty', orderType: 'desc'},
        {id: 4, orderBy: 'total_layoff', orderType: 'desc'}
      ],
      btnFocus: null,
      orderByIndex: null,
      btnFocusIndex: 0
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.pagination.total / this.pagination.limit)
    }
  },
  methods: {
    async getList () {
      try {
        this.loading = true
        const {data} = await stationDashService.getAllStationStatistic({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success === false) {
          this.list = []
          return commonHelper.showMessage(data.message, 'warning')
        }
        commonHelper.showMessage(data.message, 'success')
        this.list = data.data
        this.pagination.total = data.count ? data.count : 0
        this.lastUpdateTime = data.lastUpdateTime
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.getList()
    },
    async search () {
      this.resetPagination()
      this.getList()
    },
    async clearFilter () {
      this.filter = {
        station: null,
        start: null,
        end: null,
        region: null,
        provinceId: null,
        orderField: null,
        orderType: null,
        type: 'POST'
      }
      this.resetFocusText()
      this.orderByIndex = null
      this.reset = !this.reset
      await this.resetPagination()
      this.filterTime(0)
    },
    resetFocusText () {
      this.isFocus = [
        {id: 1, orderBy: 'overall_quantity', orderType: 'asc'},
        // {id: 2, orderBy: 'overall_quality', orderType: 'asc'},
        {id: 2, orderBy: 'total_expense', orderType: 'desc'},
        {id: 3, orderBy: 'total_penalty', orderType: 'desc'},
        {id: 4, orderBy: 'total_layoff', orderType: 'desc'}
      ]
    },

    resetPagination () {
      this.pagination = {
        currentPage: 1,
        limit: 5,
        total: 0
      }
    },

    sortByField (field) {
      this.orderByIndex = null
      if (this.filter.orderField === field) {
        if (!this.filter.orderType) this.filter.orderType = 'asc'
        else if (this.filter.orderType === 'asc') this.filter.orderType = 'desc'
        else if (this.filter.orderType === 'desc') {
          this.filter.orderField = null
          this.filter.orderType = null
        }
      } else {
        this.filter.orderField = field
        this.filter.orderType = 'asc'
      }
      this.search()
    },

    initialData () {
      let currentDate = moment().format('YYYY-MM-DD')
      this.btnFocus = [
        {id: 1, start: moment().startOf('isoWeek').format('YYYY-MM-DD'), end: currentDate},
        {id: 2, start: moment().startOf('month').format('YYYY-MM-DD'), end: currentDate},
        {id: 3, start: moment().startOf('month').subtract(2, 'month').format('YYYY-MM-DD'), end: currentDate}
      ]
    },

    filterOrder (orderByIdx) {
      this.orderByIndex = orderByIdx
      this.filter.orderType = this.isFocus[orderByIdx].orderType
      this.filter.orderField = this.isFocus[orderByIdx].orderBy
      this.search()
    },

    filterTime (btnFocusIdx) {
      this.btnFocusIndex = btnFocusIdx
      this.filter.start = this.btnFocus[btnFocusIdx].start
      this.filter.end = this.btnFocus[btnFocusIdx].end
      this.search()
    }

  }
}
</script>

<style scoped lang="scss">
.scroll-mode {
  max-height: 70vh;
  overflow: auto;

  &-small {
    max-height: 65vh;
    overflow: auto;
  }
}
.vr {
  border-left: 2px solid #82c8aa;
  height: 20px;
}
.text-second_custom{
  font-weight: 400 !important;
  color: #979797 !important;
}
.address-custom{
  max-width: 240px !important;
}
.text-fw-500{
  font-weight: 500;
}
.btn-ghtk{
  background: #069255 !important;
}
</style>
