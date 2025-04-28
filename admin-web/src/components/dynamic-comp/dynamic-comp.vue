<template>
  <div class="root">
    <el-select
      v-if="typeSelectable"
      class="select-type"
      v-model="currType"
      clearable
    >
      <el-option
        v-for="ele in componentTypes"
        :key="ele"
        :value="ele"
      ></el-option>
    </el-select>
    <component
      :is="componentType"
      v-model="model"
      v-bind="compProps"
      v-if="componentType"
    >
      <template v-if="currType === 'select'">
        <el-option
          v-for="(ele, index) in compData"
          :key="index"
          v-bind="ele"
        ></el-option>
      </template>
    </component>
    <template v-else>
      {{ model }}
    </template>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from 'vue'

defineComponent({
  name: 'DynamicComp',
})
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  typeSelectable: {
    type: Boolean,
  },
  compProps: {
    type: Object,
    required: false,
  },
  compData: {
    type: Array<any>,
    required: false,
  },
})
const model = defineModel()

const componentTypes = ['input', 'select']
const currType = ref(props.type)
const componentType = computed(() => {
  if (currType.value) return `el-${currType.value}`
  return null
})
</script>

<style scoped lang="less">
.root {
  display: flex;
  > * {
    width: 100%;
  }
}
.select-type {
  width: 100px;
}
</style>
