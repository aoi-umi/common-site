import { getCurrentInstance } from 'vue'
const vm = getCurrentInstance()?.proxy
export type OperateOption<T = any> = {
  prefix?: string
  fn: (args?: T) => any
  beforeValid?: (args?: T) => any
  onSuccessClose?: () => any
  validate?: (args?: T) => Promise<boolean> | boolean | void
  noValidMessage?: boolean
  noDefaultHandler?: boolean
  noSuccessHandler?: boolean
  noErrorHandler?: boolean
  throwError?: boolean
  defaultErrHandler?: (e: Error & { code?: string }) => boolean | void
}
export class OperateModel<T extends Object = {}> {
  loading = false
  protected opt: OperateOption<T>
  constructor(opt: OperateOption<T>) {
    this.opt = opt
  }

  private _promise
  async run(
    args?: T & {
      options?: Partial<OperateOption>
    },
  ) {
    if (this._promise) return this._promise
    this.loading = true
    this._promise = this._run(args)
    let rs = await this._promise
    this.loading = false
    this._promise = null
    return rs
  }
  private async _run(
    args?: T & {
      options?: Partial<OperateOption>
    },
  ) {
    const result = {
      success: true,
      msg: '',
      err: null,
      data: null,
    }
    this.loading = true
    args = {
      ...args,
    }
    let opt = {
      ...this.opt,
      ...args.options,
    }
    let operate = opt.prefix || ''
    try {
      opt.beforeValid && (await opt.beforeValid(args))
      if (opt.validate) {
        let valid = await opt.validate(args)
        if (!valid) {
          result.success = false
          result.msg = '参数有误'
          if (opt.throwError) throw new Error(result.msg)
          if (!this.opt.noValidMessage) {
            vm.$message.error(result.msg)
          }
          return result
        }
      }
      result.data = await opt.fn(args)
      if (!opt.noDefaultHandler && !opt.noSuccessHandler) {
        vm.$message.success({
          message: operate + '成功',
          onClose: opt.onSuccessClose,
        })
      }
    } catch (e) {
      if (opt.throwError) throw e
      result.success = false
      result.msg = e.message
      result.err = e
      if (!opt.noDefaultHandler && !opt.noErrorHandler) {
        let rs = opt.defaultErrHandler ? opt.defaultErrHandler(e) : true
        if (rs) {
          vm.$message.error(operate + '出错:' + e.message)
        }
      }
      if (!e.code) {
        console.error(e)
      }
    }
    return result
  }
}
