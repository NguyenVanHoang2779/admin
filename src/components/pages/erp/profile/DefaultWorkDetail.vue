<template>
<div>
  <table  class="table table-borderless">
    <thead>
      <tr style="text-align: center">
        <th :style="{ width: widthColumnTable + '%' }">Công việc</th>
        <th>Ngày bắt đầu</th>
        <th>Ngày kết thúc</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    <tr v-for="(item, index) in default_work">
      <td class="align-self-center">
        <default-work-checkbox :job=item.alias_job :index="index" :is-onsite="isOnsite" @update-item-config="updateItemConfig"> </default-work-checkbox>
      </td>
      <td class="text-center">
        <datepicker
          v-model="item.from_date"
          format="dd-MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="false"
          placeholder="Ngày bắt đầu"
          :required="true"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="false"
          @input="inputUpdate(item.from_date, index)"
        />
      </td>
      <td class="text-center" v-if="item.to_date != null">
        <datepicker
          v-model="item.to_date"
          format="dd-MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="true"
          placeholder="Ngày kết thúc"
          :required="true"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="false"
          disabled="disabled"
        />
      </td>
      <td class="text-center" v-else>
        <datepicker
          v-model="item.to_date"
          format="dd-MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="true"
          placeholder="Vô thời hạn"
          :required="false"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="false"
          disabled="disabled"
        />
      </td>
      <td class="text-center d-flex">
          <b-button class="py-2 remove-config" variant="outline-danger" @click="removeConfig(index)" size="sm">X</b-button>
      </td>
    </tr>
    </tbody>
  </table>
  <b-button size="sm" variant="outline-success add-config" @click="addConfig">+ Thêm đầu việc</b-button>
</div>
</template>

<script>
import DefaultWorkCheckbox from 'components/pages/erp/profile/DefaultWorkCheckbox'
import helper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  components: {
    DefaultWorkCheckbox,
    Datepicker
  },
  props: {
    configDefaultWork: {
      type: Array
    },
    isOnsite: {}
  },
  data: () => ({
    default_work: []
  }),
  methods: {
    addConfig () {
      let lastItem = this.default_work[this.default_work.length - 1]
      let fromDate
      if (lastItem !== undefined) {
        lastItem.to_date = moment(lastItem.from_date).format('YYYY-MM-DD')
        fromDate = moment(lastItem.to_date).add(1, 'day').format('YYYY-MM-DD')
      } else {
        fromDate = moment().format('YYYY-MM-DD')
      }

      this.default_work.push({
        from_date: fromDate,
        to_date: null,
        alias_job: []
      })
      this.$emit('update-config', this.default_work)
    },
    removeConfig (even) {
      if (even === (this.default_work.length - 1)) {
        this.default_work.pop()
        if (this.default_work[this.default_work.length - 1] !== undefined) {
          this.default_work[this.default_work.length - 1].to_date = null
        }
      } else {
        this.default_work = this.default_work.filter(function (value, index) {
          return even !== index
        })

        if (even - 1 >= 0) {
          this.default_work[even - 1].to_date = moment(this.default_work[even].from_date).subtract(1, 'days').format('YYYY-MM-DD')
        }
      }
      this.$emit('update-config', this.default_work)
    },
    updateItemConfig (index, value) {
      this.default_work[index].alias_job = value
      this.$emit('update-config', this.default_work)
    },
    validateTimeConfig (data) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i] === undefined) {
          continue
        }
        data[i].from_date = moment(data[i].from_date).format('YYYY-MM-DD')
        data[i].to_date = data[i].to_date !== null ? moment(data[i].to_date).format('YYYY-MM-DD') : null
        if (moment(data[i].to_date).format('YYYY-MM-DD') < moment(data[i].from_date).format('YYYY-MM-DD')) {
          helper.showMessage('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', 'warning')
          return
        }
        if (data[i + 1] !== undefined && moment(data[i].to_date).format('YYYY-MM-DD') >= moment(data[i + 1].from_date).format('YYYY-MM-DD')) {
          helper.showMessage('Thời gian config công việc mặc định không hợp lệ. Thời gian config sau không được đè lên thời gian config trước', 'warning')
          return
        }
      }
    },
    inputUpdate (date, index) {
      let data = this.configDefaultWork
      data[index].from_date = moment(date).format('YYYY-MM-DD')
      data.sort(function (a, b) {
        return new Date(a.from_date) - new Date(b.from_date)
      })

      for (let i = 0; i < data.length; i++) {
        if (i === data.length - 1) {
          data[i].to_date = null
        } else {
          data[i].to_date = moment(data[i + 1].from_date).subtract(1, 'days').format('YYYY-MM-DD')
        }
      }
      this.$emit('update-config', data)
    }
  },
  watch: {
    configDefaultWork: {
      handler: function (newValue) {
        this.validateTimeConfig(newValue)
        this.default_work = newValue
      },
      deep: true
    }
  },
  computed: {
    widthColumnTable: function () {
      return this.isOnsite ? 65 : 50
    }
  },
  created () {
    this.default_work = this.configDefaultWork.length !== 0 ? this.configDefaultWork : [
      {
        from_date: moment().format('YYYY-MM-DD'),
        to_date: null,
        alias_job: []
      }
    ]
  }
}
</script>

<style lang="scss" scoped>

</style>
