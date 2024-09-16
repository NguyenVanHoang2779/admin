<template>
  <b-modal
    title=" Chỉnh sửa loại hồ sơ"
    v-model="openModal"
    @hidden="openModal = false"
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
          <option v-for="(text, key) in deadline_opts" :value="key">
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
          @click="openModal = false"
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
  props: ['open', 'loading', 'conf', 'deadline_opts'],

  data () {
    return {
      id: null,
      openModal: false,
      name: null,
      sub_type: null,
      config: null,
      note: null,
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
        id: this.id,
        name: this.name,
        sub_type: this.sub_type,
        config: this.config,
        deadline_key: this.deadline_key,
        deadline: this.deadline_opts[this.deadline_key],
        num_of_pages: this.num_of_pages,
        confirmed_stamp: this.confirmed_stamp,
        note: this.note
      })
    }
  },
  watch: {
    open (v) {
      this.openModal = v
    },
    openModal (v) {
      this.$emit('updateOpen', v)
    },
    conf (v) {
      this.id = v.id
      this.name = v.name
      this.sub_type = v.sub_type
      this.config = v.config
      this.deadline_key = v.deadline_key
      this.num_of_pages = v.num_of_pages
      this.confirmed_stamp = v.confirmed_stamp
      this.note = v.note
    }
  }
}
</script>
