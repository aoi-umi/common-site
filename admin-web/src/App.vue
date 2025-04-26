<template>
  <div>
    <div class="header">
      <div class="search">
        <el-button
          :icon="menuCollapse ? 'el-icon-expand' : 'el-icon-fold'"
          @click="menuCollapse = !menuCollapse"
        ></el-button>
        <el-popover trigger="focus" :visible-arrow="false">
          <template #reference>
            <el-input
              v-model="searchModel"
              prefix-icon="el-icon-search"
              @input="search"
              clearable
              placeholder="请输入"
            />
            <div>
              <el-menu class="search-menu">
                <el-menu-item
                  v-for="(ele, idx) in searchData"
                  :key="idx"
                  :index="`${idx}`"
                >
                  <el-icon>
                    <component :is="ele.icon || defaultIcon" />
                  </el-icon>
                  <span>{{ ele.text }}</span>
                </el-menu-item>
              </el-menu>
            </div>
          </template>
        </el-popover>
      </div>
      <div>
        <el-popover
          v-if="storeUser.user.isLogin"
          trigger="hover"
          :visible-arrow="false"
        >
          <template #reference>
            <!-- <UserAvatar :user="storeUser.user" /> -->
            <div class="user-menu">
              <el-button type="text">
                <router-link to="/adminUser/me">主页</router-link>
              </el-button>
              <el-button
                type="danger"
                @click="signOutClick"
                :loading="op.loading"
              >
                退出
              </el-button>
            </div></template
          >
        </el-popover>
        <el-button
          v-else
          type="primary"
          @click="showSignInClick"
          :loading="storeUser.logining"
        >
          登录
        </el-button>
      </div>
    </div>
    <div class="main">
      <el-menu class="menu" :collapse="menuCollapse">
        <template v-for="(ele, idx) in menu">
          <el-sub-menu
            v-if="ele.children?.length"
            :key="`sub-menu-${idx}`"
            :index="`${idx}`"
          >
            <template #title>
              <el-icon>
                <component :is="ele.icon || defaultIcon" />
              </el-icon>
              <span>{{ ele.text }}</span>
            </template>
            <el-menu-item
              v-for="(child, childIdx) in ele.children"
              :key="`${idx}-${childIdx}`"
              :index="`${idx}-${childIdx}`"
            >
              <el-icon>
                <component :is="child.icon || defaultIcon" />
              </el-icon>
              <span>{{ child.text }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :key="idx" :index="`${idx}`">
            <el-icon>
              <component :is="ele.icon || defaultIcon" />
            </el-icon>
            <span>{{ ele.text }}</span>
          </el-menu-item>
        </template>
      </el-menu>
      <div class="main-content">
        <router-view v-if="menuAuth.hasAuth" />
        <ErrorView v-else :title="menuAuth.message" />
        <el-backtop :target="`.main-content`" />
      </div>
    </div>
    <el-dialog v-model:visible="storeSetting.setting.signInShow" width="400px">
      <!-- <SignInComp /> -->
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { currEnvCfg } from '@/config'
import { routes } from '@/router'
import { usePlugins } from '@/plugins'
import { OperateModel } from '@/utils'

import Base from '@/views/base'
import ErrorView from '@/views/error'
import { MenuType } from '@/views/menu-mgt'
// import { SignInComp } from './views/sign-in'
// import { UserAvatar } from './views/comps/user'

type MainMenuType = MenuType & {
  path?: string
}

const route = useRoute()
const { $api, $utils, $eventBus } = usePlugins()
const { storeUser, storeSetting } = Base()

const menu = ref<MainMenuType[]>([])
const menuCollapse = ref(true)
const searchModel = ref('')
const searchData = ref<MainMenuType[]>([])
const op = ref(new OperateModel<{ op: string }>({ fn: () => {} }))
const defaultIcon = ref('el-icon-menu')

const menuAuth = computed(() => {
  const path = route.path
  const whiteList = ['/signIn', '/error']
  if (storeUser.user.isSysAdmin || whiteList.includes(path)) {
    return { hasAuth: true }
  }
  const menu = findCurrMenu({ nameOnly: true })
  if (!isDev.value && !menu) {
    return { hasAuth: false, message: 'Not Found' }
  }
  const authList = menu?.authorityList || []
  return {
    hasAuth: storeUser.user.hasAuth(authList.map((ele) => ele.name)),
  }
})

const isDev = computed(() => {
  return $utils.isLocal()
})

const init = async () => {
  op.value = new OperateModel({
    fn: ({ op }) => {
      if (op === 'signOut') return signOut()
    },
  })
  await loadData()
  search()
  storeUser.logining = true
  const user = await $api.adminUserInfo()
  setUser(user)
}

const loadData = async () => {
  try {
    const rs = await $api.adminMainData()
    menu.value = rs.menuTree
  } catch (e) {
    console.error(e)
  }
  if (isDev.value) {
    const all = routes.map((ele) => ({
      text: ele.meta?.text as string,
      path: ele.path,
    }))
    menu.value.push({
      text: '全部组件(admin)',
      children: all,
    })
  }
  setTitleByRoute()
}

const findCurrMenu = (opt?: { nameOnly?: boolean }) => {
  const name = route.query._name
  let path = route.path
  if (opt?.nameOnly) path = ''
  return findMenu(menu.value, { path, name })
}

const findMenu = (
  menu: MainMenuType[],
  opt: { name; path },
): MainMenuType | undefined => {
  for (const ele of menu) {
    const match =
      (opt.name && ele.name === opt.name) ||
      (!opt.name && opt.path === ele.path)
    if (match) return ele
    if (ele.children?.length) {
      const m = findMenu(ele.children, opt)
      if (m) return m
    }
  }
}

const setTitleByRoute = () => {
  const menu = findCurrMenu()
  $utils.setTitle(menu?.text || currEnvCfg.title)
}

const search = () => {
  const query = searchModel.value.trim().toLowerCase()
  searchData.value = searchMatchedMenu(query, menu.value)
}

const searchMatchedMenu = (query: string, data: MainMenuType[]) => {
  const matchData: MainMenuType[] = []
  data.forEach((ele) => {
    if (
      !query ||
      ele.path?.toLowerCase().includes(query) ||
      ele.name?.toLowerCase().includes(query) ||
      ele.text?.toLowerCase().includes(query)
    )
      matchData.push(ele)
    if (ele.children?.length) {
      const childData = searchMatchedMenu(query, ele.children)
      if (childData.length) matchData.push(...childData)
    }
  })
  return matchData
}

const showSignInClick = () => {
  storeSetting.setting.signInShow = true
}

const signOutClick = () => {
  op.value.run({ op: 'signOut' })
}

const signOut = async () => {
  await $api.adminUserSignOut()
  setUser(null)
  menu.value = []
  await loadData()
}

const setUser = (user: any) => {
  storeUser.user = user
}

onMounted(init)
</script>

<style scoped lang="less">
@headerHeight: 64px;
.header {
  position: fixed;
  height: @headerHeight;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 1;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  > * {
    display: flex;
    > * {
      margin-right: 5px;
    }
  }
}
.search > * {
  margin-right: 5px !important;
}
.main {
  width: 100%;
  top: @headerHeight;
  bottom: 0px;
  position: fixed;
  display: flex;
}
.menu {
  height: 100%;
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
.search-menu {
  width: 200px;
  max-height: 300px;
  border: 0px;
  overflow-y: auto;
}
.main-content {
  flex-grow: 1;
  padding: 10px 20px 0 20px;
  margin-bottom: 10px;
  overflow-y: auto;
}
.user-menu {
  display: flex;
  flex-direction: column;
  > * {
    margin: 5px 0 !important;
  }
}
</style>
