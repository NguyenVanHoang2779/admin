<template>
  <b-form-row class="mb-1 config-cod-support-row">
    <b-col cols="5">
      <multi-select-name-of-cod
        @onChange="selectCodSupport"
        :multiple="false"
        :selected="selectedCod"
      ></multi-select-name-of-cod>
    </b-col>

    <b-col col>
      <multiselect
        class="multiselect"
        v-model="configSupport.day_of_week"
        placeholder="Chọn ngày"
        track-by="value"
        label="text"
        :options="DayOfWeekAvailable"
        :multiple="true"
        select-label="✓"
        deselect-label="✗"
        selected-label="✓"
      />
    </b-col>
<!--    <b-col sm="2" class="mt-2">Capacity: {{configSupport.capacity}}</b-col>-->
    <b-col cols="1" class="mt-sm-1">
      <b-button
        variant="outline-danger"
        size="sm"
        @click.prevent="deleteRow(RowIndex)"
      >
        Xóa
      </b-button>
    </b-col>
  </b-form-row>
</template>

<script>
import MultiSelectNameOfCod from '../../elements/common/MultiSelectNameOfCod'
import Multiselect from 'vue-multiselect'
import * as _ from 'lodash'
import ManageLineService from '../../../domain/services/manage-line-service'

export default {
  name: 'CodSupportRow',
  components: {
    MultiSelectNameOfCod,
    Multiselect
  },
  props: {
    RowIndex: {
      type: Number,
      required: true
    },
    CodSupportData: {
      type: Object,
      required: true
    },
    DayOfWeekAvailable: {
      type: Array,
      required: true
    },
    WorkShift: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    selectCodSupport (option) {
      if (!_.isEmpty(option)) {
        this.configSupport.cod_support.id = option.id
        this.configSupport.cod_support.fullname = option.fullname
        this.getCodCapacityByCodId(this.configSupport.cod_support.id)
        this.$emit('changeCodSupport', this.configSupport.cod_support, this.RowIndex)
      } else {
        this.configSupport.cod_support = {}
        this.$emit('changeCodSupport', this.configSupport.cod_support, this.RowIndex)
      }
    },

    deleteRow () {
      this.$emit('deleteRow', this.RowIndex)
    },

    async getCodCapacityByCodId (codId) {
      let params = {
        cod_id: codId,
        work_shift: this.WorkShift
      }

      try {
        const capacity = await ManageLineService.getCodCapacityByCodId(params)
        this.configSupport.capacity = Number(capacity)
      } catch (reason) {
        this.$root.$emit('onError', reason instanceof Error ? reason.message : reason.toString())
      } finally {
        this.isLoadingPickingTime = false
      }
    }
  },
  computed: {
    configSupport: {
      get () {
        return this.CodSupportData
      },
      set (value) {
        this.$emit('input', value)
      }
    },

    selectedCod () {
      return _.isEmpty(this.configSupport.cod_support) ? [] : [
        {
          id: this.configSupport.cod_support.id,
          fullname: this.configSupport.cod_support.fullname
        }
      ]
    }
  }
}
</script>

<style scoped>
  .day-of-week-select {
    max-width: 150px !important;
    width: 80% !important;
  }

  .config-cod-support-row {
    max-width: 100% !important;
    width: 100% !important;
  }
</style>
