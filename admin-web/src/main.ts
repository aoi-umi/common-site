import { createApp } from 'vue'
import { createPinia } from 'pinia'

import plugins from './plugins'
import directive from './directive'

import App from './AppX.vue'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(plugins).use(directive)
app.mount('#app')
