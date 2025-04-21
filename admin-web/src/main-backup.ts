import { createApp } from 'vue'

import App from './App'
import { ElementUI } from './plugins/define'
import router from './router'
import { MainApi, MainMethod } from './api'
import { apiConfig } from './config'
import * as utils from './utils'
import eventBus from './utils/event-bus'
import './directive'

import './assets/styles'
import './components/styles'

ElementUI.ElDialog['props'].closeOnClickModal.default = false

const app = createApp(App).use(router).use(ElementUI.default, { size: 'small' })
app.mount('#app')

app.config.globalProperties.$utils = utils
app.config.globalProperties.$eventBus = eventBus
const mainApi = MainApi.create<MainMethod, MainApi>(new MainApi(apiConfig))
app.config.globalProperties.$api = mainApi

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: typeof mainApi
    $utils: typeof utils
    $eventBus: typeof eventBus
  }
}
