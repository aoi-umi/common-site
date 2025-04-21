import { Component, toNative, Vue } from 'vue-facing-decorator'

import { Base } from '@/views/base'
@Component
class App extends Base {
  render() {
    return <div>1234</div>
  }
}

export default toNative(App)
