import { RouteLocationRaw, useRouter } from 'vue-router'
import { UserInfo } from '@/models/user'
import { LocalStore, useSettingStore, useUserStore } from '@/store'
import { env } from '@/config'
import { OperateModel, OperateOption } from '@/utils'

export default function Base() {
  const router = useRouter()
  const storeUser = useUserStore()
  const storeSetting = useSettingStore()

  const setUser = (userInfo: UserInfo) => {
    storeUser.setLogining(false)
    if (userInfo) {
      const token = userInfo.authToken
      LocalStore.setItem(env.authKey, token)
    }
    storeUser.setUser(userInfo)
  }

  const getOpModel = (opt: OperateOption) => {
    return new OperateModel({
      defaultErrHandler: (e) => {
        if (e['statusCode'] === 401) {
          storeSetting.setSetting({
            signInShow: true,
          })
        }
        return true
      },
      ...opt,
    })
  }

  const gotoPage = (
    location: RouteLocationRaw,
    opt?: {
      mouseButton?: number
    },
  ) => {
    opt = {
      ...opt,
    }
    if (opt.mouseButton === 1) {
      window.open(router.resolve(location).href, '_blank')
      return
    }
    router.push(location)
  }

  return {
    storeUser,
    storeSetting,
    setUser,
    getOpModel,
    gotoPage,
  }
}
