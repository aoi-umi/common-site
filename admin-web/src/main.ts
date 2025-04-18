import Vue from 'vue'

import App from './App'
import { ElementUI } from './plugins/define'
import router from './router'
import store from './store'
import { MainApi, MainMethod } from './api'
import { apiConfig } from './config'
import * as utils from './utils'
import eventBus from './utils/event-bus'
import './directive'

import './assets/styles'
import './components/styles'

Vue.config.productionTip = false
ElementUI.Dialog['props'].closeOnClickModal.default = false

const mainApi = (Vue.prototype.$api = MainApi.create<MainMethod, MainApi>(
  new MainApi(apiConfig),
))

Vue.prototype.$utils = utils
Vue.prototype.$eventBus = eventBus
declare module 'vue/types/vue' {
  interface Vue {
    $api: typeof mainApi
    $utils: typeof utils
    $eventBus: typeof eventBus
  }
}
Vue.use(ElementUI, { size: 'mini' })
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
