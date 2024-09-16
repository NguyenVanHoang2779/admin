<template>
  <b-modal hide-footer :id="id" title="Ghi chú" static centered size="lg">
    <table class="table table-hover table-bordered table-striped table-sm">
      <thead>
        <tr>
          <th>NPT</th>
          <th>Ghi chú</th>
          <th class="w-15">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="de in dependants" :key="de.id">
          <td>{{ de.fullname }}</td>
          <td v-if="+editNote.dependant !== +de.id || editNote.type === 'delete'">{{ de.note }}</td>
          <td v-else>
            <b-form-textarea
              v-model="editNote.new_note"
              :rows="1"
              :max-rows="3"
            >
            </b-form-textarea>
          </td>
          <td>
            <div v-if="editNote.dependant !== de.id || editNote.type === 'delete'">
              <b-btn size="sm" @click="edit(de)" variant="outline-success" title="Chỉnh sửa ghi chú">
                <i class="ion ion-md-create"></i>
              </b-btn>
              <b-btn size="sm" @click="edit(de, 'delete')" variant="outline-danger" title="Xóa ghi chú">
                <i class="ion ion-md-trash"></i>
              </b-btn>
            </div>
            <div v-else>
              <b-btn size="sm" @click="updateNote(de)" variant="outline-success" title="Lưu thay đổi">
                <i class="fa fa-file"></i>
              </b-btn>
              <b-btn size="sm" @click="cancle" variant="outline-danger" title="Hủy thay đổi">
                <i class="fa fa-times"></i>
              </b-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </b-modal>
</template>

<script>
// service
import dependantService from 'domain/services/dependant-person-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-note-dependant',

  props: {
    dependants: {
      default: _ => ([])
    },

    id: {
      default: 'modal-note-dependant'
    }
  },

  data: _ => ({
    editNote: {
      type: 'edit',
      dependant: null,
      new_note: null
    }
  }),

  watch: {
  },

  methods: {
    edit (dependant, type = 'edit') {
      if (!dependant) return
      this.editNote.dependant = dependant.id
      this.editNote.type = type
      if (type === 'edit') this.editNote.new_note = dependant.note
      else {
        this.editNote.new_note = null
        this.updateNote(dependant)
      }
    },

    cancle () {
      this.editNote.dependant = this.editNote.new_note = null
      this.editNote.type = 'edit'
    },

    updateNote (dependant) {
      if (!dependant) {
        helper.showMessage('Không có người phụ thuộc tương ứng !', 'warning')
        return
      }
      if (!this.editNote.dependant) {
        helper.showMessage('Không có ID người phụ thuộc !', 'warning')
        return
      }
      let data = {
        id: this.editNote.dependant,
        note: this.editNote.new_note,
        type: this.editNote.type
      }

      dependantService.updateNote(data)
        .then(res => {
          if (res.data.success) {
            dependant.note = res.data.data.note
            helper.showMessage('Cập nhật ghi chú thành công', 'success')
          } else helper.showMessage(res.data.mesage || 'Không cập nhật được ghi chú !', 'warning')
        }).catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        }).then(_ => {
          this.editNote.dependant = this.editNote.new_note = null
          this.editNote.type = 'edit'
        })
    }
  }
}
</script>
