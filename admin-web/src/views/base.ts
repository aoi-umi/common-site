import { RouteLocationRaw, useRouter } from 'vue-router'
import { useSettingStore, useUserStore } from '@/store'
import { OperateModel, OperateOption } from '@/utils'

export default function Base() {
  const router = useRouter()
  const storeUser = useUserStore()
  const storeSetting = useSettingStore()

  const getOpModel = <T>(opt: OperateOption) => {
    return new OperateModel<T>({
      defaultErrHandler: (e) => {
        if (e['statusCode'] === 401) {
          storeSetting.setSettings({
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
    getOpModel,
    gotoPage,
  }
}
