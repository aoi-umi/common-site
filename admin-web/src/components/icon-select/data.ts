import { elementIcons } from '@/plugins'

export const Icons = [...elementIcons].map((ele) =>
  ele.replace(/([a-zA-Z])([A-Z])/g, '$1-$2').toLowerCase(),
)
