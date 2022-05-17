import { Prop, Component, Vue } from '@/components/decorator'

import { Button, Row, Col, Dialog } from '../ui'
import { BaseComp } from '../base-comp'
import styles from './index.module.less'

type BtnType = {
  text: string
  type?: string
  loading?: boolean
  onClick?: (ele: BtnType, idx: number) => any
}

export class ConfirmDialogProp {
  @Prop()
  title?: string

  @Prop({ default: false })
  loading?: boolean

  @Prop()
  btnList?: BtnType[]

  @Prop()
  ok?: (ele: BtnType) => any | Promise<any>

  @Prop()
  cancel?: (ele: BtnType) => void
}

@Component({
  extends: BaseComp,
  props: ConfirmDialogProp,
})
export class ConfirmDialog extends Vue<ConfirmDialogProp, BaseComp> {
  show = false
  toggle(show?: boolean) {
    this.show = typeof show === 'boolean' ? show : !this.show
  }

  private get innerBtnList() {
    return (
      this.btnList || [
        {
          text: '取消',
          onClick: (e) => {
            this.cancel && this.cancel(e)
            this.toggle()
          },
        },
        {
          text: '确认',
          type: 'primary',
          onClick: async (e, idx) => {
            if (this.ok) {
              if (this.loading) {
                e.loading = true
                this.$forceUpdate()
              }
              await this.ok(e)
              if (this.loading) {
                e.loading = false
                this.$forceUpdate()
              }
            }
            this.toggle()
          },
        },
      ]
    )
  }

  renderBtn() {
    const btnList = this.innerBtnList

    return (
      <Row gutter={5} type="flex" justify="end">
        {btnList.map((ele, idx) => {
          if (!ele.loading) {
            ele.loading = false
          }
          return (
            <Button
              type={ele.type as any}
              on-click={() => {
                ele.onClick && ele.onClick(ele, idx)
              }}
              loading={ele.loading}
            >
              {ele.text}
            </Button>
          )
        })}
      </Row>
    )
  }

  render() {
    return (
      <Dialog
        visible={this.show}
        title={this.title}
        appendToBody
        on={{
          'update:visible': (newVal) => (this.show = newVal),
        }}
      >
        {this.$slots.default}
        {this.renderBtn()}
      </Dialog>
    )
  }
}
