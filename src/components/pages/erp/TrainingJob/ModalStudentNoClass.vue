<template>
    <div class="modal-student">
        <b-modal :header-class="'text-center justify-content-center d-flex'" :id='id' modal-class="modal-xl" title="Học viên chưa xếp lớp" hide-footer static @show="reset">
          <!-- filter -->
          <div class="modal-student-filter">
            <div class="row box-input-filter filter pb-2 justify-content-between input-border my-2">
              <div class="input-filter">
                <single-select-user
                  class="z-max multiselect-ghtk multiselect-no-horizontal"
                  @onChange="selectedUser"
                  placeholder="Nhân viên">
                </single-select-user>
              </div>
              <div class="input-filter">
                <multi-select-station
                  :custom-class="'z-max multiselect-ghtk multiselect-no-horizontal'"
                  :station-ids="filter.station"
                  :auto-close="true"
                  :hide-select="true"
                  @handleStationSelected="handleStationSelected"
                ></multi-select-station>
              </div>
              <div class="input-filter">
                <multi-select-position
                  :position-ids="filter.position_id"
                  @handlePositionSelected="handlePositionSelected"
                  :auto-close="false"
                  :custom-class="'z-max multiselect-ghtk multiselect-no-horizontal'"
                  :hide-selected="true">
                </multi-select-position>
              </div>
              <div class="input-filter">
                <multi-select-syllabus
                  :custom-class="'z-max multiselect multiselect-ghtk multiselect-no-horizontal'"
                  :syllabus-ids="filter.syllabus_ids"
                  :activve-only="true"
                  :auto-close="true"
                  :placeholder="'Lớp cần xếp'"
                  @handleSyllabusSelected="handleSyllabusSelected">
                </multi-select-syllabus>
              </div>
              <div class="input-filter">
                <button class="btn btn-ghtk rounded w-100" style="font-weight: bold;" @click="search()">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
          <!-- Content -->
          <div class="modal-student-content">
            <table class="table table-hover border-0 bg-white w-100 table-responsive-sm">
              <thead>
              <tr class="header-row">
                <th class="text-center" style="width: 25%"><b>Học viên</b></th>
                <th class="text-center" style="width: 15%">Kho</th>
                <th class="text-center" style="width: 15%">Vị trí</th>
                <th class="text-center" style="width: 25%">Lớp cần xếp</th>
                <th class="text-center">Thao tác</th>
              </tr>
              </thead>
              <tbody class="position-relative" v-loading="loading">
              <tr v-for="(student, indexStudent) in listStudent" :key="indexStudent">
                <td class="text-center font-weight-bold">
                  {{ student.fullname + ' | ' + student.username}}
                </td>
                <td class="text-center">{{ student.station_name }}</td>
                <td class="text-center">{{ student.position_name }}</td>
                <td class="text-center"> {{  student.class_name }}</td>
                <td class="text-center btn-action">
                  <multiselect
                    v-model="student.class_id"
                    label="code"
                    class="multiselect-ghtk multiselect-no-horizontal"
                    :style="{ 'z-index': (listStudent.length-indexStudent) }"
                    track-by="id"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel=""
                    :options="student.class_list"
                    :searchable="false"
                    :multiple="false"
                    :close-on-select="true"
                    :hide-selected="false"
                    :allow-empty="true"
                    :clearOption="true"
                  >
                    <span class="placeholder" slot="placeholder">Chọn lớp</span>
                  </multiselect>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- bottom -->
          <div class="modal-student-bottom d-flex justify-content-between align-items-center">
            <div class="page-modal row ml-1 align-items-center">
              <!-- paging  -->
              <div class="z-0 d-inline-block">
                <b-pagination
                  class="paginator-ghtk mb-0"
                  size="sm"
                  align="left"
                  v-model="page.current"
                  :total-rows="+page.total"
                  :per-page="+page.per_page"
                  @input="listStudents()"
                >
                </b-pagination>
              </div>
            </div>
            <button class="btn btn-ghtk rounded" style="height: 4vh; width: 20%; font-weight: bold; padding: 0 0.25rem;"
                    @click="confirmChooseClass">
              Xác nhận
            </button>
          </div>
        </b-modal>
    </div>
</template>

<style lang="scss" scoped>
.modal-student {
  .box-input-filter {
    display: flex;
    justify-content: space-around;
    .input-filter {
      width: 20%;
      padding: 0 0.25rem;
      .z-max {
        z-index: 100;
      }
    }
  }

  &-content {
    .header-row {
      th {
        border: 0;
      }
    }
  }

  .btn-action-save {
    .btn__save {
      padding: 4px 44px;
      border-radius: 8px;
    }
  }
}
</style>

<script>
// service
import trainingService from 'domain/services/training-service'

// components
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectClass from 'components/elements/common/MultiSelectClass'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

export default {
  name: 'modal-student',

  components: {
    MultiSelectStation, MultiSelectPosition, SingleSelectUser, MultiSelectClass, MultiSelectSyllabus, Multiselect
  },

  props: {
    id: {
      default: 'modal-student-no-class'
    }
  },

  data: _ => ({
    filter: {
      station: null,
      username: null,
      position_id: null,
      class_id: null,
      syllabus_ids: null
    },
    loading: false,
    page: {
      current: 1,
      total: 0,
      per_page: 5
    },
    listStudent: []
  }),

  created () {
    this.listStudents()
  },

  computed: {
  },

  watch: {
  },

  methods: {
    handleSyllabusSelected: function (option) {
      this.filter.syllabus_ids = option ? option.map((item) => item.id).toString() : ''
    },
    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },
    selectedUser (option) {
      this.filter.username = option
    },
    handlePositionSelected (ops) {
      this.filter.position_id = ops ? ops.map(item => item.id).toString() : ''
    },
    search () {
      this.page.current = 1
      this.page.per_page = 5
      this.listStudents()
    },
    reset () {
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = null
      })
      this.page = {
        current: 1,
        total: 0,
        per_page: 5
      }
      this.listStudents()
    },
    listStudents () {
      this.$startLoading()
      let data = {...this.filter}
      data.limit = this.page.per_page
      data.page = this.page.current
      this.loading = true
      trainingService.getListStudentNoEnoughClass(data)
        .then(res => {
          if (res.data.success) {
            this.listStudent = res.data.data.data
            this.page.total = res.data.data.total
          } else {
            helper.showMessage(res.data.message || 'Lấy danh sách học viên chưa xếp lớp không thành công!')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
          this.$stopLoading()
        })
    },
    async confirmChooseClass () {
      try {
        this.loading = true
        let dataSend = []
        this.listStudent.map((student) => {
          if (!helper.isEmpty(student.class_id)) {
            dataSend.push({
              user_id: student.user_id,
              class_id: student.class_id.id,
              tp_id: student.tp_id
            })
          }
        })
        if (helper.isEmpty(dataSend)) return helper.showMessage('Vui lòng chọn lớp cho ít nhất một học viên trước khi nhấn xác nhận!', 'warning')
        const data = await trainingService.confirmChooseClass({...dataSend})
        if (data.data.success) {
          helper.showMessage(data.data.message, 'success')
          this.$bvModal.hide(this.id)
          this.$emit('resetCount')
        } else {
          helper.showMessage(data.data.message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
