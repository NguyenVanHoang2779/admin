<template>
  <div>
    <b>
      Team con:
      <i class="fas fa-plus text-ghtk-action font-larger" @click="addChildTeam" title="Thêm team con"></i>
    </b>
    <div v-for="(child, idx) in children" :key="idx" class="mb-2">
      <span class="text-ghtk-action text-underline-hover" v-b-toggle="`collapse-child-team-${idx}-${uuid}`">
        {{ idx + 1 }}. {{ child.name || '_________' }}
      </span>
      <i class="fas fa-times text-danger ml-2 cursor-pointer font-larger" @click="children.splice(idx, 1)" title="Xóa team"></i>
      <b-collapse :id="`collapse-child-team-${idx}-${uuid}`" :visible="!child.id">
        <div class="d-flex">
          <UpdateTeam
            :updateTrigger="updateTrigger"
            :parentId="parentId"
            :teamId="child.id || null"
            @inputName="name => child.name = name"
            :showUpdate="false"
            class="child-team-check font-small w-100 ml-3"
          />
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<style scoped>
  .child-team-check {
    border-left: 4px solid #ccc;
    border-radius: 8px;
    padding-left: 0.75rem;
  }
</style>

<script>
// helper
// import helper from 'infrastructures/helpers/common-helpers'

// service
// import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'AddChildrenTeamForm',

  components: {
    UpdateTeam: () => import('./UpdateTeam.vue')
  },

  props: {
    children: {
      type: Array,
      default: _ => ([])
    },
    parentId: {},
    updateTrigger: {}
  },

  data: _ => ({
    teamInit: {
      id: null,
      name: null,
      configs: {
        managers: [],
        staffs: [],
        children: []
      }
    }
  }),

  computed: {
    numChildTeam () {
      return this.children.length
    },

    uuid () {
      return Date.now()
    }
  },

  methods: {
    addChildTeam () {
      this.children.push({
        id: null,
        name: null,
        parent_id: null,
        configs: {
          managers: [],
          staffs: [],
          children: []
        }
      })
    }
  }
}
</script>
