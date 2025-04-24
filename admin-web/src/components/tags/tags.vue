<template>
  <div class="box">
    <el-tag
      v-for="(ele, index) in items"
      :key="index"
      :type="!ele.status ? 'info' : 'primary'"
      disable-transitions
    >
      {{ ele.text }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, PropType } from 'vue'

export type TagItem = {
  name?: string
  text?: string
  status?: boolean | number
}

defineComponent({
  name: 'TagsComp',
})
defineProps({
  items: {
    type: Array as PropType<TagItem[]>,
    required: true,
  },
})
</script>

<style scoped lang="less">
.box {
  display: inline-block;
  > * {
    margin-right: 10px;
  }
}
</style>
