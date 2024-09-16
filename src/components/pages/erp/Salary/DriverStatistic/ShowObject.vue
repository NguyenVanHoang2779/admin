<template v-if="this.objectData">

  <b-card bg-variant="light" v-if="type !== 'child'">
    <div class="row" v-if="type === 'object'">
      <div v-for="(item, index) in fields" :key="index" class="col-md-4" :style="{marginBottom: 10+'px'}">
        <template v-if="objectData[item.key] !== null && objectData[item.key] !== ''">
            <label :style="{width:'30%', position:'absolute'}">{{item.label}}</label>
            <label :style="{width:'65%', float: 'right'}"><b>{{objectData[item.key] + item.description}}</b></label>
        </template>
      </div>
    </div>

    <div v-else-if="type === 'array'">
      <template>
        <div v-for="(object, index) in objectData" :key="index">
          <ShowObject :objectData="object" :fields="fields" :type="'child'" :indexInArray="index" :numberColumn="2"/>
        </div>
      </template>
    </div>
  </b-card>

  <div class="row" v-else :style="indexInArray !== 0 ?{borderTop:'1px solid #d4d1d1', padding: '10px 0'} : ''">
    <div v-for="(item, index) in fields" :key="index" :style="{marginBottom: 10+'px'}" :class="numberColumn == 2 ? 'col-md-6' : 'col-md-4'">
      <template v-if="objectData[item.key] !== null && objectData[item.key] !== ''">
          <label :style="{width:'30%', position: 'absolutr'}">{{item.label}}</label>
          <label :style="{width:'65%', float: 'right'}"><b>{{objectData[item.key] + item.description}}</b></label>
      </template>
    </div>
  </div>

</template>

<script>
import ShowObject from './ShowObject'

export default {
  name: 'ShowObject',
  components: {
    'ShowObject': ShowObject
  },
  props: {
    objectData: [Object, Array],
    fields: Array,
    type: String,
    indexInArray: 0,
    numberColumn: 0
  }
}
</script>

<style>

</style>
