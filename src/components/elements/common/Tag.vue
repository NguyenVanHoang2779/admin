<template>
    <div>
        <span class="tags" v-for="(tag, idx) in listTag" :key="idx">
          <span class="candidate-tag" v-if="!isManageTag || tag.type !== 'global'">
            <a href="javascript:void(0)" class="position-relative mb-1">
              <i class="ion ion-md-close-circle-outline position-absolute" @click="actionRemove(tag)"></i>
              <span @click="getCandidate(tag)">{{ tag.name }}</span></a>
          </span>
        </span>
    </div>
</template>

<script>

import candidateService from 'domain/services/candidate-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'tag',

  components: {
  },

  props: {
    color: null,
    size: null,
    arrow: null,
    listTag: Array,
    isManageTag: {
      type: Number,
      default: 0
    },
    candidateId: null
  },
  data: () => ({
  }),

  created () {
  },

  watch: {

  },

  methods: {
    actionRemove (tag) {
      if (this.isManageTag === 0) {
        this.cancelAttachTag(tag)
      } else {
        this.deleteTagByHr(tag)
      }
    },

    getCandidate (tag) {
      this.$emit('getCandidate', tag)
    },

    deleteTagByHr (tag) {
      if (!tag.id) {
        alert('Vui lòng chọn tag cần xóa !')
        return
      }
      if (!confirm(`Bạn có chắc chắn muốn xóa tag "${tag.name || ''}" không?`)) return

      candidateService.deleteTagByHr({ tagId: tag.id })
        .then(res => {
          if (res.data.success) {
            this.$emit('getListTagByHr')
            commonHelper.showMessage(res.data.mesage || 'Xóa tag thành công', 'success')
          } else commonHelper.showMessage(res.data.mesage || 'Không xóa được tag, vui lòng thử lại sau !', 'warning')
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
    },

    cancelAttachTag (tag) {
      if (!tag.id) {
        alert('Vui lòng chọn tag cần xóa !')
        return
      }
      if (!confirm(`Bạn có chắc chắn muốn hủy gán tag "${tag.name || ''}" không?`)) return

      let data = {
        tagId: tag.id,
        candidateId: this.candidateId
      }
      candidateService.cancelAttachTag(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('getTagsOfCandidate', this.candidateId)
            commonHelper.showMessage('Hủy gán tag thành công', 'success')
          } else commonHelper.showMessage('Không thể hủy gán tag, vui lòng thử lại sau', 'warning')
        })
        .catch(e => {
          commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
    .tags a {
        float: left;
        position: relative;
        margin-right: 1.5rem;
        width: auto;
        height: 1.5rem;
        padding: 0 10px;
        line-height: 1.5rem;
        background: #1f8dd6;
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        i {
            display: none;
            top: -8px;
            left: -5px;
            color: #6e7a8a;
            background: white;
            border-radius: 16px;
        }
    }

    .tags a:before {
        content: "";
        position: absolute;
        top: 0;
        width: 0;
        height: 0;
        border-style: solid;
    }

    .tags a:after {
        content: "";
        position: absolute;
        top: 10px;
        width: 4px;
        height: 4px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        background: #fff;
        -moz-box-shadow: -1px -1px 2px #004977;
        -webkit-box-shadow: -1px -1px 2px #004977;
        box-shadow: -1px -1px 2px #004977;
    }
    /* Add rounded corners to left end of the anchor tag */
    .candidate-tag a {
        -moz-border-radius-bottomleft: 4px;
        -webkit-border-bottom-left-radius: 4px;
        border-bottom-left-radius: 4px;
        -moz-border-radius-topleft: 4px;
        -webkit-border-top-left-radius: 4px;
        border-top-left-radius: 4px;
    }

    /* Position right and show only left border of triangle  */
    .candidate-tag a:before {
        right: -0.75rem;
        border-color: transparent transparent transparent #1f8dd6;
        border-width: 0.75rem 0 0.75rem 0.75rem;
    }

    /* Fix the circle between anchor box and triangle right to it  */
    .candidate-tag a:after {
        right: -2px;
    }

    .tags a:hover {
        background: #1d85ca;
        i {
            display: inline;
        }
    }

    .candidate-tag a:hover:before {
        border-color: transparent transparent transparent #1d85ca;
    }
</style>
