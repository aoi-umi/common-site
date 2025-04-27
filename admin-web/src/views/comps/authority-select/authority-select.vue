<template>
  <TransferSelect
    ref="select"
    v-model="model"
    :query="authQuery"
    :to-transfer-data="AuthoritySelectModel.toTransferData"
  ></TransferSelect>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { usePlugins } from '@/plugins'
import { QueryOpEnum } from '@/models/enum'
import { AuthorityDataType } from '@/views/authority-mgt'
import {
  TransferData,
  TransferSelect,
  TransferQueryDataType,
  TransferSelectDataType,
  TransferSelectInstance,
} from '../transfer-select'
import { AuthoritySelectModel } from './model'

const { $api } = usePlugins()

export type AuthorityTransferData = TransferData<AuthorityDataType>
export type AuthorityQueryDataType = TransferQueryDataType<AuthorityDataType>
export type AuthoritySelectDataType = TransferSelectDataType<AuthorityDataType>

const model = defineModel<AuthoritySelectDataType>({ required: true })
const select = ref<TransferSelectInstance>()

const authQuery = async (queryString: string) => {
  queryString = queryString.trim()
  const queryData: any = {
    where: {
      status: 1,
    },
  }
  if (queryString) {
    const like = `%${queryString}%`
    queryData.where[QueryOpEnum.$or] = [
      { name: { [QueryOpEnum.$like]: like } },
      { text: { [QueryOpEnum.$like]: like } },
    ]
  }
  const rs = await $api.sysAuthorityQuery(queryData)
  return rs.rows
}

const reset = () => {
  return select.value?.reset()
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
