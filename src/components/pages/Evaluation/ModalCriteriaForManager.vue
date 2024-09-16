<template>
    <div>
        <b-modal id="modal-criteria-for-manager" hide-footer ref="myModalCriteriaForManager" static>
            <div slot="modal-title">
                Kết quả đánh giá tiêu chí dành cho quản lí
            </div>
            <b-container fluid>
                <table class="table b-table table-striped table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>Sắp xếp, phân công công việc</th>
                        <th>Đánh giá, kiểm soát</th>
                        <th>Đào tạo và phát triển nhân lực</th>
                        <th>Gắn kết và xây dựng tập thể</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="is_align_middle" v-if="evaluation">
                        <td v-html="transferToEmotionByEvaluation(Number(evaluation.work_assign))"></td>
                        <td v-html="transferToEmotionByEvaluation(Number(evaluation.evaluate_control))"></td>
                        <td v-html="transferToEmotionByEvaluation(Number(evaluation.train_develop))"></td>
                        <td v-html="transferToEmotionByEvaluation(Number(evaluation.build_collectivity))"></td>
                    </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>
    </div>
</template>

<script>

export default {
  name: 'modal-criteria-for-manager',

  components: {
  },

  props: [
    'evaluation'
  ],

  data: () => ({
  }),

  created () {
  },

  watch: {
  },

  methods: {
    transferToEmotionByEvaluation: function (eva) {
      if (eva === 1) {
        return '<i class="ion ion-ios-sad" style="font-size: 24px"></i>'
      }
      if (eva === 2) {
        return '<i class="ion ion-md-happy" style="font-size: 24px; color: orange"></i>'
      }
      if (eva === 3) {
        return '<i class="ion ion-ios-happy" style="font-size: 24px; color: orange"></i>'
      }
      if (eva === 4) {
        return '<i class="ion ion-md-thumbs-up" style="font-size: 24px; color: #02BC77"></i>'
      }
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped lang="scss">
</style>
