<template>
  <div class="col-lg-9 col-sm-12 col-md-12 border p-2">
    <p>Kết quả tìm kiếm</p>
    <div class="team-name text-center" v-if="loading">
      <i v-if="loading" class="fas fa-spinner fa-pulse text-success ml-auto mr-1"></i>
    </div>
    <div v-else>
      <div class="team-name text-center" v-if="searchResult.length < 1">
        Không có dữ liệu
      </div>
      <div class="team-name d-flex justify-content-between cursor-pointer" v-else v-for="team in searchResult" :key="team.id"
           @click="goToTeam(team)"
      >
        <div v-if="team.array_path_name.length > 0">
                <span v-for="(value,index) in team.array_path_name" :key="index">
                  <span class="no-active" v-if="index !== team.array_path_name.length - 1">{{ value }} / </span>
                  <span v-else>{{ value }}</span>
                </span>
        </div>
        <div v-else>
          <span>{{ team.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchTeam',
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: false
    },
    searchResult: {
      type: Array | Object,
      default: [],
      required: false
    }
  },
  methods: {
    goToTeam (team) {
      this.$emit('goToTeam', team)
    }
  }
}
</script>

<style scoped>
  i {
    color: #646363;
  }
  .team-name {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 10px;
    box-sizing: border-box;
  }
  .no-active {
    color: #A4A0A0;
  }
</style>
