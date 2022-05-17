import { Watch } from 'vue-property-decorator'

import { Component, Vue, Prop } from '@/components/decorator'

import { Button } from '../ui'

export type ButtonItem = {
  name?: string
  label?: string
  type?: string
  click?: (opt?: { item: ButtonItem }) => any
}

class ButtonsProp {
  @Prop()
  defaultType?: string

  @Prop()
  items: ButtonItem[]
}

@Component({
  props: ButtonsProp,
})
export class Buttons extends Vue<ButtonsProp> {
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
