<template>
  <div>
    <multiselect
      v-model="selected"
      :options="selectedOptionsList"
      label="text"
      track-by="id"
      selectLabel=""
      deselectLabel="X"
      :multiple="false"
      @input="emitSelectedOption"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn kênh tuyển dụng</span>
    </multiselect>
  </div>

</template>

<style scoped lang="scss">

</style>
<script>

import Multiselect from 'vue-multiselect'

export default {
  name: 'SelectChannelRecruitment',

  components: {
    Multiselect
  },

  props: {
    source: {
      type: String,
      default: null
    },
    channel: null
  },

  data: () => ({
    options: {
      outdoor: [
        {
          text: 'Poster/Banner/Tờ rơi',
          id: 'poster'
        },
        {
          text: 'Booth tuyển dụng',
          id: 'booth'
        }
      ],
      web: [
        {
          text: 'Zone 9',
          id: 'zone9'
        },
        {
          text: 'Ybox',
          id: 'ybox'
        },
        {
          text: 'Vieclam24h',
          id: 'vieclam24h'
        },
        {
          text: 'Timviecnhanh',
          id: 'timviecnhanh'
        },
        {
          text: 'JobsGO',
          id: 'jobsgo'
        },
        {
          text: 'Top CV',
          id: 'topcv'
        },
        {
          text: 'Career Builder',
          id: 'career_builder'
        },
        {
          text: 'Chợ tốt',
          id: 'cho_tot'
        },
        {
          text: 'Career Link',
          id: 'career_link'
        },
        {
          text: 'Ghtk.co',
          id: 'ghtk.co'
        },
        {
          text: 'Khác',
          id: 'other'
        }
      ],
      social_network: [
        {
          text: 'Facebook Ads',
          id: 'facebook_ads'
        },
        {
          text: 'Fanpage toàn quốc',
          id: 'nationwide_fanpage'
        },
        {
          text: 'Fanpage tỉnh',
          id: 'provincial_fanpage'
        },
        {
          text: 'Facebook cá nhân',
          id: 'personal_facebook'
        },
        {
          text: 'Zalo',
          id: 'zalo'
        },
        {
          text: 'Tiktok',
          id: 'tiktok'
        }
      ]
    }
  }),

  computed: {
    selectedOptionsList () {
      return this.source ? this.options[this.source] : []
    },
    selected: {
      get () {
        return this.selectedOptionsList.find(option => option.id === this.channel)
      },
      set (newOption) {
        this.$emit('selected-option-changed', newOption)
      }
    }
  },

  watch: {
    // channel: function (newVal, oldVal) {
    //   this.selected = this.selectedOptionsList.find(function (option) {
    //     return option.id === newVal
    //   })
    // }
  },

  methods: {
    emitSelectedOption (selectedOption) {
      this.$emit('selected-option-changed', selectedOption)
    }
  }
}
</script>
