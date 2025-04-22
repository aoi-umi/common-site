<template>
  <div>
    <el-button
      v-for="(ele, index) in items"
      :key="index"
      :type="defaultType || (ele.type as any)"
      v-bind="ele"
      @click="handleClick(ele)"
    >
      {{ ele.label }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, PropType } from 'vue'

defineComponent({
  name: 'ButtonsComp',
})

export type ButtonItem = {
  name?: string
  label?: string
  type?: string
  click?: (opt?: { item: ButtonItem }) => any
}

defineProps({
  defaultType: {
    type: String,
    required: false,
  },
  items: {
    type: Array as PropType<ButtonItem[]>,
  },
})

function handleClick(ele: ButtonItem) {
  if (ele.click) {
    ele.click({ item: ele })
  }
}
</script>
