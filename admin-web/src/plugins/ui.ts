import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { App } from 'vue'

const icons = Object.entries(ElementPlusIconsVue).map(([key, component]) => {
  let name = `ElIcon${key}`
  return { key, name, component }
})
export const elementIcons = icons.map((ele) => ele.name)
export default {
  install(app: App, options) {
    app.use(ElementUI, { size: 'small' })
    for (const { name, component } of icons) {
      app.component(name, component)
    }
  },
}
