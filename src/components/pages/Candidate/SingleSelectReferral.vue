<template>
    <div>
        <multiselect
            v-model="selectedReferral"
            :options="hrview ? referralHrOptions : referralCandidateOptions"
            :placeholder="placeholder"
            label="name"
            track-by="value"
            selectedLabel="Đã chọn"
            deselectLabel="X"
            selectLabel=""
            :searchable="true"
            @select="op => $emit('select', op)"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
        </multiselect>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-referral',

  components: {
    Multiselect
  },

  props: {
    reset: false,
    referral: {
      type: String
    },
    hrview: {
      default: true
    },
    placeholder: {
      default: 'Chọn nguồn giới thiệu'
    }
  },

  data: () => ({
    selectedReferral: null,
    referralHrOptions: [
      {
        name: 'Mạng xã hội',
        value: 'facebook'
      },
      {
        name: 'Jobsite tuyển dụng',
        value: 'web'
      },
      {
        name: 'Ngày hội việc làm',
        value: 'workfes'
      },
      {
        name: 'Giới thiệu nội bộ',
        value: 'employee'
      },
      {
        name: 'Quảng cáo ngoài trời',
        value: 'outdoor'
      },
      {
        name: 'Đối tác tuyển dụng',
        value: 'other'
      }
    ],
    referralCandidateOptions: [
      {
        name: 'Mạng xã hội',
        value: 'facebook'
      },
      {
        name: 'Jobsite tuyển dụng',
        value: 'web'
      },
      {
        name: 'Ngày hội việc làm',
        value: 'workfes'
      },
      {
        name: 'Giới thiệu nội bộ',
        value: 'employee'
      },
      {
        name: 'Quảng cáo ngoài trời',
        value: 'outdoor'
      },
      {
        name: 'Khác',
        value: 'other'
      }
    ]
  }),

  watch: {
    selectedReferral: function (newVal, oldVal) {
      this.$emit('on-select', newVal)
    },

    referral: function (newVal, oldVal) {
      if (newVal) {
        if (this.hrview) this.selectedReferral = this.referralHrOptions.find((item) => (item.value === newVal))
        else this.selectedReferral = this.referralCandidateOptions.find((item) => (item.value === newVal))
      } else {
        this.selectedReferral = null
      }
    },

    reset () {
      this.selectedReferral = null
    }
  }
}
</script>
