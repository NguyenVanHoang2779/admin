<template>
  <b-modal
    v-model="show"
    title="Thêm mới khung thời gian nhận hàng"
    size="lg"
    header-bg-variant="white"
    header-text-variant="black"
    static
    centered
    scrollable
    hide-footer
  >
    <div v-if="errorMessage" class="alert alert-warning p-2">{{errorMessage}}</div>

    <b-form @submit.prevent="addNewRange">
      <b-input-group class="mb-3">
        <b-input-group-prepend is-text><b>Thời gian bắt đầu</b></b-input-group-prepend>
        <b-form-input type="number" @keyup.enter.prevent="addNewRange" autofocus min="1" max="24" required v-model="startTime"/>
        <b-input-group-prepend is-text><b>h</b></b-input-group-prepend>
        <b-input-group-prepend is-text><b>Thời gian kết thúc</b></b-input-group-prepend>
        <b-form-input type="number" @keyup.enter.prevent="addNewRange" min="1" max="24" required v-model="endTime"/>
        <b-input-group-prepend is-text><b>h</b></b-input-group-prepend>
      </b-input-group>
    </b-form>

    <div class="text-center">
      <b-button
        variant="success"
        class="mr-1"
        @click="addNewRange"
      >
        <i class="fa fa-check"/> Xác nhận
      </b-button>
      <b-button
        variant="secondary"
        class="ml-1"
        @click="cancel"
      >
        <i class="fa fa-times"/> Hủy
      </b-button>
    </div>
  </b-modal>
</template>

<script>
const MIN_HOUR = 0
const MAX_HOUR = 23

export default {
  name: 'ModalPointDeliverTime',
  props: {
    value: {
      type: Array,
      required: true
    },
    deliverTime: {
      type: Array,
      required: true
    },
    defaultVal: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      startTime: this.defaultVal ? this.defaultVal.start_time : 0,
      endTime: this.defaultVal ? this.defaultVal.end_time : 0,
      show: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.show = true
    this.$root.$on('bv::modal::hidden', () => {
      this.$emit('closed')
    })
  },
  methods: {
    /**
     * Lấy thông tin start_time, end_time mà user đã nhập trên UI
     * @returns {{start_time: (string|*), end_time: (string|*), id: null}|*}
     */
    getUserInputTime () {
      const startTime = Number(this.startTime)
      const endTime = Number(this.endTime)

      if (isNaN(startTime) || startTime < MIN_HOUR || startTime > MAX_HOUR) {
        throw new Error('Thời gian bắt đầu không hợp lệ.')
      }

      if (isNaN(endTime) || endTime < MIN_HOUR || endTime > MAX_HOUR) {
        throw new Error('Thời gian kết thúc không hợp lệ.')
      }

      if (startTime >= endTime) {
        throw new Error('Thời gian kết thúc cần lớn hơn thời gian bắt đầu.')
      }

      const tagExists = this.deliverTime.find((row) => row.startHour === startTime && row.endHour === endTime)
      if (tagExists) {
        return tagExists
      }

      const newDeliverTime = {
        id: 'AddNew_' + new Date().getTime().toFixed(16),
        start_time: ('0' + startTime).substr(-2) + `:00:00`,
        end_time: ('0' + endTime).substr(-2) + `:00:00`
      }
      this.deliverTime.push(newDeliverTime)

      return newDeliverTime
    },

    /**
     * Thêm mới thời gian. Trường hợp nhập trùng với giá trị có sẵn -> không insert mới mà dùng giá trị tag có sẵn
     */
    addNewRange () {
      this.errorMessage = ''
      try {
        const timeRange = this.getUserInputTime()
        this.show = false
        this.$emit('input', [...(Array.isArray(this.value) ? this.value : []), timeRange])
      } catch (reason) {
        this.errorMessage = reason instanceof Error ? reason.message : reason.toString()
      }
    },

    /**
     * Bỏ qua việc thêm mới.
     */
    cancel () {
      this.show = false
    }
  }
}
</script>
