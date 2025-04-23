<template>
  <div class="root">
    <el-input v-model="v" />
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
    <div>
      <DynamicComp
        type-selectable
        type="input"
        v-model="v"
        :comp-props="{ style: 'width: 200px' }"
      ></DynamicComp>
    </div>
    <ConfirmDialog ref="dialog"> 测试 </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Buttons, ConfirmDialog, DynamicComp } from './components'
const dialog = ref<InstanceType<typeof ConfirmDialog>>(null)
const v = ref('value')
</script>
<style lang="less" scoped>
.root {
  > * {
    margin-bottom: 10px;
  }
}
</style>
