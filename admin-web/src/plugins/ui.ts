import ElementUI, { ElDialog } from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { App } from 'vue'

const icons = Object.entries(ElementPlusIconsVue).map(([key, component]) => {
  let name = `ElIcon${key}`
  return { key, name, component }
})
export const elementIcons = icons.map((ele) => ele.name)
export default {
  install(app: App, options) {
    ElDialog.props.closeOnClickModal.default = false
    app.use(ElementUI, { locale: zhCn, size: 'small' })
    for (const { name, component } of icons) {
      app.component(name, component)
    }
  },
}
