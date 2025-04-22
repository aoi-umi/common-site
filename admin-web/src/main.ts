import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { ElementUI } from './plugins/define'

import App from './AppX'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(ElementUI.default, { size: 'small' })
app.mount('#app')
