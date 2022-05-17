import { Watch } from 'vue-property-decorator'

import { Component, Vue, Prop } from '@/components/decorator'

import { InputBase, InputBaseProp } from '../input-base'
import { Select, Option } from '../ui'
import { Icons } from './data'
import styles from './index.module.less'

class IconProp extends InputBaseProp {}
@Component({
  extends: InputBase,
  props: IconProp,
})
export class IconSelect extends Vue<IconProp, InputBase> {
  render() {
    return (
      <Select
        v-model={this.currentValue}
        clearable
        filterable
        class={styles['select']}
      >
        <i
          slot="prefix"
          class={{
            [styles['prefix']]: true,
            [this.currentValue]: true,
          }}
          style="color: black"
        ></i>
        {Icons.map((ele) => {
          return (
            <Option value={ele} class={styles['item']}>
              <i
                class={{
                  [styles['item-icon']]: true,
                  [ele]: true,
                }}
              ></i>
              <span class={styles['item-text']}>{ele}</span>
            </Option>
          )
        })}
      </Select>
    )
  }
}
