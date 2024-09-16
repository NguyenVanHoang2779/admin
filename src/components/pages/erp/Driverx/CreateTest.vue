<template>
  <div>
    <b-modal
      id="modal-add-work-transfer"
      v-model="show"
      static
      size="lg"
      @hidden="close"
    >
      <div slot="modal-title">Thêm mới</div>
      <div class="col-md-12 form">
        <div class="form-group">
          <p class="form-title">
            Tên bài test <span class="highlight">*</span>
          </p>
          <b-form-input
            v-model="name"
            placeholder="Tên bài test"
          ></b-form-input>
        </div>
        <div class="form-group">
          <p class="form-title">Loại công việc <span class="highlight">*</span></p>
          <b-form-select v-model="jobType" :options="options"> </b-form-select>
        </div>
        <div class="form-group">
          <p class="form-title">Ghi chú</p>
          <b-form-textarea
            id="note"
            v-model="note"
            placeholder="Ghi chú"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close()">
          Hủy
        </button>
        <button type="button" class="btn btn-primary" @click="done">
          Đồng ý
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import config from './config'

function initialState () {
  return {
    show: false,
    name: '',
    note: '',
    jobType: '',
    options: config.jobTypes
  }
}

export default {
  props: ['open'],
  data: () => initialState(),

  watch: {
    open (status) {
      this.show = status
    }
  },

  methods: {
    close () {
      this.name = ''
      this.note = ''
      this.show = false
      this.$emit('close')
    },
    done () {
      this.$emit('createTest', {
        name: this.name,
        note: this.note,
        jobType: this.jobType
      })
      this.close()
    }
  }
}
</script>

<style>
.highlight {
  color: red;
}
</style>
