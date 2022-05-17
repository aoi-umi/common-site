import { Component, Prop, Vue } from '@/components/decorator'
import { Base } from '@/views/base'
import { Button, Input, Avatar, Popover } from '@/components'
import { OperateModel } from '@/utils'
import { UserInfo } from '@/models/user'

import styles from './avatar.module.less'

class UserAvatarProp {
  @Prop()
  user: UserInfo
}

@Component({
  extends: Base,
  props: UserAvatarProp,
})
export class UserAvatar extends Vue<UserAvatarProp, Base> {
  op: OperateModel<{ op: string }>
  created() {
    this.op = this.getOpModel({
      fn: () => {},
    })
  }
  render() {
    return (
      <div class={styles['root']}>
        <Popover trigger="hover" visibleArrow={false} disabled>
          <Avatar
            slot="reference"
            class={styles['icon']}
            icon="el-icon-user-solid"
            src={this.user.avatarUrl}
          ></Avatar>
        </Popover>
        <span>{this.user.nickname}</span>
      </div>
    )
  }
}
