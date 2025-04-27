<template>
  <div>
    <Load :loadFn="loadData">
      <template #default>
        <div>
          <div style="display: flex">
            <UserAvatar :user="data" />
            <el-button type="primary" link @click="updateClick">修改</el-button>
          </div>
          <div>
            <el-form>
              <el-form-item label="账号">
                {{ data.account }}
              </el-form-item>
              <el-form-item v-if="data.roleList" label="角色">
                <RoleTags :items="data.roleList" />
              </el-form-item>
              <el-form-item v-if="data.authorityList" label="权限">
                <Tags :items="data.authorityList" />
              </el-form-item>
              <el-form-item v-if="data.allAuthorityList" label="所有权限">
                <Tags :items="data.allAuthorityList" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
    </Load>
    <el-dialog
      :class="cls.dialog"
      append-to-body
      v-model="editDiaVisible"
      title="修改"
      width="800px"
    >
      <template v-if="editingData">
        <div v-loading="op.loading">
          <el-form ref="form" :model="editingData" label-position="top">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="editingData.nickname" />
            </el-form-item>
            <el-form-item prop="password">
              <template v-slot:label>
                <span>密码</span>
              </template>
              <el-input v-model="editingData.password" type="password" />
            </el-form-item>
            <el-form-item prop="password2">
              <template v-slot:label>
                <span>确认密码</span>
              </template>
              <el-input v-model="editingData.password2" type="password" />
            </el-form-item>
            <el-form-item prop="oldPassword">
              <template v-slot:label>
                <span>旧密码</span>
              </template>
              <el-input v-model="editingData.oldPassword" type="password" />
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { cls } from '@/components/styles'
import { Load, Tags } from '@/components'
import { OperateModel } from '@/utils'
import { usePlugins } from '@/plugins'

import { UserAvatar } from '../comps/user'
import { RoleTags } from '../comps/role-tags'
import { AdminUserDataType } from '../admin-user-mgt'

const { $api } = usePlugins()
const $route = useRoute()

const data = ref<AdminUserDataType>(null)
const editingData = ref<
  AdminUserDataType & {
    password: string
    password2: string
    oldPassword: string
  }
>(null)
const editDiaVisible = ref(false)

const op = ref(
  new OperateModel<{ op: string }>({
    fn: ({ op }) => {
      if (op === 'save') return save()
    },
  }),
)

const loadData = async () => {
  const rs = await $api.adminUserDetail(
    {},
    {
      params: { id: $route.params.id },
    },
  )
  data.value = rs
  return rs
}

const updateClick = () => {
  editingData.value = {
    ...data.value,
    password: '',
    password2: '',
    oldPassword: '',
  }
  editDiaVisible.value = true
}

const saveClick = () => {
  op.value.run({ op: 'save' })
}

const save = async () => {
  const updateData: any = {}
  ;['nickname'].forEach((key) => {
    if (editingData.value[key] !== data.value[key])
      updateData[key] = editingData.value[key]
  })
  const errors = []
  if (editingData.value.password) {
    if (editingData.value.password !== editingData.value.password2)
      errors.push('确认密码不一致')
    if (!editingData.value.oldPassword) errors.push('请输入旧密码')
    updateData.password = editingData.value.password
    updateData.oldPassword = editingData.value.oldPassword
  }
  if (errors.length) throw new Error(errors.join(';'))
  if (!Object.keys(updateData).length) {
    editDiaVisible.value = false
    return
  }
  await $api.adminUserUpdate(updateData)
  editDiaVisible.value = false
  loadData()
}
</script>
