import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './AppX'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')
