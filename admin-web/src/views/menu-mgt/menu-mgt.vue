<template>
  <div>
    <Load :loadFn="loadData">
      <template #default>
        <div class="root" v-loading="op.loading">
          <div>
            <Buttons
              :items="[
                {
                  label: '新增',
                  type: 'primary',
                  click: () => addClick(),
                },
              ]"
            />
          </div>
          <el-divider />
          <el-tree
            ref="tree"
            :data="menuData"
            :props="{ children: 'children', label: 'text' }"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
          >
            <template v-slot="{ data, node }">
              <div class="tree-node">
                <span :class="{ disabled: !data.status }">
                  <i :class="data.icon"></i>
                  <span>{{ data.text }} ({{ data.name }})</span>
                </span>
                <span :class="cls.wrap"></span>
                <div style="width: 180px">
                  <Tags :items="data.authorityList" />
                </div>
                <div class="op-box">
                  <Buttons
                    defaultType="text"
                    :items="[
                      { label: '添加', click: () => addClick(data) },
                      { label: '编辑', click: () => editClick(data) },
                      {
                        label: data.status ? '禁用' : '启用',
                        click: () => enableToggleClick(data),
                      },
                      { label: '删除', click: () => delClick(data, node) },
                    ]"
                  />
                </div>
                <div>
                  <Buttons
                    defaultType="text"
                    :items="[
                      { label: '上移', click: () => moveClick(data, 'moveUp') },
                      {
                        label: '下移',
                        click: () => moveClick(data, 'moveDown'),
                      },
                    ]"
                  />
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </template>
    </Load>

    <el-dialog
      :class="cls.dialog"
      :title="editingData?.id ? '修改' : '新增'"
      v-model="editDiaVisible"
      append-to-body
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
            <el-form-item label="名称" prop="name">
              <el-input v-model="editingData.name" />
            </el-form-item>
            <el-form-item label="显示" prop="text">
              <el-input v-model="editingData.text" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <IconSelect v-model="editingData.icon" />
            </el-form-item>
            <el-form-item label="页面" prop="pageName">
              <el-select v-model="editingData.pageName" clearable filterable>
                <el-option
                  v-for="ele in loadedData.pages"
                  :key="ele.name"
                  :value="ele.name"
                  :label="ele.text"
                />
              </el-select>
            </el-form-item>
            <div class="break-line"></div>
            <el-form-item label="启用状态" prop="status">
              <el-switch v-model="editingData.status" />
            </el-form-item>
            <div class="break-line"></div>
            <el-form-item label="权限">
              <AuthoritySelect ref="authSelect" v-model="authData" />
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
<script lang="ts" setup>
import * as ElementUI from 'element-plus'
import { ref, reactive } from 'vue'

import { usePlugins } from '@/plugins'
import { Buttons, IconSelect, Load, Tags } from '@/components'
import { cls } from '@/components/styles'
import Base from '@/views/base'
import {
  AuthoritySelect,
  AuthoritySelectInstance,
  AuthoritySelectModel,
} from '../comps/authority-select'
import { AuthorityDataType } from '../authority-mgt'

export type MenuType = {
  id?: string
  pageName?: string
  text?: string
  name?: string
  icon?: string
  status?: boolean
  parentId?: string
  children?: MenuType[]
  authorityList?: AuthorityDataType[]
}

const { getOpModel } = Base()
const { $api, $utils } = usePlugins()

const tree = ref<ElementUI.TreeInstance>()
const form = ref<ElementUI.FormInstance>()
const authSelect = ref<AuthoritySelectInstance>()

const op = ref(
  getOpModel<{ op: string; data: any }>({
    fn: ({ op, data }) => {
      if (op === 'save') return save(data)
      if (op === 'del') return del(data)
      if (op === 'move') return move(data)
    },
  }),
)
const menuData = ref<MenuType[]>([])
const editingData = ref<MenuType>()
const loadedData = reactive({
  pages: [],
})
const editDiaVisible = ref(false)
const currData = ref()
const currParent = ref()
const authData = ref({
  list: [],
  value: [],
})

const rules = {
  name: [{ required: true }],
  text: [{ required: true }],
}

const loadData = async () => {
  const rs = await $api.sysMenuQuery()
  menuData.value = rs.menuTree
  loadedData.pages = rs.pages
  return rs
}

function getNewMenuData() {
  let newData: MenuType = {
    id: null,
    pageName: '',
    name: '',
    text: '',
    icon: '',
    children: [],
    authorityList: [],
    status: true,
  }
  return newData
}

const addClick = (data?: MenuType) => {
  currParent.value = data
  editingData.value = getNewMenuData()
  currData.value = editingData.value
  editData()
}

const editClick = (data) => {
  editingData.value = { ...data }
  currData.value = data
  editData()
}

function editData() {
  authData.value.list = [
    ...editingData.value.authorityList.map((ele) =>
      AuthoritySelectModel.toTransferData(ele),
    ),
  ]
  authData.value.value = authData.value.list.map((ele) => ele.key)
  form.value?.resetFields()
  authSelect.value?.reset()
  editDiaVisible.value = true
}

function findInChild(data, node) {
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  return {
    index,
    children,
  }
}

const saveClick = () => {
  op.value.run({
    op: 'save',
    data: { data: editingData.value },
  })
}

const enableToggleClick = (data) => {
  currData.value = data
  op.value.run({
    op: 'save',
    data: { data: { id: data.id, status: !data.status } },
  })
}

async function save({ data }) {
  let authorityList = authData.value.list
    .filter((ele) => authData.value.value.includes(ele.key))
    .map((ele) => {
      return { id: ele.data.id }
    })
  data.authorityList = authorityList
  if (editDiaVisible.value) await $utils.validateForm(form.value)
  let { children, ...saveData } = data
  if (!currData.value.id) {
    let rs = await $api.sysMenuCreate({
      ...saveData,
      parentId: currParent.value?.id,
    })
    ;(currParent.value?.children || menuData.value).push({
      ...getNewMenuData(),
      ...rs,
    })
  } else {
    let rs = await $api.sysMenuUpdate(saveData)
    for (let key in rs) {
      currData.value[key] = rs[key]
    }
  }
  editDiaVisible.value = false
}

const delClick = async (data, node) => {
  try {
    await ElementUI.ElMessageBox.confirm(`确认删除?`)
    op.value.run({
      op: 'del',
      data: { data, node },
    })
  } catch (e) {
    //
  }
}

async function del({ data, node }) {
  let { children, index } = findInChild(data, node)
  await $api.sysMenuDelete({ id: data.id })
  children.splice(index, 1)
}

// op = moveUp | moveDown
const moveClick = (data, direction) => {
  op.value.run({
    op: 'move',
    data: { op: direction, id: data.id },
  })
}

async function move(data) {
  let rs = await $api.sysMenuMove(data)
  if (rs.update) loadData()
}
</script>

<style scoped lang="less">
.root {
  display: flex;
  flex-direction: column;
  > :nth-child(2) {
    flex-grow: 1;
    margin-left: 10px;
  }
}
.tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  height: auto;
  margin: 5px 0;
}
.disabled {
  color: #c1c1c1;
}

.break-line {
  width: 100%;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}
.op-box {
  margin: 0 20px;
}
</style>
