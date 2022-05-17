import { getModule } from 'vuex-module-decorators'
import { RawLocation } from 'vue-router'

import { BaseComp } from '@/components/base-comp'
import { Component } from '@/components/decorator'
import { UserInfo } from '@/models/user'
import { LocalStore, SettingStore, LoginUserStore } from '@/store'
import { env } from '@/config'
import { OperateModel, OperateOption } from '@/utils'

@Component
export class Base extends BaseComp {
  get storeUser() {
    return getModule(LoginUserStore, this.$store)
  }
  get storeSetting() {
    return getModule(SettingStore, this.$store)
  }

  setUser(userInfo: UserInfo) {
    this.storeUser.setLogining(false)
    if (userInfo) {
      const token = userInfo.authToken
      LocalStore.setItem(env.authKey, token)
    }
    this.storeUser.setUser(userInfo)
  }

  getOpModel(opt: OperateOption) {
    return new OperateModel({
      defaultErrHandler: (e) => {
        if (e['statusCode'] === 401)
          this.storeSetting.setSetting({
            signInShow: true,
          })
        return true
      },
      ...opt,
    })
  }

  gotoPage(
    location: RawLocation,
    opt?: {
      mouseButton?: number
    },
  ) {
    opt = {
      ...opt,
    }
    if (opt.mouseButton === 1) {
      this.$utils.openWindow(location, '_blank')
      return
    }
    this.$router.push(location)
  }
}
