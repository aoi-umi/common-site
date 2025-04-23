<template>
  <div
    class="root"
    v-key-input="{
      key: 'enter',
      fn: () => {
        console.log('enter')
      },
    }"
  >
    <div>
      <div>dynamic-comp: {{ dynamicComp }}</div>
      <div>icon-select: {{ iconSelect }}</div>
    </div>
    <el-input v-model="dynamicComp" />
    <ConfirmDialog ref="dialog"> 测试 </ConfirmDialog>
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
    <DynamicComp
      type-selectable
      type="input"
      v-model="dynamicComp"
      :comp-props="{ style: 'width: 200px' }"
    ></DynamicComp>
    <IconSelect v-model="iconSelect"></IconSelect>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Buttons, ConfirmDialog, DynamicComp, IconSelect } from './components'
const dialog = ref<InstanceType<typeof ConfirmDialog>>(null)
const dynamicComp = ref('value')
const iconSelect = ref()
</script>
<style lang="less" scoped>
.root {
  > * {
    margin-bottom: 10px;
  }
}
</style>
