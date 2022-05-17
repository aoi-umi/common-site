import Vue from 'vue'
import Vuex from 'vuex'
import { LoginUserStore } from './login-user'
import { SettingStore } from './setting'

export * from './local-store'
export * from './login-user'
export * from './setting'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: LoginUserStore,
    setting: SettingStore,
  },
})
