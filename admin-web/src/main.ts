import { createApp } from 'vue'
import { createPinia } from 'pinia'

import plugins from '@/plugins'
import directive from '@/directive'
import router from '@/router'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(plugins).use(directive).use(router)
app.mount('#app')
