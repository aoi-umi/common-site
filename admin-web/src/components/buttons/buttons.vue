<template>
  <div>
    <el-button
      v-for="(ele, index) in items"
      :key="index"
      :type="getType(ele)"
      :link="isLink(ele)"
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

const props = defineProps({
  defaultType: {
    type: String,
    required: false,
  },
  items: {
    type: Array as PropType<ButtonItem[]>,
  },
})

function getType(ele: ButtonItem, origin?: boolean): any {
  let type = props.defaultType || ele.type
  if (!origin) {
    if (type === 'text') type = 'primary'
  }
  return type
}

function isLink(ele: ButtonItem) {
  return getType(ele, true) === 'text'
}

function handleClick(ele: ButtonItem) {
  if (ele.click) {
    ele.click({ item: ele })
  }
}
</script>
