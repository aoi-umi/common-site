import { Watch } from 'vue-facing-decorator'

import { Component, Vue, Prop } from '@/components/decorator'
import { Base } from '@/views/base'

import { Tag } from '..'
import styles from './index.module.less'

export type TagItem = {
  name?: string
  text?: string
  status?: boolean
}

class TagsProp {
  @Prop()
  items: TagItem[]
}

@Component({
  props: TagsProp,
  extends: Base,
})
export class Tags extends Vue<TagsProp, Base> {
  render() {
    return (
      <div class={styles['box']}>
        {this.items.map((ele) => (
          <Tag type={!ele.status ? 'info' : 'primary'} disableTransitions>
            {ele.text}
          </Tag>
        ))}
      </div>
    )
  }
}
