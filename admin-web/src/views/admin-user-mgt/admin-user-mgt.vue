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
      :class="cls.dialog"
      append-to-body
      v-model="editDiaVisible"
      :title="editingData?.id ? '修改' : '新增'"
      width="800px"
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
            <el-form-item prop="account">
              <template #label> 账号 </template>
              <el-input
                v-model="editingData.account"
                :disabled="formOpt.account.disabled"
              />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="editingData.nickname"
                :disabled="formOpt.nickname.disabled"
              />
            </el-form-item>
            <el-form-item label="角色" prop="roleList">
              <RoleSelect ref="roleSelect" v-model="roleData" />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <el-button @click="saveClick">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="tsx" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FormInstance } from 'element-plus'

import { TableEx, Tags, Buttons, TableExInstance } from '@/components'
import { cls } from '@/components/styles'
import { QueryOpEnum } from '@/models/enum'
import { usePlugins } from '@/plugins'

import {
  RoleSelect,
  RoleSelectDataType,
  RoleSelectInstance,
  RoleSelectModel,
} from '../comps/role-select'
import Base from '../base'
import { RoleTags } from '../comps/role-tags'
import { UserInfo } from '@/models/user'

const { $api, $utils } = usePlugins()
const { getOpModel, gotoPage } = Base()
const $route = useRoute()

export type AdminUserDataType = UserInfo & { password: string }
const op = ref(
  getOpModel<{ op: string; data: any }>({
    fn: ({ op, data }) => {
      if (op === 'save') return save(data)
    },
  }),
)

const table = ref<TableExInstance>(null)
const form = ref<FormInstance>(null)
const roleSelect = ref<RoleSelectInstance>(null)

const roleData = ref<RoleSelectDataType>({
  list: [],
  value: [],
})

const editingData = ref(null)
const editDiaVisible = ref(false)

const rules = {
  account: [{ required: true }],
  nickname: [{ required: true }],
}

const formOpt = ref({
  account: {
    disabled: false,
  },
  nickname: {
    disabled: false,
  },
})

const columns = [
  {
    type: 'expand',
    render: (params) => {
      const data = params.row
      return <Tags items={data.allAuthorityList}></Tags>
    },
  },
  {
    prop: 'account',
    label: '账号',
  },
  {
    prop: 'nickname',
    label: '昵称',
  },
  {
    prop: 'roleList',
    label: '角色',
    render: (params) => {
      const data = params.row
      return <RoleTags items={data.roleList}></RoleTags>
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
              {
                label: '修改',
                click: () => editClick(data),
              },
            ]}
          />
        </div>
      )
    },
  },
]

const queryProps = [
  {
    prop: 'account',
    label: '账号',
    matchType: QueryOpEnum.$like,
  },
  {
    prop: 'nickname',
    label: '昵称',
    matchType: QueryOpEnum.$like,
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
  const rs = await $api.adminUserMgtQuery({ ...data })

  return {
    total: rs.total,
    data: rs.rows,
  }
}

const addClick = () => {
  editingData.value = getNewData()
  editData()
}

const getNewData = (): AdminUserDataType => ({
  id: null,
  account: '',
  nickname: '',
  password: '',
  roleList: [],
})

const editClick = (row) => {
  editingData.value = { ...row }
  editData()
}

const editData = () => {
  if (editingData.value.id) {
    formOpt.value.account.disabled = true
    formOpt.value.nickname.disabled = true
  } else {
    formOpt.value.account.disabled = false
    formOpt.value.nickname.disabled = false
  }
  roleData.value.list = [
    ...editingData.value.roleList.map((ele) =>
      RoleSelectModel.toTransferData(ele),
    ),
  ]
  roleData.value.value = roleData.value.list.map((ele) => ele.key)
  form.value?.resetFields()
  roleSelect.value?.reset()
  editDiaVisible.value = true
}

const saveClick = async () => {
  const rs = await op.value.run({ op: 'save', data: editingData.value })
  if (rs.success) runLoadData()
}

const save = async (data) => {
  const roleList = roleData.value.list
    .filter((ele) => roleData.value.value.includes(ele.key))
    .map((ele) => ({ id: ele.data.id }))
  data.roleList = roleList
  if (editDiaVisible.value) await $utils.validateForm(form.value)
  if (!data.id) await $api.adminUserMgtCreate(data)
  else await $api.adminUserMgtUpdate(data)
  editDiaVisible.value = false
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

watch(() => $route.path, runLoadData)

onMounted(runLoadData)
</script>
