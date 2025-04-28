import { ElMessageBox } from 'element-plus'

export const Confirm = function <T extends {}, Args extends readonly unknown[]>(
  message: string | ((this: T, ...fnArgs: readonly [...Args]) => any),
  opt?: { title?: string },
) {
  return (
    target: T,
    key,
    descriptor: TypedPropertyDescriptor<
      (...args: { [K in keyof Args]: Args[K] }) => any
    >,
  ) => {
    const value = descriptor.value
    descriptor.value = async function (...args) {
      let msg = (() => {
        return typeof message === 'function'
          ? message.apply(this, args)
          : message
      })()
      let rs = await ElMessageBox.confirm(msg, {
        ...opt,
      }).catch(() => {
        return 'cancel'
      })
      if (rs === 'confirm') {
        return value.apply(this, args)
      }
    }
    return descriptor
  }
}
