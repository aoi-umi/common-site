import ElementUI from 'element-ui'

import { Button, Form, FormItem, Input } from '@/components'
import { Component, Prop, Vue } from '@/components/decorator'
import { OperateModel } from '@/utils'
import { Base } from '@/views/base'
import { LoginUser } from '@/models/user'

import styles from './index.module.less'

@Component
export class SignIn extends Base {
  render() {
    return (
      <div class={styles['root']}>
        <SignInComp class={styles['main']}></SignInComp>
      </div>
    )
  }
}

export class SignInCompProp {
  @Prop()
  title?: string
}
@Component({
  props: SignInCompProp,
  extends: Base,
})
export class SignInComp extends Vue<SignInCompProp, Base> {
  $refs: { form: ElementUI.Form }
  op: OperateModel<{ op: string }>
  created() {
    this.op = this.getOpModel({
      fn: ({ op }) => {
        return this.signIn()
      },
    })
  }

  signInClick() {
    this.storeUser.setLogining(true)
    this.op.run()
  }

  async signIn() {
    let valid = await this.$utils.validateForm(this.$refs.form)
    let data = {
      account: this.data.account,
      password: this.data.password,
    }

    let reqData = LoginUser.createToken(data)
    let rs = await this.$api.adminUserSignIn(reqData)
    this.setUser(rs)
    this.$emit('success')
  }

  data = {
    account: '',
    password: '',
  }

  rules = {
    account: [{ required: true }],
    password: [{ required: true }],
  }

  render() {
    return (
      <div
        class={styles['form']}
        v-key-input={{ key: 'enter', fn: this.signInClick }}
      >
        <Form
          ref="form"
          rules={this.rules}
          props={{ model: this.data }}
          labelPosition="top"
        >
          <FormItem label="用户名" prop="account">
            <Input v-model={this.data.account} size="medium"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input
              v-model={this.data.password}
              type={'password' as any}
              size="medium"
            ></Input>
          </FormItem>
        </Form>
        <Button
          type="primary"
          size="medium"
          on-click={this.signInClick}
          v-loading={this.op.loading}
        >
          登录
        </Button>
      </div>
    )
  }
}
