<template>
  <Buttons
    :items="[
      {
        name: 'query',
        label: '查询',
        type: 'primary',
        click: () => {
          dialog.toggle()
        },
      },
    ]"
  ></Buttons>
  <ConfirmDialog ref="dialog"> 测试 </ConfirmDialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Buttons, ConfirmDialog } from './components'
const dialog = ref<InstanceType<typeof ConfirmDialog>>(null)
</script>
