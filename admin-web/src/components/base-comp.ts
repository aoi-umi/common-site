import { Component, Vue } from './decorator'

@Component
export class BaseComp extends Vue {
  // 防抖
  protected debounce(fn: Function, delay = 500) {
    let timer = null
    return function (...args) {
      let _fn = () => {
        fn(...args)
      }
      if (timer) {
        clearTimeout(timer)
        timer = setTimeout(_fn, delay)
      } else {
        timer = setTimeout(_fn, delay)
      }
    }
  }
}
