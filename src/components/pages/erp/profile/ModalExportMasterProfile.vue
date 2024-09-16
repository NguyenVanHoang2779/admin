<template>
    <b-modal modal-class="modal-lg-custom" ref="modal-export" title="XUẤT DỮ LIỆU MASTER PROFILE" hide-footer static>
        <div class="text-center">
            <b-button variant="primary" @click="emitExport(2)" style="max-width: 500px">
                <i data-v-0a18351a="" class="ion ion-md-print"></i> XUẤT THEO TEMPLATE
            </b-button>
            <b-button variant="primary" @click="emitExportImage" style="max-width: 500px">
                <i data-v-0a18351a="" class="ion ion-md-document"></i> XUẤT ẢNH HỒ SƠ
            </b-button>
            <b-button variant="primary" v-b-toggle.collapse-export-option style="max-width: 500px">
                <i data-v-0a18351a="" class="ion ion-md-print"></i> CHỌN THÔNG TIN CẦN XUẤT
            </b-button>
            <b-button variant="primary" @click="emitExportDuty" style="max-width: 500px">
                <i data-v-0a18351a="" class="ion ion-md-print"></i> XUẤT DỮ LIỆU CẤP BẬC
            </b-button>
            <b-button variant="primary" @click="emitExportContract" style="max-width: 500px">
              <i data-v-0a18351a="" class="ion ion-md-print"></i> XUẤT THÔNG TIN HỢP ĐỒNG
            </b-button>
        </div>
        <b-collapse id="collapse-export-option">
            <b-row>
                <b-col md="8"><b>Chọn trường thông tin cần xuất</b></b-col>
                <b-col md="4" class="text-right">
                    <b-btn v-if="!seletedAll" @click="selectAll" size="sm" variant="primary">CHỌN TẤT CẢ</b-btn>
                    <b-btn v-else @click="deselectAll" size="sm" variant="outline-primary">BỎ CHỌN TẤT CẢ</b-btn>
                </b-col>
            </b-row>
            <b-form-group>
                <b-form-checkbox-group
                    class="option-wraper"
                    v-model="selectedTittles"
                    name="flavour-1"
                >
                    <b-form-checkbox class="customized-option" v-for="(title, index) in titles" :key="index" :value="title">{{title}}</b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>
            <div class="text-center">
                <b-button variant="primary" @click="emitExport(1)" style="max-width: 500px">
                    <i data-v-0a18351a="" class="ion ion-md-print"></i> XUẤT DỮ LIỆU
                </b-button>
            </div>
        </b-collapse>
    </b-modal>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<style lang="scss" scoped>
    .customized-option{
      width: 100px;
      margin-bottom: 10px;
    }
    .option-wraper {
      margin-top: 20px;
      height: 600px;
      overflow-y: scroll;
    }
</style>

<script>
export default {
  name: 'modal-export-master-profile',

  components: {
  },

  props: [
    'titles',
    'show'
  ],

  data: () => ({
    titleOptions: [],
    selectedTittles: [],
    seletedAll: false
  }),

  created () {
    this.setTitleOptions()
  },

  watch: {
    titles: function (newVal, oldVal) {
      this.setTitleOptions()
      this.selectAll()
      this.seletedAll = true
    },

    show: function (newVal, oldVal) {
      this.$refs['modal-export'].show()
    }

  },

  methods: {

    selectAll () {
      this.selectedTittles = this.titleOptions.map(option => option.value)
      this.seletedAll = true
    },

    deselectAll () {
      this.selectedTittles = []
      this.seletedAll = false
    },

    setTitleOptions () {
      this.titleOptions = []
      this.titles.forEach(element => {
        this.titleOptions.push({text: element, value: element})
      })
    },

    emitExport (exportFast) {
      // Re-order
      let expTitles = []
      this.titleOptions.forEach(item => {
        if (this.selectedTittles.includes(item.value)) expTitles.push(item.value)
      })
      if (exportFast === 2) {
        expTitles = []
      }
      this.$emit('handleExport', expTitles)
      this.$refs['modal-export'].hide()
    },

    emitExportImage () {
      this.$emit('handleExportImage')
      this.$refs['modal-export'].hide()
    },

    emitExportDuty () {
      this.$emit('handleExportDuty')
      this.$refs['modal-export'].hide()
    },

    emitExportContract () {
      this.$emit('handleExportContract')
      this.$refs['modal-export'].hide()
    }
  }
}
</script>
