import Vue from 'vue'
const vm = Vue.prototype as Vue
export const Confirm = function <T extends Vue>(
  message: string | ((this: T, fnArgs: any[]) => any),
  opt?: { title?: string },
) {
  return (target: T, key, descriptor: TypedPropertyDescriptor<any>) => {
    const value = descriptor.value
    descriptor.value = async function (...args) {
      let msg = (() => {
        return typeof message === 'function'
          ? message.apply(this, [args])
          : message
      })()
      let rs = await vm
        .$confirm(msg, {
          ...opt,
        })
        .catch(() => {
          return 'cancel'
        })
      if (rs === 'confirm') {
        return value.apply(this, args)
      }
    }
    return descriptor
  }
}
