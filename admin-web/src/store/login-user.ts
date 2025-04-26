import { ref } from 'vue'
import { defineStore } from 'pinia'

import { LoginUser, UserInfo } from '@/models/user'
import { currEnvCfg } from '@/config'
import { LocalStore } from './local-store'

export const useUserStore = defineStore('user', () => {
  const user = ref(LoginUser.create(null))
  const logining = ref(false)

  function setUser(data: UserInfo) {
    user.value = LoginUser.create(data)
    if (!data) {
      LocalStore.removeItem(currEnvCfg.authKey)
    } else {
      LocalStore.setItem(currEnvCfg.authKey, data.authToken)
    }
  }

  function setLogining(v: boolean) {
    logining.value = v
  }

  return {
    user,
    logining,
    setUser,
    setLogining,
  }
})
