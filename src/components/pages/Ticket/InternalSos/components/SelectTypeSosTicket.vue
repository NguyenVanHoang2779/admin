<template>
    <b-container fluid>
        <b-row class="my-1">
            <b-col style="transform: translateY(25%)" sm="3">
                <label class="font-italic">Lý do:</label>
            </b-col>
            <b-col sm="9">
                <multiselect
                        class="multiselect-success"
                        placeholder=""
                        v-model="multipleValue"
                        :options="multipleOptions"
                        :multiple="true"
                        selectedLabel = 'x'
                        selectLabel = ''
                        selectGroupLabel = 'Nhóm'
                        deselectGroupLabel = 'Nhóm'
                        :closeOnSelect = 'false'
                        :loading = 'loading'
                        deselectLabel = ''
                        label="name"
                        :showPointer = true
                        group-values="child"
                        group-label="name"
                        :group-select="true"
                        track-by="id">
                    <span slot="noResult">Không tìm thấy kết quả</span>
                    <span slot="noOptions">Có lỗi xảy ra khi lấy danh sách lý do</span>
                    <template slot="option" slot-scope="value">
                        <span :class="value.option.$groupLabel ? 'font-weight-bold' : ''">
                            {{renderLabel(value)}}
                        </span>
                    </template>
                </multiselect>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import Multiselect from 'vue-multiselect'
import sosService from 'domain/services/internal-sos-service'
export default {
  name: 'select-type-sos-ticket',
  components: {
    Multiselect,
    sosService
  },
  watch: {
    multipleValue () {
      this.$emit('model', this.multipleValue)
    }
  },
  props: ['types'],
  data: () => ({
    multipleOptions: [],
    multipleValue: [],
    loading: false
  }),
  computed: {
  },
  created () {
    this.$emit('model', this.multipleValue)
    this.getListTypeTicket()
  },
  methods: {
    renderLabel: value => value.option.id ? '+ ' + value.option.name : value.option.$groupLabel,
    getListTypeTicket () {
      this.loading = true
      sosService.apiGetAllReasonTicket().then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.multipleOptions = response.data.data
          }
        }
      })
        .then(() => {
          this.multipleValue = []
          this.multipleOptions.forEach(parent => {
            this.multipleValue = [...this.multipleValue, ...parent.child.filter(e => this.types.includes(`${e.id}`))]
          })
        })
        .catch(() => {
        }).then(() => {
          this.loading = false
        })
    }
  }
}
</script>
