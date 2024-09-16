<template>
  <div>
    <b-row>
      <b-col md="2" class="ml-2 mb-3">
        <p>Ca hẹn giao:</p>
      </b-col>
      <b-col md="2">
        <b-form-select v-model="type" :options="listType" :required="true"></b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="2" class="ml-2 mb-3">
        <p>Thời gian nhập :</p>
      </b-col>
      <b-col md="2">
        <flat-pickr v-model="startImport" :config="timeConfig" />
      </b-col>
      đến
      <b-col md="2">
        <flat-pickr v-model="finishImport" :config="timeConfig" />
      </b-col>
    </b-row>
    <b-row>
      <b-col md="2" class="ml-2 mb-3">
        <p>Thời gian xuất :</p>
      </b-col>
      <b-col md="2">
        <flat-pickr v-model="timeExport" :config="timeConfig" />
      </b-col>
      <b-col md="2" class="ml-4">
        <b-form-select v-model="configType" :options="listConfigType" :required="true"></b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button size="sm" class="ml-2" variant="outline-danger" @click="deleteConfigDetail">
          Xóa phiên   <i class="fa fa-eraser"/>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  name: 'CreateWsConfigDetail',
  components: {
    flatPickr
  },
  mounted () {
    this.type = this.dataConfigDetail.ws_type_id
    this.configType = this.dataConfigDetail.ws_config_type
    this.startImport = this.dataConfigDetail.ws_start_import
    this.finishImport = this.dataConfigDetail.ws_finish_import
    this.timeExport = this.dataConfigDetail.ws_export
  },
  props: ['index', 'dataConfigDetail'],
  watch: {
    type () {
      this.onChangeConfigDetail()
    },
    configType () {
      this.onChangeConfigDetail()
    },
    startImport () {
      this.onChangeConfigDetail()
    },
    finishImport () {
      this.onChangeConfigDetail()
    },
    timeExport () {
      this.onChangeConfigDetail()
    },
    dataConfigDetail (newValue, oldValue) {
      this.type = newValue.ws_type_id
      this.configType = newValue.ws_config_type
      this.startImport = newValue.ws_start_import
      this.finishImport = newValue.ws_finish_import
      this.timeExport = newValue.ws_export
    }
  },
  data: () => {
    return {
      listType: [
        {
          value: 0,
          text: 'Sáng'
        },
        {
          value: 1,
          text: 'Gãy Sáng'
        },
        {
          value: 2,
          text: 'Chiều'
        },
        {
          value: 3,
          text: 'Gãy Chiều'
        },
        {
          value: 4,
          text: 'Tối'
        }
      ],
      listConfigType: [
        {
          value: 0,
          text: 'Trong ngày'
        },
        {
          value: 1,
          text: 'Hôm sau'
        }
      ],
      type: 0,
      configType: 1,
      startImport: '00:00:00',
      finishImport: '01:00:00',
      timeExport: '12:00:00',
      timeConfig: {
        enableTime: true,
        noCalendar: true,
        altInput: true,
        time_24hr: true
      }
    }
  },
  methods: {
    deleteConfigDetail () {
      this.$emit('deleteConfigDetail', this.index)
    },
    onChangeConfigDetail () {
      let dataSend = {
        index: this.index,
        data: {
          ws_config_type: this.configType,
          ws_type_id: this.type,
          ws_start_import: this.startImport,
          ws_finish_import: this.finishImport,
          ws_export: this.timeExport
        }
      }
      this.$emit('onChangeConfigDetail', dataSend)
    }
  }
}
</script>

<style scoped>
</style>
