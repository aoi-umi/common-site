import { Component, Prop } from '@/components/decorator'
import { Base } from '@/views/base'
import { Button, Input, Avatar, Popover } from '@/components'
import { OperateModel } from '@/utils'
import { UserInfo } from '@/models/user'

import styles from './avatar.module.less'

@Component
export class UserAvatar extends Base {
  @Prop()
  user: UserInfo

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
