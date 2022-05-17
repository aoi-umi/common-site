import Vue from 'vue'

const object = {}
Vue.directive('key-input', {
  bind: (el: HTMLElement, binding, vnode) => {
    let key = el as any
    object[key] = (e) => {
      let { key, fn } = binding.value
      if (!fn) return
      if (key) {
        let pressCode = -1
        if (key === 'enter') pressCode = 13
        let code = e && (e.charCode || e.keyCode)
        if (pressCode !== code) return
      }
      fn()
    }
    el.addEventListener('keypress', object[key])
  },
  unbind: (el) => {
    let key = el as any
    delete object[key]
    el.removeEventListener('keypress', object[key])
  },
})
