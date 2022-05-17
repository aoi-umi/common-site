import { Watch } from 'vue-property-decorator'

import { Component, Vue, Prop } from '@/components/decorator'

import { Button, Card } from '../ui'
import { BaseComp } from '../base-comp'
import styles from './index.module.less'

class LoadProp {
  @Prop()
  loadFn: () => Promise<any> | any

  @Prop()
  afterLoad?: () => Promise<any> | any

  @Prop()
  renderFn: (data: any) => any

  @Prop()
  width?: number

  @Prop({
    default: 200,
  })
  height?: number

  @Prop()
  notLoadOnMounted?: boolean

  @Prop()
  errMsgFn?: (e) => string

  @Prop()
  outLoading?: boolean
}
@Component({
  extends: BaseComp,
  props: LoadProp,
})
export class Load extends Vue<LoadProp, BaseComp> {
  loading = false
  result = {
    success: false,
    msg: '准备加载',
    data: null,
  }

  protected mounted() {
    if (!this.notLoadOnMounted) {
      this.loadData()
    }
  }

  async loadData() {
    this.loading = true
    try {
      this.result.data = await this.loadFn()
      this.result.success = true
      this.afterLoad && (await this.afterLoad())
    } catch (e) {
      console.error(e)
      this.result.success = false
      this.result.msg = (this.errMsgFn && this.errMsgFn(e)) || e.message
    } finally {
      this.loading = false
    }
  }

  protected render() {
    if (!this.result.success) {
      return (
        <div class={styles['root']}>
          <Card
            class={styles['card']}
            v-loading={this.loading}
            style={{
              height: this.height ? this.height + 'px' : null,
              width: this.width ? this.width + 'px' : null,
            }}
          >
            {!this.loading && (
              <div class={styles['content']}>
                {this.result.msg}
                <Button class={styles['retry-btn']} on-click={this.loadData}>
                  重试
                </Button>
              </div>
            )}
          </Card>
        </div>
      )
    }

    return (
      <div v-loading={this.outLoading}>{this.renderFn(this.result.data)}</div>
    )
  }
}
