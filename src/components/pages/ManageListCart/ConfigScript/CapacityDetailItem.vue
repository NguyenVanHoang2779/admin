<template>
  <div>
    <div>
      <b-form-row class="mt-2" v-for="(packageConfig, index) in packageConfigs" :key="index">
        <b-col sm="4" class="d-flex flex-row">
          <div class="mr-1 d-flex align-items-center">
            <span class="d-inline-block">{{ index + 1 }}.</span>
          </div>
          <select-special-package-capacity
            class="multiselect"
            :type="'service'"
            :placeholder="'Chọn loại đơn đặc biệt'"
            :options="getPackageSpecialOptions"
            :showCurrentSelectedInOptionList="true"
            @onChange="handleSelectService($event, index)"
            ref="serviceComponent"
            :selected="getSelectedService(index)"
          ></select-special-package-capacity>
        </b-col>
        <b-col sm="4" class="d-flex flex-row">
          <multiselect
            class="multiselect"
            v-model="packageConfig.capacity"
            placeholder="Chọn số lượng đơn đặc biệt"
            :options="getOptions(codCapacity + 1)"
            :multiple="false"
            :custom-label="customLabelCapacity"
            :allow-empty="false"
            deselect-label="Đang chọn"
            selected-label="✓"
            select-label="✓"
          />
        </b-col>

        <b-col sm="4">
          <div class="d-flex flex-row">
            <multiselect
              class="multiselect"
              v-model="packageConfig.weight"
              placeholder="Chọn khối lượng đơn đặc biệt"
              :options="getOptions(maxWeight + 1)"
              :multiple="false"
              :custom-label="customLabelWeight"
              :allow-empty="false"
              deselect-label="Đang chọn"
              selected-label="✓"
              select-label="✓"
            />

            <div class="ml-1">
              <b-button
                style="height: 100%"
                variant="outline-danger"
                size="sm"
                @click.prevent="deleteScript(index)"
              ><i class="fas fa-trash"/>
              </b-button>
            </div>
          </div>
        </b-col>
      </b-form-row>
    </div>

    <b-button
      class="mt-2 mr-lg-2 float-right"
      variant="outline-success"
      size="sm"
      @click.prevent="addScript()"
      :disabled="false"
    >
      <i class="fas fa-plus"/>
    </b-button>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'
import SelectSpecialPackageCapacity from '../../../elements/common/SelectSpecialPackageCapacity'

export default {
  components: {
    SelectSpecialPackageCapacity,
    multiselect,
    DeliveryScript
  },
  name: 'CapacityDetailItem',
  props: {
    packageConfigs: {
      type: Array,
      required: true
    },
    codCapacity: {
      type: Number,
      required: true
    },
    maxWeight: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    scriptCategory: {
      task: true
    },
    packageSpecialOptions: DeliveryScript.packageSpecialCapacity
  }),
  mounted () {
  },
  created () {
  },
  methods: {
    /**
     * Xóa config đơn đặc biệt
     * @param index
     */
    deleteScript (index) {
      this.packageConfigs.splice(index, 1)
    },

    /**
     * Thêm cpnfig mới cho đơn đặc biệt
     */
    addScript () {
      if (this.packageConfigs.length < this.packageSpecialOptions.length) {
        this.packageConfigs.push({
          capacity: 0,
          weight: 0,
          package_type: {}
        })
      }
    },

    /**
     * Lấy options có thể chọn
     * @returns {unknown[]|*[]}
     */
    getOptions (maxValue) {
      return Array.from({length: maxValue}, (_, i) => i)
    },

    /**
     *
     * @param obj
     * @returns {string}
     */
    customLabelCapacity (obj) {
      return `SL: ${obj}`
    },

    /**
     *
     * @param obj
     * @returns {string}
     */
    customLabelWeight (obj) {
      return `KL: ${obj}`
    },

    handleSelectService (option, index) {
      if (option) {
        this.packageConfigs[index].package_type = this.packageSpecialOptions.filter(packageType => option.includes(packageType.value))[0]
      } else {
        this.packageConfigs[index].package_type = {}
      }
    },

    getSelectedService (index) {
      if (this.packageConfigs[index]) {
        return this.packageSpecialOptions.filter(packageType => (this.packageConfigs[index].package_type === undefined ? 0 : this.packageConfigs[index].package_type.value) === packageType.value)
      }
      return []
    }
  },

  computed: {
    getPackageSpecialOptions () {
      const specialPackageIds = this.packageConfigs.map((packageType) => (packageType.package_type === undefined ? 0 : packageType.package_type.value)).flat()
      const filteredSpecialPackages = this.packageSpecialOptions.filter((packageType) => {
        return !specialPackageIds.includes(packageType.value)
      })
      return filteredSpecialPackages
    }
  }
}
</script>

<style scoped>
</style>
