<template>
  <div class="root">
    <div class="form" v-key-input="{ key: 'enter', fn: signInClick }">
      <el-form ref="form" :rules="rules" :model="data" label-position="top">
        <el-form-item label="用户名" prop="account">
          <el-input v-model="data.account" size="default" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="data.password" type="password" size="default" />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="default"
        @click="signInClick"
        :loading="op.loading"
      >
        登录
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FormInstance } from 'element-plus'

import { usePlugins } from '@/plugins'
import { LoginUser } from '@/models/user'
import Base from '@/views/base'

const { storeUser, getOpModel } = Base()
const { $api, $eventBus, $utils } = usePlugins()

const op = ref(
  getOpModel<{ op: string }>({
    fn: ({ op }) => {
      return signIn()
    },
  }),
)

const form = ref<FormInstance>()
const data = ref({
  account: '',
  password: '',
})

const rules = ref({
  account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const signInClick = () => {
  op.value.run()
}

const signIn = async () => {
  try {
    storeUser.setLogining(true)
    await $utils.validateForm(form.value)

    const reqData = LoginUser.createToken({
      account: data.value.account,
      password: data.value.password,
    })

    const rs = await $api.adminUserSignIn(reqData)
    storeUser.setUser(rs)
    $eventBus.emit('signInSuccess')
  } finally {
    storeUser.setLogining(false)
  }
}
</script>

<style scoped lang="less">
.root {
  display: flex;
  justify-content: center;
  padding: 50px;
}
.main {
  width: 300px;
}
.form {
  display: flex;
  flex-direction: column;
}
</style>
