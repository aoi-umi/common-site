<template>
  <div v-loading="op.loading">
    <el-button @click="generateScriptClick">生成脚本</el-button>
    <el-button v-if="storeUser.user.isSysAdmin" @click="syncDataClick">
      同步数据
    </el-button>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { routes } from '@/router'
import Base from '@/views/base'
import { usePlugins } from '@/plugins'
import { ElMessageBox } from 'element-plus'

const { $api } = usePlugins()
const { getOpModel, storeUser } = Base()

const op = ref(
  getOpModel<{ op: string }>({
    fn: ({ op }) => {
      if (op === 'generateScript') return generateScript()
      if (op === 'syncData') return syncData()
    },
  }),
)

const generateScriptClick = () => {
  op.value.run({ op: 'generateScript' })
}

const syncDataClick = () => {
  op.value.run({ op: 'syncData' })
}

const generateScript = async () => {
  const pages = routes
    .map((ele) => ({
      path: ele.path,
      name: (ele.meta?.name || '') as string,
      text: ele.meta?.text || '',
    }))
    .filter((ele) => ele.name && !['error', 'signIn'].includes(ele.name))

  const rs = await $api.sysGenerateScript({ pages })
  const msg = rs.map((ele) => ele.filepath)

  const message = (
    <div>
      {msg.map((ele) => (
        <div>{ele}</div>
      ))}
    </div>
  )

  ElMessageBox.confirm('提示', {
    message,
  })
}

const syncData = async () => {
  await $api.sysSyncData()
}
</script>
