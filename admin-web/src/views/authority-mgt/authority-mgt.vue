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
    <el-dialog
      append-to-body
      v-model="editDiaVisible"
      :title="editingData?.id ? '修改' : '新增'"
    >
      <template v-if="editingData">
        <div v-loading="op.loading">
          <el-form
            ref="form"
            :model="editingData"
            :rules="rules"
            label-position="top"
            inline
          >
            <el-form-item prop="name">
              <template #label>
                名称
                <el-button
                  v-if="formOpt.name.showDisabled"
                  type="primary"
                  link
                  @click="toggleNameEdit"
                >
                  {{ formOpt.name.disabled ? '修改' : '取消' }}
                </el-button>
              </template>
              <el-input
                v-model="editingData.name"
                :disabled="formOpt.name.disabled"
              />
            </el-form-item>
            <el-form-item label="显示" prop="text">
              <el-input v-model="editingData.text" />
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
              <el-switch v-model="editingData.status" />
            </el-form-item>
          </el-form>
          <div>
            <el-button @click="saveClick">保存</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="tsx" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FormInstance } from 'element-plus'

import { TableEx, Buttons, TableExInstance } from '@/components'
import { QueryOpEnum } from '@/models/enum'
import { usePlugins } from '@/plugins'
import { Confirm } from '@/components/decorator'

import Base from '../base'

const { $api, $utils } = usePlugins()
const { getOpModel, gotoPage } = Base()
const $route = useRoute()

export type AuthorityDataType = {
  id?: string
  name?: string
  text?: string
  status?: boolean
}

const op = ref(
  getOpModel<{ op: string; data: any }>({
    fn: ({ op, data }) => {
      if (op === 'save') return save(data)
      if (op === 'del') return del(data)
    },
  }),
)

const editingData = ref(null)
const editDiaVisible = ref(false)

const rules = {
  name: [{ required: true }],
  text: [{ required: true }],
}

const formOpt = ref({
  name: {
    showDisabled: false,
    disabled: false,
  },
})

const columns = [
  {
    prop: 'name',
    label: '名字',
  },
  {
    prop: 'text',
    label: '显示',
  },
  {
    prop: 'status',
    label: '状态',
    render: (params) => {
      return <span>{params.row.status ? '启用' : '禁用'}</span>
    },
  },
  {
    prop: 'op',
    label: '操作',
    fixed: 'right',
    width: '140',
    render: (params) => {
      const data = params.row
      return (
        <div>
          <Buttons
            defaultType="text"
            items={[
              { label: '修改', click: () => editClick(data) },
              {
                label: data.status ? '禁用' : '启用',
                click: () => enableToggleClick(data),
              },
              { label: '删除', click: () => delClick(data) },
            ]}
          />
        </div>
      )
    },
  },
]

const queryProps = [
  {
    prop: 'name',
    label: '名字',
    matchType: QueryOpEnum.$like,
  },
  {
    prop: 'text',
    label: '显示',
    matchType: QueryOpEnum.$like,
  },
  {
    prop: 'status',
    label: '状态',
    propType: 'select',
    data: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
]

const tableButtons = [
  {
    name: 'query',
    label: '查询',
    type: 'primary',
    click: () => toQuery({ refresh: true }),
  },
  {
    name: 'add',
    label: '添加',
    click: () => addClick(),
  },
]

const loadData = async (opt) => {
  const model = table.value.model
  const data = $utils.tableExModel2ApiParams({ model })
  const rs = await $api.sysAuthorityQuery({ ...data })
  return {
    total: rs.total,
    data: rs.rows,
  }
}

class FunctionWrapper {
  @Confirm((data) => `确认删除[${data.text}(${data.name})]?`)
  static async delClick(data: AuthorityDataType) {
    const rs = await op.value.run({ op: 'del', data })
    if (rs.success) runLoadData()
  }
}

const addClick = () => {
  editingData.value = getNewData()
  editData()
}

const editClick = (row) => {
  editingData.value = { ...row }
  editData()
}

const editData = () => {
  if (editingData.value.id) {
    formOpt.value.name = {
      ...formOpt.value.name,
      disabled: true,
      showDisabled: true,
    }
  } else {
    formOpt.value.name = {
      ...formOpt.value.name,
      disabled: false,
      showDisabled: false,
    }
  }
  editDiaVisible.value = true
}

const saveClick = async () => {
  const rs = await op.value.run({ op: 'save', data: editingData.value })
  if (rs.success) runLoadData()
}

const save = async (data) => {
  if (editDiaVisible.value) await $utils.validateForm(form.value)
  if (!data.id) await $api.sysAuthorityCreate(data)
  else await $api.sysAuthorityUpdate(data)
  editDiaVisible.value = false
}

const enableToggleClick = async (data) => {
  const rs = await op.value.run({
    op: 'save',
    data: { id: data.id, status: !data.status },
  })
  if (rs.success) runLoadData()
}

const delClick = FunctionWrapper.delClick

const del = async (data) => {
  await $api.sysAuthorityDelete({ id: data.id })
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

const getNewData = (): AuthorityDataType => ({
  id: null,
  name: '',
  text: '',
  status: true,
})

const toggleNameEdit = () => {
  formOpt.value.name.disabled = !formOpt.value.name.disabled
  if (formOpt.value.name.disabled) {
    editingData.value.name = originalData.value.name
  }
}

const table = ref<TableExInstance>(null)
const form = ref<FormInstance>(null)
const originalData = ref(null)

watch(() => $route.fullPath, runLoadData)

onMounted(runLoadData)
</script>
