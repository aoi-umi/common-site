import { defineStore } from 'pinia'

import { LoginUserType, LoginUser } from '@/models/user'
import { env } from '@/config'
import { LocalStore } from './local-store'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: LoginUser.create(null) as LoginUserType,
    logining: false,
  }),
  getters: {},
  actions: {
    setUser(user) {
      this.user = LoginUser.create(user)
      if (!user) {
        LocalStore.removeItem(env.authKey)
      }
    },
    setLogining(v) {
      this.logining = v
    },
  },
})
