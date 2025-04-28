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

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_API: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
