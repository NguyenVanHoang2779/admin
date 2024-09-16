<template>
  <div>
    <b-row>
      <b-col class="mr-0 pr-0">
        <multiselect
          v-model="option"
          :options="options"
          placeholder="Chọn trường so sánh"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="Đã chọn"
          selectLabel="Chọn"
          :allow-empty="false"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </multiselect>
      </b-col>
      <b-col class="mt-1 ml-0 pl-0 mr-0 pr-0">
        <multiselect
          v-model="lv1Option"
          :options="lv1Options"
          placeholder="Chọn trường so sánh"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="Đã chọn"
          selectLabel="Chọn"
          :allow-empty="false"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </multiselect>
      </b-col>
      <b-col v-if="(lv1Option && lv1Option.id === 3) || (lv1Option && lv1Option.id === 4)" class="mt-2 ml-0 pl-0">
        <multiselect
        class="multiselect-primary"
        v-model="lv2Option"
        :options="lv2Options"
        placeholder="Chọn bay/bộ"
        label="name"
        track-by="name"
        selectedLabel="Đã chọn"
        deselectLabel="Đã chọn"
        selectLabel="Chọn"
      >
        <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      </multiselect>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'filter-package-space',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: 1,
        name: 'Nội tỉnh/ liên tỉnh'
      },
      {
        id: 2,
        name: 'Ngày/ tối/ cn'
      },
      {
        id: 3,
        name: 'Giao nội thành/ huyện'
      }
    ],
    lv1Option: null,
    lv1Options: [],
    lv2Option: null,
    lv2Options: [
      {
        id: 1,
        name: 'Bay'
      },
      {
        id: 2,
        name: 'Bộ'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      this.setChildOptions(newValue.id)
    },

    lv1Option: function (newValue, oldValue) {
      let id = newValue.id
      if (newValue.id === 3 || newValue.id === 4) {
        id = this.lv2Option ? newValue.id * 10 + this.lv2Option.id : newValue.id
      }
      this.$emit('handleFilterPackageSpace', id)
    },

    lv2Option: function (newValue, oldValue) {
      let id = newValue ? this.lv1Option.id * 10 + newValue.id : this.lv1Option.id
      this.$emit('handleFilterPackageSpace', id)
    }
  },

  methods: {
    setChildOptions: function (id) {
      switch (id) {
        case 1:
          this.lv1Options = [
            {
              id: 1,
              name: 'Nội tỉnh'
            },
            {
              id: 2,
              name: 'Nội miền'
            },
            {
              id: 3,
              name: 'Đặc biệt'
            },
            {
              id: 4,
              name: 'Liên miền'
            }
          ]
          break
        case 2:
          this.lv1Options = [
            {
              id: 5,
              name: 'Ngày'
            },
            {
              id: 6,
              name: 'Tối'
            },
            {
              id: 7,
              name: 'Chủ Nhật'
            }
          ]
          break
        case 3:
          this.lv1Options = [
            {
              id: 8,
              name: 'Giao nội thành'
            },
            {
              id: 9,
              name: 'Giao huyện'
            }
          ]
          break
      }

      this.lv1Option = this.lv1Options[0]
    }
  }
}
</script>
