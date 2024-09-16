import newMemberService from 'domain/services/new-member-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import {eventBus} from '../../../../main'

export default {
  data () {
    return {
      members: [],
      loading: true,
      pagination: {
        currentPage: 1,
        limit: 3,
        total: 0
      },
      list: [],
      filter: {
        code: null,
        name: null,
        region: null,
        province: null,
        station: null,
        group: null,
        position: null,
        status: null,
        workType: null,
        start: null,
        end: null,
        sort: null,
        reset: false,
        seniority: null,
        tags: null
      },
      pkgPopup: false,
      pkgOrder: null,
      openNote: false,
      selectedMember: {},
      openTicket: false,
      ticketId: null,
      openTagManage: false,
      sortOptions: [
        { value: null, text: 'Sắp xếp' },
        { value: 'desc', text: 'Bồi hoàn cao' },
        { value: 'asc', text: 'Bồi hoàn thấp' }
      ],
      seniorityOptions: [
        { value: null, text: 'Chọn thâm niên' },
        { value: 1, text: 'Dưới 10 ngày' },
        { value: 2, text: '11-20 ngày' },
        { value: 3, text: '21-30 ngày' }
      ],
      tags: [],
      filterTags: null,
      tagMember: null
    }
  },
  mounted () {
    this.getMembers()
    this.getTags()
  },
  methods: {
    async getMembers () {
      try {
        this.loading = true
        const {data} = await newMemberService.getNewMembers({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })
        if (data.success) {
          this.members = data.members
          this.getPaginationData()
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        this.members = []
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async getPaginationData () {
      try {
        this.loading = true
        const {data} = await newMemberService.getTotalNewMembers({
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          ...this.filter
        })

        if (data.success) {
          this.pagination.total = data.total
          this.pagination.currentPage = data.page
          this.pagination.limit = data.limit
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        this.members = []
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    async getTags () {
      try {
        this.loading = true
        const {data} = await newMemberService.getListTagByMasterProfile()
        this.tags = data.data.map((item) => {
          return {
            id: item.ErpMemberTag.id,
            name: item.ErpMemberTag.name
          }
        })
      } catch (e) {
        // this.logs = []
      } finally {
        this.loading = false
      }
    },
    handleSelectedRegion (option) {
      this.filter.region = option ? option.map(o => o.id).join(',') : null
    },
    handleProvinceSelected: function (option) {
      this.filter.province = option ? option.map((item) => item.id).join(',') : null
    },
    handleStationSelected: function (option) {
      this.filter.station = option.length ? option.map((item) => item.id).join(',') : null
    },
    handlePositionSelected: function (option) {
      this.filter.position = option ? option.map((item) => item.id).join(',') : null
    },
    handleDepartmentSelected: function (option) {
      this.filter.group = option ? option.map((item) => item.id).join(',') : null
    },
    selectProfileStatus (option) {
      this.filter.status = option ? option.map((item) => item.value).join(',') : null
    },
    handleSelectedWorkType (option) {
      this.filter.workType = option ? option.map(o => o.id).join(',') : null
    },
    resetState () {
      this.filter = {
        code: null,
        name: null,
        region: null,
        province: null,
        station: null,
        group: null,
        position: null,
        status: null,
        workType: null,
        start: null,
        end: null,
        sort: null,
        seniority: null,
        tags: null,
        reset: !this.filter.reset
      }

      this.filterTags = null

      this.pagination = {
        currentPage: 1,
        limit: 3,
        total: 0
      }

      this.getMembers()
    },
    pageChanged (page) {
      this.pagination.currentPage = page
      this.getMembers()
    },
    togglePkgPopup ({pkgOrder, state}) {
      this.pkgPopup = state
      this.pkgOrder = pkgOrder
    },
    toggleNotePopup ({member, state}) {
      this.selectedMember = member
      this.openNote = state
    },
    toggleTicketPopup ({ticketId, state}) {
      this.ticketId = ticketId
      this.openTicket = state
    },
    toggleTagManage ({member, state}) {
      this.tagMember = member
      this.openTagManage = state
    },
    refreshMember () {
      this.getMembers()
      eventBus.$emit('refreshTagMp')
    },
    refreshTags () {
      this.getTags()
    },
    search () {
      this.pagination = {
        currentPage: 1,
        limit: 3,
        total: 0
      }
      this.getMembers()
    },
    updateFilterTags (tags) {
      let tagIds = []

      tags.forEach((tag) => {
        tagIds.push(tag.id)
      })

      this.filter.tags = tagIds
    }
  }
}
