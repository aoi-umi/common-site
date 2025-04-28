<template>
  <div>
    <TableEx
      ref="table"
      :columns="columns"
      :tableProps="{ stripe: true }"
      pagePosition="both"
      :loadFn="loadData"
      :queryProps="queryProps"
      @query-trigger="toQuery"
      :buttons="tableButtons"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { TableEx, TableExInstance } from '@/components'
import { usePlugins } from '@/plugins'

import Base from '../base'
import { AuthorityDataType } from '../authority-mgt'

const { $api, $utils } = usePlugins()
const { gotoPage } = Base()
const $route = useRoute()

export type ApiDataType = {
  id?: string
  name?: string
  method?: string
  path?: string
  authorityList?: AuthorityDataType[]
}

const table = ref<TableExInstance>(null)

const columns = [
  {
    prop: 'path',
    label: 'path',
  },
  {
    prop: 'method',
    label: 'method',
  },
  {
    prop: 'auth',
    label: '权限',
  },
]

const queryProps = [
  {
    prop: 'method',
    label: 'method',
  },
  {
    prop: 'path',
    label: 'path',
  },
]

const tableButtons = [
  {
    name: 'query',
    label: '查询',
    type: 'primary',
    click: () => toQuery({ refresh: true }),
  },
]

const loadData = async (opt) => {
  const model = table.value.model
  const data = $utils.tableExModel2ApiParams({ model })
  const rs = await $api.sysApiQuery({ ...data })

  return {
    total: rs.total,
    data: rs.rows,
  }
}

const toQuery = (opt) => {
  const model = table.value.model
  const query = $utils.tableExModel2Query({ model, refresh: opt.refresh })
  const path = $utils.getUrl({ path: $route.path, query })
  gotoPage(path)
}

const runLoadData = () => {
  if (table.value) {
    $utils.query2TableExModel({ query: $route.query, model: table.value.model })
    table.value.loadData()
  }
}

watch(() => $route.fullPath, runLoadData)

onMounted(runLoadData)
</script>
