<template>
  <el-select v-model="model" clearable filterable class="select">
    <template #prefix>
      <component :is="model" class="prefix" />
    </template>
    <el-option
      v-for="(ele, index) in Icons"
      :key="index"
      :value="ele"
      class="item"
    >
      <component :is="ele" class="item-icon" />
      <span class="item-text">{{ ele }}</span>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import { Icons } from './data'

defineComponent({
  name: 'IconSelect',
})

const model = defineModel()
</script>

<style scoped lang="less">
.prefix {
  width: 1rem;
}
.item {
  display: flex;
  align-items: center;
}
.item-icon {
  width: 1rem;
}
.item-text {
  margin-left: 10px;
}
</style>
