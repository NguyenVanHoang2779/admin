<template>
  <div class="ml-2 mr-2">
    <div class="box-user d-flex justify-content-between">
      <div class="mr-2 d-flex">
        <div class="avt-user">
          <img :src="masterProfile.image_profile || ''"
               alt="avatar user" width="52" height="52">
        </div>
        <div class="info-user ml-3">
          <div class="info-user-name">
            <b>{{ masterProfile.fullname }} ({{ masterProfile.username }})</b>
          </div>
          <div class="info-user-position">
            {{ masterProfile.position_name }} - {{ masterProfile.work_type_description }} - {{ masterProfile.station_name }}
          </div>
          <div class="">
            Mã MP: {{ masterProfile.master_profile_id }}
          </div>
        </div>
      </div>
      <div class="btn-chat">
        <div class="mb-1">
          <b-btn variant="outline-ghtk" class="btn-sm" @click="$emit('eventViewProfile', masterProfile.master_profile_id)">Xem</b-btn>
        </div>
        <div class="mt-1">
          <b-btn variant="outline-ghtk" class="btn-sm" @click="$emit('eventViewPhone')">Gọi</b-btn>
        </div>
      </div>
    </div>
    <div class="missing-docs">
      <div class="">
        <b-badge class="badge-red" v-if="masterProfile.is_missing_docs" >Thiếu hồ sơ</b-badge>
        <b-badge class="badge-green" v-else>Đủ hồ sơ</b-badge>
        <b-badge class="badge-orange" v-if="masterProfile.is_overdue_docs" >Quá hạn nộp hồ sơ</b-badge>
      </div>
      <div class="">
        <p class="mb-1" v-for="doc in masterProfile.merge_docs">
          <span v-if="doc.doc_type.includes('missing')">Thiếu</span> {{ doc.name }} <span class="font-overdue" v-if="doc.doc_type.includes('overdue')">(Quá hạn nộp)</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

// helper
// import helper from 'infrastructures/helpers/common-helpers'
// import moment from 'moment'

// service
// import hrTagService from 'domain/services/hr-tag-service'

export default {
  name: 'InfoUser',
  props: {
    masterProfile: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
  }),

  watch: {
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.missing-docs > div {
  display: block;
  margin-top: 6px;
  color: #000;
}
.badge-red {
  font-weight: 400;
  font-size: 1em;
  background-color: #DB4944;
}
.badge-green {
  font-weight: 400;
  font-size: 1em;
  background-color: #069255;
}
.badge-orange {
  font-weight: 400;
  font-size: 1em;
  background-color: #FFB800;
}
.font-overdue {
  color: #DB4944;
}
img {
  object-fit: cover;
}
.modal-header {
  justify-content: center !important;
  .close {
    display: none !important;
  }
}

.box-user {
  .avt-user {
    img {
      border-radius: 50%;
    }
  }

  .info-user {
    color: #000000;
    .info-user-position, .info-user-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .btn-chat {
    .btn {
      border-radius: 20px;
      width: 100%;
    }
  }
}

.btn__close-modal-phone {
  border-radius: 5px;
  background: #00904A;
  font-weight: bold;
}

b {
  font-weight: 500;
}

</style>
