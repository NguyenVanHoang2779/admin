<template>
  <div>
    <div v-if="loading === false">
<!--      <label class="switcher switcher-danger mb-3">-->
<!--        <input v-model="not_accept" type="checkbox" class="switcher-input">-->
<!--        <span class="switcher-indicator">-->
<!--              <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>-->
<!--              <span class="switcher-no"><span class="ion ion-md-close"></span></span>-->
<!--            </span>-->
<!--        <span class="switcher-label">Không được nhận thù lao loại này</span>-->
<!--      </label>-->
      <div v-if="not_accept === false">
        <table v-if="list_objects.length !== 0" class="table table-sm text-center">
          <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Object ID</th>
            <th>Chi tiết</th>
            <th>Người tạo</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="object in list_objects">
            <td>
              <b-form-radio @click.native="resetRadio(selected)" v-model="selected" name="some-radios"
                            :value="object.id"></b-form-radio>
            </td>
            <td>{{ object.id }}</td>
            <td>
              <!--Thù lao đơn điểm theo vùng-->
              <div v-if="type_id === 1">
                <table class="table table-bordered table-sm text-center">
                  <thead>
                  <tr>
                    <th>Vùng</th>
                    <th v-for="(cost, index) in object.detail.data">V{{ index }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th scope="row">Giá 1 đơn/điểm (VNĐ)</th>
                    <td v-for="cost in object.detail.data">
                      <strong v-numeral> {{ cost }}</strong>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <!--Thù lao vượt ngưỡng theo vùng-->
              <div v-if="type_id === 2">
                <table class="table table-bordered table-sm text-center">
                  <thead>
                  <tr>
                    <th>Vùng</th>
                    <th v-for="(cost, index) in object.detail.data">V{{ index }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th scope="row">Tổng đơn/điểm</th>
                    <td v-for="cost in object.detail.data">
                      <strong v-numeral> {{ cost }}</strong>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <p style="text-align: left">- Đơn giá: <strong v-numeral> {{ object.detail.cost }}</strong> VNĐ trên 1
                  đơn/điểm</p>
                <p style="text-align: left" v-if="typeof object.detail.seniority != 'undefined'">- Thâm niên: <strong
                  v-numeral> {{ object.detail.seniority }}</strong> Ngày</p>
              </div>

              <!--Thù lao vượt ngưỡng trên tổng đơn điểm-->
              <div v-if="type_id === 3">
                <table class="table table-bordered table-sm text-center">
                  <thead>
                  <tr>
                    <th>Tổng đơn/điểm</th>
                    <th v-for="(cost, index) in object.detail.data">{{ index }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th scope="row">Thù lao (VNĐ)</th>
                    <td v-for="cost in object.detail.data">
                      <strong v-numeral> {{ cost }}</strong>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <p style="text-align: left" v-if="typeof object.detail.seniority != 'undefined'">- Thâm niên: <strong
                  v-numeral> {{ object.detail.seniority }}</strong> Ngày</p>
              </div>

              <!--Thù lao theo ngày công -->
              <div v-if="type_id === 4">
                <p style="text-align: left">- Thù lao: <strong v-numeral> {{ object.detail.cost }}</strong> VNĐ/ngày</p>
                <p style="text-align: left" v-if="typeof object.detail.seniority != 'undefined'">- Thâm niên: <strong
                  v-numeral> {{ object.detail.seniority }}</strong> Ngày</p>
              </div>
            </td>
            <td>{{ object.created_by }}</td>
            <td>{{ object.created }}</td>
            <td>
              <b-btn variant="outline-danger borderless icon-btn" @click="deleteItem(object.id)"><i
                class="ion ion-md-close"></i></b-btn>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else>
          Không tìm thấy thông tin gói thù laoapiGetSalaryInRangeTime
        </div>
      </div>
    </div>
    <div v-else>
      <div class="sk-chasing-dots sk-primary">
        <div class="sk-child sk-dot1"></div>
        <div class="sk-child sk-dot2"></div>
      </div>
    </div>
  </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<script>
import vueNumeric from 'vue-numeric'
import kpiCodService from 'domain/services/kpi-cod-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'option-config-type',
  props: {
    type_id: {
      required: false
    }
  },

  components: {
    vueNumeric,
    kpiCodService
  },
  watch: {
    selected () {
      this.$emit('model', this.selected)
    },
    not_accept (newVal) {
    }
  },
  data: () => (
    {
      list_objects: [],
      selected: '',
      pre_selected: '',
      loading: false,
      not_accept: false
    }
  ),
  computed: {
  },
  methods: {
    getListObjects () {
      this.loading = true
      kpiCodService.apiGetListObjects({type_id: this.type_id}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.loading = false
          if (response.data.success) {
            this.list_objects = response.data.data
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Error when get list object type_id=1', 'error')
      }).then(() => {
      })
    },
    resetRadio (val) {
      if (val === this.pre_selected) {
        this.selected = null
      }
      this.pre_selected = this.selected
    },
    deleteItem (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let parmas = {
        id: id
      }
      kpiCodService.deleteObject(parmas).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.getListObjects()
            commonHelper.showMessage('Xóa file thành công', 'success')
          } else {
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh', 'error')
      })
    }
  },
  created () {
    this.getListObjects()
  }
}
</script>

<style scoped lang="scss">
</style>
