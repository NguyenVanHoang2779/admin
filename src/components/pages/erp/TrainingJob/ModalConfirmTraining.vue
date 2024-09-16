<template>
  <b-modal :class="'modal-custom-500'" header-class="text-header header-modal-custom justify-content-center header-modal-training"
           id='modal-confirm-training' centered static @hidden="hideModal" hide-footer @shown="onShown">
    <template slot="modal-header">
      <h4 class="w-100 m-0 text-center">Chọn chương trình</h4>
    </template>
    <div>
      <div class="list-training">
        <div class="filter-training d-flex justify-content-center my-3">
          <div class="autocomplete w-50" @focusout="isOpen = false">
            <SelectSuggest
              v-model="searchTp" :options="options" @find="findTp" :asyncLoading="asyncLoading" :message="message" :multiple="true" placeholder="Chọn chương trình" @input="getSyllabusesCreateClass"
            ></SelectSuggest>
          </div>
          <MultiSelectProvince
            class="ml-2 select-address"
            :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
            placeholder="Địa điểm"
            :auto-close="true"
            :reset="reset"
            v-model="syllabusFilter.region"
            @handleProvinceSelected="handleProvinceSelected(...arguments)"
          />
        </div>
        <div class="box-list-training small-scrollbar" v-loading="loading">
          <div v-if="listTraining.length < 1" class="p-2 text-center"> Không có dữ liệu chương trình học! </div>
          <div class="data-training d-flex align-items-center px-5 mb-2" v-for="(value, key) in listSyllabusFilter" :key="key">
            <div class="inp-check-box">
              <input type="radio" v-model="trainingId" :value="value.tpId" />
            </div>
            <div class="info-training ml-3 text-training">
              <b class="text-training">{{ value.name  }} | {{ value.countOrderNumber }} Buổi</b>
              <div class="text-training">{{ value.region }}</div>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center mt-3">
          <span class="text-center">{{`Trang ${filter.page} trên ` + Math.ceil(page.total/filter.perPage)}}</span>
          <b-pagination
            class="ml-2 paginator-ghtk my-0"
            size="sm"
            v-model="filter.page"
            :total-rows="page.total"
            :per-page="filter.perPage"
            @input="handlePaginate"
          ></b-pagination>
        </div>

        <hr class="my-2">
      </div>
      <div class="btn-confirm d-flex justify-content-center">
        <button class="btn btn-ghtk btn__confirm" @click="createClass" :disabled="trainingId ? false : true"> Xác nhận </button>
      </div>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
.btn-search {
  max-height: 37px;
}
.modal-body {
  padding: 10px !important;
}
.select-address, .select-class {
  width: 178px;
}
.modal-header-custom .close {
  opacity: 0.8;
  color: white;
  font-size: 22px;
  font-weight: 400;
  position: absolute;
  top: 50%;
  right: 10px;
  margin: 0;
  padding: 0;
  line-height: 1.47;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}

.btn-confirm {
  padding-top: 8px;
}

.btn__confirm {
  border-radius: 8px;
  font-weight: 500;
  font-size: 18px;
  padding: 6px 25px;
}

.text-training {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.header-modal-custom h5 {
  font-size: 18px !important;
}

/*css input */
#modal-confirm-training {
  input[type='radio'] {
  position: relative;
  cursor: pointer;
}
  input[type='radio']:before {
    content: "";
    display: block;
    position: absolute;
    width: 24px;
    height: 24px;
    top: -4px;
    left: -4px;
    border-radius: 50%;
    background-color: #C4C4C4;
  }
  input[type='radio']:checked:after {
    content: "";
    display: block;
    width: 8px;
    height: 15px;
    border: solid #009041;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 0px;
    left: 4px;
  }
}

.box-list-training {
  max-height: 340px;
  overflow-y: scroll;
}

.box-list-training::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
</style>

<script>
// import moment from 'moment'
import trainingService from 'domain/services/training-service'
// helper

import helper from 'infrastructures/helpers/common-helpers'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import SelectSuggest from 'components/elements/common/SelectSuggest.vue'

