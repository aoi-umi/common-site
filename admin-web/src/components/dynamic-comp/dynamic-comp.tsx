import { Component, Vue, Prop } from '@/components/decorator'

import { InputBase, InputBaseProp } from '../input-base'
import { Input, Option, Select } from '../ui'
import styles from './index.module.less'

class DynamicCompProp extends InputBaseProp {
  @Prop()
  type: string

  @Prop()
  compProps?: any

  @Prop()
  compData?: any
}

@Component({
  extends: InputBase,
  props: DynamicCompProp,
})
export class DynamicComp extends Vue<DynamicCompProp, InputBase> {
  render() {
    return <div class={styles.root}>{this.renderComp()}</div>
  }
  renderComp() {
    if (this.type === 'input')
      return (
        <Input
          v-model={this.currentValue}
          props={this.compProps}
          placeholder={this.compProps?.placeholder}
        ></Input>
      )
    if (this.type === 'select') {
      return (
        <Select v-model={this.currentValue} props={this.compProps}>
          {this.compData?.map((ele) => {
            return <Option props={ele}></Option>
          })}
        </Select>
      )
    }
    return this.currentValue
  }
}
