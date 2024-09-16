<template>
<div>
  <div v-for="(tag,idx) in order.fixedTags || []" :key="'fixed_tag' + idx" :style="tag.style" class="d-inline-block pr-2 pl-2 mb-1">{{ tag.name }}</div>
  <template v-for="(tag,idx) in order.tags">
    <div class="d-inline-block mr-1 cursor-pointer position-relative"
         @mouseover="showIcon('iconDeleteTag' + tag.record_id + idx)"
         @mouseout="showIcon('iconDeleteTag' + tag.record_id + idx, 'none')"
         :key="idx"
         @click="onDeleteTag(tag)"
    >
      <div class="d-inline-block tag"
           :style="JSON.parse(tag.style)"
      >
        {{ tag.name }}
      </div>
      <i class="fa fa-times-circle deleteTag" style="display: none" :id="'iconDeleteTag' + tag.record_id + idx"></i>
    </div>
  </template>
  <span
    v-if="editableTag"
    class="d-inline-block cursor-pointer text-ghtk ml-2"
    @click="$emit('tag', {action: 'tag', data: order, work_category: 'ekyc_image_changes'})"
  ><i class="fas fa-plus"></i> Tag
          </span>
</div>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import hrTagService from 'domain/services/hr-tag-service'

export default {
  name: 'record-tag',
  props: {
    order: {
      default: []
    },
    editableTag: {
      default: true
    }
  },
  methods: {
    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },
    async onDeleteTag (tag) {
      try {
        if (confirm('Bạn có chắc muốn xóa tag ' + tag.name + ' ?')) {
          this.loading = true
          const data = await hrTagService.detach({
            record_id: +tag.record_id,
            table_name: tag.table_name,
            hr_tag_id: +tag.id
          })
          if (data.data.success) {
            this.tags = this.tags.filter(x => {
              return +x.id !== +tag.id
            })
            this.order.tags = this.tags
            helper.showMessage(data.data.message || 'Bỏ gắn tag thành công!', 'success')
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.deleteTag {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black;
  display: none;
}
</style>
