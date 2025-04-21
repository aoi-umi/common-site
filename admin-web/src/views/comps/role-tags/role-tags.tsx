import { Watch } from 'vue-facing-decorator'

import { Component, Vue, Prop } from '@/components/decorator'
import { Base } from '@/views/base'
import { RoleDataType } from '@/views/role-mgt'
import { Popover, Tags } from '@/components'

class RoleTagsProp {
  @Prop()
  items: RoleDataType[]
}

@Component({
  props: RoleTagsProp,
  extends: Base,
})
export class RoleTags extends Vue<RoleTagsProp, Base> {
  render() {
    return (
      <div>
        {this.items.map((ele) => {
          return (
            <Popover trigger="hover" disabled={!ele.authorityList.length}>
              <Tags items={[ele]} slot="reference"></Tags>
              <Tags items={ele.authorityList}></Tags>
            </Popover>
          )
        })}
      </div>
    )
  }
}
