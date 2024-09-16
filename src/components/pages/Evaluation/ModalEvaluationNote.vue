<template>
    <div>
        <b-modal id="modal-evaluation-note" size="lg" hide-footer ref="myModalRef"  @show="getListEvaluationNotes" static>
            <div slot="modal-title">
                Danh sách ghi chú
            </div>
            <div v-if="typeof listNotes !== 'undefined' && listNotes.length > 0">
                <div v-for="note in listNotes" class="container-note">
                    <div><span class="person-note">{{note.User.fullname}} - {{note.po.position_name}} - {{note.ErpSgwEmpEvaluationNote.created}}</span></div>
                    <span class="note-content">{{note.ErpSgwEmpEvaluationNote.note}}</span>
                </div>
            </div>
            <div v-else>
                <span>Nhân viên hiện không có ghi chú nào trong kì đánh giá. Thêm ghi chú bên dưới</span>
            </div>
            <div class="position-relative">
                <b-form-input class="only-bottom-border" style="max-width: 750px; padding-right: 35px;" v-model="currNote" placeholder="Thêm ghi chú" @keyup.enter.native="addNote"></b-form-input>
                <b-btn style="position: absolute; top: 8px; right: 0px; border: none; background: rgba(0,0,0,0); padding: 0" @click="addNote()">
                    <i font-size: style="font-size: 20px" class="icon ion-ios-send text-primary" ></i>
                </b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
import evaluationService from 'domain/services/evaluation-service'

export default {
  name: 'modal-evaluation-note',

  components: {
    evaluationService
  },

  props: [
    'evaluation',
    'typeNote'
  ],

  data: () => ({
    currNote: '',
    listNotes: []
  }),

  created () {
  },

  watch: {
  },

  methods: {
    addNote: function () {
      let data = {
        user_id: this.evaluation.user_id,
        note: this.currNote,
        from: this.evaluation.start_date,
        to: this.evaluation.end_date,
        type: this.typeNote
      }
      evaluationService.addNote(data)
        .then((res) => {
          if (!res.data.hasOwnProperty('success')) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              text: res.data
            })
          }
          if (res.data.success) {
            this.listNotes = res.data.data
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              text: res.data.message
            })
            this.getListEvaluationNotes()
            this.currNote = ''
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              text: res.data.message
            })
            this.currNote = ''
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getListEvaluationNotes: function () {
      let params = {
        id: this.evaluation.user_id,
        from: this.evaluation.start_date,
        to: this.evaluation.end_date,
        type: this.typeNote
      }
      evaluationService.getListEvaluationNotes(params)
        .then((res) => {
          if (res.data.success) {
            this.listNotes = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped lang="scss">
    .container-note {
        border-bottom: 1px solid rgba(24, 28, 33, 0.1);
        padding: 5px;
    }
    .container-note:hover {
        background: #ecf6f1;
    }
    .note-content {
        margin-left: 5px;
    }
    .person-note {
        font-size: 13px;
        font-style: italic;
    }
    .only-bottom-border{
        border-top: none;
        border-left: none;
        border-right: none;
    }
</style>
