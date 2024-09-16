<template>
  <tr>
    <td class="border-right">
      <div class="">
        <div class="position-relative">
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <div class="mr-2">
                <img :src="profileWallet.avatar" alt="" class="rounded-circle" width="50" height="50" />
              </div>
              <div>
                <b>{{ upperCaseEachFirstLetter(profileWallet.fullname) }} ({{ profileWallet.username }})</b> <br>
                <span>{{ profileWallet.position_name }} - {{ profileWallet.user_work_type_name }} - {{ profileWallet.station_name }}</span> <br>
              </div>
            </div>
            <div>
              <!-- <b-dd left variant="outline-ghtk" class="w-100 justify-content-end mb-2"
                toggle-class="btn-pill btn-sm" dropdown no-caret menuClass="border-radius-3 p-0 border-ghtk overflow-hidden"
              >
                <span slot="button-content">
                  Xem
                </span>
                <b-dd-item class="action-view" @click="$emit('action', {action: 'view_profile_cod', data: {}})">
                  Xem profile <i class="fas fa-chevron-right float-right"></i>
                </b-dd-item>
              </b-dd> -->
              <button
                class="w-100 btn btn-outline-ghtk btn-sm btn-pill mb-2"
                @click="$emit('action', {
                    action: 'view_profile_cod',
                    data: {
                      group_id: profileWallet.group_id,
                      master_profile_id: profileWallet.id,
                      user_id: profileWallet.user_id
                    }
                  }
                )"
              >
                Xem
              </button>
              <br />
              <button
                class="w-100 btn btn-outline-ghtk btn-sm btn-pill"
                @click="$emit('action', {action: 'phone', data: {user_id: profileWallet.user_id}})"
              >Gọi</button>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <div
            v-for="(tag,idx) in profileWallet.fixedTags || []"
            :key="'fixed_tag' + idx"
            :style="tag.style"
            class="d-inline-block pr-2 pl-2 mb-1"
          >
            {{ tag.name }}
          </div>
          <template v-for="(tag,idx) in tags">
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
              <i class="fa fa-times-circle deleteTag" :id="'iconDeleteTag' + tag.record_id + idx"></i>
            </div>
          </template>
          <span v-if="editableTag" class="d-inline-block cursor-pointer text-ghtk ml-2"
          @click="$emit('action', {
              action: 'tag',
              work_category: profileWallet.work_category,
              work_type: profileWallet.work_type,
              data: profileWallet
            })"
          >
            <i class="fas fa-plus"></i> Tag
          </span>
        </div>
      </div>
    </td>
    <td class="border-right">
      <div class="mh-10re overflow-auto pt-1">
        <LogLine
          :logs="profileWallet.log_wallet"
        />
      </div>
    </td>
    <td>
      <div>
        <div>
          <div
            class="text-ghtk cursor-pointer text-center"
            @click="$emit('action', {
              action: 'handler', data: {
                handlers: profileWallet.handlers,
                master_profile_id: profileWallet.master_profile_id
              }
            })"
          >
            Người xử lý <i class="fas fa-edit"></i>
          </div>
          <template v-for="(handler, idx) in profileWallet.handlers || []" >
            <div v-if="idx < 2 && handler.handler_info" :key="idx">
              <img :src="handler.handler_info.avatar" alt="" class="rounded-circle" width="20" height="20"/>
              {{ handler.handler_info.username }} - {{ handler.handler_info.station_name }}
            </div>
          </template>
        </div>
        <div class="text-center mt-1">
          <button
            @click="$emit('action', {
              action: 'chat',
              data: {
                user_id: profileWallet.user_id,
              }
            })"
            class="btn btn-sm btn-outline-ghtk btn-pill w-75 mb-1"
          >
            Chat
          </button>
          <button
            @click="$emit('action', {
              action: 'note',
              data: {
                master_profile_id: profileWallet.master_profile_id,
                master_profile_extend_id: profileWallet.master_profile_extend_id
              }
            })"
            class="btn btn-sm btn-outline-ghtk btn-pill w-75"
          >
            Ghi chú
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.deleteTag {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black;
  display: none;
}

.tag {
  display: inline-block;
  padding: 0 0.25rem;
}
</style>

<script>
// custom component
import LogLine from 'components/elements/logs/LogLine.vue'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import hrTagService from 'domain/services/hr-tag-service'

export default {
  name: 'order-row-data-v2',

  components: {
    LogLine
  },

  props: {
    profileWallet: {
      type: Object,
      default: _ => ({})
    },
    tableName: {
      type: String
    },
    updateVal: {
      type: Object
    },
    editableTag: {
      default: true
    }
  },

  data: _ => ({
    tags: []
  }),

  watch: {
    profileWallet: {
      immediate: true,
      handler: function (newVal) {
        if (newVal && newVal.tags) this.tags = newVal.tags
      }
    },
    updateVal: {
      immediate: true,
      handler: function (newVal) {
        if (newVal && newVal.field === 'tag') this.tags = newVal.data
      }
    }
  },

  computed: {},

  methods: {
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
            this.profileWallet.tags = this.tags
            helper.showMessage(data.data.message || 'Bỏ gắn tag thành công!', 'success')
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        console.log(e)
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },

    showIcon (id, display = 'inline-block') {
      document.getElementById(id).style.display = display
    },

    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },

    upperCaseEachFirstLetter (sentence) {
      return helper.upperCaseEachFirstLetter(sentence)
    }
  }
}
</script>
