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
    <Tags
      :items="[
        {
          name: 'test',
          text: '测试',
        },
        {
          name: 'test1',
          text: '测试2',
          status: true,
        },
      ]"
    ></Tags>
    <TableEx
      ref="table"
      :queryProps="[
        {
          prop: 'test',
          label: 'test',
        },
      ]"
      :columns="[
        {
          prop: 'col1',
          label: 'col1',
        },
        {
          prop: 'col2',
          label: '第二列',
        },
        {
          prop: 'col3',
          label: '3',
          fixed: 'right',
        },
      ]"
      :load-fn="
        ({ model }) => {
          console.log(model.value.query)
          return {
            success: true,
            total: 11,
            data: [
              {
                col1: 'col1 data1',
                col2: 'col2 data1',
              },
              {
                col1: 'col1 data2',
                col2: 'col2 data2',
              },
            ],
          }
        }
      "
      @query-trigger="
        (opt) => {
          table.loadData()
        }
      "
      pagePosition="both"
    ></TableEx>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Buttons,
  ConfirmDialog,
  DynamicComp,
  IconSelect,
  TableEx,
  Tags,
} from './components'
const dialog = ref<InstanceType<typeof ConfirmDialog>>(null)
const dynamicComp = ref('value')
const iconSelect = ref()
const table = ref<InstanceType<typeof TableEx>>(null)
onMounted(async () => {
  table.value.loadData()
})
</script>
<style lang="less" scoped>
.root {
  > * {
    margin-bottom: 10px;
  }
}
</style>
