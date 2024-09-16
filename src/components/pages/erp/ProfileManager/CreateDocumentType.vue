<template>
  <b-modal
    title="Thêm loại hồ sơ"
    v-model="openAddModal"
    @hidden="reset"
  >
    <b-form v-loading="loading">
      <b-form-group label="Hồ sơ">
        <b-form-input
          v-model="name"
          placeholder="Hồ sơ"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Loại hồ sơ">
        <b-form-select
          v-model="sub_type"
          :options="subTypeOpts"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group label="Phương thức ràng buộc">
        <b-form-select
          v-model="config"
          :options="configOpts"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group label="Số trang tối thiểu">
        <b-form-input
          v-model="num_of_pages"
          placeholder="Số trang tối thiểu"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Dấu xác nhận">
        <b-form-select
          v-model="confirmed_stamp"
          :options="confirmedStampOpts"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group label="Deadline">
        <b-form-select v-model="deadline_key">
          <option :value="null">Chọn deadline</option>
          <option v-for="(text, key) in deadline_opts" :value="key" >
            {{ text }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-form-group label="Ghi chú">
        <b-form-textarea
          v-model="note"
          placeholder="Ghi chú"
          rows="3"
          max-rows="6"
        >
        </b-form-textarea>
      </b-form-group>
    </b-form>
    <template slot="modal-footer">
        <button type="button"
          class="btn btn-secondary"
          @click="openAddModal = false"
        >Đóng
        </button>
        <button type="button"
          class="btn btn-success"
          @click="done"
          v-loading="loading"
        >Xong</button>
    </template>
  </b-modal>
</template>

<script>
import {configOpts, subTypeOpts, confirmedStampOpts} from './OptionConst'

export default {
  props: ['open', 'loading', 'deadline_opts'],
  data () {
    return {
      openAddModal: false,
      name: null,
      sub_type: null,
      config: null,
      note: '',
      deadline_key: null,
      configOpts,
      num_of_pages: 1,
      confirmed_stamp: '',
      confirmedStampOpts,
      subTypeOpts
    }
  },
  methods: {
    done () {
      this.$emit('done', {
        name: this.name,
        sub_type: this.sub_type,
        config: this.config,
        deadline_key: this.deadline_key,
        deadline: this.deadline_opts[this.deadline_key],
        num_of_pages: this.num_of_pages,
        confirmed_stamp: this.confirmed_stamp,
        note: this.note
      })
    },
    reset () {
      this.openAddModal = false
      this.name = null
      this.sub_type = null
      this.config = null
      this.num_of_pages = null
      this.confirmed_stamp = null
      this.note = ''
      this.deadline_key = null
    }
  },
  watch: {
    open (v) {
      this.openAddModal = v
    },
    openAddModal (v) {
      this.$emit('updateOpen', v)
    }
  }
}
</script>
