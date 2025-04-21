import { Component, Vue, Prop, toNative } from '@/components/decorator'

import { Button } from '../ui'

export type ButtonItem = {
  name?: string
  label?: string
  type?: string
  click?: (opt?: { item: ButtonItem }) => any
}

@Component
export class Buttons extends Vue {
  @Prop()
  defaultType?: string

  @Prop()
  items: ButtonItem[]

  render() {
    return (
      <div>
        {this.items.map((ele) => {
          return (
            <Button
              props={
                {
                  type: this.defaultType,
                  ...ele,
                } as any
              }
              on-click={() => {
                ele.click && ele.click({ item: ele })
              }}
            >
              {ele.label}
            </Button>
          )
        })}
      </div>
    )
  }
}

export default toNative(Buttons)
