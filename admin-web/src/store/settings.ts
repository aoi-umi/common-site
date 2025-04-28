import { defineStore } from 'pinia'
import { ref } from 'vue'

type SettingType = {
  signInShow: boolean
}

export const useSettingStore = defineStore('settings', () => {
  const settings = ref({
    signInShow: false,
  })

  function setSettings(data: Partial<SettingType>) {
    settings.value = {
      ...settings.value,
      ...data,
    }
  }

  return {
    settings,
    setSettings,
  }
})
