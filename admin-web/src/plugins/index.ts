import { App } from 'vue'
import ui from './ui'
export * from './ui'
import eventBus from './event-bus'
import { MainApi, MainMethod } from '@/api'
import { apiConfig } from '@/config'
import * as utils from '@/utils'

const mainApi = MainApi.create<MainMethod, MainApi>(new MainApi(apiConfig))
export default {
  install(app: App, options) {
    ui.install(app, options)
  },
}

export function usePlugins() {
  return {
    $api: mainApi,
    $utils: utils,
    $eventBus: eventBus,
  }
}
