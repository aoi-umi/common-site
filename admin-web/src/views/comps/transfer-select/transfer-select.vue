<template>
  <div class="root">
    <el-autocomplete
      ref="queryInput"
      :model-value="inputValue"
      :fetch-suggestions="fetchSuggestions"
      clearable
      popper-class="transfer-select-popper"
      @input="
        (v) => {
          if (isQueryClick) {
            isQueryClick = false
            return
          }
          inputValue = v
        }
      "
    >
      <template #default="{ item }">
        <span style="display: flex" @click.stop="select(item as any)">
          {{ item.data.text }} ({{ item.data.name }})
        </span>
      </template>
    </el-autocomplete>
    <el-transfer
      filterable
      :titles="['移除', '已选择']"
      :data="model.list"
      v-model="model.value"
    >
      <template #default="{ option }">
        <el-tooltip :content="option.label">
          <span>{{ option.label }}</span>
        </el-tooltip>
      </template>
    </el-transfer>
  </div>
</template>

<script lang="ts" setup generic="T">
import { PropType, ref } from 'vue'
import {
  TransferData,
  TransferQueryDataType,
  TransferSelectDataType,
} from './model'

const props = defineProps({
  query: {
    type: Function as PropType<(queryString: string) => Promise<any[]>>,
    required: true,
  },
  toTransferData: {
    type: Function as PropType<(data: T) => TransferData<T>>,
    required: true,
  },
})

const model = defineModel<TransferSelectDataType>({ required: true })
const inputValue = ref('')
const isQueryClick = ref(false)

const fetchSuggestions = async (queryString: string) => {
  try {
    const result = await props.query(queryString)
    const data = result.map((ele) => ({
      value: ele.text,
      data: ele,
    }))
    return data
  } catch (e) {
    return []
  }
}

const select = (row: TransferQueryDataType) => {
  isQueryClick.value = true
  const data = row.data
  const matched = model.value.list.find((ele) => ele.key === data.name)
  if (!matched) {
    model.value.list.push(props.toTransferData(data))
  }
  const matchedValue = model.value.value.find((ele) => ele === data.name)
  if (!matchedValue) model.value.value.push(data.name)
}

const reset = () => {
  inputValue.value = ''
}

defineExpose({
  reset,
})
</script>
<style scoped lang="less">
.root > * {
  margin: 5px 0 !important;
}
</style>
<style lang="less">
.transfer-select-popper {
  &,
  & .el-autocomplete-suggestion {
    background-color: #ffffff90 !important;
  }
}
</style>
