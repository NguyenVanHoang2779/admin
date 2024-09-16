<template>
  <div>
    <div class="penalty-log-tab">
    <perfect-scrollbar :options="{wheelSpeed: 0.2,  wheelPropagation: false }" style="height: 200px">
      <br>
      <div v-if="loading.search">
        <div class="sk-three-bounce sk-primary">
          <div class="sk-child sk-bounce1"></div>
          <div class="sk-child sk-bounce2"></div>
          <div class="sk-child sk-bounce3"></div>
        </div>
      </div>
      <div v-else>
        <div v-for="log in this.dataLogs">
         <div class="mb-2 ml-2">
           <div>
             <span class="font-weight-bold">{{log.created}}:</span>
             <span style="color: #385898" class="font-weight-bold">{{log.created_by}} </span>
             <span>{{log.content}} </span>
           </div>
           <div class="font-italic" v-if="log.reason">&emsp;({{log.reason}})</div>
         </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import CustomButton from 'components/elements/common/CustomButton'

export default {
  name: 'penalty-log-tab',
  metaInfo: {
    title: 'Phạt thẻ'
  },

  components: {
    kpiPenaltyService,
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
    SingleSelectStation,
    CustomButton
  },
  props: {
    penalty_id: null
  },
  data: () => ({
    loading: {
      search: false
    },
    dataLogs: []
  }),

  computed: {
  },

  methods: {
    // Lấy thông tin phạt
    getDataPenaltyLogs () {
      this.loading.search = true
      this.dataLogs = []
      kpiPenaltyService.apiGetDataPenaltyLogs({penalty_id: this.penalty_id}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.dataLogs = response.data.data
          } else {
            this.dataLogs = []
            return 0
          }
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi khi lấy dữ liệu phạt', 'error')
      }).then(() => {
        this.loading.search = false
      })
    }
  },

  created () {
    this.getDataPenaltyLogs()
  }
}
</script>
