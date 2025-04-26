import './style.less'
import './element-ui.less'

const clsPrefix = 'comp-'
export const cls = {
  mask: '',
  center: '',
  circle: '',
  wrap: '',
  dialog: '',
}
for (const key in cls) {
  cls[key] = clsPrefix + (cls[key] || key)
}
