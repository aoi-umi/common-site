import { App } from 'vue'
import { install as keyInput } from './key-input'

export default {
  install(app: App, options) {
    keyInput(app)
  },
}
