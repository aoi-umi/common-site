import { defineStore } from 'pinia'

type SettingType = {
  signInShow: boolean
}

export const useSettingStore = defineStore('setting', {
  state: () => ({ setting: { signInShow: false } as SettingType }),
  getters: {},
  actions: {
    setSetting(setting: Partial<SettingType>) {
      this.setting = {
        ...this.setting,
        ...setting,
      }
    },
  },
})