export default {
  name: 'modal-confirm-training',

  components: {
    SelectSuggest,
    MultiSelectProvince,
    MultiSelectSyllabus
  },

  props: {
    stationId: {
      default: null
    }
  },

  created () {
  },

  mounted () {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed () {
    document.removeEventListener('click', this.handleClickOutside)
  },

  data: _ => ({
    loading: false,
    trainingId: null,
    syllabusFilter: {
      id: [],
      region: []
    },
    reset: false,
    listSyllabusFilter: [],
    listTraining: [],
    page: {
      total: 0
    },
    filter: {
      name: [],
      province_id: [],
      page: 1,
      id: [],
      perPage: 10
    },
    searchTp: [],
    asyncLoading: false,
    message: 'Nhập ít nhất 2 ký tự',
    option: null,
    options: []
  }),

  watch: {
    listTraining (newVal, oldVal) {
      this.listSyllabusFilter = this.listTraining
    }
  },

  methods: {
    findTp (query) {
      this.options = []
      if (query.length < 2) {
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      trainingService.getSyllabusesCreateClass({
        limit: 20,
        name: query
      })
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data.map((value) => ({
              id: value.tpId,
              name: value.code + ' - ' + value.name
            }))
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }).catch(() => {
          this.message = 'Không tìm thấy kết quả'
        }).finally()
      this.asyncLoading = false
    },

    handlePaginate () {
      this.getSyllabusesCreateClass()
    },

    onShown () {
      this.filter = {
        name: [],
        id: [],
        province_id: [],
        page: 1,
        perPage: 10
      }
      this.getSyllabusesCreateClass()
    },

    getSyllabusesCreateClass () {
      this.filter.id = this.searchTp.map((value) => {
        return value.id
      })

      this.loading = true
      trainingService.getSyllabusesCreateClass(this.filter)
        .then((res) => {
          if (res.data.success) {
            this.page.total = res.data.total || 0
            this.listTraining = res.data.data
            helper.showMessage(res.data.message || 'Lấy dữ liệu thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'xảy ra lỗi!', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    },

    createClass () {
      if (!this.trainingId) return
      this.isConfirming = true
      let data = {
        tp_id: this.trainingId,
        station_id: this.stationId
      }

      trainingService.createClass(data)
        .then((res) => {
          if (res.data.success) {
            this.$emit('createClassSuccess', res.data.data)
            this.hideModal()
            helper.showMessage('Tạo lớp học thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Lấy dữ liệu thất bại', 'warning')
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
            helper.showMessage(e.response.data.message, 'warning')
          } else {
            helper.showMessage(e.message || 'Có lỗi xảy ra!', 'error')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    hideModal () {
      this.trainingId = null
      this.syllabusFilter = {
        id: [],
        region: []
      }
      this.reset = !this.reset
      this.$bvModal.hide('modal-confirm-training')
    },

    handleProvinceSelected (ops) {
      if (!ops) this.filter.province_id = []
      else {
        this.filter.province_id = []
        ops.forEach(op => {
          this.filter.province_id.push(+op.id)
        })
      }
      this.getSyllabusesCreateClass()
    },

    handleSyllabusSelected (ops) {
      if (!ops) this.syllabusFilter.id = []
      else {
        this.syllabusFilter.id = []
        ops.forEach(op => {
          this.syllabusFilter.id.push(+op.id)
        })
      }

      this.filterSyllabus()
    },

    filterSyllabus () {
      this.listSyllabusFilter = this.listTraining.filter(syllabus => {
        let checkRegion = false
        if (this.syllabusFilter.region) {
          for (let i = 0; i < this.syllabusFilter.region.length; i++) {
            let region = this.syllabusFilter.region[i]
            if (syllabus.address_id.length > 0) {
              if (syllabus.address_id.includes(region.toString()) || syllabus.address_id.includes(region)) checkRegion = true
            }
          }
        }
        let checkId = this.syllabusFilter.id.includes(parseInt(syllabus.tpId))
        let inContent = !this.syllabusFilter.id || !this.syllabusFilter.id.length || checkId
        let inProvince = !this.syllabusFilter.region || !this.syllabusFilter.region.length || checkRegion
        return inContent && inProvince
      })
    }
  }
}
</script>
