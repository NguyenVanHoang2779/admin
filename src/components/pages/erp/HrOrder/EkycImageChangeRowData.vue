<template>
<tr>
  <td class="border-right">
    <div class="">
      <div class="position-relative">
        <div class="d-flex justify-content-between">
          <div class="d-flex justify-content-start">
            <div class="mr-2">
              <img :src="order.user.image_profile" alt="" class="rounded-circle" width="50" height="50" />
            </div>
            <div>
              <b>{{ order.user.fullname }} ({{ order.user.username }})</b> <br>
              <span>{{ order.user.position_name }} - {{ order.user.work_type }} - {{ order.user.station_name }}</span> <br>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2">
        <RecordTag
          @tag="tagManage"
          :order="order"
          :editable-tag="editableTag"
        >
        </RecordTag>
      </div>
    </div>
  </td>
  <td class="border-right">
    <div v-viewer class="ekyc-change_list-images">
      <template v-for="(image,idx) in order.images">
        <img :key="idx" :src="image.url" :alt="image.type || 'ekyc image'" :class="+idx != (order.images.length - 1) && 'pr-2'" :width="image.main_type == 'card' ? '25%' : '16.6%'" :height="150">
      </template>
    </div>
  </td>
  <td>
    <div v-if="order.order.can_proceed">
      <div>
        <div class="text-ghtk cursor-pointer text-center" @click="$emit('action', {action: 'censor', data: {}})">Người xử lý <i class="fas fa-edit"></i></div>
        <template v-for="(censor, idx) in order.censors" >
          <div v-if="idx < 2" :key="idx">
            <img :src="censor.avatar" alt="" class="rounded-circle" width="20" height="20"/>
            {{ censor.username }} - {{ censor.station }}
          </div>
        </template>
      </div>
      <div v-if="order.order.can_action" class="text-center mt-1">
        <button @click="$emit('action', {action: 'duyet', data: {}})" class="wd-order-btn-approve-info btn btn-sm btn-outline-ghtk btn-pill w-75 mb-1">Duyệt</button>
        <button @click="$emit('action', {action: 'tu_choi', data: {}})" class="btn btn-sm btn-outline-danger btn-pill w-75 mb-1">Từ chối</button>
      </div>
    </div>
  </td>
</tr>
</template>

<script>
import profileService from 'domain/services/profile-service'
import helper from 'infrastructures/helpers/common-helpers'
// custom component
import RecordTag from 'components/pages/erp/HrOrder/RecordTag'
export default {
  name: 'ekyc-image-change-row-data',
  components: {
    RecordTag
  },
  data: _ => ({
    loading: false,
    filters: {
      page: 1,
      limit: 8
    },
    page: {
      page: 1,
      total: 0,
      limit: 8
    }
  }),
  props: {
    order: {},
    editableTag: {
      default: true
    }
  },
  computed: {
    helper () {
      return this.helper
    }
  },
  mounted () {
    if (this.order.images.length > 0) {
      let listImages = []
      for (let i = 0; i < this.order.images.length; i++) {
        if (['old_card_front', 'old_card_back'].includes(this.order.images[i].type) && !helper.isEmpty(this.order.images[i].url)) {
          listImages.push(this.order.images[i].url)
        }
      }
      if (listImages.length > 0) {
        this.getBeautifulIdentityCard(listImages)
      }
    }
  },
  methods: {
    tagManage (data) {
      this.$emit('action', data)
    },
    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },
    async getBeautifulIdentityCard (listImages) {
      const {data} = await profileService.getOriginImage({urls: listImages})
      let urls = []
      data.urls.forEach(item => urls.push(item.path))
      for (let i = 0; i < this.order.images.length; i++) {
        if (this.order.images[i].type === 'old_card_front') {
          this.order.images[i].url = urls[0]
        }
        if (this.order.images[i].type === 'old_card_back') {
          this.order.images[i].url = urls[1]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ekyc-change_list-images {
    display: flex;
    overflow-x: auto;
  }
</style>
