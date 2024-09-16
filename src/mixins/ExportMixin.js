import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  methods: {
    checkPermissionExportAllPage () {
      return this.userInfo && this.userInfo.hasOwnProperty('User') &&
        ['ngoctv5', 'namtt11', 'itninhnt', 'itphihv1'].includes(this.userInfo.User.username)
    }
  }
}
