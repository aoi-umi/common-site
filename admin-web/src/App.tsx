import { Component } from '@/components/decorator'
import { Base } from '@/views/base'
import { Watch } from 'vue-property-decorator'

import {
  Button,
  Menu,
  Submenu,
  Backtop,
  MenuItem,
  Input,
  Popover,
  Dialog,
} from './components'
import { currEnvCfg } from './config'
import { routes } from './router'
import { OperateModel } from './utils'
import ErrorView from './views/error'
import { MenuType } from './views/menu-mgt'
import { SignInComp } from './views/sign-in'
import { UserAvatar } from './views/user'

import styles from './App.module.less'

type MainMenuType = MenuType & {
  path?: string
}
@Component
export default class App extends Base {
  menu: MainMenuType[] = []
  op: OperateModel<{ op: string }>
  created() {
    this.init()
  }
  async init() {
    this.op = this.getOpModel({
      fn: ({ op }) => {
        if (op === 'signOut') return this.signOut()
      },
    })
    await this.loadData()
    this.search()
    this.storeUser.setLogining(true)
    let user = await this.$api.adminUserInfo()
    this.setUser(user)
    this.$eventBus.$on('signInSuccess', () => {
      this.signInSuccess()
    })
  }

  private get isDev() {
    return this.$utils.isLocal()
  }
  async loadData() {
    let rs = await this.$api.adminMainData()
    this.menu = rs.menuTree
    if (this.isDev) {
      let all = routes.map((ele) => {
        return {
          text: ele.meta?.text,
          path: ele.path,
        }
      })
      this.menu.push({
        text: '全部组件(admin)',
        children: all,
      })
    }
    this.setTitleByRoute()
  }

  @Watch('$route')
  private watchRoute(newVal) {
    this.setTitleByRoute()
  }

  findCurrMenu(opt?: { nameOnly?: boolean }) {
    let route = this.$route
    let name = route.query._name
    let path = route.path
    if (opt?.nameOnly) path = ''
    let menu = this.findMenu(this.menu, { path, name })
    return menu
  }
  setTitleByRoute() {
    let menu = this.findCurrMenu()
    this.$utils.setTitle(menu?.text || currEnvCfg.title)
  }
  private findMenu(menu: MainMenuType[], opt: { name; path }): MainMenuType {
    for (let ele of menu) {
      let match =
        (opt.name && ele.name === opt.name) ||
        (!opt.name && opt.path === ele.path)
      if (match) return ele
      if (ele.children?.length) {
        let m = this.findMenu(ele.children, opt)
        if (m) return m
      }
    }
  }
  searchModel = ''
  searchData = []
  search() {
    let query = this.searchModel.trim().toLowerCase()
    this.searchData = this.searchMatchedMenu(query, this.menu)
  }

  private searchMatchedMenu(query: string, data: MainMenuType[]) {
    let matchData = []

    data.forEach((ele) => {
      if (
        !query ||
        ele.path?.toLowerCase().includes(query) ||
        ele.name?.toLowerCase().includes(query) ||
        ele.text?.toLowerCase().includes(query)
      )
        matchData.push(ele)
      if (ele.children?.length) {
        let childData = this.searchMatchedMenu(query, ele.children)
        if (childData.length) matchData.push(...childData)
      }
    })
    return matchData
  }

  showSignInClick() {
    this.storeSetting.setSetting({
      signInShow: true,
    })
  }
  async signInSuccess() {
    this.storeSetting.setSetting({
      signInShow: false,
    })
    await this.loadData()
  }

