<template>
        <div>
            <b-form-row class="my-1">
                <b-col md="2" class="align-items">
                    <label>Điểm dừng {{index + 1}} <span class='red-text'>(*)</span>:</label>
                </b-col>
                <b-col md="8">
                    <single-select-route-point @onChange="selectedRoute" :point="point" :region="region" :provinceId="provinceId"></single-select-route-point>
                </b-col>
                <b-col md="2" class="align-items">
                    <b-btn class="btn btn-md btn-outline-danger" @click="deletePoint(index)"><i class="ion ion-md-trash"></i></b-btn>
                </b-col>
            </b-form-row>
        </div>
</template>

<script>
import SingleSelectRoutePoint from 'components/elements/common/SingleSelectRoutePoint'

export default {
  name: 'StopRoute',
  components: {
    SingleSelectRoutePoint
  },
  props: [
    'point',
    'index',
    'region',
    'provinceId'
  ],
  data: () => ({
    searchRoute: null
  }),

  created () {
  },

  computed: {
  },

  watch: {
    searchRoute: {
      deep: true,
      handler (newVal, oldVal) {
        this.$emit('updateRoute', newVal)
      }
    }
  },

  methods: {
    selectedRoute (option) {
      this.searchRoute = option
    },

    deletePoint: function () {
      this.$emit('deletePointRow', this.index)
    }
  }
}
</script>

<style lang="scss">
    .sperator-right {
        border-right: 1px solid rgba(0, 0, 0, 0.2)
    }
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
    .align-items {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
