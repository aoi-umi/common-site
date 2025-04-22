import { Component } from 'vue-facing-decorator'

import { Base } from '@/views/base'
import { Buttons } from '@/components'
@Component
export default class App extends Base {
  render() {
    return (
      <Buttons
        items={[
          {
            name: 'query',
            label: '查询',
            type: 'primary',
            click: () => {
              console.log(111111)
            },
          },
        ]}
      ></Buttons>
    )
  }
}
