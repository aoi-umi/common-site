import { Component, Confirm } from '@/components/decorator'
import { Base } from '@/views/base'
import { Load, Form, FormItem, Tags, Button, Dialog, Input } from '@/components'
import { cls } from '@/components/styles'
import { OperateModel } from '@/utils'

import { UserAvatar } from '../user'
import { AdminUserDataType } from '../admin-user-mgt'
import { RoleTags } from '../comps/role-tags'

@Component
export class AdminUserDetail extends Base {
  $refs: {}

  data: AdminUserDataType = null
  editingData: AdminUserDataType & {
    password: string
    password2: string
    oldPassword: string
  } = null
  op: OperateModel<{ op: string; data?: any }> = null
  created() {
    this.op = this.getOpModel({
      fn: ({ op }) => {
        if (op === 'save') return this.save()
      },
    })
  }
  async loadData() {
    let rs = await this.$api.adminUserDetail(
      {},
      {
        params: { id: this.$route.params.id },
      },
    )
    this.data = rs
    return rs
  }

  editDiaVisible = false
  updateClick() {
    this.editingData = {
      ...this.data,
      password: '',
      password2: '',
      oldPassword: '',
    }
    this.editDiaVisible = true
  }

  saveClick() {
    this.op.run({ op: 'save' })
  }

  async save() {
    let updateData: any = {}
    ;['nickname'].forEach((key) => {
      if (this.editingData[key] !== this.data[key])
        updateData[key] = this.editingData[key]
    })
    let errors = []
    if (this.editingData.password) {
      if (this.editingData.password !== this.editingData.password2)
        errors.push('确认密码不一致')
      if (!this.editingData.oldPassword) errors.push('请输入旧密码')
      updateData.password = this.editingData.password
      updateData.oldPassword = this.editingData.oldPassword
    }
    if (errors.length) throw new Error(errors.join(';'))
    if (!Object.keys(updateData).length) {
      this.editDiaVisible = false
      return
    }
    await this.$api.adminUserUpdate(updateData)
    this.editDiaVisible = false
    this.loadData()
  }

  renderFn() {
    return (
      <div>
        <div style="display: flex">
          <UserAvatar user={this.data}></UserAvatar>
          <Button type="text" on-click={this.updateClick}>
            修改
          </Button>
        </div>
        <div>
          <Form>
            {this.data.roleList && (
              <FormItem label="角色">
                <RoleTags items={this.data.roleList}></RoleTags>
              </FormItem>
            )}
            {this.data.authorityList && (
              <FormItem label="权限">
                <Tags items={this.data.authorityList}></Tags>
              </FormItem>
            )}
            {this.data.allAuthorityList && (
              <FormItem label="所有权限">
                <Tags items={this.data.allAuthorityList}></Tags>
              </FormItem>
            )}
          </Form>
        </div>
      </div>
    )
  }

  renderForm() {
    return (
      <div v-loading={this.op.loading}>
        <Form
          ref="form"
          props={{ model: this.editingData }}
          labelPosition="top"
        >
          <FormItem label="昵称" prop="nickname">
            <Input v-model={this.editingData.nickname} />
          </FormItem>
          <FormItem prop="password">
            <span slot="label">密码</span>
            <Input
              v-model={this.editingData.password}
              type={'password' as any}
            />
          </FormItem>
          <FormItem prop="password2">
            <span slot="label">确认密码</span>
            <Input
              v-model={this.editingData.password2}
              type={'password' as any}
            />
          </FormItem>
          <FormItem prop="oldPassword">
            <span slot="label">旧密码</span>
            <Input
              v-model={this.editingData.oldPassword}
              type={'password' as any}
            />
          </FormItem>
        </Form>
      </div>
    )
  }
  render() {
    return (
      <div>
        <Load loadFn={this.loadData} renderFn={this.renderFn}></Load>
        <Dialog
          class={cls.dialog}
          appendToBody
          visible={this.editDiaVisible}
          on={{ 'update:visible': (v) => (this.editDiaVisible = v) }}
          title={'修改'}
          width="800px"
        >
          {this.editingData && this.renderForm()}
          <div slot="footer">
            <Button on-click={this.saveClick}>保存</Button>
          </div>
        </Dialog>
      </div>
    )
  }
}
