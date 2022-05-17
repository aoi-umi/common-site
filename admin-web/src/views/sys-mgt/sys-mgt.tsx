import { Component } from '@/components/decorator'
import { Base } from '@/views/base'
import { Button, Input } from '@/components'
import { routes } from '@/router'
import { OperateModel } from '@/utils'

@Component
export class SysMgt extends Base {
  text = ''
  op: OperateModel<{ op: string }>
  created() {
    this.op = this.getOpModel({
      fn: ({ op }) => {
        if (op === 'generateScript') return this.generateScript()
        if (op === 'syncData') return this.syncData()
      },
    })
  }

  generateScriptClick() {
    this.op.run({ op: 'generateScript' })
  }
  syncDataClick() {
    this.op.run({ op: 'syncData' })
  }

  async generateScript() {
    let pages = routes
      .map((ele) => {
        return {
          path: ele.path,
          name: ele.meta?.name || '',
          text: ele.meta?.text || '',
        }
      })
      .filter((ele) => ele.name && !['error', 'signIn'].includes(ele.name))
    let rs = await this.$api.sysGenerateScript({
      pages,
    })
    let msg = []
    for (let ele of rs) {
      msg.push(ele.filepath)
    }
    let message = (
      <div>
        {msg.map((ele) => {
          return <div>{ele}</div>
        })}
      </div>
    )
    this.$confirm('提示', {
      message,
    })
  }

  async syncData() {
    let rs = await this.$api.sysSyncData()
  }

  render() {
    return (
      <div v-loading={this.op.loading}>
        <Button on-click={this.generateScriptClick}>生成脚本</Button>
        {this.storeUser.user.isSysAdmin && (
          <Button on-click={this.syncDataClick}>同步数据</Button>
        )}
      </div>
    )
  }
}
