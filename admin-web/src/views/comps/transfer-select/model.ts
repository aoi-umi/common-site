import TransferSelect from './transfer-select.vue'

export type TransferSelectInstance = InstanceType<typeof TransferSelect>
export type TransferData<T = any> = {
  key: string
  label: string
  disabled: boolean
  data: T
}

export type TransferQueryDataType<T = any> = {
  value: string
  data: T
}

export type TransferSelectDataType<T = any> = {
  list: T[]
  value: string[]
}
