<template>
  <div v-loading="op.loading">
    <div class="header">
      <el-row class="query-fields" :gutter="5">
        <el-col
          v-for="(ele, index) in queryProps"
          :key="index"
          :xs="24"
          :sm="6"
          :md="4"
        >
          <span class="query-field-label">{{ ele.label }}</span>
          <DynamicComp
            :type="ele.propType || 'input'"
            v-model="model.query[ele.prop].value"
            v-key-input="{
              key: 'enter',
              fn: () => queryTrigger({ refresh: true }),
            }"
            :compProps="{ clearable: true, placeholder: ele.label }"
            :compData="ele.data"
          />
        </el-col>
      </el-row>
      <div v-if="buttons" class="buttons">
        <Buttons :items="buttons" />
      </div>
    </div>

    <div v-if="errMsg">
      <el-card>
        <el-result title="出错了" :subTitle="errMsg" icon="error" />
      </el-card>
    </div>
    <div v-else>
      <div v-if="['top', 'both'].includes(pagePosition)">
        <component :is="pagination()"></component>
      </div>

      <el-table v-bind="tableProps">
        <el-table-column v-for="(ele, index) in cols" :key="index" v-bind="ele">
          <template v-if="ele.render" #default="{ row }">
            <component :is="ele.render({ row })"></component>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="['bottom', 'both'].includes(pagePosition)">
        <component :is="pagination()"></component>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { defineComponent, PropType, Ref, ref, watch } from 'vue'
import { OperateModel } from '@/utils'
import { Buttons, DynamicComp } from '..'
import { TableExModel, TableExQuery } from './model'

export type TableExColumnProp = {
  prop?: string
  label?: string
  className?: string
  labelClassName?: string
  fixed?: boolean | string
  width?: string
  type?: string
  render?: (row: any) => any
}

defineComponent({
  name: 'TableEx',
})

const props = defineProps({
  tableProps: Object,
  columns: Array as () => TableExColumnProp[],
  queryProps: Array as () => TableExQuery[],
  buttons: Array,
  loadFn: Function as PropType<
    (opt: { model: Ref<TableExModel> }) => any | Promise<any>
  >,
  pagePosition: {
    type: String as PropType<'top' | 'bottom' | 'both' | ''>,
    default: '',
  },
})
const emit = defineEmits<{
  queryTrigger: [{ refresh?: boolean }]
}>()
const model = ref(new TableExModel({ queryProps: props.queryProps }))
const op = ref(
  new OperateModel({
    noDefaultHandler: true,
    fn: async () => {
      return loadDataFn()
    },
  }),
)
const cols = ref(props.columns || [])
const errMsg = ref('')

const queryTrigger = (opt?: { refresh?: boolean }) => {
  emit('queryTrigger', { ...opt })
}

const loadData = async () => {
  errMsg.value = ''
  let rs = await op.value.run()
  if (!rs.success) errMsg.value = rs.msg
  return rs
}

const loadDataFn = async () => {
  if (props.loadFn) {
    return props.loadFn({ model })
  }
}

const pagination = () => (
  <el-pagination
    class="page"
    background
    layout="total, sizes, prev, pager, next, jumper"
    hideOnSinglePage
    total={model.value.total}
    v-model:currentPage={model.value.page.index}
    v-model:pageSize={model.value.page.size}
  />
)

watch(
  () => props.columns,
  (newVal) => {
    cols.value = newVal || []
  },
  { immediate: true },
)

watch(
  () => model.value.page.index,
  () => queryTrigger(),
)

watch(
  () => model.value.page.size,
  () => queryTrigger(),
)

defineExpose({
  model,
  loadData,
})
</script>

<style scoped lang="less">
.header {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.query-fields {
  > * {
    margin-bottom: 5px;
  }
}
.query-field-label {
  font-size: 10px;
}
.buttons {
  display: flex;
  justify-content: flex-end;
}
.page {
  display: flex;
  justify-content: flex-end;
  margin: 5px 0;
}
</style>
