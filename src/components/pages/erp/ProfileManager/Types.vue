<template>
  <div class="list" v-loading="loading">
    <div class="list-header">
      <div>
        <b>Mã hồ sơ</b>
      </div>
      <div>
        <b>Hồ sơ</b>
      </div>
      <div>
        <b>Loại hồ sơ</b>
      </div>
      <div>
        <b>Phương thức ràng buộc</b>
      </div>
      <div>
        <b>Số trang tối thiểu</b>
      </div>
      <div>
        <b>Dấu xác nhận</b>
      </div>
      <div>
        <b>Deadline</b>
      </div>
      <div>
        <b>Ghi chú</b>
      </div>
      <div>
        <b>Hành động</b>
      </div>
    </div>
    <div class="list-line" v-for="(item, index) in list" :key="`item-${index}`">
      <div>
        {{ `HS${item.ErpDocument.id}` }}
      </div>
      <div>
        {{ item.ErpDocument.name }}
      </div>
      <div>
        {{ item.ErpDocument.sub_type || 'Chưa xác định' }}
      </div>
      <div>
        {{ item.ErpDocument.config || 'Không' }}
      </div>
      <div>
        {{ item.ErpDocument.num_of_pages || '1' }}
      </div>
      <div>
        {{ item.ErpDocument.confirmed_stamp ? configTimestamp[item.ErpDocument.confirmed_stamp] : '-' }}
      </div>
      <div>
        {{ item.ErpDocument.deadline || 'Không'}}
      </div>
      <div>
        {{ item.ErpDocument.note || 'Không'}}
      </div>
      <div>
        <b-button variant="success" size="sm" @click="edit(item.ErpDocument)">
          <i class="ion ion-md-create"></i>
        </b-button>
        <b-button variant="danger" size="sm" @click="remove(item.ErpDocument.id)">
          <i class="ion ion-md-trash"></i>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      configTimestamp: {
        anh_dau_do: 'Ảnh, dấu đỏ',
        dau_do: 'Dấu đỏ'
      }
    }
  },
  props: ['list', 'loading'],
  methods: {
    remove (id) {
      this.$emit('deleteDocumentType', id)
    },
    edit (data) {
      this.$emit('editDocumentType', data)
    }
  }
}
</script>
<style scoped lang="scss">
.list{
  border: solid #f8f9fa;
  background-color: #fff;
  margin-bottom: 2vh;
  padding: 1.5rem;
  &-header,&-line{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
  }

  &-header{
    margin-bottom: 2vh;
  }

  &-line{
    border-top: 1px solid #dee2e6;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  &-line:hover{
    color: #212529;
    background-color: rgba(0,0,0,.075);
  }
}
</style>
