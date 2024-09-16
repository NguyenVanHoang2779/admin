<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Cập nhật vùng tính lương cho đơn hàng
    </h4>
    <b-card header-tag="h6" class="mb-4">
      <form>
        <b-form-row>
          <b-form-group label="Nhập mã đơn hàng" class="col-md-4">
              <b-form-textarea id="textarea1"
                               v-model="packages"
                               placeholder="Các mã đơn hàng cách nhau bởi dấu phẩy"
                               :rows="5"
                               :max-rows="6">
              </b-form-textarea>
          </b-form-group>
          <b-form-group label="Vùng lấy" class="col-md-2">
            <multiselect v-model="pickType" label="name" track-by="code" :options="options" :taggable="true" placeholder="Chọn vùng"></multiselect>
          </b-form-group>
          <b-form-group label="Vùng giao" class="col-md-2">
            <multiselect v-model="deliverType" label="name" track-by="code" :options="options" :taggable="true" placeholder="Chọn vùng"></multiselect>
          </b-form-group>
          <b-form-group label="Vùng trả" class="col-md-2">
            <multiselect v-model="returnType" label="name" track-by="code" :options="options" :taggable="true" placeholder="Chọn vùng"></multiselect>
          </b-form-group>
          <b-form-group class="col-md-2">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <b-btn variant="primary" @click="updateArea">Update</b-btn>
            <b-btn variant="outline-danger" @click="deleteAllPackagesData">Delete All</b-btn>
          </b-form-group>
        </b-form-row>
      </form>
      <notifications group="notifications-default" />
    </b-card>
    <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    <div class="table-responsive">
      <b-table :fields="fields" :items="jsonData" :striped="true" :bordered="true" :small="true">
      </b-table>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import salaryService from 'domain/services/salary-service'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

const optionsArea = [
  { name: 'Không đổi', code: '0' },
  { name: '1', code: '1' },
  { name: '2', code: '2' },
  { name: '3', code: '3' },
  { name: '4', code: '4' },
  { name: '5', code: '5' },
  { name: '6', code: '6' },
  { name: '7', code: '7' },
  { name: '8', code: '8' }
]

export default {
  components: {
    Multiselect,
    LoadingMiniBottom,
    salaryService
  },
  data: () => ({
    appLoading: false,
    fields: [],
    jsonData: [],
    packages: '',
    countPkgs: 0,
    value: [
      { name: 'Javascript', code: 'js' }
    ],
    options: optionsArea,
    pickType: optionsArea[0],
    deliverType: optionsArea[0],
    returnType: optionsArea[0]
  }),
  methods: {
    updateArea () {
      this.appLoading = true
      this.jsonData = []
      if (this.packages === '') return
      let pkgsArr = this.packages.split(',')
      this.searchPackages(pkgsArr, pkgsArr.length)
    },
    searchPackages (pkgsArr, countAlias) {
      let packages = []
      if (pkgsArr.length >= 1000) {
        packages = pkgsArr.splice(0, 1000)
      } else {
        packages = pkgsArr
      }
      this.countPkgs += packages.length
      salaryService.updateSalaryArea(
        {
          pick: this.pickType,
          deliver: this.deliverType,
          return: this.returnType,
          packages: packages
        }
      ).then((response) => {
        this.appLoading = false
        if (response.data.success) {
          this.jsonData = this.jsonData.concat(JSON.parse(response.data.data))
          if (this.fields === []) {
            this.fields = ['STT', 'Package Alias', 'Pick Area', 'Deliver Area', 'Return Area', 'Result', 'Action']
          }
        }
        this.$notify({
          group: 'notifications-default',
          type: response.data.success ? '' : 'bg-danger text-white',
          title: response.data.success ? `Thành công (${this.countPkgs}/${countAlias})` : `Lỗi (${this.countPkgs}/${countAlias})`,
          text: response.data.message
        })
      }).catch((error) => {
        this.appLoading = false
        if (error) {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra. Vui lòng kiểm tra lại'
          })
        }
      }).then(() => {
        if (packages.length < 1000) return
        this.searchPackages(pkgsArr, countAlias)
      })
    },
    deleteAllPackagesData () {
      this.appLoading = true
      this.jsonData = []
      salaryService.deleteAllPackagesData(
        {
          packages: this.packages
        }
      ).then((response) => {
        this.appLoading = false
        this.$notify({
          group: 'notifications-default',
          type: response.data.success ? '' : 'bg-danger text-white',
          title: response.data.success ? 'Thành công' : 'Lỗi',
          text: response.data.message
        })
      }).catch((error) => {
        this.appLoading = false
        if (error) {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra. Vui lòng kiểm tra lại'
          })
        }
      })
    }
  }
}
</script>