  signOutClick() {
    this.op.run({ op: 'signOut' })
  }
  async signOut() {
    await this.$api.adminUserSignOut()
    this.setUser(null)
    this.menu = []
    await this.loadData()
  }
  renderHeader() {
    return (
      <div class={styles['header']}>
        <div class={styles['search']}>
          <Button
            icon={this.menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'}
            on-click={() => {
              this.menuCollapse = !this.menuCollapse
            }}
          ></Button>
          <Popover trigger="focus" visibleArrow={false}>
            <Input
              slot="reference"
              v-model={this.searchModel}
              prefixIcon="el-icon-search"
              on-input={this.search}
              clearable
              placeholder="请输入"
            ></Input>
            <div>
              <Menu class={styles['search-menu']}>
                {this.searchData.map((ele, idx) => {
                  return this.renderMenuItem(ele, { prefix: `${idx}` })
                })}
              </Menu>
            </div>
          </Popover>
        </div>
        <div>
          {this.storeUser.user.isLogin ? (
            <Popover trigger="hover" visibleArrow={false}>
              <UserAvatar
                user={this.storeUser.user}
                slot="reference"
              ></UserAvatar>
              <div class={styles['user-menu']}>
                <Button type="text">
                  <router-link
                    to={{
                      path: '/adminUser/me',
                    }}
                  >
                    主页
                  </router-link>
                </Button>
                <Button
                  type="danger"
                  on-click={this.signOutClick}
                  loading={this.op.loading}
                >
                  退出
                </Button>
              </div>
            </Popover>
          ) : (
            <Button
              type="primary"
              on-click={this.showSignInClick}
              loading={this.storeUser.logining}
            >
              登录
            </Button>
          )}
        </div>
      </div>
    )
  }
  menuCollapse = true
  renderMenu() {
    return (
      <Menu class={styles['menu']} collapse={this.menuCollapse}>
        {this.menu.map((ele, idx) => {
          return this.renderMenuItem(ele, { prefix: `${idx}` })
        })}
      </Menu>
    )
  }
  renderMenuItem(ele: MainMenuType, opt?: { prefix?: string }) {
    opt = {
      ...opt,
    }
    let prefix = opt.prefix || ''
    let icon = ele.icon || 'el-icon-menu'
    if (ele.children?.length) {
      return (
        <Submenu index={prefix}>
          <template slot="title">
            <i class={icon}></i>
            <span slot="title">{ele.text}</span>
          </template>
          {ele.children.map((child, idx) =>
            this.renderMenuItem(child, { prefix: `${prefix}-${idx}` }),
          )}
        </Submenu>
      )
    }

    const item = (
      <MenuItem index={prefix}>
        <i class={icon}></i>
        <span slot="title">{ele.text}</span>
      </MenuItem>
    )
    if (!ele.path) {
      return (
        <div
          on-click={() => {
            this.$confirm('未设置')
          }}
        >
          {item}
        </div>
      )
    }
    return (
      <router-link
        to={{
          path: ele.path,
          query: { _name: ele.name },
        }}
      >
        {item}
      </router-link>
    )
  }

  get menuAuth(): { hasAuth: boolean; message?: string } {
    let path = this.$route.path
    let whiteList = ['/signIn', '/error']
    if (this.storeUser.user.isSysAdmin || whiteList.includes(path)) {
      return {
        hasAuth: true,
      }
    }
    let menu = this.findCurrMenu({ nameOnly: true })
    if (!this.isDev && !menu) {
      return {
        hasAuth: false,
        message: 'Not Found',
      }
    }
    let authList = menu?.authorityList || []
    return {
      hasAuth: this.storeUser.user.hasAuth(authList.map((ele) => ele.name)),
    }
  }

  renderMainConetnt() {
    return (
      <div class={styles['main-content']}>
        {this.menuAuth.hasAuth ? (
          <router-view></router-view>
        ) : (
          <ErrorView title={this.menuAuth.message}></ErrorView>
        )}
        <Backtop target={`.${styles['main-content']}`}></Backtop>
      </div>
    )
  }
  render() {
    return (
      <div>
        {this.renderHeader()}
        <div class={styles['main']}>
          {this.renderMenu()}
          {this.renderMainConetnt()}
        </div>
        <Dialog
          visible={this.storeSetting.setting.signInShow}
          on={{
            'update:visible': (v) => {
              this.storeSetting.setSetting({
                signInShow: v,
              })
            },
          }}
          width="400px"
        >
          <SignInComp />
        </Dialog>
      </div>
    )
  }
}
