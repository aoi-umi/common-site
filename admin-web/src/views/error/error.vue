<template>
  <el-card>
    <el-result :title="title || 'Not Found'" icon="error" />
  </el-card>
</template>

<script lang="ts" setup>
import { defineComponent, PropType } from 'vue'

defineComponent({
  name: 'ErrorView',
})

defineProps({
  title: {
    type: String as PropType<string>,
    required: false,
  },
})
</script>
