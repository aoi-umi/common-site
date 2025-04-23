import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { App } from 'vue'

export const elementIcons = Object.keys(ElementPlusIconsVue)
export default {
  install(app: App, options) {
    app.use(ElementUI, { size: 'small' })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
