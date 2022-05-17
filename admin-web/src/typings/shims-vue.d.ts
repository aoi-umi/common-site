interface VueComponentOptions<Props = any> {
  key?: any
  ref?: any
  class?: any
  style?: { [key: string]: any } | string
  props?: Props
  slot?: string
  name?: string
  on?: any
  scopedSlots?: any
}
