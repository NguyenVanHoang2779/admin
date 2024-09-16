<template>
  <div>
    <div class="form-filter" v-for="(scriptCategory, index) in scriptCategories" :key="index">
      <b-form-row class="mt-2">
        <b-col sm="4" class="d-flex flex-row">
          <div class="mr-1 d-flex align-items-center">
            <span class="d-inline-block">{{ index + 1 }}.</span>
          </div>
          <multiselect
            class="multiselect"
            v-model="scriptCategory.task"
            placeholder="Chọn loại kịch bản"
            track-by="id"
            label="text"
            :options="TaskOptions"
            :allow-empty="false"
            :multiple="false"
            select-label="✓"
            deselect-label="✗"
            selected-label="✓"
            open-direction="bottom"
          />
        </b-col>

        <b-col sm="8">
          <div class="d-flex flex-row">
            <multiselect
              v-if="scriptCategory.task.id === DeliveryScript.checkComingPackageTask"
              class="multiselect"
              v-model="comingPackageOptions"
              placeholder="Chọn chi tiết kịch bản Check đơn coming"
              @click.native="doShowOptionPopup(index)"
              :options="[]"
              :searchable="false"
              :showNoOptions="false"
              :multiple="true">
              <template slot="tag" slot-scope="{ option, remove }"><span class="border-radius-1 d-inline-block bg-light nowrap px-2 pt-1 mr-1 mb-1"><span>{{ option.name }}</span></span></template>
            </multiselect>
            <multiselect
              v-else
              v-model="scriptCategory.tags"
              placeholder="Chọn chi tiết kịch bản"
              track-by="id"
              label="text"
              open-direction="bottom"
              :options="TagOptions[scriptCategory.task.id || 0] || []"
              :multiple="true"
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
          <multiselect
            class="mt-2"
            v-model="scriptCategory.actions"
            placeholder="Chọn thao tác"
            track-by="id"
            label="text"
            open-direction="bottom"
            :options="ActionOptions[scriptCategory.task.id || 0] || []"
            :multiple="true"
          />
        </b-col>
      </b-form-row>
    </div>

    <b-button
      class="mt-2 mr-lg-2 float-right"
      variant="outline-success"
      size="sm"
      @click.prevent="addScript()"
      :disabled="isDisabledAddScript"
    >
      <i class="fas fa-plus"/>
    </b-button>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'

export default {
  components: {
    multiselect,
    DeliveryScript
  },
  name: 'ScriptDetailItem',
  props: {
    scriptCategories: {
      type: Array,
      required: true
    },
    TaskOptions: {
      type: Array,
      required: true
    },
    TagOptions: {
      type: Object,
      required: true
    },
    ActionOptions: {
      type: Object,
      required: true
    }
  },
  data: () => ({
  }),
  mounted () {
  },
  methods: {
    /**
     * Xóa kịch bản
     * @param index
     */
    deleteScript (index) {
      this.scriptCategories.splice(index, 1)
    },

    /**
     * Thêm kịch bản mới
     */
    addScript () {
      if (this.scriptCategories.length < this.TaskOptions.length) {
        this.scriptCategories.push({
          task: {},
          types: {},
          actions: []
        })
      }
    },
    doShowOptionPopup (taskElementOrder) {
      this.$emit('showOptionPopup', taskElementOrder)
    }
  },

  computed: {
    DeliveryScript () {
      return DeliveryScript
    },
    /**
     *
     * @returns {boolean}
     */
    isDisabledAddScript () {
      return this.scriptCategories.length >= this.TaskOptions.length
    },
    comingPackageOptions () {
      const typesObj = this.scriptCategories.find(category => category.task.id === 1).types
      return Object.values(typesObj).flat()
    }
  }
}
</script>

<style scoped>
.order-class {
  max-width: 40px !important;
}
</style>
