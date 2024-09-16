<template>
  <tbody>
    <MemberDetail
      v-for="(member, idx) in members"
      :class="!update && idx > 2 && !showAll && 'd-none'"
      :key="member.id"
      :member="member"
      :idx="idx + 1"
      :update="update"
      @update="$emit('update', member)"
      @delete="members.splice(idx, 1)"
    />
    <span v-show="numMember > 3 && !update" class="text-ghtk-action" @click="showAll = !showAll">
      {{ !showAll ? 'Xem thêm' : 'Thu gọn' }}
    </span>
  </tbody>
</template>

<script>
import MemberDetail from './MemberDetail'
export default {
  name: 'list-member-detail',

  props: {
    update: {
      type: Boolean,
      default: true
    },
    members: {
      deafault: _ => ([]),
      type: Array
    }
  },

  data: _ => ({
    showAll: false
  }),

  computed: {
    numMember () {
      return this.members.length
    }
  },

  components: {
    MemberDetail
  }
}
</script>
