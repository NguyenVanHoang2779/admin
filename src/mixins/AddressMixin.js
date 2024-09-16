export default {
  data () {
    return {
    }
  },
  methods: {
    getRegions () {
      return [
        {id: 'all', name: 'Cả nước'},
        {id: 'HN', name: 'TP Hà Nội'},
        {id: 'MB', name: 'Miền Bắc'},
        {id: 'MT', name: 'Miền Trung'},
        {id: 'MN', name: 'Miền Nam'},
        {id: 'HCM', name: 'TP HCM'}
      ]
    }
  }
}
