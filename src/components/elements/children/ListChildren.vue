<template>
<tbody>
  <tr v-for="(child, idx) in children" :key="idx">
    <td>
      <b-input v-if="edit" type="text" v-model.trim="child.name" placeholder="Họ tên" />
      <span v-else>{{ child.name }}</span>
    </td>
    <td>
      <Datepicker
        v-if="edit"
        v-model="child.birthday"
        placeholder="Ngày sinh"
        format="dd-MM-yyyy"
        :bootstrapStyling="true"
        :monday-first="true"
        :full-month-name="true"
        :required = "true"
        :calendar-button="true"
        calendar-button-icon="ion ion-md-calendar"
        :clear-button="true"
      />
      <span v-else>{{ helper.formatDate(child.birthday) }}</span>
    </td>
    <td>
      <b-form-select
        v-if="edit"
        v-model="child.gender"
        :options="genderOption"
        placeholder="Giới tính"
      ></b-form-select>
      <span v-else>{{ genderDesc[child.gender] || '' }}</span>
    </td>
    <td>
      <b-input v-if="edit" type="text" v-model.trim="child.personal_id_number" placeholder="CMND" />
      <span v-else>{{ child.personal_id_number }}</span>
    </td>
    <td>
      <FileViewUpload
        class="d-inline-block"
        :input-id="`file_birth_certificate_${idx}_${fileOption.edit}`"
        :input-style="{ width: '3.75rem' }"
        :hideUploadButton="true"
        height="3.75rem"
        :edit="fileOption.edit"
        input-placeholder="Thêm ảnh"
        :files="child.birth_certificate"
        :file-add="child.birth_certificate_add"
        :file-delete="child.birth_certificate_delete"
      />
    </td>
    <td>
      <b-btn v-if="edit" variant="default md-btn-flat icon-btn" size="sm" @click="$emit('remove', idx)">
        <i class="ion ion-md-close"></i>
      </b-btn>
    </td>
  </tr>
</tbody>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import FileViewUpload from 'components/elements/common/FileViewUpload'

import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'list-children',

  components: {
    Datepicker,
    FileViewUpload
  },

  props: {
    edit: {
      type: Boolean,
      default: false
    },
    children: {
      type: Array,
      default: _ => ([])
    },
    fileOption: {
      type: Object,
      default: _ => ({edit: false})
    }
  },
  data: () => ({
  }),

  computed: {
    helper: _ => (helper),
    genderOption: () => ([
      { text: 'Giới tính', value: null },
      { text: 'Nam', value: 'male' },
      { text: 'Nữ', value: 'female' }
    ]),

    genderDesc: () => ({
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác'
    })
  },

  methods: {

  }
}
</script>
